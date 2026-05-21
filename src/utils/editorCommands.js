import { getPlainTextWithMath, syncMathFields } from "./mathLiveEditor";

export function runCommand(command, value = null) {
  document.execCommand(command, false, value);
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
  if (!editor) return;

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

  runCommand("insertHTML", html);
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
