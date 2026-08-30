/**
 * LaughTale: Click Outside Directive (l-outside, l-click-outside)
 * Executes expression when a click occurs outside the target container.
 */

import { executeStatement, getNearestScope } from './reactivity';

export function bindOutsideClickDirectives(element: HTMLElement): void {
    const scope = getNearestScope(element);

    for (const attr of Array.from(element.attributes)) {
        if (attr.name === 'l-outside' || attr.name === 'l-click-outside') {
            const stmt = attr.value;

            document.addEventListener('click', (e: MouseEvent) => {
                const target = e.target as Node;
                if (!element.contains(target)) {
                    const activeState = scope ? scope.state : {};
                    const context = {
                        $event: e,
                        $el: element,
                        $emit: (channel: string, payload: any) => {
                            window.dispatchEvent(new CustomEvent(`laughtale:${channel}`, { detail: payload, bubbles: true }));
                        }
                    };
                    executeStatement(stmt, activeState, context);
                }
            });
        }
    }
}
