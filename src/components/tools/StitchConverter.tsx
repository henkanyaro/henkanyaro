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

type CaptionFormat = "N/T" | "(N/T)" | "N枚目/T枚";

function generateCaption(
  index: number,
  total: number,
  prefix: string,
  fmt: CaptionFormat
): string {
  let numbering: string;
  switch (fmt) {
    case "(N/T)":
      numbering = `(${index}/${total})`;
      break;
    case "N枚目/T枚":
      numbering = `${index}枚目/${total}枚`;
      break;
    default:
      numbering = `${index}/${total}`;
  }
  return prefix ? `${prefix} ${numbering}` : numbering;
}

function computePostGroups(count: number, splits: Set<number>): number[][] {
  if (count === 0) return [];
  const groups: number[][] = [];
  let current: number[] = [];
  for (let i = 0; i < count; i++) {
    current.push(i);
    if (splits.has(i) && i < count - 1) {
      groups.push(current);
      current = [];
    }
  }
  groups.push(current);
  return groups;
}

function defaultSplits(count: number): Set<number> {
  const s = new Set<number>();
  for (let i = 3; i < count - 1; i += 4) s.add(i);
  return s;
}

async function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text);
  } else {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
  }
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
  const [captionPrefix, setCaptionPrefix] = useState("");
  const [captionFormat, setCaptionFormat] = useState<CaptionFormat>("N/T");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [postSplits, setPostSplits] = useState<Set<number>>(new Set());
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

  // stitched が更新されたらポスト分割をデフォルトにリセット
  useEffect(() => {
    setPostSplits(defaultSplits(stitched.length));
  }, [stitched]);

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

  // コマのグループ分けを計算
  const groups: Panel[][] = [];
  for (let i = 0; i < panels.length; i += combineCount) {
    groups.push(panels.slice(i, i + combineCount));
  }

  // X投稿グループを計算（結合済み画像を何枚まとめて1投稿にするか）
  const postGroups = computePostGroups(stitched.length, postSplits);

  const toggleSplit = useCallback((i: number) => {
    setPostSplits((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }, []);

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
    const postIdx = postGroups.findIndex((g) => g.includes(index));
    const caption =
      postGroups.length >= 2
        ? generateCaption(postIdx + 1, postGroups.length, captionPrefix, captionFormat)
        : undefined;

    if (navigator.share && navigator.canShare) {
      try {
        const res = await fetch(img.url);
        const blob = await res.blob();
        const shareFile = new File([blob], fileName, {
          type: format === "jpeg" ? "image/jpeg" : "image/png",
        });
        if (navigator.canShare({ files: [shareFile] })) {
          await navigator.share({
            files: [shareFile],
            title: fileName,
            ...(caption ? { text: caption } : {}),
          });
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
              結合するコマ数
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
                （{panels.length}枚 → {groups.length}ファイルに分割）
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
                        ファイル {groupIndex + 1}
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
              : `${groups.length}ファイルを作成`}
          </button>
        </div>
      )}

      {/* 結合結果 */}
      {stitched.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">
              結合完了 —{" "}
              {postGroups.length >= 2
                ? `${stitched.length}ファイル / ${postGroups.length}投稿`
                : `${stitched.length}ファイル`}
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

          {/* X投稿用キャプション（結合済み2枚以上のとき表示） */}
          {stitched.length >= 2 && (
            <div className="bg-surface border border-border rounded-xl p-4 space-y-4">
              <p className="text-sm font-semibold text-foreground">
                X投稿用キャプション
              </p>

              {/* プレフィックス入力 */}
              <div>
                <label className="block text-xs font-medium text-muted mb-1.5">
                  プレフィックス（任意）
                </label>
                <input
                  type="text"
                  value={captionPrefix}
                  onChange={(e) => setCaptionPrefix(e.target.value)}
                  placeholder="作品名・ハッシュタグなど（省略可）"
                  className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-accent transition-colors min-h-[44px]"
                />
              </div>

              {/* 形式選択 */}
              <div>
                <label className="block text-xs font-medium text-muted mb-1.5">
                  形式
                </label>
                <div className="flex rounded-lg border border-border overflow-hidden">
                  {(
                    [
                      { value: "N/T", label: "1/3" },
                      { value: "(N/T)", label: "(1/3)" },
                      { value: "N枚目/T枚", label: "1枚目/3枚" },
                    ] as { value: CaptionFormat; label: string }[]
                  ).map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => setCaptionFormat(value)}
                      className={`flex-1 px-3 py-2 text-sm font-medium transition-all min-h-[44px] ${
                        captionFormat === value
                          ? "bg-accent text-white"
                          : "text-muted hover:text-foreground"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 投稿グループごとのキャプション */}
              <ul className="space-y-2">
                {postGroups.map((group, postIdx) => {
                  const cap = generateCaption(
                    postIdx + 1,
                    postGroups.length,
                    captionPrefix,
                    captionFormat
                  );
                  return (
                    <li
                      key={postIdx}
                      className="flex items-center gap-3 bg-background border border-border rounded-lg px-3 py-2"
                    >
                      <span className="text-xs text-muted shrink-0 w-14">
                        投稿{postIdx + 1}
                        <span className="text-muted/60">（{group.length}枚）</span>
                      </span>
                      <span className="flex-1 text-sm text-foreground font-mono truncate">
                        {cap}
                      </span>
                      <button
                        onClick={async () => {
                          await copyToClipboard(cap);
                          setCopiedIndex(postIdx);
                          setTimeout(() => setCopiedIndex(null), 800);
                        }}
                        className="shrink-0 px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-muted hover:text-foreground hover:border-accent transition-all min-h-[44px] min-w-[64px]"
                      >
                        {copiedIndex === postIdx ? "✓" : "コピー"}
                      </button>
                    </li>
                  );
                })}
              </ul>

              {/* すべてコピー（2投稿以上のとき） */}
              {postGroups.length >= 2 && (
                <button
                  onClick={async () => {
                    const all = postGroups
                      .map((_, postIdx) =>
                        generateCaption(
                          postIdx + 1,
                          postGroups.length,
                          captionPrefix,
                          captionFormat
                        )
                      )
                      .join("\n");
                    await copyToClipboard(all);
                    setCopiedAll(true);
                    setTimeout(() => setCopiedAll(false), 1000);
                  }}
                  className="w-full py-3 rounded-xl border border-border text-sm font-semibold text-foreground hover:border-accent hover:text-accent active:scale-[0.99] transition-all min-h-[44px]"
                >
                  {copiedAll ? "✓ コピーしました" : "すべてのキャプションをコピー"}
                </button>
              )}
            </div>
          )}

          {/* 結合済み画像リスト（投稿グループ分割UI付き） */}
          <div>
            {stitched.map((img, i) => {
              const postIdx = postGroups.findIndex((g) => g.includes(i));
              const isFirstInGroup = postGroups[postIdx]?.[0] === i;
              const isLast = i === stitched.length - 1;
              const isSplitAfter = postSplits.has(i);

              return (
                <div key={img.id}>
                  {/* 投稿グループヘッダー（2グループ以上のとき） */}
                  {isFirstInGroup && postGroups.length >= 2 && (
                    <div
                      className={`flex items-center gap-2 mb-2 ${i > 0 ? "mt-3" : ""}`}
                    >
                      <span className="text-xs font-semibold text-accent">
                        投稿 {postIdx + 1}
                      </span>
                      <span className="text-xs text-muted">
                        （{postGroups[postIdx].length}枚添付）
                      </span>
                      <div className="flex-1 border-t border-border" />
                    </div>
                  )}

                  {/* 画像カード */}
                  <div className="bg-surface border border-border rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          ファイル {i + 1}
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
                        alt={`ファイル ${i + 1}`}
                        className="w-full h-full object-contain max-h-64"
                      />
                    </div>
                  </div>

                  {/* 分ける / まとめる トグル */}
                  {!isLast && (
                    <button
                      onClick={() => toggleSplit(i)}
                      className={`w-full flex items-center gap-3 py-2 text-xs font-medium transition-all group ${
                        isSplitAfter
                          ? "text-accent"
                          : "text-muted hover:text-foreground"
                      }`}
                    >
                      <div
                        className={`flex-1 border-t transition-colors ${
                          isSplitAfter
                            ? "border-accent"
                            : "border-border group-hover:border-gray-300"
                        }`}
                      />
                      <span>
                        {isSplitAfter ? "↕ まとめる" : "ここで分ける"}
                      </span>
                      <div
                        className={`flex-1 border-t transition-colors ${
                          isSplitAfter
                            ? "border-accent"
                            : "border-border group-hover:border-gray-300"
                        }`}
                      />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
