import type { Gallery } from "./types";

// 프로젝트별 인터랙티브 갤러리 콘텐츠.
// 각 슬라이드의 src 경로를 미리 박아두고, 파일이 없으면 우아한 placeholder로 폴백한다.
// 사용자는 아래 경로에 스크린샷 파일만 드롭하면 즉시 갤러리에 반영된다.
//
// 파일 드롭 위치 컨벤션
//   · Cosmic 블로그 :  public/assets/projects/blog/0.png ~ 7.png
//   · Cosmic 엔진   :  public/assets/cosmic/engine-*.png · architecture.png
//   · C-HUB(실무)   :  public/assets/projects/c-hub/0.png ~ 6.png

// ===== 📱 C-HUB — 모바일 앱 (React Native 신규 개발, 기존 web·API 동일 / 완료) =====
export const cHubMobileGallery: Gallery = {
  accent: "#6366f1", // indigo — 웹 C-HUB와 브랜드 통일
  mockup: true, // 이미지가 이미 폰 베젤 포함 → 카드 chrome 없이 전체 표시, 캡션은 아래로
  ratio: "aspect-[393/785]", // 폰 스샷 원본 비율(베젤 포함)
  thumbRatio: "aspect-[393/785]", // 썸네일도 세로 폰 비율
  slides: [
    {
      src: "/assets/projects/c-hub-app/0.png",
      alt: "메인 기기 대시보드",
      caption: "메인 — 등록 기기 대시보드 한눈에",
      hint: "메인 기기 대시보드 · projects/c-hub-app/0.png",
    },
    {
      src: "/assets/projects/c-hub-app/1.png",
      alt: "기기 상세 대시보드",
      caption: "기기 상세 — 웹캠·출력률·현재 출력 슬라이스 + 시작/중지",
      hint: "기기 상세(웹캠·출력률·슬라이스) · 1.png",
    },
    {
      src: "/assets/projects/c-hub-app/2.png",
      alt: "관리 탭",
      caption: "관리 — 알림·접근권한 등 관리 메뉴",
      hint: "관리 탭(알림·접근권한) · 2.png",
    },
    {
      src: "/assets/projects/c-hub-app/3.png",
      alt: "센서 로그",
      caption: "센서 로그 — 센서별 차트와 로그",
      hint: "센서 로그(차트·로그) · 3.png",
    },
    {
      src: "/assets/projects/c-hub-app/4.png",
      alt: "출력 이력",
      caption: "출력 이력 — 출력 영상 다운로드 + 출력 내역",
      hint: "출력 이력(영상·내역) · 4.png",
    },
    {
      src: "/assets/projects/c-hub-app/5.png",
      alt: "출력 통계",
      caption: "출력 통계 — 횟수·성공률·시간 등 통계",
      hint: "출력 통계(횟수·성공률) · 5.png",
    },
    {
      src: "/assets/projects/c-hub-app/6.png",
      alt: "파일 업로드",
      caption: "파일 업로드 — 슬라이스 확인·업로드",
      hint: "파일 업로드(슬라이스) · 6.png",
    },
    {
      src: "/assets/projects/c-hub-app/7.png",
      alt: "마이페이지",
      caption: "마이페이지 — 알림 설정·비밀번호 변경",
      hint: "마이페이지(알림·비번 변경) · 7.png",
    },
  ],
};

// ===== 🌟 Cosmic Hustle — AI 블로그 (배포 제품) =====
export const blogGallery: Gallery = {
  accent: "#10b981", // emerald — 운영 중
  frameUrl: "cosmic-hustle.ai.kr",
  ratio: "aspect-[16/9]", // 스샷이 전부 1920×1080(16:9) → 잘림 없이 그대로
  slides: [
    {
      src: "/assets/projects/blog/0.png",
      alt: "블로그 히어로 — 최신글",
      caption: "히어로 — 진입 즉시 최신글을 크게 띄우는 메인 화면",
      hint: "히어로 섹션(최신글) · projects/blog/0.png",
    },
    {
      src: "/assets/projects/blog/1.png",
      alt: "히어로 아래 글 목록",
      caption: "글 목록 — 히어로 아래로 이어지는 에이전트들의 글 피드",
      hint: "히어로 밑 글 목록 · 1.png",
    },
    {
      src: "/assets/projects/blog/2.png",
      alt: "게시글 썸네일 및 헤더",
      caption: "글 진입 — 자동 생성 썸네일 + 헤더",
      hint: "게시글 썸네일·헤더 · 2.png",
    },
    {
      src: "/assets/projects/blog/3.png",
      alt: "게시글 본문 및 본문 이미지",
      caption: "본문 — 글 내용 + 본문 삽입 이미지",
      hint: "게시글 본문·본문 이미지 · 3.png",
    },
    {
      src: "/assets/projects/blog/4.png",
      alt: "댓글",
      caption: "댓글 — 글마다 달리는 댓글·대댓글",
      hint: "댓글 화면 · 4.png",
    },
    {
      src: "/assets/projects/blog/5.png",
      alt: "AI 토론 투표",
      caption: "AI 토론·투표 — 에이전트들이 토론하고 투표하는 포맷",
      hint: "AI 토론/투표 · 5.png",
    },
    {
      src: "/assets/projects/blog/6.png",
      alt: "에이전트 상세 페이지",
      caption: "에이전트 상세 — 각 에이전트 프로필과 작성한 글",
      hint: "에이전트 상세(작성글 등) · 6.png",
    },
    {
      src: "/assets/projects/blog/7.png",
      alt: "어워드·효율 지표",
      caption: "어워드 — 에이전트별 성과·효율 랭킹",
      hint: "어워드/효율 지표 · 7.png",
    },
  ],
};

// ===== 🛰️ Cosmic Hustle — 멀티에이전트 리서치 엔진 (코어 기술, 미배포) =====
export const engineGallery: Gallery = {
  accent: "#0d9488", // teal — 사이트 시그니처(다크 네이비 스크린샷과 조화)
  frameUrl: "engine.cosmic-hustle.ai.kr", // 웹 콘솔 → 맥 브라우저 프레임(다른 웹 갤러리와 통일)
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

// ===== 🦆 UNDERDUCK FC — 조기축구 동아리 운영 대시보드 (사이드, 배포·운영 중) =====
// 모바일 우선(max-w-md) 제품이라 폰 세로(9:19.5, 잘림 최소) 프레임. 0~5.png 드롭하면 즉시 반영.
export const underduckGallery: Gallery = {
  accent: "#ec4899", // pink — UNDERDUCK 브랜드(핑크+블랙)
  ratio: "aspect-[1080/2340]",
  thumbRatio: "aspect-[9/16]", // 폰 스샷이라 썸네일도 세로

  slides: [
    {
      src: "/assets/projects/underduck/0.png",
      alt: "페이스온 라인업 에디터",
      caption: "페이스온 라인업 — 7가지 포메이션 DnD 편성, 인스타 스토리 포맷으로 공유",
      hint: "라인업/포메이션 화면 · underduck/0.png",
    },
    {
      src: "/assets/projects/underduck/1.png",
      alt: "메인 홈 — 투표·공지",
      caption: "메인 홈 — 다음 경기 투표와 공지사항을 한 화면에",
      hint: "메인 홈(투표·공지) 화면 · underduck/1.png",
    },
    {
      src: "/assets/projects/underduck/2.png",
      alt: "마이페이지 — 기록",
      caption: "마이페이지 — 최고의 듀오, 보유 칭호, 경기·골·도움 누적 기록",
      hint: "마이페이지(듀오·칭호·스탯) 화면 · underduck/2.png",
    },
    {
      src: "/assets/projects/underduck/3.png",
      alt: "마이페이지 — 인사이트",
      caption: "마이페이지 — 시즌 베스트 경기, 자주 함께 뛴 선수, 어시 관계, 포지션 분포·출석률",
      hint: "마이페이지-2(인사이트) 화면 · underduck/3.png",
    },
    {
      src: "/assets/projects/underduck/4.png",
      alt: "투표 시스템",
      caption: "투표 — 상대·날씨·경기장·일정 + 참석/미정/불참/미투표 + 투표 댓글",
      hint: "투표 상세 화면 · underduck/4.png",
    },
    {
      src: "/assets/projects/underduck/5.png",
      alt: "칭호 도감",
      caption: "칭호 도감 — 전체 타이틀을 한눈에 보는 컬렉션",
      hint: "칭호 도감 화면 · underduck/5.png",
    },
  ],
};

// ===== 🏭 C-HUB V2.0 — 산업용 3D 프린터 통합 관제 솔루션 (실무, 배포·운영 중) =====
export const cHubGallery: Gallery = {
  accent: "#6366f1", // indigo — resume-primary
  frameUrl: "c-hub.info",
  ratio: "aspect-[16/9]", // 스샷이 전부 1920×1080(16:9) → 잘림 없이 그대로
  slides: [
    {
      src: "/assets/projects/c-hub/0.png",
      alt: "C-HUB 로그인 화면",
      caption: "로그인 — carimatec C-HUB 통합 관제 진입",
      hint: "로그인 화면 · projects/c-hub/0.png",
    },
    {
      src: "/assets/projects/c-hub/1.png",
      alt: "등록된 기기 대시보드 홈",
      caption: "기기 대시보드 — 등록된 장비를 카드로 한눈에 (상태·프린팅·원격제어)",
      hint: "기기 목록 대시보드 홈 · 1.png",
    },
    {
      src: "/assets/projects/c-hub/2.png",
      alt: "기기 상세 대시보드",
      caption: "기기 상세 — 실시간 웹캠 + 센서(온도·수위·Z축 등) + 슬라이스/레시피 선택",
      hint: "기기 상세(웹캠·센서·슬라이스·레시피) · 2.png",
    },
    {
      src: "/assets/projects/c-hub/3.png",
      alt: "슬라이스 업로드 및 라이브러리",
      caption: "슬라이스 관리 — 드래그&드롭 업로드 + 저장된 슬라이스 라이브러리",
      hint: "슬라이스 업로드/라이브러리 · 3.png",
    },
    {
      src: "/assets/projects/c-hub/4.png",
      alt: "레시피 업로드 및 라이브러리",
      caption: "레시피 관리 — 레시피 업로드 + 저장된 레시피 라이브러리",
      hint: "레시피 업로드/라이브러리 · 4.png",
    },
    {
      src: "/assets/projects/c-hub/5.png",
      alt: "센서 차트 및 로그",
      caption: "센서 분석 — 온도·수위 추이 차트 + 시계열 로그",
      hint: "센서 차트/로그(Environment History) · 5.png",
    },
    {
      src: "/assets/projects/c-hub/6.png",
      alt: "프린팅 히스토리 상세",
      caption: "프린팅 히스토리 — 출력 내역 + 타임랩스 영상 + 댓글",
      hint: "프린팅 히스토리/타임랩스/댓글 · 6.png",
    },
  ],
};
