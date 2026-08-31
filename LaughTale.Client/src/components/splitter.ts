import { resolvePart, applyPart, type PassthroughRecord } from '../runtime/parts';
import type { IslandContext } from '../runtime/registry';
﻿/**
 * LaughTale: Enterprise Splitter Component (Aura Design System compliant)
 * Resizable multi-panel layout with horizontal/vertical orientation, min/max constraints,
 * collapsible snapping, nested layouts, state persistence, live resize events, and keyboard support.
 */

import { injectIslandStyle } from '../runtime/styles';

const SPLITTER_CSS = `
.p-splitter {
    display: flex;
    flex-wrap: nowrap;
    border: 1px solid var(--lt-surface-200);
    background: var(--lt-surface-0);
    border-radius: var(--p-border-radius-md, 6px);
    color: var(--lt-text-primary);
    overflow: hidden;
    box-sizing: border-box;
    position: relative;
}

.p-splitter-horizontal {
    flex-direction: row;
}

.p-splitter-vertical {
    flex-direction: column;
}

.p-splitterpanel {
    flex-grow: 1;
    overflow: auto;
    box-sizing: border-box;
    transition: flex-basis 0.15s cubic-bezier(0.2, 0, 0, 1);
}
.p-splitterpanel.p-splitterpanel-resizing {
    transition: none !important;
}

.p-splitter-gutter {
    flex-grow: 0;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 5;
    background: var(--lt-surface-100);
    user-select: none;
    touch-action: none;
    transition: background-color 0.15s ease, opacity 0.15s ease;
    box-sizing: border-box;
    outline: none;
}

.p-splitter-horizontal > .p-splitter-gutter {
    width: 6px;
    cursor: col-resize;
}

.p-splitter-vertical > .p-splitter-gutter {
    height: 6px;
    cursor: row-resize;
}

.p-splitter-gutter:hover,
.p-splitter-gutter:focus-visible,
.p-splitter-gutter[data-resizing="true"] {
    background: var(--lt-surface-200);
}
.p-splitter-gutter:focus-visible {
    outline: 2px solid var(--lt-primary-500);
    outline-offset: -1px;
}

.p-splitter-gutter-handle {
    background: var(--lt-surface-400);
    border-radius: 9999px;
    transition: background-color 0.15s ease;
}

.p-splitter-horizontal > .p-splitter-gutter > .p-splitter-gutter-handle {
    width: 2px;
    height: 1.5rem;
}

.p-splitter-vertical > .p-splitter-gutter > .p-splitter-gutter-handle {
    height: 2px;
    width: 1.5rem;
}

.p-splitter-gutter:hover > .p-splitter-gutter-handle,
.p-splitter-gutter[data-resizing="true"] > .p-splitter-gutter-handle {
    background: var(--lt-surface-600);
}

.p-splitter[data-disabled="true"] > .p-splitter-gutter {
    cursor: default !important;
    pointer-events: none !important;
    opacity: 0.6;
}

/* Dark Mode Tokens */
html.dark .p-splitter,
[data-theme="dark"] .p-splitter,
.dark .p-splitter {
    background: var(--p-surface-0, #090d16) !important;
    border-color: var(--p-border-color, #334155) !important;
    color: var(--p-text-color, #f8fafc) !important;
}

html.dark .p-splitter-gutter,
[data-theme="dark"] .p-splitter-gutter,
.dark .p-splitter-gutter {
    background: var(--p-surface-100, #1e293b) !important;
}

html.dark .p-splitter-gutter:hover,
html.dark .p-splitter-gutter:focus-visible,
html.dark .p-splitter-gutter[data-resizing="true"],
[data-theme="dark"] .p-splitter-gutter:hover,
[data-theme="dark"] .p-splitter-gutter:focus-visible,
[data-theme="dark"] .p-splitter-gutter[data-resizing="true"],
.dark .p-splitter-gutter:hover,
.dark .p-splitter-gutter:focus-visible,
.dark .p-splitter-gutter[data-resizing="true"] {
    background: var(--p-surface-200, #334155) !important;
}

html.dark .p-splitter-gutter-handle,
[data-theme="dark"] .p-splitter-gutter-handle,
.dark .p-splitter-gutter-handle {
    background: var(--p-surface-400, #64748b) !important;
}

html.dark .p-splitter-gutter:hover > .p-splitter-gutter-handle,
html.dark .p-splitter-gutter[data-resizing="true"] > .p-splitter-gutter-handle,
[data-theme="dark"] .p-splitter-gutter:hover > .p-splitter-gutter-handle,
[data-theme="dark"] .p-splitter-gutter[data-resizing="true"] > .p-splitter-gutter-handle,
.dark .p-splitter-gutter:hover > .p-splitter-gutter-handle,
.dark .p-splitter-gutter[data-resizing="true"] > .p-splitter-gutter-handle {
    background: var(--p-text-muted, #94a3b8) !important;
}
`;

export interface SplitterProps {
    layout?: 'horizontal' | 'vertical';
    sizes?: number[];
    disabled?: boolean;
    stateKey?: string;
    stateStorage?: 'local' | 'session';
    pt?: PassthroughRecord;
    studioOverrides?: Record<string, any>;
}

export default function SplitterIsland(container: HTMLElement, props: SplitterProps, ctx?: IslandContext) {
    injectIslandStyle('splitter', SPLITTER_CSS);

    const rootEl = container.querySelector<HTMLElement>('.p-splitter') || container;
    const layout = props.layout || (rootEl.classList.contains('p-splitter-vertical') ? 'vertical' : 'horizontal');
    const isHorizontal = layout === 'horizontal';
    const isDisabled = !!props.disabled || rootEl.getAttribute('data-disabled') === 'true';
    const stateKey = props.stateKey || rootEl.getAttribute('data-state-key');

    // Find direct child panels
    let panels = Array.from(rootEl.children).filter(el => 
        el.classList.contains('p-splitterpanel') || el.hasAttribute('data-splitterpanel')
    ) as HTMLElement[];

    // If no panel classes, treat all non-gutter direct children as panels
    if (panels.length === 0) {
        panels = Array.from(rootEl.children).filter(el => 
            !el.classList.contains('p-splitter-gutter')
        ) as HTMLElement[];
    }

    if (panels.length === 0) return;

    // Apply classes
    rootEl.classList.add('p-splitter', 'p-component', isHorizontal ? 'p-splitter-horizontal' : 'p-splitter-vertical');
    if (isDisabled) rootEl.setAttribute('data-disabled', 'true');

    panels.forEach(p => p.classList.add('p-splitterpanel'));

    // Initial sizes
    let currentSizes: number[] = [];
    if (stateKey) {
        try {
            const cached = localStorage.getItem(stateKey);
            if (cached) currentSizes = JSON.parse(cached);
        } catch (_) {}
    }

    if (!currentSizes || currentSizes.length !== panels.length) {
        if (props.sizes && props.sizes.length === panels.length) {
            currentSizes = [...props.sizes];
        } else {
            // Read from data-size attribute or divide equally
            const definedSizes = panels.map(p => {
                const s = p.getAttribute('data-size');
                return s ? parseFloat(s) : null;
            });
            const hasDefined = definedSizes.some(s => s !== null);
            if (hasDefined) {
                const filled = definedSizes.map(s => s ?? (100 / panels.length));
                const sum = filled.reduce((a, b) => a + b, 0);
                currentSizes = filled.map(s => (s / sum) * 100);
            } else {
                currentSizes = panels.map(() => 100 / panels.length);
            }
        }
    }

    // Insert gutters if not already present
    // Remove existing gutters first
    Array.from(rootEl.querySelectorAll(':scope > .p-splitter-gutter')).forEach(g => g.remove());

    const gutters: HTMLElement[] = [];
    for (let i = 0; i < panels.length - 1; i++) {
        const gutter = document.createElement('div');
        gutter.className = 'p-splitter-gutter';
        gutter.setAttribute('role', 'separator');
        gutter.setAttribute('tabindex', isDisabled ? '-1' : '0');
        gutter.setAttribute('aria-orientation', isHorizontal ? 'vertical' : 'horizontal');
        gutter.setAttribute('aria-valuenow', currentSizes[i].toFixed(1));
        
        const handle = document.createElement('div');
        handle.className = 'p-splitter-gutter-handle';
        gutter.appendChild(handle);

        panels[i].after(gutter);
        gutters.push(gutter);
    }

    function applySizes(sizes: number[], triggerEvents = false, eventType: 'resizestart' | 'resize' | 'resizeend' = 'resize') {
        const gutterWidthTotal = (panels.length - 1) * 6; // 6px per gutter
        panels.forEach((p, idx) => {
            const pct = sizes[idx];
            p.style.flexBasis = `calc(${pct}% - ${(gutterWidthTotal * pct) / 100}px)`;
            p.style.flexGrow = '0';
            p.style.flexShrink = '0';

            // Check compact mode hook
            if (p.hasAttribute('data-compact-below')) {
                const threshold = parseFloat(p.getAttribute('data-compact-below') || '28');
                p.classList.toggle('p-compact', pct < threshold);
            }
        });

        gutters.forEach((g, idx) => {
            g.setAttribute('aria-valuenow', sizes[idx].toFixed(1));
        });

        if (stateKey && eventType === 'resizeend') {
            try { localStorage.setItem(stateKey, JSON.stringify(sizes)); } catch (_) {}
        }

        if (triggerEvents) {
            container.dispatchEvent(new CustomEvent(`splitter:${eventType}`, {
                bubbles: true,
                detail: { sizes: [...sizes] }
            }));

            // Also dispatch global callback for demo metrics
            const metricBox = container.closest('.component-card')?.querySelector('.p-splitter-metrics');
            if (metricBox) {
                const format = (s: number[]) => s.map(n => n.toFixed(1) + '%').join(', ');
                if (eventType === 'resizestart') {
                    const el = metricBox.querySelector('[data-metric="resizestart"]');
                    if (el) el.textContent = `[${format(sizes)}]`;
                } else if (eventType === 'resize') {
                    const el = metricBox.querySelector('[data-metric="resize"]');
                    if (el) el.textContent = `[${format(sizes)}]`;
                } else if (eventType === 'resizeend') {
                    const el = metricBox.querySelector('[data-metric="resizeend"]');
                    if (el) el.textContent = `[${format(sizes)}]`;
                }
            }

            // Sync stateful demo percentage labels
            container.closest('.component-card')?.querySelectorAll('[data-splitter-size-label]').forEach(lbl => {
                const panelIdx = parseInt(lbl.getAttribute('data-splitter-size-label') || '0', 10);
                if (sizes[panelIdx] !== undefined) {
                    lbl.textContent = `(${sizes[panelIdx].toFixed(1)}%)`;
                }
            });
        }
    }

    applySizes(currentSizes);

    if (isDisabled) return;

    // Attach dragging to each gutter
    gutters.forEach((gutter, gutterIdx) => {
        let isDragging = false;
        let startPos = 0;
        let startSizes: number[] = [];

        const prevPanel = panels[gutterIdx];
        const nextPanel = panels[gutterIdx + 1];

        const prevMin = parseFloat(prevPanel.getAttribute('data-min-size') || '0');
        const prevMax = parseFloat(prevPanel.getAttribute('data-max-size') || '100');
        const prevCollapsible = prevPanel.hasAttribute('data-collapsible');
        const prevCollapsedSize = parseFloat(prevPanel.getAttribute('data-collapsed-size') || '0');

        const nextMin = parseFloat(nextPanel.getAttribute('data-min-size') || '0');
        const nextMax = parseFloat(nextPanel.getAttribute('data-max-size') || '100');
        const nextCollapsible = nextPanel.hasAttribute('data-collapsible');
        const nextCollapsedSize = parseFloat(nextPanel.getAttribute('data-collapsed-size') || '0');

        function onPointerDown(e: PointerEvent) {
            isDragging = true;
            startPos = isHorizontal ? e.clientX : e.clientY;
            startSizes = [...currentSizes];

            gutter.setAttribute('data-resizing', 'true');
            gutter.setPointerCapture(e.pointerId);
            document.body.style.userSelect = 'none';

            panels.forEach(p => p.classList.add('p-splitterpanel-resizing'));

            applySizes(currentSizes, true, 'resizestart');
        }

        function onPointerMove(e: PointerEvent) {
            if (!isDragging) return;

            const totalSize = isHorizontal ? rootEl.offsetWidth : rootEl.offsetHeight;
            if (totalSize <= 0) return;

            const currentPos = isHorizontal ? e.clientX : e.clientY;
            const deltaPx = currentPos - startPos;
            const deltaPct = (deltaPx / totalSize) * 100;

            let newPrevSize = startSizes[gutterIdx] + deltaPct;
            let newNextSize = startSizes[gutterIdx + 1] - deltaPct;
            const combinedSize = startSizes[gutterIdx] + startSizes[gutterIdx + 1];

            // Handle collapsible logic
            if (prevCollapsible && newPrevSize < prevMin) {
                const midpoint = (prevMin + prevCollapsedSize) / 2;
                if (newPrevSize < midpoint) {
                    newPrevSize = prevCollapsedSize;
                    newNextSize = combinedSize - prevCollapsedSize;
                } else {
                    newPrevSize = prevMin;
                    newNextSize = combinedSize - prevMin;
                }
            } else {
                newPrevSize = Math.max(prevMin, Math.min(prevMax, newPrevSize));
                newNextSize = combinedSize - newPrevSize;
            }

            if (nextCollapsible && newNextSize < nextMin) {
                const midpoint = (nextMin + nextCollapsedSize) / 2;
                if (newNextSize < midpoint) {
                    newNextSize = nextCollapsedSize;
                    newPrevSize = combinedSize - nextCollapsedSize;
                } else {
                    newNextSize = nextMin;
                    newPrevSize = combinedSize - nextMin;
                }
            } else {
                newNextSize = Math.max(nextMin, Math.min(nextMax, newNextSize));
                newPrevSize = combinedSize - newNextSize;
            }

            currentSizes[gutterIdx] = newPrevSize;
            currentSizes[gutterIdx + 1] = newNextSize;

            applySizes(currentSizes, true, 'resize');
        }

        function onPointerUp(e: PointerEvent) {
            if (!isDragging) return;
            isDragging = false;
            gutter.removeAttribute('data-resizing');
            try { gutter.releasePointerCapture(e.pointerId); } catch (_) {}
            document.body.style.userSelect = '';

            panels.forEach(p => p.classList.remove('p-splitterpanel-resizing'));

            applySizes(currentSizes, true, 'resizeend');
        }

        gutter.addEventListener('pointerdown', onPointerDown);
        gutter.addEventListener('pointermove', onPointerMove);
        gutter.addEventListener('pointerup', onPointerUp);
        gutter.addEventListener('pointercancel', onPointerUp);

        // Keyboard accessibility
        gutter.addEventListener('keydown', (e) => {
            const step = 2; // 2% per step
            let delta = 0;
            if ((isHorizontal && e.key === 'ArrowLeft') || (!isHorizontal && e.key === 'ArrowUp')) {
                delta = -step;
            } else if ((isHorizontal && e.key === 'ArrowRight') || (!isHorizontal && e.key === 'ArrowDown')) {
                delta = step;
            } else if (e.key === 'Home') {
                delta = -100;
            } else if (e.key === 'End') {
                delta = 100;
            }

            if (delta !== 0) {
                e.preventDefault();
                const combinedSize = currentSizes[gutterIdx] + currentSizes[gutterIdx + 1];
                let newPrevSize = Math.max(prevMin, Math.min(prevMax, currentSizes[gutterIdx] + delta));
                let newNextSize = combinedSize - newPrevSize;

                currentSizes[gutterIdx] = newPrevSize;
                currentSizes[gutterIdx + 1] = newNextSize;
                applySizes(currentSizes, true, 'resize');
                applySizes(currentSizes, true, 'resizeend');
            }
        });
    });
}
