import '../setup.ts';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { initDesignTokens, updateToken, getToken, AURA_PALETTES } from '../../src/styles/design-tokens.ts';

describe('Design Tokens Contract & Unification Suite', () => {
    it('initializes design tokens in document head', () => {
        initDesignTokens();
        const styleEl = document.getElementById('laughtale-design-tokens');
        assert.ok(styleEl !== null);
        assert.ok(styleEl.textContent?.includes('--lt-primary-500'));
        assert.ok(styleEl.textContent?.includes('--p-primary-500'));
        assert.ok(styleEl.textContent?.includes('--lt-surface-0'));
        assert.ok(styleEl.textContent?.includes('--lt-danger-bg'));
    });

    it('AURA_PALETTES contains full 11-shade ramps for all themes', () => {
        const requiredShades = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];
        const palettes = ['emerald', 'blue', 'violet', 'amber', 'rose', 'cyan', 'slate', 'zinc'];

        for (const pal of palettes) {
            assert.ok(AURA_PALETTES[pal] !== undefined, `Missing palette: ${pal}`);
            for (const shade of requiredShades) {
                assert.ok(AURA_PALETTES[pal][shade] !== undefined, `Missing shade ${shade} in ${pal}`);
            }
        }
    });

    it('updateToken updates property and synchronizes backward compatibility alias', () => {
        updateToken('--lt-primary-500', '#2563eb');
        assert.equal(document.documentElement.style.getPropertyValue('--lt-primary-500'), '#2563eb');
        assert.equal(document.documentElement.style.getPropertyValue('--p-primary-500'), '#2563eb');

        updateToken('--p-surface-0', '#111827');
        assert.equal(document.documentElement.style.getPropertyValue('--p-surface-0'), '#111827');
        assert.equal(document.documentElement.style.getPropertyValue('--lt-surface-0'), '#111827');
    });
});
