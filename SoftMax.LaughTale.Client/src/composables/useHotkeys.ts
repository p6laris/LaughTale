/**
 * SoftMax.LaughTale: Headless useHotkeys Composable
 * Global & Scoped keyboard shortcut listener supporting multi-key combos (Ctrl+K, Meta+K, Shift+Enter, Escape).
 */

export interface HotkeyItem {
    combo: string; // e.g. 'ctrl+k', 'meta+k', 'escape', 'slash'
    handler: (e: KeyboardEvent) => void;
    allowInInputs?: boolean;
}

export function useHotkeys(hotkeys: HotkeyItem[], targetNode: HTMLElement | Document = typeof document !== 'undefined' ? document : null!) {
    if (!targetNode) return { destroy: () => {} };

    function matchesCombo(e: KeyboardEvent, comboStr: string): boolean {
        const parts = comboStr.toLowerCase().split('+').map(p => p.trim());
        const hasCtrl = parts.includes('ctrl') || parts.includes('control');
        const hasMeta = parts.includes('meta') || parts.includes('cmd') || parts.includes('command');
        const hasShift = parts.includes('shift');
        const hasAlt = parts.includes('alt');

        if (hasCtrl && !e.ctrlKey) return false;
        if (hasMeta && !e.metaKey) return false;
        if (hasShift && !e.shiftKey) return false;
        if (hasAlt && !e.altKey) return false;

        const mainKey = parts.find(p => !['ctrl', 'control', 'meta', 'cmd', 'command', 'shift', 'alt'].includes(p));
        if (!mainKey) return true;

        const key = e.key.toLowerCase();
        if (mainKey === 'esc' || mainKey === 'escape') return key === 'escape';
        if (mainKey === 'enter') return key === 'enter';
        if (mainKey === 'space') return key === ' ' || key === 'space';
        if (mainKey === 'slash') return key === '/';

        return key === mainKey;
    }

    function isInputElement(el: Element | null): boolean {
        if (!el) return false;
        const tag = el.tagName.toLowerCase();
        return tag === 'input' || tag === 'textarea' || tag === 'select' || el.hasAttribute('contenteditable');
    }

    function handleKeyDown(e: Event) {
        const keyEvent = e as KeyboardEvent;
        const target = keyEvent.target as Element | null;
        const isInput = isInputElement(target);

        for (const item of hotkeys) {
            if (isInput && !item.allowInInputs && item.combo !== 'escape') {
                continue;
            }

            if (matchesCombo(keyEvent, item.combo)) {
                keyEvent.preventDefault();
                item.handler(keyEvent);
                break;
            }
        }
    }

    targetNode.addEventListener('keydown', handleKeyDown);

    return {
        destroy: () => {
            targetNode.removeEventListener('keydown', handleKeyDown);
        }
    };
}
