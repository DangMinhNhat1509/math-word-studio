import {
  Copy,
  FilePlus2,
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
        <b>Trang</b>
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
                <div
                  className="page-mini-content"
                  dangerouslySetInnerHTML={{ __html: page.html || "<p><br></p>" }}
                />
                {(page.figures || []).map((figure) => (
                  <span
                    key={figure.id}
                    className="page-mini-figure"
                    style={{
                      left: `${Math.min(78, Math.max(2, (figure.box?.x || 0) / 8))}%`,
                      top: `${Math.min(84, Math.max(8, (figure.box?.y || 0) / 12))}%`,
                    }}
                  />
                ))}
              </div>

              <div className="page-thumb-meta">
                <b>Trang {index + 1}</b>
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

      <div className="sidebar-section compact-section">
        <SideButton icon={Save} label="Lưu" onClick={onSave} />
        <SideButton icon={Copy} label="Copy chữ" onClick={onCopyText} />
        <SideButton icon={Copy} label="Copy HTML" onClick={onCopyHtml} />
        <SideButton icon={Printer} label="In/PDF" onClick={onPrint} />
        <SideButton danger icon={RotateCcw} label="Reset" onClick={onReset} />
      </div>

      <div className="status-card">
        <b>Trạng thái</b>
        <p>{status}</p>
        {savedAt && <small>Lưu lần cuối: {savedAt}</small>}
      </div>
    </aside>
  );
}
