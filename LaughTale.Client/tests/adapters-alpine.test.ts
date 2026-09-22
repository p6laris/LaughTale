/**
 * LaughTale: Alpine.js Adapter Test Suite (ROADMAP.v5.md Part D "New adapters").
 *
 * alpinejs is a real devDependency (see package.json) specifically so these tests exercise the
 * actual `Alpine.start()`/`initTree()`/`$data()`/`destroyTree()` code path, matching
 * adapters.test.ts's own precedent for react/vue/preact/solid.
 */

import './setup.ts';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createAlpineIsland } from '../src/index.ts';

const AlpineMod: any = await import('alpinejs');
const Alpine = AlpineMod.Alpine || AlpineMod.default;

describe('LaughTale Alpine Adapter Suite', () => {
    it('createAlpineIsland: initializes real Alpine directives already present in the container, and unmounts via IslandContext signal', async () => {
        const container = document.createElement('div');
        container.innerHTML = '<span id="stable" x-text="label"></span>';

        const abortController = new AbortController();
        const ctx = {
            signal: abortController.signal,
            container,
            name: 'AlpineCard',
            locale: 'en',
            dir: 'ltr' as const,
            onCleanup: (fn: () => void) => {
                abortController.signal.addEventListener('abort', fn);
            }
        };

        const mount = createAlpineIsland((props: any) => ({ label: props.title }));
        const result: any = await mount(container, { title: 'Directives' }, ctx);
        await Alpine.nextTick();

        assert.equal(typeof result.unmount, 'function', 'adapter must return an unmount fn');
        assert.equal(typeof result.update, 'function', 'adapter must return an update fn');
        assert.equal(container.querySelector('#stable')!.textContent, 'Directives');

        abortController.abort();
        await Alpine.nextTick();

        assert.equal((Alpine.$data(container) as any)?.label, undefined, 'aborting the IslandContext signal must destroy the Alpine scope');
    });

    it('createAlpineIsland: sets x-data from the data factory + props when the container has none, and real x-on directives fire against it', async () => {
        const container = document.createElement('div');
        container.innerHTML = '<span id="count-display" x-text="count"></span><button id="inc" x-on:click="increment()">+</button>';

        const mount = createAlpineIsland((props: any) => ({
            count: props.initialCount,
            increment() { (this as any).count++; }
        }));

        await mount(container, { initialCount: 5 }, undefined);
        await Alpine.nextTick();

        assert.equal(container.getAttribute('x-data')?.startsWith('__lt_alpine_'), true, 'adapter must drive x-data itself when none is already present');
        assert.equal(container.querySelector('#count-display')!.textContent, '5');

        (container.querySelector('#inc') as HTMLElement).click();
        await Alpine.nextTick();

        assert.equal(container.querySelector('#count-display')!.textContent, '6', 'a real x-on:click directive must invoke the reactive method bound by Alpine.initTree');
    });

    it('createAlpineIsland: update() mutates the live Alpine.$data(container) object in place, patching bound directives without remount', async () => {
        const container = document.createElement('div');
        container.innerHTML = '<span id="stable" x-text="count"></span>';

        const mount = createAlpineIsland((props: any) => ({ count: props.count }));
        const result: any = await mount(container, { count: 1 }, undefined);
        await Alpine.nextTick();
        assert.equal(container.querySelector('#stable')!.textContent, '1');

        // Node-identity proof matching every other adapter's own test: Alpine never remounts, it
        // binds to existing DOM - the same <span> must still be there after update().
        const spanBefore = container.querySelector('#stable');

        await result.update({ count: 42 });
        await Alpine.nextTick();

        assert.equal(container.querySelector('#stable')!.textContent, '42');
        const spanAfter = container.querySelector('#stable');
        assert.equal(spanAfter, spanBefore, 'update() must patch the existing DOM node in place, not remount');
    });

    it('createAlpineIsland: never touches .island-slot content - Alpine enhances existing markup, it does not wipe it', async () => {
        const container = document.createElement('div');
        container.innerHTML = '<div data-slot="default" class="island-slot"><span id="alpine-slotted">Hi</span></div><span id="stable" x-text="label"></span>';

        const mount = createAlpineIsland((props: any) => ({ label: props.title }));
        await mount(container, { title: 'Untouched' }, undefined);
        await Alpine.nextTick();

        const slotted = container.querySelector('#alpine-slotted');
        assert.ok(slotted, 'slot content must still be present - Alpine never wipes existing DOM');
        assert.ok(container.contains(slotted), 'slot content must remain a live, attached node');
        assert.ok(container.querySelector('.island-slot'), 'the .island-slot wrapper itself is left alone too (no extraction step exists for this adapter)');
    });

    it('createAlpineIsland: hydration mode leaves a server-authored x-data attribute untouched', async () => {
        const container = document.createElement('div');
        container.setAttribute('x-data', '{ count: 99 }');
        container.innerHTML = container.innerHTML + '<span id="stable" x-text="count"></span>';

        const mount = createAlpineIsland((props: any) => ({ count: props.count }));
        await mount(container, { count: 1 }, undefined);
        await Alpine.nextTick();

        assert.equal(container.getAttribute('x-data'), '{ count: 99 }', 'a pre-existing x-data must not be overwritten by the adapter');
        assert.equal(container.querySelector('#stable')!.textContent, '99', 'the server-authored data, not the adapter-supplied props, must win');
    });

    it('createAlpineIsland: unmount() calls Alpine.destroyTree and removes the reactive scope', async () => {
        const container = document.createElement('div');
        container.innerHTML = '<span id="stable" x-text="label"></span>';

        const mount = createAlpineIsland((props: any) => ({ label: props.title }));
        const result: any = await mount(container, { title: 'Bye' }, undefined);
        await Alpine.nextTick();
        assert.equal(container.querySelector('#stable')!.textContent, 'Bye');

        result.unmount();
        await Alpine.nextTick();

        assert.equal((Alpine.$data(container) as any)?.label, undefined, 'destroyTree must remove the reactive scope Alpine associated with this container');
    });
});
