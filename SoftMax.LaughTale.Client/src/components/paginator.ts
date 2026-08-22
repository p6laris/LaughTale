import { LucideIcons } from '../icons/lucide';
import { injectIslandStyle } from '../runtime/styles';

export interface PaginatorProps {
    totalRecords: number;
    rows: number;
    first?: number;
    rowsPerPageOptions?: number[];
    compact?: boolean;
}

export default function PaginatorIsland(container: HTMLElement, props: PaginatorProps) {
    let first = props.first || 0;
    let rows = props.rows || 10;
    const totalRecords = props.totalRecords || 0;
    const options = props.rowsPerPageOptions || [10, 20, 50];
    const compact = props.compact || false;

    injectIslandStyle('paginator', `
        .laughtale-paginator {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.75rem 1rem;
            background: var(--p-surface-0);
            border: 1px solid var(--p-border-color);
            border-radius: var(--p-border-radius);
            font-family: var(--p-font-family, inherit);
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
            width: 2rem;
            height: 2rem;
            border-radius: var(--p-border-radius);
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
            box-shadow: 0 0 0 2px var(--p-primary-color);
        }
        .paginator-btn.active {
            background: var(--p-primary-color);
            color: var(--p-primary-contrast);
            font-weight: 600;
        }
        .paginator-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        .paginator-select {
            padding: 0.25rem 2rem 0.25rem 0.75rem;
            border-radius: var(--p-border-radius);
            border: 1px solid var(--p-border-color);
            background: var(--p-surface-0);
            color: var(--p-text-color);
            appearance: none;
            cursor: pointer;
            outline: none;
            transition: box-shadow 150ms ease;
        }
        .paginator-select:focus-visible {
            box-shadow: 0 0 0 2px var(--p-primary-color);
        }
        .paginator-info {
            font-size: 0.875rem;
            color: var(--p-text-muted-color);
        }
    `);

    function changePage(newFirst: number) {
        first = Math.max(0, Math.min(newFirst, totalRecords - 1));
        const page = Math.floor(first / rows);
        container.dispatchEvent(new CustomEvent('page-change', {
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

        const infoText = 'Showing ' + totalRecords ? first + 1 : 0 + '-\${Math.min(first + rows, totalRecords)} of \${totalRecords}';

        container.innerHTML = `
<div class="laughtale-paginator ' + compact ? 'compact' : '' + '">
                <div class="paginator-left">
                    <button class="paginator-btn btn-first" \${isFirst ? 'disabled' : ''} aria-label="First Page">
                        <span style="display:flex;">\${LucideIcons.chevronLeft}</span>
                    </button>
                    <button class="paginator-btn btn-prev" \${isFirst ? 'disabled' : ''} aria-label="Previous Page">
                        <span style="display:flex;">\${LucideIcons.chevronLeft}</span>
                    </button>
                    
                    <div class="paginator-pages">
                        \${pages.map(p => '
                            <button class="paginator-btn btn-page \${p === currentPage ? 'active' : ''}" data-page="\${p}">
                                \${p + 1}
                            </button>
                        ').join('')}
                    </div>

                    <button class="paginator-btn btn-next" ' + isLast ? 'disabled' : '' + ' aria-label="Next Page">
                        <span style="display:flex;">\${LucideIcons.chevronRight}</span>
                    </button>
                    <button class="paginator-btn btn-last" \${isLast ? 'disabled' : ''} aria-label="Last Page">
                        <span style="display:flex;">\${LucideIcons.chevronRight}</span>
                    </button>
                </div>

                <div class="paginator-right">
                    \${options.length > 0 ? '
                        <div style="position: relative;">
                            <select class="paginator-select">
                                \${options.map(opt => '<option value="' + opt + '" \${opt === rows ? 'selected' : ''}>\${opt}</option>').join('')}
                            </select>
                            <span style="position: absolute; right: 0.5rem; top: 50%; transform: translateY(-50%); pointer-events: none; width: 16px; height: 16px; color: var(--p-text-muted-color);">
                                \${LucideIcons.chevronDown}
                            </span>
                        </div>
                    ' : ''}
                    <span class="paginator-info">' + infoText + '</span>
                </div>
            </div>
`;

        bindEvents();
    }

    function bindEvents() {
        container.querySelector('.btn-first')?.addEventListener('click', () => changePage(0));
        container.querySelector('.btn-prev')?.addEventListener('click', () => changePage(first - rows));
        container.querySelector('.btn-next')?.addEventListener('click', () => changePage(first + rows));
        container.querySelector('.btn-last')?.addEventListener('click', () => changePage(Math.floor((totalRecords - 1) / rows) * rows));

        container.querySelectorAll('.btn-page').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const page = Number((e.currentTarget as HTMLElement).dataset.page);
                changePage(page * rows);
            });
        });

        const select = container.querySelector('.paginator-select') as HTMLSelectElement;
        if (select) {
            select.addEventListener('change', (e) => {
                rows = Number((e.target as HTMLSelectElement).value);
                changePage(0);
            });
        }
    }

    render();
}
