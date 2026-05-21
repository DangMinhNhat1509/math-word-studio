export function cleanPastedHtml(html = "") {
  const doc = new DOMParser().parseFromString(html, "text/html");

  doc.body.querySelectorAll("*").forEach((el) => {
    el.removeAttribute("style");
    el.removeAttribute("class");
    el.removeAttribute("id");
    el.removeAttribute("width");
    el.removeAttribute("height");

    if (!["P", "B", "STRONG", "I", "EM", "U", "BR", "H1", "H2", "H3", "UL", "OL", "LI", "SPAN"].includes(el.tagName)) {
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
