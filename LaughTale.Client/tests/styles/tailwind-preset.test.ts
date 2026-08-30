import '../setup.ts';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { laughtaleTailwindPreset } from '../../src/styles/tailwind.preset.ts';

describe('LaughTale Tailwind CSS Preset Suite (LT-2106 / P11)', () => {
    it('provides complete primary color ramp mapping to CSS variables', () => {
        const colors = laughtaleTailwindPreset.theme.extend.colors;
        assert.ok(colors.primary);
        assert.equal(colors.primary[500], 'var(--lt-primary-500, #10b981)');
        assert.equal(colors.primary[50], 'var(--lt-primary-50, #ecfdf5)');
        assert.equal(colors.primary[950], 'var(--lt-primary-950, #022c22)');
    });

    it('provides complete surface neutral ramp mapping to CSS variables', () => {
        const colors = laughtaleTailwindPreset.theme.extend.colors;
        assert.ok(colors.surface);
        assert.equal(colors.surface[0], 'var(--lt-surface-0, #ffffff)');
        assert.equal(colors.surface[50], 'var(--lt-surface-50, #f8fafc)');
        assert.equal(colors.surface[900], 'var(--lt-surface-900, #0f172a)');
    });

    it('provides semantic radius tokens', () => {
        const radius = laughtaleTailwindPreset.theme.extend.borderRadius;
        assert.ok(radius);
        assert.equal(radius.DEFAULT, 'var(--lt-radius, 0.5rem)');
        assert.equal(radius.lg, 'var(--lt-radius-lg, 0.75rem)');
        assert.equal(radius.full, '9999px');
    });
});
