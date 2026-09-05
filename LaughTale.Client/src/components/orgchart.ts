/**
 * LaughTale: Enterprise OrganizationChart Component (Aura Design System compliant)
 * Precision table-based hierarchical tree with collapsible branches,
 * single/multiple/checkbox selection modes, custom node templates, and accessible keyboard navigation.
 */

import { OrgChartNode } from '../types/models';
import { injectIslandStyle } from '../runtime/styles';
import { emitComponentEvent } from '../runtime/events';
import { resolvePart, applyPart, type PassthroughRecord } from '../runtime/parts';
import type { IslandContext } from '../runtime/registry';
import { html, setHtml, url as safeUrl, unsafe, attr, type Raw } from '../runtime/html';
import type { PatternDeclaration } from '../accessibility/patterns';
import { useFormField } from '../composables/useFormField';

export const a11y: PatternDeclaration = {
    kind: 'pattern',
    pattern: 'tree'
};

export interface OrgChartProps<T = any> {
    name?: string;
    value?: OrgChartNode<T>;
    root?: OrgChartNode<T>;
    collapsible?: boolean;
    selectionMode?: 'none' | 'single' | 'multiple' | 'checkbox';
    selectionKeys?: string[] | Record<string, boolean>;
    collapsedKeys?: string[] | Record<string, boolean>;
    toggleIcon?: 'chevron' | 'plusMinus';
    targetInputName?: string;
    pt?: PassthroughRecord;
    studioOverrides?: Record<string, any>;
}

const ORGCHART_CSS = `
.p-organizationchart {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    overflow-x: auto;
    font-family: var(--p-font-family, inherit);
    padding: 1.5rem 0.5rem;
    color: var(--lt-surface-800);
}

.p-organizationchart-table {
    border-collapse: separate;
    border-spacing: 0;
    margin: 0 auto;
    table-layout: fixed;
    width: 100%;
}

.p-organizationchart-node-cell {
    text-align: center;
    vertical-align: top;
    padding: 0 0.5rem;
}

.p-organizationchart-node {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
    background: var(--lt-surface-0);
    border: 1px solid var(--lt-surface-200);
    border-radius: var(--lt-radius-lg);
    padding: 0.75rem 1.25rem;
    min-width: 9.5rem;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    transition: background-color 0.12s ease, border-color 0.12s ease, color 0.12s ease, box-shadow 0.12s ease;
    user-select: none;
    overflow: visible !important;
}

.p-organizationchart-node.p-organizationchart-selectable {
    cursor: pointer;
}
.p-organizationchart-node.p-organizationchart-selectable:hover:not(.p-highlight) {
    background: var(--lt-surface-50);
    border-color: var(--lt-surface-300);
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.p-organizationchart-node.p-highlight {
    background: rgba(16, 185, 129, 0.08) !important;
    border-color: var(--lt-primary-500) !important;
    color: var(--lt-primary-700) !important;
    font-weight: 600;
}

/* Connector Lines */
.p-organizationchart-lines {
    height: 20px;
}
.p-organizationchart-lines td {
    height: 20px;
    padding: 0 !important;
    margin: 0 !important;
    font-size: 0 !important;
    line-height: 0 !important;
    box-sizing: border-box;
}

.p-organizationchart-line-down {
    width: 1px;
    height: 20px;
    background-color: var(--lt-surface-300);
    margin: 0 auto;
}

.p-organizationchart-line-left {
    border-right: 1px solid var(--lt-surface-300);
}

.p-organizationchart-line-right {
    /* Transparent vertical seam */
}

.p-organizationchart-line-top {
    border-top: 1px solid var(--lt-surface-300);
}

/* Toggle / Collapse Button */
.p-organizationchart-node-toggle-button {
    position: absolute;
    bottom: -0.6875rem;
    left: 50%;
    transform: translateX(-50%);
    width: 1.375rem;
    height: 1.375rem;
    border-radius: 9999px;
    background: var(--lt-surface-0);
    border: 1px solid var(--lt-surface-300);
    color: var(--lt-surface-600);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 10;
    padding: 0;
    outline: none;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.08);
    transition: background-color 0.12s ease, border-color 0.12s ease, color 0.12s ease;
}
.p-organizationchart-node-toggle-button:hover {
    background: var(--lt-surface-100);
    border-color: var(--lt-primary-500);
    color: var(--lt-primary-600);
}

/* Checkbox */
.p-checkbox-box {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.125rem;
    height: 1.125rem;
    border-radius: var(--p-border-radius-xs, 4px);
    border: 2px solid var(--lt-surface-300);
    background: var(--lt-surface-0);
    cursor: pointer;
    transition: background-color 0.12s ease, border-color 0.12s ease;
    flex-shrink: 0;
    margin-right: 0.625rem;
}
.p-checkbox-box.p-checked {
    background: var(--lt-primary-500);
    border-color: var(--lt-primary-500);
    color: var(--lt-surface-0, var(--lt-surface-0));
}
.p-checkbox-box.p-indeterminate {
    background: var(--lt-primary-500);
    border-color: var(--lt-primary-500);
    color: var(--lt-surface-0, var(--lt-surface-0));
}

/* Custom Card Content */
.p-orgchart-card-content {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    text-align: left;
}
.p-orgchart-avatar {
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 9999px;
    background: var(--lt-primary-100);
    color: var(--lt-primary-700);
    font-weight: 700;
    font-size: 0.8125rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}
.p-orgchart-icon-box {
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}
.p-orgchart-details {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
}
.p-orgchart-label {
    font-weight: 600;
    font-size: 0.875rem;
    color: var(--lt-surface-900);
    line-height: 1.25;
}
.p-orgchart-desc {
    font-size: 0.75rem;
    color: var(--lt-surface-500);
    line-height: 1.2;
}

/* Dark Mode Tokens */
html.dark .p-organizationchart,
[data-theme="dark"] .p-organizationchart,
.dark .p-organizationchart {
    color: var(--p-text-color) !important;
}
html.dark .p-organizationchart-node,
[data-theme="dark"] .p-organizationchart-node,
.dark .p-organizationchart-node {
    background: var(--p-surface-0) !important;
    border-color: var(--p-border-color) !important;
    color: var(--p-text-color) !important;
}
html.dark .p-organizationchart-node.p-organizationchart-selectable:hover:not(.p-highlight),
[data-theme="dark"] .p-organizationchart-node.p-organizationchart-selectable:hover:not(.p-highlight),
.dark .p-organizationchart-node.p-organizationchart-selectable:hover:not(.p-highlight) {
    background: var(--p-surface-100) !important;
    border-color: var(--p-border-color) !important;
}
html.dark .p-organizationchart-node.p-highlight,
[data-theme="dark"] .p-organizationchart-node.p-highlight,
.dark .p-organizationchart-node.p-highlight {
    background: rgba(16, 185, 129, 0.15) !important;
    border-color: var(--p-primary-500) !important;
    color: var(--p-primary-400) !important;
}
html.dark .p-organizationchart-line-down,
html.dark .p-organizationchart-line-left,
html.dark .p-organizationchart-line-top,
[data-theme="dark"] .p-organizationchart-line-down,
[data-theme="dark"] .p-organizationchart-line-left,
[data-theme="dark"] .p-organizationchart-line-top,
.dark .p-organizationchart-line-down,
.dark .p-organizationchart-line-left,
.dark .p-organizationchart-line-top {
    background-color: var(--p-border-color) !important;
    border-color: var(--p-border-color) !important;
}
html.dark .p-organizationchart-node-toggle-button,
[data-theme="dark"] .p-organizationchart-node-toggle-button,
.dark .p-organizationchart-node-toggle-button {
    background: var(--p-surface-100) !important;
    border-color: var(--p-border-color) !important;
    color: var(--p-text-muted) !important;
}
html.dark .p-orgchart-label,
[data-theme="dark"] .p-orgchart-label,
.dark .p-orgchart-label {
    color: var(--p-text-color) !important;
}
html.dark .p-orgchart-desc,
[data-theme="dark"] .p-orgchart-desc,
.dark .p-orgchart-desc {
    color: var(--p-text-muted) !important;
}
`;

// Direct vector SVGs for crisp 100% reliable rendering
const ICONS = {
    chevronDown: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
    chevronUp: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>',
    plus: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>',
    minus: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg>',
    check: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    cloud: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>',
    server: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/></svg>',
    database: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg>',
    globe: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>',
    shield: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>',
    box: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>',
    bolt: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>'
};

export default function OrgChartIsland<T = any>(container: HTMLElement, props: OrgChartProps<T>, ctx?: IslandContext) {
    injectIslandStyle('orgchart', ORGCHART_CSS);

    const formField = useFormField(container, ctx, {
        cardinality: 'Multiple',
        name: props.name || props.targetInputName
    });

    const rootNode: OrgChartNode<T> = props.value || props.root || {
        key: '0',
        label: 'Founder',
        children: [
            {
                key: '0-0',
                label: 'Product Lead',
                children: [
                    { key: '0-0-0', label: 'UX/UI Designer' },
                    { key: '0-0-1', label: 'Product Manager' }
                ]
            },
            {
                key: '0-1',
                label: 'Engineering Lead',
                children: [
                    { key: '0-1-0', label: 'Frontend Developer' },
                    { key: '0-1-1', label: 'Backend Developer' }
                ]
            }
        ]
    };

    const isCollapsible = !!props.collapsible;
    const selectionMode = props.selectionMode || 'none';
    const isSelectable = selectionMode !== 'none';
    const toggleIconType = props.toggleIcon || 'chevron';

    // Collapsed keys
    const collapsedKeys = new Set<string>();
    if (props.collapsedKeys) {
        if (Array.isArray(props.collapsedKeys)) {
            props.collapsedKeys.forEach(k => collapsedKeys.add(String(k)));
        } else if (typeof props.collapsedKeys === 'object') {
            Object.entries(props.collapsedKeys).forEach(([k, v]) => {
                if (v) collapsedKeys.add(k);
            });
        }
    }

    // Selection keys
    const selectedKeys = new Set<string>();
    const indeterminateKeys = new Set<string>();

    if (props.selectionKeys) {
        if (Array.isArray(props.selectionKeys)) {
            props.selectionKeys.forEach(k => selectedKeys.add(String(k)));
        } else if (typeof props.selectionKeys === 'object') {
            Object.entries(props.selectionKeys).forEach(([k, v]) => {
                if (v) selectedKeys.add(k);
            });
        }
    } else {
        const initialVal = formField.getValue();
        if (Array.isArray(initialVal)) {
            initialVal.forEach(k => { if (k) selectedKeys.add(String(k)); });
        } else if (initialVal) {
            selectedKeys.add(String(initialVal));
        }
    }

    // Node map for fast hierarchy traversal
    const nodeMap = new Map<string, { node: OrgChartNode<T>; parentKey: string | null }>();

    function buildNodeMap(cur: OrgChartNode<T>, parentKey: string | null = null) {
        nodeMap.set(String(cur.key), { node: cur, parentKey });
        if (cur.children) {
            cur.children.forEach(c => buildNodeMap(c, String(cur.key)));
        }
    }
    buildNodeMap(rootNode);

    function getNodeIconSvg(iconName?: string): string {
        if (!iconName) return '';
        const key = iconName.toLowerCase() as keyof typeof ICONS;
        return ICONS[key] || ICONS.bolt;
    }

    function renderNodeCardContent(node: OrgChartNode<T>, isSelected: boolean, isIndet: boolean): Raw {
        const checkboxHtml = selectionMode === 'checkbox' ? html`
            <div class="p-checkbox-box ${isSelected ? 'p-checked' : (isIndet ? 'p-indeterminate' : '')}" data-part="root" role="checkbox" aria-checked="${isSelected}">
                ${isSelected ? unsafe(ICONS.check) : (isIndet ? html`<span style="width: 8px; height: 2px; background: white; border-radius: 1px;"></span>` : '')}
            </div>
        ` : '';

        // 1. Cloud / Custom Icon Accent template
        if (node.icon || node.accent || node.description) {
            const iconSvg = getNodeIconSvg(node.icon);
            const accentClass = node.accent || 'bg-emerald-500/10 text-emerald-500';
            return html`
                ${checkboxHtml}
                <div class="p-orgchart-card-content">
                    ${iconSvg ? html`<div class="p-orgchart-icon-box ${accentClass}">${unsafe(iconSvg)}</div>` : ''}
                    <div class="p-orgchart-details">
                        <span class="p-orgchart-label">${node.label}</span>
                        ${node.description ? html`<span class="p-orgchart-desc">${node.description}</span>` : ''}
                    </div>
                </div>
            `;
        }

        // 2. Avatar / Leadership Person template
        if (node.avatar || node.title) {
            const initials = node.label.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
            return html`
                ${checkboxHtml}
                <div class="p-orgchart-card-content">
                    <div class="p-orgchart-avatar">${initials}</div>
                    <div class="p-orgchart-details">
                        <span class="p-orgchart-label">${node.label}</span>
                        ${node.title ? html`<span class="p-orgchart-desc" style="color: var(--lt-primary-600); font-weight: 600;">${node.title}</span>` : ''}
                    </div>
                </div>
            `;
        }

        // 3. Standard text node
        return html`
            ${checkboxHtml}
            <span class="p-orgchart-label">${node.label}</span>
        `;
    }

    function getToggleIconSvg(isCollapsed: boolean): string {
        if (toggleIconType === 'plusMinus') {
            return isCollapsed ? ICONS.plus : ICONS.minus;
        }
        return isCollapsed ? ICONS.chevronDown : ICONS.chevronUp;
    }

    function renderBranch(node: OrgChartNode<T>): Raw {
        const key = String(node.key);
        const hasChildren = node.children && node.children.length > 0;
        const isCollapsed = isCollapsible && collapsedKeys.has(key);
        const isSelected = selectedKeys.has(key);
        const isIndet = indeterminateKeys.has(key);

        const childCount = hasChildren ? node.children!.length : 0;
        const colspan = childCount * 2;

        let toggleBtnHtml: Raw | '' = '';
        if (isCollapsible && hasChildren) {
            const toggleSvg = getToggleIconSvg(isCollapsed);
            toggleBtnHtml = html`
                <button type="button" class="p-organizationchart-node-toggle-button" data-toggle-key="${key}" title="${isCollapsed ? 'Expand' : 'Collapse'}" aria-label="${isCollapsed ? 'Expand' : 'Collapse'}">
                    ${unsafe(toggleSvg)}
                </button>
            `;
        }

        const linesDownHtml = hasChildren && !isCollapsed ? html`
            <tr class="p-organizationchart-lines">
                <td colspan="${colspan}">
                    <div class="p-organizationchart-line-down"></div>
                </td>
            </tr>
        ` : '';

        let connectorRowHtml: Raw | '' = '';
        let childrenCellsHtml: Raw | '' = '';

        if (hasChildren && !isCollapsed) {
            if (childCount === 1) {
                connectorRowHtml = html`
                    <tr class="p-organizationchart-lines">
                        <td colspan="2">
                            <div class="p-organizationchart-line-down"></div>
                        </td>
                    </tr>
                `;
                childrenCellsHtml = html`
                    <tr class="p-organizationchart-nodes">
                        <td colspan="2" class="p-organizationchart-node-cell" style="width: 100%;">
                            ${renderBranch(node.children![0])}
                        </td>
                    </tr>
                `;
            } else {
                // Multi-child connectors with equal column percentage widths
                const colWidth = (100 / colspan).toFixed(4);
                const childCellWidth = (100 / childCount).toFixed(4);

                const connectorTds: Raw[] = [];
                const childTds: Raw[] = [];

                node.children!.forEach((child, idx) => {
                    const isFirst = idx === 0;
                    const isLast = idx === childCount - 1;

                    const leftTop = !isFirst ? 'p-organizationchart-line-top' : '';
                    const rightTop = !isLast ? 'p-organizationchart-line-top' : '';

                    connectorTds.push(html`
                        <td class="p-organizationchart-line-left ${leftTop}" style="width: ${colWidth}%;">&nbsp;</td>
                        <td class="p-organizationchart-line-right ${rightTop}" style="width: ${colWidth}%;">&nbsp;</td>
                    `);

                    childTds.push(html`
                        <td colspan="2" class="p-organizationchart-node-cell" style="width: ${childCellWidth}%;">
                            ${renderBranch(child)}
                        </td>
                    `);
                });

                connectorRowHtml = html`
                    <tr class="p-organizationchart-lines">
                        ${connectorTds}
                    </tr>
                `;
                childrenCellsHtml = html`
                    <tr class="p-organizationchart-nodes">
                        ${childTds}
                    </tr>
                `;
            }
        }

        return html`
            <table class="p-organizationchart-table" role="presentation">
                <tbody>
                    <tr>
                        <td colspan="${hasChildren ? colspan : 2}" class="p-organizationchart-node-cell">
                            <div class="p-organizationchart-node ${isSelectable ? 'p-organizationchart-selectable' : ''} ${isSelected ? 'p-highlight' : ''}" 
                                 data-node-key="${key}" 
                                 role="treeitem" 
                                 aria-selected="${isSelected}" 
                                 aria-expanded="${hasChildren ? !isCollapsed : undefined}"
                                 tabindex="0">
                                ${renderNodeCardContent(node, isSelected, isIndet)}
                                ${toggleBtnHtml}
                            </div>
                        </td>
                    </tr>
                    ${linesDownHtml}
                    ${connectorRowHtml}
                    ${childrenCellsHtml}
                </tbody>
            </table>
        `;
    }

    function renderTree() {
        if (selectionMode === 'checkbox') {
            recalculateCheckboxHierarchy();
        }

        formField.detach();
        setHtml(container, html`
            <div class="p-organizationchart p-component" role="tree">
                ${renderBranch(rootNode)}
            </div>
        `);
        formField.reattach();

        bindEvents();
    }

    function recalculateCheckboxHierarchy() {
        indeterminateKeys.clear();

        function checkNode(n: OrgChartNode<T>): boolean {
            const k = String(n.key);
            if (!n.children || n.children.length === 0) {
                return selectedKeys.has(k);
            }

            const childResults = n.children.map(c => checkNode(c));
            const allChecked = childResults.every(r => r === true);
            const someChecked = childResults.some(r => r === true) || n.children.some(c => indeterminateKeys.has(String(c.key)));

            if (allChecked) {
                selectedKeys.add(k);
                indeterminateKeys.delete(k);
                return true;
            } else if (someChecked) {
                selectedKeys.delete(k);
                indeterminateKeys.add(k);
                return false;
            } else {
                selectedKeys.delete(k);
                indeterminateKeys.delete(k);
                return false;
            }
        }

        checkNode(rootNode);
    }

    function selectDescendants(n: OrgChartNode<T>, check: boolean) {
        const k = String(n.key);
        if (check) selectedKeys.add(k);
        else selectedKeys.delete(k);
        indeterminateKeys.delete(k);

        if (n.children) {
            n.children.forEach(c => selectDescendants(c, check));
        }
    }

    function updateSelectionUI() {
        if (selectionMode === 'checkbox') {
            recalculateCheckboxHierarchy();
        }

        container.querySelectorAll<HTMLElement>('.p-organizationchart-node').forEach(el => {
            const key = el.getAttribute('data-node-key');
            if (!key) return;

            const isSelected = selectedKeys.has(key);
            const isIndet = indeterminateKeys.has(key);

            el.classList.toggle('p-highlight', isSelected);
            el.setAttribute('aria-selected', String(isSelected));

            if (selectionMode === 'checkbox') {
                const chk = el.querySelector<HTMLElement>('.p-checkbox-box');
                if (chk) {
                    chk.className = `p-checkbox-box ${isSelected ? 'p-checked' : (isIndet ? 'p-indeterminate' : '')}`;
                    chk.setAttribute('aria-checked', String(isSelected));
                    setHtml(chk, isSelected ? unsafe(ICONS.check) : (isIndet ? html`<span style="width: 8px; height: 2px; background: white; border-radius: 1px;"></span>` : html``));
                }
            }
        });

        // Update external live status text
        const parentCard = container.closest('.demo-subcard') || container.parentElement;
        if (parentCard) {
            const statusEl = parentCard.querySelector('.p-orgchart-selected-text');
            if (statusEl) {
                const arr = Array.from(selectedKeys);
                statusEl.textContent = arr.length > 0 ? arr.join(', ') : '-';
            }
        }

        dispatchSelectionEvent();
        syncValues();
    }

    function toggleNodeCollapse(key: string) {
        if (collapsedKeys.has(key)) {
            collapsedKeys.delete(key);
        } else {
            collapsedKeys.add(key);
        }

        renderTree();

        emitComponentEvent(container, 'orgchart', 'toggle', {
            key,
            collapsed: collapsedKeys.has(key),
            collapsedKeys: Array.from(collapsedKeys)
        });
    }

    function handleNodeClick(key: string) {
        if (!isSelectable) return;

        if (selectionMode === 'single') {
            if (selectedKeys.has(key)) {
                selectedKeys.clear();
            } else {
                selectedKeys.clear();
                selectedKeys.add(key);
            }
            updateSelectionUI();
        } else if (selectionMode === 'multiple') {
            if (selectedKeys.has(key)) {
                selectedKeys.delete(key);
            } else {
                selectedKeys.add(key);
            }
            updateSelectionUI();
        } else if (selectionMode === 'checkbox') {
            const entry = nodeMap.get(key);
            if (!entry) return;
            const willCheck = !selectedKeys.has(key);
            selectDescendants(entry.node, willCheck);
            updateSelectionUI();
        }
    }

    function bindEvents() {
        // 1. Toggle buttons
        container.querySelectorAll<HTMLButtonElement>('.p-organizationchart-node-toggle-button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const key = btn.getAttribute('data-toggle-key');
                if (key) toggleNodeCollapse(key);
            }, { signal: ctx?.signal });
        });

        // 2. Node Selection Clicks
        if (isSelectable) {
            container.querySelectorAll<HTMLElement>('.p-organizationchart-node').forEach(nodeEl => {
                nodeEl.addEventListener('click', () => {
                    const key = nodeEl.getAttribute('data-node-key');
                    if (key) handleNodeClick(key);
                }, { signal: ctx?.signal });
            });
        }

        // 3. Keyboard navigation
        container.querySelectorAll<HTMLElement>('.p-organizationchart-node').forEach(nodeEl => {
            nodeEl.addEventListener('keydown', (e) => {
                const key = nodeEl.getAttribute('data-node-key');
                if (!key) return;

                if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    handleNodeClick(key);
                }
            }, { signal: ctx?.signal });
        });
    }

    // Listen for external action buttons (Expand All / Collapse All)
    const parentContainer = container.closest('.demo-subcard') || container.closest('section') || container.parentElement;
    if (parentContainer) {
        parentContainer.querySelectorAll<HTMLButtonElement>('[data-orgchart-action]').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.getAttribute('data-orgchart-action');
                if (action === 'expand-all') {
                    collapsedKeys.clear();
                    renderTree();
                } else if (action === 'collapse-all') {
                    collapsedKeys.add(String(rootNode.key));
                    renderTree();
                }
            }, { signal: ctx?.signal });
        });
    }

    function dispatchSelectionEvent() {
        emitComponentEvent(container, 'orgchart', 'selection-change', {
            selectionKeys: Array.from(selectedKeys),
            indeterminateKeys: Array.from(indeterminateKeys)
        });
    }

    function syncValues() {
        formField.setValue(Array.from(selectedKeys));
    }

    renderTree();
    syncValues();
}
