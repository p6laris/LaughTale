// Scripts/islands/cascade-tree.ts
function CascadeTreeIsland(container, props) {
  let selectedText = props.placeholder;
  let selectedValue = "";
  let isOpen = false;
  container.innerHTML = `
        <div class="relative w-full">
            <input type="hidden" name="${props.targetInputName}" id="${props.targetInputName}" value="" />
            <button type="button" class="tree-toggle-btn w-full p-3.5 bg-white border border-slate-300 rounded-xl text-left flex items-center justify-between shadow-sm hover:border-amber-500 transition">
                <span class="selected-label text-sm text-slate-700">${selectedText}</span>
                <span class="arrow text-xs text-slate-400">\u25BC</span>
            </button>
            <div class="tree-dropdown-menu hidden absolute top-full left-0 w-full mt-1.5 p-3 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 max-h-64 overflow-y-auto">
                <input type="text" placeholder="Search location..." class="tree-search w-full p-2 mb-2 bg-slate-50 border border-slate-200 rounded-lg text-xs" />
                <div class="tree-list space-y-1"></div>
            </div>
            <div class="mt-2">
                <span class="text-[11px] text-amber-600 font-medium inline-flex items-center gap-1">
                    <span class="w-2 h-2 rounded-full bg-amber-500"></span>
                    Hydrated on Scroll via <code>HydrateStrategy.Visible</code>
                </span>
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
    menu.classList.toggle("hidden", !isOpen);
    if (isOpen) {
      renderList(props.locations || []);
      searchInput.focus();
    }
  });
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const filtered = filterLocations(props.locations || [], query);
    renderList(filtered);
  });
  function filterLocations(nodes, query) {
    if (!query) return nodes;
    return nodes.reduce((acc, node) => {
      const matches = node.name.toLowerCase().includes(query);
      const filteredChildren = node.children ? filterLocations(node.children, query) : [];
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
      item.className = `p-2 rounded-lg text-xs hover:bg-amber-50 hover:text-amber-900 cursor-pointer flex items-center justify-between`;
      item.style.paddingLeft = `${depth * 16 + 8}px`;
      item.innerHTML = `<span>${node.name}</span><span class="text-[10px] text-slate-400 font-mono">${node.children?.length ? `${node.children.length} sub` : "\u2713"}</span>`;
      item.addEventListener("click", (e) => {
        e.stopPropagation();
        hiddenInput.value = node.id;
        labelSpan.textContent = node.name;
        labelSpan.classList.add("text-slate-900", "font-semibold");
        isOpen = false;
        menu.classList.add("hidden");
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
      menu.classList.add("hidden");
    }
  });
}
export {
  CascadeTreeIsland as default
};
//# sourceMappingURL=cascade-tree-GDP4OLP4.js.map
