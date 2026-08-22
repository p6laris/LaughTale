/**
 * SoftMax.LaughTale: Viewport Intersection Directive (l-intersect, l-viewport)
 * Executes statements or toggles classes when element enters the viewport.
 */

import { executeStatement, getNearestScope } from './reactivity';

export function bindIntersectionDirectives(element: HTMLElement): void {
    const scope = getNearestScope(element);

    for (const attr of Array.from(element.attributes)) {
        if (attr.name === 'l-intersect' || attr.name.startsWith('l-intersect.') || attr.name === 'l-viewport') {
            const isOnce = attr.name.includes('.once');
            const isHalf = attr.name.includes('.half');
            const stmt = attr.value;

            const threshold = isHalf ? 0.5 : 0.1;

            const observer = new IntersectionObserver((entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        if (stmt) {
                            const activeState = scope ? scope.state : {};
                            const context = {
                                $event: entry,
                                $el: element,
                                $emit: (channel: string, payload: any) => {
                                    window.dispatchEvent(new CustomEvent(`laughtale:${channel}`, { detail: payload, bubbles: true }));
                                }
                            };
                            executeStatement(stmt, activeState, context);
                        }

                        // Also dispatch viewport event
                        element.dispatchEvent(new CustomEvent('laughtale:intersect', { bubbles: true, detail: entry }));

                        if (isOnce) {
                            observer.disconnect();
                        }
                    }
                }
            }, { threshold });

            observer.observe(element);
        }
    }
}
