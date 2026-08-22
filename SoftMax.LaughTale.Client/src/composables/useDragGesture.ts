/**
 * SoftMax.LaughTale: Headless useDragGesture Composable
 * Pointer capture drag engine with normalized delta calculation, axis constraints, and bounds checking.
 */

export interface DragState {
    clientX: number;
    clientY: number;
    dx: number;
    dy: number;
    ratioX: number;
    ratioY: number;
    isDragging: boolean;
}

export interface UseDragGestureOptions {
    axis?: 'x' | 'y' | 'both';
    onDragStart?: (state: DragState) => void;
    onDrag?: (state: DragState) => void;
    onDragEnd?: (state: DragState) => void;
}

export function useDragGesture(targetElement: HTMLElement, options: UseDragGestureOptions = {}) {
    const axis = options.axis ?? 'both';
    let isDragging = false;
    let startX = 0;
    let startY = 0;

    function getDragState(e: PointerEvent | MouseEvent): DragState {
        const rect = targetElement.getBoundingClientRect();
        const clientX = e.clientX;
        const clientY = e.clientY;

        const dx = axis === 'y' ? 0 : clientX - startX;
        const dy = axis === 'x' ? 0 : clientY - startY;

        const ratioX = rect.width > 0 ? Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)) : 0;
        const ratioY = rect.height > 0 ? Math.max(0, Math.min(1, (clientY - rect.top) / rect.height)) : 0;

        return { clientX, clientY, dx, dy, ratioX, ratioY, isDragging };
    }

    const onPointerDown = (e: PointerEvent | MouseEvent) => {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;

        if ('setPointerCapture' in targetElement && (e as PointerEvent).pointerId !== undefined) {
            try { targetElement.setPointerCapture((e as PointerEvent).pointerId); } catch (_) {}
        }

        const state = getDragState(e);
        options.onDragStart?.(state);
        options.onDrag?.(state);
    };

    const onPointerMove = (e: PointerEvent | MouseEvent) => {
        if (!isDragging) return;
        const state = getDragState(e);
        options.onDrag?.(state);
    };

    const onPointerUp = (e: PointerEvent | MouseEvent) => {
        if (!isDragging) return;
        isDragging = false;

        if ('releasePointerCapture' in targetElement && (e as PointerEvent).pointerId !== undefined) {
            try { targetElement.releasePointerCapture((e as PointerEvent).pointerId); } catch (_) {}
        }

        const state = getDragState(e);
        options.onDragEnd?.(state);
    };

    targetElement.addEventListener('pointerdown', onPointerDown as EventListener);
    targetElement.addEventListener('pointermove', onPointerMove as EventListener);
    targetElement.addEventListener('pointerup', onPointerUp as EventListener);
    targetElement.addEventListener('pointercancel', onPointerUp as EventListener);

    function destroy() {
        targetElement.removeEventListener('pointerdown', onPointerDown as EventListener);
        targetElement.removeEventListener('pointermove', onPointerMove as EventListener);
        targetElement.removeEventListener('pointerup', onPointerUp as EventListener);
        targetElement.removeEventListener('pointercancel', onPointerUp as EventListener);
    }

    return { destroy };
}
