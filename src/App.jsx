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
import AppNavigation from "./components/layout/AppNavigation";
import DocumentPage from "./components/editor/DocumentPage";

import DashboardPage from "./components/pages/DashboardPage";
import TemplatesPage from "./components/pages/TemplatesPage";
import DocumentsPage from "./components/pages/DocumentsPage";

export default function App() {
  const editorRef = useRef(null);
  const { rememberSelection, restoreSelection } = useEditorSelection(editorRef);

  const [activePage, setActivePage] = useState("dashboard");
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
    activeFigure,
    addFigure,
    selectFigure,
    deselectFigure,
    updateFigure,
    updateFigureBox,
    deleteFigure,
    startDraw,
    clearActiveFigure,
  } = geometry;

  function goEditor(message) {
    setActivePage("editor");
    if (message) setStatus(message);
  }

  function handleNavigate(target) {
    if (target === "formula") {
      setActiveTool("math");
      goEditor("Đã mở công cụ công thức");
      return;
    }

    if (target === "geometry") {
      setActiveTool("geometry");
      goEditor("Đã mở công cụ hình học");
      return;
    }

    if (target === "graph") {
      setActiveTool("geometry");
      goEditor("Đồ thị đang được chuẩn bị trong giai đoạn tiếp theo");
      return;
    }

    if (target === "export") {
      goEditor("Đang chuẩn bị xuất PDF");
      setTimeout(() => handlePrint(), 120);
      return;
    }

    setActivePage(target);
  }

  function handleDashboardAction(action) {
    if (action === "new") {
      goEditor("Đã tạo tài liệu mới");
      return;
    }

    if (action === "open") {
      goEditor("Đã mở tài liệu gần đây");
      return;
    }

    if (action === "exam" || action === "worksheet") {
      setActivePage("templates");
      setStatus("Hãy chọn một mẫu phù hợp để bắt đầu nhanh");
      return;
    }

    if (action === "formula") {
      setActiveTool("math");
      goEditor("Đã mở công cụ công thức nhanh");
      return;
    }

    if (action === "geometry") {
      setActiveTool("geometry");
      goEditor("Đã mở công cụ hình học");
    }
  }

  function handleDocumentAction(action, title) {
    const label = title ? `: ${title}` : "";

    if (action === "duplicate") {
      setStatus(`Đã chọn nhân bản tài liệu${label}`);
      return;
    }

    if (action === "rename") {
      setStatus(`Đã chọn đổi tên tài liệu${label}`);
      return;
    }

    if (action === "delete") {
      setStatus(`Đã chọn xóa tài liệu${label}`);
      return;
    }

    if (action === "filter") {
      setStatus("Bộ lọc tài liệu đang hoạt động theo thư mục và tìm kiếm");
      return;
    }

    if (action === "sort") {
      setStatus("Đang sắp xếp tài liệu theo mới nhất");
    }
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

    setTimeout(() => {
      updateCurrentPage({ html: editorRef.current?.innerHTML || "" });
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
      updateCurrentPage({ html: editorRef.current?.innerHTML || "" });
    }, 0);
  }

  function insertTextBox() {
    setActiveTool("textbox");
    insertHtml(
      `<div class="word-textbox">Nhập nội dung khung...</div>`,
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

  function handleUseTemplate(template) {
    setActivePage("editor");
    setActiveTool("text");

    setTimeout(() => {
      insertHtml(template.html, `Đã chèn mẫu: ${template.name}`);
    }, 120);
  }

  function handleOpenDocument(title) {
    setActivePage("editor");
    setActiveTool("text");
    setStatus(title ? `Đã mở tài liệu: ${title}` : "Đã mở tài liệu");
  }

  function handleCreateNewDocument() {
    setActivePage("editor");
    setActiveTool("text");
    setStatus("Đã tạo tài liệu mới");
  }

  function handleExportDocument(title) {
    setActivePage("editor");
    setStatus(title ? `Đang xuất PDF: ${title}` : "Đang xuất PDF");
    setTimeout(() => handlePrint(), 120);
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

        if (
          !isEditableShortcutTarget(event.target) ||
          editorRef.current?.contains(event.target)
        ) {
          cleanFormat();
        }
      }
    }

    window.addEventListener("keydown", handleGlobalShortcuts);
    return () => window.removeEventListener("keydown", handleGlobalShortcuts);
  }, [saveDocument]);

  if (!currentPage) {
    return <div className="mws-loading-screen">Đang tải tài liệu...</div>;
  }

  const commonTopbarProps = {
    activePage,
    savedAt,
    status,
    onSave: saveDocument,
    onPrint: handlePrint,
    onCopyText: handleCopyText,
    onCopyHtml: handleCopyHtml,
    onReset: resetDocument,
  };

  return (
    <div className="mws-app-shell">
      <Topbar {...commonTopbarProps} />

      {activePage === "editor" ? (
        <div className="mws-editor-layout">
          <LeftSidebar
            activePage={activePage}
            activeTool={activeTool}
            onNavigate={handleNavigate}
            pages={pages}
            currentPageId={currentPageId}
            status={status}
            savedAt={savedAt}
            onSelectPage={selectPage}
            onAddPage={addPage}
            onDeletePage={deleteCurrentPage}
          />

          <main className="mws-center-column">
            <Toolbar
              activeTool={activeTool}
              setActiveTool={setActiveTool}
              onBold={() => runCommand("bold")}
              onItalic={() => runCommand("italic")}
              onUnderline={() => runCommand("underline")}
              onHighlight={() =>
                insertHtml(
                  `<mark class="highlight">nội dung cần nhấn mạnh</mark>`,
                  "Đã chèn highlight"
                )
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
            activeFigure={activeFigure}
            onDeleteFigure={(figureId) => deleteFigure(currentPageId, figureId)}
            onDeselectFigure={() => deselectFigure(currentPageId)}
            onClearFigure={clearActiveFigure}
            onInsertSymbol={(symbol) => insertSmartFormula(symbol)}
            onInsertFormula={(formula) => insertSmartFormula(formula)}
            onInsertTemplate={(template) =>
              insertHtml(template.html, `Đã chèn mẫu: ${template.name}`)
            }
          />
        </div>
      ) : (
        <div className="mws-product-layout">
          <AppNavigation
            activePage={activePage}
            activeTool={activeTool}
            onNavigate={handleNavigate}
          />

          <main className="mws-product-main">
            {activePage === "dashboard" && (
              <DashboardPage
                onNavigate={handleNavigate}
                onAction={handleDashboardAction}
              />
            )}

            {activePage === "templates" && (
              <TemplatesPage
                templates={TEMPLATES}
                onUseTemplate={handleUseTemplate}
              />
            )}

            {activePage === "documents" && (
              <DocumentsPage
                onOpenEditor={handleOpenDocument}
                onCreateNew={handleCreateNewDocument}
                onExportDocument={handleExportDocument}
                onDocumentAction={handleDocumentAction}
              />
            )}
          </main>
        </div>
      )}
    </div>
  );
}
