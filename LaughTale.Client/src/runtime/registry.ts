/**
 * LaughTale: Island Factory & Loader Registry
 */

export type IslandTeardown = () => void;

export interface IslandContext {
    signal: AbortSignal;
    onCleanup(fn: () => void): void;
    container: HTMLElement;
    name: string;
    locale: string;
    dir: 'ltr' | 'rtl';
    t?: (key: string, ...args: any[]) => string;
    dictionary?: Record<string, any>;
}

/**
 * Richer mount result an adapter may return instead of a bare teardown function.
 * `update`, when present, lets `refresh.ts` push new props into an already-mounted
 * framework instance (React `root.render`, Vue prop-ref reassignment, Preact `render`
 * re-diff) instead of tearing the container down and remounting from scratch on every
 * server-driven refresh — see ROADMAP.v5.md Part D. Both fields are optional so an
 * adapter can supply just `unmount` (equivalent to today's bare-function return) or add
 * `update` incrementally. See `normalizeMountResult`.
 */
export interface IslandInstance {
    unmount?: IslandTeardown;
    update?: (props: any) => void | Promise<void>;
}

export type IslandFactory<TProps = any, THandle = any> = (
    container: HTMLElement,
    props: TProps,
    ctx?: IslandContext
) => void | IslandTeardown | IslandInstance | Promise<void | IslandTeardown | IslandInstance>;

/**
 * Normalizes any shape an `IslandFactory` may return — `undefined`/`void`, a bare teardown
 * function, or an `IslandInstance` object — into a consistent `{ unmount?, update? }` shape.
 * Additive by construction: existing mount functions returning `void` or a bare function
 * (every `defineIsland(...)` mount function in `src/components/` today) keep working
 * unchanged.
 */
export function normalizeMountResult(
    result: void | IslandTeardown | IslandInstance | undefined
): IslandInstance {
    if (!result) {
        return {};
    }
    if (typeof result === 'function') {
        return { unmount: result };
    }
    return result;
}

export interface IslandModule<TProps = any, THandle = any> {
    default: IslandFactory<TProps, THandle>;
    readonly displayName?: string;
    readonly propsSchema?: Record<string, any>;
    readonly createHandle?: (container: HTMLElement, props: TProps) => THandle;
}

export type IslandLoader<TProps = any, THandle = any> = () => Promise<
    IslandModule<TProps, THandle> | { default: IslandFactory<TProps, THandle> } | IslandFactory<TProps, THandle>
>;

export interface IslandDefinition<TProps = any, THandle = any> {
    name: string;
    loader: IslandLoader<TProps, THandle>;
}

/**
 * Historical and shorthand aliases mapped to canonical kebab-case island names.
 * Scheduled for removal in LaughTale v4.
 */
export const LEGACY_ALIASES: Readonly<Record<string, string>> = Object.freeze({
    // Media
    'imagecompare': 'image-compare',
    'compare': 'image-compare',
    'p-compare': 'image-compare',
    'island-compare': 'image-compare',

    // Data
    'tree-table': 'treetable',
    'p-treetable': 'treetable',
    'island-treetable': 'treetable',
    'datagrid': 'datatable',

    // Form
    'togglebutton': 'toggle-button',
    'chips': 'input-tags',
    'inputtags': 'input-tags',
    'tags': 'input-tags',
    'file-upload': 'fileupload',
    'confirmdialog': 'confirm-dialog',
    'radio': 'radio-button',
    'inputgroup': 'input-group',
    'inputgroup-addon': 'input-group-addon',
    'enhanced-input': 'input-text',

    // Menu & Overlay
    'commandmenu': 'command',
    'command-menu': 'command',
    'command-palette': 'command',
    'commandpalette': 'command',
    'p-menubar': 'menubar',
    'island-menubar': 'menubar',
    'p-menu': 'menu',
    'contextmenu': 'context-menu',
    'p-contextmenu': 'context-menu',
    'island-contextmenu': 'context-menu',
    'tooltip': 'tooltip-component',
    'p-sidebar': 'sidebar',
    'sidebar-layout': 'sidebar',
    'tiered-menu': 'tieredmenu',
    'p-tieredmenu': 'tieredmenu',
    'island-tieredmenu': 'tieredmenu',
    'p-message': 'message',
    'inline-message': 'message',
    'inlinemessage': 'message',
    'p-toast': 'toast',
    'island-toast': 'toast'
});

/**
 * The registry's backing Map lives on `globalThis`, not module scope. A page can load more
 * than one independently-built bundle that each carry their own copy of this module's code —
 * e.g. the framework's own runtime bundle alongside a separately-built bundle for
 * user-authored islands discovered under `Islands/**` (see ROADMAP.v5.md Part B) — and ESM
 * gives each bundle its own module instance, so a plain module-scope `const` would silently
 * split into two disconnected registries: islands `defineIsland`-registered by one bundle would
 * never be found by `getIslandLoader` calls from the other. Anchoring on `globalThis` makes any
 * number of independently-bundled copies of this file share one registry automatically,
 * regardless of load order. This is a no-op for every app that only ever loads a single bundle
 * (true of every app in this repo today) — same Map, same behavior, just a different place to
 * hold the reference.
 */
const REGISTRY_KEY = '__laughtaleIslandRegistry__';

function getSharedRegistry(): Map<string, IslandLoader> {
    const g = globalThis as typeof globalThis & { [REGISTRY_KEY]?: Map<string, IslandLoader> };
    if (!g[REGISTRY_KEY]) {
        g[REGISTRY_KEY] = new Map<string, IslandLoader>();
    }
    return g[REGISTRY_KEY];
}

const registry = getSharedRegistry();

/**
 * Resolves an island name to its canonical identifier, issuing a deprecation warning if an alias is used.
 */
export function resolveIslandName(name: string): string {
    if (registry.has(name)) {
        return name;
    }
    if (LEGACY_ALIASES[name]) {
        const canonical = LEGACY_ALIASES[name];
        console.warn(`[LaughTale] Island alias "${name}" is deprecated and will be removed in v4. Use canonical name "${canonical}" instead.`);
        return canonical;
    }
    return name;
}

/**
 * Fires after `defineIsland` registers a name, so a late registration - e.g. a separately-built,
 * separately-loaded islands bundle for user-authored islands (ROADMAP.v5.md Part B) whose
 * `<script>` tag happens to load after the app's own main bundle already called `initIslands()`
 * and scanned the DOM - can be picked up retroactively instead of the element being permanently
 * stuck in the 'failed' state. Deliberately generic here (registry.ts has no concept of hydration
 * state/DOM scanning, and must not import from hydrator.ts, which already imports from this file):
 * hydrator.ts subscribes once and does the actual retry.
 *
 * Anchored on globalThis for the exact same reason `registry` itself is (see the comment above):
 * the app's main bundle and a separately-built islands bundle are two independent module
 * instances of this same file. hydrator.ts's subscription runs inside the MAIN bundle's copy;
 * `defineIsland` for a user-authored island runs inside the ISLANDS bundle's copy. A plain
 * module-scope array would mean each copy has its own, disconnected listener list, and the
 * subscription would never see the registration at all - confirmed the hard way: this exact gap
 * shipped once already, one commit before this one, before the browser-based end-to-end
 * validation caught it (a Node-based unit test can't catch it, since Node's module cache doesn't
 * reproduce the two-independent-bundle-instances scenario the way two real <script> tags do).
 */
type IslandRegisteredListener = (name: string) => void;
const LISTENERS_KEY = '__laughtaleIslandRegisteredListeners__';

function getSharedListeners(): IslandRegisteredListener[] {
    const g = globalThis as typeof globalThis & { [LISTENERS_KEY]?: IslandRegisteredListener[] };
    if (!g[LISTENERS_KEY]) {
        g[LISTENERS_KEY] = [];
    }
    return g[LISTENERS_KEY];
}

export function onIslandRegistered(listener: IslandRegisteredListener): void {
    getSharedListeners().push(listener);
}

/**
 * Registers an Island component factory with lazy loader support.
 * @param name The canonical name matching C# [Island("name")]
 * @param loader Async import factory e.g. () => import('./my-island')
 */
export function defineIsland<TProps = any, THandle = any>(
    name: string,
    loader: IslandLoader<TProps, THandle>
): void {
    registry.set(name, loader as IslandLoader);
    for (const listener of getSharedListeners()) listener(name);
}

/**
 * Checks if an island is registered in the registry (supports canonical names and legacy aliases).
 */
export function hasIsland(name: string): boolean {
    const resolved = resolveIslandName(name);
    return registry.has(resolved);
}

/**
 * Retrieves the registered island loader (supports canonical names and legacy aliases).
 */
export function getIslandLoader(name: string): IslandLoader | undefined {
    const resolved = resolveIslandName(name);
    return registry.get(resolved);
}

/**
 * Retrieves the registered island definition (supports canonical names and legacy aliases).
 */
export function getIslandDefinition(name: string): IslandDefinition | undefined {
    const resolved = resolveIslandName(name);
    const loader = registry.get(resolved);
    return loader ? { name: resolved, loader } : undefined;
}

/**
 * Returns a list of all currently registered canonical island names.
 */
export function listIslands(): string[] {
    return Array.from(registry.keys());
}

/**
 * Clears the registry for test isolation.
 */
export function clearRegistry(): void {
    registry.clear();
}
