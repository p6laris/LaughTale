/**
 * SoftMax.LaughTale: Canonical Design Token Contract (LT-601)
 * Single source of truth for dynamic CSS custom properties across light/dark themes.
 */

export const AURA_PALETTES: Record<string, Record<string, string>> = {
    emerald: {
        '50': '#ecfdf5',
        '100': '#d1fae5',
        '200': '#a7f3d0',
        '300': '#6ee7b7',
        '400': '#34d399',
        '500': '#10b981',
        '600': '#059669',
        '700': '#047857',
        '800': '#065f46',
        '900': '#064e3b',
        '950': '#022c22'
    },
    blue: {
        '50': '#eff6ff',
        '100': '#dbeafe',
        '200': '#bfdbfe',
        '300': '#93c5fd',
        '400': '#60a5fa',
        '500': '#3b82f6',
        '600': '#2563eb',
        '700': '#1d4ed8',
        '800': '#1e40af',
        '900': '#1e3a8a',
        '950': '#172554'
    },
    violet: {
        '50': '#f5f3ff',
        '100': '#ede9fe',
        '200': '#ddd6fe',
        '300': '#c4b5fd',
        '400': '#a78bfa',
        '500': '#8b5cf6',
        '600': '#7c3aed',
        '700': '#6d28d9',
        '800': '#5b21b6',
        '900': '#4c1d95',
        '950': '#2e1065'
    },
    amber: {
        '50': '#fffbeb',
        '100': '#fef3c7',
        '200': '#fde68a',
        '300': '#fcd34d',
        '400': '#fbbf24',
        '500': '#f59e0b',
        '600': '#d97706',
        '700': '#b45309',
        '800': '#92400e',
        '900': '#78350f',
        '950': '#451a03'
    },
    rose: {
        '50': '#fff1f2',
        '100': '#ffe4e6',
        '200': '#fecdd3',
        '300': '#fda4af',
        '400': '#fb7185',
        '500': '#f43f5e',
        '600': '#e11d48',
        '700': '#be123c',
        '800': '#9f1239',
        '900': '#881337',
        '950': '#4c0519'
    },
    cyan: {
        '50': '#ecfeff',
        '100': '#cffafe',
        '200': '#a5f3fc',
        '300': '#67e8f9',
        '400': '#22d3ee',
        '500': '#06b6d4',
        '600': '#0891b2',
        '700': '#0e7490',
        '800': '#155e75',
        '900': '#164e63',
        '950': '#083344'
    },
    slate: {
        '50': '#f8fafc',
        '100': '#f1f5f9',
        '200': '#e2e8f0',
        '300': '#cbd5e1',
        '400': '#94a3b8',
        '500': '#64748b',
        '600': '#475569',
        '700': '#334155',
        '800': '#1e293b',
        '900': '#0f172a',
        '950': '#020617'
    },
    zinc: {
        '50': '#fafafa',
        '100': '#f4f4f5',
        '200': '#e4e4e7',
        '300': '#d4d4d8',
        '400': '#a1a1aa',
        '500': '#71717a',
        '600': '#52525b',
        '700': '#3f3f46',
        '800': '#27272a',
        '900': '#18181b',
        '950': '#09090b'
    }
};

export function initDesignTokens(): void {
    if (typeof document === 'undefined') return;
    if (document.getElementById('laughtale-design-tokens')) return;

    const styleEl = document.createElement('style');
    styleEl.id = 'laughtale-design-tokens';
    styleEl.textContent = `
:root {
  /* Primary palette (emerald by default) */
  --lt-primary-50: #ecfdf5;
  --lt-primary-100: #d1fae5;
  --lt-primary-200: #a7f3d0;
  --lt-primary-300: #6ee7b7;
  --lt-primary-400: #34d399;
  --lt-primary-500: #10b981;
  --lt-primary-600: #059669;
  --lt-primary-700: #047857;
  --lt-primary-800: #065f46;
  --lt-primary-900: #064e3b;
  --lt-primary-950: #022c22;
  --lt-primary-color: var(--lt-primary-500);
  --lt-primary-color-text: #ffffff;

  /* Backward Compatibility Aliases (--p-*) */
  --p-primary-50: var(--lt-primary-50);
  --p-primary-100: var(--lt-primary-100);
  --p-primary-200: var(--lt-primary-200);
  --p-primary-300: var(--lt-primary-300);
  --p-primary-400: var(--lt-primary-400);
  --p-primary-500: var(--lt-primary-500);
  --p-primary-600: var(--lt-primary-600);
  --p-primary-700: var(--lt-primary-700);
  --p-primary-800: var(--lt-primary-800);
  --p-primary-900: var(--lt-primary-900);
  --p-primary-950: var(--lt-primary-950);
  --p-primary-color: var(--lt-primary-color);
  --p-primary-color-text: var(--lt-primary-color-text);

  /* Surface palette (light mode defaults) */
  --lt-surface-0: #ffffff;
  --lt-surface-50: #f8fafc;
  --lt-surface-100: #f1f5f9;
  --lt-surface-200: #e2e8f0;
  --lt-surface-300: #cbd5e1;
  --lt-surface-400: #94a3b8;
  --lt-surface-500: #64748b;
  --lt-surface-600: #475569;
  --lt-surface-700: #334155;
  --lt-surface-800: #1e293b;
  --lt-surface-900: #0f172a;
  --lt-surface-950: #020617;

  /* Backward Compatibility Surface Aliases */
  --p-surface-0: var(--lt-surface-0);
  --p-surface-50: var(--lt-surface-50);
  --p-surface-100: var(--lt-surface-100);
  --p-surface-200: var(--lt-surface-200);
  --p-surface-300: var(--lt-surface-300);
  --p-surface-400: var(--lt-surface-400);
  --p-surface-500: var(--lt-surface-500);
  --p-surface-600: var(--lt-surface-600);
  --p-surface-700: var(--lt-surface-700);
  --p-surface-800: var(--lt-surface-800);
  --p-surface-900: var(--lt-surface-900);
  --p-surface-950: var(--lt-surface-950);

  /* Text tokens */
  --lt-text-primary: var(--lt-surface-900);
  --lt-text-secondary: var(--lt-surface-600);
  --lt-text-muted: var(--lt-surface-500);
  --lt-text-inverse: var(--lt-surface-0);
  --p-text-color: var(--lt-text-primary);
  --p-text-muted-color: var(--lt-text-muted);

  /* Border tokens */
  --lt-border-subtle: var(--lt-surface-100);
  --lt-border-default: var(--lt-surface-200);
  --lt-border-strong: var(--lt-surface-300);

  /* Semantic tokens */
  --lt-success-bg: #ecfdf5;
  --lt-success-fg: #059669;
  --lt-success-border: #a7f3d0;

  --lt-warning-bg: #fffbeb;
  --lt-warning-fg: #d97706;
  --lt-warning-border: #fde68a;

  --lt-danger-bg: #fef2f2;
  --lt-danger-fg: #dc2626;
  --lt-danger-border: #fecaca;

  --lt-info-bg: #eff6ff;
  --lt-info-fg: #2563eb;
  --lt-info-border: #bfdbfe;

  /* Component tokens */
  --lt-content-bg: var(--lt-surface-0);
  --lt-content-border: var(--lt-border-default);
  --lt-content-hover-bg: var(--lt-surface-50);
  --lt-content-padding: 1rem;
  --p-content-bg: var(--lt-content-bg);
  --p-content-border: var(--lt-content-border);
  --p-content-hover-bg: var(--lt-content-hover-bg);
  --p-content-padding: var(--lt-content-padding);

  /* Border radius */
  --lt-radius-none: 0px;
  --lt-radius-sm: 0.375rem;
  --lt-radius-md: 0.5rem;
  --lt-radius-lg: 0.75rem;
  --lt-radius-xl: 1rem;
  --lt-radius-full: 9999px;
  --p-border-radius: var(--lt-radius-md);
  --p-border-radius-sm: var(--lt-radius-sm);
  --p-border-radius-lg: var(--lt-radius-lg);
  --p-border-radius-xl: var(--lt-radius-xl);
  --p-border-radius-full: var(--lt-radius-full);

  /* Shadows */
  --lt-shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --lt-shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --lt-shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --lt-shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  --p-shadow-sm: var(--lt-shadow-sm);
  --p-shadow-md: var(--lt-shadow-md);
  --p-shadow-lg: var(--lt-shadow-lg);
  --p-shadow-xl: var(--lt-shadow-xl);

  /* Focus ring */
  --lt-focus-ring-color: var(--lt-primary-500);
  --lt-focus-ring-width: 2px;
  --lt-focus-ring-offset: 2px;
  --lt-focus-ring: 0 0 0 var(--lt-focus-ring-offset) var(--lt-content-bg), 0 0 0 calc(var(--lt-focus-ring-offset) + var(--lt-focus-ring-width)) var(--lt-focus-ring-color);
  --p-focus-ring-color: var(--lt-focus-ring-color);
  --p-focus-ring-width: var(--lt-focus-ring-width);
  --p-focus-ring-offset: var(--lt-focus-ring-offset);
  --p-focus-ring: var(--lt-focus-ring);

  /* Transitions */
  --lt-duration-fast: 100ms;
  --lt-duration-normal: 150ms;
  --lt-duration-slow: 300ms;
  --p-transition-duration: var(--lt-duration-normal);
  --p-transition-timing: cubic-bezier(0.4, 0, 0.2, 1);

  /* Form field tokens */
  --lt-field-border: var(--lt-border-strong);
  --lt-field-hover-border: var(--lt-surface-400);
  --lt-field-focus-border: var(--lt-primary-500);
  --lt-field-bg: var(--lt-surface-0);
  --lt-field-padding-x: 0.75rem;
  --lt-field-padding-y: 0.5rem;
  --p-field-border: var(--lt-field-border);
  --p-field-hover-border: var(--lt-field-hover-border);
  --p-field-focus-border: var(--lt-field-focus-border);
  --p-field-bg: var(--lt-field-bg);
  --p-field-padding-x: var(--lt-field-padding-x);
  --p-field-padding-y: var(--lt-field-padding-y);

  /* Overlay tokens */
  --lt-overlay-bg: var(--lt-surface-0);
  --lt-overlay-border: var(--lt-border-default);
  --lt-overlay-shadow: var(--lt-shadow-lg);
  --p-overlay-bg: var(--lt-overlay-bg);
  --p-overlay-border: var(--lt-overlay-border);
  --p-overlay-shadow: var(--lt-overlay-shadow);
}

/* Dark mode overrides */
[data-theme="dark"], .dark {
  --lt-surface-0: #09090b;
  --lt-surface-50: #18181b;
  --lt-surface-100: #27272a;
  --lt-surface-200: #3f3f46;
  --lt-surface-300: #52525b;
  --lt-surface-400: #71717a;
  --lt-surface-500: #a1a1aa;
  --lt-surface-600: #d4d4d8;
  --lt-surface-700: #e4e4e7;
  --lt-surface-800: #f4f4f5;
  --lt-surface-900: #fafafa;
  --lt-surface-950: #ffffff;
  
  --lt-text-primary: var(--lt-surface-900);
  --lt-text-secondary: var(--lt-surface-600);
  --lt-text-muted: var(--lt-surface-400);
  --lt-text-inverse: var(--lt-surface-0);

  --lt-border-subtle: var(--lt-surface-100);
  --lt-border-default: var(--lt-surface-200);
  --lt-border-strong: var(--lt-surface-300);

  --lt-success-bg: #064e3b;
  --lt-success-fg: #6ee7b7;
  --lt-success-border: #047857;

  --lt-warning-bg: #78350f;
  --lt-warning-fg: #fcd34d;
  --lt-warning-border: #b45309;

  --lt-danger-bg: #7f1d1d;
  --lt-danger-fg: #fca5a5;
  --lt-danger-border: #b91c1c;

  --lt-info-bg: #1e3a8a;
  --lt-info-fg: #93c5fd;
  --lt-info-border: #1d4ed8;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]):not(.light) {
    --lt-surface-0: #09090b;
    --lt-surface-50: #18181b;
    --lt-surface-100: #27272a;
    --lt-surface-200: #3f3f46;
    --lt-surface-300: #52525b;
    --lt-surface-400: #71717a;
    --lt-surface-500: #a1a1aa;
    --lt-surface-600: #d4d4d8;
    --lt-surface-700: #e4e4e7;
    --lt-surface-800: #f4f4f5;
    --lt-surface-900: #fafafa;
    --lt-surface-950: #ffffff;
    
    --lt-text-primary: var(--lt-surface-900);
    --lt-text-secondary: var(--lt-surface-600);
    --lt-text-muted: var(--lt-surface-400);
    --lt-text-inverse: var(--lt-surface-0);

    --lt-border-subtle: var(--lt-surface-100);
    --lt-border-default: var(--lt-surface-200);
    --lt-border-strong: var(--lt-surface-300);

    --lt-success-bg: #064e3b;
    --lt-success-fg: #6ee7b7;
    --lt-success-border: #047857;

    --lt-warning-bg: #78350f;
    --lt-warning-fg: #fcd34d;
    --lt-warning-border: #b45309;

    --lt-danger-bg: #7f1d1d;
    --lt-danger-fg: #fca5a5;
    --lt-danger-border: #b91c1c;

    --lt-info-bg: #1e3a8a;
    --lt-info-fg: #93c5fd;
    --lt-info-border: #1d4ed8;
  }
}
    `;
    document.head.appendChild(styleEl);
}

export function updateToken(name: string, value: string): void {
    if (typeof document !== 'undefined') {
        document.documentElement.style.setProperty(name, value);
        // Sync backward compat alias if applicable
        if (name.startsWith('--lt-')) {
            document.documentElement.style.setProperty(name.replace('--lt-', '--p-'), value);
        } else if (name.startsWith('--p-')) {
            document.documentElement.style.setProperty(name.replace('--p-', '--lt-'), value);
        }
    }
}

export function getToken(name: string): string {
    if (typeof document !== 'undefined') {
        return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    }
    return '';
}

export { generatePaletteRamp, hexToOklch, oklchToHex, type OklchColor, type RgbColor } from './palette-generator';
export { saveTheme, loadSavedTheme, applySavedTheme, generateThemeExports, type SavedThemeConfig, THEME_STORAGE_KEY } from './theme-persistence';
export { calculateRelativeLuminance, calculateContrastRatio, checkWcagCompliance, type WcagComplianceResult } from './contrast-checker';

