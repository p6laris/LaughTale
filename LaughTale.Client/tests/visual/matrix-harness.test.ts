import '../setup.ts';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
    renderThemeMatrix,
    captureStyleSignature,
    type MatrixPermutation
} from '../../src/testing/visual-harness.ts';

describe('Visual Regression Matrix Harness Suite (LT-604)', () => {
    it('captureStyleSignature generates deterministic signature strings', () => {
        const el = document.createElement('button');
        el.className = 'btn btn-primary';
        el.id = 'submit-btn';

        const child = document.createElement('span');
        child.className = 'btn-icon';
        el.appendChild(child);

        const signature = captureStyleSignature(el);
        assert.ok(signature.includes('tag:button'));
        assert.ok(signature.includes('class:btn btn-primary'));
        assert.ok(signature.includes('id:submit-btn'));
        assert.ok(signature.includes('children:1'));
        assert.ok(signature.includes('child[0]:span.btn-icon'));
    });

    it('renderThemeMatrix evaluates full 8-permutation matrix without errors', () => {
        const snapshots = renderThemeMatrix((container, perm: MatrixPermutation) => {
            const btn = document.createElement('button');
            btn.className = 'lt-button';
            btn.textContent = `Button (${perm.theme}-${perm.density}-${perm.palette})`;
            container.appendChild(btn);
        });

        assert.equal(snapshots.length, 8);

        // Verify distinct combinations
        const themes = new Set(snapshots.map(s => s.permutation.theme));
        const densities = new Set(snapshots.map(s => s.permutation.density));
        const palettes = new Set(snapshots.map(s => s.permutation.palette));

        assert.equal(themes.size, 2);
        assert.equal(densities.size, 2);
        assert.equal(palettes.size, 2);

        // Verify snapshot contents
        for (const snap of snapshots) {
            assert.ok(snap.signature.length > 0);
            assert.ok(snap.markup.includes('lt-button'));
            assert.ok(snap.tokenValues.primary500.startsWith('#'));
        }
    });
});
