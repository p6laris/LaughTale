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

// Two fixed-position, always-rendered, high-z-index FABs sit on every page and can bleed into a
// section's captured bounding box depending on scroll/viewport overlap: the theme-studio drawer's
// own toggle (theme-studio.ts) and the dev-only DevTools overlay's FAB (devtools/overlay.ts,
// class `lt-devtools-fab`, gated on LaughTaleEnvironment.IsDevelopment - confirmed present in the
// `dotnet run` environment both this workflow and local dev use). Since these new variants
// generate fresh baselines anyway, hide both up front rather than rely on them happening not to
// overlap a given section.
const HIDE_THEME_FAB_CSS = '.theme-studio-toggle-btn, .lt-devtools-fab { display: none !important; }';

test.describe('Component visual regression (dark theme, chromium)', () => {
  for (const { id, name } of SECTIONS) {
    test(`${name} matches baseline`, async ({ page }) => {
      // Forcing localStorage['theme']='dark' alone isn't enough: it satisfies the FOUC-prevention
      // script in _Layout.cshtml, but theme-studio.ts's own hydration runs right after and, finding
      // no 'lt-theme' key, falls into its 'system' branch and re-applies prefers-color-scheme
      // unconditionally (theme-studio.ts:930's applyTheme() call, ~line 532-536's system branch) -
      // silently overwriting the FOUC script's correct dark state back to light. Emulating the
      // media query instead makes both mechanisms agree, since neither ever reads a conflicting
      // saved value.
      await page.emulateMedia({ colorScheme: 'dark' });
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
