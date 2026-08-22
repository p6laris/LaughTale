// Scripts/islands/cascade-tree.ts
function CascadeTreeIsland(container, props) {
  let selectedText = props.placeholder;
  let isOpen = false;
  container.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
                <span style="font-size: 0.8125rem; font-weight: 600; color: var(--p-surface-600);">Organizational Hierarchy</span>
                <span class="aura-tag tag-amber">Hydrate: Visible</span>
            </div>

            <div style="position: relative; width: 100%;">
                <input type="hidden" name="${props.targetInputName}" id="${props.targetInputName}" value="" />
                
                <button type="button" class="tree-toggle-btn p-input" style="display: flex; align-items: center; justify-content: space-between; cursor: pointer; text-align: left;">
                    <span class="selected-label" style="color: var(--p-surface-600); font-size: 0.875rem;">${selectedText}</span>
                    <span style="font-size: 0.6875rem; color: var(--p-surface-400);">\u25BC</span>
                </button>

                <div class="tree-dropdown-menu" style="display: none; position: absolute; top: calc(100% + 4px); left: 0; width: 100%; padding: 0.75rem; background: var(--p-surface-0); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg); box-shadow: var(--p-shadow-lg); z-index: 50; max-height: 16rem; overflow-y: auto;">
                    <input type="text" placeholder="Search departments..." class="p-input tree-search" style="margin-bottom: 0.5rem; font-size: 0.8125rem; padding: 0.4rem 0.65rem;" />
                    <div class="tree-list" style="display: flex; flex-direction: column; gap: 0.25rem;"></div>
                </div>
            </div>
        </div>
    `;
  const btn = container.querySelector(".tree-toggle-btn");
  const menu = container.querySelector(".tree-dropdown-menu");
  const searchInput = container.querySelector(".tree-search");
  const treeList = container.querySelector(".tree-list");
  const labelSpan = container.querySelector(".selected-label");
  const hiddenInput = container.querySelector(`#${props.targetInputName}`);
  btn.addEventListener("click", () => {
    isOpen = !isOpen;
    menu.style.display = isOpen ? "block" : "none";
    if (isOpen) {
      renderList(props.departments || []);
      searchInput.focus();
    }
  });
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const filtered = filterTree(props.departments || [], query);
    renderList(filtered);
  });
  function filterTree(nodes, query) {
    if (!query) return nodes;
    return nodes.reduce((acc, node) => {
      const matches = node.name.toLowerCase().includes(query);
      const filteredChildren = node.children ? filterTree(node.children, query) : [];
      if (matches || filteredChildren.length > 0) {
        acc.push({ ...node, children: filteredChildren });
      }
      return acc;
    }, []);
  }
  function renderList(nodes, depth = 0) {
    if (depth === 0) treeList.innerHTML = "";
    nodes.forEach((node) => {
      const item = document.createElement("div");
      item.style.padding = "0.4rem 0.6rem";
      item.style.paddingLeft = `${depth * 1 + 0.6}rem`;
      item.style.fontSize = "0.8125rem";
      item.style.borderRadius = "var(--p-border-radius)";
      item.style.cursor = "pointer";
      item.style.display = "flex";
      item.style.alignItems = "center";
      item.style.justifyContent = "space-between";
      item.style.color = "var(--p-surface-700)";
      item.innerHTML = `
                <span>${node.name}</span>
                <span style="font-size: 0.6875rem; color: var(--p-surface-400); font-family: var(--p-font-mono);">${node.children?.length ? `${node.children.length} sub` : ""}</span>
            `;
      item.addEventListener("mouseenter", () => {
        item.style.backgroundColor = "var(--p-surface-100)";
      });
      item.addEventListener("mouseleave", () => {
        item.style.backgroundColor = "transparent";
      });
      item.addEventListener("click", (e) => {
        e.stopPropagation();
        hiddenInput.value = node.id;
        labelSpan.textContent = node.name;
        labelSpan.style.color = "var(--p-surface-950)";
        labelSpan.style.fontWeight = "600";
        isOpen = false;
        menu.style.display = "none";
      });
      treeList.appendChild(item);
      if (node.children?.length) {
        renderList(node.children, depth + 1);
      }
    });
  }
  document.addEventListener("click", (e) => {
    if (!container.contains(e.target)) {
      isOpen = false;
      menu.style.display = "none";
    }
  });
}
export {
  CascadeTreeIsland as default
};
//# sourceMappingURL=cascade-tree-K6NUHXUW.js.map
