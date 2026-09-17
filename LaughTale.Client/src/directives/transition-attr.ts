/**
 * LaughTale: Shared `l-transition` Attribute Parser
 *
 * Both `l-if` (directives/conditional.ts) and `l-for` (directives/list.ts) accept an optional
 * `l-transition="<preset>[:<durationMs>]"` attribute. Parsing it lives in one place so both
 * directives share the exact same grammar and preset vocabulary (`TransitionPreset`, the same
 * union `useTransition.ts` already defines) rather than drifting apart.
 */

import type { TransitionPreset } from '../composables/animation/useTransition';

const VALID_PRESETS: ReadonlySet<TransitionPreset> = new Set([
    'fade',
    'scale',
    'slide-up',
    'slide-down',
    'slide-left',
    'slide-right',
    'collapse'
]);

function isTransitionPreset(value: string): value is TransitionPreset {
    return VALID_PRESETS.has(value as TransitionPreset);
}

/**
 * Parses `l-transition`'s raw attribute value. Returns `null` when the attribute is absent, or
 * when the preset itself is unrecognized (a `console.warn` is emitted so a typo isn't silently
 * swallowed) - callers fall back to no-animation behavior in either case, never a thrown error.
 * A malformed/negative duration suffix warns but does not discard an otherwise-valid preset;
 * the result omits `duration` so the caller's own default (matching `useTransition`'s 200ms) applies.
 */
export function parseTransitionAttr(raw: string | null): { preset: TransitionPreset; duration?: number } | null {
    if (raw === null) return null;

    const trimmed = raw.trim();
    if (trimmed === '') return null;

    const [presetPart, durationPart] = trimmed.split(':');
    const preset = presetPart.trim();

    if (!isTransitionPreset(preset)) {
        console.warn(`[LaughTale] Unknown l-transition preset: "${preset}"`);
        return null;
    }

    if (durationPart === undefined) {
        return { preset };
    }

    const duration = Number(durationPart.trim());
    if (!Number.isFinite(duration) || duration < 0) {
        console.warn(`[LaughTale] Invalid l-transition duration: "${durationPart.trim()}" (expected a non-negative number of milliseconds)`);
        return { preset };
    }

    return { preset, duration };
}
