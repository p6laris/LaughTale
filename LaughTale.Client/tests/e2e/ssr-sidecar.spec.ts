import { test, expect } from '@playwright/test';

// The SSR sidecar end to end: .NET asks a Node child process (the Showcase's ssr/server-bundle.mjs)
// to render islands (React, Preact, Vue, Svelte, Solid), and the browser hydrates that markup
// instead of re-mounting it. The Showcase enables the sidecar in Development
// (appsettings.Development.json), which is how Playwright's webServer runs it.

test.describe('SSR sidecar (React)', () => {
    test('the server response already contains the React island rendered to HTML', async ({ request }) => {
        const html = await (await request.get('/polyglot')).text();

        expect(html).toContain('data-lt-ssr="true" data-island="polyglot-react"');
        // Rendered from the Razor props (InitialScore = 1500); `<!-- -->` is React's text separator,
        // which hydration relies on.
        expect(html).toMatch(/data-testid="react-revenue"[^>]*>\$<!-- -->1,500</);
    });

    test('the browser hydrates the server markup - same DOM nodes, no mismatch, interactive', async ({ page }) => {
        const errors: string[] = [];
        page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
        page.on('pageerror', err => errors.push(err.message));

        // Runs before any page script: grab the server-rendered node once parsing finishes but
        // before the island's JS can run. A re-mount would replace it; hydration keeps it.
        await page.addInitScript(() => {
            document.addEventListener('readystatechange', () => {
                if (document.readyState === 'interactive') {
                    (window as any).__ssrRevenueNode = document.querySelector('[data-island="polyglot-react"] [data-testid="react-revenue"]');
                }
            });
        });

        await page.goto('/polyglot');
        const island = page.locator('[data-island="polyglot-react"]');
        await expect(island).toHaveAttribute('data-lt-ssr-hydrated', 'true');

        const revenue = island.locator('[data-testid="react-revenue"]');
        await expect(revenue).toHaveText('$1,500');
        await island.locator('[data-testid="react-sale-250"]').click();
        await expect(revenue).toHaveText('$1,750');

        const sameNode = await page.evaluate(() => {
            const captured = (window as any).__ssrRevenueNode;
            return !!captured && captured === document.querySelector('[data-island="polyglot-react"] [data-testid="react-revenue"]');
        });
        expect(sameNode, 'the node present in the server HTML must still be the live node after hydration').toBe(true);

        expect(errors.filter(e => /hydrat|did not match|mismatch/i.test(e))).toEqual([]);
    });
});

test.describe('SSR sidecar (Preact)', () => {
    test('the server response already contains the Preact island rendered to HTML', async ({ request }) => {
        const html = await (await request.get('/polyglot')).text();

        expect(html).toContain('data-lt-ssr="true" data-island="polyglot-preact"');
        expect(html).toMatch(/data-testid="preact-throughput"[^>]*>52 </);
    });

    test('a hydrate="Visible" island shows server content before its JS runs, then hydrates on scroll', async ({ page }) => {
        const errors: string[] = [];
        page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
        page.on('pageerror', err => errors.push(err.message));

        await page.addInitScript(() => {
            document.addEventListener('readystatechange', () => {
                if (document.readyState === 'interactive') {
                    (window as any).__ssrThroughputNode = document.querySelector('[data-island="polyglot-preact"] [data-testid="preact-throughput"]');
                }
            });
        });

        await page.goto('/polyglot');
        const island = page.locator('[data-island="polyglot-preact"]');
        const throughput = island.locator('[data-testid="preact-throughput"]');

        // Off-screen and not hydrated yet - but the content is already there, from the server.
        await expect(throughput).toHaveText('52 tx/sec');
        expect(await island.getAttribute('data-lt-ssr-hydrated')).toBeNull();

        await island.scrollIntoViewIfNeeded();
        await expect(island).toHaveAttribute('data-lt-ssr-hydrated', 'true');

        await island.locator('[data-testid="preact-burst"]').click();
        await expect(throughput).toHaveText('77 tx/sec');

        const sameNode = await page.evaluate(() => {
            const captured = (window as any).__ssrThroughputNode;
            return !!captured && captured === document.querySelector('[data-island="polyglot-preact"] [data-testid="preact-throughput"]');
        });
        expect(sameNode, 'the node present in the server HTML must still be the live node after hydration').toBe(true);

        expect(errors.filter(e => /hydrat|did not match|mismatch/i.test(e))).toEqual([]);
    });
});

test.describe('SSR sidecar (Vue)', () => {
    test('the server response already contains the Vue island rendered to HTML', async ({ request }) => {
        const html = await (await request.get('/polyglot')).text();

        expect(html).toContain('data-lt-ssr="true" data-island="polyglot-vue"');
        expect(html).toMatch(/data-testid="vue-cart-total"[^>]*>\$0</);
        // Declared props must not fall through as HTML attributes.
        expect(html).not.toMatch(/initialstock=/i);
    });

    test('the browser hydrates the server markup - same DOM nodes, no mismatch, interactive', async ({ page }) => {
        const errors: string[] = [];
        page.on('console', msg => { if (msg.type() === 'error' || msg.type() === 'warning') errors.push(msg.text()); });
        page.on('pageerror', err => errors.push(err.message));

        // A plain Vue mount empties the container and builds new nodes; hydration keeps them.
        await page.addInitScript(() => {
            document.addEventListener('readystatechange', () => {
                if (document.readyState === 'interactive') {
                    (window as any).__ssrCartTotalNode = document.querySelector('[data-island="polyglot-vue"] [data-testid="vue-cart-total"]');
                }
            });
        });

        await page.goto('/polyglot');
        const island = page.locator('[data-island="polyglot-vue"]');
        await expect(island).toHaveAttribute('data-lt-ssr-hydrated', 'true');

        const total = island.locator('[data-testid="vue-cart-total"]');
        await expect(total).toHaveText('$0');
        await island.locator('[data-testid="vue-inc-0"]').click();
        await island.locator('[data-testid="vue-inc-2"]').click();
        await expect(total).toHaveText('$598');
        await expect(island.locator('[data-testid="vue-stock-0"]')).toHaveText('11');

        const sameNode = await page.evaluate(() => {
            const captured = (window as any).__ssrCartTotalNode;
            return !!captured && captured === document.querySelector('[data-island="polyglot-vue"] [data-testid="vue-cart-total"]');
        });
        expect(sameNode, 'the node present in the server HTML must still be the live node after hydration').toBe(true);

        // Vue logs "Hydration completed but contains mismatches." even in production builds.
        expect(errors.filter(e => /hydrat|did not match|mismatch/i.test(e))).toEqual([]);
    });
});

test.describe('SSR sidecar (Svelte)', () => {
    test('the server response already contains the Svelte island rendered to HTML', async ({ request }) => {
        const html = await (await request.get('/polyglot')).text();

        expect(html).toContain('data-lt-ssr="true" data-island="polyglot-svelte"');
        expect(html).toMatch(/data-testid="svelte-load"[^>]*>40%</);
        // The block marker Svelte's hydrate() needs; without it Svelte silently re-mounts.
        expect(html).toMatch(/data-island="polyglot-svelte"[^>]*><!--\[-->/);
    });

    test('the browser hydrates the server markup - same DOM nodes, interactive', async ({ page }) => {
        const errors: string[] = [];
        page.on('console', msg => { if (msg.type() === 'error' || msg.type() === 'warning') errors.push(msg.text()); });
        page.on('pageerror', err => errors.push(err.message));

        // Svelte's production build re-mounts markup it can't hydrate without any warning, so node
        // identity is the check that matters here.
        await page.addInitScript(() => {
            document.addEventListener('readystatechange', () => {
                if (document.readyState === 'interactive') {
                    (window as any).__ssrLoadNode = document.querySelector('[data-island="polyglot-svelte"] [data-testid="svelte-load"]');
                }
            });
        });

        await page.goto('/polyglot');
        const island = page.locator('[data-island="polyglot-svelte"]');
        await expect(island).toHaveAttribute('data-lt-ssr-hydrated', 'true');

        // The gauge decays on a timer once hydrated, so assert outcomes the timer can't flake:
        // two spikes from ~40% always cross the 75% "Peak Load" threshold.
        const spike = island.locator('[data-testid="svelte-spike"]');
        await spike.click();
        await spike.click();
        await expect(island.locator('[data-testid="svelte-status"]')).toHaveText('Peak Load');
        const load = parseInt((await island.locator('[data-testid="svelte-load"]').textContent()) ?? '', 10);
        expect(load).toBeGreaterThanOrEqual(75);
        await expect(island.locator('button')).toHaveCount(1);

        const sameNode = await page.evaluate(() => {
            const captured = (window as any).__ssrLoadNode;
            return !!captured && captured === document.querySelector('[data-island="polyglot-svelte"] [data-testid="svelte-load"]');
        });
        expect(sameNode, 'the node present in the server HTML must still be the live node after hydration').toBe(true);

        expect(errors.filter(e => /hydrat|did not match|mismatch/i.test(e))).toEqual([]);
    });
});

test.describe('SSR sidecar (Solid)', () => {
    test('the server response already contains the Solid island rendered to HTML', async ({ request }) => {
        const html = await (await request.get('/polyglot')).text();

        expect(html).toContain('data-lt-ssr="true" data-island="polyglot-solid"');
        // data-hk is the key Solid's hydrate() uses to find each server node.
        expect(html).toMatch(/data-island="polyglot-solid"[^>]*><div data-hk="/);
        expect(html).toMatch(/data-testid="solid-count"[^>]*>\s*0\s*</);
    });

    test('the browser hydrates the server markup - same DOM nodes, interactive, no hydration script needed', async ({ page }) => {
        const errors: string[] = [];
        page.on('console', msg => { if (msg.type() === 'error' || msg.type() === 'warning') errors.push(msg.text()); });
        page.on('pageerror', err => errors.push(err.message));

        // Solid silently rebuilds DOM it can't match, so node identity is the check that matters.
        await page.addInitScript(() => {
            document.addEventListener('readystatechange', () => {
                if (document.readyState === 'interactive') {
                    (window as any).__ssrSolidCountNode = document.querySelector('[data-island="polyglot-solid"] [data-testid="solid-count"]');
                    // The page ships no Solid hydration script; the adapter provides what hydrate() needs.
                    (window as any).__hadSolidHydrationScript = typeof (window as any)._$HY !== 'undefined';
                }
            });
        });

        await page.goto('/polyglot');
        const island = page.locator('[data-island="polyglot-solid"]');
        await expect(island).toHaveAttribute('data-lt-ssr-hydrated', 'true');

        const increment = island.locator('[data-testid="solid-increment"]');
        await increment.click();
        await increment.click();
        await increment.click();
        await expect(island.locator('[data-testid="solid-count"]')).toHaveText('3');
        await expect(island.locator('button')).toHaveCount(1);

        const result = await page.evaluate(() => {
            const captured = (window as any).__ssrSolidCountNode;
            return {
                sameNode: !!captured && captured === document.querySelector('[data-island="polyglot-solid"] [data-testid="solid-count"]'),
                hadScript: (window as any).__hadSolidHydrationScript
            };
        });
        expect(result.sameNode, 'the node present in the server HTML must still be the live node after hydration').toBe(true);
        expect(result.hadScript).toBe(false);

        expect(errors.filter(e => /hydrat|did not match|mismatch/i.test(e))).toEqual([]);
    });
});
