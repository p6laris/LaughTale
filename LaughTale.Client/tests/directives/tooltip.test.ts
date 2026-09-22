import '../setup.ts';
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { initGlobalTooltipDelegation } from '../../src/directives/tooltip.ts';

// ROADMAP.v5.md Part M "Adopt - State machine": tooltip.ts is a page-wide SINGLETON (one shared
// tooltip element, the same architecture popover.ts already had retrofitted) whose visibility was
// three loosely-related mutable variables (a DOM class, `currentTargetEl`, and two setTimeout ids)
// instead of one guarded disclosure. Retrofitting it surfaced a real, pre-existing bug: `currentTargetEl`
// was only ever assigned once a DELAYED tooltip actually became visible, so a mouseout that arrived
// during the showDelay window - the pointer left before the tooltip ever appeared - failed the
// mouseout handler's `target === currentTargetEl` guard and did nothing, leaving the pending timer
// armed. The tooltip then popped up anyway, anchored to an element the pointer had already left.

function wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function fireMouse(type: string, el: HTMLElement) {
    el.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true }));
}

describe('Tooltip Disclosure Suite (ROADMAP.v5.md Part M)', () => {
    beforeEach(() => {
        // Not `document.body.innerHTML = ''`: tooltip.ts's shared tooltip element is a genuine
        // module-scoped singleton (one instance for the page's whole lifetime, the same architecture
        // popover.ts already has) - wiping the whole body would detach it from the live document while
        // the module still holds a reference to the now-orphaned node, so every later `triggerShow()`
        // call would silently reuse a DOM node no longer under `document.body` at all. Only remove the
        // per-test target elements; leave the singleton tooltip element (if one already exists) alone,
        // matching how it actually persists across a real page's lifetime.
        Array.from(document.body.children).forEach(child => {
            if (!child.classList.contains('p-tooltip')) child.remove();
        });
        initGlobalTooltipDelegation();
    });

    function makeTarget(attrs: Record<string, string>) {
        const el = document.createElement('button');
        for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
        el.textContent = 'Hover me';
        document.body.appendChild(el);
        return el;
    }

    it('hovering a p-tooltip target shows the shared tooltip element', () => {
        const target = makeTarget({ 'p-tooltip': 'Hello world' });

        fireMouse('mouseover', target);

        const tooltip = document.querySelector('.p-tooltip');
        assert.ok(tooltip, 'the shared tooltip element must be created');
        assert.equal(tooltip!.classList.contains('p-tooltip-active'), true);
        assert.equal(tooltip!.querySelector('.p-tooltip-text')?.textContent, 'Hello world');

        // cleanup
        fireMouse('mouseout', target);
    });

    it('mousing out of the target hides the tooltip immediately (no hideDelay)', () => {
        const target = makeTarget({ 'p-tooltip': 'Hello world' });

        fireMouse('mouseover', target);
        assert.equal(document.querySelector('.p-tooltip')?.classList.contains('p-tooltip-active'), true);

        fireMouse('mouseout', target);

        assert.equal(document.querySelector('.p-tooltip')?.classList.contains('p-tooltip-active'), false);
    });

    it('Escape hides an open tooltip', () => {
        const target = makeTarget({ 'p-tooltip': 'Hello world' });
        fireMouse('mouseover', target);
        assert.equal(document.querySelector('.p-tooltip')?.classList.contains('p-tooltip-active'), true);

        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

        assert.equal(document.querySelector('.p-tooltip')?.classList.contains('p-tooltip-active'), false);
    });

    it('repeated Escape presses with nothing shown do not throw (the disclosure guard is a safe no-op)', () => {
        const ex = () => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        assert.doesNotThrow(ex);
        assert.doesNotThrow(ex);
    });

    it('a mouseout DURING the showDelay window cancels the pending show (the real bug this retrofit fixes)', async () => {
        const target = makeTarget({ 'p-tooltip': 'Delayed', 'p-tooltip-show-delay': '30' });

        fireMouse('mouseover', target);
        // Tooltip must NOT be visible yet - still inside the 30ms show delay.
        assert.equal(document.querySelector('.p-tooltip')?.classList.contains('p-tooltip-active'), false);

        // Pointer leaves before the delayed show ever fires.
        fireMouse('mouseout', target);

        await wait(60); // well past the 30ms show delay
        assert.equal(document.querySelector('.p-tooltip')?.classList.contains('p-tooltip-active'), false, 'the delayed show must have been cancelled by the mouseout, not fired late for a target the pointer already left');
    });

    it('moving directly between two adjacent hover targets swaps content without flicker', () => {
        const targetA = makeTarget({ 'p-tooltip': 'First' });
        const targetB = makeTarget({ 'p-tooltip': 'Second' });

        fireMouse('mouseover', targetA);
        assert.equal(document.querySelector('.p-tooltip-text')?.textContent, 'First');

        fireMouse('mouseout', targetA);
        fireMouse('mouseover', targetB);

        const tooltip = document.querySelector('.p-tooltip');
        assert.equal(tooltip?.classList.contains('p-tooltip-active'), true);
        assert.equal(tooltip?.querySelector('.p-tooltip-text')?.textContent, 'Second');

        // cleanup
        fireMouse('mouseout', targetB);
    });
});
