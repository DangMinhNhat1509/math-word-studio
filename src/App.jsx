import React, { useEffect, useRef, useState } from "react";

import { SYMBOLS, FORMULAS, TEMPLATES } from "./data/mathData";
import { DEFAULT_DIAGRAM } from "./data/defaultDocument";

import { useEditorSelection } from "./hooks/useEditorSelection";

import { copyHtml, copyPlainText, insertHtmlToEditor, printPdf, runCommand } from "./utils/editorCommands";
import { loadDocument, resetDocument, saveDocumentToBrowser } from "./utils/documentStorage";
import { renderFormulaBlock } from "./utils/mathFormatter";

import Topbar from "./components/layout/Topbar";
import LeftSidebar from "./components/layout/LeftSidebar";
import Toolbar from "./components/layout/Toolbar";
import RightSidebar from "./components/layout/RightSidebar";

import DocumentPage from "./components/editor/DocumentPage";

export default function App() {
  const editorRef = useRef(null);

  const { rememberSelection, restoreSelection } = useEditorSelection(editorRef);

  const [activeTool, setActiveTool] = useState("text");
  const [showGrid, setShowGrid] = useState(true);
  const [showAxis, setShowAxis] = useState(false);
  const [showDiagram, setShowDiagram] = useState(true);
  const [status, setStatus] = useState("Đã sẵn sàng");
  const [savedAt, setSavedAt] = useState("");
  const [diagram, setDiagram] = useState(DEFAULT_DIAGRAM);

  useEffect(() => {
    loadDocument({ editorRef, setDiagram, setSavedAt });
  }, []);

  function insertHtml(html, message) {
    insertHtmlToEditor({
      editorRef,
      html,
      restoreSelection,
      rememberSelection,
      setStatus,
      message,
    });
  }

  function insertSmartFormula(value) {
    insertHtml(renderFormulaBlock(value), "Đã chèn công thức chuẩn");
  }

  function saveDocument() {
    saveDocumentToBrowser({
      editorRef,
      diagram,
      setSavedAt,
      setStatus,
    });
  }

  function handleCopyText() {
    copyPlainText({
      editorRef,
      showDiagram,
      diagram,
      setStatus,
    });
  }

  function handleCopyHtml() {
    copyHtml({ editorRef, setStatus });
  }

  function handleReset() {
    resetDocument({ editorRef, setSavedAt, setStatus });
  }

  function handlePrint() {
    printPdf({ saveDocument });
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
          status={status}
          savedAt={savedAt}
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
            showDiagram={showDiagram}
            setShowDiagram={setShowDiagram}
            onBold={() => runCommand("bold")}
            onItalic={() => runCommand("italic")}
            onUnderline={() => runCommand("underline")}
            onHighlight={() => insertHtml(`<span class="highlight">nội dung cần nhấn mạnh</span>`, "Đã chèn highlight")}
            onAlignLeft={() => runCommand("justifyLeft")}
            onAlignCenter={() => runCommand("justifyCenter")}
            onAlignRight={() => runCommand("justifyRight")}
          />

          <DocumentPage
            editorRef={editorRef}
            activeTool={activeTool}
            rememberSelection={rememberSelection}
            showDiagram={showDiagram}
            showGrid={showGrid}
            showAxis={showAxis}
            diagram={diagram}
            setDiagram={setDiagram}
            setActiveTool={setActiveTool}
            setStatus={setStatus}
            onInsertSmartFormula={insertSmartFormula}
          />
        </main>

        <RightSidebar
          symbols={SYMBOLS}
          formulas={FORMULAS}
          templates={TEMPLATES}
          diagram={diagram}
          setDiagram={setDiagram}
          onInsertSymbol={(symbol) => insertHtml(`<span class="math-symbol">${symbol}</span>`, `Đã chèn ${symbol}`)}
          onInsertFormula={(formula) => insertSmartFormula(formula)}
          onInsertTemplate={(template) => insertHtml(template.html, `Đã chèn mẫu: ${template.name}`)}
        />
      </div>
    </div>
  );
}
