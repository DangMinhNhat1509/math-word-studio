import React, { useEffect, useRef, useState } from "react";

import { SYMBOLS, FORMULAS, TEMPLATES } from "./data/mathData";
import { useEditorSelection } from "./hooks/useEditorSelection";
import { useDocumentPages } from "./hooks/useDocumentPages";
import { useGeometryEditor } from "./hooks/useGeometryEditor";
import { getSavedAt } from "./utils/documentStorage";

import {
  copyHtml,
  copyPlainText,
  insertHtmlToEditor,
  printPdf,
  runCommand,
} from "./utils/editorCommands";

import { insertInlineMathField } from "./utils/mathLiveEditor";
import { cleanEditorFormat } from "./utils/pasteCleaner";

import Topbar from "./components/layout/Topbar";
import LeftSidebar from "./components/layout/LeftSidebar";
import Toolbar from "./components/layout/Toolbar";
import RightSidebar from "./components/layout/RightSidebar";
import DocumentPage from "./components/editor/DocumentPage";

export default function App() {
  const editorRef = useRef(null);
  const { rememberSelection, restoreSelection } = useEditorSelection(editorRef);

  const [activeTool, setActiveTool] = useState("text");
  const [status, setStatus] = useState("Đã sẵn sàng");
  const [savedAt, setSavedAt] = useState(() => getSavedAt());

  const documentState = useDocumentPages(editorRef, setSavedAt, setStatus);

  const {
    pages,
    currentPageId,
    currentPage,
    snapshotCurrentPage,
    updatePage,
    updateCurrentPage,
    setPages,
    selectPage,
    addPage,
    deleteCurrentPage,
    saveDocument,
    resetDocument,
  } = documentState;

  const geometry = useGeometryEditor({
    pages,
    currentPageId,
    currentPage,
    snapshotCurrentPage,
    setPages,
    updatePage,
    updateCurrentPage,
    setActiveTool,
    setStatus,
  });

  const {
    figures,
    activeFigure,
    addFigure,
    selectFigure,
    deselectFigure,
    updateFigure,
    updateActiveFigure,
    updateFigureBox,
    deleteFigure,
    startDraw,
    clearActiveFigure,
  } = geometry;

  function insertHtml(html, message) {
    insertHtmlToEditor({
      editorRef,
      html,
      restoreSelection,
      rememberSelection,
      setStatus,
      message,
    });

    setTimeout(() => {
      updateCurrentPage({
        html: editorRef.current?.innerHTML || "",
      });
    }, 0);
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

    setTimeout(() => {
      updateCurrentPage({
        html: editorRef.current?.innerHTML || "",
      });
    }, 0);
  }

  function insertTextBox() {
    setActiveTool("textbox");

    insertHtml(
      `<span class="word-textbox" contenteditable="true">Nhập nội dung khung...</span>&nbsp;`,
      "Đã chèn khung chữ"
    );
  }

  function cleanFormat() {
    const cleanHtml = cleanEditorFormat(editorRef.current);
    updateCurrentPage({ html: cleanHtml });
    setStatus("Đã dọn format nội dung");
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

  function handlePrint() {
    saveDocument();
    printPdf({ saveDocument: () => {} });
  }


  function isEditableShortcutTarget(target) {
    if (!target) return false;

    const tag = target.tagName;

    return (
      tag === "INPUT" ||
      tag === "TEXTAREA" ||
      tag === "MATH-FIELD" ||
      target.isContentEditable ||
      target.closest?.("[contenteditable='true']")
    );
  }

  useEffect(() => {
    function handleGlobalShortcuts(event) {
      const key = event.key.toLowerCase();

      if ((event.ctrlKey || event.metaKey) && key === "s") {
        event.preventDefault();
        saveDocument();
        return;
      }

      if ((event.ctrlKey || event.metaKey) && key === "p") {
        event.preventDefault();
        handlePrint();
        return;
      }

      if ((event.ctrlKey || event.metaKey) && event.shiftKey && key === "c") {
        event.preventDefault();
        handleCopyText();
        return;
      }

      if ((event.ctrlKey || event.metaKey) && event.shiftKey && key === "f") {
        event.preventDefault();

        if (!isEditableShortcutTarget(event.target) || editorRef.current?.contains(event.target)) {
          cleanFormat();
        }
      }
    }

    window.addEventListener("keydown", handleGlobalShortcuts);

    return () => window.removeEventListener("keydown", handleGlobalShortcuts);
  });

  if (!currentPage) {
    return <div className="app">Đang tải tài liệu...</div>;
  }

  return (
    <div className="app">
      <Topbar />

      <div className="layout">
        <LeftSidebar
          pages={pages}
          currentPageId={currentPageId}
          status={status}
          savedAt={savedAt}
          onSelectPage={selectPage}
          onAddPage={addPage}
          onDeletePage={deleteCurrentPage}
          onSave={saveDocument}
          onCopyText={handleCopyText}
          onCopyHtml={handleCopyHtml}
          onPrint={handlePrint}
          onReset={resetDocument}
        />

        <main className="main">
          <Toolbar
            activeTool={activeTool}
            setActiveTool={setActiveTool}
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
            onAddFigure={() => addFigure("select")}
            onDraw={startDraw}
            onCleanFormat={cleanFormat}
          />

          <DocumentPage
            pages={pages}
            currentPageId={currentPageId}
            pageCount={pages.length}
            editorRef={editorRef}
            activeTool={activeTool}
            rememberSelection={rememberSelection}
            onSelectPage={selectPage}
            onDeselectFigure={deselectFigure}
            onUpdatePageHtml={(pageId, html) => updatePage(pageId, { html })}
            onUpdateFigure={updateFigure}
            onUpdateFigureBox={updateFigureBox}
            onSelectFigure={selectFigure}
            onDeleteFigure={deleteFigure}
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
          onDeleteFigure={(figureId) => deleteFigure(currentPageId, figureId)}
          onDeselectFigure={() => deselectFigure(currentPageId)}
          onClearFigure={clearActiveFigure}
          onInsertSymbol={(symbol) => insertSmartFormula(symbol)}
          onInsertFormula={(formula) => insertSmartFormula(formula)}
          onInsertTemplate={(template) => insertHtml(template.html, `Đã chèn mẫu: ${template.name}`)}
        />
      </div>
    </div>
  );
}
