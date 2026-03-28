export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-surface">
      {/* アフィリエイトリンクエリア */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6 p-4 rounded-lg border border-dashed border-border text-center text-sm text-muted">
          {/* アフィリエイトリンクをここに挿入 */}
          <p className="font-medium text-muted">おすすめデザインツール</p>
          <p className="text-xs mt-1 text-border">
            アフィリエイトリンクエリア
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
          <p>© {new Date().getFullYear()} 変換野郎</p>
          <div className="flex gap-4">
            <a href="/contact" className="hover:text-foreground transition-colors">
              お問い合わせ
            </a>
            <a href="/privacy" className="hover:text-foreground transition-colors">
              プライバシーポリシー
            </a>
            <a href="/terms" className="hover:text-foreground transition-colors">
              利用規約
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
