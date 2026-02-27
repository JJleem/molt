import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// 1. 로컬 폰트 설정
const pretendard = localFont({
  src: "../fonts/PretendardVariable.woff2",
  display: "swap",
  variable: "--font-pretendard",
  weight: "45 920",
});

// 2. 검색 및 카카오톡/슬랙 공유용 메타데이터 (Open Graph)
export const metadata: Metadata = {
  title: "임재준 | 프론트엔드 개발자 포트폴리오",
  description:
    "한계를 긋지 않는 프론트엔드 개발자 임재준입니다. 끝까지 책임지고 1에서 100을 만드는 프로덕트 개발 경험을 확인해 보세요.",

  // 카카오톡, 페이스북, 슬랙 등에 공유될 때 보이는 정보
  openGraph: {
    title: "임재준 | 프론트엔드 개발자 포트폴리오",
    description: "프론트엔드 개발자 임재준의 포트폴리오입니다.",
    url: "https://your-portfolio-domain.com", // TODO: 실제 배포하실 도메인으로 수정하세요!
    siteName: "임재준 포트폴리오",
    images: [
      {
        // TODO: public/assets 폴더에 카톡 공유 시 보여줄 이미지(1200x630 사이즈 추천)를 넣고 이름을 맞춰주세요!
        url: "/assets/og.png",
        width: 1200,
        height: 630,
        alt: "임재준 포트폴리오 썸네일",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },

  // 트위터(X) 공유용 설정
  twitter: {
    card: "summary_large_image",
    title: "임재준 | 프론트엔드 개발자",
    description: "프론트엔드 개발자 임재준의 포트폴리오입니다.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${pretendard.variable} antialiased font-sans`}>
        {children}
      </body>
    </html>
  );
}
