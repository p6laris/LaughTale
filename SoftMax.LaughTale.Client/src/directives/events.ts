/**
 * SoftMax.LaughTale: Declarative Event Listeners and Event Bus Dispatchers
 */

import { executeStatement, getNearestScope } from './reactivity';

export function bindElementEvents(element: HTMLElement): void {
    const scope = getNearestScope(element);

    for (const attr of Array.from(element.attributes)) {
        // 1. Event Handlers: l-on:click="...", l-on:keydown.enter="..."
        if (attr.name.startsWith('l-on:')) {
            const rawEvent = attr.name.slice(5);
            const [eventName, ...modifiers] = rawEvent.split('.');
            const stmt = attr.value;

            element.addEventListener(eventName, (e: Event) => {
                // Handle modifiers: .prevent, .stop, .enter
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
            });
        }

        // 2. Global Event Listener: l-listen:channelName="stmt"
        if (attr.name.startsWith('l-listen:')) {
            const channel = attr.name.slice(9);
            const stmt = attr.value;

            window.addEventListener(`laughtale:${channel}`, (e: any) => {
                const context = {
                    $event: e.detail,
                    $el: element
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
