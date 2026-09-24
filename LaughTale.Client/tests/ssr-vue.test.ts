import './setup.ts';
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

// Dynamic imports so setup.ts's happy-dom globals exist before any Vue module evaluates (Vue's
// runtime-dom caches `document` at load time - see the identical note in adapters.test.ts).
const Vue: any = await import('vue');
const { vueSsrComponent } = await import('../src/ssr/vue.ts');
const { createVueIsland } = await import('../src/adapters/vue.ts');
const { defineIsland, clearRegistry } = await import('../src/runtime/registry.ts');
const { hydrateIsland } = await import('../src/runtime/hydrator.ts');

const { h, ref, defineComponent } = Vue;

async function waitFor(check: () => boolean, timeoutMs = 2000): Promise<void> {
    const start = Date.now();
    while (!check()) {
        if (Date.now() - start > timeoutMs) throw new Error(`waitFor: condition not met within ${timeoutMs}ms`);
        await new Promise(r => setTimeout(r, 10));
    }
}

const Counter = defineComponent({
    props: { start: { type: Number, default: 0 }, label: { type: String, default: 'Count' } },
    setup(props: { start: number; label: string }) {
        const count = ref(props.start);
        return () => h('button', { type: 'button', onClick: () => count.value++ }, `${props.label}: ${count.value}`);
    }
});

// Vue reports hydration mismatches through console.warn ("[Vue warn]: Hydration ... mismatch") and
// console.error ("Hydration completed but contains mismatches."), so both are captured.
function captureConsole() {
    const messages: string[] = [];
    const { warn, error } = console;
    console.warn = (...args: unknown[]) => { messages.push(args.map(String).join(' ')); };
    console.error = (...args: unknown[]) => { messages.push(args.map(String).join(' ')); };
    return { messages, restore: () => { console.warn = warn; console.error = error; } };
}

describe('Vue SSR component', () => {
    it('renders a setup() component to HTML', async () => {
        const html = await vueSsrComponent(Counter).render({ start: 3, label: 'Clicks' });
        assert.equal(html, '<button type="button">Clicks: 3</button>');
    });

    it('treats null/undefined props as {}', async () => {
        const component = vueSsrComponent(Counter);
        assert.equal(component.framework, 'vue');
        assert.equal(await component.render(null), '<button type="button">Count: 0</button>');
        assert.equal(await component.render(undefined), '<button type="button">Count: 0</button>');
    });

    it('does not share state between renders', async () => {
        const Shared = defineComponent({
            setup() {
                const n = ref(0);
                n.value++;
                return () => h('span', null, String(n.value));
            }
        });
        const component = vueSsrComponent(Shared);
        assert.equal(await component.render({}), '<span>1</span>');
        assert.equal(await component.render({}), '<span>1</span>');
    });
});

describe('Vue SSR hydration', () => {
    beforeEach(() => {
        clearRegistry();
        document.body.innerHTML = '';
    });

    async function serverRenderedIsland(name: string, props: Record<string, unknown>, stamped: boolean, component: any = Counter) {
        const container = document.createElement('div');
        container.setAttribute('data-island', name);
        container.setAttribute('data-hydrate', 'load');
        container.setAttribute('data-props', JSON.stringify(props));
        if (stamped) container.setAttribute('data-lt-ssr', 'true');
        container.innerHTML = await vueSsrComponent(component).render(props);
        document.body.appendChild(container);
        return container;
    }

    // A plain createApp().mount() empties the container and builds new nodes, so - as with React -
    // node identity alone proves the hydrate path was taken.
    it('hydrates data-lt-ssr markup: same DOM node, working state and events, no mismatch', async () => {
        defineIsland('ssr-vue-counter', async () => ({ default: createVueIsland(Counter) }));
        const container = await serverRenderedIsland('ssr-vue-counter', { start: 5 }, true);
        const serverButton = container.querySelector('button')!;
        const output = captureConsole();
        try {
            hydrateIsland(container);
            await waitFor(() => container.getAttribute('data-lt-ssr-hydrated') === 'true');
            assert.ok(container.querySelector('button') === serverButton, 'the server-rendered <button> must be adopted');

            serverButton.click();
            await waitFor(() => serverButton.textContent === 'Count: 6');
            assert.ok(container.querySelector('button') === serverButton, 'a state update must reuse the hydrated node');
        } finally {
            output.restore();
        }
        assert.deepEqual(output.messages, [], 'hydration must not warn or log errors');
    });

    it('takes the plain mount path (new nodes) when the same markup lacks the data-lt-ssr stamp', async () => {
        defineIsland('plain-vue-counter', async () => ({ default: createVueIsland(Counter) }));
        const container = await serverRenderedIsland('plain-vue-counter', { start: 5 }, false);
        const serverButton = container.querySelector('button')!;

        hydrateIsland(container);
        await waitFor(() => !!container.querySelector('button') && container.querySelector('button') !== serverButton);

        const button = container.querySelector('button')!;
        assert.equal(button.textContent, 'Count: 5');
        assert.equal(container.hasAttribute('data-lt-ssr-hydrated'), false);
        button.click();
        await waitFor(() => button.textContent === 'Count: 6');
    });

    it('an explicit { hydrate: false } opts a stamped container out of hydration', async () => {
        const container = await serverRenderedIsland('opt-out-vue', { start: 1 }, true);
        const serverButton = container.querySelector('button')!;
        const mount = createVueIsland(Counter, { hydrate: false });

        const result: any = await mount(container, { start: 1 }, { hydrate: true } as any);
        try {
            assert.ok(container.querySelector('button') !== serverButton, 'opt-out must take the plain mount path');
            assert.equal(container.querySelector('button')?.textContent, 'Count: 1');
        } finally {
            result?.unmount();
        }
    });

    // The server writes adjacent text children (`'Total ', n`) as ONE text node; Vue's hydration
    // splits it back without reporting a mismatch.
    it('hydrates adjacent text children that the server merged into one text node', async () => {
        const Adjacent = defineComponent({
            setup() {
                const n = ref(3);
                return () => h('button', { type: 'button', onClick: () => n.value++ }, ['Total ', String(n.value)]);
            }
        });
        defineIsland('ssr-vue-adjacent', async () => ({ default: createVueIsland(Adjacent) }));
        const container = await serverRenderedIsland('ssr-vue-adjacent', {}, true, Adjacent);
        const button = container.querySelector('button')!;
        assert.equal(button.childNodes.length, 1, 'precondition: the server sent one text node');

        const output = captureConsole();
        try {
            hydrateIsland(container);
            await waitFor(() => container.getAttribute('data-lt-ssr-hydrated') === 'true');
            assert.equal(button.textContent, 'Total 3');
            button.click();
            await waitFor(() => button.textContent === 'Total 4');
        } finally {
            output.restore();
        }
        assert.deepEqual(output.messages, []);
    });

    // Guards the "no mismatch" assertions above: they would be meaningless if Vue's mismatch
    // reporting never reached the captured console in this environment.
    it('a server/client mismatch is reported (so the clean-hydration checks above mean something)', async () => {
        defineIsland('ssr-vue-mismatch', async () => ({ default: createVueIsland(Counter) }));
        const container = await serverRenderedIsland('ssr-vue-mismatch', { start: 5 }, true);
        container.querySelector('button')!.textContent = 'Count: 99';

        const output = captureConsole();
        try {
            hydrateIsland(container);
            await waitFor(() => container.getAttribute('data-lt-ssr-hydrated') === 'true');
        } finally {
            output.restore();
        }
        assert.ok(output.messages.some(m => /mismatch/i.test(m)), `expected a mismatch report, got: ${JSON.stringify(output.messages)}`);
    });
});
