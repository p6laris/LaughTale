import {
  LucideIcons
} from "./chunk-XHF3KYSF.js";
import {
  injectIslandStyle
} from "./chunk-3TFPN5JM.js";

// ../SoftMax.LaughTale.Client/src/components/tieredmenu.ts
var TIEREDMENU_CSS = `
/* ==========================================================================
   PrimeVue 4 Aura TieredMenu Component Tokens & Layout
   ========================================================================== */
.p-tieredmenu {
    display: inline-block;
    min-width: 14rem;
    background: var(--p-tieredmenu-background, var(--p-surface-0, #ffffff));
    border: 1px solid var(--p-tieredmenu-border-color, var(--p-border-color, #e2e8f0));
    border-radius: var(--p-tieredmenu-border-radius, var(--p-border-radius, 8px));
    color: var(--p-tieredmenu-color, var(--p-text-color, #0f172a));
    padding: var(--p-tieredmenu-list-padding, 0.25rem);
    box-shadow: var(--p-tieredmenu-shadow, 0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.05));
    box-sizing: border-box;
    position: relative;
    font-family: var(--p-font-family, inherit);
    user-select: none;
}

.p-tieredmenu-overlay {
    position: absolute;
    z-index: 1050;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
    animation: p-tieredmenu-pop-in 160ms cubic-bezier(0.16, 1, 0.3, 1);
    transform-origin: top left;
}

@keyframes p-tieredmenu-pop-in {
    from {
        opacity: 0;
        transform: scale(0.96) translateY(-4px);
    }
    to {
        opacity: 1;
        transform: scale(1) translateY(0);
    }
}

.p-tieredmenu-root-list,
.p-tieredmenu-submenu {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: var(--p-tieredmenu-list-gap, 2px);
    box-sizing: border-box;
}

.p-tieredmenu-item {
    position: relative;
    list-style: none;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.p-tieredmenu-item-content {
    display: block;
    box-sizing: border-box;
}

.p-tieredmenu-item-link {
    display: flex;
    align-items: center;
    gap: var(--p-tieredmenu-item-gap, 0.5rem);
    padding: var(--p-tieredmenu-item-padding, 0.45rem 0.75rem);
    border-radius: var(--p-tieredmenu-item-border-radius, var(--p-border-radius, 6px));
    color: var(--p-tieredmenu-item-color, var(--p-text-color, #0f172a));
    text-decoration: none;
    cursor: pointer;
    font-size: var(--p-tieredmenu-item-label-font-size, 0.875rem);
    font-weight: var(--p-tieredmenu-item-label-font-weight, 500);
    transition: background-color 120ms ease, color 120ms ease;
    box-sizing: border-box;
    white-space: nowrap;
    outline: none;
    user-select: none;
}

.p-tieredmenu-item-link:hover,
.p-tieredmenu-item-link:focus-visible,
.p-tieredmenu-item.p-active > .p-tieredmenu-item-content > .p-tieredmenu-item-link {
    background: var(--p-tieredmenu-item-focus-background, var(--p-surface-100, #f1f5f9));
    color: var(--p-tieredmenu-item-focus-color, var(--p-text-color, #0f172a));
}

.p-tieredmenu-item.p-disabled > .p-tieredmenu-item-content > .p-tieredmenu-item-link {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
}

.p-tieredmenu-item-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--p-tieredmenu-item-icon-size, 1rem);
    height: var(--p-tieredmenu-item-icon-size, 1rem);
    flex-shrink: 0;
    color: var(--p-tieredmenu-item-icon-color, var(--p-surface-500, #64748b));
    transition: color 120ms ease;
}

.p-tieredmenu-item-link:hover .p-tieredmenu-item-icon,
.p-tieredmenu-item.p-active > .p-tieredmenu-item-content > .p-tieredmenu-item-link .p-tieredmenu-item-icon {
    color: var(--p-tieredmenu-item-icon-focus-color, var(--p-surface-700, #334155));
}

.p-tieredmenu-item-label {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.p-tieredmenu-badge {
    margin-left: auto;
    font-size: 0.6875rem;
    font-weight: 700;
    padding: 0.1rem 0.4rem;
    border-radius: 9999px;
    background: var(--p-surface-200, #e2e8f0);
    color: var(--p-surface-700, #334155);
    flex-shrink: 0;
}

.p-tieredmenu-shortcut {
    margin-left: auto;
    font-size: 0.75rem;
    font-weight: 500;
    padding: 0.1rem 0.35rem;
    border-radius: var(--p-border-radius, 4px);
    background: var(--p-surface-100, #f1f5f9);
    border: 1px solid var(--p-border-color, #e2e8f0);
    color: var(--p-text-muted, #64748b);
    font-family: inherit;
    flex-shrink: 0;
}

.p-tieredmenu-submenu-icon {
    margin-left: auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--p-tieredmenu-submenu-icon-size, 0.875rem);
    height: var(--p-tieredmenu-submenu-icon-size, 0.875rem);
    color: var(--p-tieredmenu-submenu-icon-color, var(--p-surface-400, #94a3b8));
    flex-shrink: 0;
    transition: transform 120ms ease;
}

.p-tieredmenu-separator {
    height: 1px;
    background: var(--p-tieredmenu-separator-border-color, var(--p-border-color, #e2e8f0));
    margin: 0.25rem 0;
    list-style: none;
    box-sizing: border-box;
}

/* Submenu Overlay Positioning & Animation */
.p-tieredmenu-submenu {
    position: absolute;
    top: 0;
    left: 100%;
    margin-left: 0.25rem;
    min-width: 14rem;
    background: var(--p-tieredmenu-background, var(--p-surface-0, #ffffff));
    border: 1px solid var(--p-tieredmenu-border-color, var(--p-border-color, #e2e8f0));
    border-radius: var(--p-tieredmenu-border-radius, var(--p-border-radius, 8px));
    padding: var(--p-tieredmenu-list-padding, 0.25rem);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.12), 0 8px 10px -6px rgba(0, 0, 0, 0.08);
    z-index: 1051;
    animation: p-tieredmenu-flyout-enter 160ms cubic-bezier(0.16, 1, 0.3, 1);
    transform-origin: top left;
}

.p-tieredmenu-submenu.p-flipped-left {
    left: auto;
    right: 100%;
    margin-left: 0;
    margin-right: 0.25rem;
    transform-origin: top right;
}

@keyframes p-tieredmenu-flyout-enter {
    from {
        opacity: 0;
        transform: scale(0.96) translateX(-4px);
    }
    to {
        opacity: 1;
        transform: scale(1) translateX(0);
    }
}

/* Dark Mode Theme Tokens */
.dark .p-tieredmenu,
[data-theme="dark"] .p-tieredmenu {
    background: var(--p-surface-900, #0f172a);
    border-color: var(--p-surface-700, #334155);
    color: var(--p-surface-100, #f8fafc);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
}

.dark .p-tieredmenu-submenu,
[data-theme="dark"] .p-tieredmenu-submenu {
    background: var(--p-surface-900, #0f172a);
    border-color: var(--p-surface-700, #334155);
    color: var(--p-surface-100, #f8fafc);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
}

.dark .p-tieredmenu-item-link:hover,
.dark .p-tieredmenu-item-link:focus-visible,
.dark .p-tieredmenu-item.p-active > .p-tieredmenu-item-content > .p-tieredmenu-item-link,
[data-theme="dark"] .p-tieredmenu-item-link:hover,
[data-theme="dark"] .p-tieredmenu-item-link:focus-visible,
[data-theme="dark"] .p-tieredmenu-item.p-active > .p-tieredmenu-item-content > .p-tieredmenu-item-link {
    background: var(--p-surface-800, #1e293b);
    color: var(--p-surface-0, #ffffff);
}

.dark .p-tieredmenu-separator,
[data-theme="dark"] .p-tieredmenu-separator {
    background: var(--p-surface-800, #1e293b);
}

.dark .p-tieredmenu-shortcut,
[data-theme="dark"] .p-tieredmenu-shortcut {
    background: var(--p-surface-800, #1e293b);
    border-color: var(--p-surface-700, #334155);
    color: var(--p-surface-300, #cbd5e1);
}

.dark .p-tieredmenu-badge,
[data-theme="dark"] .p-tieredmenu-badge {
    background: var(--p-surface-800, #1e293b);
    color: var(--p-surface-300, #cbd5e1);
}
`;
function TieredMenuIsland(container, props) {
  injectIslandStyle("tieredmenu", TIEREDMENU_CSS);
  const model = props.model || props.items || [];
  const isPopup = props.popup === true;
  let isOpen = !isPopup;
  function getIconSvg(iconName) {
    if (!iconName) return "";
    if (iconName.startsWith("<svg")) return iconName;
    const iconMap = {
      "pi-file": "file",
      "pi-file-edit": "fileEdit",
      "pi-folder-open": "folderOpen",
      "pi-image": "image",
      "pi-plus": "plus",
      "pi-print": "print",
      "pi-search": "search",
      "pi-share-alt": "share2",
      "pi-slack": "slack",
      "pi-times": "trash2",
      "pi-video": "video",
      "pi-whatsapp": "phone",
      "pi-copy": "copy",
      "pi-cloud": "cloud",
      "pi-cloud-download": "cloudDownload",
      "pi-cloud-upload": "cloudUpload",
      "pi-palette": "palette",
      "pi-link": "link",
      "pi-home": "home"
    };
    const mapped = iconMap[iconName] || iconName;
    if (LucideIcons[mapped]) return LucideIcons[mapped];
    return "";
  }
  const chevronRightSvg = `<svg class="p-tieredmenu-submenu-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>`;
  function renderMenuItems(itemsList, level = 0) {
    return itemsList.map((item, idx) => {
      if (item.Separator || item.separator) {
        return `<li class="p-tieredmenu-separator" role="separator"></li>`;
      }
      const label = item.Label || item.label || "";
      const iconName = item.Icon || item.icon || "";
      const iconSvg = getIconSvg(iconName);
      const disabled = item.Disabled || item.disabled || false;
      const subItems = item.Items || item.items || [];
      const hasSubmenu = Array.isArray(subItems) && subItems.length > 0;
      const shortcut = item.Shortcut || item.shortcut || "";
      const badge = item.Badge || item.badge || "";
      const url = item.Url || item.url || item.Route || item.route || "";
      const command = item.Command || item.command || "";
      const subTreeHtml = hasSubmenu ? `<ul class="p-tieredmenu-submenu" role="menu" style="display: none;">${renderMenuItems(subItems, level + 1)}</ul>` : "";
      const badgeHtml = badge ? `<span class="p-tieredmenu-badge aura-tag tag-emerald">${badge}</span>` : "";
      const shortcutHtml = shortcut ? `<span class="p-tieredmenu-shortcut">${shortcut}</span>` : "";
      const submenuArrow = hasSubmenu ? chevronRightSvg : "";
      const linkAttrs = [
        `class="p-tieredmenu-item-link"`,
        `role="menuitem"`,
        `tabindex="${disabled ? -1 : 0}"`,
        hasSubmenu ? `aria-haspopup="true" aria-expanded="false"` : "",
        url ? `href="${url}"` : `href="javascript:void(0)"`,
        command ? `data-command="${command}"` : "",
        `data-item-label="${label}"`,
        item.Target || item.target ? `target="${item.Target || item.target}"` : ""
      ].filter(Boolean).join(" ");
      return `
                <li class="p-tieredmenu-item ${disabled ? "p-disabled" : ""}" role="none" data-level="${level}">
                    <div class="p-tieredmenu-item-content">
                        <a ${linkAttrs}>
                            ${iconSvg ? `<span class="p-tieredmenu-item-icon">${iconSvg}</span>` : ""}
                            <span class="p-tieredmenu-item-label">${label}</span>
                            ${badgeHtml}
                            ${shortcutHtml}
                            ${submenuArrow}
                        </a>
                    </div>
                    ${subTreeHtml}
                </li>
            `;
    }).join("");
  }
  function renderComponent() {
    const rootClasses = [
      "p-tieredmenu",
      isPopup ? "p-tieredmenu-overlay" : "",
      props.class || ""
    ].filter(Boolean).join(" ");
    const menuHtml = `
            <div class="${rootClasses}" ${isPopup ? 'style="display: none;"' : ""} data-tieredmenu-root role="menubar" aria-orientation="vertical">
                <ul class="p-tieredmenu-root-list" role="menubar">
                    ${renderMenuItems(model)}
                </ul>
            </div>
        `;
    if (isPopup && props.triggerText) {
      const triggerVariant = props.triggerVariant || "outlined";
      const triggerSeverity = props.triggerSeverity || "primary";
      const iconSvg = props.triggerIcon ? getIconSvg(props.triggerIcon) : "";
      return `
                <div class="p-tieredmenu-wrapper" style="position: relative; display: inline-block;">
                    <button type="button" class="p-button p-button-${triggerSeverity} ${triggerVariant === "outlined" ? "p-button-outlined" : ""}" data-tieredmenu-trigger aria-haspopup="true" aria-expanded="false">
                        ${iconSvg ? `<span class="p-button-icon">${iconSvg}</span>` : ""}
                        <span class="p-button-label">${props.triggerText}</span>
                    </button>
                    ${menuHtml}
                </div>
            `;
    }
    return menuHtml;
  }
  function wireEvents() {
    const rootEl = container.querySelector("[data-tieredmenu-root]");
    if (!rootEl) return;
    if (isPopup) {
      const triggerEl = container.querySelector("[data-tieredmenu-trigger]") || (props.triggerId ? document.getElementById(props.triggerId) : null);
      const togglePopup = (targetEl) => {
        isOpen = !isOpen;
        if (isOpen) {
          rootEl.style.display = "block";
          triggerEl?.setAttribute("aria-expanded", "true");
          const rect = targetEl.getBoundingClientRect();
          const parentRect = rootEl.offsetParent ? rootEl.offsetParent.getBoundingClientRect() : { left: 0, top: 0 };
          rootEl.style.top = `${rect.bottom - parentRect.top + 4}px`;
          rootEl.style.left = `${rect.left - parentRect.left}px`;
        } else {
          rootEl.style.display = "none";
          triggerEl?.setAttribute("aria-expanded", "false");
          closeAllSubmenus(rootEl);
        }
      };
      if (triggerEl) {
        triggerEl.addEventListener("click", (e) => {
          e.stopPropagation();
          togglePopup(triggerEl);
        });
      }
      container.toggle = (e) => {
        const target = e?.currentTarget || triggerEl || container;
        togglePopup(target);
      };
      document.addEventListener("click", (e) => {
        if (isOpen && !rootEl.contains(e.target) && (!triggerEl || !triggerEl.contains(e.target))) {
          isOpen = false;
          rootEl.style.display = "none";
          triggerEl?.setAttribute("aria-expanded", "false");
          closeAllSubmenus(rootEl);
        }
      });
    }
    const openSubmenuTimers = /* @__PURE__ */ new Map();
    function closeAllSubmenus(parent) {
      parent.querySelectorAll(".p-tieredmenu-submenu").forEach((sub) => {
        sub.style.display = "none";
        sub.classList.remove("p-flipped-left");
        const link = sub.parentElement?.querySelector(".p-tieredmenu-item-link");
        link?.setAttribute("aria-expanded", "false");
      });
      parent.querySelectorAll(".p-tieredmenu-item.p-active").forEach((it) => {
        it.classList.remove("p-active");
      });
    }
    function openSubmenu(li) {
      const sub = li.querySelector(":scope > .p-tieredmenu-submenu");
      if (!sub) return;
      const siblingUl = li.parentElement;
      if (siblingUl) {
        siblingUl.querySelectorAll(":scope > .p-tieredmenu-item").forEach((sib) => {
          if (sib !== li) {
            sib.classList.remove("p-active");
            const sibSub = sib.querySelector(":scope > .p-tieredmenu-submenu");
            if (sibSub) {
              sibSub.style.display = "none";
              sibSub.classList.remove("p-flipped-left");
              sib.querySelector(".p-tieredmenu-item-link")?.setAttribute("aria-expanded", "false");
            }
          }
        });
      }
      li.classList.add("p-active");
      sub.style.display = "block";
      li.querySelector(".p-tieredmenu-item-link")?.setAttribute("aria-expanded", "true");
      const subRect = sub.getBoundingClientRect();
      if (subRect.right > window.innerWidth - 8) {
        sub.classList.add("p-flipped-left");
      } else {
        sub.classList.remove("p-flipped-left");
      }
    }
    function scheduleCloseSubmenu(li) {
      const timer = window.setTimeout(() => {
        li.classList.remove("p-active");
        const sub = li.querySelector(":scope > .p-tieredmenu-submenu");
        if (sub) {
          sub.style.display = "none";
          sub.classList.remove("p-flipped-left");
          li.querySelector(".p-tieredmenu-item-link")?.setAttribute("aria-expanded", "false");
        }
      }, 120);
      openSubmenuTimers.set(li, timer);
    }
    container.querySelectorAll(".p-tieredmenu-item").forEach((li) => {
      const hasSub = li.querySelector(":scope > .p-tieredmenu-submenu") !== null;
      li.addEventListener("mouseenter", () => {
        if (openSubmenuTimers.has(li)) {
          clearTimeout(openSubmenuTimers.get(li));
          openSubmenuTimers.delete(li);
        }
        if (hasSub) {
          openSubmenu(li);
        } else {
          const siblingUl = li.parentElement;
          if (siblingUl) {
            siblingUl.querySelectorAll(":scope > .p-tieredmenu-item").forEach((sib) => {
              if (sib !== li) {
                sib.classList.remove("p-active");
                const sibSub = sib.querySelector(":scope > .p-tieredmenu-submenu");
                if (sibSub) {
                  sibSub.style.display = "none";
                  sibSub.classList.remove("p-flipped-left");
                }
              }
            });
          }
        }
      });
      li.addEventListener("mouseleave", () => {
        if (hasSub) {
          scheduleCloseSubmenu(li);
        }
      });
    });
    container.querySelectorAll(".p-tieredmenu-item-link").forEach((link) => {
      link.addEventListener("click", (e) => {
        const li = link.closest(".p-tieredmenu-item");
        const hasSub = li?.querySelector(":scope > .p-tieredmenu-submenu") !== null;
        if (hasSub) {
          e.preventDefault();
          openSubmenu(li);
          return;
        }
        const command = link.getAttribute("data-command");
        const label = link.getAttribute("data-item-label");
        const href = link.getAttribute("href");
        if (command) {
          executeCommand(command, label || "");
        }
        container.dispatchEvent(new CustomEvent("tieredmenu:select", {
          bubbles: true,
          detail: { label, command, href }
        }));
        if (isPopup) {
          isOpen = false;
          rootEl.style.display = "none";
          closeAllSubmenus(rootEl);
        } else {
          closeAllSubmenus(rootEl);
        }
      });
    });
    rootEl.addEventListener("keydown", (e) => {
      const activeEl = document.activeElement;
      if (!activeEl || !rootEl.contains(activeEl)) return;
      const currentLi = activeEl.closest(".p-tieredmenu-item");
      if (!currentLi) return;
      const currentUl = currentLi.parentElement;
      const items = Array.from(currentUl.querySelectorAll(":scope > .p-tieredmenu-item:not(.p-disabled)"));
      const currentIndex = items.indexOf(currentLi);
      switch (e.key) {
        case "ArrowDown": {
          e.preventDefault();
          const nextIndex = (currentIndex + 1) % items.length;
          items[nextIndex]?.querySelector(".p-tieredmenu-item-link")?.focus();
          break;
        }
        case "ArrowUp": {
          e.preventDefault();
          const prevIndex = (currentIndex - 1 + items.length) % items.length;
          items[prevIndex]?.querySelector(".p-tieredmenu-item-link")?.focus();
          break;
        }
        case "ArrowRight": {
          const sub = currentLi.querySelector(":scope > .p-tieredmenu-submenu");
          if (sub) {
            e.preventDefault();
            openSubmenu(currentLi);
            sub.querySelector(".p-tieredmenu-item:not(.p-disabled) .p-tieredmenu-item-link")?.focus();
          }
          break;
        }
        case "ArrowLeft": {
          const parentSub = currentLi.closest(".p-tieredmenu-submenu");
          if (parentSub) {
            e.preventDefault();
            const parentLi = parentSub.closest(".p-tieredmenu-item");
            parentSub.style.display = "none";
            parentLi?.querySelector(".p-tieredmenu-item-link")?.focus();
          }
          break;
        }
        case "Enter":
        case " ": {
          e.preventDefault();
          activeEl.click();
          break;
        }
        case "Escape": {
          e.preventDefault();
          if (isPopup) {
            isOpen = false;
            rootEl.style.display = "none";
          }
          closeAllSubmenus(rootEl);
          break;
        }
        case "Home": {
          e.preventDefault();
          items[0]?.querySelector(".p-tieredmenu-item-link")?.focus();
          break;
        }
        case "End": {
          e.preventDefault();
          items[items.length - 1]?.querySelector(".p-tieredmenu-item-link")?.focus();
          break;
        }
      }
    });
  }
  function executeCommand(commandStr, label) {
    let severity = "info";
    let summary = label;
    let detail = `Action triggered for ${label}`;
    if (commandStr.includes("file_created") || commandStr.includes("success") || label === "New") {
      severity = "success";
      summary = "Success";
      detail = "File created";
    } else if (commandStr.includes("printer") || commandStr.includes("error") || label === "Print") {
      severity = "error";
      summary = "Error";
      detail = "No printer connected";
    } else if (commandStr.includes("search") || commandStr.includes("warn") || label === "Search") {
      severity = "warn";
      summary = "Search Results";
      detail = "No results found";
    } else if (commandStr.includes("download") || label === "Import") {
      severity = "info";
      summary = "Downloads";
      detail = "Downloaded from cloud";
    } else if (commandStr.includes("upload") || label === "Export") {
      severity = "info";
      summary = "Shared";
      detail = "Exported to cloud";
    }
    window.dispatchEvent(new CustomEvent("toast:show", {
      detail: { severity, summary, detail, life: 3e3 }
    }));
  }
  container.innerHTML = renderComponent();
  wireEvents();
}
export {
  TieredMenuIsland as default
};
//# sourceMappingURL=tieredmenu-KQGRDIKF.js.map
