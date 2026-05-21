import { useEffect, useMemo, useRef } from "react";
import {
  createCircle,
  createPoint,
  createSegment,
  createStroke,
  deleteObjectAndDependents,
  distance,
  GEOMETRY_SIZE,
  getPoint,
  nextPointLabel,
} from "../../utils/figures";

function midpoint(a, b) {
  return {
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
  };
}

function rightAnglePath(objects, object) {
  const at = getPoint(objects, object.at);
  const p1 = getPoint(objects, object.p1);
  const p2 = getPoint(objects, object.p2);

  if (!at || !p1 || !p2) return "";

  const size = 22;
  const d1 = distance(at, p1) || 1;
  const d2 = distance(at, p2) || 1;

  const u1 = {
    x: (p1.x - at.x) / d1,
    y: (p1.y - at.y) / d1,
  };

  const u2 = {
    x: (p2.x - at.x) / d2,
    y: (p2.y - at.y) / d2,
  };

  const q1 = {
    x: at.x + u1.x * size,
    y: at.y + u1.y * size,
  };

  const q2 = {
    x: at.x + u2.x * size,
    y: at.y + u2.y * size,
  };

  const q3 = {
    x: q1.x + u2.x * size,
    y: q1.y + u2.y * size,
  };

  return `M ${q1.x} ${q1.y} L ${q3.x} ${q3.y} L ${q2.x} ${q2.y}`;
}

function isTypingTarget(target) {
  if (!target) return false;

  const tag = target.tagName;

  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "MATH-FIELD" ||
    target.isContentEditable ||
    target.closest?.("[contenteditable='true']")
  );
}

export default function GeometryCanvas({
  figure,
  onChange,
  onDeleteFigure,
  isActive,
}) {
  const svgRef = useRef(null);
  const dragRef = useRef(null);

  const objects = figure.objects || [];
  const points = useMemo(() => objects.filter((object) => object.type === "point"), [objects]);
  const selectedObjectId = figure.selectedObjectId;
  const tool = figure.tool || "select";

  function updateFigure(patchOrGetter) {
    if (typeof patchOrGetter === "function") {
      onChange(patchOrGetter(figure));
      return;
    }

    onChange({
      ...figure,
      ...patchOrGetter,
    });
  }

  function updateObjects(nextObjects, extra = {}) {
    updateFigure({
      objects: nextObjects,
      ...extra,
    });
  }

  function getSvgPoint(event) {
    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();

    return {
      x: ((event.clientX - rect.left) / rect.width) * GEOMETRY_SIZE.W,
      y: ((event.clientY - rect.top) / rect.height) * GEOMETRY_SIZE.H,
    };
  }

  function selectObject(id) {
    updateFigure({
      selectedObjectId: id,
    });
  }

  function deleteSelectedObject() {
    if (!selectedObjectId) {
      onDeleteFigure?.();
      return;
    }

    updateFigure({
      objects: deleteObjectAndDependents(objects, selectedObjectId),
      selectedObjectId: null,
      pendingPointId: null,
    });
  }

  function addPointAt(event) {
    const p = getSvgPoint(event);
    const point = createPoint(nextPointLabel(objects), p.x, p.y);

    updateObjects([...objects, point], {
      selectedObjectId: point.id,
      pendingPointId: null,
    });
  }

  function startPenStroke(event) {
    const p = getSvgPoint(event);
    const stroke = createStroke([p]);

    dragRef.current = {
      mode: "pen",
      strokeId: stroke.id,
      points: [p],
    };

    updateObjects([...objects, stroke], {
      selectedObjectId: stroke.id,
    });
  }

  function handleCanvasPointerDown(event) {
    if (event.target !== svgRef.current) return;

    if (tool === "point") {
      event.preventDefault();
      addPointAt(event);
      return;
    }

    if (tool === "pen") {
      event.preventDefault();
      startPenStroke(event);
      return;
    }

    updateFigure({
      selectedObjectId: null,
      pendingPointId: null,
    });
  }

  function handlePointPointerDown(event, point) {
    event.preventDefault();
    event.stopPropagation();

    if (tool === "segment" || tool === "circle") {
      if (!figure.pendingPointId) {
        updateFigure({
          pendingPointId: point.id,
          selectedObjectId: point.id,
        });
        return;
      }

      if (figure.pendingPointId === point.id) {
        updateFigure({
          pendingPointId: null,
          selectedObjectId: point.id,
        });
        return;
      }

      const newObject =
        tool === "segment"
          ? createSegment(figure.pendingPointId, point.id, "")
          : createCircle(figure.pendingPointId, point.id, "");

      updateObjects([...objects, newObject], {
        selectedObjectId: newObject.id,
        pendingPointId: null,
        tool: "select",
      });

      return;
    }

    selectObject(point.id);

    dragRef.current = {
      mode: "point",
      id: point.id,
      startX: event.clientX,
      startY: event.clientY,
      startPoint: {
        x: point.x,
        y: point.y,
      },
    };
  }

  function handleLabelPointerDown(event, point) {
    event.preventDefault();
    event.stopPropagation();

    selectObject(point.id);

    dragRef.current = {
      mode: "label",
      id: point.id,
      startX: event.clientX,
      startY: event.clientY,
      startLabel: {
        labelDx: point.labelDx || 14,
        labelDy: point.labelDy || -14,
      },
    };
  }

  function updateObject(id, patch) {
    updateObjects(
      objects.map((object) =>
        object.id === id
          ? {
              ...object,
              ...patch,
            }
          : object
      )
    );
  }

  useEffect(() => {
    function handleKeyDown(event) {
      if (!isActive) return;
      if (isTypingTarget(event.target)) return;

      if (event.key === "Delete" || event.key === "Backspace") {
        event.preventDefault();
        deleteSelectedObject();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  useEffect(() => {
    function handleMove(event) {
      const drag = dragRef.current;
      if (!drag) return;

      event.preventDefault();

      if (drag.mode === "pen") {
        const p = getSvgPoint(event);
        drag.points = [...(drag.points || []), p];

        updateObjects(
          objects.map((object) =>
            object.id === drag.strokeId && object.type === "stroke"
              ? {
                  ...object,
                  points: drag.points,
                }
              : object
          )
        );

        return;
      }

      const rect = svgRef.current?.getBoundingClientRect();
      const dx = ((event.clientX - drag.startX) / (rect?.width || 1)) * GEOMETRY_SIZE.W;
      const dy = ((event.clientY - drag.startY) / (rect?.height || 1)) * GEOMETRY_SIZE.H;

      if (drag.mode === "point") {
        updateObject(drag.id, {
          x: Math.max(0, Math.min(GEOMETRY_SIZE.W, drag.startPoint.x + dx)),
          y: Math.max(0, Math.min(GEOMETRY_SIZE.H, drag.startPoint.y + dy)),
        });
      }

      if (drag.mode === "label") {
        updateObject(drag.id, {
          labelDx: drag.startLabel.labelDx + dx,
          labelDy: drag.startLabel.labelDy + dy,
        });
      }
    }

    function handleUp() {
      dragRef.current = null;
    }

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };
  });

  function selectLineObject(event, id) {
    event.preventDefault();
    event.stopPropagation();
    selectObject(id);
  }

  const selectedClass = (id) => (selectedObjectId === id ? " selected" : "");
  const pendingClass = (id) => (figure.pendingPointId === id ? " pending" : "");

  return (
    <div className="geometry-canvas">
      {figure.showGrid && <div className="grid-layer" />}

      {figure.showAxis && (
        <>
          <div className="axis-x" />
          <div className="axis-y" />
          <span className="axis-label x">x</span>
          <span className="axis-label y">y</span>
        </>
      )}

      <svg
        ref={svgRef}
        className="geometry-svg"
        viewBox={`0 0 ${GEOMETRY_SIZE.W} ${GEOMETRY_SIZE.H}`}
        onPointerDown={handleCanvasPointerDown}
      >
        {objects
          .filter((object) => object.type === "circle")
          .map((object) => {
            const center = getPoint(objects, object.center);
            const through = getPoint(objects, object.through);

            if (!center || !through) return null;

            return (
              <circle
                key={object.id}
                className={`geo-circle${selectedClass(object.id)}`}
                cx={center.x}
                cy={center.y}
                r={distance(center, through)}
                onPointerDown={(event) => selectLineObject(event, object.id)}
              />
            );
          })}

        {objects
          .filter((object) => object.type === "stroke")
          .map((object) => (
            <polyline
              key={object.id}
              className={`geo-stroke${selectedClass(object.id)}`}
              points={(object.points || []).map((p) => `${p.x},${p.y}`).join(" ")}
              onPointerDown={(event) => selectLineObject(event, object.id)}
            />
          ))}

        {objects
          .filter((object) => object.type === "segment")
          .map((object) => {
            const a = getPoint(objects, object.from);
            const b = getPoint(objects, object.to);

            if (!a || !b) return null;

            const m = midpoint(a, b);

            return (
              <g key={object.id} onPointerDown={(event) => selectLineObject(event, object.id)}>
                <line
                  className={`geo-segment${selectedClass(object.id)}`}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                />
                {object.label && (
                  <text className="geo-segment-label" x={m.x + 6} y={m.y - 6}>
                    {object.label}
                  </text>
                )}
              </g>
            );
          })}

        {objects
          .filter((object) => object.type === "rightAngle")
          .map((object) => (
            <path
              key={object.id}
              className={`geo-right-angle${selectedClass(object.id)}`}
              d={rightAnglePath(objects, object)}
              onPointerDown={(event) => selectLineObject(event, object.id)}
            />
          ))}

        {points.map((point) => (
          <g key={point.id} className={`geo-point-group${selectedClass(point.id)}${pendingClass(point.id)}`}>
            <circle
              className="geo-point-hit"
              cx={point.x}
              cy={point.y}
              r="18"
              onPointerDown={(event) => handlePointPointerDown(event, point)}
            />
            <circle
              className="geo-point"
              cx={point.x}
              cy={point.y}
              r="5.5"
              onPointerDown={(event) => handlePointPointerDown(event, point)}
            />
            <text
              className="geo-point-label"
              x={point.x + (point.labelDx || 14)}
              y={point.y + (point.labelDy || -14)}
              onPointerDown={(event) => handleLabelPointerDown(event, point)}
            >
              {point.label}
            </text>
          </g>
        ))}
      </svg>

      {objects.length === 0 && (
        <div className="empty-geometry">
          Khung trống. Chọn <b>Điểm</b>, <b>Đoạn</b>, <b>Tròn</b>, <b>Vẽ tay</b> hoặc <b>Tam giác mẫu</b>.
        </div>
      )}

      {tool === "segment" && <div className="geometry-help">Chọn 2 điểm để nối thành đoạn thẳng.</div>}
      {tool === "circle" && <div className="geometry-help">Chọn tâm rồi chọn điểm trên đường tròn.</div>}
      {tool === "pen" && <div className="geometry-help">Giữ chuột và kéo trong khung để vẽ tay.</div>}
    </div>
  );
}
