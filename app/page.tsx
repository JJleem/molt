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

      {/* ── 히어로 + 4-피처: 단 하나의 그라데이션 시트가 둘을 관통 (경계 이음매 구조적으로 불가능) ── */}
      <div className="relative bg-white">
        <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          {/* 단일 대각 시트 — 위·아래로 또렷한 우상향 사선 LINE 두 줄로 잘림(clip-path). */}
          {/* 한 요소라 경계 이음매 없음. 우하단으로 쏠려 흐르고 피처 상단까지 관통. */}
          <div
            className="absolute inset-x-0"
            style={{
              top: "38vh",
              height: "100vh",
              background:
                "linear-gradient(101deg, #57c2d6 0%, #635bff 46%, #8f69eb 78%, #d98fc6 100%)",
              clipPath: "polygon(0 20%, 100% 0, 100% 70%, 0 95%)",
            }}
          />
          {/* 사선 윗선 위로 번지는 halo 글로우 (선을 살짝 부드럽게) */}
          <div
            className="absolute inset-x-0"
            style={{
              top: "38vh",
              height: "100vh",
              background:
                "radial-gradient(58% 30% at 72% 30%, rgba(99,91,255,0.30), transparent 60%)",
            }}
          />
        </div>

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
