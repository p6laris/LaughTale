// ../SoftMax.LaughTale.Client/src/components/knob.ts
function KnobIsland(container, props) {
  const min = props.min !== void 0 ? props.min : 0;
  const max = props.max !== void 0 ? props.max : 100;
  const step = props.step || 1;
  const size = props.size || 96;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const template = props.valueTemplate || "{value}%";
  let currentValue = props.value !== void 0 ? props.value : min;
  function getOffset(val) {
    const pct = Math.max(0, Math.min(1, (val - min) / (max - min)));
    return circumference * (1 - pct);
  }
  const initialOffset = getOffset(currentValue);
  const initialText = template.replace("{value}", currentValue.toString());
  container.innerHTML = `
        <div class="laughtale-knob" style="position: relative; display: inline-flex; align-items: center; justify-content: center; width: ${size}px; height: ${size}px; user-select: none; cursor: ${props.disabled ? "not-allowed" : "pointer"}; touch-action: none;">
            <svg width="${size}" height="${size}" style="transform: rotate(-90deg); pointer-events: none;">
                <!-- Background Circle -->
                <circle cx="${size / 2}" cy="${size / 2}" r="${radius}" fill="transparent" stroke="var(--p-surface-200)" stroke-width="${strokeWidth}" />
                <!-- Progress Arc -->
                <circle class="knob-progress-circle" cx="${size / 2}" cy="${size / 2}" r="${radius}" fill="transparent" stroke="${props.color || "var(--p-primary-600)"}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-dasharray="${circumference}" stroke-dashoffset="${initialOffset}" style="transition: stroke-dashoffset 0.05s ease;" />
            </svg>
            <span class="knob-value-display" style="position: absolute; font-size: ${size * 0.2}px; font-weight: 700; color: var(--p-surface-900); pointer-events: none;">
                ${initialText}
            </span>
        </div>
    `;
  const knobEl = container.querySelector(".laughtale-knob");
  const progressCircle = container.querySelector(".knob-progress-circle");
  const valueDisplay = container.querySelector(".knob-value-display");
  function updateVisuals() {
    progressCircle.style.strokeDashoffset = `${getOffset(currentValue)}`;
    valueDisplay.textContent = template.replace("{value}", currentValue.toString());
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
    container.dispatchEvent(new CustomEvent("knob:change", {
      bubbles: true,
      detail: { value: currentValue }
    }));
  }
  if (!props.disabled) {
    let isDragging = false;
    const updateFromPointer = (clientX, clientY) => {
      const rect = knobEl.getBoundingClientRect();
      if (rect.width <= 0) return;
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const angle = Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI) + 90;
      const normalizedAngle = angle < 0 ? angle + 360 : angle;
      const ratio = Math.min(1, Math.max(0, normalizedAngle / 360));
      const rawVal = min + ratio * (max - min);
      currentValue = Math.round(rawVal / step) * step;
      currentValue = Math.max(min, Math.min(max, currentValue));
      updateVisuals();
      syncValue();
    };
    const onPointerDown = (e) => {
      isDragging = true;
      if ("setPointerCapture" in knobEl && e.pointerId !== void 0) {
        try {
          knobEl.setPointerCapture(e.pointerId);
        } catch (_) {
        }
      }
      updateFromPointer(e.clientX, e.clientY);
    };
    const onPointerMove = (e) => {
      if (!isDragging) return;
      updateFromPointer(e.clientX, e.clientY);
    };
    const onPointerUp = (e) => {
      if (!isDragging) return;
      isDragging = false;
      if ("releasePointerCapture" in knobEl && e.pointerId !== void 0) {
        try {
          knobEl.releasePointerCapture(e.pointerId);
        } catch (_) {
        }
      }
    };
    knobEl.addEventListener("pointerdown", onPointerDown);
    knobEl.addEventListener("pointermove", onPointerMove);
    knobEl.addEventListener("pointerup", onPointerUp);
    knobEl.addEventListener("pointercancel", onPointerUp);
    knobEl.addEventListener("mousedown", onPointerDown);
    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("mouseup", onPointerUp);
  }
  syncValue();
}
export {
  KnobIsland as default
};
//# sourceMappingURL=knob-NZDMX3JY.js.map
