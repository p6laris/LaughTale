/**
 * LaughTale: Fine-Grained Reactivity Primitives
 *
 * A minimal, dependency-free signals implementation (same family as Preact
 * Signals / SolidJS's core). DOM-agnostic - this module has no knowledge of
 * elements, directives, or islands; it's the low-level primitive other
 * runtime code builds on (ROADMAP.v5.md Part I).
 */

interface Subscriber {
    execute(): void;
    deps: Set<DepSource>;
}

interface DepSource {
    subs: Set<Subscriber>;
}

export interface Signal<T> {
    (): T;
    set(value: T): void;
    update(fn: (prev: T) => T): void;
    peek(): T;
}

// Active-subscriber stack: supports nesting (an effect whose body reads a
// computed that is itself being (re)computed).
const activeStack: Subscriber[] = [];

let batchDepth = 0;
const pendingSubscribers = new Set<Subscriber>();

function currentSubscriber(): Subscriber | undefined {
    return activeStack[activeStack.length - 1];
}

function track(source: DepSource): void {
    const sub = currentSubscriber();
    if (!sub) return;
    source.subs.add(sub);
    sub.deps.add(source);
}

function clearDeps(sub: Subscriber): void {
    for (const source of sub.deps) {
        source.subs.delete(sub);
    }
    sub.deps.clear();
}

function scheduleRun(sub: Subscriber): void {
    if (batchDepth > 0) {
        pendingSubscribers.add(sub);
        return;
    }
    sub.execute();
}

function notify(source: DepSource): void {
    // Snapshot: execute() below re-tracks and may mutate source.subs.
    for (const sub of Array.from(source.subs)) {
        scheduleRun(sub);
    }
}

export function signal<T>(initial: T): Signal<T> {
    let value = initial;
    const source: DepSource = { subs: new Set() };

    const read = (() => {
        track(source);
        return value;
    }) as Signal<T>;

    read.peek = () => value;

    read.set = (next: T) => {
        if (Object.is(next, value)) return;
        value = next;
        notify(source);
    };

    read.update = (fn: (prev: T) => T) => {
        read.set(fn(value));
    };

    return read;
}

export function computed<T>(fn: () => T): () => T {
    let value: T;
    let dirty = true;
    let initialized = false;
    const source: DepSource = { subs: new Set() };

    const sub: Subscriber = {
        deps: new Set(),
        execute() {
            dirty = true;
            // Lazy: don't recompute now, just mark dirty and propagate to
            // whatever depends on this computed (they'll re-derive on read).
            notify(source);
        }
    };

    function recompute(): void {
        clearDeps(sub);
        activeStack.push(sub);
        try {
            value = fn();
        } finally {
            activeStack.pop();
        }
        dirty = false;
        initialized = true;
    }

    return function read(): T {
        if (dirty || !initialized) {
            recompute();
        }
        track(source);
        return value;
    };
}

export function effect(fn: () => void): () => void {
    let disposed = false;

    const sub: Subscriber = {
        deps: new Set(),
        execute() {
            if (disposed) return;
            clearDeps(sub);
            activeStack.push(sub);
            try {
                fn();
            } finally {
                activeStack.pop();
            }
        }
    };

    sub.execute();

    return function dispose(): void {
        if (disposed) return;
        disposed = true;
        clearDeps(sub);
        pendingSubscribers.delete(sub);
    };
}

function flushPending(): void {
    // Keep queuing (rather than running immediately) while draining: a
    // subscriber's execute() can itself notify further subscribers (e.g. a
    // computed marking itself dirty and propagating to an effect that reads
    // it) - those must still land in the dedup Set instead of running
    // straight away, or the effect could re-run more than once per batch.
    while (pendingSubscribers.size > 0) {
        const toRun = Array.from(pendingSubscribers);
        pendingSubscribers.clear();
        for (const sub of toRun) {
            sub.execute();
        }
    }
}

export function batch(fn: () => void): void {
    batchDepth++;
    try {
        fn();
    } finally {
        batchDepth--;
        if (batchDepth === 0) {
            batchDepth++;
            try {
                flushPending();
            } finally {
                batchDepth--;
            }
        }
    }
}
