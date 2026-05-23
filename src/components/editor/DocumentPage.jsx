import { useEffect, useMemo, useRef } from "react";
import GeometryCanvas from "../geometry/GeometryCanvas";
import {
  autoConvertTypedMathAtCaret,
  convertCurrentBlockToInlineMath,
  prepareEditorMath,
} from "../../utils/mathLiveEditor";
import { handleCleanPaste } from "../../utils/pasteCleaner";

function stripText(html = "") {
  const div = document.createElement("div");
  div.innerHTML = html;
  return (div.textContent || "").replace(/\s+/g, " ").trim();
}

export default function DocumentPage({
  pages,
  currentPageId,
  pageCount,
  editorRef,
  activeTool,
  rememberSelection,
  onSelectPage,
  onDeselectFigure,
  onUpdatePageHtml,
  onUpdateFigure,
  onUpdateFigureBox,
  onSelectFigure,
  onDeleteFigure,
  setActiveTool,
  setStatus,
  onInsertSmartFormula,
}) {
  const dragRef = useRef(null);
  const activePage = pages.find((page) => page.id === currentPageId) || pages[0];

  useEffect(() => {
    if (!editorRef.current || !activePage) return;
    editorRef.current.innerHTML = activePage.html || "<p></p>";
    prepareEditorMath(editorRef.current);
  }, [activePage?.id, editorRef]);

  useEffect(() => {
    function handleMove(event) {
      const drag = dragRef.current;
      if (!drag) return;

      event.preventDefault();

      const dx = event.clientX - drag.startX;
      const dy = event.clientY - drag.startY;

      if (drag.mode === "move") {
        onUpdateFigureBox(drag.pageId, drag.figureId, {
          ...drag.startBox,
          x: Math.max(0, drag.startBox.x + dx),
          y: Math.max(0, drag.startBox.y + dy),
        });
      }

      if (drag.mode === "resize") {
        onUpdateFigureBox(drag.pageId, drag.figureId, {
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
    if (!editorRef.current || !activePage) return;
    onUpdatePageHtml(activePage.id, editorRef.current.innerHTML || "");
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

  function startMove(event, pageId, figure) {
    event.preventDefault();
    event.stopPropagation();

    onSelectPage(pageId);
    onSelectFigure(pageId, figure.id);

    dragRef.current = {
      mode: "move",
      pageId,
      figureId: figure.id,
      startX: event.clientX,
      startY: event.clientY,
      startBox: figure.box,
    };
  }

  function startResize(event, pageId, figure) {
    event.preventDefault();
    event.stopPropagation();

    onSelectPage(pageId);
    onSelectFigure(pageId, figure.id);

    dragRef.current = {
      mode: "resize",
      pageId,
      figureId: figure.id,
      startX: event.clientX,
      startY: event.clientY,
      startBox: figure.box,
    };
  }

  const counts = useMemo(() => {
    const text = stripText(activePage?.html || "");
    const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
    return {
      words,
      chars: text.length,
    };
  }, [activePage?.html]);

  return (
    <section className="mws-document-stage">
      <div className="mws-page-stack">
        {pages.map((page, pageIndex) => {
          const isActive = page.id === currentPageId;
          const selectedFigureId = page.selectedFigureId;

          return (
            <article
              key={page.id}
              className={`mws-page-frame ${isActive ? "is-active" : ""}`}
              onMouseDown={() => onSelectPage(page.id)}
            >
              <div className="mws-page-frame-head">
                <div className="mws-page-frame-title">
                  <strong>A4</strong>
                  <span>Trang {pageIndex + 1}/{pageCount}</span>
                </div>
                <div className="mws-page-frame-status">
                  {isActive ? "Đang sửa trang này" : "Bấm vào trang để sửa"}
                </div>
              </div>

              <div className="mws-paper-shell">
                <div className="mws-paper">
                  {isActive ? (
                    <div
                      ref={editorRef}
                      className={`mws-editor-content ${activeTool === "text" ? "is-text-mode" : ""}`}
                      contentEditable
                      suppressContentEditableWarning
                      onPaste={(event) => {
                        handleCleanPaste(event, editorRef.current);
                        setTimeout(syncHtml, 0);
                      }}
                      onMouseDown={() => onDeselectFigure(page.id)}
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
                  ) : (
                    <div
                      className="mws-editor-preview"
                      dangerouslySetInnerHTML={{ __html: page.html || "<p></p>" }}
                    />
                  )}

                  {(page.figures || []).map((figure) => {
                    const selected = isActive && figure.id === selectedFigureId;
                    const box = figure.box || {
                      x: 80,
                      y: 520,
                      width: 420,
                      height: 260,
                    };

                    return (
                      <div
                        key={figure.id}
                        className={`mws-figure-box ${selected ? "is-selected" : ""}`}
                        style={{
                          left: box.x,
                          top: box.y,
                          width: box.width,
                          height: box.height,
                        }}
                        onPointerDown={(event) => {
                          event.stopPropagation();
                          onSelectPage(page.id);
                          onSelectFigure(page.id, figure.id);
                        }}
                      >
                        <div
                          className="mws-figure-box-head"
                          onPointerDown={(event) => startMove(event, page.id, figure)}
                        >
                          <span>{figure.title || "Hình học"}</span>
                          <button
                            type="button"
                            className="mws-figure-delete"
                            onPointerDown={(event) => {
                              event.stopPropagation();
                              onDeleteFigure(page.id, figure.id);
                            }}
                          >
                            Xóa
                          </button>
                        </div>

                        <GeometryCanvas
                          figure={figure}
                          onDelete={() => onDeleteFigure(page.id, figure.id)}
                          onChange={(nextFigure) =>
                            onUpdateFigure(page.id, figure.id, nextFigure)
                          }
                        />

                        <button
                          type="button"
                          className="mws-figure-resize"
                          onPointerDown={(event) => startResize(event, page.id, figure)}
                          aria-label="Resize figure"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mws-stage-footer">
        <div className="mws-stage-zoom">
          <button type="button">−</button>
          <span>100%</span>
          <button type="button">+</button>
        </div>

        <div className="mws-stage-stats">
          <span>Từ: {counts.words}</span>
          <span>Ký tự: {counts.chars}</span>
          <span>Trang: {pages.findIndex((page) => page.id === currentPageId) + 1}/{pageCount}</span>
        </div>
      </div>
    </section>
  );
}
