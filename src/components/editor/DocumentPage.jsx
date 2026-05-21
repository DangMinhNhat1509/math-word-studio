import { CheckCircle2 } from "lucide-react";
import TriangleDiagram from "../geometry/TriangleDiagram";

export default function DocumentPage({
  editorRef,
  rememberSelection,
  showDiagram,
  showGrid,
  showAxis,
  diagram,
  setDiagram,
  setActiveTool,
  setStatus
}) {
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
          Bấm trực tiếp vào nội dung bên dưới để sửa, thêm dòng, xóa chữ, dán bài.
        </div>

        <div
          ref={editorRef}
          className="editor"
          contentEditable
          suppressContentEditableWarning
          onMouseUp={rememberSelection}
          onKeyUp={rememberSelection}
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
          <span>Bản này đã tách code, vẫn giữ: sửa chữ, chèn ký hiệu, công thức, sửa hình, lưu, copy và in/PDF.</span>
        </div>
      </section>
    </div>
  );
}
