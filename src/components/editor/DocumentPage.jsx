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

function safeHtml(html = "") {
  return html && html.trim() ? html : "<p><br /></p>";
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
    editorRef.current.innerHTML = safeHtml(activePage.html);
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

  const currentIndex = Math.max(0, pages.findIndex((page) => page.id === currentPageId));

  return (
    <main className="workspace word-workspace">
      <div className="word-workspace-inner">
        {pages.map((page, pageIndex) => {
          const isActive = page.id === currentPageId;
          const selectedFigureId = page.selectedFigureId;

          return (
            <section
              key={page.id}
              className={isActive ? "page-shell word-page-shell active" : "page-shell word-page-shell"}
              onMouseDown={() => onSelectPage(page.id)}
            >
              <div className="word-page-meta">
                <span>Trang {pageIndex + 1}</span>
                <span>A4 · 210 × 297 mm</span>
              </div>

              <article className={isActive ? "paper word-paper active-paper" : "paper word-paper"}>
                {isActive ? (
                  <div
                    ref={editorRef}
                    className="editor word-editor"
                    contentEditable
                    suppressContentEditableWarning
                    data-active-tool={activeTool}
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
                    className="editor word-editor readonly-editor"
                    dangerouslySetInnerHTML={{ __html: safeHtml(page.html) }}
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
                      className={selected ? "figure-box selected" : "figure-box"}
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
                      <div className="figure-toolbar" onPointerDown={(event) => startMove(event, page.id, figure)}>
                        <span>{figure.title || "Hình học"}</span>
                        <small>Kéo để di chuyển</small>
                        <button
                          type="button"
                          onPointerDown={(event) => event.stopPropagation()}
                          onClick={() => onDeleteFigure(page.id, figure.id)}
                        >
                          Xóa
                        </button>
                      </div>

                      <div className="figure-content">
                        <GeometryCanvas
                          figure={figure}
                          selected={selected}
                          onDelete={() => onDeleteFigure(page.id, figure.id)}
                          onChange={(nextFigure) => onUpdateFigure(page.id, figure.id, nextFigure)}
                        />
                      </div>

                      <div
                        className="figure-resize"
                        onPointerDown={(event) => startResize(event, page.id, figure)}
                        aria-label="Resize figure"
                      />
                    </div>
                  );
                })}
              </article>
            </section>
          );
        })}
      </div>

      <footer className="word-statusbar">
        <div>
          Từ: <strong>{counts.words}</strong>
          <span>·</span>
          Ký tự: <strong>{counts.chars}</strong>
          <span>·</span>
          Trang: <strong>{currentIndex + 1}/{pageCount}</strong>
        </div>

        <div className="word-status-zoom">
          <button type="button">−</button>
          <strong>100%</strong>
          <button type="button">+</button>
        </div>
      </footer>
    </main>
  );
}
