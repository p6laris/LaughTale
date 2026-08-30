/**
 * SoftMax.LaughTale: Declarative Reactivity Engine (Hardened Security Edition)
 * Lightweight JavaScript Proxy state management, AST expression evaluation, XSS prevention, and two-way data binding.
 */

import { isSafeAttribute, isSafeProperty, sanitizeUrl } from './security';
import { parseExpressionToAst, evaluateAst } from './expression/index';

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

    const state = new Proxy(initialData, {
        set(target, prop, value) {
            if (!isSafeProperty(prop)) {
                console.warn(`[SoftMax.LaughTale Security] Blocked assignment to restricted property: "${String(prop)}"`);
                return true;
            }
            target[prop as string] = value;
            listeners.forEach((fn) => fn());
            return true;
        },
        get(target, prop) {
            if (!isSafeProperty(prop)) {
                console.warn(`[SoftMax.LaughTale Security] Blocked access to restricted property: "${String(prop)}"`);
                return undefined;
            }
            return target[prop as string];
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
        console.warn(`[SoftMax.LaughTale] Error evaluating expression "${expr}":`, err);
        return undefined;
    }
}

export function executeStatement(stmt: string, state: Record<string, any>, extraContext: Record<string, any> = {}): void {
    try {
        const ast = parseExpressionToAst(stmt);
        if (!ast) return;
        evaluateAst(ast, state, extraContext);
    } catch (err) {
        console.warn(`[SoftMax.LaughTale] Error executing statement "${stmt}":`, err);
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
            scope.listeners.add(update);
            update();
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
            scope.listeners.add(update);
            update();
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
            scope.listeners.add(update);
            update();
        } else if (attr.name === 'l-style') {
            const expr = attr.value;
            const update = () => {
                const val = evaluateExpression(expr, scope.state);
                if (typeof val === 'object' && val !== null) {
                    Object.assign(element.style, val);
                }
            };
            scope.listeners.add(update);
            update();
        }
    }

    // 2. Two-Way Model Binding: l-model="property"
    if (element.hasAttribute('l-model')) {
        const propName = element.getAttribute('l-model')!;
        if (!isSafeProperty(propName)) {
            console.warn(`[SoftMax.LaughTale Security] Blocked l-model binding on restricted property: "${propName}"`);
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
        scope.listeners.add(update);
        update();

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
