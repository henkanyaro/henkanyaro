import type { Metadata } from "next";
import AdBanner from "@/components/AdBanner";
import PngToJpegConverter from "@/components/tools/PngToJpegConverter";

export const metadata: Metadata = {
  title: "一括JPEG変換野郎 — PNGをまとめてJPEGに変換",
  description:
    "PNG・WebP・GIFなど複数の画像を一括でJPEGに変換。ブラウザ完結、無料、サーバー不要。品質・背景色も自由に設定可能。",
  alternates: {
    canonical: "/tools/png-to-jpeg",
    languages: {
      ja: "/tools/png-to-jpeg",
      en: "/en/tools/png-to-jpeg",
    },
  },
  openGraph: {
    title: "一括JPEG変換野郎 — PNGをまとめてJPEGに変換",
    description:
      "PNG・WebP・GIFなど複数の画像を一括でJPEGに変換。ブラウザ完結、無料、サーバー不要。",
  },
  twitter: {
    card: "summary_large_image",
    title: "一括JPEG変換野郎",
    description: "PNGをまとめてJPEGに変換。ブラウザ完結・無料。",
  },
};

export default function PngToJpegPage() {
  return (
    <div
      className="max-w-3xl mx-auto px-4 sm:px-6 py-10"
      style={{ "--accent": "#FF6B35", "--accent-hover": "#e85e28" } as React.CSSProperties}
    >
      {/* ページヘッダー */}
      <div
        className="mb-8 pl-4 border-l-4"
        style={{ borderLeftColor: "#FF6B35" }}
      >
        <div className="flex items-center gap-2 text-sm text-muted mb-2">
          <a href="/" className="hover:text-foreground transition-colors">
            変換野郎
          </a>
          <span>/</span>
          <span>一括JPEG変換野郎</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground mb-2">
          一括JPEG変換<span style={{ color: "#FF6B35" }}>野郎</span>
        </h1>
        <p className="text-muted text-sm sm:text-base">
          PNG・WebP・GIF などの画像をまとめてJPEGに変換。品質と背景色を指定できます。
        </p>
      </div>

      {/* ツール説明 */}
      <div className="mb-8 p-5 bg-surface border border-border rounded-xl">
        <p className="text-sm text-muted leading-relaxed mb-4">
          PNGをJPEGに一括変換できる無料ツールです。Instagramに投稿したい画像をまとめてJPEG化したいときに便利。ブラウザだけで動作し、画像はサーバーに送信されません。
        </p>
        <ul className="grid grid-cols-2 gap-2">
          {[
            "複数ファイル同時変換",
            "画質を自由に調整",
            "完全ブラウザ処理",
            "無料・登録不要",
          ].map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm text-muted">
              <span className="shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: "#FF6B35" }}>
                ✓
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* ヘッダー下広告 */}
      <AdBanner slot="header-bottom" className="mb-8" />

      {/* コンバーター本体 */}
      <PngToJpegConverter />

      {/* 変換完了後広告 */}
      <AdBanner slot="post-convert" className="mt-10" />

      {/* 使い方説明 */}
      <section className="mt-12 space-y-4">
        <h2 className="text-lg font-bold text-foreground">使い方</h2>
        <ol className="space-y-3 text-sm text-muted">
          <li className="flex gap-3">
            <span className="shrink-0 w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold">
              1
            </span>
            <span>変換したい画像をドラッグ＆ドロップするか「ファイルを選択」ボタンで選択します。複数ファイル同時選択可能。</span>
          </li>
          <li className="flex gap-3">
            <span className="shrink-0 w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold">
              2
            </span>
            <span>JPEG品質（10〜100%）と透過部分の背景色を設定します。デフォルトは品質85%・白背景。</span>
          </li>
          <li className="flex gap-3">
            <span className="shrink-0 w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold">
              3
            </span>
            <span>変換は自動で始まります。完了したファイルから個別にダウンロード、または「すべてDL」で一括ダウンロード。</span>
          </li>
        </ol>
        <div className="mt-4 p-4 bg-surface border border-border rounded-xl text-sm text-muted">
          <p className="font-medium text-foreground mb-1">🔒 プライバシー安心</p>
          <p>すべての処理はあなたのブラウザ内で完結します。画像はサーバーに送信されません。</p>
        </div>
      </section>

      {/* よくある質問 */}
      <section className="mt-12 space-y-4">
        <h2 className="text-lg font-bold text-foreground">よくある質問</h2>
        <div className="space-y-3">
          {[
            {
              q: "変換した画像の画質は落ちますか？",
              a: "画質スライダーで調整できます。デフォルトの90%は高画質で、ほとんどの用途で劣化を気にせず使えます。低い値ほどファイルサイズが小さくなります。",
            },
            {
              q: "何枚まで変換できますか？",
              a: "枚数制限はありません。ただし大量の画像を一度に処理するとブラウザのメモリを消費するため、数十枚ずつに分けてご利用いただくのがおすすめです。",
            },
            {
              q: "変換した画像はどこに保存されますか？",
              a: "ダウンロードボタンを押すとお使いのデバイスに直接保存されます。画像はサーバーには送信されず、ブラウザの外に出ることはありません。",
            },
          ].map(({ q, a }) => (
            <div key={q} className="p-4 bg-surface border border-border rounded-xl">
              <dt className="text-sm font-semibold text-foreground mb-1.5">Q. {q}</dt>
              <dd className="text-sm text-muted">A. {a}</dd>
            </div>
          ))}
        </div>
      </section>

      {/* こんな用途に */}
      <section className="mt-12 space-y-3">
        <h2 className="text-lg font-bold text-foreground">こんな用途に使われています</h2>
        <ul className="space-y-2 text-sm text-muted">
          {[
            "Instagram投稿用にPNG画像をまとめてJPEG化",
            "ウェブサイト掲載用の画像を軽量化",
            "透過PNGに白背景を合成してJPEGに変換",
            "クライアント納品用に画質を統一して一括変換",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-0.5 shrink-0" style={{ color: "#FF6B35" }}>▸</span>
              {item}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
