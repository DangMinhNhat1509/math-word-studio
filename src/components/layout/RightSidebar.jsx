import { Braces, CircleDot, Sigma, Sparkles, Triangle } from "lucide-react";

export default function RightSidebar({
  symbols,
  formulas,
  templates,
  activeFigure,
  figures,
  onSelectFigure,
  onUpdateFigureDiagram,
  onDeleteFigure,
  onInsertSymbol,
  onInsertFormula,
  onInsertTemplate,
}) {
  function keepCaret(event) {
    event.preventDefault();
  }

  function updateDiagram(key, value) {
    if (!activeFigure) return;

    onUpdateFigureDiagram(activeFigure.id, {
      ...activeFigure.diagram,
      [key]: value,
    });
  }

  return (
    <aside className="rightbar">
      <div className="panel-title">
        <Sigma size={17} />
        <b>Ký hiệu nhanh</b>
      </div>

      <div className="symbol-grid">
        {symbols.map((symbol) => (
          <button
            type="button"
            key={symbol}
            onMouseDown={keepCaret}
            onClick={() => onInsertSymbol(symbol)}
          >
            {symbol}
          </button>
        ))}
      </div>

      <div className="panel-title spaced">
        <Braces size={17} />
        <b>Công thức mẫu</b>
      </div>

      <div className="list-buttons">
        {formulas.map((formula) => (
          <button
            type="button"
            key={formula}
            onMouseDown={keepCaret}
            onClick={() => onInsertFormula(formula)}
          >
            {formula}
          </button>
        ))}
      </div>

      <div className="panel-title spaced">
        <Sparkles size={17} />
        <b>Mẫu bài nhanh</b>
      </div>

      <div className="list-buttons">
        {templates.map((template) => (
          <button
            type="button"
            key={template.name}
            onMouseDown={keepCaret}
            onClick={() => onInsertTemplate(template)}
          >
            {template.name}
          </button>
        ))}
      </div>

      <div className="panel-title spaced">
        <CircleDot size={17} />
        <b>Đối tượng hình</b>
      </div>

      <div className="figure-list">
        {(figures || []).map((figure, index) => (
          <button
            type="button"
            key={figure.id}
            className={`figure-item ${activeFigure?.id === figure.id ? "active" : ""}`}
            onClick={() => onSelectFigure(figure.id)}
          >
            <Triangle size={15} />
            {figure.title || `Hình ${index + 1}`}
          </button>
        ))}
      </div>

      {activeFigure && (
        <>
          <button type="button" className="delete-page-btn compact" onClick={() => onDeleteFigure(activeFigure.id)}>
            Xóa hình đang chọn
          </button>

          <div className="panel-title spaced">
            <Triangle size={17} />
            <b>Sửa hình đang chọn</b>
          </div>

          <div className="diagram-settings">
            <label>
              Tên điểm A
              <input value={activeFigure.diagram?.a || ""} onChange={(event) => updateDiagram("a", event.target.value)} />
            </label>
            <label>
              Tên điểm B
              <input value={activeFigure.diagram?.b || ""} onChange={(event) => updateDiagram("b", event.target.value)} />
            </label>
            <label>
              Tên điểm C
              <input value={activeFigure.diagram?.c || ""} onChange={(event) => updateDiagram("c", event.target.value)} />
            </label>
            <label>
              Cạnh AB
              <input value={activeFigure.diagram?.ab || ""} onChange={(event) => updateDiagram("ab", event.target.value)} />
            </label>
            <label>
              Cạnh AC
              <input value={activeFigure.diagram?.ac || ""} onChange={(event) => updateDiagram("ac", event.target.value)} />
            </label>
            <label>
              Cạnh BC
              <input value={activeFigure.diagram?.bc || ""} onChange={(event) => updateDiagram("bc", event.target.value)} />
            </label>
          </div>
        </>
      )}

      {!activeFigure && (
        <div className="empty-panel">
          Bấm vào một hình trên trang để sửa tên điểm, cạnh và vị trí.
        </div>
      )}
    </aside>
  );
}
