/**
 * Network Resilience & Module Retry Loader for SoftMax.LaughTale
 * Handles transient network dropouts and flaky mobile connections
 * with query-based cache busting and exponential backoff.
 */

export async function importWithRetry<T = any>(
    importFnOrUrl: string | (() => Promise<T>),
    retries = 3,
    baseDelayMs = 1000
): Promise<T> {
    if (typeof importFnOrUrl === 'function') {
        for (let attempt = 0; attempt < retries; attempt++) {
            try {
                return await importFnOrUrl();
            } catch (err) {
                if (attempt === retries - 1) throw err;
                const delay = baseDelayMs * Math.pow(2, attempt);
                console.warn(`[SoftMax.LaughTale] Island dynamic import failed. Retrying in ${delay}ms (Attempt ${attempt + 1}/${retries})...`, err);
                await new Promise((resolve) => setTimeout(resolve, delay));
            }
        }
    }

    let url = importFnOrUrl;
    for (let attempt = 0; attempt < retries; attempt++) {
        try {
            return (await import(/* @vite-ignore */ url)) as T;
        } catch (err) {
            if (attempt === retries - 1) throw err;
            const delay = baseDelayMs * Math.pow(2, attempt);
            console.warn(`[SoftMax.LaughTale] Failed to fetch island script at ${url}. Retrying with cache-buster in ${delay}ms...`, err);
            await new Promise((resolve) => setTimeout(resolve, delay));
            
            // Append cache buster query parameter to bypass browser module map lock
            const parsed = new URL(url, document.baseURI);
            parsed.searchParams.set('island-retry', Date.now().toString());
            url = parsed.toString();
        }
    }

    throw new Error(`[SoftMax.LaughTale] Permanent failure loading island module after ${retries} attempts.`);
}
