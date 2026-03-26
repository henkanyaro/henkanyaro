interface AdBannerProps {
  slot: string;
  className?: string;
}

export default function AdBanner({ slot, className = "" }: AdBannerProps) {
  return (
    <div
      className={`w-full bg-gray-50 border border-dashed border-border rounded-lg flex items-center justify-center text-xs text-muted min-h-[90px] ${className}`}
      data-ad-slot={slot}
    >
      {/* Google AdSense: data-ad-client="ca-pub-XXXXXXXX" data-ad-slot={slot} を設定 */}
      <span>広告</span>
    </div>
  );
}
