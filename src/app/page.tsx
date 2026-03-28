import type { Metadata } from "next";
import { tools } from "@/data/tools";
import ToolCard from "@/components/ToolCard";

export const metadata: Metadata = {
  title: "変換野郎 — デザイナーのための画像ツール集",
  description:
    "JPEG一括変換・一括リサイズなど、クリエーターの作業を爆速にする無料ブラウザツール集。",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-12 text-center">
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground mb-4">
          変換<span className="text-accent">野郎</span>
        </h1>
        <p className="text-muted text-base sm:text-lg max-w-xl mx-auto">
          クリエーターのための、シンプルで爆速な画像ツール集。
          <br />
          ブラウザ完結・無料・サーバー不要。
        </p>
      </div>

      <div id="tools" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
}
