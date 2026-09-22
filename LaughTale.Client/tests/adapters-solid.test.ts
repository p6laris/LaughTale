/**
 * LaughTale: SolidJS Adapter Test Suite (ROADMAP.v5.md Part D "New adapters").
 *
 * solid-js is a real devDependency (see package.json) specifically so these tests exercise the
 * actual framework-mount/update code path, not just the "package not found" fallback branch -
 * matching adapters.test.ts's own precedent for react/vue/preact.
 *
 * solid-js's package.json "exports" map selects a client-only-API-throwing SSR stub under
 * Node's default resolution condition set (there is no separate "solid-js/server" package the
 * way Vue splits `@vue/server-renderer` out - solid-js gates it via package.json "exports"
 * conditions on the SAME "solid-js/web" specifier instead). A real end-user app never hits this -
 * their own bundler resolves "browser" conditions for a client build - but this Node-based test
 * runner otherwise would. `run-tests.mjs` passes `--conditions=browser` to the actual `node --test`
 * invocation for exactly this reason; running this single file directly via `tsx` needs the same
 * flag (`tsx --conditions=browser --test ...`) to reproduce that condition.
 */

import './setup.ts';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createSolidIsland } from '../src/index.ts';

const Solid = await import('solid-js');

async function waitFor(check: () => boolean, timeoutMs = 2000, intervalMs = 10): Promise<void> {
    const start = Date.now();
    while (!check()) {
        if (Date.now() - start > timeoutMs) {
            throw new Error(`waitFor: condition not met within ${timeoutMs}ms`);
        }
        await new Promise(resolve => setTimeout(resolve, intervalMs));
    }
}

describe('LaughTale Solid Adapter Suite', () => {
    it('createSolidIsland: mounts a real Solid component and unmounts via IslandContext signal', async () => {
        const container = document.createElement('div');
        const abortController = new AbortController();
        const ctx = {
            signal: abortController.signal,
            container,
            name: 'SolidCard',
            locale: 'en',
            dir: 'ltr' as const,
            onCleanup: (fn: () => void) => {
                abortController.signal.addEventListener('abort', fn);
            }
        };

        function Widget(props: any) {
            const span = document.createElement('span');
            span.id = 'stable';
            Solid.createEffect(() => {
                span.textContent = `Solid ${props.title}`;
            });
            return span;
        }

        const mount = createSolidIsland(Widget);
        const result: any = await mount(container, { title: 'Signals' }, ctx);
        await waitFor(() => container.textContent === 'Solid Signals');

        assert.equal(typeof result.unmount, 'function', 'adapter must return an unmount fn');
        assert.equal(typeof result.update, 'function', 'adapter must return an update fn');
        assert.equal(container.textContent, 'Solid Signals');

        abortController.abort();
        await waitFor(() => container.childNodes.length === 0);

        assert.equal(container.childNodes.length, 0, 'Solid dispose() must clear the container');
    });

    it('createSolidIsland: update() patches the existing DOM node via reactive props, without remount', async () => {
        const container = document.createElement('div');
        const ctx = {
            signal: new AbortController().signal,
            container,
            name: 'SolidCard',
            locale: 'en',
            dir: 'ltr' as const,
            onCleanup: () => {}
        };

        function Widget(props: any) {
            const span = document.createElement('span');
            span.id = 'stable';
            Solid.createEffect(() => {
                span.textContent = `Solid ${props.title}`;
            });
            return span;
        }

        const mount = createSolidIsland(Widget);
        const result: any = await mount(container, { title: 'Reactor' }, ctx);
        await waitFor(() => container.textContent === 'Solid Reactor');

        // Node-identity proof matching react/vue/preact's own tests: a secretly-remounted
        // component would produce a brand-new <span>, not patch this one in place. Solid has no
        // vdom to diff - the ONLY way this can pass is if the effect inside Widget re-ran because
        // its own read of `props.title` was reactive (createReactiveProps's whole point).
        const spanBefore = container.querySelector('#stable');
        assert.ok(spanBefore, 'span should exist after initial mount');

        await result.update({ title: 'Updated' });
        await waitFor(() => container.textContent === 'Solid Updated');

        assert.equal(container.textContent, 'Solid Updated');
        const spanAfter = container.querySelector('#stable');
        assert.equal(spanAfter, spanBefore, 'update() must patch the existing DOM node in place, not remount');
    });

    it('createSolidIsland: forwards .island-slot content into a slot host, and the live node survives (ROADMAP.v5.md Part D, close adapter gaps)', async () => {
        const container = document.createElement('div');
        container.innerHTML = '<div data-slot="default" class="island-slot"><span id="solid-slotted">Hi</span></div>';

        function Widget() {
            const div = document.createElement('div');
            div.id = 'wrapper';
            return div;
        }

        const mount = createSolidIsland(Widget);
        await mount(container, {}, undefined);
        await waitFor(() => !!container.querySelector('#solid-slotted'));

        const slotted = container.querySelector('#solid-slotted');
        assert.ok(slotted, 'the slotted content must be present in the mounted output');
        assert.ok(container.contains(slotted), 'the slotted node must be reattached inside the mounted container, not left orphaned in a detached fragment');
        assert.equal(container.querySelector('.island-slot'), null, 'the .island-slot wrapper div itself must be removed');
    });

    it('createSolidIsland: reactive props Proxy reflects added/removed keys across update()', async () => {
        const container = document.createElement('div');
        const seenKeys: string[][] = [];

        function Widget(props: any) {
            const span = document.createElement('span');
            Solid.createEffect(() => {
                seenKeys.push(Object.keys(props));
                span.textContent = JSON.stringify({ ...props });
            });
            return span;
        }

        const mount = createSolidIsland(Widget);
        const result: any = await mount(container, { a: 1 }, undefined);
        await waitFor(() => container.textContent === '{"a":1}');

        await result.update({ b: 2 });
        await waitFor(() => container.textContent === '{"b":2}');

        assert.equal(container.textContent, '{"b":2}', 'update() must fully replace the props shape, not merge it');
    });
});
