import React, { useRef, useState } from "react";

import { SYMBOLS, FORMULAS, TEMPLATES } from "./data/mathData";
import { useEditorSelection } from "./hooks/useEditorSelection";

import {
  copyHtml,
  copyPlainText,
  insertHtmlToEditor,
  printPdf,
  runCommand,
} from "./utils/editorCommands";

import {
  createBlankPage,
  getInitialPages,
  getSavedAt,
  resetPagesInBrowser,
  savePagesToBrowser,
} from "./utils/documentStorage";

import { createFigure, ensurePageFigures } from "./utils/figures";
import { insertInlineMathField, syncMathFields } from "./utils/mathLiveEditor";
import { cleanEditorFormat } from "./utils/pasteCleaner";

import Topbar from "./components/layout/Topbar";
import LeftSidebar from "./components/layout/LeftSidebar";
import Toolbar from "./components/layout/Toolbar";
import RightSidebar from "./components/layout/RightSidebar";
import DocumentPage from "./components/editor/DocumentPage";

export default function App() {
  const editorRef = useRef(null);
  const { rememberSelection, restoreSelection } = useEditorSelection(editorRef);

  const [doc, setDoc] = useState(() => {
    const pages = getInitialPages().map(ensurePageFigures);

    return {
      pages,
      currentPageId: pages[0]?.id || "",
    };
  });

  const [activeTool, setActiveTool] = useState("text");
  const [showGrid, setShowGrid] = useState(true);
  const [showAxis, setShowAxis] = useState(false);
  const [status, setStatus] = useState("Đã sẵn sàng");
  const [savedAt, setSavedAt] = useState(() => getSavedAt());

  const pages = doc.pages.map(ensurePageFigures);
  const currentPageId = doc.currentPageId;
  const activePageIndex = Math.max(0, pages.findIndex((page) => page.id === currentPageId));
  const activePage = pages[activePageIndex] || pages[0];
  const figures = activePage?.figures || [];
  const selectedFigureId = activePage?.selectedFigureId || figures[0]?.id || null;
  const activeFigure = figures.find((figure) => figure.id === selectedFigureId) || figures[0] || null;

  function snapshotCurrentPage(pageList = pages, pageId = currentPageId) {
    if (!editorRef.current) return pageList;

    syncMathFields(editorRef.current);

    const html = editorRef.current.innerHTML;

    return pageList.map((page) =>
      page.id === pageId
        ? {
            ...page,
            html,
          }
        : page
    );
  }

  function setPages(nextPages, nextCurrentPageId = currentPageId) {
    setDoc({
      pages: nextPages.map(ensurePageFigures),
      currentPageId: nextCurrentPageId,
    });
  }

  function updatePage(pageId, patchOrGetter) {
    setDoc((oldDoc) => {
      const oldPages = oldDoc.pages.map(ensurePageFigures);

      return {
        ...oldDoc,
        pages: oldPages.map((page) => {
          if (page.id !== pageId) return page;

          const patch = typeof patchOrGetter === "function" ? patchOrGetter(page) : patchOrGetter;

          return {
            ...page,
            ...patch,
          };
        }),
      };
    });
  }

  function updateCurrentPage(patchOrGetter) {
    updatePage(currentPageId, patchOrGetter);
  }

  function selectPage(pageId) {
    if (pageId === currentPageId) return;

    setDoc((oldDoc) => ({
      pages: snapshotCurrentPage(oldDoc.pages.map(ensurePageFigures), oldDoc.currentPageId),
      currentPageId: pageId,
    }));

    setStatus("Đã chuyển trang");
  }

  function addPage() {
    const savedPages = snapshotCurrentPage();
    const newPage = createBlankPage(savedPages.length + 1);

    setPages([...savedPages, newPage], newPage.id);
    setStatus("Đã thêm trang mới");
  }

  function deletePage() {
    if (pages.length <= 1) {
      setStatus("Tài liệu cần ít nhất 1 trang");
      return;
    }

    if (!confirm("Xóa trang hiện tại?")) return;

    const savedPages = snapshotCurrentPage();
    const filtered = savedPages.filter((page) => page.id !== currentPageId);
    const nextPage = filtered[Math.max(0, activePageIndex - 1)] || filtered[0];

    setPages(filtered, nextPage.id);
    setStatus("Đã xóa trang");
  }

  function insertHtml(html, message) {
    insertHtmlToEditor({
      editorRef,
      html,
      restoreSelection,
      rememberSelection,
      setStatus,
      message,
    });

    setTimeout(() => updateCurrentPage({ html: editorRef.current?.innerHTML || "" }), 0);
  }

  function insertSmartFormula(value = "") {
    setActiveTool("math");

    insertInlineMathField({
      editorRef,
      restoreSelection,
      rememberSelection,
      setStatus,
      value,
    });

    setTimeout(() => updateCurrentPage({ html: editorRef.current?.innerHTML || "" }), 0);
  }

  function insertTextBox() {
    setActiveTool("textbox");

    insertHtml(
      `<span class="word-textbox" contenteditable="true">Nhập nội dung khung...</span>&nbsp;`,
      "Đã chèn khung chữ"
    );
  }

  function addFigure() {
    const savedPages = snapshotCurrentPage();
    const current = savedPages.find((page) => page.id === currentPageId) || activePage;
    const nextIndex = (current.figures || []).length + 1;
    const newFigure = createFigure(nextIndex);

    const nextPages = savedPages.map((page) =>
      page.id === currentPageId
        ? {
            ...page,
            figures: [...(page.figures || []), newFigure],
            selectedFigureId: newFigure.id,
          }
        : page
    );

    setPages(nextPages, currentPageId);
    setActiveTool("shape");
    setStatus("Đã thêm khung hình trống. Chọn công cụ bên phải để vẽ.");
  }

  function selectFigure(pageId, figureId) {
    updatePage(pageId, {
      selectedFigureId: figureId,
    });

    setActiveTool("shape");
    setStatus("Đã chọn hình");
  }

  function updateFigure(pageId, figureId, nextFigure) {
    updatePage(pageId, (page) => ({
      figures: (page.figures || []).map((figure) =>
        figure.id === figureId ? nextFigure : figure
      ),
      selectedFigureId: figureId,
    }));
  }

  function updateActiveFigure(figureId, nextFigure) {
    updateFigure(currentPageId, figureId, nextFigure);
  }

  function updateFigureBox(pageId, figureId, box) {
    updatePage(pageId, (page) => ({
      figures: (page.figures || []).map((figure) =>
        figure.id === figureId
          ? {
              ...figure,
              box,
            }
          : figure
      ),
      selectedFigureId: figureId,
    }));
  }

  function deleteFigure(figureId) {
    updateCurrentPage((page) => {
      const nextFigures = (page.figures || []).filter((figure) => figure.id !== figureId);

      return {
        figures: nextFigures,
        selectedFigureId: nextFigures[0]?.id || null,
      };
    });

    setStatus("Đã xóa khung hình");
  }

  function deleteSelectedObject() {
    if (!activeFigure?.selectedObjectId) return;

    const selectedId = activeFigure.selectedObjectId;

    const nextObjects = (activeFigure.objects || []).filter((object) => {
      if (object.id === selectedId) return false;

      if (object.type === "segment") {
        return object.from !== selectedId && object.to !== selectedId;
      }

      if (object.type === "circle") {
        return object.center !== selectedId && object.through !== selectedId;
      }

      if (object.type === "rightAngle") {
        return object.at !== selectedId && object.p1 !== selectedId && object.p2 !== selectedId;
      }

      return true;
    });

    updateActiveFigure(activeFigure.id, {
      ...activeFigure,
      objects: nextObjects,
      selectedObjectId: null,
      pendingPointId: null,
    });

    setStatus("Đã xóa đối tượng");
  }

  function clearActiveFigure() {
    if (!activeFigure) return;

    updateActiveFigure(activeFigure.id, {
      ...activeFigure,
      objects: [],
      selectedObjectId: null,
      pendingPointId: null,
    });

    setStatus("Đã xóa hết trong khung hình");
  }

  function cleanFormat() {
    const cleanHtml = cleanEditorFormat(editorRef.current);
    updateCurrentPage({ html: cleanHtml });
    setStatus("Đã dọn format nội dung");
  }

  function saveDocument() {
    const savedPages = snapshotCurrentPage();

    setDoc((oldDoc) => ({
      ...oldDoc,
      pages: savedPages.map(ensurePageFigures),
    }));

    savePagesToBrowser({
      pages: savedPages.map(ensurePageFigures),
      setSavedAt,
      setStatus,
    });
  }

  function handleCopyText() {
    copyPlainText({
      editorRef,
      showDiagram: false,
      diagram: {},
      setStatus,
    });
  }

  function handleCopyHtml() {
    copyHtml({ editorRef, setStatus });
  }

  function handleReset() {
    if (!confirm("Reset toàn bộ tài liệu về mẫu ban đầu?")) return;

    resetPagesInBrowser();

    const page1 = createBlankPage(1);
    const page2 = createBlankPage(2);

    setPages([page1, page2], page1.id);
    setSavedAt("");
    setStatus("Đã reset tài liệu");
  }

  function handlePrint() {
    saveDocument();
    printPdf({ saveDocument: () => {} });
  }

  if (!activePage) {
    return <div className="app">Đang tải tài liệu...</div>;
  }

  return (
    <div className="app">
      <Topbar
        onUndo={() => runCommand("undo")}
        onRedo={() => runCommand("redo")}
        onSave={saveDocument}
        onCopyText={handleCopyText}
        onPrint={handlePrint}
      />

      <div className="layout">
        <LeftSidebar
          pages={pages}
          currentPageId={currentPageId}
          status={status}
          savedAt={savedAt}
          onSelectPage={selectPage}
          onAddPage={addPage}
          onDeletePage={deletePage}
          onSave={saveDocument}
          onCopyText={handleCopyText}
          onCopyHtml={handleCopyHtml}
          onPrint={handlePrint}
          onReset={handleReset}
        />

        <main className="main">
          <Toolbar
            activeTool={activeTool}
            setActiveTool={setActiveTool}
            showGrid={showGrid}
            setShowGrid={setShowGrid}
            showAxis={showAxis}
            setShowAxis={setShowAxis}
            onBold={() => runCommand("bold")}
            onItalic={() => runCommand("italic")}
            onUnderline={() => runCommand("underline")}
            onHighlight={() =>
              insertHtml(`<span class="highlight">nội dung cần nhấn mạnh</span>`, "Đã chèn highlight")
            }
            onAlignLeft={() => runCommand("justifyLeft")}
            onAlignCenter={() => runCommand("justifyCenter")}
            onAlignRight={() => runCommand("justifyRight")}
            onMath={() => insertSmartFormula("")}
            onTextBox={insertTextBox}
            onAddFigure={addFigure}
            onCleanFormat={cleanFormat}
          />

          <DocumentPage
            pages={pages}
            currentPageId={currentPageId}
            pageCount={pages.length}
            editorRef={editorRef}
            activeTool={activeTool}
            rememberSelection={rememberSelection}
            showGrid={showGrid}
            showAxis={showAxis}
            onSelectPage={selectPage}
            onUpdatePageHtml={(pageId, html) => updatePage(pageId, { html })}
            onUpdateFigure={updateFigure}
            onUpdateFigureBox={updateFigureBox}
            onSelectFigure={selectFigure}
            setActiveTool={setActiveTool}
            setStatus={setStatus}
            onInsertSmartFormula={insertSmartFormula}
          />
        </main>

        <RightSidebar
          symbols={SYMBOLS}
          formulas={FORMULAS}
          templates={TEMPLATES}
          figures={figures}
          activeFigure={activeFigure}
          onSelectFigure={(figureId) => selectFigure(currentPageId, figureId)}
          onUpdateFigure={updateActiveFigure}
          onDeleteFigure={deleteFigure}
          onDeleteSelectedObject={deleteSelectedObject}
          onClearFigure={clearActiveFigure}
          onInsertSymbol={(symbol) => insertSmartFormula(symbol)}
          onInsertFormula={(formula) => insertSmartFormula(formula)}
          onInsertTemplate={(template) => insertHtml(template.html, `Đã chèn mẫu: ${template.name}`)}
        />
      </div>
    </div>
  );
}
