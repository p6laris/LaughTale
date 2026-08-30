/**
 * SoftMax.LaughTale: Visual Regression Matrix Harness (LT-604)
 * Generates deterministic 8-permutation render matrices across theme, density, and palette axes.
 */

import { AURA_PALETTES, updateToken } from '../styles/design-tokens';

export interface MatrixPermutation {
    theme: 'light' | 'dark';
    density: 'normal' | 'compact';
    palette: 'emerald' | 'violet';
}

export interface ComponentMatrixSnapshot {
    permutation: MatrixPermutation;
    signature: string;
    tokenValues: Record<string, string>;
    markup: string;
}

export function captureStyleSignature(element: HTMLElement): string {
    const parts: string[] = [];
    parts.push(`tag:${element.tagName.toLowerCase()}`);
    if (element.className) parts.push(`class:${element.className}`);
    if (element.id) parts.push(`id:${element.id}`);

    // Capture child count and structural tags
    parts.push(`children:${element.children.length}`);
    for (let i = 0; i < element.children.length; i++) {
        const child = element.children[i] as HTMLElement;
        parts.push(`child[${i}]:${child.tagName.toLowerCase()}.${child.className || ''}`);
    }

    return parts.join('|');
}

/**
 * Runs a component render function across all 8 permutations:
 * { light, dark } × { normal, compact } × { emerald, violet }
 */
export function renderThemeMatrix(
    renderFn: (container: HTMLElement, perm: MatrixPermutation) => void
): ComponentMatrixSnapshot[] {
    const themes: Array<'light' | 'dark'> = ['light', 'dark'];
    const densities: Array<'normal' | 'compact'> = ['normal', 'compact'];
    const palettes: Array<'emerald' | 'violet'> = ['emerald', 'violet'];

    const snapshots: ComponentMatrixSnapshot[] = [];

    for (const theme of themes) {
        for (const density of densities) {
            for (const palette of palettes) {
                const perm: MatrixPermutation = { theme, density, palette };
                const container = typeof document !== 'undefined'
                    ? document.createElement('div')
                    : ({ innerHTML: '', className: '', style: {}, children: [] } as unknown as HTMLElement);

                container.className = `lt-matrix-container ${theme} ${density}`;
                container.setAttribute('data-theme', theme);
                container.setAttribute('data-density', density);
                container.setAttribute('data-palette', palette);

                // Apply tokens for permutation
                const ramp = AURA_PALETTES[palette] || AURA_PALETTES.emerald;
                for (const [shade, hex] of Object.entries(ramp)) {
                    updateToken(`--lt-primary-${shade}`, hex);
                    updateToken(`--p-primary-${shade}`, hex);
                }

                if (density === 'compact') {
                    updateToken('--lt-content-padding', '0.625rem');
                    updateToken('--p-content-padding', '0.625rem');
                } else {
                    updateToken('--lt-content-padding', '1rem');
                    updateToken('--p-content-padding', '1rem');
                }

                // Render component into container
                renderFn(container, perm);

                const snapshot: ComponentMatrixSnapshot = {
                    permutation: perm,
                    signature: captureStyleSignature(container),
                    tokenValues: {
                        primary500: ramp['500'],
                        padding: density === 'compact' ? '0.625rem' : '1rem',
                        theme
                    },
                    markup: container.innerHTML
                };

                snapshots.push(snapshot);
            }
        }
    }

    return snapshots;
}
