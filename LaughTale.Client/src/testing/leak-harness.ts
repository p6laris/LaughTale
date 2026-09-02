/**
 * LaughTale: Lifecycle & Memory Leak Detection Harness
 * Instruments DOM event listeners, observers, and window timers
 * to verify 100% complete resource teardown across navigation & hydration cycles.
 */

export interface LeakReport {
    activeEventListeners: number;
    activeTimers: number;
    activeObservers: number;
    totalLeaks: number;
    details: string[];
}

export class MemoryLeakHarness {
    private patchedTargets: Array<{ target: any; origAdd: any; origRemove: any }> = [];
    private patchedObservers: Array<{ cls: any; origObserve: any; origDisconnect: any }> = [];
    private origSetTimeout: any = null;
    private origClearTimeout: any = null;
    private origSetInterval: any = null;
    private origClearInterval: any = null;

    private trackedListeners = new Map<EventTarget, Map<string, Set<EventListenerOrEventListenerObject>>>();
    private activeIntervalIds = new Set<any>();
    private activeTimeoutIds = new Set<any>();
    private activeObservers = new Set<any>();

    private isTracking = false;

    /**
     * Begins instrumenting DOM resource allocators.
     */
    start(): void {
        if (this.isTracking || typeof window === 'undefined') return;
        this.isTracking = true;
        this.reset();

        const self = this;

        // 1. Derive prototype chain targets from live instances per D12
        const targets: any[] = [];
        if (typeof document !== 'undefined') {
            const probe = document.createElement('div');
            let proto = Object.getPrototypeOf(probe);
            while (proto) {
                if (Object.prototype.hasOwnProperty.call(proto, 'addEventListener')) {
                    if (!targets.includes(proto)) targets.push(proto);
                    break;
                }
                proto = Object.getPrototypeOf(proto);
            }
        }

        if (typeof window !== 'undefined') {
            let winProto = Object.getPrototypeOf(window);
            while (winProto) {
                if (Object.prototype.hasOwnProperty.call(winProto, 'addEventListener')) {
                    if (!targets.includes(winProto)) targets.push(winProto);
                    break;
                }
                winProto = Object.getPrototypeOf(winProto);
            }
            if (Object.prototype.hasOwnProperty.call(window, 'addEventListener') && !targets.includes(window)) {
                targets.push(window);
            }
        }

        if (typeof document !== 'undefined') {
            let docProto = Object.getPrototypeOf(document);
            while (docProto) {
                if (Object.prototype.hasOwnProperty.call(docProto, 'addEventListener')) {
                    if (!targets.includes(docProto)) targets.push(docProto);
                    break;
                }
                docProto = Object.getPrototypeOf(docProto);
            }
            if (Object.prototype.hasOwnProperty.call(document, 'addEventListener') && !targets.includes(document)) {
                targets.push(document);
            }
        }

        if (targets.length === 0 && typeof EventTarget !== 'undefined') {
            targets.push(EventTarget.prototype);
        }

        // Instrument addEventListener / removeEventListener
        for (const target of targets) {
            const origAdd = target.addEventListener;
            const origRemove = target.removeEventListener;
            if (!origAdd || !origRemove) continue;

            this.patchedTargets.push({ target, origAdd, origRemove });

            target.addEventListener = function (
                this: any,
                type: string,
                listener: EventListenerOrEventListenerObject,
                options?: boolean | AddEventListenerOptions
            ) {
                if (type === 'abort' || (typeof AbortSignal !== 'undefined' && this instanceof AbortSignal)) {
                    return origAdd.call(this, type, listener, options);
                }

                if (listener) {
                    let targetMap = self.trackedListeners.get(this);
                    if (!targetMap) {
                        targetMap = new Map();
                        self.trackedListeners.set(this, targetMap);
                    }
                    let typeSet = targetMap.get(type);
                    if (!typeSet) {
                        typeSet = new Set();
                        targetMap.set(type, typeSet);
                    }
                    typeSet.add(listener);

                    if (typeof options === 'object' && options?.signal) {
                        if (options.signal.aborted) {
                            typeSet.delete(listener);
                        } else {
                            options.signal.addEventListener('abort', () => {
                                const currentTargetMap = self.trackedListeners.get(this);
                                if (currentTargetMap) {
                                    const currentTypeSet = currentTargetMap.get(type);
                                    if (currentTypeSet) {
                                        currentTypeSet.delete(listener);
                                        if (currentTypeSet.size === 0) currentTargetMap.delete(type);
                                    }
                                    if (currentTargetMap.size === 0) self.trackedListeners.delete(this);
                                }
                            }, { once: true });
                        }
                    }
                }
                return origAdd.call(this, type, listener, options);
            };

            target.removeEventListener = function (
                this: any,
                type: string,
                listener: EventListenerOrEventListenerObject,
                options?: boolean | EventListenerOptions
            ) {
                if (listener) {
                    const targetMap = self.trackedListeners.get(this);
                    if (targetMap) {
                        const typeSet = targetMap.get(type);
                        if (typeSet) {
                            typeSet.delete(listener);
                            if (typeSet.size === 0) targetMap.delete(type);
                        }
                        if (targetMap.size === 0) self.trackedListeners.delete(this);
                    }
                }
                return origRemove.call(this, type, listener, options);
            };
        }

        // 2. Instrument Observers per D12/T012
        const observerClasses = [
            typeof MutationObserver !== 'undefined' ? MutationObserver : null,
            typeof ResizeObserver !== 'undefined' ? ResizeObserver : null,
            typeof IntersectionObserver !== 'undefined' ? IntersectionObserver : null,
        ].filter(Boolean) as any[];

        for (const cls of observerClasses) {
            if (cls.prototype && cls.prototype.observe && cls.prototype.disconnect) {
                const origObserve = cls.prototype.observe;
                const origDisconnect = cls.prototype.disconnect;
                this.patchedObservers.push({ cls, origObserve, origDisconnect });

                cls.prototype.observe = function (this: any, ...args: any[]) {
                    self.activeObservers.add(this);
                    return origObserve.apply(this, args);
                };

                cls.prototype.disconnect = function (this: any, ...args: any[]) {
                    self.activeObservers.delete(this);
                    return origDisconnect.apply(this, args);
                };
            }
        }

        // 3. Instrument Timers per T012
        if (typeof window !== 'undefined') {
            this.origSetTimeout = window.setTimeout;
            this.origClearTimeout = window.clearTimeout;
            this.origSetInterval = window.setInterval;
            this.origClearInterval = window.clearInterval;

            window.setTimeout = function (handler: TimerHandler, timeout?: number, ...args: any[]): any {
                let id: any;
                const wrapped = typeof handler === 'function' ? (...fnArgs: any[]) => {
                    self.activeTimeoutIds.delete(id);
                    return handler(...fnArgs);
                } : handler;
                id = self.origSetTimeout.call(window, wrapped, timeout, ...args);
                self.activeTimeoutIds.add(id);
                return id;
            } as any;

            window.clearTimeout = function (id?: any): void {
                if (id !== undefined) self.activeTimeoutIds.delete(id);
                self.origClearTimeout.call(window, id);
            } as any;

            window.setInterval = function (handler: TimerHandler, timeout?: number, ...args: any[]): any {
                const id = self.origSetInterval.call(window, handler, timeout, ...args);
                self.activeIntervalIds.add(id);
                return id;
            } as any;

            window.clearInterval = function (id?: any): void {
                if (id !== undefined) self.activeIntervalIds.delete(id);
                self.origClearInterval.call(window, id);
            } as any;
        }
    }

    /**
     * Restores original global functions.
     */
    stop(): void {
        if (!this.isTracking) return;
        this.isTracking = false;

        for (const { target, origAdd, origRemove } of this.patchedTargets) {
            try {
                target.addEventListener = origAdd;
                target.removeEventListener = origRemove;
            } catch {}
        }
        this.patchedTargets = [];

        for (const { cls, origObserve, origDisconnect } of this.patchedObservers) {
            try {
                cls.prototype.observe = origObserve;
                cls.prototype.disconnect = origDisconnect;
            } catch {}
        }
        this.patchedObservers = [];

        if (typeof window !== 'undefined') {
            if (this.origSetTimeout) {
                window.setTimeout = this.origSetTimeout;
                this.origSetTimeout = null;
            }
            if (this.origClearTimeout) {
                window.clearTimeout = this.origClearTimeout;
                this.origClearTimeout = null;
            }
            if (this.origSetInterval) {
                window.setInterval = this.origSetInterval;
                this.origSetInterval = null;
            }
            if (this.origClearInterval) {
                window.clearInterval = this.origClearInterval;
                this.origClearInterval = null;
            }
        }
    }

    /**
     * Manually registers an active timer for tracking.
     */
    trackTimer(id: any): void {
        if (this.isTracking) this.activeIntervalIds.add(id);
    }

    /**
     * Manually unregisters a tracked timer.
     */
    untrackTimer(id: any): void {
        if (this.isTracking) this.activeIntervalIds.delete(id);
    }

    trackTimeout(id: any): void {
        if (this.isTracking) this.activeTimeoutIds.add(id);
    }

    untrackTimeout(id: any): void {
        if (this.isTracking) this.activeTimeoutIds.delete(id);
    }

    trackObserver(obs: any): void {
        if (this.isTracking) this.activeObservers.add(obs);
    }

    untrackObserver(obs: any): void {
        if (this.isTracking) this.activeObservers.delete(obs);
    }

    /**
     * Resets tracked allocations.
     */
    reset(): void {
        this.trackedListeners.clear();
        this.activeIntervalIds.clear();
        this.activeTimeoutIds.clear();
        this.activeObservers.clear();
    }

    /**
     * Computes the current leak report.
     */
    getReport(): LeakReport {
        let activeListeners = 0;
        const details: string[] = [];

        this.trackedListeners.forEach((typeMap, target) => {
            typeMap.forEach((listeners, type) => {
                activeListeners += listeners.size;
                const targetName = (target as any)?.tagName
                    ? `<${(target as any).tagName.toLowerCase()}>`
                    : (target === window ? 'window' : (target === document ? 'document' : 'EventTarget'));
                details.push(`Active listener: ${targetName} -> "${type}" (${listeners.size} active)`);
            });
        });

        const activeTimers = this.activeIntervalIds.size + this.activeTimeoutIds.size;
        if (this.activeIntervalIds.size > 0) details.push(`${this.activeIntervalIds.size} active interval(s)`);
        if (this.activeTimeoutIds.size > 0) details.push(`${this.activeTimeoutIds.size} active timeout(s)`);

        const activeObservers = this.activeObservers.size;
        if (activeObservers > 0) details.push(`${activeObservers} active observer(s)`);

        const totalLeaks = activeListeners + activeTimers + activeObservers;

        return {
            activeEventListeners: activeListeners,
            activeTimers,
            activeObservers,
            totalLeaks,
            details
        };
    }

    /**
     * Asserts that all instrumented resources have been cleanly disposed.
     */
    assertZeroLeaks(contextMessage = 'Resource leak detected'): void {
        const report = this.getReport();
        if (report.totalLeaks > 0) {
            throw new Error(`${contextMessage}: Total leaks: ${report.totalLeaks}.\nDetails:\n  ${report.details.join('\n  ')}`);
        }
    }
}

export const leakHarness = new MemoryLeakHarness();
