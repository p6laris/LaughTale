import { resolvePart, applyPart, type PassthroughRecord } from '../runtime/parts';
import type { IslandContext } from '../runtime/registry';
﻿import { injectIslandStyle } from '../runtime/styles';
/**
 * LaughTale: Enterprise BlockUI Component (Aura BlockUI inspired)
 * Blocks user interaction on a target container with an animated spinner and glassy overlay.
 */

export interface BlockUIProps {
    blocked?: boolean;
    message?: string;
    pt?: PassthroughRecord;
    studioOverrides?: Record<string, any>;
}


const CSS = `
html.dark .laughtale-blockui-root,
[data-theme="dark"] .laughtale-blockui-root,
.dark .laughtale-blockui-root {
    background: transparent !important;
}
html.dark .blockui-mask,
[data-theme="dark"] .blockui-mask,
.dark .blockui-mask {
    background: rgba(9, 13, 22, 0.75) !important;
}
html.dark .blockui-mask > div,
[data-theme="dark"] .blockui-mask > div,
.dark .blockui-mask > div {
    background: var(--p-surface-0, #090d16) !important;
    border-color: var(--p-border-color, #334155) !important;
    color: var(--p-text-color, #f8fafc) !important;
}
`;

export default function BlockUIIsland(container: HTMLElement, props: BlockUIProps, ctx?: IslandContext) {
    injectIslandStyle('blockui', CSS);
    let isBlocked = props.blocked ?? true;

    function render() {
        container.innerHTML = `
            <div class="laughtale-blockui-root" style="position: relative; width: 100%;">
                <!-- Blocked Glass Overlay -->
                <div class="blockui-mask" style="display: ${isBlocked ? 'flex' : 'none'}; position: absolute; inset: 0; z-index: 100; background: rgba(255, 255, 255, 0.65); backdrop-filter: blur(3px); align-items: center; justify-content: center; border-radius: inherit;">
                    <div style="display: flex; flex-direction: column; align-items: center; gap: 0.75rem; background: var(--lt-surface-0); border: 1px solid var(--lt-surface-200); padding: 1rem 1.5rem; border-radius: var(--lt-radius-lg); box-shadow: var(--p-shadow-md);">
                        <svg class="animate-spin" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--lt-primary-600); animation: spin 0.8s linear infinite;">
                            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                        </svg>
                        <span style="font-size: 0.8125rem; font-weight: 600; color: var(--lt-surface-700);">${props.message || 'Processing transaction...'}</span>
                    </div>
                </div>
            </div>
        `;
    }

    render();

    container.addEventListener('blockui:toggle', () => {
        isBlocked = !isBlocked;
        render();
    });
}
