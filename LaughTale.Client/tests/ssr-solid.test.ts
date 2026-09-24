import './setup.ts';
import { describe, it, before, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { compileSolidClient, renderSolidOnServer } from './helpers/solid.ts';

const { createSolidIsland } = await import('../src/adapters/solid.ts');
const { defineIsland, clearRegistry } = await import('../src/runtime/registry.ts');
const { hydrateIsland } = await import('../src/runtime/hydrator.ts');

async function waitFor(check: () => boolean, timeoutMs = 2000): Promise<void> {
    const start = Date.now();
    while (!check()) {
        if (Date.now() - start > timeoutMs) throw new Error(`waitFor: condition not met within ${timeoutMs}ms`);
        await new Promise(r => setTimeout(r, 10));
    }
}

// One source, compiled twice by Solid's JSX compiler: once for the server, once for the browser.
const COUNTER = `import { createSignal } from 'solid-js';
export default function Counter(props) {
    const [count, setCount] = createSignal(props.start ?? 0);
    return <button type="button" onClick={() => setCount(c => c + 1)}>{props.label ?? 'Count'}: {count()}</button>;
}`;

let ClientCounter: any;
const serverHtml = new Map<string, string>();

function captureConsole() {
    const messages: string[] = [];
    const { warn, error } = console;
    console.warn = (...args: unknown[]) => { messages.push(args.map(String).join(' ')); };
    console.error = (...args: unknown[]) => { messages.push(args.map(String).join(' ')); };
    return { messages, restore: () => { console.warn = warn; console.error = error; } };
}

before(async () => {
    ClientCounter = await compileSolidClient('SsrSolidCounter', COUNTER);
    for (const [key, props] of [['start5', { start: 5 }], ['start1', { start: 1 }], ['clicks3', { start: 3, label: 'Clicks' }], ['null', null]] as const) {
        serverHtml.set(key, await renderSolidOnServer('SsrSolidCounter', COUNTER, props));
    }
});

describe('Solid SSR component', () => {
    it('renders to HTML with hydration keys and text markers', () => {
        const html = serverHtml.get('clicks3')!;
        assert.match(html, /^<button data-hk="[^"]+" type="button">/, 'hydrate() finds nodes by their data-hk key');
        assert.match(html, /Clicks<!--\/-->: <!--\$-->3<!--\/-->|Clicks: <!--\$-->3<!--\/-->/);
    });

    it('treats null props as {}', () => {
        assert.match(serverHtml.get('null')!, /Count.*0/);
    });
});

describe('Solid SSR hydration', () => {
    beforeEach(() => {
        clearRegistry();
        document.body.innerHTML = '';
    });

    function serverRenderedIsland(name: string, htmlKey: string, props: Record<string, unknown>, stamped: boolean) {
        const container = document.createElement('div');
        container.setAttribute('data-island', name);
        container.setAttribute('data-hydrate', 'load');
        container.setAttribute('data-props', JSON.stringify(props));
        if (stamped) container.setAttribute('data-lt-ssr', 'true');
        container.innerHTML = serverHtml.get(htmlKey)!;
        document.body.appendChild(container);
        return container;
    }

    // A plain render builds new nodes, so node identity proves the hydrate path - plus exactly one
    // button, in case a render appended beside the server markup instead of replacing it.
    it('hydrates data-lt-ssr markup: same DOM node, working state and events, no errors', async () => {
        defineIsland('ssr-solid-counter', async () => ({ default: createSolidIsland(ClientCounter) }));
        const container = serverRenderedIsland('ssr-solid-counter', 'start5', { start: 5 }, true);
        const serverButton = container.querySelector('button')!;
        const output = captureConsole();
        try {
            hydrateIsland(container);
            await waitFor(() => container.getAttribute('data-lt-ssr-hydrated') === 'true');
            assert.equal(container.querySelectorAll('button').length, 1);
            assert.ok(container.querySelector('button') === serverButton, 'the server-rendered <button> must be adopted');

            serverButton.click();
            await waitFor(() => serverButton.textContent === 'Count: 6');
        } finally {
            output.restore();
        }
        assert.deepEqual(output.messages, [], 'hydration must not warn or log errors');
    });

    // Solid assumes one hydration per page: the first delegated event marks hydration "done" and
    // later hydrate() calls silently re-render. Islands hydrate at different times, so a second
    // island hydrating after the first was clicked must still adopt its server DOM.
    it('an island hydrating after another Solid island was clicked still hydrates', async () => {
        defineIsland('ssr-solid-first', async () => ({ default: createSolidIsland(ClientCounter) }));
        defineIsland('ssr-solid-later', async () => ({ default: createSolidIsland(ClientCounter) }));
        const first = serverRenderedIsland('ssr-solid-first', 'start5', { start: 5 }, true);
        const later = serverRenderedIsland('ssr-solid-later', 'start5', { start: 5 }, true);

        hydrateIsland(first);
        await waitFor(() => first.getAttribute('data-lt-ssr-hydrated') === 'true');
        first.querySelector('button')!.click();
        await waitFor(() => first.querySelector('button')!.textContent === 'Count: 6');

        const laterButton = later.querySelector('button')!;
        hydrateIsland(later);
        await waitFor(() => later.getAttribute('data-lt-ssr-hydrated') === 'true');
        assert.ok(later.querySelector('button') === laterButton, 'the later island must adopt its server node, not re-render');
        assert.equal(later.querySelectorAll('button').length, 1);
        laterButton.click();
        await waitFor(() => laterButton.textContent === 'Count: 6');
    });

    it('takes the plain render path (new nodes, no duplicate) when the markup lacks the data-lt-ssr stamp', async () => {
        defineIsland('plain-solid-counter', async () => ({ default: createSolidIsland(ClientCounter) }));
        const container = serverRenderedIsland('plain-solid-counter', 'start5', { start: 5 }, false);
        const serverButton = container.querySelector('button')!;
        // The error boundary's fallback: inert, and read only if the mount throws - it must survive.
        container.insertAdjacentHTML('beforeend', '<template data-slot="fallback"><p>Failed to load</p></template>');

        hydrateIsland(container);
        await waitFor(() => !!container.querySelector('button') && container.querySelector('button') !== serverButton);

        assert.equal(container.querySelectorAll('button').length, 1, 'the server markup must be replaced, not kept beside the component');
        assert.ok(container.querySelector('template[data-slot="fallback"]'), 'the fallback template must be kept for the error boundary');
        const button = container.querySelector('button')!;
        assert.equal(button.textContent, 'Count: 5');
        assert.equal(container.hasAttribute('data-lt-ssr-hydrated'), false);
        button.click();
        await waitFor(() => button.textContent === 'Count: 6');
    });

    it('an explicit { hydrate: false } opts a stamped container out of hydration', async () => {
        const container = serverRenderedIsland('opt-out-solid', 'start1', { start: 1 }, true);
        const serverButton = container.querySelector('button')!;
        const mount = createSolidIsland(ClientCounter, { hydrate: false });

        const result: any = await mount(container, { start: 1 }, { hydrate: true } as any);
        try {
            assert.ok(container.querySelector('button') !== serverButton, 'opt-out must take the plain render path');
            assert.equal(container.querySelectorAll('button').length, 1);
            assert.equal(container.querySelector('button')?.textContent, 'Count: 1');
        } finally {
            result?.unmount();
        }
    });

    // Guards the same-node assertions above: markup whose hydration keys don't match what the
    // client expects is silently rebuilt by Solid, which only node identity detects.
    it('markup without matching hydration keys is rebuilt, which node identity detects', async () => {
        defineIsland('ssr-solid-unkeyed', async () => ({ default: createSolidIsland(ClientCounter) }));
        const container = serverRenderedIsland('ssr-solid-unkeyed', 'start5', { start: 5 }, true);
        container.querySelector('button')!.setAttribute('data-hk', 'not-a-real-key');
        const serverButton = container.querySelector('button')!;

        hydrateIsland(container);
        await waitFor(() => container.getAttribute('data-lt-ssr-hydrated') === 'true');

        assert.equal(serverButton.isConnected, false, 'Solid rebuilt the DOM instead of adopting the server node');
        assert.equal(container.querySelectorAll('button').length, 1);
    });
});
