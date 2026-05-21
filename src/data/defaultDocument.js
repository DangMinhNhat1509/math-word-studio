export const DEFAULT_HTML = `
  <h2>Bài 1. Tam giác vuông</h2>
  <p>Cho tam giác <b>ABC</b> vuông tại <b>A</b>. Biết <b>AB = 6cm</b>, <b>AC = 8cm</b>. Tính độ dài <b>BC</b> và diện tích tam giác.</p>
  <p><b>Lời giải:</b></p>
  <p>Áp dụng định lý Pythagore trong tam giác vuông ABC:</p>
  <div class="formula-line">BC = √(AB² + AC²) = √(6² + 8²) = √100 = 10cm</div>
  <p>Diện tích tam giác ABC là:</p>
  <div class="formula-line">S = 1/2 · AB · AC = 1/2 · 6 · 8 = 24cm²</div>
  <p><b>Kết luận:</b> BC = 10cm và S = 24cm².</p>
`;

export const DEFAULT_DIAGRAM = {
  a: "A",
  b: "B",
  c: "C",
  ab: "6cm",
  ac: "8cm",
  bc: "BC = ?"
};
