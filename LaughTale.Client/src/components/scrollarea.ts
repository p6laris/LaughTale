import { resolvePart, applyPart, type PassthroughRecord } from '../runtime/parts';
import type { IslandContext } from '../runtime/registry';
﻿/**
 * LaughTale: Enterprise ScrollArea Component (Aura Design System compliant)
 * Custom themed scrollbar container with smooth drag scrolling, dynamic size calculation,
 * horizontal/vertical/both axes, fade masks, and variant modes (auto, hover, scroll, always, hidden).
 */

import { injectIslandStyle } from '../runtime/styles';
import { html, setHtml, url as safeUrl, unsafe, attr, type Raw } from '../runtime/html';

const SCROLLAREA_CSS = `
.p-scrollarea {
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
    display: block;
    width: 100%;
    border-radius: var(--p-border-radius, 6px);
}

.p-scrollarea-viewport {
    width: 100%;
    height: 100%;
    overflow: scroll;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE/Edge */
    box-sizing: border-box;
    outline: none;
}
.p-scrollarea-viewport::-webkit-scrollbar {
    display: none; /* Chrome/Safari */
    width: 0;
    height: 0;
}

.p-scrollarea-content {
    box-sizing: border-box;
    min-width: 100%;
    min-height: 100%;
}
.p-scrollarea-horizontal .p-scrollarea-content,
.p-scrollarea-both .p-scrollarea-content {
    width: max-content;
}

/* Scrollbars */
.p-scrollarea-scrollbar {
    display: flex;
    user-select: none;
    touch-action: none;
    padding: 2px;
    background: transparent;
    transition: opacity 0.2s ease, background-color 0.15s ease;
    position: absolute;
    z-index: 10;
    box-sizing: border-box;
    opacity: 0;
}
.p-scrollarea-scrollbar-vertical {
    top: 0;
    right: 0;
    bottom: 0;
    width: 9px;
}
.p-scrollarea-scrollbar-horizontal {
    left: 0;
    bottom: 0;
    right: 0;
    height: 9px;
    flex-direction: column;
}
.p-scrollarea-corner {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 9px;
    height: 9px;
    background: transparent;
}

.p-scrollarea-handle {
    flex: 1;
    background: var(--p-surface-400, var(--lt-surface-400, #94a3b8));
    border-radius: 9999px;
    position: relative;
    transition: background-color 0.15s ease, transform 0.15s ease;
    cursor: pointer;
}
.p-scrollarea-handle:hover {
    background: var(--p-primary-color, var(--lt-primary-500, #10b981));
}
.p-scrollarea-handle:active {
    background: var(--p-primary-hover-color, var(--lt-primary-600, #059669));
}

/* Mask / Fade */
.p-scrollarea-mask .p-scrollarea-viewport {
    mask-image: linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%);
    -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%);
}

/* Variants */
.p-scrollarea[data-p-variant="auto"] .p-scrollarea-scrollbar {
    opacity: 0;
}
.p-scrollarea[data-p-variant="auto"]:hover .p-scrollarea-scrollbar,
.p-scrollarea[data-p-variant="auto"].p-scrollarea-scrolling .p-scrollarea-scrollbar {
    opacity: 1;
}

.p-scrollarea[data-p-variant="hover"] .p-scrollarea-scrollbar {
    opacity: 0;
}
.p-scrollarea[data-p-variant="hover"]:hover .p-scrollarea-scrollbar {
    opacity: 1;
}

.p-scrollarea[data-p-variant="scroll"] .p-scrollarea-scrollbar {
    opacity: 0;
}
.p-scrollarea[data-p-variant="scroll"].p-scrollarea-scrolling .p-scrollarea-scrollbar {
    opacity: 1;
}

.p-scrollarea[data-p-variant="always"] .p-scrollarea-scrollbar {
    opacity: 1 !important;
}

.p-scrollarea[data-p-variant="hidden"] .p-scrollarea-scrollbar {
    display: none !important;
    opacity: 0 !important;
}

/* Dark Mode Tokens */
html.dark .p-scrollarea-handle,
[data-theme="dark"] .p-scrollarea-handle,
.dark .p-scrollarea-handle {
    background: var(--p-surface-600, #475569) !important;
}
html.dark .p-scrollarea-handle:hover,
[data-theme="dark"] .p-scrollarea-handle:hover,
.dark .p-scrollarea-handle:hover {
    background: var(--p-primary-color, #10b981) !important;
}
html.dark .p-scrollarea-handle:active,
[data-theme="dark"] .p-scrollarea-handle:active,
.dark .p-scrollarea-handle:active {
    background: var(--p-primary-hover-color, #059669) !important;
}
`;

export interface ScrollAreaProps {
    orientation?: 'vertical' | 'horizontal' | 'both';
    variant?: 'auto' | 'hover' | 'scroll' | 'always' | 'hidden';
    mask?: boolean;
    pt?: PassthroughRecord;
    studioOverrides?: Record<string, any>;
}

export default function ScrollAreaIsland(container: HTMLElement, props: ScrollAreaProps, ctx?: IslandContext) {
    injectIslandStyle('scrollarea', SCROLLAREA_CSS);
    container.setAttribute('data-part', 'root');

    const orientation = props.orientation || (container.getAttribute('orientation') as any) || (container.getAttribute('data-orientation') as any) || 'vertical';
    const variant = props.variant || (container.getAttribute('variant') as any) || (container.getAttribute('data-variant') as any) || (container.getAttribute('data-p-variant') as any) || 'auto';
    const hasMask = props.mask !== undefined ? !!props.mask : (container.getAttribute('mask') === 'true' || container.hasAttribute('mask'));

    let viewport = container.querySelector<HTMLElement>(':scope > .p-scrollarea-viewport') || container.querySelector<HTMLElement>('.p-scrollarea-viewport');

    if (!viewport) {
        // Collect existing child content
        const slotEl = container.querySelector<HTMLElement>(':scope > .island-slot');
        const fragment = document.createDocumentFragment();
        const sourceNodes = slotEl ? Array.from(slotEl.childNodes) : Array.from(container.childNodes);

        sourceNodes.forEach(node => fragment.appendChild(node));
        if (slotEl) slotEl.remove();

        setHtml(container, html``);

        viewport = document.createElement('div');
        viewport.className = 'p-scrollarea-viewport';
        viewport.setAttribute('tabindex', '0');

        const content = document.createElement('div');
        content.className = 'p-scrollarea-content';
        content.appendChild(fragment);
        viewport.appendChild(content);
        container.appendChild(viewport);

        if (orientation === 'vertical' || orientation === 'both') {
            const vBar = document.createElement('div');
            vBar.className = 'p-scrollarea-scrollbar p-scrollarea-scrollbar-vertical';
            vBar.setAttribute('role', 'scrollbar');
            vBar.setAttribute('aria-orientation', 'vertical');

            const vHandle = document.createElement('div');
            vHandle.className = 'p-scrollarea-handle';
            vBar.appendChild(vHandle);
            container.appendChild(vBar);
        }

        if (orientation === 'horizontal' || orientation === 'both') {
            const hBar = document.createElement('div');
            hBar.className = 'p-scrollarea-scrollbar p-scrollarea-scrollbar-horizontal';
            hBar.setAttribute('role', 'scrollbar');
            hBar.setAttribute('aria-orientation', 'horizontal');

            const hHandle = document.createElement('div');
            hHandle.className = 'p-scrollarea-handle';
            hBar.appendChild(hHandle);
            container.appendChild(hBar);
        }

        if (orientation === 'both') {
            const corner = document.createElement('div');
            corner.className = 'p-scrollarea-corner';
            container.appendChild(corner);
        }
    } else if (!viewport.querySelector('.p-scrollarea-content')) {
        const slotEl = viewport.querySelector<HTMLElement>(':scope > .island-slot');
        if (slotEl) {
            const fragment = document.createDocumentFragment();
            while (slotEl.firstChild) {
                fragment.appendChild(slotEl.firstChild);
            }
            slotEl.remove();
            const content = document.createElement('div');
            content.className = 'p-scrollarea-content';
            content.appendChild(fragment);
            viewport.appendChild(content);
        }
    }

    container.classList.add('p-scrollarea', 'p-component');
    container.setAttribute('data-p-variant', variant);
    if (orientation === 'horizontal') {
        container.classList.add('p-scrollarea-horizontal');
    } else if (orientation === 'both') {
        container.classList.add('p-scrollarea-both');
    } else {
        container.classList.add('p-scrollarea-vertical');
    }

    if (hasMask) {
        container.classList.add('p-scrollarea-mask');
    }

    const rootEl = container;
    const vBar = rootEl.querySelector<HTMLElement>('.p-scrollarea-scrollbar-vertical');
    const vHandle = vBar?.querySelector<HTMLElement>('.p-scrollarea-handle');

    const hBar = rootEl.querySelector<HTMLElement>('.p-scrollarea-scrollbar-horizontal');
    const hHandle = hBar?.querySelector<HTMLElement>('.p-scrollarea-handle');

    let scrollTimeout: any = null;

    function updateScrollbars() {
        if (!viewport) return;

        const { scrollTop, scrollLeft, scrollHeight, scrollWidth, clientHeight, clientWidth } = viewport;

        // Vertical
        if (vBar && vHandle) {
            const hasVerticalScroll = scrollHeight > clientHeight;
            vBar.style.display = hasVerticalScroll ? 'flex' : 'none';
            if (hasVerticalScroll) {
                const handleHeight = Math.max((clientHeight / scrollHeight) * clientHeight, 20);
                const maxScrollTop = scrollHeight - clientHeight;
                const handleTop = maxScrollTop > 0 ? (scrollTop / maxScrollTop) * (clientHeight - handleHeight) : 0;
                vHandle.style.height = `${handleHeight}px`;
                vHandle.style.transform = `translateY(${handleTop}px)`;
            }
        }

        // Horizontal
        if (hBar && hHandle) {
            const hasHorizontalScroll = scrollWidth > clientWidth;
            hBar.style.display = hasHorizontalScroll ? 'flex' : 'none';
            if (hasHorizontalScroll) {
                const handleWidth = Math.max((clientWidth / scrollWidth) * clientWidth, 20);
                const maxScrollLeft = scrollWidth - clientWidth;
                const handleLeft = maxScrollLeft > 0 ? (scrollLeft / maxScrollLeft) * (clientWidth - handleWidth) : 0;
                hHandle.style.width = `${handleWidth}px`;
                hHandle.style.transform = `translateX(${handleLeft}px)`;
            }
        }
    }

    viewport.addEventListener('scroll', () => {
        updateScrollbars();

        rootEl.classList.add('p-scrollarea-scrolling');
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            rootEl.classList.remove('p-scrollarea-scrolling');
        }, 1000);
    }, { signal: ctx?.signal });

    // Handle dragging vertical scrollbar
    if (vBar && vHandle) {
        let isDragging = false;
        let startY = 0;
        let startScrollTop = 0;

        vHandle.addEventListener('pointerdown', (e) => {
            isDragging = true;
            startY = e.clientY;
            startScrollTop = viewport!.scrollTop;
            vHandle.setPointerCapture(e.pointerId);
            document.body.style.userSelect = 'none';
        }, { signal: ctx?.signal });

        vHandle.addEventListener('pointermove', (e) => {
            if (!isDragging) return;
            const deltaY = e.clientY - startY;
            const scrollRatio = (viewport!.scrollHeight - viewport!.clientHeight) / (viewport!.clientHeight - vHandle.offsetHeight);
            viewport!.scrollTop = startScrollTop + deltaY * scrollRatio;
        }, { signal: ctx?.signal });

        const stopDrag = (e: PointerEvent) => {
            if (isDragging) {
                isDragging = false;
                try { vHandle.releasePointerCapture(e.pointerId); } catch (_) {}
                document.body.style.userSelect = '';
            }
        };

        vHandle.addEventListener('pointerup', stopDrag, { signal: ctx?.signal });
        vHandle.addEventListener('pointercancel', stopDrag, { signal: ctx?.signal });
    }

    // Handle dragging horizontal scrollbar
    if (hBar && hHandle) {
        let isDragging = false;
        let startX = 0;
        let startScrollLeft = 0;

        hHandle.addEventListener('pointerdown', (e) => {
            isDragging = true;
            startX = e.clientX;
            startScrollLeft = viewport!.scrollLeft;
            hHandle.setPointerCapture(e.pointerId);
            document.body.style.userSelect = 'none';
        }, { signal: ctx?.signal });

        hHandle.addEventListener('pointermove', (e) => {
            if (!isDragging) return;
            const deltaX = e.clientX - startX;
            const scrollRatio = (viewport!.scrollWidth - viewport!.clientWidth) / (viewport!.clientWidth - hHandle.offsetWidth);
            viewport!.scrollLeft = startScrollLeft + deltaX * scrollRatio;
        }, { signal: ctx?.signal });

        const stopDrag = (e: PointerEvent) => {
            if (isDragging) {
                isDragging = false;
                try { hHandle.releasePointerCapture(e.pointerId); } catch (_) {}
                document.body.style.userSelect = '';
            }
        };

        hHandle.addEventListener('pointerup', stopDrag, { signal: ctx?.signal });
        hHandle.addEventListener('pointercancel', stopDrag, { signal: ctx?.signal });
    }

    // Handle interactive variant selector buttons in demo
    let cardScope = container.closest('.component-card') || container.parentElement?.parentElement?.parentElement || document;
    
    function applyVariant(variantName: string) {
        rootEl.setAttribute('data-p-variant', variantName);
        if (cardScope) {
            cardScope.querySelectorAll<HTMLButtonElement>('[data-scrollarea-variant]').forEach(b => {
                const bVar = b.getAttribute('data-scrollarea-variant');
                b.classList.toggle('p-highlight', bVar === variantName);
            });
        }
        updateScrollbars();
    }

    if (cardScope) {
        cardScope.querySelectorAll<HTMLButtonElement>('[data-scrollarea-variant]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const selectedVariant = btn.getAttribute('data-scrollarea-variant') || 'auto';
                applyVariant(selectedVariant);
            }, { signal: ctx?.signal });
        });
    }

    // Observe size changes
    const resizeObserver = new ResizeObserver(() => {
        updateScrollbars();
    });
    resizeObserver.observe(viewport);
    if (viewport.firstElementChild) {
        resizeObserver.observe(viewport.firstElementChild);
    }

    // Initial calculation
    setTimeout(updateScrollbars, 50);
}
