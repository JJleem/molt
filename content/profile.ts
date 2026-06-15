import type { Profile } from "./types";
import type { Localized } from "./locale";

// 포지셔닝 전환의 핵심: "프론트엔드 개발자" → "프론트엔드부터 AI 시스템까지, 끝까지 만드는 엔지니어"
// AI를 앞세우되, FE 문은 닫지 않는 교집합 포지셔닝.

export const profile: Localized<Profile> = {
  ko: {
    name: "임재준",
    eyebrow: "AI Native · Full-Stack Engineer",
    positioning: "제품을 끝까지 만드는\n엔지니어, 임재준입니다",
    summary:
      "AI 에이전트 11명을 '직원'으로 둔 1인 개발자입니다. 화면(FE)부터 그 뒤의 LLM 시스템, 그리고 사용자가 들어오게 만드는 계측·SEO까지 — 프론트엔드부터 AI까지 끝에서 끝을 직접 만듭니다.",
    links: {
      email: "leemjaejun@gmail.com",
      github: "https://github.com/JJleem",
      blog: "https://velog.io/@leemjaejun/posts",
      // resume: "/assets/resume.pdf", // TODO: 이력서 PDF 준비되면 활성화
    },
  },
};
