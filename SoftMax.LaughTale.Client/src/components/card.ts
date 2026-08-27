/**
 * SoftMax.LaughTale: Enterprise Card Component (Aura Design System compliant)
 * Flexible container component for structured content with header, title, subtitle, content, and footer.
 */

import { injectIslandStyle } from '../runtime/styles';

const CARD_CSS = `
.p-card {
    background: var(--p-surface-0, #ffffff);
    color: var(--p-surface-700, #334155);
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
    border-radius: var(--p-border-radius-md, 8px);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-sizing: border-box;
}

.p-card-header {
    overflow: hidden;
    position: relative;
}

.p-card-body {
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.p-card-caption {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.p-card-title {
    font-weight: 700;
    font-size: 1.25rem;
    color: var(--p-surface-900, #0f172a);
    margin: 0;
    line-height: 1.25;
}

.p-card-subtitle {
    font-weight: 400;
    font-size: 0.875rem;
    color: var(--p-surface-500, #64748b);
    margin: 0;
}

.p-card-content {
    color: var(--p-surface-600, #475569);
    font-size: 0.875rem;
    line-height: 1.6;
}

.p-card-footer {
    margin-top: 0.5rem;
}

/* Dark Mode Tokens */
.dark .p-card,
[data-theme="dark"] .p-card {
    background: var(--p-surface-900, #0f172a) !important;
    color: var(--p-surface-100, #f8fafc) !important;
    border: 1px solid var(--p-surface-700, #334155) !important;
}
.dark .p-card-title,
[data-theme="dark"] .p-card-title {
    color: var(--p-surface-0, #ffffff) !important;
}
.dark .p-card-subtitle,
[data-theme="dark"] .p-card-subtitle {
    color: var(--p-surface-400, #94a3b8) !important;
}
.dark .p-card-content,
[data-theme="dark"] .p-card-content {
    color: var(--p-surface-300, #cbd5e1) !important;
}
`;

export interface CardProps {
    title?: string;
    subtitle?: string;
    content?: string;
    footer?: string;
    headerImage?: string;
    role?: string;
}

export default function CardIsland(container: HTMLElement, props: CardProps) {
    injectIslandStyle('card', CARD_CSS);

    if (props.role) {
        container.setAttribute('role', props.role);
    }
}
