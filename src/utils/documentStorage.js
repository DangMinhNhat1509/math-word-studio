import { DEFAULT_DIAGRAM, DEFAULT_HTML } from "../data/defaultDocument";
import { syncMathFields } from "./mathLiveEditor";

export function loadDocument({ editorRef, setDiagram, setSavedAt }) {
  const savedHtml = localStorage.getItem("mws_document_html");
  const savedDiagram = localStorage.getItem("mws_diagram");
  const savedTime = localStorage.getItem("mws_saved_at");

  if (editorRef.current) {
    editorRef.current.innerHTML = savedHtml || DEFAULT_HTML;
  }

  if (savedDiagram) {
    try {
      setDiagram(JSON.parse(savedDiagram));
    } catch {
      setDiagram(DEFAULT_DIAGRAM);
    }
  }

  if (savedTime) setSavedAt(savedTime);
}

export function saveDocumentToBrowser({ editorRef, diagram, setSavedAt, setStatus }) {
  const now = new Date().toLocaleString("vi-VN");

  syncMathFields(editorRef.current);

  localStorage.setItem("mws_document_html", editorRef.current?.innerHTML || "");
  localStorage.setItem("mws_diagram", JSON.stringify(diagram));
  localStorage.setItem("mws_saved_at", now);

  setSavedAt(now);
  setStatus("Đã lưu vào trình duyệt");
}

export function resetDocument({ editorRef, setSavedAt, setStatus }) {
  if (!confirm("Reset về mẫu ban đầu?")) return;

  editorRef.current.innerHTML = DEFAULT_HTML;
  localStorage.removeItem("mws_document_html");
  setSavedAt("");
  setStatus("Đã reset mẫu");
}
