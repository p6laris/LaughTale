/**
 * SoftMax.LaughTale: Island Scope Teardown & Lifecycle Unit Tests (LT-201)
 */

import './setup.ts';
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

import { createScope } from '../src/runtime/scope.ts';

describe('Island Resource Scope & Teardown Lifecycle Suite (LT-201)', () => {

    let container: HTMLElement;

    beforeEach(() => {
        document.body.innerHTML = '';
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    it('scope.on: registers event listener and automatically removes it on dispose', () => {
        const scope = createScope();
        let clickCount = 0;

        scope.on(container, 'click', () => {
            clickCount++;
        });

        container.dispatchEvent(new Event('click'));
        assert.equal(clickCount, 1, 'Event listener was not invoked before disposal');

        // Dispose scope
        scope.dispose();

        // Dispatch again - listener should be removed
        container.dispatchEvent(new Event('click'));
        assert.equal(clickCount, 1, 'Event listener was unexpectedly invoked after scope disposal');
    });

    it('scope.observe: disconnects observer on dispose', () => {
        const scope = createScope();
        let disconnected = false;

        const mockObserver = {
            observe: () => {},
            disconnect: () => {
                disconnected = true;
            }
        };

        scope.observe(mockObserver);
        assert.equal(disconnected, false);

        scope.dispose();
        assert.equal(disconnected, true, 'Observer was not disconnected on scope disposal');
    });

    it('scope.timer: cancels interval and timeout on dispose', () => {
        const scope = createScope();
        let timerFired = false;

        const timerId = setTimeout(() => {
            timerFired = true;
        }, 50);

        scope.timer(timerId);
        scope.dispose();

        // Wait past timer duration
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                assert.equal(timerFired, false, 'Timer fired after scope disposal');
                resolve();
            }, 70);
        });
    });

    it('scope.cleanup: executes custom cleanup callbacks in LIFO order', () => {
        const scope = createScope();
        const executionOrder: number[] = [];

        scope.cleanup(() => executionOrder.push(1));
        scope.cleanup(() => executionOrder.push(2));
        scope.cleanup(() => executionOrder.push(3));

        scope.dispose();

        assert.deepEqual(executionOrder, [3, 2, 1], 'Cleanups did not execute in reverse LIFO order');
    });

    it('scope.dispose: is idempotent and only runs cleanups once', () => {
        const scope = createScope();
        let runCount = 0;

        scope.cleanup(() => {
            runCount++;
        });

        scope.dispose();
        scope.dispose();
        scope.dispose();

        assert.equal(runCount, 1, 'Cleanups were executed multiple times on repeated dispose calls');
    });

    it('scope.dispose: isolates individual errors and ensures all cleanups run', () => {
        const scope = createScope();
        let secondCleaned = false;

        scope.cleanup(() => {
            secondCleaned = true;
        });

        scope.cleanup(() => {
            throw new Error('Explosive cleanup failure!');
        });

        scope.dispose();

        assert.equal(secondCleaned, true, 'Subsequent cleanups were blocked by an earlier error');
    });

});
