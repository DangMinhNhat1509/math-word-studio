import { Copy, Download, Save, Sigma } from "lucide-react";

export default function Topbar({ onUndo, onRedo, onSave, onCopyText, onPrint }) {
  return (
    <header className="topbar">
      <div className="brand">
        <div className="logo">
          <Sigma size={25} />
        </div>
        <div>
          <div className="brand-title">
            <h1>Math Word Studio</h1>
            <span>MVP v3</span>
          </div>
          <p>Soạn bài · công thức · hình học · copy dùng liền</p>
        </div>
      </div>

      <div className="top-actions">
        <button onClick={onUndo}>↶ Hoàn tác</button>
        <button onClick={onRedo}>↷ Làm lại</button>
        <button onClick={onSave}>
          <Save size={16} /> Lưu
        </button>
        <button onClick={onCopyText}>
          <Copy size={16} /> Copy chữ
        </button>
        <button className="primary" onClick={onPrint}>
          <Download size={16} /> In/PDF
        </button>
      </div>
    </header>
  );
}
