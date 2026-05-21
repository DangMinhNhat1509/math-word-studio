import { useRef } from "react";

export function useEditorSelection(editorRef) {
  const lastRangeRef = useRef(null);

  function rememberSelection() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);

    if (editorRef.current?.contains(range.commonAncestorContainer)) {
      lastRangeRef.current = range;
    }
  }

  function restoreSelection() {
    const selection = window.getSelection();
    if (!selection || !lastRangeRef.current) return;

    selection.removeAllRanges();
    selection.addRange(lastRangeRef.current);
  }

  return {
    rememberSelection,
    restoreSelection
  };
}
