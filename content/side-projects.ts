import type { SideProject } from "./types";
import type { Localized } from "./locale";

// 사이드 프로젝트 — AI/데이터 우선으로 배열 (포지셔닝 정체성을 그리드까지 확장).
// iconName은 lucide-react 아이콘 이름 (SideProjects 컴포넌트에서 매핑).

export const sideProjects: Localized<SideProject[]> = {
  ko: [
    {
      id: "claude-console",
      title: "Claude Console",
      category: "Personal / LLM Observability Dashboard",
      period: "Personal Project",
      description:
        "Claude Code의 모든 설정을 한 곳에서 관리하고 LLM 호출을 추적하며, 프롬프트를 버전 관리하고 Eval을 실행하는 개발자 전용 로컬 대시보드입니다. RAG · Tool Use · Multi-agent · Prompt Harness · Eval을 직접 구현하며 AI Application Engineering 핵심 역량을 체득했습니다.",
      tech: ["Next.js 16", "TypeScript", "Tailwind CSS v4", "Claude API", "SQLite", "Drizzle ORM", "SSE"],
      achievements: [
        "loggedClaude 래퍼로 모든 Claude API 호출을 SQLite에 자동 기록, Tool Use 루프 에이전트 동작 추적",
        "LLM-as-judge Eval 에이전트: get_runs → submit_evaluation 도구 반복 호출로 관련성·정확도 자동 채점",
        "SSE + 전역 EventEmitter 싱글톤으로 Claude Code 실행 이벤트 실시간 스트림 구현",
      ],
      iconName: "TerminalSquare",
      color: "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
      github: "https://github.com/JJleem/claude-console",
    },
    {
      id: "centiment",
      title: "Centiment",
      category: "AI / App Review Sentiment Analytics",
      period: "Personal Project",
      description:
        "iOS·Android 앱 리뷰를 자동 수집하고 Claude로 감성·카테고리를 분석해 게임·플랫폼·국가별 인사이트를 제공하는 분석 대시보드입니다. 비용을 의식한 LLM 파이프라인 설계가 핵심입니다.",
      tech: ["Next.js 15", "TypeScript", "Supabase", "Claude (Haiku 4.5 / Sonnet 4.6)", "shadcn/ui", "Vercel"],
      achievements: [
        "Haiku 대량 분류 + Sonnet 요약의 2단 LLM 파이프라인, 카테고리별 인사이트 영구 캐싱",
        "review_id 외래키로 신규 리뷰만 증분 분석 → API 비용 최소화",
        "최대 3개 게임 동시 비교, 버전 출시 시 감성 ±10%p 변동 자동 감지·알림, 국가별(EN/KO/JA/DE) 시각화",
      ],
      iconName: "BarChart3",
      color: "bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400",
      github: "https://github.com/JJleem/centiment",
      link: "https://centiment.vercel.app",
    },
    {
      id: "naver-ads",
      title: "Naver Ad Data Pipeline",
      category: "Freelance / Data Engineering",
      period: "2026.01 (1 Month)",
      description:
        "네이버 검색광고 API와 연동하여 노출수·클릭수·CTR·총비용 등 핵심 마케팅 지표를 수집하는 데이터 파이프라인입니다. 기존 GAS의 성능 한계를 GCP Serverless로 마이그레이션하여 대용량 광고 데이터의 정합성을 확보했습니다.",
      tech: ["GCP (Cloud Run)", "BigQuery", "Node.js", "Cloud Scheduler"],
      achievements: [
        "GAS 실행 시간(6분) 한계를 극복하고, 광고 성과 지표의 누락 없는 수집 환경 구축",
        "Node.js 스트리밍으로 4,000만 건의 레거시 광고 데이터를 BigQuery에 초기 적재 및 파티셔닝 적용",
        "Cloud Scheduler로 매일 전일자 광고 리포트를 자동 적재하여 ROAS 분석을 위한 데이터 마트 기반 마련",
      ],
      iconName: "CloudLightning",
      color: "bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400",
      github: "https://github.com/JJleem/naver-ads-automation",
    },
    {
      id: "mockitup",
      title: "Mockitup",
      category: "Open Source / Productivity Tool",
      period: "Personal Project",
      description:
        "복잡한 Mock 데이터를 시각적으로 설계하고 JSON/TS/SQL로 즉시 변환해 주는 웹 도구입니다. 백엔드 API가 나오기 전 프론트엔드 개발 생산성을 높이기 위해 만들었습니다.",
      tech: ["React", "TypeScript", "Zustand", "Faker.js", "Vite"],
      achievements: [
        "깊이 제한 없는 트리 구조 처리를 위한 재귀적 컴포넌트 설계",
        "실무 니즈를 반영한 한국어 데이터셋 적용 및 실시간 프리뷰 기능",
        "사내 및 동료 개발자 16명(MAU)이 사용하는 실무 도구로 발전",
      ],
      iconName: "LayoutTemplate",
      color: "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400",
      github: "https://github.com/JJleem/Mockitup",
      link: "https://jjleem.github.io/Mockitup/",
      logo: "/assets/mockitup.png",
    },
    {
      id: "gecko-hub",
      title: "GeckoHub (MVP)",
      category: "Full-Stack / Pet Management Service",
      period: "Personal Project",
      description:
        "크레스티드 게코의 혈통과 성장 과정을 기록하는 풀스택 웹 서비스입니다. Next.js와 Django를 연동하고, AI 툴을 활용한 Vibe Coding으로 핵심 로직 구현에 집중했습니다.",
      tech: ["Next.js 14", "Python", "Typescript", "Django (DRF)", "Supabase", "NextAuth", "Tailwind"],
      achievements: [
        "Self-referencing 모델링으로 부모-자식 개체 간의 '혈통 가계도' 시각화 로직 구현",
        "NextAuth(Social)와 Django JWT 인증 시스템을 통합하여 보안 로그인 환경 구축",
        "Vercel Serverless Function으로 프론트/백엔드를 통합 배포하여 운영 비용 최적화",
      ],
      iconName: "Dna",
      color: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
      github: "https://github.com/JJleem/gecko-hub",
      link: "https://gecko-hub-web.vercel.app/",
    },
  ],
};
