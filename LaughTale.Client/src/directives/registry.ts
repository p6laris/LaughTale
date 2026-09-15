/**
 * LaughTale: Directive Binder Registry
 *
 * Lets a plugin (or app code) register its own per-element directive binder, so
 * `directives/index.ts`'s `initDirectives()` calls it alongside the framework's own built-in
 * binders (`bindElementEvents`, `bindHotkeyDirectives`, etc.) on every scanned element — closing
 * the Part I roadmap item "let users register their own directives" (ROADMAP.v5.md Part G/L).
 */

export type DirectiveBinder = (el: HTMLElement) => void;

/**
 * The registry's backing Map lives on `globalThis`, not module scope — for the exact same
 * reason `runtime/registry.ts`'s own island registry does (see that file's long-form comment,
 * confirmed the hard way twice this session): a page can load more than one independently-built
 * bundle that each carry their own copy of this module's code, and ESM gives each bundle its own
 * module instance, so a plain module-scope `const` would silently split into two disconnected
 * registries — a directive registered by one bundle would never be seen by `initDirectives()`
 * running from another. Anchoring on `globalThis` makes any number of independently-bundled
 * copies of this file share one registry automatically, regardless of load order. This is a
 * no-op for every app that only ever loads a single bundle.
 */
const DIRECTIVE_REGISTRY_KEY = '__laughtaleDirectiveRegistry__';

function getSharedDirectiveRegistry(): Map<string, DirectiveBinder> {
    const g = globalThis as typeof globalThis & { [DIRECTIVE_REGISTRY_KEY]?: Map<string, DirectiveBinder> };
    if (!g[DIRECTIVE_REGISTRY_KEY]) {
        g[DIRECTIVE_REGISTRY_KEY] = new Map<string, DirectiveBinder>();
    }
    return g[DIRECTIVE_REGISTRY_KEY];
}

/**
 * Registers a custom directive binder under a name. `binder` is called once per scanned element
 * (matching the existing per-element convention every built-in binder already follows in
 * `directives/index.ts`'s `initDirectives()`), and is responsible for checking whether the
 * element actually carries whatever attribute(s) it cares about. Re-registering the same name
 * overwrites the previous binder.
 */
export function registerDirective(name: string, binder: DirectiveBinder): void {
    getSharedDirectiveRegistry().set(name, binder);
}

/**
 * Returns every currently registered directive binder, in registration order.
 */
export function listDirectiveBinders(): DirectiveBinder[] {
    return Array.from(getSharedDirectiveRegistry().values());
}

/**
 * Clears the registry for test isolation.
 */
export function clearDirectiveRegistry(): void {
    getSharedDirectiveRegistry().clear();
}
