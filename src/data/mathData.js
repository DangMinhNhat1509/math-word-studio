export const SYMBOLS = [
  "√", "²", "³", "π", "∞", "≈", "≠", "≤", "≥", "±", "×", "÷",
  "∠ABC", "△ABC", "⊥", "∥", "∈", "∉", "⇒", "⇔", "∑", "α", "β", "Δ"
];

export const FORMULAS = [
  "a² + b² = c²",
  "S = 1/2 · a · h",
  "C = 2πR",
  "S = πR²",
  "Δ = b² - 4ac",
  "x = (-b ± √Δ) / 2a",
  "sin²x + cos²x = 1"
];

export const TEMPLATES = [
  {
    name: "Bài tam giác vuông",
    html: `
      <h2>Bài toán tam giác vuông</h2>
      <p>Cho tam giác <b>ABC</b> vuông tại <b>A</b>. Biết <b>AB = ...</b>, <b>AC = ...</b>. Tính <b>BC</b>.</p>
      <p><b>Lời giải:</b></p>
      <p>Áp dụng định lý Pythagore:</p>
      <div class="formula-line">BC = √(AB² + AC²)</div>
      <p>Thay số vào ta được:</p>
      <div class="formula-line">BC = ...</div>
      <p><b>Kết luận:</b> ...</p>
    `
  },
  {
    name: "Bài phương trình bậc hai",
    html: `
      <h2>Bài toán phương trình bậc hai</h2>
      <p>Giải phương trình: <b>ax² + bx + c = 0</b>.</p>
      <p><b>Lời giải:</b></p>
      <p>Ta có:</p>
      <div class="formula-line">Δ = b² - 4ac</div>
      <p>Suy ra nghiệm:</p>
      <div class="formula-line">x = (-b ± √Δ) / 2a</div>
    `
  },
  {
    name: "Bài hình học chứng minh",
    html: `
      <h2>Bài hình học</h2>
      <p><b>Giả thiết:</b> ...</p>
      <p><b>Kết luận:</b> ...</p>
      <p><b>Chứng minh:</b></p>
      <p>Ta có ...</p>
      <div class="formula-line">...</div>
      <p>Vậy điều phải chứng minh là đúng.</p>
    `
  }
];
