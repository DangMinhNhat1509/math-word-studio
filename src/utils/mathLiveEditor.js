import "mathlive";

const QUICK_SYMBOL_LATEX = {
  "âˆ": "\\sqrt{}",
  "Â²": "^{2}",
  "Â³": "^{3}",
  "Ï€": "\\pi",
  "âˆ": "\\infty",
  "â‰ˆ": "\\approx",
  "â‰ ": "\\ne",
  "â‰¤": "\\le",
  "â‰¥": "\\ge",
  "Â±": "\\pm",
  "Ă—": "\\times",
  "Ă·": "\\div",
  "âˆ ABC": "\\angle ABC",
  "â–³ABC": "\\triangle ABC",
  "â¥": "\\perp",
  "âˆ¥": "\\parallel",
  "âˆˆ": "\\in",
  "âˆ‰": "\\notin",
  "â‡’": "\\Rightarrow",
  "â‡”": "\\Leftrightarrow",
  "âˆ‘": "\\sum",
  "Î£": "\\sum",
  "Î±": "\\alpha",
  "Î²": "\\beta",
  "Î”": "\\Delta",
};

const SUPER = {
  "â°": "0",
  "Â¹": "1",
  "Â²": "2",
  "Â³": "3",
  "â´": "4",
  "âµ": "5",
  "â¶": "6",
  "â·": "7",
  "â¸": "8",
  "â¹": "9",
};

function normalizeSuperscripts(text) {
  return String(text).replace(/[â°Â¹Â²Â³â´âµâ¶â·â¸â¹]+/g, (match) => {
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
    .replaceAll("Ï€", "\\pi")
    .replaceAll("âˆ", "\\infty")
    .replaceAll("â‰ˆ", "\\approx")
    .replaceAll("â‰ ", "\\ne")
    .replaceAll("â‰¤", "\\le")
    .replaceAll("â‰¥", "\\ge")
    .replaceAll("Â±", "\\pm")
    .replaceAll("Ă—", "\\times")
    .replaceAll("Ă·", "\\div")
    .replaceAll("Â·", "\\cdot")
    .replaceAll("â‡’", "\\Rightarrow")
    .replaceAll("â‡”", "\\Leftrightarrow")
    .replaceAll("Î”", "\\Delta")
    .replaceAll("Î±", "\\alpha")
    .replaceAll("Î²", "\\beta");

  text = text
    .replace(/>=/g, "\\ge")
    .replace(/<=/g, "\\le")
    .replace(/!=/g, "\\ne")
    .replace(/=>/g, "\\Rightarrow");

  text = text
    .replace(/cÄƒn\s*\(([^()]+)\)/gi, "\\sqrt{$1}")
    .replace(/sqrt\s*\(([^()]+)\)/gi, "\\sqrt{$1}")
    .replace(/âˆ\s*\(([^()]+)\)/g, "\\sqrt{$1}")
    .replace(/âˆ\s*([A-Za-z0-9\\{}^+\-*/.]+)/g, "\\sqrt{$1}");

  text = text
    .replace(/\bint\s*_\s*([^\s^]+)\s*\^\s*([^\s]+)\s*/gi, "\\int_{$1}^{$2} ")
    .replace(/âˆ«\s*_\s*([^\s^]+)\s*\^\s*([^\s]+)\s*/g, "\\int_{$1}^{$2} ")
    .replace(/âˆ«/g, "\\int")
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

  for (let index = 0; index < 3; index += 1) {
    text = text.replace(/\(([^()]+)\)\s*\/\s*\(([^()]+)\)/g, "\\frac{$1}{$2}");
    text = text.replace(/\(([^()]+)\)\s*\/\s*([A-Za-z0-9]+(?:\^\{\d+\})?)/g, "\\frac{$1}{$2}");
    text = text.replace(/([A-Za-z0-9]+(?:\^\{\d+\})?)\s*\/\s*\(([^()]+)\)/g, "\\frac{$1}{$2}");
    text = text.replace(/(^|[\s=+\-*])(\d+(?:[.,]\d+)?|[A-Za-z]+[A-Za-z0-9]*)\s*\/\s*(\d+(?:[.,]\d+)?|[A-Za-z]+[A-Za-z0-9]*)/g, "$1\\frac{$2}{$3}");
  }

  text = text.replace(
    /(\d+(?:[.,]\d+)?)\s*(cm|mm|dm|m|km)(\^\{?\d+\}?|Â²|Â³)?\b/g,
    (_, n, unit, power = "") => {
      if (power === "Â²") power = "^{2}";
      if (power === "Â³") power = "^{3}";
      return `${n}\\,\\mathrm{${unit}}${power}`;
    }
  );

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

function placeCaretInside(node) {
  const range = document.createRange();
  const selection = window.getSelection();

  range.selectNodeContents(node);
  range.collapse(false);

  selection.removeAllRanges();
  selection.addRange(range);
}

function insertParagraphAfterMathField(field) {
  const wrapper = field.closest(".mws-formula") || field;
  const block = wrapper.closest("p, div, li") || wrapper;
  const p = document.createElement("p");

  p.innerHTML = "<br>";
  block.after(p);
  placeCaretInside(p);
}

function prepareOneMathField(field) {
  if (!field || field.dataset.ready === "1") return;

  field.dataset.ready = "1";

  try {
    field.smartMode = true;
    field.smartFence = true;
    field.smartSuperscript = true;
    field.virtualKeyboardPolicy = "manual";
    field.menuItems = [];
  } catch {}

  const latex = field.dataset.latex || field.getAttribute("value") || field.textContent || "";

  if (latex) {
    requestAnimationFrame(() => {
      try {
        field.value = latex;
        field.setValue?.(latex);
        field.executeCommand?.("moveToMathfieldEnd");
      } catch {}
    });
  }

  field.addEventListener("input", () => {
    const value = field.value || "";

    field.dataset.latex = value;
    field.setAttribute("data-latex", value);
    field.setAttribute("value", value);
  });

  field.addEventListener("blur", () => {
    field.closest(".mws-formula")?.classList.remove("is-editing");
  });

  field.addEventListener("focus", () => {
    field.closest(".mws-formula")?.classList.add("is-editing");
  });

  field.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      insertParagraphAfterMathField(field);
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      placeCaretAfter(field.closest(".mws-formula") || field);
      field.blur();
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
      field.executeCommand?.("moveToMathfieldEnd");
    } catch {}

    if (focus) {
      wrapper.classList.add("is-editing");
      field.focus();

      try {
        field.executeCommand?.("moveToMathfieldEnd");
      } catch {}
    }
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
    field.executeCommand?.("moveToMathfieldEnd");
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

  editor.querySelectorAll(".math-block, .formula-line").forEach((block) => {
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
    const value =
      field.value ||
      field.dataset.latex ||
      field.getAttribute("value") ||
      field.textContent ||
      "";

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
    setStatus?.("ÄĂ£ chĂ¨n vĂ o cĂ´ng thá»©c Ä‘ang sá»­a");
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

  const shouldFocus = String(value || "").trim() === "";
  const formula = makeMathField(value, shouldFocus);
  const space = document.createTextNode("\u00A0");

  range.deleteContents();
  range.insertNode(space);
  range.insertNode(formula);

  if (!shouldFocus) {
    placeCaretAfter(space);

    requestAnimationFrame(() => {
      editor.focus();
      placeCaretAfter(space);
    });
  }

  prepareEditorMath(editor);
  rememberSelection?.();
  setStatus?.("ÄĂ£ chĂ¨n cĂ´ng thá»©c táº¡i Ä‘Ăºng vá»‹ trĂ­ con trá»");
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

  const formula = makeMathField(source, false);
  const space = document.createTextNode("\u00A0");

  block.innerHTML = "";
  block.appendChild(formula);
  block.appendChild(space);

  prepareEditorMath(editor);
  placeCaretAfter(space);

  return true;
}

function isMathCandidate(text) {
  const value = String(text || "").trim();

  if (!value) return false;
  if (value.length > 160) return false;

  const hasMathSignal =
    /\/|sqrt\s*\(|cÄƒn\s*\(|âˆ|=|>=|<=|!=|=>|[â‰¥â‰¤â‰ â‰ˆÂ±Ă—Ă·^â°Â¹Â²Â³â´âµâ¶â·â¸â¹]|\\/.test(value);

  if (!hasMathSignal) return false;

  const allowed = /^[A-Za-z0-9\sÏ€âˆâ‰ˆâ‰ â‰¤â‰¥Â±Ă—Ă·âˆ â–³â¥âˆ¥âˆˆâˆ‰â‡’â‡”âˆ‘Î£Î±Î²Î”âˆ.,;:(){}\[\]+\-*/^_=<>!]+$/u;

  return allowed.test(value);
}

function findMathSuffix(before) {
  const trailing = before.match(/\s*$/)?.[0] || "";
  const body = before.slice(0, before.length - trailing.length);

  if (!body.trim()) return null;

  const starts = [];

  for (let i = body.length - 1; i >= 0; i -= 1) {
    const char = body[i];

    if (i === 0) starts.push(0);

    if (/\s/.test(char)) {
      starts.push(i + 1);
    }

    if ("ï¼Œ,;:ă€‚".includes(char)) {
      starts.push(i + 1);
      break;
    }

    if (body.length - i > 160) break;
  }

  const uniqueStarts = [...new Set(starts)].sort((a, b) => a - b);

  for (const start of uniqueStarts) {
    const candidate = body.slice(start).trim();

    if (isMathCandidate(candidate)) {
      return {
        raw: candidate,
        start,
        end: body.length,
        trailing,
      };
    }
  }

  const simple = body.match(
    /(?:^|[\s(])((?:[A-Za-z0-9]+|\([^()]+\))\s*\/\s*(?:[A-Za-z0-9]+|\([^()]+\))|sqrt\([^)]{1,80}\)|cÄƒn\([^)]{1,80}\)|âˆ\([^)]{1,80}\)|âˆ\s*[A-Za-z0-9]+|[A-Za-z0-9]+\^\d+)$/i
  );

  if (!simple) return null;

  const raw = simple[1].trim();

  return {
    raw,
    start: body.length - raw.length,
    end: body.length,
    trailing,
  };
}

export function autoConvertTypedMathAtCaret(editor) {
  const selection = window.getSelection();

  if (!editor || !selection || selection.rangeCount === 0 || !selection.isCollapsed) {
    return false;
  }

  const node = selection.anchorNode;

  if (!node || node.nodeType !== Node.TEXT_NODE || !editor.contains(node)) {
    return false;
  }

  if (node.parentElement?.closest?.(".mws-formula")) {
    return false;
  }

  const offset = selection.anchorOffset;
  const before = node.nodeValue.slice(0, offset);
  const match = findMathSuffix(before);

  if (!match) return false;

  const range = document.createRange();

  range.setStart(node, match.start);
  range.setEnd(node, offset);
  range.deleteContents();

  const formula = makeMathField(match.raw, false);
  const space = document.createTextNode(match.trailing || "\u00A0");

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
    const value =
      field?.dataset.latex ||
      field?.getAttribute("value") ||
      field?.textContent ||
      "";

    wrapper.replaceWith(document.createTextNode(value));
  });

  return clone.innerText || clone.textContent || "";
}

/* MWSTUDIO_SLASH_FRACTION_CURSOR_FIX
   Khi gơ 1/ trong math-field: app t?o phân s? và t? dua con tr? xu?ng m?u.
   Không d?ng giao di?n, không d?ng logic h́nh h?c.
*/
function installSlashFractionCursorFix() {
  if (typeof window === "undefined") return;
  if (window.__MWSTUDIO_SLASH_FRACTION_CURSOR_FIX__) return;

  window.__MWSTUDIO_SLASH_FRACTION_CURSOR_FIX__ = true;

  const getMathField = (target) => {
    if (!target) return null;
    if (target.tagName && target.tagName.toLowerCase() === "math-field") return target;
    if (typeof target.closest === "function") return target.closest("math-field");
    return null;
  };

  const moveToDenominator = (field) => {
    if (!field || typeof field.executeCommand !== "function") return;

    const move = () => {
      try {
        field.focus && field.focus();
      } catch (error) {}

      try {
        field.executeCommand("moveToNextPlaceholder");
        return;
      } catch (error) {}

      try {
        field.executeCommand(["moveToNextPlaceholder"]);
        return;
      } catch (error) {}
    };

    // Ch? app/MathLive t?o phân s? xong r?i m?i nh?y xu?ng m?u
    setTimeout(move, 0);
    setTimeout(move, 30);
    requestAnimationFrame(move);
  };

  window.addEventListener(
    "keydown",
    (event) => {
      if (event.key !== "/") return;
      if (event.ctrlKey || event.metaKey || event.altKey) return;

      const field = getMathField(event.target);
      if (!field) return;

      moveToDenominator(field);
    },
    true
  );
}

installSlashFractionCursorFix();
