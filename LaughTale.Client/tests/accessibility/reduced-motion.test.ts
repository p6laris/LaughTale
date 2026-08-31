import '../setup.ts';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
    isReducedMotionPreferred,
    getReducedMotionSafeDuration
} from '../../src/styles/animations.ts';
import { useTransition } from '../../src/composables/animation/useTransition.ts';

describe('Reduced Motion Accessibility Suite', () => {
    it('isReducedMotionPreferred returns boolean based on matchMedia query', () => {
        const originalMatchMedia = window.matchMedia;

        try {
            // Mock matchMedia returning true
            window.matchMedia = ((query: string) => ({
                matches: query.includes('prefers-reduced-motion: reduce'),
                media: query,
                onchange: null,
                addListener: () => {},
                removeListener: () => {},
                addEventListener: () => {},
                removeEventListener: () => {},
                dispatchEvent: () => false
            })) as any;

            assert.equal(isReducedMotionPreferred(), true);
            assert.equal(getReducedMotionSafeDuration(300), 0);

            // Mock matchMedia returning false
            window.matchMedia = ((query: string) => ({
                matches: false,
                media: query,
                onchange: null,
                addListener: () => {},
                removeListener: () => {},
                addEventListener: () => {},
                removeEventListener: () => {},
                dispatchEvent: () => false
            })) as any;

            assert.equal(isReducedMotionPreferred(), false);
            assert.equal(getReducedMotionSafeDuration(300), 300);
        } finally {
            window.matchMedia = originalMatchMedia;
        }
    });

    it('useTransition runs with 0ms duration when reduced motion is enabled', async () => {
        const originalMatchMedia = window.matchMedia;

        try {
            window.matchMedia = ((query: string) => ({
                matches: true,
                media: query
            })) as any;

            const div = document.createElement('div');
            document.body.appendChild(div);

            let ended = false;
            const { enter } = useTransition(div, {
                duration: 500,
                onEnterEnd: () => { ended = true; }
            });

            enter();

            await new Promise(r => setTimeout(r, 60));
            assert.equal(ended, true, 'Transition did not collapse duration to 0ms');

            div.remove();
        } finally {
            window.matchMedia = originalMatchMedia;
        }
    });
});
