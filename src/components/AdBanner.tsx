interface AdBannerProps {
  slot: string;
  className?: string;
  /** アフィリエイトHTML（楽天・AdSenseなど）をそのまま渡す */
  html?: string;
  /** バナーHTMLがない間もスペースを確保して表示する */
  placeholder?: boolean;
}

export default function AdBanner({ slot, className = "", html, placeholder }: AdBannerProps) {
  // バナーHTMLが渡されていればそのまま描画
  if (html) {
    return (
      <div className={`w-full text-center ${className}`} data-ad-slot={slot}>
        <p className="text-[10px] text-muted mb-1.5">
          PR <span className="border border-border rounded px-1 py-0.5">広告</span>
        </p>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    );
  }

  // placeholder=true のときはスペースだけ確保
  if (placeholder) {
    return (
      <div
        className={`w-full flex items-center justify-center min-h-[90px] rounded-xl border border-dashed border-border bg-surface text-xs text-muted/50 ${className}`}
        data-ad-slot={slot}
      >
        広告スペース
      </div>
    );
  }

  return null;
}
