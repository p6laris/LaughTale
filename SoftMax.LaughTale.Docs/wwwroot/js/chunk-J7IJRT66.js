// ../SoftMax.LaughTale.Client/src/composables/useDragGesture.ts
function useDragGesture(targetElement, options = {}) {
  const axis = options.axis ?? "both";
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  function getDragState(e) {
    const rect = targetElement.getBoundingClientRect();
    const clientX = e.clientX;
    const clientY = e.clientY;
    const dx = axis === "y" ? 0 : clientX - startX;
    const dy = axis === "x" ? 0 : clientY - startY;
    const ratioX = rect.width > 0 ? Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)) : 0;
    const ratioY = rect.height > 0 ? Math.max(0, Math.min(1, (clientY - rect.top) / rect.height)) : 0;
    return { clientX, clientY, dx, dy, ratioX, ratioY, isDragging };
  }
  const onPointerDown = (e) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    if ("setPointerCapture" in targetElement && e.pointerId !== void 0) {
      try {
        targetElement.setPointerCapture(e.pointerId);
      } catch (_) {
      }
    }
    const state = getDragState(e);
    options.onDragStart?.(state);
    options.onDrag?.(state);
  };
  const onPointerMove = (e) => {
    if (!isDragging) return;
    const state = getDragState(e);
    options.onDrag?.(state);
  };
  const onPointerUp = (e) => {
    if (!isDragging) return;
    isDragging = false;
    if ("releasePointerCapture" in targetElement && e.pointerId !== void 0) {
      try {
        targetElement.releasePointerCapture(e.pointerId);
      } catch (_) {
      }
    }
    const state = getDragState(e);
    options.onDragEnd?.(state);
  };
  targetElement.addEventListener("pointerdown", onPointerDown);
  targetElement.addEventListener("pointermove", onPointerMove);
  targetElement.addEventListener("pointerup", onPointerUp);
  targetElement.addEventListener("pointercancel", onPointerUp);
  function destroy() {
    targetElement.removeEventListener("pointerdown", onPointerDown);
    targetElement.removeEventListener("pointermove", onPointerMove);
    targetElement.removeEventListener("pointerup", onPointerUp);
    targetElement.removeEventListener("pointercancel", onPointerUp);
  }
  return { destroy };
}

export {
  useDragGesture
};
//# sourceMappingURL=chunk-J7IJRT66.js.map
