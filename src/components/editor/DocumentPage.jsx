import { CheckCircle2 } from "lucide-react";
import TriangleDiagram from "../geometry/TriangleDiagram";
import MathComposer from "./MathComposer";
import { formatCurrentBlockToMath } from "../../utils/contentEditableMath";

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
  function handleEditorKeyDown(event) {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault();

      const formatted = formatCurrentBlockToMath(editorRef.current);

      if (formatted) {
        setActiveTool("math");
        setStatus("Đã chuẩn hóa dòng công thức");
        rememberSelection();
      } else {
        setStatus("Đặt con trỏ trong dòng công thức rồi bấm Ctrl + Enter");
      }
    }
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
          Bấm trực tiếp vào nội dung bên dưới để sửa. Với công thức: chọn nút <b>Công thức</b>, hoặc gõ một dòng rồi bấm <kbd>Ctrl</kbd> + <kbd>Enter</kbd> để chuẩn hóa.
        </div>

        {activeTool === "math" && (
          <MathComposer onInsert={onInsertSmartFormula} />
        )}

        <div
          ref={editorRef}
          className="editor"
          contentEditable
          suppressContentEditableWarning
          onMouseUp={rememberSelection}
          onKeyUp={rememberSelection}
          onKeyDown={handleEditorKeyDown}
          onFocus={() => {
            setActiveTool("text");
            rememberSelection();
          }}
          onInput={() => setStatus("Đang chỉnh sửa")}
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
          <span>Bản này đã thêm render công thức chuẩn: phân số, căn, mũ, chỉ số dưới, tích phân và công thức mẫu.</span>
        </div>
      </section>
    </div>
  );
}
