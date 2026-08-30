/**
 * SoftMax.LaughTale: Accessible Live Region Screen Reader Announcer (LT-801)
 * 
 * Automatically manages persistent polite and assertive aria-live regions
 * for dynamic status updates, toast messages, and validation alerts per WCAG 2.1 SC 4.1.3.
 */

export type AnnouncePriority = 'polite' | 'assertive';

const SR_ONLY_STYLE = 'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;';

/**
 * Returns or creates the persistent off-screen aria-live container element for the specified priority.
 * @param priority 'polite' or 'assertive'
 */
export function getAnnouncerElement(priority: AnnouncePriority = 'polite'): HTMLElement | null {
    if (typeof document === 'undefined') return null;

    const id = `lt-announcer-${priority}`;
    let el = document.getElementById(id);

    if (!el && document.body) {
        el = document.createElement('div');
        el.id = id;
        el.setAttribute('aria-live', priority);
        el.setAttribute('aria-atomic', 'true');
        el.setAttribute('style', SR_ONLY_STYLE);
        document.body.appendChild(el);
    }

    return el;
}

/**
 * Announces a message to screen readers via an aria-live region.
 * @param message The message text to announce
 * @param priority 'polite' (default) for informational updates, or 'assertive' for critical errors/alerts
 */
export function announce(message: string, priority: AnnouncePriority = 'polite'): void {
    if (typeof document === 'undefined' || !message) return;

    const container = getAnnouncerElement(priority);
    if (!container) return;

    // Clear previous message then set new message to force assistive tech re-announcement
    container.textContent = '';
    
    // Use microtask or timeout to ensure screen reader picks up text change
    setTimeout(() => {
        container.textContent = message;
    }, 50);
}

/**
 * Clears all pending announcements from live regions.
 */
export function clearAnnouncements(): void {
    if (typeof document === 'undefined') return;

    ['polite', 'assertive'].forEach(p => {
        const el = document.getElementById(`lt-announcer-${p}`);
        if (el) el.textContent = '';
    });
}
