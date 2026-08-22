// ../SoftMax.LaughTale.Client/src/components/image-compare.ts
function ImageCompareIsland(container, props) {
  let splitPercent = 50;
  container.innerHTML = `
        <div class="laughtale-image-compare" style="position: relative; width: 100%; max-width: 600px; height: 340px; border-radius: var(--p-border-radius-lg); overflow: hidden; user-select: none; border: 1px solid var(--p-border-color); box-shadow: var(--p-shadow-md); touch-action: none; cursor: ew-resize;">
            <!-- After Image (Bottom) -->
            <img src="${props.afterImage}" alt="After" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; pointer-events: none;" />
            ${props.afterLabel ? `<span style="position: absolute; bottom: 0.75rem; right: 0.75rem; background: rgba(0,0,0,0.6); color: #ffffff; padding: 0.25rem 0.5rem; border-radius: var(--p-border-radius); font-size: 0.75rem; font-weight: 600; pointer-events: none;">${props.afterLabel}</span>` : ""}

            <!-- Before Image (Top Clipped) -->
            <div class="compare-clip" style="position: absolute; inset: 0; width: ${splitPercent}%; height: 100%; overflow: hidden; pointer-events: none;">
                <img src="${props.beforeImage}" alt="Before" style="position: absolute; top: 0; left: 0; width: 600px; max-width: 600px; height: 340px; object-fit: cover;" />
                ${props.beforeLabel ? `<span style="position: absolute; bottom: 0.75rem; left: 0.75rem; background: rgba(0,0,0,0.6); color: #ffffff; padding: 0.25rem 0.5rem; border-radius: var(--p-border-radius); font-size: 0.75rem; font-weight: 600;">${props.beforeLabel}</span>` : ""}
            </div>

            <!-- Divider Line & Handle -->
            <div class="compare-handle-line" style="position: absolute; top: 0; bottom: 0; left: ${splitPercent}%; width: 2px; background: #ffffff; box-shadow: 0 0 6px rgba(0,0,0,0.6); pointer-events: none;">
                <div class="compare-handle-knob" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 2.25rem; height: 2.25rem; border-radius: 50%; background: #ffffff; border: 2px solid var(--p-primary-600); box-shadow: 0 2px 8px rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center; font-size: 0.6875rem; font-weight: 700; color: var(--p-primary-600); transition: transform 0.15s ease;">
                    \u25C0\u25B6
                </div>
            </div>
        </div>
    `;
  const compareBox = container.querySelector(".laughtale-image-compare");
  const clip = container.querySelector(".compare-clip");
  const handleLine = container.querySelector(".compare-handle-line");
  const knob = container.querySelector(".compare-handle-knob");
  function updateSplit(p) {
    splitPercent = Math.max(0, Math.min(100, p));
    clip.style.width = `${splitPercent}%`;
    handleLine.style.left = `${splitPercent}%`;
    container.dispatchEvent(new CustomEvent("imagecompare:change", {
      bubbles: true,
      detail: { split: splitPercent }
    }));
  }
  let isDragging = false;
  const updateFromPointer = (clientX) => {
    const rect = compareBox.getBoundingClientRect();
    if (rect.width <= 0) return;
    const p = (clientX - rect.left) / rect.width * 100;
    updateSplit(p);
  };
  const onPointerDown = (e) => {
    isDragging = true;
    knob.style.transform = "translate(-50%, -50%) scale(1.15)";
    if ("setPointerCapture" in compareBox && e.pointerId !== void 0) {
      try {
        compareBox.setPointerCapture(e.pointerId);
      } catch (_) {
      }
    }
    updateFromPointer(e.clientX);
  };
  const onPointerMove = (e) => {
    if (!isDragging) return;
    updateFromPointer(e.clientX);
  };
  const onPointerUp = (e) => {
    if (!isDragging) return;
    isDragging = false;
    knob.style.transform = "translate(-50%, -50%) scale(1)";
    if ("releasePointerCapture" in compareBox && e.pointerId !== void 0) {
      try {
        compareBox.releasePointerCapture(e.pointerId);
      } catch (_) {
      }
    }
  };
  compareBox.addEventListener("pointerdown", onPointerDown);
  compareBox.addEventListener("pointermove", onPointerMove);
  compareBox.addEventListener("pointerup", onPointerUp);
  compareBox.addEventListener("pointercancel", onPointerUp);
  compareBox.addEventListener("mousedown", onPointerDown);
  window.addEventListener("mousemove", onPointerMove);
  window.addEventListener("mouseup", onPointerUp);
}
export {
  ImageCompareIsland as default
};
//# sourceMappingURL=image-compare-ZFPGGMPJ.js.map
