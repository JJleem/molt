import ProjectDetail_3DPrinter from "@/components/project/ProjectDetail_3DPrinter";
import SystemTimeline from "../components/SystemTimeLine";
import ProjectDetail_Golf from "@/components/project/ProjectDetail_Golf";
import OtherExperience from "@/components/OtherExperience";
import SideProjects from "@/components/project/SideProjects";
import Activity from "@/components/Activity";
import GithubStatus from "@/components/GithubStatus";
import Header from "@/components/layout/Header";
import IntroSection from "@/components/IntroSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div>
      <Header />
      <IntroSection />
      <SystemTimeline />
      <ProjectDetail_3DPrinter />
      <ProjectDetail_Golf />
      <OtherExperience />
      <SideProjects />
      <Activity />
      <GithubStatus username="JJleem" />
      <Footer />
    </div>
  );
}
