/**
 * SoftMax.LaughTale: Declarative Directives Security & Sandboxing
 * Prevents XSS, Prototype Pollution, and Arbitrary Code Execution across reactive directives.
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
    'formaction'
]);

const DANGEROUS_PROTOCOLS = /^\s*(javascript|data|vbscript):/i;

/**
 * Checks whether an object property access is safe from prototype pollution or global escape.
 */
export function isSafeProperty(prop: string | symbol): boolean {
    if (typeof prop !== 'string') return true;
    return !BLOCKED_PROPERTIES.has(prop);
}

/**
 * Sanitizes URLs to prevent javascript: or data: URL injection in href/src/action.
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

/**
 * Sanitizes HTML strings for safe rendering (stripping <script>, <iframe>, <object>, and inline on* handlers).
 */
export function sanitizeHtml(html: string): string {
    if (typeof html !== 'string') return '';

    if (typeof document !== 'undefined') {
        const div = document.createElement('div');
        div.innerHTML = html;

        // Remove dangerous elements
        const dangerous = div.querySelectorAll('script, iframe, object, embed, applet, link, meta, style');
        dangerous.forEach(el => el.remove());

        // Remove inline event handlers
        const allElements = div.querySelectorAll('*');
        allElements.forEach(el => {
            for (const attr of Array.from(el.attributes)) {
                if (attr.name.toLowerCase().startsWith('on')) {
                    el.removeAttribute(attr.name);
                } else if (['href', 'src', 'action'].includes(attr.name.toLowerCase())) {
                    if (DANGEROUS_PROTOCOLS.test(attr.value)) {
                        el.removeAttribute(attr.name);
                    }
                }
            }
        });

        return div.innerHTML;
    }

    // Regex fallback
    return html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
        .replace(/\son\w+\s*=\s*(['"]).*?\1/gi, '');
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
                return true; // Return true to prevent throwing TypeError in strict mode while blocking modification
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
