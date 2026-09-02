import { resolvePart, applyPart, type PassthroughRecord } from '../runtime/parts';
import type { IslandContext } from '../runtime/registry';
import { injectIslandStyle } from '../runtime/styles';

/**
 * LaughTale: Enterprise Skeleton Shimmer Placeholder (Aura Design System compliant)
 * Mimics card blocks, text paragraphs, circular avatars, and list items during loading.
 */

export interface SkeletonProps {
    shape?: 'rectangle' | 'circle';
    size?: string;
    width?: string;
    height?: string;
    borderRadius?: string;
    animation?: 'wave' | 'none';
    class?: string;
    style?: string;
    pt?: PassthroughRecord;
    studioOverrides?: Record<string, any>;
}

const SKELETON_CSS = `
island-skeleton,
p-skeleton {
    display: contents !important;
}

.p-skeleton {
    position: relative;
    overflow: hidden;
    background: var(--p-skeleton-background, var(--p-surface-200, #e2e8f0));
    border-radius: var(--p-skeleton-border-radius, var(--p-border-radius, 6px));
    box-sizing: border-box;
    display: block;
}

.p-skeleton-circle {
    border-radius: 50% !important;
}

.p-skeleton:not(.p-skeleton-none)::after {
    content: "";
    animation: p-skeleton-animation 1.4s infinite cubic-bezier(0.4, 0, 0.2, 1);
    background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, var(--p-skeleton-animation-background, rgba(255, 255, 255, 0.55)) 50%, rgba(255, 255, 255, 0) 100%);
    height: 100%;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    transform: translateX(-100%);
    z-index: 1;
    will-change: transform;
}

@keyframes p-skeleton-animation {
    0% {
        transform: translateX(-100%);
    }
    100% {
        transform: translateX(100%);
    }
}

/* Dark Mode Tokens */
html.dark .p-skeleton,
[data-theme="dark"] .p-skeleton,
.dark .p-skeleton {
    background: var(--p-skeleton-background, var(--p-surface-700, #334155));
}

html.dark .p-skeleton:not(.p-skeleton-none)::after,
[data-theme="dark"] .p-skeleton:not(.p-skeleton-none)::after,
.dark .p-skeleton:not(.p-skeleton-none)::after {
    background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, var(--p-skeleton-animation-background, rgba(255, 255, 255, 0.07)) 50%, rgba(255, 255, 255, 0) 100%);
}
`;

export default function SkeletonIsland(container: HTMLElement, props: SkeletonProps, ctx?: IslandContext) {
    injectIslandStyle('skeleton', SKELETON_CSS);

    const isCircle = props.shape === 'circle';
    const width = props.size || props.width || '100%';
    const height = props.size || props.height || (isCircle ? width : '1.25rem');
    const shapeClass = isCircle ? 'p-skeleton-circle' : 'p-skeleton-rectangle';
    const animClass = props.animation === 'none' ? 'p-skeleton-none' : '';

    let rootEl = container.querySelector<HTMLElement>('.p-skeleton');

    if (!rootEl) {
        rootEl = document.createElement('div');
        rootEl.className = `p-skeleton p-component ${shapeClass} ${animClass} ${props.class || ''}`.trim();
        rootEl.setAttribute('aria-hidden', 'true');
        rootEl.style.width = width;
        rootEl.style.height = height;
        if (props.borderRadius) rootEl.style.borderRadius = props.borderRadius;
        if (props.style) rootEl.style.cssText += props.style;

        container.innerHTML = '';
        container.appendChild(rootEl);
    } else {
        rootEl.style.width = width;
        rootEl.style.height = height;
        if (props.borderRadius) rootEl.style.borderRadius = props.borderRadius;
    }

    container.setAttribute('data-part', 'root');
    applyPart(container, 'root', props.class || '', props.pt, props.studioOverrides);
}
