import {
  LucideIcons
} from "./chunk-C4P5FSS5.js";
import {
  injectIslandStyle
} from "./chunk-3TFPN5JM.js";

// ../SoftMax.LaughTale.Client/src/components/paginator.ts
var CSS = `
.laughtale-paginator {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1rem;
    background: var(--p-surface-0);
    border: 1px solid var(--p-border-color, var(--p-surface-200));
    border-radius: var(--p-border-radius, 0.5rem);
    font-family: inherit;
    color: var(--p-text-color);
    gap: 1rem;
    flex-wrap: wrap;
}
.paginator-left, .paginator-right {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}
.paginator-pages {
    display: flex;
    align-items: center;
    gap: 0.25rem;
}
.paginator-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 2rem;
    height: 2rem;
    padding: 0 0.25rem;
    border-radius: var(--p-border-radius, 0.5rem);
    border: 1px solid transparent;
    background: transparent;
    color: var(--p-text-color);
    cursor: pointer;
    transition: all 150ms ease;
    font-size: 0.875rem;
}
.paginator-btn:hover:not(:disabled) {
    background: var(--p-surface-100);
}
.paginator-btn:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px var(--p-primary-500);
}
.paginator-btn.active {
    background: var(--p-primary-500);
    color: white;
    font-weight: 600;
}
.paginator-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}
.paginator-select {
    padding: 0.25rem 2rem 0.25rem 0.75rem;
    border-radius: var(--p-border-radius, 0.5rem);
    border: 1px solid var(--p-border-color, var(--p-surface-200));
    background: var(--p-surface-0);
    color: var(--p-text-color);
    appearance: none;
    cursor: pointer;
    outline: none;
    font-size: 0.875rem;
}
.paginator-info {
    font-size: 0.875rem;
    color: var(--p-surface-500);
}
[data-theme="dark"] .laughtale-paginator {
    background: var(--p-surface-900);
    border-color: var(--p-surface-700);
    color: var(--p-surface-100);
}
[data-theme="dark"] .paginator-btn {
    color: var(--p-surface-200);
}
[data-theme="dark"] .paginator-btn:hover:not(:disabled) {
    background: var(--p-surface-800);
}
[data-theme="dark"] .paginator-btn.active {
    background: var(--p-primary-500);
    color: white;
}
[data-theme="dark"] .paginator-select {
    background: var(--p-surface-800);
    border-color: var(--p-surface-600);
    color: var(--p-surface-100);
}
`;
function PaginatorIsland(container, props) {
  injectIslandStyle("paginator", CSS);
  let first = props.first || 0;
  let rows = props.rows || 10;
  const totalRecords = props.totalRecords || 0;
  const options = props.rowsPerPageOptions || [10, 20, 50];
  const compact = props.compact || false;
  function changePage(newFirst) {
    first = Math.max(0, Math.min(newFirst, totalRecords - 1));
    const page = Math.floor(first / rows);
    container.dispatchEvent(new CustomEvent("page-change", {
      detail: { first, rows, page },
      bubbles: true
    }));
    render();
  }
  function render() {
    const pageCount = Math.ceil(totalRecords / rows) || 1;
    const currentPage = Math.floor(first / rows);
    let startPage = Math.max(0, currentPage - 2);
    let endPage = Math.min(pageCount - 1, startPage + 4);
    if (endPage - startPage < 4) {
      startPage = Math.max(0, endPage - 4);
    }
    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    const isFirst = currentPage === 0;
    const isLast = currentPage >= pageCount - 1;
    const showFrom = totalRecords > 0 ? first + 1 : 0;
    const showTo = Math.min(first + rows, totalRecords);
    const infoText = "Showing " + showFrom + "-" + showTo + " of " + totalRecords;
    const pagesHtml = pages.map(
      (p) => '<button class="paginator-btn btn-page ' + (p === currentPage ? "active" : "") + '" data-page="' + p + '">' + (p + 1) + "</button>"
    ).join("");
    const optionsHtml = options.length > 0 ? '<select class="paginator-select">' + options.map((opt) => '<option value="' + opt + '"' + (opt === rows ? " selected" : "") + ">" + opt + "</option>").join("") + "</select>" : "";
    container.innerHTML = '<div class="laughtale-paginator' + (compact ? " compact" : "") + '"><div class="paginator-left"><button class="paginator-btn btn-first"' + (isFirst ? " disabled" : "") + ' aria-label="First Page"><span style="display:flex;">' + LucideIcons.chevronsLeft + '</span></button><button class="paginator-btn btn-prev"' + (isFirst ? " disabled" : "") + ' aria-label="Previous Page"><span style="display:flex;">' + LucideIcons.chevronLeft + '</span></button><div class="paginator-pages">' + pagesHtml + '</div><button class="paginator-btn btn-next"' + (isLast ? " disabled" : "") + ' aria-label="Next Page"><span style="display:flex;">' + LucideIcons.chevronRight + '</span></button><button class="paginator-btn btn-last"' + (isLast ? " disabled" : "") + ' aria-label="Last Page"><span style="display:flex;">' + LucideIcons.chevronsRight + '</span></button></div><div class="paginator-right">' + optionsHtml + '<span class="paginator-info">' + infoText + "</span></div></div>";
    bindEvents();
  }
  function bindEvents() {
    container.querySelector(".btn-first")?.addEventListener("click", () => changePage(0));
    container.querySelector(".btn-prev")?.addEventListener("click", () => changePage(first - rows));
    container.querySelector(".btn-next")?.addEventListener("click", () => changePage(first + rows));
    container.querySelector(".btn-last")?.addEventListener("click", () => changePage(Math.floor((totalRecords - 1) / rows) * rows));
    container.querySelectorAll(".btn-page").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const page = Number(e.currentTarget.dataset.page);
        changePage(page * rows);
      });
    });
    const select = container.querySelector(".paginator-select");
    if (select) {
      select.addEventListener("change", (e) => {
        rows = Number(e.target.value);
        changePage(0);
      });
    }
  }
  render();
}
export {
  PaginatorIsland as default
};
//# sourceMappingURL=paginator-5OR37WBO.js.map
