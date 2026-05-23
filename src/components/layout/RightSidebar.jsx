import {
  Braces,
  Info,
  Sparkles,
  Sigma,
  Triangle,
  X,
} from "lucide-react";

export default function RightSidebar({
  symbols,
  formulas,
  templates,
  activeFigure,
  onDeleteFigure,
  onDeselectFigure,
  onClearFigure,
  onInsertSymbol,
  onInsertFormula,
  onInsertTemplate,
}) {
  return (
    <div className="mws-rightbar">
      <div className="mws-panel-head mws-panel-head-right">
        <div>
          <h2>Thuộc tính</h2>
          <p>Panel điều khiển theo đối tượng đang chọn</p>
        </div>
      </div>

      <div className="mws-right-scroll">
        {activeFigure ? (
          <section className="mws-property-card">
            <div className="mws-property-head">
              <div className="mws-property-title">
                <Triangle size={16} />
                <strong>{activeFigure.title || "Hình học"}</strong>
              </div>

              <button
                type="button"
                className="mws-mini-danger"
                onClick={() => onDeleteFigure(activeFigure.id)}
              >
                <X size={14} />
              </button>
            </div>

            <div className="mws-property-grid">
              <div className="mws-property-row">
                <span>Loại</span>
                <strong>{activeFigure.type || "geometry"}</strong>
              </div>
              <div className="mws-property-row">
                <span>ID</span>
                <strong>{activeFigure.id?.slice?.(0, 8) || "--"}</strong>
              </div>
            </div>

            <div className="mws-property-actions">
              <button type="button" className="mws-property-btn" onClick={onDeselectFigure}>
                Bỏ chọn
              </button>
              <button type="button" className="mws-property-btn" onClick={onClearFigure}>
                Xóa nét đang chọn
              </button>
            </div>
          </section>
        ) : (
          <section className="mws-property-card">
            <div className="mws-empty-property">
              <Info size={18} />
              <div>
                <strong>Chưa chọn đối tượng</strong>
                <p>Chọn chữ, công thức hoặc hình để hiện phần chỉnh sửa tương ứng.</p>
              </div>
            </div>
          </section>
        )}

        <section className="mws-property-card">
          <div className="mws-section-title">
            <Sigma size={16} />
            <strong>Ký hiệu nhanh</strong>
          </div>

          <div className="mws-chip-grid">
            {symbols.map((symbol) => (
              <button
                key={symbol}
                type="button"
                className="mws-chip"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => onInsertSymbol(symbol)}
              >
                {symbol}
              </button>
            ))}
          </div>
        </section>

        <section className="mws-property-card">
          <div className="mws-section-title">
            <Braces size={16} />
            <strong>Công thức mẫu</strong>
          </div>

          <div className="mws-list-buttons">
            {formulas.map((formula) => (
              <button
                key={formula}
                type="button"
                className="mws-list-btn"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => onInsertFormula(formula)}
              >
                {formula}
              </button>
            ))}
          </div>
        </section>

        <section className="mws-property-card">
          <div className="mws-section-title">
            <Sparkles size={16} />
            <strong>Mẫu bài</strong>
          </div>

          <div className="mws-list-buttons">
            {templates.map((template) => (
              <button
                key={template.name}
                type="button"
                className="mws-list-btn"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => onInsertTemplate(template)}
              >
                {template.name}
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
