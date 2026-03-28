"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import ShareButtons from "./ShareButtons";

export default function Header() {
  const pathname = usePathname();
  const isEn = pathname.startsWith("/en");

  return (
    <header className="sticky top-0 z-50 bg-surface border-b border-border backdrop-blur-sm bg-white/90">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link href={isEn ? "/en" : "/"} className="text-lg font-bold tracking-tight">
          <span
            style={{
              background: "linear-gradient(90deg, #FF6B35 0%, #7C3AED 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {isEn ? "Henkan Yaro" : "変換野郎"}
          </span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href={isEn ? "/en#tools" : "/#tools"}
            className="text-sm text-muted hover:text-foreground transition-colors"
          >
            {isEn ? "Tools" : "ツール一覧"}
          </Link>
          <Link
            href="/contact"
            className="text-sm text-muted hover:text-foreground transition-colors"
          >
            {isEn ? "Contact" : "お問い合わせ"}
          </Link>
          {!isEn && (
            <>
              <div className="w-px h-4 bg-border" />
              <ShareButtons compact />
            </>
          )}
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  );
}
