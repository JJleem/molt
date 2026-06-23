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
  return (
    <div>
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
