/**
 * LaughTale: Tri-State Hydration & Shared IntersectionObserver Tests (, )
 */

import './setup.ts';
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

import { defineIsland } from '../src/runtime/registry.ts';
import { hydrateIsland, retryIsland, getIslandState, initIslands, teardownIsland } from '../src/runtime/hydrator.ts';

describe('Hydrator Tri-State & Shared Viewport Observer Suite (, )', () => {

    beforeEach(() => {
        document.body.innerHTML = '';
    });

    it('hydrateIsland: transitions from idle to pending to mounted on success', async () => {
        let mounted = false;
        defineIsland('success-widget', () => Promise.resolve({
            default: (el: HTMLElement) => {
                mounted = true;
            }
        }));

        const container = document.createElement('div');
        container.setAttribute('data-island', 'success-widget');
        container.setAttribute('data-hydrate', 'load');
        document.body.appendChild(container);

        assert.equal(getIslandState(container), 'idle');

        hydrateIsland(container);
        await new Promise(r => setTimeout(r, 20));

        assert.equal(mounted, true);
        assert.equal(getIslandState(container), 'mounted');
    });

    it('hydrateIsland: transitions to failed and dispatches exactly one laughtale:hydration-error on mount throw', async () => {
        let errorEventsCount = 0;
        let caughtError: any = null;

        defineIsland('failing-widget', () => Promise.resolve({
            default: () => {
                throw new Error('Mount runtime explosion!');
            }
        }));

        const container = document.createElement('div');
        container.setAttribute('data-island', 'failing-widget');
        container.setAttribute('data-hydrate', 'load');
        container.addEventListener('laughtale:hydration-error', (e: any) => {
            errorEventsCount++;
            caughtError = e.detail?.error;
        });
        document.body.appendChild(container);

        hydrateIsland(container);
        await new Promise(r => setTimeout(r, 20));

        assert.equal(getIslandState(container), 'failed');
        assert.equal(errorEventsCount, 1, 'Expected exactly one hydration error event');
        assert.ok(caughtError?.message.includes('Mount runtime explosion!'));

        // Triggering hydrateIsland again should do nothing because it's locked in failed state
        hydrateIsland(container);
        await new Promise(r => setTimeout(r, 20));
        assert.equal(errorEventsCount, 1, 'Hydration error event was triggered multiple times on failed island');
    });

    it('hydrateIsland: ignores concurrent interaction events while pending', async () => {
        let loaderInvocationCount = 0;

        defineIsland('slow-widget', () => {
            loaderInvocationCount++;
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve({
                        default: (el: HTMLElement) => {}
                    });
                }, 50);
            });
        });

        const container = document.createElement('div');
        container.setAttribute('data-island', 'slow-widget');
        container.setAttribute('data-hydrate', 'interaction');
        document.body.appendChild(container);

        hydrateIsland(container); // Registers the island for delegated interaction hydration

        // Fire multiple interaction events rapidly. Interaction hydration is now delegated to a
        // single document-level listener set (ROADMAP.v5.md Part E), so these must bubble to be
        // observed at all - 'mouseover' is used, not 'mouseenter', since mouseenter does not bubble.
        container.dispatchEvent(new Event('mouseover', { bubbles: true }));
        container.dispatchEvent(new Event('focusin', { bubbles: true }));
        container.dispatchEvent(new Event('click', { bubbles: true }));

        await new Promise(r => setTimeout(r, 80));

        assert.equal(loaderInvocationCount, 1, 'Loader was invoked multiple times concurrently');
        assert.equal(getIslandState(container), 'mounted');
    });

    it('hydrateIsland: delegated interaction listener routes to the correct island only', async () => {
        let aInvocations = 0;
        let bInvocations = 0;

        defineIsland('interaction-island-a', () => {
            aInvocations++;
            return Promise.resolve({ default: () => {} });
        });
        defineIsland('interaction-island-b', () => {
            bInvocations++;
            return Promise.resolve({ default: () => {} });
        });

        const a = document.createElement('div');
        a.setAttribute('data-island', 'interaction-island-a');
        a.setAttribute('data-hydrate', 'interaction');
        const b = document.createElement('div');
        b.setAttribute('data-island', 'interaction-island-b');
        b.setAttribute('data-hydrate', 'interaction');
        document.body.append(a, b);

        hydrateIsland(a);
        hydrateIsland(b);

        a.dispatchEvent(new Event('click', { bubbles: true }));
        await new Promise(r => setTimeout(r, 20));

        assert.equal(aInvocations, 1, 'Island A should have hydrated');
        assert.equal(bInvocations, 0, 'Island B should NOT have hydrated from an interaction on island A');
    });

    it('hydrateIsland: mouseover (bubbling) triggers interaction hydration', async () => {
        let mounted = false;
        defineIsland('hover-widget', () => Promise.resolve({
            default: () => { mounted = true; }
        }));

        const container = document.createElement('div');
        container.setAttribute('data-island', 'hover-widget');
        container.setAttribute('data-hydrate', 'interaction');
        document.body.appendChild(container);

        hydrateIsland(container);
        container.dispatchEvent(new Event('mouseover', { bubbles: true }));
        await new Promise(r => setTimeout(r, 20));

        assert.equal(mounted, true);
    });

    it('hydrateIsland: buffers and replays an interaction that arrives while hydration is pending', async () => {
        let clickCount = 0;

        defineIsland('replay-widget', () => new Promise(resolve => {
            setTimeout(() => resolve({
                default: (el: HTMLElement) => {
                    el.addEventListener('click', () => { clickCount++; });
                }
            }), 50);
        }));

        const container = document.createElement('div');
        container.setAttribute('data-island', 'replay-widget');
        container.setAttribute('data-hydrate', 'interaction');
        document.body.appendChild(container);

        hydrateIsland(container);

        // First click triggers hydration itself (no listener exists yet to count it).
        container.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        // Second click, while the chunk is still loading, must be buffered and replayed once the
        // island's own click listener is actually attached - not silently dropped.
        container.dispatchEvent(new MouseEvent('click', { bubbles: true }));

        // Generous margin over the 50ms mount delay above - the full test suite runs hundreds of
        // tests concurrently, and a thin margin here was observed to flake under that load even
        // though the underlying behavior is correct (confirmed by running this file in isolation).
        await new Promise(r => setTimeout(r, 200));

        assert.equal(getIslandState(container), 'mounted');
        assert.equal(clickCount, 1, 'The buffered second interaction was not replayed after mount');
    });

    it('retryIsland: resets failed state and re-attempts hydration to success', async () => {
        let shouldFail = true;
        let mountCount = 0;

        defineIsland('retryable-widget', () => Promise.resolve({
            default: () => {
                if (shouldFail) {
                    throw new Error('First attempt fail');
                }
                mountCount++;
            }
        }));

        const container = document.createElement('div');
        container.setAttribute('data-island', 'retryable-widget');
        container.setAttribute('data-hydrate', 'load');
        document.body.appendChild(container);

        hydrateIsland(container);
        await new Promise(r => setTimeout(r, 20));

        assert.equal(getIslandState(container), 'failed');
        assert.equal(mountCount, 0);

        // Fix failure condition and retry
        shouldFail = false;
        await retryIsland(container);
        await new Promise(r => setTimeout(r, 20));

        assert.equal(getIslandState(container), 'mounted');
        assert.equal(mountCount, 1, 'Island was not mounted after retry');
    });

    it('hydrateVisible: 100 visible-strategy islands share exactly 1 IntersectionObserver instance', () => {
        let observerInstancesCreated = 0;
        let totalObservedElements = 0;
        let totalUnobservedElements = 0;

        const originalObserver = globalThis.IntersectionObserver;
        class MockIntersectionObserver {
            constructor(public callback: any, public options: any) {
                observerInstancesCreated++;
            }
            observe(target: Element) {
                totalObservedElements++;
            }
            unobserve(target: Element) {
                totalUnobservedElements++;
            }
            disconnect() {}
        }
        (globalThis as any).IntersectionObserver = MockIntersectionObserver;

        try {
            const islands: HTMLElement[] = [];
            for (let i = 0; i < 100; i++) {
                defineIsland(`visible-card-${i}`, () => Promise.resolve({ default: () => {} }));
                const el = document.createElement('div');
                el.setAttribute('data-island', `visible-card-${i}`);
                el.setAttribute('data-hydrate', 'visible');
                document.body.appendChild(el);
                islands.push(el);
                hydrateIsland(el);
            }

            assert.equal(observerInstancesCreated, 1, 'Expected exactly 1 shared IntersectionObserver instance for 100 islands');
            assert.equal(totalObservedElements, 100, 'Expected 100 elements to be observed');

            // Trigger unmount on 20 islands
            for (let i = 0; i < 20; i++) {
                islands[i].dispatchEvent(new CustomEvent('laughtale:unmount'));
            }

            assert.equal(totalUnobservedElements, 20, 'Expected 20 elements to be unobserved on unmount');
        } finally {
            globalThis.IntersectionObserver = originalObserver;
        }
    });

    it('late defineIsland() retroactively hydrates an element already stuck in the failed state (ROADMAP.v5.md Part B)', async () => {
        // Reproduces the real scenario this fix targets: a page's main bundle calls initIslands()
        // (scanning the DOM and hydrating everything found) BEFORE a separately-loaded islands
        // bundle - e.g. a generated registry.generated.ts for user-authored islands - has run its
        // own defineIsland() call. Without the onIslandRegistered retry hook, the element is
        // permanently stuck: hydrateIsland()'s own idle-only guard means even a later,
        // unconditional initIslands() re-scan would silently skip it.
        const container = document.createElement('div');
        container.setAttribute('data-island', 'late-widget');
        container.setAttribute('data-hydrate', 'load');
        document.body.appendChild(container);

        // Hydrate BEFORE the island is registered - matches executeHydration's real "not
        // registered" path exactly, landing the element in 'failed'.
        hydrateIsland(container);
        await new Promise(resolve => setTimeout(resolve, 0));
        assert.equal(getIslandState(container), 'failed', 'must be failed before the late registration below');

        let mounted = false;
        defineIsland('late-widget', () => Promise.resolve({
            default: () => { mounted = true; }
        }));

        // The retry defineIsland() triggers is itself async (teardownIsland + executeHydration);
        // give it a turn to complete.
        await new Promise(resolve => setTimeout(resolve, 0));

        assert.equal(mounted, true, 'the island must actually mount once its name is registered late, not stay failed forever');
        assert.equal(getIslandState(container), 'mounted');
    });

    it('a late defineIsland() for an unrelated name does not touch an island already stuck in the failed state', async () => {
        const container = document.createElement('div');
        container.setAttribute('data-island', 'still-missing-widget');
        container.setAttribute('data-hydrate', 'load');
        document.body.appendChild(container);

        hydrateIsland(container);
        await new Promise(resolve => setTimeout(resolve, 0));
        assert.equal(getIslandState(container), 'failed');

        defineIsland('some-other-widget', () => Promise.resolve({ default: () => {} }));
        await new Promise(resolve => setTimeout(resolve, 0));

        assert.equal(getIslandState(container), 'failed', 'must not be retried by an unrelated island name being registered');
    });

});

describe('Nested Islands Suite (ROADMAP.v5.md Part D)', () => {

    beforeEach(() => {
        document.body.innerHTML = '';
    });

    it('initIslands hydrates a nested island concurrently with its parent, not gated on the parent settling first', async () => {
        // Nested islands hydrate at the same time as their parent, exactly like any other island the
        // top-level scan finds - a deliberate choice, not an oversight: an earlier version of this fix
        // deferred nested hydration until the parent's own mount settled, but that broke real
        // components (FloatLabelIsland) that synchronously read a nested island's already-rendered DOM
        // during their OWN mount. See the "destructive parent" test below for how a nested island that
        // genuinely gets destroyed is now handled instead (a loud warning, not silent gating).
        let outerMounted = false;
        let innerMounted = false;

        defineIsland('nested-outer-safe', () => Promise.resolve({
            default: () => { outerMounted = true; }
        }));
        defineIsland('nested-inner-safe', () => Promise.resolve({
            default: () => { innerMounted = true; }
        }));

        const outer = document.createElement('div');
        outer.setAttribute('data-island', 'nested-outer-safe');
        outer.setAttribute('data-hydrate', 'load');
        const inner = document.createElement('div');
        inner.setAttribute('data-island', 'nested-inner-safe');
        inner.setAttribute('data-hydrate', 'load');
        outer.appendChild(inner);
        document.body.appendChild(outer);

        initIslands(document.body);

        await new Promise(r => setTimeout(r, 50));

        assert.equal(outerMounted, true);
        assert.equal(innerMounted, true);
        assert.equal(getIslandState(inner), 'mounted');
    });

    it('a nested island under a non-destructive vanilla parent hydrates successfully', async () => {
        defineIsland('nested-outer-nondestructive', () => Promise.resolve({
            default: (el: HTMLElement) => { el.setAttribute('data-outer-mounted', 'true'); }
        }));
        let innerMounted = false;
        defineIsland('nested-inner-survivor', () => Promise.resolve({
            default: () => { innerMounted = true; }
        }));

        const outer = document.createElement('div');
        outer.setAttribute('data-island', 'nested-outer-nondestructive');
        outer.setAttribute('data-hydrate', 'load');
        const inner = document.createElement('div');
        inner.setAttribute('data-island', 'nested-inner-survivor');
        inner.setAttribute('data-hydrate', 'load');
        outer.appendChild(inner);
        document.body.appendChild(outer);

        hydrateIsland(outer);
        await new Promise(r => setTimeout(r, 50));

        assert.equal(innerMounted, true);
        assert.equal(getIslandState(inner), 'mounted');
    });

    it('a nested island under a destructive (innerHTML-rewriting) vanilla parent does not hydrate and a warning fires', async () => {
        defineIsland('nested-outer-destructive', () => Promise.resolve({
            default: (el: HTMLElement) => { el.innerHTML = '<div>replaced</div>'; }
        }));
        let innerMounted = false;
        defineIsland('nested-inner-lost', () => Promise.resolve({
            default: () => { innerMounted = true; }
        }));

        const outer = document.createElement('div');
        outer.setAttribute('data-island', 'nested-outer-destructive');
        outer.setAttribute('data-hydrate', 'load');
        const inner = document.createElement('div');
        inner.setAttribute('data-island', 'nested-inner-lost');
        inner.setAttribute('data-hydrate', 'load');
        outer.appendChild(inner);
        document.body.appendChild(outer);

        const warnings: string[] = [];
        const originalWarn = console.warn;
        console.warn = (...args: any[]) => { warnings.push(args.join(' ')); };

        try {
            hydrateIsland(outer);
            await new Promise(r => setTimeout(r, 50));
        } finally {
            console.warn = originalWarn;
        }

        assert.equal(innerMounted, false, 'a destroyed nested island must never have its loader invoked');
        assert.ok(
            warnings.some(w => w.includes('nested-inner-lost') && w.includes('nested-outer-destructive')),
            `expected a warning naming both the lost nested island and its parent, got: ${JSON.stringify(warnings)}`
        );
    });

    it('a never-strategy parent still lets its nested island hydrate immediately, since its own container is never touched', async () => {
        let innerMounted = false;
        defineIsland('nested-inner-under-never', () => Promise.resolve({
            default: () => { innerMounted = true; }
        }));

        const outer = document.createElement('div');
        outer.setAttribute('data-island', 'nested-outer-never');
        outer.setAttribute('data-hydrate', 'never');
        const inner = document.createElement('div');
        inner.setAttribute('data-island', 'nested-inner-under-never');
        inner.setAttribute('data-hydrate', 'load');
        outer.appendChild(inner);
        document.body.appendChild(outer);

        initIslands(document.body);
        await new Promise(r => setTimeout(r, 50));

        assert.equal(getIslandState(outer), 'idle', 'a never-strategy island itself is never mounted');
        assert.equal(innerMounted, true, 'its nested island must still hydrate');
        assert.equal(getIslandState(inner), 'mounted');
    });

    it('doubly-nested islands (outer > middle > inner) all hydrate correctly when none of them are destructive', async () => {
        defineIsland('nested-outer-triple', () => Promise.resolve({
            default: (el: HTMLElement) => { el.setAttribute('data-outer-mounted', 'true'); }
        }));
        defineIsland('nested-middle-triple', () => Promise.resolve({
            default: (el: HTMLElement) => { el.setAttribute('data-middle-mounted', 'true'); }
        }));
        defineIsland('nested-inner-triple', () => Promise.resolve({
            default: () => {}
        }));

        const outer = document.createElement('div');
        outer.setAttribute('data-island', 'nested-outer-triple');
        outer.setAttribute('data-hydrate', 'load');
        const middle = document.createElement('div');
        middle.setAttribute('data-island', 'nested-middle-triple');
        middle.setAttribute('data-hydrate', 'load');
        const inner = document.createElement('div');
        inner.setAttribute('data-island', 'nested-inner-triple');
        inner.setAttribute('data-hydrate', 'load');

        middle.appendChild(inner);
        outer.appendChild(middle);
        document.body.appendChild(outer);

        initIslands(document.body);
        await new Promise(r => setTimeout(r, 100));

        assert.equal(getIslandState(outer), 'mounted');
        assert.equal(getIslandState(middle), 'mounted');
        assert.equal(getIslandState(inner), 'mounted');
    });

    it('teardownIsland cascades laughtale:unmount to nested islands, whose own cleanup would otherwise never fire', async () => {
        defineIsland('nested-outer-teardown', () => Promise.resolve({
            default: (el: HTMLElement) => { el.setAttribute('data-outer-mounted', 'true'); }
        }));

        let innerCleanedUp = false;
        defineIsland('nested-inner-teardown', () => Promise.resolve({
            default: (_el: HTMLElement, _props: any, ctx: any) => {
                ctx.onCleanup(() => { innerCleanedUp = true; });
            }
        }));

        const outer = document.createElement('div');
        outer.setAttribute('data-island', 'nested-outer-teardown');
        outer.setAttribute('data-hydrate', 'load');
        const inner = document.createElement('div');
        inner.setAttribute('data-island', 'nested-inner-teardown');
        inner.setAttribute('data-hydrate', 'load');
        outer.appendChild(inner);
        document.body.appendChild(outer);

        hydrateIsland(outer);
        await new Promise(r => setTimeout(r, 50));

        assert.equal(getIslandState(inner), 'mounted');
        assert.equal(innerCleanedUp, false);

        teardownIsland(outer);

        assert.equal(innerCleanedUp, true, 'tearing down the parent must cascade laughtale:unmount to the nested island');
    });

});
