import {
  injectIslandStyle
} from "./chunk-3TFPN5JM.js";

// ../SoftMax.LaughTale.Client/src/components/tag.ts
var CSS = `
[data-theme="dark"] .laughtale-tag {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
`;
function TagIsland(container, props) {
  injectIslandStyle("tag", CSS);
  const severity = props.severity || "info";
  const isRounded = props.rounded || false;
  let bg = "var(--p-blue-50, #eff6ff)";
  let color = "var(--p-blue-700, #1d4ed8)";
  let border = "var(--p-blue-200, #bfdbfe)";
  if (severity === "success") {
    bg = "var(--p-emerald-50, #ecfdf5)";
    color = "var(--p-emerald-700, #047857)";
    border = "var(--p-emerald-200, #a7f3d0)";
  } else if (severity === "warning") {
    bg = "var(--p-amber-50, #fffbeb)";
    color = "var(--p-amber-700, #b45309)";
    border = "var(--p-amber-200, #fde68a)";
  } else if (severity === "danger") {
    bg = "var(--p-red-50, #fef2f2)";
    color = "var(--p-red-700, #b91c1c)";
    border = "var(--p-red-200, #fecaca)";
  } else if (severity === "secondary") {
    bg = "var(--p-surface-100, #f1f5f9)";
    color = "var(--p-surface-700, #334155)";
    border = "var(--p-surface-200, #e2e8f0)";
  } else if (severity === "contrast") {
    bg = "var(--p-surface-900, #0f172a)";
    color = "var(--p-surface-0, #ffffff)";
    border = "var(--p-surface-950, #020617)";
  }
  container.innerHTML = `
        <span class="laughtale-tag tag-${severity}" style="display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.25rem 0.6rem; font-size: 0.75rem; font-weight: 700; background: ${bg}; color: ${color}; border: 1px solid ${border}; border-radius: ${isRounded ? "9999px" : "var(--p-border-radius)"};">
            ${props.icon ? `<span>${props.icon}</span>` : ""}
            <span>${props.value}</span>
        </span>
    `;
}
export {
  TagIsland as default
};
//# sourceMappingURL=tag-4UVJKKNI.js.map
