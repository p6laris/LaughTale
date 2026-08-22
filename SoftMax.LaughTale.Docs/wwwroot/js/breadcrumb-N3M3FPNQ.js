import {
  LucideIcons
} from "./chunk-BAHIOWYT.js";

// ../SoftMax.LaughTale.Client/src/components/breadcrumb.ts
function BreadcrumbIsland(container, props) {
  const items = props.items || [];
  const homeUrl = props.homeUrl || "/";
  const itemsHtml = items.map((item, idx) => {
    const isLast = idx === items.length - 1;
    return `
            <li style="display: flex; align-items: center; gap: 0.5rem;">
                <span style="color: var(--p-surface-400); display: flex; align-items: center;">${LucideIcons.chevronRight}</span>
                ${item.url && !isLast ? `
                    <a href="${item.url}" style="color: var(--p-surface-600); text-decoration: none; font-size: 0.8125rem; font-weight: 500; display: flex; align-items: center; gap: 0.35rem; transition: color 0.15s ease;">
                        ${item.icon ? `<span>${item.icon}</span>` : ""}
                        <span>${item.label}</span>
                    </a>
                ` : `
                    <span style="color: var(--p-surface-900); font-size: 0.8125rem; font-weight: 600; display: flex; align-items: center; gap: 0.35rem;">
                        ${item.icon ? `<span>${item.icon}</span>` : ""}
                        <span>${item.label}</span>
                    </span>
                `}
            </li>
        `;
  }).join("");
  container.innerHTML = `
        <nav class="laughtale-breadcrumb" style="display: block;">
            <ul style="list-style: none; display: flex; align-items: center; gap: 0.5rem; padding: 0; margin: 0;">
                <li>
                    <a href="${homeUrl}" style="color: var(--p-surface-600); display: flex; align-items: center; transition: color 0.15s ease;" title="Home">
                        ${LucideIcons.home}
                    </a>
                </li>
                ${itemsHtml}
            </ul>
        </nav>
    `;
}
export {
  BreadcrumbIsland as default
};
//# sourceMappingURL=breadcrumb-N3M3FPNQ.js.map
