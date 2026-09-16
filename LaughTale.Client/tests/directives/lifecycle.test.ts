import '../setup.ts';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { registerDirectiveCleanup, teardownDirectives } from '../../src/directives/lifecycle.ts';

describe('Directive Cleanup Registry Suite (ROADMAP.v5.md Part I)', () => {
    it('runs every registered cleanup exactly once across the torn-down subtree', () => {
        const root = document.createElement('div');
        const childA = document.createElement('span');
        const childB = document.createElement('span');
        root.appendChild(childA);
        root.appendChild(childB);

        let calledA = 0;
        let calledB = 0;
        registerDirectiveCleanup(childA, () => { calledA++; });
        registerDirectiveCleanup(childB, () => { calledB++; });

        teardownDirectives(root);

        assert.equal(calledA, 1);
        assert.equal(calledB, 1);
    });

    it('runs multiple cleanups registered on the same element', () => {
        const root = document.createElement('div');
        const child = document.createElement('span');
        root.appendChild(child);

        let calls = 0;
        registerDirectiveCleanup(child, () => { calls++; });
        registerDirectiveCleanup(child, () => { calls++; });

        teardownDirectives(root);

        assert.equal(calls, 2);
    });

    it('does not re-run cleanups on a second teardown call (entry cleared after running)', () => {
        const root = document.createElement('div');
        const child = document.createElement('span');
        root.appendChild(child);

        let calls = 0;
        registerDirectiveCleanup(child, () => { calls++; });

        teardownDirectives(root);
        teardownDirectives(root);

        assert.equal(calls, 1);
    });

    it('runs the cleanup for the root element itself, not just its descendants', () => {
        const root = document.createElement('div');
        let called = false;
        registerDirectiveCleanup(root, () => { called = true; });

        teardownDirectives(root);

        assert.equal(called, true);
    });

    it('opts.skip prevents a matched element\'s cleanups from running or being cleared', () => {
        const root = document.createElement('div');
        const skipped = document.createElement('span');
        const normal = document.createElement('span');
        root.appendChild(skipped);
        root.appendChild(normal);

        let skippedCalls = 0;
        let normalCalls = 0;
        registerDirectiveCleanup(skipped, () => { skippedCalls++; });
        registerDirectiveCleanup(normal, () => { normalCalls++; });

        teardownDirectives(root, { skip: (el) => el === skipped });

        assert.equal(skippedCalls, 0, 'skipped element cleanup must not run');
        assert.equal(normalCalls, 1);

        // The skipped element's registration must remain intact (untouched)
        // for a later, non-skipping teardown.
        teardownDirectives(root, { skip: () => false });
        assert.equal(skippedCalls, 1, 'a later un-skipped teardown must still find and run it');
    });

    it('a throwing cleanup does not block other cleanups on the same or other elements', () => {
        const root = document.createElement('div');
        const elA = document.createElement('span');
        const elB = document.createElement('span');
        root.appendChild(elA);
        root.appendChild(elB);

        let secondOnA = false;
        let onB = false;
        registerDirectiveCleanup(elA, () => { throw new Error('boom'); });
        registerDirectiveCleanup(elA, () => { secondOnA = true; });
        registerDirectiveCleanup(elB, () => { onB = true; });

        assert.doesNotThrow(() => teardownDirectives(root));
        assert.equal(secondOnA, true, 'a later cleanup on the same element must still run');
        assert.equal(onB, true, 'cleanups on other elements must still run');
    });
});
