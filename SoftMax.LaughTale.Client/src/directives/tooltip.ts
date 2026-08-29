/**
 * SoftMax.LaughTale: Enterprise Tooltip Directive & Engine (PrimeVue 4 Aura Design System compliant)
 * High-performance floating advisory tooltip with 4-direction edge arrow notches (top, bottom, left, right),
 * custom show/hide delays, hover & focus trigger events, auto-hide toggle, rich HTML content support,
 * object configuration parsing, and zero-delay global event delegation.
 */

import { injectIslandStyle } from '../runtime/styles';

const TOOLTIP_CSS = `
.p-tooltip {
    position: fixed;
    z-index: 100000;
    pointer-events: none;
    visibility: hidden;
    opacity: 0;
    transform: scale(0.92);
    transform-origin: center center;
    will-change: transform, opacity;
    transition: transform 0.15s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.15s ease, visibility 0.15s;
}

.p-tooltip.p-tooltip-active {
    visibility: visible;
    opacity: 1;
    transform: scale(1);
}

.p-tooltip.p-tooltip-interactive {
    pointer-events: auto;
}

.p-tooltip-text {
    background: var(--p-surface-700, #334155);
    color: var(--p-surface-0, #ffffff);
    font-size: 0.75rem;
    font-weight: 500;
    line-height: 1.4;
    padding: 0.375rem 0.75rem;
    border-radius: var(--p-border-radius, 6px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
    max-width: 18rem;
    word-break: break-word;
}

/* Arrow Notch */
.p-tooltip-arrow {
    position: absolute;
    width: 8px;
    height: 8px;
    background: var(--p-surface-700, #334155);
    transform: rotate(45deg);
    z-index: -1;
}

.p-tooltip-top .p-tooltip-arrow {
    bottom: -4px;
    left: calc(50% - 4px);
}
.p-tooltip-bottom .p-tooltip-arrow {
    top: -4px;
    left: calc(50% - 4px);
}
.p-tooltip-left .p-tooltip-arrow {
    right: -4px;
    top: calc(50% - 4px);
}
.p-tooltip-right .p-tooltip-arrow {
    left: -4px;
    top: calc(50% - 4px);
}

/* Dark Mode Tokens */
.dark .p-tooltip-text,
[data-theme="dark"] .p-tooltip-text {
    background: var(--p-surface-800, #1e293b);
    color: var(--p-surface-0, #f8fafc);
    border: 1px solid var(--p-surface-700, #334155);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
}

.dark .p-tooltip-arrow,
[data-theme="dark"] .p-tooltip-arrow {
    background: var(--p-surface-800, #1e293b);
    border-color: var(--p-surface-700, #334155);
}
`;

export interface TooltipConfig {
    value: string;
    position?: 'top' | 'bottom' | 'left' | 'right';
    showDelay?: number;
    hideDelay?: number;
    event?: 'hover' | 'focus' | 'both';
    autoHide?: boolean;
    escape?: boolean;
    class?: string;
}

let activeTooltipEl: HTMLElement | null = null;
let currentTargetEl: HTMLElement | null = null;
let showTimeoutId: any = null;
let hideTimeoutId: any = null;
let globalTooltipDelegationBound = false;

function parseTooltipConfig(element: HTMLElement): TooltipConfig | null {
    // Check attributes: p-tooltip, v-tooltip, data-tooltip, l-tooltip
    let rawValue = '';
    let position: 'top' | 'bottom' | 'left' | 'right' = 'right'; // PrimeVue default position is right

    for (const attr of Array.from(element.attributes)) {
        if (
            attr.name === 'p-tooltip' || 
            attr.name === 'v-tooltip' || 
            attr.name === 'data-tooltip' || 
            attr.name === 'l-tooltip' ||
            attr.name.startsWith('p-tooltip.') || 
            attr.name.startsWith('v-tooltip.') ||
            attr.name.startsWith('l-tooltip.')
        ) {
            rawValue = attr.value;
            if (attr.name.includes('.top')) position = 'top';
            else if (attr.name.includes('.bottom')) position = 'bottom';
            else if (attr.name.includes('.left')) position = 'left';
            else if (attr.name.includes('.right')) position = 'right';
            break;
        }
    }

    if (!rawValue) {
        const targetId = element.getAttribute('data-tooltip-target');
        if (targetId) {
            const template = document.getElementById(targetId);
            if (template) rawValue = template.innerHTML;
        }
    }

    if (!rawValue) return null;

    // Check if rawValue is JSON object
    if (rawValue.trim().startsWith('{') && rawValue.trim().endsWith('}')) {
        try {
            const parsed = JSON.parse(rawValue);
            return {
                value: parsed.value || '',
                position: parsed.position || position,
                showDelay: parsed.showDelay !== undefined ? Number(parsed.showDelay) : 0,
                hideDelay: parsed.hideDelay !== undefined ? Number(parsed.hideDelay) : 0,
                event: parsed.event || 'hover',
                autoHide: parsed.autoHide !== false,
                escape: parsed.escape !== false,
                class: parsed.class || ''
            };
        } catch {}
    }

    // Read companion attributes
    const posAttr = element.getAttribute('p-tooltip-position') || element.getAttribute('data-tooltip-position');
    if (posAttr) position = posAttr as any;

    const showDelayAttr = element.getAttribute('p-tooltip-show-delay') || element.getAttribute('data-tooltip-show-delay');
    const hideDelayAttr = element.getAttribute('p-tooltip-hide-delay') || element.getAttribute('data-tooltip-hide-delay');
    const eventAttr = element.getAttribute('p-tooltip-event') || element.getAttribute('data-tooltip-event');
    const autoHideAttr = element.getAttribute('p-tooltip-auto-hide') || element.getAttribute('data-tooltip-auto-hide');
    const escapeAttr = element.getAttribute('p-tooltip-escape') || element.getAttribute('data-tooltip-escape');

    return {
        value: rawValue,
        position,
        showDelay: showDelayAttr ? parseInt(showDelayAttr, 10) : 0,
        hideDelay: hideDelayAttr ? parseInt(hideDelayAttr, 10) : 0,
        event: (eventAttr as any) || 'hover',
        autoHide: autoHideAttr !== 'false',
        escape: escapeAttr !== 'false'
    };
}

function positionTooltip(tooltipEl: HTMLElement, targetEl: HTMLElement, position: string) {
    const targetRect = targetEl.getBoundingClientRect();
    const tooltipRect = tooltipEl.getBoundingClientRect();
    const margin = 8;

    let top = 0;
    let left = 0;

    switch (position) {
        case 'top':
            top = targetRect.top - tooltipRect.height - margin;
            left = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2);
            break;
        case 'bottom':
            top = targetRect.bottom + margin;
            left = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2);
            break;
        case 'left':
            top = targetRect.top + (targetRect.height / 2) - (tooltipRect.height / 2);
            left = targetRect.left - tooltipRect.width - margin;
            break;
        case 'right':
        default:
            top = targetRect.top + (targetRect.height / 2) - (tooltipRect.height / 2);
            left = targetRect.right + margin;
            break;
    }

    // Viewport edge collision bounds
    if (left < 8) left = 8;
    if (left + tooltipRect.width > window.innerWidth - 8) {
        left = window.innerWidth - tooltipRect.width - 8;
    }
    if (top < 8) top = 8;
    if (top + tooltipRect.height > window.innerHeight - 8) {
        top = window.innerHeight - tooltipRect.height - 8;
    }

    tooltipEl.style.top = `${Math.round(top)}px`;
    tooltipEl.style.left = `${Math.round(left)}px`;
}

function showTooltipForElement(targetEl: HTMLElement, config: TooltipConfig) {
    if (hideTimeoutId) {
        clearTimeout(hideTimeoutId);
        hideTimeoutId = null;
    }

    if (showTimeoutId) {
        clearTimeout(showTimeoutId);
        showTimeoutId = null;
    }

    const triggerShow = () => {
        if (!activeTooltipEl) {
            activeTooltipEl = document.createElement('div');
            activeTooltipEl.className = 'p-tooltip p-component';
            activeTooltipEl.setAttribute('role', 'tooltip');
            document.body.appendChild(activeTooltipEl);
        }

        currentTargetEl = targetEl;
        const pos = config.position || 'right';
        activeTooltipEl.className = `p-tooltip p-component p-tooltip-${pos} ${config.class || ''}`;
        if (!config.autoHide) {
            activeTooltipEl.classList.add('p-tooltip-interactive');
        }

        if (config.escape) {
            activeTooltipEl.innerHTML = `
                <div class="p-tooltip-arrow"></div>
                <div class="p-tooltip-text">${escapeHtml(config.value)}</div>
            `;
        } else {
            activeTooltipEl.innerHTML = `
                <div class="p-tooltip-arrow"></div>
                <div class="p-tooltip-text">${config.value}</div>
            `;
        }

        positionTooltip(activeTooltipEl, targetEl, pos);
        activeTooltipEl.classList.add('p-tooltip-active');
    };

    if (config.showDelay && config.showDelay > 0) {
        showTimeoutId = setTimeout(triggerShow, config.showDelay);
    } else {
        triggerShow();
    }
}

function hideActiveTooltip(delay: number = 0) {
    if (showTimeoutId) {
        clearTimeout(showTimeoutId);
        showTimeoutId = null;
    }

    if (hideTimeoutId) {
        clearTimeout(hideTimeoutId);
        hideTimeoutId = null;
    }

    const triggerHide = () => {
        if (activeTooltipEl) {
            activeTooltipEl.classList.remove('p-tooltip-active');
            currentTargetEl = null;
        }
    };

    if (delay > 0) {
        hideTimeoutId = setTimeout(triggerHide, delay);
    } else {
        triggerHide();
    }
}

function escapeHtml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

export function initGlobalTooltipDelegation() {
    if (globalTooltipDelegationBound || typeof document === 'undefined') return;
    globalTooltipDelegationBound = true;

    injectIslandStyle('tooltip', TOOLTIP_CSS);

    // Mouseover / Mouseout
    document.addEventListener('mouseover', (e) => {
        const target = (e.target as HTMLElement).closest<HTMLElement>('[p-tooltip], [v-tooltip], [data-tooltip], [l-tooltip], [data-tooltip-target]');
        if (target) {
            const config = parseTooltipConfig(target);
            if (config && (config.event === 'hover' || config.event === 'both' || !config.event)) {
                showTooltipForElement(target, config);
            }
        }
    });

    document.addEventListener('mouseout', (e) => {
        const target = (e.target as HTMLElement).closest<HTMLElement>('[p-tooltip], [v-tooltip], [data-tooltip], [l-tooltip], [data-tooltip-target]');
        if (target && target === currentTargetEl) {
            const config = parseTooltipConfig(target);
            hideActiveTooltip(config?.hideDelay || 0);
        }
    });

    // Focusin / Focusout
    document.addEventListener('focusin', (e) => {
        const target = (e.target as HTMLElement).closest<HTMLElement>('[p-tooltip], [v-tooltip], [data-tooltip], [l-tooltip], [data-tooltip-target]');
        if (target) {
            const config = parseTooltipConfig(target);
            if (config && (config.event === 'focus' || config.event === 'both')) {
                showTooltipForElement(target, config);
            }
        }
    });

    document.addEventListener('focusout', (e) => {
        const target = (e.target as HTMLElement).closest<HTMLElement>('[p-tooltip], [v-tooltip], [data-tooltip], [l-tooltip], [data-tooltip-target]');
        if (target && target === currentTargetEl) {
            const config = parseTooltipConfig(target);
            hideActiveTooltip(config?.hideDelay || 0);
        }
    });

    // Escape Key Handler
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && activeTooltipEl) {
            hideActiveTooltip(0);
        }
    });
}

export function bindTooltipDirectives(element: HTMLElement): void {
    initGlobalTooltipDelegation();
}

export default function TooltipDirectiveInit() {
    initGlobalTooltipDelegation();
}
