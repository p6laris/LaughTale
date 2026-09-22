import '../setup.ts';
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import PopoverIsland from '../../src/components/popover.ts';

// ROADMAP.v5.md Part M "Adopt - State machine": popover.ts is a page-wide SINGLETON (only one
// popover slot can ever be open, tracked at module scope) - before this retrofit, open/close logic
// was duplicated across 5 separate call sites. openPopover/closePopover/togglePopover now centralize
// that behind the same useDisclosure machine every other retrofitted overlay uses.
//
// The underlying disclosure/active-element state is module-scoped (matching the component's own
// pre-existing singleton design, not something this retrofit introduced) - each test below closes
// whatever it opened before finishing, so state doesn't leak into the next test.

describe('Popover Singleton Disclosure Suite (ROADMAP.v5.md Part M)', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    function mountPopover(id: string, triggerId: string) {
        const trigger = document.createElement('button');
        trigger.id = triggerId;
        trigger.textContent = 'Open';
        document.body.appendChild(trigger);

        const container = document.createElement('div');
        container.id = id;
        document.body.appendChild(container);

        PopoverIsland(container, { triggerId }, { signal: new AbortController().signal } as any);
        return { container, trigger };
    }

    it('clicking the bound target opens the popover', () => {
        const { container, trigger } = mountPopover('pop1', 'trig1');

        trigger.click();

        assert.equal(container.classList.contains('p-popover-active'), true);

        // cleanup
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    });

    it('clicking the target again toggles it closed', () => {
        const { container, trigger } = mountPopover('pop2', 'trig2');

        trigger.click();
        assert.equal(container.classList.contains('p-popover-active'), true);

        trigger.click();
        assert.equal(container.classList.contains('p-popover-active'), false);
    });

    it('Escape closes an open popover', () => {
        const { container, trigger } = mountPopover('pop3', 'trig3');

        trigger.click();
        assert.equal(container.classList.contains('p-popover-active'), true);

        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

        assert.equal(container.classList.contains('p-popover-active'), false);
    });

    it('clicking outside closes an open popover', () => {
        const { container, trigger } = mountPopover('pop4', 'trig4');

        trigger.click();
        assert.equal(container.classList.contains('p-popover-active'), true);

        const outside = document.createElement('div');
        document.body.appendChild(outside);
        outside.dispatchEvent(new MouseEvent('click', { bubbles: true }));

        assert.equal(container.classList.contains('p-popover-active'), false);
    });

    it('a [data-popover-close] button inside the popover closes it', () => {
        const { container, trigger } = mountPopover('pop5', 'trig5');
        const closeBtn = document.createElement('button');
        closeBtn.setAttribute('data-popover-close', '');
        container.appendChild(closeBtn);

        trigger.click();
        assert.equal(container.classList.contains('p-popover-active'), true);

        closeBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));

        assert.equal(container.classList.contains('p-popover-active'), false);
    });

    it('opening a second popover closes the first - only one slot exists', () => {
        const { container: containerA, trigger: triggerA } = mountPopover('popA', 'trigA');
        const { container: containerB, trigger: triggerB } = mountPopover('popB', 'trigB');

        triggerA.click();
        assert.equal(containerA.classList.contains('p-popover-active'), true);

        triggerB.click();
        assert.equal(containerB.classList.contains('p-popover-active'), true, 'opening B must open B');
        assert.equal(containerA.classList.contains('p-popover-active'), false, 'opening B must close A - only one popover slot exists');

        // cleanup
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    });

    it('repeated Escape presses with nothing open do not throw (the disclosure guard is a safe no-op)', () => {
        mountPopover('pop6', 'trig6');

        const ex = () => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        assert.doesNotThrow(ex);
        assert.doesNotThrow(ex);
    });

    it('delegated [data-popover-target] trigger opens the referenced popover container', () => {
        const container = document.createElement('div');
        container.id = 'pop7';
        document.body.appendChild(container);
        // A bare, unmounted-by-PopoverIsland container still works through the delegation path,
        // since it targets by id/class rather than requiring PopoverIsland's own instance wiring -
        // mount a throwaway popover elsewhere first only to ensure delegation is bound.
        mountPopover('pop7-carrier', 'trig7-carrier');
        container.classList.add('p-popover');

        const delegatedTrigger = document.createElement('button');
        delegatedTrigger.setAttribute('data-popover-target', 'pop7');
        document.body.appendChild(delegatedTrigger);

        delegatedTrigger.click();

        assert.equal(container.classList.contains('p-popover-active'), true);

        // cleanup
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    });
});
