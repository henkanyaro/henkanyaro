import type { Metadata } from "next";
import AdBanner from "@/components/AdBanner";
import PngToJpegConverter from "@/components/tools/PngToJpegConverter";

export const metadata: Metadata = {
  title: "Bulk JPEG Converter - Henkan Yaro",
  description:
    "Free bulk PNG to JPEG converter for creators. Convert PNG, WebP, GIF and more to JPEG in your browser instantly. No install, no server.",
  alternates: {
    canonical: "/en/tools/png-to-jpeg",
    languages: {
      ja: "/tools/png-to-jpeg",
      en: "/en/tools/png-to-jpeg",
    },
  },
  openGraph: {
    title: "Bulk JPEG Converter - Henkan Yaro",
    description:
      "Free bulk PNG to JPEG converter for creators. Works instantly in your browser.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bulk JPEG Converter - Henkan Yaro",
    description:
      "Free bulk PNG to JPEG converter. Browser-only, no install needed.",
  },
};

export default function PngToJpegPageEn() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* Page header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-muted mb-2">
          <a href="/en" className="hover:text-foreground transition-colors">
            Henkan Yaro
          </a>
          <span>/</span>
          <span>Bulk JPEG Converter</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground mb-2">
          Bulk JPEG <span className="text-accent">Converter</span>
        </h1>
        <p className="text-muted text-sm sm:text-base">
          Convert PNG, WebP, GIF and more to JPEG in bulk. Adjust quality and
          background color.
        </p>
      </div>

      {/* Ad banner */}
      <AdBanner slot="header-bottom" className="mb-8" />

      {/* Converter */}
      <PngToJpegConverter />

      {/* Post-convert ad */}
      <AdBanner slot="post-convert" className="mt-10" />

      {/* How to use */}
      <section className="mt-12 space-y-4">
        <h2 className="text-lg font-bold text-foreground">How to use</h2>
        <ol className="space-y-3 text-sm text-muted">
          <li className="flex gap-3">
            <span className="shrink-0 w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold">
              1
            </span>
            <span>
              Drag &amp; drop your images or click &quot;Select Files&quot;.
              Multiple files are supported.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="shrink-0 w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold">
              2
            </span>
            <span>
              Set JPEG quality (10–100%) and background color for transparent
              areas. Defaults: 85% quality, white background.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="shrink-0 w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold">
              3
            </span>
            <span>
              Conversion starts automatically. Download files individually or
              use &quot;Download All&quot; for bulk download.
            </span>
          </li>
        </ol>
        <div className="mt-4 p-4 bg-surface border border-border rounded-xl text-sm text-muted">
          <p className="font-medium text-foreground mb-1">🔒 Privacy first</p>
          <p>
            All processing happens entirely in your browser. Your images are
            never sent to any server.
          </p>
        </div>
      </section>
    </div>
  );
}
