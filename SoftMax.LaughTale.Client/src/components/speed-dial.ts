/**
 * SoftMax.LaughTale: Enterprise SpeedDial Island Component
 * Strictly compliant with Aura Design System tokens, animations, and trigonometry.
 */

import { getLucideIcon, LucideIcons } from '../icons/lucide';
import { injectIslandStyle } from '../runtime/styles';

export interface SpeedDialActionItem {
    id?: string;
    label?: string;
    icon?: string;
    action?: string;
    url?: string;
    target?: string;
    disabled?: boolean;
    tooltip?: string;
    severity?: string;
    styleClass?: string;
    command?: string;
}

export interface SpeedDialButtonProps {
    severity?: string;
    rounded?: boolean;
    iconOnly?: boolean;
    styleClass?: string;
}

export interface SpeedDialTooltipOptions {
    position?: 'top' | 'bottom' | 'left' | 'right';
    event?: 'hover' | 'focus';
}

export interface SpeedDialProps {
    model?: SpeedDialActionItem[];
    actions?: SpeedDialActionItem[];
    direction?: 'up' | 'down' | 'left' | 'right' | 'up-left' | 'up-right' | 'down-left' | 'down-right';
    type?: 'linear' | 'circle' | 'semi-circle' | 'quarter-circle';
    radius?: number;
    transitionDelay?: number;
    mask?: boolean;
    showIcon?: string;
    hideIcon?: string;
    rotateAnimation?: boolean;
    buttonProps?: SpeedDialButtonProps;
    tooltipOptions?: SpeedDialTooltipOptions;
    ariaLabel?: string;
    template?: 'default' | 'custom';
}

const SPEEDDIAL_CSS = `
.p-speeddial {
    position: relative;
    display: inline-flex;
    z-index: 10;
}

.p-speeddial-button {
    position: relative;
    z-index: 2;
    cursor: pointer;
    user-select: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.12), 0 2px 4px -1px rgba(0, 0, 0, 0.08);
    transition: background-color 0.2s, border-color 0.2s, box-shadow 0.2s, transform 0.2s;
    outline: none;
}

.p-speeddial-button:focus-visible {
    outline: 2px solid var(--p-primary-500, #10b981);
    outline-offset: 2px;
}

.p-speeddial-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: transform 250ms cubic-bezier(0.4, 0, 0.2, 1);
}

.p-speeddial-opened .p-speeddial-icon.p-speeddial-rotate {
    transform: rotate(45deg);
}

.p-speeddial-list {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 3rem;
    height: 3rem;
    pointer-events: none;
    z-index: 1;
}

.p-speeddial-opened .p-speeddial-list {
    pointer-events: auto;
}

.p-speeddial-item {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -1.25rem;
    margin-left: -1.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transform: scale(0);
    transition: transform 250ms cubic-bezier(0.4, 0, 0.2, 1), opacity 250ms ease;
    pointer-events: none;
}

.p-speeddial-opened .p-speeddial-item {
    opacity: 1;
    pointer-events: auto;
}

.p-speeddial-action {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    border: 1px solid var(--p-surface-200, #e2e8f0);
    background: var(--p-surface-0, #ffffff);
    color: var(--p-surface-700, #334155);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04);
    cursor: pointer;
    position: relative;
    transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
    outline: none;
}

.p-speeddial-action:hover:not(:disabled) {
    background: var(--p-surface-100, #f1f5f9);
    color: var(--p-surface-900, #0f172a);
    border-color: var(--p-surface-300, #cbd5e1);
    transform: scale(1.08);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
}

.p-speeddial-action:focus-visible {
    outline: 2px solid var(--p-primary-500, #10b981);
    outline-offset: 2px;
}

.p-speeddial-action:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
}

/* Custom Template Layout */
.p-speeddial-custom-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
    text-decoration: none;
    white-space: nowrap;
}

.p-speeddial-custom-label {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 5.5rem;
    padding: 0.5rem 1rem;
    border-radius: var(--p-border-radius, 6px);
    background: var(--p-surface-0, #ffffff);
    border: 1px solid var(--p-surface-200, #e2e8f0);
    color: var(--p-surface-600, #475569);
    font-weight: 500;
    font-size: 0.875rem;
    box-shadow: var(--p-shadow-sm, 0 1px 2px rgba(0,0,0,0.05));
    transition: background-color 0.15s, color 0.15s, border-color 0.15s;
    user-select: none;
}

.p-speeddial-custom-icon {
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 50%;
    background: var(--p-surface-0, #ffffff);
    border: 1px solid var(--p-surface-200, #e2e8f0);
    color: var(--p-surface-600, #475569);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: var(--p-shadow-sm, 0 1px 2px rgba(0,0,0,0.05));
    transition: background-color 0.15s, color 0.15s, border-color 0.15s, transform 0.15s;
    cursor: pointer;
    outline: none;
}

.p-speeddial-custom-item:hover .p-speeddial-custom-label,
.p-speeddial-custom-item:hover .p-speeddial-custom-icon {
    background: var(--p-surface-100, #f1f5f9);
    color: var(--p-surface-900, #0f172a);
    border-color: var(--p-surface-300, #cbd5e1);
}

.p-speeddial-custom-item:hover .p-speeddial-custom-icon {
    transform: scale(1.05);
}

/* Tooltips */
.p-speeddial-tooltip {
    position: absolute;
    background: var(--p-surface-900, #0f172a);
    color: #ffffff;
    padding: 0.35rem 0.65rem;
    font-size: 0.75rem;
    font-weight: 600;
    line-height: 1;
    border-radius: var(--p-border-radius-sm, 4px);
    white-space: nowrap;
    pointer-events: none;
    z-index: 100;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
    opacity: 0;
    transform: scale(0.9);
    transition: opacity 0.15s ease, transform 0.15s ease;
}

.p-speeddial-tooltip.p-tooltip-visible {
    opacity: 1;
}

.p-speeddial-tooltip.tooltip-left {
    right: calc(100% + 8px);
    top: 50%;
    transform: translateY(-50%) scale(0.9);
}
.p-speeddial-tooltip.tooltip-left.p-tooltip-visible {
    transform: translateY(-50%) scale(1);
}

.p-speeddial-tooltip.tooltip-right {
    left: calc(100% + 8px);
    top: 50%;
    transform: translateY(-50%) scale(0.9);
}
.p-speeddial-tooltip.tooltip-right.p-tooltip-visible {
    transform: translateY(-50%) scale(1);
}

.p-speeddial-tooltip.tooltip-top {
    bottom: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%) scale(0.9);
}
.p-speeddial-tooltip.tooltip-top.p-tooltip-visible {
    transform: translateX(-50%) scale(1);
}

.p-speeddial-tooltip.tooltip-bottom {
    top: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%) scale(0.9);
}
.p-speeddial-tooltip.tooltip-bottom.p-tooltip-visible {
    transform: translateX(-50%) scale(1);
}

/* Mask */
.p-speeddial-mask {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    border-radius: inherit;
    z-index: 5;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.25s ease;
}

.p-speeddial-mask.p-speeddial-mask-visible {
    opacity: 1;
    pointer-events: auto;
}

/* Dark Mode Support */
[data-theme="dark"] .p-speeddial-action {
    background: var(--p-surface-900, #0f172a);
    border-color: var(--p-surface-700, #334155);
    color: var(--p-surface-300, #cbd5e1);
}

[data-theme="dark"] .p-speeddial-action:hover:not(:disabled) {
    background: var(--p-surface-800, #1e293b);
    color: #ffffff;
    border-color: var(--p-surface-600, #475569);
}

[data-theme="dark"] .p-speeddial-custom-label,
[data-theme="dark"] .p-speeddial-custom-icon {
    background: var(--p-surface-900, #0f172a);
    border-color: var(--p-surface-700, #334155);
    color: var(--p-surface-400, #94a3b8);
}

[data-theme="dark"] .p-speeddial-custom-item:hover .p-speeddial-custom-label,
[data-theme="dark"] .p-speeddial-custom-item:hover .p-speeddial-custom-icon {
    background: var(--p-surface-800, #1e293b);
    color: #ffffff;
    border-color: var(--p-surface-600, #475569);
}

[data-theme="dark"] .p-speeddial-tooltip {
    background: var(--p-surface-800, #1e293b);
    color: #ffffff;
    border: 1px solid var(--p-surface-700, #334155);
}
`

export default function SpeedDialIsland(container: HTMLElement, props: SpeedDialProps) {
    injectIslandStyle('speed-dial', SPEEDDIAL_CSS);

    const items = props.model || props.actions || [];
    const direction = props.direction || 'up';
    const type = props.type || 'linear';
    const radius = props.radius || (type === 'quarter-circle' ? 120 : 80);
    const transitionDelay = props.transitionDelay !== undefined ? props.transitionDelay : 30;
    const rotateAnimation = props.rotateAnimation !== false;
    const mask = !!props.mask;
    const isCustomTemplate = props.template === 'custom';
    const tooltipPosition = props.tooltipOptions?.position || (direction === 'left' ? 'top' : (direction === 'right' ? 'top' : 'left'));

    let isOpen = false;

    // Severity mapping for main button
    const btnSev = props.buttonProps?.severity || 'primary';
    let btnSevClass = 'p-button-primary';
    if (btnSev !== 'primary') {
        btnSevClass = `p-button-${btnSev.toLowerCase()}`;
    }
    const btnRounded = props.buttonProps?.rounded !== false ? 'p-button-rounded' : '';
    const btnIconOnly = props.buttonProps?.iconOnly !== false ? 'p-button-icon-only' : '';
    const customBtnClass = props.buttonProps?.styleClass || '';

    // Calculate position for an item based on its index
    function calculatePosition(index: number, count: number): { x: number; y: number } {
        if (type === 'linear') {
            const spacing = 52;
            const distance = (index + 1) * spacing;
            switch (direction) {
                case 'up': return { x: 0, y: -distance };
                case 'down': return { x: 0, y: distance };
                case 'left': return { x: -distance, y: 0 };
                case 'right': return { x: distance, y: 0 };
                default: return { x: 0, y: -distance };
            }
        }

        if (type === 'circle') {
            const step = (2 * Math.PI) / count;
            const angle = index * step - Math.PI / 2;
            return {
                x: Math.round(radius * Math.cos(angle)),
                y: Math.round(radius * Math.sin(angle))
            };
        }

        if (type === 'semi-circle') {
            const step = count > 1 ? Math.PI / (count - 1) : 0;
            switch (direction) {
                case 'up': {
                    const angle = Math.PI - index * step;
                    return {
                        x: Math.round(radius * Math.cos(angle)),
                        y: Math.round(-radius * Math.sin(angle))
                    };
                }
                case 'down': {
                    const angle = Math.PI - index * step;
                    return {
                        x: Math.round(radius * Math.cos(angle)),
                        y: Math.round(radius * Math.sin(angle))
                    };
                }
                case 'left': {
                    const angle = Math.PI / 2 + index * step;
                    return {
                        x: Math.round(-radius * Math.sin(angle)),
                        y: Math.round(radius * Math.cos(angle))
                    };
                }
                case 'right': {
                    const angle = -Math.PI / 2 + index * step;
                    return {
                        x: Math.round(radius * Math.sin(angle)),
                        y: Math.round(radius * Math.cos(angle))
                    };
                }
                default: {
                    const angle = Math.PI - index * step;
                    return {
                        x: Math.round(radius * Math.cos(angle)),
                        y: Math.round(-radius * Math.sin(angle))
                    };
                }
            }
        }

        if (type === 'quarter-circle') {
            const step = count > 1 ? (Math.PI / 2) / (count - 1) : 0;
            switch (direction) {
                case 'up-left': {
                    const angle = index * step;
                    return {
                        x: Math.round(-radius * Math.cos(angle)),
                        y: Math.round(-radius * Math.sin(angle))
                    };
                }
                case 'up-right': {
                    const angle = index * step;
                    return {
                        x: Math.round(radius * Math.cos(angle)),
                        y: Math.round(-radius * Math.sin(angle))
                    };
                }
                case 'down-left': {
                    const angle = index * step;
                    return {
                        x: Math.round(-radius * Math.cos(angle)),
                        y: Math.round(radius * Math.sin(angle))
                    };
                }
                case 'down-right': {
                    const angle = index * step;
                    return {
                        x: Math.round(radius * Math.sin(angle)),
                        y: Math.round(radius * Math.cos(angle))
                    };
                }
                default: {
                    const angle = index * step;
                    return {
                        x: Math.round(-radius * Math.cos(angle)),
                        y: Math.round(-radius * Math.sin(angle))
                    };
                }
            }
        }

        return { x: 0, y: 0 };
    }

    const uniqueId = 'speeddial_' + Math.random().toString(36).substring(2, 9);

    function render() {
        let maskHtml = '';
        if (mask) {
            maskHtml = `<div class="p-speeddial-mask ${isOpen ? 'p-speeddial-mask-visible' : ''}"></div>`;
        }

        const itemsHtml = items.map((item, index) => {
            const pos = calculatePosition(index, items.length);
            const delay = isOpen ? transitionDelay * index : transitionDelay * (items.length - 1 - index);
            
            let transformStyle = '';
            if (isCustomTemplate) {
                const customOffset = -40; // shift slightly left so icon aligns with button
                transformStyle = isOpen 
                    ? `transform: translate3d(${pos.x + customOffset}px, ${pos.y}px, 0) scale(1);` 
                    : `transform: translate3d(${customOffset}px, 0, 0) scale(0);`;
            } else {
                transformStyle = isOpen 
                    ? `transform: translate3d(${pos.x}px, ${pos.y}px, 0) scale(1);` 
                    : `transform: translate3d(0, 0, 0) scale(0);`;
            }

            const style = `${transformStyle} transition-delay: ${delay}ms;`;
            const iconHtml = item.icon ? getLucideIcon(item.icon, 18) : LucideIcons.zap;
            const tooltipText = item.tooltip || item.label || '';
            const tooltipHtml = tooltipText ? `
                <span class="p-speeddial-tooltip tooltip-${tooltipPosition}" data-index="${index}">
                    ${tooltipText}
                </span>
            ` : '';

            if (isCustomTemplate) {
                return `
                    <li class="p-speeddial-item" style="${style}" role="none" data-index="${index}">
                        <div class="p-speeddial-custom-item" data-index="${index}">
                            <span class="p-speeddial-custom-label">${item.label || ''}</span>
                            <button type="button" class="p-speeddial-custom-icon" aria-label="${item.label || ''}" tabindex="${isOpen ? '0' : '-1'}">
                                ${iconHtml}
                            </button>
                        </div>
                    </li>
                `;
            }

            const itemSevClass = item.severity ? `p-button-${item.severity.toLowerCase()}` : '';
            const tag = item.url ? 'a' : 'button';
            const hrefAttr = item.url ? `href="${item.url}" target="${item.target || '_self'}" rel="noopener"` : `type="button"`;

            return `
                <li class="p-speeddial-item" style="${style}" role="none" data-index="${index}">
                    <${tag} ${hrefAttr} 
                       class="p-speeddial-action p-button ${itemSevClass} ${item.styleClass || ''}" 
                       role="menuitem"
                       data-index="${index}"
                       tabindex="${isOpen ? '0' : '-1'}"
                       aria-label="${tooltipText || 'Action'}"
                       ${item.disabled ? 'disabled aria-disabled="true"' : ''}>
                        ${iconHtml}
                        ${tooltipHtml}
                    </${tag}>
                </li>
            `;
        }).join('');

        const openClass = isOpen ? 'p-speeddial-opened' : '';
        const rotateClass = rotateAnimation ? 'p-speeddial-rotate' : '';
        const ariaLabel = props.ariaLabel || 'Speed Dial Options';

        container.innerHTML = `
            ${maskHtml}
            <div class="p-speeddial p-component p-speeddial-direction-${direction} p-speeddial-${type} ${openClass}">
                <button type="button" 
                        class="p-speeddial-button p-button ${btnSevClass} ${btnRounded} ${btnIconOnly} ${customBtnClass}"
                        aria-haspopup="true"
                        aria-expanded="${isOpen}"
                        aria-controls="${uniqueId}_list"
                        aria-label="${ariaLabel}">
                    <span class="p-speeddial-icon ${rotateClass}">
                        ${LucideIcons.plus}
                    </span>
                </button>
                <ul id="${uniqueId}_list" class="p-speeddial-list" role="menu" aria-label="${ariaLabel}">
                    ${itemsHtml}
                </ul>
            </div>
        `;

        bindEvents();
    }

    function bindEvents() {
        const mainBtn = container.querySelector<HTMLButtonElement>('.p-speeddial-button');
        const maskEl = container.querySelector<HTMLDivElement>('.p-speeddial-mask');

        function toggle() {
            isOpen = !isOpen;
            render();
            if (isOpen) {
                const firstAction = container.querySelector<HTMLElement>('.p-speeddial-action, .p-speeddial-custom-item button');
                firstAction?.focus();
            } else {
                mainBtn?.focus();
            }
        }

        function close() {
            if (isOpen) {
                isOpen = false;
                render();
                mainBtn?.focus();
            }
        }

        mainBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            toggle();
        });

        maskEl?.addEventListener('click', (e) => {
            e.stopPropagation();
            close();
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (isOpen && !container.contains(e.target as Node)) {
                close();
            }
        });

        // Main button keyboard navigation
        mainBtn?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggle();
            } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                if (!isOpen) {
                    e.preventDefault();
                    isOpen = true;
                    render();
                    const firstAction = container.querySelector<HTMLElement>('.p-speeddial-action, .p-speeddial-custom-item button');
                    firstAction?.focus();
                }
            } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                if (!isOpen) {
                    e.preventDefault();
                    isOpen = true;
                    render();
                    const actions = container.querySelectorAll<HTMLElement>('.p-speeddial-action, .p-speeddial-custom-item button');
                    if (actions.length) actions[actions.length - 1].focus();
                }
            }
        });

        // Action items event binding
        const actionElements = container.querySelectorAll<HTMLElement>('.p-speeddial-action, .p-speeddial-custom-item');
        actionElements.forEach((el) => {
            const index = parseInt(el.getAttribute('data-index') || '-1', 10);
            const item = items[index];

            el.addEventListener('click', (e) => {
                if (item?.disabled) return;
                
                // Dispatch custom event
                container.dispatchEvent(new CustomEvent('speeddial:action', {
                    bubbles: true,
                    detail: { item, index }
                }));

                if (item?.command) {
                    try {
                        const fn = new Function('item', item.command);
                        fn(item);
                    } catch (err) {
                        console.error('SpeedDial command execution error:', err);
                    }
                }

                close();
            });

            // Tooltip hover
            const tooltip = el.querySelector<HTMLElement>('.p-speeddial-tooltip');
            if (tooltip) {
                el.addEventListener('mouseenter', () => {
                    tooltip.classList.add('p-tooltip-visible');
                });
                el.addEventListener('mouseleave', () => {
                    tooltip.classList.remove('p-tooltip-visible');
                });
                el.addEventListener('focus', () => {
                    tooltip.classList.add('p-tooltip-visible');
                });
                el.addEventListener('blur', () => {
                    tooltip.classList.remove('p-tooltip-visible');
                });
            }

            // Keyboard navigation among actions
            el.addEventListener('keydown', (e) => {
                const allActions = Array.from(container.querySelectorAll<HTMLElement>('.p-speeddial-action, .p-speeddial-custom-item button, .p-speeddial-custom-item'));
                const currentIndex = allActions.indexOf(el);

                if (e.key === 'Escape') {
                    e.preventDefault();
                    close();
                } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                    e.preventDefault();
                    const next = (currentIndex + 1) % allActions.length;
                    allActions[next]?.focus();
                } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                    e.preventDefault();
                    const prev = (currentIndex - 1 + allActions.length) % allActions.length;
                    allActions[prev]?.focus();
                } else if (e.key === 'Home') {
                    e.preventDefault();
                    allActions[0]?.focus();
                } else if (e.key === 'End') {
                    e.preventDefault();
                    allActions[allActions.length - 1]?.focus();
                }
            });
        });
    }

    render();
}
