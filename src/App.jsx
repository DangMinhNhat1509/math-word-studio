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

  function updateCurrentPage(patchOrGetter) {
    setDoc((oldDoc) => {
      const oldPages = oldDoc.pages.map(ensurePageFigures);
      const current = oldPages.find((page) => page.id === oldDoc.currentPageId);
      const patch = typeof patchOrGetter === "function" ? patchOrGetter(current) : patchOrGetter;

      return {
        ...oldDoc,
        pages: oldPages.map((page) =>
          page.id === oldDoc.currentPageId
            ? {
                ...page,
                ...patch,
              }
            : page
        ),
      };
    });
  }

  function selectPage(pageId) {
    setDoc((oldDoc) => ({
      pages: snapshotCurrentPage(oldDoc.pages.map(ensurePageFigures), oldDoc.currentPageId),
      currentPageId: pageId,
    }));

    setStatus("Đã chuyển trang");
  }

  function addPage() {
    const savedPages = snapshotCurrentPage();
    const newPage = createBlankPage(savedPages.length + 1);

    setDoc({
      pages: [...savedPages, newPage],
      currentPageId: newPage.id,
    });

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

    setDoc({
      pages: filtered,
      currentPageId: nextPage.id,
    });

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
    const nextIndex = figures.length + 1;
    const newFigure = createFigure(nextIndex);

    updateCurrentPage((page) => ({
      figures: [...(page.figures || []), newFigure],
      selectedFigureId: newFigure.id,
    }));

    setActiveTool("shape");
    setStatus("Đã thêm hình mới. Kéo thanh trên hình để di chuyển.");
  }

  function deleteFigure(figureId) {
    updateCurrentPage((page) => {
      const nextFigures = (page.figures || []).filter((figure) => figure.id !== figureId);

      return {
        figures: nextFigures,
        selectedFigureId: nextFigures[0]?.id || null,
      };
    });

    setStatus("Đã xóa hình");
  }

  function selectFigure(figureId) {
    updateCurrentPage({
      selectedFigureId: figureId,
    });

    setActiveTool("shape");
    setStatus("Đã chọn hình");
  }

  function updateFigureBox(figureId, box) {
    updateCurrentPage((page) => ({
      figures: (page.figures || []).map((figure) =>
        figure.id === figureId ? { ...figure, box } : figure
      ),
      selectedFigureId: figureId,
    }));
  }

  function updateFigureDiagram(figureId, diagram) {
    updateCurrentPage((page) => ({
      figures: (page.figures || []).map((figure) =>
        figure.id === figureId ? { ...figure, diagram } : figure
      ),
      selectedFigureId: figureId,
    }));
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
      showDiagram: true,
      diagram: activeFigure?.diagram || {},
      setStatus,
    });
  }

  function handleCopyHtml() {
    copyHtml({ editorRef, setStatus });
  }

  function handleReset() {
    if (!confirm("Reset toàn bộ tài liệu về mẫu ban đầu?")) return;

    resetPagesInBrowser();

    const page = createBlankPage(1);
    setDoc({
      pages: [page],
      currentPageId: page.id,
    });

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
            showDiagram={figures.length > 0}
            setShowDiagram={() => {}}
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
          />

          <DocumentPage
            key={activePage.id}
            page={activePage}
            pageIndex={activePageIndex}
            pageCount={pages.length}
            editorRef={editorRef}
            activeTool={activeTool}
            rememberSelection={rememberSelection}
            showGrid={showGrid}
            showAxis={showAxis}
            figures={figures}
            selectedFigureId={selectedFigureId}
            setSelectedFigureId={selectFigure}
            onUpdateFigureBox={updateFigureBox}
            onUpdateFigureDiagram={updateFigureDiagram}
            setActiveTool={setActiveTool}
            setStatus={setStatus}
            onInsertSmartFormula={insertSmartFormula}
            onUpdateHtml={(html) => updateCurrentPage({ html })}
          />
        </main>

        <RightSidebar
          symbols={SYMBOLS}
          formulas={FORMULAS}
          templates={TEMPLATES}
          figures={figures}
          activeFigure={activeFigure}
          onSelectFigure={selectFigure}
          onUpdateFigureDiagram={updateFigureDiagram}
          onDeleteFigure={deleteFigure}
          onInsertSymbol={(symbol) => insertSmartFormula(symbol)}
          onInsertFormula={(formula) => insertSmartFormula(formula)}
          onInsertTemplate={(template) => insertHtml(template.html, `Đã chèn mẫu: ${template.name}`)}
        />
      </div>
    </div>
  );
}
