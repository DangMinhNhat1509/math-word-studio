import { Braces, Circle, Eraser, MousePointer2, PenLine, Sigma, Sparkles, Trash2, Triangle } from "lucide-react";
import { createCircle, createPoint, createSegment, createTrianglePreset, getPoint, nextPointLabel } from "../../utils/figures";

export default function RightSidebar({
  symbols,
  formulas,
  templates,
  activeFigure,
  figures,
  onSelectFigure,
  onUpdateFigure,
  onDeleteFigure,
  onDeleteSelectedObject,
  onClearFigure,
  onInsertSymbol,
  onInsertFormula,
  onInsertTemplate,
}) {
  const objects = activeFigure?.objects || [];
  const selectedObject = objects.find((object) => object.id === activeFigure?.selectedObjectId);

  function keepCaret(event) {
    event.preventDefault();
  }

  function setTool(tool) {
    if (!activeFigure) return;

    onUpdateFigure(activeFigure.id, {
      ...activeFigure,
      tool,
      pendingPointId: null,
    });
  }

  function updateFigureTitle(title) {
    if (!activeFigure) return;

    onUpdateFigure(activeFigure.id, {
      ...activeFigure,
      title,
    });
  }

  function updateSelectedObject(patch) {
    if (!activeFigure || !selectedObject) return;

    onUpdateFigure(activeFigure.id, {
      ...activeFigure,
      objects: objects.map((object) =>
        object.id === selectedObject.id
          ? {
              ...object,
              ...patch,
            }
          : object
      ),
    });
  }

  function addTrianglePreset() {
    if (!activeFigure) return;

    onUpdateFigure(activeFigure.id, {
      ...activeFigure,
      objects: [...objects, ...createTrianglePreset()],
      tool: "select",
      pendingPointId: null,
    });
  }

  function addPointQuick() {
    if (!activeFigure) return;

    const point = createPoint(nextPointLabel(objects), 180 + objects.length * 8, 160 + objects.length * 5);

    onUpdateFigure(activeFigure.id, {
      ...activeFigure,
      objects: [...objects, point],
      selectedObjectId: point.id,
      tool: "select",
    });
  }

  function addSegmentQuick() {
    if (!activeFigure) return;

    const points = objects.filter((object) => object.type === "point");

    if (points.length < 2) return;

    const segment = createSegment(points[points.length - 2].id, points[points.length - 1].id, "");

    onUpdateFigure(activeFigure.id, {
      ...activeFigure,
      objects: [...objects, segment],
      selectedObjectId: segment.id,
      tool: "select",
    });
  }

  function addCircleQuick() {
    if (!activeFigure) return;

    const points = objects.filter((object) => object.type === "point");

    if (points.length < 2) return;

    const circle = createCircle(points[points.length - 2].id, points[points.length - 1].id, "");

    onUpdateFigure(activeFigure.id, {
      ...activeFigure,
      objects: [...objects, circle],
      selectedObjectId: circle.id,
      tool: "select",
    });
  }

  return (
    <aside className="rightbar">
      <details open className="side-group">
        <summary>
          <Sigma size={17} />
          <b>Ký hiệu</b>
        </summary>

        <div className="symbol-grid compact-symbols">
          {symbols.map((symbol) => (
            <button
              type="button"
              key={symbol}
              onMouseDown={keepCaret}
              onClick={() => onInsertSymbol(symbol)}
            >
              {symbol}
            </button>
          ))}
        </div>
      </details>

      <details className="side-group">
        <summary>
          <Braces size={17} />
          <b>Công thức mẫu</b>
        </summary>

        <div className="list-buttons">
          {formulas.map((formula) => (
            <button
              type="button"
              key={formula}
              onMouseDown={keepCaret}
              onClick={() => onInsertFormula(formula)}
            >
              {formula}
            </button>
          ))}
        </div>
      </details>

      <details className="side-group">
        <summary>
          <Sparkles size={17} />
          <b>Mẫu bài</b>
        </summary>

        <div className="list-buttons">
          {templates.map((template) => (
            <button
              type="button"
              key={template.name}
              onMouseDown={keepCaret}
              onClick={() => onInsertTemplate(template)}
            >
              {template.name}
            </button>
          ))}
        </div>
      </details>

      <details open className="side-group">
        <summary>
          <Triangle size={17} />
          <b>Hình học</b>
        </summary>

        <div className="figure-list">
          {(figures || []).map((figure, index) => (
            <button
              type="button"
              key={figure.id}
              className={`figure-item ${activeFigure?.id === figure.id ? "active" : ""}`}
              onClick={() => onSelectFigure(figure.id)}
            >
              <Triangle size={15} />
              {figure.title || `Hình ${index + 1}`}
            </button>
          ))}
        </div>

        {!activeFigure && (
          <div className="empty-panel">
            Bấm <b>Thêm hình</b> ở thanh trên để tạo khung hình trống.
          </div>
        )}

        {activeFigure && (
          <>
            <label className="field-label">
              Tên khung hình
              <input value={activeFigure.title || ""} onChange={(event) => updateFigureTitle(event.target.value)} />
            </label>

            <div className="geometry-tools">
              <button className={activeFigure.tool === "select" ? "active" : ""} onClick={() => setTool("select")}>
                <MousePointer2 size={15} /> Chọn
              </button>
              <button className={activeFigure.tool === "point" ? "active" : ""} onClick={() => setTool("point")}>
                <Circle size={15} /> Điểm
              </button>
              <button className={activeFigure.tool === "segment" ? "active" : ""} onClick={() => setTool("segment")}>
                <PenLine size={15} /> Đoạn
              </button>
              <button className={activeFigure.tool === "circle" ? "active" : ""} onClick={() => setTool("circle")}>
                <Circle size={15} /> Tròn
              </button>
            </div>

            <div className="geometry-actions">
              <button type="button" onClick={addPointQuick}>+ Điểm nhanh</button>
              <button type="button" onClick={addSegmentQuick}>+ Nối 2 điểm cuối</button>
              <button type="button" onClick={addCircleQuick}>+ Tròn 2 điểm cuối</button>
              <button type="button" onClick={addTrianglePreset}>+ Tam giác 3-4-5</button>
            </div>

            {selectedObject && (
              <div className="selected-object-card">
                <b>Đang chọn: {selectedObject.type}</b>

                {selectedObject.type === "point" && (
                  <label className="field-label">
                    Tên điểm
                    <input value={selectedObject.label || ""} onChange={(event) => updateSelectedObject({ label: event.target.value })} />
                  </label>
                )}

                {selectedObject.type === "segment" && (
                  <label className="field-label">
                    Nhãn cạnh/đoạn
                    <input value={selectedObject.label || ""} onChange={(event) => updateSelectedObject({ label: event.target.value })} />
                  </label>
                )}

                {selectedObject.type === "circle" && (
                  <label className="field-label">
                    Nhãn đường tròn
                    <input value={selectedObject.label || ""} onChange={(event) => updateSelectedObject({ label: event.target.value })} />
                  </label>
                )}

                <button type="button" className="danger-action" onClick={onDeleteSelectedObject}>
                  <Trash2 size={15} />
                  Xóa đối tượng đang chọn
                </button>
              </div>
            )}

            <button type="button" className="danger-action" onClick={() => onDeleteFigure(activeFigure.id)}>
              <Trash2 size={15} />
              Xóa cả khung hình
            </button>

            <button type="button" className="soft-action" onClick={onClearFigure}>
              <Eraser size={15} />
              Xóa hết trong khung
            </button>
          </>
        )}
      </details>
    </aside>
  );
}
