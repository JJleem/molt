"use client";

import React, { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ImageIcon, Maximize2, X } from "lucide-react";
import Image from "next/image";
import type { Gallery } from "@/content/types";

const AUTOPLAY_MS = 5000;
const emptySubscribe = () => () => {};

/* 이미지 1장 — 파일이 없으면(404) 우아한 accent 그라데이션 placeholder로 폴백.
   사용자는 해당 경로에 파일만 드롭하면 자동으로 스샷이 뜬다. */
function GalleryImage({
  src,
  alt,
  accent,
  variant,
  hint,
  index,
  fit = "cover",
}: {
  src: string;
  alt: string;
  accent: string;
  variant: "main" | "thumb";
  hint?: string;
  index?: number;
  fit?: "cover" | "contain";
}) {
  // 래퍼(메인/라이트박스 motion.div, 썸네일 button)가 src별로 key를 갖거나
  // src가 고정이라 src 변경 시 인스턴스가 리마운트된다 → 실패 상태 초기화 effect 불필요.
  const [failed, setFailed] = useState(false);

  if (!failed) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={variant === "main" ? "(max-width: 768px) 100vw, 900px" : "200px"}
        className={fit === "contain" ? "object-contain" : "object-cover"}
        onError={() => setFailed(true)}
        unoptimized
      />
    );
  }

  // placeholder
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center"
      style={{
        background: `radial-gradient(120% 120% at 50% 0%, ${accent}1f, transparent 70%), repeating-linear-gradient(45deg, ${accent}0d 0 12px, transparent 12px 24px)`,
      }}
    >
      <div
        className="flex items-center justify-center rounded-full"
        style={{
          width: variant === "main" ? 52 : 30,
          height: variant === "main" ? 52 : 30,
          background: `${accent}22`,
          color: accent,
        }}
      >
        <ImageIcon size={variant === "main" ? 24 : 14} />
      </div>
      {variant === "main" ? (
        <>
          <p className="text-xs font-bold text-resume-text-sub">이미지 자리</p>
          {hint && (
            <p className="max-w-[18rem] px-4 text-[11px] leading-relaxed text-resume-text-sub/80">{hint}</p>
          )}
        </>
      ) : (
        <span className="text-[10px] font-bold tabular-nums text-resume-text-sub/70">
          {String((index ?? 0) + 1).padStart(2, "0")}
        </span>
      )}
    </div>
  );
}

export default function ProjectGallery({
  gallery,
  className = "",
  autoPlay = true,
  tone = "light",
}: {
  gallery: Gallery;
  className?: string;
  autoPlay?: boolean;
  /** 배경 톤 — 다크 섹션 위에서는 비활성 도트를 밝게(어두운 배경에서 안 보이는 문제 방지). */
  tone?: "light" | "dark";
}) {
  const { slides, accent, frameUrl, mockup } = gallery;
  const ratio = gallery.ratio ?? "aspect-[16/10]";
  // 라이트박스에서 뷰포트에 맞춰 통이미지를 보여주기 위한 숫자 비율("16 / 10").
  const ratioValue = ratio.match(/\[(.+)\]/)?.[1]?.replace("/", " / ") ?? "16 / 10";
  // 폰 스샷 갤러리는 썸네일도 세로 비율 + 더 좁은 폭으로 (지정 시).
  const thumbRatio = gallery.thumbRatio ?? "aspect-[4/3]";
  const thumbWidth = gallery.thumbRatio ? "w-[56px] sm:w-[64px]" : "w-[104px] sm:w-[124px]";
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);
  const [lightbox, setLightbox] = useState(false);
  const [inView, setInView] = useState(false);
  // 라이트박스를 document.body로 포털 → 조상 transform이 만든 stacking context를 탈출해
  // 헤더(sticky z-50) 위로 확실히 올라오게 한다. SSR에서는 document가 없어 마운트 후에만.
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const rootRef = useRef<HTMLDivElement>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);
  const count = slides.length;

  // 뷰포트에 실제로 보일 때만 오토플레이 — 화면 밖에서 미리 넘어가 4~5번째 장부터
  // 보이는 문제 방지(사용자 도착 시 항상 1번 장부터 시작).
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // 활성 썸네일을 가로 스트립 안에서 항상 보이도록 스크롤.
  // ⚠ scrollIntoView는 페이지 전체까지 스크롤하므로 금지 — 컨테이너만 가로 이동시킨다.
  // ⚠ offsetLeft는 offsetParent 기준이라 스트립이 positioned가 아니면 어긋난다 → rect로 계산.
  useEffect(() => {
    const container = thumbsRef.current;
    const el = container?.querySelector<HTMLElement>('[data-active="true"]');
    if (!container || !el) return;
    const cRect = container.getBoundingClientRect();
    const eRect = el.getBoundingClientRect();
    const target = container.scrollLeft + (eRect.left - cRect.left) - (container.clientWidth - el.clientWidth) / 2;
    container.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
  }, [active]);

  const go = useCallback(
    (next: number, d: number) => {
      setDir(d);
      setActive((next + count) % count);
    },
    [count]
  );
  const next = useCallback(() => go(active + 1, 1), [active, go]);
  const prev = useCallback(() => go(active - 1, -1), [active, go]);

  // 오토플레이 (hover/lightbox/화면 밖일 때 일시정지)
  useEffect(() => {
    if (!autoPlay || paused || lightbox || count <= 1 || !inView) return;
    const t = setInterval(() => setActive((a) => (a + 1) % count), AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [autoPlay, paused, lightbox, count, active, inView]);

  // 키보드 ← →, Esc(라이트박스)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "Escape") setLightbox(false);
    };
    if (lightbox) {
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }
  }, [lightbox, next, prev]);

  const current = slides[active];

  const MainImage = (
    <div className={`group/main relative ${ratio} w-full overflow-hidden`}>
      <AnimatePresence initial={false} custom={dir} mode="popLayout">
        <motion.div
          key={active}
          custom={dir}
          initial={{ opacity: 0, scale: 1.04, x: dir * 28 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.99, x: dir * -28 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <GalleryImage src={current.src} alt={current.alt} accent={accent} variant="main" hint={current.hint} fit={mockup ? "contain" : "cover"} />
        </motion.div>
      </AnimatePresence>

      {/* 하단 캡션 그라데이션 — 자체 목업(mockup)이면 폰 UI를 덮지 않도록 생략(캡션은 아래로) */}
      {!mockup && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent pt-16">
          <div className="flex items-end justify-between gap-3 p-4 md:p-5">
            <AnimatePresence mode="wait">
              <motion.p
                key={active}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
                className="max-w-[80%] text-[13px] font-semibold leading-snug text-white drop-shadow md:text-sm"
              >
                {current.caption}
              </motion.p>
            </AnimatePresence>
            <span className="shrink-0 rounded-full bg-black/40 px-2.5 py-1 text-[11px] font-bold tabular-nums text-white backdrop-blur-sm">
              {String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
            </span>
          </div>
        </div>
      )}

      {/* 좌우 화살표 */}
      {count > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="이전 이미지"
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white opacity-0 shadow-lg backdrop-blur-sm transition-[opacity,background-color] duration-200 hover:bg-black/70 group-hover/main:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="다음 이미지"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white opacity-0 shadow-lg backdrop-blur-sm transition-[opacity,background-color] duration-200 hover:bg-black/70 group-hover/main:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <ChevronRight size={18} />
          </button>
        </>
      )}

      {/* 확대 버튼 */}
      <button
        type="button"
        onClick={() => setLightbox(true)}
        aria-label="크게 보기"
        className="absolute right-3 top-3 rounded-full bg-black/50 p-2 text-white opacity-0 shadow-lg backdrop-blur-sm transition-[opacity,background-color] duration-200 hover:bg-black/70 group-hover/main:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <Maximize2 size={15} />
      </button>

      {/* 오토플레이 진행 바 */}
      {autoPlay && !paused && !lightbox && inView && count > 1 && (
        <motion.div
          key={active}
          className="absolute inset-x-0 top-0 h-[3px] origin-left"
          style={{ background: accent }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: AUTOPLAY_MS / 1000, ease: "linear" }}
        />
      )}
    </div>
  );

  return (
    <div
      ref={rootRef}
      className={className}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* 메인 — accent 글로우 위에 얹은 프레임 */}
      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-3 -z-10 rounded-[2rem] opacity-60 blur-2xl"
          style={{ background: `radial-gradient(60% 60% at 50% 30%, ${accent}40, transparent 70%)` }}
        />
        {mockup ? (
          /* 자체 폰 목업 — 카드 chrome 없이 폰 전체를 그대로(투명 배경) */
          MainImage
        ) : frameUrl ? (
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-resume-card shadow-[0_24px_70px_-20px_rgba(0,0,0,0.6)]">
            <div className="flex items-center gap-2 border-b border-white/5 bg-white/[0.03] px-4 py-2.5">
              <span className="flex gap-1.5">
                <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
                <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                <span className="h-3 w-3 rounded-full bg-[#28c840]" />
              </span>
              <div className="mx-auto flex items-center gap-1.5 rounded-md bg-white/[0.04] px-3 py-1 text-[11px] font-medium text-resume-text-sub">
                {frameUrl}
              </div>
              <span className="w-8 shrink-0" />
            </div>
            {MainImage}
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-resume-card shadow-[0_24px_70px_-20px_rgba(0,0,0,0.6)]">
            {MainImage}
          </div>
        )}
      </div>

      {/* 자체 목업 — 캡션을 이미지 아래로(폰 UI를 안 덮게) + 번호.
          캡션 길이가 달라도 높이가 들썩이지 않게 2줄 높이를 고정 예약. */}
      {mockup && (
        <div className="mt-3 flex min-h-[2.75rem] items-center justify-center gap-2 px-2 text-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={active}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
              className="line-clamp-2 text-[13px] font-semibold leading-snug break-keep"
              style={{ color: tone === "dark" ? "#eef3f9" : "#0a2540" }}
            >
              {current.caption}
            </motion.p>
          </AnimatePresence>
          <span className="shrink-0 text-[11px] font-bold tabular-nums" style={{ color: accent }}>
            {String(active + 1).padStart(2, "0")}/{String(count).padStart(2, "0")}
          </span>
        </div>
      )}

      {/* 도트 인디케이터 — 항상 보이는 직접 네비게이션(터치 기기 포함) */}
      {count > 1 && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {slides.map((s, i) => {
            const isActive = i === active;
            return (
              <button
                key={s.src}
                type="button"
                onClick={() => go(i, i > active ? 1 : -1)}
                aria-label={`${i + 1}번 이미지로 이동`}
                aria-current={isActive}
                className="h-2 rounded-full transition-[width,background-color] duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0d9488]"
                style={{
                  width: isActive ? 22 : 8,
                  background: isActive ? accent : tone === "dark" ? "rgba(255,255,255,0.3)" : "rgba(10,37,64,0.18)",
                }}
              />
            );
          })}
        </div>
      )}

      {/* 썸네일 스트립 — 가로 슬라이드(SideProjects식). 장수가 많아도 한 줄로 스크롤된다. */}
      {count > 1 && (
        <div ref={thumbsRef} className="no-scrollbar mt-3 flex snap-x gap-2.5 overflow-x-auto px-1 py-2">
          {slides.map((s, i) => {
            const isActive = i === active;
            return (
              <button
                key={s.src}
                type="button"
                onClick={() => go(i, i > active ? 1 : -1)}
                aria-label={`${i + 1}번 이미지로 이동: ${s.caption}`}
                aria-current={isActive}
                data-active={isActive}
                className={`group/thumb relative ${thumbRatio} ${thumbWidth} shrink-0 snap-start overflow-hidden rounded-xl border bg-resume-card transition-[border-color,box-shadow,transform] duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0d9488]`}
                style={{
                  borderColor: isActive ? accent : "rgba(255,255,255,0.12)",
                  boxShadow: isActive ? `0 0 0 2px ${accent}, 0 8px 24px -8px ${accent}99` : "none",
                  transform: isActive ? "translateY(-2px)" : "none",
                }}
              >
                <GalleryImage src={s.src} alt={s.alt} accent={accent} variant="thumb" index={i} />
                <span
                  className="absolute inset-0 transition-opacity duration-300"
                  style={{
                    background: isActive ? "transparent" : "rgba(0,0,0,0.5)",
                  }}
                />
              </button>
            );
          })}
        </div>
      )}

      {/* 라이트박스 */}
      {mounted && createPortal(
        <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(false)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm md:p-10"
          >
            <button
              type="button"
              aria-label="닫기"
              className="absolute right-5 top-5 rounded-full bg-white/15 p-2.5 text-white transition-colors hover:bg-white/25"
              onClick={() => setLightbox(false)}
            >
              <X size={20} />
            </button>
            <motion.div
              key={active}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="relative flex w-full max-w-5xl flex-col items-center"
            >
              {/* 뷰포트 높이(80vh)를 기준으로 비율대로 폭을 잡고, 폭은 컨테이너를 넘지 않게 클램프 →
                  세로 폰 스샷·가로 와이드 스샷 모두 잘림 없이 통째로 보인다. */}
              <div
                className="relative max-h-[80vh] max-w-full overflow-hidden rounded-xl"
                style={{ aspectRatio: ratioValue, height: "80vh" }}
              >
                <GalleryImage src={current.src} alt={current.alt} accent={accent} variant="main" hint={current.hint} fit="contain" />
              </div>
              <p className="mt-3 text-center text-sm font-medium text-white/90">{current.caption}</p>
            </motion.div>

            {count > 1 && (
              <>
                <button
                  type="button"
                  aria-label="이전 이미지"
                  onClick={(e) => { e.stopPropagation(); prev(); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/15 p-3 text-white transition-colors hover:bg-white/25 md:left-8"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  type="button"
                  aria-label="다음 이미지"
                  onClick={(e) => { e.stopPropagation(); next(); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/15 p-3 text-white transition-colors hover:bg-white/25 md:right-8"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </motion.div>
        )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
