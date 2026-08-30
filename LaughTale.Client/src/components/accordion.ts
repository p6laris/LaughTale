/**
 * LaughTale: Enterprise Accordion Component (Aura Design System compliant)
 * Expandable collapsible panel groups with butter-smooth 60fps CSS Grid animations,
 * single/multiple modes, controlled state, custom triggers, dynamic indicators,
 * disabled states, radio-grouped selection, and full W3C APG keyboard accessibility.
 */

import { injectIslandStyle } from '../runtime/styles';
import { AccordionProps, AccordionTab } from '../types/models';

const SVG_ICONS = {
    chevronDown: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
    chevronRight: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',
    folder: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>',
    folderOpen: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 14 1.5-6h13l-2.5 6H6Z"/><path d="M4 18h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2Z"/></svg>',
    plus: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>',
    minus: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg>',
    check: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    user: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>',
    shield: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>',
    zap: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>'
};

const ACCORDION_CSS = `
.p-accordion {
    display: flex;
    flex-direction: column;
    width: 100%;
    border: 1px solid var(--p-surface-200, #e2e8f0);
    border-radius: var(--p-border-radius-md, 6px);
    overflow: hidden;
    background: var(--p-surface-0, #ffffff);
    font-family: var(--p-font-family, inherit);
    box-sizing: border-box;
}

.p-accordionpanel {
    border-bottom: 1px solid var(--p-surface-200, #e2e8f0);
    transition: background-color 0.2s ease;
}
.p-accordionpanel:last-child {
    border-bottom: none;
}

.p-accordionheader {
    margin: 0;
    padding: 0;
}

.p-accordionheader-toggle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 1rem 1.25rem;
    font-weight: 600;
    font-size: 0.9375rem;
    color: var(--p-surface-700, #334155);
    background: var(--p-surface-0, #ffffff);
    border: none;
    cursor: pointer;
    text-align: left;
    transition: background-color 0.2s cubic-bezier(0.2, 0, 0, 1), color 0.2s cubic-bezier(0.2, 0, 0, 1);
    box-sizing: border-box;
}
.p-accordionheader-toggle:hover:not(:disabled) {
    background: var(--p-surface-50, #f8fafc);
    color: var(--p-surface-900, #0f172a);
}
.p-accordionpanel.p-accordionpanel-active > .p-accordionheader > .p-accordionheader-toggle {
    color: var(--p-primary-600, #10b981);
    font-weight: 700;
}

.p-accordionheader-toggle-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--p-surface-400, #94a3b8);
    transition: transform 0.3s cubic-bezier(0.2, 0, 0, 1), color 0.2s ease;
    flex-shrink: 0;
}
.p-accordionpanel.p-accordionpanel-active > .p-accordionheader > .p-accordionheader-toggle .p-accordionheader-toggle-icon {
    color: var(--p-primary-600, #10b981);
}
.p-accordion-css-indicator .p-accordionpanel.p-accordionpanel-active .p-accordionheader-toggle-icon {
    transform: rotate(180deg);
}

/* 60fps CSS Grid Smooth Collapse/Expand Transition */
.p-accordioncontent {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 280ms cubic-bezier(0.2, 0, 0, 1);
    background: var(--p-surface-0, #ffffff);
    overflow: hidden;
}
.p-accordionpanel.p-accordionpanel-active > .p-accordioncontent {
    grid-template-rows: 1fr;
}

.p-accordioncontent-wrapper {
    min-height: 0;
    overflow: hidden;
}

.p-accordioncontent-content {
    padding: 0.25rem 1.25rem 1.25rem 1.25rem;
    color: var(--p-surface-600, #475569);
    font-size: 0.875rem;
    line-height: 1.65;
    transition: opacity 220ms ease, transform 240ms cubic-bezier(0.2, 0, 0, 1);
    opacity: 0;
    transform: translateY(-6px);
}
.p-accordionpanel.p-accordionpanel-active > .p-accordioncontent .p-accordioncontent-content {
    opacity: 1;
    transform: translateY(0);
}

.p-accordionpanel.p-disabled {
    opacity: 0.5;
}
.p-accordionpanel.p-disabled .p-accordionheader-toggle {
    cursor: not-allowed;
}

/* Radio variant */
.p-accordion-radio-circle {
    width: 1.125rem;
    height: 1.125rem;
    border-radius: 9999px;
    border: 2px solid var(--p-surface-300, #cbd5e1);
    background: var(--p-surface-0, #ffffff);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-right: 0.75rem;
    flex-shrink: 0;
    transition: border-color 0.2s ease;
}
.p-accordionpanel.p-accordionpanel-active .p-accordion-radio-circle {
    border-color: var(--p-primary-600, #10b981);
}
.p-accordion-radio-inner {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 9999px;
    background: var(--p-primary-600, #10b981);
    display: none;
    transition: transform 0.2s cubic-bezier(0.2, 0, 0, 1);
}
.p-accordionpanel.p-accordionpanel-active .p-accordion-radio-inner {
    display: block;
    animation: pRadioPop 0.2s cubic-bezier(0.2, 0, 0, 1);
}
@keyframes pRadioPop {
    0% { transform: scale(0); }
    100% { transform: scale(1); }
}

/* Controlled top buttons */
.p-accordion-top-controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
}
.p-accordion-ctrl-btn {
    padding: 0.45rem 0.9rem;
    font-size: 0.8125rem;
    font-weight: 600;
    border-radius: 6px;
    border: 1px solid var(--p-surface-300, #cbd5e1);
    background: var(--p-surface-0, #ffffff);
    color: var(--p-surface-700, #334155);
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.2, 0, 0, 1);
}
.p-accordion-ctrl-btn:hover {
    background: var(--p-surface-100, #f1f5f9);
}
.p-accordion-ctrl-btn.p-highlight {
    background: var(--p-primary-500, #10b981);
    border-color: var(--p-primary-500, #10b981);
    color: #ffffff;
}

/* Dark Mode Tokens */
.dark .p-accordion,
[data-theme="dark"] .p-accordion {
    background: var(--p-surface-900, #0f172a) !important;
    border-color: var(--p-surface-700, #334155) !important;
    color: var(--p-surface-100, #f8fafc) !important;
}
.dark .p-accordionpanel,
[data-theme="dark"] .p-accordionpanel {
    border-color: var(--p-surface-700, #334155) !important;
}
.dark .p-accordionheader-toggle,
[data-theme="dark"] .p-accordionheader-toggle {
    background: var(--p-surface-900, #0f172a) !important;
    color: var(--p-surface-200, #e2e8f0) !important;
}
.dark .p-accordionheader-toggle:hover:not(:disabled),
[data-theme="dark"] .p-accordionheader-toggle:hover:not(:disabled) {
    background: var(--p-surface-800, #1e293b) !important;
    color: var(--p-surface-0, #ffffff) !important;
}
.dark .p-accordionpanel.p-accordionpanel-active > .p-accordionheader > .p-accordionheader-toggle,
[data-theme="dark"] .p-accordionpanel.p-accordionpanel-active > .p-accordionheader > .p-accordionheader-toggle {
    color: var(--p-primary-400, #34d399) !important;
}
.dark .p-accordioncontent,
[data-theme="dark"] .p-accordioncontent {
    background: var(--p-surface-900, #0f172a) !important;
}
.dark .p-accordioncontent-content,
[data-theme="dark"] .p-accordioncontent-content {
    color: var(--p-surface-300, #cbd5e1) !important;
}
.dark .p-accordion-ctrl-btn,
[data-theme="dark"] .p-accordion-ctrl-btn {
    background: var(--p-surface-900, #0f172a) !important;
    border-color: var(--p-surface-700, #334155) !important;
    color: var(--p-surface-200, #e2e8f0) !important;
}
.dark .p-accordion-ctrl-btn.p-highlight,
[data-theme="dark"] .p-accordion-ctrl-btn.p-highlight {
    background: var(--p-primary-500, #10b981) !important;
    color: #ffffff !important;
}
.dark .p-accordion-radio-circle,
[data-theme="dark"] .p-accordion-radio-circle {
    background: var(--p-surface-950, #020617) !important;
    border-color: var(--p-surface-700, #334155) !important;
}
`;

export default function AccordionIsland(container: HTMLElement, props: AccordionProps) {
    injectIslandStyle('accordion', ACCORDION_CSS);

    const tabs: AccordionTab[] = (props.tabs || []).map((t, i) => ({
        id: t.id || String(i),
        header: t.header || `Header ${i + 1}`,
        content: t.content || '',
        icon: t.icon,
        badge: t.badge,
        subtitle: t.subtitle,
        price: t.price,
        disabled: !!t.disabled,
        toggleIcon: t.toggleIcon
    }));

    const isMultiple = !!props.multiple;
    const isControlled = !!props.controlled;
    const withRadio = !!props.withRadio;
    const customIndicator = props.customIndicator || 'css'; // 'css' | 'match'

    // Active state tracking
    let activeKeys: Set<string> = new Set();

    if (props.value !== undefined && props.value !== null) {
        if (Array.isArray(props.value)) {
            props.value.forEach(v => activeKeys.add(String(v)));
        } else {
            activeKeys.add(String(props.value));
        }
    } else if (props.activeIndex !== undefined && props.activeIndex !== null) {
        if (Array.isArray(props.activeIndex)) {
            props.activeIndex.forEach(i => activeKeys.add(String(i)));
        } else {
            activeKeys.add(String(props.activeIndex));
        }
    } else if (tabs.length > 0) {
        activeKeys.add('0');
    }

    function togglePanel(idxStr: string) {
        const idx = Number(idxStr);
        if (tabs[idx]?.disabled) return;

        const isOpening = !activeKeys.has(idxStr);

        if (!isMultiple) {
            // Close other panels with animation
            container.querySelectorAll<HTMLElement>('.p-accordionpanel').forEach(panel => {
                const k = panel.getAttribute('data-panel-idx');
                if (k !== idxStr) {
                    panel.classList.remove('p-accordionpanel-active');
                    const toggleBtn = panel.querySelector<HTMLButtonElement>('.p-accordionheader-toggle');
                    if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
                    if (customIndicator === 'match') {
                        const iconSpan = panel.querySelector('.p-accordionheader-toggle-icon');
                        if (iconSpan) iconSpan.innerHTML = SVG_ICONS.folder;
                    } else if (tabs[Number(k)]?.toggleIcon === 'plusMinus') {
                        const iconSpan = panel.querySelector('.p-accordionheader-toggle-icon');
                        if (iconSpan) iconSpan.innerHTML = SVG_ICONS.plus;
                    }
                }
            });
            activeKeys.clear();
        }

        const targetPanel = container.querySelector<HTMLElement>(`.p-accordionpanel[data-panel-idx="${idxStr}"]`);
        if (targetPanel) {
            if (isOpening) {
                activeKeys.add(idxStr);
                targetPanel.classList.add('p-accordionpanel-active');
                targetPanel.querySelector<HTMLButtonElement>('.p-accordionheader-toggle')?.setAttribute('aria-expanded', 'true');
                if (customIndicator === 'match') {
                    const iconSpan = targetPanel.querySelector('.p-accordionheader-toggle-icon');
                    if (iconSpan) iconSpan.innerHTML = SVG_ICONS.folderOpen;
                } else if (tabs[idx]?.toggleIcon === 'plusMinus') {
                    const iconSpan = targetPanel.querySelector('.p-accordionheader-toggle-icon');
                    if (iconSpan) iconSpan.innerHTML = SVG_ICONS.minus;
                }
            } else {
                activeKeys.delete(idxStr);
                targetPanel.classList.remove('p-accordionpanel-active');
                targetPanel.querySelector<HTMLButtonElement>('.p-accordionheader-toggle')?.setAttribute('aria-expanded', 'false');
                if (customIndicator === 'match') {
                    const iconSpan = targetPanel.querySelector('.p-accordionheader-toggle-icon');
                    if (iconSpan) iconSpan.innerHTML = SVG_ICONS.folder;
                } else if (tabs[idx]?.toggleIcon === 'plusMinus') {
                    const iconSpan = targetPanel.querySelector('.p-accordionheader-toggle-icon');
                    if (iconSpan) iconSpan.innerHTML = SVG_ICONS.plus;
                }
            }
        }

        // Update controlled buttons state if present
        if (isControlled) {
            container.querySelectorAll<HTMLButtonElement>('.p-accordion-ctrl-btn').forEach(btn => {
                const k = btn.getAttribute('data-ctrl-idx');
                btn.classList.toggle('p-highlight', k !== null && activeKeys.has(k));
            });
        }

        container.dispatchEvent(new CustomEvent('accordion:change', {
            bubbles: true,
            detail: { value: Array.from(activeKeys) }
        }));
    }

    function renderInitial() {
        let topControlsHtml = '';
        if (isControlled) {
            topControlsHtml = `
                <div class="p-accordion-top-controls">
                    ${tabs.map((_, i) => {
                        const k = String(i);
                        const isActive = activeKeys.has(k);
                        return `
                            <button type="button" class="p-accordion-ctrl-btn ${isActive ? 'p-highlight' : ''}" data-ctrl-idx="${k}">
                                ${i + 1}
                            </button>
                        `;
                    }).join('')}
                </div>
            `;
        }

        const panelsHtml = tabs.map((tab, idx) => {
            const k = String(idx);
            const isActive = activeKeys.has(k);
            const disabledClass = tab.disabled ? 'p-disabled' : '';
            const activeClass = isActive ? 'p-accordionpanel-active' : '';
            const headerId = `acc-header-${idx}`;
            const contentId = `acc-content-${idx}`;

            // Indicator icon
            let indicatorSvg = SVG_ICONS.chevronDown;
            if (customIndicator === 'match') {
                indicatorSvg = isActive ? SVG_ICONS.folderOpen : SVG_ICONS.folder;
            } else if (tab.toggleIcon === 'plusMinus') {
                indicatorSvg = isActive ? SVG_ICONS.minus : SVG_ICONS.plus;
            }

            // Radio Button circle
            let radioHtml = withRadio ? `
                <span class="p-accordion-radio-circle">
                    <span class="p-accordion-radio-inner"></span>
                </span>
            ` : '';

            // Custom icon or Avatar in header
            let customIconHtml = '';
            if (tab.icon) {
                if (tab.icon === 'user') customIconHtml = `<span style="display: inline-flex; align-items: center; margin-right: 0.5rem; color: var(--p-surface-400);">${SVG_ICONS.user}</span>`;
                else if (tab.icon === 'shield') customIconHtml = `<span style="display: inline-flex; align-items: center; margin-right: 0.5rem; color: var(--p-primary-500);">${SVG_ICONS.shield}</span>`;
                else if (tab.icon === 'zap') customIconHtml = `<span style="display: inline-flex; align-items: center; margin-right: 0.5rem; color: #f59e0b;">${SVG_ICONS.zap}</span>`;
            }

            // Badge / Subtitle / Price
            let extraHeaderHtml = '';
            if (tab.badge) {
                extraHeaderHtml += `<span style="background: var(--p-primary-100, #dcfce7); color: var(--p-primary-700, #15803d); font-size: 0.75rem; font-weight: 700; padding: 0.15rem 0.5rem; border-radius: 9999px; margin-left: 0.5rem;">${tab.badge}</span>`;
            }
            if (tab.price) {
                extraHeaderHtml += `<span style="font-weight: 700; font-size: 0.875rem; color: var(--p-surface-900); margin-left: auto; margin-right: 1rem;">${tab.price}</span>`;
            }

            return `
                <div class="p-accordionpanel ${activeClass} ${disabledClass}" data-panel-idx="${k}">
                    <div class="p-accordionheader" role="heading" aria-level="2">
                        <button type="button" 
                                class="p-accordionheader-toggle" 
                                id="${headerId}"
                                aria-controls="${contentId}"
                                aria-expanded="${isActive ? 'true' : 'false'}"
                                aria-disabled="${tab.disabled ? 'true' : 'false'}"
                                ${tab.disabled ? 'disabled' : ''}
                                data-toggle-idx="${k}">
                            <div style="display: flex; align-items: center; width: 100%;">
                                ${radioHtml}
                                ${customIconHtml}
                                <span class="p-accordionheader-title">${tab.header}</span>
                                ${extraHeaderHtml}
                            </div>
                            <span class="p-accordionheader-toggle-icon">
                                ${indicatorSvg}
                            </span>
                        </button>
                    </div>
                    <div class="p-accordioncontent" 
                         id="${contentId}" 
                         role="region" 
                         aria-labelledby="${headerId}">
                        <div class="p-accordioncontent-wrapper">
                            <div class="p-accordioncontent-content">
                                ${tab.content}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        const cssIndicatorClass = customIndicator === 'css' ? 'p-accordion-css-indicator' : '';

        container.innerHTML = `
            ${topControlsHtml}
            <div class="p-accordion p-component ${cssIndicatorClass}" role="tablist">
                ${panelsHtml}
            </div>
        `;

        bindEvents();
    }

    function bindEvents() {
        // Controlled buttons
        container.querySelectorAll<HTMLButtonElement>('.p-accordion-ctrl-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const k = btn.getAttribute('data-ctrl-idx');
                if (k !== null) togglePanel(k);
            });
        });

        // Header toggles
        const headerButtons = container.querySelectorAll<HTMLButtonElement>('.p-accordionheader-toggle');
        headerButtons.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                const k = btn.getAttribute('data-toggle-idx');
                if (k !== null) togglePanel(k);
            });

            // Keyboard accessibility (APG W3C standard)
            btn.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    const next = (index + 1) % headerButtons.length;
                    headerButtons[next]?.focus();
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    const prev = (index - 1 + headerButtons.length) % headerButtons.length;
                    headerButtons[prev]?.focus();
                } else if (e.key === 'Home') {
                    e.preventDefault();
                    headerButtons[0]?.focus();
                } else if (e.key === 'End') {
                    e.preventDefault();
                    headerButtons[headerButtons.length - 1]?.focus();
                }
            });
        });
    }

    renderInitial();
}
