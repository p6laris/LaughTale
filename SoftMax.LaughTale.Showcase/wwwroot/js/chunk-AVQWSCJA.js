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

// ../SoftMax.LaughTale.Client/src/composables/useHotkeys.ts
function useHotkeys(hotkeys, targetNode = typeof document !== "undefined" ? document : null) {
  if (!targetNode) return { destroy: () => {
  } };
  function matchesCombo(e, comboStr) {
    const parts = comboStr.toLowerCase().split("+").map((p) => p.trim());
    const hasCtrl = parts.includes("ctrl") || parts.includes("control");
    const hasMeta = parts.includes("meta") || parts.includes("cmd") || parts.includes("command");
    const hasShift = parts.includes("shift");
    const hasAlt = parts.includes("alt");
    if (hasCtrl && !e.ctrlKey) return false;
    if (hasMeta && !e.metaKey) return false;
    if (hasShift && !e.shiftKey) return false;
    if (hasAlt && !e.altKey) return false;
    const mainKey = parts.find((p) => !["ctrl", "control", "meta", "cmd", "command", "shift", "alt"].includes(p));
    if (!mainKey) return true;
    const key = e.key.toLowerCase();
    if (mainKey === "esc" || mainKey === "escape") return key === "escape";
    if (mainKey === "enter") return key === "enter";
    if (mainKey === "space") return key === " " || key === "space";
    if (mainKey === "slash") return key === "/";
    return key === mainKey;
  }
  function isInputElement(el) {
    if (!el) return false;
    const tag = el.tagName.toLowerCase();
    return tag === "input" || tag === "textarea" || tag === "select" || el.hasAttribute("contenteditable");
  }
  function handleKeyDown(e) {
    const keyEvent = e;
    const target = keyEvent.target;
    const isInput = isInputElement(target);
    for (const item of hotkeys) {
      if (isInput && !item.allowInInputs && item.combo !== "escape") {
        continue;
      }
      if (matchesCombo(keyEvent, item.combo)) {
        keyEvent.preventDefault();
        item.handler(keyEvent);
        break;
      }
    }
  }
  targetNode.addEventListener("keydown", handleKeyDown);
  return {
    destroy: () => {
      targetNode.removeEventListener("keydown", handleKeyDown);
    }
  };
}

export {
  useFocusTrap,
  useHotkeys
};
//# sourceMappingURL=chunk-AVQWSCJA.js.map
