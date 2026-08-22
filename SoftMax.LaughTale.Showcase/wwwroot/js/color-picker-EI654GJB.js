// ../SoftMax.LaughTale.Client/src/components/color-picker.ts
var DEFAULT_PRESETS = [
  "#10b981",
  "#059669",
  "#3b82f6",
  "#2563eb",
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#f43f5e",
  "#ef4444",
  "#f59e0b",
  "#14b8a6",
  "#06b6d4",
  "#64748b",
  "#1e293b",
  "#000000"
];
function ColorPickerIsland(container, props) {
  let currentColor = props.value || "#10b981";
  let isOpen = false;
  const swatchesHtml = DEFAULT_PRESETS.map((c) => `
        <button type="button" 
                class="color-swatch-btn" 
                data-color="${c}" 
                title="${c}"
                style="width: 1.75rem; height: 1.75rem; border-radius: 4px; border: ${c.toLowerCase() === currentColor.toLowerCase() ? "2px solid #ffffff" : "1px solid rgba(0,0,0,0.15)"}; background: ${c}; cursor: pointer; box-shadow: ${c.toLowerCase() === currentColor.toLowerCase() ? "0 0 0 2px var(--p-primary-600)" : "none"}; transition: transform 0.15s ease, box-shadow 0.15s ease;">
        </button>
    `).join("");
  container.innerHTML = `
        <div class="laughtale-colorpicker" style="position: relative; display: inline-flex; align-items: center; gap: 0.625rem; font-family: var(--p-font-family, inherit);">
            <!-- Color Swatch Trigger Button -->
            <button type="button" 
                    class="colorpicker-trigger-btn" 
                    ${props.disabled ? "disabled" : ""} 
                    style="width: 2.25rem; height: 2.25rem; border-radius: var(--p-border-radius); border: 2px solid var(--p-surface-200); background: ${currentColor}; cursor: ${props.disabled ? "not-allowed" : "pointer"}; box-shadow: var(--p-shadow-sm); transition: transform 0.15s ease, border-color 0.15s ease; padding: 0; outline: none;">
            </button>
            <span class="colorpicker-hex-label" style="font-family: monospace; font-size: 0.8125rem; font-weight: 600; color: var(--p-surface-800);">${currentColor.toUpperCase()}</span>

            <!-- Palette Popover -->
            <div class="colorpicker-palette-overlay" style="display: none; position: absolute; top: calc(100% + 8px); left: 0; z-index: 600; background: var(--p-surface-0); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg); box-shadow: var(--p-shadow-lg); padding: 0.875rem; width: 220px; box-sizing: border-box;">
                <div style="font-size: 0.6875rem; font-weight: 700; color: var(--p-surface-500); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.625rem;">Palette Swatches</div>
                
                <!-- 5-Column Swatch Grid -->
                <div class="colorpicker-swatches-grid" style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; margin-bottom: 0.875rem; justify-items: center;">
                    ${swatchesHtml}
                </div>

                <!-- Custom Hex & Native Spectrum Picker -->
                <div style="display: flex; align-items: center; gap: 0.5rem; width: 100%; box-sizing: border-box;">
                    <!-- Stylized Native Color Picker Button -->
                    <div style="position: relative; width: 2rem; height: 2rem; flex-shrink: 0; border-radius: var(--p-border-radius); border: 1px solid var(--p-border-color); overflow: hidden; background: ${currentColor}; cursor: pointer;">
                        <input type="color" class="color-native-input" value="${currentColor}" style="position: absolute; inset: -4px; width: 200%; height: 200%; opacity: 0; cursor: pointer; border: none; padding: 0;" />
                    </div>

                    <!-- Hex Text Input -->
                    <div style="flex: 1; min-width: 0; display: flex; align-items: center; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); background: var(--p-surface-50); padding: 0 0.5rem; box-sizing: border-box;">
                        <span style="font-size: 0.75rem; color: var(--p-surface-400); font-family: monospace; user-select: none;">#</span>
                        <input type="text" 
                               class="color-hex-input" 
                               value="${currentColor.replace("#", "")}" 
                               maxlength="6" 
                               placeholder="10b981"
                               style="width: 100%; min-width: 0; padding: 0.35rem 0.25rem; font-family: monospace; font-size: 0.8125rem; color: var(--p-text-color); border: none; outline: none; background: transparent; box-sizing: border-box;" />
                    </div>
                </div>
            </div>
        </div>
    `;
  const triggerBtn = container.querySelector(".colorpicker-trigger-btn");
  const hexLabel = container.querySelector(".colorpicker-hex-label");
  const overlay = container.querySelector(".colorpicker-palette-overlay");
  const nativeInput = container.querySelector(".color-native-input");
  const hexInput = container.querySelector(".color-hex-input");
  const nativePreview = nativeInput.parentElement;
  function applyColor(newColor, fromHexInput = false) {
    currentColor = newColor.startsWith("#") ? newColor : `#${newColor}`;
    triggerBtn.style.backgroundColor = currentColor;
    nativePreview.style.backgroundColor = currentColor;
    hexLabel.textContent = currentColor.toUpperCase();
    nativeInput.value = currentColor;
    if (!fromHexInput) {
      hexInput.value = currentColor.replace("#", "");
    }
    container.querySelectorAll(".color-swatch-btn").forEach((btn) => {
      const btnColor = btn.getAttribute("data-color") || "";
      const isMatch = btnColor.toLowerCase() === currentColor.toLowerCase();
      btn.style.border = isMatch ? "2px solid #ffffff" : "1px solid rgba(0,0,0,0.15)";
      btn.style.boxShadow = isMatch ? "0 0 0 2px var(--p-primary-600)" : "none";
    });
    syncValue();
  }
  function toggleOverlay(show) {
    isOpen = show !== void 0 ? show : !isOpen;
    overlay.style.display = isOpen ? "block" : "none";
  }
  if (!props.disabled) {
    triggerBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleOverlay();
    });
    container.querySelectorAll(".color-swatch-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const color = btn.getAttribute("data-color");
        applyColor(color);
        toggleOverlay(false);
      });
    });
    nativeInput.addEventListener("input", () => {
      applyColor(nativeInput.value);
    });
    hexInput.addEventListener("input", () => {
      const raw = hexInput.value.trim().replace("#", "");
      if (/^[0-9A-Fa-f]{6}$/.test(raw) || /^[0-9A-Fa-f]{3}$/.test(raw)) {
        applyColor(`#${raw}`, true);
      }
    });
    document.addEventListener("click", (e) => {
      if (!container.contains(e.target)) {
        toggleOverlay(false);
      }
    });
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
      hidden.value = currentColor;
    }
    container.dispatchEvent(new CustomEvent("color:change", {
      bubbles: true,
      detail: { value: currentColor }
    }));
  }
  syncValue();
}
export {
  ColorPickerIsland as default
};
//# sourceMappingURL=color-picker-EI654GJB.js.map
