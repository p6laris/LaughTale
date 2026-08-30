/**
 * Network Resilience & Module Retry Loader for LaughTale
 * Handles transient network dropouts and flaky connections with
 * exponential backoff, randomized jitter, and URL cache-busting.
 */

export interface RetryOptions {
    /** Total number of attempts to make (default: 3). */
    retries?: number;
    /** Initial base delay in milliseconds (default: 1000). */
    baseDelayMs?: number;
    /** Upper ceiling cap for backoff in milliseconds (default: 10000). */
    maxDelayMs?: number;
    /** Whether to apply randomized jitter (0.75x - 1.25x) (default: true). */
    jitter?: boolean;
}

/**
 * Resiliently loads an async module thunk or module URL with exponential backoff and jitter.
 *
 * @param loader Async factory () => Promise<T> or URL string.
 * @param options RetryOptions object or legacy retries number.
 * @param legacyBaseDelayMs Legacy base delay in ms.
 */
export async function importWithRetry<T = any>(
    loader: (() => Promise<T>) | string,
    options: RetryOptions | number = 3,
    legacyBaseDelayMs = 1000
): Promise<T> {
    const opts: Required<RetryOptions> = typeof options === 'number'
        ? { retries: options, baseDelayMs: legacyBaseDelayMs, maxDelayMs: 10000, jitter: true }
        : {
            retries: options?.retries ?? 3,
            baseDelayMs: options?.baseDelayMs ?? 1000,
            maxDelayMs: options?.maxDelayMs ?? 10000,
            jitter: options?.jitter ?? true
        };

    let lastError: any = null;

    if (typeof loader === 'function') {
        for (let attempt = 0; attempt < opts.retries; attempt++) {
            try {
                return await loader();
            } catch (err) {
                lastError = err;
                if (attempt === opts.retries - 1) {
                    throw err;
                }

                const rawDelay = Math.min(opts.maxDelayMs, opts.baseDelayMs * Math.pow(2, attempt));
                const jitterFactor = opts.jitter ? (0.75 + Math.random() * 0.5) : 1;
                const delay = Math.round(rawDelay * jitterFactor);

                console.warn(`[LaughTale] Island dynamic import failed. Retrying in ${delay}ms (Attempt ${attempt + 1}/${opts.retries})...`, err);
                await new Promise((resolve) => setTimeout(resolve, delay));
            }
        }
    } else {
        let url = loader;
        for (let attempt = 0; attempt < opts.retries; attempt++) {
            try {
                return (await import(/* @vite-ignore */ url)) as T;
            } catch (err) {
                lastError = err;
                if (attempt === opts.retries - 1) {
                    throw err;
                }

                const rawDelay = Math.min(opts.maxDelayMs, opts.baseDelayMs * Math.pow(2, attempt));
                const jitterFactor = opts.jitter ? (0.75 + Math.random() * 0.5) : 1;
                const delay = Math.round(rawDelay * jitterFactor);

                console.warn(`[LaughTale] Failed to fetch island script at ${url}. Retrying with cache-buster in ${delay}ms...`, err);
                await new Promise((resolve) => setTimeout(resolve, delay));

                // Append/replace cache-buster query parameter to bypass browser module cache
                const separator = url.includes('?') ? '&' : '?';
                url = `${url.replace(/([?&])island-retry=[^&]*/, '')}${separator}island-retry=${Date.now()}`;
            }
        }
    }

    throw lastError || new Error(`[LaughTale] Failed to load island after ${opts.retries} attempts.`);
}
