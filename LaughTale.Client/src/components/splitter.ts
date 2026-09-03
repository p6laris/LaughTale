import { resolvePart, applyPart, type PassthroughRecord } from '../runtime/parts';
import type { IslandContext } from '../runtime/registry';
﻿/**
 * LaughTale: Enterprise Splitter Component (Aura Design System compliant)
 * Resizable multi-panel layout with horizontal/vertical orientation, min/max constraints,
 * collapsible snapping, nested layouts, state persistence, live resize events, and keyboard support.
 */

import { injectIslandStyle } from '../runtime/styles';
import type { PatternDeclaration } from '../accessibility/patterns';

export const a11y: PatternDeclaration = {
    kind: 'presentational'
};

const SPLITTER_CSS = `
.p-splitter {
    display: flex;
    flex-wrap: nowrap;
    border: 1px solid var(--p-border-color, var(--lt-surface-200));
    background: var(--p-content-bg, var(--p-surface-0, #ffffff));
    border-radius: var(--p-border-radius-md, var(--lt-radius-md, 6px));
    color: var(--p-text-color, var(--lt-text-primary));
    overflow: hidden;
    box-sizing: border-box;
    position: relative;
    width: 100%;
}

.p-splitter-horizontal {
    flex-direction: row;
}

.p-splitter-vertical {
    flex-direction: column;
}

.p-splitterpanel,
island-splitter-panel {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    overflow: auto;
    box-sizing: border-box;
    transition: flex-basis 0.15s cubic-bezier(0.2, 0, 0, 1);
    min-width: 0;
    min-height: 0;
}
.p-splitter-horizontal > .p-splitterpanel,
.p-splitter-horizontal > island-splitter-panel {
    height: 100%;
}
.p-splitter-vertical > .p-splitterpanel,
.p-splitter-vertical > island-splitter-panel {
    width: 100%;
}
.p-splitterpanel.p-splitterpanel-resizing,
island-splitter-panel.p-splitterpanel-resizing {
    transition: none !important;
}

.p-splitter-gutter {
    flex-grow: 0;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 5;
    background: var(--p-surface-100, var(--lt-surface-100));
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
    background: var(--p-surface-200, var(--lt-surface-200));
}
.p-splitter-gutter:focus-visible {
    outline: 2px solid var(--p-primary-color, var(--lt-primary-500, #10b981));
    outline-offset: -1px;
}

.p-splitter-gutter-handle {
    background: var(--p-surface-400, var(--lt-surface-400));
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
    background: var(--p-primary-color, var(--lt-primary-500, #10b981));
}

.p-splitter[data-disabled="true"] > .p-splitter-gutter {
    cursor: default !important;
    pointer-events: none !important;
    opacity: 0.5;
}

/* Dark Mode Tokens */
html.dark .p-splitter,
[data-theme="dark"] .p-splitter,
.dark .p-splitter {
    background: var(--p-surface-0) !important;
    border-color: var(--p-border-color) !important;
    color: var(--p-text-color) !important;
}

html.dark .p-splitter-gutter,
[data-theme="dark"] .p-splitter-gutter,
.dark .p-splitter-gutter {
    background: var(--p-surface-100) !important;
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
    background: var(--p-surface-200) !important;
}

html.dark .p-splitter-gutter-handle,
[data-theme="dark"] .p-splitter-gutter-handle,
.dark .p-splitter-gutter-handle {
    background: var(--p-surface-400) !important;
}

html.dark .p-splitter-gutter:hover > .p-splitter-gutter-handle,
html.dark .p-splitter-gutter[data-resizing="true"] > .p-splitter-gutter-handle,
[data-theme="dark"] .p-splitter-gutter:hover > .p-splitter-gutter-handle,
[data-theme="dark"] .p-splitter-gutter[data-resizing="true"] > .p-splitter-gutter-handle,
.dark .p-splitter-gutter:hover > .p-splitter-gutter-handle,
.dark .p-splitter-gutter[data-resizing="true"] > .p-splitter-gutter-handle {
    background: var(--p-primary-color, var(--lt-primary-500, #10b981)) !important;
}
`;

export interface SplitterProps {
    layout?: 'horizontal' | 'vertical';
    sizes?: number[] | string;
    disabled?: boolean;
    stateKey?: string;
    stateStorage?: 'local' | 'session';
    pt?: PassthroughRecord;
    studioOverrides?: Record<string, any>;
}

export default function SplitterIsland(container: HTMLElement, props: SplitterProps, ctx?: IslandContext) {
    injectIslandStyle('splitter', SPLITTER_CSS);

    // 1. Unpack direct slot container if wrapped by server tag helper
    const slotEl = container.querySelector(':scope > .island-slot') as HTMLElement;
    if (slotEl) {
        while (slotEl.firstChild) {
            container.appendChild(slotEl.firstChild);
        }
        slotEl.remove();
    }

    const layoutAttr = container.getAttribute('layout') || container.getAttribute('data-layout');
    const layout = props.layout || layoutAttr || (container.classList.contains('p-splitter-vertical') ? 'vertical' : 'horizontal');
    const isHorizontal = layout === 'horizontal';
    const disabledAttr = container.getAttribute('disabled') === 'true' || container.hasAttribute('disabled');
    const isDisabled = !!props.disabled || disabledAttr || container.getAttribute('data-disabled') === 'true';
    const stateKey = props.stateKey || container.getAttribute('state-key') || container.getAttribute('data-state-key');

    // 2. Find direct child panels
    let panels = Array.from(container.children).filter(el => 
        !el.classList.contains('p-splitter-gutter') &&
        el.tagName !== 'SCRIPT' &&
        el.tagName !== 'STYLE'
    ) as HTMLElement[];

    if (panels.length === 0) return;

    // 3. Apply base classes
    container.classList.add('p-splitter', 'p-component', isHorizontal ? 'p-splitter-horizontal' : 'p-splitter-vertical');
    if (isDisabled) container.setAttribute('data-disabled', 'true');

    panels.forEach(p => p.classList.add('p-splitterpanel'));

    // 4. Parse sizes
    let rawSizes: number[] | null = null;
    if (Array.isArray(props.sizes)) {
        rawSizes = props.sizes;
    } else if (typeof props.sizes === 'string') {
        rawSizes = (props.sizes as string).split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
    } else if (Array.isArray((props as any).panelSizes)) {
        rawSizes = (props as any).panelSizes;
    } else if (typeof (props as any).panelSizes === 'string') {
        rawSizes = ((props as any).panelSizes as string).split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
    }

    if (!rawSizes && container.hasAttribute('sizes')) {
        const attr = container.getAttribute('sizes') || '';
        rawSizes = attr.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
    }

    // 5. Initial sizes resolution
    let currentSizes: number[] = [];
    if (stateKey) {
        try {
            const cached = localStorage.getItem(stateKey);
            if (cached) currentSizes = JSON.parse(cached);
        } catch (_) {}
    }

    if (!currentSizes || currentSizes.length !== panels.length) {
        if (rawSizes && rawSizes.length === panels.length) {
            const sum = rawSizes.reduce((a, b) => a + b, 0);
            currentSizes = sum > 0 ? rawSizes.map(s => (s / sum) * 100) : rawSizes;
        } else {
            const definedSizes = panels.map(p => {
                const s = p.getAttribute('data-size') || p.getAttribute('size');
                return s ? parseFloat(s) : null;
            });
            const hasDefined = definedSizes.some(s => s !== null);
            if (hasDefined) {
                const filled = definedSizes.map(s => s ?? (100 / panels.length));
                const sum = filled.reduce((a, b) => a + b, 0);
                currentSizes = sum > 0 ? filled.map(s => (s / sum) * 100) : panels.map(() => 100 / panels.length);
            } else {
                currentSizes = panels.map(() => 100 / panels.length);
            }
        }
    }

    // 6. Insert gutters between panels
    Array.from(container.querySelectorAll(':scope > .p-splitter-gutter')).forEach(g => g.remove());

    const gutters: HTMLElement[] = [];
    for (let i = 0; i < panels.length - 1; i++) {
        const gutter = document.createElement('div');
        gutter.className = 'p-splitter-gutter';
        gutter.setAttribute('role', 'separator');
        gutter.setAttribute('tabindex', isDisabled ? '-1' : '0');
        gutter.setAttribute('aria-orientation', isHorizontal ? 'vertical' : 'horizontal');
        gutter.setAttribute('aria-valuenow', (currentSizes[i] ?? (100 / panels.length)).toFixed(1));
        
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
            const sizeCalc = `calc(${pct}% - ${(gutterWidthTotal * pct) / 100}px)`;
            p.style.flexBasis = sizeCalc;
            p.style.flexGrow = '0';
            p.style.flexShrink = '0';
            if (isHorizontal) {
                p.style.width = sizeCalc;
                p.style.height = '100%';
            } else {
                p.style.height = sizeCalc;
                p.style.width = '100%';
            }

            // Check compact mode hook
            if (p.hasAttribute('data-compact-below') || p.hasAttribute('compact-below')) {
                const threshold = parseFloat(p.getAttribute('data-compact-below') || p.getAttribute('compact-below') || '28');
                p.classList.toggle('p-compact', pct < threshold);
            }
        });

        gutters.forEach((g, idx) => {
            if (sizes[idx] !== undefined) {
                g.setAttribute('aria-valuenow', sizes[idx].toFixed(1));
            }
        });

        if (stateKey && eventType === 'resizeend') {
            try { localStorage.setItem(stateKey, JSON.stringify(sizes)); } catch (_) {}
        }

        if (triggerEvents) {
            container.dispatchEvent(new CustomEvent(`splitter:${eventType}`, {
                bubbles: true,
                detail: { sizes: [...sizes] }
            }));

            // Sync metrics display in showcase
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

            // Sync stateful size labels
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

    // 7. Attach drag and keyboard interactions to gutters
    gutters.forEach((gutter, gutterIdx) => {
        let isDragging = false;
        let startPos = 0;
        let startSizes: number[] = [];

        const prevPanel = panels[gutterIdx];
        const nextPanel = panels[gutterIdx + 1];

        const prevMin = parseFloat(prevPanel.getAttribute('data-min-size') || prevPanel.getAttribute('min-size') || '0');
        const prevMax = parseFloat(prevPanel.getAttribute('data-max-size') || prevPanel.getAttribute('max-size') || '100');
        const prevCollapsible = prevPanel.hasAttribute('data-collapsible') || prevPanel.getAttribute('collapsible') === 'true' || prevPanel.hasAttribute('collapsible');
        const prevCollapsedSize = parseFloat(prevPanel.getAttribute('data-collapsed-size') || prevPanel.getAttribute('collapsed-size') || '0');

        const nextMin = parseFloat(nextPanel.getAttribute('data-min-size') || nextPanel.getAttribute('min-size') || '0');
        const nextMax = parseFloat(nextPanel.getAttribute('data-max-size') || nextPanel.getAttribute('max-size') || '100');
        const nextCollapsible = nextPanel.hasAttribute('data-collapsible') || nextPanel.getAttribute('collapsible') === 'true' || nextPanel.hasAttribute('collapsible');
        const nextCollapsedSize = parseFloat(nextPanel.getAttribute('data-collapsed-size') || nextPanel.getAttribute('collapsed-size') || '0');

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

            const totalSize = isHorizontal ? container.offsetWidth : container.offsetHeight;
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

        gutter.addEventListener('pointerdown', onPointerDown, { signal: ctx?.signal });
        gutter.addEventListener('pointermove', onPointerMove, { signal: ctx?.signal });
        gutter.addEventListener('pointerup', onPointerUp, { signal: ctx?.signal });
        gutter.addEventListener('pointercancel', onPointerUp, { signal: ctx?.signal });

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
        }, { signal: ctx?.signal });
    });
}
