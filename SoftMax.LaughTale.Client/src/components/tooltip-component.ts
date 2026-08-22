import { injectIslandStyle } from '../runtime/styles';

export interface TooltipProps {
    target: string;
    position?: 'top' | 'bottom' | 'left' | 'right';
    showDelay?: number;
    hideDelay?: number;
}

export default function TooltipIsland(container: HTMLElement, props: TooltipProps) {
    const targetSelector = props.target;
    const position = props.position || 'top';
    const showDelay = props.showDelay || 300;
    const hideDelay = props.hideDelay || 100;
    
    let showTimer: number | null = null;
    let hideTimer: number | null = null;
    let activeTarget: HTMLElement | null = null;

    const contentHtml = container.innerHTML;
    container.innerHTML = `

`;

    injectIslandStyle('tooltip', `
        .laughtale-tooltip {
            position: absolute;
            background: var(--p-surface-900);
            color: var(--p-surface-0);
            padding: 0.5rem 0.75rem;
            border-radius: var(--p-border-radius);
            font-size: 0.75rem;
            font-family: var(--p-font-family, inherit);
            pointer-events: none;
            z-index: 2000;
            opacity: 0;
            transition: opacity 150ms ease;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
        }
        [data-theme="dark"] .laughtale-tooltip {
            background: var(--p-surface-100);
            color: var(--p-text-color);
        }
        .laughtale-tooltip.visible {
            opacity: 1;
        }
        .tooltip-arrow {
            position: absolute;
            width: 0;
            height: 0;
            border-style: solid;
        }
        .tooltip-arrow.top {
            bottom: -4px;
            left: calc(50% - 4px);
            border-width: 4px 4px 0 4px;
            border-color: var(--p-surface-900) transparent transparent transparent;
        }
        [data-theme="dark"] .tooltip-arrow.top {
            border-color: var(--p-surface-100) transparent transparent transparent;
        }
    `);

    let tooltipEl: HTMLElement | null = null;

    function createTooltip() {
        if (!tooltipEl) {
            tooltipEl = document.createElement('div');
            tooltipEl.className = 'laughtale-tooltip';
            tooltipEl.innerHTML = `
<div class="tooltip-arrow ' + position + '"></div>
                <div class="tooltip-content">${contentHtml}</div>
`;
            document.body.appendChild(tooltipEl);
        }
    }

    function show(target: HTMLElement) {
        if (hideTimer) clearTimeout(hideTimer);
        activeTarget = target;
        
        showTimer = window.setTimeout(() => {
            createTooltip();
            if (tooltipEl && activeTarget) {
                const rect = activeTarget.getBoundingClientRect();
                if (position === 'top') {
                    tooltipEl.style.top = rect.top + window.scrollY - tooltipEl.offsetHeight - 8 + 'px';
                    tooltipEl.style.left = rect.left + window.scrollX + (rect.width / 2) - (tooltipEl.offsetWidth / 2) + 'px';
                }
                tooltipEl.classList.add('visible');
            }
        }, showDelay);
    }

    function hide() {
        if (showTimer) clearTimeout(showTimer);
        
        hideTimer = window.setTimeout(() => {
            if (tooltipEl) {
                tooltipEl.classList.remove('visible');
                setTimeout(() => {
                    if (tooltipEl && tooltipEl.parentNode) {
                        tooltipEl.parentNode.removeChild(tooltipEl);
                        tooltipEl = null;
                    }
                }, 150);
            }
        }, hideDelay);
    }

    const targets = document.querySelectorAll(targetSelector);
    targets.forEach(target => {
        target.addEventListener('mouseenter', () => show(target as HTMLElement));
        target.addEventListener('mouseleave', hide);
        target.addEventListener('focus', () => show(target as HTMLElement));
        target.addEventListener('blur', hide);
    });
}
