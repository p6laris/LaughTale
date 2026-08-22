import {
  useClickOutside
} from "./chunk-T4EPW24S.js";
import {
  useDebounce
} from "./chunk-5EJRX4PB.js";
import {
  useTransition
} from "./chunk-IOCYPXM4.js";
import {
  useDisclosure
} from "./chunk-KEONGXN5.js";
import {
  LucideIcons
} from "./chunk-BWRILNJC.js";
import {
  injectIslandStyle
} from "./chunk-3TFPN5JM.js";

// ../SoftMax.LaughTale.Client/src/components/tree-select.ts
var CSS = `
[data-theme="dark"] .laughtale-tree-select {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .tree-trigger-btn {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .tree-clear-btn {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .tree-dropdown-menu {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .tree-search-input {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
`;
function CascadeTreeIsland(container, props) {
  injectIslandStyle("tree-select", CSS);
  const allDepartments = props.departments || [];
  let selectedId = props.selectedValue || "";
  let selectedName = "";
  let searchQuery = "";
  const expandedIds = /* @__PURE__ */ new Set();
  allDepartments.forEach((dept) => {
    if (dept.children && dept.children.length > 0) {
      expandedIds.add(dept.id);
    }
  });
  function findNodeById(nodes, id) {
    for (const n of nodes) {
      if (n.id === id) return n;
      if (n.children) {
        const found = findNodeById(n.children, id);
        if (found) return found;
      }
    }
    return null;
  }
  if (selectedId) {
    const found = findNodeById(allDepartments, selectedId);
    if (found) selectedName = found.name;
  }
  container.innerHTML = `
        <div class="laughtale-tree-select" style="position: relative; width: 100%; max-width: 380px; font-family: var(--p-font-family, inherit);">
            <input type="hidden" name="${props.targetInputName || "tree_selected"}" id="${props.targetInputName || "tree_selected"}" value="${selectedId}" />
            
            <!-- Trigger Button -->
            <button type="button" 
                    class="tree-trigger-btn" 
                    ${props.disabled ? "disabled" : ""}
                    style="width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.875rem; background: var(--p-surface-0); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); color: var(--p-text-color); cursor: ${props.disabled ? "not-allowed" : "pointer"}; font-size: 0.875rem; box-shadow: var(--p-shadow-sm); transition: all 0.2s ease;">
                <div style="display: flex; align-items: center; gap: 0.5rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                    <span style="color: var(--p-primary-600); display: flex;">${LucideIcons.gitBranch || "\u{1F333}"}</span>
                    <span class="tree-trigger-label" style="color: ${selectedName ? "var(--p-surface-900)" : "var(--p-surface-400)"}; font-weight: ${selectedName ? "600" : "normal"};">
                        ${selectedName || props.placeholder || "Select department or node..."}
                    </span>
                </div>
                <div style="display: flex; align-items: center; gap: 0.35rem;">
                    <button type="button" class="tree-clear-btn" style="display: ${selectedId ? "flex" : "none"}; border: none; background: transparent; color: var(--p-surface-400); cursor: pointer; padding: 2px;">
                        ${LucideIcons.x}
                    </button>
                    <span class="tree-chevron" style="color: var(--p-surface-400); display: flex; transition: transform 0.2s ease;">
                        ${LucideIcons.chevronDown}
                    </span>
                </div>
            </button>

            <!-- Dropdown Menu -->
            <div class="tree-dropdown-menu" style="display: none; position: absolute; top: calc(100% + 6px); left: 0; right: 0; z-index: 1000; background: var(--p-surface-0); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg); box-shadow: var(--p-shadow-lg); overflow: hidden;">
                
                <!-- Search Box -->
                <div style="padding: 0.625rem 0.75rem; border-bottom: 1px solid var(--p-border-color); display: flex; align-items: center; gap: 0.5rem; background: var(--p-surface-50);">
                    <span style="color: var(--p-surface-400); display: flex;">${LucideIcons.search}</span>
                    <input type="text" 
                           class="tree-search-input" 
                           placeholder="Search tree nodes..." 
                           style="flex: 1; border: none; outline: none; background: transparent; font-size: 0.8125rem; color: var(--p-text-color);" />
                </div>

                <!-- Tree Hierarchy List -->
                <div class="tree-nodes-container" style="max-height: 260px; overflow-y: auto; padding: 0.5rem 0.25rem;">
                </div>

                <!-- Footer Summary -->
                <div style="padding: 0.4rem 0.75rem; background: var(--p-surface-50); border-top: 1px solid var(--p-border-color); font-size: 0.6875rem; color: var(--p-surface-500); display: flex; justify-content: space-between; align-items: center;">
                    <span>Hierarchy Explorer</span>
                    <span class="tree-count-label"></span>
                </div>
            </div>
        </div>
    `;
  const triggerBtn = container.querySelector(".tree-trigger-btn");
  const triggerLabel = container.querySelector(".tree-trigger-label");
  const clearBtn = container.querySelector(".tree-clear-btn");
  const chevron = container.querySelector(".tree-chevron");
  const dropdown = container.querySelector(".tree-dropdown-menu");
  const searchInput = container.querySelector(".tree-search-input");
  const nodesContainer = container.querySelector(".tree-nodes-container");
  const countLabel = container.querySelector(".tree-count-label");
  const hiddenInput = container.querySelector(`#${props.targetInputName || "tree_selected"}`);
  const disclosure = useDisclosure({
    defaultIsOpen: false,
    onOpen: () => {
      renderTree();
      useTransition(dropdown, { type: "fade", isMounted: true });
      chevron.style.transform = "rotate(180deg)";
      triggerBtn.style.borderColor = "var(--p-primary-500)";
      searchInput.focus();
    },
    onClose: () => {
      useTransition(dropdown, { type: "fade", isMounted: false });
      chevron.style.transform = "rotate(0deg)";
      triggerBtn.style.borderColor = "var(--p-border-color)";
    }
  });
  useClickOutside(container, () => disclosure.close());
  triggerBtn.addEventListener("click", (e) => {
    if (e.target.closest(".tree-clear-btn")) return;
    disclosure.toggle();
  });
  clearBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    selectedId = "";
    selectedName = "";
    triggerLabel.textContent = props.placeholder || "Select department or node...";
    triggerLabel.style.color = "var(--p-surface-400)";
    triggerLabel.style.fontWeight = "normal";
    clearBtn.style.display = "none";
    hiddenInput.value = "";
    renderTree();
    syncValue();
  });
  const debouncedFilter = useDebounce(() => {
    searchQuery = searchInput.value.trim().toLowerCase();
    renderTree();
  }, 150);
  searchInput.addEventListener("input", () => debouncedFilter());
  function filterTree(nodes, query) {
    if (!query) return nodes;
    return nodes.reduce((acc, node) => {
      const matches = node.name.toLowerCase().includes(query) || node.id.toLowerCase().includes(query);
      const filteredChildren = node.children ? filterTree(node.children, query) : [];
      if (matches || filteredChildren.length > 0) {
        acc.push({
          ...node,
          children: filteredChildren.length > 0 ? filteredChildren : node.children
        });
      }
      return acc;
    }, []);
  }
  function renderTree() {
    const filtered = filterTree(allDepartments, searchQuery);
    nodesContainer.innerHTML = "";
    if (filtered.length === 0) {
      nodesContainer.innerHTML = `<div style="padding: 1.5rem; text-align: center; color: var(--p-surface-400); font-size: 0.8125rem;">No matching departments</div>`;
      countLabel.textContent = "0 items";
      return;
    }
    let totalNodes = 0;
    function countAll(nodes) {
      nodes.forEach((n) => {
        totalNodes++;
        if (n.children) countAll(n.children);
      });
    }
    countAll(filtered);
    countLabel.textContent = `${totalNodes} items`;
    function renderNodes(nodes, depth, parentEl) {
      nodes.forEach((node) => {
        const hasChildren = node.children && node.children.length > 0;
        const isExpanded = searchQuery ? true : expandedIds.has(node.id);
        const isSelected = selectedId === node.id;
        const nodeEl = document.createElement("div");
        nodeEl.className = "tree-node-item";
        nodeEl.style.display = "flex";
        nodeEl.style.flexDirection = "column";
        const rowEl = document.createElement("div");
        rowEl.style.display = "flex";
        rowEl.style.alignItems = "center";
        rowEl.style.justifyContent = "space-between";
        rowEl.style.padding = "0.4rem 0.5rem";
        rowEl.style.paddingLeft = `${depth * 1.25 + 0.5}rem`;
        rowEl.style.borderRadius = "var(--p-border-radius)";
        rowEl.style.cursor = "pointer";
        rowEl.style.background = isSelected ? "var(--p-primary-50)" : "transparent";
        rowEl.style.color = isSelected ? "var(--p-primary-700)" : "var(--p-text-color)";
        rowEl.style.fontWeight = isSelected ? "600" : "normal";
        rowEl.style.fontSize = "0.8125rem";
        rowEl.style.transition = "all 0.1s ease";
        rowEl.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 0.4rem; flex: 1; overflow: hidden;">
                        ${hasChildren ? `
                            <span class="tree-node-toggle" style="color: var(--p-surface-400); display: flex; align-items: center; transition: transform 0.15s ease; transform: rotate(${isExpanded ? "90deg" : "0deg"});">
                                ${LucideIcons.chevronRight}
                            </span>
                        ` : `
                            <span style="width: 14px; display: inline-block;"></span>
                        `}
                        <span style="display: flex; align-items: center; color: ${hasChildren ? "var(--p-primary-600)" : "var(--p-surface-500)"};">
                            ${hasChildren ? LucideIcons.folder || "\u{1F4C1}" : LucideIcons.fileText || "\u{1F4C4}"}
                        </span>
                        <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${node.name}</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.35rem;">
                        ${node.badge ? `<span class="aura-tag tag-slate" style="font-size: 0.625rem; padding: 0.1rem 0.35rem;">${node.badge}</span>` : ""}
                        ${isSelected ? `<span style="color: var(--p-primary-600); display: flex;">${LucideIcons.check}</span>` : ""}
                    </div>
                `;
        rowEl.addEventListener("mouseenter", () => {
          if (!isSelected) rowEl.style.background = "var(--p-surface-100)";
        });
        rowEl.addEventListener("mouseleave", () => {
          if (!isSelected) rowEl.style.background = "transparent";
        });
        const toggleSpan = rowEl.querySelector(".tree-node-toggle");
        if (toggleSpan) {
          toggleSpan.addEventListener("click", (e) => {
            e.stopPropagation();
            if (expandedIds.has(node.id)) expandedIds.delete(node.id);
            else expandedIds.add(node.id);
            renderTree();
          });
        }
        rowEl.addEventListener("click", () => {
          selectedId = node.id;
          selectedName = node.name;
          triggerLabel.textContent = selectedName;
          triggerLabel.style.color = "var(--p-surface-900)";
          triggerLabel.style.fontWeight = "600";
          clearBtn.style.display = "flex";
          hiddenInput.value = selectedId;
          disclosure.close();
          syncValue();
        });
        nodeEl.appendChild(rowEl);
        if (hasChildren && isExpanded) {
          const childrenContainer = document.createElement("div");
          childrenContainer.className = "tree-children-container";
          renderNodes(node.children, depth + 1, childrenContainer);
          nodeEl.appendChild(childrenContainer);
        }
        parentEl.appendChild(nodeEl);
      });
    }
    renderNodes(filtered, 0, nodesContainer);
  }
  function syncValue() {
    container.dispatchEvent(new CustomEvent("tree:selected", {
      bubbles: true,
      detail: { id: selectedId, name: selectedName }
    }));
  }
}
export {
  CascadeTreeIsland as default
};
//# sourceMappingURL=tree-select-7QZ4JZOR.js.map
