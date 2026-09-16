/**
 * LaughTale: List Rendering Directive (l-for)
 *
 * Renders a flat list of items from a reactive array (`l-for="item in items"`) using
 * the element it's declared on as a per-item template. Keeps this intentionally
 * simple per ROADMAP.v5.md Part I: no nested l-for support, no transitions, no
 * arbitrarily deep directive composition - just item rendering, reacting to the
 * array reference changing, and letting l-bind/l-if/l-show on the template (or its
 * descendants) read the current item via the loop variable name.
 */

import { bindElementReactivity, createReactiveScope, evaluateExpression, getNearestScope, type ReactiveScope } from './reactivity';
import { bindConditionalDirectives } from './conditional';
import { bindUtilityDirectives } from './utils';
import { effect } from '../runtime/signals';
import { registerDirectiveCleanup } from './lifecycle';
import { patchList } from '../runtime/list-patch';

const REACTIVITY_ATTR_NAMES = new Set(['l-bind', 'l-model', 'l-class', 'l-style']);

function isReactivityAttr(name: string): boolean {
    return REACTIVITY_ATTR_NAMES.has(name) || name.startsWith('l-bind:');
}

/**
 * Parses the one supported `l-for` form: "<identifier> in <expr>". This is a
 * directive-local micro-parse, not a change to the shared expression grammar -
 * `expr` itself still goes through the real `evaluateExpression`.
 */
function parseForExpr(raw: string): { loopVar: string; arrayExpr: string } | null {
    const match = raw.match(/^\s*([a-zA-Z_$][\w$]*)\s+in\s+(.+)$/);
    if (!match) return null;
    return { loopVar: match[1], arrayExpr: match[2].trim() };
}

/**
 * Binds the reactivity/conditional/utility directives that a rendered item's
 * markup may carry, against the item's own scope. This is a narrower version of
 * `initDirectives`'s per-element scan (no l-for-in-l-for, no server actions, no
 * events, etc.) - deliberately, since composing everything is out of scope here.
 */
function bindItemDirectives(root: HTMLElement): void {
    const elements: HTMLElement[] = [root, ...Array.from(root.querySelectorAll<HTMLElement>('*'))];
    for (const el of elements) {
        const nearest = getNearestScope(el);
        if (nearest) {
            for (const attr of Array.from(el.attributes)) {
                if (isReactivityAttr(attr.name)) {
                    bindElementReactivity(el, nearest);
                    break;
                }
            }
        }
        bindConditionalDirectives(el);
        bindUtilityDirectives(el);
    }
}

export function bindListDirectives(element: HTMLElement): void {
    if (!element.hasAttribute('l-for')) return;

    const raw = element.getAttribute('l-for')!;
    const parsed = parseForExpr(raw);
    if (!parsed) {
        console.warn(`[LaughTale] Invalid l-for expression: "${raw}" (expected "item in items")`);
        return;
    }
    const { loopVar, arrayExpr } = parsed;
    const keyExpr = element.getAttribute('l-key');

    const parentScope = getNearestScope(element);
    const template = element;
    const templateMarkup = template.outerHTML;

    const parent = template.parentNode;
    if (!parent) return;

    // Detach the template (kept as the source markup, never reinserted) and
    // replace it with a placeholder comment plus a `display: contents` container
    // that anchors rendered items at the template's original position. A plain
    // container (rather than reusing `parent` directly as patchList's container)
    // avoids disturbing unrelated sibling content that may sit before/after the
    // l-for element in `parent`.
    const placeholder = document.createComment(`l-for: ${raw}`);
    parent.insertBefore(placeholder, template);
    parent.removeChild(template);

    const container = document.createElement('div');
    container.style.display = 'contents';
    placeholder.parentNode?.insertBefore(container, placeholder.nextSibling);

    interface Entry { item: any; index: number; key: string; }

    const itemScopes = new WeakMap<Element, ReactiveScope>();
    const boundWrappers = new WeakSet<Element>();
    // Key -> the wrapper element rendered for it as of the END of the previous
    // render. Read by patchList's `renderItem` below (see the comment there for
    // why) and rebuilt after every render.
    let wrapperByKey = new Map<string, HTMLElement>();

    const dispose = effect(() => {
        const parentState = parentScope ? parentScope.state : {};
        let arr: unknown;
        try {
            arr = evaluateExpression(arrayExpr, parentState);
        } catch {
            arr = undefined;
        }
        const items: any[] = Array.isArray(arr) ? arr : [];

        const entries: Entry[] = items.map((item, index) => {
            let key: string;
            if (keyExpr) {
                const itemContext = { ...parentState, [loopVar]: item, $index: index };
                key = String(evaluateExpression(keyExpr, itemContext));
            } else {
                // Index-keying does NOT preserve node identity across insertions or
                // removals in the middle of the array - only l-key does. Use l-key
                // whenever items can be reordered/inserted/removed mid-array.
                key = String(index);
            }
            return { item, index, key };
        });

        patchList(
            container,
            entries,
            (e) => e.key,
            (e) => {
                // For a key we've already bound, patchList's own string-diff
                // against the pristine template markup would spuriously "detect a
                // change" the moment any directive mutates the rendered DOM (e.g.
                // an l-bind effect writing textContent) - patchList would then
                // wipe out and rebuild that subtree, orphaning the very effects we
                // just bound. We manage content updates for bound items ourselves
                // (via the item's own reactive scope, below), so hand back the
                // wrapper's OWN current innerHTML here - comparing a live node's
                // innerHTML against itself is always equal, so patchList's
                // "unchanged -> skip" fast path is always taken for it. Only a
                // genuinely new key falls through to the real template markup.
                const existingWrapper = wrapperByKey.get(e.key);
                if (existingWrapper && boundWrappers.has(existingWrapper)) {
                    return existingWrapper.innerHTML;
                }
                return templateMarkup;
            }
        );

        const wrappers = Array.from(container.children);
        const nextWrapperByKey = new Map<string, HTMLElement>();
        for (let i = 0; i < entries.length; i++) {
            const wrapperEl = wrappers[i] as HTMLElement | undefined;
            if (!wrapperEl) continue;
            const entry = entries[i];
            nextWrapperByKey.set(entry.key, wrapperEl);

            let itemScope = itemScopes.get(wrapperEl);
            if (!itemScope) {
                const itemState = { ...parentState, [loopVar]: entry.item, $index: entry.index };
                itemScope = createReactiveScope(wrapperEl, itemState);
                itemScopes.set(wrapperEl, itemScope);
            } else {
                // Same DOM node reused for this key: push the (possibly new) item
                // value/index through the existing per-item signals so any
                // directive effects already bound below re-run automatically.
                itemScope.state[loopVar] = entry.item;
                itemScope.state.$index = entry.index;
            }

            if (!boundWrappers.has(wrapperEl)) {
                const templateChild = wrapperEl.firstElementChild as HTMLElement | null;
                if (templateChild) bindItemDirectives(templateChild);
                boundWrappers.add(wrapperEl);
            }
        }
        wrapperByKey = nextWrapperByKey;
    });

    // See the identical caveat in conditional.ts: `template` is permanently
    // detached so a querySelectorAll-based teardown scan will never find it
    // directly. `container` stays attached for as long as this l-for's spot in
    // the page exists, so register there too (idempotent dispose) for discovery.
    registerDirectiveCleanup(template, dispose);
    registerDirectiveCleanup(container, dispose);
}
