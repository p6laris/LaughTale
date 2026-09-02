/**
 * LaughTale: Escaping-by-Construction Markup Primitive (LT-902)
 *
 * Components build markup with tagged templates instead of raw string concatenation, so every
 * interpolated value is HTML-escaped by default. Bypasses are explicit, greppable and countable.
 *
 *   setHtml(container, html`<a href="${url(p.link)}">${p.label}</a>`);
 *
 * Fragments compose without double-escaping because `html` returns a `Raw`, and `Raw` values pass
 * through untouched:
 *
 *   setHtml(list, html`<ul>${items.map(i => html`<li>${i.label}</li>`)}</ul>`);
 *
 * @see EXECUTION-RUNBOOK.md T101 · specs/040-safe-html-primitive
 */

import { sanitizeUrl } from '../directives/security';

const ESCAPE_MAP: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
};

const ESCAPE_RE = /[&<>"']/g;

/**
 * Markup that has already been made safe and must not be escaped again.
 * Produced by `html`, `unsafe`, `url`, `cx` and `attr`.
 */
export class Raw {
    constructor(readonly value: string) {}
    toString(): string {
        return this.value;
    }
}

/**
 * Escapes the five HTML-significant characters. Nullish input yields the empty string.
 */
export function escapeHtml(value: unknown): string {
    if (value === null || value === undefined) return '';
    return String(value).replace(ESCAPE_RE, (c) => ESCAPE_MAP[c]);
}

/**
 * Renders one interpolated value: `Raw` passes through, arrays render element-wise with no
 * separator, nullish and `false` render empty, everything else is escaped.
 */
function render(value: unknown): string {
    if (value instanceof Raw) return value.value;
    if (Array.isArray(value)) {
        let out = '';
        for (const item of value) out += render(item);
        return out;
    }
    if (value === null || value === undefined || value === false) return '';
    return escapeHtml(value);
}

/**
 * Tagged template that escapes every interpolation. Returns `Raw` so fragments nest safely.
 */
export function html(strings: TemplateStringsArray, ...values: unknown[]): Raw {
    let out = strings[0];
    for (let i = 0; i < values.length; i++) {
        out += render(values[i]) + strings[i + 1];
    }
    return new Raw(out);
}

/**
 * The only sanctioned way to write markup into the DOM from a component.
 * A plain string is treated as text and escaped; pass `html\`\`` for markup.
 */
export function setHtml(target: Element, content: Raw | string): void {
    target.innerHTML = content instanceof Raw ? content.value : escapeHtml(content);
}

/**
 * Explicit escape hatch for markup that is already trusted (pre-rendered icons, sanitized rich
 * text). Every call site must carry a comment naming why the value is trusted.
 */
export function unsafe(markup: string): Raw {
    return new Raw(markup);
}

/**
 * Escapes a URL for an `href`/`src`/`action` position after protocol sanitization.
 * Dangerous schemes collapse to `about:blank` via the existing `sanitizeUrl`.
 */
export function url(value: unknown): Raw {
    return new Raw(escapeHtml(sanitizeUrl(value)));
}

/**
 * Joins truthy class names into an escaped class list.
 */
export function cx(...parts: unknown[]): Raw {
    return new Raw(escapeHtml(parts.filter(Boolean).join(' ')));
}

/**
 * Emits `name="escaped-value"` when the value is present, otherwise nothing.
 * Replaces the `${cond ? `style="${v}"` : ''}` pattern, which is an attribute-injection vector.
 */
export function attr(name: string, value: unknown): Raw {
    if (value === null || value === undefined || value === false || value === '') return new Raw('');
    if (value === true) return new Raw(escapeHtml(name));
    return new Raw(`${escapeHtml(name)}="${escapeHtml(value)}"`);
}
