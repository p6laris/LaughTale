import {
  LucideIcons
} from "./chunk-PRHJLIKH.js";
import {
  injectIslandStyle
} from "./chunk-3TFPN5JM.js";

// ../SoftMax.LaughTale.Client/src/components/input-password.ts
var CSS = `
[data-theme="dark"] .password-input {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .toggle-mask-btn {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .password-meter-wrap {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
`;
function InputPasswordIsland(container, props) {
  injectIslandStyle("input-password", CSS);
  let isMasked = true;
  let currentPassword = "";
  function calculateStrength(pwd) {
    if (!pwd) return { score: 0, label: "", color: "transparent", width: "0%" };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    if (score <= 1) return { score: 1, label: "Weak", color: "#ef4444", width: "33%" };
    if (score <= 3) return { score: 2, label: "Medium", color: "#f59e0b", width: "66%" };
    return { score: 3, label: "Strong", color: "#10b981", width: "100%" };
  }
  container.innerHTML = `
        <div class="laughtale-password" style="display: flex; flex-direction: column; gap: 0.5rem; width: 100%; max-width: 340px;">
            <div style="display: flex; align-items: center; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); background: var(--p-surface-0); overflow: hidden; padding-right: 0.5rem;">
                <input type="password" 
                       class="password-input" 
                       value="" 
                       placeholder="${props.placeholder || "Enter password..."}" 
                       ${props.disabled ? "disabled" : ""} 
                       style="flex: 1; padding: 0.5rem 0.75rem; border: none; outline: none; background: transparent; font-size: 0.875rem; color: var(--p-text-color);" />
                
                ${props.toggleMask !== false ? `
                    <button type="button" class="toggle-mask-btn" style="border: none; background: transparent; color: var(--p-surface-400); cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 0.25rem;">
                        ${LucideIcons.eye}
                    </button>
                ` : ""}
            </div>

            ${props.showMeter !== false ? `
                <div class="password-meter-wrap" style="display: none; flex-direction: column; gap: 0.25rem;">
                    <div style="height: 4px; border-radius: 2px; background: var(--p-surface-200); overflow: hidden;">
                        <div class="password-meter-bar" style="height: 100%; width: 0%; background: transparent; transition: all 0.3s ease;"></div>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.6875rem; font-weight: 600;">
                        <span style="color: var(--p-surface-500);">Strength</span>
                        <span class="password-meter-label" style="color: var(--p-surface-500);"></span>
                    </div>
                </div>
            ` : ""}
        </div>
    `;
  const input = container.querySelector(".password-input");
  const toggleBtn = container.querySelector(".toggle-mask-btn");
  const meterWrap = container.querySelector(".password-meter-wrap");
  const meterBar = container.querySelector(".password-meter-bar");
  const meterLabel = container.querySelector(".password-meter-label");
  function updateMeterVisuals() {
    if (!meterWrap || !meterBar || !meterLabel) return;
    if (!currentPassword) {
      meterWrap.style.display = "none";
      return;
    }
    meterWrap.style.display = "flex";
    const meter = calculateStrength(currentPassword);
    meterBar.style.width = meter.width;
    meterBar.style.background = meter.color;
    meterLabel.textContent = meter.label;
    meterLabel.style.color = meter.color;
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
      hidden.value = currentPassword;
    }
    container.dispatchEvent(new CustomEvent("password:change", {
      bubbles: true,
      detail: { value: currentPassword, strength: calculateStrength(currentPassword).label }
    }));
  }
  input.addEventListener("input", () => {
    currentPassword = input.value;
    updateMeterVisuals();
    syncValue();
  });
  toggleBtn?.addEventListener("click", () => {
    isMasked = !isMasked;
    input.type = isMasked ? "password" : "text";
    toggleBtn.innerHTML = isMasked ? LucideIcons.eye : LucideIcons.eyeOff;
    input.focus();
  });
  syncValue();
}
export {
  InputPasswordIsland as default
};
//# sourceMappingURL=input-password-DI4WZT2B.js.map
