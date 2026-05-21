export const SYMBOLS = [
  "√", "²", "³", "π",
  "∞", "≈", "≠", "≤",
  "≥", "±", "×", "÷",
  "∠ABC", "△ABC", "⊥", "∥",
  "∈", "∉", "⇒", "⇔",
  "∑", "α", "β", "Δ",
];

export const FORMULAS = [
  "a^2 + b^2 = c^2",
  "S = 1/2 * a * h",
  "C = 2πR",
  "S = πR^2",
  "Delta = b^2 - 4ac",
  "x = (-b ± sqrt(Delta)) / (2a)",
  "sin^2 x + cos^2 x = 1",
];

export const TEMPLATES = [
  {
    name: "Bài tam giác vuông",
    html: `
      <h2>Bài toán tam giác vuông</h2>
      <p>Cho tam giác <b>ABC</b> vuông tại <b>A</b>. Biết <b>AB = ...</b>, <b>AC = ...</b>. Tính <b>BC</b>.</p>
      <p><b>Lời giải:</b></p>
      <p>Áp dụng định lý Pythagore:</p>
      <p>BC = √(AB² + AC²)</p>
      <p>Thay số vào ta được:</p>
      <p>BC = ...</p>
      <p><b>Kết luận:</b> ...</p>
    `,
  },
  {
    name: "Bài phương trình bậc hai",
    html: `
      <h2>Bài toán phương trình bậc hai</h2>
      <p>Giải phương trình: ax² + bx + c = 0.</p>
      <p><b>Lời giải:</b></p>
      <p>Ta có:</p>
      <p>Δ = b² - 4ac</p>
      <p>Suy ra nghiệm:</p>
      <p>x = (-b ± √Δ) / 2a</p>
    `,
  },
  {
    name: "Bài hình học chứng minh",
    html: `
      <h2>Bài hình học</h2>
      <p><b>Giả thiết:</b> ...</p>
      <p><b>Kết luận:</b> ...</p>
      <p><b>Chứng minh:</b></p>
      <p>Ta có ...</p>
      <p>Vậy điều phải chứng minh là đúng.</p>
    `,
  },
];
