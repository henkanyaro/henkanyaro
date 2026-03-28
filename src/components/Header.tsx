import Link from "next/link";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-surface border-b border-border backdrop-blur-sm bg-white/90">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-foreground hover:text-accent transition-colors"
        >
          変換野郎
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/#tools"
            className="text-sm text-muted hover:text-foreground transition-colors"
          >
            ツール一覧
          </Link>
          <Link
            href="/contact"
            className="text-sm text-muted hover:text-foreground transition-colors"
          >
            お問い合わせ
          </Link>
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  );
}
