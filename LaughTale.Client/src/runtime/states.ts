/**
 * LaughTale: Standard Component State Presentation Helpers
 */

import type { SkeletonOptions, StateMessageOptions } from '../types/states';

/**
 * Generates HTML for an accessible skeleton loading placeholder.
 */
export function renderSkeleton(options: SkeletonOptions = {}): string {
    const lines = Math.max(1, options.lines ?? 3);
    const height = options.height ?? '1.25rem';
    const customClass = options.className ?? '';

    let html = `<div class="lt-skeleton-container ${customClass}" role="status" aria-label="Loading content" aria-busy="true">`;
    for (let i = 0; i < lines; i++) {
        const width = i === lines - 1 && lines > 1 ? '60%' : '100%';
        html += `<div class="lt-skeleton-line" style="height: ${height}; width: ${width}; border-radius: 4px; background: var(--lt-surface-200, #e2e8f0); margin-bottom: 0.5rem; animation: lt-pulse 1.5s ease-in-out infinite;"></div>`;
    }
    html += '</div>';
    return html;
}

/**
 * Generates HTML for an empty dataset state.
 */
export function renderEmptyState(options: StateMessageOptions = {}): string {
    const message = options.message ?? 'No data available';
    const customClass = options.className ?? '';
    const iconHtml = options.icon ? `<div class="lt-empty-icon">${options.icon}</div>` : '';

    return `<div class="lt-empty-state ${customClass}" role="status">` +
        iconHtml +
        `<div class="lt-empty-message" style="color: var(--lt-text-muted, #64748b); text-align: center; padding: 2rem 1rem;">${message}</div>` +
        `</div>`;
}

/**
 * Generates HTML for an error alert state.
 */
export function renderErrorState(options: StateMessageOptions = {}): string {
    const message = options.message ?? 'An error occurred while loading data';
    const customClass = options.className ?? '';
    const iconHtml = options.icon ? `<div class="lt-error-icon">${options.icon}</div>` : '';

    return `<div class="lt-error-state ${customClass}" role="alert" style="color: var(--lt-danger-fg, #ef4444); background: var(--lt-danger-bg, #fef2f2); border: 1px solid var(--lt-danger-border, #fecaca); padding: 1rem; border-radius: 6px; margin: 0.5rem 0;">` +
        iconHtml +
        `<div class="lt-error-message">${message}</div>` +
        `</div>`;
}
