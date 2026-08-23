/**
 * SoftMax.LaughTale: Enterprise CascadeSelect Component (Aura CascadeSelect)
 * Hierarchical multi-level flyout cascading selector for deeply nested categories and locations.
 * Integrated with useDisclosure, useClickOutside, and Aura design system tokens.
 */

import { LucideIcons } from '../icons/lucide';
import { injectIslandStyle } from '../runtime/styles';
import { useDisclosure } from '../composables/useDisclosure';
import { useClickOutside } from '../composables/useClickOutside';

export interface CascadeSelectNode<T = string> {
    name?: string;
    label?: string;
    cname?: string;
    code?: string;
    value?: T;
    icon?: string;
    image?: string;
    disabled?: boolean;
    children?: CascadeSelectNode<T>[];
    items?: CascadeSelectNode<T>[];
    states?: CascadeSelectNode<T>[];
    cities?: CascadeSelectNode<T>[];
}

export interface CascadeSelectProps<T = string> {
    options?: CascadeSelectNode<T>[];
    placeholder?: string;
    targetInputName?: string;
    value?: T;
    disabled?: boolean;
    showClear?: boolean;
    size?: 'small' | 'normal' | 'large';
    variant?: 'outlined' | 'filled';
    invalid?: boolean;
    fluid?: boolean;
    loading?: boolean;
    optionLabel?: string;
    optionGroupLabel?: string;
}

const CSS = `
.laughtale-cascadeselect {
    position: relative;
    display: inline-flex;
    font-family: var(--p-font-family, inherit);
    box-sizing: border-box;
}
.laughtale-cascadeselect.fluid {
    width: 100%;
}
.laughtale-cascadeselect:not(.fluid) {
    width: 100%;
    max-width: 280px;
}

.cs-trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    background: var(--p-surface-0);
    border: 1px solid var(--p-border-color);
    border-radius: var(--p-border-radius);
    color: var(--p-text-color);
    cursor: pointer;
    user-select: none;
    transition: border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
    box-sizing: border-box;
    gap: 0.5rem;
}
.cs-trigger.variant-filled {
    background: var(--p-surface-50);
}
.cs-trigger.focused {
    border-color: var(--p-primary-500);
    box-shadow: 0 0 0 1px var(--p-primary-500);
}
.cs-trigger.invalid {
    border-color: #ef4444 !important;
    box-shadow: 0 0 0 1px #ef4444 !important;
}
.cs-trigger.disabled {
    background: var(--p-surface-100);
    opacity: 0.65;
    cursor: not-allowed;
}

/* Sizes */
.cs-trigger.size-small {
    min-height: 2rem;
    padding: 0 0.5rem;
    font-size: 0.75rem;
}
.cs-trigger.size-normal {
    min-height: 2.5rem;
    padding: 0 0.75rem;
    font-size: 0.875rem;
}
.cs-trigger.size-large {
    min-height: 3rem;
    padding: 0 1rem;
    font-size: 1rem;
}

.cs-label {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--p-text-color);
}
.cs-label.placeholder {
    color: var(--p-text-muted);
}

.cs-actions {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    flex-shrink: 0;
}
.cs-btn-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: transparent;
    color: var(--p-text-muted);
    cursor: pointer;
    padding: 0.2rem;
    border-radius: 50%;
    transition: color 0.15s ease, background 0.15s ease;
}
.cs-btn-icon:hover {
    color: var(--p-text-color);
    background: var(--p-surface-100);
}
.cs-chevron {
    display: flex;
    align-items: center;
    color: var(--p-text-muted);
    transition: transform 0.2s ease;
}
.cs-trigger.focused .cs-chevron {
    transform: rotate(180deg);
}

/* Cascade Overlay Panels */
.cs-overlay {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    z-index: 1000;
    display: none;
    box-sizing: border-box;
}

.cs-panel {
    background: var(--p-surface-0);
    border: 1px solid var(--p-border-color);
    border-radius: var(--p-border-radius);
    box-shadow: var(--p-shadow-lg);
    min-width: 14rem;
    padding: 0.35rem;
    box-sizing: border-box;
}

.cs-item {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0.75rem;
    border-radius: calc(var(--p-border-radius) - 2px);
    color: var(--p-text-color);
    cursor: pointer;
    font-size: 0.875rem;
    user-select: none;
    transition: background 150ms cubic-bezier(0.4, 0, 0.2, 1), color 150ms ease;
    gap: 0.5rem;
}
.cs-item:hover, .cs-item.highlighted {
    background: var(--p-surface-100);
}
.cs-item.selected {
    background: var(--p-primary-50);
    color: var(--p-primary-700);
    font-weight: 600;
}
.cs-item.disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.cs-sub-panel {
    display: none;
    position: absolute;
    top: 0;
    left: calc(100% + 2px);
    z-index: 1001;
    background: var(--p-surface-0);
    border: 1px solid var(--p-border-color);
    border-radius: var(--p-border-radius);
    box-shadow: var(--p-shadow-lg);
    min-width: 14rem;
    padding: 0.35rem;
    box-sizing: border-box;
}

/* Dark Mode Tokens */
.dark .cs-trigger {
    background: var(--p-surface-900);
    border-color: var(--p-surface-700);
    color: var(--p-surface-0);
}
.dark .cs-trigger.variant-filled {
    background: var(--p-surface-800);
}
.dark .cs-panel, .dark .cs-sub-panel {
    background: var(--p-surface-900);
    border-color: var(--p-surface-700);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
}
.dark .cs-item:hover, .dark .cs-item.highlighted {
    background: var(--p-surface-800);
    color: var(--p-surface-0);
}
.dark .cs-item.selected {
    background: rgba(16, 185, 129, 0.15);
    color: #6ee7b7;
}
`;

export default function CascadeSelectIsland<T = string>(container: HTMLElement, props: CascadeSelectProps<T>) {
    injectIslandStyle('cascadeselect', CSS);
    const options: CascadeSelectNode<T>[] = props.options || [];
    const size = props.size || 'normal';
    const variant = props.variant || 'outlined';
    const showClear = props.showClear === true;

    let selectedValue: T | string | null = props.value || null;
    let selectedLabelText = '';

    function getNodeLabel(n: CascadeSelectNode<T>): string {
        return n.cname || n.name || n.label || String(n.code || n.value || '');
    }

    function getNodeValue(n: CascadeSelectNode<T>): string {
        return String(n.code || n.value || n.cname || n.name || n.label || '');
    }

    function getNodeChildren(n: CascadeSelectNode<T>): CascadeSelectNode<T>[] | null {
        return n.children || n.items || n.states || n.cities || null;
    }

    // Find initial label if value provided
    function findNodeByValue(nodes: CascadeSelectNode<T>[], val: T | string): string | null {
        for (const n of nodes) {
            const children = getNodeChildren(n);
            if (children && children.length > 0) {
                const sub = findNodeByValue(children, val);
                if (sub) return sub;
            } else if (getNodeValue(n) === String(val)) {
                return getNodeLabel(n);
            }
        }
        return null;
    }

    if (selectedValue) {
        selectedLabelText = findNodeByValue(options, selectedValue) || String(selectedValue);
    }

    container.innerHTML = `
        <div class="laughtale-cascadeselect ${props.fluid ? 'fluid' : ''}">
            <!-- Trigger -->
            <div class="cs-trigger size-${size} variant-${variant} ${props.invalid ? 'invalid' : ''} ${props.disabled ? 'disabled' : ''}" 
                 tabindex="${props.disabled ? -1 : 0}" 
                 role="combobox" 
                 aria-expanded="false" 
                 aria-haspopup="tree">
                <span class="cs-label ${selectedLabelText ? '' : 'placeholder'}">
                    ${selectedLabelText || props.placeholder || 'Select a City'}
                </span>
                
                <div class="cs-actions">
                    ${props.loading ? `
                        <span class="cs-btn-icon" style="animation: spin 1s linear infinite;">
                            ${LucideIcons.loader2 || '⏳'}
                        </span>
                    ` : ''}

                    ${showClear ? `
                        <button type="button" class="cs-btn-icon cs-btn-clear" style="display: ${selectedLabelText ? 'flex' : 'none'};" title="Clear value">
                            ${LucideIcons.x}
                        </button>
                    ` : ''}

                    <span class="cs-chevron">
                        ${LucideIcons.chevronDown}
                    </span>
                </div>
            </div>

            <!-- Cascade Overlay Container -->
            <div class="cs-overlay">
                <div class="cs-panel cs-level-0"></div>
            </div>
        </div>
    `;

    const trigger = container.querySelector<HTMLElement>('.cs-trigger')!;
    const label = container.querySelector<HTMLElement>('.cs-label')!;
    const clearBtn = container.querySelector<HTMLButtonElement>('.cs-btn-clear');
    const overlay = container.querySelector<HTMLElement>('.cs-overlay')!;
    const level0 = container.querySelector<HTMLElement>('.cs-level-0')!;

    const disclosure = useDisclosure({
        defaultIsOpen: false,
        onOpen: () => {
            overlay.style.display = 'block';
            trigger.classList.add('focused');
            trigger.setAttribute('aria-expanded', 'true');
            renderLevel(options, level0, 0, []);
        },
        onClose: () => {
            overlay.style.display = 'none';
            trigger.classList.remove('focused');
            trigger.setAttribute('aria-expanded', 'false');
        }
    });

    useClickOutside(container, () => disclosure.close());

    function updateClearButton() {
        if (!clearBtn) return;
        clearBtn.style.display = selectedLabelText && !props.disabled ? 'flex' : 'none';
    }

    function renderLevel(nodes: CascadeSelectNode<T>[], parentContainer: HTMLElement, level: number, currentPath: string[]) {
        parentContainer.innerHTML = nodes.map((n, idx) => {
            const nodeLabel = getNodeLabel(n);
            const nodeVal = getNodeValue(n);
            const children = getNodeChildren(n);
            const hasChildren = children && children.length > 0;
            const isSelected = selectedValue !== null && nodeVal === String(selectedValue);

            let leadingHtml = '';
            if (n.icon && LucideIcons[n.icon]) {
                leadingHtml = `<span style="display: flex; width: 16px; height: 16px; color: var(--p-primary-600); margin-right: 0.4rem;">${LucideIcons[n.icon]}</span>`;
            } else if (n.image) {
                leadingHtml = `<img src="${n.image}" alt="" style="width: 18px; height: 18px; border-radius: 2px; margin-right: 0.4rem; object-fit: cover;" />`;
            }

            return `
                <div class="cs-item ${isSelected ? 'selected' : ''} ${n.disabled ? 'disabled' : ''}" 
                     data-idx="${idx}" 
                     data-val="${nodeVal}" 
                     role="treeitem" 
                     aria-expanded="false">
                    <div style="display: flex; align-items: center; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                        ${leadingHtml}
                        <span>${nodeLabel}</span>
                    </div>
                    ${hasChildren ? `
                        <span style="color: var(--p-text-muted); display: flex; width: 14px; height: 14px; margin-left: 0.5rem;">
                            ${LucideIcons.chevronRight}
                        </span>
                        <div class="cs-sub-panel cs-level-${level + 1}"></div>
                    ` : ''}
                </div>
            `;
        }).join('');

        parentContainer.querySelectorAll<HTMLElement>(':scope > .cs-item').forEach((itemEl, idx) => {
            const node = nodes[idx];
            const nodeLabel = getNodeLabel(node);
            const children = getNodeChildren(node);
            const path = [...currentPath, nodeLabel];

            if (children && children.length > 0) {
                const subPanel = itemEl.querySelector<HTMLElement>('.cs-sub-panel')!;
                let hideTimeout: any = null;

                itemEl.addEventListener('mouseenter', () => {
                    clearTimeout(hideTimeout);
                    // Close other sibling sub-panels
                    parentContainer.querySelectorAll<HTMLElement>(':scope > .cs-item > .cs-sub-panel').forEach(p => {
                        if (p !== subPanel) p.style.display = 'none';
                    });

                    renderLevel(children, subPanel, level + 1, path);
                    subPanel.style.display = 'block';

                    // Check bounds against viewport right edge
                    const rect = subPanel.getBoundingClientRect();
                    if (rect.right > window.innerWidth) {
                        subPanel.style.left = 'auto';
                        subPanel.style.right = 'calc(100% + 2px)';
                    } else {
                        subPanel.style.left = 'calc(100% + 2px)';
                        subPanel.style.right = 'auto';
                    }
                });

                itemEl.addEventListener('mouseleave', () => {
                    hideTimeout = setTimeout(() => {
                        subPanel.style.display = 'none';
                    }, 150);
                });

                subPanel.addEventListener('mouseenter', () => {
                    clearTimeout(hideTimeout);
                });
            } else {
                itemEl.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (node.disabled) return;
                    selectLeaf(node, path);
                });
            }
        });
    }

    function selectLeaf(node: CascadeSelectNode<T>, path: string[]) {
        selectedValue = getNodeValue(node) as unknown as T;
        selectedLabelText = getNodeLabel(node);
        
        label.textContent = selectedLabelText;
        label.classList.remove('placeholder');
        updateClearButton();
        
        disclosure.close();
        syncValue(path);
    }

    trigger.addEventListener('click', () => {
        if (props.disabled) return;
        disclosure.toggle();
    });

    trigger.addEventListener('keydown', (e) => {
        if (props.disabled) return;
        if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowDown') {
            e.preventDefault();
            if (!disclosure.isOpen) disclosure.open();
        } else if (e.key === 'Escape') {
            disclosure.close();
        }
    });

    clearBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        selectedValue = null;
        selectedLabelText = '';
        label.textContent = props.placeholder || 'Select a City';
        label.classList.add('placeholder');
        updateClearButton();
        syncValue([]);
    });

    function syncValue(path: string[]) {
        if (props.targetInputName) {
            let hidden = container.querySelector<HTMLInputElement>(`input[name="${props.targetInputName}"]`);
            if (!hidden) {
                hidden = document.createElement('input');
                hidden.type = 'hidden';
                hidden.name = props.targetInputName;
                container.appendChild(hidden);
            }
            hidden.value = selectedValue !== null ? String(selectedValue) : '';
        }

        container.dispatchEvent(new CustomEvent('cascadeselect:change', {
            bubbles: true,
            detail: { value: selectedValue, label: selectedLabelText, path: path }
        }));
    }
}
