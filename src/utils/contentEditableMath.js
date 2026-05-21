import { looksLikeMath, renderFormulaBlock } from "./mathFormatter";

function placeCaretInside(element) {
  const selection = window.getSelection();
  const range = document.createRange();

  range.selectNodeContents(element);
  range.collapse(true);

  selection.removeAllRanges();
  selection.addRange(range);
}

function findCurrentBlock(editor, node) {
  let current = node?.nodeType === Node.TEXT_NODE ? node.parentElement : node;

  while (current && current !== editor) {
    if (["DIV", "P", "LI", "H1", "H2", "H3", "H4"].includes(current.tagName)) {
      return current;
    }

    current = current.parentElement;
  }

  return null;
}

export function formatCurrentBlockToMath(editor) {
  const selection = window.getSelection();

  if (!editor || !selection || selection.rangeCount === 0) return false;

  const anchor = selection.anchorNode;
  if (!anchor || !editor.contains(anchor)) return false;

  const block = findCurrentBlock(editor, anchor);
  if (!block || block.classList?.contains("math-block") || block.closest?.(".math-block")) return false;

  const source = (block.innerText || block.textContent || "").trim();
  if (!looksLikeMath(source)) return false;

  const template = document.createElement("template");
  template.innerHTML = renderFormulaBlock(source).trim();

  const mathBlock = template.content.firstElementChild;
  const nextLine = template.content.lastElementChild;

  block.replaceWith(template.content);

  if (nextLine) {
    placeCaretInside(nextLine);
  } else if (mathBlock) {
    mathBlock.insertAdjacentHTML("afterend", "<div><br></div>");
  }

  return true;
}
