/**
 * ROADMAP.v5.md Part J "Publish honest numbers": a reproducible benchmark harness measuring TTFB,
 * TTI, transferred bytes, and memory growth after 50 client-side navigations, against three
 * deliberately minimal, structurally-identical apps (Home/Counter/Weather, same markup shape, same
 * "Click me" counter behavior) - one LaughTale (Razor Pages + one island), one Blazor Server, one
 * Blazor WASM - all scaffolded from `dotnet new`'s own default templates with no artificial slowdowns
 * left in (the Blazor template's own Weather page ships a 500ms Task.Delay to demo streaming; removed
 * here for both Blazor apps as documented in Weather.razor, since it would unfairly inflate that
 * page's own numbers against the other two apps which have no equivalent delay).
 *
 * Requires all three apps already running on their own ports:
 *   LaughTale:     http://localhost:5126
 *   Blazor Server: http://localhost:5214
 *   Blazor WASM:   http://localhost:5183
 *
 * Usage: NODE_PATH=../../LaughTale.Client/node_modules node run-benchmark.cjs
 */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const APPS = [
    { name: 'LaughTale', baseUrl: 'http://localhost:5126' },
    { name: 'Blazor Server', baseUrl: 'http://localhost:5214' },
    { name: 'Blazor WASM', baseUrl: 'http://localhost:5183' }
];

const NAV_ITERATIONS = 50;

/**
 * Clicks the counter button repeatedly until the status text actually changes, or gives up.
 * Necessary because Blazor Server's status text is server-rendered and visible immediately, but
 * @onclick does nothing until its SignalR circuit finishes connecting - a single immediate click can
 * race that gap and silently no-op. Retrying and measuring TOTAL elapsed time until a click actually
 * registers is still an honest TTI number (arguably the more correct one: "time until clicking
 * actually works"), and treats all three apps identically rather than special-casing one.
 */
async function clickUntilInteractive(page, maxAttempts) {
    const before = await page.locator('[role="status"]').textContent();
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        await page.locator('button:has-text("Click me")').click();
        try {
            await page.waitForFunction(
                (prev) => document.querySelector('[role="status"]')?.textContent !== prev,
                before,
                { timeout: 250 }
            );
            return true;
        } catch {
            // Not interactive yet (Blazor WASM may still be downloading its runtime at this point,
            // Blazor Server's circuit may still be connecting) - try again.
        }
    }
    return false;
}

async function measureApp(browser, app) {
    const context = await browser.newContext();
    const page = await context.newPage();

    // A SINGLE continuous byte counter spanning from the very first navigation through confirmed
    // interactivity - not scoped to just the `load` event. A first pass at this harness scoped byte
    // counting to `load` only and got a real, honestly-reported-here surprise: Blazor WASM's own
    // runtime download (its interpreter, BCL assemblies, ICU data - ~200 more requests) continues for
    // several seconds AFTER `load` fires, so a `load`-scoped count made WASM look artificially cheap
    // (355 KB measured vs. its real ~23.7 MB). `load` is still reported separately below since it's
    // what a user's browser chrome/spinner actually reacts to, but it is NOT "how much this app costs
    // to become usable" - only a byte count spanning all the way to confirmed interactivity is.
    let transferredBytesUntilInteractive = 0;
    const trackBytes = (res) => {
        const len = res.headers()['content-length'];
        if (len) transferredBytesUntilInteractive += parseInt(len, 10);
    };
    page.on('response', trackBytes);

    // --- Initial load: TTFB, DOMContentLoaded, transferred bytes AT the `load` event ---
    await page.goto(app.baseUrl + '/', { waitUntil: 'load' });

    const navTiming = await page.evaluate(() => {
        const nav = performance.getEntriesByType('navigation')[0];
        return {
            ttfbMs: nav.responseStart - nav.startTime,
            domContentLoadedMs: nav.domContentLoadedEventEnd - nav.startTime,
            loadEventMs: nav.loadEventEnd - nav.startTime
        };
    });
    const transferredBytesAtLoad = transferredBytesUntilInteractive;

    // --- TTI proxy: time from navigating to Counter until a REAL click produces a REAL DOM update
    // (functional interactivity, not a synthetic idle-period heuristic). Byte counting continues
    // uninterrupted from above - Blazor WASM's runtime finishes downloading during/after this phase,
    // not during the initial `/` load, so it must be included here to be counted at all. ---
    const ttiStart = Date.now();
    await page.goto(app.baseUrl + '/counter', { waitUntil: 'load' });
    await page.waitForSelector('[role="status"]', { state: 'visible' });

    const interactive = await clickUntilInteractive(page, 200);
    page.off('response', trackBytes);
    if (!interactive) {
        throw new Error('Counter click never registered after 200 retries');
    }
    const ttiMs = Date.now() - ttiStart;

    // --- Memory after 50 client-side navigations (Home <-> Counter) ---
    await page.goto(app.baseUrl + '/', { waitUntil: 'load' });
    // A short settle wait before the loop starts - Blazor Server's SignalR circuit needs to finish
    // connecting before a nav click does anything (same gap clickUntilInteractive works around); by
    // the second iteration this stops mattering, but the first click deserves a fair chance too.
    await page.waitForTimeout(500);
    for (let i = 0; i < NAV_ITERATIONS; i++) {
        await page.locator('.nav-link:has-text("Counter")').first().click();
        await page.waitForSelector('[role="status"]', { state: 'visible' });
        await page.locator('.nav-link:has-text("Home")').first().click();
        await page.waitForTimeout(15);
    }

    const client = await context.newCDPSession(page);
    await client.send('HeapProfiler.collectGarbage').catch(() => {});
    const memoryAfter50NavBytes = await page.evaluate(() =>
        // performance.memory is Chromium-only (non-standard) - acceptable here since this harness
        // itself only runs Chromium via Playwright. Its resolution is deliberately coarsened by
        // Chromium for fingerprinting-privacy reasons (values get bucketed), which is visible in the
        // results as suspiciously round numbers - a real browser platform behavior, not a harness bug.
        (performance).memory ? (performance).memory.usedJSHeapSize : null
    );

    await context.close();

    return {
        name: app.name,
        ttfbMs: Math.round(navTiming.ttfbMs),
        domContentLoadedMs: Math.round(navTiming.domContentLoadedMs),
        loadEventMs: Math.round(navTiming.loadEventMs),
        transferredBytesAtLoad,
        transferredBytesUntilInteractive,
        ttiMs,
        memoryAfter50NavBytes
    };
}

(async () => {
    const browser = await chromium.launch();
    const results = [];

    for (const app of APPS) {
        console.log(`Measuring ${app.name}...`);
        try {
            results.push(await measureApp(browser, app));
        } catch (err) {
            console.error(`  FAILED: ${err.message}`);
            results.push({ name: app.name, error: err.message });
        }
    }

    await browser.close();

    const outPath = path.join(__dirname, 'results.json');
    fs.writeFileSync(outPath, JSON.stringify(results, null, 2));

    console.log('\n=== Results ===');
    console.table(results);
    console.log(`\nWritten to ${outPath}`);
})();
