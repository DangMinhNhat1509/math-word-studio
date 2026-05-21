import { useEffect, useRef } from "react";

import TriangleDiagram from "../geometry/TriangleDiagram";

import {
  autoConvertTypedMathAtCaret,
  convertCurrentBlockToInlineMath,
  prepareEditorMath,
} from "../../utils/mathLiveEditor";

const DEFAULT_BOX = {
  x: 72,
  y: 610,
  width: 640,
  height: 320,
};

export default function DocumentPage({
  page,
  pageIndex,
  pageCount,
  editorRef,
  activeTool,
  rememberSelection,
  showDiagram,
  showGrid,
  showAxis,
  diagram,
  setDiagram,
  diagramBox,
  setDiagramBox,
  setActiveTool,
  setStatus,
  onInsertSmartFormula,
  onUpdateHtml,
}) {
  const dragRef = useRef(null);

  const box = {
    ...DEFAULT_BOX,
    ...(diagramBox || {}),
  };

  useEffect(() => {
    if (!editorRef.current || !page) return;

    editorRef.current.innerHTML = page.html || "<p><br></p>";
    prepareEditorMath(editorRef.current);
  }, [page?.id, editorRef]);

  useEffect(() => {
    function handleMove(event) {
      const drag = dragRef.current;
      if (!drag) return;

      event.preventDefault();

      const dx = event.clientX - drag.startX;
      const dy = event.clientY - drag.startY;

      if (drag.mode === "move") {
        setDiagramBox({
          ...drag.startBox,
          x: Math.max(0, drag.startBox.x + dx),
          y: Math.max(0, drag.startBox.y + dy),
        });
      }

      if (drag.mode === "resize") {
        setDiagramBox({
          ...drag.startBox,
          width: Math.max(260, drag.startBox.width + dx),
          height: Math.max(180, drag.startBox.height + dy),
        });
      }
    }

    function handleUp() {
      dragRef.current = null;
    }

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };
  }, [setDiagramBox]);

  function syncHtml() {
    onUpdateHtml(editorRef.current?.innerHTML || "");
  }

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
        setStatus("Đã đổi dòng hiện tại thành công thức");
        rememberSelection();
        syncHtml();
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
        setStatus("Đã tự đổi thành công thức");
      } else {
        setStatus("Đang chỉnh sửa");
      }
    }

    rememberSelection();
    syncHtml();
  }

  function startMove(event) {
    event.preventDefault();
    event.stopPropagation();

    dragRef.current = {
      mode: "move",
      startX: event.clientX,
      startY: event.clientY,
      startBox: box,
    };
  }

  function startResize(event) {
    event.preventDefault();
    event.stopPropagation();

    dragRef.current = {
      mode: "resize",
      startX: event.clientX,
      startY: event.clientY,
      startBox: box,
    };
  }

  return (
    <div className="workspace">
      <div className="page-toolbar">
        <span>A4 · Trang {pageIndex + 1}/{pageCount}</span>
        <span>Soạn như Word: chữ không còn bị nhốt trong khung, hình kéo được trên trang.</span>
      </div>

      <section className="paper">
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
          onBlur={syncHtml}
          onInput={handleEditorInput}
        />

        {showDiagram && (
          <div
            className="figure-box"
            style={{
              left: `${box.x}px`,
              top: `${box.y}px`,
              width: `${box.width}px`,
              height: `${box.height}px`,
            }}
          >
            <div className="figure-toolbar" onPointerDown={startMove}>
              <span>Hình học</span>
              <small>Kéo để di chuyển</small>
            </div>

            <div className="figure-content">
              <TriangleDiagram
                diagram={diagram}
                setDiagram={setDiagram}
                showGrid={showGrid}
                showAxis={showAxis}
              />
            </div>

            <span className="figure-resize" onPointerDown={startResize} />
          </div>
        )}
      </section>
    </div>
  );
}
