"use client";
import { usePathname } from "next/navigation";
import ShareButtons from "@/components/ShareButtons";

export default function Footer() {
  const pathname = usePathname();
  const isEn = pathname.startsWith("/en");

  return (
    <footer className="mt-auto bg-surface">
      {/* グラデーション上ボーダー */}
      <div
        className="h-[3px] w-full"
        style={{
          background: "linear-gradient(90deg, #FF6B35 0%, #7C3AED 100%)",
        }}
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {!isEn && (
          <div className="mb-8 text-center">
            <p className="text-xs font-medium text-muted mb-4">このサイトをシェア</p>
            <ShareButtons />
          </div>
        )}
        {!isEn && (
          <div className="mb-6 text-center">
            <p className="text-xs text-muted mb-2">
              おすすめ <span className="border border-border rounded px-1 py-0.5 text-[10px]">PR</span>
            </p>
            {/* 楽天ブックス アフィリエイトバナー 468×60 */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <a
              href="https://rpx.a8.net/svt/ejp?a8mat=4AZQGO+CWZK8I+2HOM+6Z77L&rakuten=y&a8ejpredirect=http%3A%2F%2Fhb.afl.rakuten.co.jp%2Fhsc%2F0eb47f9f.7c63de63.0eb47f9e.272ecae3%2Fa26032895294_4AZQGO_CWZK8I_2HOM_6Z77L"
              rel="nofollow"
              target="_blank"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="http://hbb.afl.rakuten.co.jp/hsb/0eb47faa.ef0bb625.0eb47f9e.272ecae3/"
                alt="楽天ブックス"
                width={468}
                height={60}
                className="inline-block max-w-full"
              />
            </a>
            {/* トラッキングピクセル */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              width={1}
              height={1}
              src="https://www14.a8.net/0.gif?a8mat=4AZQGO+CWZK8I+2HOM+6Z77L"
              alt=""
              style={{ border: 0 }}
            />
          </div>
        )}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
          <p>© {new Date().getFullYear()} {isEn ? "Henkan Yaro" : "変換野郎"}</p>
          <div className="flex gap-4">
            <a href="/contact" className="hover:text-foreground transition-colors">
              {isEn ? "Contact" : "お問い合わせ"}
            </a>
            <a
              href={isEn ? "/en/privacy" : "/privacy"}
              className="hover:text-foreground transition-colors"
            >
              {isEn ? "Privacy Policy" : "プライバシーポリシー"}
            </a>
            <a href="/terms" className="hover:text-foreground transition-colors">
              {isEn ? "Terms of Service" : "利用規約"}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
