/**
 * SoftMax.LaughTale: Headless Composables & Animation Suite Unit Tests
 */

import './setup.ts';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { useDisclosure } from '../src/composables/useDisclosure.ts';
import { useControllableState } from '../src/composables/useControllableState.ts';
import { useSpring } from '../src/composables/animation/useSpring.ts';
import { useStagger } from '../src/composables/animation/useStagger.ts';

describe('SoftMax.LaughTale Headless Composables Suite', () => {

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

});
