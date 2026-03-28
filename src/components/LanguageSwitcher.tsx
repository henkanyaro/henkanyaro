"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

// Japanese paths that have a corresponding English version
const EN_PAGES = ["/", "/tools/png-to-jpeg", "/privacy"];

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const isEnglish = pathname.startsWith("/en");

  if (isEnglish) {
    const jaPath = pathname.replace(/^\/en/, "") || "/";
    return (
      <div className="flex items-center gap-1 text-sm">
        <Link
          href={jaPath}
          className="text-muted hover:text-foreground transition-colors"
        >
          日本語
        </Link>
        <span className="text-border px-1">|</span>
        <span className="font-medium text-foreground">EN</span>
      </div>
    );
  }

  const enPath = EN_PAGES.includes(pathname)
    ? `/en${pathname === "/" ? "" : pathname}`
    : "/en";

  return (
    <div className="flex items-center gap-1 text-sm">
      <span className="font-medium text-foreground">日本語</span>
      <span className="text-border px-1">|</span>
      <Link
        href={enPath}
        className="text-muted hover:text-foreground transition-colors"
      >
        EN
      </Link>
    </div>
  );
}
