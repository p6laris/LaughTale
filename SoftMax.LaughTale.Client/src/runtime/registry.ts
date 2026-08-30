/**
 * SoftMax.LaughTale: Island Factory & Loader Registry
 */

export type IslandTeardown = () => void;

export type IslandFactory<TProps = any, THandle = any> = (
    container: HTMLElement,
    props: TProps
) => void | IslandTeardown | Promise<void | IslandTeardown>;

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

const registry = new Map<string, IslandLoader>();

/**
 * Resolves an island name to its canonical identifier, issuing a deprecation warning if an alias is used.
 */
export function resolveIslandName(name: string): string {
    if (registry.has(name)) {
        return name;
    }
    if (LEGACY_ALIASES[name]) {
        const canonical = LEGACY_ALIASES[name];
        console.warn(`[SoftMax.LaughTale] Island alias "${name}" is deprecated and will be removed in v4. Use canonical name "${canonical}" instead.`);
        return canonical;
    }
    return name;
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
