import VariantH from "@/components/prototype/hero/VariantH";
import HeroSheet from "@/components/sections/HeroSheet";
import CapabilitiesStrip from "@/components/sections/CapabilitiesStrip";
import QuoteCard from "@/components/sections/QuoteCard";
import TechLogoWall from "@/components/sections/TechLogoWall";
import FinalCTA from "@/components/sections/FinalCTA";
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

      {/* ── 히어로 + 4-피처: three.js 단일 시트 1장이 둘을 관통(일렁이는 대각, 경계 이음매 없음) ── */}
      <div className="relative overflow-hidden bg-white">
        <HeroSheet />
        <VariantH />
        <CapabilitiesStrip />
      </div>

      <CosmicHustle />
      <QuoteCard />
      <ProjectDetail_3DPrinter />
      <SideProjects />
      <TechLogoWall />
      <SystemTimeline />
      <FinalCTA />
      <Footer />
    </div>
  );
}
