import Link from "next/link";
import type { Tool } from "@/data/tools";

export default function ToolCard({ tool }: { tool: Tool }) {
  const inner = (
    <div
      className={`group relative bg-surface border-l-4 border border-border rounded-2xl p-6 transition-all duration-200 ${
        tool.available
          ? "hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
          : "opacity-60 cursor-default"
      }`}
      style={
        {
          borderLeftColor: tool.color,
          "--tcl": tool.colorLight,
        } as React.CSSProperties
      }
    >
      {/* ホバー時の背景色オーバーレイ */}
      {tool.available && (
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
          style={{ backgroundColor: tool.colorLight }}
        />
      )}

      <div className="relative">
        {tool.badge && (
          <span className="absolute top-0 right-0 text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-muted">
            {tool.badge}
          </span>
        )}

        {/* 絵文字 */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
          style={{ backgroundColor: tool.colorLight }}
        >
          {tool.emoji}
        </div>

        <h2 className="text-base font-bold text-foreground mb-2 transition-colors">
          {tool.name}
        </h2>
        <p className="text-sm text-muted leading-relaxed">{tool.description}</p>
        {tool.available && (
          <div
            className="mt-4 flex items-center gap-1 text-xs font-semibold"
            style={{ color: tool.color }}
          >
            <span>使ってみる</span>
            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
          </div>
        )}
      </div>
    </div>
  );

  if (!tool.available) return inner;

  return <Link href={tool.href}>{inner}</Link>;
}
