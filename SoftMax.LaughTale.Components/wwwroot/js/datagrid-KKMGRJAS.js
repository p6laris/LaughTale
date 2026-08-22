// ../SoftMax.LaughTale.Client/src/components/datagrid.ts
function DataGridIsland(container, props) {
  let searchQuery = "";
  let sortField = props.columns[0]?.field || "";
  let sortAsc = true;
  let currentPage = 1;
  const pageSize = props.pageSize || 5;
  function render() {
    let filtered = props.data.filter((row) => {
      if (!searchQuery.trim()) return true;
      return Object.values(row).some(
        (val) => String(val).toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
    if (sortField) {
      filtered.sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];
        if (valA < valB) return sortAsc ? -1 : 1;
        if (valA > valB) return sortAsc ? 1 : -1;
        return 0;
      });
    }
    const totalPages = Math.ceil(filtered.length / pageSize) || 1;
    if (currentPage > totalPages) currentPage = totalPages;
    const startIdx = (currentPage - 1) * pageSize;
    const pageRows = filtered.slice(startIdx, startIdx + pageSize);
    const headerCells = props.columns.map((col) => `
            <th data-field="${col.field}" style="padding: 0.75rem 1rem; border-bottom: 1px solid var(--p-border-color); text-align: left; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--p-surface-500); cursor: ${col.sortable !== false ? "pointer" : "default"}; user-select: none;">
                <div style="display: flex; align-items: center; gap: 0.35rem;">
                    <span>${col.header}</span>
                    ${col.sortable !== false ? `<span style="font-size: 0.6875rem; color: ${sortField === col.field ? "var(--p-surface-950)" : "var(--p-surface-300)"};">${sortField === col.field ? sortAsc ? "\u25B2" : "\u25BC" : "\u2195"}</span>` : ""}
                </div>
            </th>
        `).join("");
    const rowCells = pageRows.map((row) => `
            <tr style="border-bottom: 1px solid var(--p-surface-100); transition: background 0.15s ease;">
                ${props.columns.map((col) => `
                    <td style="padding: 0.75rem 1rem; font-size: 0.8125rem; color: var(--p-surface-700);">
                        ${row[col.field] ?? ""}
                    </td>
                `).join("")}
            </tr>
        `).join("");
    container.innerHTML = `
            <div class="laughtale-datagrid" style="border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg); overflow: hidden; background: var(--p-surface-0);">
                <!-- Toolbar -->
                <div style="display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 0.875rem 1.25rem; background: var(--p-surface-50); border-bottom: 1px solid var(--p-border-color); flex-wrap: wrap;">
                    <div style="font-size: 0.9375rem; font-weight: 700; color: var(--p-surface-900);">
                        ${props.title || "Enterprise Records"}
                    </div>
                    <div style="position: relative;">
                        <input type="text" class="datagrid-search" placeholder="Search table..." value="${searchQuery}" style="padding: 0.4rem 0.75rem; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); font-size: 0.8125rem; width: 220px; outline: none; background: white;" />
                    </div>
                </div>

                <!-- Table -->
                <div style="overflow-x: auto;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead><tr style="background: var(--p-surface-50);">${headerCells}</tr></thead>
                        <tbody>${rowCells.length > 0 ? rowCells : `<tr><td colspan="${props.columns.length}" style="text-align: center; padding: 2rem; color: var(--p-surface-400); font-size: 0.875rem;">No matching records found.</td></tr>`}</tbody>
                    </table>
                </div>

                <!-- Pagination Footer -->
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1.25rem; background: var(--p-surface-50); border-top: 1px solid var(--p-border-color); font-size: 0.75rem; color: var(--p-surface-500);">
                    <div>Showing ${filtered.length > 0 ? startIdx + 1 : 0} to ${Math.min(startIdx + pageSize, filtered.length)} of ${filtered.length} entries</div>
                    <div style="display: flex; gap: 0.5rem;">
                        <button type="button" class="p-button p-button-secondary prev-page" ${currentPage === 1 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ""} style="padding: 0.25rem 0.6rem; font-size: 0.75rem;">Prev</button>
                        <span style="display: flex; align-items: center; padding: 0 0.5rem; font-weight: 600; color: var(--p-surface-900);">${currentPage} / ${totalPages}</span>
                        <button type="button" class="p-button p-button-secondary next-page" ${currentPage === totalPages ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ""} style="padding: 0.25rem 0.6rem; font-size: 0.75rem;">Next</button>
                    </div>
                </div>
            </div>
        `;
    const searchInput = container.querySelector(".datagrid-search");
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value;
      currentPage = 1;
      render();
      const updatedInput = container.querySelector(".datagrid-search");
      updatedInput.focus();
      updatedInput.setSelectionRange(searchQuery.length, searchQuery.length);
    });
    container.querySelectorAll("th[data-field]").forEach((th) => {
      th.addEventListener("click", () => {
        const field = th.getAttribute("data-field");
        if (sortField === field) {
          sortAsc = !sortAsc;
        } else {
          sortField = field;
          sortAsc = true;
        }
        render();
      });
    });
    container.querySelector(".prev-page")?.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        render();
      }
    });
    container.querySelector(".next-page")?.addEventListener("click", () => {
      if (currentPage < totalPages) {
        currentPage++;
        render();
      }
    });
  }
  render();
}
export {
  DataGridIsland as default
};
//# sourceMappingURL=datagrid-KKMGRJAS.js.map
