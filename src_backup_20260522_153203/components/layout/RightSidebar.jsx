import { useState } from "react";
import {
  Braces,
  Circle,
  Eraser,
  Grid3X3,
  MousePointer2,
  PenLine,
  Sigma,
  Sparkles,
  Trash2,
  Triangle,
} from "lucide-react";

import {
  createCircle,
  createPoint,
  createRightAngle,
  createSegment,
  createTrianglePreset,
  deleteObjectAndDependents,
  measureSegment,
  nextPointLabel,
  objectLabel,
} from "../../utils/figures";

function objectKindName(type) {
  if (type === "point") return "Điểm";
  if (type === "segment") return "Đoạn/cạnh";
  if (type === "circle") return "Đường tròn";
  if (type === "rightAngle") return "Góc vuông";
  if (type === "stroke") return "Vẽ tay";
  return "Đối tượng";
}

export default function RightSidebar({
  symbols,
  formulas,
  templates,
  activeFigure,
  figures,
  onSelectFigure,
  onUpdateFigure,
  onDeleteFigure,
  onDeselectFigure,
  onClearFigure,
  onInsertSymbol,
  onInsertFormula,
  onInsertTemplate,
}) {
  const [geometryTab, setGeometryTab] = useState("tools");

  const objects = activeFigure?.objects || [];
  const selectedObject = objects.find((object) => object.id === activeFigure?.selectedObjectId);

  function keepCaret(event) {
    event.preventDefault();
  }

  function patchFigure(patch) {
    if (!activeFigure) return;

    onUpdateFigure(activeFigure.id, {
      ...activeFigure,
      ...patch,
    });
  }

  function setTool(tool) {
    patchFigure({
      tool,
      pendingPointId: null,
    });
  }

  function updateFigureTitle(title) {
    patchFigure({ title });
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

    setGeometryTab("props");
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

    setGeometryTab("props");
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

    setGeometryTab("props");
  }

  function addRightAngleQuick() {
    if (!activeFigure) return;

    const points = objects.filter((object) => object.type === "point");
    if (points.length < 3) return;

    const selectedPoint = selectedObject?.type === "point" ? selectedObject : points[0];
    const others = points.filter((point) => point.id !== selectedPoint.id).slice(0, 2);

    if (others.length < 2) return;

    const right = createRightAngle(selectedPoint.id, others[0].id, others[1].id);

    onUpdateFigure(activeFigure.id, {
      ...activeFigure,
      objects: [...objects, right],
      selectedObjectId: right.id,
      tool: "select",
    });

    setGeometryTab("props");
  }

  function deleteSelectedObject() {
    if (!activeFigure?.selectedObjectId) return;

    onUpdateFigure(activeFigure.id, {
      ...activeFigure,
      objects: deleteObjectAndDependents(objects, activeFigure.selectedObjectId),
      selectedObjectId: null,
      pendingPointId: null,
    });
  }

  function selectObject(objectId) {
    if (!activeFigure) return;

    onUpdateFigure(activeFigure.id, {
      ...activeFigure,
      selectedObjectId: objectId,
      pendingPointId: null,
    });

    setGeometryTab("props");
  }

  if (activeFigure) {
    return (
      <aside className="rightbar">
        <div className="inspector-head">
          <button type="button" className="back-panel-btn" onClick={onDeselectFigure}>
            ← Soạn bài
          </button>
          <b>Bảng hình học</b>
        </div>

        <label className="field-label">
          Tên khung hình
          <input value={activeFigure.title || ""} onChange={(event) => updateFigureTitle(event.target.value)} />
        </label>

        <div className="geometry-tabs">
          <button type="button" className={geometryTab === "tools" ? "active" : ""} onClick={() => setGeometryTab("tools")}>
            Công cụ
          </button>
          <button type="button" className={geometryTab === "objects" ? "active" : ""} onClick={() => setGeometryTab("objects")}>
            Đối tượng
          </button>
          <button type="button" className={geometryTab === "props" ? "active" : ""} onClick={() => setGeometryTab("props")}>
            Thuộc tính
          </button>
        </div>

        {geometryTab === "tools" && (
          <>
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
              <button className={activeFigure.tool === "pen" ? "active" : ""} onClick={() => setTool("pen")}>
                <PenLine size={15} /> Vẽ tay
              </button>
            </div>

            <div className="geometry-actions">
              <button type="button" onClick={addPointQuick}>+ Điểm nhanh</button>
              <button type="button" onClick={addSegmentQuick}>+ Nối 2 điểm cuối</button>
              <button type="button" onClick={addCircleQuick}>+ Tròn 2 điểm cuối</button>
              <button type="button" onClick={addRightAngleQuick}>+ Ký hiệu góc vuông</button>
              <button type="button" onClick={addTrianglePreset}>+ Tam giác 3-4-5</button>
            </div>

            <div className="geometry-display-options">
              <button
                type="button"
                className={activeFigure.showGrid ? "active" : ""}
                onClick={() => patchFigure({ showGrid: !activeFigure.showGrid })}
              >
                <Grid3X3 size={15} />
                Lưới hình này
              </button>
              <button
                type="button"
                className={activeFigure.showAxis ? "active" : ""}
                onClick={() => patchFigure({ showAxis: !activeFigure.showAxis })}
              >
                Trục hình này
              </button>
            </div>
          </>
        )}

        {geometryTab === "objects" && (
          <>
            <div className="figure-list compact-list">
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

            <div className="object-panel">
              <b>Đối tượng trong hình</b>

              {objects.length === 0 && (
                <p>Khung đang trống. Chọn công cụ rồi vẽ vào khung.</p>
              )}

              <div className="object-list">
                {objects.map((object) => (
                  <button
                    type="button"
                    key={object.id}
                    className={`object-item ${object.id === activeFigure.selectedObjectId ? "active" : ""}`}
                    onClick={() => selectObject(object.id)}
                  >
                    <span>{objectKindName(object.type)}</span>
                    <small>{objectLabel(objects, object)}</small>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {geometryTab === "props" && (
          <>
            {!selectedObject && (
              <div className="empty-panel">
                Chọn một điểm, đoạn, đường tròn hoặc nét vẽ để sửa thuộc tính.
              </div>
            )}

            {selectedObject && (
              <div className="selected-object-card">
                <b>Đang chọn: {objectLabel(objects, selectedObject)}</b>

                {selectedObject.type === "point" && (
                  <label className="field-label">
                    Tên điểm
                    <input value={selectedObject.label || ""} onChange={(event) => updateSelectedObject({ label: event.target.value })} />
                  </label>
                )}

                {selectedObject.type === "segment" && (
                  <>
                    <label className="field-label">
                      Độ dài/nhãn trên cạnh
                      <input
                        value={selectedObject.label || ""}
                        placeholder="VD: 3cm, x, AB = 5"
                        onChange={(event) => updateSelectedObject({ label: event.target.value })}
                      />
                    </label>

                    <div className="measure-note">
                      Độ dài theo hình: {measureSegment(objects, selectedObject).toFixed(1)} px
                    </div>
                  </>
                )}

                {selectedObject.type === "circle" && (
                  <label className="field-label">
                    Nhãn đường tròn
                    <input value={selectedObject.label || ""} onChange={(event) => updateSelectedObject({ label: event.target.value })} />
                  </label>
                )}

                <button type="button" className="danger-action" onClick={deleteSelectedObject}>
                  <Trash2 size={15} />
                  Xóa đối tượng đang chọn
                </button>
              </div>
            )}
          </>
        )}

        <button type="button" className="danger-action" onClick={() => onDeleteFigure(activeFigure.id)}>
          <Trash2 size={15} />
          Xóa cả khung hình
        </button>

        <button type="button" className="soft-action" onClick={onClearFigure}>
          <Eraser size={15} />
          Xóa hết trong khung
        </button>
      </aside>
    );
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

      <details open className="side-group">
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

      <details open className="side-group">
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
    </aside>
  );
}
