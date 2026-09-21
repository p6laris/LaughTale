/**
 * LaughTale: Island Factory & Loader Registry
 */

import type { IslandStore } from './state';

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
    /**
     * True when this container already had DOM content (server-rendered markup, an `.island-slot`,
     * etc.) at the moment hydration started - computed once by hydrator.ts via `container.hasChildNodes()`
     * so every mount function (vanilla included) has a normalized signal for "adopt existing DOM" vs
     * "render fresh" instead of reinventing ad-hoc detection (ROADMAP.v5.md Part D).
     */
    hydrate?: boolean;
    /**
     * Reaches `runtime/state.ts`'s existing (previously unwired) `useSharedState` composable, so an
     * island can read/write cross-island state without a separate import. Deliberately named
     * `sharedState`, not `state` - see `state` below for the server-dehydrated counterpart
     * (ROADMAP.v5.md Part F).
     */
    sharedState?<T = any>(key: string, initialValue?: T): IslandStore<T>;
    /**
     * ROADMAP.v5.md Part F (Ambient state pool): `runtime/ambient-state.ts`'s `useAmbientState`,
     * seeded from the server-rendered `<script id="__LAUGHTALE_STATE__">` blob when present. Shares
     * `sharedState`'s underlying store, so a key set via `ctx.state` is also visible to `ctx.sharedState`
     * calls for the same key and vice versa - only the INITIAL seed differs.
     */
    state?<T = any>(key: string, initialValue?: T): IslandStore<T>;
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

/**
 * Bridges a framework-authored island component to `defineIsland`, resolving its mount factory
 * from the named adapter registry (`adapters/registry.ts`'s `getAdapter`) instead of requiring
 * every call site to import a specific adapter file directly. E.g.:
 * ```ts
 * defineFrameworkIsland('user-card', () => import('./UserCard'), 'react');
 * ```
 *
 * Deliberately resolves `getAdapter` via a DYNAMIC import at call time (inside the lazy loader
 * passed to `defineIsland`, which only ever runs once an island actually hydrates) rather than a
 * static top-level `import { getAdapter } from '../adapters/registry'`. `adapters/registry.ts`
 * imports `IslandFactory` — a type — FROM this file, so a static value-level import in the other
 * direction would make the two modules a real circular pair in the source module graph. A
 * dynamic import here has no such effect: it is not part of either module's static dependency
 * list, is only ever evaluated well after both modules have finished initializing, and costs
 * nothing extra since this loader is already async and already off the critical path (it is the
 * same lazy-loading boundary `defineIsland` callers already pay for their component chunk).
 */
export function defineFrameworkIsland(
    name: string,
    loader: () => Promise<{ default: any }>,
    framework: string
): void {
    defineIsland(name, async () => {
        const mod = await loader();
        const { getAdapter } = await import('../adapters/registry');
        const adapter = getAdapter(framework);
        if (!adapter) {
            throw new Error(`[LaughTale] No adapter registered for framework "${framework}".`);
        }
        return { default: adapter(mod.default) };
    });
}
