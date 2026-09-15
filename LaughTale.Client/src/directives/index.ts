/**
 * LaughTale: Declarative Directives Subsystem (Zero-JS Architecture)
 * Enterprise directive suite: reactivity, events, HTMX fragments, masking, hotkeys, tooltips,
 * outside clicks, storage persistence, polling, intersection, smooth scrolling, badges, and teleport.
 */

import { createReactiveScope, bindElementReactivity } from './reactivity';
import { bindElementEvents } from './events';
import { bindServerAction } from './htmx';
import { bindInputMask } from './masking';
import { bindUtilityDirectives } from './utils';
import { bindHotkeyDirectives } from './hotkey';
import { bindTooltipDirectives } from './tooltip';
import { bindOutsideClickDirectives } from './outside';
import { bindStoragePersistence } from './storage';
import { bindPollingDirectives } from './poll';
import { bindIntersectionDirectives } from './intersect';
import { bindScrollToDirectives } from './scroll';
import { bindBadgeDirectives } from './badge';
import { bindTeleportDirectives } from './teleport';
import { listDirectiveBinders } from './registry';

export * from './security';
export * from './reactivity';
export * from './registry';

export function initDirectives(root: ParentNode = document): void {
    // 1. Initialize Reactive Scopes: [l-state]
    const stateElements = root.querySelectorAll<HTMLElement>('[l-state]');
    stateElements.forEach((el) => {
        const rawJson = el.getAttribute('l-state');
        try {
            const initialData = rawJson ? JSON.parse(rawJson) : {};
            const scope = createReactiveScope(el, initialData);

            // Storage Persistence: [l-persist]
            bindStoragePersistence(el, scope);
        } catch (err) {
            console.error('[LaughTale] Invalid JSON in l-state:', rawJson, err);
        }
    });

    // 2. Scan and Bind all children within scopes or root
    const allElements = root.querySelectorAll<HTMLElement>('*');
    allElements.forEach((el) => {
        // A. Reactivity bindings (l-bind, l-model, l-class, l-style)
        for (const attr of Array.from(el.attributes)) {
            if (attr.name === 'l-bind' || attr.name.startsWith('l-bind:') || attr.name === 'l-model' || attr.name === 'l-class' || attr.name === 'l-style') {
                import('./reactivity').then(({ getNearestScope }) => {
                    const nearest = getNearestScope(el);
                    if (nearest) bindElementReactivity(el, nearest);
                });
                break;
            }
        }

        // B. Event handlers (l-on:*, l-listen:*, l-emit)
        bindElementEvents(el);

        // C. Server fragment actions (l-get, l-post, l-put, l-delete)
        if (el.hasAttribute('l-get') || el.hasAttribute('l-post') || el.hasAttribute('l-put') || el.hasAttribute('l-delete')) {
            bindServerAction(el);
        }

        // D. Pattern Input Masking (l-mask)
        if (el.hasAttribute('l-mask') && el.tagName === 'INPUT') {
            bindInputMask(el as HTMLInputElement);
        }

        // E. Utilities (l-show, l-hide, l-copy, l-toggle)
        bindUtilityDirectives(el);

        // F. Keyboard Shortcuts (l-hotkey, l-shortcut)
        bindHotkeyDirectives(el);

        // G. Aura Tooltips (l-tooltip)
        bindTooltipDirectives(el);

        // H. Outside Click Handler (l-outside)
        bindOutsideClickDirectives(el);

        // I. Declarative Polling (l-poll)
        bindPollingDirectives(el);

        // J. Viewport Intersection (l-intersect)
        bindIntersectionDirectives(el);

        // K. Smooth Scrolling (l-scroll-to)
        bindScrollToDirectives(el);

        // L. Aura Status Badges (l-badge)
        bindBadgeDirectives(el);

        // M. DOM Teleport (l-teleport)
        bindTeleportDirectives(el);

        // N. Plugin-registered custom directives (registerDirective)
        for (const binder of listDirectiveBinders()) binder(el);
    });
}

// REMOVED (found via a real live-browser test of a real <island-form> Server Action,
// ROADMAP.v5.md Part G/L): this module used to auto-run initDirectives() on import, as a
// side effect purely of loading this file - completely independent of, and in addition to,
// every consuming app's own explicit initDirectives() call (both real apps in this repo,
// LaughTale.Showcase/Scripts/main.ts and LaughTale.Docs/Scripts/main.ts, already call it
// themselves inside their own DOMContentLoaded-guarded initialize()). Since importing this
// module happens as an ordinary part of evaluating those apps' own entry module - well
// before their explicit call ever runs - initDirectives() was being invoked TWICE on every
// page load: once here automatically, once more explicitly. Every directive on every page
// (l-post/l-get/l-put/l-delete, l-on:*, l-poll, l-intersect, l-hotkey, l-tooltip, l-mask,
// l-badge, l-teleport, everything in the per-element loop above) was getting bound twice as
// a result - confirmed concretely via a real <island-form>: a single genuine form submit
// fired two independent fetch() calls (and, for the default outerHTML swap, the SAME
// underlying stale-target bug this session already fixed in htmx.ts compounded the effect
// further after the first swap). No known consumer relied on this auto-run firing without
// also making its own explicit call, so removing it is a straightforward fix, not a
// behavior change any real app depended on.
