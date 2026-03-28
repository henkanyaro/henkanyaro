import type { Metadata } from "next";
import AdBanner from "@/components/AdBanner";
import StitchConverter from "@/components/tools/StitchConverter";

export const metadata: Metadata = {
  title: "Frame Stitcher — Henkan Yaro",
  description:
    "Stitch 2–3 Instagram comic frames vertically for X (Twitter) posts. Browser-only, free, no server needed.",
  alternates: {
    canonical: "/en/tools/resize",
    languages: {
      ja: "/tools/resize",
      en: "/en/tools/resize",
    },
  },
  openGraph: {
    title: "Frame Stitcher — Henkan Yaro",
    description:
      "Stitch Instagram comic frames for X posts. Works instantly in your browser.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Frame Stitcher — Henkan Yaro",
    description: "Stitch comic frames for X posts. Browser-only, free.",
  },
};

export default function StitchPageEn() {
  return (
    <div
      className="max-w-3xl mx-auto px-4 sm:px-6 py-10"
      style={{ "--accent": "#7C3AED", "--accent-hover": "#6d28d9" } as React.CSSProperties}
    >
      {/* Page header */}
      <div
        className="mb-8 pl-4 border-l-4"
        style={{ borderLeftColor: "#7C3AED" }}
      >
        <div className="flex items-center gap-2 text-sm text-muted mb-2">
          <a href="/en" className="hover:text-foreground transition-colors">
            Henkan Yaro
          </a>
          <span>/</span>
          <span>Frame Stitcher</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground mb-2">
          Frame <span style={{ color: "#7C3AED" }}>Stitcher</span>
        </h1>
        <p className="text-muted text-sm sm:text-base">
          Stitch 2–3 Instagram comic frames vertically to create images for X posts.
        </p>
      </div>

      {/* Ad banner */}
      <AdBanner slot="stitch-header" className="mb-8" />

      {/* Tool */}
      <StitchConverter />

      {/* Post-convert ad */}
      <AdBanner slot="stitch-post" className="mt-10" />

      {/* How to use */}
      <section className="mt-12 space-y-4">
        <h2 className="text-lg font-bold text-foreground">How to use</h2>
        <ol className="space-y-3 text-sm text-muted">
          <li className="flex gap-3">
            <span className="shrink-0 w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold">
              1
            </span>
            <span>
              Choose how many frames to stitch (2 or 3), then drop your frame
              images or click the button to select them. You can select multiple
              files at once.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="shrink-0 w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold">
              2
            </span>
            <span>
              Use the ▲▼ buttons to reorder frames. They are grouped into
              File 1, File 2… based on your chosen frame count and shown as
              previews.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="shrink-0 w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold">
              3
            </span>
            <span>
              Click &quot;Create N files&quot; to generate the stitched images.
              By default, every 4 files are grouped into one X post. Use the
              &quot;Split here / Merge&quot; toggle between files to customize
              your post groupings.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="shrink-0 w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold">
              4
            </span>
            <span>
              Save files individually or use &quot;Save all&quot; for bulk
              download. On mobile, saving opens the share sheet for X,
              Instagram, and more.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="shrink-0 w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold">
              5
            </span>
            <span>
              In the &quot;X post captions&quot; section, enter a title and
              hashtags to auto-generate captions like &quot;New release! 1/3&quot;
              for each post. Choose from 1/3, (1/3), or 1 of 3 formats, then
              copy individually or use &quot;Copy all&quot; for bulk copy.
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
