// ../SoftMax.LaughTale.Client/src/components/skeleton.ts
function SkeletonIsland(container, props) {
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
//# sourceMappingURL=skeleton-U23FQIHU.js.map
