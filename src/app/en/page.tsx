import type { Metadata } from "next";
import Link from "next/link";
import { toolsEn } from "@/data/tools.en";
import ToolCard from "@/components/ToolCard";

export const metadata: Metadata = {
  title: "Henkan Yaro — Free Image Tools for Creators",
  description:
    "Free bulk image converter and other browser-based tools for creators. No install needed, works instantly in your browser.",
  alternates: {
    canonical: "/en",
    languages: {
      ja: "/",
      en: "/en",
    },
  },
  openGraph: {
    title: "Henkan Yaro — Free Image Tools for Creators",
    description:
      "Free bulk image converter and other browser-based tools for creators. No install needed.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Henkan Yaro — Free Image Tools for Creators",
    description:
      "Free browser-based image tools for creators. No install needed.",
  },
};

export default function HomePageEn() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-12 text-center">
        <div className="flex justify-center gap-4 text-sm text-muted mb-6">
          <Link href="/" className="hover:text-foreground transition-colors">
            日本語
          </Link>
          <span className="font-medium text-foreground">English</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground mb-4">
          Henkan<span className="text-accent"> Yaro</span>
        </h1>
        <p className="text-muted text-base sm:text-lg max-w-xl mx-auto">
          Simple, blazing-fast image tools for creators.
          <br />
          Browser-only · Free · No server needed.
        </p>
      </div>

      <div id="tools" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {toolsEn.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
}
