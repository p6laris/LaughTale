// ../SoftMax.LaughTale.Client/src/composables/useFocusTrap.ts
var FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]'
].join(",");
function useFocusTrap(container, options = {}) {
  let previouslyFocusedElement = null;
  let isActive = false;
  function getFocusableElements() {
    return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)).filter((el) => el.offsetParent !== null || el.offsetWidth > 0 || el.offsetHeight > 0);
  }
  function handleKeyDown(e) {
    if (!isActive || e.key !== "Tab") return;
    const focusable = getFocusableElements();
    if (focusable.length === 0) {
      e.preventDefault();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first || !container.contains(document.activeElement)) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last || !container.contains(document.activeElement)) {
        e.preventDefault();
        first.focus();
      }
    }
  }
  function activate() {
    if (isActive) return;
    isActive = true;
    previouslyFocusedElement = document.activeElement;
    document.addEventListener("keydown", handleKeyDown);
    if (options.autoFocus !== false) {
      setTimeout(() => {
        if (options.initialFocusElement) {
          options.initialFocusElement.focus();
        } else {
          const focusable = getFocusableElements();
          if (focusable.length > 0) focusable[0].focus();
          else container.focus();
        }
      }, 10);
    }
  }
  function deactivate() {
    if (!isActive) return;
    isActive = false;
    document.removeEventListener("keydown", handleKeyDown);
    if (options.restoreFocus !== false && previouslyFocusedElement && typeof previouslyFocusedElement.focus === "function") {
      previouslyFocusedElement.focus();
    }
  }
  return { activate, deactivate };
}

export {
  useFocusTrap
};
//# sourceMappingURL=chunk-RBI7CHCL.js.map
