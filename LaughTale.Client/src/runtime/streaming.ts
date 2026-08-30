/**
 * HTML Streaming SSR Support for LaughTale
 * Ensures projected server slot HTML is fully flushed from ASP.NET Core
 * chunked response streams before client hydration begins.
 */

export function awaitStreamingReady(container: HTMLElement): Promise<void> {
    const islandId = container.getAttribute('data-island-id') || container.getAttribute('data-island');
    const markerValue = `island:end:${islandId}`;

    // 1. If already complete or DOM is ready, proceed immediately
    if (document.readyState === 'complete' || !container.hasAttribute('data-streaming')) {
        return Promise.resolve();
    }

    // 2. Check if end comment marker is already in children
    for (let node = container.lastChild; node; node = node.previousSibling) {
        if (node.nodeType === Node.COMMENT_NODE && (node.nodeValue?.trim() === markerValue || node.nodeValue?.trim() === 'island:end')) {
            node.remove();
            return Promise.resolve();
        }
    }

    // 3. Wait for trailing comment marker via MutationObserver
    return new Promise((resolve) => {
        let isResolved = false;

        const onDone = () => {
            if (!isResolved) {
                isResolved = true;
                observer.disconnect();
                document.removeEventListener('DOMContentLoaded', onDone);
                resolve();
            }
        };

        const observer = new MutationObserver(() => {
            for (let node = container.lastChild; node; node = node.previousSibling) {
                if (node.nodeType === Node.COMMENT_NODE && (node.nodeValue?.trim() === markerValue || node.nodeValue?.trim() === 'island:end')) {
                    node.remove();
                    onDone();
                    break;
                }
            }
        });

        observer.observe(container, { childList: true });
        document.addEventListener('DOMContentLoaded', onDone);
    });
}
