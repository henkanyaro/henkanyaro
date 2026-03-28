import type { Metadata } from "next";
import { tools } from "@/data/tools";
import ToolCard from "@/components/ToolCard";

export const metadata: Metadata = {
  title: "変換野郎 — デザイナーのための画像ツール集",
  description:
    "JPEG一括変換・一括リサイズなど、クリエーターの作業を爆速にする無料ブラウザツール集。",
  alternates: {
    canonical: "/",
    languages: {
      ja: "/",
      en: "/en",
    },
  },
};

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      {/* ヒーローセクション */}
      <div
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl mb-10 sm:mb-14 px-6 py-12 sm:px-8 sm:py-16 text-center"
        style={{
          background:
            "linear-gradient(135deg, #FFF0EA 0%, #fdf4ff 50%, #F3EFFE 100%)",
        }}
      >
        {/* 装飾ブロブ */}
        <div
          className="absolute -top-16 -right-16 w-64 h-64 rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{ backgroundColor: "#FF6B35" }}
        />
        <div
          className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{ backgroundColor: "#7C3AED" }}
        />

        <div className="relative">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
            <span
              style={{
                background: "linear-gradient(90deg, #FF6B35 0%, #7C3AED 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              変換野郎
            </span>
          </h1>
          <p className="text-muted text-base sm:text-lg max-w-xl mx-auto">
            クリエーターのための、シンプルで爆速な画像ツール集。
            <br />
            ブラウザ完結・無料・サーバー不要。
          </p>
        </div>
      </div>

      {/* ツール一覧 */}
      <div id="tools">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-lg font-bold text-foreground">ツール一覧</h2>
          <div
            className="flex-1 h-0.5 rounded-full"
            style={{
              background:
                "linear-gradient(90deg, #FF6B35 0%, #7C3AED 100%)",
            }}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </div>
    </div>
  );
}
