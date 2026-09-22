/**
 * LaughTale: Finite State Machine Primitive (ROADMAP.v5.md Part M "Adopt - State machine for
 * overlays"). Ends the `isOpen && !isDisabled && hasFocus` boolean soup a hand-rolled ad-hoc flag
 * set always drifts into: instead of each call site remembering to re-check every guard before
 * mutating a bag of independent booleans, a transition either fires (guard passed, state changes,
 * entry/exit actions run) or doesn't - there's no way to reach an inconsistent combination.
 *
 * Deliberately hand-written, not the real Zag.js/XState packages the roadmap cites as prior art:
 * this repo's own `runtime/signals.ts` already exists for the exact same "the ecosystem's SolidJS/
 * Preact Signals, written from scratch" reason - a real dependency-free equivalent that integrates
 * directly with THIS framework's own reactivity (the current state is a signal, so an `effect()`
 * re-renders automatically on transition, with zero adapter glue). Small and DOM-agnostic on
 * purpose, matching signals.ts's own scope boundary - this module has no knowledge of overlays,
 * elements, or directives; `composables/useDisclosure.ts` is what teaches it about open/closed.
 */

import { signal, type Signal } from './signals';

export interface TransitionConfig<TState extends string, TContext> {
    target: TState;
    /** Blocks the transition entirely (no state change, no actions) when it returns false. */
    guard?: (context: TContext) => boolean;
    /** Runs after the state has already changed to `target`. */
    action?: (context: TContext) => void;
}

export type Transition<TState extends string, TContext> = TState | TransitionConfig<TState, TContext>;

export interface StateNode<TState extends string, TEvent extends string, TContext> {
    on?: Partial<Record<TEvent, Transition<TState, TContext>>>;
    /** Runs whenever this state is entered - including the machine's own initial state at creation. */
    entry?: (context: TContext) => void;
    /** Runs whenever this state is exited (never called for the initial entry). */
    exit?: (context: TContext) => void;
}

export interface MachineConfig<TState extends string, TEvent extends string, TContext> {
    initial: TState;
    context: TContext;
    states: Record<TState, StateNode<TState, TEvent, TContext>>;
}

export interface Machine<TState extends string, TEvent extends string, TContext> {
    /** The current state as a signal - read it inside an `effect()`/`computed()` for automatic re-runs. */
    state: Signal<TState>;
    /** Mutable context the machine's guards/actions read - the same object identity for the machine's lifetime. */
    context: TContext;
    /** Attempts the named event against the current state's transition table. A no-op if there's no
     * matching `on[event]` entry, or if the matching transition's guard returns false. */
    send(event: TEvent): void;
    /** Convenience for `state() === candidate` without importing the signal-read syntax at call sites. */
    matches(candidate: TState): boolean;
}

export function createMachine<TState extends string, TEvent extends string, TContext>(
    config: MachineConfig<TState, TEvent, TContext>
): Machine<TState, TEvent, TContext> {
    const state = signal<TState>(config.initial);
    const context = config.context;

    config.states[config.initial]?.entry?.(context);

    function send(event: TEvent): void {
        const current = state.peek();
        const node = config.states[current];
        const transition = node?.on?.[event];
        if (!transition) return;

        const isShorthand = typeof transition === 'string';
        const target: TState = isShorthand ? (transition as TState) : (transition as TransitionConfig<TState, TContext>).target;
        const guard = isShorthand ? undefined : (transition as TransitionConfig<TState, TContext>).guard;
        const action = isShorthand ? undefined : (transition as TransitionConfig<TState, TContext>).action;

        if (guard && !guard(context)) return;

        if (target !== current) {
            node?.exit?.(context);
            state.set(target);
            const targetNode: StateNode<TState, TEvent, TContext> | undefined = config.states[target];
            targetNode?.entry?.(context);
        }

        action?.(context);
    }

    return {
        state,
        context,
        send,
        matches: (candidate: TState) => state() === candidate
    };
}
