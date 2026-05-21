export function cleanPastedHtml(html = "") {
  const doc = new DOMParser().parseFromString(html, "text/html");

  doc.body.querySelectorAll("*").forEach((el) => {
    const tag = el.tagName;

    if (tag === "MATH-FIELD") {
      const latex = el.getAttribute("data-latex") || el.getAttribute("value") || el.textContent || "";
      el.setAttribute("class", "mws-math");
      el.setAttribute("data-latex", latex);
      el.setAttribute("value", latex);
      el.textContent = latex;
      return;
    }

    if (tag === "SPAN" && el.classList.contains("mws-formula")) {
      el.setAttribute("class", "mws-formula");
      el.setAttribute("contenteditable", "false");
      return;
    }

    el.removeAttribute("style");
    el.removeAttribute("class");
    el.removeAttribute("id");
    el.removeAttribute("width");
    el.removeAttribute("height");

    const allowed = ["P", "B", "STRONG", "I", "EM", "U", "BR", "H1", "H2", "H3", "UL", "OL", "LI", "SPAN", "SUB", "SUP"];

    if (!allowed.includes(tag)) {
      const span = doc.createElement("span");
      span.innerHTML = el.innerHTML;
      el.replaceWith(span);
    }
  });

  return doc.body.innerHTML;
}

export function handleCleanPaste(event, editor) {
  const clipboard = event.clipboardData;
  if (!clipboard || !editor) return;

  event.preventDefault();

  const html = clipboard.getData("text/html");
  const text = clipboard.getData("text/plain");

  const cleanHtml = html
    ? cleanPastedHtml(html)
    : text
        .split(/\n{2,}/)
        .map((block) => `<p>${block.replace(/\n/g, "<br>")}</p>`)
        .join("");

  document.execCommand("insertHTML", false, cleanHtml);
}

export function cleanEditorFormat(editor) {
  if (!editor) return "";

  const cleanHtml = cleanPastedHtml(editor.innerHTML);
  editor.innerHTML = cleanHtml;

  return cleanHtml;
}
