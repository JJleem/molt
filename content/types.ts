// 포트폴리오 콘텐츠 데이터 레이어의 타입 정의.
// 콘텐츠는 컴포넌트에서 분리되어 이 디렉터리(content/)에 산다.

export interface Profile {
  name: string;
  /** 채용 담당이 첫 화면에서 읽을 한 줄 포지셔닝 (교집합: AI + 풀스택) */
  positioning: string;
  /** 포지셔닝 위에 뜨는 작은 라벨 */
  eyebrow: string;
  /** 포지셔닝 아래 보조 설명 */
  summary: string;
  links: {
    email: string;
    github: string;
    blog?: string;
    resume?: string;
  };
}

/** 히어로 시각화에 뜨는 멀티에이전트 1명 */
export interface Agent {
  id: string;
  /** 표시 이름 (코드네임 또는 역할명) */
  name: string;
  /** 역할 한 줄 */
  role: string;
  /** CSS color (에이전트별 컬러) */
  color: string;
}

export interface Metric {
  label: string;
  value: string;
  hint?: string;
}

export interface PipelineStep {
  id: string;
  label: string;
  desc: string;
}

export interface CapabilityCard {
  id: string;
  title: string;
  /** "단발 호출 아님"을 증명하는 핵심 설명 */
  desc: string;
  points: string[];
  /** 어느 블록에 속하는가: 배포 제품(blog) vs 기술 코어 엔진(engine) */
  group: "blog" | "engine";
}

export interface ProjectLinks {
  live?: string;
  github?: string;
  [key: string]: string | undefined;
}

export interface SideProject {
  id: string;
  title: string;
  category: string;
  period: string;
  description: string;
  tech: string[];
  achievements: string[];
  /** lucide-react 아이콘 이름 (컴포넌트에서 매핑) */
  iconName: string;
  /** 아이콘 배경/텍스트 색 유틸 클래스 */
  color: string;
  github?: string;
  link?: string;
  logo?: string;
}

export interface FlagshipProject {
  title: string;
  tagline: string;
  concept: string;
  links: ProjectLinks;
  metrics: Metric[];
  /** 멀티에이전트 오케스트레이션 파이프라인 */
  pipeline: PipelineStep[];
  /** "운영되는 LLM 시스템"을 증명하는 역량 카드들 */
  capabilities: CapabilityCard[];
  /** 제품 오너십의 증거: 계측 / SEO / 데이터 */
  ownership: {
    title: string;
    desc: string;
    points: string[];
  };
  techStack: string[];
}
