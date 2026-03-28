"use client";

import { useEffect, useState } from "react";

type Props = {
  url?: string;
  title?: string;
};

export default function ShareButtons({ url, title }: Props) {
  const [canShare, setCanShare] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCanShare(typeof navigator !== "undefined" && !!navigator.share);
  }, []);

  function getUrl(): string {
    if (!url) return window.location.href;
    if (url.startsWith("http")) return url;
    return window.location.origin + url;
  }

  function getTitle(): string {
    return title ?? document.title;
  }

  function openShare(shareUrl: string) {
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  }

  function shareToX() {
    const u = encodeURIComponent(getUrl());
    const t = encodeURIComponent(getTitle());
    openShare(`https://twitter.com/intent/tweet?url=${u}&text=${t}`);
  }

  function shareToLine() {
    const u = encodeURIComponent(getUrl());
    openShare(`https://social-plugins.line.me/lineit/share?url=${u}`);
  }

  function shareToFacebook() {
    const u = encodeURIComponent(getUrl());
    openShare(`https://www.facebook.com/sharer/sharer.php?u=${u}`);
  }

  async function shareToInstagram() {
    try {
      await navigator.share({ url: getUrl(), title: getTitle() });
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        console.error(err);
      }
    }
  }

  async function copyUrl() {
    try {
      await navigator.clipboard.writeText(getUrl());
    } catch {
      const ta = document.createElement("textarea");
      ta.value = getUrl();
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const btnBase =
    "flex flex-col items-center gap-1.5 group focus:outline-none";
  const iconBase =
    "w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 active:scale-95";

  return (
    <div className="flex flex-wrap gap-5 justify-center">
      {/* X */}
      <button onClick={shareToX} className={btnBase} aria-label="Xでシェア">
        <span className={`${iconBase} bg-black text-white`}>
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.254 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
          </svg>
        </span>
        <span className="text-xs text-muted">X</span>
      </button>

      {/* LINE */}
      <button onClick={shareToLine} className={btnBase} aria-label="LINEでシェア">
        <span className={`${iconBase} bg-[#06C755] text-white`}>
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.070 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
          </svg>
        </span>
        <span className="text-xs text-muted">LINE</span>
      </button>

      {/* Facebook */}
      <button onClick={shareToFacebook} className={btnBase} aria-label="Facebookでシェア">
        <span className={`${iconBase} bg-[#1877F2] text-white`}>
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </span>
        <span className="text-xs text-muted">Facebook</span>
      </button>

      {/* Instagram（Web Share API対応時のみ） */}
      {canShare && (
        <button onClick={shareToInstagram} className={btnBase} aria-label="Instagramでシェア">
          <span
            className={`${iconBase} text-white`}
            style={{
              background:
                "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)",
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
            </svg>
          </span>
          <span className="text-xs text-muted">Instagram</span>
        </button>
      )}

      {/* URLコピー */}
      <button onClick={copyUrl} className={btnBase} aria-label="URLをコピー">
        <span className={`${iconBase} bg-gray-200 text-gray-600`}>
          {copied ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          )}
        </span>
        <span className="text-xs text-muted">
          {copied ? "コピーしました！" : "コピー"}
        </span>
      </button>
    </div>
  );
}
