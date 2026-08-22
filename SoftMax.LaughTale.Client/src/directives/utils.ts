/**
 * SoftMax.LaughTale: Utility Directives (l-show, l-hide, l-copy, l-toggle)
 */

import { evaluateExpression, getNearestScope } from './reactivity';

export function bindUtilityDirectives(element: HTMLElement): void {
    const scope = getNearestScope(element);

    // 1. Conditional Visibility: l-show="expr", l-hide="expr"
    if (element.hasAttribute('l-show')) {
        const expr = element.getAttribute('l-show')!;
        const originalDisplay = element.style.display || '';
        const update = () => {
            const state = scope ? scope.state : {};
            const isVisible = Boolean(evaluateExpression(expr, state));
            element.style.display = isVisible ? originalDisplay : 'none';
        };
        if (scope) scope.listeners.add(update);
        update();
    }

    if (element.hasAttribute('l-hide')) {
        const expr = element.getAttribute('l-hide')!;
        const originalDisplay = element.style.display || '';
        const update = () => {
            const state = scope ? scope.state : {};
            const isHidden = Boolean(evaluateExpression(expr, state));
            element.style.display = isHidden ? 'none' : originalDisplay;
        };
        if (scope) scope.listeners.add(update);
        update();
    }

    // 2. Clipboard Copy: l-copy="#targetSelector"
    if (element.hasAttribute('l-copy')) {
        const selector = element.getAttribute('l-copy')!;
        const feedback = element.getAttribute('l-feedback') || 'Copied!';
        const originalHtml = element.innerHTML;

        element.addEventListener('click', async () => {
            const target = document.querySelector(selector);
            const textToCopy = target ? (target as HTMLInputElement).value || target.textContent || '' : selector;

            try {
                await navigator.clipboard.writeText(textToCopy.trim());
                element.innerHTML = feedback;
                setTimeout(() => { element.innerHTML = originalHtml; }, 2000);
            } catch (err) {
                console.error('[SoftMax.LaughTale] Failed to copy to clipboard:', err);
            }
        });
    }

    // 3. Class Toggle: l-toggle="#targetSelector" l-toggle-class="active"
    if (element.hasAttribute('l-toggle')) {
        const selector = element.getAttribute('l-toggle')!;
        const className = element.getAttribute('l-toggle-class') || 'open';

        element.addEventListener('click', (e) => {
            e.stopPropagation();
            const target = document.querySelector(selector);
            if (target) {
                target.classList.toggle(className);
            }
        });
    }
}
