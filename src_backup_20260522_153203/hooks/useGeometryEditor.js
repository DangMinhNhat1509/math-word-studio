import { createFigure, ensurePageFigures } from "../utils/figures";

export function useGeometryEditor({
  pages,
  currentPageId,
  currentPage,
  snapshotCurrentPage,
  setPages,
  updatePage,
  updateCurrentPage,
  setActiveTool,
  setStatus,
}) {
  const figures = currentPage?.figures || [];
  const selectedFigureId = currentPage?.selectedFigureId || null;
  const activeFigure = figures.find((figure) => figure.id === selectedFigureId) || null;

  function addFigure(tool = "select") {
    const savedPages = snapshotCurrentPage();
    const current = savedPages.find((page) => page.id === currentPageId) || currentPage;
    const nextIndex = (current.figures || []).length + 1;
    const newFigure = createFigure(nextIndex, tool);

    const nextPages = savedPages.map((page) =>
      page.id === currentPageId
        ? {
            ...page,
            figures: [...(page.figures || []), newFigure],
            selectedFigureId: newFigure.id,
          }
        : page
    );

    setPages(nextPages.map(ensurePageFigures), currentPageId);
    setActiveTool(tool === "pen" ? "draw" : "shape");
    setStatus("Đã thêm khung hình trống. Chọn công cụ bên phải để vẽ.");
  }

  function selectFigure(pageId, figureId) {
    updatePage(pageId, {
      selectedFigureId: figureId,
    });

    setActiveTool("shape");
    setStatus("Đã chọn hình");
  }

  function deselectFigure(pageId = currentPageId) {
    updatePage(pageId, {
      selectedFigureId: null,
    });
  }

  function updateFigure(pageId, figureId, nextFigure) {
    updatePage(pageId, (page) => ({
      figures: (page.figures || []).map((figure) =>
        figure.id === figureId ? nextFigure : figure
      ),
      selectedFigureId: figureId,
    }));
  }

  function updateActiveFigure(figureId, nextFigure) {
    updateFigure(currentPageId, figureId, nextFigure);
  }

  function updateFigureBox(pageId, figureId, box) {
    updatePage(pageId, (page) => ({
      figures: (page.figures || []).map((figure) =>
        figure.id === figureId
          ? {
              ...figure,
              box,
            }
          : figure
      ),
      selectedFigureId: figureId,
    }));
  }

  function deleteFigure(pageId, figureId) {
    updatePage(pageId, (page) => {
      const nextFigures = (page.figures || []).filter((figure) => figure.id !== figureId);

      return {
        figures: nextFigures,
        selectedFigureId: nextFigures[0]?.id || null,
      };
    });

    setStatus("Đã xóa khung hình");
  }

  function startDraw() {
    if (activeFigure) {
      updateActiveFigure(activeFigure.id, {
        ...activeFigure,
        tool: "pen",
      });

      setActiveTool("draw");
      setStatus("Đang bật vẽ tay trong hình đang chọn");
      return;
    }

    addFigure("pen");
  }

  function clearActiveFigure() {
    if (!activeFigure) return;

    updateCurrentPage((page) => ({
      figures: (page.figures || []).map((figure) =>
        figure.id === activeFigure.id
          ? {
              ...figure,
              objects: [],
              selectedObjectId: null,
              pendingPointId: null,
            }
          : figure
      ),
      selectedFigureId: activeFigure.id,
    }));

    setStatus("Đã xóa hết trong khung hình");
  }

  return {
    figures,
    selectedFigureId,
    activeFigure,
    addFigure,
    selectFigure,
    deselectFigure,
    updateFigure,
    updateActiveFigure,
    updateFigureBox,
    deleteFigure,
    startDraw,
    clearActiveFigure,
  };
}
