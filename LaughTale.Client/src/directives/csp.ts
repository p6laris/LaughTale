/**
 * LaughTale: Content Security Policy Directive & Nonce Engine (Hardened Edition)
 * Automatically discovers CSP nonces from meta tags, global context, or script elements,
 * and stamps nonces onto dynamically injected styles and scripts.
 */

let cachedNonce: string | null = null;

/**
 * Discovers the active Content Security Policy (CSP) nonce from the current document.
 * Tries multiple detection strategies:
 * 1. <meta name="csp-nonce" content="...">
 * 2. window.__LAUGHTALE_NONCE__
 * 3. <script nonce="...">
 * 4. document.currentScript[nonce]
 */
export function getCspNonce(): string | null {
    if (cachedNonce) return cachedNonce;
    if (typeof document === 'undefined') return null;

    // 1. Meta tag lookup
    const meta = document.querySelector<HTMLMetaElement>('meta[name="csp-nonce"]');
    if (meta?.content) {
        cachedNonce = meta.content.trim();
        return cachedNonce;
    }

    // 2. Global window object lookup
    if (typeof window !== 'undefined' && (window as any).__LAUGHTALE_NONCE__) {
        cachedNonce = String((window as any).__LAUGHTALE_NONCE__).trim();
        return cachedNonce;
    }

    // 3. Any existing script tag with a nonce
    const scriptWithNonce = document.querySelector<HTMLScriptElement>('script[nonce]');
    if (scriptWithNonce) {
        const nonce = scriptWithNonce.nonce || scriptWithNonce.getAttribute('nonce');
        if (nonce) {
            cachedNonce = nonce.trim();
            return cachedNonce;
        }
    }

    // 4. Current script if available
    if (document.currentScript) {
        const currentNonce = (document.currentScript as HTMLScriptElement).nonce || document.currentScript.getAttribute('nonce');
        if (currentNonce) {
            cachedNonce = currentNonce.trim();
            return cachedNonce;
        }
    }

    return null;
}

/**
 * Sets or overrides the cached CSP nonce (useful for tests or dynamic runtime bootstrap).
 */
export function setCspNonce(nonce: string | null): void {
    cachedNonce = nonce ? nonce.trim() : null;
}

/**
 * Stamps the active CSP nonce onto a style element.
 */
export function applyNonceToStyle(style: HTMLStyleElement): void {
    const nonce = getCspNonce();
    if (nonce) {
        style.setAttribute('nonce', nonce);
    }
}

/**
 * Stamps the active CSP nonce onto a script element.
 */
export function applyNonceToScript(script: HTMLScriptElement): void {
    const nonce = getCspNonce();
    if (nonce) {
        script.setAttribute('nonce', nonce);
    }
}
