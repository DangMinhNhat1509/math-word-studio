import DOMPurify from "dompurify";

/**
 * Sanitize HTML to prevent XSS attacks
 * Only allows safe math and formatting tags
 */
export function sanitizeHtml(dirty) {
  if (!dirty || typeof dirty !== "string") {
    return "";
  }

  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      "P",
      "BR",
      "SPAN",
      "DIV",
      "B",
      "I",
      "U",
      "STRONG",
      "EM",
      "H1",
      "H2",
      "H3",
      "H4",
      "H5",
      "H6",
      "OL",
      "UL",
      "LI",
      "MATH",
      "MATH-FIELD",
      "ANNOTATION",
      "SUB",
      "SUP",
    ],
    ALLOWED_ATTR: ["class", "id", "style", "data-*", "contenteditable"],
    KEEP_CONTENT: true,
    // Allow data attributes for math-field library
    CUSTOM_ELEMENT_HANDLING: {
      "MATH-FIELD": (element) => {
        element.innerHTML = DOMPurify.sanitize(element.innerHTML, {
          ALLOWED_TAGS: [],
          ALLOWED_ATTR: [],
        });
        return true;
      },
    },
  });
}

/**
 * Escape HTML for safe text content
 */
export function escapeHtml(text) {
  if (!text || typeof text !== "string") {
    return "";
  }

  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Validate and sanitize user input for execCommand
 */
export function sanitizeEditorInput(html) {
  if (!html || typeof html !== "string") {
    return "";
  }

  // Remove script tags and event handlers
  const cleaned = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, "")
    .replace(/on\w+\s*=\s*[^\s>]*/gi, "");

  return sanitizeHtml(cleaned);
}
