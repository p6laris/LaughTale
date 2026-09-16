/**
 * LaughTale: Declarative Reactivity Engine (Hardened Security Edition)
 * Lightweight JavaScript Proxy state management, AST expression evaluation, XSS prevention, and two-way data binding.
 */

import { isSafeAttribute, isSafeProperty, sanitizeUrl } from './security';
import { parseExpressionToAst, evaluateAst } from './expression/index';
import { signal, effect, type Signal } from '../runtime/signals';
import { registerDirectiveCleanup } from './lifecycle';

export interface ReactiveScope {
    state: Record<string, any>;
    listeners: Set<() => void>;
    container: HTMLElement;
}

const elementScopeMap = new WeakMap<HTMLElement, ReactiveScope>();

export function getNearestScope(element: HTMLElement): ReactiveScope | undefined {
    let current: HTMLElement | null = element;
    while (current) {
        const scope = elementScopeMap.get(current);
        if (scope) return scope;
        current = current.parentElement;
    }
    return undefined;
}

export function createReactiveScope(container: HTMLElement, initialData: Record<string, any>): ReactiveScope {
    const listeners = new Set<() => void>();

    // Per-key signals, created lazily on first read or write of a given property.
    // This is what gives l-bind/l-model/etc. fine-grained tracking: an `effect()`
    // that only reads `state.a` re-runs when `a` changes, not when `b` changes.
    const signals = new Map<string, Signal<any>>();
    const getSignal = (key: string): Signal<any> => {
        let sig = signals.get(key);
        if (!sig) {
            sig = signal(Object.prototype.hasOwnProperty.call(initialData, key) ? initialData[key] : undefined);
            signals.set(key, sig);
        }
        return sig;
    };

    const state = new Proxy(initialData, {
        set(target, prop, value) {
            if (!isSafeProperty(prop)) {
                console.warn(`[LaughTale Security] Blocked assignment to restricted property: "${String(prop)}"`);
                return true;
            }
            if (typeof prop !== 'string') {
                // Symbols (e.g. well-known symbols probed by JSON.stringify/util
                // internals) aren't part of the reactive key space - fall back to
                // the plain target, matching the pre-signals behavior for them.
                (target as any)[prop] = value;
                listeners.forEach((fn) => fn());
                return true;
            }
            target[prop] = value;
            // Fine-grained: only subscribers of THIS key re-run.
            getSignal(prop).set(value);
            // Coarse broadcast kept intact: storage.ts's l-persist debounces a full
            // JSON.stringify(scope.state) snapshot from a setTimeout, asynchronously,
            // so it legitimately wants "notify on any key changing" rather than
            // per-key tracking.
            listeners.forEach((fn) => fn());
            return true;
        },
        get(target, prop) {
            if (!isSafeProperty(prop)) {
                console.warn(`[LaughTale Security] Blocked access to restricted property: "${String(prop)}"`);
                return undefined;
            }
            if (typeof prop !== 'string') {
                return (target as any)[prop];
            }
            // Tracked read: registers this key as a dependency of the active effect/computed, if any.
            return getSignal(prop)();
        }
    });

    const scope: ReactiveScope = { state, listeners, container };
    elementScopeMap.set(container, scope);
    return scope;
}

export function evaluateExpression(expr: string, state: Record<string, any>, extraContext: Record<string, any> = {}): any {
    try {
        const ast = parseExpressionToAst(expr);
        if (!ast) return undefined;
        return evaluateAst(ast, state, extraContext);
    } catch (err) {
        console.warn(`[LaughTale] Error evaluating expression "${expr}":`, err);
        return undefined;
    }
}

export function executeStatement(stmt: string, state: Record<string, any>, extraContext: Record<string, any> = {}): void {
    try {
        const ast = parseExpressionToAst(stmt);
        if (!ast) return;
        evaluateAst(ast, state, extraContext);
    } catch (err) {
        console.warn(`[LaughTale] Error executing statement "${stmt}":`, err);
    }
}

export function bindElementReactivity(element: HTMLElement, scope: ReactiveScope): void {
    // 1. Text & Attribute Binding: l-bind="expr" or l-bind:attr="expr"
    for (const attr of Array.from(element.attributes)) {
        if (attr.name === 'l-bind') {
            const expr = attr.value;
            const update = () => {
                const val = evaluateExpression(expr, scope.state);
                // Safe textContent assignment immune to XSS
                element.textContent = String(val ?? '');
            };
            registerDirectiveCleanup(element, effect(update));
        } else if (attr.name.startsWith('l-bind:')) {
            const targetAttr = attr.name.slice(7);
            if (!isSafeAttribute(targetAttr)) {
                continue;
            }

            const expr = attr.value;
            const update = () => {
                let val = evaluateExpression(expr, scope.state);

                // Protocol sanitization for URLs
                if (['href', 'src', 'action'].includes(targetAttr.toLowerCase())) {
                    val = sanitizeUrl(val);
                }

                if (val === false || val === null || val === undefined) {
                    element.removeAttribute(targetAttr);
                } else if (val === true) {
                    element.setAttribute(targetAttr, '');
                } else {
                    element.setAttribute(targetAttr, String(val));
                }
            };
            registerDirectiveCleanup(element, effect(update));
        } else if (attr.name === 'l-class') {
            const expr = attr.value;
            const update = () => {
                const val = evaluateExpression(expr, scope.state);
                if (typeof val === 'object' && val !== null) {
                    for (const [className, active] of Object.entries(val)) {
                        element.classList.toggle(className, Boolean(active));
                    }
                } else if (typeof val === 'string') {
                    element.className = val;
                }
            };
            registerDirectiveCleanup(element, effect(update));
        } else if (attr.name === 'l-style') {
            const expr = attr.value;
            const update = () => {
                const val = evaluateExpression(expr, scope.state);
                if (typeof val === 'object' && val !== null) {
                    Object.assign(element.style, val);
                }
            };
            registerDirectiveCleanup(element, effect(update));
        }
    }

    // 2. Two-Way Model Binding: l-model="property"
    if (element.hasAttribute('l-model')) {
        const propName = element.getAttribute('l-model')!;
        if (!isSafeProperty(propName)) {
            console.warn(`[LaughTale Security] Blocked l-model binding on restricted property: "${propName}"`);
            return;
        }

        const input = element as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

        // Model to View
        const update = () => {
            const val = scope.state[propName];
            if (input.type === 'checkbox') {
                (input as HTMLInputElement).checked = Boolean(val);
            } else {
                input.value = val ?? '';
            }
        };
        registerDirectiveCleanup(element, effect(update));

        // View to Model
        const eventName = input.type === 'checkbox' || input.tagName === 'SELECT' ? 'change' : 'input';
        input.addEventListener(eventName, () => {
            if (input.type === 'checkbox') {
                scope.state[propName] = (input as HTMLInputElement).checked;
            } else if (input.type === 'number') {
                scope.state[propName] = input.value === '' ? null : Number(input.value);
            } else {
                scope.state[propName] = input.value;
            }
        });
    }
}
