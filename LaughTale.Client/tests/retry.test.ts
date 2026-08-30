/**
 * LaughTale: Module Retry & Exponential Backoff Unit Tests (LT-207)
 */

import './setup.ts';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { importWithRetry } from '../src/runtime/retry.ts';

describe('Module Dynamic Import Retry & Jittered Backoff Suite (LT-207)', () => {

    it('importWithRetry: resolves immediately on first attempt without delay', async () => {
        let attempts = 0;
        const loader = async () => {
            attempts++;
            return { default: 'my-component' };
        };

        const startTime = Date.now();
        const result = await importWithRetry(loader, { retries: 3, baseDelayMs: 200 });
        const elapsed = Date.now() - startTime;

        assert.equal(attempts, 1);
        assert.equal((result as any).default, 'my-component');
        assert.ok(elapsed < 50, `Expected elapsed time < 50ms, got ${elapsed}ms`);
    });

    it('importWithRetry: recovers when loader fails twice and succeeds on third attempt', async () => {
        let attempts = 0;
        const loader = async () => {
            attempts++;
            if (attempts < 3) {
                throw new Error(`Transient network glitch attempt ${attempts}`);
            }
            return { default: 'recovered-component' };
        };

        const result = await importWithRetry(loader, { retries: 3, baseDelayMs: 10, jitter: false });

        assert.equal(attempts, 3);
        assert.equal((result as any).default, 'recovered-component');
    });

    it('importWithRetry: throws original error on exhaustion of retries', async () => {
        let attempts = 0;
        const rootError = new Error('HTTP 404: Chunk not found');

        const loader = async () => {
            attempts++;
            throw rootError;
        };

        await assert.rejects(
            async () => {
                await importWithRetry(loader, { retries: 3, baseDelayMs: 10, jitter: false });
            },
            (err: any) => {
                assert.equal(err, rootError, 'Expected exact root Error instance to be preserved');
                assert.equal(err.message, 'HTTP 404: Chunk not found');
                return true;
            }
        );

        assert.equal(attempts, 3);
    });

    it('importWithRetry: applies exponential backoff timing bounds with jitter', async () => {
        let attempts = 0;
        const loader = async () => {
            attempts++;
            if (attempts < 3) {
                throw new Error('Glitch');
            }
            return { default: 'success' };
        };

        const startTime = Date.now();
        // attempt 0 delay: baseDelay (20ms * 2^0 = 20ms) * jitter (0.75-1.25) -> 15-25ms
        // attempt 1 delay: baseDelay (20ms * 2^1 = 40ms) * jitter (0.75-1.25) -> 30-50ms
        // Total expected delay: ~45ms - 85ms
        await importWithRetry(loader, { retries: 3, baseDelayMs: 20, jitter: true });
        const elapsed = Date.now() - startTime;

        assert.equal(attempts, 3);
        assert.ok(elapsed >= 35, `Expected elapsed time >= 35ms, got ${elapsed}ms`);
        assert.ok(elapsed <= 250, `Expected elapsed time <= 250ms, got ${elapsed}ms`);
    });

});
