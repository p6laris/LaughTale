import '../setup.ts';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { computeHorizontalRatio } from '../../src/components/slider.ts';
import { computeSplitterDeltaPct } from '../../src/components/splitter.ts';
import { isLowerHalfHit } from '../../src/components/rating.ts';
import { getToggleHandleTransform } from '../../src/components/toggle-switch.ts';

describe('RTL behavioral fixes (Bucket B geometry math)', () => {
    describe('slider: computeHorizontalRatio', () => {
        it('measures ratio directly from the physical left edge in LTR', () => {
            // Track spans physical x=0..200. Pointer at x=150 -> 75% of the way across.
            assert.equal(computeHorizontalRatio(150, 0, 200, false), 0.75);
            assert.equal(computeHorizontalRatio(0, 0, 200, false), 0);
            assert.equal(computeHorizontalRatio(200, 0, 200, false), 1);
        });

        it('mirrors the ratio in RTL so the reading-start edge is still 0', () => {
            // Same physical pointer position, but under RTL the reading-start (visual "min")
            // edge is the physical right edge, so the ratio must be the complement.
            assert.equal(computeHorizontalRatio(150, 0, 200, true), 1 - 0.75);
            assert.equal(computeHorizontalRatio(0, 0, 200, true), 1);
            assert.equal(computeHorizontalRatio(200, 0, 200, true), 0);
        });

        it('clamps out-of-bounds pointer positions in both directions', () => {
            assert.equal(computeHorizontalRatio(-50, 0, 200, false), 0);
            assert.equal(computeHorizontalRatio(999, 0, 200, false), 1);
            assert.equal(computeHorizontalRatio(-50, 0, 200, true), 1);
            assert.equal(computeHorizontalRatio(999, 0, 200, true), 0);
        });

        it('is a true mirror: ltr(x) + rtl(x) === 1 for any in-range pointer position', () => {
            for (const x of [0, 33, 80, 120, 200]) {
                const ltr = computeHorizontalRatio(x, 0, 200, false);
                const rtl = computeHorizontalRatio(x, 0, 200, true);
                assert.equal(ltr + rtl, 1);
            }
        });
    });

    describe('splitter: computeSplitterDeltaPct', () => {
        it('grows the "prev" panel when dragging physically right in LTR', () => {
            // Dragging 50px right across a 500px container is +10%.
            assert.equal(computeSplitterDeltaPct(50, 500, false), 10);
        });

        it('inverts the delta sign in RTL, since flex-direction: row mirrors panel order', () => {
            // Same physical drag, but "prev" now sits on the physical right, so the
            // same rightward drag must shrink it instead of growing it.
            assert.equal(computeSplitterDeltaPct(50, 500, true), -10);
        });

        it('is an exact sign inversion between LTR and RTL for the same drag', () => {
            const ltr = computeSplitterDeltaPct(37, 480, false);
            const rtl = computeSplitterDeltaPct(37, 480, true);
            assert.equal(ltr, -rtl);
        });

        it('returns 0 for a non-positive total size regardless of direction', () => {
            assert.equal(computeSplitterDeltaPct(50, 0, false), 0);
            assert.equal(computeSplitterDeltaPct(50, 0, true), 0);
        });
    });

    describe('rating: isLowerHalfHit', () => {
        it('treats the physical left half as the lower-value half in LTR', () => {
            // Star spans physical x=100..120 (width 20). Pointer at x=105 is in the left half.
            assert.equal(isLowerHalfHit(105, 100, 20, false), true);
            // Pointer at x=115 is in the right half -> full value.
            assert.equal(isLowerHalfHit(115, 100, 20, false), false);
        });

        it('treats the physical right half as the lower-value half in RTL', () => {
            // Same physical pointer positions, but the star's reading-start half is now
            // the physical right half, so the lower/full mapping flips.
            assert.equal(isLowerHalfHit(105, 100, 20, true), false);
            assert.equal(isLowerHalfHit(115, 100, 20, true), true);
        });

        it('disagrees between LTR and RTL for every non-center pointer position', () => {
            for (const x of [101, 105, 109, 111, 115, 119]) {
                const ltr = isLowerHalfHit(x, 100, 20, false);
                const rtl = isLowerHalfHit(x, 100, 20, true);
                assert.notEqual(ltr, rtl);
            }
        });
    });

    describe('toggle-switch: getToggleHandleTransform', () => {
        it('produces no transform when unchecked, in either direction', () => {
            assert.equal(getToggleHandleTransform(false, false), '');
            assert.equal(getToggleHandleTransform(false, true), '');
        });

        it('slides right when checked in LTR', () => {
            assert.equal(getToggleHandleTransform(true, false), 'translateX(16px)');
        });

        it('slides left (mirrored) when checked in RTL', () => {
            assert.equal(getToggleHandleTransform(true, true), 'translateX(-16px)');
        });
    });
});
