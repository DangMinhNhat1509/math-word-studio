import katex from "katex";

const SYMBOL_MAP = {
  "≤": "\\le",
  "≥": "\\ge",
  "≠": "\\ne",
  "≈": "\\approx",
  "∞": "\\infty",
  "π": "\\pi",
  "α": "\\alpha",
  "β": "\\beta",
  "γ": "\\gamma",
  "Δ": "\\Delta",
  "Σ": "\\Sigma",
  "×": "\\times",
  "÷": "\\div",
  "·": "\\cdot",
  "→": "\\Rightarrow",
  "⇒": "\\Rightarrow",
  "↔": "\\Leftrightarrow",
};

const SUPERSCRIPT_MAP = {
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

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizeUnicodePowers(text) {
  return text.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, (match) => {
    const number = [...match].map((char) => SUPERSCRIPT_MAP[char] || "").join("");
    return `^{${number}}`;
  });
}

function normalizeSymbols(text) {
  let result = text;
  Object.entries(SYMBOL_MAP).forEach(([symbol, latex]) => {
    result = result.replaceAll(symbol, latex);
  });
  return result;
}

function normalizeRoots(text) {
  return text
    .replace(/căn\s*\(([^()]+)\)/gi, "\\sqrt{$1}")
    .replace(/sqrt\s*\(([^()]+)\)/gi, "\\sqrt{$1}")
    .replace(/√\s*\(([^()]+)\)/g, "\\sqrt{$1}")
    .replace(/căn\s+([a-zA-Z0-9\\{}^_+\-*/.]+)/gi, "\\sqrt{$1}")
    .replace(/√\s*([a-zA-Z0-9\\{}^_+\-*/.]+)/g, "\\sqrt{$1}");
}

function normalizeIntegralsAndSums(text) {
  return text
    .replace(/∫\s*_\s*([^\s^]+)\s*\^\s*([^\s]+)\s*/g, "\\int_{$1}^{$2} ")
    .replace(/\bint\s*_\s*([^\s^]+)\s*\^\s*([^\s]+)\s*/gi, "\\int_{$1}^{$2} ")
    .replace(/∫/g, "\\int")
    .replace(/\bsum\s*_\s*([^\s^]+)\s*\^\s*([^\s]+)\s*/gi, "\\sum_{$1}^{$2} ")
    .replace(/Σ\s*_\s*([^\s^]+)\s*\^\s*([^\s]+)\s*/g, "\\sum_{$1}^{$2} ");
}

function normalizeFunctions(text) {
  return text
    .replace(/\b(sin|cos|tan|cot)([a-zA-Z])\b/gi, (_, fn, arg) => `\\${fn.toLowerCase()} ${arg}`)
    .replace(/\b(sin|cos|tan|cot|ln|log)\b/gi, (_, fn) => `\\${fn.toLowerCase()}`);
}

function normalizePowersAndIndexes(text) {
  return text
    .replace(/([a-zA-Z0-9)\]}])\^(-?\d+)/g, "$1^{$2}")
    .replace(/([a-zA-Z0-9)\]}])\^\{?(-?\d+)\}?/g, "$1^{$2}")
    .replace(/([a-zA-Z])_(-?\d+)/g, "$1_{$2}");
}

function normalizeFractions(text) {
  let result = text;

  for (let i = 0; i < 4; i += 1) {
    const before = result;
    result = result.replace(/\(([^()]+)\)\s*\/\s*\(([^()]+)\)/g, "\\frac{$1}{$2}");
    if (before === result) break;
  }

  result = result.replace(/(^|[\s=+\-×÷*])(-?\d+(?:[.,]\d+)?)\s*\/\s*(-?\d+(?:[.,]\d+)?)/g, "$1\\frac{$2}{$3}");
  result = result.replace(/([a-zA-Z0-9\\{}^_]+)\s*\/\s*([a-zA-Z0-9\\{}^_]+)/g, "\\frac{$1}{$2}");

  return result;
}

function normalizeUnits(text) {
  return text.replace(
    /(\d+(?:[.,]\d+)?)\s*(cm|mm|dm|m|km|kg|g|l|h)(\^\{?\d+\}?|²|³)?\b/g,
    (_, number, unit, power = "") => {
      let normalizedPower = power;
      if (power === "²") normalizedPower = "^{2}";
      if (power === "³") normalizedPower = "^{3}";
      if (normalizedPower && !normalizedPower.startsWith("^")) normalizedPower = `^{${normalizedPower}}`;
      return `${number}\\,\\text{${unit}}${normalizedPower}`;
    }
  );
}

function normalizeOperators(text) {
  return text
    .replace(/\*/g, "\\cdot ")
    .replace(/\bDelta\b/g, "\\Delta")
    .replace(/\s+/g, " ")
    .trim();
}

export function toLatex(input = "") {
  let text = String(input).trim();

  text = normalizeUnicodePowers(text);
  text = normalizeSymbols(text);
  text = normalizeRoots(text);
  text = normalizeIntegralsAndSums(text);
  text = normalizeFunctions(text);
  text = normalizePowersAndIndexes(text);
  text = normalizeFractions(text);
  text = normalizeUnits(text);
  text = normalizeOperators(text);

  return text;
}

export function renderMathToHtml(input = "", displayMode = true) {
  const source = String(input || "").trim();
  const latex = toLatex(source);

  try {
    return katex.renderToString(latex, {
      displayMode,
      throwOnError: false,
      strict: false,
      trust: true,
      output: "html",
    });
  } catch {
    return `<span class="math-error">${escapeHtml(source)}</span>`;
  }
}

export function renderFormulaBlock(input = "") {
  const source = String(input || "").trim();
  const latex = toLatex(source);
  const html = renderMathToHtml(source, true);

  return `
    <div class="math-block" contenteditable="false" data-source="${escapeHtml(source)}" data-latex="${escapeHtml(latex)}">
      ${html}
      <div class="math-source">${escapeHtml(source)}</div>
    </div>
    <div><br></div>
  `;
}

export function looksLikeMath(text = "") {
  const value = String(text).trim();

  if (!value) return false;

  return /(\d+\s*\/\s*\d+|sqrt|căn|√|\\sqrt|\\frac|\\int|∫|int_|sum_|Σ|=|\^|_|≤|≥|≠|≈|π|Delta|sin|cos|tan)/i.test(value);
}
