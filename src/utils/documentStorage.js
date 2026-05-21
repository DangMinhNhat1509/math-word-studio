import { DEFAULT_HTML } from "../data/defaultDocument";
import { createFigure, ensurePageFigures } from "./figures";

const PAGES_KEY = "mws_pages_v4";
const SAVED_AT_KEY = "mws_saved_at";

function makeId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `page-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function createBlankPage(index = 1, html = "<p><br></p>") {
  const figure = createFigure(1);

  return {
    id: makeId(),
    title: `Trang ${index}`,
    html,
    figures: [figure],
    selectedFigureId: figure.id,
  };
}

export function getInitialPages() {
  try {
    const rawPages = localStorage.getItem(PAGES_KEY);
    const parsedPages = rawPages ? JSON.parse(rawPages) : null;

    if (Array.isArray(parsedPages) && parsedPages.length > 0) {
      return parsedPages.map(ensurePageFigures);
    }
  } catch {}

  const oldHtml = localStorage.getItem("mws_document_html");

  return [
    {
      ...createBlankPage(1, oldHtml || DEFAULT_HTML),
      title: "Trang 1",
    },
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
  localStorage.removeItem(PAGES_KEY);
  localStorage.removeItem("mws_pages_v3");
  localStorage.removeItem("mws_document_html");
  localStorage.removeItem("mws_diagram");
  localStorage.removeItem(SAVED_AT_KEY);
}
