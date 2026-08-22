import { injectIslandStyle } from '../runtime/styles';
/**
 * SoftMax.LaughTale: Enterprise Range Slider Component (Aura Slider inspired)
 * High-performance Pointer Capture dragging engine (0 DOM rebuilding during drag).
 */

export interface SliderProps {
    targetInputName?: string;
    value?: number;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
}


const CSS = `
[data-theme="dark"] .laughtale-slider {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .slider-track {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .slider-fill {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .slider-handle {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .slider-value-display {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
`;

export default function SliderIsland(container: HTMLElement, props: SliderProps) {
    injectIslandStyle('slider', CSS);
    const min = props.min !== undefined ? props.min : 0;
    const max = props.max !== undefined ? props.max : 100;
    const step = props.step !== undefined ? props.step : 1;
    let currentValue = props.value !== undefined ? props.value : min;

    function getPercent(val: number): number {
        return Math.max(0, Math.min(100, ((val - min) / (max - min)) * 100));
    }

    // Build DOM once
    const initialPercent = getPercent(currentValue);
    container.innerHTML = `
        <div class="laughtale-slider" style="position: relative; width: 100%; max-width: 320px; padding: 1rem 0; user-select: none; touch-action: none;">
            <!-- Track -->
            <div class="slider-track" style="position: relative; height: 6px; border-radius: 3px; background: var(--p-surface-200); cursor: ${props.disabled ? 'not-allowed' : 'pointer'};">
                <!-- Active Fill Bar -->
                <div class="slider-fill" style="position: absolute; top: 0; left: 0; height: 100%; width: ${initialPercent}%; border-radius: 3px; background: var(--p-primary-600); pointer-events: none;"></div>
                <!-- Drag Handle -->
                <div class="slider-handle" style="position: absolute; top: 50%; left: ${initialPercent}%; transform: translate(-50%, -50%); width: 1.125rem; height: 1.125rem; border-radius: 50%; background: #ffffff; border: 2px solid var(--p-primary-600); box-shadow: 0 1px 4px rgba(0,0,0,0.2); cursor: ${props.disabled ? 'not-allowed' : 'grab'};"></div>
            </div>

            <div style="display: flex; justify-content: space-between; margin-top: 0.5rem; font-size: 0.75rem; color: var(--p-surface-500); font-family: var(--p-font-mono);">
                <span>${min}</span>
                <span class="slider-value-display" style="font-weight: 700; color: var(--p-primary-600);">${currentValue}</span>
                <span>${max}</span>
            </div>
        </div>
    `;

    const track = container.querySelector<HTMLElement>('.slider-track')!;
    const fill = container.querySelector<HTMLElement>('.slider-fill')!;
    const handle = container.querySelector<HTMLElement>('.slider-handle')!;
    const valueDisplay = container.querySelector<HTMLElement>('.slider-value-display')!;

    function updateVisuals() {
        const pct = getPercent(currentValue);
        fill.style.width = `${pct}%`;
        handle.style.left = `${pct}%`;
        valueDisplay.textContent = currentValue.toString();
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

        container.dispatchEvent(new CustomEvent('slider:change', {
            bubbles: true,
            detail: { value: currentValue }
        }));
    }

    if (!props.disabled) {
        let isDragging = false;

        const updateFromClientX = (clientX: number) => {
            const rect = track.getBoundingClientRect();
            if (rect.width <= 0) return;
            let ratio = (clientX - rect.left) / rect.width;
            ratio = Math.max(0, Math.min(1, ratio));

            let rawVal = min + ratio * (max - min);
            rawVal = Math.round(rawVal / step) * step;
            currentValue = Math.max(min, Math.min(max, rawVal));

            updateVisuals();
            syncValue();
        };

        const onPointerDown = (e: PointerEvent | MouseEvent) => {
            isDragging = true;
            handle.style.cursor = 'grabbing';
            handle.style.transform = 'translate(-50%, -50%) scale(1.2)';

            if ('setPointerCapture' in track && (e as PointerEvent).pointerId !== undefined) {
                try { track.setPointerCapture((e as PointerEvent).pointerId); } catch (_) {}
            }

            updateFromClientX(e.clientX);
        };

        const onPointerMove = (e: PointerEvent | MouseEvent) => {
            if (!isDragging) return;
            updateFromClientX(e.clientX);
        };

        const onPointerUp = (e: PointerEvent | MouseEvent) => {
            if (!isDragging) return;
            isDragging = false;
            handle.style.cursor = 'grab';
            handle.style.transform = 'translate(-50%, -50%) scale(1)';

            if ('releasePointerCapture' in track && (e as PointerEvent).pointerId !== undefined) {
                try { track.releasePointerCapture((e as PointerEvent).pointerId); } catch (_) {}
            }
        };

        // Pointer Events (supports Mouse, Touch, Pen)
        track.addEventListener('pointerdown', onPointerDown as EventListener);
        track.addEventListener('pointermove', onPointerMove as EventListener);
        track.addEventListener('pointerup', onPointerUp as EventListener);
        track.addEventListener('pointercancel', onPointerUp as EventListener);

        // Fallback Mouse events for environments without Pointer Events
        track.addEventListener('mousedown', onPointerDown as EventListener);
        window.addEventListener('mousemove', onPointerMove as EventListener);
        window.addEventListener('mouseup', onPointerUp as EventListener);
    }

    syncValue();
}
