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
  useHotkeys
};
//# sourceMappingURL=chunk-ZFSVXRXK.js.map
