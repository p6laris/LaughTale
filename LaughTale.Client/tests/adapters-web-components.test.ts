import './setup.ts';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createWebComponentIsland } from '../src/adapters/web-components.ts';

/**
 * A minimal real custom element - registered once per tag name (customElements.define throws on
 * re-registration), so each test that needs a fresh element class picks its own unique tag name.
 */
function defineTestElement(tagName: string) {
    if (customElements.get(tagName)) return;

    class TestWidget extends HTMLElement {
        private _title = '';

        get title2() { return this._title; }
        set title2(value: string) {
            this._title = value;
            this.render();
        }

        connectedCallback() {
            this.render();
        }

        render() {
            this.textContent = `Widget: ${this._title}`;
        }
    }

    customElements.define(tagName, TestWidget);
}

describe('LaughTale Web Components Adapter Suite (ROADMAP.v5.md Part D "New adapters")', () => {
    it('mounts a real custom element inside the container and sets properties', () => {
        defineTestElement('lt-test-mount');
        const container = document.createElement('div');

        const mount = createWebComponentIsland('lt-test-mount');
        mount(container, { title2: 'Hello' }, undefined);

        const el = container.querySelector('lt-test-mount');
        assert.ok(el, 'the custom element must be appended into the container');
        assert.equal(container.textContent, 'Widget: Hello');
    });

    it('accepts the (tagName, options) two-argument form matching the AdapterFactory registry shape', () => {
        defineTestElement('lt-test-two-arg');
        const container = document.createElement('div');

        const mount = createWebComponentIsland('lt-test-two-arg', {});
        mount(container, { title2: 'Two Arg' }, undefined);

        assert.equal(container.textContent, 'Widget: Two Arg');
    });

    it('update() reassigns properties on the SAME element instance, not a remount', () => {
        defineTestElement('lt-test-update');
        const container = document.createElement('div');

        const mount = createWebComponentIsland('lt-test-update');
        const result: any = mount(container, { title2: 'v1' }, undefined);
        const elBefore = container.querySelector('lt-test-update');
        assert.equal(container.textContent, 'Widget: v1');

        result.update({ title2: 'v2' });

        const elAfter = container.querySelector('lt-test-update');
        assert.equal(elAfter, elBefore, 'update() must reuse the same element instance, not create a new one');
        assert.equal(container.textContent, 'Widget: v2');
    });

    it('unmount() (via IslandContext signal) removes the element from the DOM', () => {
        defineTestElement('lt-test-unmount');
        const container = document.createElement('div');
        const abortController = new AbortController();
        const ctx = {
            signal: abortController.signal,
            container,
            name: 'WebComponentCard',
            locale: 'en',
            dir: 'ltr' as const,
            onCleanup: (fn: () => void) => {
                abortController.signal.addEventListener('abort', fn);
            }
        };

        const mount = createWebComponentIsland('lt-test-unmount');
        mount(container, { title2: 'Bye' }, ctx as any);
        assert.ok(container.querySelector('lt-test-unmount'));

        abortController.abort();

        assert.equal(container.querySelector('lt-test-unmount'), null, 'the element must be removed on unmount');
    });

    it('hydration: adopts an already-present element instead of creating a second one', () => {
        defineTestElement('lt-test-hydrate');
        const container = document.createElement('div');
        const existing = document.createElement('lt-test-hydrate');
        container.appendChild(existing);

        const mount = createWebComponentIsland('lt-test-hydrate');
        mount(container, { title2: 'Adopted' }, undefined);

        const elements = container.querySelectorAll('lt-test-hydrate');
        assert.equal(elements.length, 1, 'hydration must not create a duplicate element');
        assert.equal(elements[0], existing, 'the existing element must be reused, not replaced');
    });

    it('sets configured props as string attributes instead of properties', () => {
        defineTestElement('lt-test-attr');
        const container = document.createElement('div');

        const mount = createWebComponentIsland('lt-test-attr', { attributeProps: ['data-variant'] });
        mount(container, { 'data-variant': 'primary' } as any, undefined);

        const el = container.querySelector('lt-test-attr')!;
        assert.equal(el.getAttribute('data-variant'), 'primary');
    });

    it('removes a boolean-false/null attribute prop rather than stringifying it', () => {
        defineTestElement('lt-test-attr-remove');
        const container = document.createElement('div');

        const mount = createWebComponentIsland('lt-test-attr-remove', { attributeProps: ['disabled'] });
        const el0 = document.createElement('lt-test-attr-remove');
        el0.setAttribute('disabled', '');
        container.appendChild(el0);

        mount(container, { disabled: false } as any, undefined);

        assert.equal(el0.hasAttribute('disabled'), false);
    });

    it('forwards .island-slot content directly as the element\'s light-DOM children (ROADMAP.v5.md Part D)', () => {
        defineTestElement('lt-test-slot');
        const container = document.createElement('div');
        container.innerHTML = '<div data-slot="default" class="island-slot"><span id="wc-slotted">Hi</span></div>';

        const mount = createWebComponentIsland('lt-test-slot');
        mount(container, {}, undefined);

        const el = container.querySelector('lt-test-slot')!;
        const slotted = el.querySelector('#wc-slotted');
        assert.ok(slotted, 'the slotted content must be present as a light-DOM child of the custom element');
        assert.equal(container.querySelector('.island-slot'), null, 'the .island-slot wrapper div itself must be removed');
    });

    it('is resolvable through the named adapter registry as "web-components" (ROADMAP.v5.md Part G/L)', async () => {
        const { getAdapter } = await import('../src/adapters/registry.ts');
        await import('../src/adapters/index.ts');

        const factory = getAdapter('web-components');
        assert.ok(factory, 'the web-components adapter must be registered under that name');
    });
});
