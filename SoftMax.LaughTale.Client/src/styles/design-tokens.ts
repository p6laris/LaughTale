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
        '900': '#064e3b'
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
        '900': '#1e3a8a'
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
        '900': '#4c1d95'
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
        '900': '#78350f'
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
        '900': '#881337'
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
        '900': '#164e63'
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
        '900': '#0f172a'
    }
};

export function initDesignTokens(): void {
    if (typeof document === 'undefined') return;
    if (document.getElementById('aura-design-tokens')) return;

    const styleEl = document.createElement('style');
    styleEl.id = 'aura-design-tokens';
    styleEl.textContent = `
:root {
  /* Primary palette (emerald by default) */
  --p-primary-50: #ecfdf5;
  --p-primary-100: #d1fae5;
  --p-primary-200: #a7f3d0;
  --p-primary-300: #6ee7b7;
  --p-primary-400: #34d399;
  --p-primary-500: #10b981;
  --p-primary-600: #059669;
  --p-primary-700: #047857;
  --p-primary-800: #065f46;
  --p-primary-900: #064e3b;
  --p-primary-color: var(--p-primary-500);
  --p-primary-color-text: #ffffff;

  /* Surface palette */
  --p-surface-0: #ffffff;
  --p-surface-50: #f8fafc;
  --p-surface-100: #f1f5f9;
  --p-surface-200: #e2e8f0;
  --p-surface-300: #cbd5e1;
  --p-surface-400: #94a3b8;
  --p-surface-500: #64748b;
  --p-surface-600: #475569;
  --p-surface-700: #334155;
  --p-surface-800: #1e293b;
  --p-surface-900: #0f172a;
  --p-surface-950: #020617;
  --p-text-color: var(--p-surface-900);
  --p-text-muted-color: var(--p-surface-500);

  /* Component tokens */
  --p-content-bg: var(--p-surface-0);
  --p-content-border: var(--p-surface-200);
  --p-content-hover-bg: var(--p-surface-50);
  --p-content-padding: 1rem;

  /* Border radius */
  --p-border-radius: 0.5rem;
  --p-border-radius-sm: 0.375rem;
  --p-border-radius-lg: 0.75rem;
  --p-border-radius-xl: 1rem;
  --p-border-radius-full: 9999px;

  /* Shadows */
  --p-shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --p-shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --p-shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --p-shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);

  /* Focus ring */
  --p-focus-ring-color: var(--p-primary-500);
  --p-focus-ring-width: 2px;
  --p-focus-ring-offset: 2px;
  --p-focus-ring: 0 0 0 var(--p-focus-ring-offset) var(--p-content-bg), 0 0 0 calc(var(--p-focus-ring-offset) + var(--p-focus-ring-width)) var(--p-focus-ring-color);

  /* Transitions */
  --p-transition-duration: 150ms;
  --p-transition-timing: cubic-bezier(0.4, 0, 0.2, 1);

  /* Form field tokens */
  --p-field-border: var(--p-surface-300);
  --p-field-hover-border: var(--p-surface-400);
  --p-field-focus-border: var(--p-primary-500);
  --p-field-bg: var(--p-surface-0);
  --p-field-padding-x: 0.75rem;
  --p-field-padding-y: 0.5rem;

  /* Overlay tokens */
  --p-overlay-bg: var(--p-surface-0);
  --p-overlay-border: var(--p-surface-200);
  --p-overlay-shadow: var(--p-shadow-lg);
}

/* Dark mode overrides */
[data-theme="dark"], .dark {
  --p-surface-0: #09090b;
  --p-surface-50: #18181b;
  --p-surface-100: #27272a;
  --p-surface-200: #3f3f46;
  --p-surface-300: #52525b;
  --p-surface-400: #71717a;
  --p-surface-500: #a1a1aa;
  --p-surface-600: #d4d4d8;
  --p-surface-700: #e4e4e7;
  --p-surface-800: #f4f4f5;
  --p-surface-900: #fafafa;
  --p-surface-950: #ffffff;
  
  --p-text-color: var(--p-surface-50);
  --p-text-muted-color: var(--p-surface-400);
  --p-content-bg: var(--p-surface-900);
  --p-content-border: var(--p-surface-700);
  --p-content-hover-bg: var(--p-surface-800);
  --p-field-bg: var(--p-surface-800);
  --p-field-border: var(--p-surface-600);
  --p-field-hover-border: var(--p-surface-500);
  --p-overlay-bg: var(--p-surface-800);
  --p-overlay-border: var(--p-surface-700);
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]):not(.light) {
    --p-surface-0: #09090b;
    --p-surface-50: #18181b;
    --p-surface-100: #27272a;
    --p-surface-200: #3f3f46;
    --p-surface-300: #52525b;
    --p-surface-400: #71717a;
    --p-surface-500: #a1a1aa;
    --p-surface-600: #d4d4d8;
    --p-surface-700: #e4e4e7;
    --p-surface-800: #f4f4f5;
    --p-surface-900: #fafafa;
    --p-surface-950: #ffffff;
    
    --p-text-color: var(--p-surface-50);
    --p-text-muted-color: var(--p-surface-400);
    --p-content-bg: var(--p-surface-900);
    --p-content-border: var(--p-surface-700);
    --p-content-hover-bg: var(--p-surface-800);
    --p-field-bg: var(--p-surface-800);
    --p-field-border: var(--p-surface-600);
    --p-field-hover-border: var(--p-surface-500);
    --p-overlay-bg: var(--p-surface-800);
    --p-overlay-border: var(--p-surface-700);
  }
}
    `;
    document.head.appendChild(styleEl);
}

export function updateToken(name: string, value: string): void {
    if (typeof document !== 'undefined') {
        document.documentElement.style.setProperty(name, value);
    }
}

export function getToken(name: string): string {
    if (typeof document !== 'undefined') {
        return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    }
    return '';
}
