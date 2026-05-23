import { Clock3, FilePlus2, Layers3, Trash2 } from "lucide-react";

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
}) {
  return (
    <div className="mws-leftbar">
      <div className="mws-panel-head">
        <h2>Trang</h2>
        <span className="mws-panel-count">{pages.length}</span>
      </div>

      <div className="mws-page-list">
        {pages.map((page, index) => {
          const preview = stripText(page.html);
          const selected = page.id === currentPageId;

          return (
            <button
              key={page.id}
              type="button"
              className={`mws-page-card-mini ${selected ? "is-active" : ""}`}
              onClick={() => onSelectPage(page.id)}
            >
              <div className="mws-page-thumb">
                <div className="mws-page-thumb-sheet">
                  <div className="mws-page-thumb-line long" />
                  <div className="mws-page-thumb-line medium" />
                  <div className="mws-page-thumb-line short" />
                </div>
                <span className="mws-page-badge">{index + 1}</span>
              </div>

              <div className="mws-page-card-copy">
                <strong>Trang {index + 1}</strong>
                <span>{preview || "Trang trống"}</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mws-leftbar-actions">
        <button type="button" className="mws-side-action" onClick={onAddPage}>
          <FilePlus2 size={18} />
          <span>Thêm trang mới</span>
        </button>

        <button
          type="button"
          className="mws-side-action mws-side-action-danger"
          onClick={onDeletePage}
        >
          <Trash2 size={18} />
          <span>Xóa trang hiện tại</span>
        </button>
      </div>

      <div className="mws-side-info-card">
        <div className="mws-side-info-title">
          <Layers3 size={17} />
          <strong>Trạng thái</strong>
        </div>
        <p>{status}</p>
        {savedAt ? (
          <div className="mws-side-meta">
            <Clock3 size={14} />
            <span>Lưu lần cuối: {savedAt}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
