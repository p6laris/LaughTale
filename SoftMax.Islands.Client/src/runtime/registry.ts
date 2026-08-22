/**
 * SoftMax.Islands: Island Factory & Loader Registry
 */

export type IslandFactory<TProps = any> = (
    container: HTMLElement,
    props: TProps
) => void | (() => void) | Promise<void | (() => void)>;

export type IslandLoader<TProps = any> = () => Promise<
    { default: IslandFactory<TProps> } | IslandFactory<TProps>
>;

const registry = new Map<string, IslandLoader>();

/**
 * Registers an Island component factory with lazy loader support.
 * @param name The unique name matching C# [Island("name")]
 * @param loader Async import factory e.g. () => import('./my-island')
 */
export function defineIsland<TProps = any>(name: string, loader: IslandLoader<TProps>): void {
    registry.set(name, loader);
}

/**
 * Checks if an island is registered in the registry.
 */
export function hasIsland(name: string): boolean {
    return registry.has(name);
}

/**
 * Retrieves the registered island loader.
 */
export function getIslandLoader(name: string): IslandLoader | undefined {
    return registry.get(name);
}
