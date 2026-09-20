import { resolvePart, applyPart, type PassthroughRecord } from '../runtime/parts';
import type { IslandContext } from '../runtime/registry';
import { injectIslandStyle } from '../runtime/styles';
import { emitComponentEvent } from '../runtime/events';
import { LucideIcons } from '../icons/lucide';
import { patchList } from '../runtime/list-patch';
import { html, setHtml, url as safeUrl, unsafe, attr, type Raw } from '../runtime/html';
import type { PatternDeclaration } from '../accessibility/patterns';

export const a11y: PatternDeclaration = {
    kind: 'native',
    element: 'button'
};

export interface DataViewItem {
    id?: string | number;
    name: string;
    category?: string;
    price?: number;
    rating?: number;
    inventoryStatus?: string;
    image?: string;
    code?: string;
    [key: string]: any;
}

export interface DataViewProps {
    value?: DataViewItem[];
    items?: DataViewItem[];
    layout?: 'list' | 'grid';
    paginator?: boolean;
    rows?: number;
    first?: number;
    rowsPerPageOptions?: number[];
    sortField?: string;
    sortOrder?: number; // 1 = asc, -1 = desc
    showLayoutSwitcher?: boolean;
    showSort?: boolean;
    loading?: boolean;
    title?: string;
    pt?: PassthroughRecord;
    studioOverrides?: Record<string, any>;
}

const DATAVIEW_CSS = `
.p-dataview {
    display: flex;
    flex-direction: column;
    width: 100%;
    font-family: var(--p-font-family, inherit);
    color: var(--lt-surface-800);
    background: var(--lt-surface-0);
    border: 1px solid var(--lt-surface-200);
    border-radius: var(--lt-radius-lg);
    overflow: hidden;
    box-shadow: var(--p-shadow-xs, 0 1px 2px 0 rgba(0, 0, 0, 0.05));
}

/* Header & Controls */
.p-dataview-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.25rem;
    background: var(--lt-surface-50);
    border-bottom: 1px solid var(--lt-surface-200);
    flex-wrap: wrap;
    gap: 0.75rem;
}

.p-dataview-title {
    font-size: 1rem;
    font-weight: 700;
    color: var(--lt-surface-900);
}

.p-dataview-controls {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
}

/* Layout Switcher */
.p-layout-switcher {
    display: inline-flex;
    border-radius: var(--lt-radius);
    border: 1px solid var(--lt-surface-300);
    background: var(--lt-surface-0);
    overflow: hidden;
}
.p-layout-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    padding: 0;
    border: none;
    background: transparent;
    cursor: pointer;
    color: var(--lt-surface-600);
    transition: all 0.15s ease;
}
.p-layout-btn:hover {
    background: var(--lt-surface-100);
    color: var(--lt-surface-900);
}
.p-layout-btn.p-active {
    background: var(--lt-primary-500);
    color: var(--lt-surface-0, var(--lt-surface-0));
}

/* Sort Select */
.p-dataview-sort-select {
    padding: 0.4rem 0.75rem;
    font-size: 0.8125rem;
    font-weight: 600;
    border-radius: var(--lt-radius);
    border: 1px solid var(--lt-surface-300);
    background: var(--lt-surface-0);
    color: var(--lt-surface-700);
    outline: none;
    cursor: pointer;
    transition: all 0.15s ease;
}
.p-dataview-sort-select:focus {
    border-color: var(--lt-primary-500);
    box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
}

/* Content Layouts */
.p-dataview-content {
    background: var(--lt-surface-0);
}

/* List Layout */
.p-dataview-list {
    display: flex;
    flex-direction: column;
}
.p-dataview-list-item {
    display: flex;
    flex-direction: column;
    padding: 1.5rem;
    gap: 1.25rem;
    border-top: 1px solid var(--lt-surface-200);
    transition: background-color 0.15s ease;
}
/* The first item never has a separator above it. Two selectors because patched (keyed) renders
   nest each item inside its own synthetic wrapper div (see patchList in runtime/list-patch.ts),
   while the loading skeleton renders items as flat direct children with no such wrapper - a plain
   :first-child on .p-dataview-list-item would incorrectly match every wrapped item (each is
   the sole/first child of its own wrapper), so the wrapper-aware rule must require the wrapper
   itself to be first, not the item. */
.p-dataview-list > .p-dataview-list-item:first-child,
.p-dataview-list > *:first-child > .p-dataview-list-item {
    border-top: none;
}
.p-dataview-list-item:hover {
    background: var(--lt-surface-50);
}

@media (min-width: 640px) {
    .p-dataview-list-item {
        flex-direction: row;
        align-items: center;
    }
}

.p-dataview-list-image-box {
    position: relative;
    width: 100%;
    max-width: 10rem;
    aspect-ratio: 4 / 3;
    border-radius: var(--lt-radius);
    background: var(--lt-surface-100);
    border: 1px solid var(--lt-surface-200);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--lt-primary-600);
    flex-shrink: 0;
    overflow: hidden;
}

.p-dataview-list-body {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
    gap: 1.25rem;
}
@media (min-width: 768px) {
    .p-dataview-list-body {
        flex-direction: row;
        align-items: center;
    }
}

.p-dataview-item-info {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}
.p-dataview-item-category {
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--lt-surface-500);
}
.p-dataview-item-name {
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--lt-surface-900);
}

/* Rating Badge */
.p-dataview-rating-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.25rem 0.6rem;
    border-radius: 9999px;
    background: var(--lt-surface-0);
    border: 1px solid var(--lt-surface-200);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    font-size: 0.8125rem;
    font-weight: 700;
    color: var(--lt-surface-900);
    width: fit-content;
}
.p-rating-star {
    color: var(--lt-warn-500, var(--lt-warn-500));
    display: flex;
    align-items: center;
}

.p-dataview-list-actions {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
}
@media (min-width: 768px) {
    .p-dataview-list-actions {
        align-items: flex-end;
    }
}

.p-dataview-price {
    font-size: 1.35rem;
    font-weight: 700;
    color: var(--lt-surface-900);
}

.p-dataview-btn-group {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.p-dataview-btn-buy {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: var(--lt-radius);
    background: var(--lt-primary-500);
    color: var(--lt-surface-0, var(--lt-surface-0));
    font-weight: 600;
    font-size: 0.8125rem;
    border: none;
    cursor: pointer;
    transition: all 0.15s ease;
    white-space: nowrap;
}
.p-dataview-btn-buy:hover:not(:disabled) {
    background: var(--lt-primary-600);
}
.p-dataview-btn-buy:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: var(--lt-surface-400);
}

.p-dataview-btn-wishlist {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    border-radius: var(--lt-radius);
    border: 1px solid var(--lt-surface-300);
    background: var(--lt-surface-0);
    color: var(--lt-surface-700);
    cursor: pointer;
    transition: all 0.15s ease;
}
.p-dataview-btn-wishlist:hover {
    border-color: var(--lt-danger-500, var(--lt-danger-500));
    color: var(--lt-danger-500, var(--lt-danger-500));
    background: var(--lt-danger-50);
}
.p-dataview-btn-wishlist.p-wishlisted {
    background: var(--lt-danger-500, var(--lt-danger-500));
    border-color: var(--lt-danger-500, var(--lt-danger-500));
    color: var(--lt-surface-0, var(--lt-surface-0));
}

/* Grid Layout */
.p-dataview-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.25rem;
    padding: 1.25rem;
}

.p-dataview-grid-card {
    display: flex;
    flex-direction: column;
    border: 1px solid var(--lt-surface-200);
    border-radius: var(--lt-radius-lg);
    background: var(--lt-surface-0);
    padding: 1.25rem;
    transition: all 0.2s ease;
}
.p-dataview-grid-card:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04);
    transform: translateY(-2px);
}

.p-dataview-grid-image-box {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 10;
    border-radius: var(--lt-radius);
    background: var(--lt-surface-50);
    border: 1px solid var(--lt-surface-200);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--lt-primary-600);
    overflow: hidden;
    margin-bottom: 1.25rem;
}

.p-dataview-grid-body {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    flex: 1;
    justify-content: space-between;
}

/* Status Tags */
.p-dataview .p-dataview-list-image-box .p-tag,
.p-dataview .p-dataview-grid-image-box .p-tag {
    position: absolute;
    top: 0.5rem;
    inset-inline-start: 0.5rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.25rem 0.55rem;
    border-radius: 9999px;
    font-size: 0.6875rem;
    font-weight: 700;
    line-height: 1;
    letter-spacing: 0.02em;
    text-transform: capitalize;
    z-index: 2;
}
.p-dataview .p-tag-success { background: var(--lt-success-100, var(--lt-success-100)); color: var(--lt-success-700, var(--lt-success-700)); }
.p-dataview .p-tag-warn { background: var(--lt-warn-100, var(--lt-warn-100)); color: var(--lt-warn-700, var(--lt-warn-700)); }
.p-dataview .p-tag-danger { background: var(--lt-danger-100, var(--lt-danger-100)); color: var(--lt-danger-700, var(--lt-danger-700)); }

/* Skeleton Shimmer */
.p-skeleton {
    border-radius: 4px;
    background: linear-gradient(90deg, var(--lt-surface-200) 25%, var(--lt-surface-100) 50%, var(--lt-surface-200) 75%);
    background-size: 200% 100%;
    animation: p-skeleton-shimmer 1.5s infinite;
}
@keyframes p-skeleton-shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}

/* Paginator Integration */
.p-dataview-paginator {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1.25rem;
    background: var(--lt-surface-0);
    border-top: 1px solid var(--lt-surface-200);
    font-size: 0.8125rem;
    color: var(--lt-surface-600);
    flex-wrap: wrap;
    gap: 0.75rem;
}
.p-paginator-pages {
    display: flex;
    align-items: center;
    gap: 0.25rem;
}
.p-paginator-page, .p-paginator-nav {
    min-width: 2rem;
    height: 2rem;
    padding: 0 0.5rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--lt-radius);
    border: 1px solid transparent;
    background: transparent;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.8125rem;
    color: var(--lt-surface-700);
    transition: all 0.15s ease;
}
.p-paginator-page:hover:not(:disabled), .p-paginator-nav:hover:not(:disabled) {
    background: var(--lt-surface-100);
    color: var(--lt-surface-900);
}
.p-paginator-page.p-paginator-page-active {
    background: var(--p-primary-color, var(--lt-primary-500, #10b981)) !important;
    color: var(--p-primary-contrast-color, #ffffff) !important;
    font-weight: 700;
}
.p-paginator-page.p-paginator-page-active:hover {
    background: var(--p-primary-hover-color, var(--lt-primary-600, #059669)) !important;
}
.p-paginator-page:disabled, .p-paginator-nav:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

/* Dark Mode Tokens */
html.dark .p-dataview,
[data-theme="dark"] .p-dataview,
.dark .p-dataview {
    background: var(--p-surface-0) !important;
    color: var(--p-text-color) !important;
    border-color: var(--p-border-color) !important;
}
html.dark .p-dataview-header,
html.dark .p-dataview-paginator,
[data-theme="dark"] .p-dataview-header,
[data-theme="dark"] .p-dataview-paginator,
.dark .p-dataview-header,
.dark .p-dataview-paginator {
    background: var(--p-surface-50) !important;
    border-color: var(--p-border-color) !important;
    color: var(--p-text-color) !important;
}
html.dark .p-dataview-content,
[data-theme="dark"] .p-dataview-content,
.dark .p-dataview-content {
    background: var(--p-surface-0) !important;
}
html.dark .p-dataview-list-item,
[data-theme="dark"] .p-dataview-list-item,
.dark .p-dataview-list-item {
    border-color: var(--p-border-color) !important;
}
html.dark .p-dataview-list-item:hover,
[data-theme="dark"] .p-dataview-list-item:hover,
.dark .p-dataview-list-item:hover {
    background: var(--p-surface-100) !important;
}
html.dark .p-dataview-grid-card,
[data-theme="dark"] .p-dataview-grid-card,
.dark .p-dataview-grid-card {
    background: var(--p-surface-0) !important;
    border-color: var(--p-border-color) !important;
}
html.dark .p-dataview-grid-image-box,
html.dark .p-dataview-list-image-box,
[data-theme="dark"] .p-dataview-grid-image-box,
[data-theme="dark"] .p-dataview-list-image-box,
.dark .p-dataview-grid-image-box,
.dark .p-dataview-list-image-box {
    background: var(--p-surface-100) !important;
    border-color: var(--p-border-color) !important;
}
html.dark .p-layout-switcher,
html.dark .p-dataview-sort-select,
html.dark .p-dataview-btn-wishlist,
[data-theme="dark"] .p-layout-switcher,
[data-theme="dark"] .p-dataview-sort-select,
[data-theme="dark"] .p-dataview-btn-wishlist,
.dark .p-layout-switcher,
.dark .p-dataview-sort-select,
.dark .p-dataview-btn-wishlist {
    background: var(--p-surface-100) !important;
    border-color: var(--p-border-color) !important;
    color: var(--p-text-color) !important;
}
html.dark .p-dataview-item-name,
html.dark .p-dataview-price,
html.dark .p-dataview-title,
[data-theme="dark"] .p-dataview-item-name,
[data-theme="dark"] .p-dataview-price,
[data-theme="dark"] .p-dataview-title,
.dark .p-dataview-item-name,
.dark .p-dataview-price,
.dark .p-dataview-title {
    color: var(--p-text-color) !important;
}
html.dark .p-dataview-rating-pill,
[data-theme="dark"] .p-dataview-rating-pill,
.dark .p-dataview-rating-pill {
    background: var(--p-surface-100) !important;
    border-color: var(--p-border-color) !important;
    color: var(--p-text-color) !important;
}
`;

export default function DataViewIsland(container: HTMLElement, props: DataViewProps, ctx?: IslandContext) {
    injectIslandStyle('dataview', DATAVIEW_CSS);

    const rawItems: DataViewItem[] = [...(props.value || props.items || [])];
    let currentLayout: 'list' | 'grid' = props.layout || 'list';
    const paginator = !!props.paginator;
    let rowsPerPage = props.rows || 5;
    let currentPage = Math.floor((props.first || 0) / rowsPerPage) + 1;
    const rowsPerPageOptions = props.rowsPerPageOptions || [5, 10, 20];
    let sortField = props.sortField;
    let sortOrder = props.sortOrder ?? 1;
    const showLayoutSwitcher = !!props.showLayoutSwitcher;
    const showSort = !!props.showSort;
    const loading = !!props.loading;

    const wishlistedIds = new Set<any>();

    function getSeverityTag(status?: string): Raw | string {
        const s = (status || '').toUpperCase();
        if (s === 'INSTOCK' || s === 'QUALIFIED') return html`<span class="p-tag p-tag-success" data-part="root">In Stock</span>`;
        if (s === 'LOWSTOCK' || s === 'NEGOTIATION') return html`<span class="p-tag p-tag-warn">Low Stock</span>`;
        if (s === 'OUTOFSTOCK' || s === 'UNQUALIFIED') return html`<span class="p-tag p-tag-danger">Out of Stock</span>`;
        return s ? html`<span class="p-tag p-tag-success">${s}</span>` : '';
    }

    const hasHeader = props.title || showLayoutSwitcher || showSort;

    function renderHeaderHtml(): Raw | '' {
        if (!hasHeader) return '';
        return html`
            <div class="p-dataview-header">
                <div class="p-dataview-title">${props.title || ''}</div>
                <div class="p-dataview-controls">
                    ${showSort ? html`
                        <select class="p-dataview-sort-select" aria-label="Sort by price">
                            <option value="" ${!sortField ? 'selected' : ''}>Sort by Price...</option>
                            <option value="lowtohigh" ${sortField === 'price' && sortOrder === 1 ? 'selected' : ''}>Price Low to High</option>
                            <option value="hightolow" ${sortField === 'price' && sortOrder === -1 ? 'selected' : ''}>Price High to Low</option>
                        </select>
                    ` : ''}

                    ${showLayoutSwitcher ? html`
                        <div class="p-layout-switcher">
                            <button type="button" class="p-layout-btn btn-layout-list ${currentLayout === 'list' ? 'p-active' : ''}" title="List View" aria-label="List View">
                                ${unsafe(LucideIcons.list)}
                            </button>
                            <button type="button" class="p-layout-btn btn-layout-grid ${currentLayout === 'grid' ? 'p-active' : ''}" title="Grid View" aria-label="Grid View">
                                ${unsafe(LucideIcons.layoutGrid)}
                            </button>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    function renderSkeletonHtml(): Raw {
        if (currentLayout === 'list') {
            return html`
                <div class="p-dataview-list">
                    ${Array.from({ length: rowsPerPage }).map(() => html`
                        <div class="p-dataview-list-item">
                            <div class="p-skeleton p-dataview-list-image-box" style="height: 6.5rem;"></div>
                            <div class="p-dataview-list-body">
                                <div class="p-dataview-item-info" style="gap: 0.75rem;">
                                    <div class="p-skeleton" style="width: 6rem; height: 1rem;"></div>
                                    <div class="p-skeleton" style="width: 12rem; height: 1.5rem;"></div>
                                    <div class="p-skeleton" style="width: 4rem; height: 1.5rem; border-radius: 9999px;"></div>
                                </div>
                                <div class="p-dataview-list-actions" style="gap: 0.75rem;">
                                    <div class="p-skeleton" style="width: 5rem; height: 1.5rem;"></div>
                                    <div style="display: flex; gap: 0.5rem;">
                                        <div class="p-skeleton" style="width: 2.25rem; height: 2.25rem; border-radius: 6px;"></div>
                                        <div class="p-skeleton" style="width: 6rem; height: 2.25rem; border-radius: 6px;"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `)}
                </div>
            `;
        }
        return html`
            <div class="p-dataview-grid">
                ${Array.from({ length: 6 }).map(() => html`
                    <div class="p-dataview-grid-card">
                        <div class="p-skeleton p-dataview-grid-image-box" style="height: 10rem;"></div>
                        <div class="p-dataview-grid-body">
                            <div style="display: flex; justify-content: space-between;">
                                <div class="p-skeleton" style="width: 5rem; height: 1rem;"></div>
                                <div class="p-skeleton" style="width: 3rem; height: 1.25rem; border-radius: 9999px;"></div>
                            </div>
                            <div class="p-skeleton" style="width: 9rem; height: 1.5rem;"></div>
                            <div class="p-skeleton" style="width: 4rem; height: 1.5rem;"></div>
                            <div style="display: flex; gap: 0.5rem;">
                                <div class="p-skeleton" style="flex: 1; height: 2.25rem; border-radius: 6px;"></div>
                                <div class="p-skeleton" style="width: 2.25rem; height: 2.25rem; border-radius: 6px;"></div>
                            </div>
                        </div>
                    </div>
                `)}
            </div>
        `;
    }

    function getItemKey(item: DataViewItem): string {
        return String(item.id || item.name);
    }

    function renderListItemInner(item: DataViewItem): string {
        const isWishlisted = wishlistedIds.has(item.id || item.name);
        const isOutOfStock = (item.inventoryStatus || '').toUpperCase() === 'OUTOFSTOCK';
        return html`
            <div class="p-dataview-list-item" data-id="${item.id || item.name}">
                <div class="p-dataview-list-image-box">
                    ${getSeverityTag(item.inventoryStatus)}
                    <div style="font-size: 2.5rem;">${unsafe(LucideIcons.package)}</div>
                </div>
                <div class="p-dataview-list-body">
                    <div class="p-dataview-item-info">
                        <span class="p-dataview-item-category">${item.category || 'General'}</span>
                        <div class="p-dataview-item-name">${item.name}</div>
                        <div class="p-dataview-rating-pill">
                            <span>${item.rating ?? 5}</span>
                            <span class="p-rating-star">★</span>
                        </div>
                    </div>
                    <div class="p-dataview-list-actions">
                        <span class="p-dataview-price">$${item.price ?? 0}</span>
                        <div class="p-dataview-btn-group">
                            <button type="button" class="p-dataview-btn-wishlist ${isWishlisted ? 'p-wishlisted' : ''}" data-id="${item.id || item.name}" title="Wishlist" aria-label="Wishlist">
                                ${unsafe(LucideIcons.heart)}
                            </button>
                            <button type="button" class="p-dataview-btn-buy" data-id="${item.id || item.name}" ${isOutOfStock ? 'disabled' : ''}>
                                <span>${unsafe(LucideIcons.shoppingCart)}</span>
                                <span>${isOutOfStock ? 'Out of Stock' : 'Buy Now'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `.value;
    }

    function renderGridItemInner(item: DataViewItem): string {
        const isWishlisted = wishlistedIds.has(item.id || item.name);
        const isOutOfStock = (item.inventoryStatus || '').toUpperCase() === 'OUTOFSTOCK';
        return html`
            <div class="p-dataview-grid-card" data-id="${item.id || item.name}">
                <div class="p-dataview-grid-image-box">
                    ${getSeverityTag(item.inventoryStatus)}
                    <div style="font-size: 3.5rem;">${unsafe(LucideIcons.package)}</div>
                </div>
                <div class="p-dataview-grid-body">
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                        <span class="p-dataview-item-category">${item.category || 'General'}</span>
                        <div class="p-dataview-rating-pill">
                            <span>${item.rating ?? 5}</span>
                            <span class="p-rating-star">★</span>
                        </div>
                    </div>
                    <div class="p-dataview-item-name" style="font-size: 1rem;">${item.name}</div>
                    <div class="p-dataview-price" style="font-size: 1.5rem;">$${item.price ?? 0}</div>
                    <div style="display: flex; gap: 0.5rem; align-items: center;">
                        <button type="button" class="p-dataview-btn-buy" style="flex: 1; justify-content: center;" data-id="${item.id || item.name}" ${isOutOfStock ? 'disabled' : ''}>
                            <span>${unsafe(LucideIcons.shoppingCart)}</span>
                            <span>${isOutOfStock ? 'Out of Stock' : 'Buy Now'}</span>
                        </button>
                        <button type="button" class="p-dataview-btn-wishlist ${isWishlisted ? 'p-wishlisted' : ''}" data-id="${item.id || item.name}" title="Wishlist" aria-label="Wishlist">
                            ${unsafe(LucideIcons.heart)}
                        </button>
                    </div>
                </div>
            </div>
        `.value;
    }

    function renderPaginatorHtml(totalRecords: number, totalPages: number, firstIdx: number): Raw {
        const startRecord = totalRecords > 0 ? firstIdx + 1 : 0;
        const endRecord = Math.min(firstIdx + rowsPerPage, totalRecords);
        const reportStr = `Showing ${startRecord} to ${endRecord} of ${totalRecords} entries`;

        const pageButtons: Raw[] = [];
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);
        if (endPage - startPage < 4) startPage = Math.max(1, endPage - 4);

        for (let p = startPage; p <= endPage; p++) {
            pageButtons.push(html`
                <button type="button" class="p-paginator-page ${p === currentPage ? 'p-paginator-page-active' : ''}" data-page="${p}">
                    ${p}
                </button>
            `);
        }

        return html`
            <div class="p-dataview-paginator">
                <span>${reportStr}</span>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <button type="button" class="p-paginator-nav p-first" data-page="1" ${currentPage === 1 ? 'disabled' : ''} aria-label="First Page">«</button>
                    <button type="button" class="p-paginator-nav p-prev" data-page="${currentPage - 1}" ${currentPage === 1 ? 'disabled' : ''} aria-label="Previous Page">‹</button>
                    <div class="p-paginator-pages">${pageButtons}</div>
                    <button type="button" class="p-paginator-nav p-next" data-page="${currentPage + 1}" ${currentPage === totalPages ? 'disabled' : ''} aria-label="Next Page">›</button>
                    <button type="button" class="p-paginator-nav p-last" data-page="${totalPages}" ${currentPage === totalPages ? 'disabled' : ''} aria-label="Last Page">»</button>
                </div>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span>Rows per page:</span>
                    <select class="p-dataview-rows-select" aria-label="Rows per page" style="padding: 0.25rem 0.5rem; border-radius: 4px; border: 1px solid var(--lt-surface-300); background: var(--lt-surface-0); color: inherit; font-size: 0.8125rem;">
                        ${rowsPerPageOptions.map(opt => html`<option value="${opt}" ${opt === rowsPerPage ? 'selected' : ''}>${opt}</option>`)}
                    </select>
                </div>
            </div>
        `;
    }

    // Persistent shell references, populated once by mountShell(). Only the content slot's inner
    // list/grid container is fed through patchList across renders; header and paginator are cheap
    // enough to fully re-render every time (see render() below) since neither needs to animate.
    let headerSlot!: HTMLElement;
    let contentSlot!: HTMLElement;
    let paginatorSlot!: HTMLElement;
    let listContainerEl: HTMLElement | null = null;
    let mountedContentMode: 'list' | 'grid' | 'loading' | null = null;

    function mountShell() {
        setHtml(container, html`
            <div class="p-dataview p-component">
                <div class="p-dataview-header-slot"></div>
                <div class="p-dataview-content"></div>
                <div class="p-dataview-paginator-slot"></div>
            </div>
        `);
        const root = container.firstElementChild as HTMLElement;
        headerSlot = root.querySelector<HTMLElement>('.p-dataview-header-slot')!;
        contentSlot = root.querySelector<HTMLElement>('.p-dataview-content')!;
        paginatorSlot = root.querySelector<HTMLElement>('.p-dataview-paginator-slot')!;
        bindStaticEvents();
    }

    // Bound once (not per-render) via event delegation on the persistent slot elements, so
    // `patchList`-reused item nodes never accumulate duplicate listeners across renders.
    function bindStaticEvents() {
        headerSlot.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            if (target.closest('.btn-layout-list')) {
                currentLayout = 'list';
                render();
            } else if (target.closest('.btn-layout-grid')) {
                currentLayout = 'grid';
                render();
            }
        }, { signal: ctx?.signal });

        headerSlot.addEventListener('change', (e) => {
            const el = e.target as HTMLElement;
            if (!el.classList.contains('p-dataview-sort-select')) return;
            const val = (el as HTMLSelectElement).value;
            if (val === 'lowtohigh') {
                sortField = 'price';
                sortOrder = 1;
            } else if (val === 'hightolow') {
                sortField = 'price';
                sortOrder = -1;
            } else {
                sortField = undefined;
            }
            render();
        }, { signal: ctx?.signal });

        contentSlot.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            const wishlistBtn = target.closest<HTMLButtonElement>('.p-dataview-btn-wishlist');
            if (wishlistBtn) {
                e.stopPropagation();
                const id = wishlistBtn.getAttribute('data-id');
                if (!id) return;
                if (wishlistedIds.has(id)) wishlistedIds.delete(id);
                else wishlistedIds.add(id);
                wishlistBtn.classList.toggle('p-wishlisted');
                emitComponentEvent(container, 'dataview', 'wishlist-toggle', {
                    id,
                    isWishlisted: wishlistedIds.has(id)
                });
                return;
            }
            const buyBtn = target.closest<HTMLButtonElement>('.p-dataview-btn-buy');
            if (buyBtn) {
                e.stopPropagation();
                const id = buyBtn.getAttribute('data-id');
                const matched = rawItems.find(it => String(it.id || it.name) === String(id));
                emitComponentEvent(container, 'dataview', 'buy-now', {
                    item: matched
                });
            }
        }, { signal: ctx?.signal });

        paginatorSlot.addEventListener('click', (e) => {
            const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('.p-paginator-page, .p-paginator-nav');
            if (!btn) return;
            const targetPage = Number(btn.getAttribute('data-page'));
            if (!isNaN(targetPage) && targetPage > 0) {
                currentPage = targetPage;
                render();
            }
        }, { signal: ctx?.signal });

        paginatorSlot.addEventListener('change', (e) => {
            const el = e.target as HTMLElement;
            if (!el.classList.contains('p-dataview-rows-select')) return;
            rowsPerPage = Number((el as HTMLSelectElement).value);
            currentPage = 1;
            render();
        }, { signal: ctx?.signal });
    }

    function render() {
        if (!headerSlot) mountShell();

        // 1. Sort Items
        const sortedItems = [...rawItems];
        if (sortField) {
            sortedItems.sort((a, b) => {
                const valA = a[sortField!];
                const valB = b[sortField!];
                if (valA === valB) return 0;
                if (valA == null) return 1;
                if (valB == null) return -1;
                const res = typeof valA === 'number' && typeof valB === 'number'
                    ? valA - valB
                    : String(valA).localeCompare(String(valB));
                return res * sortOrder;
            });
        }

        // 2. Paginate Items
        const totalRecords = sortedItems.length;
        const totalPages = Math.ceil(totalRecords / rowsPerPage) || 1;
        if (currentPage > totalPages) currentPage = totalPages;
        if (currentPage < 1) currentPage = 1;
        const firstIdx = (currentPage - 1) * rowsPerPage;
        const displayItems = paginator ? sortedItems.slice(firstIdx, firstIdx + rowsPerPage) : sortedItems;

        // Header: cheap, fully replaced every render (no animation needed here).
        setHtml(headerSlot, renderHeaderHtml());

        // Content: the list/grid container itself persists across renders (recreated only when
        // switching layout or in/out of the loading skeleton, neither of which needs to animate);
        // items within it are reconciled via patchList's animated (WAAPI enter/move/exit) path.
        if (loading) {
            listContainerEl = null;
            mountedContentMode = 'loading';
            setHtml(contentSlot, renderSkeletonHtml());
        } else {
            if (!listContainerEl || mountedContentMode !== currentLayout) {
                const wrapperClass = currentLayout === 'list' ? 'p-dataview-list' : 'p-dataview-grid';
                setHtml(contentSlot, html`<div class="${wrapperClass}"></div>`);
                listContainerEl = contentSlot.firstElementChild as HTMLElement;
                mountedContentMode = currentLayout;
            }
            patchList(
                listContainerEl,
                displayItems,
                getItemKey,
                currentLayout === 'list' ? renderListItemInner : renderGridItemInner,
                { preset: 'fade', duration: 200 }
            );
        }

        // Paginator: cheap, fully replaced every render.
        setHtml(paginatorSlot, paginator ? renderPaginatorHtml(totalRecords, totalPages, firstIdx) : '');
    }

    render();
}
