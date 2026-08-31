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
    density?: string;  // 'compact' | 'normal' | 'spacious'
    shadow?: string;   // 'none' | 'subtle' | 'layered' | 'bold'
    font?: string;     // 'inter' | 'geist' | 'jakarta' | 'outfit' | 'mono'
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
        updateToken('--lt-radius', saved.radius);
        updateToken('--lt-radius-md', saved.radius);
        updateToken('--p-border-radius', saved.radius);
        const radNum = parseFloat(saved.radius) || 0;
        const lgVal = saved.radius === '9999px' ? '9999px' : `${radNum * 1.5}rem`;
        const xlVal = saved.radius === '9999px' ? '9999px' : `${radNum * 2}rem`;
        updateToken('--lt-radius-lg', lgVal);
        updateToken('--lt-radius-xl', xlVal);
        updateToken('--p-border-radius-lg', lgVal);
        updateToken('--p-border-radius-xl', xlVal);
    }

    // Apply neutral surface if configured (Dark-mode aware)
    if (saved.neutral) {
        applyNeutralSurfaceTokens(saved.neutral);
    }

    // Apply density if configured
    if (saved.density) {
        if (saved.density === 'compact') {
            updateToken('--lt-content-padding', '0.625rem');
            updateToken('--lt-field-padding-y', '0.35rem');
            updateToken('--lt-field-padding-x', '0.5rem');
            updateToken('--p-content-padding', '0.625rem');
            updateToken('--p-field-padding-y', '0.35rem');
            updateToken('--p-field-padding-x', '0.5rem');
            updateToken('--p-button-padding-y', '0.35rem');
            updateToken('--p-button-padding-x', '0.65rem');
        } else if (saved.density === 'spacious') {
            updateToken('--lt-content-padding', '1.5rem');
            updateToken('--lt-field-padding-y', '0.65rem');
            updateToken('--lt-field-padding-x', '1rem');
            updateToken('--p-content-padding', '1.5rem');
            updateToken('--p-field-padding-y', '0.65rem');
            updateToken('--p-field-padding-x', '1rem');
            updateToken('--p-button-padding-y', '0.65rem');
            updateToken('--p-button-padding-x', '1.25rem');
        } else {
            updateToken('--lt-content-padding', '1rem');
            updateToken('--lt-field-padding-y', '0.5rem');
            updateToken('--lt-field-padding-x', '0.75rem');
            updateToken('--p-content-padding', '1rem');
            updateToken('--p-field-padding-y', '0.5rem');
            updateToken('--p-field-padding-x', '0.75rem');
            updateToken('--p-button-padding-y', '0.5rem');
            updateToken('--p-button-padding-x', '1rem');
        }
    }

    // Apply shadow if configured
    if (saved.shadow) {
        if (saved.shadow === 'none') {
            updateToken('--lt-shadow-sm', 'none');
            updateToken('--lt-shadow-md', 'none');
            updateToken('--lt-shadow-lg', 'none');
            updateToken('--lt-shadow-xl', 'none');
            updateToken('--p-shadow-sm', 'none');
            updateToken('--p-shadow-md', 'none');
            updateToken('--p-shadow-lg', 'none');
            updateToken('--p-shadow-xl', 'none');
        } else if (saved.shadow === 'subtle') {
            const s1 = '0 1px 2px rgba(0,0,0,0.03)';
            const s2 = '0 2px 4px rgba(0,0,0,0.05)';
            const s3 = '0 4px 8px rgba(0,0,0,0.06)';
            const s4 = '0 8px 16px rgba(0,0,0,0.08)';
            updateToken('--lt-shadow-sm', s1);
            updateToken('--lt-shadow-md', s2);
            updateToken('--lt-shadow-lg', s3);
            updateToken('--lt-shadow-xl', s4);
            updateToken('--p-shadow-sm', s1);
            updateToken('--p-shadow-md', s2);
            updateToken('--p-shadow-lg', s3);
            updateToken('--p-shadow-xl', s4);
        } else if (saved.shadow === 'bold') {
            const s1 = '0 2px 4px rgba(0,0,0,0.1)';
            const s2 = '0 8px 16px rgba(0,0,0,0.15)';
            const s3 = '0 16px 32px rgba(0,0,0,0.2)';
            const s4 = '0 24px 48px rgba(0,0,0,0.25)';
            updateToken('--lt-shadow-sm', s1);
            updateToken('--lt-shadow-md', s2);
            updateToken('--lt-shadow-lg', s3);
            updateToken('--lt-shadow-xl', s4);
            updateToken('--p-shadow-sm', s1);
            updateToken('--p-shadow-md', s2);
            updateToken('--p-shadow-lg', s3);
            updateToken('--p-shadow-xl', s4);
        } else {
            const s1 = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
            const s2 = '0 4px 6px -1px rgba(0, 0, 0, 0.07)';
            const s3 = '0 10px 15px -3px rgba(0, 0, 0, 0.08)';
            const s4 = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
            updateToken('--lt-shadow-sm', s1);
            updateToken('--lt-shadow-md', s2);
            updateToken('--lt-shadow-lg', s3);
            updateToken('--lt-shadow-xl', s4);
            updateToken('--p-shadow-sm', s1);
            updateToken('--p-shadow-md', s2);
            updateToken('--p-shadow-lg', s3);
            updateToken('--p-shadow-xl', s4);
        }
    }

    // Apply font if configured
    if (saved.font) {
        let fontVal = "'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif";
        if (saved.font === 'geist') fontVal = "'Geist', 'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif";
        else if (saved.font === 'jakarta' || saved.font === 'sans') fontVal = "'Plus Jakarta Sans', ui-sans-serif, system-ui, -apple-system, sans-serif";
        else if (saved.font === 'outfit') fontVal = "'Outfit', ui-sans-serif, system-ui, -apple-system, sans-serif";
        else if (saved.font === 'mono') fontVal = "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
        updateToken('--lt-font-family', fontVal);
        updateToken('--p-font-family', fontVal);
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

export function applyNeutralSurfaceTokens(neutralName?: string) {
    const root = typeof document !== 'undefined' ? document.documentElement : null;
    if (!root) return;

    const isDark = root.classList.contains('dark') || root.getAttribute('data-theme') === 'dark';
    const activeNeutral = neutralName || loadSavedTheme()?.neutral || 'slate';
    const neutralRamp = AURA_PALETTES[activeNeutral.toLowerCase()] || AURA_PALETTES.slate;

    if (isDark) {
        // Dark Mode: Surface-0 is darkest, text is light
        updateToken('--lt-surface-0', '#090d16');
        updateToken('--p-surface-0', '#090d16');
        updateToken('--lt-surface-50', '#0f172a');
        updateToken('--p-surface-50', '#0f172a');
        updateToken('--lt-surface-100', '#1e293b');
        updateToken('--p-surface-100', '#1e293b');
        updateToken('--lt-surface-200', '#334155');
        updateToken('--p-surface-200', '#334155');
        updateToken('--lt-surface-300', '#475569');
        updateToken('--p-surface-300', '#475569');
        updateToken('--lt-surface-400', '#64748b');
        updateToken('--p-surface-400', '#64748b');
        updateToken('--lt-surface-500', '#94a3b8');
        updateToken('--p-surface-500', '#94a3b8');
        updateToken('--lt-surface-600', '#cbd5e1');
        updateToken('--p-surface-600', '#cbd5e1');
        updateToken('--lt-surface-700', '#e2e8f0');
        updateToken('--p-surface-700', '#e2e8f0');
        updateToken('--lt-surface-800', '#f1f5f9');
        updateToken('--p-surface-800', '#f1f5f9');
        updateToken('--lt-surface-900', '#f8fafc');
        updateToken('--p-surface-900', '#f8fafc');
        updateToken('--lt-surface-950', '#ffffff');
        updateToken('--p-surface-950', '#ffffff');

        updateToken('--lt-text-primary', '#f8fafc');
        updateToken('--p-text-color', '#f8fafc');
        updateToken('--lt-text-secondary', '#cbd5e1');
        updateToken('--lt-text-muted', '#94a3b8');
        updateToken('--p-text-muted', '#94a3b8');
        updateToken('--lt-border-default', '#334155');
        updateToken('--p-border-color', '#334155');
    } else {
        // Light Mode: Surface-0 is white, text is dark
        updateToken('--lt-surface-0', '#ffffff');
        updateToken('--p-surface-0', '#ffffff');
        if (neutralRamp) {
            for (const [shade, hex] of Object.entries(neutralRamp)) {
                updateToken('--lt-surface-' + shade, hex);
                updateToken('--p-surface-' + shade, hex);
            }
        }
        updateToken('--lt-text-primary', '#0f172a');
        updateToken('--p-text-color', '#0f172a');
        updateToken('--lt-text-secondary', '#475569');
        updateToken('--lt-text-muted', '#64748b');
        updateToken('--p-text-muted', '#64748b');
        updateToken('--lt-border-default', '#e2e8f0');
        updateToken('--p-border-color', '#e2e8f0');
    }
}

// Auto-observe dark mode toggles and synchronize tokens
if (typeof window !== 'undefined' && typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver((mutations) => {
        for (const m of mutations) {
            if (m.type === 'attributes' && (m.attributeName === 'class' || m.attributeName === 'data-theme')) {
                applyNeutralSurfaceTokens();
                break;
            }
        }
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] });
}

