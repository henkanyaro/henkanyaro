import type { Metadata } from "next";
import AdBanner from "@/components/AdBanner";
import ResizeConverter from "@/components/tools/ResizeConverter";

export const metadata: Metadata = {
  title: "一括リサイズ野郎 — 複数画像をまとめてリサイズ",
  description:
    "PNG・JPEG・WebPなど複数の画像を一括でリサイズ。Instagram・X・Facebookなどのプリセット付き。ブラウザ完結、無料、サーバー不要。",
  alternates: { canonical: "/tools/resize" },
  openGraph: {
    title: "一括リサイズ野郎 — 複数画像をまとめてリサイズ",
    description:
      "SNS向けプリセット付き。複数画像を一括リサイズ。ブラウザ完結・無料・サーバー不要。",
  },
  twitter: {
    card: "summary_large_image",
    title: "一括リサイズ野郎",
    description: "複数画像を一括リサイズ。Instagram・X・Facebookプリセット付き。",
  },
};

export default function ResizePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* ページヘッダー */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-muted mb-2">
          <a href="/" className="hover:text-foreground transition-colors">
            変換野郎
          </a>
          <span>/</span>
          <span>一括リサイズ野郎</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground mb-2">
          一括リサイズ<span className="text-accent">野郎</span>
        </h1>
        <p className="text-muted text-sm sm:text-base">
          複数の画像を一括でリサイズ。SNS向けプリセットとカスタムサイズに対応。
        </p>
      </div>

      {/* ヘッダー下広告 */}
      <AdBanner slot="resize-header" className="mb-8" />

      {/* リサイズツール本体 */}
      <ResizeConverter />

      {/* 変換後広告 */}
      <AdBanner slot="resize-post" className="mt-10" />

      {/* 使い方説明 */}
      <section className="mt-12 space-y-4">
        <h2 className="text-lg font-bold text-foreground">使い方</h2>
        <ol className="space-y-3 text-sm text-muted">
          <li className="flex gap-3">
            <span className="shrink-0 w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold">
              1
            </span>
            <span>サイズプリセットを選ぶか、カスタムで幅・高さを入力します。</span>
          </li>
          <li className="flex gap-3">
            <span className="shrink-0 w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold">
              2
            </span>
            <span>
              「比率維持」はアスペクト比を保ったまま内側に収め、余白を指定色で塗ります。「ストレッチ」は強制的に引き伸ばします。
            </span>
          </li>
          <li className="flex gap-3">
            <span className="shrink-0 w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold">
              3
            </span>
            <span>
              画像をドロップまたはファイル選択すると自動でリサイズされます。「保存」または「すべて保存」でダウンロード。
            </span>
          </li>
        </ol>
        <div className="mt-4 p-4 bg-surface border border-border rounded-xl text-sm text-muted">
          <p className="font-medium text-foreground mb-1">🔒 プライバシー安心</p>
          <p>すべての処理はあなたのブラウザ内で完結します。画像はサーバーに送信されません。</p>
        </div>
      </section>
    </div>
  );
}
