/**
 * LaughTale: Headless useFloatingPosition Composable
 * Positions floating overlays (tooltips, popovers, autocompletes) with viewport collision flipping and offset calculations.
 */

export type FloatingPlacement = 'top' | 'top-start' | 'top-end' |
                                'bottom' | 'bottom-start' | 'bottom-end' |
                                'left' | 'left-start' | 'left-end' |
                                'right' | 'right-start' | 'right-end';

export type Anchor = HTMLElement | { x: number; y: number };

export interface UseFloatingPositionOptions {
    placement?: FloatingPlacement;
    offset?: number;
    autoFlip?: boolean;
    viewportPadding?: number;
    arrow?: HTMLElement;
    reposition?: 'follow' | 'dismiss' | 'none';
    onDismiss?: () => void;
    signal?: AbortSignal;
    strategy?: 'fixed' | 'absolute';
    boundary?: HTMLElement;
    axis?: 'both' | 'x' | 'y';
    /**
     * Whether the surrounding UI is right-to-left. When true, logical placements are
     * mirrored: a '*-start' placement aligns to the physical right edge instead of the
     * left, and pure 'left'/'right' compass placements swap sides. When omitted, this is
     * auto-detected from the floating element's resolved `direction` CSS property, so
     * callers that already render inside a `dir="rtl"` subtree get correct behavior for
     * free; pass it explicitly when the caller already has a resolved locale/dir value
     * (e.g. from `useLocale(ctx)`) to avoid relying on layout timing.
     */
    isRtl?: boolean;
}

/**
 * Mirrors a placement's horizontal meaning for RTL contexts: swaps physical
 * 'left'/'right' compass placements, and swaps the '-start'/'-end' suffix used by
 * 'top'/'bottom' placements to align to the reference element's logical start/end edge.
 * Exported so callers/tests can reason about the mirrored placement without duplicating
 * this logic.
 */
export function mirrorPlacementForRtl(placement: FloatingPlacement, isRtl: boolean): FloatingPlacement {
    if (!isRtl) return placement;
    if (placement.startsWith('left')) return placement.replace('left', 'right') as FloatingPlacement;
    if (placement.startsWith('right')) return placement.replace('right', 'left') as FloatingPlacement;
    if (placement.endsWith('-start')) return placement.replace('-start', '-end') as FloatingPlacement;
    if (placement.endsWith('-end')) return placement.replace('-end', '-start') as FloatingPlacement;
    return placement;
}

export interface FloatingCoords {
    x: number;
    y: number;
    actualPlacement: FloatingPlacement;
    arrowOffset?: number;
}

export interface FloatingController {
    update(): void;
    computePosition(): FloatingCoords;
    destroy(): void;
}

export function useFloatingPosition(
    reference: Anchor,
    floating: HTMLElement,
    options: UseFloatingPositionOptions = {}
): FloatingController {
    const offset = options.offset ?? 6;
    const autoFlip = options.autoFlip !== false;
    const viewportPadding = options.viewportPadding ?? 8;
    const reposition = options.reposition ?? 'none';
    const strategy = options.strategy ?? 'fixed';
    const boundary = options.boundary;
    const axis = options.axis ?? 'both';
    const signal = options.signal;
    const rawInitialPlacement: FloatingPlacement = options.placement ?? 'bottom-start';
    const isRtl = options.isRtl ?? (
        typeof window !== 'undefined' && typeof window.getComputedStyle === 'function'
            ? window.getComputedStyle(floating).direction === 'rtl'
            : false
    );
    const initialPlacement: FloatingPlacement = mirrorPlacementForRtl(rawInitialPlacement, isRtl);

    const isPointAnchor = reference != null && !('nodeType' in reference) && typeof (reference as any).x === 'number' && typeof (reference as any).y === 'number';

    if (isPointAnchor && reposition === 'follow') {
        throw new Error('useFloatingPosition: Point anchor cannot be used with reposition: "follow"');
    }
    if (reposition === 'dismiss' && !options.onDismiss) {
        throw new Error('useFloatingPosition: onDismiss callback is required when reposition is "dismiss"');
    }
    const fallbackController = new AbortController();
    const effectiveSignal = signal || fallbackController.signal;

    const cleanupFns: Array<() => void> = [];
    let isDestroyed = false;

    function destroy() {
        if (isDestroyed) return;
        isDestroyed = true;
        fallbackController.abort();
        while (cleanupFns.length > 0) {
            try {
                cleanupFns.pop()!();
            } catch {}
        }
    }

    if (signal) {
        signal.addEventListener('abort', () => { destroy(); }, { once: true });
    }

    function getReferenceRect(): { top: number; bottom: number; left: number; right: number; width: number; height: number } {
        if (isPointAnchor) {
            const pt = reference as { x: number; y: number };
            return {
                top: pt.y,
                bottom: pt.y,
                left: pt.x,
                right: pt.x,
                width: 0,
                height: 0
            };
        }
        return (reference as HTMLElement).getBoundingClientRect();
    }

    function computePosition(): FloatingCoords {
        const refRect = getReferenceRect();
        const rawFloatRect = floating.getBoundingClientRect();
        const floatRect = {
            top: rawFloatRect.top,
            bottom: rawFloatRect.bottom,
            left: rawFloatRect.left,
            right: rawFloatRect.right,
            width: rawFloatRect.width || floating.offsetWidth || 150,
            height: rawFloatRect.height || floating.offsetHeight || 150
        };
        const vpWidth = window.innerWidth;
        const vpHeight = window.innerHeight;

        let bTop = 0;
        let bBottom = vpHeight;
        let bLeft = 0;
        let bRight = vpWidth;

        if (boundary) {
            const bRect = boundary.getBoundingClientRect();
            bTop = bRect.top;
            bBottom = bRect.bottom;
            bLeft = bRect.left;
            bRight = bRect.right;
        }

        let placement = initialPlacement;

        // Auto-flip logic if overflowing boundary
        if (autoFlip) {
            const spaceTop = refRect.top - bTop;
            const spaceBottom = bBottom - refRect.bottom;
            const spaceLeft = refRect.left - bLeft;
            const spaceRight = bRight - refRect.right;

            if (placement.startsWith('bottom') && spaceBottom < floatRect.height + offset && spaceTop > spaceBottom) {
                placement = placement.replace('bottom', 'top') as FloatingPlacement;
            } else if (placement.startsWith('top') && spaceTop < floatRect.height + offset && spaceBottom > spaceTop) {
                placement = placement.replace('top', 'bottom') as FloatingPlacement;
            } else if (placement.startsWith('right') && spaceRight < floatRect.width + offset && spaceLeft > spaceRight) {
                placement = placement.replace('right', 'left') as FloatingPlacement;
            } else if (placement.startsWith('left') && spaceLeft < floatRect.width + offset && spaceRight > spaceLeft) {
                placement = placement.replace('left', 'right') as FloatingPlacement;
            }
        }

        let x = 0;
        let y = 0;

        switch (placement) {
            case 'bottom':
                x = refRect.left + (refRect.width - floatRect.width) / 2;
                y = refRect.bottom + offset;
                break;
            case 'bottom-start':
                x = refRect.left;
                y = refRect.bottom + offset;
                break;
            case 'bottom-end':
                x = refRect.right - floatRect.width;
                y = refRect.bottom + offset;
                break;
            case 'top':
                x = refRect.left + (refRect.width - floatRect.width) / 2;
                y = refRect.top - floatRect.height - offset;
                break;
            case 'top-start':
                x = refRect.left;
                y = refRect.top - floatRect.height - offset;
                break;
            case 'top-end':
                x = refRect.right - floatRect.width;
                y = refRect.top - floatRect.height - offset;
                break;
            case 'left':
                x = refRect.left - floatRect.width - offset;
                y = refRect.top + (refRect.height - floatRect.height) / 2;
                break;
            case 'left-start':
                x = refRect.left - floatRect.width - offset;
                y = refRect.top;
                break;
            case 'left-end':
                x = refRect.left - floatRect.width - offset;
                y = refRect.bottom - floatRect.height;
                break;
            case 'right':
                x = refRect.right + offset;
                y = refRect.top + (refRect.height - floatRect.height) / 2;
                break;
            case 'right-start':
                x = refRect.right + offset;
                y = refRect.top;
                break;
            case 'right-end':
                x = refRect.right + offset;
                y = refRect.bottom - floatRect.height;
                break;
        }

        // Keep inside boundary bounds (viewport or container)
        x = Math.max(bLeft + viewportPadding, Math.min(bRight - floatRect.width - viewportPadding, x));
        y = Math.max(bTop + viewportPadding, Math.min(bBottom - floatRect.height - viewportPadding, y));

        let arrowOffset: number | undefined;
        if (options.arrow) {
            const arrowEl = options.arrow;
            if (placement.startsWith('top') || placement.startsWith('bottom')) {
                const arrowWidth = arrowEl.offsetWidth || (arrowEl.getBoundingClientRect ? arrowEl.getBoundingClientRect().width : 0) || 10;
                const targetCenter = refRect.left + (refRect.width / 2);
                const rawOffset = targetCenter - x - (arrowWidth / 2);
                const minOffset = 12;
                const maxOffset = Math.max(minOffset, floatRect.width - arrowWidth - minOffset);
                arrowOffset = Math.max(minOffset, Math.min(maxOffset, rawOffset));
            } else {
                const arrowHeight = arrowEl.offsetHeight || (arrowEl.getBoundingClientRect ? arrowEl.getBoundingClientRect().height : 0) || 10;
                const targetCenter = refRect.top + (refRect.height / 2);
                const rawOffset = targetCenter - y - (arrowHeight / 2);
                const minOffset = 12;
                const maxOffset = Math.max(minOffset, floatRect.height - arrowHeight - minOffset);
                arrowOffset = Math.max(minOffset, Math.min(maxOffset, rawOffset));
            }
        }

        if (strategy === 'absolute') {
            const scrollX = typeof window !== 'undefined' ? window.scrollX : 0;
            const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;
            x += scrollX;
            y += scrollY;
        }

        return { x, y, actualPlacement: placement, ...(arrowOffset != null ? { arrowOffset } : {}) };
    }

    function update() {
        const { x, y } = computePosition();
        floating.style.position = strategy;
        if (axis === 'both' || axis === 'x') {
            floating.style.left = `${Math.round(x)}px`;
        }
        if (axis === 'both' || axis === 'y') {
            floating.style.top = `${Math.round(y)}px`;
        }
    }

    if (reposition === 'follow' && typeof window !== 'undefined') {
        const onScroll = () => { update(); };
        const onResize = () => { update(); };
        window.addEventListener('scroll', onScroll, { capture: true, passive: true, signal: effectiveSignal });
        window.addEventListener('resize', onResize, { passive: true, signal: effectiveSignal });
        cleanupFns.push(() => window.removeEventListener('scroll', onScroll, { capture: true }));
        cleanupFns.push(() => window.removeEventListener('resize', onResize));

        if (typeof ResizeObserver !== 'undefined') {
            const ro = new ResizeObserver(() => { update(); });
            ro.observe(floating);
            cleanupFns.push(() => ro.disconnect());
        }
    } else if (reposition === 'dismiss' && typeof window !== 'undefined') {
        const handleDismiss = () => {
            options.onDismiss?.();
        };
        window.addEventListener('scroll', handleDismiss, { capture: true, passive: true, signal: effectiveSignal });
        window.addEventListener('resize', handleDismiss, { passive: true, signal: effectiveSignal });
        cleanupFns.push(() => window.removeEventListener('scroll', handleDismiss, { capture: true }));
        cleanupFns.push(() => window.removeEventListener('resize', handleDismiss));
    }

    update();
    return { update, computePosition, destroy };
}
