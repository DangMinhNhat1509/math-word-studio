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
  {
    name: "Trắc nghiệm A-D một dòng",
    html: `
      <p><b>Câu 1.</b> Nội dung câu hỏi...</p>
      <div class="choice-grid">
        <div>A. ...</div>
        <div>B. ...</div>
        <div>C. ...</div>
        <div>D. ...</div>
      </div>
    `,
  },
  {
    name: "Trắc nghiệm A-D mỗi dòng",
    html: `
      <p><b>Câu 1.</b> Nội dung câu hỏi dài...</p>
      <div class="choice-list">
        <div>A. ...</div>
        <div>B. ...</div>
        <div>C. ...</div>
        <div>D. ...</div>
      </div>
    `,
  },
  {
    name: "Đáp án trắc nghiệm",
    html: `
      <p><b>Đáp án:</b></p>
      <div class="answer-grid">
        <span>1.A</span>
        <span>2.B</span>
        <span>3.C</span>
        <span>4.D</span>
      </div>
    `,
  },
];
