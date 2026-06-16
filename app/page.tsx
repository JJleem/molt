import Hero from "@/components/hero/Hero";
import CosmicHustle from "@/components/project/CosmicHustle";
import ProjectDetail_3DPrinter from "@/components/project/ProjectDetail_3DPrinter";
import SideProjects from "@/components/project/SideProjects";
import SystemTimeline from "../components/SystemTimeLine";
import Header from "@/components/layout/Header";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div>
      <Header />
      {/* 1. 새 히어로 — 포지셔닝 전환 + 에이전트 11명 시각화 */}
      <Hero />
      {/* 2. 🌟 대표작 — 운영되는 멀티에이전트 LLM 시스템 */}
      <CosmicHustle />
      {/* 3. 실무 신뢰 — 회사에서 책임지는 복잡한 실무 */}
      <ProjectDetail_3DPrinter />
      {/* 4. 그 외 프로젝트 */}
      <SideProjects />
      {/* 5. 경력 (※ v1 이후 축소 예정) */}
      <SystemTimeline />
      <Footer />
    </div>
  );
}
