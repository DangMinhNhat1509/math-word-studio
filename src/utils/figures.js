export function createFigure(index = 1) {
  return {
    id: `fig-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    type: "triangle",
    title: `Hình ${index}`,
    box: {
      x: 110,
      y: 520 + (index - 1) * 24,
      width: 420,
      height: 260,
    },
    diagram: {
      a: "A",
      b: "B",
      c: "C",
      ab: "3",
      ac: "4",
      bc: "5",
      customPoints: false,
      points: null,
    },
  };
}

export function ensurePageFigures(page) {
  if (Array.isArray(page.figures)) return page;

  const oldDiagram = page.diagram || {
    a: "A",
    b: "B",
    c: "C",
    ab: "3",
    ac: "4",
    bc: "5",
  };

  return {
    ...page,
    figures: [
      {
        ...createFigure(1),
        box: page.diagramBox || {
          x: 110,
          y: 520,
          width: 420,
          height: 260,
        },
        diagram: oldDiagram,
      },
    ],
    selectedFigureId: null,
  };
}
