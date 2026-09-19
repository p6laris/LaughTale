import { test, expect } from '@playwright/test';
import { installHydrationListeners, waitForSectionHydrated } from './hydration-wait';

// Bounded first-pass slice (8 of ~76 Components.cshtml sections) - see ROADMAP.v5.md Part C for the
// full backlog and the reasoning behind each choice.
const SECTIONS: { id: string; name: string }[] = [
  { id: 'sec-input-text', name: 'input-text' },
  { id: 'sec-select',     name: 'select' },
  { id: 'sec-checkbox',   name: 'checkbox' },
  { id: 'sec-datagrid',   name: 'datatable' },
  { id: 'sec-tree',       name: 'tree' },
  { id: 'sec-popover',    name: 'popover' },
  { id: 'sec-tooltip',    name: 'tooltip' },
  { id: 'sec-dialog',     name: 'dialog' },
];

test.describe('Component visual regression (light theme, chromium)', () => {
  for (const { id, name } of SECTIONS) {
    test(`${name} matches baseline`, async ({ page }) => {
      await installHydrationListeners(page);
      await page.goto(`/components#${id}`);

      const section = page.locator(`#${id}`);
      await expect(section).toBeVisible();
      await waitForSectionHydrated(page, section);

      await expect(section).toHaveScreenshot(`${name}.png`, {
        animations: 'disabled',
      });
    });
  }
});

// The theme-studio drawer's own toggle FAB is `position: fixed`, always rendered, and z-indexed
// above all page content (LaughTale.Client/src/components/theme-studio.ts) - since these new
// variants generate fresh baselines anyway, hide it up front rather than rely on it happening not
// to overlap a given section's captured bounding box.
const HIDE_THEME_FAB_CSS = '.theme-studio-toggle-btn { display: none !important; }';

test.describe('Component visual regression (dark theme, chromium)', () => {
  for (const { id, name } of SECTIONS) {
    test(`${name} matches baseline`, async ({ page }) => {
      // Matches the real FOUC-prevention script in LaughTale.Showcase/Pages/_Layout.cshtml,
      // which reads plain localStorage['theme'] synchronously before first paint. The
      // theme-studio drawer's own persisted 'lt-theme' key is a different mechanism that only
      // takes effect after the drawer island hydrates - too late to avoid a flash/diff here.
      await page.addInitScript(() => localStorage.setItem('theme', 'dark'));
      await installHydrationListeners(page);
      await page.goto(`/components#${id}`);
      await page.addStyleTag({ content: HIDE_THEME_FAB_CSS });

      const section = page.locator(`#${id}`);
      await expect(section).toBeVisible();
      await waitForSectionHydrated(page, section);

      await expect(section).toHaveScreenshot(`${name}-dark.png`, {
        animations: 'disabled',
      });
    });
  }
});

test.describe('Component visual regression (RTL, chromium)', () => {
  for (const { id, name } of SECTIONS) {
    test(`${name} matches baseline`, async ({ page }) => {
      await installHydrationListeners(page);
      // Hits ASP.NET Core's default QueryStringRequestCultureProvider (Program.cs registers 'ku'
      // as a supported RTL culture) - _Layout.cshtml renders dir="rtl"/lang="ku" server-side, so
      // there's no client-side flash to wait out, unlike the drawer's own RTL button.
      await page.goto(`/components?culture=ku&ui-culture=ku#${id}`);
      await page.addStyleTag({ content: HIDE_THEME_FAB_CSS });

      const section = page.locator(`#${id}`);
      await expect(section).toBeVisible();
      await waitForSectionHydrated(page, section);

      await expect(section).toHaveScreenshot(`${name}-rtl.png`, {
        animations: 'disabled',
      });
    });
  }
});
