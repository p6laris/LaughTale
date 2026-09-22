/**
 * LaughTale: Headless Composables & Animation Suite Unit Tests
 */

import './setup.ts';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { useDisclosure } from '../src/composables/useDisclosure.ts';
import { useControllableState } from '../src/composables/useControllableState.ts';
import { useSpring } from '../src/composables/animation/useSpring.ts';
import { useStagger } from '../src/composables/animation/useStagger.ts';
import { useDebounce } from '../src/composables/useDebounce.ts';
import { useClipboard } from '../src/composables/useClipboard.ts';
import { useKeyboardNav } from '../src/composables/useKeyboardNav.ts';
import { useEventListener } from '../src/composables/useEventListener.ts';

describe('LaughTale Headless Composables Suite', () => {

    it('useDisclosure: manages open/close lifecycle and callbacks', () => {
        let opened = false;
        let closed = false;

        const disc = useDisclosure({
            defaultIsOpen: false,
            onOpen: () => { opened = true; },
            onClose: () => { closed = true; }
        });

        assert.equal(disc.isOpen, false);

        disc.open();
        assert.equal(disc.isOpen, true);
        assert.equal(opened, true);

        disc.close();
        assert.equal(disc.isOpen, false);
        assert.equal(closed, true);

        disc.toggle();
        assert.equal(disc.isOpen, true);
    });

    it('useDisclosure: disabled guard blocks open()/opening toggle(), but never blocks close() (ROADMAP.v5.md Part M "Adopt - State machine")', () => {
        let disabled = true;
        const disc = useDisclosure({ disabled: () => disabled });

        disc.open();
        assert.equal(disc.isOpen, false, 'open() must be a no-op while disabled');

        disc.toggle();
        assert.equal(disc.isOpen, false, 'an opening toggle() must also be blocked while disabled');

        disabled = false;
        disc.open();
        assert.equal(disc.isOpen, true, 'open() must work again once no longer disabled');

        disabled = true; // becomes disabled WHILE already open
        disc.close();
        assert.equal(disc.isOpen, false, 'close() must never be blocked by the disabled guard, even while disabled');
    });

    it('useDisclosure: disabled is read live on every call, not snapshotted at creation', () => {
        let disabled = false;
        const disc = useDisclosure({ disabled: () => disabled });

        disabled = true; // flipped AFTER useDisclosure() was called, before the first open()
        disc.open();

        assert.equal(disc.isOpen, false, 'the guard must read the CURRENT disabled value, not one captured at creation time');
    });

    it('useDisclosure: setOpen(true/false) routes through the same guarded open()/close()', () => {
        const disc = useDisclosure({ disabled: () => true });

        disc.setOpen(true);
        assert.equal(disc.isOpen, false, 'setOpen(true) must respect the disabled guard exactly like open()');
    });

    it('useDisclosure: onChange listeners fire on real transitions and can unsubscribe', () => {
        const seen: boolean[] = [];
        const disc = useDisclosure();
        const unsubscribe = disc.onChange((isOpen) => seen.push(isOpen));

        disc.open();
        disc.close();
        assert.deepEqual(seen, [true, false]);

        unsubscribe();
        disc.open();
        assert.deepEqual(seen, [true, false], 'no further notifications after unsubscribe');
    });

    it('useDisclosure: defaultIsOpen starts the underlying machine in the open state', () => {
        const disc = useDisclosure({ defaultIsOpen: true });
        assert.equal(disc.isOpen, true);
    });

    it('useControllableState: supports controlled and uncontrolled state', () => {
        let changedVal = '';
        const [getVal, setVal] = useControllableState({
            defaultValue: 'initial',
            onChange: (v) => { changedVal = v; }
        });

        assert.equal(getVal(), 'initial');

        setVal('updated');
        assert.equal(getVal(), 'updated');
        assert.equal(changedVal, 'updated');
    });

    it('useSpring: calculates spring trajectory towards target', async () => {
        const spring = useSpring(0, { stiffness: 200, damping: 20 });
        assert.equal(spring.value, 0);

        spring.set(100);
        await new Promise(r => setTimeout(r, 60));

        assert.ok(spring.value > 0, `Spring value should progress towards target, got ${spring.value}`);
        spring.stop();
    });

    it('useStagger: applies staggered entrance transitions to elements', () => {
        const parent = document.createElement('div');
        for (let i = 0; i < 3; i++) {
            const child = document.createElement('div');
            parent.appendChild(child);
        }

        const elements = Array.from(parent.children) as HTMLElement[];
        useStagger(elements, { staggerMs: 30, initialDelay: 10 });

        assert.ok(elements[0].style.transition.includes('10ms'));
        assert.ok(elements[1].style.transition.includes('40ms'));
        assert.ok(elements[2].style.transition.includes('70ms'));
    });

    it('useDebounce: executes callback after delay interval', async () => {
        let count = 0;
        const debounced = useDebounce(() => { count++; }, 30);

        debounced();
        debounced();
        debounced();
        assert.equal(count, 0);

        await new Promise(r => setTimeout(r, 60));
        assert.equal(count, 1);
    });

    it('useClipboard: copies text and exposes state', async () => {
        const clipboard = useClipboard({ timeout: 50 });
        const success = await clipboard.copy('Test Secret Key');
        assert.equal(success, true);
        assert.equal(clipboard.isCopied, true);

        await new Promise(r => setTimeout(r, 70));
        assert.equal(clipboard.isCopied, false);
    });

    it('useKeyboardNav: manages active item index and arrows', () => {
        let selected = -1;
        let highlighted = -1;

        const nav = useKeyboardNav({
            itemCount: () => 5,
            onHighlight: (idx) => { highlighted = idx; },
            onSelect: (idx) => { selected = idx; }
        });

        nav.handleKeyDown(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
        assert.equal(highlighted, 0);

        nav.handleKeyDown(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
        assert.equal(highlighted, 1);

        nav.handleKeyDown(new KeyboardEvent('keydown', { key: 'Enter' }));
        assert.equal(selected, 1);
    });

    it('useEventListener: attaches and cleans up event listener', () => {
        const btn = document.createElement('button');
        let clicked = false;

        const cleanup = useEventListener(btn, 'click', () => {
            clicked = true;
        });

        btn.click();
        assert.equal(clicked, true);

        clicked = false;
        cleanup();
        btn.click();
        assert.equal(clicked, false);
    });

});
