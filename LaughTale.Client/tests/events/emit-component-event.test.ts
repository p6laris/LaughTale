import { describe, it } from 'node:test';
import assert from 'node:assert';
import '../setup';
import { emitComponentEvent, emitIslandEvent, EVENT_PREFIX, EVENT_ALIASES } from '../../src/runtime/events';

describe('emitComponentEvent Contract & Runtime Suite (T012)', () => {
    it('constructs canonical name laughtale:<component>:<event> and dispatches on target', () => {
        const target = document.createElement('div');
        let receivedEvent: CustomEvent | null = null;

        target.addEventListener('laughtale:button:click', (e) => {
            receivedEvent = e as CustomEvent;
        });

        emitComponentEvent(target, 'button', 'click', { id: 42 });

        assert.ok(receivedEvent, 'Canonical event should be received');
        assert.strictEqual((receivedEvent as any).type, 'laughtale:button:click');
        assert.deepStrictEqual((receivedEvent as any).detail, { id: 42 });
    });

    it('sets bubbles: true by default and respects options.bubbles', () => {
        const parent = document.createElement('div');
        const child = document.createElement('button');
        parent.appendChild(child);

        let parentReceived = false;
        parent.addEventListener('laughtale:test-comp:test-action', () => {
            parentReceived = true;
        });

        // Default bubbles: true
        emitComponentEvent(child, 'test-comp', 'test-action', {});
        assert.strictEqual(parentReceived, true, 'Default bubbles: true should bubble to parent');

        // Custom bubbles: false
        parentReceived = false;
        let childReceived = false;
        child.addEventListener('laughtale:test-comp:no-bubble', () => {
            childReceived = true;
        });
        parent.addEventListener('laughtale:test-comp:no-bubble', () => {
            parentReceived = true;
        });

        emitComponentEvent(child, 'test-comp', 'no-bubble', {}, { bubbles: false });
        assert.strictEqual(childReceived, true, 'Child received non-bubbling event');
        assert.strictEqual(parentReceived, false, 'Parent must not receive non-bubbling event');
    });

    it('dispatches declared aliases after the canonical event carrying alias marker', () => {
        const target = document.createElement('div');
        const eventOrder: string[] = [];
        let aliasMarkerReceived = false;

        target.addEventListener('laughtale:slider:change', () => {
            eventOrder.push('canonical');
        });
        target.addEventListener('slider:change', (e: any) => {
            eventOrder.push('alias-slider-change');
            if (e.detail?.__ltAlias) aliasMarkerReceived = true;
        });
        target.addEventListener('change', (e: any) => {
            eventOrder.push('alias-change');
        });

        emitComponentEvent(target, 'slider', 'change', { value: 50 });

        assert.strictEqual(eventOrder[0], 'canonical', 'Canonical event must dispatch first');
        assert.ok(eventOrder.includes('alias-slider-change'), 'slider:change alias must dispatch');
        assert.ok(eventOrder.includes('alias-change'), 'change alias must dispatch');
        assert.strictEqual(aliasMarkerReceived, true, 'Alias detail must carry __ltAlias marker');
    });

    it('a handler bound to the canonical name fires exactly once', () => {
        const target = document.createElement('div');
        let count = 0;

        target.addEventListener('laughtale:toggle-switch:change', () => {
            count++;
        });

        emitComponentEvent(target, 'toggle-switch', 'change', { checked: true, value: true });

        assert.strictEqual(count, 1, 'Canonical handler must run exactly once even with 3 aliases');
    });

    it('emits deprecation warning once per alias name per session', () => {
        const originalWarn = console.warn;
        const warnings: string[] = [];
        console.warn = (...args: any[]) => {
            warnings.push(args.join(' '));
        };

        try {
            const target = document.createElement('div');
            // First emit for rating:change
            emitComponentEvent(target, 'rating', 'change', { value: 5 });
            const warningsCount1 = warnings.filter(w => w.includes('rating:change')).length;
            assert.strictEqual(warningsCount1, 1, 'Should warn once for rating:change on first occurrence');

            // Second emit for rating:change
            emitComponentEvent(target, 'rating', 'change', { value: 4 });
            const warningsCount2 = warnings.filter(w => w.includes('rating:change')).length;
            assert.strictEqual(warningsCount2, 1, 'Should NOT warn a second time for rating:change in same session');
        } finally {
            console.warn = originalWarn;
        }
    });

    it('emitIslandEvent uses laughtale:island:<event> prefix on window', () => {
        let windowEventReceived: CustomEvent | null = null;
        const handler = (e: Event) => {
            windowEventReceived = e as CustomEvent;
        };

        window.addEventListener('laughtale:island:test-topic', handler);

        emitIslandEvent('test-topic', { msg: 'hello' });

        assert.ok(windowEventReceived, 'window should receive laughtale:island:test-topic');
        assert.deepStrictEqual((windowEventReceived as any).detail, { msg: 'hello' });

        window.removeEventListener('laughtale:island:test-topic', handler);
    });
});
