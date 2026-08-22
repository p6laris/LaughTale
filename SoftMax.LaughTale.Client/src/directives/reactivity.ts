/**
 * SoftMax.LaughTale: Declarative Reactivity Engine
 * Lightweight JavaScript Proxy state management, expression evaluation, and two-way data binding.
 */

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
            target[prop as string] = value;
            listeners.forEach((fn) => fn());
            return true;
        },
        get(target, prop) {
            return target[prop as string];
        }
    });

    const scope: ReactiveScope = { state, listeners, container };
    elementScopeMap.set(container, scope);
    return scope;
}

export function evaluateExpression(expr: string, state: Record<string, any>, extraContext: Record<string, any> = {}): any {
    try {
        const contextKeys = Object.keys(extraContext);
        const contextValues = Object.values(extraContext);
        const fn = new Function('state', ...contextKeys, `with(state) { return (${expr}); }`);
        return fn(state, ...contextValues);
    } catch (err) {
        console.error(`[SoftMax.LaughTale] Error evaluating expression "${expr}":`, err);
        return undefined;
    }
}

export function executeStatement(stmt: string, state: Record<string, any>, extraContext: Record<string, any> = {}): void {
    try {
        const contextKeys = Object.keys(extraContext);
        const contextValues = Object.values(extraContext);
        const fn = new Function('state', ...contextKeys, `with(state) { ${stmt}; }`);
        fn(state, ...contextValues);
    } catch (err) {
        console.error(`[SoftMax.LaughTale] Error executing statement "${stmt}":`, err);
    }
}

export function bindElementReactivity(element: HTMLElement, scope: ReactiveScope): void {
    // 1. Text & Attribute Binding: l-bind="expr" or l-bind:attr="expr"
    for (const attr of Array.from(element.attributes)) {
        if (attr.name === 'l-bind') {
            const expr = attr.value;
            const update = () => {
                const val = evaluateExpression(expr, scope.state);
                element.textContent = String(val ?? '');
            };
            scope.listeners.add(update);
            update();
        } else if (attr.name.startsWith('l-bind:')) {
            const targetAttr = attr.name.slice(7);
            const expr = attr.value;
            const update = () => {
                const val = evaluateExpression(expr, scope.state);
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
