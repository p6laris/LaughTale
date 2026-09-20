import { resolvePart, applyPart, type PassthroughRecord } from '../runtime/parts';
import type { IslandContext } from '../runtime/registry';
/**
 * LaughTale: Enterprise Timeline Component (Aura Design System compliant)
 * Flexible chronological event sequence visualizer supporting vertical/horizontal orientations,
 * multiple alignment modes (left, right, alternate, top, bottom), custom rich cards,
 * interactive step-based workflows, and activity feeds.
 */

import { injectIslandStyle } from '../runtime/styles';
import { html, setHtml, url as safeUrl, unsafe, attr, type Raw } from '../runtime/html';
import type { PatternDeclaration } from '../accessibility/patterns';
import { getLucideIcon } from '../icons/lucide';

export const a11y: PatternDeclaration = {
    kind: 'native',
    element: 'ol'
};

export interface TimelineProps {
    value?: any[];
    events?: any[];
    align?: 'left' | 'right' | 'alternate' | 'top' | 'bottom';
    layout?: 'vertical' | 'horizontal';
    title?: string;
    interactive?: boolean;
    activityFeed?: boolean;
    pt?: PassthroughRecord;
    studioOverrides?: Record<string, any>;
}

const TIMELINE_CSS = `
.p-timeline,
island-timeline {
    display: flex;
    flex-grow: 1;
    list-style: none;
    margin: 0;
    padding: 0;
    font-family: var(--p-font-family, inherit);
    color: var(--p-text-color, var(--lt-surface-700));
    box-sizing: border-box;
}

.p-timeline-vertical {
    flex-direction: column;
}

.p-timeline-horizontal {
    flex-direction: row;
    width: 100%;
    overflow-x: auto;
    padding: 1.5rem 0.5rem;
}

.p-timeline-event {
    display: flex;
    position: relative;
    min-height: 4.5rem;
    box-sizing: border-box;
}

.p-timeline-vertical.p-timeline-left .p-timeline-event {
    flex-direction: row;
}

.p-timeline-vertical.p-timeline-right .p-timeline-event {
    flex-direction: row-reverse;
}

.p-timeline-vertical.p-timeline-alternate .p-timeline-event:nth-child(even) {
    flex-direction: row-reverse;
}

.p-timeline-event-opposite {
    flex: 1;
    padding: 0.125rem 1rem 1rem 1rem;
    font-size: 0.8125rem;
    color: var(--p-text-muted, var(--lt-surface-500));
}

.p-timeline-vertical.p-timeline-left .p-timeline-event-opposite {
    text-align: right;
}

.p-timeline-vertical.p-timeline-right .p-timeline-event-opposite {
    text-align: left;
}

.p-timeline-vertical.p-timeline-alternate .p-timeline-event:nth-child(odd) .p-timeline-event-opposite {
    text-align: right;
}
.p-timeline-vertical.p-timeline-alternate .p-timeline-event:nth-child(even) .p-timeline-event-opposite {
    text-align: left;
}

.p-timeline-event-content {
    flex: 1;
    padding: 0.125rem 1rem 1.5rem 1rem;
    text-align: left;
}

.p-timeline-vertical.p-timeline-right .p-timeline-event-content {
    text-align: right;
}

.p-timeline-vertical.p-timeline-alternate .p-timeline-event:nth-child(even) .p-timeline-event-content {
    text-align: right;
}

.p-timeline-event-separator {
    flex: 0 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
}

.p-timeline-event-marker {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
    border-radius: 9999px;
    z-index: 2;
}

/* Default marker dot */
.p-timeline-event-marker.p-marker-default {
    width: 0.875rem;
    height: 0.875rem;
    border: 2px solid var(--p-primary-color, var(--lt-primary-500, #10b981));
    background: var(--p-content-bg, var(--p-surface-0, #ffffff));
    margin-top: 0.25rem;
    border-radius: 9999px;
    box-sizing: border-box;
}

.p-timeline-vertical .p-timeline-event-connector {
    flex-grow: 1;
    width: 2px;
    background-color: var(--p-border-color, var(--lt-surface-200, #e2e8f0));
    margin: 0.25rem 0;
}

/* Horizontal layout styling with continuous locked axis */
.p-timeline-horizontal .p-timeline-event {
    display: flex;
    flex-direction: column;
    flex: 1 1 0;
    min-height: auto;
    min-width: 8rem;
    align-items: center;
    position: relative;
}

.p-timeline-horizontal .p-timeline-event-separator {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
    position: relative;
    min-height: 1.5rem;
}

.p-timeline-horizontal .p-timeline-event-marker {
    margin: 0 !important;
}

.p-timeline-horizontal .p-timeline-event-marker.p-marker-default {
    margin-top: 0 !important;
}

.p-timeline-horizontal .p-timeline-event-connector {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 2px;
    background-color: var(--p-border-color, var(--lt-surface-300, #cbd5e1));
    transform: translateY(-50%);
    z-index: 1;
}

.p-timeline-horizontal .p-timeline-event-opposite,
.p-timeline-horizontal .p-timeline-event-content {
    padding: 0.5rem 0.25rem;
    text-align: center !important;
    min-height: 1.5rem;
    width: 100%;
    box-sizing: border-box;
}

/* Top Align: separator is on top, content below */
.p-timeline-horizontal.p-timeline-top .p-timeline-event-separator {
    order: 1;
}
.p-timeline-horizontal.p-timeline-top .p-timeline-event-content {
    order: 2;
}
.p-timeline-horizontal.p-timeline-top .p-timeline-event-opposite {
    display: none;
}

/* Bottom Align: content on top, separator at bottom */
.p-timeline-horizontal.p-timeline-bottom .p-timeline-event-opposite {
    display: none;
}
.p-timeline-horizontal.p-timeline-bottom .p-timeline-event-content {
    order: 1;
}
.p-timeline-horizontal.p-timeline-bottom .p-timeline-event-separator {
    order: 2;
}

/* Alternate Align */
.p-timeline-horizontal.p-timeline-alternate .p-timeline-event:nth-child(even) .p-timeline-event-content {
    order: 1;
}
.p-timeline-horizontal.p-timeline-alternate .p-timeline-event:nth-child(even) .p-timeline-event-separator {
    order: 2;
}
.p-timeline-horizontal.p-timeline-alternate .p-timeline-event:nth-child(even) .p-timeline-event-opposite {
    order: 3;
}
.p-timeline-horizontal.p-timeline-alternate .p-timeline-event:nth-child(odd) .p-timeline-event-opposite {
    order: 1;
}
.p-timeline-horizontal.p-timeline-alternate .p-timeline-event:nth-child(odd) .p-timeline-event-separator {
    order: 2;
}
.p-timeline-horizontal.p-timeline-alternate .p-timeline-event:nth-child(odd) .p-timeline-event-content {
    order: 3;
}

/* Rich custom event card */
.p-timeline-card {
    padding: 1.25rem;
    border-radius: var(--p-border-radius-xl, 12px);
    background: var(--p-content-bg, var(--p-surface-0, #ffffff));
    border: 1px solid var(--p-border-color, var(--lt-surface-200));
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
    margin-bottom: 1rem;
    text-align: left;
}

.p-timeline-avatar {
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 9999px;
    font-weight: 700;
    font-size: 0.8125rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: #ffffff;
}

.p-timeline-pulse {
    animation: timelinePulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes timelinePulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: .85; transform: scale(1.08); }
}

/* Dark Mode Tokens */
html.dark .p-timeline,
html.dark island-timeline,
[data-theme="dark"] .p-timeline,
[data-theme="dark"] island-timeline,
.dark .p-timeline,
.dark island-timeline {
    color: var(--p-text-color) !important;
}
html.dark .p-timeline-event-marker.p-marker-default,
[data-theme="dark"] .p-timeline-event-marker.p-marker-default,
.dark .p-timeline-event-marker.p-marker-default {
    background: var(--p-surface-0) !important;
    border-color: var(--p-primary-color, #10b981) !important;
}
html.dark .p-timeline-event-connector,
[data-theme="dark"] .p-timeline-event-connector,
.dark .p-timeline-event-connector {
    background-color: var(--p-border-color) !important;
}
html.dark .p-timeline-card,
[data-theme="dark"] .p-timeline-card,
.dark .p-timeline-card {
    background: var(--p-surface-0) !important;
    border-color: var(--p-border-color) !important;
    color: var(--p-text-color) !important;
}
html.dark .p-timeline-event-opposite,
[data-theme="dark"] .p-timeline-event-opposite,
.dark .p-timeline-event-opposite {
    color: var(--p-text-muted) !important;
}

/* Bi-Directional RTL Support */
[dir="rtl"] .p-timeline-vertical.p-timeline-left .p-timeline-event {
    flex-direction: row-reverse;
}
[dir="rtl"] .p-timeline-vertical.p-timeline-right .p-timeline-event {
    flex-direction: row;
}
[dir="rtl"] .p-timeline-vertical.p-timeline-left .p-timeline-event-opposite {
    text-align: left;
}
[dir="rtl"] .p-timeline-vertical.p-timeline-right .p-timeline-event-opposite {
    text-align: right;
}
[dir="rtl"] .p-timeline-vertical.p-timeline-alternate .p-timeline-event:nth-child(odd) .p-timeline-event-opposite {
    text-align: left;
}
[dir="rtl"] .p-timeline-vertical.p-timeline-alternate .p-timeline-event:nth-child(even) .p-timeline-event-opposite {
    text-align: right;
}
[dir="rtl"] .p-timeline-event-content {
    text-align: right;
}
[dir="rtl"] .p-timeline-vertical.p-timeline-right .p-timeline-event-content {
    text-align: left;
}
`;

const ICONS = {
    shoppingCart: getLucideIcon('shopping-cart', 18, 2),
    creditCard: getLucideIcon('credit-card', 18, 2),
    truck: getLucideIcon('truck', 18, 2),
    // Despite the variable name, this shape data matches lucide's "circle-check" icon exactly
    // (not "check-circle", which is a different glyph in this lucide-static version).
    checkCircle: getLucideIcon('circle-check', 18, 2.5),
    check: getLucideIcon('check', 16, 3),
    userPlus: getLucideIcon('user-plus', 18, 2),
    envelope: getLucideIcon('mail', 18, 2),
    idCard: getLucideIcon('id-card', 18, 2),
    shoppingBag: getLucideIcon('shopping-bag', 18, 2),
    star: getLucideIcon('star', 18, 2),
    box: getLucideIcon('box', 14, 2),
    mapPin: getLucideIcon('map-pin', 14, 2),
    history: getLucideIcon('history', 16, 2),
    // Matches lucide's "refresh-ccw" (counter-clockwise arrow direction), not "refresh-cw".
    refresh: getLucideIcon('refresh-ccw', 14, 2),
    // Geometrically identical to lucide's "minus" (same M5 12h14 segment), just expressed as
    // a <line> element here instead of a <path>.
    minus: getLucideIcon('minus', 12, 2.5)
};

const COLOR_MAP: Record<string, string> = {
    'bg-blue-500': 'var(--p-info-500, #3b82f6)',
    'bg-green-500': 'var(--p-primary-color, var(--p-success-500, #10b981))',
    'bg-orange-500': 'var(--p-warn-500, #f97316)',
    'bg-lime-500': 'var(--p-success-500, #84cc16)',
    'bg-violet-500': 'var(--p-primary-color, #8b5cf6)',
    'bg-amber-500': 'var(--p-warn-500, #f59e0b)',
    'bg-rose-500': 'var(--p-danger-500, #f43f5e)'
};

export default function TimelineIsland(container: HTMLElement, props: TimelineProps, ctx?: IslandContext) {
    injectIslandStyle('timeline', TIMELINE_CSS);
    container.setAttribute('data-part', 'root');

    // Unpack slot if present
    const slotEl = container.querySelector<HTMLElement>(':scope > .island-slot');
    if (slotEl) {
        while (slotEl.firstChild) {
            container.appendChild(slotEl.firstChild);
        }
        slotEl.remove();
    }

    const rawEvents: any[] = props.value || props.events || [];
    const align = props.align || 'left';
    const layout = props.layout || 'vertical';
    const isInteractive = props.interactive !== undefined
        ? (props.interactive === true || String(props.interactive) === 'true')
        : (container.getAttribute('interactive') === 'true' || container.hasAttribute('interactive') || container.hasAttribute('data-interactive') || rawEvents.some((e: any) => e.id && (e.label || e.icon) && !e.user && !e.status));
    const isActivityFeed = props.activityFeed !== undefined
        ? (props.activityFeed === true || String(props.activityFeed) === 'true')
        : (container.getAttribute('activity-feed') === 'true' || container.hasAttribute('activity-feed') || container.hasAttribute('data-activity-feed') || rawEvents.some((e: any) => e.user && (e.action || e.details || e.repo)));

    // Interactive State
    let completedSteps = [1];
    let currentStep = 2;

    function getStepStatus(stepId: number): 'completed' | 'current' | 'pending' {
        if (completedSteps.includes(stepId)) return 'completed';
        if (stepId === currentStep) return 'current';
        return 'pending';
    }

    function handleStepComplete(stepId: number) {
        if (stepId === currentStep) {
            completedSteps.push(stepId);
            currentStep++;
            render();
        }
    }

    function handleReset() {
        completedSteps = [1];
        currentStep = 2;
        render();
    }

    function getIconSvg(iconName?: string): string {
        if (!iconName) return '';
        const key: string = iconName.toLowerCase().replace(/[-_]/g, '');
        if (key === 'shoppingcart') return ICONS.shoppingCart;
        if (key === 'creditcard') return ICONS.creditCard;
        if (key === 'truck') return ICONS.truck;
        if (key === 'checkcircle') return ICONS.checkCircle;
        if (key === 'userplus') return ICONS.userPlus;
        if (key === 'envelope') return ICONS.envelope;
        if (key === 'idcard') return ICONS.idCard;
        if (key === 'shoppingbag') return ICONS.shoppingBag;
        if (key === 'star') return ICONS.star;
        if (key === 'box') return ICONS.box;
        if (key === 'check') return ICONS.check;
        return ICONS.checkCircle;
    }

    function getColorHex(colorStr?: string): string {
        if (!colorStr) return 'var(--p-primary-color, #10b981)';
        const clean = colorStr.replace('!', '').trim();
        if (COLOR_MAP[clean]) return COLOR_MAP[clean];
        if (clean.startsWith('#') || clean.startsWith('rgb')) return clean;
        return 'var(--p-primary-color, #10b981)';
    }

    function renderMarker(item: any, isLast: boolean): string {
        // 1. Interactive Step Workflow Marker
        if (isInteractive) {
            const status = getStepStatus(item.id);
            let btnStyle = 'width: 2.5rem; height: 2.5rem; border-radius: 9999px; display: inline-flex; align-items: center; justify-content: center; border: none; transition: all 0.2s ease;';
            let iconHtml = '';

            if (status === 'completed') {
                btnStyle += ' background: var(--p-success-500, #10b981); color: #ffffff; cursor: default;';
                iconHtml = ICONS.check;
            } else if (status === 'current') {
                btnStyle += ' background: var(--p-primary-color, #10b981); color: #ffffff; cursor: pointer; transform: scale(1.05);';
                iconHtml = getIconSvg(item.icon) || ICONS.userPlus;
            } else {
                btnStyle += ' background: var(--p-surface-200); color: var(--p-text-muted); cursor: not-allowed;';
                iconHtml = getIconSvg(item.icon) || ICONS.userPlus;
            }

            return `
                <div class="p-timeline-event-marker ${status === 'current' ? 'p-timeline-pulse' : ''}" data-part="root">
                    <button type="button" class="p-interactive-step-btn" data-step-id="${item.id}" style="${btnStyle}" ${status !== 'current' ? 'disabled' : ''}>
                        ${iconHtml}
                    </button>
                </div>
            `;
        }

        // 2. Activity Feed Avatar Marker
        if (isActivityFeed || (item.user && item.action)) {
            const userName = typeof item.user === 'object' ? item.user.name : String(item.user || 'User');
            const initials = userName.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2) || 'U';
            const colors = [
                'var(--p-primary-500, #10b981)',
                'var(--p-info-500, #3b82f6)',
                'var(--p-warn-500, #f59e0b)',
                'var(--p-success-500, #22c55e)',
                'var(--p-danger-500, #ef4444)'
            ];
            const colorIdx = (parseInt(item.id || '1', 10) - 1) % colors.length;
            const color = colors[colorIdx >= 0 ? colorIdx : 0];

            return `
                <div class="p-timeline-event-marker">
                    <span class="p-timeline-avatar" style="background: ${color}; width: 2.25rem; height: 2.25rem; border-radius: 9999px; color: #ffffff; font-weight: 700; font-size: 0.8125rem; display: inline-flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        ${initials}
                    </span>
                </div>
            `;
        }

        // 3. Custom Rich Color Icon Marker (Order Tracking)
        if (item.color || item.icon) {
            const iconSvg = getIconSvg(item.icon);
            const colorHex = getColorHex(item.color);
            return `
                <div class="p-timeline-event-marker">
                    <span style="display: inline-flex; align-items: center; justify-content: center; width: 2.75rem; height: 2.75rem; border-radius: 9999px; color: #ffffff; background: ${colorHex}; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
                        ${iconSvg}
                    </span>
                </div>
            `;
        }

        // 4. Default Aura dot marker
        return `
            <div class="p-timeline-event-marker p-marker-default"></div>
        `;
    }

    function renderOpposite(item: any): string {
        if (item.opposite) {
            return `<span>${item.opposite}</span>`;
        }
        if (item.time && !item.date) {
            return `<span style="white-space: nowrap; font-size: 0.8125rem; color: var(--p-text-muted);">${item.time}</span>`;
        }
        if (item.date && item.time) {
            return `
                <div style="font-weight: 600; color: var(--p-text-color);">${item.date}</div>
                <div style="font-size: 0.75rem; color: var(--p-text-muted);">${item.time}</div>
            `;
        }
        if (item.date) {
            return `<span style="font-size: 0.8125rem; color: var(--p-text-muted);">${item.date}</span>`;
        }
        return ``;
    }

    function renderContent(item: any): string {
        if (typeof item === 'string') {
            return `<span style="font-size: 0.875rem; font-weight: 600; color: var(--p-text-color);">${item}</span>`;
        }

        // 1. Interactive Step Workflow Content
        if (isInteractive) {
            const status = getStepStatus(item.id);
            const isDone = status === 'completed';
            const isCurr = status === 'current';

            return `
                <div style="padding: 0.75rem 1rem; border-radius: 8px; transition: all 0.2s ease; ${isDone ? 'background: rgba(34, 197, 94, 0.08);' : isCurr ? 'background: rgba(16, 185, 129, 0.08);' : 'opacity: 0.6;'}">
                    <p style="margin: 0; font-weight: 600; font-size: 0.875rem; ${isDone ? 'color: var(--p-success-700, #15803d); text-decoration: line-through;' : isCurr ? 'color: var(--p-primary-color, #10b981);' : 'color: var(--p-text-muted);'}">
                        ${item.label || item.status || item.title}
                    </p>
                    ${isCurr ? `<p style="font-size: 0.75rem; color: var(--p-text-muted); margin: 0.25rem 0 0 0;">Click the marker to complete</p>` : ''}
                </div>
            `;
        }

        // 2. Activity Feed Content
        if (isActivityFeed || (item.user && item.action)) {
            const userName = typeof item.user === 'object' ? item.user.name : item.user;
            const detailsHtml = item.details && item.details.length > 0 ? `
                <div style="margin-top: 0.75rem; padding: 0.75rem; border-radius: 8px; background: var(--p-surface-50); border: 1px solid var(--p-border-color);">
                    <ul style="margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 0.35rem;">
                        ${item.details.map((d: string) => `
                            <li style="font-size: 0.8125rem; font-family: var(--p-font-mono, monospace); color: var(--p-text-color); display: flex; align-items: center; gap: 0.5rem;">
                                <span style="color: var(--p-text-muted);">${ICONS.minus}</span> ${d}
                            </li>
                        `).join('')}
                    </ul>
                </div>
            ` : '';

            return `
                <div class="p-timeline-card" style="margin-bottom: 1.25rem;">
                    <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                        <span style="font-weight: 700; color: var(--p-text-color); font-size: 0.9375rem;">${userName}</span>
                        <span style="color: var(--p-text-muted); font-size: 0.875rem;">${item.action || ''}</span>
                        <span style="font-weight: 600; color: var(--p-primary-color, #10b981); font-size: 0.875rem;">${item.target || ''}</span>
                        ${item.repo ? `<span style="color: var(--p-text-muted); font-size: 0.875rem;">to</span> <code style="padding: 0.15rem 0.45rem; border-radius: 4px; background: var(--p-surface-100); font-size: 0.8125rem; font-family: monospace; color: var(--p-text-color); border: 1px solid var(--p-border-color);">${item.repo}</code>` : ''}
                    </div>
                    ${item.description ? `<p style="margin: 0.35rem 0 0 0; font-size: 0.875rem; color: var(--p-text-muted); line-height: 1.5;">${item.description}</p>` : ''}
                    ${detailsHtml}
                </div>
            `;
        }

        // 3. Custom Rich Order Card Content
        if (item.details || item.tracking || item.user || item.status || item.title) {
            const cardTitle = item.status || item.title || item.label || '';
            const detailsHtml = item.details && item.details.length > 0 ? `
                <ul style="margin: 0.75rem 0 0 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 0.35rem;">
                    ${item.details.map((d: string) => `
                        <li style="font-size: 0.8125rem; color: var(--p-text-muted); display: flex; align-items: center; gap: 0.5rem;">
                            <span style="color: var(--p-primary-color, #10b981);">${ICONS.box}</span> ${d}
                        </li>
                    `).join('')}
                </ul>
            ` : '';

            const trackingHtml = item.tracking ? `
                <div style="margin-top: 1rem; padding: 0.65rem 0.85rem; border-radius: 8px; background: var(--p-surface-100); display: flex; align-items: center; justify-content: space-between;">
                    <span style="font-size: 0.8125rem; color: var(--p-text-color); display: flex; align-items: center; gap: 0.5rem;">
                        ${ICONS.mapPin} Tracking: <strong>${item.tracking}</strong>
                    </span>
                    <button type="button" class="p-button p-component p-button-text" style="font-size: 0.75rem; font-weight: 600; color: var(--p-primary-color, #10b981); background: transparent; border: none; cursor: pointer; padding: 0.25rem 0.5rem;">Track</button>
                </div>
            ` : '';

            return `
                <div class="p-timeline-card">
                    <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;">
                        ${item.user ? `<span class="p-timeline-avatar" style="background: rgba(16, 185, 129, 0.12); color: var(--p-primary-color, #10b981);">${item.user}</span>` : ''}
                        ${cardTitle ? `<span style="font-weight: 700; font-size: 0.9375rem; color: var(--p-text-color);">${cardTitle}</span>` : ''}
                    </div>
                    ${item.description ? `<p style="margin: 0; font-size: 0.875rem; color: var(--p-text-muted); line-height: 1.5;">${item.description}</p>` : ''}
                    ${detailsHtml}
                    ${trackingHtml}
                </div>
            `;
        }

        // 4. Basic Status
        return `
            <div style="font-size: 0.875rem; font-weight: 500; color: var(--p-text-color);">${item.status || item.title || item.label || JSON.stringify(item)}</div>
        `;
    }

    function render() {
        const isHorizontal = layout === 'horizontal';
        const alignClass = `p-timeline-${align}`;
        const layoutClass = isHorizontal ? 'p-timeline-horizontal' : 'p-timeline-vertical';

        // 1. Interactive Step Workflow Header & Progress
        let interactiveHeaderHtml = '';
        let interactiveCelebrationHtml = '';

        if (isInteractive) {
            const allCount = rawEvents.length;
            const doneCount = completedSteps.length;
            const percent = Math.round((doneCount / allCount) * 100);
            const isAllDone = doneCount === allCount;

            interactiveHeaderHtml = `
                <div style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.5rem;">
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                        <div>
                            <h3 style="margin: 0; font-size: 1.125rem; font-weight: 700; color: var(--p-text-color);">Onboarding Progress</h3>
                            <p style="margin: 0.25rem 0 0 0; font-size: 0.8125rem; color: var(--p-text-muted);">${doneCount} of ${allCount} steps completed</p>
                        </div>
                        <button type="button" class="p-interactive-reset-btn p-button p-component p-button-outlined" style="display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.4rem 0.85rem; font-size: 0.8125rem; font-weight: 600; border-radius: 6px; border: 1px solid var(--p-border-color); background: var(--p-surface-0); cursor: pointer; color: var(--p-text-color);">
                            ${ICONS.refresh} Reset
                        </button>
                    </div>
                    <div style="width: 100%; height: 0.5rem; border-radius: 9999px; background: var(--p-surface-200); overflow: hidden;">
                        <div style="width: ${percent}%; height: 100%; border-radius: 9999px; background: var(--p-primary-color, #10b981); transition: width 0.4s ease;"></div>
                    </div>
                </div>
            `;

            if (isAllDone) {
                interactiveCelebrationHtml = `
                    <div style="margin-top: 1.5rem; padding: 1rem; border-radius: 8px; background: rgba(34, 197, 94, 0.08); border: 1px solid rgba(34, 197, 94, 0.3); display: flex; flex-direction: column; align-items: center; gap: 0.25rem; text-align: center;">
                        <span style="color: var(--p-success-500, #10b981);">${ICONS.checkCircle}</span>
                        <div style="font-weight: 700; color: var(--p-success-700, #15803d); font-size: 0.9375rem;">Onboarding Complete!</div>
                        <span style="font-size: 0.8125rem; color: var(--p-success-600, #16a34a);">You've completed all the steps.</span>
                    </div>
                `;
            }
        }

        // 2. Activity Header
        let activityHeaderHtml = '';
        if (isActivityFeed) {
            activityHeaderHtml = `
                <div style="display: flex; align-items: center; gap: 0.625rem; margin-bottom: 1.25rem;">
                    <span style="color: var(--p-text-muted);">${ICONS.history}</span>
                    <span style="font-size: 1.125rem; font-weight: 700; color: var(--p-text-color);">Recent Activity</span>
                </div>
            `;
        }

        // Render Events
        const eventsHtml = rawEvents.map((item, idx) => {
            const isLast = idx === rawEvents.length - 1;
            const oppositeContent = renderOpposite(item);
            return `
                <li class="p-timeline-event">
                    <div class="p-timeline-event-opposite">
                        ${oppositeContent}
                    </div>
                    <div class="p-timeline-event-separator">
                        ${renderMarker(item, isLast)}
                        ${!isLast ? '<div class="p-timeline-event-connector"></div>' : ''}
                    </div>
                    <div class="p-timeline-event-content">
                        ${renderContent(item)}
                    </div>
                </li>
            `;
        }).join('');

        setHtml(container, html`
            <div class="p-timeline-wrapper" style="width: 100%;">
                ${unsafe(interactiveHeaderHtml)}
                ${unsafe(activityHeaderHtml)}
                <ol class="p-timeline p-component ${layoutClass} ${alignClass}" aria-label="${props.title || 'Timeline'}">
                    ${unsafe(eventsHtml)}
                </ol>
                ${unsafe(interactiveCelebrationHtml)}
            </div>
        `);

        bindEvents();
    }

    function bindEvents() {
        if (isInteractive) {
            container.querySelectorAll<HTMLButtonElement>('.p-interactive-step-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const stepId = parseInt(btn.getAttribute('data-step-id') || '0', 10);
                    if (stepId) handleStepComplete(stepId);
                }, { signal: ctx?.signal });
            });

            container.querySelector('.p-interactive-reset-btn')?.addEventListener('click', () => {
                handleReset();
            }, { signal: ctx?.signal });
        }
    }

    render();
}
