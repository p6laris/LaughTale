import { injectIslandStyle } from '../runtime/styles';
/**
 * SoftMax.LaughTale: Enterprise Event & Audit Log Timeline Component
 */

export interface TimelineEvent {
    id: string;
    title: string;
    description: string;
    timestamp: string;
    status: 'completed' | 'in_progress' | 'warning' | 'failed';
    actor?: string;
    icon?: string;
}

export interface TimelineProps {
    events: TimelineEvent[];
    title?: string;
}


const CSS = `
[data-theme="dark"] .timeline-item {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .laughtale-timeline {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
`;

export default function TimelineIsland(container: HTMLElement, props: TimelineProps) {
    injectIslandStyle('timeline', CSS);
    const statusBadges = {
        completed: { bg: '#ecfdf5', color: '#047857', border: '#a7f3d0', label: 'Completed', dot: '#10b981' },
        in_progress: { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe', label: 'In Progress', dot: '#3b82f6' },
        warning: { bg: '#fffbeb', color: '#b45309', border: '#fde68a', label: 'Warning', dot: '#f59e0b' },
        failed: { bg: '#fef2f2', color: '#b91c1c', border: '#fecaca', label: 'Failed', dot: '#ef4444' }
    };

    const items = props.events.map((evt, idx) => {
        const badge = statusBadges[evt.status] || statusBadges.completed;
        const isLast = idx === props.events.length - 1;

        return `
            <div class="timeline-item" style="display: flex; gap: 1.25rem; position: relative;">
                <!-- Vertical Line & Indicator Dot -->
                <div style="display: flex; flex-direction: column; align-items: center;">
                    <div style="width: 1.5rem; height: 1.5rem; border-radius: 50%; background: ${badge.bg}; border: 2px solid ${badge.dot}; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; z-index: 1;">
                        ${evt.icon || '•'}
                    </div>
                    ${!isLast ? `<div style="width: 2px; flex: 1; background: var(--p-surface-200); margin: 0.25rem 0;"></div>` : ''}
                </div>

                <!-- Event Details Card -->
                <div style="flex: 1; padding-bottom: ${isLast ? '0' : '1.5rem'};">
                    <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; flex-wrap: wrap;">
                        <div style="font-size: 0.875rem; font-weight: 600; color: var(--p-surface-950);">${evt.title}</div>
                        <span style="font-size: 0.6875rem; padding: 0.15rem 0.5rem; border-radius: var(--p-border-radius); background: ${badge.bg}; color: ${badge.color}; border: 1px solid ${badge.border}; font-weight: 600;">
                            ${badge.label}
                        </span>
                    </div>

                    <p style="font-size: 0.8125rem; color: var(--p-surface-600); margin-top: 0.35rem; line-height: 1.5;">${evt.description}</p>

                    <div style="display: flex; align-items: center; gap: 1rem; margin-top: 0.5rem; font-size: 0.75rem; color: var(--p-surface-400); font-family: var(--p-font-mono);">
                        <span>🕒 ${evt.timestamp}</span>
                        ${evt.actor ? `<span>👤 ${evt.actor}</span>` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = `
        <div class="laughtale-timeline" style="display: flex; flex-direction: column; gap: 1rem;">
            ${props.title ? `<div style="font-size: 1rem; font-weight: 700; color: var(--p-surface-900); padding-bottom: 0.75rem; border-bottom: 1px solid var(--p-border-color);">${props.title}</div>` : ''}
            <div style="display: flex; flex-direction: column;">
                ${items}
            </div>
        </div>
    `;
}
