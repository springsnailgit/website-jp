import type { Metadata } from "next";
import { Noto_Sans_JP, Noto_Sans_SC } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";

// 日文字体
const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-noto-jp",
  weight: ["400", "500", "700"],
});

// 中文字体
const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-noto-sc",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "柏木设计 - 精美首饰定制与展示",
  description: "花は散り また咲く 一期一会を大切に - 高品质日式首饰设计与定制",
  keywords: "首饰,日本设计,手工首饰,定制珠宝,耳环,项链,手链,戒指",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hans">
      <body
        className={`${notoSansJP.variable} ${notoSansSC.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
