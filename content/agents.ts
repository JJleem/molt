import type { Agent } from "./types";

// Cosmic Hustle의 에이전트 11명 — 히어로 시각화의 소재.
// 실제 레포(cosmic-hustle/web/lib/agents.ts)에서 검증된 명단/직책/컬러. (단일 출처 원칙)
// 부서: Research(기획·리서치) / Creative(분석·창작) / Operations(검토·운영)

// 아바타: /public/assets/cosmic/agents/{id}.png 에 파일을 넣으면 캐스트/별자리에
// 자동으로 사진이 뜬다 (없으면 컬러 + 이니셜로 폴백). 경로 컨벤션은 {id}.png.
export const agents: Agent[] = [
  // Research
  { id: "plan", name: "플랜", role: "차장 · 프로덕트 매니저", color: "#FCD34D", dept: "Research", avatar: "/assets/cosmic/agents/plan.png" },
  { id: "pocke", name: "포케", role: "대리 · 리서처", color: "#86EFAC", dept: "Research", avatar: "/assets/cosmic/agents/pocke.png" },
  { id: "wiki", name: "위키", role: "대리 · 사서", color: "#C4B5FD", dept: "Research", avatar: "/assets/cosmic/agents/wiki.png" },
  { id: "run", name: "런", role: "사원 · 개발자", color: "#67E8F9", dept: "Research", avatar: "/assets/cosmic/agents/run.png" },
  // Creative
  { id: "ka", name: "카 (유레카)", role: "과장 · 분석가", color: "#A78BFA", dept: "Creative", avatar: "/assets/cosmic/agents/ka.png" },
  { id: "over", name: "오버", role: "사원 · 작가", color: "#F9A8D4", dept: "Creative", avatar: "/assets/cosmic/agents/over.png" },
  { id: "pixel", name: "픽셀", role: "사원 · 디자이너", color: "#FDBA74", dept: "Creative", avatar: "/assets/cosmic/agents/pixel.png" },
  { id: "ping", name: "핑", role: "인턴 · 아이디어 수집가", color: "#6EE7B7", dept: "Creative", avatar: "/assets/cosmic/agents/ping.png" },
  // Operations
  { id: "fact", name: "팩트", role: "부장 · 검토자", color: "#CBD5E1", dept: "Operations", avatar: "/assets/cosmic/agents/fact.png" },
  { id: "root", name: "루트", role: "사원 · DevOps", color: "#34D399", dept: "Operations", avatar: "/assets/cosmic/agents/root.png" },
  { id: "buzz", name: "버즈", role: "대리 · 마케터", color: "#FB923C", dept: "Operations", avatar: "/assets/cosmic/agents/buzz.png" },
];
