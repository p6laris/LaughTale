import {
  injectIslandStyle
} from "./chunk-3TFPN5JM.js";

// ../SoftMax.LaughTale.Client/src/components/skeleton.ts
var CSS = `
[data-theme="dark"] .laughtale-skeleton {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
`;
function SkeletonIsland(container, props) {
  injectIslandStyle("skeleton", CSS);
  const shape = props.shape || "rectangle";
  const width = props.width || "100%";
  const height = props.height || "1.25rem";
  const radius = props.borderRadius || (shape === "circle" ? "50%" : "var(--p-border-radius)");
  container.innerHTML = `
        <div class="laughtale-skeleton" style="width: ${width}; height: ${height}; border-radius: ${radius}; background: linear-gradient(90deg, var(--p-surface-100) 25%, var(--p-surface-200) 50%, var(--p-surface-100) 75%); background-size: 200% 100%; animation: skeletonShimmer 1.5s infinite ease-in-out;"></div>
        <style>
            @@keyframes skeletonShimmer {
                0% { background-position: 200% 0; }
                100% { background-position: -200% 0; }
            }
        </style>
    `;
}
export {
  SkeletonIsland as default
};
//# sourceMappingURL=skeleton-4CLSEMFH.js.map
