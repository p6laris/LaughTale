import {
  injectIslandStyle
} from "./chunk-3TFPN5JM.js";

// ../SoftMax.LaughTale.Client/src/components/slider.ts
var CSS = `
[data-theme="dark"] .laughtale-slider {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .slider-track {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .slider-fill {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .slider-handle {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .slider-value-display {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
`;
function SliderIsland(container, props) {
  injectIslandStyle("slider", CSS);
  const min = props.min !== void 0 ? props.min : 0;
  const max = props.max !== void 0 ? props.max : 100;
  const step = props.step !== void 0 ? props.step : 1;
  let currentValue = props.value !== void 0 ? props.value : min;
  function getPercent(val) {
    return Math.max(0, Math.min(100, (val - min) / (max - min) * 100));
  }
  const initialPercent = getPercent(currentValue);
  container.innerHTML = `
        <div class="laughtale-slider" style="position: relative; width: 100%; max-width: 320px; padding: 1rem 0; user-select: none; touch-action: none;">
            <!-- Track -->
            <div class="slider-track" style="position: relative; height: 6px; border-radius: 3px; background: var(--p-surface-200); cursor: ${props.disabled ? "not-allowed" : "pointer"};">
                <!-- Active Fill Bar -->
                <div class="slider-fill" style="position: absolute; top: 0; left: 0; height: 100%; width: ${initialPercent}%; border-radius: 3px; background: var(--p-primary-600); pointer-events: none;"></div>
                <!-- Drag Handle -->
                <div class="slider-handle" style="position: absolute; top: 50%; left: ${initialPercent}%; transform: translate(-50%, -50%); width: 1.125rem; height: 1.125rem; border-radius: 50%; background: #ffffff; border: 2px solid var(--p-primary-600); box-shadow: 0 1px 4px rgba(0,0,0,0.2); cursor: ${props.disabled ? "not-allowed" : "grab"};"></div>
            </div>

            <div style="display: flex; justify-content: space-between; margin-top: 0.5rem; font-size: 0.75rem; color: var(--p-surface-500); font-family: var(--p-font-mono);">
                <span>${min}</span>
                <span class="slider-value-display" style="font-weight: 700; color: var(--p-primary-600);">${currentValue}</span>
                <span>${max}</span>
            </div>
        </div>
    `;
  const track = container.querySelector(".slider-track");
  const fill = container.querySelector(".slider-fill");
  const handle = container.querySelector(".slider-handle");
  const valueDisplay = container.querySelector(".slider-value-display");
  function updateVisuals() {
    const pct = getPercent(currentValue);
    fill.style.width = `${pct}%`;
    handle.style.left = `${pct}%`;
    valueDisplay.textContent = currentValue.toString();
  }
  function syncValue() {
    if (props.targetInputName) {
      let hidden = container.querySelector(`input[name="${props.targetInputName}"]`);
      if (!hidden) {
        hidden = document.createElement("input");
        hidden.type = "hidden";
        hidden.name = props.targetInputName;
        container.appendChild(hidden);
      }
      hidden.value = currentValue.toString();
    }
    container.dispatchEvent(new CustomEvent("slider:change", {
      bubbles: true,
      detail: { value: currentValue }
    }));
  }
  if (!props.disabled) {
    let isDragging = false;
    const updateFromClientX = (clientX) => {
      const rect = track.getBoundingClientRect();
      if (rect.width <= 0) return;
      let ratio = (clientX - rect.left) / rect.width;
      ratio = Math.max(0, Math.min(1, ratio));
      let rawVal = min + ratio * (max - min);
      rawVal = Math.round(rawVal / step) * step;
      currentValue = Math.max(min, Math.min(max, rawVal));
      updateVisuals();
      syncValue();
    };
    const onPointerDown = (e) => {
      isDragging = true;
      handle.style.cursor = "grabbing";
      handle.style.transform = "translate(-50%, -50%) scale(1.2)";
      if ("setPointerCapture" in track && e.pointerId !== void 0) {
        try {
          track.setPointerCapture(e.pointerId);
        } catch (_) {
        }
      }
      updateFromClientX(e.clientX);
    };
    const onPointerMove = (e) => {
      if (!isDragging) return;
      updateFromClientX(e.clientX);
    };
    const onPointerUp = (e) => {
      if (!isDragging) return;
      isDragging = false;
      handle.style.cursor = "grab";
      handle.style.transform = "translate(-50%, -50%) scale(1)";
      if ("releasePointerCapture" in track && e.pointerId !== void 0) {
        try {
          track.releasePointerCapture(e.pointerId);
        } catch (_) {
        }
      }
    };
    track.addEventListener("pointerdown", onPointerDown);
    track.addEventListener("pointermove", onPointerMove);
    track.addEventListener("pointerup", onPointerUp);
    track.addEventListener("pointercancel", onPointerUp);
    track.addEventListener("mousedown", onPointerDown);
    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("mouseup", onPointerUp);
  }
  syncValue();
}
export {
  SliderIsland as default
};
//# sourceMappingURL=slider-47QSQKTF.js.map
