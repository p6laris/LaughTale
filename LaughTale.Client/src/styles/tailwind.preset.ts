/**
 * LaughTale Tailwind CSS Preset (@laughtale/tailwind-preset / )
 * Maps Tailwind theme tokens to LaughTale's semantic CSS custom properties,
 * enabling seamless interop between Tailwind utility classes and LaughTale islands.
 */

export const laughtaleTailwindPreset = {
    theme: {
        extend: {
            colors: {
                primary: {
                    50: 'var(--lt-primary-50, #ecfdf5)',
                    100: 'var(--lt-primary-100, #d1fae5)',
                    200: 'var(--lt-primary-200, #a7f3d0)',
                    300: 'var(--lt-primary-300, #6ee7b7)',
                    400: 'var(--lt-primary-400, #34d399)',
                    500: 'var(--lt-primary-500, #10b981)',
                    600: 'var(--lt-primary-600, #059669)',
                    700: 'var(--lt-primary-700, #047857)',
                    800: 'var(--lt-primary-800, #065f46)',
                    900: 'var(--lt-primary-900, #064e3b)',
                    950: 'var(--lt-primary-950, #022c22)',
                    DEFAULT: 'var(--lt-primary-500, #10b981)'
                },
                surface: {
                    0: 'var(--lt-surface-0, #ffffff)',
                    50: 'var(--lt-surface-50, #f8fafc)',
                    100: 'var(--lt-surface-100, #f1f5f9)',
                    200: 'var(--lt-surface-200, #e2e8f0)',
                    300: 'var(--lt-surface-300, #cbd5e1)',
                    400: 'var(--lt-surface-400, #94a3b8)',
                    500: 'var(--lt-surface-500, #64748b)',
                    600: 'var(--lt-surface-600, #475569)',
                    700: 'var(--lt-surface-700, #334155)',
                    800: 'var(--lt-surface-800, #1e293b)',
                    900: 'var(--lt-surface-900, #0f172a)',
                    950: 'var(--lt-surface-950, #020617)'
                },
                danger: {
                    50: 'var(--lt-danger-50, #fef2f2)',
                    500: 'var(--lt-danger-500, #ef4444)',
                    600: 'var(--lt-danger-600, #dc2626)',
                    700: 'var(--lt-danger-700, #b91c1c)',
                    DEFAULT: 'var(--lt-danger-500, #ef4444)'
                }
            },
            borderRadius: {
                none: '0',
                xs: 'var(--lt-radius-xs, 0.125rem)',
                sm: 'var(--lt-radius-sm, 0.25rem)',
                md: 'var(--lt-radius-md, 0.375rem)',
                DEFAULT: 'var(--lt-radius, 0.5rem)',
                lg: 'var(--lt-radius-lg, 0.75rem)',
                xl: 'var(--lt-radius-xl, 1rem)',
                full: '9999px'
            },
            fontFamily: {
                sans: 'var(--p-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif)'
            }
        }
    }
};

export default laughtaleTailwindPreset;
