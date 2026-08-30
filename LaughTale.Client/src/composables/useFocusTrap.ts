/**
 * LaughTale: Headless useFocusTrap Composable
 * Traps keyboard focus (Tab / Shift+Tab) within a container element for accessible modals & dialogs.
 */

const FOCUSABLE_SELECTOR = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]'
].join(',');

export interface UseFocusTrapOptions {
    autoFocus?: boolean;
    restoreFocus?: boolean;
    initialFocusElement?: HTMLElement | null;
    signal?: AbortSignal;
}

export interface UseFocusTrapReturn {
    activate: () => void;
    deactivate: () => void;
}

export function useFocusTrap(container: HTMLElement, options: UseFocusTrapOptions = {}): UseFocusTrapReturn {
    let previouslyFocusedElement: HTMLElement | null = null;
    let isActive = false;

    function getFocusableElements(): HTMLElement[] {
        return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
            .filter(el => el.offsetParent !== null || el.offsetWidth > 0 || el.offsetHeight > 0);
    }

    function handleKeyDown(e: KeyboardEvent) {
        if (!isActive || e.key !== 'Tab') return;

        const focusable = getFocusableElements();
        if (focusable.length === 0) {
            e.preventDefault();
            return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
            if (document.activeElement === first || !container.contains(document.activeElement)) {
                e.preventDefault();
                last.focus();
            }
        } else {
            if (document.activeElement === last || !container.contains(document.activeElement)) {
                e.preventDefault();
                first.focus();
            }
        }
    }

    function activate() {
        if (isActive) return;
        isActive = true;
        previouslyFocusedElement = document.activeElement as HTMLElement | null;

        document.addEventListener('keydown', handleKeyDown, { signal: options.signal });

        if (options.autoFocus !== false) {
            setTimeout(() => {
                if (options.initialFocusElement) {
                    options.initialFocusElement.focus();
                } else {
                    const focusable = getFocusableElements();
                    if (focusable.length > 0) focusable[0].focus();
                    else container.focus();
                }
            }, 10);
        }
    }

    function deactivate() {
        if (!isActive) return;
        isActive = false;
        document.removeEventListener('keydown', handleKeyDown);

        if (options.restoreFocus !== false && previouslyFocusedElement && typeof previouslyFocusedElement.focus === 'function') {
            previouslyFocusedElement.focus();
        }
    }

    if (options.signal) {
        options.signal.addEventListener('abort', deactivate, { once: true });
    }

    return { activate, deactivate };
}
