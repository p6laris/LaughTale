/**
 * LaughTale: Declarative Polling Directive (l-poll)
 * Automatically evaluates statements or triggers server fragment actions at fixed intervals.
 */

import { executeStatement, getNearestScope } from './reactivity';
import { registerDirectiveCleanup } from './lifecycle';

export function bindPollingDirectives(element: HTMLElement): void {
    const scope = getNearestScope(element);

    for (const attr of Array.from(element.attributes)) {
        if (attr.name.startsWith('l-poll')) {
            // Parse duration: l-poll.5s, l-poll.3000ms, l-poll.10s
            let intervalMs = 3000;
            const parts = attr.name.split('.');
            for (const part of parts) {
                if (part.endsWith('s') && !part.endsWith('ms')) {
                    const sec = parseFloat(part);
                    if (!isNaN(sec)) intervalMs = sec * 1000;
                } else if (part.endsWith('ms')) {
                    const ms = parseFloat(part);
                    if (!isNaN(ms)) intervalMs = ms;
                }
            }

            const stmt = attr.value;

            const runPoll = () => {
                // If element was removed from DOM, cancel polling
                if (!document.body.contains(element)) {
                    clearInterval(intervalId);
                    return;
                }

                if (stmt) {
                    const activeState = scope ? scope.state : {};
                    const context = {
                        $el: element,
                        $emit: (channel: string, payload: any) => {
                            window.dispatchEvent(new CustomEvent(`laughtale:${channel}`, { detail: payload, bubbles: true }));
                        }
                    };
                    executeStatement(stmt, activeState, context);
                } else {
                    // If element has l-get / l-post, dispatch action
                    element.dispatchEvent(new CustomEvent('laughtale:poll-trigger', { bubbles: true }));
                }
            };

            const intervalId = setInterval(runPoll, intervalMs);
            registerDirectiveCleanup(element, () => clearInterval(intervalId));
        }
    }
}
