"use client";

import {
  useCallback,
  useRef,
  useState,
  useEffect,
  DragEvent,
  ChangeEvent,
} from "react";

interface ResizedFile {
  id: string;
  originalName: string;
  originalSize: number;
  previewUrl: string;
  resultUrl: string | null;
  resultSize: number | null;
  resultWidth: number | null;
  resultHeight: number | null;
  status: "pending" | "processing" | "done" | "error";
  error?: string;
}

interface Preset {
  id: string;
  label: string;
  width: number;
  height: number;
}

const PRESETS: Preset[] = [
  { id: "ig-square", label: "Instagram 正方形", width: 1080, height: 1080 },
  { id: "ig-portrait", label: "Instagram 縦", width: 1080, height: 1350 },
  { id: "ig-story", label: "Instagram Story", width: 1080, height: 1920 },
  { id: "x-landscape", label: "X 横長", width: 1200, height: 675 },
  { id: "x-portrait", label: "X 縦長", width: 1200, height: 1600 },
  { id: "fb-cover", label: "Facebook カバー", width: 1200, height: 630 },
  { id: "custom", label: "カスタム", width: 0, height: 0 },
];

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

async function resizeImage(
  file: File,
  targetW: number,
  targetH: number,
  maintainAspect: boolean,
  bgColor: string,
  format: "jpeg" | "png",
  quality: number
): Promise<{ url: string; size: number; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      const canvas = document.createElement("canvas");
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas context unavailable"));

      // 背景塗りつぶし（JPEG時・letterbox時に必要）
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, targetW, targetH);

      if (maintainAspect) {
        // アスペクト比維持：内接スケール（letterbox）
        const scale = Math.min(
          targetW / img.naturalWidth,
          targetH / img.naturalHeight
        );
        const drawW = img.naturalWidth * scale;
        const drawH = img.naturalHeight * scale;
        const offsetX = (targetW - drawW) / 2;
        const offsetY = (targetH - drawH) / 2;
        ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
      } else {
        // ストレッチ：強制的にターゲットサイズに引き伸ばし
        ctx.drawImage(img, 0, 0, targetW, targetH);
      }

      const mimeType = format === "jpeg" ? "image/jpeg" : "image/png";
      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error("変換に失敗しました"));
          resolve({
            url: URL.createObjectURL(blob),
            size: blob.size,
            width: targetW,
            height: targetH,
          });
        },
        mimeType,
        format === "jpeg" ? quality / 100 : undefined
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("画像の読み込みに失敗しました"));
    };

    img.src = objectUrl;
  });
}

export default function ResizeConverter() {
  const [files, setFiles] = useState<ResizedFile[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<string>("ig-square");
  const [customWidth, setCustomWidth] = useState<number>(800);
  const [customHeight, setCustomHeight] = useState<number>(600);
  const [maintainAspect, setMaintainAspect] = useState(true);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [format, setFormat] = useState<"jpeg" | "png">("jpeg");
  const [quality, setQuality] = useState(90);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

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

  const getTargetSize = useCallback((): { w: number; h: number } | null => {
    if (selectedPreset === "custom") {
      if (!customWidth || !customHeight || customWidth <= 0 || customHeight <= 0)
        return null;
      return { w: customWidth, h: customHeight };
    }
    const preset = PRESETS.find((p) => p.id === selectedPreset);
    if (!preset) return null;
    return { w: preset.width, h: preset.height };
  }, [selectedPreset, customWidth, customHeight]);

  const processFiles = useCallback(
    (imageFiles: File[], entries: ResizedFile[]) => {
      const target = getTargetSize();
      if (!target) return;

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
            const result = await resizeImage(
              f,
              target.w,
              target.h,
              maintainAspect,
              bgColor,
              format,
              quality
            );
            setFiles((prev) =>
              prev.map((item) =>
                item.id === id
                  ? {
                      ...item,
                      resultUrl: result.url,
                      resultSize: result.size,
                      resultWidth: result.width,
                      resultHeight: result.height,
                      status: "done",
                    }
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
                      error: err instanceof Error ? err.message : "エラー",
                    }
                  : item
              )
            );
          }
        })
      ).finally(() => setIsProcessing(false));
    },
    [getTargetSize, maintainAspect, bgColor, format, quality]
  );

  const addFiles = useCallback(
    (newFiles: File[]) => {
      const imageFiles = newFiles.filter((f) => f.type.startsWith("image/"));
      if (!imageFiles.length) return;

      const entries: ResizedFile[] = imageFiles.map((f) => ({
        id: generateId(),
        originalName: f.name,
        originalSize: f.size,
        previewUrl: URL.createObjectURL(f),
        resultUrl: null,
        resultSize: null,
        resultWidth: null,
        resultHeight: null,
        status: "pending",
      }));

      setFiles((prev) => [...prev, ...entries]);
      processFiles(imageFiles, entries);
    },
    [processFiles]
  );

  const onDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      addFiles(Array.from(e.dataTransfer.files));
    },
    [addFiles]
  );

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(Array.from(e.target.files));
      e.target.value = "";
    }
  };

  const getOutputExtension = () => (format === "jpeg" ? ".jpg" : ".png");

  const saveFile = async (file: ResizedFile) => {
    if (!file.resultUrl) return;
    const baseName = file.originalName.replace(/\.[^.]+$/, "");
    const fileName = `${baseName}_resized${getOutputExtension()}`;

    if (navigator.share && navigator.canShare) {
      try {
        const res = await fetch(file.resultUrl);
        const blob = await res.blob();
        const shareFile = new File([blob], fileName, {
          type: format === "jpeg" ? "image/jpeg" : "image/png",
        });
        if (navigator.canShare({ files: [shareFile] })) {
          await navigator.share({ files: [shareFile], title: fileName });
          return;
        }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
      }
    }

    const a = document.createElement("a");
    a.href = file.resultUrl;
    a.download = fileName;
    a.click();
  };

  const saveAll = async () => {
    const doneFiles = files.filter((f) => f.status === "done" && f.resultUrl);

    if (navigator.share && navigator.canShare) {
      try {
        const shareFiles = await Promise.all(
          doneFiles.map(async (f) => {
            const baseName = f.originalName.replace(/\.[^.]+$/, "");
            const res = await fetch(f.resultUrl!);
            const blob = await res.blob();
            return new File(
              [blob],
              `${baseName}_resized${getOutputExtension()}`,
              { type: format === "jpeg" ? "image/jpeg" : "image/png" }
            );
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
      if (target?.resultUrl) URL.revokeObjectURL(target.resultUrl);
      return prev.filter((f) => f.id !== id);
    });
  };

  const clearAll = () => {
    files.forEach((f) => {
      if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
      if (f.resultUrl) URL.revokeObjectURL(f.resultUrl);
    });
    setFiles([]);
  };

  const target = getTargetSize();
  const doneCount = files.filter((f) => f.status === "done").length;
  const hasFiles = files.length > 0;

  return (
    <div className="space-y-6">
      {/* 設定パネル */}
      <div className="bg-surface border border-border rounded-xl p-4 space-y-4">
        {/* プリセット */}
        <div>
          <label className="block text-xs font-medium text-muted mb-2">
            サイズプリセット
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => setSelectedPreset(preset.id)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all min-h-[44px] border ${
                  selectedPreset === preset.id
                    ? "bg-accent text-white border-accent"
                    : "bg-transparent text-muted border-border hover:border-accent hover:text-foreground"
                }`}
              >
                <span className="block">{preset.label}</span>
                {preset.id !== "custom" && (
                  <span className="block text-[10px] opacity-70 mt-0.5">
                    {preset.width}×{preset.height}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* カスタムサイズ */}
        {selectedPreset === "custom" && (
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="block text-xs font-medium text-muted mb-1">
                幅 (px)
              </label>
              <input
                type="number"
                min={1}
                max={10000}
                value={customWidth}
                onChange={(e) => setCustomWidth(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:border-accent"
              />
            </div>
            <span className="text-muted mt-5">×</span>
            <div className="flex-1">
              <label className="block text-xs font-medium text-muted mb-1">
                高さ (px)
              </label>
              <input
                type="number"
                min={1}
                max={10000}
                value={customHeight}
                onChange={(e) => setCustomHeight(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:border-accent"
              />
            </div>
          </div>
        )}

        {/* オプション行 */}
        <div className="flex flex-wrap gap-4">
          {/* アスペクト比 */}
          <div>
            <label className="block text-xs font-medium text-muted mb-2">
              リサイズ方法
            </label>
            <div className="flex rounded-lg border border-border overflow-hidden">
              <button
                onClick={() => setMaintainAspect(true)}
                className={`px-3 py-2 text-xs font-medium transition-all min-h-[44px] ${
                  maintainAspect
                    ? "bg-accent text-white"
                    : "text-muted hover:text-foreground"
                }`}
              >
                比率維持
              </button>
              <button
                onClick={() => setMaintainAspect(false)}
                className={`px-3 py-2 text-xs font-medium transition-all min-h-[44px] ${
                  !maintainAspect
                    ? "bg-accent text-white"
                    : "text-muted hover:text-foreground"
                }`}
              >
                ストレッチ
              </button>
            </div>
          </div>

          {/* 出力形式 */}
          <div>
            <label className="block text-xs font-medium text-muted mb-2">
              出力形式
            </label>
            <div className="flex rounded-lg border border-border overflow-hidden">
              <button
                onClick={() => setFormat("jpeg")}
                className={`px-3 py-2 text-xs font-medium transition-all min-h-[44px] ${
                  format === "jpeg"
                    ? "bg-accent text-white"
                    : "text-muted hover:text-foreground"
                }`}
              >
                JPEG
              </button>
              <button
                onClick={() => setFormat("png")}
                className={`px-3 py-2 text-xs font-medium transition-all min-h-[44px] ${
                  format === "png"
                    ? "bg-accent text-white"
                    : "text-muted hover:text-foreground"
                }`}
              >
                PNG
              </button>
            </div>
          </div>

          {/* 背景色（比率維持時のみ有効） */}
          {maintainAspect && (
            <div>
              <label className="block text-xs font-medium text-muted mb-2">
                余白の色
              </label>
              <div className="flex items-center gap-2 h-[44px]">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-10 h-10 rounded-lg border border-border cursor-pointer bg-transparent"
                />
                <span className="text-xs font-mono text-muted">{bgColor}</span>
              </div>
            </div>
          )}

          {/* 品質（JPEG時のみ） */}
          {format === "jpeg" && (
            <div className="flex-1 min-w-40">
              <label className="block text-xs font-medium text-muted mb-2">
                品質 ({quality}%)
              </label>
              <input
                type="range"
                min={10}
                max={100}
                step={5}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full accent-accent h-2 cursor-pointer mt-3"
              />
            </div>
          )}
        </div>

        {/* 現在の設定サマリー */}
        {target && (
          <p className="text-xs text-muted">
            出力サイズ:{" "}
            <span className="font-medium text-foreground">
              {target.w} × {target.h} px
            </span>
            　形式:{" "}
            <span className="font-medium text-foreground">
              {format.toUpperCase()}
            </span>
            　方法:{" "}
            <span className="font-medium text-foreground">
              {maintainAspect ? "比率維持（余白あり）" : "ストレッチ"}
            </span>
          </p>
        )}
      </div>

      {/* ドロップゾーン */}
      <div
        ref={dropZoneRef}
        onDrop={onDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          if (!dropZoneRef.current?.contains(e.relatedTarget as Node))
            setIsDragging(false);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-10 sm:p-14 text-center cursor-pointer transition-all duration-200 select-none ${
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
        />
        <div className="text-4xl mb-4">📐</div>
        <p className="text-base font-semibold text-foreground mb-1">
          画像をドラッグ&ドロップ
        </p>
        <p className="text-sm text-muted mb-4">
          PNG・JPEG・WebP など複数ファイル対応
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

      {/* ファイルリスト */}
      {hasFiles && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">
              {doneCount}/{files.length} 件完了
            </p>
            <div className="flex gap-2">
              {doneCount > 1 && (
                <button
                  onClick={saveAll}
                  className="px-4 py-2.5 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-hover active:scale-95 transition-all min-h-[44px]"
                >
                  すべて保存
                </button>
              )}
              <button
                onClick={clearAll}
                className="px-4 py-2.5 rounded-xl border border-border text-sm text-muted hover:border-foreground hover:text-foreground active:scale-95 transition-all min-h-[44px]"
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
                    src={
                      file.status === "done" && file.resultUrl
                        ? file.resultUrl
                        : file.previewUrl
                    }
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
                    {file.originalName.replace(/\.[^.]+$/, "")}
                    {getOutputExtension()}
                  </p>
                  <p className="text-xs text-muted mt-0.5">
                    {formatBytes(file.originalSize)}
                    {file.resultSize !== null && (
                      <span>
                        {" → "}
                        <span
                          className={
                            file.resultSize < file.originalSize
                              ? "text-green-600"
                              : "text-muted"
                          }
                        >
                          {formatBytes(file.resultSize)}
                        </span>
                      </span>
                    )}
                    {file.resultWidth && (
                      <span className="ml-2 text-muted">
                        {file.resultWidth}×{file.resultHeight}px
                      </span>
                    )}
                  </p>
                </div>

                {/* ステータス・アクション */}
                <div className="shrink-0 flex items-center gap-2">
                  {file.status === "processing" && (
                    <span className="text-xs text-muted animate-pulse">
                      処理中...
                    </span>
                  )}
                  {file.status === "pending" && (
                    <span className="text-xs text-muted">待機中</span>
                  )}
                  {file.status === "error" && (
                    <span className="text-xs text-red-500" title={file.error}>
                      エラー
                    </span>
                  )}
                  {file.status === "done" && (
                    <button
                      onClick={() => saveFile(file)}
                      className="px-3 py-2 rounded-lg bg-accent text-white text-xs font-semibold hover:bg-accent-hover active:scale-95 transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
                      aria-label={`${file.originalName} を保存`}
                    >
                      保存
                    </button>
                  )}
                  <button
                    onClick={() => removeFile(file.id)}
                    className="flex items-center justify-center text-muted hover:text-foreground hover:bg-gray-100 transition-colors min-h-[44px] min-w-[44px] rounded-lg"
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
              処理中...
            </p>
          )}
        </div>
      )}
    </div>
  );
}
