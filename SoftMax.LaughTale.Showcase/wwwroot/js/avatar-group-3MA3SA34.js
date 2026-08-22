// ../SoftMax.LaughTale.Client/src/components/avatar-group.ts
function AvatarGroupIsland(container, props) {
  const max = props.max || 4;
  const visible = props.avatars.slice(0, max);
  const overflowCount = props.avatars.length - max;
  const sizePx = props.size === "sm" ? "1.75rem" : props.size === "lg" ? "2.75rem" : "2.25rem";
  const fontSize = props.size === "sm" ? "0.6875rem" : props.size === "lg" ? "0.9375rem" : "0.75rem";
  const avatarElements = visible.map((av) => {
    const bg = av.bg || "var(--p-surface-800)";
    return `
            <div class="avatar-circle" title="${av.name || av.label || ""}" style="width: ${sizePx}; height: ${sizePx}; border-radius: 50%; border: 2px solid #ffffff; background: ${bg}; color: #ffffff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: ${fontSize}; margin-left: -0.5rem; overflow: hidden; box-shadow: 0 1px 2px rgba(0,0,0,0.1); flex-shrink: 0;">
                ${av.image ? `<img src="${av.image}" alt="${av.name || ""}" style="width: 100%; height: 100%; object-fit: cover;" />` : av.label || "U"}
            </div>
        `;
  }).join("");
  container.innerHTML = `
        <div class="laughtale-avatar-group" style="display: inline-flex; align-items: center; padding-left: 0.5rem;">
            ${avatarElements}
            ${overflowCount > 0 ? `
                <div class="avatar-overflow" style="width: ${sizePx}; height: ${sizePx}; border-radius: 50%; border: 2px solid #ffffff; background: var(--p-surface-200); color: var(--p-surface-700); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: ${fontSize}; margin-left: -0.5rem; box-shadow: 0 1px 2px rgba(0,0,0,0.1); flex-shrink: 0;">
                    +${overflowCount}
                </div>
            ` : ""}
        </div>
    `;
}
export {
  AvatarGroupIsland as default
};
//# sourceMappingURL=avatar-group-3MA3SA34.js.map
