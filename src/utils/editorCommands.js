export function runCommand(command, value = null) {
  document.execCommand(command, false, value);
}

export function insertHtmlToEditor({
  editorRef,
  html,
  restoreSelection,
  rememberSelection,
  setStatus,
  message = "Đã chèn nội dung"
}) {
  editorRef.current?.focus();
  restoreSelection();
  runCommand("insertHTML", html);
  rememberSelection();
  setStatus(message);
}

export async function copyPlainText({ editorRef, showDiagram, diagram, setStatus }) {
  const text = editorRef.current?.innerText || "";
  const diagramText = showDiagram
    ? `\n\nHình: Tam giác ${diagram.a}${diagram.b}${diagram.c}; ${diagram.ab}; ${diagram.ac}; ${diagram.bc}`
    : "";

  await navigator.clipboard.writeText(text + diagramText);
  setStatus("Đã copy chữ, có thể dán sang Word/Zalo/Docs");
}

export async function copyHtml({ editorRef, setStatus }) {
  const html = editorRef.current?.innerHTML || "";
  await navigator.clipboard.writeText(html);
  setStatus("Đã copy HTML");
}

export function printPdf({ saveDocument }) {
  saveDocument();
  setTimeout(() => window.print(), 100);
}
