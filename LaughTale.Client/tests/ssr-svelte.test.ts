import './setup.ts';
import { describe, it, before, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { compileSvelte } from './helpers/svelte.ts';

const { svelteSsrComponent } = await import('../src/ssr/svelte.ts');
const { createSvelteIsland } = await import('../src/adapters/svelte.ts');
const { defineIsland, clearRegistry } = await import('../src/runtime/registry.ts');
const { hydrateIsland } = await import('../src/runtime/hydrator.ts');

async function waitFor(check: () => boolean, timeoutMs = 2000): Promise<void> {
    const start = Date.now();
    while (!check()) {
        if (Date.now() - start > timeoutMs) throw new Error(`waitFor: condition not met within ${timeoutMs}ms`);
        await new Promise(r => setTimeout(r, 10));
    }
}

// Svelte compiles one source two ways: the server build renders HTML, the client build hydrates it.
const COUNTER = `<script>
    let { start = 0, label = 'Count' } = $props();
    let count = $state(start);
</script>
<button type="button" onclick={() => count++}>{label}: {count}</button>`;

let ServerCounter: any;
let ClientCounter: any;

// Svelte's development build warns about hydration problems ("hydration_mismatch"); captured so a
// clean hydration can assert there were none.
function captureConsole() {
    const messages: string[] = [];
    const { warn, error } = console;
    console.warn = (...args: unknown[]) => { messages.push(args.map(String).join(' ')); };
    console.error = (...args: unknown[]) => { messages.push(args.map(String).join(' ')); };
    return { messages, restore: () => { console.warn = warn; console.error = error; } };
}

before(async () => {
    ServerCounter = await compileSvelte('SsrSvelteCounter', COUNTER, 'server');
    ClientCounter = await compileSvelte('SsrSvelteCounter', COUNTER, 'client');
});

describe('Svelte SSR component', () => {
    it('renders a runes component to HTML with hydration markers', async () => {
        const html = await svelteSsrComponent(ServerCounter).render({ start: 3, label: 'Clicks' });
        assert.match(html, /^<!--\[-->/, 'hydrate() needs the opening block marker');
        assert.match(html, /<button type="button">Clicks: 3<\/button>/);
    });

    it('treats null/undefined props as {}', async () => {
        const component = svelteSsrComponent(ServerCounter);
        assert.equal(component.framework, 'svelte');
        assert.match(await component.render(null), /Count: 0/);
        assert.match(await component.render(undefined), /Count: 0/);
    });
});

describe('Svelte SSR hydration', () => {
    beforeEach(() => {
        clearRegistry();
        document.body.innerHTML = '';
    });

    async function serverRenderedIsland(name: string, props: Record<string, unknown>, stamped: boolean) {
        const container = document.createElement('div');
        container.setAttribute('data-island', name);
        container.setAttribute('data-hydrate', 'load');
        container.setAttribute('data-props', JSON.stringify(props));
        if (stamped) container.setAttribute('data-lt-ssr', 'true');
        container.innerHTML = await svelteSsrComponent(ServerCounter).render(props);
        document.body.appendChild(container);
        return container;
    }

    // A plain mount builds new nodes (the adapter clears the container first), so node identity
    // proves the hydrate path - plus exactly one button, since Svelte's mount() alone would append.
    it('hydrates data-lt-ssr markup: same DOM node, working state and events, no mismatch', async () => {
        defineIsland('ssr-svelte-counter', async () => ({ default: createSvelteIsland(ClientCounter) }));
        const container = await serverRenderedIsland('ssr-svelte-counter', { start: 5 }, true);
        const serverButton = container.querySelector('button')!;
        const output = captureConsole();
        try {
            hydrateIsland(container);
            await waitFor(() => container.getAttribute('data-lt-ssr-hydrated') === 'true');
            assert.equal(container.querySelectorAll('button').length, 1);
            assert.ok(container.querySelector('button') === serverButton, 'the server-rendered <button> must be adopted');

            serverButton.click();
            await waitFor(() => serverButton.textContent === 'Count: 6');
            assert.ok(container.querySelector('button') === serverButton, 'a state update must reuse the hydrated node');
        } finally {
            output.restore();
        }
        assert.deepEqual(output.messages, [], 'hydration must not warn or log errors');
    });

    it('takes the plain mount path (new nodes, no duplicate) when the markup lacks the data-lt-ssr stamp', async () => {
        defineIsland('plain-svelte-counter', async () => ({ default: createSvelteIsland(ClientCounter) }));
        const container = await serverRenderedIsland('plain-svelte-counter', { start: 5 }, false);
        const serverButton = container.querySelector('button')!;

        hydrateIsland(container);
        await waitFor(() => !!container.querySelector('button') && container.querySelector('button') !== serverButton);

        assert.equal(container.querySelectorAll('button').length, 1, 'the server markup must be replaced, not kept beside the component');
        const button = container.querySelector('button')!;
        assert.equal(button.textContent, 'Count: 5');
        assert.equal(container.hasAttribute('data-lt-ssr-hydrated'), false);
        button.click();
        await waitFor(() => button.textContent === 'Count: 6');
    });

    it('an explicit { hydrate: false } opts a stamped container out of hydration', async () => {
        const container = await serverRenderedIsland('opt-out-svelte', { start: 1 }, true);
        const serverButton = container.querySelector('button')!;
        const mount = createSvelteIsland(ClientCounter, { hydrate: false });

        const unmount: any = await mount(container, { start: 1 }, { hydrate: true } as any);
        try {
            assert.ok(container.querySelector('button') !== serverButton, 'opt-out must take the plain mount path');
            assert.equal(container.querySelectorAll('button').length, 1);
            assert.equal(container.querySelector('button')?.textContent, 'Count: 1');
        } finally {
            unmount?.();
        }
    });

    // Guards the same-node assertions above. Svelte's production hydration checks little: a different
    // tag is adopted as-is and differing text is silently patched, so neither is observable. Markup it
    // can't walk at all (here: the missing <!--[--> block marker) makes it discard the server DOM and
    // mount from scratch, without a warning - which only node identity catches.
    it('markup hydrate() cannot use is replaced by a fresh mount, which node identity detects', async () => {
        defineIsland('ssr-svelte-unusable', async () => ({ default: createSvelteIsland(ClientCounter) }));
        const container = await serverRenderedIsland('ssr-svelte-unusable', { start: 5 }, true);
        container.innerHTML = container.innerHTML.replace('<!--[-->', '');
        const serverButton = container.querySelector('button')!;

        hydrateIsland(container);
        await waitFor(() => container.getAttribute('data-lt-ssr-hydrated') === 'true');

        assert.equal(serverButton.isConnected, false, 'Svelte re-mounted instead of adopting the server node');
        assert.equal(container.querySelectorAll('button').length, 1);
        assert.equal(container.querySelector('button')?.textContent, 'Count: 5');
    });
});
