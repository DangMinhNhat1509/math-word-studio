import { DEFAULT_HTML } from "../data/defaultDocument";
import { ensurePageFigures } from "./figures";

const PAGES_KEY = "mws_pages_v7";
const SAVED_AT_KEY = "mws_saved_at";

function makeId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `page-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function createBlankPage(index = 1, html = "<p><br></p>") {
  return {
    id: makeId(),
    title: `Trang ${index}`,
    html,
    figures: [],
    selectedFigureId: null,
  };
}

export function getInitialPages() {
  const keys = ["mws_pages_v7", "mws_pages_v6", "mws_pages_v5", "mws_pages_v4", "mws_pages_v3"];

  for (const key of keys) {
    try {
      const rawPages = localStorage.getItem(key);
      const parsedPages = rawPages ? JSON.parse(rawPages) : null;

      if (Array.isArray(parsedPages) && parsedPages.length > 0) {
        return parsedPages.map(ensurePageFigures);
      }
    } catch {}
  }

  const oldHtml = localStorage.getItem("mws_document_html");

  return [
    createBlankPage(1, oldHtml || DEFAULT_HTML),
    createBlankPage(2, "<p><br></p>"),
  ];
}

export function getSavedAt() {
  return localStorage.getItem(SAVED_AT_KEY) || "";
}

export function savePagesToBrowser({ pages, setSavedAt, setStatus }) {
  const now = new Date().toLocaleString("vi-VN");

  localStorage.setItem(PAGES_KEY, JSON.stringify(pages.map(ensurePageFigures)));
  localStorage.setItem(SAVED_AT_KEY, now);

  setSavedAt(now);
  setStatus("Đã lưu tài liệu");
}

export function resetPagesInBrowser() {
  ["mws_pages_v7", "mws_pages_v6", "mws_pages_v5", "mws_pages_v4", "mws_pages_v3"].forEach((key) =>
    localStorage.removeItem(key)
  );

  localStorage.removeItem("mws_document_html");
  localStorage.removeItem("mws_diagram");
  localStorage.removeItem(SAVED_AT_KEY);
}
