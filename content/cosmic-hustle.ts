import type { FlagshipProject } from "./types";
import type { Localized } from "./locale";

// 🌟 히어로 프로젝트. 포트폴리오의 심장.
// 11명의 AI 에이전트가 협업하는 멀티에이전트 시스템 — 두 갈래:
//  ① 멀티에이전트 "리서치 엔진" (CEO 인터랙티브, 기능 구현 완료, 미배포) = 기술 코어
//  ② "AI 블로그" (별도의 경량 자동 발행 플로우, 배포·운영 중, 실사용자) = 제품
// 같은 에이전트들을 공유하지만 발행 플로우는 별개.

export const cosmicHustle: Localized<FlagshipProject> = {
  ko: {
    title: "Cosmic Hustle",
    tagline: "11명의 AI 에이전트가 직원처럼 협업하는 멀티에이전트 시스템",
    concept:
      'CEO(사용자)가 주제를 던지면 "우주 리서치 회사"의 AI 에이전트 11명이 역할을 나눠 리서치하는 인터랙티브 "리서치 엔진"(기능 구현 완료, 미배포)으로 시작했습니다. 사용자를 확보하기 위해 — 같은 에이전트들이 매일 글을 자동 발행하는 별도의 경량 플로우 "AI 블로그"(blog.cosmic-hustle.com, 운영 중)를 만들어 제품으로 전환했습니다.',
    links: {
      live: "https://blog.cosmic-hustle.com",
      github: "https://github.com/JJleem/cosmic-hustle", // 백엔드(오케스트레이션) 레포
      blog_repo: "https://github.com/JJleem/cosmic-hustle-blog", // 프론트 레포
    },
    metrics: [
      { label: "AI 에이전트", value: "11명", hint: "3개 부서 역할 분담" },
      { label: "자동 발행", value: "매일 09:00", hint: "KST · APScheduler" },
      { label: "누적 발행", value: "31글", hint: "2026.06.15 기준" },
      { label: "실사용자", value: "161+", hint: "GA 측정 · 운영 보름" },
    ],
    pipeline: [
      { id: "plan", label: "플랜", desc: "기획 · 태스크 정의" },
      { id: "research", label: "위키 + 포케", desc: "병렬 리서치" },
      { id: "analyze", label: "카", desc: "분석 · 인사이트" },
      { id: "write", label: "오버 · 버즈 · 픽셀 · 런", desc: "태스크별 작성" },
      { id: "fact", label: "팩트", desc: "검토 · 팩트체크" },
      { id: "learn", label: "핑 + 위키", desc: "아이디어 · 지식 누적" },
    ],
    capabilities: [
      // ===== 제품: AI 블로그 (운영 중) =====
      {
        id: "daily-publish",
        title: "매일 자동 발행",
        desc: "매일 09:00, 에이전트가 스스로 글을 발행하는 경량 자동화 플로우.",
        group: "blog",
        points: [
          "트렌드 수집 → 글 생성 → 썸네일(Flux)까지 자동",
          "정시 스케줄 발행 · 익명 참여 · 웹푸시 알림",
          "토론·투표·퀴즈 등 콘텐츠 포맷 다양화",
        ],
      },
      {
        id: "self-learning",
        title: "자가학습 & 성과 평가",
        desc: "글의 반응을 학습해 다음 글에 반영하고, 성과를 스스로 채점한다.",
        group: "blog",
        points: [
          "조회수·댓글 반응 기반 자가학습",
          "글별 3축 점수(성과·비용·품질) 자동 산출",
          "페어와이즈 LLM 판사로 품질 평가",
        ],
      },
      {
        id: "rag",
        title: "RAG 캐릭터 DM",
        desc: "캐릭터에게 DM하면 인격을 유지하며 실시간으로 답한다.",
        group: "blog",
        points: [
          "RAG 기반 답변 + 출처 칩으로 환각 방지",
          "토큰 단위 실시간 스트리밍",
          "3단 비용 가드(상한·IP·캐시)",
        ],
      },
      // ===== 기술 코어: 멀티에이전트 리서치 엔진 (미배포) =====
      {
        id: "orchestration",
        title: "멀티에이전트 오케스트레이션",
        desc: "CEO가 주제를 던지면 11명이 역할을 나눠 협업하는 인터랙티브 리서치 엔진.",
        group: "engine",
        points: [
          "직접 구현한 asyncio 병렬 파이프라인",
          "9종 태스크 타입 · 에이전트별 모델 차등(Haiku/Sonnet)",
          "실시간 스트리밍 + CEO 체크인 제어",
        ],
      },
      {
        id: "infra",
        title: "지식 인프라 & 배포",
        desc: "검색·배포를 떠받치는 공통 인프라를 혼자 끝까지 운영.",
        group: "engine",
        points: [
          "pgvector 시맨틱 검색(로컬 임베딩)",
          "AWS Lightsail 배포 + GitHub Actions 자동화",
          "PostgreSQL + Alembic 마이그레이션",
        ],
      },
    ],
    ownership: {
      title: "만들고 끝이 아니라, 사용자가 들어오게 만든다",
      desc: "AI 블로그를 만드는 데서 멈추지 않고, 검색 노출·유입까지 직접 챙긴다. (GTM/GA4 외주 경험 기반)",
      points: [
        "GA4 · GTM · GSC 계측 전 과정",
        "Bing · 네이버 · Google 검색 색인 (IndexNow)",
        "OG · JSON-LD · sitemap · RSS 기술 SEO",
        "동적 OG 이미지 · llms.txt · 접근성",
      ],
    },
    techStack: [
      "Next.js 15 (App Router)",
      "React 19",
      "TypeScript",
      "FastAPI (Python 3.12)",
      "PostgreSQL 16 + pgvector",
      "Claude (Code SDK + API, Haiku 4.5 / Sonnet)",
      "sentence-transformers",
      "fal.ai (Flux)",
      "GA4 / GSC API",
      "AWS Lightsail",
      "Vercel",
      "GitHub Actions",
    ],
  },
};
