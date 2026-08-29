import {
  LucideIcons
} from "./chunk-XHF3KYSF.js";
import {
  injectIslandStyle
} from "./chunk-3TFPN5JM.js";

// ../SoftMax.LaughTale.Client/src/components/breadcrumb.ts
var BREADCRUMB_CSS = `
.p-breadcrumb-transparent {
    background: transparent !important;
    border: none !important;
    padding: 0 !important;
}
.p-breadcrumb {
    background: var(--p-surface-0, #ffffff);
    border: 1px solid var(--p-border-color, #e2e8f0);
    border-radius: var(--p-border-radius, 8px);
    padding: 0.75rem 1.25rem;
    display: inline-flex;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
}

.p-breadcrumb-list {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.35rem;
    margin: 0;
    padding: 0;
    list-style: none;
}

.p-breadcrumb-item {
    display: inline-flex;
    align-items: center;
}

.p-breadcrumb-item-link {
    color: var(--p-text-muted, #64748b);
    text-decoration: none;
    font-size: 0.875rem;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.25rem 0.4rem;
    border-radius: 4px;
    transition: color 0.15s ease, background-color 0.15s ease;
    cursor: pointer;
}

.p-breadcrumb-item-link:hover {
    color: var(--p-text-color, #0f172a);
    background: var(--p-surface-100, #f1f5f9);
}

.p-breadcrumb-item-current {
    color: var(--p-text-color, #0f172a);
    font-weight: 600;
    cursor: default;
}

.p-breadcrumb-item-current:hover {
    background: transparent;
}

.p-breadcrumb-separator {
    color: var(--p-surface-400, #94a3b8);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8125rem;
    user-select: none;
    padding: 0 0.15rem;
}

.p-breadcrumb-ellipsis {
    color: var(--p-text-muted, #64748b);
    font-weight: 700;
    letter-spacing: 1px;
    padding: 0.15rem 0.35rem;
    border-radius: 4px;
    cursor: pointer;
}

.p-breadcrumb-ellipsis:hover {
    background: var(--p-surface-100, #f1f5f9);
    color: var(--p-text-color, #0f172a);
}

.p-breadcrumb-badge {
    font-size: 0.7rem;
    font-weight: 700;
    padding: 0.15rem 0.45rem;
    border-radius: 9999px;
    line-height: 1;
    display: inline-flex;
    align-items: center;
}

.p-breadcrumb-badge-primary {
    background: rgba(59, 130, 246, 0.12);
    color: var(--p-primary-600, #2563eb);
}

.p-breadcrumb-badge-info {
    background: rgba(14, 165, 233, 0.12);
    color: #0284c7;
}

.p-breadcrumb-badge-success {
    background: rgba(16, 185, 129, 0.12);
    color: #10b981;
}

/* Dark Mode Tokens */
.dark .p-breadcrumb,
[data-theme="dark"] .p-breadcrumb-transparent {
    background: transparent !important;
    border: none !important;
    padding: 0 !important;
}
.p-breadcrumb {
    background: var(--p-surface-900, #0f172a);
    border-color: var(--p-surface-700, #334155);
}

.dark .p-breadcrumb-item-link,
[data-theme="dark"] .p-breadcrumb-item-link {
    color: var(--p-surface-400, #94a3b8);
}

.dark .p-breadcrumb-item-link:hover,
[data-theme="dark"] .p-breadcrumb-item-link:hover {
    color: var(--p-surface-0, #f8fafc);
    background: var(--p-surface-800, #1e293b);
}

.dark .p-breadcrumb-item-current,
[data-theme="dark"] .p-breadcrumb-item-current {
    color: var(--p-surface-0, #f8fafc);
}

.dark .p-breadcrumb-separator,
[data-theme="dark"] .p-breadcrumb-separator {
    color: var(--p-surface-600, #475569);
}
`;
function BreadcrumbIsland(container, props) {
  injectIslandStyle("breadcrumb", BREADCRUMB_CSS);
  const items = props.items || [];
  const homeUrl = props.home?.url || props.homeUrl || "/";
  const homeIcon = props.home?.icon || props.homeIcon || "home";
  const homeLabel = props.home?.label || "";
  const separatorType = props.separator || "chevron";
  function getSeparatorHtml() {
    if (separatorType === "slash") {
      return '<span class="p-breadcrumb-separator" aria-hidden="true">/</span>';
    }
    if (separatorType === "arrow") {
      return '<span class="p-breadcrumb-separator" aria-hidden="true">&gt;</span>';
    }
    return `
            <span class="p-breadcrumb-separator" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </span>
        `;
  }
  function renderItemContent(item) {
    let iconHtml = "";
    if (item.icon) {
      if (item.icon.startsWith("<svg")) {
        iconHtml = item.icon;
      } else if (LucideIcons[item.icon]) {
        iconHtml = LucideIcons[item.icon];
      } else {
        iconHtml = `<span class="${item.icon}"></span>`;
      }
    }
    const badgeHtml = item.badge ? `<span class="p-breadcrumb-badge p-breadcrumb-badge-${item.badgeSeverity || "primary"}">${item.badge}</span>` : "";
    if (item.isEllipsis) {
      return `<span class="p-breadcrumb-ellipsis" title="Show hidden path">...</span>`;
    }
    return `
            ${iconHtml ? `<span style="display:inline-flex; align-items:center;">${iconHtml}</span>` : ""}
            ${item.label ? `<span>${item.label}</span>` : ""}
            ${badgeHtml}
        `;
  }
  const separatorHtml = getSeparatorHtml();
  const itemsHtml = items.map((item, idx) => {
    const isLast = idx === items.length - 1;
    const isCurrent = item.isCurrent || isLast;
    const label = item.label || item.Label || "";
    const url = item.url || item.Url;
    const icon = item.icon || item.Icon;
    const isEllipsis = item.isEllipsis || item.IsEllipsis;
    const badge = item.badge || item.Badge;
    const badgeSeverity = item.badgeSeverity || item.BadgeSeverity;
    const normalizedItem = {
      label,
      url,
      icon,
      isCurrent,
      isEllipsis,
      badge,
      badgeSeverity
    };
    const content = renderItemContent(normalizedItem);
    let inner = "";
    if (isCurrent && !isEllipsis) {
      inner = `<span class="p-breadcrumb-item-link p-breadcrumb-item-current" aria-current="page">${content}</span>`;
    } else if (url && !isEllipsis) {
      inner = `<a href="${url}" class="p-breadcrumb-item-link">${content}</a>`;
    } else {
      inner = `<span class="p-breadcrumb-item-link">${content}</span>`;
    }
    return `
            <li class="p-breadcrumb-separator-wrapper" style="display: inline-flex; align-items: center;">
                ${separatorHtml}
            </li>
            <li class="p-breadcrumb-item">
                ${inner}
            </li>
        `;
  }).join("");
  const homeSvg = LucideIcons.home || '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>';
  container.innerHTML = `
        <nav class="p-breadcrumb p-component" aria-label="Breadcrumb">
            <ol class="p-breadcrumb-list">
                <li class="p-breadcrumb-item">
                    <a href="${homeUrl}" class="p-breadcrumb-item-link" title="Home" aria-label="Home">
                        ${homeSvg}
                        ${homeLabel ? `<span>${homeLabel}</span>` : ""}
                    </a>
                </li>
                ${itemsHtml}
            </ol>
        </nav>
    `;
}
export {
  BreadcrumbIsland as default
};
//# sourceMappingURL=breadcrumb-CN3FVIHY.js.map
