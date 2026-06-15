import type { Agent } from "./types";

// Cosmic Hustle의 에이전트 11명 — 히어로 시각화의 소재.
// 실제 레포(cosmic-hustle/web/lib/agents.ts)에서 검증된 명단/직책/컬러. (단일 출처 원칙)
// 부서: Research(기획·리서치) / Creative(분석·창작) / Operations(검토·운영)

export const agents: Agent[] = [
  // Research
  { id: "plan", name: "플랜", role: "차장 · 프로덕트 매니저", color: "#FCD34D" },
  { id: "pocke", name: "포케", role: "대리 · 리서처", color: "#86EFAC" },
  { id: "wiki", name: "위키", role: "대리 · 사서", color: "#C4B5FD" },
  { id: "run", name: "런", role: "사원 · 개발자", color: "#67E8F9" },
  // Creative
  { id: "ka", name: "카 (유레카)", role: "과장 · 분석가", color: "#A78BFA" },
  { id: "over", name: "오버", role: "사원 · 작가", color: "#F9A8D4" },
  { id: "pixel", name: "픽셀", role: "사원 · 디자이너", color: "#FDBA74" },
  { id: "ping", name: "핑", role: "인턴 · 아이디어 수집가", color: "#6EE7B7" },
  // Operations
  { id: "fact", name: "팩트", role: "부장 · 검토자", color: "#CBD5E1" },
  { id: "root", name: "루트", role: "사원 · DevOps", color: "#34D399" },
  { id: "buzz", name: "버즈", role: "대리 · 마케터", color: "#FB923C" },
];
