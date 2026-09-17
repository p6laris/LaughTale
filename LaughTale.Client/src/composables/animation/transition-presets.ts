/**
 * LaughTale: Shared Transition Preset Visuals
 *
 * The single source of truth for what each `TransitionPreset` (besides `collapse`, which only
 * `useTransition.ts` supports - see `runtime/list-transitions.ts`) actually looks like: whether it
 * animates opacity, and what its transform value is in each state. Both `useTransition.ts` (inline
 * CSSStyleDeclaration, used by `l-if` and `multiselect.ts`'s overlay) and `runtime/list-transitions.ts`
 * (WAAPI Keyframe pairs, used by `l-for`'s `patchList`) derive their per-preset output from this one
 * table instead of each hand-maintaining their own copy of the same 6-case mapping - so `l-transition`
 * looks identical on `l-if` and `l-for` by construction, not by careful hand-porting.
 */

import type { TransitionPreset } from './useTransition';

export type SimplePreset = Exclude<TransitionPreset, 'collapse'>;

export interface PresetVisual {
    /** Whether this preset animates opacity 0 <-> 1. */
    opacity?: true;
    /** 'none': a constant (never animated) transform, e.g. fade's `transform: none`.
     *  An object: the transform value in each state - animated between the two. */
    transform?: 'none' | { hidden: string; visible: string };
}

export const PRESET_VISUALS: Record<SimplePreset, PresetVisual> = {
    fade: { opacity: true, transform: 'none' },
    scale: { opacity: true, transform: { hidden: 'scale(0.95)', visible: 'scale(1)' } },
    'slide-up': { opacity: true, transform: { hidden: 'translateY(12px)', visible: 'translateY(0)' } },
    'slide-down': { opacity: true, transform: { hidden: 'translateY(-12px)', visible: 'translateY(0)' } },
    'slide-left': { transform: { hidden: 'translateX(100%)', visible: 'translateX(0)' } },
    'slide-right': { transform: { hidden: 'translateX(-100%)', visible: 'translateX(0)' } }
};
