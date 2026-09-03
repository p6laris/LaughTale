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
    const signal = options.signal;
    const initialPlacement: FloatingPlacement = options.placement ?? 'bottom-start';

    const isPointAnchor = reference != null && !('nodeType' in reference) && typeof (reference as any).x === 'number' && typeof (reference as any).y === 'number';

    if (isPointAnchor && reposition === 'follow') {
        throw new Error('useFloatingPosition: Point anchor cannot be used with reposition: "follow"');
    }
    if (reposition === 'dismiss' && !options.onDismiss) {
        throw new Error('useFloatingPosition: onDismiss callback is required when reposition is "dismiss"');
    }
    if (reposition !== 'none' && !signal) {
        throw new Error('useFloatingPosition: signal is required when reposition is not "none"');
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
        const floatRect = floating.getBoundingClientRect();
        const vpWidth = window.innerWidth;
        const vpHeight = window.innerHeight;

        let placement = initialPlacement;

        // Auto-flip logic if overflowing viewport
        if (autoFlip) {
            const spaceTop = refRect.top;
            const spaceBottom = vpHeight - refRect.bottom;
            const spaceLeft = refRect.left;
            const spaceRight = vpWidth - refRect.right;

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

        // Keep inside viewport bounds
        x = Math.max(viewportPadding, Math.min(vpWidth - floatRect.width - viewportPadding, x));
        y = Math.max(viewportPadding, Math.min(vpHeight - floatRect.height - viewportPadding, y));

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

        return { x, y, actualPlacement: placement, ...(arrowOffset != null ? { arrowOffset } : {}) };
    }

    function update() {
        const { x, y } = computePosition();
        floating.style.position = 'fixed';
        floating.style.left = `${Math.round(x)}px`;
        floating.style.top = `${Math.round(y)}px`;
    }

    if (reposition === 'follow' && typeof window !== 'undefined') {
        window.addEventListener('scroll', () => { update(); }, { capture: true, passive: true, signal });
        window.addEventListener('resize', () => { update(); }, { passive: true, signal });
        if (typeof ResizeObserver !== 'undefined') {
            const ro = new ResizeObserver(() => { update(); });
            ro.observe(floating);
            signal?.addEventListener('abort', () => { ro.disconnect(); }, { once: true });
        }
    } else if (reposition === 'dismiss' && typeof window !== 'undefined') {
        const handleDismiss = () => {
            options.onDismiss?.();
        };
        window.addEventListener('scroll', handleDismiss, { capture: true, passive: true, signal });
        window.addEventListener('resize', handleDismiss, { passive: true, signal });
    }

    return { update, computePosition };
}
