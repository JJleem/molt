import type { Metadata } from "next";
import localFont from "next/font/local"; // 1. 로컬 폰트 로더 불러오기
import "./globals.css";

// 2. 로컬 폰트 설정 (가변 폰트인 경우 weight를 '45 920' 범위로 설정 가능하지만, 보통 variable은 자동 감지됨)
const pretendard = localFont({
  src: "../fonts/PretendardVariable.woff2", // 아까 넣은 파일 경로
  display: "swap",
  variable: "--font-pretendard", // 3. Tailwind에서 쓸 변수 이름 정의 (중요!)
  weight: "45 920", // 가변 폰트 웨이트 범위 (보여주신 코드 참고)
});

export const metadata: Metadata = {
  title: "wwww",
  description: "wwwww",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      {/* 4. body 태그에 폰트 변수 클래스 적용 */}
      <body className={`${pretendard.variable}  antialiased`}>{children}</body>
    </html>
  );
}
