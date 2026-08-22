// ../SoftMax.LaughTale.Client/src/components/slider.ts
function SliderIsland(container, props) {
  const min = props.min !== void 0 ? props.min : 0;
  const max = props.max !== void 0 ? props.max : 100;
  const step = props.step !== void 0 ? props.step : 1;
  let currentValue = props.value !== void 0 ? props.value : min;
  function render() {
    const percent = (currentValue - min) / (max - min) * 100;
    container.innerHTML = `
            <div class="laughtale-slider" style="position: relative; width: 100%; max-width: 320px; padding: 1rem 0; user-select: none;">
                <!-- Track -->
                <div class="slider-track" style="position: relative; height: 6px; border-radius: 3px; background: var(--p-surface-200); cursor: ${props.disabled ? "not-allowed" : "pointer"};">
                    <!-- Active Fill Bar -->
                    <div class="slider-fill" style="position: absolute; top: 0; left: 0; height: 100%; width: ${percent}%; border-radius: 3px; background: var(--p-primary-600);"></div>
                    <!-- Drag Handle -->
                    <div class="slider-handle" style="position: absolute; top: 50%; left: ${percent}%; transform: translate(-50%, -50%); width: 1.125rem; height: 1.125rem; border-radius: 50%; background: #ffffff; border: 2px solid var(--p-primary-600); box-shadow: 0 1px 4px rgba(0,0,0,0.2); cursor: ${props.disabled ? "not-allowed" : "grab"}; transition: transform 0.1s ease;"></div>
                </div>

                <div style="display: flex; justify-content: space-between; margin-top: 0.5rem; font-size: 0.75rem; color: var(--p-surface-500); font-family: var(--p-font-mono);">
                    <span>${min}</span>
                    <span style="font-weight: 700; color: var(--p-primary-600);">${currentValue}</span>
                    <span>${max}</span>
                </div>
            </div>
        `;
    if (props.disabled) return;
    const track = container.querySelector(".slider-track");
    const updateFromPointer = (e) => {
      const rect = track.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      let ratio = (clientX - rect.left) / rect.width;
      ratio = Math.max(0, Math.min(1, ratio));
      let val = min + ratio * (max - min);
      val = Math.round(val / step) * step;
      currentValue = Math.max(min, Math.min(max, val));
      render();
      syncValue();
    };
    track.addEventListener("click", updateFromPointer);
    const handle = container.querySelector(".slider-handle");
    const onDrag = (e) => updateFromPointer(e);
    const onStop = () => {
      window.removeEventListener("mousemove", onDrag);
      window.removeEventListener("mouseup", onStop);
      window.removeEventListener("touchmove", onDrag);
      window.removeEventListener("touchend", onStop);
    };
    handle.addEventListener("mousedown", () => {
      window.addEventListener("mousemove", onDrag);
      window.addEventListener("mouseup", onStop);
    });
    handle.addEventListener("touchstart", () => {
      window.addEventListener("touchmove", onDrag);
      window.addEventListener("touchend", onStop);
    });
  }
  function syncValue() {
    if (props.targetInputName) {
      let hidden = document.querySelector(`input[name="${props.targetInputName}"]`);
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
  render();
}
export {
  SliderIsland as default
};
//# sourceMappingURL=slider-ZAWWIPRL.js.map
