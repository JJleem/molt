# 영상 배경 → 흰색/투명 만들기 (마스코트 ping.mp4 작업 기록)

회색(또는 단색 그라데이션) 배경의 짧은 영상에서 **배경만 흰색/투명으로 바꾸는** 방법.
`public/ping.webm`(투명) · `public/ping-white.mp4`(흰 배경)를 이 방법으로 만들었다.

---

## 핵심 결론 (먼저 읽기)

- **캐릭터에 반짝이·색종이·글로우 같은 "이펙트"가 있으면 → 방법 B(차이 키잉)** 를 써라.
  AI 배경제거(rembg)는 이 이펙트를 **배경으로 보고 지워버린다.** (실제로 이것 때문에 처음에 다 실패함)
- **이펙트 없는 또렷한 피사체면 → 방법 A(rembg)** 가 더 간단하고 가장자리가 깔끔하다.
- 둘 다 **프레임 추출 → 프레임별 처리 → 다시 인코딩** 순서다.

---

## 필요 도구

- **ffmpeg / ffprobe** — 이 PC는 Windows 빌드 사용:
  `/mnt/c/ffmpeg-*/bin/ffmpeg.exe` (WSL에서 `.exe`로 호출). `which ffmpeg.exe`로 경로 확인.
- **Python 라이브러리** (이미 설치됨): `rembg`, `scipy`, `numpy`, `Pillow`, `onnxruntime`
- 작업은 임시 폴더에서 하고 끝나면 지운다. 결과물만 `public/`로 옮긴다.

> ⚠️ Windows ffmpeg는 WSL 경로(`/mnt/c/...`)를 읽고 쓸 수 있다. 프로젝트가 C: 안에 있으니 그대로 작업하면 된다.

---

## 0. 프레임 추출 (공통)

```bash
FF=/mnt/c/ffmpeg-*/bin/ffmpeg.exe
mkdir -p _work/raw _work/cut
$FF -y -i public/ping.mp4 -vsync 0 _work/raw/f_%04d.png   # 240프레임 등
ls _work/raw | wc -l
```

원본 정보 확인: `ffprobe.exe -v error -show_entries stream=width,height,nb_frames,duration -of default=noprint_wrappers=1 public/ping.mp4`

---

## 방법 A — rembg 컷아웃 (이펙트 없는 피사체)

배경 톤과 비슷한 밝은 부분(눈 흰자 등)이 **구멍** 나는 걸 `binary_fill_holes`로 메우는 게 포인트.

```python
import glob, numpy as np
from rembg import remove, new_session
from PIL import Image, ImageFilter
from scipy import ndimage

sess = new_session("u2net")
for f in sorted(glob.glob("_work/raw/f_*.png")):
    orig = Image.open(f).convert("RGBA")
    a = np.array(remove(orig, session=sess).split()[3])     # soft alpha
    binm = a > 110
    filled = ndimage.binary_fill_holes(binm)                # 실루엣 내부 구멍(눈 등) 복원
    a2 = a.copy(); a2[filled & ~binm] = 255
    af = Image.fromarray(a2, "L").filter(ImageFilter.GaussianBlur(0.6))
    Image.merge("RGBA", (*orig.split()[:3], af)).save(f.replace("raw", "cut"))
```

→ 그다음 **3. 크롭 & 인코딩**으로.

---

## 방법 B — 차이 키잉 (이펙트·반짝이까지 보존) ✅ ping에 쓴 방법

배경이 **정지된 단색/그라데이션**일 때만 가능(카메라 고정). 배경을 수식으로 모델링한 뒤,
각 픽셀이 그 배경과 **얼마나 다른가**로 알파를 만든다 → 회색이면 투명/흰색, 캐릭터·이펙트는 보존.

### B-1. 배경 플레이트 추정 (1프레임에서 2차 다항식 피팅)

```python
import numpy as np
from rembg import remove, new_session
from PIL import Image

f1 = Image.open("_work/raw/f_0001.png").convert("RGB")
arr = np.asarray(f1).astype(np.float64); H, W, _ = arr.shape
a1 = np.asarray(remove(f1.convert("RGBA"), session=new_session("u2net")).split()[3])
bg = a1 < 30                                   # 확실한 배경 픽셀

ys, xs = np.mgrid[0:H, 0:W]
def design(x, y):
    x = x / W; y = y / H
    return np.stack([np.ones_like(x), x, y, x*y, x*x, y*y], axis=-1)
A = design(xs.astype(float), ys.astype(float))
plate = np.zeros_like(arr)
for c in range(3):
    coef, *_ = np.linalg.lstsq(A[bg], arr[bg][:, c], rcond=None)
    plate[:, :, c] = A @ coef
np.save("_work/plate.npy", plate)
```

### B-2. 프레임별 차이 키잉 + 워터마크 제거 + bbox

```python
import glob, json, numpy as np
from PIL import Image, ImageFilter
plate = np.load("_work/plate.npy"); H, W, _ = plate.shape
lo, hi = 18.0, 40.0                            # 차이 임계: lo 미만=배경, hi 이상=완전 불투명
ux0=uy0=10**9; ux1=uy1=-1
for fn in sorted(glob.glob("_work/raw/f_*.png")):
    o = np.asarray(Image.open(fn).convert("RGB")).astype(np.float64)
    d = np.abs(o - plate).max(axis=2)
    alpha = np.clip((d - lo) / (hi - lo), 0, 1)
    alpha[H-130:, W-150:] = 0.0                 # 우하단 AI 워터마크 제거 (있을 때만)
    af = Image.fromarray((alpha*255).astype(np.uint8), "L").filter(ImageFilter.GaussianBlur(0.5))
    Image.merge("RGBA", (*Image.open(fn).convert("RGB").split(), af)).save(fn.replace("raw", "cut"))
```

### B-3. 깨끗한 크롭 박스 (잔노이즈 제거 후 전 프레임 합집합)

```python
import glob, json, numpy as np
from PIL import Image
from scipy import ndimage
ux0=uy0=10**9; ux1=uy1=-1
for fn in sorted(glob.glob("_work/cut/f_*.png")):
    a = np.asarray(Image.open(fn).split()[3]) > 50
    a = ndimage.binary_opening(a, iterations=2)             # 작은 점 제거
    lbl, n = ndimage.label(a)
    if not n: continue
    sizes = ndimage.sum(np.ones_like(lbl), lbl, range(1, n+1))
    keep = np.isin(lbl, 1 + np.where(sizes >= 60)[0])       # 60px 이상 덩어리만
    ys, xs = np.where(keep)
    if xs.size:
        ux0=min(ux0,xs.min()); ux1=max(ux1,xs.max()); uy0=min(uy0,ys.min()); uy1=max(uy1,ys.max())
print("BBOX", ux0, uy0, ux1, uy1)   # 여기에 여유 패딩(±24) 주고 even 값으로 맞춰 crop
```

> **교훈:** 크롭 박스는 반드시 **전체 프레임**에서 계산할 것. 4fps 같은 샘플로 잡으면
> 마지막 "짜잔"에서 팔/이펙트가 최대로 뻗는 순간을 놓쳐서 잘린다. (한 번 당함)

---

## 3. 크롭 & 인코딩 (공통)

`crop=W:H:X:Y` 값은 위 bbox + 패딩(짝수로). 예: `crop=878:560:304:46`

```bash
FF=/mnt/c/ffmpeg-*/bin/ffmpeg.exe

# (1) 흰 배경 MP4 — 투명 프레임을 흰색 위에 합성
$FF -y -framerate 24 -i _work/cut/f_%04d.png \
  -filter_complex "color=white:s=878x560:r=24[bg];[0:v]crop=878:560:304:46[fg];[bg][fg]overlay=shortest=1,format=yuv420p" \
  -c:v libx264 -crf 18 -pix_fmt yuv420p -an public/ping-white.mp4

# (2) 투명 WebM (알파 채널, VP9)
$FF -y -framerate 24 -i _work/cut/f_%04d.png -vf "crop=878:560:304:46" \
  -c:v libvpx-vp9 -pix_fmt yuva420p -b:v 0 -crf 30 -an public/ping.webm
```

### 검증 (중요)

```bash
# VP9 알파는 추출 시 반드시 -c:v libvpx-vp9 를 입력 앞에 줘야 알파가 살아있음!
$FF -y -c:v libvpx-vp9 -i public/ping.webm -vf "fps=1,tile=5x2" -frames:v 1 -update 1 _check.png
```

→ `_check.png`를 열어 **눈·팔·이펙트가 안 잘렸는지, 배경이 깨끗한지** 눈으로 확인.

---

## 웹에서 쓸 때

- **투명 webm**은 흰 배경 위에선 완벽, **비흰색 배경 위에선 옅은 헤일로**가 생길 수 있음(원본 경계 잔상).
- **흰 배경 mp4**는 흰색 영역 위에서만 자연스러움(불투명 사각형이라 다른 색 위에선 흰 박스로 보임).
- 사파리는 VP9 알파 미지원 → 사파리까지 필요하면 HEVC+알파 MOV를 추가로 뽑아 `<video>`에 `<source>` 2개.
- 한 번만 재생 후 마지막 프레임에서 멈추려면: `loop` 빼고, `IntersectionObserver`로 보일 때 `play()`.
  (`components/cosmic/Mascot.tsx` 참고)

## 정리

```bash
rm -rf _work _check.png   # 임시 파일 삭제, 결과물(public/*.webm, *.mp4)만 남김
```
