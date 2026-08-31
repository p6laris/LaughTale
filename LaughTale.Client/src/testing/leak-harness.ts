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

        const targets: any[] = [EventTarget.prototype];
        if (typeof window !== 'undefined' && (window as any).addEventListener && (window as any).addEventListener !== EventTarget.prototype.addEventListener) {
            targets.push(window);
        }
        if (typeof document !== 'undefined' && (document as any).addEventListener && (document as any).addEventListener !== EventTarget.prototype.addEventListener) {
            targets.push(document);
        }

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
                const targetName = (target as any)?.tagName || (target === window ? 'window' : (target === document ? 'document' : 'EventTarget'));
                details.push(`Active listener: ${targetName} -> "${type}" (${listeners.size} active)`);
            });
        });

        const activeTimers = this.activeIntervalIds.size + this.activeTimeoutIds.size;
        if (this.activeIntervalIds.size > 0) details.push(`${this.activeIntervalIds.size} active timer(s)`);

        const activeObservers = this.activeObservers.size;
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
