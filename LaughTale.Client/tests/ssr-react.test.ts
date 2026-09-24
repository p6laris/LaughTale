import './setup.ts';
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

// Dynamic imports so setup.ts's happy-dom globals exist before any React module evaluates (see the
// identical note in adapters.test.ts).
const React: any = await import('react');
const { reactSsrComponent } = await import('../src/ssr/react.ts');
const { createReactIsland } = await import('../src/adapters/react.ts');
const { defineIsland, clearRegistry } = await import('../src/runtime/registry.ts');
const { hydrateIsland } = await import('../src/runtime/hydrator.ts');

async function waitFor(check: () => boolean, timeoutMs = 2000): Promise<void> {
    const start = Date.now();
    while (!check()) {
        if (Date.now() - start > timeoutMs) throw new Error(`waitFor: condition not met within ${timeoutMs}ms`);
        await new Promise(r => setTimeout(r, 10));
    }
}

function Counter({ start = 0, label = 'Count' }: { start?: number; label?: string }) {
    const [count, setCount] = React.useState(start);
    return React.createElement('button', { type: 'button', onClick: () => setCount((c: number) => c + 1) }, label, ': ', count);
}

// React attaches its fiber to a DOM node only once it owns that node (i.e. hydration committed).
const isOwnedByReact = (node: Node) => Object.keys(node).some(k => k.startsWith('__reactFiber$'));

function captureConsoleErrors() {
    const errors: string[] = [];
    const original = console.error;
    console.error = (...args: unknown[]) => { errors.push(args.map(String).join(' ')); };
    return { errors, restore: () => { console.error = original; } };
}

describe('React SSR component', () => {
    it('renders a hooks component to HTML', () => {
        const html = reactSsrComponent(Counter).render({ start: 3, label: 'Clicks' });
        assert.equal(html, '<button type="button">Clicks<!-- -->: <!-- -->3</button>');
    });

    it('treats null/undefined props as {}', () => {
        const component = reactSsrComponent(Counter);
        assert.equal(component.framework, 'react');
        assert.equal(component.render(null), '<button type="button">Count<!-- -->: <!-- -->0</button>');
        assert.equal(component.render(undefined), '<button type="button">Count<!-- -->: <!-- -->0</button>');
    });
});

describe('React SSR hydration', () => {
    beforeEach(() => {
        clearRegistry();
        document.body.innerHTML = '';
    });

    function serverRenderedIsland(name: string, props: Record<string, unknown>, stamped: boolean) {
        const container = document.createElement('div');
        container.setAttribute('data-island', name);
        container.setAttribute('data-hydrate', 'load');
        container.setAttribute('data-props', JSON.stringify(props));
        if (stamped) container.setAttribute('data-lt-ssr', 'true');
        container.innerHTML = reactSsrComponent(Counter).render(props) as string;
        document.body.appendChild(container);
        return container;
    }

    it('hydrates data-lt-ssr markup in place: same DOM node, working state and events, no mismatch', async () => {
        defineIsland('ssr-counter', async () => ({ default: createReactIsland(Counter) }));
        const container = serverRenderedIsland('ssr-counter', { start: 5 }, true);
        const serverButton = container.querySelector('button')!;
        const consoleErrors = captureConsoleErrors();
        try {
            hydrateIsland(container);
            await waitFor(() => isOwnedByReact(serverButton));

            assert.ok(container.querySelector('button') === serverButton, 'the server-rendered <button> must be adopted, not replaced');
            assert.ok(serverButton.isConnected, 'the server-rendered <button> must still be in the document');
            assert.equal(container.getAttribute('data-lt-ssr-hydrated'), 'true');

            serverButton.click();
            await waitFor(() => serverButton.textContent === 'Count: 6');
            assert.ok(container.querySelector('button') === serverButton, 'a state update must reuse the hydrated node');
        } finally {
            consoleErrors.restore();
        }
        assert.deepEqual(consoleErrors.errors, [], 'hydration must not log errors (e.g. a hydration mismatch)');
    });

    it('mounts fresh (createRoot) when the same markup lacks the data-lt-ssr stamp', async () => {
        defineIsland('plain-counter', async () => ({ default: createReactIsland(Counter) }));
        const container = serverRenderedIsland('plain-counter', { start: 5 }, false);
        const originalButton = container.querySelector('button')!;

        hydrateIsland(container);
        await waitFor(() => !originalButton.isConnected);

        const mounted = container.querySelector('button')!;
        assert.ok(mounted !== originalButton, 'a non-SSR mount replaces the existing DOM');
        assert.equal(mounted.textContent, 'Count: 5');
        assert.equal(container.hasAttribute('data-lt-ssr-hydrated'), false);

        mounted.click();
        await waitFor(() => mounted.textContent === 'Count: 6');
    });

    it('an explicit { hydrate: false } opts a stamped container out of hydration', async () => {
        const container = serverRenderedIsland('opt-out-counter', { start: 1 }, true);
        const serverButton = container.querySelector('button')!;
        const mount = createReactIsland(Counter, { hydrate: false });

        const result: any = await mount(container, { start: 1 }, { hydrate: true } as any);
        try {
            assert.ok(!serverButton.isConnected, 'opt-out must render fresh, replacing the server markup');
            assert.equal(container.querySelector('button')?.textContent, 'Count: 1');
        } finally {
            result?.unmount();
        }
    });
});
