import { resolvePart, applyPart, type PassthroughRecord } from '../runtime/parts';
import type { IslandContext } from '../runtime/registry';
﻿import { injectIslandStyle } from '../runtime/styles';
/**
 * LaughTale: Enterprise Skeleton Shimmer Placeholder (Aura Skeleton inspired)
 */

export interface SkeletonProps {
    shape?: 'rectangle' | 'circle';
    width?: string;
    height?: string;
    borderRadius?: string;
    pt?: PassthroughRecord;
    studioOverrides?: Record<string, any>;
}


const CSS = `
html.dark .laughtale-skeleton,
[data-theme="dark"] .laughtale-skeleton,
.dark .laughtale-skeleton {
    background: linear-gradient(90deg, var(--p-surface-100, #1e293b) 25%, var(--p-surface-200, #334155) 50%, var(--p-surface-100, #1e293b) 75%) !important;
    background-size: 200% 100% !important;
}
`;

export default function SkeletonIsland(container: HTMLElement, props: SkeletonProps, ctx?: IslandContext) {
    injectIslandStyle('skeleton', CSS);
    const shape = props.shape || 'rectangle';
    const width = props.width || '100%';
    const height = props.height || '1.25rem';
    const radius = props.borderRadius || (shape === 'circle' ? '50%' : 'var(--lt-radius)');

    container.innerHTML = `
        <div class="laughtale-skeleton" style="width: ${width}; height: ${height}; border-radius: ${radius}; background: linear-gradient(90deg, var(--lt-surface-100) 25%, var(--lt-surface-200) 50%, var(--lt-surface-100) 75%); background-size: 200% 100%; animation: skeletonShimmer 1.5s infinite ease-in-out;"></div>
        <style>
            @@keyframes skeletonShimmer {
                0% { background-position: 200% 0; }
                100% { background-position: -200% 0; }
            }
        </style>
    `;
}
