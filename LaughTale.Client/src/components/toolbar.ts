import { resolvePart, applyPart, type PassthroughRecord } from '../runtime/parts';
import type { IslandContext } from '../runtime/registry';
﻿/**
 * LaughTale: Enterprise Toolbar Component (Aura Design System compliant)
 * Grouping component for buttons and controls with start, center, and end slot sections.
 * Features live interactivity for formatting toggles, media player playback, star toggles, and view switchers.
 */

import { injectIslandStyle } from '../runtime/styles';
import { html, setHtml, url as safeUrl, unsafe, attr, type Raw } from '../runtime/html';
import { setRovingTabindex, handleRovingKeydown } from '../accessibility/aria';
import type { PatternDeclaration } from '../accessibility/patterns';

export const a11y: PatternDeclaration = {
    kind: 'pattern',
    pattern: 'toolbar'
};

const TOOLBAR_CSS = `
.p-toolbar,
island-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: nowrap;
    padding: 0.75rem 1rem;
    background: var(--p-content-bg, var(--p-surface-0, #ffffff));
    border: 1px solid var(--p-border-color, var(--lt-surface-200));
    border-radius: var(--p-border-radius-md, var(--lt-radius, 6px));
    gap: 0.75rem;
    box-sizing: border-box;
    width: 100%;
    transition: background-color 0.15s ease, border-color 0.15s ease;
}

.p-toolbar-start,
.p-toolbar-center,
.p-toolbar-end,
.p-toolbar-group-start,
.p-toolbar-group-center,
.p-toolbar-group-end,
island-toolbar-start,
island-toolbar-center,
island-toolbar-end {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    box-sizing: border-box;
}

.p-toolbar-start,
island-toolbar-start {
    justify-content: flex-start;
    flex-shrink: 0;
}

.p-toolbar-center,
.p-toolbar-group-center,
island-toolbar-center {
    justify-content: center;
    flex: 1 1 auto;
}

.p-toolbar-end,
.p-toolbar-group-end,
island-toolbar-end {
    justify-content: flex-end;
    margin-inline-start: auto;
    flex-shrink: 0;
}

/* Toggle item active styling */
.p-toolbar [data-toggle-active="true"],
.p-toolbar .p-button-active-toggle {
    background: var(--p-surface-0, #ffffff) !important;
    color: var(--p-primary-color, var(--lt-primary-600, #10b981)) !important;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
    font-weight: 700 !important;
}

html.dark .p-toolbar,
html.dark island-toolbar,
[data-theme="dark"] .p-toolbar,
[data-theme="dark"] island-toolbar,
.dark .p-toolbar,
.dark island-toolbar {
    background: var(--p-surface-0);
    border-color: var(--p-border-color);
}

html.dark .p-toolbar [data-toggle-active="true"],
html.dark .p-toolbar .p-button-active-toggle,
[data-theme="dark"] .p-toolbar [data-toggle-active="true"],
[data-theme="dark"] .p-toolbar .p-button-active-toggle,
.dark .p-toolbar [data-toggle-active="true"],
.dark .p-toolbar .p-button-active-toggle {
    background: var(--p-surface-100) !important;
    color: var(--p-primary-color, #10b981) !important;
}
`;

export interface ToolbarProps {
    ariaLabel?: string;
    pt?: PassthroughRecord;
    studioOverrides?: Record<string, any>;
}

const PLAY_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" style="margin-inline-start: 2px;"><polygon points="6 3 20 12 6 21 6 3"/></svg>`;
const PAUSE_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`;

export default function ToolbarIsland(container: HTMLElement, props: ToolbarProps, ctx?: IslandContext) {
    injectIslandStyle('toolbar', TOOLBAR_CSS);
    container.setAttribute('data-part', 'root');

    // Unpack slot if present
    const slotEl = container.querySelector<HTMLElement>(':scope > .island-slot');
    if (slotEl) {
        while (slotEl.firstChild) {
            container.appendChild(slotEl.firstChild);
        }
        slotEl.remove();
    }

    const rootEl = container.querySelector<HTMLElement>('.p-toolbar') || container;
    rootEl.classList.add('p-toolbar', 'p-component');
    rootEl.setAttribute('role', 'toolbar');
    rootEl.setAttribute('aria-orientation', 'horizontal');
    rootEl.setAttribute('aria-label', props.ariaLabel || 'Toolbar');

    // Set classes on start, center, end sections
    rootEl.querySelectorAll<HTMLElement>('island-toolbar-start, .p-toolbar-start').forEach(el => el.classList.add('p-toolbar-start'));
    rootEl.querySelectorAll<HTMLElement>('island-toolbar-center, .p-toolbar-center').forEach(el => el.classList.add('p-toolbar-center'));
    rootEl.querySelectorAll<HTMLElement>('island-toolbar-end, .p-toolbar-end').forEach(el => el.classList.add('p-toolbar-end'));

    // 1. Text Formatting Toggles (Bold, Italic, Underline)
    const formatButtons = rootEl.querySelectorAll<HTMLButtonElement>('[aria-label="Bold"], [aria-label="Italic"], [aria-label="Underline"]');
    formatButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const isActive = btn.classList.toggle('p-button-active-toggle');
            btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
            if (isActive) {
                btn.style.background = 'var(--p-surface-0, #ffffff)';
                btn.style.color = 'var(--p-primary-color, #10b981)';
                btn.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
            } else {
                btn.style.background = 'transparent';
                btn.style.color = 'var(--p-text-color, var(--lt-surface-700))';
                btn.style.boxShadow = 'none';
            }
        }, { signal: ctx?.signal });
    });

    // 2. Alignment Exclusive Switcher (Left, Center, Right)
    const alignButtons = rootEl.querySelectorAll<HTMLButtonElement>('[aria-label="Align Left"], [aria-label="Align Center"], [aria-label="Align Right"]');
    alignButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            alignButtons.forEach(b => {
                b.classList.remove('p-button-active-toggle');
                b.setAttribute('aria-pressed', 'false');
                b.style.background = 'transparent';
                b.style.color = 'var(--p-text-color, var(--lt-surface-700))';
                b.style.boxShadow = 'none';
            });
            btn.classList.add('p-button-active-toggle');
            btn.setAttribute('aria-pressed', 'true');
            btn.style.background = 'var(--p-surface-0, #ffffff)';
            btn.style.color = 'var(--p-primary-color, #10b981)';
            btn.style.boxShadow = '0 1px 2px rgba(0,0,0,0.06)';
        }, { signal: ctx?.signal });
    });

    // 3. Grid / List View Switcher
    const viewButtons = rootEl.querySelectorAll<HTMLButtonElement>('[aria-label="Grid View"], [aria-label="List View"]');
    viewButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            viewButtons.forEach(b => {
                b.style.background = 'transparent';
                b.style.color = 'var(--p-text-muted, var(--lt-surface-600))';
                b.style.boxShadow = 'none';
            });
            btn.style.background = 'var(--p-surface-0, #ffffff)';
            btn.style.color = 'var(--p-primary-color, #10b981)';
            btn.style.boxShadow = '0 1px 2px rgba(0,0,0,0.06)';
        }, { signal: ctx?.signal });
    });

    // 4. Media Player Controls (Play / Pause toggle & scrubbing)
    const playBtn = rootEl.querySelector<HTMLButtonElement>('[aria-label="Play"], [aria-label="Pause"]');
    let isPlaying = false;
    if (playBtn) {
        playBtn.addEventListener('click', (e) => {
            e.preventDefault();
            isPlaying = !isPlaying;
            playBtn.setAttribute('aria-label', isPlaying ? 'Pause' : 'Play');
            setHtml(playBtn, isPlaying ? html`${unsafe(PAUSE_ICON_SVG)}` : html`${unsafe(PLAY_ICON_SVG)}`);
        }, { signal: ctx?.signal });
    }

    // 5. Star Repo Counter Toggle
    const starBtn = rootEl.querySelector<HTMLButtonElement>('button:has(svg polygon)');
    if (starBtn && starBtn.textContent?.includes('Star')) {
        let isStarred = false;
        starBtn.addEventListener('click', (e) => {
            e.preventDefault();
            isStarred = !isStarred;
            const countSpan = starBtn.querySelector('span:last-child');
            if (countSpan) {
                countSpan.textContent = isStarred ? '1.4k + 1' : '1.4k';
            }
            starBtn.style.color = isStarred ? 'var(--p-warn-500, #f59e0b)' : 'var(--p-text-color)';
        }, { signal: ctx?.signal });
    }

    const buttons = Array.from(rootEl.querySelectorAll<HTMLButtonElement>('button'));
    if (buttons.length > 0) {
        setRovingTabindex(buttons, 0);
        rootEl.addEventListener('keydown', (e) => {
            const idx = Math.max(0, buttons.indexOf(document.activeElement as HTMLButtonElement));
            handleRovingKeydown(e, buttons, idx, 'horizontal');
        }, { signal: ctx?.signal });
    }
}
