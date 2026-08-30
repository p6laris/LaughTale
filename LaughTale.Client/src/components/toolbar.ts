import { resolvePart, applyPart, type PassthroughRecord } from '../runtime/parts';
import type { IslandContext } from '../runtime/registry';
﻿/**
 * LaughTale: Enterprise Toolbar Component (Aura Design System compliant)
 * Grouping component for buttons and controls with start, center, and end slot sections.
 * Features live interactivity for formatting toggles, media player playback, star toggles, and view switchers.
 */

import { injectIslandStyle } from '../runtime/styles';

const TOOLBAR_CSS = `
.p-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: 0.75rem 1rem;
    background: var(--p-surface-0, #ffffff);
    border: 1px solid var(--p-border-color, #e2e8f0);
    border-radius: var(--p-border-radius, 6px);
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
.p-toolbar-group-end {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.p-toolbar-center,
.p-toolbar-group-center {
    justify-content: center;
    flex: 1 1 auto;
}

.p-toolbar-end,
.p-toolbar-group-end {
    margin-left: auto;
}

/* Toggle item active styling */
.p-toolbar [data-toggle-active="true"],
.p-toolbar .p-button-active-toggle {
    background: var(--p-surface-0, #ffffff) !important;
    color: var(--p-primary-600, #059669) !important;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
    font-weight: 700 !important;
}

.dark .p-toolbar [data-toggle-active="true"],
[data-theme="dark"] .p-toolbar .p-button-active-toggle {
    background: var(--p-surface-700, #334155) !important;
    color: var(--p-primary-400, #34d399) !important;
}

/* Dark Mode Tokens */
.dark .p-toolbar,
[data-theme="dark"] .p-toolbar {
    background: var(--p-surface-900, #0f172a);
    border-color: var(--p-surface-700, #334155);
}
`;

export interface ToolbarProps {
    ariaLabel?: string;
    pt?: PassthroughRecord;
    studioOverrides?: Record<string, any>;
}

const PLAY_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" style="margin-left: 2px;"><polygon points="6 3 20 12 6 21 6 3"/></svg>`;
const PAUSE_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`;

export default function ToolbarIsland(container: HTMLElement, props: ToolbarProps, ctx?: IslandContext) {
    injectIslandStyle('toolbar', TOOLBAR_CSS);

    const rootEl = container.querySelector<HTMLElement>('.p-toolbar') || container;
    rootEl.classList.add('p-toolbar', 'p-component');
    rootEl.setAttribute('role', 'toolbar');
    rootEl.setAttribute('aria-orientation', 'horizontal');
    if (props.ariaLabel) {
        rootEl.setAttribute('aria-label', props.ariaLabel);
    }

    // 1. Text Formatting Toggles (Bold, Italic, Underline)
    const formatButtons = rootEl.querySelectorAll<HTMLButtonElement>('[aria-label="Bold"], [aria-label="Italic"], [aria-label="Underline"]');
    formatButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const isActive = btn.classList.toggle('p-button-active-toggle');
            btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
            if (isActive) {
                btn.style.background = 'var(--p-surface-0)';
                btn.style.color = 'var(--p-primary-600)';
                btn.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
            } else {
                btn.style.background = 'transparent';
                btn.style.color = 'var(--p-surface-700)';
                btn.style.boxShadow = 'none';
            }
        });
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
                b.style.color = 'var(--p-surface-700)';
                b.style.boxShadow = 'none';
            });
            btn.classList.add('p-button-active-toggle');
            btn.setAttribute('aria-pressed', 'true');
            btn.style.background = 'var(--p-surface-0)';
            btn.style.color = 'var(--p-primary-600)';
            btn.style.boxShadow = '0 1px 2px rgba(0,0,0,0.06)';
        });
    });

    // 3. Grid / List View Switcher
    const viewButtons = rootEl.querySelectorAll<HTMLButtonElement>('[aria-label="Grid View"], [aria-label="List View"]');
    viewButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            viewButtons.forEach(b => {
                b.style.background = 'transparent';
                b.style.color = 'var(--p-surface-600)';
                b.style.boxShadow = 'none';
            });
            btn.style.background = 'var(--p-surface-0)';
            btn.style.color = 'var(--p-primary-600)';
            btn.style.boxShadow = '0 1px 2px rgba(0,0,0,0.06)';
        });
    });

    // 4. Media Player Controls (Play / Pause toggle & scrubbing)
    const playBtn = rootEl.querySelector<HTMLButtonElement>('[aria-label="Play"], [aria-label="Pause"]');
    let isPlaying = false;
    if (playBtn) {
        playBtn.addEventListener('click', (e) => {
            e.preventDefault();
            isPlaying = !isPlaying;
            playBtn.setAttribute('aria-label', isPlaying ? 'Pause' : 'Play');
            playBtn.innerHTML = isPlaying ? PAUSE_ICON_SVG : PLAY_ICON_SVG;
        });
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
            starBtn.style.color = isStarred ? '#eab308' : 'var(--p-text-color)';
        });
    }
}
