/**
 * SoftMax.LaughTale: Enterprise ProgressBar & ProgressSpinner Component (Aura ProgressBar inspired)
 */

export interface ProgressBarProps {
    value?: number; // 0 - 100
    mode?: 'determinate' | 'indeterminate';
    showValue?: boolean;
    height?: string;
    color?: string;
}

export default function ProgressBarIsland(container: HTMLElement, props: ProgressBarProps) {
    const isIndeterminate = props.mode === 'indeterminate' || props.value === undefined;
    const value = Math.max(0, Math.min(100, props.value || 0));
    const height = props.height || '0.75rem';
    const color = props.color || 'var(--p-primary-600)';

    if (isIndeterminate) {
        container.innerHTML = `
            <div class="laughtale-progress-bar" style="position: relative; height: ${height}; width: 100%; border-radius: 9999px; overflow: hidden; background: var(--p-surface-100);">
                <div style="position: absolute; height: 100%; width: 40%; background: ${color}; border-radius: 9999px; animation: indeterminateProgress 1.5s infinite linear;"></div>
            </div>
            <style>
                @@keyframes indeterminateProgress {
                    0% { left: -40%; width: 40%; }
                    50% { left: 40%; width: 60%; }
                    100% { left: 100%; width: 40%; }
                }
            </style>
        `;
    } else {
        container.innerHTML = `
            <div class="laughtale-progress-bar" style="position: relative; height: ${height}; width: 100%; border-radius: 9999px; overflow: hidden; background: var(--p-surface-100); display: flex; align-items: center;">
                <div style="height: 100%; width: ${value}%; background: ${color}; border-radius: 9999px; transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);"></div>
                ${props.showValue !== false && height >= '1rem' ? `
                    <span style="position: absolute; width: 100%; text-align: center; font-size: 0.6875rem; font-weight: 700; color: #ffffff; text-shadow: 0 1px 2px rgba(0,0,0,0.5); font-family: var(--p-font-mono);">
                        ${value}%
                    </span>
                ` : ''}
            </div>
        `;
    }
}
