interface AdBannerProps {
  slot: string;
  className?: string;
}

// AdSense 審査通過後に有効化する
// const ADSENSE_CLIENT = "ca-pub-XXXXXXXX";
const ADSENSE_ENABLED = false;

export default function AdBanner({ slot, className = "" }: AdBannerProps) {
  if (!ADSENSE_ENABLED) return null;

  return (
    <div
      className={`w-full ${className}`}
      data-ad-slot={slot}
    >
      {/* Google AdSense: data-ad-client={ADSENSE_CLIENT} data-ad-slot={slot} */}
    </div>
  );
}
