import type { Metadata } from "next";
import { BottomNav } from "@/components/bottom-nav";
import { FooterLinks } from "@/components/footer-links";
import { FloatingWriteButton } from "@/components/floating-write-button";
import { Header } from "@/components/header";
import "./globals.css";

export const metadata: Metadata = {
  title: "JOBDAY",
  description: "현장 작업자를 위한 정보 공유 커뮤니티"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <Header />
        <main className="page-shell">{children}</main>
        <FooterLinks />
        <FloatingWriteButton />
        <BottomNav />
      </body>
    </html>
  );
}
