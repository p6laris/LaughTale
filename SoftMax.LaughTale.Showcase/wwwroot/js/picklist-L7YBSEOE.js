import {
  useAutoAnimate
} from "./chunk-P6OQD35U.js";
import {
  LucideIcons
} from "./chunk-BWRILNJC.js";
import {
  injectIslandStyle
} from "./chunk-3TFPN5JM.js";

// ../SoftMax.LaughTale.Client/src/components/picklist.ts
var CSS = `
[data-theme="dark"] .laughtale-picklist {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .picklist-source-list {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .picklist-item {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .source-item {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .btn-move-to-target {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .btn-move-all-to-target {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .btn-move-to-source {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .btn-move-all-to-source {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .picklist-target-list {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .target-item {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
`;
function PickListIsland(container, props) {
  injectIslandStyle("picklist", CSS);
  let sourceList = props.source ? [...props.source] : [
    { id: "1", name: "Identity & Access Manager" },
    { id: "2", name: "Audit Compliance Engine" },
    { id: "3", name: "Rate Limiter Gateway" }
  ];
  let targetList = props.target ? [...props.target] : [
    { id: "4", name: "Zero-Trust HSM Validator" }
  ];
  let selectedSource = /* @__PURE__ */ new Set();
  let selectedTarget = /* @__PURE__ */ new Set();
  function render() {
    container.innerHTML = `
            <div class="laughtale-picklist" style="display: flex; align-items: center; gap: 1rem; width: 100%; max-width: 680px; font-family: var(--p-font-family, inherit);">
                <!-- Source Box -->
                <div style="flex: 1; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg); background: var(--p-surface-0); overflow: hidden; display: flex; flex-direction: column;">
                    <div style="padding: 0.625rem 0.875rem; background: var(--p-surface-50); border-bottom: 1px solid var(--p-border-color); font-size: 0.75rem; font-weight: 700; color: var(--p-surface-600); text-transform: uppercase;">
                        ${props.sourceHeader || "Available"} (${sourceList.length})
                    </div>
                    <div class="picklist-source-list" style="height: 180px; overflow-y: auto; padding: 0.25rem 0;">
                        ${sourceList.map((it) => `
                            <div class="picklist-item source-item ${selectedSource.has(it.id) ? "active" : ""}" data-id="${it.id}" style="padding: 0.45rem 0.75rem; cursor: pointer; font-size: 0.8125rem; background: ${selectedSource.has(it.id) ? "var(--p-primary-50)" : "transparent"}; color: ${selectedSource.has(it.id) ? "var(--p-primary-700)" : "var(--p-text-color)"}; font-weight: ${selectedSource.has(it.id) ? "600" : "normal"}; transition: all 0.15s ease;">
                                ${it.name}
                            </div>
                        `).join("")}
                    </div>
                </div>

                <!-- Transfer Action Buttons -->
                <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                    <button type="button" class="btn-move-to-target p-button p-button-secondary" style="padding: 0.45rem; justify-content: center;" title="Move to Selected">
                        ${LucideIcons.chevronRight}
                    </button>
                    <button type="button" class="btn-move-all-to-target p-button p-button-secondary" style="padding: 0.45rem; justify-content: center;" title="Move All to Selected">
                        \xBB
                    </button>
                    <button type="button" class="btn-move-to-source p-button p-button-secondary" style="padding: 0.45rem; justify-content: center;" title="Move to Available">
                        ${LucideIcons.chevronLeft}
                    </button>
                    <button type="button" class="btn-move-all-to-source p-button p-button-secondary" style="padding: 0.45rem; justify-content: center;" title="Move All to Available">
                        \xAB
                    </button>
                </div>

                <!-- Target Box -->
                <div style="flex: 1; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg); background: var(--p-surface-0); overflow: hidden; display: flex; flex-direction: column;">
                    <div style="padding: 0.625rem 0.875rem; background: var(--p-surface-50); border-bottom: 1px solid var(--p-border-color); font-size: 0.75rem; font-weight: 700; color: var(--p-surface-600); text-transform: uppercase;">
                        ${props.targetHeader || "Selected"} (${targetList.length})
                    </div>
                    <div class="picklist-target-list" style="height: 180px; overflow-y: auto; padding: 0.25rem 0;">
                        ${targetList.map((it) => `
                            <div class="picklist-item target-item ${selectedTarget.has(it.id) ? "active" : ""}" data-id="${it.id}" style="padding: 0.45rem 0.75rem; cursor: pointer; font-size: 0.8125rem; background: ${selectedTarget.has(it.id) ? "var(--p-primary-50)" : "transparent"}; color: ${selectedTarget.has(it.id) ? "var(--p-primary-700)" : "var(--p-text-color)"}; font-weight: ${selectedTarget.has(it.id) ? "600" : "normal"}; transition: all 0.15s ease;">
                                ${it.name}
                            </div>
                        `).join("")}
                    </div>
                </div>
            </div>
        `;
    const srcEl = container.querySelector(".picklist-source-list");
    const tgtEl = container.querySelector(".picklist-target-list");
    useAutoAnimate(srcEl, { duration: 200 });
    useAutoAnimate(tgtEl, { duration: 200 });
    bindEvents();
  }
  function bindEvents() {
    container.querySelectorAll(".source-item").forEach((el) => {
      el.addEventListener("click", () => {
        const id = el.getAttribute("data-id");
        if (selectedSource.has(id)) selectedSource.delete(id);
        else selectedSource.add(id);
        render();
      });
    });
    container.querySelectorAll(".target-item").forEach((el) => {
      el.addEventListener("click", () => {
        const id = el.getAttribute("data-id");
        if (selectedTarget.has(id)) selectedTarget.delete(id);
        else selectedTarget.add(id);
        render();
      });
    });
    container.querySelector(".btn-move-to-target")?.addEventListener("click", () => {
      const moving = sourceList.filter((it) => selectedSource.has(it.id));
      targetList = [...targetList, ...moving];
      sourceList = sourceList.filter((it) => !selectedSource.has(it.id));
      selectedSource.clear();
      render();
      syncValues();
    });
    container.querySelector(".btn-move-all-to-target")?.addEventListener("click", () => {
      targetList = [...targetList, ...sourceList];
      sourceList = [];
      selectedSource.clear();
      render();
      syncValues();
    });
    container.querySelector(".btn-move-to-source")?.addEventListener("click", () => {
      const moving = targetList.filter((it) => selectedTarget.has(it.id));
      sourceList = [...sourceList, ...moving];
      targetList = targetList.filter((it) => !selectedTarget.has(it.id));
      selectedTarget.clear();
      render();
      syncValues();
    });
    container.querySelector(".btn-move-all-to-source")?.addEventListener("click", () => {
      sourceList = [...sourceList, ...targetList];
      targetList = [];
      selectedTarget.clear();
      render();
      syncValues();
    });
  }
  function syncValues() {
    if (props.targetInputName) {
      let hidden = container.querySelector(`input[name="${props.targetInputName}"]`);
      if (!hidden) {
        hidden = document.createElement("input");
        hidden.type = "hidden";
        hidden.name = props.targetInputName;
        container.appendChild(hidden);
      }
      hidden.value = JSON.stringify(targetList.map((it) => it.id));
    }
    container.dispatchEvent(new CustomEvent("picklist:change", {
      bubbles: true,
      detail: { source: sourceList, target: targetList }
    }));
  }
  render();
  syncValues();
}
export {
  PickListIsland as default
};
//# sourceMappingURL=picklist-L7YBSEOE.js.map
