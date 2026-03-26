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
    name: "コマ結合野郎",
    description:
      "インスタ用コマを2〜3枚縦につなげてX投稿用画像を作成。並び替え・一括保存対応。",
    href: "/tools/resize",
    available: true,
    emoji: "🔗",
  },
];
