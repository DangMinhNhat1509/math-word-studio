import { useMemo, useState } from "react";
import {
  createBlankPage,
  getInitialPages,
  resetPagesInBrowser,
  savePagesToBrowser,
} from "../utils/documentStorage";
import { ensurePageFigures } from "../utils/figures";
import { syncMathFields } from "../utils/mathLiveEditor";
import {
  clearCurrentCloudDocumentId,
  getCurrentCloudDocumentId,
  saveCloudDocument,
} from "../services/documentService";

export function useDocumentPages(editorRef, setSavedAt, setStatus) {
  const [doc, setDoc] = useState(() => {
    const pages = getInitialPages().map(ensurePageFigures);

    return {
      pages,
      currentPageId: pages[0]?.id || "",
      cloudDocumentId: getCurrentCloudDocumentId(),
    };
  });

  const pages = useMemo(() => doc.pages.map(ensurePageFigures), [doc.pages]);
  const currentPageId = doc.currentPageId;
  const currentPageIndex = Math.max(0, pages.findIndex((page) => page.id === currentPageId));
  const currentPage = pages[currentPageIndex] || pages[0];

  function snapshotCurrentPage(pageList = pages, pageId = currentPageId) {
    if (!editorRef.current) return pageList;

    syncMathFields(editorRef.current);

    const html = editorRef.current.innerHTML;

    return pageList.map((page) =>
      page.id === pageId
        ? {
            ...page,
            html,
          }
        : page
    );
  }

  function setPages(nextPages, nextCurrentPageId = currentPageId) {
    setDoc((oldDoc) => ({
      ...oldDoc,
      pages: nextPages.map(ensurePageFigures),
      currentPageId: nextCurrentPageId,
    }));
  }

  function updatePage(pageId, patchOrGetter) {
    setDoc((oldDoc) => {
      const oldPages = oldDoc.pages.map(ensurePageFigures);

      return {
        ...oldDoc,
        pages: oldPages.map((page) => {
          if (page.id !== pageId) return page;

          const patch = typeof patchOrGetter === "function" ? patchOrGetter(page) : patchOrGetter;

          return {
            ...page,
            ...patch,
          };
        }),
      };
    });
  }

  function updateCurrentPage(patchOrGetter) {
    updatePage(currentPageId, patchOrGetter);
  }

  function selectPage(pageId) {
    if (pageId === currentPageId) return;

    setDoc((oldDoc) => ({
      ...oldDoc,
      pages: snapshotCurrentPage(oldDoc.pages.map(ensurePageFigures), oldDoc.currentPageId),
      currentPageId: pageId,
    }));

    setStatus("Đã chuyển trang");
  }

  function addPage() {
    const savedPages = snapshotCurrentPage();
    const newPage = createBlankPage(savedPages.length + 1);

    setPages([...savedPages, newPage], newPage.id);
    setStatus("Đã thêm trang mới");
  }

  function deleteCurrentPage() {
    if (pages.length <= 1) {
      setStatus("Tài liệu cần ít nhất 1 trang");
      return;
    }

    if (!confirm("Xóa trang hiện tại?")) return;

    const savedPages = snapshotCurrentPage();
    const filtered = savedPages.filter((page) => page.id !== currentPageId);
    const nextPage = filtered[Math.max(0, currentPageIndex - 1)] || filtered[0];

    setPages(filtered, nextPage.id);
    setStatus("Đã xóa trang");
  }

  async function saveDocument() {
    const savedPages = snapshotCurrentPage();

    setDoc((oldDoc) => ({
      ...oldDoc,
      pages: savedPages.map(ensurePageFigures),
    }));

    savePagesToBrowser({
      pages: savedPages.map(ensurePageFigures),
      setSavedAt,
      setStatus,
    });

    try {
      setStatus("Đang lưu lên cloud...");

      const result = await saveCloudDocument({
        documentId: doc.cloudDocumentId,
        title: "Đề kiểm tra Toán 8 - Chương 1",
        pages: savedPages.map(ensurePageFigures),
      });

      setDoc((oldDoc) => ({
        ...oldDoc,
        cloudDocumentId: result.documentId,
      }));

      const now = new Date().toLocaleString("vi-VN");
      setSavedAt(now);
      setStatus(`Đã lưu cloud ${result.pageCount} trang`);
    } catch (error) {
      setStatus(`Đã lưu máy, chưa lưu cloud: ${error.message}`);
    }
  }

  function resetDocument() {
    if (!confirm("Reset toàn bộ tài liệu về mẫu ban đầu?")) return;

    resetPagesInBrowser();
    clearCurrentCloudDocumentId();

    const page1 = createBlankPage(1);
    const page2 = createBlankPage(2);

    setDoc({
      pages: [page1, page2],
      currentPageId: page1.id,
      cloudDocumentId: "",
    });

    setSavedAt("");
    setStatus("Đã reset tài liệu");
  }

  return {
    pages,
    currentPageId,
    currentPage,
    currentPageIndex,
    setPages,
    snapshotCurrentPage,
    updatePage,
    updateCurrentPage,
    selectPage,
    addPage,
    deleteCurrentPage,
    saveDocument,
    resetDocument,
  };
}
