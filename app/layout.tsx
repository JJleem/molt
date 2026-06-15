import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Script from "next/script";
import { ThemeProvider } from "@/context/ThemeContext";

// 1. 로컬 폰트 설정
const pretendard = localFont({
  src: "../fonts/PretendardVariable.woff2",
  display: "swap",
  variable: "--font-pretendard",
  weight: "45 920",
});

// 2. 검색 및 카카오톡/슬랙 공유용 메타데이터 (Open Graph)
export const metadata: Metadata = {
  title: "임재준 | AI Native · Full-Stack Engineer",
  description:
    "프론트엔드부터 AI 시스템까지, 제품을 끝까지 만드는 엔지니어 임재준입니다. 11명의 AI 에이전트가 매일 스스로 글을 쓰는 멀티에이전트 플랫폼 Cosmic Hustle을 설계·배포·운영합니다.",

  // 카카오톡, 페이스북, 슬랙 등에 공유될 때 보이는 정보
  openGraph: {
    title: "임재준 | AI Native · Full-Stack Engineer",
    description:
      "프론트엔드부터 AI 시스템까지, 제품을 끝까지 만드는 엔지니어. 멀티에이전트 LLM 플랫폼을 직접 설계·배포·운영합니다.",
    url: "https://molt-ten.vercel.app/", // TODO: 실제 배포하실 도메인으로 수정하세요!
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
    title: "임재준 | AI Native · Full-Stack Engineer",
    description: "프론트엔드부터 AI 시스템까지, 제품을 끝까지 만드는 엔지니어.",
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        {/* ✨ 2. 구글 애널리틱스 데이터 수집 스크립트 추가 */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=G-FVW2XQ2JSE`}
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-FVW2XQ2JSE', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </head>
      <body className={`${pretendard.variable} antialiased font-sans`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
