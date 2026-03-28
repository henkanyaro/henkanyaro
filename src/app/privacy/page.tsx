import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description:
    "変換野郎のプライバシーポリシーです。広告配信・アクセス解析・免責事項についてご説明します。",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground mb-2">
        プライバシー<span className="text-accent">ポリシー</span>
      </h1>
      <p className="text-muted text-sm mb-12">最終更新日：2026年3月28日</p>

      <div className="space-y-10 text-foreground">
        <section>
          <p className="leading-relaxed">
            変換野郎（以下「当サイト」）は、ユーザーの個人情報の取り扱いについて、以下のとおりプライバシーポリシーを定めます。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3 pb-2 border-b border-border">
            広告の配信について（Google AdSense）
          </h2>
          <p className="leading-relaxed text-muted mb-3">
            当サイトは、Google LLC が提供する広告配信サービス「Google
            AdSense」を利用しています。Google
            AdSense は、ユーザーの興味に合わせた広告を表示するために、Cookie
            を使用することがあります。
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted">
            <li>
              Cookie によって収集される情報には、氏名・住所・メールアドレス・電話番号は含まれません。
            </li>
            <li>
              ブラウザの設定により Cookie を無効にすることで、情報収集を拒否することができます。
            </li>
            <li>
              Google による広告の配信方法や Cookie の使用方法については、
              <a
                href="https://policies.google.com/technologies/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline underline-offset-2 hover:text-accent-hover"
              >
                Google のポリシーと規約
              </a>
              をご確認ください。
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3 pb-2 border-b border-border">
            アクセス解析ツールについて
          </h2>
          <p className="leading-relaxed text-muted mb-3">
            当サイトでは、サービス改善を目的としてアクセス解析ツールを使用する場合があります。このツールはトラフィックデータの収集のために Cookie
            を使用しています。
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted">
            <li>収集されるデータは匿名であり、個人を特定するものではありません。</li>
            <li>Cookie を無効にすることで、データ収集を拒否することができます。</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3 pb-2 border-b border-border">
            免責事項
          </h2>
          <p className="leading-relaxed text-muted mb-3">
            当サイトのコンテンツ・情報については、できる限り正確な情報を掲載するよう努めておりますが、正確性・安全性を保証するものではありません。
          </p>
          <p className="leading-relaxed text-muted mb-3">
            当サイトのツールは、すべてブラウザ上で動作しサーバーへのデータ送信は行いませんが、利用によって生じたいかなる損害・損失についても、当サイト運営者は一切の責任を負いかねます。
          </p>
          <p className="leading-relaxed text-muted">
            また、当サイトからリンクされた外部サイトについては、当サイトの管理下にないため、その内容や安全性について責任を負いません。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3 pb-2 border-b border-border">
            お問い合わせ
          </h2>
          <p className="leading-relaxed text-muted">
            当サイトのプライバシーポリシーに関するお問い合わせは、サイト内お問い合わせフォームよりご連絡ください。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3 pb-2 border-b border-border">
            プライバシーポリシーの改定について
          </h2>
          <p className="leading-relaxed text-muted">
            当サイトは、必要に応じて本プライバシーポリシーを改定することがあります。改定後のポリシーは、当ページに掲載した時点で効力を生じるものとします。定期的にご確認いただくことをお勧めします。
          </p>
        </section>
      </div>
    </div>
  );
}
