import {
  LucideIcons
} from "./chunk-PRHJLIKH.js";
import {
  injectIslandStyle
} from "./chunk-3TFPN5JM.js";

// ../SoftMax.LaughTale.Client/src/components/dock.ts
var CSS = `
[data-theme="dark"] .laughtale-dock {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .dock-item-btn {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
`;
function DockIsland(container, props) {
  injectIslandStyle("dock", CSS);
  const items = props.items || [
    { label: "Overview", icon: "compass", url: "/" },
    { label: "Dashboard", icon: "bar-chart", url: "/dashboard" },
    { label: "Directives", icon: "sliders", url: "/enterprise" },
    { label: "Docs", icon: "file-text", url: "/doc/01-getting-started" },
    { label: "Theme Studio", icon: "palette", action: "open-studio" }
  ];
  container.innerHTML = `
        <div class="laughtale-dock" style="display: inline-flex; align-items: center; gap: 0.75rem; background: rgba(255, 255, 255, 0.85); dark:bg-slate-900; backdrop-filter: blur(12px); border: 1px solid var(--p-border-color); border-radius: 9999px; padding: 0.5rem 1rem; box-shadow: var(--p-shadow-lg);">
            ${items.map((it) => {
    const iconSvg = LucideIcons[it.icon] || LucideIcons.terminal;
    return `
                    <button type="button" 
                            class="dock-item-btn" 
                            data-action="${it.action || ""}" 
                            data-url="${it.url || ""}"
                            title="${it.label}"
                            style="width: 2.75rem; height: 2.75rem; border-radius: 9999px; border: 1px solid var(--p-border-color); background: var(--p-surface-0); color: var(--p-surface-700); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.2s cubic-bezier(0.2, 0, 0, 1), box-shadow 0.2s ease;">
                        ${iconSvg}
                    </button>
                `;
  }).join("")}
        </div>
    `;
  container.querySelectorAll(".dock-item-btn").forEach((btn) => {
    btn.addEventListener("mouseenter", () => {
      btn.style.transform = "scale(1.3) translateY(-4px)";
      btn.style.boxShadow = "0 10px 15px -3px rgba(0,0,0,0.15)";
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "none";
      btn.style.boxShadow = "none";
    });
    btn.addEventListener("click", () => {
      const url = btn.getAttribute("data-url");
      const action = btn.getAttribute("data-action");
      if (url) window.location.href = url;
      else if (action === "open-studio") document.dispatchEvent(new CustomEvent("studio:open"));
    });
  });
}
export {
  DockIsland as default
};
//# sourceMappingURL=dock-EZLMG2HU.js.map
