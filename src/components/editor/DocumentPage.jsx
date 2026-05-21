import { useEffect, useRef } from "react";

import TriangleDiagram from "../geometry/TriangleDiagram";

import {
  autoConvertTypedMathAtCaret,
  convertCurrentBlockToInlineMath,
  prepareEditorMath,
} from "../../utils/mathLiveEditor";

import { handleCleanPaste } from "../../utils/pasteCleaner";

export default function DocumentPage({
  page,
  pageIndex,
  pageCount,
  editorRef,
  activeTool,
  rememberSelection,
  showGrid,
  showAxis,
  figures,
  selectedFigureId,
  setSelectedFigureId,
  onUpdateFigureBox,
  onUpdateFigureDiagram,
  setActiveTool,
  setStatus,
  onInsertSmartFormula,
  onUpdateHtml,
}) {
  const dragRef = useRef(null);

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
        onUpdateFigureBox(drag.figureId, {
          ...drag.startBox,
          x: Math.max(0, drag.startBox.x + dx),
          y: Math.max(0, drag.startBox.y + dy),
        });
      }

      if (drag.mode === "resize") {
        onUpdateFigureBox(drag.figureId, {
          ...drag.startBox,
          width: Math.max(220, drag.startBox.width + dx),
          height: Math.max(150, drag.startBox.height + dy),
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
  }, [onUpdateFigureBox]);

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
      setStatus(converted ? "Đã tự đổi thành công thức" : "Đang chỉnh sửa");
    }

    rememberSelection();
    syncHtml();
  }

  function startMove(event, figure) {
    event.preventDefault();
    event.stopPropagation();

    setSelectedFigureId(figure.id);

    dragRef.current = {
      mode: "move",
      figureId: figure.id,
      startX: event.clientX,
      startY: event.clientY,
      startBox: figure.box,
    };
  }

  function startResize(event, figure) {
    event.preventDefault();
    event.stopPropagation();

    setSelectedFigureId(figure.id);

    dragRef.current = {
      mode: "resize",
      figureId: figure.id,
      startX: event.clientX,
      startY: event.clientY,
      startBox: figure.box,
    };
  }

  return (
    <div className="workspace">
      <div className="page-toolbar">
        <span>A4 · Trang {pageIndex + 1}/{pageCount}</span>
        <span>Bấm Hình học để thêm hình mới. Click hình để sửa bên phải.</span>
      </div>

      <section className="paper">
        <div
          ref={editorRef}
          className={`editor ${activeTool === "math" ? "math-mode" : ""}`}
          contentEditable
          suppressContentEditableWarning
          onPaste={(event) => {
            handleCleanPaste(event, editorRef.current);
            setTimeout(syncHtml, 0);
          }}
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

        {(figures || []).map((figure) => {
          const selected = figure.id === selectedFigureId;
          const box = figure.box || { x: 80, y: 520, width: 420, height: 260 };

          return (
            <div
              key={figure.id}
              className={`figure-box ${selected ? "selected" : ""}`}
              style={{
                left: `${box.x}px`,
                top: `${box.y}px`,
                width: `${box.width}px`,
                height: `${box.height}px`,
              }}
              onPointerDown={(event) => {
                event.stopPropagation();
                setSelectedFigureId(figure.id);
              }}
            >
              <div className="figure-toolbar" onPointerDown={(event) => startMove(event, figure)}>
                <span>{figure.title || "Hình học"}</span>
                <small>Kéo để di chuyển</small>
              </div>

              <div className="figure-content">
                <TriangleDiagram
                  diagram={figure.diagram}
                  setDiagram={(nextDiagram) => {
                    const oldDiagram = figure.diagram || {};
                    onUpdateFigureDiagram(
                      figure.id,
                      typeof nextDiagram === "function" ? nextDiagram(oldDiagram) : nextDiagram
                    );
                  }}
                  showGrid={showGrid}
                  showAxis={showAxis}
                />
              </div>

              <span className="figure-resize" onPointerDown={(event) => startResize(event, figure)} />
            </div>
          );
        })}
      </section>
    </div>
  );
}
