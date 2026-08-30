/**
 * SoftMax.LaughTale: Tri-State Hydration Lifecycle & Recovery Tests (LT-205)
 */

import './setup.ts';
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

import { defineIsland } from '../src/runtime/registry.ts';
import { hydrateIsland, retryIsland, getIslandState } from '../src/runtime/hydrator.ts';

describe('Tri-State Island Hydration Lifecycle Suite (LT-205)', () => {

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

});
