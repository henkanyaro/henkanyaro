import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "変換野郎とは — サイトについて",
  description:
    "変換野郎は、漫画家・イラストレーター・デザイナーのために作られた無料ブラウザツール集です。インストール不要で、画像はサーバーに送信されません。",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      {/* ページヘッダー */}
      <div className="mb-10">
        <div className="flex items-center gap-2 text-sm text-muted mb-3">
          <a href="/" className="hover:text-foreground transition-colors">
            変換野郎
          </a>
          <span>/</span>
          <span>変換野郎とは</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">
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
          とは
        </h1>
        <p className="text-muted text-base sm:text-lg leading-relaxed">
          クリエイターのための、ブラウザで完結する画像ツール集です。
        </p>
      </div>

      <div className="space-y-10 text-sm sm:text-base text-foreground leading-relaxed">
        {/* コンセプト */}
        <section>
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
            <span
              className="w-1 h-5 rounded-full inline-block shrink-0"
              style={{ background: "linear-gradient(180deg, #FF6B35, #7C3AED)" }}
            />
            コンセプト
          </h2>
          <p className="text-muted">
            変換野郎は、漫画家・イラストレーター・デザイナーが日々の作業でよく使う「画像の変換・加工」をブラウザだけで手軽に行えるよう設計されています。アプリのインストールは一切不要で、URLにアクセスするだけですぐ使えます。
          </p>
          <p className="text-muted mt-3">
            すべての処理はあなたのブラウザ内で完結するため、画像がサーバーに送信されることはありません。プライバシーを守りながら、安心して使えることを最優先に設計しています。もちろん完全無料です。
          </p>
        </section>

        {/* ツール紹介 */}
        <section>
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span
              className="w-1 h-5 rounded-full inline-block shrink-0"
              style={{ background: "linear-gradient(180deg, #FF6B35, #7C3AED)" }}
            />
            収録ツール
          </h2>

          <div className="space-y-4">
            <div className="p-5 bg-surface border-l-4 border border-border rounded-xl" style={{ borderLeftColor: "#FF6B35" }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🖼️</span>
                <h3 className="font-bold text-foreground">
                  <Link href="/tools/png-to-jpeg" className="hover:underline" style={{ color: "#FF6B35" }}>
                    一括JPEG変換野郎
                  </Link>
                </h3>
              </div>
              <p className="text-muted text-sm">
                PNG・WebP・GIFなどの画像を複数まとめてJPEGに変換できるツールです。Instagramへの投稿や、ウェブ用の画像最適化によく使われます。品質スライダーで圧縮率を自由に調整でき、透過部分の背景色も指定可能。変換後はまとめてダウンロードできます。
              </p>
            </div>

            <div className="p-5 bg-surface border-l-4 border border-border rounded-xl" style={{ borderLeftColor: "#7C3AED" }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🔗</span>
                <h3 className="font-bold text-foreground">
                  <Link href="/tools/resize" className="hover:underline" style={{ color: "#7C3AED" }}>
                    コマ結合野郎
                  </Link>
                </h3>
              </div>
              <p className="text-muted text-sm">
                インスタグラム用の正方形コマ画像を2〜3枚縦につなげて、X（Twitter）投稿に最適な縦長画像を作成するツールです。複数ファイルを一気にアップロードすれば自動でグループ化され、4ファイルごとに1投稿としてまとめます。「1/3」「(1/3)」などの連番キャプションも自動生成できるため、ツリー投稿の準備がスムーズに行えます。
              </p>
            </div>
          </div>
        </section>

        {/* 今後のツール */}
        <section>
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
            <span
              className="w-1 h-5 rounded-full inline-block shrink-0"
              style={{ background: "linear-gradient(180deg, #FF6B35, #7C3AED)" }}
            />
            今後追加予定のツール
          </h2>
          <p className="text-muted">
            一括リサイズ・WebP変換・画像の結合（横方向）など、クリエイターの声をもとに便利なツールを順次追加していく予定です。要望があればお気軽にお問い合わせください。
          </p>
        </section>

        {/* お問い合わせ */}
        <section className="pt-4 border-t border-border">
          <p className="text-muted">
            ご意見・ご要望・バグ報告などは
            <Link
              href="/contact"
              className="font-medium mx-1 hover:underline"
              style={{ color: "#FF6B35" }}
            >
              お問い合わせフォーム
            </Link>
            からお気軽にどうぞ。
          </p>
        </section>
      </div>
    </div>
  );
}
