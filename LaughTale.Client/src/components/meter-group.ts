import { resolvePart, applyPart, type PassthroughRecord } from '../runtime/parts';
import type { IslandContext } from '../runtime/registry';
import { injectIslandStyle } from '../runtime/styles';
import { html, setHtml, url as safeUrl, unsafe, attr, type Raw } from '../runtime/html';

/**
 * LaughTale: Enterprise MeterGroup Component (Aura Design System compliant)
 * Multi-segmented capacity and distribution gauge supporting horizontal/vertical tracks,
 * custom label positioning, legend markers, and theme studio design tokens.
 */

export interface MeterValue {
    label: string;
    value: number;
    color?: string;
    icon?: string;
}

export interface MeterGroupProps {
    values?: MeterValue[];
    value?: MeterValue[];
    meters?: MeterValue[];
    max?: number;
    min?: number;
    orientation?: 'horizontal' | 'vertical';
    labelPosition?: 'start' | 'end';
    labelOrientation?: 'horizontal' | 'vertical';
    title?: string;
    showLabels?: boolean;
    class?: string;
    style?: string;
    pt?: PassthroughRecord;
    studioOverrides?: Record<string, any>;
}

const METER_GROUP_CSS = `
island-meter-group,
p-metergroup {
    display: contents !important;
}

.p-metergroup {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    width: 100%;
    box-sizing: border-box;
    font-family: var(--p-font-family, inherit);
}

.p-metergroup-vertical {
    flex-direction: row;
    align-items: stretch;
    height: 100%;
}

.p-metergroup-meters {
    display: flex;
    position: relative;
    overflow: hidden;
    height: var(--p-metergroup-meters-size, 0.75rem);
    background: var(--p-metergroup-meters-background, var(--p-surface-200, #e2e8f0));
    border-radius: var(--p-metergroup-meters-border-radius, var(--p-border-radius, 6px));
    width: 100%;
    gap: 2px;
}

.p-metergroup-vertical .p-metergroup-meters {
    flex-direction: column-reverse;
    width: var(--p-metergroup-meters-size, 0.75rem);
    height: 100%;
    min-height: 10rem;
}

.p-metergroup-meter {
    height: 100%;
    display: block;
    border-radius: 2px;
    transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1), height 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.p-metergroup-vertical .p-metergroup-meter {
    width: 100% !important;
}

.p-metergroup-labels {
    display: flex;
    flex-wrap: wrap;
    gap: 1.25rem;
    list-style: none;
    margin: 0;
    padding: 0;
}

.p-metergroup-labels-vertical {
    flex-direction: column;
    gap: 0.75rem;
}

.p-metergroup-label {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8125rem;
}

.p-metergroup-label-marker {
    display: inline-block;
    width: 0.625rem;
    height: 0.625rem;
    border-radius: 50%;
    flex-shrink: 0;
}

.p-metergroup-label-text {
    color: var(--p-metergroup-label-color, var(--p-text-muted, #64748b));
    font-weight: 500;
}

.p-metergroup-label-value {
    color: var(--p-metergroup-label-value-color, var(--p-text-color, #1e293b));
    font-weight: 700;
    font-family: var(--p-font-mono, monospace);
    font-size: 0.8125rem;
}

/* Dark Mode Tokens */
html.dark .p-metergroup-meters,
[data-theme="dark"] .p-metergroup-meters,
.dark .p-metergroup-meters {
    background: var(--p-surface-700, #334155);
}

html.dark .p-metergroup-label-text,
[data-theme="dark"] .p-metergroup-label-text,
.dark .p-metergroup-label-text {
    color: var(--p-text-muted, #94a3b8);
}

html.dark .p-metergroup-label-value,
[data-theme="dark"] .p-metergroup-label-value,
.dark .p-metergroup-label-value {
    color: var(--p-text-color, #f8fafc);
}
`;

const DEFAULT_COLORS = [
    'var(--p-primary-color, #10b981)',
    '#3b82f6',
    '#f59e0b',
    '#8b5cf6',
    '#ec4899',
    '#06b6d4',
    '#94a3b8'
];

export default function MeterGroupIsland(container: HTMLElement, props: MeterGroupProps, ctx?: IslandContext) {
    injectIslandStyle('meter-group', METER_GROUP_CSS);

    let rawValues: MeterValue[] = [];
    const source = props.values || props.value || props.meters;

    if (typeof source === 'string') {
        try {
            rawValues = JSON.parse(source);
        } catch {
            rawValues = [];
        }
    } else if (Array.isArray(source)) {
        rawValues = source;
    }

    const max = props.max ?? 100;
    const isVertical = props.orientation === 'vertical';
    const isLabelVertical = props.labelOrientation === 'vertical' || isVertical;
    const labelPos = props.labelPosition || 'end';

    const barSegmentsHtml = rawValues.map((v: MeterValue, idx: number) => {
        const val = v?.value || 0;
        const pct = max > 0 ? Math.min(100, Math.max(0, (val / max) * 100)) : 0;
        const color = v?.color || DEFAULT_COLORS[idx % DEFAULT_COLORS.length];
        const dimensionStyle = isVertical ? `height: ${pct}%;` : `width: ${pct}%;`;

        return html`<span class="p-metergroup-meter" style="background: ${color}; ${dimensionStyle}" title="${v?.label || ''}: ${val}%"></span>`;
    });

    const legendItemsHtml = rawValues.map((v: MeterValue, idx: number) => {
        const color = v?.color || DEFAULT_COLORS[idx % DEFAULT_COLORS.length];
        return html`
            <li class="p-metergroup-label">
                <span class="p-metergroup-label-marker" style="background-color: ${color};"></span>
                <span class="p-metergroup-label-text">${v?.label || ''}</span>
                <span class="p-metergroup-label-value">${v?.value ?? 0}%</span>
            </li>
        `;
    });

    const metersBlockHtml = html`<div class="p-metergroup-meters">${barSegmentsHtml}</div>`;
    const labelsBlockHtml = props.showLabels !== false && rawValues.length > 0
        ? html`<ul class="p-metergroup-labels ${isLabelVertical ? 'p-metergroup-labels-vertical' : 'p-metergroup-labels-horizontal'}">${legendItemsHtml}</ul>`
        : '';

    const rootEl = document.createElement('div');
    rootEl.className = `p-metergroup p-component ${isVertical ? 'p-metergroup-vertical' : 'p-metergroup-horizontal'} ${props.class || ''}`.trim();
    if (props.style) rootEl.style.cssText += props.style;

    if (labelPos === 'start') {
        setHtml(rootEl, html`${labelsBlockHtml}${metersBlockHtml}`);
    } else {
        setHtml(rootEl, html`${metersBlockHtml}${labelsBlockHtml}`);
    }

    setHtml(container, html``);
    container.appendChild(rootEl);

    container.setAttribute('data-part', 'root');
    applyPart(container, 'root', props.class || '', props.pt, props.studioOverrides);
}
