/**
 * LaughTale SSR sidecar host.
 *
 * The app's own server entry imports its island components and calls `startSsrHost(...)`; the app's
 * bundler then bundles that entry + its framework into ONE .mjs that the .NET side spawns as
 * `node <bundle>.mjs`. Bundling the host into the app (instead of shipping a standalone program that
 * loads components) guarantees the component and the framework's server renderer share a single
 * framework instance.
 *
 * Wire protocol: newline-delimited JSON over stdin (requests) / stdout (responses); stderr is logs.
 *   child  -> parent (once): {"type":"ready","components":{"<island>":"<framework>"}}
 *   parent -> child:         {"type":"render","id":<int>,"island":"<island>","props":<json|null>}
 *   child  -> parent:        {"type":"result","id":<int>,"ok":true,"html":"..."}
 *                            {"type":"result","id":<int>,"ok":false,"error":"..."}
 * Results may be written out of order; the id is always echoed. The host exits when stdin ends.
 */

import { createInterface } from 'node:readline';
import { format } from 'node:util';
import type { Readable, Writable } from 'node:stream';

export type SsrFramework = 'react' | 'preact' | 'vue' | 'svelte' | 'solid';

export interface SsrComponent {
    framework: SsrFramework;
    render(props: unknown): string | Promise<string>;
}

export interface SsrHostIo {
    input?: Readable;
    output?: Writable;
    error?: Writable;
    /**
     * Called with 0 once input has ended and every in-flight result has been flushed. `false`
     * disables exiting. Defaults to `process.exit` when `input` is not injected, otherwise `false`
     * (so a test harness passing its own streams can never kill its own process by accident).
     */
    exit?: ((code: number) => void) | false;
}

export interface SsrHost {
    /** Stops reading input and restores the console. Does not call the exit hook. */
    close(): void;
}

const CONSOLE_METHODS = ['log', 'info', 'debug', 'warn', 'error'] as const;

export function startSsrHost(components: Record<string, SsrComponent>, io: SsrHostIo = {}): SsrHost {
    const input = io.input ?? process.stdin;
    const output = io.output ?? process.stdout;
    const error = io.error ?? process.stderr;
    const exit = io.exit !== undefined ? io.exit : (io.input ? false : (code: number) => process.exit(code));

    const logError = (...args: unknown[]) => {
        error.write(format(...args) + '\n');
    };

    // stdout is the protocol channel: any stray console output from component code would corrupt it.
    const originalConsole = new Map<string, (...args: unknown[]) => void>();
    for (const method of CONSOLE_METHODS) {
        originalConsole.set(method, console[method]);
        console[method] = logError;
    }

    // A fire-and-forget promise rejecting inside component code would otherwise crash Node (its
    // default since v15) and take every later render down with it.
    const onUnhandledRejection = (reason: unknown) => logError('[LaughTale SSR] Unhandled rejection:', reason);
    const ownsProcess = exit !== false && !io.input;
    if (ownsProcess) {
        process.on('unhandledRejection', onUnhandledRejection);
    }

    const send = (message: object) => {
        output.write(JSON.stringify(message) + '\n');
    };

    const manifest: Record<string, SsrFramework> = {};
    for (const [island, component] of Object.entries(components)) {
        manifest[island] = component.framework;
    }

    const inFlight = new Set<Promise<void>>();

    const render = async (id: number, island: unknown, props: unknown): Promise<void> => {
        try {
            if (typeof island !== 'string') {
                throw new Error('Render request is missing a string "island".');
            }
            const component = Object.prototype.hasOwnProperty.call(components, island) ? components[island] : undefined;
            if (!component) {
                throw new Error(`Unknown island "${island}".`);
            }
            const html = await component.render(props);
            if (typeof html !== 'string') {
                throw new Error(`Island "${island}" render() returned ${typeof html}, expected a string.`);
            }
            send({ type: 'result', id, ok: true, html });
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            logError(`[LaughTale SSR] Render ${id} (${String(island)}) failed:`, err);
            send({ type: 'result', id, ok: false, error: message || 'Render failed.' });
        }
    };

    const handleLine = (line: string) => {
        if (line.trim() === '') return;
        let message: any;
        try {
            message = JSON.parse(line);
        } catch {
            logError('[LaughTale SSR] Ignoring malformed input line:', line.slice(0, 200));
            return;
        }
        if (!message || message.type !== 'render' || !Number.isInteger(message.id)) {
            logError('[LaughTale SSR] Ignoring unrecognized message:', line.slice(0, 200));
            return;
        }
        const task = render(message.id, message.island, message.props ?? null);
        inFlight.add(task);
        void task.finally(() => inFlight.delete(task));
    };

    const rl = createInterface({ input, crlfDelay: Infinity, terminal: false });
    rl.on('line', handleLine);

    let closed = false;
    let closedByCaller = false;
    const restore = () => {
        if (closed) return;
        closed = true;
        for (const method of CONSOLE_METHODS) {
            console[method] = originalConsole.get(method)!;
        }
        if (ownsProcess) {
            process.off('unhandledRejection', onUnhandledRejection);
        }
    };

    rl.on('close', () => {
        void Promise.allSettled([...inFlight]).then(() => {
            // An empty write's callback fires only once everything queued before it has flushed, so
            // exiting from it can't truncate results still buffered for a pipe.
            output.write('', () => {
                restore();
                if (exit && !closedByCaller) exit(0);
            });
        });
    });

    send({ type: 'ready', components: manifest });

    return {
        close() {
            closedByCaller = true;
            rl.off('line', handleLine);
            rl.close();
            restore();
        }
    };
}
