/**
 * Default Vanilla TypeScript Adapter for LaughTale
 * Zero dependencies, < 1 KB footprint.
 */

import type { IslandContext } from '../runtime/registry';

/**
 * `ctx` was always silently missing from this type even though every real vanilla component
 * (`fieldset.ts`, `panel.ts`, etc.) already receives and uses it - hydrator.ts calls every mount
 * function with 3 arguments regardless of adapter, so this was a stale/incomplete type, not a
 * behavior change. `ctx.hydrate`/`ctx.sharedState` (ROADMAP.v5.md Part D) are reachable through it
 * like any other `IslandContext` field.
 */
export type VanillaMountFn<TProps = any> = (
    container: HTMLElement,
    props: TProps,
    ctx?: IslandContext
) => (() => void) | void;

export function createVanillaIsland<TProps = any>(mount: VanillaMountFn<TProps>): VanillaMountFn<TProps> {
    return mount;
}

export const createVanillaAdapter = createVanillaIsland;

