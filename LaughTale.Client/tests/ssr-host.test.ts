import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { PassThrough } from 'node:stream';
import { startSsrHost, type SsrComponent } from '../src/ssr/index.ts';

async function waitFor<T>(check: () => T | undefined | false, timeoutMs = 2000): Promise<T> {
    const start = Date.now();
    for (;;) {
        const value = check();
        if (value) return value;
        if (Date.now() - start > timeoutMs) throw new Error(`waitFor: condition not met within ${timeoutMs}ms`);
        await new Promise(r => setTimeout(r, 5));
    }
}

function startHarness(components: Record<string, SsrComponent>) {
    const input = new PassThrough();
    const output = new PassThrough();
    const error = new PassThrough();
    const messages: any[] = [];
    const rawLines: string[] = [];
    let buffer = '';
    let errorText = '';
    const exitCodes: number[] = [];

    output.setEncoding('utf8');
    output.on('data', (chunk: string) => {
        buffer += chunk;
        let nl: number;
        while ((nl = buffer.indexOf('\n')) >= 0) {
            const line = buffer.slice(0, nl);
            buffer = buffer.slice(nl + 1);
            rawLines.push(line);
            messages.push(JSON.parse(line));
        }
    });
    error.setEncoding('utf8');
    error.on('data', (chunk: string) => { errorText += chunk; });

    const host = startSsrHost(components, { input, output, error, exit: (code) => exitCodes.push(code) });

    return {
        host,
        input,
        messages,
        rawLines,
        exitCodes,
        errorText: () => errorText,
        send: (message: unknown) => input.write((typeof message === 'string' ? message : JSON.stringify(message)) + '\n'),
        result: (id: number) => waitFor(() => messages.find(m => m.type === 'result' && m.id === id))
    };
}

const echo: SsrComponent = { framework: 'react', render: (props: any) => `<p>${props?.name ?? 'anon'}</p>` };

describe('SSR sidecar host', () => {
    it('writes a ready line listing every component and its framework', async () => {
        const h = startHarness({ echo, other: { framework: 'vue', render: () => '' } });
        try {
            const ready = await waitFor(() => h.messages[0]);
            assert.deepEqual(ready, { type: 'ready', components: { echo: 'react', other: 'vue' } });
        } finally {
            h.host.close();
        }
    });

    it('renders a request and echoes its id', async () => {
        const h = startHarness({ echo });
        try {
            h.send({ type: 'render', id: 7, island: 'echo', props: { name: 'Luffy' } });
            assert.deepEqual(await h.result(7), { type: 'result', id: 7, ok: true, html: '<p>Luffy</p>' });

            h.send({ type: 'render', id: 8, island: 'echo', props: null });
            assert.deepEqual(await h.result(8), { type: 'result', id: 8, ok: true, html: '<p>anon</p>' });
        } finally {
            h.host.close();
        }
    });

    it('answers an unknown island with ok:false', async () => {
        const h = startHarness({ echo });
        try {
            h.send({ type: 'render', id: 1, island: 'nope', props: null });
            const r = await h.result(1);
            assert.equal(r.ok, false);
            assert.match(r.error, /Unknown island "nope"/);

            h.send({ type: 'render', id: 2, island: 'constructor', props: null });
            assert.equal((await h.result(2)).ok, false, 'prototype keys must not resolve as components');
        } finally {
            h.host.close();
        }
    });

    it('reports sync and async render errors as ok:false and keeps serving', async () => {
        const h = startHarness({
            echo,
            syncThrow: { framework: 'react', render: () => { throw new Error('sync boom'); } },
            asyncThrow: { framework: 'react', render: async () => { throw new Error('async boom'); } }
        });
        try {
            h.send({ type: 'render', id: 1, island: 'syncThrow', props: null });
            assert.deepEqual(await h.result(1), { type: 'result', id: 1, ok: false, error: 'sync boom' });

            h.send({ type: 'render', id: 2, island: 'asyncThrow', props: null });
            assert.deepEqual(await h.result(2), { type: 'result', id: 2, ok: false, error: 'async boom' });

            h.send({ type: 'render', id: 3, island: 'echo', props: { name: 'Zoro' } });
            assert.deepEqual(await h.result(3), { type: 'result', id: 3, ok: true, html: '<p>Zoro</p>' });
            assert.match(h.errorText(), /sync boom/);
        } finally {
            h.host.close();
        }
    });

    it('handles concurrent requests that finish out of order', async () => {
        let releaseSlow!: () => void;
        const slowGate = new Promise<void>(r => { releaseSlow = r; });
        const h = startHarness({
            slow: { framework: 'react', render: async (props: any) => { await slowGate; return `slow:${props.n}`; } },
            fast: { framework: 'react', render: (props: any) => `fast:${props.n}` }
        });
        try {
            h.send({ type: 'render', id: 10, island: 'slow', props: { n: 1 } });
            h.send({ type: 'render', id: 11, island: 'fast', props: { n: 2 } });
            assert.equal((await h.result(11)).html, 'fast:2');
            assert.equal(h.messages.some(m => m.id === 10), false, 'slow result must not be written yet');

            releaseSlow();
            assert.equal((await h.result(10)).html, 'slow:1');
            const order = h.messages.filter(m => m.type === 'result').map(m => m.id);
            assert.deepEqual(order, [11, 10]);
        } finally {
            h.host.close();
        }
    });

    it('ignores malformed and unrecognized input lines', async () => {
        const h = startHarness({ echo });
        try {
            h.send('this is not json');
            h.send('{"type":"render","id":"not-an-int","island":"echo"}');
            h.send({ type: 'something-else' });
            h.send('');
            h.send({ type: 'render', id: 5, island: 'echo', props: { name: 'Nami' } });
            assert.equal((await h.result(5)).html, '<p>Nami</p>');
            assert.equal(h.messages.length, 2, 'only the ready line and one result');
            assert.match(h.errorText(), /malformed/);
        } finally {
            h.host.close();
        }
    });

    it('routes console output from component code to the error stream, never the protocol stream', async () => {
        const originalLog = console.log;
        const h = startHarness({
            chatty: {
                framework: 'react',
                render: () => {
                    console.log('log from component');
                    console.info('info from component');
                    console.warn('warn from component');
                    return '<b>ok</b>';
                }
            }
        });
        try {
            h.send({ type: 'render', id: 1, island: 'chatty', props: null });
            assert.equal((await h.result(1)).html, '<b>ok</b>');
            assert.match(h.errorText(), /log from component/);
            assert.match(h.errorText(), /info from component/);
            assert.match(h.errorText(), /warn from component/);
            assert.ok(h.rawLines.every(l => !l.includes('from component')), 'stdout must contain protocol lines only');
        } finally {
            h.host.close();
        }
        assert.ok(console.log === originalLog, 'close() restores the original console');
    });

    it('finishes in-flight renders, then exits with code 0 when input ends', async () => {
        let release!: () => void;
        const gate = new Promise<void>(r => { release = r; });
        const originalLog = console.log;
        const h = startHarness({ slow: { framework: 'react', render: async () => { await gate; return 'done'; } } });
        h.send({ type: 'render', id: 1, island: 'slow', props: null });
        await new Promise(r => setTimeout(r, 10));
        h.input.end();
        await new Promise(r => setTimeout(r, 20));
        assert.deepEqual(h.exitCodes, [], 'must not exit while a render is still in flight');

        release();
        await waitFor(() => h.exitCodes.length > 0);
        assert.deepEqual(h.exitCodes, [0]);
        assert.equal(h.messages.find(m => m.id === 1)?.html, 'done', 'the in-flight result is written before exit');
        assert.ok(console.log === originalLog, 'the console is restored on exit');
    });
});
