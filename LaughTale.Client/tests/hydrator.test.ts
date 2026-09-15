/**
 * LaughTale: Tri-State Hydration & Shared IntersectionObserver Tests (, )
 */

import './setup.ts';
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

import { defineIsland } from '../src/runtime/registry.ts';
import { hydrateIsland, retryIsland, getIslandState } from '../src/runtime/hydrator.ts';

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

        hydrateIsland(container); // Attaches interaction listeners

        // Fire multiple interaction events rapidly
        container.dispatchEvent(new Event('mouseenter'));
        container.dispatchEvent(new Event('focusin'));
        container.dispatchEvent(new Event('click'));

        await new Promise(r => setTimeout(r, 80));

        assert.equal(loaderInvocationCount, 1, 'Loader was invoked multiple times concurrently');
        assert.equal(getIslandState(container), 'mounted');
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
