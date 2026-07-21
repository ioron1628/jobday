import type { Metadata } from "next";
import { BottomNav } from "@/components/bottom-nav";
import { FooterLinks } from "@/components/footer-links";
import { FloatingWriteButton } from "@/components/floating-write-button";
import { Header } from "@/components/header";
import { ShopCartProvider } from "@/components/shop-cart-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "JOBDAY",
  description: "실제 직업인의 이야기와 직업 허브로 일의 세계를 이해하는 JOBDAY"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <ShopCartProvider>
          <Header />
          <main className="page-shell">{children}</main>
          <FooterLinks />
          <FloatingWriteButton />
          <BottomNav />
        </ShopCartProvider>
      </body>
    </html>
  );
}
