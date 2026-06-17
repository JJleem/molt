import VariantG from "@/components/prototype/hero/VariantG";
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
      <VariantG />
      <CosmicHustle />
      <ProjectDetail_3DPrinter />
      <SideProjects />
      <SystemTimeline />
      <Footer />
    </div>
  );
}
