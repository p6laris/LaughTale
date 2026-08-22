import { injectIslandStyle } from '../runtime/styles';
/**
 * SoftMax.LaughTale: Enterprise ImageCompare Split Slider Component (Aura ImageCompare inspired)
 * High-performance pointer capture dragging engine without full DOM rebuilds.
 */

export interface ImageCompareProps {
    beforeImage: string;
    afterImage: string;
    beforeLabel?: string;
    afterLabel?: string;
}


const CSS = `
[data-theme="dark"] .laughtale-image-compare {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
`;

export default function ImageCompareIsland(container: HTMLElement, props: ImageCompareProps) {
    injectIslandStyle('image-compare', CSS);
    let splitPercent = 50;

    // Render static DOM skeleton once
    container.innerHTML = `
        <div class="laughtale-image-compare" style="position: relative; width: 100%; max-width: 600px; height: 340px; border-radius: var(--p-border-radius-lg); overflow: hidden; user-select: none; border: 1px solid var(--p-border-color); box-shadow: var(--p-shadow-md); touch-action: none; cursor: ew-resize;">
            <!-- After Image (Bottom) -->
            <img src="${props.afterImage}" alt="After" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; pointer-events: none;" />
            ${props.afterLabel ? `<span style="position: absolute; bottom: 0.75rem; right: 0.75rem; background: rgba(0,0,0,0.6); color: #ffffff; padding: 0.25rem 0.5rem; border-radius: var(--p-border-radius); font-size: 0.75rem; font-weight: 600; pointer-events: none;">${props.afterLabel}</span>` : ''}

            <!-- Before Image (Top Clipped) -->
            <div class="compare-clip" style="position: absolute; inset: 0; width: ${splitPercent}%; height: 100%; overflow: hidden; pointer-events: none;">
                <img src="${props.beforeImage}" alt="Before" style="position: absolute; top: 0; left: 0; width: 600px; max-width: 600px; height: 340px; object-fit: cover;" />
                ${props.beforeLabel ? `<span style="position: absolute; bottom: 0.75rem; left: 0.75rem; background: rgba(0,0,0,0.6); color: #ffffff; padding: 0.25rem 0.5rem; border-radius: var(--p-border-radius); font-size: 0.75rem; font-weight: 600;">${props.beforeLabel}</span>` : ''}
            </div>

            <!-- Divider Line & Handle -->
            <div class="compare-handle-line" style="position: absolute; top: 0; bottom: 0; left: ${splitPercent}%; width: 2px; background: #ffffff; box-shadow: 0 0 6px rgba(0,0,0,0.6); pointer-events: none;">
                <div class="compare-handle-knob" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 2.25rem; height: 2.25rem; border-radius: 50%; background: #ffffff; border: 2px solid var(--p-primary-600); box-shadow: 0 2px 8px rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center; font-size: 0.6875rem; font-weight: 700; color: var(--p-primary-600); transition: transform 0.15s ease;">
                    ◀▶
                </div>
            </div>
        </div>
    `;

    const compareBox = container.querySelector<HTMLElement>('.laughtale-image-compare')!;
    const clip = container.querySelector<HTMLElement>('.compare-clip')!;
    const handleLine = container.querySelector<HTMLElement>('.compare-handle-line')!;
    const knob = container.querySelector<HTMLElement>('.compare-handle-knob')!;

    function updateSplit(p: number) {
        splitPercent = Math.max(0, Math.min(100, p));
        clip.style.width = `${splitPercent}%`;
        handleLine.style.left = `${splitPercent}%`;

        container.dispatchEvent(new CustomEvent('imagecompare:change', {
            bubbles: true,
            detail: { split: splitPercent }
        }));
    }

    let isDragging = false;

    const updateFromPointer = (clientX: number) => {
        const rect = compareBox.getBoundingClientRect();
        if (rect.width <= 0) return;
        const p = ((clientX - rect.left) / rect.width) * 100;
        updateSplit(p);
    };

    const onPointerDown = (e: PointerEvent | MouseEvent) => {
        isDragging = true;
        knob.style.transform = 'translate(-50%, -50%) scale(1.15)';

        if ('setPointerCapture' in compareBox && (e as PointerEvent).pointerId !== undefined) {
            try { compareBox.setPointerCapture((e as PointerEvent).pointerId); } catch (_) {}
        }

        updateFromPointer(e.clientX);
    };

    const onPointerMove = (e: PointerEvent | MouseEvent) => {
        if (!isDragging) return;
        updateFromPointer(e.clientX);
    };

    const onPointerUp = (e: PointerEvent | MouseEvent) => {
        if (!isDragging) return;
        isDragging = false;
        knob.style.transform = 'translate(-50%, -50%) scale(1)';

        if ('releasePointerCapture' in compareBox && (e as PointerEvent).pointerId !== undefined) {
            try { compareBox.releasePointerCapture((e as PointerEvent).pointerId); } catch (_) {}
        }
    };

    // Pointer Events (Touch, Mouse, Pen)
    compareBox.addEventListener('pointerdown', onPointerDown as EventListener);
    compareBox.addEventListener('pointermove', onPointerMove as EventListener);
    compareBox.addEventListener('pointerup', onPointerUp as EventListener);
    compareBox.addEventListener('pointercancel', onPointerUp as EventListener);

    // Mouse fallback
    compareBox.addEventListener('mousedown', onPointerDown as EventListener);
    window.addEventListener('mousemove', onPointerMove as EventListener);
    window.addEventListener('mouseup', onPointerUp as EventListener);
}
