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
