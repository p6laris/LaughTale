import { resolvePart, applyPart, type PassthroughRecord } from '../runtime/parts';
import type { IslandContext } from '../runtime/registry';
import { LucideIcons, getLucideIcon } from '../icons/lucide';
import { getCompareChartSvg } from '../icons/decorative-svgs';
import { injectIslandStyle } from '../runtime/styles';
import { emitComponentEvent } from '../runtime/events';
import { html, setHtml, url as safeUrl, unsafe, attr, type Raw } from '../runtime/html';
import type { PatternDeclaration } from '../accessibility/patterns';

export const a11y: PatternDeclaration = {
    kind: 'native',
    element: 'input'
};

export interface CompareProps {
    modelValue?: number;
    value?: number;
    min?: number;
    max?: number;
    step?: number;
    orientation?: 'horizontal' | 'vertical';
    slideOnHover?: boolean;
    disabled?: boolean;
    readonly?: boolean;
    invalid?: boolean;
    beforeImage?: string;
    afterImage?: string;
    beforeLabel?: string;
    afterLabel?: string;
    customHandle?: boolean;
    demoType?: 'basic' | 'custom-handle' | 'hover' | 'vertical' | 'with-chart' | 'controlled' | 'template';
    class?: string;
    style?: string;
    ariaLabel?: string;
    pt?: PassthroughRecord;
    studioOverrides?: Record<string, any>;
}

const DEFAULT_BEFORE_IMG = 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&auto=format&fit=crop&q=80';
const DEFAULT_AFTER_IMG = 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80';

const COMPARE_CSS = `
/* ==========================================================================
   LaughTale Aura Compare Component Tokens & Styles
   ========================================================================== */
island-compare,
island-image-compare,
p-compare {
    display: block !important;
    width: 100%;
}

.p-compare {
    position: relative;
    overflow: hidden;
    user-select: none;
    -webkit-user-select: none;
    touch-action: none;
    border-radius: var(--p-border-radius, 8px);
    border: 1px solid var(--p-border-color, #cbd5e1);
    box-sizing: border-box;
    font-family: var(--p-font-family, inherit);
    cursor: ew-resize;
    display: block;
    width: 100%;
    background: var(--p-surface-950, #020617);
}

.p-compare-vertical {
    cursor: ns-resize;
}

.p-compare-disabled {
    opacity: 0.6;
    cursor: not-allowed !important;
    pointer-events: none;
}

/* Hidden Accessible Range Input */
.p-compare-input {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
}

/* Compare Layers */
.p-compare-item {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    box-sizing: border-box;
}

.p-compare-item-after {
    z-index: 1;
}

.p-compare-item-before {
    z-index: 2;
    will-change: clip-path, width, height;
}

.p-compare-item img,
.p-compare-item svg {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    pointer-events: none;
}

/* Compare Handle & Indicator */
.p-compare-handle {
    position: absolute;
    z-index: 3;
    pointer-events: none;
    box-sizing: border-box;
    background: #ffffff;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.45);
    will-change: left, top;
}

/* Horizontal Handle */
.p-compare:not(.p-compare-vertical) .p-compare-handle {
    top: 0;
    bottom: 0;
    width: 2px;
    transform: translateX(-50%);
}

/* Vertical Handle */
.p-compare-vertical .p-compare-handle {
    left: 0;
    right: 0;
    height: 2px;
    transform: translateY(-50%);
}

.p-compare-indicator {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 50%;
    background: var(--p-surface-0, #ffffff);
    color: var(--p-text-color, #1e293b);
    border: 1px solid var(--p-border-color, #cbd5e1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: auto;
    cursor: ew-resize;
    transition: transform 150ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 150ms ease;
}

.p-compare-vertical .p-compare-indicator {
    cursor: ns-resize;
}

.p-compare-indicator:hover {
    transform: translate(-50%, -50%) scale(1.1);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.35);
}

.p-compare:focus-within .p-compare-indicator {
    outline: none;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.4), 0 4px 12px rgba(0, 0, 0, 0.25);
}

/* Custom Translucent Bubble Handle */
.p-compare-custom-handle .p-compare-handle {
    background: transparent !important;
    box-shadow: none !important;
}
.p-compare-custom-handle .p-compare-indicator {
    width: 1.5rem !important;
    height: 1.5rem !important;
    background: rgba(255, 255, 255, 0.75) !important;
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3) !important;
    border: 1px solid rgba(255, 255, 255, 0.5) !important;
}
.p-compare-custom-handle .p-compare-indicator:hover {
    transform: translate(-50%, -50%) scale(1.35) !important;
}

/* Dark Mode Tokens */
html.dark .p-compare,
[data-theme="dark"] .p-compare,
.dark .p-compare {
    border-color: var(--p-surface-700, #334155);
}

html.dark .p-compare-indicator,
[data-theme="dark"] .p-compare-indicator,
.dark .p-compare-indicator {
    background: var(--p-surface-900, #0f172a);
    color: var(--p-surface-100, #f8fafc);
    border: 1px solid var(--p-surface-700, #334155);
}
`;

const ARROWS_H_SVG = unsafe(getLucideIcon('move-horizontal', 16, 2.2));
const CODE_SVG = unsafe(getLucideIcon('code', 16, 2.2));

export default function CompareIsland(container: HTMLElement, props: CompareProps, ctx?: IslandContext) {
    injectIslandStyle('compare', COMPARE_CSS);

    const demoType = props.demoType || 'basic';
    const orientation = props.orientation || (demoType === 'vertical' ? 'vertical' : 'horizontal');
    const isVertical = orientation === 'vertical';
    const slideOnHover = props.slideOnHover === true || demoType === 'hover' || demoType === 'with-chart';
    const isCustomHandle = props.customHandle === true || demoType === 'custom-handle';
    const isControlled = demoType === 'controlled';
    const isWithChart = demoType === 'with-chart';
    const isTemplate = demoType === 'template';
    const disabled = props.disabled === true;
    const readonly = props.readonly === true;

    let currentValue = props.modelValue !== undefined ? props.modelValue : (props.value !== undefined ? props.value : 50);
    currentValue = Math.max(0, Math.min(100, currentValue));

    const beforeImg = props.beforeImage || DEFAULT_BEFORE_IMG;
    const afterImg = props.afterImage || DEFAULT_AFTER_IMG;

    function renderDOM() {
        const customHandleClass = isCustomHandle ? 'p-compare-custom-handle' : '';
        const verticalClass = isVertical ? 'p-compare-vertical' : '';
        const disabledClass = disabled ? 'p-compare-disabled' : '';

        let beforeContentHtml: Raw | string = '';
        let afterContentHtml: Raw | string = '';

        if (isWithChart) {
            beforeContentHtml = unsafe(getCompareChartSvg());
            afterContentHtml = html`
                <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: var(--lt-surface-50); color: var(--p-text-muted); font-size: 0.875rem;">
                    <span>Hover to reveal chart trajectory</span>
                </div>
            `;
        } else if (isTemplate) {
            beforeContentHtml = html`
                <div style="width: 100%; height: 100%; background: var(--lt-primary-50); padding: 1.5rem; display: flex; align-items: center; justify-content: center; box-sizing: border-box;">
                    <div style="width: 100%; max-width: 18rem; border-radius: 12px; border: 1px solid var(--lt-primary-100); background: var(--lt-surface-0, var(--lt-surface-0)); padding: 1.25rem; display: flex; flex-direction: column; gap: 1rem; box-shadow: 0 4px 12px rgba(147, 51, 234, 0.1);">
                        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
                            <div style="display: flex; align-items: center; gap: 0.75rem;">
                                <div style="width: 2.5rem; height: 2.5rem; border-radius: 9999px; overflow: hidden; background: var(--lt-primary-400);">
                                    <img src="${safeUrl('/images/avatar/amyelsner.png')}" style="width: 100%; height: 100%; object-fit: cover; filter: hue-rotate(260deg) saturate(150%);" />
                                </div>
                                <div>
                                    <div style="font-weight: 600; color: var(--lt-primary-900); font-size: 0.9rem;">Amy Elsner</div>
                                    <div style="font-size: 0.75rem; color: var(--lt-primary-600);">Developer</div>
                                </div>
                            </div>
                            <span style="background: var(--lt-primary-50); color: var(--lt-primary-700); padding: 0.2rem 0.5rem; border-radius: 6px; font-size: 0.75rem; font-weight: 700;">Pro</span>
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 0.35rem;">
                            <div style="display: flex; justify-content: space-between; font-size: 0.75rem;">
                                <span style="color: var(--lt-primary-600);">Storage</span>
                                <span style="color: var(--lt-primary-900); font-weight: 600;">7.2 GB / 10 GB</span>
                            </div>
                            <div style="height: 0.5rem; width: 100%; background: var(--lt-primary-50); border-radius: 9999px; overflow: hidden;">
                                <div style="height: 100%; width: 72%; background: var(--lt-primary-500); border-radius: 9999px;"></div>
                            </div>
                        </div>
                        <div style="display: flex; gap: 0.5rem; padding-top: 0.25rem;">
                            <button type="button" class="p-button p-button-sm" style="flex: 1; padding: 0.35rem; font-size: 0.75rem; border-radius: 6px; background: var(--lt-primary-600); border: 1px solid var(--lt-primary-600); color: var(--lt-surface-0, var(--lt-surface-0)); cursor: pointer;">Upgrade</button>
                            <button type="button" class="p-button p-button-sm p-button-outlined" style="padding: 0.35rem 0.6rem; font-size: 0.75rem; border-radius: 6px; border: 1px solid var(--lt-primary-100); background: transparent; color: var(--lt-primary-700); cursor: pointer;">Settings</button>
                        </div>
                    </div>
                </div>
            `;
            afterContentHtml = html`
                <div style="width: 100%; height: 100%; background: var(--lt-primary-50, var(--lt-primary-50)); padding: 1.5rem; display: flex; align-items: center; justify-content: center; box-sizing: border-box;">
                    <div style="width: 100%; max-width: 18rem; border-radius: 12px; border: 1px solid var(--lt-primary-200, var(--lt-primary-200)); background: var(--lt-surface-0, var(--lt-surface-0)); padding: 1.25rem; display: flex; flex-direction: column; gap: 1rem; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.1);">
                        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
                            <div style="display: flex; align-items: center; gap: 0.75rem;">
                                <div style="width: 2.5rem; height: 2.5rem; border-radius: 9999px; overflow: hidden; background: var(--lt-primary-400, var(--lt-primary-400));">
                                    <img src="${safeUrl('/images/avatar/amyelsner.png')}" style="width: 100%; height: 100%; object-fit: cover;" />
                                </div>
                                <div>
                                    <div style="font-weight: 600; color: var(--lt-primary-900); font-size: 0.9rem;">Amy Elsner</div>
                                    <div style="font-size: 0.75rem; color: var(--lt-primary-600, var(--lt-primary-600));">Developer</div>
                                </div>
                            </div>
                            <span style="background: var(--lt-primary-50, var(--lt-primary-50)); color: var(--lt-primary-700, var(--lt-primary-700)); padding: 0.2rem 0.5rem; border-radius: 6px; font-size: 0.75rem; font-weight: 700;">Pro</span>
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 0.35rem;">
                            <div style="display: flex; justify-content: space-between; font-size: 0.75rem;">
                                <span style="color: var(--lt-primary-600, var(--lt-primary-600));">Storage</span>
                                <span style="color: var(--lt-primary-900); font-weight: 600;">7.2 GB / 10 GB</span>
                            </div>
                            <div style="height: 0.5rem; width: 100%; background: var(--lt-primary-50, var(--lt-primary-50)); border-radius: 9999px; overflow: hidden;">
                                <div style="height: 100%; width: 72%; background: var(--lt-primary-500, var(--lt-primary-500)); border-radius: 9999px;"></div>
                            </div>
                        </div>
                        <div style="display: flex; gap: 0.5rem; padding-top: 0.25rem;">
                            <button type="button" class="p-button p-button-sm" style="flex: 1; padding: 0.35rem; font-size: 0.75rem; border-radius: 6px; background: var(--lt-primary-500, var(--lt-primary-500)); border: 1px solid var(--lt-primary-500, var(--lt-primary-500)); color: var(--lt-surface-0, var(--lt-surface-0)); cursor: pointer;">Upgrade</button>
                            <button type="button" class="p-button p-button-sm p-button-outlined" style="padding: 0.35rem 0.6rem; font-size: 0.75rem; border-radius: 6px; border: 1px solid var(--lt-primary-200, var(--lt-primary-200)); background: transparent; color: var(--lt-primary-700, var(--lt-primary-700)); cursor: pointer;">Settings</button>
                        </div>
                    </div>
                </div>
            `;
        } else {
            beforeContentHtml = html`<img src="${safeUrl(beforeImg)}" alt="Before" draggable="false" />`;
            afterContentHtml = html`<img src="${safeUrl(afterImg)}" alt="After" draggable="false" />`;
        }

        const iconHtml = (demoType === 'hover' || demoType === 'vertical' || isTemplate) ? CODE_SVG : ARROWS_H_SVG;
        const iconRotateStyle = isVertical ? 'transform: rotate(90deg);' : '';

        const heightStyle = isWithChart ? 'height: 189px;' : (isTemplate ? 'height: 320px;' : 'aspect-ratio: 16/9;');

        let controlsHtml: Raw | '' = '';
        if (isControlled) {
            controlsHtml = html`
                <div class="p-compare-controls" style="max-width: 32rem; margin: 1rem auto 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 1rem; width: 100%;">
                    <button type="button" class="p-button p-button-outlined p-button-secondary" data-compare-set="25" style="padding: 0.45rem 1rem; font-size: 0.875rem; font-weight: 600; border-radius: var(--lt-radius); border: 1px solid var(--lt-surface-200); background: var(--lt-surface-0); color: var(--lt-text-primary); cursor: pointer;">
                        25%
                    </button>
                    <div style="display: flex; align-items: center; gap: 0.25rem;">
                        <input type="number" min="0" max="100" value="${currentValue}" class="p-inputtext p-component" data-compare-num style="width: 5rem; text-align: center; padding: 0.45rem 0.5rem; border-radius: var(--lt-radius); border: 1px solid var(--lt-surface-200); background: var(--lt-surface-0); color: var(--lt-text-primary); font-weight: 600; font-size: 0.875rem;" />
                        <span style="font-weight: 600; font-size: 0.875rem; color: var(--p-text-muted);">%</span>
                    </div>
                    <button type="button" class="p-button p-button-outlined p-button-secondary" data-compare-set="75" style="padding: 0.45rem 1rem; font-size: 0.875rem; font-weight: 600; border-radius: var(--lt-radius); border: 1px solid var(--lt-surface-200); background: var(--lt-surface-0); color: var(--lt-text-primary); cursor: pointer;">
                        75%
                    </button>
                </div>
            `;
        }

        setHtml(container, html`
            <div class="p-compare ${verticalClass} ${customHandleClass} ${disabledClass} ${props.class || ''}" style="max-width: 32rem; margin: 0 auto; ${heightStyle} ${props.style || ''}" data-compare-root>
                <!-- Hidden Accessible Range Input -->
                <input type="range" class="p-compare-input" min="${props.min || 0}" max="${props.max || 100}" step="${props.step || 1}" value="${currentValue}" aria-label="${props.ariaLabel || 'Compare images'}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${currentValue}" tabindex="0" ${attr('disabled', disabled)} data-compare-input />

                <!-- Layer After (Base Bottom) -->
                <div class="p-compare-item p-compare-item-after" data-compare-after>
                    ${afterContentHtml}
                </div>

                <!-- Layer Before (Clipped Top) -->
                <div class="p-compare-item p-compare-item-before" data-compare-before>
                    ${beforeContentHtml}
                </div>

                <!-- Divider Handle -->
                <div class="p-compare-handle" data-compare-handle>
                    <div class="p-compare-indicator" data-compare-indicator>
                        ${isCustomHandle ? '' : html`<span style="${iconRotateStyle} display: flex; align-items: center; justify-content: center;">${iconHtml}</span>`}
                    </div>
                </div>
            </div>
            ${controlsHtml}
        `);
    }

    renderDOM();

    const rootEl = container.querySelector<HTMLElement>('[data-compare-root]')!;
    const inputEl = container.querySelector<HTMLInputElement>('[data-compare-input]')!;
    const beforeEl = container.querySelector<HTMLElement>('[data-compare-before]')!;
    const handleEl = container.querySelector<HTMLElement>('[data-compare-handle]')!;
    const numInput = container.querySelector<HTMLInputElement>('[data-compare-num]');

    function updatePosition(pct: number) {
        currentValue = Math.max(0, Math.min(100, pct));

        if (isVertical) {
            beforeEl.style.clipPath = `inset(0 0 ${100 - currentValue}% 0)`;
            handleEl.style.top = `${currentValue}%`;
        } else {
            beforeEl.style.clipPath = `inset(0 ${100 - currentValue}% 0 0)`;
            handleEl.style.left = `${currentValue}%`;
        }

        if (inputEl) {
            inputEl.value = `${currentValue}`;
            inputEl.setAttribute('aria-valuenow', `${currentValue}`);
        }
        if (numInput) {
            numInput.value = `${Math.round(currentValue)}`;
        }

        emitComponentEvent(container, 'image-compare', 'change', {
            value: currentValue
        });
    }

    updatePosition(currentValue);

    if (disabled || readonly) return;

    let isDragging = false;

    function updateFromPointer(clientX: number, clientY: number) {
        const rect = rootEl.getBoundingClientRect();
        if (isVertical) {
            if (rect.height <= 0) return;
            const p = ((clientY - rect.top) / rect.height) * 100;
            updatePosition(p);
        } else {
            if (rect.width <= 0) return;
            const p = ((clientX - rect.left) / rect.width) * 100;
            updatePosition(p);
        }
    }

    const onPointerDown = (e: PointerEvent) => {
        isDragging = true;
        try {
            rootEl.setPointerCapture(e.pointerId);
        } catch (_) {}
        updateFromPointer(e.clientX, e.clientY);
    };

    const onPointerMove = (e: PointerEvent) => {
        if (slideOnHover) {
            updateFromPointer(e.clientX, e.clientY);
        } else if (isDragging) {
            updateFromPointer(e.clientX, e.clientY);
        }
    };

    const onPointerUp = (e: PointerEvent) => {
        if (!isDragging) return;
        isDragging = false;
        try {
            rootEl.releasePointerCapture(e.pointerId);
        } catch (_) {}
    };

    rootEl.addEventListener('pointerdown', onPointerDown, { signal: ctx?.signal });
    rootEl.addEventListener('pointermove', onPointerMove, { signal: ctx?.signal });
    rootEl.addEventListener('pointerup', onPointerUp, { signal: ctx?.signal });
    rootEl.addEventListener('pointercancel', onPointerUp, { signal: ctx?.signal });

    // Keyboard support via hidden input
    inputEl.addEventListener('input', () => {
        updatePosition(parseFloat(inputEl.value));
    }, { signal: ctx?.signal });

    inputEl.addEventListener('keydown', (e) => {
        let step = props.step || 1;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            updatePosition(currentValue + step);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            updatePosition(currentValue - step);
        } else if (e.key === 'PageUp') {
            e.preventDefault();
            updatePosition(currentValue + 10);
        } else if (e.key === 'PageDown') {
            e.preventDefault();
            updatePosition(currentValue - 10);
        } else if (e.key === 'Home') {
            e.preventDefault();
            updatePosition(0);
        } else if (e.key === 'End') {
            e.preventDefault();
            updatePosition(100);
        }
    }, { signal: ctx?.signal });

    // Controlled demo button handlers
    container.querySelectorAll<HTMLButtonElement>('[data-compare-set]').forEach(btn => {
        btn.addEventListener('click', () => {
            const val = parseFloat(btn.getAttribute('data-compare-set') || '50');
            updatePosition(val);
        }, { signal: ctx?.signal });
    });

    if (numInput) {
        numInput.addEventListener('change', () => {
            const val = parseFloat(numInput.value || '50');
            updatePosition(val);
        }, { signal: ctx?.signal });
    }
}
