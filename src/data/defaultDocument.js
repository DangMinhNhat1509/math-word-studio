export const DEFAULT_HTML = `
  <h2>Bài 1. Tam giác vuông</h2>

  <p>Cho tam giác <b>ABC</b> vuông tại <b>A</b>. Biết <b>AB = 6cm</b>, <b>AC = 8cm</b>. Tính độ dài <b>BC</b> và diện tích tam giác.</p>

  <p><b>Lời giải:</b></p>

  <p>Áp dụng định lý Pythagore trong tam giác vuông ABC:</p>

  <p>
    <span class="mws-formula" contenteditable="false">
      <math-field class="mws-math" smart-mode="on" data-latex="BC=\\sqrt{AB^{2}+AC^{2}}=\\sqrt{6^{2}+8^{2}}=\\sqrt{100}=10\\,\\mathrm{cm}">
        BC=\\sqrt{AB^{2}+AC^{2}}=\\sqrt{6^{2}+8^{2}}=\\sqrt{100}=10\\,\\mathrm{cm}
      </math-field>
    </span>
  </p>

  <p>Diện tích tam giác ABC là:
    <span class="mws-formula" contenteditable="false">
      <math-field class="mws-math" smart-mode="on" data-latex="S=\\frac{1}{2}\\cdot AB\\cdot AC=\\frac{1}{2}\\cdot 6\\cdot 8=24\\,\\mathrm{cm}^{2}">
        S=\\frac{1}{2}\\cdot AB\\cdot AC=\\frac{1}{2}\\cdot 6\\cdot 8=24\\,\\mathrm{cm}^{2}
      </math-field>
    </span>
  </p>

  <p><b>Kết luận:</b> BC = 10cm và S = 24cm².</p>
`;

export const DEFAULT_DIAGRAM = {
  a: "A",
  b: "B",
  c: "C",
  ab: "6cm",
  ac: "8cm",
  bc: "BC = ?",
};
