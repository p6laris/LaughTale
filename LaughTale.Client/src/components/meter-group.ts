import { injectIslandStyle } from '../runtime/styles';
/**
 * LaughTale: Enterprise MeterGroup Gauge Component (Aura MeterGroup inspired)
 */

export interface MeterValue {
    label: string;
    value: number; // Percentage (e.g. 40)
    color: string; // Hex or CSS color
    icon?: string;
}

export interface MeterGroupProps {
    values: MeterValue[];
    title?: string;
    showLabels?: boolean;
}


const CSS = `
[data-theme="dark"] .laughtale-meter-group {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
`;

export default function MeterGroupIsland(container: HTMLElement, props: MeterGroupProps) {
    injectIslandStyle('meter-group', CSS);
    const total = props.values.reduce((acc, curr) => acc + curr.value, 0);

    const barSegments = props.values.map((v) => {
        const pct = total > 0 ? (v.value / total) * 100 : 0;
        return `
            <div style="height: 100%; width: ${pct}%; background: ${v.color}; transition: width 0.4s ease;" title="${v.label}: ${v.value}%"></div>
        `;
    }).join('');

    const legendItems = props.values.map((v) => `
        <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem;">
            <div style="width: 0.625rem; height: 0.625rem; border-radius: 50%; background: ${v.color}; flex-shrink: 0;"></div>
            <span style="color: var(--p-surface-600);">${v.label}</span>
            <span style="font-weight: 700; color: var(--p-surface-900); font-family: var(--p-font-mono);">${v.value}%</span>
        </div>
    `).join('');

    container.innerHTML = `
        <div class="laughtale-metergroup" style="display: flex; flex-direction: column; gap: 0.75rem; width: 100%;">
            ${props.title ? `<div style="font-size: 0.875rem; font-weight: 700; color: var(--p-surface-900);">${props.title}</div>` : ''}
            
            <!-- Meter Track -->
            <div style="display: flex; height: 0.75rem; border-radius: 9999px; overflow: hidden; background: var(--p-surface-100); border: 1px solid var(--p-border-color); gap: 2px;">
                ${barSegments}
            </div>

            <!-- Legend List -->
            ${props.showLabels !== false ? `
                <div style="display: flex; flex-wrap: wrap; gap: 1.25rem; margin-top: 0.25rem;">
                    ${legendItems}
                </div>
            ` : ''}
        </div>
    `;
}
