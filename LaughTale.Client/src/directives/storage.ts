/**
 * LaughTale: Storage Persistence Directive (l-persist, l-sync-storage)
 * Automatically synchronizes reactive l-state with localStorage or sessionStorage.
 */

import { ReactiveScope } from './reactivity';

export function bindStoragePersistence(element: HTMLElement, scope: ReactiveScope): void {
    for (const attr of Array.from(element.attributes)) {
        if (attr.name === 'l-persist' || attr.name.startsWith('l-persist.') || attr.name === 'l-sync-storage') {
            const key = attr.value || 'laughtale_persisted_state';
            const useSession = attr.name.includes('.session');
            const storage = useSession ? sessionStorage : localStorage;

            // 1. Load saved state from storage
            try {
                const saved = storage.getItem(key);
                if (saved) {
                    const parsed = JSON.parse(saved);
                    if (typeof parsed === 'object' && parsed !== null) {
                        Object.assign(scope.state, parsed);
                    }
                }
            } catch (err) {
                console.warn(`[LaughTale] Failed to read persisted state for key "${key}":`, err);
            }

            // 2. Save on state mutation with 150ms debounce
            let timer: any = null;
            const save = () => {
                clearTimeout(timer);
                timer = setTimeout(() => {
                    try {
                        storage.setItem(key, JSON.stringify(scope.state));
                    } catch (err) {
                        console.warn(`[LaughTale] Failed to save persisted state for key "${key}":`, err);
                    }
                }, 150);
            };

            scope.listeners.add(save);
        }
    }
}
