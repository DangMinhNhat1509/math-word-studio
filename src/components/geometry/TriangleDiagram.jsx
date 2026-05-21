import { useMemo, useRef, useState } from "react";

const VIEWBOX = {
  width: 640,
  height: 360,
  pad: 54,
};

function parseLength(value, fallback) {
  const match = String(value ?? "").replace(",", ".").match(/-?\d+(\.\d+)?/);
  const number = match ? Number(match[0]) : NaN;
  return Number.isFinite(number) && number > 0 ? number : fallback;
}

function isValidTriangle(ab, ac, bc) {
  return ab + ac > bc && ab + bc > ac && ac + bc > ab;
}

function distance(p1, p2) {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

function fitPoints(rawPoints) {
  const values = Object.values(rawPoints);
  const minX = Math.min(...values.map((p) => p.x));
  const maxX = Math.max(...values.map((p) => p.x));
  const minY = Math.min(...values.map((p) => p.y));
  const maxY = Math.max(...values.map((p) => p.y));

  const rawWidth = Math.max(maxX - minX, 1);
  const rawHeight = Math.max(maxY - minY, 1);

  const scale = Math.min(
    (VIEWBOX.width - VIEWBOX.pad * 2) / rawWidth,
    (VIEWBOX.height - VIEWBOX.pad * 2) / rawHeight
  );

  return Object.fromEntries(
    Object.entries(rawPoints).map(([key, point]) => [
      key,
      {
        x: (point.x - minX) * scale + VIEWBOX.pad,
        y: (point.y - minY) * scale + VIEWBOX.pad,
      },
    ])
  );
}

function computeTrianglePoints(diagram) {
  const ab = parseLength(diagram.ab, 3);
  const ac = parseLength(diagram.ac, 4);
  const bc = parseLength(diagram.bc, 5);

  if (diagram.customPoints && diagram.points?.a && diagram.points?.b && diagram.points?.c) {
    return diagram.points;
  }

  if (!isValidTriangle(ab, ac, bc)) {
    return fitPoints({
      a: { x: 0, y: 0 },
      b: { x: 3, y: 0 },
      c: { x: 0, y: -4 },
    });
  }

  const xC = (ab ** 2 + ac ** 2 - bc ** 2) / (2 * ab);
  const yC = -Math.sqrt(Math.max(ac ** 2 - xC ** 2, 0));

  return fitPoints({
    a: { x: 0, y: 0 },
    b: { x: ab, y: 0 },
    c: { x: xC, y: yC },
  });
}

function midpoint(p1, p2, dy = 0) {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2 + dy,
  };
}

function rightAngleVertex(diagram) {
  const ab = parseLength(diagram.ab, 3);
  const ac = parseLength(diagram.ac, 4);
  const bc = parseLength(diagram.bc, 5);
  const eps = 0.08;

  if (Math.abs(ab ** 2 + ac ** 2 - bc ** 2) < eps) return "a";
  if (Math.abs(ab ** 2 + bc ** 2 - ac ** 2) < eps) return "b";
  if (Math.abs(ac ** 2 + bc ** 2 - ab ** 2) < eps) return "c";

  return null;
}

function rightAnglePath(points, vertexKey) {
  if (!vertexKey) return "";

  const vertex = points[vertexKey];
  const others = Object.keys(points).filter((key) => key !== vertexKey);
  const p1 = points[others[0]];
  const p2 = points[others[1]];

  const s = 22;
  const d1 = distance(vertex, p1) || 1;
  const d2 = distance(vertex, p2) || 1;

  const u1 = {
    x: (p1.x - vertex.x) / d1,
    y: (p1.y - vertex.y) / d1,
  };

  const u2 = {
    x: (p2.x - vertex.x) / d2,
    y: (p2.y - vertex.y) / d2,
  };

  const q1 = {
    x: vertex.x + u1.x * s,
    y: vertex.y + u1.y * s,
  };

  const q2 = {
    x: vertex.x + u2.x * s,
    y: vertex.y + u2.y * s,
  };

  const q3 = {
    x: q1.x + u2.x * s,
    y: q1.y + u2.y * s,
  };

  return `M ${q1.x} ${q1.y} L ${q3.x} ${q3.y} L ${q2.x} ${q2.y}`;
}

export default function TriangleDiagram({ diagram, setDiagram, showGrid, showAxis }) {
  const svgRef = useRef(null);
  const [dragPoint, setDragPoint] = useState(null);

  const points = useMemo(() => computeTrianglePoints(diagram), [diagram]);
  const rightKey = rightAngleVertex(diagram);

  function updatePointFromEvent(event, key) {
    const svg = svgRef.current;
    if (!svg) return;

    const rect = svg.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * VIEWBOX.width;
    const y = ((event.clientY - rect.top) / rect.height) * VIEWBOX.height;

    setDiagram((old) => ({
      ...old,
      customPoints: true,
      points: {
        ...(old.points || points),
        [key]: {
          x: Math.max(12, Math.min(VIEWBOX.width - 12, x)),
          y: Math.max(12, Math.min(VIEWBOX.height - 12, y)),
        },
      },
    }));
  }

  function startDrag(event, key) {
    event.preventDefault();
    event.stopPropagation();
    setDragPoint(key);
    updatePointFromEvent(event, key);
  }

  function handleMove(event) {
    if (!dragPoint) return;
    updatePointFromEvent(event, dragPoint);
  }

  function stopDrag() {
    setDragPoint(null);
  }

  function resetToScale() {
    setDiagram((old) => ({
      ...old,
      customPoints: false,
      points: null,
    }));
  }

  const labelAB = diagram.ab || "AB";
  const labelAC = diagram.ac || "AC";
  const labelBC = diagram.bc || "BC";

  return (
    <div className="diagram-wrap">
      <div className="diagram">
        {showGrid && <div className="grid-layer" />}
        {showAxis && (
          <>
            <div className="axis-x" />
            <div className="axis-y" />
            <span className="axis-label x">x</span>
            <span className="axis-label y">y</span>
          </>
        )}

        <svg
          ref={svgRef}
          className="diagram-svg"
          viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
          onPointerMove={handleMove}
          onPointerUp={stopDrag}
          onPointerLeave={stopDrag}
        >
          <polygon
            points={`${points.a.x},${points.a.y} ${points.b.x},${points.b.y} ${points.c.x},${points.c.y}`}
            className="triangle-fill"
          />

          <line className="triangle-edge" x1={points.a.x} y1={points.a.y} x2={points.b.x} y2={points.b.y} />
          <line className="triangle-edge" x1={points.a.x} y1={points.a.y} x2={points.c.x} y2={points.c.y} />
          <line className="triangle-edge" x1={points.b.x} y1={points.b.y} x2={points.c.x} y2={points.c.y} />

          {rightKey && <path className="right-angle-mark" d={rightAnglePath(points, rightKey)} />}

          <text className="side-label" x={midpoint(points.a, points.b, 26).x} y={midpoint(points.a, points.b, 26).y}>{labelAB}</text>
          <text className="side-label" x={midpoint(points.a, points.c, -8).x} y={midpoint(points.a, points.c, -8).y}>{labelAC}</text>
          <text className="side-label" x={midpoint(points.b, points.c, -8).x} y={midpoint(points.b, points.c, -8).y}>{labelBC}</text>

          {["a", "b", "c"].map((key) => (
            <g
              key={key}
              className="point-group"
              onPointerDown={(event) => startDrag(event, key)}
            >
              <circle className="point-hit" cx={points[key].x} cy={points[key].y} r="18" />
              <circle className="point-dot" cx={points[key].x} cy={points[key].y} r="6" />
              <text className="point-label" x={points[key].x + 10} y={points[key].y - 10}>
                {diagram[key] || key.toUpperCase()}
              </text>
            </g>
          ))}
        </svg>

        <button type="button" className="diagram-reset" onClick={resetToScale}>
          Về đúng tỉ lệ cạnh
        </button>
      </div>

      <div className="diagram-caption">
        Kéo các điểm A, B, C để chỉnh hình. Nhập AB, AC, BC ở sidebar phải, rồi bấm “Về đúng tỉ lệ cạnh” để dựng lại theo tỉ lệ.
      </div>
    </div>
  );
}
