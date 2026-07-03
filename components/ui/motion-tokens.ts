// 사이트 공통 모션 시스템 — 모든 인터랙션/리빌은 이 값만 사용한다.
// 원칙: 작은 UI는 빠르게, reveal은 느리게, bounce 없음, transform/opacity만.

/** duration (초) */
export const DUR = {
  fast: 0.18,
  normal: 0.32,
  reveal: 0.6,
} as const;

/** cubic-bezier — 시작 빠르고 끝이 길게 눕는 easeOut */
export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];
export const EASE_OUT_CSS = "cubic-bezier(0.22, 1, 0.36, 1)";

/** 이동 거리 (px) */
export const DIST = {
  sm: 8,
  md: 14,
} as const;

/** 그룹 stagger 간격 (초) */
export const STAGGER = 0.07;

/** hover 시 카드 lift (px) */
export const HOVER_LIFT = 4;

/** 히어로 데모카드 pointer parallax 최대 이동 (px) — 레이어별 */
export const PARALLAX = {
  blueprint: 1.5, // 배경 SVG 레이어(멀리)
  card: 3, // 카드 레이어(가까이)
} as const;
