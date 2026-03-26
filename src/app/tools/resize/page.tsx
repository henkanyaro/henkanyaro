import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "一括リサイズ野郎 — 近日公開",
  description:
    "複数の画像を指定サイズ・比率で一括リサイズできるツールです。現在開発中。変換野郎の他のツールをご利用ください。",
  alternates: { canonical: "/tools/resize" },
  robots: { index: false },
};

export default function ResizePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-muted mb-2">
          <a href="/" className="hover:text-foreground transition-colors">
            変換野郎
          </a>
          <span>/</span>
          <span>一括リサイズ野郎</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground mb-2">
          一括リサイズ<span className="text-accent">野郎</span>
        </h1>
      </div>

      <div className="rounded-2xl border border-dashed border-border bg-surface p-16 text-center">
        <div className="text-5xl mb-6">📐</div>
        <h2 className="text-xl font-bold text-foreground mb-3">近日公開</h2>
        <p className="text-muted text-sm max-w-sm mx-auto mb-8">
          複数画像の一括リサイズ機能を開発中です。しばらくお待ちください。
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-hover active:scale-95 transition-all min-h-[44px]"
        >
          ← ツール一覧へ
        </Link>
      </div>
    </div>
  );
}
