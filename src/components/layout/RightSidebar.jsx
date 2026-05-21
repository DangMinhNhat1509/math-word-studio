import { Braces, Sigma, Sparkles, Triangle } from "lucide-react";

export default function RightSidebar({
  symbols,
  formulas,
  templates,
  diagram,
  setDiagram,
  onInsertSymbol,
  onInsertFormula,
  onInsertTemplate,
}) {
  function updateDiagram(key, value) {
    setDiagram({ ...diagram, [key]: value });
  }

  function keepCaret(event) {
    event.preventDefault();
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
        <Triangle size={17} />
        <b>Sửa hình</b>
      </div>

      <div className="diagram-settings">
        <label>
          Điểm A
          <input value={diagram.a} onChange={(event) => updateDiagram("a", event.target.value)} />
        </label>
        <label>
          Điểm B
          <input value={diagram.b} onChange={(event) => updateDiagram("b", event.target.value)} />
        </label>
        <label>
          Điểm C
          <input value={diagram.c} onChange={(event) => updateDiagram("c", event.target.value)} />
        </label>
        <label>
          Cạnh AB
          <input value={diagram.ab} onChange={(event) => updateDiagram("ab", event.target.value)} />
        </label>
        <label>
          Cạnh AC
          <input value={diagram.ac} onChange={(event) => updateDiagram("ac", event.target.value)} />
        </label>
        <label>
          Cạnh BC
          <input value={diagram.bc} onChange={(event) => updateDiagram("bc", event.target.value)} />
        </label>
      </div>
    </aside>
  );
}
