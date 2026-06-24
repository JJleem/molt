import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Cosmic Hustle 블로그 글 썸네일 (HTTPS 공개 사이트 경유 — 백엔드 HTTP는 mixed-content 차단됨)
    remotePatterns: [
      { protocol: "https", hostname: "cosmic-hustle.ai.kr", pathname: "/static/blog/**" },
    ],
  },
};

export default nextConfig;
