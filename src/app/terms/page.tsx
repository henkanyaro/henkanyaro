import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "利用規約",
  description:
    "変換野郎の利用規約です。サービスの利用条件・禁止事項・免責事項についてご確認ください。",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground mb-2">
        利用<span className="text-accent">規約</span>
      </h1>
      <p className="text-muted text-sm mb-12">最終更新日：2026年3月28日</p>

      <div className="space-y-10 text-foreground">
        <section>
          <p className="leading-relaxed text-muted">
            本利用規約（以下「本規約」）は、変換野郎（以下「当サイト」）が提供するサービスの利用条件を定めるものです。ユーザーの皆さまには、本規約に同意いただいた上でご利用いただきます。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3 pb-2 border-b border-border">
            サービスの内容
          </h2>
          <p className="leading-relaxed text-muted">
            当サイトは、画像変換・リサイズ・結合などの画像処理ツールを無料で提供しています。すべての処理はブラウザ上で完結し、画像データがサーバーに送信されることはありません。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3 pb-2 border-b border-border">
            禁止事項
          </h2>
          <p className="leading-relaxed text-muted mb-3">
            当サイトの利用にあたり、以下の行為を禁止します。
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted">
            <li>法令または公序良俗に違反する行為</li>
            <li>当サイトのサービスを妨害する行為</li>
            <li>当サイトのコンテンツを無断で複製・転載・改変する行為</li>
            <li>当サイトを通じて第三者の権利を侵害する行為</li>
            <li>その他、当サイト運営者が不適切と判断する行為</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3 pb-2 border-b border-border">
            知的財産権
          </h2>
          <p className="leading-relaxed text-muted">
            当サイトに掲載されているコンテンツ（テキスト・デザイン・ソースコード等）の知的財産権は、当サイト運営者または正当な権利者に帰属します。無断での複製・転用はお断りしています。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3 pb-2 border-b border-border">
            免責事項
          </h2>
          <p className="leading-relaxed text-muted mb-3">
            当サイトのサービスは現状有姿で提供されます。サービスの正確性・完全性・安全性を保証するものではなく、利用によって生じたいかなる損害についても当サイト運営者は責任を負いません。
          </p>
          <p className="leading-relaxed text-muted">
            システムメンテナンス・障害・その他の事情により、予告なくサービスを停止・変更・終了する場合があります。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3 pb-2 border-b border-border">
            外部リンクについて
          </h2>
          <p className="leading-relaxed text-muted">
            当サイトから外部サイトへのリンクが含まれる場合がありますが、外部サイトのコンテンツや安全性について当サイトは責任を負いません。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3 pb-2 border-b border-border">
            規約の変更
          </h2>
          <p className="leading-relaxed text-muted">
            当サイト運営者は、必要に応じて本規約を変更することがあります。変更後の規約は当ページに掲載した時点で効力を生じます。定期的にご確認ください。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3 pb-2 border-b border-border">
            お問い合わせ
          </h2>
          <p className="leading-relaxed text-muted">
            本規約に関するお問い合わせは、サイト内お問い合わせフォームよりご連絡ください。
          </p>
        </section>
      </div>
    </div>
  );
}
