/**
 * Default Vanilla TypeScript Adapter for LaughTale
 * Zero dependencies, < 1 KB footprint.
 */

export type VanillaMountFn<TProps = any> = (
    container: HTMLElement,
    props: TProps
) => (() => void) | void;

export function createVanillaIsland<TProps = any>(mount: VanillaMountFn<TProps>): VanillaMountFn<TProps> {
    return mount;
}
