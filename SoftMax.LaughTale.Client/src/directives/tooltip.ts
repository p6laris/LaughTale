/**
 * SoftMax.LaughTale: Declarative Aura Tooltip Directive (l-tooltip)
 * Lightweight, zero-dependency popover tooltip with smooth positioning and fade animations.
 */

export function bindTooltipDirectives(element: HTMLElement): void {
    for (const attr of Array.from(element.attributes)) {
        if (attr.name === 'l-tooltip' || attr.name.startsWith('l-tooltip.')) {
            const text = attr.value;
            if (!text) return;

            let position = 'top';
            if (attr.name.includes('.bottom')) position = 'bottom';
            else if (attr.name.includes('.left')) position = 'left';
            else if (attr.name.includes('.right')) position = 'right';

            let tooltipEl: HTMLElement | null = null;

            const showTooltip = () => {
                if (tooltipEl) return;

                tooltipEl = document.createElement('div');
                tooltipEl.className = 'aura-directive-tooltip';
                tooltipEl.textContent = text;
                tooltipEl.style.cssText = `
                    position: fixed;
                    z-index: 99999;
                    background: var(--p-surface-900, #1e293b);
                    color: var(--p-surface-0, #ffffff);
                    font-size: 0.75rem;
                    font-weight: 500;
                    padding: 0.35rem 0.65rem;
                    border-radius: 6px;
                    pointer-events: none;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    opacity: 0;
                    transform: scale(0.95);
                    transition: opacity 150ms ease, transform 150ms ease;
                    white-space: nowrap;
                `;

                document.body.appendChild(tooltipEl);

                // Calculate bounding rect
                const rect = element.getBoundingClientRect();
                const tooltipRect = tooltipEl.getBoundingClientRect();

                let top = 0;
                let left = 0;

                switch (position) {
                    case 'top':
                        top = rect.top - tooltipRect.height - 8;
                        left = rect.left + (rect.width - tooltipRect.width) / 2;
                        break;
                    case 'bottom':
                        top = rect.bottom + 8;
                        left = rect.left + (rect.width - tooltipRect.width) / 2;
                        break;
                    case 'left':
                        top = rect.top + (rect.height - tooltipRect.height) / 2;
                        left = rect.left - tooltipRect.width - 8;
                        break;
                    case 'right':
                        top = rect.top + (rect.height - tooltipRect.height) / 2;
                        left = rect.right + 8;
                        break;
                }

                tooltipEl.style.top = `${Math.max(4, top)}px`;
                tooltipEl.style.left = `${Math.max(4, left)}px`;

                requestAnimationFrame(() => {
                    if (tooltipEl) {
                        tooltipEl.style.opacity = '1';
                        tooltipEl.style.transform = 'scale(1)';
                    }
                });
            };

            const hideTooltip = () => {
                if (!tooltipEl) return;
                const el = tooltipEl;
                tooltipEl = null;
                el.style.opacity = '0';
                el.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    if (el.parentNode) el.parentNode.removeChild(el);
                }, 150);
            };

            element.addEventListener('mouseenter', showTooltip);
            element.addEventListener('mouseleave', hideTooltip);
            element.addEventListener('focus', showTooltip);
            element.addEventListener('blur', hideTooltip);
        }
    }
}
