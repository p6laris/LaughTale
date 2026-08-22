/**
 * SoftMax.LaughTale: Headless useDisclosure Composable
 * Manages boolean open/closed state for modals, drawers, dropdowns, and collapse panels.
 */

export interface UseDisclosureOptions {
    defaultIsOpen?: boolean;
    onOpen?: () => void;
    onClose?: () => void;
    onToggle?: (isOpen: boolean) => void;
}

export interface UseDisclosureReturn {
    readonly isOpen: boolean;
    open: () => void;
    close: () => void;
    toggle: () => void;
    setOpen: (value: boolean) => void;
    onChange: (listener: (isOpen: boolean) => void) => () => void;
}

export function useDisclosure(options: UseDisclosureOptions = {}): UseDisclosureReturn {
    let isOpen = Boolean(options.defaultIsOpen);
    const listeners = new Set<(isOpen: boolean) => void>();

    function notify() {
        options.onToggle?.(isOpen);
        listeners.forEach(fn => fn(isOpen));
    }

    function open() {
        if (!isOpen) {
            isOpen = true;
            options.onOpen?.();
            notify();
        }
    }

    function close() {
        if (isOpen) {
            isOpen = false;
            options.onClose?.();
            notify();
        }
    }

    function toggle() {
        if (isOpen) close();
        else open();
    }

    function setOpen(value: boolean) {
        if (value) open();
        else close();
    }

    function onChange(listener: (isOpen: boolean) => void): () => void {
        listeners.add(listener);
        return () => listeners.delete(listener);
    }

    return {
        get isOpen() { return isOpen; },
        open,
        close,
        toggle,
        setOpen,
        onChange
    };
}
