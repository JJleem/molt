import ProjectDetail_3DPrinter from "@/components/project/ProjectDetail_3DPrinter";
import SystemTimeline from "../components/SystemTimeLine";
import ProjectDetail_Golf from "@/components/project/ProjectDetail_Golf";
import OtherExperience from "@/components/OtherExperience";
import SideProjects from "@/components/project/SideProjects";

export default function Home() {
  return (
    <div>
      <SystemTimeline />
      <ProjectDetail_3DPrinter />
      <ProjectDetail_Golf />
      <OtherExperience />
      <SideProjects />
    </div>
  );
}
