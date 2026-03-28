"use client";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const isEn = pathname.startsWith("/en");

  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
<div className="mb-6 p-4 rounded-lg border border-dashed border-border text-center text-sm text-muted">
          <p className="font-medium text-muted">
            {isEn ? "Recommended Design Tools" : "おすすめデザインツール"}
          </p>
          <p className="text-xs mt-1 text-border">
            {isEn ? "Affiliate link area" : "アフィリエイトリンクエリア"}
          </p>
        </div>
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
