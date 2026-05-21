import { Copy, Download, Save, Sigma } from "lucide-react";

export default function Topbar({ onUndo, onRedo, onSave, onCopyText, onPrint }) {
  return (
    <header className="topbar">
      <div className="brand">
        <div className="logo">
          <Sigma size={22} />
        </div>

        <div>
          <div className="brand-title">
            <h1>Math Word Studio</h1>
            <span>MVP v4</span>
          </div>
          <p>Soạn bài · công thức · hình học · trắc nghiệm</p>
        </div>
      </div>

      <div className="top-actions">
        <button type="button" onClick={onUndo}>↶ Hoàn tác</button>
        <button type="button" onClick={onRedo}>↷ Làm lại</button>
        <button type="button" onClick={onSave}>
          <Save size={16} />
          Lưu
        </button>
        <button type="button" onClick={onCopyText}>
          <Copy size={16} />
          Copy chữ
        </button>
        <button type="button" className="primary" onClick={onPrint}>
          <Download size={16} />
          In/PDF
        </button>
      </div>
    </header>
  );
}
