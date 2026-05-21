import { DEFAULT_DIAGRAM, DEFAULT_HTML } from "../data/defaultDocument";

const PAGES_KEY = "mws_pages_v3";
const SAVED_AT_KEY = "mws_saved_at";

function makeId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `page-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function createBlankPage(index = 1, html = "<p><br></p>") {
  return {
    id: makeId(),
    title: `Trang ${index}`,
    html,
    diagram: {
      ...DEFAULT_DIAGRAM,
    },
    diagramBox: {
      x: 72,
      y: 610,
      width: 640,
      height: 320,
    },
  };
}

export function getInitialPages() {
  try {
    const rawPages = localStorage.getItem(PAGES_KEY);
    const parsedPages = rawPages ? JSON.parse(rawPages) : null;

    if (Array.isArray(parsedPages) && parsedPages.length > 0) {
      return parsedPages;
    }
  } catch {
    // fallback below
  }

  const oldHtml = localStorage.getItem("mws_document_html");
  const oldDiagram = localStorage.getItem("mws_diagram");

  let diagram = { ...DEFAULT_DIAGRAM };

  if (oldDiagram) {
    try {
      diagram = {
        ...DEFAULT_DIAGRAM,
        ...JSON.parse(oldDiagram),
      };
    } catch {
      diagram = { ...DEFAULT_DIAGRAM };
    }
  }

  return [
    {
      ...createBlankPage(1, oldHtml || DEFAULT_HTML),
      title: "Trang 1",
      diagram,
    },
  ];
}

export function getSavedAt() {
  return localStorage.getItem(SAVED_AT_KEY) || "";
}

export function savePagesToBrowser({ pages, setSavedAt, setStatus }) {
  const now = new Date().toLocaleString("vi-VN");

  localStorage.setItem(PAGES_KEY, JSON.stringify(pages));
  localStorage.setItem(SAVED_AT_KEY, now);

  setSavedAt(now);
  setStatus("Đã lưu tài liệu");
}

export function resetPagesInBrowser() {
  localStorage.removeItem(PAGES_KEY);
  localStorage.removeItem("mws_document_html");
  localStorage.removeItem("mws_diagram");
  localStorage.removeItem(SAVED_AT_KEY);
}
