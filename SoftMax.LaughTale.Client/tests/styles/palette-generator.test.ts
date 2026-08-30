import '../setup.ts';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { generatePaletteRamp, hexToOklch, oklchToHex, parseHex, rgbToHex } from '../../src/styles/palette-generator.ts';

describe('OKLCH Palette Generator Suite (LT-602)', () => {
    it('parses and formats hex codes accurately', () => {
        assert.deepEqual(parseHex('#ff0000'), { r: 255, g: 0, b: 0 });
        assert.deepEqual(parseHex('#0f0'), { r: 0, g: 255, b: 0 });
        assert.equal(rgbToHex({ r: 0, g: 0, b: 255 }), '#0000ff');
    });

    it('roundtrips RGB to OKLCH and back with sub-1% perceptual error', () => {
        const originalHex = '#3b82f6';
        const oklch = hexToOklch(originalHex);
        const reconstructedHex = oklchToHex(oklch);

        const origRgb = parseHex(originalHex);
        const reconRgb = parseHex(reconstructedHex);

        assert.ok(Math.abs(origRgb.r - reconRgb.r) <= 2);
        assert.ok(Math.abs(origRgb.g - reconRgb.g) <= 2);
        assert.ok(Math.abs(origRgb.b - reconRgb.b) <= 2);
    });

    it('generates complete 11-shade ramps for custom hex input', () => {
        const requiredShades = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];
        const ramp = generatePaletteRamp('#8b5cf6'); // Violet

        for (const shade of requiredShades) {
            assert.ok(ramp[shade] !== undefined, `Missing shade ${shade}`);
            assert.match(ramp[shade], /^#[0-9a-f]{6}$/i);
        }
        assert.equal(ramp['500'], '#8b5cf6');
    });

    it('preserves monotonic lightness decay from 50 to 950', () => {
        const ramp = generatePaletteRamp('#10b981'); // Emerald
        const shades = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];

        let previousLightness = 1.0;
        for (const shade of shades) {
            const oklch = hexToOklch(ramp[shade]);
            assert.ok(oklch.l < previousLightness, `Lightness for shade ${shade} (${oklch.l}) should be less than previous (${previousLightness})`);
            previousLightness = oklch.l;
        }
    });
});
