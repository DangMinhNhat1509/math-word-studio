export const SYMBOLS = [
  "√",
  "²",
  "³",
  "π",
  "∞",
  "≈",
  "≠",
  "≤",
  "≥",
  "±",
  "×",
  "÷",
  "∠ABC",
  "△ABC",
  "⊥",
  "∥",
  "∈",
  "∉",
  "⇒",
  "⇔",
  "∑",
  "α",
  "β",
  "Δ",
];

export const FORMULAS = [
  "1/2",
  "a/b",
  "(a+b)/(c+d)",
  "sqrt(a+b)",
  "sqrt(x^2 + y^2)",
  "a^2 + b^2 = c^2",
  "S = (a*h)/2",
  "C = 2πR",
  "S = πR^2",
  "Delta = b^2 - 4ac",
  "x = (-b ± sqrt(Delta))/(2a)",
  "sin^2 x + cos^2 x = 1",
];

export const TEMPLATES = [
  {
    name: "Bài tam giác vuông",
    html: `
## Bài toán tam giác vuông

Cho tam giác ABC vuông tại A. Biết AB = ..., AC = .... Tính BC.

Lời giải:

Áp dụng định lý Pythagore:

BC = √(AB² + AC²)

Thay số vào ta được:

BC = ...

Kết luận: ...
`,
  },
  {
    name: "Bài hình học chứng minh",
    html: `
## Bài hình học

Giả thiết: ...

Kết luận: ...

Chứng minh:

Ta có ...

Vậy điều phải chứng minh là đúng.
`,
  },
  {
    name: "Trắc nghiệm A-D một dòng",
    html: `

Câu 1. Nội dung câu hỏi...

A. ...

B. ...

C. ...

D. ...

`,
  },
  {
    name: "Trắc nghiệm A-D mỗi dòng",
    html: `

Câu 1. Nội dung câu hỏi dài...

A. ...

B. ...

C. ...

D. ...

`,
  },
  {
    name: "Đáp án trắc nghiệm",
    html: `

Đáp án:

1.A 2.B 3.C 4.D

`,
  },
];
