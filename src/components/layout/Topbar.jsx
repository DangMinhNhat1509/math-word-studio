import {
  Copy,
  FileDown,
  FolderOpen,
  RotateCcw,
  Save,
  Sigma,
} from "lucide-react";

export default function Topbar({
  savedAt,
  status,
  onSave,
  onPrint,
  onCopyText,
  onCopyHtml,
  onReset,
}) {
  return (
    <header className="mws-topbar">
      <div className="mws-brand">
        <div className="mws-brand-mark">
          <Sigma size={22} strokeWidth={2.6} />
        </div>

        <div className="mws-brand-copy">
          <div className="mws-brand-row">
            <h1>Math Word Studio</h1>
            <span className="mws-badge">MVP v4</span>
          </div>
          <p>Soạn bài · công thức · hình học · trắc nghiệm</p>
        </div>
      </div>

      <div className="mws-topbar-center">
        <div className="mws-doc-pill">
          <span className="mws-doc-title">Tài liệu hiện tại</span>
          <span className="mws-doc-meta">
            {savedAt ? `Đã lưu: ${savedAt}` : status}
          </span>
        </div>
      </div>

      <div className="mws-topbar-actions">
        <button className="mws-header-btn" onClick={onSave} type="button">
          <Save size={17} />
          <span>Lưu</span>
        </button>

        <button
          className="mws-header-btn mws-header-btn-primary"
          onClick={onPrint}
          type="button"
        >
          <FileDown size={17} />
          <span>In/PDF</span>
        </button>

        <button className="mws-header-btn" onClick={onCopyText} type="button">
          <Copy size={17} />
          <span>Copy chữ</span>
        </button>

        <button className="mws-header-btn" onClick={onCopyHtml} type="button">
          <FolderOpen size={17} />
          <span>Copy HTML</span>
        </button>

        <button className="mws-header-btn mws-header-btn-danger" onClick={onReset} type="button">
          <RotateCcw size={17} />
          <span>Reset</span>
        </button>
      </div>
    </header>
  );
}
