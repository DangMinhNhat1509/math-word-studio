import { getPlainTextWithMath, syncMathFields } from "./mathLiveEditor";
import { sanitizeEditorInput } from "./sanitizer";

export function runCommand(command, value = null) {
  if (!command || typeof command !== 'string') {
    console.error("Invalid command:", command);
    return;
  }
  
  try {
    document.execCommand(command, false, value);
  } catch (error) {
    console.error(`Error running command "${command}":`, error);
  }
}

export function insertHtmlToEditor({
  editorRef,
  html,
  restoreSelection,
  rememberSelection,
  setStatus,
  message = "Đã chèn nội dung",
}) {
  const editor = editorRef.current;
  if (!editor) {
    console.warn("Editor reference not available");
    return;
  }

  // Validate and sanitize input
  if (!html || typeof html !== 'string') {
    console.error("Invalid HTML input:", html);
    return;
  }

  const sanitizedHtml = sanitizeEditorInput(html);

  editor.focus();
  restoreSelection();

  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0 || !editor.contains(selection.anchorNode)) {
    const range = document.createRange();
    range.selectNodeContents(editor);
    range.collapse(false);
    selection?.removeAllRanges();
    selection?.addRange(range);
  }

  runCommand("insertHTML", sanitizedHtml);
  rememberSelection();
  setStatus(message);
}

export async function copyPlainText({ editorRef, showDiagram, diagram, setStatus }) {
  const text = getPlainTextWithMath(editorRef.current);
  const diagramText = showDiagram
    ? `\n\nHình: Tam giác ${diagram.a}${diagram.b}${diagram.c}; ${diagram.ab}; ${diagram.ac}; ${diagram.bc}`
    : "";

  await navigator.clipboard.writeText(text + diagramText);
  setStatus("Đã copy chữ, có thể dán sang Word/Zalo/Docs");
}

export async function copyHtml({ editorRef, setStatus }) {
  syncMathFields(editorRef.current);
  const html = editorRef.current?.innerHTML || "";
  await navigator.clipboard.writeText(html);
  setStatus("Đã copy HTML");
}

export function printPdf({ saveDocument }) {
  saveDocument();
  setTimeout(() => window.print(), 100);
}
