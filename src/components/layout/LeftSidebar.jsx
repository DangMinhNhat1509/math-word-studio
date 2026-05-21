import {
  Copy,
  FilePlus2,
  FileText,
  Layers,
  Printer,
  RotateCcw,
  Save,
  Trash2,
} from "lucide-react";

import { SideButton } from "../common/Buttons";

function stripText(html = "") {
  const div = document.createElement("div");
  div.innerHTML = html;
  return (div.textContent || "").replace(/\s+/g, " ").trim();
}

export default function LeftSidebar({
  pages,
  currentPageId,
  status,
  savedAt,
  onSelectPage,
  onAddPage,
  onDeletePage,
  onSave,
  onCopyText,
  onCopyHtml,
  onPrint,
  onReset,
}) {
  return (
    <aside className="leftbar">
      <div className="panel-title">
        <Layers size={17} />
        <b>Trang tài liệu</b>
      </div>

      <div className="page-thumb-list">
        {pages.map((page, index) => {
          const preview = stripText(page.html);

          return (
            <button
              type="button"
              key={page.id}
              className={`page-thumb ${page.id === currentPageId ? "active" : ""}`}
              onClick={() => onSelectPage(page.id)}
            >
              <div className="page-thumb-paper">
                <div className="thumb-line strong" />
                <div className="thumb-line" />
                <div className="thumb-line short" />
                {page.figures?.length > 0 && <div className="thumb-figure" />}
              </div>

              <div className="page-thumb-meta">
                <b>{page.title || `Trang ${index + 1}`}</b>
                <span>{preview || "Trang trống"}</span>
              </div>
            </button>
          );
        })}
      </div>

      <button type="button" className="add-page-btn" onClick={onAddPage}>
        <FilePlus2 size={16} />
        Thêm trang mới
      </button>

      <button type="button" className="delete-page-btn" onClick={onDeletePage}>
        <Trash2 size={15} />
        Xóa trang hiện tại
      </button>

      <div className="sidebar-section">
        <SideButton icon={Save} label="Lưu tài liệu" onClick={onSave} />
        <SideButton icon={Copy} label="Copy chữ dán Word" onClick={onCopyText} />
        <SideButton icon={Copy} label="Copy HTML" onClick={onCopyHtml} />
        <SideButton icon={Printer} label="In/PDF" onClick={onPrint} />
        <SideButton danger icon={RotateCcw} label="Reset mẫu" onClick={onReset} />
      </div>

      <div className="status-card">
        <b>Trạng thái</b>
        <p>{status}</p>
        {savedAt && <small>Lưu lần cuối: {savedAt}</small>}
      </div>
    </aside>
  );
}
