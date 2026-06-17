// 사선으로 잘린 배경 레이어 (Stripe식 대각 섹션 경계).
//  · 섹션 배경색을 이 레이어가 그리되, 위/아래 모서리를 우상향 사선으로 clip → 흰 페이지가 사선으로 비침.
//  · 콘텐츠는 클립되지 않음(이 레이어는 형제 배경일 뿐). 부모 섹션은 relative, 콘텐츠는 relative z-10.
//  · 모든 섹션이 같은 방향(우상향, 우측이 더 높음)으로 기울어 히어로 시트와 결을 맞춤.

type Props = {
  color?: string;
  top?: boolean;
  bottom?: boolean;
  size?: number; // 사선 높이(px)
  className?: string;
};

export default function SlantBg({
  color = "#f6f9fc",
  top = true,
  bottom = true,
  size = 72,
  className = "",
}: Props) {
  // 우상향: 좌측 모서리가 size만큼 내려옴(우측이 더 높음).
  const tl = top ? `${size}px` : "0px"; // top-left y
  const br = bottom ? `calc(100% - ${size}px)` : "100%"; // bottom-right y
  const clip = `polygon(0 ${tl}, 100% 0, 100% ${br}, 0 100%)`;

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 z-0 ${className}`}
      style={{ background: color, clipPath: clip }}
    />
  );
}
