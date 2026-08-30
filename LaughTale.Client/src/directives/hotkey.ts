/**
 * LaughTale: Keyboard Shortcut & Hotkey Directive (l-hotkey, l-shortcut)
 * Supports Ctrl, Cmd, Alt, Shift, Escape, Enter, and custom key combinations.
 */

import { executeStatement, getNearestScope } from './reactivity';

export function bindHotkeyDirectives(element: HTMLElement): void {
    const scope = getNearestScope(element);

    for (const attr of Array.from(element.attributes)) {
        if (attr.name === 'l-hotkey' || attr.name === 'l-shortcut' || attr.name.startsWith('l-hotkey.') || attr.name.startsWith('l-shortcut.')) {
            const isGlobal = attr.name.includes('.global') || !attr.name.includes('.local');
            const prevent = !attr.name.includes('.noprevent');
            const shortcutSpec = attr.value.trim().toLowerCase(); // e.g. "ctrl+k", "escape", "shift+enter"
            const stmt = element.getAttribute('l-on:hotkey') || element.getAttribute('l-action');

            const handler = (e: KeyboardEvent) => {
                if (matchesShortcut(e, shortcutSpec)) {
                    if (prevent) e.preventDefault();

                    if (stmt) {
                        const activeState = scope ? scope.state : {};
                        const context = {
                            $event: e,
                            $el: element,
                            $emit: (channel: string, payload: any) => {
                                window.dispatchEvent(new CustomEvent(`laughtale:${channel}`, { detail: payload, bubbles: true }));
                            }
                        };
                        executeStatement(stmt, activeState, context);
                    } else {
                        // Default behavior: trigger click on target element or focus input
                        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                            element.focus();
                        } else {
                            element.click();
                        }
                    }
                }
            };

            const target = isGlobal ? window : element;
            target.addEventListener('keydown', handler as EventListener);
        }
    }
}

function matchesShortcut(e: KeyboardEvent, spec: string): boolean {
    const parts = spec.split('+').map((s) => s.trim());
    const needsCtrl = parts.includes('ctrl') || parts.includes('control') || parts.includes('cmd') || parts.includes('meta');
    const needsAlt = parts.includes('alt') || parts.includes('option');
    const needsShift = parts.includes('shift');

    const keyPart = parts.find((p) => !['ctrl', 'control', 'cmd', 'meta', 'alt', 'option', 'shift'].includes(p));

    const ctrlPressed = e.ctrlKey || e.metaKey;
    if (needsCtrl !== ctrlPressed) return false;
    if (needsAlt !== e.altKey) return false;
    if (needsShift !== e.shiftKey) return false;

    if (!keyPart) return true;

    const actualKey = e.key.toLowerCase();
    if (keyPart === 'escape' || keyPart === 'esc') return actualKey === 'escape';
    if (keyPart === 'enter' || keyPart === 'return') return actualKey === 'enter';
    if (keyPart === 'space') return actualKey === ' ' || actualKey === 'spacebar';

    return actualKey === keyPart;
}
