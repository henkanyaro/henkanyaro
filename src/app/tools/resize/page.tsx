import type { Metadata } from "next";
import AdBanner from "@/components/AdBanner";
import StitchConverter from "@/components/tools/StitchConverter";

export const metadata: Metadata = {
  title: "コマ結合野郎 — インスタコマをX投稿用に縦結合",
  description:
    "インスタグラム用のコマ画像を2〜3枚縦につなげてX（Twitter）投稿用画像を作成。ブラウザ完結、無料、サーバー不要。",
  alternates: { canonical: "/tools/resize" },
  openGraph: {
    title: "コマ結合野郎 — インスタコマをX投稿用に縦結合",
    description:
      "インスタ用コマを2〜3枚縦結合してX投稿用画像を作成。ブラウザ完結・無料。",
  },
  twitter: {
    card: "summary_large_image",
    title: "コマ結合野郎",
    description: "インスタコマをX投稿用に縦結合。ブラウザ完結・無料。",
  },
};

export default function StitchPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* ページヘッダー */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-muted mb-2">
          <a href="/" className="hover:text-foreground transition-colors">
            変換野郎
          </a>
          <span>/</span>
          <span>コマ結合野郎</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground mb-2">
          コマ結合<span className="text-accent">野郎</span>
        </h1>
        <p className="text-muted text-sm sm:text-base">
          インスタグラム用のコマ画像を2〜3枚縦につなげて、X投稿用の画像を作成します。
        </p>
      </div>

      {/* ヘッダー下広告 */}
      <AdBanner slot="stitch-header" className="mb-8" />

      {/* コマ結合ツール本体 */}
      <StitchConverter />

      {/* 結合後広告 */}
      <AdBanner slot="stitch-post" className="mt-10" />

      {/* 使い方説明 */}
      <section className="mt-12 space-y-4">
        <h2 className="text-lg font-bold text-foreground">使い方</h2>
        <ol className="space-y-3 text-sm text-muted">
          <li className="flex gap-3">
            <span className="shrink-0 w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold">
              1
            </span>
            <span>
              1投稿あたりのコマ数（2枚 or 3枚）を選び、インスタ用のコマ画像をドロップまたは選択します。
            </span>
          </li>
          <li className="flex gap-3">
            <span className="shrink-0 w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold">
              2
            </span>
            <span>
              ▲▼ボタンでコマの順番を調整します。自動でグループ分け（投稿1・投稿2…）が表示されます。
            </span>
          </li>
          <li className="flex gap-3">
            <span className="shrink-0 w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold">
              3
            </span>
            <span>
              「投稿用画像を作成」ボタンを押すと縦結合された画像が生成されます。各投稿ごとに「保存」、または「すべて保存」で一括保存。
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
