"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header() {
  const pathname = usePathname();
  const isEn = pathname.startsWith("/en");

  return (
    <header className="sticky top-0 z-50 bg-surface border-b border-border backdrop-blur-sm bg-white/90">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link
          href={isEn ? "/en" : "/"}
          className="text-lg font-bold tracking-tight text-foreground hover:text-accent transition-colors"
        >
          {isEn ? "Henkan Yaro" : "変換野郎"}
        </Link>
        <nav className="flex items-center gap-6">
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
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  );
}
