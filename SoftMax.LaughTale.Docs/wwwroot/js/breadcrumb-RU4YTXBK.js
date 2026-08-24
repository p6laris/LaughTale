import {
  LucideIcons
} from "./chunk-YLRV6FTK.js";
import {
  injectIslandStyle
} from "./chunk-3TFPN5JM.js";

// ../SoftMax.LaughTale.Client/src/components/breadcrumb.ts
var CSS = `
[data-theme="dark"] .laughtale-breadcrumb {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
`;
function BreadcrumbIsland(container, props) {
  injectIslandStyle("breadcrumb", CSS);
  const items = props.items || [];
  const homeUrl = props.homeUrl || "/";
  const itemsHtml = items.map((item, idx) => {
    const isLast = idx === items.length - 1;
    const label = item.label || item.Label || "";
    const url = item.url || item.Url || "";
    const icon = item.icon || item.Icon || "";
    return `
            <li style="display: flex; align-items: center; gap: 0.5rem;">
                <span style="color: var(--p-text-muted); display: flex; align-items: center;">${LucideIcons.chevronRight}</span>
                ${url && !isLast ? `
                    <a href="${url}" style="color: var(--p-text-muted); text-decoration: none; font-size: 0.8125rem; font-weight: 500; display: flex; align-items: center; gap: 0.35rem; transition: color 0.15s ease;">
                        ${icon ? `<span>${icon}</span>` : ""}
                        <span>${label}</span>
                    </a>
                ` : `
                    <span style="color: var(--p-text-color); font-size: 0.8125rem; font-weight: 600; display: flex; align-items: center; gap: 0.35rem;">
                        ${icon ? `<span>${icon}</span>` : ""}
                        <span>${label}</span>
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
//# sourceMappingURL=breadcrumb-RU4YTXBK.js.map
