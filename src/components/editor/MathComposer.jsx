import { useMemo, useState } from "react";
import { Sigma, Sparkles } from "lucide-react";
import { renderMathToHtml } from "../../utils/mathFormatter";

const EXAMPLES = [
  "BC = sqrt(AB^2 + AC^2) = sqrt(6^2 + 8^2) = sqrt(100) = 10cm",
  "S = 1/2 * AB * AC = 1/2 * 6 * 8 = 24cm^2",
  "int_0^1 x^2 dx = 1/3",
  "x = (-b + sqrt(Delta)) / (2a)",
];

export default function MathComposer({ onInsert }) {
  const [value, setValue] = useState(EXAMPLES[0]);

  const previewHtml = useMemo(() => renderMathToHtml(value, true), [value]);

  function addSnippet(snippet) {
    setValue((current) => {
      if (!current.trim()) return snippet;
      return `${current} ${snippet}`;
    });
  }

  function handleInsert() {
    const cleanValue = value.trim();
    if (!cleanValue) return;
    onInsert(cleanValue);
  }

  return (
    <div className="math-composer">
      <div className="math-composer-head">
        <div>
          <div className="math-composer-title">
            <Sigma size={16} />
            <b>Viết công thức chuẩn</b>
          </div>
          <p>Gõ kiểu dễ hiểu: <code>1/2</code>, <code>sqrt(...)</code>, <code>căn(...)</code>, <code>int_0^1</code>, <code>x^2</code>.</p>
        </div>

        <button type="button" className="math-insert-btn" onClick={handleInsert}>
          <Sparkles size={16} />
          Chèn vào bài
        </button>
      </div>

      <textarea
        className="math-composer-input"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
            event.preventDefault();
            handleInsert();
          }
        }}
        placeholder="Ví dụ: S = 1/2 * AB * AC = 24cm^2"
      />

      <div className="math-snippets">
        <button type="button" onClick={() => addSnippet("1/2")}>Phân số 1/2</button>
        <button type="button" onClick={() => addSnippet("sqrt(x + 1)")}>Căn</button>
        <button type="button" onClick={() => addSnippet("x^2")}>Mũ</button>
        <button type="button" onClick={() => addSnippet("x_1")}>Chỉ số dưới</button>
        <button type="button" onClick={() => addSnippet("int_0^1 x^2 dx")}>Tích phân</button>
      </div>

      <div className="math-preview-box">
        <div className="math-preview-label">Xem trước</div>
        <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
      </div>

      <div className="math-example-row">
        {EXAMPLES.map((example) => (
          <button type="button" key={example} onClick={() => setValue(example)}>
            {example}
          </button>
        ))}
      </div>
    </div>
  );
}
