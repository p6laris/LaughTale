/**
 * LaughTale: Internal Island Update-Function Bookkeeping
 *
 * Connects a mounted island's container element to the optional in-place `update(props)`
 * function its adapter returned (see `IslandInstance` in `./registry`). This is internal
 * refresh plumbing only — deliberately NOT exposed on the public `container.island` handle
 * that `hydrator.ts` attaches, since that handle is public API surface a page author can call
 * directly, and `update()` bypasses server-authoritative refresh/validation. `refresh.ts`
 * consults `getIslandUpdateFn` to decide whether it can push new props into an already-mounted
 * framework instance instead of tearing the container down and remounting from scratch.
 *
 * Keyed by a `WeakMap` so an unmounted/detached container's entry can be garbage collected
 * without any explicit bookkeeping beyond the teardown-time `clearIslandUpdateFn` call.
 */

export type IslandUpdateFn = (props: any) => void | Promise<void>;

const updateFns = new WeakMap<HTMLElement, IslandUpdateFn>();

/**
 * Registers the in-place update function for a mounted island container. Passing `undefined`
 * clears any existing entry (equivalent to `clearIslandUpdateFn`).
 */
export function setIslandUpdateFn(container: HTMLElement, update: IslandUpdateFn | undefined): void {
    if (update) {
        updateFns.set(container, update);
    } else {
        updateFns.delete(container);
    }
}

/**
 * Retrieves the in-place update function registered for a container, if its adapter provided one.
 */
export function getIslandUpdateFn(container: HTMLElement): IslandUpdateFn | undefined {
    return updateFns.get(container);
}

/**
 * Clears the registered update function for a container. Called on teardown so a stale
 * `update` can never be invoked against an unmounted instance.
 */
export function clearIslandUpdateFn(container: HTMLElement): void {
    updateFns.delete(container);
}
