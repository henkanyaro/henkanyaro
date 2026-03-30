"use client";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header() {
  const pathname = usePathname();
  const isEn = pathname.startsWith("/en");
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* ロゴ */}
        <Link
          href={isEn ? "/en" : "/"}
          className="text-lg font-bold tracking-tight shrink-0"
          onClick={closeMenu}
        >
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

        {/* デスクトップナビ */}
        <nav className="hidden sm:flex items-center gap-4">
          <Link
            href={isEn ? "/en#tools" : "/#tools"}
            className="text-sm text-muted hover:text-foreground transition-colors"
          >
            {isEn ? "Tools" : "ツール一覧"}
          </Link>
          {!isEn && (
            <Link
              href="/about"
              className="text-sm text-muted hover:text-foreground transition-colors"
            >
              About
            </Link>
          )}
          <Link
            href="/contact"
            className="text-sm text-muted hover:text-foreground transition-colors"
          >
            {isEn ? "Contact" : "お問い合わせ"}
          </Link>
          <LanguageSwitcher />
        </nav>

        {/* モバイル右側：言語切替 + ハンバーガー */}
        <div className="flex sm:hidden items-center gap-2">
          <LanguageSwitcher />
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors"
            aria-label={menuOpen ? "メニューを閉じる" : "メニューを開く"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-5 h-5 text-foreground">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-5 h-5 text-foreground">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* モバイルドロップダウンメニュー */}
      {menuOpen && (
        <div className="sm:hidden border-t border-border bg-white/98 backdrop-blur-sm">
          <nav className="px-4 py-3 flex flex-col">
            <Link
              href={isEn ? "/en#tools" : "/#tools"}
              onClick={closeMenu}
              className="py-3 text-sm font-medium text-foreground border-b border-border"
            >
              {isEn ? "Tools" : "ツール一覧"}
            </Link>
            {!isEn && (
              <Link
                href="/about"
                onClick={closeMenu}
                className="py-3 text-sm font-medium text-foreground border-b border-border"
              >
                About
              </Link>
            )}
            <Link
              href="/contact"
              onClick={closeMenu}
              className="py-3 text-sm font-medium text-foreground"
            >
              {isEn ? "Contact" : "お問い合わせ"}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
