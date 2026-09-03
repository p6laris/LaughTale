import { resolvePart, applyPart, type PassthroughRecord } from '../runtime/parts';
import type { IslandContext } from '../runtime/registry';
﻿/**
 * LaughTale: Enterprise Tabs Component (Aura Design System compliant)
 * LaughTale Aura-exact tabs container with animated indicator bar,
 * gradient fade mask scroll navigation, controlled values, lazy loading, custom indicator, and ARIA keyboard support.
 */

import { injectIslandStyle } from '../runtime/styles';
import { html, setHtml, url as safeUrl, unsafe, attr, type Raw } from '../runtime/html';
import type { PatternDeclaration } from '../accessibility/patterns';

export const a11y: PatternDeclaration = {
    kind: 'pattern',
    pattern: 'tablist'
};

const TABS_CSS = `
.p-tabs,
island-tabs {
    display: flex;
    flex-direction: column;
    width: 100%;
    box-sizing: border-box;
}

.p-tablist,
island-tablist {
    display: flex;
    position: relative;
    background: transparent;
    border-bottom: 1px solid var(--p-border-color, var(--lt-surface-200));
    box-sizing: border-box;
    align-items: center;
    width: 100%;
    overflow: hidden;
}

.p-tablist-content {
    display: flex;
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
    position: relative;
    flex: 1 1 auto;
    scroll-behavior: smooth;
    width: 100%;
}
.p-tablist-content::-webkit-scrollbar {
    display: none;
}

.p-tablist-tab-list {
    display: flex;
    position: relative;
    margin: 0;
    padding: 0;
    list-style-type: none;
    gap: 0;
    width: auto;
}

.p-tab,
island-tab {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.125rem;
    border: none;
    background: transparent;
    color: var(--p-text-muted, var(--lt-surface-500));
    font-weight: 600;
    font-size: 0.875rem;
    cursor: pointer;
    text-decoration: none;
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
    transition: color 0.15s ease, border-color 0.15s ease;
    outline: none;
    user-select: none;
    position: relative;
    z-index: 2;
    white-space: nowrap;
    box-sizing: border-box;
}

.p-tab:hover:not(.p-tab-active):not(:disabled):not([aria-disabled="true"]),
island-tab:hover:not(.p-tab-active):not(:disabled):not([aria-disabled="true"]) {
    color: var(--p-text-color, var(--lt-surface-800));
}

.p-tab.p-tab-active,
island-tab.p-tab-active {
    color: var(--p-primary-color, var(--lt-primary-600, #10b981));
    border-bottom-color: var(--p-primary-color, var(--lt-primary-500, #10b981));
    font-weight: 700;
}

.p-tab:disabled,
.p-tab[aria-disabled="true"],
island-tab:disabled,
island-tab[aria-disabled="true"] {
    opacity: 0.35;
    cursor: not-allowed;
}

.p-tab:focus-visible,
island-tab:focus-visible {
    outline: 2px solid var(--p-primary-color, var(--lt-primary-500, #10b981));
    outline-offset: -2px;
}

/* Active indicator bar */
.p-tablist-active-bar {
    position: absolute;
    bottom: -1px;
    height: 2px;
    background: var(--p-primary-color, var(--lt-primary-500, #10b981));
    transition: left 0.2s cubic-bezier(0.2, 0, 0, 1), width 0.2s cubic-bezier(0.2, 0, 0, 1);
    z-index: 3;
    pointer-events: none;
}

/* Smooth Gradient Fade Mask Navigation Buttons */
.p-tablist-prev-button,
.p-tablist-next-button {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 3.5rem;
    display: flex;
    align-items: center;
    border: none;
    cursor: pointer;
    z-index: 10;
    transition: opacity 0.25s ease, color 0.15s ease;
    outline: none;
    color: var(--p-text-muted, var(--lt-surface-600));
    padding: 0;
    box-shadow: none;
}

.p-tablist-prev-button {
    left: 0;
    justify-content: flex-start;
    padding-left: 0.5rem;
    background: linear-gradient(to right, var(--p-surface-50, var(--lt-surface-50, #f8fafc)) 35%, rgba(248, 250, 252, 0.7) 65%, transparent 100%);
}

.p-tablist-next-button {
    right: 0;
    justify-content: flex-end;
    padding-right: 0.5rem;
    background: linear-gradient(to left, var(--p-surface-50, var(--lt-surface-50, #f8fafc)) 35%, rgba(248, 250, 252, 0.7) 65%, transparent 100%);
}

.p-tablist-prev-button:hover:not(:disabled),
.p-tablist-next-button:hover:not(:disabled) {
    color: var(--p-text-color, var(--lt-text-primary));
}

.p-tablist-prev-button:disabled,
.p-tablist-next-button:disabled {
    opacity: 0;
    pointer-events: none;
}

/* Tab Panels */
.p-tabpanels,
island-tabpanels {
    padding: 1.25rem 0;
    width: 100%;
    box-sizing: border-box;
    display: block;
}

.p-tabpanel,
island-tabpanel {
    display: none !important;
    width: 100%;
    box-sizing: border-box;
}
.p-tabpanel.p-tabpanel-active,
island-tabpanel.p-tabpanel-active {
    display: block !important;
    animation: p-tabpanel-fadein 0.2s cubic-bezier(0.2, 0, 0, 1);
}

@keyframes p-tabpanel-fadein {
    from { opacity: 0; transform: translateY(2px); }
    to { opacity: 1; transform: translateY(0); }
}

/* Custom Capsule Indicator */
.p-tablist-capsule,
island-tablist.p-tablist-capsule {
    border-bottom: none;
    background: var(--p-surface-100, var(--lt-surface-100));
    padding: 0.25rem;
    border-radius: var(--p-border-radius-md, 6px);
    width: fit-content;
}
.p-tablist-capsule .p-tablist-active-bar,
island-tablist.p-tablist-capsule .p-tablist-active-bar {
    display: none;
}
.p-tablist-capsule .p-tab,
.p-tablist-capsule island-tab,
island-tablist.p-tablist-capsule .p-tab,
island-tablist.p-tablist-capsule island-tab {
    border-bottom: none;
    margin-bottom: 0;
    border-radius: var(--p-border-radius, 6px);
    padding: 0.5rem 1rem;
    color: var(--p-text-muted, var(--lt-surface-600));
}
.p-tablist-capsule .p-tab-active,
.p-tablist-capsule island-tab.p-tab-active,
island-tablist.p-tablist-capsule .p-tab-active,
island-tablist.p-tablist-capsule island-tab.p-tab-active {
    background: var(--p-surface-0, var(--lt-surface-0));
    color: var(--p-text-color, var(--lt-text-primary));
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Dark Mode Tokens */
html.dark .p-tablist,
html.dark island-tablist,
[data-theme="dark"] .p-tablist,
[data-theme="dark"] island-tablist,
.dark .p-tablist,
.dark island-tablist {
    border-bottom-color: var(--p-border-color);
}
html.dark .p-tab,
html.dark island-tab,
[data-theme="dark"] .p-tab,
[data-theme="dark"] island-tab,
.dark .p-tab,
.dark island-tab {
    color: var(--p-text-muted);
}
html.dark .p-tab:hover:not(.p-tab-active):not(:disabled):not([aria-disabled="true"]),
html.dark island-tab:hover:not(.p-tab-active):not(:disabled):not([aria-disabled="true"]),
[data-theme="dark"] .p-tab:hover:not(.p-tab-active):not(:disabled):not([aria-disabled="true"]),
[data-theme="dark"] island-tab:hover:not(.p-tab-active):not(:disabled):not([aria-disabled="true"]),
.dark .p-tab:hover:not(.p-tab-active):not(:disabled):not([aria-disabled="true"]),
.dark island-tab:hover:not(.p-tab-active):not(:disabled):not([aria-disabled="true"]) {
    color: var(--p-text-color);
}
html.dark .p-tab-active,
html.dark island-tab.p-tab-active,
[data-theme="dark"] .p-tab-active,
[data-theme="dark"] island-tab.p-tab-active,
.dark .p-tab-active,
.dark island-tab.p-tab-active {
    color: var(--p-primary-color, #10b981);
    border-bottom-color: var(--p-primary-color, #10b981);
}
html.dark .p-tablist-active-bar,
[data-theme="dark"] .p-tablist-active-bar,
.dark .p-tablist-active-bar {
    background: var(--p-primary-color, #10b981);
}
html.dark .p-tablist-prev-button,
[data-theme="dark"] .p-tablist-prev-button,
.dark .p-tablist-prev-button {
    background: linear-gradient(to right, var(--p-surface-0) 35%, rgba(15, 23, 42, 0.7) 65%, transparent 100%);
    color: var(--p-text-muted);
}
html.dark .p-tablist-next-button,
[data-theme="dark"] .p-tablist-next-button,
.dark .p-tablist-next-button {
    background: linear-gradient(to left, var(--p-surface-0) 35%, rgba(15, 23, 42, 0.7) 65%, transparent 100%);
    color: var(--p-text-muted);
}
html.dark .p-tablist-prev-button:hover:not(:disabled),
html.dark .p-tablist-next-button:hover:not(:disabled),
[data-theme="dark"] .p-tablist-prev-button:hover:not(:disabled),
[data-theme="dark"] .p-tablist-next-button:hover:not(:disabled),
.dark .p-tablist-prev-button:hover:not(:disabled),
.dark .p-tablist-next-button:hover:not(:disabled) {
    color: var(--p-text-color);
}
html.dark .p-tablist-capsule,
html.dark island-tablist.p-tablist-capsule,
[data-theme="dark"] .p-tablist-capsule,
[data-theme="dark"] island-tablist.p-tablist-capsule,
.dark .p-tablist-capsule,
.dark island-tablist.p-tablist-capsule {
    background: var(--p-surface-100);
}
html.dark .p-tablist-capsule .p-tab-active,
html.dark .p-tablist-capsule island-tab.p-tab-active,
html.dark island-tablist.p-tablist-capsule .p-tab-active,
html.dark island-tablist.p-tablist-capsule island-tab.p-tab-active,
[data-theme="dark"] .p-tablist-capsule .p-tab-active,
[data-theme="dark"] .p-tablist-capsule island-tab.p-tab-active,
[data-theme="dark"] island-tablist.p-tablist-capsule .p-tab-active,
[data-theme="dark"] island-tablist.p-tablist-capsule island-tab.p-tab-active,
.dark .p-tablist-capsule .p-tab-active,
.dark .p-tablist-capsule island-tab.p-tab-active,
.dark island-tablist.p-tablist-capsule .p-tab-active,
.dark island-tablist.p-tablist-capsule island-tab.p-tab-active {
    background: var(--p-surface-0);
    color: var(--p-text-color);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
}
html.dark .p-tabpanel,
html.dark island-tabpanel,
[data-theme="dark"] .p-tabpanel,
[data-theme="dark"] island-tabpanel,
.dark .p-tabpanel,
.dark island-tabpanel {
    color: var(--p-text-color);
}
`;

export interface TabsProps {
    value?: string | number;
    scrollable?: boolean;
    selectOnFocus?: boolean;
    lazy?: boolean;
    pt?: PassthroughRecord;
    studioOverrides?: Record<string, any>;
}

const CHEVRON_LEFT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>`;
const CHEVRON_RIGHT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>`;

export default function TabsIsland(container: HTMLElement, props: TabsProps, ctx?: IslandContext) {
    injectIslandStyle('tabs', TABS_CSS);
    container.setAttribute('data-part', 'root');

    // Unpack slot if present
    const slotEl = container.querySelector<HTMLElement>(':scope > .island-slot');
    if (slotEl) {
        while (slotEl.firstChild) {
            container.appendChild(slotEl.firstChild);
        }
        slotEl.remove();
    }

    const rootEl = container.querySelector<HTMLElement>('.p-tabs') || container;
    rootEl.classList.add('p-tabs', 'p-component');

    const isScrollable = props.scrollable !== undefined ? !!props.scrollable : (rootEl.getAttribute('scrollable') === 'true' || rootEl.hasAttribute('scrollable') || rootEl.hasAttribute('data-scrollable'));
    const selectOnFocus = props.selectOnFocus !== undefined ? !!props.selectOnFocus : (rootEl.getAttribute('select-on-focus') === 'true' || rootEl.hasAttribute('select-on-focus') || rootEl.hasAttribute('data-select-on-focus'));
    const isLazy = props.lazy !== undefined ? !!props.lazy : (rootEl.getAttribute('lazy') === 'true' || rootEl.hasAttribute('lazy') || rootEl.hasAttribute('data-lazy'));

    let activeValue = String(props.value !== undefined ? props.value : (rootEl.getAttribute('value') || rootEl.getAttribute('data-value') || ''));

    let tabList = rootEl.querySelector<HTMLElement>(':scope > .p-tablist, :scope > island-tablist')
               || rootEl.querySelector<HTMLElement>('.p-tablist, island-tablist');
    let tabPanels = rootEl.querySelector<HTMLElement>(':scope > .p-tabpanels, :scope > island-tabpanels')
                 || rootEl.querySelector<HTMLElement>('.p-tabpanels, island-tabpanels');

    if (!tabList) return;

    tabList.classList.add('p-tablist');
    tabList.setAttribute('role', 'tablist');

    if (tabPanels) {
        tabPanels.classList.add('p-tabpanels');
    }

    let contentContainer = tabList.querySelector<HTMLElement>(':scope > .p-tablist-content');
    if (!contentContainer) {
        contentContainer = document.createElement('div');
        contentContainer.className = 'p-tablist-content';
        
        let tabUl = tabList.querySelector<HTMLElement>(':scope > .p-tablist-tab-list, :scope > ul');
        if (!tabUl) {
            tabUl = document.createElement('div');
            tabUl.className = 'p-tablist-tab-list';
            const directTabs = Array.from(tabList.querySelectorAll(':scope > .p-tab, :scope > island-tab, :scope > [data-tab-value]'));
            directTabs.forEach(t => {
                t.classList.add('p-tab');
                t.setAttribute('role', 'tab');
                tabUl!.appendChild(t);
            });
        } else {
            tabUl.classList.add('p-tablist-tab-list');
        }
        contentContainer.appendChild(tabUl);
        tabList.appendChild(contentContainer);
    }

    const tabsListWrapper = contentContainer.querySelector<HTMLElement>('.p-tablist-tab-list, ul') || contentContainer;

    let activeBar = contentContainer.querySelector<HTMLElement>('.p-tablist-active-bar');
    const isCapsule = tabList.classList.contains('p-tablist-capsule') || tabList.getAttribute('indicator') === 'capsule';
    if (!activeBar && !isCapsule) {
        activeBar = document.createElement('div');
        activeBar.className = 'p-tablist-active-bar';
        contentContainer.appendChild(activeBar);
    }

    function getTabs(): HTMLElement[] {
        return Array.from(tabsListWrapper.querySelectorAll<HTMLElement>('.p-tab, island-tab, [data-tab-value]'));
    }

    function getPanels(): HTMLElement[] {
        return Array.from(tabPanels ? tabPanels.querySelectorAll<HTMLElement>(':scope > .p-tabpanel, :scope > island-tabpanel, .p-tabpanel, island-tabpanel') : []);
    }

    // Set classes and roles on tabs and panels
    getTabs().forEach(t => {
        t.classList.add('p-tab');
        t.setAttribute('role', 'tab');
    });

    getPanels().forEach(p => {
        p.classList.add('p-tabpanel');
        p.setAttribute('role', 'tabpanel');
    });

    const allTabs = getTabs();
    if (!activeValue && allTabs.length > 0) {
        activeValue = allTabs[0].getAttribute('data-value') || allTabs[0].getAttribute('value') || '0';
    }

    function updateActiveBar(targetTab: HTMLElement | null) {
        if (!activeBar || isCapsule) return;
        if (!targetTab) {
            activeBar.style.width = '0px';
            return;
        }

        const left = targetTab.offsetLeft;
        const width = targetTab.offsetWidth;
        activeBar.style.left = `${left}px`;
        activeBar.style.width = `${width}px`;
    }

    function update() {
        const tabs = getTabs();
        const panels = getPanels();
        let activeTabEl: HTMLElement | null = null;

        tabs.forEach(tab => {
            const val = tab.getAttribute('data-value') || tab.getAttribute('value');
            const isActive = val === activeValue;
            tab.classList.toggle('p-tab-active', isActive);
            tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
            tab.setAttribute('tabindex', isActive ? '0' : '-1');

            if (isActive) {
                activeTabEl = tab;
            }
        });

        panels.forEach(panel => {
            const val = panel.getAttribute('data-value') || panel.getAttribute('value');
            const isActive = val === activeValue;
            panel.classList.toggle('p-tabpanel-active', isActive);
        });

        rootEl.setAttribute('data-value', activeValue);
        updateActiveBar(activeTabEl);

        if (isScrollable && activeTabEl && contentContainer) {
            const containerLeft = contentContainer.scrollLeft;
            const containerRight = containerLeft + contentContainer.clientWidth;
            const tabLeft = (activeTabEl as HTMLElement).offsetLeft;
            const tabRight = tabLeft + (activeTabEl as HTMLElement).offsetWidth;

            if (tabLeft < containerLeft) {
                contentContainer.scrollTo({ left: tabLeft - 40, behavior: 'smooth' });
            } else if (tabRight > containerRight) {
                contentContainer.scrollTo({ left: tabRight - contentContainer.clientWidth + 40, behavior: 'smooth' });
            }
        }
    }

    function setActiveTab(value: string) {
        const targetTab = getTabs().find(t => (t.getAttribute('data-value') || t.getAttribute('value')) === value);
        if (targetTab && (targetTab.hasAttribute('disabled') || targetTab.getAttribute('aria-disabled') === 'true' || targetTab.getAttribute('disabled') === 'true')) {
            return;
        }

        activeValue = value;
        update();
        container.dispatchEvent(new CustomEvent('tabs:change', {
            bubbles: true,
            detail: { value: activeValue }
        }));
    }

    // Attach click and keyboard events on tabs
    allTabs.forEach((tab, idx) => {
        const val = tab.getAttribute('data-value') || tab.getAttribute('value') || String(idx);
        const isDisabled = tab.hasAttribute('disabled') || tab.getAttribute('aria-disabled') === 'true' || tab.getAttribute('disabled') === 'true';

        tab.addEventListener('click', (e) => {
            e.preventDefault();
            if (isDisabled) return;
            setActiveTab(val);
        }, { signal: ctx?.signal });

        if (selectOnFocus) {
            tab.addEventListener('focus', () => {
                if (!isDisabled) setActiveTab(val);
            }, { signal: ctx?.signal });
        }

        tab.addEventListener('keydown', (e) => {
            const tabs = getTabs().filter(t => !t.hasAttribute('disabled') && t.getAttribute('aria-disabled') !== 'true' && t.getAttribute('disabled') !== 'true');
            const currentIdx = tabs.indexOf(tab);
            if (currentIdx === -1) return;

            let nextIdx = -1;
            if (e.key === 'ArrowRight') {
                nextIdx = (currentIdx + 1) % tabs.length;
            } else if (e.key === 'ArrowLeft') {
                nextIdx = (currentIdx - 1 + tabs.length) % tabs.length;
            } else if (e.key === 'Home') {
                nextIdx = 0;
            } else if (e.key === 'End') {
                nextIdx = tabs.length - 1;
            }

            if (nextIdx !== -1) {
                e.preventDefault();
                const nextTab = tabs[nextIdx];
                nextTab.focus();
                const nextVal = nextTab.getAttribute('data-value') || nextTab.getAttribute('value') || String(nextIdx);
                setActiveTab(nextVal);
            }
        }, { signal: ctx?.signal });
    });

    // Scrollable navigation buttons setup
    if (isScrollable && contentContainer) {
        let prevBtn = tabList.querySelector<HTMLButtonElement>('.p-tablist-prev-button');
        let nextBtn = tabList.querySelector<HTMLButtonElement>('.p-tablist-next-button');

        if (!prevBtn) {
            prevBtn = document.createElement('button');
            prevBtn.type = 'button';
            prevBtn.className = 'p-tablist-prev-button';
            prevBtn.setAttribute('aria-label', 'Previous Tab');
            setHtml(prevBtn, unsafe(CHEVRON_LEFT_SVG));
            tabList.insertBefore(prevBtn, contentContainer);
        }

        if (!nextBtn) {
            nextBtn = document.createElement('button');
            nextBtn.type = 'button';
            nextBtn.className = 'p-tablist-next-button';
            nextBtn.setAttribute('aria-label', 'Next Tab');
            setHtml(nextBtn, unsafe(CHEVRON_RIGHT_SVG));
            tabList.appendChild(nextBtn);
        }

        function checkScrollButtons() {
            if (!contentContainer || !prevBtn || !nextBtn) return;
            const { scrollLeft, scrollWidth, clientWidth } = contentContainer;
            prevBtn.disabled = scrollLeft <= 4;
            nextBtn.disabled = scrollLeft + clientWidth >= scrollWidth - 4;
        }

        prevBtn.addEventListener('click', () => {
            contentContainer?.scrollBy({ left: -220, behavior: 'smooth' });
        }, { signal: ctx?.signal });

        nextBtn.addEventListener('click', () => {
            contentContainer?.scrollBy({ left: 220, behavior: 'smooth' });
        }, { signal: ctx?.signal });

        contentContainer.addEventListener('scroll', checkScrollButtons, { signal: ctx?.signal });
        const tScroll = setTimeout(checkScrollButtons, 50);
        ctx?.onCleanup?.(() => clearTimeout(tScroll));
        window.addEventListener('resize', checkScrollButtons, { signal: ctx?.signal });
    }

    // Controlled demo: listen to buttons with data-tabs-target in card scope
    const demoCard = container.closest('[data-tabs-demo]') || container.parentElement;
    if (demoCard) {
        demoCard.querySelectorAll<HTMLButtonElement>('[data-tabs-target]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const targetTab = btn.getAttribute('data-tabs-target');
                if (targetTab) setActiveTab(targetTab);
            }, { signal: ctx?.signal });
        });
    }

    // Dynamic Closable demo support
    rootEl.addEventListener('click', (e) => {
        const closeBtn = (e.target as HTMLElement)?.closest('[data-tab-close]');
        if (!closeBtn) return;
        e.preventDefault();
        e.stopPropagation();
        const tabEl = closeBtn.closest('.p-tab, island-tab');
        if (!tabEl) return;
        const val = tabEl.getAttribute('data-value') || tabEl.getAttribute('value');
        const panelEl = getPanels().find(p => (p.getAttribute('data-value') || p.getAttribute('value')) === val);
        tabEl.remove();
        panelEl?.remove();
        const remainingTabs = getTabs();
        if (activeValue === val && remainingTabs.length > 0) {
            setActiveTab(remainingTabs[0].getAttribute('data-value') || remainingTabs[0].getAttribute('value') || '0');
        } else {
            update();
        }
    }, { signal: ctx?.signal });

    // Initial render
    const tInit = setTimeout(update, 50);
    ctx?.onCleanup?.(() => clearTimeout(tInit));
    window.addEventListener('resize', () => {
        const tabs = getTabs();
        const activeTabEl = tabs.find(t => (t.getAttribute('data-value') || t.getAttribute('value')) === activeValue);
        updateActiveBar(activeTabEl || null);
    }, { signal: ctx?.signal });
}
