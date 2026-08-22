/**
 * SoftMax.LaughTale: Content Security Policy Directive (l-csp)
 */
export function getCspNonce(): string | null {
    if (typeof document === 'undefined') return null;
    const meta = document.querySelector<HTMLMetaElement>('meta[name="csp-nonce"]');
    return meta ? meta.content : null;
}

export function applyNonceToStyle(style: HTMLStyleElement): void {
    const nonce = getCspNonce();
    if (nonce) {
        style.setAttribute('nonce', nonce);
    }
}

export function applyNonceToScript(script: HTMLScriptElement): void {
    const nonce = getCspNonce();
    if (nonce) {
        script.setAttribute('nonce', nonce);
    }
}
