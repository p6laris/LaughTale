import './setup.ts';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createVanillaIsland, createReactIsland, createVueIsland, createSvelteIsland, createPreactIsland } from '../src/index.ts';

describe('LaughTale Framework Mount Adapters Suite', () => {
    it('createVanillaIsland: mounts component and executes teardown', () => {
        const container = document.createElement('div');
        let tornDown = false;

        const mount = createVanillaIsland((el, props) => {
            el.textContent = `Hello ${props.name}`;
            return () => {
                tornDown = true;
            };
        });

        const unmount = mount(container, { name: 'LaughTale' });
        assert.equal(container.textContent, 'Hello LaughTale');

        if (typeof unmount === 'function') {
            unmount();
            assert.equal(tornDown, true);
        }
    });

    it('createReactIsland: handles fallback gracefully with IslandContext signal', async () => {
        const container = document.createElement('div');
        let cleanedUp = false;

        const abortController = new AbortController();
        const ctx = {
            signal: abortController.signal,
            container,
            name: 'ReactCard',
            locale: 'en',
            dir: 'ltr' as const,
            onCleanup: (fn: () => void) => {
                abortController.signal.addEventListener('abort', fn);
            }
        };

        const mount = createReactIsland((el: HTMLElement, props: any) => {
            el.textContent = `React ${props.title}`;
            return () => { cleanedUp = true; };
        });

        const unmount = await mount(container, { title: 'Widget' }, ctx);
        assert.equal(container.textContent, 'React Widget');

        if (typeof unmount === 'function') {
            unmount();
            assert.equal(cleanedUp, true);
        }
    });

    it('createVueIsland: handles fallback gracefully with IslandContext signal', async () => {
        const container = document.createElement('div');
        let cleanedUp = false;

        const abortController = new AbortController();
        const ctx = {
            signal: abortController.signal,
            container,
            name: 'VueCard',
            locale: 'en',
            dir: 'ltr' as const,
            onCleanup: (fn: () => void) => {
                abortController.signal.addEventListener('abort', fn);
            }
        };

        const mount = createVueIsland((el: HTMLElement, props: any) => {
            el.textContent = `Vue ${props.title}`;
            return () => { cleanedUp = true; };
        });

        const unmount = await mount(container, { title: 'Dashboard' }, ctx);
        assert.equal(container.textContent, 'Vue Dashboard');

        if (typeof unmount === 'function') {
            unmount();
            assert.equal(cleanedUp, true);
        }
    });

    it('createSvelteIsland: handles fallback gracefully with IslandContext signal', async () => {
        const container = document.createElement('div');
        let cleanedUp = false;

        const abortController = new AbortController();
        const ctx = {
            signal: abortController.signal,
            container,
            name: 'SvelteCard',
            locale: 'en',
            dir: 'ltr' as const,
            onCleanup: (fn: () => void) => {
                abortController.signal.addEventListener('abort', fn);
            }
        };

        const mount = createSvelteIsland((el: HTMLElement, props: any) => {
            el.textContent = `Svelte ${props.title}`;
            return () => { cleanedUp = true; };
        });

        const unmount = await mount(container, { title: 'Graph' }, ctx);
        assert.equal(container.textContent, 'Svelte Graph');

        if (typeof unmount === 'function') {
            unmount();
            assert.equal(cleanedUp, true);
        }
    });

    it('createPreactIsland: handles fallback gracefully with IslandContext signal', async () => {
        const container = document.createElement('div');
        let cleanedUp = false;

        const abortController = new AbortController();
        const ctx = {
            signal: abortController.signal,
            container,
            name: 'PreactCard',
            locale: 'en',
            dir: 'ltr' as const,
            onCleanup: (fn: () => void) => {
                abortController.signal.addEventListener('abort', fn);
            }
        };

        const mount = createPreactIsland((el: HTMLElement, props: any) => {
            el.textContent = `Preact ${props.title}`;
            return () => { cleanedUp = true; };
        });

        const unmount = await mount(container, { title: 'Feed' }, ctx);
        assert.equal(container.textContent, 'Preact Feed');

        if (typeof unmount === 'function') {
            unmount();
            assert.equal(cleanedUp, true);
        }
    });
});
