import ProjectDetail_3DPrinter from "@/components/project/ProjectDetail_3DPrinter";
import SystemTimeline from "../components/SystemTimeLine";
import ProjectDetail_Golf from "@/components/project/ProjectDetail_Golf";
import OtherExperience from "@/components/OtherExperience";
import SideProjects from "@/components/project/SideProjects";
import Activity from "@/components/Activity";
import GithubStatus from "@/components/GithubStatus";

export default function Home() {
  return (
    <div>
      <GithubStatus username="JJleem" />
      <SystemTimeline />
      <ProjectDetail_3DPrinter />
      <ProjectDetail_Golf />
      <OtherExperience />
      <SideProjects />
      <Activity />
    </div>
  );
}
