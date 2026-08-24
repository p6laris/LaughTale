import {
  LucideIcons
} from "./chunk-YLRV6FTK.js";
import {
  injectIslandStyle
} from "./chunk-3TFPN5JM.js";

// ../SoftMax.LaughTale.Client/src/components/sidebar.ts
function SidebarIsland(container, props) {
  let collapsed = props.collapsed || false;
  let searchQuery = "";
  const items = props.items || [];
  const position = props.position || "left";
  const title = props.title || "Navigation";
  const searchable = props.searchable !== false;
  const expandedMap = {};
  function initExpanded(itemList) {
    itemList.forEach((item) => {
      const label = item.label || item.Label || "";
      const isExpanded = item.expanded !== false && item.Expanded !== false;
      if (label && expandedMap[label] === void 0) {
        expandedMap[label] = isExpanded;
      }
      const children = item.items || item.Items;
      if (Array.isArray(children)) {
        initExpanded(children);
      }
    });
  }
  initExpanded(items);
  injectIslandStyle("sidebar", `
        .laughtale-sidebar {
            display: flex;
            flex-direction: column;
            background: var(--p-surface-0);
            border-right: 1px solid var(--p-border-color);
            width: 270px;
            min-width: 270px;
            height: 100vh;
            position: sticky;
            top: 0;
            left: 0;
            transition: width 200ms cubic-bezier(0.4, 0, 0.2, 1), min-width 200ms cubic-bezier(0.4, 0, 0.2, 1);
            font-family: var(--p-font-family, inherit);
            overflow: hidden;
            border-radius: 0;
            box-shadow: none;
            z-index: 40;
        }
        .laughtale-sidebar.collapsed {
            width: 68px;
            min-width: 68px;
        }
        .laughtale-sidebar.right {
            border-right: none;
            border-left: 1px solid var(--p-border-color);
        }
        .sidebar-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 1rem 1.125rem;
            border-bottom: 1px solid var(--p-border-color);
            gap: 0.5rem;
            height: 60px;
            box-sizing: border-box;
            flex-shrink: 0;
        }
        .sidebar-search-box {
            padding: 0.625rem 0.875rem 0.25rem;
            flex-shrink: 0;
        }
        .sidebar-search-input {
            width: 100%;
            background: var(--p-surface-50);
            border: 1px solid var(--p-border-color);
            border-radius: var(--p-border-radius);
            padding: 0.4rem 0.65rem;
            font-size: 0.775rem;
            color: var(--p-text-color);
            outline: none;
            transition: border-color 0.15s ease, background 0.15s ease;
            box-sizing: border-box;
        }
        .sidebar-search-input:focus {
            border-color: var(--p-primary-500);
            background: var(--p-surface-0);
        }
        .sidebar-toggle {
            background: transparent;
            border: none;
            color: var(--p-text-muted);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: var(--p-border-radius);
            width: 1.85rem;
            height: 1.85rem;
            transition: background 150ms ease, color 150ms ease;
            flex-shrink: 0;
        }
        .sidebar-toggle:hover {
            background: var(--p-surface-100);
            color: var(--p-text-color);
        }
        .sidebar-body {
            flex: 1;
            overflow-y: auto;
            overflow-x: hidden;
            padding: 0.5rem 0.6rem;
            display: flex;
            flex-direction: column;
            gap: 0.2rem;
            scrollbar-width: thin;
            scrollbar-color: var(--p-surface-300) transparent;
        }
        .sidebar-body::-webkit-scrollbar {
            width: 4px;
        }
        .sidebar-body::-webkit-scrollbar-track {
            background: transparent;
        }
        .sidebar-body::-webkit-scrollbar-thumb {
            background: var(--p-surface-300);
            border-radius: 4px;
        }
        .sidebar-tree-menu {
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            flex-direction: column;
            gap: 0.2rem;
            width: 100%;
        }
        .sidebar-item {
            display: flex;
            align-items: center;
            padding: 0.45rem 0.65rem;
            color: var(--p-text-color);
            text-decoration: none;
            border-radius: var(--p-border-radius);
            transition: background 150ms ease, color 150ms ease;
            gap: 0.6rem;
            font-size: 0.8125rem;
            font-weight: 500;
            white-space: nowrap;
            overflow: hidden;
            cursor: pointer;
            user-select: none;
            border: 1px solid transparent;
            box-sizing: border-box;
        }
        .sidebar-item:hover {
            background: var(--p-surface-100);
        }
        .sidebar-item.active {
            background: var(--p-primary-50);
            color: var(--p-primary-700);
            font-weight: 700;
            border-color: var(--p-primary-200);
        }
        .dark .sidebar-item.active {
            background: rgba(16, 185, 129, 0.15);
            color: #6ee7b7;
            border-color: rgba(16, 185, 129, 0.3);
        }
        .sidebar-group-container {
            width: 100%;
            list-style: none;
        }
        .sidebar-group-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.5rem 0.65rem;
            color: var(--p-text-muted);
            font-size: 0.725rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.04em;
            cursor: pointer;
            border-radius: var(--p-border-radius);
            transition: background 150ms ease, color 150ms ease;
            box-sizing: border-box;
        }
        .sidebar-group-header:hover {
            background: var(--p-surface-100);
            color: var(--p-text-color);
        }
        .sidebar-group-chevron {
            display: flex;
            align-items: center;
            transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            color: var(--p-text-muted);
        }
        .sidebar-group-chevron.expanded {
            transform: rotate(90deg);
        }
        .sidebar-sub-tree {
            list-style: none;
            padding: 0 0 0 0.75rem;
            margin: 0.15rem 0 0.35rem 0.35rem;
            border-left: 1px solid var(--p-border-color);
            display: flex;
            flex-direction: column;
            gap: 0.15rem;
        }
        .sidebar-badge {
            margin-left: auto;
            font-size: 0.6875rem;
            font-weight: 700;
            padding: 0.1rem 0.4rem;
            border-radius: 9999px;
            background: var(--p-surface-200);
            color: var(--p-text-color);
        }
        .collapsed .sidebar-body {
            padding: 0.5rem 0 !important;
            align-items: center;
        }
        .collapsed .sidebar-tree-menu {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .collapsed .sidebar-group-container {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .collapsed .sidebar-item-label, 
        .collapsed .sidebar-header-title,
        .collapsed .sidebar-search-box,
        .collapsed .sidebar-badge,
        .collapsed .sidebar-group-chevron {
            display: none !important;
        }
        .collapsed .sidebar-header {
            justify-content: center;
            padding: 0;
        }
        .collapsed .sidebar-header .sidebar-brand-group {
            display: none !important;
        }
        .collapsed .sidebar-header .sidebar-toggle {
            margin: 0 auto;
        }
        .collapsed .sidebar-group-header {
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            width: 44px;
            height: 38px;
            margin: 0.5rem auto 0.25rem;
            padding: 0.5rem 0 0 !important;
            border-top: 1px solid var(--p-border-color);
            cursor: pointer;
            box-sizing: border-box;
        }
        .collapsed .sidebar-group-header > div {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 0 !important;
            width: 100% !important;
        }
        .collapsed .sidebar-group-header span.sidebar-group-icon {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            width: 20px !important;
            height: 20px !important;
        }
        .collapsed .sidebar-sub-tree {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            border-left: none !important;
            list-style: none !important;
            gap: 0.2rem;
        }
        .collapsed .sidebar-sub-tree > li {
            display: flex !important;
            justify-content: center !important;
            width: 100% !important;
        }
        .collapsed .sidebar-item {
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            padding: 0 !important;
            width: 44px !important;
            height: 44px !important;
            margin: 0 auto !important;
            box-sizing: border-box !important;
            border-radius: var(--p-border-radius);
        }
        .collapsed .sidebar-item span.sidebar-icon {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            width: 20px !important;
            height: 20px !important;
        }
        .collapsed .sidebar-item:hover {
            background: var(--p-surface-100);
        }
    `);
  function renderNode(item, level = 0) {
    const label = item.label || item.Label || item.title || item.Title || "";
    const url = item.url || item.Url || "#";
    const icon = item.icon || item.Icon || "";
    const active = item.active || item.Active || false;
    const badge = item.badge || item.Badge || "";
    const children = item.items || item.Items;
    const hasChildren = Array.isArray(children) && children.length > 0;
    const isExpanded = expandedMap[label] ?? true;
    const iconSvg = icon && LucideIcons[icon] ? LucideIcons[icon] : icon.startsWith("<svg") ? icon : "";
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchesSelf = label.toLowerCase().includes(q);
      const matchesChild = hasChildren && children.some((c) => (c.label || c.Label || "").toLowerCase().includes(q));
      if (!matchesSelf && !matchesChild) return "";
    }
    if (hasChildren) {
      return `
                <li class="sidebar-group-container" data-label="${label}">
                    <div class="sidebar-group-header" data-group-toggle="${label}" title="${label}">
                        <div style="display: flex; align-items: center; gap: 0.45rem;">
                            ${iconSvg ? `<span class="sidebar-group-icon" style="display: flex; width: 16px; height: 16px; color: var(--p-primary-600);">${iconSvg}</span>` : ""}
                            <span class="sidebar-item-label">${label}</span>
                        </div>
                        <span class="sidebar-group-chevron ${isExpanded ? "expanded" : ""}">
                            ${LucideIcons.chevronRight}
                        </span>
                    </div>
                    <ul class="sidebar-sub-tree" style="display: ${isExpanded ? "flex" : "none"};">
                        ${children.map((child) => renderNode(child, level + 1)).join("")}
                    </ul>
                </li>
            `;
    }
    return `
            <li>
                <a href="${url}" class="sidebar-item ${active ? "active" : ""}" data-sidebar-link="${url}" title="${label}">
                    ${iconSvg ? `<span class="sidebar-icon" style="display: flex; width: 18px; height: 18px; color: ${active ? "var(--p-primary-600)" : "var(--p-text-muted)"}; flex-shrink: 0;">${iconSvg}</span>` : ""}
                    <span class="sidebar-item-label">${label}</span>
                    ${badge ? `<span class="sidebar-badge">${badge}</span>` : ""}
                </a>
            </li>
        `;
  }
  function render() {
    container.innerHTML = `
            <div class="laughtale-sidebar ${collapsed ? "collapsed" : ""} ${position}">
                <div class="sidebar-header">
                    <div class="sidebar-brand-group" style="display: flex; align-items: center; gap: 0.6rem; overflow: hidden;">
                        <span style="color: var(--p-primary-600); display: flex; flex-shrink: 0;">${LucideIcons.layers}</span>
                        <span class="sidebar-header-title" style="font-weight: 800; font-size: 0.9rem; color: var(--p-text-color); white-space: nowrap;">${title}</span>
                    </div>
                    <button class="sidebar-toggle" aria-label="Toggle Sidebar" title="Collapse / Expand Sidebar">
                        ${collapsed ? LucideIcons.chevronRight : LucideIcons.chevronLeft}
                    </button>
                </div>

                ${searchable && !collapsed ? `
                    <div class="sidebar-search-box">
                        <input type="text" class="sidebar-search-input" placeholder="Filter components..." value="${searchQuery}" />
                    </div>
                ` : ""}

                <div class="sidebar-body">
                    <ul class="sidebar-tree-menu">
                        ${items.map((item) => renderNode(item)).join("")}
                    </ul>
                </div>
            </div>
        `;
    container.querySelector(".sidebar-toggle")?.addEventListener("click", () => {
      collapsed = !collapsed;
      render();
    });
    const searchInput = container.querySelector(".sidebar-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value;
        const menuEl = container.querySelector(".sidebar-tree-menu");
        if (menuEl) {
          menuEl.innerHTML = items.map((item) => renderNode(item)).join("");
          bindGroupToggles();
        }
      });
    }
    bindGroupToggles();
  }
  function bindGroupToggles() {
    container.querySelectorAll("[data-group-toggle]").forEach((header) => {
      header.addEventListener("click", () => {
        const groupLabel = header.getAttribute("data-group-toggle");
        if (groupLabel) {
          expandedMap[groupLabel] = !expandedMap[groupLabel];
          render();
        }
      });
    });
  }
  render();
}
export {
  SidebarIsland as default
};
//# sourceMappingURL=sidebar-X2STWGIA.js.map
