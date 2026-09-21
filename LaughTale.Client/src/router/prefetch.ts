/**
 * LaughTale: Router Predictive Prefetching & Response Cache
 * Anticipates navigation via hover intent (150ms) and viewport visibility with data saver awareness.
 */
import { prefetchIslandChunksInHtml } from './chunk-prefetch';

export interface CachedResponse {
    html: string;
    timestamp: number;
    expiresAt: number;
}

export interface PrefetchOptions {
    ttlMs?: number;          // Default: 30,000ms (30s)
    intentDelayMs?: number;  // Default: 150ms
}

export class PrefetchManager {
    private cache = new Map<string, CachedResponse>();
    private pending = new Map<string, Promise<string | null>>();
    private ttlMs: number;
    private intentDelayMs: number;

    constructor(options: PrefetchOptions = {}) {
        this.ttlMs = options.ttlMs ?? 30000;
        this.intentDelayMs = options.intentDelayMs ?? 150;
    }

    /**
     * Checks if data saving preferences are active.
     */
    public isSaveDataEnabled(): boolean {
        if (typeof navigator !== 'undefined') {
            const nav = navigator as unknown as { connection?: { saveData?: boolean } };
            if (nav.connection?.saveData === true) return true;
        }

        if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
            if (window.matchMedia('(prefers-reduced-data: reduce)').matches) {
                return true;
            }
        }

        return false;
    }

    /**
     * Normalizes a URL path string.
     */
    public normalizeUrl(url: string): string {
        try {
            if (typeof window !== 'undefined' && window.location) {
                const parsed = new URL(url, window.location.href);
                if (parsed.origin !== window.location.origin) return '';
                return parsed.pathname + parsed.search;
            }
            return url;
        } catch {
            return url;
        }
    }

    /**
     * Checks if a URL is cached and unexpired.
     */
    public has(url: string): boolean {
        const key = this.normalizeUrl(url);
        if (!key) return false;
        const entry = this.cache.get(key);
        if (!entry) return false;
        if (Date.now() > entry.expiresAt) {
            this.cache.delete(key);
            return false;
        }
        return true;
    }

    /**
     * Retrieves cached HTML payload if available and unexpired.
     */
    public getCachedResponse(url: string): string | null {
        const key = this.normalizeUrl(url);
        if (!key) return null;
        const entry = this.cache.get(key);
        if (!entry) return null;

        if (Date.now() > entry.expiresAt) {
            this.cache.delete(key);
            return null;
        }

        return entry.html;
    }

    /**
     * Manually inserts HTML into the cache.
     */
    public setCachedResponse(url: string, html: string): void {
        const key = this.normalizeUrl(url);
        if (!key) return;
        const now = Date.now();
        this.cache.set(key, {
            html,
            timestamp: now,
            expiresAt: now + this.ttlMs
        });
    }

    /**
     * Invalidates a specific URL or the entire cache.
     */
    public invalidate(url?: string): void {
        if (url) {
            const key = this.normalizeUrl(url);
            if (key) this.cache.delete(key);
        } else {
            this.cache.clear();
        }
    }

    /**
     * Asynchronously prefetches a target URL if not already cached.
     */
    public async prefetch(url: string): Promise<string | null> {
        if (this.isSaveDataEnabled()) return null;

        const key = this.normalizeUrl(url);
        if (!key) return null;

        if (this.has(key)) {
            return this.getCachedResponse(key);
        }

        if (this.pending.has(key)) {
            return this.pending.get(key)!;
        }

        const fetchPromise = (async () => {
            try {
                if (typeof fetch === 'undefined') return null;

                const res = await fetch(key, {
                    headers: { 'X-LaughTale-Prefetch': 'true' }
                });

                if (!res.ok) return null;
                const html = await res.text();
                this.setCachedResponse(key, html);
                // ROADMAP.v5.md Part B "Speculative prefetch worker": the destination page's own
                // islands are now known - warm their chunks too, not just its HTML.
                prefetchIslandChunksInHtml(html);
                return html;
            } catch {
                return null;
            } finally {
                this.pending.delete(key);
            }
        })();

        this.pending.set(key, fetchPromise);
        return fetchPromise;
    }

    /**
     * Attaches intent-based hover/touch prefetch listeners to an anchor element.
     */
    public attachHoverListener(anchor: HTMLAnchorElement): () => void {
        let timer: ReturnType<typeof setTimeout> | null = null;

        const onEnter = () => {
            const href = anchor.getAttribute('href');
            if (!href || href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:')) {
                return;
            }

            timer = setTimeout(() => {
                this.prefetch(href);
            }, this.intentDelayMs);
        };

        const onLeave = () => {
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
        };

        anchor.addEventListener('mouseenter', onEnter);
        anchor.addEventListener('mouseleave', onLeave);
        anchor.addEventListener('touchstart', onEnter, { passive: true });
        anchor.addEventListener('touchend', onLeave, { passive: true });

        return () => {
            if (timer) clearTimeout(timer);
            anchor.removeEventListener('mouseenter', onEnter);
            anchor.removeEventListener('mouseleave', onLeave);
            anchor.removeEventListener('touchstart', onEnter);
            anchor.removeEventListener('touchend', onLeave);
        };
    }

    /**
     * Automatically observes in-viewport links for anticipatory prefetching.
     */
    public observeViewportLinks(root: Element | Document = typeof document !== 'undefined' ? document : ({} as Document)): () => void {
        if (typeof IntersectionObserver === 'undefined' || this.isSaveDataEnabled() || !root || !('querySelectorAll' in root)) {
            return () => {};
        }

        const observer = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    const target = entry.target as HTMLAnchorElement;
                    const href = target.getAttribute('href');
                    if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
                        this.prefetch(href);
                    }
                    observer.unobserve(target);
                }
            }
        });

        const links = root.querySelectorAll('a[href]:not([target="_blank"]):not([download])');
        links.forEach((link) => observer.observe(link));

        return () => {
            observer.disconnect();
        };
    }
}

export const prefetchManager = new PrefetchManager();
