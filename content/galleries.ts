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
  accent: "#0d9488", // teal — 사이트 시그니처(다크 네이비 스크린샷과 조화)
  // 0·10은 16:9, 1~9 다수가 16:10 → 잘림이 가장 적은 16:10으로 프레임 고정.
  ratio: "aspect-[16/10]",
  slides: [
    {
      src: "/assets/projects/research/0.png",
      alt: "리서치 엔진 메인 화면",
      caption: "메인 화면 — 멀티에이전트 리서치 엔진 콘솔 진입점",
      hint: "엔진 메인 화면 · research/0.png",
    },
    {
      src: "/assets/projects/research/1.png",
      alt: "위키 지식 데이터베이스",
      caption: "지식 데이터베이스 — 위키가 관리하는 옵시디언식 지식 그래프",
      hint: "위키 DB(옵시디언 느낌) · research/1.png",
    },
    {
      src: "/assets/projects/research/2.png",
      alt: "프로젝트 착수 설정",
      caption: "프로젝트 착수 — 새 리서치를 시작하며 범위를 설정",
      hint: "프로젝트 시작 설정 화면 · research/2.png",
    },
    {
      src: "/assets/projects/research/3.png",
      alt: "플랜이 주제와 진행 방식을 설계",
      caption: "플랜(PM) — 주제를 잡고 어떤 방식으로 나아갈지 설계",
      hint: "플랜의 주제·전략 수립 · research/3.png",
    },
    {
      src: "/assets/projects/research/4.png",
      alt: "위키가 지식 데이터베이스를 조회",
      caption: "위키(사서) — 이미 가진 지식인지 자기 DB를 먼저 조회",
      hint: "위키의 DB 조회 단계 · research/4.png",
    },
    {
      src: "/assets/projects/research/5.png",
      alt: "포케가 데이터를 리서치",
      caption: "포케(리서처) — 외부 데이터를 수집·리서치",
      hint: "포케의 데이터 리서치 · research/5.png",
    },
    {
      src: "/assets/projects/research/6.png",
      alt: "카가 데이터를 분석",
      caption: "카(분석가) — 수집된 데이터를 분석",
      hint: "카의 데이터 분석 · research/6.png",
    },
    {
      src: "/assets/projects/research/7.png",
      alt: "오버가 글을 작성",
      caption: "오버(작가) — 분석 결과를 글로 작성",
      hint: "오버의 작성 단계 · research/7.png",
    },
    {
      src: "/assets/projects/research/8.png",
      alt: "팩트가 글을 검토",
      caption: "팩트(검토자) — 작성된 글을 팩트체크·검토",
      hint: "팩트의 검토 단계 · research/8.png",
    },
    {
      src: "/assets/projects/research/9.png",
      alt: "핑이 아이디어를 수집",
      caption: "핑(아이디어 수집가) — 다음 주제 아이디어를 수집",
      hint: "핑의 아이디어 수집 · research/9.png",
    },
    {
      src: "/assets/projects/research/10.png",
      alt: "최종 리서치 결과물",
      caption: "최종 결과물 — 지식으로 누적된 리서치 리포트",
      hint: "엔진 최종 결과물 · research/10.png",
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
