import { Braces, Sigma, Sparkles, Triangle } from "lucide-react";

export default function RightSidebar({
  symbols,
  formulas,
  templates,
  diagram,
  setDiagram,
  onInsertSymbol,
  onInsertFormula,
  onInsertTemplate
}) {
  function updateDiagram(key, value) {
    setDiagram({ ...diagram, [key]: value });
  }

  return (
    <aside className="rightbar">
      <div className="panel-title">
        <Sigma size={18} />
        <b>Ký hiệu nhanh</b>
      </div>

      <div className="symbol-grid">
        {symbols.map((symbol) => (
          <button key={symbol} onClick={() => onInsertSymbol(symbol)}>
            {symbol}
          </button>
        ))}
      </div>

      <div className="panel-title spaced">
        <Braces size={18} />
        <b>Công thức mẫu</b>
      </div>

      <div className="list-buttons">
        {formulas.map((formula) => (
          <button key={formula} onClick={() => onInsertFormula(formula)}>
            {formula}
          </button>
        ))}
      </div>

      <div className="panel-title spaced">
        <Sparkles size={18} />
        <b>Mẫu bài nhanh</b>
      </div>

      <div className="list-buttons">
        {templates.map((template) => (
          <button key={template.name} onClick={() => onInsertTemplate(template)}>
            {template.name}
          </button>
        ))}
      </div>

      <div className="panel-title spaced">
        <Triangle size={18} />
        <b>Sửa hình</b>
      </div>

      <div className="diagram-settings">
        <label>Điểm A <input value={diagram.a} onChange={(e) => updateDiagram("a", e.target.value)} /></label>
        <label>Điểm B <input value={diagram.b} onChange={(e) => updateDiagram("b", e.target.value)} /></label>
        <label>Điểm C <input value={diagram.c} onChange={(e) => updateDiagram("c", e.target.value)} /></label>
        <label>Cạnh AB <input value={diagram.ab} onChange={(e) => updateDiagram("ab", e.target.value)} /></label>
        <label>Cạnh AC <input value={diagram.ac} onChange={(e) => updateDiagram("ac", e.target.value)} /></label>
        <label>Cạnh BC <input value={diagram.bc} onChange={(e) => updateDiagram("bc", e.target.value)} /></label>
      </div>
    </aside>
  );
}
