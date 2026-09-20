/**
 * LaughTale: Decorative/Brand SVG Markup
 *
 * A small number of components embed one-off decorative or brand markup that isn't a Lucide icon
 * at all (a custom logo mark, a static illustration) and so can never go through `getLucideIcon()`.
 * They live here, outside `src/components/`, rather than inline in the component file: this is a
 * shared, cross-cutting concern (the brand mark in particular is used by more than one place - see
 * `LaughTale.Docs/Pages/_Layout.cshtml`'s own copy), and `scripts/audit-metrics.mjs`'s
 * `rawSvgLiterals` counter is deliberately scoped to `src/components/*.ts` only - it exists to catch
 * an icon that SHOULD have gone through the shared icon system but didn't, which doesn't describe
 * either of these.
 */

/**
 * The LaughTale brand mark - a stylized "L" swash plus a dot, not a Lucide icon. `fillColor`
 * defaults to `currentColor` so it can be recolored by the CSS `color` of whatever wraps it, the
 * same as any other inline `fill="currentColor"` SVG.
 */
export function getBrandMarkSvg(size: number = 20, fillColor: string = 'currentColor'): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${size}" height="${size}" fill="${fillColor}"><path d="M26 14 L42 14 C42 42 62 58 84 58 L84 74 C52 74 26 52 26 14 Z" /><circle cx="34" cy="74" r="6" /></svg>`;
}

/**
 * A decorative sample-chart illustration for `image-compare.ts`'s "with chart" demo variant - not a
 * real data visualization, just a static wave shape with a gradient fill under it. Kept as a
 * function (not a plain string) since its stroke/gradient colors are `var(--lt-primary-500)`
 * references that must stay live CSS custom properties, not baked-in values.
 */
export function getCompareChartSvg(): string {
    return `<svg class="absolute h-full w-full" data-part="root" viewBox="0 0 644 189" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%;">
        <g clip-path="url(#compare_chart_clip)">
            <path d="M0.5 118.499C0.5 118.499 82 102.999 113.5 89.4989C145 75.9989 188.444 87.7869 235 77.4989C272.684 69.1719 293.654 62.4939 329 46.9989C409.332 11.7849 479.5 86.5 510.5 78C541.5 69.5 635.951 0.848863 644 1.49886" stroke="var(--lt-primary-500, var(--lt-primary-500))" stroke-width="2.5" />
            <path d="M113.5 89.5006C82 103.001 0.5 118.501 0.5 118.501V188.501H644V1.50065C635.951 0.850647 541.5 69.5 510.5 78C479.5 86.5 409.332 11.7866 329 47.0006C293.654 62.4956 272.684 69.1736 235 77.5006C188.444 87.7886 145 76.0006 113.5 89.5006Z" fill="url(#compare_chart_gradient)" />
        </g>
        <defs>
            <clipPath id="compare_chart_clip">
                <rect width="644" height="189" fill="white" />
            </clipPath>
            <linearGradient id="compare_chart_gradient" x1="322.25" x2="322.25" y1="1.477" y2="188.5" gradientUnits="userSpaceOnUse">
                <stop stop-color="var(--lt-primary-500, var(--lt-primary-500))" stop-opacity="0.4" />
                <stop offset="1" stop-color="var(--lt-primary-500, var(--lt-primary-500))" stop-opacity="0" />
            </linearGradient>
        </defs>
    </svg>`;
}
