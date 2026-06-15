import type { Profile } from "./types";
import type { Localized } from "./locale";

// 포지셔닝 전환의 핵심: "프론트엔드 개발자" → "프론트엔드부터 AI 시스템까지, 끝까지 만드는 엔지니어"
// AI를 앞세우되, FE 문은 닫지 않는 교집합 포지셔닝.

export const profile: Localized<Profile> = {
  ko: {
    name: "임재준",
    eyebrow: "AI Native · Full-Stack Engineer",
    positioning: "프론트엔드부터 AI 시스템까지,\n제품을 끝까지 만드는 엔지니어",
    summary:
      "11명의 AI 에이전트가 매일 스스로 글을 쓰고 성과를 학습하는 멀티에이전트 플랫폼을 설계·배포·운영합니다. 화면(FE)부터 그 뒤의 LLM 오케스트레이션, 그리고 사용자가 들어오게 만드는 계측·SEO까지 직접 만듭니다.",
    links: {
      email: "leemjaejun@gmail.com",
      github: "https://github.com/JJleem",
      blog: "https://velog.io/@leemjaejun/posts",
      // resume: "/assets/resume.pdf", // TODO: 이력서 PDF 준비되면 활성화
    },
  },
};
