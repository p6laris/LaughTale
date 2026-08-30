/**
 * LaughTale: Theme Persistence & Zero-FOUC Engine (LT-603)
 * Handles resilient localStorage and cookie caching, SSR state sync, and multi-format theme export.
 */

import { AURA_PALETTES, updateToken } from './design-tokens';
import { generatePaletteRamp } from './palette-generator';

export const THEME_STORAGE_KEY = 'lt-theme';

export interface SavedThemeConfig {
    primary: string;   // Preset name ('emerald') or hex ('#6366f1')
    neutral: string;   // Neutral preset name ('slate', 'zinc')
    radius: string;    // e.g. '0.5rem'
    darkMode?: boolean;
}

export function saveTheme(config: SavedThemeConfig): void {
    const serialized = JSON.stringify(config);

    // 1. Guarded LocalStorage Write
    try {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(THEME_STORAGE_KEY, serialized);
        }
    } catch {
        // Ignored in strict private browsing modes
    }

    // 2. Guarded Cookie Write for Server-Side SSR Recognition
    try {
        if (typeof document !== 'undefined') {
            document.cookie = `${THEME_STORAGE_KEY}=${encodeURIComponent(serialized)}; path=/; max-age=31536000; SameSite=Lax`;
        }
    } catch {
        // Ignored
    }
}

export function loadSavedTheme(): SavedThemeConfig | null {
    // 1. Try LocalStorage
    try {
        if (typeof localStorage !== 'undefined') {
            const item = localStorage.getItem(THEME_STORAGE_KEY);
            if (item) {
                return JSON.parse(item) as SavedThemeConfig;
            }
        }
    } catch {
        // Fall through to cookie
    }

    // 2. Try Cookie Fallback
    try {
        if (typeof document !== 'undefined' && document.cookie) {
            const match = document.cookie.match(new RegExp(`(^| )${THEME_STORAGE_KEY}=([^;]+)`));
            if (match && match[2]) {
                const decoded = decodeURIComponent(match[2]);
                return JSON.parse(decoded) as SavedThemeConfig;
            }
        }
    } catch {
        // Ignored
    }

    return null;
}

export function applySavedTheme(): boolean {
    const saved = loadSavedTheme();
    if (!saved) return false;

    // Apply primary ramp
    let ramp: Record<string, string>;
    if (saved.primary.startsWith('#')) {
        ramp = generatePaletteRamp(saved.primary);
    } else {
        ramp = AURA_PALETTES[saved.primary.toLowerCase()] || AURA_PALETTES.emerald;
    }

    for (const [shade, hex] of Object.entries(ramp)) {
        updateToken(`--lt-primary-${shade}`, hex);
        updateToken(`--p-primary-${shade}`, hex);
    }
    updateToken('--lt-primary-color', ramp['500'] || '#10b981');
    updateToken('--p-primary-color', ramp['500'] || '#10b981');

    // Apply radius if configured
    if (saved.radius) {
        updateToken('--lt-radius-md', saved.radius);
        updateToken('--p-border-radius', saved.radius);
    }

    // Apply dark mode if specified
    if (typeof saved.darkMode === 'boolean' && typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', saved.darkMode ? 'dark' : 'light');
    }

    return true;
}

export function generateThemeExports(config: SavedThemeConfig): { css: string; csharp: string; json: string } {
    let ramp: Record<string, string>;
    if (config.primary.startsWith('#')) {
        ramp = generatePaletteRamp(config.primary);
    } else {
        ramp = AURA_PALETTES[config.primary.toLowerCase()] || AURA_PALETTES.emerald;
    }

    // 1. CSS Block
    const cssLines = [
        ':root {',
        `  --lt-primary-500: ${ramp['500']};`,
        `  --p-primary-500: ${ramp['500']};`,
        `  --lt-radius-md: ${config.radius || '0.5rem'};`,
        `  --p-border-radius: ${config.radius || '0.5rem'};`,
        '}'
    ];
    const css = cssLines.join('\n');

    // 2. C# Snippet
    const csharp = `services.AddLaughTaleTheme(options =>
{
    options.Primary = "${config.primary}";
    options.Surface = "${config.neutral}";
    options.Radius = "${config.radius}";
    options.DarkMode = ${config.darkMode ? 'true' : 'false'};
});`;

    // 3. Portable JSON
    const json = JSON.stringify(config, null, 2);

    return { css, csharp, json };
}
