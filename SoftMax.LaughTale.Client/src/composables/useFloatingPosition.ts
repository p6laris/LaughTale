/**
 * SoftMax.LaughTale: Headless useFloatingPosition Composable
 * Positions floating overlays (tooltips, popovers, autocompletes) with viewport collision flipping and offset calculations.
 */

export type FloatingPlacement = 'top' | 'top-start' | 'top-end' |
                                'bottom' | 'bottom-start' | 'bottom-end' |
                                'left' | 'left-start' | 'left-end' |
                                'right' | 'right-start' | 'right-end';

export interface UseFloatingPositionOptions {
    placement?: FloatingPlacement;
    offset?: number;
    autoFlip?: boolean;
    viewportPadding?: number;
}

export interface FloatingCoords {
    x: number;
    y: number;
    actualPlacement: FloatingPlacement;
}

export function useFloatingPosition(
    reference: HTMLElement,
    floating: HTMLElement,
    options: UseFloatingPositionOptions = {}
) {
    const offset = options.offset ?? 6;
    const autoFlip = options.autoFlip !== false;
    const viewportPadding = options.viewportPadding ?? 8;
    let initialPlacement: FloatingPlacement = options.placement ?? 'bottom-start';

    function computePosition(): FloatingCoords {
        const refRect = reference.getBoundingClientRect();
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

        return { x, y, actualPlacement: placement };
    }

    function update() {
        const { x, y } = computePosition();
        floating.style.position = 'fixed';
        floating.style.left = `${Math.round(x)}px`;
        floating.style.top = `${Math.round(y)}px`;
    }

    return { update, computePosition };
}
