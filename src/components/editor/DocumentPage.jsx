import { useEffect } from "react";
import { CheckCircle2 } from "lucide-react";

import TriangleDiagram from "../geometry/TriangleDiagram";

import {
  autoConvertTypedMathAtCaret,
  convertCurrentBlockToInlineMath,
  prepareEditorMath,
} from "../../utils/mathLiveEditor";

export default function DocumentPage({
  editorRef,
  activeTool,
  rememberSelection,
  showDiagram,
  showGrid,
  showAxis,
  diagram,
  setDiagram,
  setActiveTool,
  setStatus,
  onInsertSmartFormula,
}) {
  useEffect(() => {
    prepareEditorMath(editorRef.current);
  }, [editorRef]);

  function handleEditorKeyDown(event) {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "m") {
      event.preventDefault();
      setActiveTool("math");
      onInsertSmartFormula("");
      return;
    }

    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault();

      const converted = convertCurrentBlockToInlineMath(editorRef.current);

      if (converted) {
        setActiveTool("math");
        setStatus("Đã đổi dòng hiện tại thành công thức inline, vẫn sửa được");
        rememberSelection();
      } else {
        setStatus("Đặt con trỏ trong dòng công thức rồi bấm Ctrl + Enter");
      }
    }
  }

  function handleEditorInput(event) {
    prepareEditorMath(editorRef.current);

    if (event.target?.tagName !== "MATH-FIELD") {
      const converted = autoConvertTypedMathAtCaret(editorRef.current);

      if (converted) {
        setStatus("Đã tự đổi thành phân số/căn inline");
      } else {
        setStatus("Đang chỉnh sửa");
      }
    }

    rememberSelection();
  }

  return (
    <div className="workspace">
      <section className="paper">
        <div className="paper-head">
          <div>
            <div className="kicker">Math Word Studio</div>
            <h1>Phiếu bài tập toán</h1>
          </div>

          <div className="paper-meta">A4 · Preview</div>
        </div>

        <div className="edit-hint">
          Bấm <b>Công thức</b> để chèn ngay tại con trỏ. Gõ <b>1/2</b>, <b>sqrt(100)</b>, <b>căn(x+1)</b> trong bài sẽ tự thành công thức. Bấm vào công thức để sửa trực tiếp.
        </div>

        <div
          ref={editorRef}
          className={`editor ${activeTool === "math" ? "math-mode" : ""}`}
          contentEditable
          suppressContentEditableWarning
          onMouseUp={rememberSelection}
          onKeyUp={rememberSelection}
          onKeyDown={handleEditorKeyDown}
          onFocus={(event) => {
            if (event.target?.tagName !== "MATH-FIELD") {
              setActiveTool("text");
            }
            rememberSelection();
          }}
          onInput={handleEditorInput}
        />

        {showDiagram && (
          <TriangleDiagram
            diagram={diagram}
            setDiagram={setDiagram}
            showGrid={showGrid}
            showAxis={showAxis}
          />
        )}

        <div className="paper-note">
          <CheckCircle2 size={17} />
          <span>Công thức nằm chung với chữ, bấm vào là sửa được. Nút ký hiệu/công thức mẫu sẽ chèn đúng vị trí con trỏ.</span>
        </div>
      </section>
    </div>
  );
}
