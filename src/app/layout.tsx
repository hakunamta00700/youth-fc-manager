import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Youth FC Manager",
  description: "유소년 축구 클럽 통합 관리 시스템",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased bg-gray-50 text-gray-900">
        {children}
      </body>
    </html>
  );
}
