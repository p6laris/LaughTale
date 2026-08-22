/**
 * SoftMax.LaughTale: Enterprise TreeSelect Component
 * Hierarchical organizational tree dropdown with search filtering.
 * Integrated with useDisclosure, useClickOutside, and useTransition.
 */

import { useDisclosure } from '../composables/useDisclosure';
import { useClickOutside } from '../composables/useClickOutside';
import { useTransition } from '../composables/animation/useTransition';

export interface DepartmentNode {
    id: string;
    name: string;
    children?: DepartmentNode[];
}

export interface DepartmentTreeProps {
    placeholder: string;
    targetInputName: string;
    departments: DepartmentNode[];
}

export default function CascadeTreeIsland(container: HTMLElement, props: DepartmentTreeProps) {
    let selectedText = props.placeholder;

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
                    <span style="font-size: 0.6875rem; color: var(--p-surface-400);">▼</span>
                </button>

                <div class="tree-dropdown-menu" style="display: none; position: absolute; top: calc(100% + 4px); left: 0; width: 100%; padding: 0.75rem; background: var(--p-surface-0); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg); box-shadow: var(--p-shadow-lg); z-index: 50; max-height: 16rem; overflow-y: auto;">
                    <input type="text" placeholder="Search departments..." class="p-input tree-search" style="margin-bottom: 0.5rem; font-size: 0.8125rem; padding: 0.4rem 0.65rem;" />
                    <div class="tree-list" style="display: flex; flex-direction: column; gap: 0.25rem;"></div>
                </div>
            </div>
        </div>
    `;

    const btn = container.querySelector('.tree-toggle-btn') as HTMLButtonElement;
    const menu = container.querySelector('.tree-dropdown-menu') as HTMLElement;
    const searchInput = container.querySelector('.tree-search') as HTMLInputElement;
    const treeList = container.querySelector('.tree-list') as HTMLElement;
    const labelSpan = container.querySelector('.selected-label') as HTMLElement;
    const hiddenInput = container.querySelector<HTMLInputElement>(`#${props.targetInputName}`)!;

    const disclosure = useDisclosure({
        defaultIsOpen: false,
        onOpen: () => {
            renderList(props.departments || []);
            useTransition(menu, { type: 'fade', isMounted: true });
            searchInput.focus();
        },
        onClose: () => {
            useTransition(menu, { type: 'fade', isMounted: false });
        }
    });

    useClickOutside(container, () => disclosure.close());

    btn.addEventListener('click', () => disclosure.toggle());

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        const filtered = filterTree(props.departments || [], query);
        renderList(filtered);
    });

    function filterTree(nodes: DepartmentNode[], query: string): DepartmentNode[] {
        if (!query) return nodes;
        return nodes.reduce<DepartmentNode[]>((acc, node) => {
            const matchesSelf = node.name.toLowerCase().includes(query);
            const matchingChildren = node.children ? filterTree(node.children, query) : [];
            if (matchesSelf || matchingChildren.length > 0) {
                acc.push({
                    ...node,
                    children: matchingChildren.length > 0 ? matchingChildren : node.children
                });
            }
            return acc;
        }, []);
    }

    function renderList(nodes: DepartmentNode[], depth = 0) {
        if (depth === 0) treeList.innerHTML = '';
        if (nodes.length === 0 && depth === 0) {
            treeList.innerHTML = '<div style="padding: 0.5rem; color: var(--p-surface-400); font-size: 0.75rem; text-align: center;">No matches</div>';
            return;
        }

        nodes.forEach(node => {
            const hasChildren = node.children && node.children.length > 0;
            const item = document.createElement('div');
            item.style.paddingLeft = `${depth * 1.25}rem`;
            item.className = 'tree-item';
            item.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.35rem 0.5rem; border-radius: var(--p-border-radius); cursor: pointer; font-size: 0.8125rem; color: var(--p-surface-800); transition: background 0.1s ease;">
                    <span>${hasChildren ? '📁' : '📄'} ${node.name}</span>
                    <span style="font-size: 0.6875rem; color: var(--p-surface-400); font-family: monospace;">${node.id}</span>
                </div>
            `;

            item.addEventListener('mouseenter', () => {
                (item.firstElementChild as HTMLElement).style.background = 'var(--p-surface-100)';
            });
            item.addEventListener('mouseleave', () => {
                (item.firstElementChild as HTMLElement).style.background = 'transparent';
            });

            item.addEventListener('click', (e) => {
                e.stopPropagation();
                selectedText = node.name;
                labelSpan.textContent = selectedText;
                labelSpan.style.color = 'var(--p-surface-900)';
                hiddenInput.value = node.id;
                disclosure.close();
                container.dispatchEvent(new CustomEvent('dept:selected', { detail: { id: node.id, name: node.name } }));
            });

            treeList.appendChild(item);
            if (hasChildren) {
                renderList(node.children!, depth + 1);
            }
        });
    }
}
