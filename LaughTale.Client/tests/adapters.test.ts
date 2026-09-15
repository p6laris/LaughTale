import './setup.ts';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createVanillaIsland, createReactIsland, createVueIsland, createSvelteIsland, createPreactIsland } from '../src/index.ts';

// React, Vue and Preact are real devDependencies (see package.json) specifically so the tests
// below exercise each adapter's actual framework-mount/update code path, not just its
// "package not found" fallback branch (which is all any adapter test could reach before, since
// no framework package was ever installed - the fallback ran unconditionally for all five
// adapters and none of them ever mounted a real component). Svelte is deliberately NOT a
// dependency - ROADMAP.v5.md Part D records why createSvelteIsland does not implement update()
// in this pass - so its test below still legitimately exercises the fallback path.
//
// These MUST be dynamic imports, not static `import ... from 'vue'` declarations. esbuild
// inlines setup.ts's happy-dom globalThis assignments into this same bundled module, and ES
// module evaluation order runs a module's external static imports before its own top-level
// statement body - so a static import here would evaluate 'vue' before setup.ts's assignments
// ever run. Vue's runtime-dom caches `document` once at module-load time; seeing it as
// `undefined` at that point makes every real Vue mount below throw ("Cannot read properties of
// null (reading 'createElement')"), silently falling back to this adapter's catch branch
// instead of actually mounting. A dynamic import() executes at this line, in normal sequential
// order, after setup.ts's assignments - exactly like the real adapters already do it.
const React = await import('react');
const Vue = await import('vue');
const Preact = await import('preact');

// React's concurrent root schedules its commit on a macrotask (verified empirically: neither a
// synchronous check nor a microtask tick observes the DOM update in this happy-dom + Node
// environment - a real timer tick is required). A FIXED delay is the wrong tool for that though:
// under parallel test-file load the commit can legitimately take longer than any fixed guess,
// which was observed to flake here. Poll for the actual condition instead, so a fast machine
// resolves quickly and a loaded one just takes longer (up to a generous ceiling) rather than
// racing an arbitrary timer.
async function waitFor(check: () => boolean, timeoutMs = 2000, intervalMs = 10): Promise<void> {
    const start = Date.now();
    while (!check()) {
        if (Date.now() - start > timeoutMs) {
            throw new Error(`waitFor: condition not met within ${timeoutMs}ms`);
        }
        await new Promise(resolve => setTimeout(resolve, intervalMs));
    }
}

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

    it('createReactIsland: mounts a real React component and unmounts via IslandContext signal', async () => {
        const container = document.createElement('div');
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

        function Widget(props: any) {
            return React.createElement('span', { id: 'stable' }, `React ${props.title}`);
        }

        const mount = createReactIsland(Widget);
        const result: any = await mount(container, { title: 'Widget' }, ctx);
        await waitFor(() => container.textContent === 'React Widget');

        // The real-mount branch must return the IslandInstance shape (Step 1/4 contract), not a
        // bare teardown function.
        assert.equal(typeof result.unmount, 'function', 'adapter must return an unmount fn');
        assert.equal(typeof result.update, 'function', 'adapter must return an update fn');
        assert.equal(container.textContent, 'React Widget');

        abortController.abort();
        await waitFor(() => container.childNodes.length === 0);

        assert.equal(container.childNodes.length, 0, 'React root must be unmounted, clearing the container');
    });

    it('createReactIsland: the initial render is committed synchronously once mount() resolves (ROADMAP.v5.md Part D, nested islands)', async () => {
        // Without flushSync, this file's own comment above (lines 27-33) documents that React's
        // concurrent root only commits on a later macrotask - meaning hydrator.ts's nested-island
        // survival check (which runs right after mount() resolves, plus one requestAnimationFrame
        // wait) could not yet observe whether this container's DOM had actually been replaced. This
        // test asserts the commit is complete with NO waitFor/polling at all - proving flushSync
        // actually forces synchronous commit, not just that the adapter still compiles/runs.
        const container = document.createElement('div');

        function Widget(props: any) {
            return React.createElement('span', { id: 'sync-check' }, `Sync ${props.title}`);
        }

        const mount = createReactIsland(Widget);
        await mount(container, { title: 'Widget' }, undefined);

        assert.equal(container.textContent, 'Sync Widget', 'the initial commit must be observable immediately after mount() resolves, with no extra tick');
    });

    it('createReactIsland: update() re-renders the same root in place without unmount/remount', async () => {
        const container = document.createElement('div');
        const ctx = {
            signal: new AbortController().signal,
            container,
            name: 'ReactCard',
            locale: 'en',
            dir: 'ltr' as const,
            onCleanup: () => {}
        };

        function Widget(props: any) {
            return React.createElement('span', { id: 'stable' }, `React ${props.title}`);
        }

        const mount = createReactIsland(Widget);
        const result: any = await mount(container, { title: 'Widget' }, ctx);
        await waitFor(() => container.textContent === 'React Widget');
        assert.equal(container.textContent, 'React Widget');

        // Capture the actual DOM node identity before update(). If update() secretly tore the
        // root down and remounted instead of calling root.render() again on the SAME root,
        // React would build a brand-new <span>, and this exact reference would no longer be the
        // one found in the container afterwards. Node identity - not just the rendered text -
        // is what proves no remount happened; matching text alone would be equally true of a
        // full unmount+remount with the new props.
        const spanBefore = container.querySelector('#stable');
        assert.ok(spanBefore, 'span should exist after initial mount');

        await result.update({ title: 'Updated' });
        await waitFor(() => container.textContent === 'React Updated');

        assert.equal(container.textContent, 'React Updated');
        const spanAfter = container.querySelector('#stable');
        assert.equal(spanAfter, spanBefore, 'update() must patch the existing DOM node in place, not remount');
    });

    it('createVueIsland: mounts a real Vue app and unmounts via IslandContext signal', async () => {
        const container = document.createElement('div');
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

        function Widget(props: any) {
            return Vue.h('span', { id: 'stable' }, `Vue ${props.title}`);
        }

        const mount = createVueIsland(Widget);
        const result: any = await mount(container, { title: 'Dashboard' }, ctx);
        await Vue.nextTick();

        assert.equal(typeof result.unmount, 'function', 'adapter must return an unmount fn');
        assert.equal(typeof result.update, 'function', 'adapter must return an update fn');
        assert.equal(container.textContent, 'Vue Dashboard');

        abortController.abort();
        await Vue.nextTick();

        assert.equal(container.childNodes.length, 0, 'Vue app must be unmounted, clearing the container');
    });

    it('createVueIsland: update() reassigns the shallowRef props in place without unmount/remount', async () => {
        const container = document.createElement('div');
        const ctx = {
            signal: new AbortController().signal,
            container,
            name: 'VueCard',
            locale: 'en',
            dir: 'ltr' as const,
            onCleanup: () => {}
        };

        function Widget(props: any) {
            return Vue.h('span', { id: 'stable' }, `Vue ${props.title}`);
        }

        const mount = createVueIsland(Widget);
        const result: any = await mount(container, { title: 'Dashboard' }, ctx);
        await Vue.nextTick();
        assert.equal(container.textContent, 'Vue Dashboard');

        // Same node-identity proof as React above: a secretly-remounted Vue app would produce a
        // brand-new <span>, not patch this one.
        const spanBefore = container.querySelector('#stable');
        assert.ok(spanBefore, 'span should exist after initial mount');

        await result.update({ title: 'Updated' });
        await Vue.nextTick();

        assert.equal(container.textContent, 'Vue Updated');
        const spanAfter = container.querySelector('#stable');
        assert.equal(spanAfter, spanBefore, 'update() must patch the existing DOM node in place, not remount');
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

    it('createPreactIsland: mounts a real Preact component and unmounts via IslandContext signal', async () => {
        const container = document.createElement('div');
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

        function Widget(props: any) {
            return Preact.h('span', { id: 'stable' }, `Preact ${props.title}`);
        }

        const mount = createPreactIsland(Widget);
        const result: any = await mount(container, { title: 'Feed' }, ctx);

        assert.equal(typeof result.unmount, 'function', 'adapter must return an unmount fn');
        assert.equal(typeof result.update, 'function', 'adapter must return an update fn');
        assert.equal(container.textContent, 'Preact Feed');

        abortController.abort();

        assert.equal(container.childNodes.length, 0, 'Preact render(null) must clear the container');
    });

    it('createPreactIsland: update() re-renders in place without unmount/remount', async () => {
        const container = document.createElement('div');
        const ctx = {
            signal: new AbortController().signal,
            container,
            name: 'PreactCard',
            locale: 'en',
            dir: 'ltr' as const,
            onCleanup: () => {}
        };

        function Widget(props: any) {
            return Preact.h('span', { id: 'stable' }, `Preact ${props.title}`);
        }

        const mount = createPreactIsland(Widget);
        const result: any = await mount(container, { title: 'Feed' }, ctx);
        assert.equal(container.textContent, 'Preact Feed');

        // Same node-identity proof as React/Vue above.
        const spanBefore = container.querySelector('#stable');
        assert.ok(spanBefore, 'span should exist after initial mount');

        await result.update({ title: 'Updated' });

        assert.equal(container.textContent, 'Preact Updated');
        const spanAfter = container.querySelector('#stable');
        assert.equal(spanAfter, spanBefore, 'update() must patch the existing DOM node in place, not remount');
    });
});
