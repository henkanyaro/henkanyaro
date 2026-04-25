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

      {/* ツール説明 */}
      <div className="mb-8 p-5 bg-surface border border-border rounded-xl">
        <p className="text-sm text-muted leading-relaxed mb-4">
          漫画のコマ画像を結合してSNS投稿用の縦長画像を作成できる無料ツールです。XやInstagramのツリー投稿・スライド投稿に最適。4枚ごとに自動グループ分けされ、連番キャプションも自動生成します。
        </p>
        <ul className="grid grid-cols-2 gap-2">
          {[
            "複数コマを縦に結合",
            "4枚ごと自動グループ化",
            "X投稿用キャプション自動生成",
            "完全ブラウザ処理・無料",
          ].map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm text-muted">
              <span className="shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: "#7C3AED" }}>
                ✓
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* ヘッダー下広告 */}
      <AdBanner slot="stitch-header" className="mb-8" />

      {/* コマ結合ツール本体 */}
      <StitchConverter />

      {/* 結合後広告 */}
      <AdBanner slot="stitch-post" className="mt-10" placeholder />

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

      {/* よくある質問 */}
      <section className="mt-12 space-y-4">
        <h2 className="text-lg font-bold text-foreground">よくある質問</h2>
        <div className="space-y-3">
          {[
            {
              q: "対応している画像形式は？",
              a: "PNG・JPEG・WebPに対応しています。Instagramで使われる正方形画像であれば、ほとんどの形式に対応しています。",
            },
            {
              q: "何枚まで結合できますか？",
              a: "枚数制限はありません。アップロードした画像は4枚ごとに自動でグループ化されます。大量にアップロードしても問題なく処理できます。",
            },
            {
              q: "Instagramにも使えますか？",
              a: "はい。スマートフォンのブラウザでご利用の場合、Web Share APIを使ってInstagramアプリへの直接共有が可能です（モバイルのみ対応）。",
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
            "漫画のツリー投稿用に複数コマをまとめて結合",
            "Instagram縦スクロール漫画をX用にリパッケージ",
            "スライドショー形式のポスト画像を一括作成",
            "連番キャプション付きでX複数投稿を効率化",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-0.5 shrink-0" style={{ color: "#7C3AED" }}>▸</span>
              {item}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
