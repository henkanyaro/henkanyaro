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
            {/* 楽天アフィリエイト 商品ウィジェット 300×300 */}
            <div
              className="inline-block max-w-full overflow-x-auto"
              dangerouslySetInnerHTML={{
                __html: `<table border="0" cellpadding="0" cellspacing="0"><tr><td><div style="border:1px solid #95a5a6;border-radius:.75rem;background-color:#FFFFFF;width:624px;margin:0px;padding:5px;text-align:center;overflow:hidden;"><table><tr><td style="width:300px"><a href="https://hb.afl.rakuten.co.jp/ichiba/532b233c.93b25ab5.532b233e.65b2880c/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Feunicedress%2Feuni-239%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIzMDB4MzAwIiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D" target="_blank" rel="nofollow sponsored noopener" style="word-wrap:break-word;"><img src="https://hbb.afl.rakuten.co.jp/hgb/532b233c.93b25ab5.532b233e.65b2880c/?me_id=1346621&item_id=10002032&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%400_mall%2Feunicedress%2Fcabinet%2Fitem7%2Feuni-239-k.jpg%3F_ex%3D300x300&s=300x300&t=picttext" border="0" style="margin:2px" alt="[商品価格に関しましては、リンクが作成された時点と現時点で情報が変更されている場合がございます。]" title="[商品価格に関しましては、リンクが作成された時点と現時点で情報が変更されている場合がございます。]"></a></td><td style="vertical-align:top;width:308px;display: block;"><p style="font-size:12px;line-height:1.4em;text-align:left;margin:0px;padding:2px 6px;word-wrap:break-word"><a href="https://hb.afl.rakuten.co.jp/ichiba/532b233c.93b25ab5.532b233e.65b2880c/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Feunicedress%2Feuni-239%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIzMDB4MzAwIiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D" target="_blank" rel="nofollow sponsored noopener" style="word-wrap:break-word;">【先着クーポンで51％OFF】割れない鏡 全身鏡 軽量 省スペース 歪みほぼ無し クリーナークロス付き フィルムミラー インテリア ホワイト ナチュラル</a><br><span>価格：10,990円～（税込、送料別)</span> <span style="color:#BBB">(2026/4/25時点)</span></p><div style="margin:15px;"><a href="https://hb.afl.rakuten.co.jp/ichiba/532b233c.93b25ab5.532b233e.65b2880c/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Feunicedress%2Feuni-239%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIzMDB4MzAwIiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D" target="_blank" rel="nofollow sponsored noopener" style="word-wrap:break-word;"><img src="https://static.affiliate.rakuten.co.jp/makelink/rl.svg" style="float:left;max-height:27px;width:auto;margin-top:5px"></a><a href="https://hb.afl.rakuten.co.jp/ichiba/532b233c.93b25ab5.532b233e.65b2880c/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Feunicedress%2Feuni-239%2F%3Fscid%3Daf_pc_bbtn&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIzMDB4MzAwIiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ==" target="_blank" rel="nofollow sponsored noopener" style="word-wrap:break-word;"><div style="float:right;width:50%;height:32px;background-color:#bf0000;color:#fff!important;font-size:14px;font-weight:500;line-height:32px;margin-left:1px;padding:0 12px;border-radius:16px;cursor:pointer;text-align:center;">楽天で購入</div></a></div></td></tr></table></div><br><p style="color:#000000;font-size:12px;line-height:1.4em;margin:5px;word-wrap:break-word"></p></td></tr></table>`,
              }}
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
