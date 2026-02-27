import { ImageResponse } from "next/og";

// 1. 파비콘 설정 (크기, 타입)
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

// 2. 파비콘 생성 함수 (그라데이션 원)
export default function Icon() {
  return new ImageResponse(
    // 인디고(indigo-600)에서 에메랄드(emerald-500)로 이어지는 그라데이션 동그라미
    <div
      style={{
        fontSize: 24,
        background: "linear-gradient(to right, #4f46e5, #10b981)",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%", // 완벽한 동그라미
        border: "2px solid rgba(255, 255, 255, 0.1)", // 은은한 테두리 (선택사항)
      }}
    >
      {/* 원하면 여기에 재준 님의 이니셜 'J'나 'M'을 아주 작게 넣을 수도 있습니다. 
           하지만 깔끔하게 그라데이션만 남기는 게 SaaS 느낌에 더 가깝습니다. */}
    </div>,
    // ImageResponse 옵션
    {
      ...size,
    },
  );
}
