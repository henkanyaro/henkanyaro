import Link from "next/link";
import type { Tool } from "@/data/tools";

export default function ToolCard({ tool }: { tool: Tool }) {
  const inner = (
    <div
      className={`group relative bg-surface border border-border rounded-2xl p-6 transition-all duration-200 ${
        tool.available
          ? "hover:border-accent hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
          : "opacity-60 cursor-default"
      }`}
    >
      {tool.badge && (
        <span className="absolute top-4 right-4 text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-muted">
          {tool.badge}
        </span>
      )}
      <div className="text-3xl mb-4">{tool.emoji}</div>
      <h2 className="text-base font-bold text-foreground mb-2 group-hover:text-accent transition-colors">
        {tool.name}
      </h2>
      <p className="text-sm text-muted leading-relaxed">{tool.description}</p>
      {tool.available && (
        <div className="mt-4 flex items-center gap-1 text-xs font-medium text-accent">
          <span>使ってみる</span>
          <span className="group-hover:translate-x-0.5 transition-transform">→</span>
        </div>
      )}
    </div>
  );

  if (!tool.available) return inner;

  return <Link href={tool.href}>{inner}</Link>;
}
