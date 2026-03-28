import type { Metadata } from "next";
import AdBanner from "@/components/AdBanner";
import PngToJpegConverter from "@/components/tools/PngToJpegConverter";
import ShareButtons from "@/components/ShareButtons";

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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* ページヘッダー */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-muted mb-2">
          <a href="/" className="hover:text-foreground transition-colors">
            変換野郎
          </a>
          <span>/</span>
          <span>一括JPEG変換野郎</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground mb-2">
          一括JPEG変換<span className="text-accent">野郎</span>
        </h1>
        <p className="text-muted text-sm sm:text-base">
          PNG・WebP・GIF などの画像をまとめてJPEGに変換。品質と背景色を指定できます。
        </p>
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

      {/* シェアボタン */}
      <section className="mt-12 text-center">
        <p className="text-xs font-medium text-muted mb-4">このツールをシェア</p>
        <ShareButtons
          url="/tools/png-to-jpeg"
          title="一括JPEG変換野郎 — PNGをまとめてJPEGに変換"
        />
      </section>
    </div>
  );
}
