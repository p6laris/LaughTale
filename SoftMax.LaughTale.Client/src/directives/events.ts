/**
 * SoftMax.LaughTale: Declarative Event Listeners and Event Bus Dispatchers
 * Supports .prevent, .stop, .enter, .escape, .debounce.<ms>, .throttle.<ms>, .once, .window, .document
 */

import { executeStatement, getNearestScope } from './reactivity';

export function bindElementEvents(element: HTMLElement): void {
    const scope = getNearestScope(element);

    for (const attr of Array.from(element.attributes)) {
        // 1. Event Handlers: l-on:click="...", l-on:keydown.enter="...", l-on:input.debounce.300ms="..."
        if (attr.name.startsWith('l-on:')) {
            const rawEvent = attr.name.slice(5);
            const [eventName, ...modifiers] = rawEvent.split('.');
            const stmt = attr.value;

            // Debounce check
            let debounceMs = 0;
            let throttleMs = 0;

            for (let i = 0; i < modifiers.length; i++) {
                if (modifiers[i] === 'debounce') {
                    const next = modifiers[i + 1];
                    debounceMs = next ? parseDurationMs(next) : 250;
                } else if (modifiers[i] === 'throttle') {
                    const next = modifiers[i + 1];
                    throttleMs = next ? parseDurationMs(next) : 250;
                }
            }

            let timer: any = null;
            let lastExecution = 0;

            const executeHandler = (e: Event) => {
                // Handle standard modifiers
                if (modifiers.includes('prevent')) e.preventDefault();
                if (modifiers.includes('stop')) e.stopPropagation();
                if (modifiers.includes('enter') && (e as KeyboardEvent).key !== 'Enter') return;
                if (modifiers.includes('escape') && (e as KeyboardEvent).key !== 'Escape') return;

                const emitFn = (channel: string, payload: any) => {
                    window.dispatchEvent(new CustomEvent(`laughtale:${channel}`, { detail: payload, bubbles: true }));
                };

                const context = {
                    $event: e,
                    $el: element,
                    $emit: emitFn
                };

                const activeState = scope ? scope.state : {};
                executeStatement(stmt, activeState, context);
            };

            const handler = (e: Event) => {
                if (debounceMs > 0) {
                    clearTimeout(timer);
                    timer = setTimeout(() => executeHandler(e), debounceMs);
                } else if (throttleMs > 0) {
                    const now = Date.now();
                    if (now - lastExecution >= throttleMs) {
                        lastExecution = now;
                        executeHandler(e);
                    }
                } else {
                    executeHandler(e);
                }
            };

            const isWindow = modifiers.includes('window');
            const isDocument = modifiers.includes('document');
            const isOnce = modifiers.includes('once');

            const target = isWindow ? window : isDocument ? document : element;
            target.addEventListener(eventName, handler, { once: isOnce });
        }

        // 2. Global Event Listener: l-listen:channelName="stmt"
        if (attr.name.startsWith('l-listen:')) {
            const channel = attr.name.slice(9);
            const stmt = attr.value;

            window.addEventListener(`laughtale:${channel}`, (e: any) => {
                const context = {
                    $event: e.detail,
                    $el: element,
                    $emit: (c: string, p: any) => {
                        window.dispatchEvent(new CustomEvent(`laughtale:${c}`, { detail: p, bubbles: true }));
                    }
                };
                const activeState = scope ? scope.state : {};
                executeStatement(stmt, activeState, context);
            });
        }

        // 3. Quick Emitter on Click: l-emit="channelName"
        if (attr.name === 'l-emit') {
            const channel = attr.value;
            element.addEventListener('click', () => {
                window.dispatchEvent(new CustomEvent(`laughtale:${channel}`, { bubbles: true }));
            });
        }
    }
}

function parseDurationMs(spec: string): number {
    if (spec.endsWith('ms')) return parseFloat(spec) || 250;
    if (spec.endsWith('s')) return (parseFloat(spec) || 0.25) * 1000;
    return parseFloat(spec) || 250;
}
