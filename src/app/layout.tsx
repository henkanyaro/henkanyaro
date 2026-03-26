import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://henkanyaro.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "変換野郎 — デザイナーのための画像ツール集",
    template: "%s | 変換野郎",
  },
  description:
    "変換野郎はデザイナー向けの無料画像ツール集です。JPEG一括変換・リサイズなどをブラウザだけで完結。",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "変換野郎",
    title: "変換野郎 — デザイナーのための画像ツール集",
    description:
      "変換野郎はデザイナー向けの無料画像ツール集です。JPEG一括変換・リサイズなどをブラウザだけで完結。",
  },
  twitter: {
    card: "summary_large_image",
    title: "変換野郎 — デザイナーのための画像ツール集",
    description:
      "変換野郎はデザイナー向けの無料画像ツール集です。JPEG一括変換・リサイズなどをブラウザだけで完結。",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2776157483121660"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
