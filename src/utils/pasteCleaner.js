function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function formatChoiceLine(line = "") {
  const normalized = line.replace(/\s+/g, " ").trim();
  const match = normalized.match(
    /^(.*?)(A[\.\)]\s*.*?)(B[\.\)]\s*.*?)(C[\.\)]\s*.*?)(D[\.\)]\s*.*)$/i,
  );

  if (!match) return null;

  const question = match[1].trim();
  const choices = [match[2], match[3], match[4], match[5]].map((choice) =>
    choice.trim(),
  );
  const longChoice = choices.some((choice) => choice.length > 40);
  const className = longChoice ? "choice-list" : "choice-grid";

  return `
    ${question ? `<p>${escapeHtml(question)}</p>` : ""}
    <div class="${className}">
      ${choices.map((choice) => `<div>${escapeHtml(choice)}</div>`).join("")}
    </div>
  `;
}

function formatPlainText(text = "") {
  const blocks = text.split(/\n{2,}/);

  return blocks
    .map((block) => {
      const oneLine = block.replace(/\n/g, " ").replace(/\s+/g, " ").trim();
      const choiceHtml = formatChoiceLine(oneLine);

      if (choiceHtml) return choiceHtml;

      return `<p>${escapeHtml(block).replace(/\n/g, "<br>")}</p>`;
    })
    .join("");
}

export function cleanPastedHtml(html = "") {
  const doc = new DOMParser().parseFromString(html, "text/html");

  doc.body.querySelectorAll("*").forEach((el) => {
    const tag = el.tagName;

    if (tag === "MATH-FIELD") {
      const latex =
        el.getAttribute("data-latex") ||
        el.getAttribute("value") ||
        el.textContent ||
        "";
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

    if (
      tag === "DIV" &&
      (el.classList.contains("choice-grid") ||
        el.classList.contains("choice-list"))
    ) {
      return;
    }

    el.removeAttribute("style");
    el.removeAttribute("class");
    el.removeAttribute("id");
    el.removeAttribute("width");
    el.removeAttribute("height");

    const allowed = [
      "P",
      "B",
      "STRONG",
      "I",
      "EM",
      "U",
      "BR",
      "H1",
      "H2",
      "H3",
      "UL",
      "OL",
      "LI",
      "SPAN",
      "SUB",
      "SUP",
      "DIV",
    ];

    if (!allowed.includes(tag)) {
      const span = doc.createElement("span");
      // Use textContent for safety, or copy child nodes explicitly
      while (el.firstChild) {
        span.appendChild(el.firstChild);
      }
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
  const cleanHtml = html ? cleanPastedHtml(html) : formatPlainText(text);

  document.execCommand("insertHTML", false, cleanHtml);
}

export function cleanEditorFormat(editor) {
  if (!editor) return "";

  const text = editor.innerText || editor.textContent || "";
  const cleanHtml = formatPlainText(text);

  editor.innerHTML = cleanHtml;

  return cleanHtml;
}
