import { resolvePart, applyPart, type PassthroughRecord } from '../runtime/parts';
import type { IslandContext } from '../runtime/registry';
﻿/**
 * LaughTale: Enterprise Slider Component (Aura Slider)
 * High-performance Pointer Capture dragging engine supporting single and range modes,
 * horizontal and vertical orientations, discrete step snapping, handle distance constraint,
 * handle disabling, live syncing, and full ARIA keyboard navigation.
 */

import { injectIslandStyle } from '../runtime/styles';
import { emitComponentEvent } from '../runtime/events';
import { html, setHtml, url as safeUrl, unsafe, attr, type Raw } from '../runtime/html';
import { useFormField } from '../composables/useFormField';
import type { PatternDeclaration } from '../accessibility/patterns';

export const a11y: PatternDeclaration = {
    kind: 'pattern',
    pattern: 'slider'
};

export interface SliderProps {
    value?: number | number[] | string;
    values?: number[];
    min?: number;
    max?: number;
    step?: number;
    range?: boolean;
    minStepsBetweenHandles?: number;
    orientation?: 'horizontal' | 'vertical';
    disabled?: boolean;
    disabledMinHandle?: boolean;
    disabledMaxHandle?: boolean;
    targetInputName?: string;
    name?: string;
    inputId?: string;
    ariaLabel?: string;
    ariaLabelledBy?: string;
    pt?: PassthroughRecord;
    studioOverrides?: Record<string, any>;
}

const CSS = `
/* ==================== AURA SLIDER ==================== */
.laughtale-slider,
.p-slider {
    position: relative;
    user-select: none;
    touch-action: none;
    box-sizing: border-box;
    font-family: var(--p-font-family, inherit);
}

.p-slider-horizontal {
    height: 0.375rem;
    width: 100%;
    background: var(--lt-surface-200);
    border-radius: 9999px;
    cursor: pointer;
    display: block;
}

.p-slider-vertical {
    width: 0.375rem;
    height: 12rem;
    background: var(--lt-surface-200);
    border-radius: 9999px;
    cursor: pointer;
    display: inline-block;
}

.p-slider.is-disabled {
    opacity: 0.6;
    cursor: not-allowed !important;
    pointer-events: none;
}

/* Range Fill Bar */
.p-slider-range {
    position: absolute;
    background: var(--lt-primary-500);
    border-radius: 9999px;
    pointer-events: none;
    transition: background 150ms ease;
    display: block;
}

.p-slider-horizontal .p-slider-range {
    top: 0;
    height: 100%;
}

.p-slider-vertical .p-slider-range {
    left: 0;
    width: 100%;
    bottom: 0;
}

/* Handle */
.p-slider-handle {
    position: absolute;
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 50%;
    background: var(--lt-surface-0);
    border: 2px solid var(--lt-primary-500);
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.15), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
    cursor: grab;
    outline: none;
    box-sizing: border-box;
    transition: border-color 150ms ease, box-shadow 150ms ease, transform 120ms ease;
    z-index: 10;
    display: block;
}

.p-slider-horizontal .p-slider-handle {
    top: 50%;
    transform: translate(-50%, -50%);
}

.p-slider-vertical .p-slider-handle {
    left: 50%;
    transform: translate(-50%, 50%);
}

.p-slider-handle:hover:not(.is-disabled) {
    border-color: var(--lt-primary-600);
    transform: translate(-50%, -50%) scale(1.1);
}

.p-slider-vertical .p-slider-handle:hover:not(.is-disabled) {
    transform: translate(-50%, 50%) scale(1.1);
}

.p-slider-handle:focus-visible:not(.is-disabled) {
    border-color: var(--lt-primary-600);
    box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.2);
}

.p-slider-handle.is-dragging {
    cursor: grabbing !important;
    transform: translate(-50%, -50%) scale(1.18) !important;
    box-shadow: 0 0 0 5px rgba(16, 185, 129, 0.25) !important;
}

.p-slider-vertical .p-slider-handle.is-dragging {
    transform: translate(-50%, 50%) scale(1.18) !important;
}

.p-slider-handle.is-disabled {
    cursor: not-allowed;
    background: var(--lt-surface-200);
    border-color: var(--lt-surface-400);
    box-shadow: none;
}

/* ==================== DARK MODE ==================== */
html.dark .p-slider-horizontal,
html.dark .p-slider-vertical,
[data-theme="dark"] .p-slider-horizontal,
[data-theme="dark"] .p-slider-vertical,
.dark .p-slider-horizontal,
.dark .p-slider-vertical {
    background: var(--p-surface-200);
}
html.dark .p-slider-range,
[data-theme="dark"] .p-slider-range,
.dark .p-slider-range {
    background: var(--p-primary-500);
}
html.dark .p-slider-handle,
[data-theme="dark"] .p-slider-handle,
.dark .p-slider-handle {
    background: var(--p-surface-0);
    border-color: var(--p-primary-500);
}
html.dark .p-slider-handle:hover:not(.is-disabled),
[data-theme="dark"] .p-slider-handle:hover:not(.is-disabled),
.dark .p-slider-handle:hover:not(.is-disabled) {
    border-color: var(--p-primary-400);
}
html.dark .p-slider-handle:focus-visible:not(.is-disabled),
[data-theme="dark"] .p-slider-handle:focus-visible:not(.is-disabled),
.dark .p-slider-handle:focus-visible:not(.is-disabled) {
    border-color: var(--p-primary-400);
    box-shadow: 0 0 0 4px rgba(52, 211, 153, 0.2);
}
html.dark .p-slider-handle.is-dragging,
[data-theme="dark"] .p-slider-handle.is-dragging,
.dark .p-slider-handle.is-dragging {
    box-shadow: 0 0 0 5px rgba(52, 211, 153, 0.25) !important;
}
html.dark .p-slider-handle.is-disabled,
[data-theme="dark"] .p-slider-handle.is-disabled,
.dark .p-slider-handle.is-disabled {
    background: var(--p-surface-100);
    border-color: var(--p-border-color);
}
`;

export default function SliderIsland(container: HTMLElement, props: SliderProps, ctx?: IslandContext) {
    injectIslandStyle('laughtale-slider', CSS);

    const min = props.min !== undefined ? Number(props.min) : 0;
    const max = props.max !== undefined ? Number(props.max) : 100;
    const step = props.step !== undefined ? Number(props.step) : 1;
    const isRange = props.range === true || String(props.range) === 'true';
    const isVertical = props.orientation === 'vertical';
    const isDisabled = props.disabled === true || String(props.disabled) === 'true';
    const disabledMin = props.disabledMinHandle === true || String(props.disabledMinHandle) === 'true';
    const disabledMax = props.disabledMaxHandle === true || String(props.disabledMaxHandle) === 'true';
    const minDistance = props.minStepsBetweenHandles !== undefined ? Number(props.minStepsBetweenHandles) : 0;

    const formField = useFormField(container, ctx, {
        cardinality: isRange ? 'Multiple' : 'Single',
        name: props.name || props.targetInputName
    });

    const formVal = formField.getValue();
    const effectiveVal = props.value ?? props.values ?? formVal;

    // Parse initial value(s)
    let currentValues: number[] = [];
    if (isRange) {
        if (Array.isArray(effectiveVal) && effectiveVal.length >= 2) {
            currentValues = [Number(effectiveVal[0]), Number(effectiveVal[1])];
        } else if (typeof effectiveVal === 'string' && effectiveVal.includes(',')) {
            const parts = effectiveVal.split(',').map(s => Number(s.trim()));
            currentValues = [parts[0] ?? min, parts[1] ?? max];
        } else if (Array.isArray(props.values) && props.values.length >= 2) {
            currentValues = [Number(props.values[0]), Number(props.values[1])];
        } else {
            currentValues = [min + (max - min) * 0.2, min + (max - min) * 0.8];
        }
    } else {
        const singleVal = effectiveVal !== undefined && effectiveVal !== null ? (Array.isArray(effectiveVal) ? Number(effectiveVal[0]) : Number(effectiveVal)) : min;
        currentValues = [singleVal];
    }

    function clampValue(val: number): number {
        return Math.max(min, Math.min(max, val));
    }

    function snapToStep(val: number): number {
        if (step <= 0) return val;
        const count = Math.round((val - min) / step);
        const snapped = min + count * step;
        return Number(clampValue(snapped).toFixed(4));
    }

    currentValues = currentValues.map(v => snapToStep(v));

    function getPercent(val: number): number {
        if (max === min) return 0;
        return Math.max(0, Math.min(100, ((val - min) / (max - min)) * 100));
    }

    function render() {
        const rootClasses = [
            'laughtale-slider',
            'p-slider',
            isVertical ? 'p-slider-vertical' : 'p-slider-horizontal',
            isDisabled ? 'is-disabled' : ''
        ].filter(Boolean).join(' ');

        container.className = rootClasses;
        if (props.inputId) container.setAttribute('id', props.inputId);

        formField.detach();
        if (isRange) {
            const p1 = getPercent(currentValues[0]);
            const p2 = getPercent(currentValues[1]);
            const leftPct = Math.min(p1, p2);
            const sizePct = Math.abs(p2 - p1);

            const rangeStyle = isVertical
                ? `bottom: ${leftPct}%; height: ${sizePct}%;`
                : `left: ${leftPct}%; width: ${sizePct}%;`;

            const h1Style = isVertical
                ? `bottom: ${p1}%;`
                : `left: ${p1}%;`;

            const h2Style = isVertical
                ? `bottom: ${p2}%;`
                : `left: ${p2}%;`;

            setHtml(container, html`
                <span class="p-slider-range" data-part="root" style="${rangeStyle}"></span>
                <span 
                    class="p-slider-handle ${disabledMin || isDisabled ? 'is-disabled' : ''}" 
                    data-handle="0" 
                    tabindex="${isDisabled || disabledMin ? '-1' : '0'}" 
                    role="slider" 
                    aria-orientation="${isVertical ? 'vertical' : 'horizontal'}" 
                    aria-valuemin="${min}" 
                    aria-valuemax="${max}" 
                    aria-valuenow="${currentValues[0]}"
                    style="${h1Style}"
                ></span>
                <span 
                    class="p-slider-handle ${disabledMax || isDisabled ? 'is-disabled' : ''}" 
                    data-handle="1" 
                    tabindex="${isDisabled || disabledMax ? '-1' : '0'}" 
                    role="slider" 
                    aria-orientation="${isVertical ? 'vertical' : 'horizontal'}" 
                    aria-valuemin="${min}" 
                    aria-valuemax="${max}" 
                    aria-valuenow="${currentValues[1]}"
                    style="${h2Style}"
                ></span>
            `);
        } else {
            const p = getPercent(currentValues[0]);
            const rangeStyle = isVertical
                ? `bottom: 0; height: ${p}%;`
                : `left: 0; width: ${p}%;`;

            const hStyle = isVertical
                ? `bottom: ${p}%;`
                : `left: ${p}%;`;

            setHtml(container, html`
                <span class="p-slider-range" style="${rangeStyle}"></span>
                <span 
                    class="p-slider-handle ${isDisabled ? 'is-disabled' : ''}" 
                    data-handle="0" 
                    tabindex="${isDisabled ? '-1' : '0'}" 
                    role="slider" 
                    aria-orientation="${isVertical ? 'vertical' : 'horizontal'}" 
                    aria-valuemin="${min}" 
                    aria-valuemax="${max}" 
                    aria-valuenow="${currentValues[0]}"
                    style="${hStyle}"
                ></span>
            `);
        }
        formField.reattach();
        formField.setValue(isRange ? currentValues.map(String) : String(currentValues[0]));

        bindEvents();
    }

    function updateVisuals() {
        const rangeEl = container.querySelector<HTMLElement>('.p-slider-range');
        const handles = container.querySelectorAll<HTMLElement>('.p-slider-handle');

        if (isRange) {
            const p1 = getPercent(currentValues[0]);
            const p2 = getPercent(currentValues[1]);
            const leftPct = Math.min(p1, p2);
            const sizePct = Math.abs(p2 - p1);

            if (rangeEl) {
                if (isVertical) {
                    rangeEl.style.bottom = `${leftPct}%`;
                    rangeEl.style.height = `${sizePct}%`;
                } else {
                    rangeEl.style.left = `${leftPct}%`;
                    rangeEl.style.width = `${sizePct}%`;
                }
            }

            if (handles[0]) {
                if (isVertical) handles[0].style.bottom = `${p1}%`;
                else handles[0].style.left = `${p1}%`;
                handles[0].setAttribute('aria-valuenow', currentValues[0].toString());
            }

            if (handles[1]) {
                if (isVertical) handles[1].style.bottom = `${p2}%`;
                else handles[1].style.left = `${p2}%`;
                handles[1].setAttribute('aria-valuenow', currentValues[1].toString());
            }
        } else {
            const p = getPercent(currentValues[0]);
            if (rangeEl) {
                if (isVertical) rangeEl.style.height = `${p}%`;
                else rangeEl.style.width = `${p}%`;
            }

            if (handles[0]) {
                if (isVertical) handles[0].style.bottom = `${p}%`;
                else handles[0].style.left = `${p}%`;
                handles[0].setAttribute('aria-valuenow', currentValues[0].toString());
            }
        }
    }

    function syncValue(isEnd: boolean = false) {
        const valPayload = isRange ? [...currentValues] : currentValues[0];
        formField.setValue(isRange ? currentValues.map(String) : String(currentValues[0]));

        emitComponentEvent(container, 'slider', 'change', { value: valPayload });

        if (isEnd) {
            emitComponentEvent(container, 'slider', 'slideend', { value: valPayload });
        }
    }

    function bindEvents() {
        if (isDisabled) return;

        let activeHandleIdx: number | null = null;
        let isDragging = false;

        const getRatioFromEvent = (e: PointerEvent | MouseEvent): number => {
            const rect = container.getBoundingClientRect();
            if (isVertical) {
                if (rect.height <= 0) return 0;
                const ratio = (rect.bottom - e.clientY) / rect.height;
                return Math.max(0, Math.min(1, ratio));
            } else {
                if (rect.width <= 0) return 0;
                const ratio = (e.clientX - rect.left) / rect.width;
                return Math.max(0, Math.min(1, ratio));
            }
        };

        const updateFromRatio = (ratio: number, handleIdx: number) => {
            let rawVal = min + ratio * (max - min);
            let snapped = snapToStep(rawVal);

            if (isRange) {
                if (handleIdx === 0) {
                    if (disabledMin) return;
                    const maxAllowed = currentValues[1] - minDistance;
                    snapped = Math.min(snapped, maxAllowed);
                    snapped = Math.max(min, snapped);
                    currentValues[0] = snapped;
                } else {
                    if (disabledMax) return;
                    const minAllowed = currentValues[0] + minDistance;
                    snapped = Math.max(snapped, minAllowed);
                    snapped = Math.min(max, snapped);
                    currentValues[1] = snapped;
                }
            } else {
                currentValues[0] = snapped;
            }

            updateVisuals();
            syncValue(false);
        };

        // Pointer drag on track or handles
        container.onpointerdown = (e: PointerEvent) => {
            if (isDisabled) return;
            const target = e.target as HTMLElement;
            const handleEl = target.closest('.p-slider-handle') as HTMLElement | null;

            if (handleEl) {
                const idx = Number(handleEl.getAttribute('data-handle') || 0);
                if (idx === 0 && disabledMin) return;
                if (idx === 1 && disabledMax) return;
                activeHandleIdx = idx;
            } else {
                // Click on track: pick closest handle
                const ratio = getRatioFromEvent(e);
                const clickVal = min + ratio * (max - min);
                if (isRange) {
                    const dist0 = Math.abs(currentValues[0] - clickVal);
                    const dist1 = Math.abs(currentValues[1] - clickVal);
                    if (dist0 <= dist1 && !disabledMin) {
                        activeHandleIdx = 0;
                    } else if (!disabledMax) {
                        activeHandleIdx = 1;
                    } else {
                        activeHandleIdx = 0;
                    }
                } else {
                    activeHandleIdx = 0;
                }
            }

            if (activeHandleIdx === null) return;

            isDragging = true;
            const activeEl = container.querySelector<HTMLElement>(`.p-slider-handle[data-handle="${activeHandleIdx}"]`);
            activeEl?.classList.add('is-dragging');
            activeEl?.focus();

            try {
                container.setPointerCapture(e.pointerId);
            } catch (_) {}

            updateFromRatio(getRatioFromEvent(e), activeHandleIdx);
        };

        container.onpointermove = (e: PointerEvent) => {
            if (!isDragging || activeHandleIdx === null) return;
            updateFromRatio(getRatioFromEvent(e), activeHandleIdx);
        };

        const onEnd = (e: PointerEvent) => {
            if (!isDragging) return;
            isDragging = false;
            if (activeHandleIdx !== null) {
                const activeEl = container.querySelector<HTMLElement>(`.p-slider-handle[data-handle="${activeHandleIdx}"]`);
                activeEl?.classList.remove('is-dragging');
            }
            try {
                container.releasePointerCapture(e.pointerId);
            } catch (_) {}
            syncValue(true);
            activeHandleIdx = null;
        };

        container.onpointerup = onEnd;
        container.onpointercancel = onEnd;

        // Keyboard navigation on handles
        const handles = container.querySelectorAll<HTMLElement>('.p-slider-handle');
        handles.forEach(h => {
            h.onkeydown = (e: KeyboardEvent) => {
                const idx = Number(h.getAttribute('data-handle') || 0);
                if (idx === 0 && disabledMin) return;
                if (idx === 1 && disabledMax) return;

                let cur = currentValues[idx];
                let changed = false;

                if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
                    cur = snapToStep(cur + step);
                    changed = true;
                } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
                    cur = snapToStep(cur - step);
                    changed = true;
                } else if (e.key === 'PageUp') {
                    cur = snapToStep(cur + step * 10);
                    changed = true;
                } else if (e.key === 'PageDown') {
                    cur = snapToStep(cur - step * 10);
                    changed = true;
                } else if (e.key === 'Home') {
                    cur = min;
                    changed = true;
                } else if (e.key === 'End') {
                    cur = max;
                    changed = true;
                }

                if (changed) {
                    e.preventDefault();
                    if (isRange) {
                        if (idx === 0) {
                            const maxAllowed = currentValues[1] - minDistance;
                            currentValues[0] = Math.min(cur, maxAllowed);
                        } else {
                            const minAllowed = currentValues[0] + minDistance;
                            currentValues[1] = Math.max(cur, minAllowed);
                        }
                    } else {
                        currentValues[0] = cur;
                    }
                    updateVisuals();
                    syncValue(false);
                }
            };

            h.onkeyup = (e: KeyboardEvent) => {
                if (['ArrowRight', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End'].includes(e.key)) {
                    syncValue(true);
                }
            };
        });
    }

    render();
}
