import VariantH from "@/components/prototype/hero/VariantH";
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
  // overflow-x-clip: 히어로 띠(100vw, skew)로 인한 가로 스크롤만 차단.
  // clip은 스크롤 컨테이너를 안 만들어 sticky를 안 깨고, 세로(띠 흘러내림)는 그대로 둔다.
  return (
    <div className="overflow-x-clip">
      <Header />

      <VariantH />
      <CapabilitiesStrip />

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
