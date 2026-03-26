export interface Tool {
  id: string;
  name: string;
  description: string;
  href: string;
  available: boolean;
  badge?: string;
  emoji: string;
}

export const tools: Tool[] = [
  {
    id: "png-to-jpeg",
    name: "一括JPEG変換野郎",
    description:
      "PNG・WebP・GIFなど複数の画像をまとめてJPEGへ変換。ブラウザ完結、サーバー不要、無料。",
    href: "/tools/png-to-jpeg",
    available: true,
    emoji: "🖼️",
  },
  {
    id: "resize",
    name: "一括リサイズ野郎",
    description:
      "複数の画像を指定サイズ・比率で一括リサイズ。SNS投稿・バナー制作に最適。",
    href: "/tools/resize",
    available: true,
    emoji: "📐",
  },
];
