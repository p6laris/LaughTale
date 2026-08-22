/**
 * SoftMax.LaughTale: Composable useDebounce & useThrottle
 * Headless execution throttle and debouncer for search filters, autocomplete inputs, and high-frequency events.
 */

export function useDebounce<T extends (...args: any[]) => any>(fn: T, delayMs: number = 250): {
    (...args: Parameters<T>): void;
    cancel: () => void;
    flush: (...args: Parameters<T>) => void;
} {
    let timer: any = null;

    const debounced = (...args: Parameters<T>) => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            fn(...args);
            timer = null;
        }, delayMs);
    };

    debounced.cancel = () => {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
    };

    debounced.flush = (...args: Parameters<T>) => {
        debounced.cancel();
        fn(...args);
    };

    return debounced;
}

export function useThrottle<T extends (...args: any[]) => any>(fn: T, intervalMs: number = 100): {
    (...args: Parameters<T>): void;
    cancel: () => void;
} {
    let lastTime = 0;
    let timer: any = null;

    const throttled = (...args: Parameters<T>) => {
        const now = Date.now();
        if (now - lastTime >= intervalMs) {
            lastTime = now;
            fn(...args);
        } else if (!timer) {
            timer = setTimeout(() => {
                lastTime = Date.now();
                fn(...args);
                timer = null;
            }, intervalMs - (now - lastTime));
        }
    };

    throttled.cancel = () => {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
    };

    return throttled;
}
