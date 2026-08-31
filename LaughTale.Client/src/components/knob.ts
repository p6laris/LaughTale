import { resolvePart, applyPart, type PassthroughRecord } from '../runtime/parts';
import type { IslandContext } from '../runtime/registry';
﻿import { injectIslandStyle } from '../runtime/styles';
/**
 * LaughTale: Enterprise Radial Knob / Dial Component (Aura Knob inspired)
 * High-performance pointer capture dragging engine without full DOM rebuilds.
 */

export interface KnobProps {
    value?: number;
    min?: number;
    max?: number;
    step?: number;
    size?: number; // px, default 96
    color?: string; // default var(--lt-primary-600)
    valueTemplate?: string; // e.g. '{value}%'
    targetInputName?: string;
    disabled?: boolean;
    pt?: PassthroughRecord;
    studioOverrides?: Record<string, any>;
}


const CSS = `
html.dark .knob-value-display,
[data-theme="dark"] .knob-value-display,
.dark .knob-value-display {
    color: var(--p-text-color) !important;
}
html.dark .laughtale-knob circle:first-child,
[data-theme="dark"] .laughtale-knob circle:first-child,
.dark .laughtale-knob circle:first-child {
    stroke: var(--p-border-color) !important;
}
`;

export default function KnobIsland(container: HTMLElement, props: KnobProps, ctx?: IslandContext) {
    injectIslandStyle('knob', CSS);
    const min = props.min !== undefined ? props.min : 0;
    const max = props.max !== undefined ? props.max : 100;
    const step = props.step || 1;
    const size = props.size || 96;
    const strokeWidth = 8;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const template = props.valueTemplate || '{value}%';

    let currentValue = props.value !== undefined ? props.value : min;

    function getOffset(val: number): number {
        const pct = Math.max(0, Math.min(1, (val - min) / (max - min)));
        return circumference * (1 - pct);
    }

    const initialOffset = getOffset(currentValue);
    const initialText = template.replace('{value}', currentValue.toString());

    container.innerHTML = `
        <div class="laughtale-knob" data-part="root" style="position: relative; display: inline-flex; align-items: center; justify-content: center; width: ${size}px; height: ${size}px; user-select: none; cursor: ${props.disabled ? 'not-allowed' : 'pointer'}; touch-action: none;">
            <svg width="${size}" height="${size}" style="transform: rotate(-90deg); pointer-events: none;">
                <!-- Background Circle -->
                <circle cx="${size / 2}" cy="${size / 2}" r="${radius}" fill="transparent" stroke="var(--lt-surface-200)" stroke-width="${strokeWidth}" />
                <!-- Progress Arc -->
                <circle class="knob-progress-circle" cx="${size / 2}" cy="${size / 2}" r="${radius}" fill="transparent" stroke="${props.color || 'var(--lt-primary-600)'}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-dasharray="${circumference}" stroke-dashoffset="${initialOffset}" style="transition: stroke-dashoffset 0.05s ease;" />
            </svg>
            <span class="knob-value-display" style="position: absolute; font-size: ${size * 0.2}px; font-weight: 700; color: var(--lt-surface-900); pointer-events: none;">
                ${initialText}
            </span>
        </div>
    `;

    const knobEl = container.querySelector<HTMLElement>('.laughtale-knob')!;
    const progressCircle = container.querySelector<SVGCircleElement>('.knob-progress-circle')!;
    const valueDisplay = container.querySelector<HTMLElement>('.knob-value-display')!;

    function updateVisuals() {
        progressCircle.style.strokeDashoffset = `${getOffset(currentValue)}`;
        valueDisplay.textContent = template.replace('{value}', currentValue.toString());
    }

    function syncValue() {
        if (props.targetInputName) {
            let hidden = container.querySelector<HTMLInputElement>(`input[name="${props.targetInputName}"]`);
            if (!hidden) {
                hidden = document.createElement('input');
                hidden.type = 'hidden';
                hidden.name = props.targetInputName;
                container.appendChild(hidden);
            }
            hidden.value = currentValue.toString();
        }

        container.dispatchEvent(new CustomEvent('knob:change', {
            bubbles: true,
            detail: { value: currentValue }
        }));
    }

    if (!props.disabled) {
        let isDragging = false;

        const updateFromPointer = (clientX: number, clientY: number) => {
            const rect = knobEl.getBoundingClientRect();
            if (rect.width <= 0) return;
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const angle = Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI) + 90;
            const normalizedAngle = angle < 0 ? angle + 360 : angle;
            const ratio = Math.min(1, Math.max(0, normalizedAngle / 360));
            const rawVal = min + ratio * (max - min);
            currentValue = Math.round(rawVal / step) * step;
            currentValue = Math.max(min, Math.min(max, currentValue));

            updateVisuals();
            syncValue();
        };

        const onPointerDown = (e: PointerEvent | MouseEvent) => {
            isDragging = true;
            if ('setPointerCapture' in knobEl && (e as PointerEvent).pointerId !== undefined) {
                try { knobEl.setPointerCapture((e as PointerEvent).pointerId); } catch (_) {}
            }
            updateFromPointer(e.clientX, e.clientY);
        };

        const onPointerMove = (e: PointerEvent | MouseEvent) => {
            if (!isDragging) return;
            updateFromPointer(e.clientX, e.clientY);
        };

        const onPointerUp = (e: PointerEvent | MouseEvent) => {
            if (!isDragging) return;
            isDragging = false;
            if ('releasePointerCapture' in knobEl && (e as PointerEvent).pointerId !== undefined) {
                try { knobEl.releasePointerCapture((e as PointerEvent).pointerId); } catch (_) {}
            }
        };

        // Pointer Events (Mouse, Touch, Pen)
        knobEl.addEventListener('pointerdown', onPointerDown as EventListener, { signal: ctx?.signal });
        knobEl.addEventListener('pointermove', onPointerMove as EventListener, { signal: ctx?.signal });
        knobEl.addEventListener('pointerup', onPointerUp as EventListener, { signal: ctx?.signal });
        knobEl.addEventListener('pointercancel', onPointerUp as EventListener, { signal: ctx?.signal });

        // Mouse fallback
        knobEl.addEventListener('mousedown', onPointerDown as EventListener, { signal: ctx?.signal });
        window.addEventListener('mousemove', onPointerMove as EventListener, { signal: ctx?.signal });
        window.addEventListener('mouseup', onPointerUp as EventListener, { signal: ctx?.signal });
    }

    syncValue();
}
