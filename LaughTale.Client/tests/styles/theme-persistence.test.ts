import '../setup.ts';
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import {
    saveTheme,
    loadSavedTheme,
    applySavedTheme,
    generateThemeExports,
    THEME_STORAGE_KEY,
    type SavedThemeConfig
} from '../../src/styles/theme-persistence.ts';

describe('Theme Persistence & Export Suite', () => {
    beforeEach(() => {
        localStorage.clear();
        document.cookie = `${THEME_STORAGE_KEY}=; max-age=0`;
    });

    it('saves and loads theme configuration from localStorage and cookie', () => {
        const config: SavedThemeConfig = {
            primary: 'blue',
            neutral: 'zinc',
            radius: '0.75rem',
            darkMode: true
        };

        saveTheme(config);

        const loaded = loadSavedTheme();
        assert.ok(loaded !== null);
        assert.equal(loaded?.primary, 'blue');
        assert.equal(loaded?.neutral, 'zinc');
        assert.equal(loaded?.radius, '0.75rem');
        assert.equal(loaded?.darkMode, true);
    });

    it('applySavedTheme restores variables to document root', () => {
        saveTheme({
            primary: '#6366f1',
            neutral: 'slate',
            radius: '1rem',
            darkMode: true
        });

        const applied = applySavedTheme();
        assert.equal(applied, true);
        assert.equal(document.documentElement.style.getPropertyValue('--lt-primary-500'), '#6366f1');
        assert.equal(document.documentElement.style.getPropertyValue('--lt-radius-md'), '1rem');
        assert.equal(document.documentElement.getAttribute('data-theme'), 'dark');
    });

    it('generateThemeExports produces CSS, C#, and JSON bundles', () => {
        const config: SavedThemeConfig = {
            primary: 'emerald',
            neutral: 'slate',
            radius: '0.5rem',
            darkMode: false
        };

        const exports = generateThemeExports(config);
        assert.ok(exports.css.includes('--lt-primary-500: #10b981;'));
        assert.ok(exports.csharp.includes('services.AddLaughTaleTheme'));
        assert.ok(exports.json.includes('"primary": "emerald"'));
    });
});
