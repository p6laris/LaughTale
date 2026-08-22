/**
 * SoftMax.LaughTale: Declarative Badge Directive (l-badge)
 * Attaches Aura status badges or dots directly to any button, avatar, or icon.
 */

export function bindBadgeDirectives(element: HTMLElement): void {
    for (const attr of Array.from(element.attributes)) {
        if (attr.name === 'l-badge' || attr.name.startsWith('l-badge.')) {
            const isDot = attr.name.includes('.dot');
            const value = attr.value;

            let severity = 'danger';
            if (attr.name.includes('.success')) severity = 'success';
            else if (attr.name.includes('.warning')) severity = 'warning';
            else if (attr.name.includes('.info')) severity = 'info';
            else if (attr.name.includes('.slate') || attr.name.includes('.secondary')) severity = 'slate';

            // Ensure parent has position relative for proper anchor positioning
            const compStyle = window.getComputedStyle(element);
            if (compStyle.position === 'static') {
                element.style.position = 'relative';
            }

            const badge = document.createElement('span');
            badge.className = `aura-directive-badge badge-${severity}`;

            let bg = 'var(--p-red-500, #ef4444)';
            let color = '#ffffff';

            if (severity === 'success') bg = 'var(--p-emerald-500, #10b981)';
            else if (severity === 'warning') bg = 'var(--p-amber-500, #f59e0b)';
            else if (severity === 'info') bg = 'var(--p-blue-500, #3b82f6)';
            else if (severity === 'slate') { bg = 'var(--p-surface-600, #475569)'; color = '#ffffff'; }

            if (isDot) {
                badge.style.cssText = `
                    position: absolute;
                    top: -2px;
                    right: -2px;
                    width: 8px;
                    height: 8px;
                    background: ${bg};
                    border-radius: 50%;
                    border: 2px solid var(--p-surface-0, #ffffff);
                    pointer-events: none;
                `;
            } else {
                badge.textContent = value || '';
                badge.style.cssText = `
                    position: absolute;
                    top: -6px;
                    right: -6px;
                    min-width: 18px;
                    height: 18px;
                    line-height: 18px;
                    padding: 0 5px;
                    font-size: 0.6875rem;
                    font-weight: 700;
                    text-align: center;
                    background: ${bg};
                    color: ${color};
                    border-radius: 9999px;
                    border: 2px solid var(--p-surface-0, #ffffff);
                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
                    pointer-events: none;
                `;
            }

            element.appendChild(badge);
        }
    }
}
