/**
 * SoftMax.LaughTale: Declarative Directives Security & Sandboxing (Hardened Edition)
 * Provides inert HTML sanitization with strict allowlists, URL protocol guards, and attribute safety.
 */

const BLOCKED_PROPERTIES = new Set([
    '__proto__',
    'prototype',
    'constructor',
    'window',
    'document',
    'globalThis',
    'location',
    'localStorage',
    'sessionStorage',
    'indexedDB',
    'cookie',
    'eval',
    'Function',
    'XMLHttpRequest',
    'fetch'
]);

const DANGEROUS_ATTRIBUTES = new Set([
    'onerror',
    'onload',
    'onclick',
    'onmouseover',
    'onfocus',
    'onblur',
    'onchange',
    'onsubmit',
    'formaction',
    'onanimationstart',
    'onanimationend',
    'ontransitionend',
    'onmouseenter',
    'onmouseleave'
]);

const DANGEROUS_PROTOCOLS = /^\s*(javascript|vbscript|data(?!\s*:\s*image\/(png|jpeg|jpg|gif|webp))):/i;

const ALLOWED_TAGS = new Set([
    // Typography & Inline Formatting
    'a', 'abbr', 'b', 'bdi', 'bdo', 'blockquote', 'br', 'cite', 'code', 'data', 'dd', 'dfn',
    'div', 'dl', 'dt', 'em', 'figcaption', 'figure', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'hr', 'i', 'kbd', 'li', 'mark', 'ol', 'p', 'pre', 'q', 'rp', 'rt', 'ruby', 's', 'samp',
    'small', 'span', 'strong', 'sub', 'sup', 'time', 'u', 'ul', 'var', 'wbr',

    // Tables
    'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr', 'caption', 'col', 'colgroup',

    // Safe Media
    'img', 'picture', 'source',

    // Vector Graphics (Safe SVG primitives)
    'svg', 'path', 'g', 'circle', 'rect', 'line', 'polyline', 'polygon', 'text', 'tspan', 'use'
]);

const ALLOWED_ATTRS = new Set([
    // Global Safe Attributes
    'class', 'id', 'title', 'dir', 'lang', 'role', 'tabindex',
    'aria-label', 'aria-labelledby', 'aria-describedby', 'aria-hidden', 'aria-expanded',
    'aria-disabled', 'aria-checked', 'aria-current', 'aria-haspopup', 'aria-controls',

    // Link & Media Attributes
    'href', 'src', 'alt', 'width', 'height', 'target', 'rel', 'loading', 'decoding',
    'sizes', 'srcset', 'type',

    // Table Attributes
    'colspan', 'rowspan', 'headers', 'scope',

    // SVG Attributes
    'viewbox', 'fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin',
    'd', 'cx', 'cy', 'r', 'rx', 'ry', 'x', 'y', 'x1', 'y1', 'x2', 'y2', 'points', 'transform',
    'clip-path', 'fill-rule', 'stroke-dasharray', 'stroke-dashoffset', 'xmlns', 'href', 'xlink:href'
]);

const URL_ATTRS = new Set(['href', 'src', 'action', 'poster', 'xlink:href']);

/**
 * Checks whether an object property access is safe from prototype pollution or global escape.
 */
export function isSafeProperty(prop: string | symbol): boolean {
    if (typeof prop !== 'string') return true;
    return !BLOCKED_PROPERTIES.has(prop);
}

/**
 * Sanitizes URLs to prevent javascript: or dangerous data: URL injection in href/src/action.
 */
export function sanitizeUrl(url: unknown): string {
    if (typeof url !== 'string') return '';
    const trimmed = url.trim();
    if (DANGEROUS_PROTOCOLS.test(trimmed)) {
        console.warn(`[SoftMax.LaughTale Security] Blocked dangerous URL protocol: "${trimmed}"`);
        return 'about:blank';
    }
    return trimmed;
}

/**
 * Validates whether an attribute name is safe to dynamically bind.
 */
export function isSafeAttribute(attrName: string): boolean {
    const lower = attrName.toLowerCase();
    if (lower.startsWith('on') || DANGEROUS_ATTRIBUTES.has(lower)) {
        console.warn(`[SoftMax.LaughTale Security] Blocked dangerous dynamic attribute binding: "${attrName}"`);
        return false;
    }
    return true;
}

let trustedTypesPolicy: any = null;
if (typeof window !== 'undefined' && (window as any).trustedTypes?.createPolicy) {
    try {
        trustedTypesPolicy = (window as any).trustedTypes.createPolicy('laughtale-html', {
            createHTML: (s: string) => s
        });
    } catch {
        // Policy already registered or restricted
    }
}

function parseInertHtml(html: string): Document | null {
    if (typeof DOMParser !== 'undefined') {
        try {
            return new DOMParser().parseFromString(html, 'text/html');
        } catch {
            // fallback
        }
    }
    if (typeof document !== 'undefined' && document.implementation?.createHTMLDocument) {
        try {
            const doc = document.implementation.createHTMLDocument('');
            doc.body.innerHTML = html;
            return doc;
        } catch {
            // fallback
        }
    }
    return null;
}

function cleanNode(node: Node): Node | null {
    if (node.nodeType === 3) {
        // Node.TEXT_NODE
        return node;
    }
    if (node.nodeType === 8) {
        // Node.COMMENT_NODE - remove comments
        return null;
    }
    if (node.nodeType !== 1) {
        // Not Node.ELEMENT_NODE
        return null;
    }

    const el = node as HTMLElement;
    const tagName = el.tagName.toLowerCase();

    // 1. Tag Allowlist Filter
    if (!ALLOWED_TAGS.has(tagName)) {
        return null;
    }

    // 2. Attribute Allowlist & Event Handler Filter
    const attrs = Array.from(el.attributes);
    for (const attr of attrs) {
        const attrName = attr.name.toLowerCase();

        // Strip inline event handlers
        if (attrName.startsWith('on')) {
            el.removeAttribute(attr.name);
            continue;
        }

        // Allowlist check
        if (!ALLOWED_ATTRS.has(attrName) && !attrName.startsWith('data-') && !attrName.startsWith('aria-')) {
            el.removeAttribute(attr.name);
            continue;
        }

        // URL validation
        if (URL_ATTRS.has(attrName)) {
            const safeUrl = sanitizeUrl(attr.value);
            if (safeUrl === 'about:blank' && attr.value.trim().toLowerCase() !== 'about:blank') {
                el.removeAttribute(attr.name);
            } else {
                el.setAttribute(attr.name, safeUrl);
            }
        }
    }

    // 3. For target="_blank", ensure rel="noopener noreferrer"
    if (tagName === 'a' && el.getAttribute('target') === '_blank') {
        const rel = el.getAttribute('rel') || '';
        if (!rel.includes('noopener')) {
            el.setAttribute('rel', (rel + ' noopener noreferrer').trim());
        }
    }

    // 4. Recursively clean child elements
    const children = Array.from(el.childNodes);
    for (const child of children) {
        const cleaned = cleanNode(child);
        if (!cleaned) {
            el.removeChild(child);
        }
    }

    return el;
}

/**
 * Sanitizes HTML strings for safe rendering using inert DOM parsing and strict element allowlists.
 */
export function sanitizeHtml(html: string): string {
    if (typeof html !== 'string' || !html.trim()) return '';

    const doc = parseInertHtml(html);
    if (!doc || !doc.body) {
        return '';
    }

    const cleanedNodes = Array.from(doc.body.childNodes)
        .map(cleanNode)
        .filter((n): n is Node => n !== null);

    const container = doc.createElement('div');
    for (const n of cleanedNodes) {
        container.appendChild(n);
    }

    const result = container.innerHTML;
    if (trustedTypesPolicy) {
        return trustedTypesPolicy.createHTML(result);
    }
    return result;
}

/**
 * Creates a restricted sandbox proxy around the state object.
 */
export function createSandboxState(state: Record<string, any>): Record<string, any> {
    return new Proxy(state, {
        get(target, prop) {
            if (!isSafeProperty(prop)) {
                console.warn(`[SoftMax.LaughTale Security] Blocked restricted property access: "${String(prop)}"`);
                return undefined;
            }
            return target[prop as string];
        },
        set(target, prop, value) {
            if (!isSafeProperty(prop)) {
                console.warn(`[SoftMax.LaughTale Security] Blocked assignment to restricted property: "${String(prop)}"`);
                return true;
            }
            target[prop as string] = value;
            return true;
        },
        has(target, prop) {
            if (!isSafeProperty(prop)) {
                return false;
            }
            return prop in target;
        }
    });
}
