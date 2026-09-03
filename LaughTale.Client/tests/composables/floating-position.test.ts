import '../setup.ts';
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { useFloatingPosition } from '../../src/composables/useFloatingPosition.ts';

function createMockElement(rect: { left: number; top: number; width: number; height: number }): HTMLElement {
    const el = document.createElement('div');
    el.getBoundingClientRect = () => ({
        left: rect.left,
        top: rect.top,
        right: rect.left + rect.width,
        bottom: rect.top + rect.height,
        width: rect.width,
        height: rect.height,
        x: rect.left,
        y: rect.top,
        toJSON: () => {}
    });
    return el;
}

describe('useFloatingPosition Headless Composable Suite', () => {
    beforeEach(() => {
        (window as any).innerWidth = 1000;
        (window as any).innerHeight = 800;
        Object.defineProperty(window, 'scrollX', { value: 0, writable: true, configurable: true });
        Object.defineProperty(window, 'scrollY', { value: 0, writable: true, configurable: true });
    });

    it('flips placement when the preferred side does not fit', () => {
        const anchor = createMockElement({ left: 100, top: 720, width: 120, height: 40 });
        const floating = createMockElement({ left: 0, top: 0, width: 150, height: 100 });

        const { computePosition } = useFloatingPosition(anchor, floating, {
            placement: 'bottom-start',
            offset: 6,
            autoFlip: true
        });

        const coords = computePosition();
        // Space below is 800 - 760 = 40px (< 100 + 6), space above is 720px. Flips to top-start.
        assert.equal(coords.actualPlacement, 'top-start');
        assert.equal(coords.y, 720 - 100 - 6);
        assert.equal(coords.x, 100);
    });

    it('clamps coordinates to viewport padding when neither side fits or element overflows', () => {
        const anchor = createMockElement({ left: 950, top: 100, width: 40, height: 40 });
        const floating = createMockElement({ left: 0, top: 0, width: 200, height: 100 });

        const { computePosition } = useFloatingPosition(anchor, floating, {
            placement: 'bottom-start',
            viewportPadding: 10,
            autoFlip: false
        });

        const coords = computePosition();
        // 950 + 200 = 1150 > 1000 - 10, clamped to 1000 - 200 - 10 = 790
        assert.equal(coords.x, 790);
    });

    it('calculates arrowOffset correctly after flip and clamp', () => {
        const anchor = createMockElement({ left: 200, top: 720, width: 100, height: 40 });
        const floating = createMockElement({ left: 0, top: 0, width: 160, height: 100 });
        const arrow = createMockElement({ left: 0, top: 0, width: 10, height: 10 });

        const { computePosition } = useFloatingPosition(anchor, floating, {
            placement: 'bottom',
            offset: 6,
            autoFlip: true,
            arrow
        });

        const coords = computePosition();
        assert.equal(coords.actualPlacement, 'top');
        // Anchor center is 200 + 50 = 250
        // Floating centered at 200 + (100 - 160) / 2 = 170
        // arrowOffset = 250 - 170 - (10 / 2) = 75
        assert.equal(coords.arrowOffset, 75);
    });

    it('supports point anchoring with { x, y }', () => {
        const floating = createMockElement({ left: 0, top: 0, width: 120, height: 80 });

        const { computePosition } = useFloatingPosition({ x: 300, y: 400 }, floating, {
            placement: 'bottom-start',
            offset: 8
        });

        const coords = computePosition();
        assert.equal(coords.x, 300);
        assert.equal(coords.y, 408);
        assert.equal(coords.actualPlacement, 'bottom-start');
    });

    it('writes only specified axis when axis: x is provided', () => {
        const anchor = createMockElement({ left: 100, top: 100, width: 80, height: 30 });
        const floating = document.createElement('div');
        floating.style.position = 'fixed';
        floating.style.top = '55px';
        floating.style.left = '0px';
        floating.getBoundingClientRect = () => ({
            left: 0, top: 0, right: 100, bottom: 50, width: 100, height: 50, x: 0, y: 0, toJSON: () => {}
        });

        const controller = useFloatingPosition(anchor, floating, {
            axis: 'x',
            placement: 'right-start',
            offset: 10
        });

        controller.update();
        assert.equal(floating.style.left, '190px');
        // style.top must NOT be touched by the composable
        assert.equal(floating.style.top, '55px');
    });

    it('adds scroll offsets when strategy is absolute', () => {
        Object.defineProperty(window, 'scrollX', { value: 200, writable: true, configurable: true });
        Object.defineProperty(window, 'scrollY', { value: 350, writable: true, configurable: true });

        const anchor = createMockElement({ left: 100, top: 100, width: 80, height: 30 });
        const floating = createMockElement({ left: 0, top: 0, width: 100, height: 50 });

        const controller = useFloatingPosition(anchor, floating, {
            strategy: 'absolute',
            placement: 'bottom-start',
            offset: 5
        });

        const coords = controller.computePosition();
        // x: 100 + 200 = 300
        // y: 130 + 5 + 350 = 485
        assert.equal(coords.x, 300);
        assert.equal(coords.y, 485);

        controller.update();
        assert.equal(floating.style.position, 'absolute');
        assert.equal(floating.style.left, '300px');
        assert.equal(floating.style.top, '485px');
    });

    it('provides idempotent destroy()', () => {
        const anchor = createMockElement({ left: 50, top: 50, width: 50, height: 20 });
        const floating = createMockElement({ left: 0, top: 0, width: 50, height: 50 });

        const controller = useFloatingPosition(anchor, floating, {
            reposition: 'follow',
            signal: new AbortController().signal
        });

        // Calling destroy multiple times must be completely safe and idempotent
        assert.doesNotThrow(() => {
            controller.destroy();
            controller.destroy();
            controller.destroy();
        });
    });

    it('releases all listeners on abort signal', () => {
        const anchor = createMockElement({ left: 50, top: 50, width: 50, height: 20 });
        const floating = createMockElement({ left: 0, top: 0, width: 50, height: 50 });
        const abortController = new AbortController();

        let dismissCalls = 0;
        useFloatingPosition(anchor, floating, {
            reposition: 'dismiss',
            onDismiss: () => { dismissCalls++; },
            signal: abortController.signal
        });

        window.dispatchEvent(new Event('scroll'));
        assert.equal(dismissCalls, 1);

        abortController.abort();

        // After abort, events must no longer trigger onDismiss
        window.dispatchEvent(new Event('scroll'));
        window.dispatchEvent(new Event('resize'));
        assert.equal(dismissCalls, 1);
    });
});
