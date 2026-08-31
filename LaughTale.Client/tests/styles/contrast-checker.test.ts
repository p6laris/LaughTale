import '../setup.ts';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
    calculateRelativeLuminance,
    calculateContrastRatio,
    checkWcagCompliance
} from '../../src/styles/contrast-checker.ts';

describe('WCAG Contrast Engine & Compliance Suite', () => {
    it('calculates relative luminance per W3C WCAG 2.1 specifications', () => {
        assert.equal(calculateRelativeLuminance({ r: 255, g: 255, b: 255 }), 1.0);
        assert.equal(calculateRelativeLuminance({ r: 0, g: 0, b: 0 }), 0.0);
    });

    it('calculates exact contrast ratios', () => {
        const maxRatio = calculateContrastRatio('#000000', '#ffffff');
        assert.ok(Math.abs(maxRatio - 21.0) < 0.01);

        const minRatio = calculateContrastRatio('#ffffff', '#ffffff');
        assert.ok(Math.abs(minRatio - 1.0) < 0.01);
    });

    it('evaluates WCAG AA and AAA compliance thresholds accurately', () => {
        // High contrast (Black on White)
        const perfect = checkWcagCompliance('#000000', '#ffffff');
        assert.equal(perfect.grade, 'AAA');
        assert.equal(perfect.aaNormal, true);
        assert.equal(perfect.aaaNormal, true);
        assert.equal(perfect.formattedRatio, '21.00:1');

        // Low contrast (Yellow on White)
        const failing = checkWcagCompliance('#facc15', '#ffffff');
        assert.equal(failing.grade, 'Fail');
        assert.equal(failing.aaNormal, false);
        assert.equal(failing.aaaNormal, false);

        // Standard compliant contrast
        const compliant = checkWcagCompliance('#1e3a8a', '#ffffff'); // Deep blue on white
        assert.equal(compliant.aaNormal, true);
        assert.ok(compliant.ratio >= 4.5);
    });
});
