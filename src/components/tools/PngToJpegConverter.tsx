"use client";

import {
  useCallback,
  useRef,
  useState,
  useEffect,
  DragEvent,
  ChangeEvent,
} from "react";

interface ConvertedFile {
  id: string;
  originalName: string;
  originalSize: number;
  previewUrl: string;
  jpegUrl: string | null;
  jpegSize: number | null;
  status: "pending" | "processing" | "done" | "error";
  error?: string;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

async function convertToJpeg(
  file: File,
  quality: number,
  bgColor: string
): Promise<{ jpegUrl: string; jpegSize: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas context unavailable"));

      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error("変換に失敗しました"));
          const jpegUrl = URL.createObjectURL(blob);
          resolve({ jpegUrl, jpegSize: blob.size });
        },
        "image/jpeg",
        quality / 100
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("画像の読み込みに失敗しました"));
    };

    img.src = objectUrl;
  });
}

export default function PngToJpegConverter() {
  const [files, setFiles] = useState<ConvertedFile[]>([]);
  const [quality, setQuality] = useState(85);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // Touch drag support (mobile)
  useEffect(() => {
    const el = dropZoneRef.current;
    if (!el) return;

    const onTouchStart = () => setIsDragging(true);
    const onTouchEnd = () => setIsDragging(false);
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  const addFiles = useCallback(
    (newFiles: File[]) => {
      const imageFiles = newFiles.filter((f) => f.type.startsWith("image/"));
      if (!imageFiles.length) return;

      const entries: ConvertedFile[] = imageFiles.map((f) => ({
        id: generateId(),
        originalName: f.name,
        originalSize: f.size,
        previewUrl: URL.createObjectURL(f),
        jpegUrl: null,
        jpegSize: null,
        status: "pending",
      }));

      setFiles((prev) => [...prev, ...entries]);

      // Start conversion for each file
      setIsProcessing(true);
      Promise.all(
        imageFiles.map(async (f, i) => {
          const id = entries[i].id;
          setFiles((prev) =>
            prev.map((item) =>
              item.id === id ? { ...item, status: "processing" } : item
            )
          );
          try {
            const { jpegUrl, jpegSize } = await convertToJpeg(
              f,
              quality,
              bgColor
            );
            setFiles((prev) =>
              prev.map((item) =>
                item.id === id
                  ? { ...item, jpegUrl, jpegSize, status: "done" }
                  : item
              )
            );
          } catch (err) {
            setFiles((prev) =>
              prev.map((item) =>
                item.id === id
                  ? {
                      ...item,
                      status: "error",
                      error:
                        err instanceof Error ? err.message : "エラー",
                    }
                  : item
              )
            );
          }
        })
      ).finally(() => setIsProcessing(false));
    },
    [quality, bgColor]
  );

  const onDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const dropped = Array.from(e.dataTransfer.files);
      addFiles(dropped);
    },
    [addFiles]
  );

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!dropZoneRef.current?.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(Array.from(e.target.files));
      e.target.value = "";
    }
  };

  const saveFile = async (file: ConvertedFile) => {
    if (!file.jpegUrl) return;
    const baseName = file.originalName.replace(/\.[^.]+$/, "");
    const fileName = `${baseName}.jpg`;

    // モバイルではWeb Share APIでギャラリー/写真に直接保存
    if (navigator.share && navigator.canShare) {
      try {
        const res = await fetch(file.jpegUrl);
        const blob = await res.blob();
        const shareFile = new File([blob], fileName, { type: "image/jpeg" });
        if (navigator.canShare({ files: [shareFile] })) {
          await navigator.share({ files: [shareFile], title: fileName });
          return;
        }
      } catch (err) {
        // ユーザーがキャンセルした場合はそのまま終了
        if (err instanceof Error && err.name === "AbortError") return;
        // その他のエラーは通常ダウンロードにフォールバック
      }
    }

    // PC・非対応環境は通常ダウンロード
    const a = document.createElement("a");
    a.href = file.jpegUrl;
    a.download = fileName;
    a.click();
  };

  const downloadAll = async () => {
    const doneFiles = files.filter((f) => f.status === "done" && f.jpegUrl);

    // Web Share APIが複数ファイルに対応している場合は一括共有
    if (navigator.share && navigator.canShare) {
      try {
        const shareFiles = await Promise.all(
          doneFiles.map(async (f) => {
            const baseName = f.originalName.replace(/\.[^.]+$/, "");
            const res = await fetch(f.jpegUrl!);
            const blob = await res.blob();
            return new File([blob], `${baseName}.jpg`, { type: "image/jpeg" });
          })
        );
        if (navigator.canShare({ files: shareFiles })) {
          await navigator.share({ files: shareFiles });
          return;
        }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
      }
    }

    // フォールバック：順番にダウンロード
    for (let i = 0; i < doneFiles.length; i++) {
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          saveFile(doneFiles[i]);
          resolve();
        }, i * 300);
      });
    }
  };

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const target = prev.find((f) => f.id === id);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      if (target?.jpegUrl) URL.revokeObjectURL(target.jpegUrl);
      return prev.filter((f) => f.id !== id);
    });
  };

  const clearAll = () => {
    files.forEach((f) => {
      if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
      if (f.jpegUrl) URL.revokeObjectURL(f.jpegUrl);
    });
    setFiles([]);
  };

  const doneCount = files.filter((f) => f.status === "done").length;
  const hasFiles = files.length > 0;

  return (
    <div className="space-y-6">
      {/* ドロップゾーン */}
      <div
        ref={dropZoneRef}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-10 sm:p-16 text-center cursor-pointer transition-all duration-200 select-none ${
          isDragging
            ? "border-accent bg-orange-50 scale-[1.01]"
            : "border-border hover:border-accent hover:bg-gray-50"
        }`}
        role="button"
        tabIndex={0}
        aria-label="画像ファイルを選択またはドロップ"
        onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          onChange={onFileChange}
          aria-label="画像ファイルを選択"
        />
        <div className="text-4xl mb-4">🖼️</div>
        <p className="text-base font-semibold text-foreground mb-1">
          画像をドラッグ&ドロップ
        </p>
        <p className="text-sm text-muted mb-4">
          PNG・WebP・GIF・BMP など複数ファイル対応
        </p>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-hover active:scale-95 transition-all min-h-[44px]"
        >
          ファイルを選択
        </button>
      </div>

      {/* 設定パネル */}
      <div className="flex flex-col sm:flex-row gap-4 bg-surface border border-border rounded-xl p-4">
        <div className="flex-1">
          <label className="block text-xs font-medium text-muted mb-1.5">
            品質 ({quality}%)
          </label>
          <input
            type="range"
            min={10}
            max={100}
            step={5}
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="w-full accent-accent h-2 cursor-pointer"
            aria-label="JPEG品質"
          />
          <div className="flex justify-between text-xs text-muted mt-1">
            <span>低品質・軽量</span>
            <span>高品質・重い</span>
          </div>
        </div>

        <div className="sm:w-48">
          <label className="block text-xs font-medium text-muted mb-1.5">
            透過部分の背景色
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-10 h-10 rounded-lg border border-border cursor-pointer bg-transparent"
              aria-label="背景色"
            />
            <span className="text-sm font-mono text-muted">{bgColor}</span>
          </div>
        </div>
      </div>

      {/* ファイルリスト */}
      {hasFiles && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">
              {doneCount}/{files.length} 件変換済み
            </p>
            <div className="flex gap-2">
              {doneCount > 1 && (
                <button
                  onClick={downloadAll}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-hover active:scale-95 transition-all min-h-[44px]"
                >
                  すべてDL
                </button>
              )}
              <button
                onClick={clearAll}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border text-sm text-muted hover:border-foreground hover:text-foreground active:scale-95 transition-all min-h-[44px]"
              >
                クリア
              </button>
            </div>
          </div>

          <ul className="space-y-3">
            {files.map((file) => (
              <li
                key={file.id}
                className="flex items-center gap-3 bg-surface border border-border rounded-xl p-3 sm:p-4"
              >
                {/* サムネイル */}
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={file.previewUrl}
                    alt={file.originalName}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* ファイル情報 */}
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-medium text-foreground truncate"
                    title={file.originalName}
                  >
                    {file.originalName.replace(/\.[^.]+$/, "")}.jpg
                  </p>
                  <p className="text-xs text-muted mt-0.5">
                    {formatBytes(file.originalSize)}
                    {file.jpegSize !== null && (
                      <span>
                        {" → "}
                        <span
                          className={
                            file.jpegSize < file.originalSize
                              ? "text-green-600"
                              : "text-muted"
                          }
                        >
                          {formatBytes(file.jpegSize)}
                        </span>
                      </span>
                    )}
                  </p>
                </div>

                {/* ステータス・アクション */}
                <div className="shrink-0 flex items-center gap-2">
                  {file.status === "processing" && (
                    <span className="text-xs text-muted animate-pulse">
                      変換中...
                    </span>
                  )}
                  {file.status === "pending" && (
                    <span className="text-xs text-muted">待機中</span>
                  )}
                  {file.status === "error" && (
                    <span
                      className="text-xs text-red-500"
                      title={file.error}
                    >
                      エラー
                    </span>
                  )}
                  {file.status === "done" && (
                    <button
                      onClick={() => saveFile(file)}
                      className="flex items-center gap-1 px-3 py-2 rounded-lg bg-accent text-white text-xs font-semibold hover:bg-accent-hover active:scale-95 transition-all min-h-[44px] min-w-[44px] justify-center"
                      aria-label={`${file.originalName} を保存`}
                    >
                      保存
                    </button>
                  )}
                  <button
                    onClick={() => removeFile(file.id)}
                    className="flex items-center justify-center w-8 h-8 rounded-lg text-muted hover:text-foreground hover:bg-gray-100 transition-colors min-h-[44px] min-w-[44px]"
                    aria-label="削除"
                  >
                    ×
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {isProcessing && (
            <p className="text-xs text-center text-muted animate-pulse">
              変換処理中...
            </p>
          )}
        </div>
      )}
    </div>
  );
}
