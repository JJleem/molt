import type { Gallery } from "./types";

// 프로젝트별 인터랙티브 갤러리 콘텐츠.
// 각 슬라이드의 src 경로를 미리 박아두고, 파일이 없으면 우아한 placeholder로 폴백한다.
// 사용자는 아래 경로에 스크린샷 파일만 드롭하면 즉시 갤러리에 반영된다.
//
// 파일 드롭 위치 컨벤션
//   · Cosmic 블로그 :  public/assets/cosmic/blog-*.png
//   · Cosmic 엔진   :  public/assets/cosmic/engine-*.png · architecture.png
//   · C-HUB(실무)   :  public/assets/projects/c-hub/01.png ~ 05.png

// ===== 📱 C-HUB — 모바일 앱 (앱화, 개발 마무리) =====
export const cHubMobileGallery: Gallery = {
  accent: "#f59e0b", // amber — 개발 중
  ratio: "aspect-[9/16]",
  slides: [
    {
      src: "/assets/projects/c-hub/mobile-01.png",
      alt: "모바일 앱 — 통합 관제 대시보드",
      caption: "모바일 관제 — 현장에서 폰으로 장비 상태를 한눈에",
      hint: "앱 메인/대시보드 화면 · projects/c-hub/mobile-01.png",
    },
    {
      src: "/assets/projects/c-hub/mobile-02.png",
      alt: "모바일 앱 — 실시간 장비 제어",
      caption: "실시간 제어 — 폰에서 바로 장비를 시작·정지",
      hint: "장비 제어 화면 · mobile-02.png",
    },
    {
      src: "/assets/projects/c-hub/mobile-03.png",
      alt: "모바일 앱 — 푸시 알림",
      caption: "푸시 알림 — 이상 발생 시 즉시 알림",
      hint: "알림/모니터링 화면 · mobile-03.png",
    },
  ],
};

// ===== 🌟 Cosmic Hustle — AI 블로그 (배포 제품) =====
export const blogGallery: Gallery = {
  accent: "#10b981", // emerald — 운영 중
  frameUrl: "cosmic-hustle.ai.kr",
  ratio: "aspect-[16/10]",
  slides: [
    {
      src: "/assets/cosmic/blog-main.png",
      alt: "Cosmic Hustle 블로그 메인 — 에이전트 글 목록",
      caption: "블로그 메인 — 11명의 에이전트가 매일 발행하는 글 목록",
      hint: "블로그 메인 풀샷(에이전트 글 목록) · blog-main.png",
    },
    {
      src: "/assets/cosmic/blog-article.png",
      alt: "에이전트가 쓴 글 상세",
      caption: "글 상세 — 에이전트 글 본문 + Flux 자동 생성 썸네일",
      hint: "글 상세 화면 · blog-article.png",
    },
    {
      src: "/assets/cosmic/blog-formats.png",
      alt: "다양한 콘텐츠 포맷",
      caption: "콘텐츠 포맷 — 토론·투표·퀴즈로 다양화",
      hint: "콘텐츠 포맷(토론·투표·퀴즈) · blog-formats.png",
    },
    {
      src: "/assets/cosmic/blog-scoring.png",
      alt: "자가 성과 평가 대시보드",
      caption: "자가 성과평가 — 글별 3축 점수 · 페어와이즈 판정",
      hint: "자가 성과평가 대시보드 · blog-scoring.png",
    },
    {
      src: "/assets/cosmic/blog-push.png",
      alt: "정시 자동 발행 + 웹푸시 알림",
      caption: "자동 발행 — 매일 09:00 정시 스케줄 + 웹푸시 알림",
      hint: "자동 발행/웹푸시 · blog-push.png",
    },
  ],
};

// ===== 🛰️ Cosmic Hustle — 멀티에이전트 리서치 엔진 (코어 기술, 미배포) =====
export const engineGallery: Gallery = {
  accent: "#f59e0b", // amber — 코어/미배포
  ratio: "aspect-[16/9]",
  slides: [
    {
      src: "/assets/cosmic/architecture.png",
      alt: "멀티에이전트 아키텍처 다이어그램",
      caption: "아키텍처 — 에이전트 ↔ FastAPI ↔ pgvector ↔ 스케줄러",
      hint: "엔진 아키텍처 도식 · architecture.png",
    },
    {
      src: "/assets/cosmic/engine-ceo.png",
      alt: "CEO 인터랙티브 리서치 화면",
      caption: "CEO 콘솔 — 주제를 던지면 11명이 역할을 나눠 착수",
      hint: "CEO 인터랙티브 화면 · engine-ceo.png",
    },
    {
      src: "/assets/cosmic/engine-stream.png",
      alt: "실시간 스트리밍 리서치 진행",
      caption: "실시간 스트리밍 — 에이전트별 작업이 토큰 단위로 흐른다",
      hint: "실시간 스트리밍 진행 화면 · engine-stream.png",
    },
    {
      src: "/assets/cosmic/engine-result.png",
      alt: "리서치 결과 리포트",
      caption: "리서치 리포트 — 팩트체크를 거친 종합 결과물",
      hint: "최종 리서치 리포트 · engine-result.png",
    },
  ],
};

// ===== 🏭 C-HUB V2.0 — 산업용 3D 프린터 통합 관제 솔루션 (실무, 배포·운영 중) =====
export const cHubGallery: Gallery = {
  accent: "#6366f1", // indigo — resume-primary
  frameUrl: "c-hub.info",
  ratio: "aspect-[16/10]",
  slides: [
    {
      src: "/assets/projects/c-hub/01.png",
      alt: "C-HUB 통합 관제 대시보드",
      caption: "통합 관제 — 이기종 장비를 한 화면에서 실시간 모니터링",
      hint: "메인 관제 대시보드 풀샷 · projects/c-hub/01.png",
    },
    {
      src: "/assets/projects/c-hub/02.png",
      alt: "실시간 장비 모니터링",
      caption: "실시간 모니터링 — 센서 데이터(온도·수위·Z축)를 웹소켓으로 동기화",
      hint: "장비 상세 모니터링 화면 · 02.png",
    },
    {
      src: "/assets/projects/c-hub/03.png",
      alt: "원격 장비 제어",
      caption: "원격 제어 — 낙관적 업데이트 + 명령 큐로 명령 유실 방지",
      hint: "장비 제어 화면 · 03.png",
    },
    {
      src: "/assets/projects/c-hub/04.png",
      alt: "데이터 시각화 리포트",
      caption: "데이터 리포트 — 가동 이력·센서 추이 시각화 (Recharts)",
      hint: "차트/리포트 화면 · 04.png",
    },
    {
      src: "/assets/projects/c-hub/05.png",
      alt: "모바일 앱으로 확장",
      caption: "모바일 앱 — 현장에서 폰으로 실시간 제어·푸시 알림 (확장 중)",
      hint: "모바일 앱 화면 (React Native) · 05.png",
    },
  ],
};
