export const GEOMETRY_SIZE = {
  W: 640,
  H: 360,
};

function uid(prefix = "id") {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function createPoint(label, x, y) {
  return {
    id: uid("pt"),
    type: "point",
    label,
    x,
    y,
    labelDx: 14,
    labelDy: -14,
  };
}

export function createSegment(from, to, label = "") {
  return {
    id: uid("seg"),
    type: "segment",
    from,
    to,
    label,
  };
}

export function createCircle(center, through, label = "") {
  return {
    id: uid("circle"),
    type: "circle",
    center,
    through,
    label,
  };
}

export function createRightAngle(at, p1, p2) {
  return {
    id: uid("right"),
    type: "rightAngle",
    at,
    p1,
    p2,
  };
}

export function createStroke(points = []) {
  return {
    id: uid("stroke"),
    type: "stroke",
    points,
  };
}

export function createTrianglePreset() {
  const A = createPoint("A", 150, 265);
  const B = createPoint("B", 390, 265);
  const C = createPoint("C", 150, 85);

  return [
    A,
    B,
    C,
    createSegment(A.id, B.id, "3"),
    createSegment(A.id, C.id, "4"),
    createSegment(B.id, C.id, "5"),
    createRightAngle(A.id, B.id, C.id),
  ];
}

export function createFigure(index = 1) {
  return {
    id: uid("fig"),
    type: "geometry",
    title: `Hình ${index}`,
    tool: "select",
    selectedObjectId: null,
    pendingPointId: null,
    showGrid: true,
    showAxis: false,
    box: {
      x: 90 + (index - 1) * 24,
      y: 560 + (index - 1) * 24,
      width: 460,
      height: 280,
    },
    objects: [],
  };
}

function triangleDiagramToObjects(diagram = {}) {
  const A = createPoint(diagram.a || "A", 150, 265);
  const B = createPoint(diagram.b || "B", 390, 265);
  const C = createPoint(diagram.c || "C", 150, 85);

  return [
    A,
    B,
    C,
    createSegment(A.id, B.id, diagram.ab || "3"),
    createSegment(A.id, C.id, diagram.ac || "4"),
    createSegment(B.id, C.id, diagram.bc || "5"),
    createRightAngle(A.id, B.id, C.id),
  ];
}

export function ensureFigureGeometry(figure, index = 1) {
  if (!figure) return createFigure(index);

  if (figure.type === "geometry" && Array.isArray(figure.objects)) {
    return {
      ...createFigure(index),
      ...figure,
      showGrid: typeof figure.showGrid === "boolean" ? figure.showGrid : true,
      showAxis: typeof figure.showAxis === "boolean" ? figure.showAxis : false,
      objects: figure.objects,
    };
  }

  const converted = createFigure(index);

  return {
    ...converted,
    ...figure,
    type: "geometry",
    objects: triangleDiagramToObjects(figure.diagram),
    tool: "select",
    selectedObjectId: null,
    pendingPointId: null,
    box: figure.box || figure.diagramBox || converted.box,
  };
}

export function ensurePageFigures(page) {
  if (!page) return page;

  if (Array.isArray(page.figures)) {
    return {
      ...page,
      figures: page.figures.map((figure, index) => ensureFigureGeometry(figure, index + 1)),
    };
  }

  const figures = page.diagram
    ? [
        {
          ...createFigure(1),
          box: page.diagramBox || createFigure(1).box,
          objects: triangleDiagramToObjects(page.diagram),
        },
      ]
    : [];

  return {
    ...page,
    figures,
    selectedFigureId: null,
  };
}

export function getPoint(objects, id) {
  return objects.find((object) => object.id === id && object.type === "point");
}

export function distance(a, b) {
  if (!a || !b) return 0;
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function measureSegment(objects, segment) {
  if (!segment || segment.type !== "segment") return 0;

  const a = getPoint(objects, segment.from);
  const b = getPoint(objects, segment.to);

  return distance(a, b);
}

export function nextPointLabel(objects = []) {
  const used = new Set(
    objects
      .filter((object) => object.type === "point")
      .map((object) => String(object.label || "").toUpperCase())
  );

  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return letters.find((letter) => !used.has(letter)) || `P${used.size + 1}`;
}

export function deleteObjectAndDependents(objects = [], objectId) {
  const target = objects.find((object) => object.id === objectId);
  if (!target) return objects;

  return objects.filter((object) => {
    if (object.id === objectId) return false;

    if (target.type === "point") {
      if (object.type === "segment") return object.from !== objectId && object.to !== objectId;
      if (object.type === "circle") return object.center !== objectId && object.through !== objectId;
      if (object.type === "rightAngle") return object.at !== objectId && object.p1 !== objectId && object.p2 !== objectId;
    }

    return true;
  });
}

export function objectLabel(objects = [], object) {
  if (!object) return "Đối tượng";

  if (object.type === "point") return `Điểm ${object.label || ""}`;
  if (object.type === "segment") {
    const a = getPoint(objects, object.from);
    const b = getPoint(objects, object.to);
    return `Đoạn ${a?.label || "?"}${b?.label || "?"}${object.label ? ` = ${object.label}` : ""}`;
  }
  if (object.type === "circle") return `Đường tròn${object.label ? ` ${object.label}` : ""}`;
  if (object.type === "rightAngle") return "Ký hiệu góc vuông";
  if (object.type === "stroke") return "Nét vẽ tay";

  return "Đối tượng";
}
