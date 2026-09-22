/**
 * LaughTale: Headless useDisclosure Composable
 * Manages open/closed state for modals, drawers, dropdowns, and collapse panels.
 *
 * Built on `runtime/state-machine.ts` (ROADMAP.v5.md Part M "Adopt - State machine for overlays"),
 * not a bag of independent booleans - `open()`/`toggle()` go through a real guarded CLOSED -> OPEN
 * transition, so a `disabled` overlay can no longer be opened by a call site that forgot to check
 * `isDisabled` first (the exact "isOpen && !isDisabled" duplication the roadmap calls out: before
 * this, every one of this composable's 6 consumers re-implemented that check at their own call
 * sites - `select.ts`'s raw, non-composable `isOpen` variable still does). `close()` is
 * deliberately NOT guarded by `disabled` - an overlay that becomes disabled while already open must
 * stay dismissible, not get stuck open.
 *
 * The public API is unchanged from before this rewrite - every existing consumer
 * (autocomplete.ts, cascadeselect.ts, datepicker.ts, multiselect.ts, theme-studio.ts,
 * tree-select.ts) keeps working exactly as it did, and picks up the new `disabled` guard for free
 * the moment it starts passing that option.
 */

import { createMachine } from '../runtime/state-machine';

export interface UseDisclosureOptions {
    defaultIsOpen?: boolean;
    onOpen?: () => void;
    onClose?: () => void;
    onToggle?: (isOpen: boolean) => void;
    /**
     * Live getter (not a snapshot) - checked on every `open()`/`toggle()` call, so it reflects the
     * overlay's current disabled prop even if that prop changes after `useDisclosure()` was called.
     * When it returns `true`, `open()` and an opening `toggle()` are no-ops; `close()` is unaffected.
     */
    disabled?: () => boolean;
}

export interface UseDisclosureReturn {
    readonly isOpen: boolean;
    open: () => void;
    close: () => void;
    toggle: () => void;
    setOpen: (value: boolean) => void;
    onChange: (listener: (isOpen: boolean) => void) => () => void;
}

type DisclosureState = 'closed' | 'open';
type DisclosureEvent = 'OPEN' | 'CLOSE';
interface DisclosureContext {
    disabled: () => boolean;
}

export function useDisclosure(options: UseDisclosureOptions = {}): UseDisclosureReturn {
    const listeners = new Set<(isOpen: boolean) => void>();

    function notify(isOpen: boolean) {
        options.onToggle?.(isOpen);
        listeners.forEach(fn => fn(isOpen));
    }

    const machine = createMachine<DisclosureState, DisclosureEvent, DisclosureContext>({
        initial: options.defaultIsOpen ? 'open' : 'closed',
        context: { disabled: options.disabled ?? (() => false) },
        states: {
            closed: {
                on: {
                    OPEN: {
                        target: 'open',
                        guard: (ctx) => !ctx.disabled(),
                        action: () => {
                            options.onOpen?.();
                            notify(true);
                        }
                    }
                }
            },
            open: {
                on: {
                    CLOSE: {
                        target: 'closed',
                        action: () => {
                            options.onClose?.();
                            notify(false);
                        }
                    }
                }
            }
        }
    });

    function open() {
        machine.send('OPEN');
    }

    function close() {
        machine.send('CLOSE');
    }

    function toggle() {
        if (machine.matches('open')) close();
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
        get isOpen() { return machine.matches('open'); },
        open,
        close,
        toggle,
        setOpen,
        onChange
    };
}
