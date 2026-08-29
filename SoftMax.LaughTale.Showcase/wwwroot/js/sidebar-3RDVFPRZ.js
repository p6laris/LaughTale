import {
  LucideIcons
} from "./chunk-XHF3KYSF.js";
import {
  injectIslandStyle
} from "./chunk-3TFPN5JM.js";

// ../SoftMax.LaughTale.Client/src/components/sidebar.ts
var SIDEBAR_CSS = `
/* Layout Container */
.p-sidebar-layout {
    display: flex;
    position: relative;
    width: 100%;
    min-height: 48rem;
    height: 48rem;
    background: var(--p-sidebar-layout-background, var(--p-surface-0, #ffffff));
    overflow: hidden;
    box-sizing: border-box;
    font-family: inherit;
    border-radius: var(--p-border-radius, 8px);
}

.p-sidebar-backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(2px);
    z-index: 90;
    transition: opacity 0.2s ease;
}

/* Sidebar Root */
.p-sidebar {
    display: flex;
    flex-direction: column;
    height: 100%;
    position: relative;
    z-index: 100;
    box-sizing: border-box;
    transition: width 0.22s cubic-bezier(0.4, 0, 0.2, 1), transform 0.22s cubic-bezier(0.4, 0, 0.2, 1);
    flex-shrink: 0;
}

.p-sidebar-aside {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
}

.p-sidebar-panel {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    background: var(--p-sidebar-panel-background, var(--p-surface-0, #ffffff));
    color: var(--p-sidebar-panel-color, var(--p-text-color, #0f172a));
    box-sizing: border-box;
    overflow: hidden;
    position: relative;
}

/* Variants */
.p-sidebar-variant-sidebar {
    border-right: 1px solid var(--p-sidebar-border-color, var(--p-border-color, #e2e8f0));
}
.p-sidebar-side-right.p-sidebar-variant-sidebar {
    border-right: none;
    border-left: 1px solid var(--p-sidebar-border-color, var(--p-border-color, #e2e8f0));
}

.p-sidebar-variant-floating {
    padding: 0.5rem;
}
.p-sidebar-variant-floating .p-sidebar-panel {
    border: 1px solid var(--p-border-color, #e2e8f0);
    border-radius: var(--p-sidebar-panel-floating-border-radius, 10px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
}

.p-sidebar-variant-inset {
    background: var(--p-surface-50, #f8fafc);
    padding: 0.5rem;
}
.p-sidebar-variant-inset .p-sidebar-panel {
    background: transparent;
}

/* Overlay Mode */
.p-sidebar-overlay {
    position: absolute !important;
    top: 0;
    bottom: 0;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
    z-index: 100;
}
.p-sidebar-side-left.p-sidebar-overlay {
    left: 0;
}
.p-sidebar-side-right.p-sidebar-overlay {
    right: 0;
}

/* Collapsed Icon Mode */
.p-sidebar-collapsible-icon.p-sidebar-collapsed {
    width: 3.5rem !important;
}

.p-sidebar-collapsible-icon.p-sidebar-collapsed .p-sidebar-item-label,
.p-sidebar-collapsible-icon.p-sidebar-collapsed .p-sidebar-group-label,
.p-sidebar-collapsible-icon.p-sidebar-collapsed .p-sidebar-menu-badge,
.p-sidebar-collapsible-icon.p-sidebar-collapsed .p-sidebar-submenu-chevron,
.p-sidebar-collapsible-icon.p-sidebar-collapsed .p-sidebar-menu-sub,
.p-sidebar-collapsible-icon.p-sidebar-collapsed .p-sidebar-menu-action,
.p-sidebar-collapsible-icon.p-sidebar-collapsed .p-sidebar-header-label,
.p-sidebar-collapsible-icon.p-sidebar-collapsed .p-sidebar-footer-label {
    display: none !important;
}

.p-sidebar-collapsible-icon.p-sidebar-collapsed .p-sidebar-menu-button {
    justify-content: center !important;
    padding: 0.5rem 0 !important;
}

/* Offcanvas Collapsed Mode */
.p-sidebar-collapsible-offcanvas.p-sidebar-collapsed {
    width: 0 !important;
    transform: translateX(-100%);
}
.p-sidebar-side-right.p-sidebar-collapsible-offcanvas.p-sidebar-collapsed {
    transform: translateX(100%);
}

/* Header, Content, Footer */
.p-sidebar-header {
    padding: var(--p-sidebar-header-padding, 0.65rem 0.75rem);
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    flex-shrink: 0;
    box-sizing: border-box;
}

.p-sidebar-content {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0.5rem 0.65rem;
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
    box-sizing: border-box;
    scrollbar-width: thin;
}

.p-sidebar-footer {
    padding: var(--p-sidebar-footer-padding, 0.65rem 0.75rem);
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    flex-shrink: 0;
    box-sizing: border-box;
}

/* Group */
.p-sidebar-group {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.p-sidebar-group-label {
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--p-sidebar-group-label-color, var(--p-surface-400, #94a3b8));
    padding: 0.35rem 0.5rem;
    user-select: none;
    letter-spacing: 0.02em;
}

/* Menu & Items */
.p-sidebar-menu {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
}

.p-sidebar-menu-item {
    list-style: none;
    margin: 0;
    padding: 0;
    position: relative;
}

.p-sidebar-menu-button {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    width: 100%;
    padding: 0.45rem 0.65rem;
    border-radius: var(--p-border-radius, 6px);
    color: var(--p-sidebar-menu-button-color, var(--p-text-color, #0f172a));
    text-decoration: none;
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 500;
    transition: background-color 0.12s ease, color 0.12s ease;
    box-sizing: border-box;
    text-align: left;
    outline: none;
    position: relative;
}

.p-sidebar-menu-button:hover,
.p-sidebar-menu-button.p-hover {
    background: var(--p-sidebar-menu-button-focus-background, var(--p-surface-100, #f1f5f9));
}

.p-sidebar-menu-button.p-active {
    background: var(--p-surface-100, #f1f5f9);
    color: var(--p-primary-600, #2563eb);
    font-weight: 600;
}

.p-sidebar-menu-button-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.125rem;
    height: 1.125rem;
    flex-shrink: 0;
    color: var(--p-surface-500, #64748b);
}

.p-sidebar-menu-button.p-active .p-sidebar-menu-button-icon {
    color: var(--p-primary-600, #2563eb);
}

.p-sidebar-menu-badge {
    margin-left: auto;
    font-size: 0.7rem;
    font-weight: 700;
    padding: 0.1rem 0.4rem;
    border-radius: 9999px;
    background: var(--p-surface-200, #e2e8f0);
    color: var(--p-surface-700, #334155);
}

.p-sidebar-submenu-chevron {
    margin-left: auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--p-surface-400, #94a3b8);
    transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.p-sidebar-submenu-chevron.p-expanded {
    transform: rotate(180deg);
}

.p-sidebar-menu-action {
    position: absolute;
    right: 0.5rem;
    top: 50%;
    transform: translateY(-50%);
    display: none;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 4px;
    color: var(--p-surface-400, #94a3b8);
    cursor: pointer;
}

.p-sidebar-menu-item:hover .p-sidebar-menu-action {
    display: inline-flex;
}

.p-sidebar-menu-action:hover {
    background: var(--p-surface-200, #e2e8f0);
    color: var(--p-surface-700, #334155);
}

/* Nested Submenu */
.p-sidebar-menu-sub {
    list-style: none;
    margin: 0.15rem 0 0.25rem 1.15rem;
    padding: 0 0 0 0.65rem;
    border-left: 1px solid var(--p-border-color, #e2e8f0);
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
}

.p-sidebar-menu-sub-button {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0.35rem 0.5rem;
    border-radius: var(--p-border-radius, 4px);
    font-size: 0.8125rem;
    color: var(--p-surface-600, #475569);
    text-decoration: none;
    cursor: pointer;
    transition: background-color 0.12s ease, color 0.12s ease;
    border: none;
    background: transparent;
    text-align: left;
}

.p-sidebar-menu-sub-button:hover {
    background: var(--p-surface-100, #f1f5f9);
    color: var(--p-text-color, #0f172a);
}

.p-sidebar-menu-sub-button.p-active {
    font-weight: 600;
    color: var(--p-primary-600, #2563eb);
}

/* Main Area */
.p-sidebar-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
    min-width: 0;
    background: var(--p-surface-50, #f8fafc);
    overflow: hidden;
    position: relative;
}

.p-sidebar-main-header {
    height: 3rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0 1rem;
    border-bottom: 1px solid var(--p-border-color, #e2e8f0);
    background: var(--p-surface-0, #ffffff);
    flex-shrink: 0;
}

.p-sidebar-trigger {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: var(--p-border-radius, 6px);
    border: 1px solid var(--p-border-color, #cbd5e1);
    background: transparent;
    color: var(--p-surface-600, #475569);
    cursor: pointer;
    transition: background-color 0.15s ease, color 0.15s ease;
}

.p-sidebar-trigger:hover {
    background: var(--p-surface-100, #f1f5f9);
    color: var(--p-text-color, #0f172a);
}

/* Dark Mode Tokens */
.dark .p-sidebar-layout,
[data-theme="dark"] .p-sidebar-layout {
    background: var(--p-surface-950, #020617);
}

.dark .p-sidebar-panel,
[data-theme="dark"] .p-sidebar-panel {
    background: var(--p-surface-900, #0f172a);
    color: var(--p-surface-0, #f8fafc);
}

.dark .p-sidebar-variant-sidebar,
[data-theme="dark"] .p-sidebar-variant-sidebar {
    border-color: var(--p-surface-800, #1e293b);
}

.dark .p-sidebar-variant-floating .p-sidebar-panel,
[data-theme="dark"] .p-sidebar-variant-floating .p-sidebar-panel {
    border-color: var(--p-surface-800, #1e293b);
}

.dark .p-sidebar-variant-inset,
[data-theme="dark"] .p-sidebar-variant-inset {
    background: var(--p-surface-950, #020617);
}

.dark .p-sidebar-main,
[data-theme="dark"] .p-sidebar-main {
    background: var(--p-surface-950, #020617);
}

.dark .p-sidebar-main-header,
[data-theme="dark"] .p-sidebar-main-header {
    background: var(--p-surface-900, #0f172a);
    border-color: var(--p-surface-800, #1e293b);
}

.dark .p-sidebar-menu-button,
[data-theme="dark"] .p-sidebar-menu-button {
    color: var(--p-surface-200, #e2e8f0);
}

.dark .p-sidebar-menu-button:hover,
.dark .p-sidebar-menu-button.p-hover,
[data-theme="dark"] .p-sidebar-menu-button:hover,
[data-theme="dark"] .p-sidebar-menu-button.p-hover {
    background: var(--p-surface-800, #1e293b);
    color: var(--p-surface-0, #f8fafc);
}

.dark .p-sidebar-menu-button.p-active,
[data-theme="dark"] .p-sidebar-menu-button.p-active {
    background: var(--p-surface-800, #1e293b);
    color: #60a5fa;
}

.dark .p-sidebar-menu-badge,
[data-theme="dark"] .p-sidebar-menu-badge {
    background: var(--p-surface-800, #1e293b);
    color: var(--p-surface-300, #cbd5e1);
}

.dark .p-sidebar-menu-sub,
[data-theme="dark"] .p-sidebar-menu-sub {
    border-color: var(--p-surface-800, #1e293b);
}

.dark .p-sidebar-menu-sub-button,
[data-theme="dark"] .p-sidebar-menu-sub-button {
    color: var(--p-surface-400, #94a3b8);
}

.dark .p-sidebar-menu-sub-button:hover,
[data-theme="dark"] .p-sidebar-menu-sub-button:hover {
    background: var(--p-surface-800, #1e293b);
    color: var(--p-surface-0, #f8fafc);
}

.dark .p-sidebar-menu-sub-button.p-active,
[data-theme="dark"] .p-sidebar-menu-sub-button.p-active {
    color: #60a5fa;
}
`;
function SidebarIsland(container, props) {
  injectIslandStyle("sidebar", SIDEBAR_CSS);
  const demoType = props.demoType || props.DemoType || "variants";
  let variant = props.variant || props.Variant || "sidebar";
  let collapsible = props.collapsible || props.Collapsible || "icon";
  let side = props.side || props.Side || "left";
  let overlay = props.overlay || props.Overlay || false;
  let openOnHover = props.openOnHover || props.OpenOnHover || false;
  let backdrop = props.backdrop || props.Backdrop || false;
  let isOpen = props.open !== void 0 ? props.open : props.Open !== void 0 ? props.Open : true;
  let width = props.width || props.Width || "16rem";
  const expandedSubmenus = {};
  function getIconSvg(iconName) {
    if (!iconName) return "";
    if (iconName.startsWith("<svg")) return iconName;
    if (LucideIcons[iconName]) return LucideIcons[iconName];
    return "";
  }
  const defaultNavGroups = [
    {
      label: "Navigation",
      items: [
        { icon: "home", label: "Home", isActive: true },
        { icon: "mail", label: "Inbox", badge: "12" },
        { icon: "search", label: "Search" },
        { icon: "bell", label: "Notifications", badge: "3" }
      ]
    },
    {
      label: "Projects",
      items: [
        {
          icon: "barChart3",
          label: "Analytics",
          defaultOpen: true,
          subItems: [
            { label: "Overview", isActive: true },
            { label: "Reports" },
            { label: "Real-time" }
          ]
        },
        { icon: "users", label: "Team" },
        { icon: "calendar", label: "Calendar" },
        {
          icon: "folder",
          label: "Documents",
          subItems: [
            { label: "Shared" },
            { label: "Private" },
            { label: "Archived" }
          ]
        }
      ]
    },
    {
      label: "Billing",
      items: [
        { icon: "creditCard", label: "Payments" },
        { icon: "shoppingCart", label: "Orders" },
        { icon: "star", label: "Subscriptions" }
      ]
    }
  ];
  const groups = props.groups || defaultNavGroups;
  function renderGroupsHtml(groupList) {
    return groupList.map((g, gIdx) => {
      const itemsHtml = g.items.map((it, iIdx) => {
        const subKey = `${gIdx}_${iIdx}`;
        if (it.defaultOpen && expandedSubmenus[subKey] === void 0) {
          expandedSubmenus[subKey] = true;
        }
        const isSubExpanded = !!expandedSubmenus[subKey];
        const hasSubs = Array.isArray(it.subItems) && it.subItems.length > 0;
        const iconSvg = getIconSvg(it.icon);
        let subTreeHtml = "";
        if (hasSubs && isSubExpanded) {
          const subListHtml = it.subItems.map((sub) => `
                        <li class="p-sidebar-menu-sub-item">
                            <button type="button" class="p-sidebar-menu-sub-button ${sub.isActive ? "p-active" : ""}">
                                <span>${sub.label}</span>
                            </button>
                        </li>
                    `).join("");
          subTreeHtml = `<ul class="p-sidebar-menu-sub">${subListHtml}</ul>`;
        }
        const chevronSvg = `<svg class="p-sidebar-submenu-chevron ${isSubExpanded ? "p-expanded" : ""}" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`;
        const ellipsisSvg = `<svg class="p-sidebar-menu-action" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>`;
        return `
                    <li class="p-sidebar-menu-item" data-subkey="${subKey}">
                        <button type="button" class="p-sidebar-menu-button ${it.isActive ? "p-active" : ""}" data-has-subs="${hasSubs}">
                            ${iconSvg ? `<span class="p-sidebar-menu-button-icon">${iconSvg}</span>` : ""}
                            <span class="p-sidebar-item-label">${it.label}</span>
                            ${it.badge !== void 0 ? `<span class="p-sidebar-menu-badge">${it.badge}</span>` : ""}
                            ${hasSubs ? chevronSvg : it.badge === void 0 ? ellipsisSvg : ""}
                        </button>
                        ${subTreeHtml}
                    </li>
                `;
      }).join("");
      return `
                <div class="p-sidebar-group">
                    <div class="p-sidebar-group-label">${g.label}</div>
                    <ul class="p-sidebar-menu">${itemsHtml}</ul>
                </div>
            `;
    }).join("");
  }
  function renderComponent() {
    const sidebarClasses = [
      "p-sidebar",
      `p-sidebar-variant-${variant}`,
      `p-sidebar-collapsible-${collapsible}`,
      `p-sidebar-side-${side}`,
      overlay ? "p-sidebar-overlay" : "",
      !isOpen ? "p-sidebar-collapsed" : ""
    ].filter(Boolean).join(" ");
    const sidebarWidth = isOpen ? width : collapsible === "icon" ? "3.5rem" : "0rem";
    const sidebarHtml = `
            <aside class="${sidebarClasses}" style="width: ${sidebarWidth};" data-sidebar-root>
                <div class="p-sidebar-aside">
                    <div class="p-sidebar-panel">
                        <div class="p-sidebar-header">
                            <ul class="p-sidebar-menu">
                                <li class="p-sidebar-menu-item">
                                    <button type="button" class="p-sidebar-menu-button" style="padding: 0.35rem 0.5rem;">
                                        <div style="display:flex; width:1.5rem; height:1.5rem; border-radius:6px; background: linear-gradient(135deg, #8b5cf6, #4f46e5); color:#fff; align-items:center; justify-content:center; font-weight:700; font-size:0.75rem; flex-shrink:0;">A</div>
                                        <span class="p-sidebar-item-label p-sidebar-header-label" style="font-weight: 700; font-size: 0.875rem;">Acme Inc</span>
                                    </button>
                                </li>
                            </ul>
                        </div>
                        <div class="p-sidebar-content">
                            ${renderGroupsHtml(groups)}
                        </div>
                        <div class="p-sidebar-footer">
                            <ul class="p-sidebar-menu">
                                <li class="p-sidebar-menu-item">
                                    <button type="button" class="p-sidebar-menu-button" style="padding: 0.35rem 0.5rem;">
                                        <div style="display:flex; width:1.5rem; height:1.5rem; border-radius:9999px; background: var(--p-surface-300, #cbd5e1); color:var(--p-surface-800, #1e293b); align-items:center; justify-content:center; font-weight:700; font-size:0.65rem; flex-shrink:0;">JD</div>
                                        <span class="p-sidebar-item-label p-sidebar-footer-label" style="font-weight: 600; font-size: 0.8125rem;">John Doe</span>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </aside>
        `;
    const triggerIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/></svg>`;
    const mainHtml = `
            <div class="p-sidebar-main">
                <header class="p-sidebar-main-header">
                    <button type="button" class="p-sidebar-trigger" data-sidebar-toggle aria-label="Toggle navigation">
                        ${triggerIconSvg}
                    </button>
                    <span style="font-size: 0.875rem; font-weight: 600; color: var(--p-text-color);">Dashboard</span>
                </header>
                <div style="flex: 1; padding: 1rem; display: flex; flex-direction: column; gap: 1rem; overflow-y: auto;">
                    <div style="height: 12rem; border-radius: 8px; background: var(--p-surface-100); border: 1px solid var(--p-border-color); display: flex; align-items: center; justify-content: center; color: var(--p-text-muted); font-size: 0.875rem;">Main Content View</div>
                    <div style="flex: 1; min-height: 14rem; border-radius: 8px; background: var(--p-surface-100); border: 1px solid var(--p-border-color); display: flex; align-items: center; justify-content: center; color: var(--p-text-muted); font-size: 0.875rem;">Analytics &amp; Data Area</div>
                </div>
            </div>
        `;
    const backdropHtml = backdrop && isOpen ? `<div class="p-sidebar-backdrop" data-sidebar-backdrop></div>` : "";
    const innerContent = side === "right" ? mainHtml + sidebarHtml : sidebarHtml + mainHtml;
    return `
            <div class="p-sidebar-layout">
                ${backdropHtml}
                ${innerContent}
            </div>
        `;
  }
  function wireEvents() {
    container.querySelectorAll("[data-sidebar-toggle]").forEach((btn) => {
      btn.addEventListener("click", () => {
        isOpen = !isOpen;
        render();
      });
    });
    container.querySelectorAll("[data-sidebar-backdrop]").forEach((bd) => {
      bd.addEventListener("click", () => {
        isOpen = false;
        render();
      });
    });
    container.querySelectorAll('.p-sidebar-menu-button[data-has-subs="true"]').forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const li = btn.closest(".p-sidebar-menu-item");
        const subKey = li?.getAttribute("data-subkey");
        if (subKey) {
          expandedSubmenus[subKey] = !expandedSubmenus[subKey];
          render();
        }
      });
    });
    if (openOnHover) {
      const aside = container.querySelector("[data-sidebar-root]");
      if (aside) {
        aside.addEventListener("mouseenter", () => {
          if (!isOpen) {
            isOpen = true;
            render();
          }
        });
        aside.addEventListener("mouseleave", () => {
          if (isOpen) {
            isOpen = false;
            render();
          }
        });
      }
    }
  }
  function render() {
    container.innerHTML = renderComponent();
    wireEvents();
  }
  render();
}
export {
  SidebarIsland as default
};
//# sourceMappingURL=sidebar-3RDVFPRZ.js.map
