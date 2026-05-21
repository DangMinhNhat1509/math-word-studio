const W = 640;
const H = 360;

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
    box: {
      x: 96 + (index - 1) * 22,
      y: 560 + (index - 1) * 22,
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
    return figure;
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
      figures: page.figures.map(ensureFigureGeometry),
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
    selectedFigureId: figures[0]?.id || null,
  };
}

export function getPoint(objects, id) {
  return objects.find((object) => object.id === id && object.type === "point");
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

export const GEOMETRY_SIZE = { W, H };
