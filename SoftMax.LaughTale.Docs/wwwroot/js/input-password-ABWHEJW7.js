import {
  LucideIcons
} from "./chunk-QV6AVE4Z.js";

// ../SoftMax.LaughTale.Client/src/components/input-password.ts
function InputPasswordIsland(container, props) {
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
  function render() {
    const meter = calculateStrength(currentPassword);
    container.innerHTML = `
            <div class="laughtale-password" style="display: flex; flex-direction: column; gap: 0.5rem; width: 100%; max-width: 340px;">
                <div style="display: flex; align-items: center; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); background: var(--p-surface-0); overflow: hidden; padding-right: 0.5rem;">
                    <input type="${isMasked ? "password" : "text"}" 
                           class="password-input" 
                           value="${currentPassword}" 
                           placeholder="${props.placeholder || "Enter password..."}" 
                           ${props.disabled ? "disabled" : ""} 
                           style="flex: 1; padding: 0.5rem 0.75rem; border: none; outline: none; background: transparent; font-size: 0.875rem; color: var(--p-text-color);" />
                    
                    ${props.toggleMask !== false ? `
                        <button type="button" class="toggle-mask-btn" style="border: none; background: transparent; color: var(--p-surface-400); cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 0.25rem;">
                            ${isMasked ? LucideIcons.eye : LucideIcons.eyeOff}
                        </button>
                    ` : ""}
                </div>

                ${props.showMeter !== false && currentPassword ? `
                    <div style="display: flex; flex-direction: column; gap: 0.25rem;">
                        <div style="height: 4px; border-radius: 2px; background: var(--p-surface-200); overflow: hidden;">
                            <div style="height: 100%; width: ${meter.width}; background: ${meter.color}; transition: all 0.3s ease;"></div>
                        </div>
                        <div style="display: flex; justify-content: space-between; font-size: 0.6875rem; color: ${meter.color}; font-weight: 600;">
                            <span>Strength</span>
                            <span>${meter.label}</span>
                        </div>
                    </div>
                ` : ""}
            </div>
        `;
    const input = container.querySelector(".password-input");
    input.addEventListener("input", (e) => {
      currentPassword = e.target.value;
      syncValue();
      if (props.showMeter !== false) render();
    });
    container.querySelector(".toggle-mask-btn")?.addEventListener("click", () => {
      isMasked = !isMasked;
      render();
      const inp = container.querySelector(".password-input");
      inp.focus();
      inp.setSelectionRange(currentPassword.length, currentPassword.length);
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
      hidden.value = currentPassword;
    }
    container.dispatchEvent(new CustomEvent("password:change", {
      bubbles: true,
      detail: { value: currentPassword, strength: calculateStrength(currentPassword).label }
    }));
  }
  render();
}
export {
  InputPasswordIsland as default
};
//# sourceMappingURL=input-password-ABWHEJW7.js.map
