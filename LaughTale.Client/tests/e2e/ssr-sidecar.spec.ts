import { test, expect } from '@playwright/test';

// The SSR sidecar end to end: .NET asks a Node child process (the Showcase's ssr/server-bundle.mjs)
// to render the React island, and the browser hydrates that markup instead of re-mounting it. The
// Showcase enables the sidecar in Development (appsettings.Development.json), which is how
// Playwright's webServer runs it.

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
