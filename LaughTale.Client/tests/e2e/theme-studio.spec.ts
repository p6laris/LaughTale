import { test, expect, type Page } from '@playwright/test';

// The real theme-studio island (LaughTale.Client/src/components/theme-studio.ts) is mounted via
// <island-theme-studio /> in LaughTale.Showcase/Pages/_Layout.cshtml on EVERY Showcase page, so
// page.goto('/') is a fine, real navigation target for every test below - no synthetic
// page.setContent() fixture needed. All selectors (class names / data-attributes) were verified
// directly against theme-studio.ts before writing these tests; exact inline `style` attribute
// content is not load-bearing and is not asserted on.
//
// The drawer's own trigger button (.theme-studio-toggle-btn) is a fixed-position FAB that stays
// on screen regardless of the drawer's own open/closed state, so it's always safely clickable.
// The drawer's interactive controls (mode/color/radius/density/shadow/font/lang buttons), however,
// sit inside `.theme-studio-drawer`, which starts translated fully off-screen
// (`transform: translateX(100%)`) - real user interaction requires opening the drawer first via a
// real click on the trigger button (preferred over dispatching a synthetic `studio:open` event,
// since the trigger button is reliably clickable here and that's what an actual user does).
async function openDrawer(page: Page): Promise<void> {
    const drawer = page.locator('.theme-studio-drawer');
    await page.locator('.theme-studio-toggle-btn').click();
    await expect(drawer).toBeInViewport();
}

test.describe('LaughTale Aura Theme Studio E2E Suite (real Showcase app)', () => {

    test('opening the drawer via the real trigger button reveals it on screen', async ({ page }) => {
        await page.goto('/');

        const drawer = page.locator('.theme-studio-drawer');
        // Closed state: transform: translateX(100%) pushes the drawer fully outside the viewport.
        await expect(drawer).not.toBeInViewport();

        await page.locator('.theme-studio-toggle-btn').click();

        // Open state: drawer.style.transform = 'translateX(0)' brings it on screen for real -
        // a real visual/bounding-box change, not just "the element exists in the DOM".
        await expect(drawer).toBeInViewport();
    });

    test('clicking mode buttons toggles document.documentElement dark class and data-theme for real', async ({ page }) => {
        await page.goto('/');
        await openDrawer(page);

        await page.locator('.mode-btn[data-mode="dark"]').click();
        await expect(page.locator('html')).toHaveClass(/dark/);
        await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

        await page.locator('.mode-btn[data-mode="light"]').click();
        await expect(page.locator('html')).not.toHaveClass(/dark/);
        await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    });

    test('clicking a primary palette swatch updates the primary label and the real --p-primary-500 token', async ({ page }) => {
        await page.goto('/');
        await openDrawer(page);

        // Initial state renders "Emerald" in markup, but applyTheme() runs once at mount and
        // appends a live WCAG contrast ratio/grade suffix (theme-studio.ts's applyTheme():
        // `${primaryName} • ${contrast.formattedRatio} (${contrast.grade})`) - so the label is
        // never just the bare palette name once the island is live. Assert containment, not
        // an exact match.
        const label = page.locator('.studio-primary-label');
        await expect(label).toContainText('Emerald');

        await page.locator('.studio-color-swatch[data-color="blue"]').click();

        await expect(label).toContainText('Blue');
        const primary500 = await page.evaluate(() =>
            getComputedStyle(document.documentElement).getPropertyValue('--p-primary-500').trim()
        );
        // AURA_PALETTES.blue['500'] from LaughTale.Client/src/styles/design-tokens.ts.
        expect(primary500).toBe('#3b82f6');
    });

    test('clicking the Pill radius button updates the radius label and the real --lt-radius token', async ({ page }) => {
        await page.goto('/');
        await openDrawer(page);

        const label = page.locator('.studio-radius-label');
        await expect(label).toHaveText('0.5rem');

        await page.locator('.radius-btn[data-radius="9999px"]').click();

        await expect(label).toHaveText('9999px');
        const radius = await page.evaluate(() =>
            getComputedStyle(document.documentElement).getPropertyValue('--lt-radius').trim()
        );
        expect(radius).toBe('9999px');
    });

    test('clicking Compact then Spacious density updates the real padding tokens', async ({ page }) => {
        await page.goto('/');
        await openDrawer(page);

        await page.locator('.density-btn[data-density="compact"]').click();
        let paddingY = await page.evaluate(() =>
            getComputedStyle(document.documentElement).getPropertyValue('--lt-field-padding-y').trim()
        );
        expect(paddingY).toBe('0.35rem');

        await page.locator('.density-btn[data-density="spacious"]').click();
        paddingY = await page.evaluate(() =>
            getComputedStyle(document.documentElement).getPropertyValue('--lt-field-padding-y').trim()
        );
        expect(paddingY).toBe('0.65rem');
    });

    test('clicking Bold then Flat/None shadow updates the real shadow token', async ({ page }) => {
        await page.goto('/');
        await openDrawer(page);

        await page.locator('.shadow-btn[data-shadow="bold"]').click();
        let shadow = await page.evaluate(() =>
            getComputedStyle(document.documentElement).getPropertyValue('--lt-shadow-md').trim()
        );
        // theme-studio.ts's bold branch: const s2 = '0 8px 16px rgba(0,0,0,0.15)'. Browsers may
        // re-serialize custom-property whitespace slightly, so compare with whitespace stripped
        // (same defensive approach the pre-existing spec used).
        expect(shadow.replace(/\s+/g, '')).toContain('rgba(0,0,0,0.15)');

        await page.locator('.shadow-btn[data-shadow="none"]').click();
        shadow = await page.evaluate(() =>
            getComputedStyle(document.documentElement).getPropertyValue('--lt-shadow-md').trim()
        );
        expect(shadow).toBe('none');
    });

    test('clicking the Kurdish RTL language button sets real dir="rtl" and lang="ku" on the document', async ({ page }) => {
        await page.goto('/');
        await openDrawer(page);

        await page.locator('.lang-btn[data-lang="ku"][data-dir="rtl"]').click();

        await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
        await expect(page.locator('html')).toHaveAttribute('lang', 'ku');
    });

    test('clicking the Supabase Violet preset theme button sets multiple real tokens together in one click', async ({ page }) => {
        // A real 8th interaction with no separate synthetic-poke precedent in the original suite:
        // preset-theme-btn buttons (real, live in the drawer) each set several of the studio's
        // internal fields at once, then call the same applyTheme() as every individual control
        // above. "Supabase Violet" (data-theme="supabase-violet") is used rather than the plan's
        // suggested "ocean-blue", because ocean-blue's primary/neutral/radius/density values are
        // largely identical to the studio's own defaults (blue is the only real change) - Supabase
        // Violet changes primary (emerald -> violet), radius (0.5rem -> 0.375rem), AND density
        // (normal -> compact) all in the same click, which is a much stronger proof that one real
        // click really does drive multiple independent tokens together.
        await page.goto('/');
        await openDrawer(page);

        const radiusLabel = page.locator('.studio-radius-label');
        await expect(radiusLabel).toHaveText('0.5rem');

        await page.locator('.preset-theme-btn[data-theme="supabase-violet"]').click();

        await expect(page.locator('.studio-primary-label')).toContainText('Violet');
        await expect(radiusLabel).toHaveText('0.375rem');

        const [primary500, radius, fieldPaddingY] = await page.evaluate(() => {
            const cs = getComputedStyle(document.documentElement);
            return [
                cs.getPropertyValue('--p-primary-500').trim(),
                cs.getPropertyValue('--lt-radius').trim(),
                cs.getPropertyValue('--lt-field-padding-y').trim(),
            ];
        });

        // AURA_PALETTES.violet['500'] from design-tokens.ts.
        expect(primary500).toBe('#8b5cf6');
        expect(radius).toBe('0.375rem');
        // Compact density's field-padding-y (theme-studio.ts's applyTheme() compact branch).
        expect(fieldPaddingY).toBe('0.35rem');
    });
});
