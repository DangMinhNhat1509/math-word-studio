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

      <div className="page-list">
        {pages.map((page, index) => (
          <button
            type="button"
            key={page.id}
            className={`page-item ${page.id === currentPageId ? "active" : ""}`}
            onClick={() => onSelectPage(page.id)}
          >
            <FileText size={16} />
            <span>{page.title || `Trang ${index + 1}`}</span>
          </button>
        ))}
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

      <div className="help-card">
        <b>Cách dùng</b>
        <p>
          Soạn trực tiếp trên giấy A4. Sidebar trái quản lý trang. Hình có thể kéo vị trí
          và kéo góc phải dưới để đổi kích thước.
        </p>
      </div>
    </aside>
  );
}
