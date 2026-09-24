import './setup.ts';
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

// Dynamic imports so setup.ts's happy-dom globals exist before any Preact module evaluates.
const preact: any = await import('preact');
const hooks: any = await import('preact/hooks');
const { preactSsrComponent } = await import('../src/ssr/preact.ts');
const { createPreactIsland } = await import('../src/adapters/preact.ts');
const { defineIsland, clearRegistry } = await import('../src/runtime/registry.ts');
const { hydrateIsland } = await import('../src/runtime/hydrator.ts');

const h = preact.h;

async function waitFor(check: () => boolean, timeoutMs = 2000): Promise<void> {
    const start = Date.now();
    while (!check()) {
        if (Date.now() - start > timeoutMs) throw new Error(`waitFor: condition not met within ${timeoutMs}ms`);
        await new Promise(r => setTimeout(r, 10));
    }
}

function Counter({ start = 0, label = 'Count' }: { start?: number; label?: string }) {
    const [count, setCount] = hooks.useState(start);
    return h('button', { type: 'button', onClick: () => setCount((c: number) => c + 1) }, `${label}: ${count}`);
}

function captureConsoleErrors() {
    const errors: string[] = [];
    const original = console.error;
    console.error = (...args: unknown[]) => { errors.push(args.map(String).join(' ')); };
    return { errors, restore: () => { console.error = original; } };
}

describe('Preact SSR component', () => {
    it('renders a hooks component to HTML', () => {
        const html = preactSsrComponent(Counter).render({ start: 3, label: 'Clicks' });
        assert.equal(html, '<button type="button">Clicks: 3</button>');
    });

    it('treats null/undefined props as {}', () => {
        const component = preactSsrComponent(Counter);
        assert.equal(component.framework, 'preact');
        assert.equal(component.render(null), '<button type="button">Count: 0</button>');
        assert.equal(component.render(undefined), '<button type="button">Count: 0</button>');
    });
});

describe('Preact SSR hydration', () => {
    beforeEach(() => {
        clearRegistry();
        document.body.innerHTML = '';
    });

    // The server HTML gets one attribute the component never renders. Preact's plain render() treats
    // existing attributes as old props and strips unknown ones; hydrate() leaves them alone. Node
    // identity can't tell the two apart for Preact - unlike React, render() also reuses existing nodes.
    function serverRenderedIsland(name: string, props: Record<string, unknown>, stamped: boolean) {
        const container = document.createElement('div');
        container.setAttribute('data-island', name);
        container.setAttribute('data-hydrate', 'load');
        container.setAttribute('data-props', JSON.stringify(props));
        if (stamped) container.setAttribute('data-lt-ssr', 'true');
        container.innerHTML = (preactSsrComponent(Counter).render(props) as string).replace('<button ', '<button data-server-only="1" ');
        document.body.appendChild(container);
        return container;
    }

    it('hydrates data-lt-ssr markup: takes the hydrate path, same DOM node, working state and events', async () => {
        defineIsland('ssr-preact-counter', async () => ({ default: createPreactIsland(Counter) }));
        const container = serverRenderedIsland('ssr-preact-counter', { start: 5 }, true);
        const serverButton = container.querySelector('button')!;
        const consoleErrors = captureConsoleErrors();
        try {
            hydrateIsland(container);
            await waitFor(() => container.getAttribute('data-lt-ssr-hydrated') === 'true');

            assert.ok(container.querySelector('button') === serverButton, 'the server-rendered <button> must be adopted');
            assert.equal(serverButton.getAttribute('data-server-only'), '1', 'hydrate() leaves server attributes alone - a plain render() would strip this');

            serverButton.click();
            await waitFor(() => serverButton.textContent === 'Count: 6');
            assert.ok(container.querySelector('button') === serverButton, 'a state update must reuse the hydrated node');
        } finally {
            consoleErrors.restore();
        }
        assert.deepEqual(consoleErrors.errors, [], 'hydration must not log errors');
    });

    it('takes the plain render path when the same markup lacks the data-lt-ssr stamp', async () => {
        defineIsland('plain-preact-counter', async () => ({ default: createPreactIsland(Counter) }));
        const container = serverRenderedIsland('plain-preact-counter', { start: 5 }, false);

        hydrateIsland(container);
        await waitFor(() => container.querySelector('button')?.hasAttribute('data-server-only') === false);

        const button = container.querySelector('button')!;
        assert.equal(button.textContent, 'Count: 5');
        assert.equal(container.hasAttribute('data-lt-ssr-hydrated'), false);
        button.click();
        await waitFor(() => button.textContent === 'Count: 6');
    });

    it('an explicit { hydrate: false } opts a stamped container out of hydration', async () => {
        const container = serverRenderedIsland('opt-out-preact', { start: 1 }, true);
        const mount = createPreactIsland(Counter, { hydrate: false });

        const result: any = await mount(container, { start: 1 }, { hydrate: true } as any);
        try {
            assert.equal(container.querySelector('button')?.hasAttribute('data-server-only'), false, 'opt-out must take the plain render path');
            assert.equal(container.querySelector('button')?.textContent, 'Count: 1');
        } finally {
            result?.unmount();
        }
    });

    // The server serializes adjacent text children (`Total {n}`) into ONE text node, unlike React,
    // which inserts `<!-- -->` separators. Preact's hydration splits it back correctly.
    it('hydrates adjacent text children that the server collapsed into one text node', async () => {
        function Adjacent() {
            const [n, setN] = hooks.useState(3);
            return h('button', { type: 'button', onClick: () => setN((x: number) => x + 1) }, 'Total ', n);
        }
        defineIsland('ssr-preact-adjacent', async () => ({ default: createPreactIsland(Adjacent) }));
        const container = document.createElement('div');
        container.setAttribute('data-island', 'ssr-preact-adjacent');
        container.setAttribute('data-hydrate', 'load');
        container.setAttribute('data-lt-ssr', 'true');
        container.innerHTML = preactSsrComponent(Adjacent).render({}) as string;
        document.body.appendChild(container);
        const button = container.querySelector('button')!;
        assert.equal(button.childNodes.length, 1, 'precondition: the server sent one text node');

        hydrateIsland(container);
        await waitFor(() => container.getAttribute('data-lt-ssr-hydrated') === 'true');
        assert.equal(button.textContent, 'Total 3');

        button.click();
        await waitFor(() => button.textContent === 'Total 4');
    });
});
