import "mathlive";

const QUICK_SYMBOL_LATEX = {
  "√": "\\sqrt{}",
  "²": "^{2}",
  "³": "^{3}",
  "π": "\\pi",
  "∞": "\\infty",
  "≈": "\\approx",
  "≠": "\\ne",
  "≤": "\\le",
  "≥": "\\ge",
  "±": "\\pm",
  "×": "\\times",
  "÷": "\\div",
  "∠ABC": "\\angle ABC",
  "△ABC": "\\triangle ABC",
  "⊥": "\\perp",
  "∥": "\\parallel",
  "∈": "\\in",
  "∉": "\\notin",
  "⇒": "\\Rightarrow",
  "⇔": "\\Leftrightarrow",
  "∑": "\\sum",
  "Σ": "\\sum",
  "α": "\\alpha",
  "β": "\\beta",
  "Δ": "\\Delta",
};

const SUPER = {
  "⁰": "0",
  "¹": "1",
  "²": "2",
  "³": "3",
  "⁴": "4",
  "⁵": "5",
  "⁶": "6",
  "⁷": "7",
  "⁸": "8",
  "⁹": "9",
};

function normalizeSuperscripts(text) {
  return String(text).replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, (match) => {
    const number = [...match].map((char) => SUPER[char] || "").join("");
    return `^{${number}}`;
  });
}

export function textToLatex(input = "") {
  let text = String(input || "").trim();

  if (!text) return "";

  if (QUICK_SYMBOL_LATEX[text]) return QUICK_SYMBOL_LATEX[text];

  text = normalizeSuperscripts(text);

  text = text
    .replaceAll("π", "\\pi")
    .replaceAll("∞", "\\infty")
    .replaceAll("≈", "\\approx")
    .replaceAll("≠", "\\ne")
    .replaceAll("≤", "\\le")
    .replaceAll("≥", "\\ge")
    .replaceAll("±", "\\pm")
    .replaceAll("×", "\\times")
    .replaceAll("÷", "\\div")
    .replaceAll("·", "\\cdot")
    .replaceAll("⇒", "\\Rightarrow")
    .replaceAll("⇔", "\\Leftrightarrow")
    .replaceAll("Δ", "\\Delta")
    .replaceAll("α", "\\alpha")
    .replaceAll("β", "\\beta");

  text = text
    .replace(/căn\s*\(([^()]+)\)/gi, "\\sqrt{$1}")
    .replace(/sqrt\s*\(([^()]+)\)/gi, "\\sqrt{$1}")
    .replace(/√\s*\(([^()]+)\)/g, "\\sqrt{$1}")
    .replace(/√\s*([A-Za-z0-9\\{}^+\-*/.]+)/g, "\\sqrt{$1}");

  text = text
    .replace(/\bint\s*_\s*([^\s^]+)\s*\^\s*([^\s]+)\s*/gi, "\\int_{$1}^{$2} ")
    .replace(/∫\s*_\s*([^\s^]+)\s*\^\s*([^\s]+)\s*/g, "\\int_{$1}^{$2} ")
    .replace(/∫/g, "\\int")
    .replace(/\bsum\s*_\s*([^\s^]+)\s*\^\s*([^\s]+)\s*/gi, "\\sum_{$1}^{$2} ");

  text = text
    .replace(/\bsin\b/gi, "\\sin")
    .replace(/\bcos\b/gi, "\\cos")
    .replace(/\btan\b/gi, "\\tan")
    .replace(/\blog\b/gi, "\\log")
    .replace(/\bln\b/gi, "\\ln");

  text = text
    .replace(/([A-Za-z0-9)\]}])\^(-?\d+)/g, "$1^{$2}")
    .replace(/([A-Za-z])_(-?\d+)/g, "$1_{$2}");

  text = text.replace(/\(([^()]+)\)\s*\/\s*\(([^()]+)\)/g, "\\frac{$1}{$2}");
  text = text.replace(/\(([^()]+)\)\s*\/\s*([A-Za-z0-9]+(?:\^\{\d+\})?)/g, "\\frac{$1}{$2}");
  text = text.replace(/(^|[\s=+\-*])(\d+(?:[.,]\d+)?)\s*\/\s*(\d+(?:[.,]\d+)?)/g, "$1\\frac{$2}{$3}");

  text = text.replace(/(\d+(?:[.,]\d+)?)\s*(cm|mm|dm|m|km)(\^\{?\d+\}?|²|³)?\b/g, (_, n, unit, power = "") => {
    if (power === "²") power = "^{2}";
    if (power === "³") power = "^{3}";
    return `${n}\\,\\mathrm{${unit}}${power}`;
  });

  return text.replace(/\s+/g, " ").trim();
}

function placeCaretAfter(node) {
  const range = document.createRange();
  const selection = window.getSelection();

  range.setStartAfter(node);
  range.collapse(true);

  selection.removeAllRanges();
  selection.addRange(range);
}

function prepareOneMathField(field) {
  if (!field || field.dataset.ready === "1") return;

  field.dataset.ready = "1";

  try {
    field.smartMode = true;
    field.smartFence = true;
    field.smartSuperscript = true;
    field.virtualKeyboardPolicy = "manual";
  } catch {}

  const latex = field.dataset.latex || field.getAttribute("value") || field.textContent || "";

  if (latex) {
    requestAnimationFrame(() => {
      try {
        field.value = latex;
        field.setValue?.(latex);
      } catch {}
    });
  }

  field.addEventListener("input", () => {
    const value = field.value || "";
    field.dataset.latex = value;
    field.setAttribute("data-latex", value);
    field.setAttribute("value", value);
  });

  field.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      placeCaretAfter(field.closest(".mws-formula") || field);
    }
  });
}

function makeMathField(rawValue = "", focus = false) {
  const latex = textToLatex(rawValue);

  const wrapper = document.createElement("span");
  wrapper.className = "mws-formula";
  wrapper.setAttribute("contenteditable", "false");

  const field = document.createElement("math-field");
  field.className = "mws-math";
  field.setAttribute("smart-mode", "on");
  field.setAttribute("smart-fence", "on");
  field.setAttribute("smart-superscript", "on");
  field.setAttribute("virtual-keyboard-policy", "manual");
  field.setAttribute("data-latex", latex);
  field.setAttribute("value", latex);
  field.textContent = latex;

  wrapper.appendChild(field);

  requestAnimationFrame(() => {
    prepareOneMathField(field);
    try {
      field.value = latex;
      field.setValue?.(latex);
    } catch {}
    if (focus) field.focus();
  });

  return wrapper;
}

function getActiveMathField() {
  const active = document.activeElement;
  if (active?.tagName === "MATH-FIELD") return active;
  return null;
}

function insertIntoMathField(field, value) {
  const latex = textToLatex(value);

  try {
    field.focus();
    field.executeCommand?.(["insert", latex]);
  } catch {
    field.value = `${field.value || ""}${latex}`;
  }

  const nextValue = field.value || field.getAttribute("value") || latex;
  field.dataset.latex = nextValue;
  field.setAttribute("data-latex", nextValue);
  field.setAttribute("value", nextValue);

  return true;
}

export function prepareEditorMath(editor) {
  if (!editor) return;

  editor.querySelectorAll(".math-block").forEach((block) => {
    const source =
      block.dataset.source ||
      block.querySelector(".math-source")?.textContent ||
      block.textContent ||
      "";

    const formula = makeMathField(source, false);
    const space = document.createTextNode("\u00A0");
    block.replaceWith(formula, space);
  });

  editor.querySelectorAll("math-field").forEach(prepareOneMathField);
}

export function syncMathFields(root) {
  if (!root) return;

  root.querySelectorAll("math-field").forEach((field) => {
    const value = field.value || field.dataset.latex || field.getAttribute("value") || field.textContent || "";
    field.dataset.latex = value;
    field.setAttribute("data-latex", value);
    field.setAttribute("value", value);
    field.textContent = value;
  });
}

export function insertInlineMathField({
  editorRef,
  restoreSelection,
  rememberSelection,
  setStatus,
  value = "",
}) {
  const activeField = getActiveMathField();

  if (activeField) {
    insertIntoMathField(activeField, value);
    setStatus?.("Đã chèn vào công thức đang sửa");
    return;
  }

  const editor = editorRef.current;
  if (!editor) return;

  editor.focus();
  restoreSelection?.();

  const selection = window.getSelection();
  let range;

  if (selection && selection.rangeCount > 0 && editor.contains(selection.anchorNode)) {
    range = selection.getRangeAt(0);
  } else {
    range = document.createRange();
    range.selectNodeContents(editor);
    range.collapse(false);
  }

  const formula = makeMathField(value, true);
  const space = document.createTextNode("\u00A0");

  range.deleteContents();
  range.insertNode(space);
  range.insertNode(formula);

  placeCaretAfter(space);
  prepareEditorMath(editor);
  rememberSelection?.();

  setStatus?.("Đã chèn công thức tại đúng vị trí con trỏ");
}

function findCurrentBlock(editor, node) {
  let current = node?.nodeType === Node.TEXT_NODE ? node.parentElement : node;

  while (current && current !== editor) {
    if (current.classList?.contains("mws-formula")) return null;

    if (["DIV", "P", "LI", "H1", "H2", "H3"].includes(current.tagName)) {
      return current;
    }

    current = current.parentElement;
  }

  return null;
}

export function convertCurrentBlockToInlineMath(editor) {
  const selection = window.getSelection();
  if (!editor || !selection || selection.rangeCount === 0) return false;

  const block = findCurrentBlock(editor, selection.anchorNode);
  if (!block) return false;

  const source = (block.innerText || block.textContent || "").trim();
  if (!source) return false;

  const formula = makeMathField(source, true);
  const space = document.createTextNode("\u00A0");

  block.innerHTML = "";
  block.appendChild(formula);
  block.appendChild(space);

  prepareEditorMath(editor);
  placeCaretAfter(space);

  return true;
}

export function autoConvertTypedMathAtCaret(editor) {
  const selection = window.getSelection();

  if (!editor || !selection || selection.rangeCount === 0 || !selection.isCollapsed) return false;

  const node = selection.anchorNode;
  if (!node || node.nodeType !== Node.TEXT_NODE || !editor.contains(node)) return false;
  if (node.parentElement?.closest?.(".mws-formula")) return false;

  const offset = selection.anchorOffset;
  const before = node.nodeValue.slice(0, offset);

  const match = before.match(/(?:^|[\s(])((?:\d+|[A-Za-z])\s*\/\s*(?:\d+|[A-Za-z])|sqrt\([^)]{1,60}\)|căn\([^)]{1,60}\)|√\([^)]{1,60}\))$/i);

  if (!match) return false;

  const raw = match[1].trim();
  const start = offset - raw.length;

  const range = document.createRange();
  range.setStart(node, start);
  range.setEnd(node, offset);
  range.deleteContents();

  const formula = makeMathField(raw, false);
  const space = document.createTextNode("\u00A0");

  range.insertNode(space);
  range.insertNode(formula);

  placeCaretAfter(space);
  prepareEditorMath(editor);

  return true;
}

export function getPlainTextWithMath(editor) {
  if (!editor) return "";

  syncMathFields(editor);

  const clone = editor.cloneNode(true);

  clone.querySelectorAll(".mws-formula").forEach((wrapper) => {
    const field = wrapper.querySelector("math-field");
    const value = field?.dataset.latex || field?.getAttribute("value") || field?.textContent || "";
    wrapper.replaceWith(document.createTextNode(value));
  });

  return clone.innerText || clone.textContent || "";
}
