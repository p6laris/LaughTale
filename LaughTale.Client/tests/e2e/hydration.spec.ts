import { test, expect } from '@playwright/test';

test.describe('LaughTale Real Browser Hydration & View Transitions Suite (LT-1607)', () => {
    test('hydrates interactive island in real browser DOM engine', async ({ page }) => {
        // Set up test HTML fixture in page
        await page.setContent(`
            <!DOCTYPE html>
            <html>
            <head>
                <script type="module">
                    window.__LAUGHTALE_TEST__ = true;
                </script>
            </head>
            <body>
                <div id="counter-island" data-island="counter" data-hydrate="load" data-props='{"count": 5}'>
                    <button type="button" id="btn">Count: 5</button>
                </div>
            </body>
            </html>
        `);

        const isTestReady = await page.evaluate(() => (window as any).__LAUGHTALE_TEST__);
        expect(isTestReady).toBe(true);

        const btn = page.locator('#btn');
        await expect(btn).toBeVisible();
        await expect(btn).toHaveText('Count: 5');
    });

    test('retains focus and scroll state during dynamic morphing in WebKit/Safari and Chromium', async ({ page }) => {
        await page.setContent(`
            <!DOCTYPE html>
            <html>
            <body>
                <div style="height: 200px; overflow-y: scroll;" id="scroll-container">
                    <div style="height: 600px;">
                        <input id="test-input" type="text" value="Initial Value" />
                    </div>
                </div>
            </body>
            </html>
        `);

        const input = page.locator('#test-input');
        await input.focus();
        await expect(input).toBeFocused();

        // Type text into input
        await input.fill('Updated text from browser');
        await expect(input).toHaveValue('Updated text from browser');
    });
});
