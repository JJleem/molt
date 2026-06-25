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
    tagline: "11명의 AI 에이전트가 직원처럼 일하며 스스로 운영하는 AI 블로그",
    concept:
      "주제 선정부터 리서치·작성·검토·발행, 댓글 토론까지 — 사람 손 없이 11명의 에이전트가 직접 굴리는 자율 운영 블로그입니다. 독자 반응을 학습해 매일 글이 더 좋아집니다.",
    links: {
      live: "https://cosmic-hustle.ai.kr/", // 블로그(제품) 프론트
      github: "https://github.com/JJleem/cosmic-hustle", // 백엔드(오케스트레이션) 레포 — public. 프론트 레포는 private.
    },
    metrics: [
      { label: "AI 에이전트", value: "11명", hint: "3개 부서 역할 분담" },
      { label: "자동 발행", value: "매일 09:00", hint: "KST · APScheduler" },
      { label: "누적 발행", value: "39글", hint: "실시간", live: "posts" },
      { label: "누적 조회수", value: "1,026", hint: "라이브", live: "views" },
    ],
    pipeline: [
      { id: "plan", label: "플랜", desc: "기획 · 태스크 정의", agentIds: ["plan"], checkpoint: "CEO 확인·수정" },
      { id: "research", label: "위키 + 포케", desc: "병렬 리서치", agentIds: ["wiki", "pocke"] },
      { id: "analyze", label: "카", desc: "분석 · 인사이트", agentIds: ["ka"] },
      { id: "write", label: "오버 · 버즈 · 픽셀 · 런", desc: "태스크별 작성", agentIds: ["over", "buzz", "pixel", "run"], handoffMedia: "/assets/projects/research/overfact.mp4" },
      { id: "fact", label: "팩트", desc: "검토 · 팩트체크", agentIds: ["fact"], checkpoint: "CEO 확인·수정" },
      { id: "learn", label: "핑 + 위키", desc: "아이디어 · 지식 누적", agentIds: ["ping", "wiki"] },
    ],
    capabilities: [
      // ===== 제품: AI 블로그 (운영 중) =====
      {
        id: "daily-publish",
        title: "매일 스스로 발행",
        desc: "11명이 각자 맡은 분야에서 매일 알아서 글을 쓴다 — 사람 개입 없이.",
        group: "blog",
        points: [
          "에이전트마다 다른 분야와 목소리 (리서처·분석가·작가·마케터)",
          "트렌드 수집부터 썸네일까지 한 번에 자동",
          "최근에 쓴 주제는 알아서 피해 중복 없이",
        ],
      },
      {
        id: "self-learning",
        title: "스스로 배우고 고친다",
        desc: "반응을 보고 뭐가 먹히는지 스스로 판단해, 다음 글을 더 잘 쓴다.",
        group: "blog",
        points: [
          "조회·좋아요·댓글로 잘 된 글을 가려냄",
          "매일 슬랙으로 그날의 성과를 자체 보고",
          "그 결과를 다음 프롬프트에 반영하는 자가개선 루프",
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
        title: "지식 인프라",
        desc: "검색·지식 누적을 떠받치는 데이터 인프라를 직접 설계·구현.",
        group: "engine",
        points: [
          "pgvector 시맨틱 검색 (로컬 임베딩)",
          "SQLAlchemy + asyncpg 비동기 DB 레이어",
          "PostgreSQL + Alembic 스키마 마이그레이션",
        ],
      },
    ],
    ownership: {
      title: "만들고 끝이 아니라, 사용자가 들어오게 만든다",
      desc: "띄우는 걸로 끝이 아니라, 검색 노출부터 실제 사용자 유입까지 직접 챙깁니다. 실무에서 다룬 GA4·GTM 경험이 그대로 들어갔어요.",
      points: [
        "GA4 · GTM · GSC 계측 전 과정",
        "Bing · 네이버 · Google 검색 색인 (IndexNow)",
        "OG · JSON-LD · sitemap · RSS 기술 SEO",
        "동적 OG 이미지 · llms.txt · 접근성",
      ],
    },
    techStack: {
      // 제품: AI 블로그 (cosmic-hustle.ai.kr, 운영 중)
      blog: [
        {
          label: "Frontend",
          items: ["Next.js 15 (App Router)", "React 19", "TypeScript"],
        },
        {
          label: "Backend",
          items: ["FastAPI (Python 3.12)", "PostgreSQL 16", "APScheduler"],
        },
        {
          label: "AI / ML",
          items: ["Claude (API)", "fal.ai (Flux)", "RAG"],
        },
        {
          label: "Infra / SEO",
          items: ["AWS Lightsail", "Vercel", "GitHub Actions", "GA4 / GSC API"],
        },
      ],
      // 기술 코어: 멀티에이전트 리서치 엔진 (cosmic-research, 미배포 — 배포 인프라 없음)
      engine: [
        {
          label: "Frontend",
          items: [
            "Next.js 16",
            "React 19",
            "TypeScript",
            "Three.js (R3F)",
            "D3",
            "Zustand",
          ],
        },
        {
          label: "Backend",
          items: [
            "FastAPI (Python)",
            "SQLAlchemy + asyncpg",
            "PostgreSQL + pgvector",
            "Alembic",
            "SSE 스트리밍",
          ],
        },
        {
          label: "AI / Orchestration",
          items: [
            "Claude (Code SDK + API · Haiku 4.5 / Sonnet)",
            "asyncio 병렬 파이프라인",
            "sentence-transformers (로컬 임베딩)",
          ],
        },
      ],
    },
  },
};
