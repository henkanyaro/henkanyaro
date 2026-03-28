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
    <div
      className="max-w-3xl mx-auto px-4 sm:px-6 py-10"
      style={{ "--accent": "#7C3AED", "--accent-hover": "#6d28d9" } as React.CSSProperties}
    >
      {/* ページヘッダー */}
      <div
        className="mb-8 pl-4 border-l-4"
        style={{ borderLeftColor: "#7C3AED" }}
      >
        <div className="flex items-center gap-2 text-sm text-muted mb-2">
          <a href="/" className="hover:text-foreground transition-colors">
            変換野郎
          </a>
          <span>/</span>
          <span>コマ結合野郎</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground mb-2">
          コマ結合<span style={{ color: "#7C3AED" }}>野郎</span>
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
              「結合するコマ数」（2枚 or 3枚）を選んで、コマ画像をドロップまたはボタンで選択します。複数枚まとめて選択できます。
            </span>
          </li>
          <li className="flex gap-3">
            <span className="shrink-0 w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold">
              2
            </span>
            <span>
              ▲▼ボタンでコマの順番を調整します。指定したコマ数ごとに「ファイル1・ファイル2…」とグループ分けされてプレビューされます。
            </span>
          </li>
          <li className="flex gap-3">
            <span className="shrink-0 w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold">
              3
            </span>
            <span>
              「Nファイルを作成」を押すと縦結合されたファイルが生成されます。デフォルトで4ファイルずつ1投稿にまとまります。ファイル間の「ここで分ける／まとめる」で投稿グループを自由に変更できます。
            </span>
          </li>
          <li className="flex gap-3">
            <span className="shrink-0 w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold">
              4
            </span>
            <span>
              各ファイルを「保存」、または「すべて保存」で一括保存します。スマホでは保存時にX・Instagramなどのシェアシートが開きます。
            </span>
          </li>
          <li className="flex gap-3">
            <span className="shrink-0 w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold">
              5
            </span>
            <span>
              「X投稿用キャプション」では、作品名やハッシュタグを入力すると「新刊出ました！ 1/3」のようなキャプションが投稿ごとに自動生成されます。形式は 1/3・(1/3)・1枚目/3枚 から選択でき、個別コピーまたは「すべてコピー」で一括コピーできます。
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
