import {
  useFocusTrap,
  useHotkeys
} from "./chunk-AVQWSCJA.js";
import {
  useDisclosure,
  useScrollLock
} from "./chunk-ZZO6ZCC7.js";
import {
  LucideIcons
} from "./chunk-QV6AVE4Z.js";

// ../SoftMax.LaughTale.Client/src/components/command.ts
function CommandPaletteIsland(container, props) {
  const placeholder = props.placeholder || "Type a command or search...";
  const items = props.items || [
    { id: "home", label: "Go to Overview", group: "Navigation", icon: "compass", url: "/", shortcut: "G H" },
    { id: "docs", label: "Documentation Index", group: "Navigation", icon: "file-text", url: "/doc/01-getting-started", shortcut: "G D" },
    { id: "showcase", label: "Showcase Components", group: "Navigation", icon: "layers", url: "/enterprise", shortcut: "G S" },
    { id: "dash", label: "Enterprise Dashboard", group: "Navigation", icon: "bar-chart", url: "/dashboard", shortcut: "G B" },
    { id: "theme-dark", label: "Toggle Dark Mode", group: "Theme & Preferences", icon: "moon", action: "toggle-dark", shortcut: "T D" },
    { id: "studio", label: "Open TweakAura Studio", group: "Theme & Preferences", icon: "palette", action: "open-studio", shortcut: "T S" },
    { id: "export-css", label: "Export Current CSS Theme", group: "Actions", icon: "share-2", action: "export-css" },
    { id: "help", label: "Help & Shortcuts Guide", group: "Actions", icon: "help-circle", action: "help", shortcut: "?" }
  ];
  let search = "";
  let selectedIndex = 0;
  const disclosure = useDisclosure({ defaultIsOpen: false });
  const scrollLock = useScrollLock();
  container.innerHTML = `
        <div class="laughtale-command-root">
            <!-- Command Overlay Backdrop -->
            <div class="command-backdrop" style="display: none; position: fixed; inset: 0; z-index: 9999; background: rgba(0, 0, 0, 0.5); backdrop-filter: blur(4px); align-items: flex-start; justify-content: center; padding-top: 12vh;">
                <!-- Command Dialog Card -->
                <div class="command-dialog" style="width: 100%; max-width: 580px; background: var(--p-surface-0, #ffffff); border: 1px solid var(--p-border-color, #e2e8f0); border-radius: var(--p-border-radius-xl, 0.75rem); box-shadow: var(--p-shadow-lg, 0 20px 25px -5px rgba(0,0,0,0.1)); overflow: hidden; display: flex; flex-direction: column;">
                    
                    <!-- Search Header -->
                    <div style="display: flex; align-items: center; padding: 0.875rem 1.125rem; border-bottom: 1px solid var(--p-border-color, #e2e8f0); gap: 0.75rem;">
                        <span style="color: var(--p-surface-400, #94a3b8); display: flex;">${LucideIcons.search(18)}</span>
                        <input type="text" 
                               class="command-search-input" 
                               placeholder="${placeholder}" 
                               style="flex: 1; border: none; outline: none; background: transparent; font-size: 0.9375rem; color: var(--p-text-color, #0f172a); font-family: var(--p-font-family, inherit);" />
                        <span class="aura-tag tag-slate" style="font-size: 0.6875rem; padding: 0.2rem 0.45rem; font-family: monospace;">ESC</span>
                    </div>

                    <!-- Command Items List -->
                    <div class="command-items-container" style="max-height: 340px; overflow-y: auto; padding: 0.5rem;"></div>

                    <!-- Footer Bar -->
                    <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 1rem; border-top: 1px solid var(--p-border-color, #e2e8f0); background: var(--p-surface-50, #f8fafc); font-size: 0.75rem; color: var(--p-surface-500, #64748b);">
                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                            <span>Navigate <kbd style="font-family: monospace; background: var(--p-surface-200); padding: 1px 4px; border-radius: 3px;">\u2191\u2193</kbd></span>
                            <span>Select <kbd style="font-family: monospace; background: var(--p-surface-200); padding: 1px 4px; border-radius: 3px;">\u21B5</kbd></span>
                        </div>
                        <div>SoftMax.LaughTale Spotlight</div>
                    </div>
                </div>
            </div>
        </div>
    `;
  const backdrop = container.querySelector(".command-backdrop");
  const dialog = container.querySelector(".command-dialog");
  const input = container.querySelector(".command-search-input");
  const listContainer = container.querySelector(".command-items-container");
  const focusTrap = useFocusTrap(dialog, { initialFocusElement: input });
  function getFilteredItems() {
    if (!search.trim()) return items;
    const q = search.toLowerCase();
    return items.filter((it) => it.label.toLowerCase().includes(q) || it.group && it.group.toLowerCase().includes(q));
  }
  function renderList() {
    const filtered = getFilteredItems();
    if (filtered.length === 0) {
      listContainer.innerHTML = `
                <div style="padding: 2.5rem 1rem; text-align: center; color: var(--p-surface-400);">
                    <div style="margin-bottom: 0.5rem; display: flex; justify-content: center;">${LucideIcons.alertCircle(24)}</div>
                    <div style="font-size: 0.875rem; font-weight: 500;">No matching commands found</div>
                </div>
            `;
      return;
    }
    const groups = {};
    filtered.forEach((it) => {
      const g = it.group || "General";
      if (!groups[g]) groups[g] = [];
      groups[g].push(it);
    });
    let flatIndex = 0;
    let html = "";
    for (const [groupName, groupItems] of Object.entries(groups)) {
      html += `<div style="font-size: 0.6875rem; font-weight: 700; color: var(--p-surface-400); text-transform: uppercase; letter-spacing: 0.05em; padding: 0.5rem 0.75rem 0.25rem;">${groupName}</div>`;
      groupItems.forEach((it) => {
        const isSelected = flatIndex === selectedIndex;
        const iconSvg = it.icon && LucideIcons[it.icon] ? LucideIcons[it.icon](16) : LucideIcons.terminal(16);
        html += `
                    <div class="command-item ${isSelected ? "active" : ""}" 
                         data-index="${flatIndex}" 
                         data-id="${it.id}" 
                         style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.75rem; border-radius: var(--p-border-radius, 6px); cursor: pointer; background: ${isSelected ? "var(--p-surface-100, #f1f5f9)" : "transparent"}; color: var(--p-text-color, #0f172a); font-size: 0.875rem; transition: background 0.1s ease;">
                        <div style="display: flex; align-items: center; gap: 0.625rem;">
                            <span style="color: ${isSelected ? "var(--p-primary-600)" : "var(--p-surface-400)"}; display: flex;">${iconSvg}</span>
                            <span>${it.label}</span>
                        </div>
                        ${it.shortcut ? `<span class="aura-tag tag-slate" style="font-size: 0.6875rem; padding: 0.15rem 0.4rem; font-family: monospace;">${it.shortcut}</span>` : ""}
                    </div>
                `;
        flatIndex++;
      });
    }
    listContainer.innerHTML = html;
    listContainer.querySelectorAll(".command-item").forEach((el) => {
      el.addEventListener("mouseenter", () => {
        selectedIndex = Number(el.getAttribute("data-index"));
        renderList();
      });
      el.addEventListener("click", () => {
        executeItem(filtered[Number(el.getAttribute("data-index"))]);
      });
    });
  }
  function executeItem(item) {
    if (!item) return;
    close();
    if (item.url) {
      window.location.href = item.url;
    } else if (item.action === "toggle-dark") {
      document.documentElement.classList.toggle("dark");
      localStorage.setItem("theme", document.documentElement.classList.contains("dark") ? "dark" : "light");
    } else if (item.action === "open-studio") {
      document.dispatchEvent(new CustomEvent("studio:open"));
    } else if (item.action === "export-css") {
      document.dispatchEvent(new CustomEvent("studio:export"));
    }
  }
  function open() {
    disclosure.open();
    backdrop.style.display = "flex";
    scrollLock.lock();
    focusTrap.activate();
    search = "";
    input.value = "";
    selectedIndex = 0;
    renderList();
    input.focus();
  }
  function close() {
    disclosure.close();
    backdrop.style.display = "none";
    scrollLock.unlock();
    focusTrap.deactivate();
  }
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) close();
  });
  input.addEventListener("input", () => {
    search = input.value;
    selectedIndex = 0;
    renderList();
  });
  input.addEventListener("keydown", (e) => {
    const filtered = getFilteredItems();
    if (e.key === "ArrowDown") {
      e.preventDefault();
      selectedIndex = (selectedIndex + 1) % Math.max(1, filtered.length);
      renderList();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      selectedIndex = (selectedIndex - 1 + filtered.length) % Math.max(1, filtered.length);
      renderList();
    } else if (e.key === "Enter") {
      e.preventDefault();
      executeItem(filtered[selectedIndex]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
  });
  useHotkeys([
    { combo: "ctrl+k", handler: () => disclosure.isOpen ? close() : open(), allowInInputs: true },
    { combo: "meta+k", handler: () => disclosure.isOpen ? close() : open(), allowInInputs: true },
    { combo: "escape", handler: () => {
      if (disclosure.isOpen) close();
    }, allowInInputs: true }
  ]);
  document.addEventListener("command:open", () => open());
}
export {
  CommandPaletteIsland as default
};
//# sourceMappingURL=command-CA2Q5KVQ.js.map
