"use client";

import {
  useCallback,
  useRef,
  useState,
  useEffect,
  DragEvent,
  ChangeEvent,
} from "react";

interface Panel {
  id: string;
  file: File;
  previewUrl: string;
  originalName: string;
}

interface StitchedImage {
  id: string;
  url: string;
  size: number;
  width: number;
  height: number;
  panelStart: number; // 1-indexed
  panelEnd: number;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

async function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`${file.name} の読み込みに失敗しました`));
    };
    img.src = url;
  });
}

async function stitchPanels(
  files: File[],
  bgColor: string,
  format: "jpeg" | "png",
  quality: number
): Promise<{ url: string; size: number; width: number; height: number }> {
  const images = await Promise.all(files.map(loadImage));

  const canvasWidth = Math.max(...images.map((img) => img.naturalWidth));
  const canvasHeight = images.reduce((sum, img) => sum + img.naturalHeight, 0);

  const canvas = document.createElement("canvas");
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context unavailable");

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  let y = 0;
  for (const img of images) {
    // 幅が異なる場合は中央揃え
    const x = Math.floor((canvasWidth - img.naturalWidth) / 2);
    ctx.drawImage(img, x, y);
    y += img.naturalHeight;
  }

  return new Promise((resolve, reject) => {
    const mimeType = format === "jpeg" ? "image/jpeg" : "image/png";
    canvas.toBlob(
      (blob) => {
        if (!blob) return reject(new Error("結合に失敗しました"));
        resolve({
          url: URL.createObjectURL(blob),
          size: blob.size,
          width: canvasWidth,
          height: canvasHeight,
        });
      },
      mimeType,
      format === "jpeg" ? quality / 100 : undefined
    );
  });
}

export default function StitchConverter() {
  const [panels, setPanels] = useState<Panel[]>([]);
  const [combineCount, setCombineCount] = useState<2 | 3>(2);
  const [format, setFormat] = useState<"jpeg" | "png">("jpeg");
  const [quality, setQuality] = useState(90);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [stitched, setStitched] = useState<StitchedImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
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

  // stitched をクリア（パネルや設定が変わったとき）
  useEffect(() => {
    setStitched((prev) => {
      prev.forEach((s) => URL.revokeObjectURL(s.url));
      return [];
    });
  }, [panels, combineCount, format, quality, bgColor]);

  const addFiles = useCallback((newFiles: File[]) => {
    const imageFiles = newFiles.filter((f) => f.type.startsWith("image/"));
    if (!imageFiles.length) return;
    const entries: Panel[] = imageFiles.map((f) => ({
      id: generateId(),
      file: f,
      previewUrl: URL.createObjectURL(f),
      originalName: f.name,
    }));
    setPanels((prev) => [...prev, ...entries]);
  }, []);

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

  const movePanel = (index: number, direction: "up" | "down") => {
    setPanels((prev) => {
      const next = [...prev];
      const swapIndex = direction === "up" ? index - 1 : index + 1;
      if (swapIndex < 0 || swapIndex >= next.length) return prev;
      [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
      return next;
    });
  };

  const removePanel = (id: string) => {
    setPanels((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((p) => p.id !== id);
    });
  };

  const clearAll = () => {
    panels.forEach((p) => URL.revokeObjectURL(p.previewUrl));
    stitched.forEach((s) => URL.revokeObjectURL(s.url));
    setPanels([]);
    setStitched([]);
  };

  // グループ分けを計算
  const groups: Panel[][] = [];
  for (let i = 0; i < panels.length; i += combineCount) {
    groups.push(panels.slice(i, i + combineCount));
  }

  const handleStitch = async () => {
    if (panels.length === 0) return;
    setIsProcessing(true);
    setStitched([]);

    const results: StitchedImage[] = [];
    let panelIndex = 1;

    for (const group of groups) {
      try {
        const result = await stitchPanels(
          group.map((p) => p.file),
          bgColor,
          format,
          quality
        );
        results.push({
          id: generateId(),
          ...result,
          panelStart: panelIndex,
          panelEnd: panelIndex + group.length - 1,
        });
        panelIndex += group.length;
      } catch {
        panelIndex += group.length;
      }
    }

    setStitched(results);
    setIsProcessing(false);
  };

  const saveImage = async (img: StitchedImage, index: number) => {
    const fileName = `x_post_${index + 1}${format === "jpeg" ? ".jpg" : ".png"}`;

    if (navigator.share && navigator.canShare) {
      try {
        const res = await fetch(img.url);
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
    a.href = img.url;
    a.download = fileName;
    a.click();
  };

  const saveAll = async () => {
    if (navigator.share && navigator.canShare) {
      try {
        const shareFiles = await Promise.all(
          stitched.map(async (img, i) => {
            const fileName = `x_post_${i + 1}${format === "jpeg" ? ".jpg" : ".png"}`;
            const res = await fetch(img.url);
            const blob = await res.blob();
            return new File([blob], fileName, {
              type: format === "jpeg" ? "image/jpeg" : "image/png",
            });
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

    for (let i = 0; i < stitched.length; i++) {
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          saveImage(stitched[i], i);
          resolve();
        }, i * 300);
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* 設定パネル */}
      <div className="bg-surface border border-border rounded-xl p-4 space-y-4">
        <div className="flex flex-wrap gap-4">
          {/* 結合枚数 */}
          <div>
            <label className="block text-xs font-medium text-muted mb-2">
              1投稿あたりのコマ数
            </label>
            <div className="flex rounded-lg border border-border overflow-hidden">
              {([2, 3] as const).map((n) => (
                <button
                  key={n}
                  onClick={() => setCombineCount(n)}
                  className={`px-5 py-2 text-sm font-bold transition-all min-h-[44px] ${
                    combineCount === n
                      ? "bg-accent text-white"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {n}枚
                </button>
              ))}
            </div>
          </div>

          {/* 出力形式 */}
          <div>
            <label className="block text-xs font-medium text-muted mb-2">
              出力形式
            </label>
            <div className="flex rounded-lg border border-border overflow-hidden">
              {(["jpeg", "png"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  className={`px-4 py-2 text-sm font-medium transition-all min-h-[44px] ${
                    format === f
                      ? "bg-accent text-white"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {f.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* 余白色（幅が異なるコマがある場合） */}
          <div>
            <label className="block text-xs font-medium text-muted mb-2">
              余白色
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

          {/* JPEG品質 */}
          {format === "jpeg" && (
            <div className="flex-1 min-w-36">
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
        className={`border-2 border-dashed rounded-2xl p-10 sm:p-14 text-center cursor-pointer transition-all duration-200 select-none ${
          isDragging
            ? "border-accent bg-orange-50 scale-[1.01]"
            : "border-border hover:border-accent hover:bg-gray-50"
        }`}
        role="button"
        tabIndex={0}
        aria-label="コマ画像を選択またはドロップ"
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
        <div className="text-4xl mb-4">🖼️</div>
        <p className="text-base font-semibold text-foreground mb-1">
          コマ画像をドラッグ&ドロップ
        </p>
        <p className="text-sm text-muted mb-4">
          複数枚まとめて選択OK・順番は後から並び替えられます
        </p>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-hover active:scale-95 transition-all min-h-[44px]"
        >
          コマを選択
        </button>
      </div>

      {/* パネル一覧 */}
      {panels.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">
              コマ一覧{" "}
              <span className="text-muted font-normal">
                （{panels.length}枚 → {groups.length}投稿に分割）
              </span>
            </p>
            <button
              onClick={clearAll}
              className="text-xs text-muted hover:text-foreground transition-colors px-3 py-2 min-h-[44px]"
            >
              クリア
            </button>
          </div>

          <ul className="space-y-2">
            {panels.map((panel, index) => {
              const groupIndex = Math.floor(index / combineCount);
              const isGroupStart = index % combineCount === 0;
              const isGroupEnd =
                index % combineCount === combineCount - 1 ||
                index === panels.length - 1;

              return (
                <li key={panel.id}>
                  {/* グループ区切り線 */}
                  {isGroupStart && (
                    <div className="flex items-center gap-2 mb-2 mt-1">
                      <span className="text-xs font-semibold text-accent">
                        投稿 {groupIndex + 1}
                      </span>
                      <div className="flex-1 border-t border-border" />
                    </div>
                  )}
                  <div
                    className={`flex items-center gap-3 bg-surface border rounded-xl p-3 transition-colors ${
                      isGroupStart && !isGroupEnd
                        ? "border-b-0 rounded-b-none border-border"
                        : isGroupEnd && !isGroupStart
                        ? "border-t-0 rounded-t-none border-border"
                        : !isGroupStart && !isGroupEnd
                        ? "border-y-0 rounded-none border-border"
                        : "border-border"
                    }`}
                  >
                    {/* コマ番号 */}
                    <span className="shrink-0 w-6 h-6 rounded-full bg-gray-100 text-muted flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>

                    {/* サムネイル */}
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={panel.previewUrl}
                        alt={panel.originalName}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* ファイル名 */}
                    <p
                      className="flex-1 text-sm text-foreground truncate min-w-0"
                      title={panel.originalName}
                    >
                      {panel.originalName}
                    </p>

                    {/* 並び替えボタン */}
                    <div className="flex flex-col gap-0.5 shrink-0">
                      <button
                        onClick={() => movePanel(index, "up")}
                        disabled={index === 0}
                        className="w-8 h-7 flex items-center justify-center rounded text-muted hover:text-foreground hover:bg-gray-100 disabled:opacity-20 transition-colors"
                        aria-label="上へ"
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => movePanel(index, "down")}
                        disabled={index === panels.length - 1}
                        className="w-8 h-7 flex items-center justify-center rounded text-muted hover:text-foreground hover:bg-gray-100 disabled:opacity-20 transition-colors"
                        aria-label="下へ"
                      >
                        ▼
                      </button>
                    </div>

                    {/* 削除ボタン */}
                    <button
                      onClick={() => removePanel(panel.id)}
                      className="shrink-0 flex items-center justify-center min-h-[44px] min-w-[44px] text-muted hover:text-foreground hover:bg-gray-100 rounded-lg transition-colors"
                      aria-label="削除"
                    >
                      ×
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* 結合ボタン */}
          <button
            onClick={handleStitch}
            disabled={isProcessing}
            className="w-full py-4 rounded-xl bg-accent text-white font-bold text-base hover:bg-accent-hover active:scale-[0.99] transition-all min-h-[44px] disabled:opacity-50 mt-2"
          >
            {isProcessing
              ? "結合中..."
              : `${groups.length}枚の投稿用画像を作成`}
          </button>
        </div>
      )}

      {/* 結合結果 */}
      {stitched.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">
              結合完了 — {stitched.length}枚の投稿用画像
            </p>
            {stitched.length > 1 && (
              <button
                onClick={saveAll}
                className="px-4 py-2.5 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-hover active:scale-95 transition-all min-h-[44px]"
              >
                すべて保存
              </button>
            )}
          </div>

          <ul className="space-y-4">
            {stitched.map((img, i) => (
              <li
                key={img.id}
                className="bg-surface border border-border rounded-xl p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      投稿 {i + 1}
                      <span className="ml-2 text-xs font-normal text-muted">
                        コマ {img.panelStart}〜{img.panelEnd}
                      </span>
                    </p>
                    <p className="text-xs text-muted mt-0.5">
                      {img.width}×{img.height}px　{formatBytes(img.size)}
                    </p>
                  </div>
                  <button
                    onClick={() => saveImage(img, i)}
                    className="px-4 py-2.5 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-hover active:scale-95 transition-all min-h-[44px]"
                  >
                    保存
                  </button>
                </div>

                {/* プレビュー（縮小表示） */}
                <div className="rounded-lg overflow-hidden bg-gray-100 max-h-64 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    alt={`投稿 ${i + 1}`}
                    className="w-full h-full object-contain max-h-64"
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
