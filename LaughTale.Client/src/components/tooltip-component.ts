import { resolvePart, applyPart, type PassthroughRecord } from '../runtime/parts';
import type { IslandContext } from '../runtime/registry';
﻿/**
 * LaughTale: Enterprise Tooltip Island Component (LaughTale Aura Design System)
 */

import { initGlobalTooltipDelegation } from '../directives/tooltip';

export interface TooltipProps {
    value?: string;
    text?: string;
    target?: string;
    position?: 'top' | 'bottom' | 'left' | 'right';
    showDelay?: number;
    hideDelay?: number;
    event?: 'hover' | 'focus' | 'both';
    autoHide?: boolean;
    escape?: boolean;
    pt?: PassthroughRecord;
    studioOverrides?: Record<string, any>;
}

export default function TooltipIsland(container: HTMLElement, props: TooltipProps, ctx?: IslandContext) {
    initGlobalTooltipDelegation();

    const targetSelector = props.target;
    const tooltipText = props.value || props.text || container.textContent?.trim();

    if (targetSelector && tooltipText) {
        const targetEl = document.querySelector<HTMLElement>(targetSelector);
        if (targetEl) {
            targetEl.setAttribute('p-tooltip', tooltipText);
            if (props.position) targetEl.setAttribute('p-tooltip-position', props.position);
            if (props.showDelay !== undefined) targetEl.setAttribute('p-tooltip-show-delay', props.showDelay.toString());
            if (props.hideDelay !== undefined) targetEl.setAttribute('p-tooltip-hide-delay', props.hideDelay.toString());
            if (props.event) targetEl.setAttribute('p-tooltip-event', props.event);
            if (props.autoHide !== undefined) targetEl.setAttribute('p-tooltip-auto-hide', props.autoHide.toString());
            if (props.escape !== undefined) targetEl.setAttribute('p-tooltip-escape', props.escape.toString());
        }
    }
}
