import { test, expect } from '@playwright/test';
import { installHydrationListeners, waitForSectionHydrated } from './hydration-wait';

// Original representative first-pass slice - also the only sections with dark/RTL coverage below
// (see ROADMAP.v5.md Part C for the reasoning behind each choice).
const CORE_SECTIONS: { id: string; name: string }[] = [
  { id: 'sec-input-text', name: 'input-text' },
  { id: 'sec-select',     name: 'select' },
  { id: 'sec-checkbox',   name: 'checkbox' },
  { id: 'sec-datagrid',   name: 'datatable' },
  { id: 'sec-tree',       name: 'tree' },
  { id: 'sec-popover',    name: 'popover' },
  { id: 'sec-tooltip',    name: 'tooltip' },
  { id: 'sec-dialog',     name: 'dialog' },
];

// The remaining 68 of ~76 Components.cshtml sections, light theme only - closing the "named
// fast-follow, not silently dropped" backlog item from the original pass. Each screenshots its
// default, closed/idle state (no click-choreography to open overlays), same v1 scope boundary as
// CORE_SECTIONS' Dialog/Popover/Tooltip.
const REMAINING_SECTIONS: { id: string; name: string }[] = [
  { id: 'sec-floatlabel',      name: 'floatlabel' },
  { id: 'sec-iftalabel',       name: 'iftalabel' },
  { id: 'sec-label',           name: 'label' },
  { id: 'sec-inputgroup',      name: 'inputgroup' },
  { id: 'sec-textarea',        name: 'textarea' },
  { id: 'sec-input-number',    name: 'input-number' },
  { id: 'sec-input-otp',       name: 'input-otp' },
  { id: 'sec-input-password',  name: 'input-password' },
  { id: 'sec-input-mask',      name: 'input-mask' },
  { id: 'sec-inputtags',       name: 'inputtags' },
  { id: 'sec-datepicker',      name: 'datepicker' },
  { id: 'sec-autocomplete',    name: 'autocomplete' },
  { id: 'sec-multiselect',     name: 'multiselect' },
  { id: 'sec-cascadeselect',   name: 'cascadeselect' },
  { id: 'sec-treetable',       name: 'treetable' },
  { id: 'sec-treeselect',      name: 'treeselect' },
  { id: 'sec-radio',           name: 'radio' },
  { id: 'sec-toggle-button',   name: 'toggle-button' },
  { id: 'sec-toggle-switch',   name: 'toggle-switch' },
  { id: 'sec-slider',          name: 'slider' },
  { id: 'sec-rating',          name: 'rating' },
  { id: 'sec-select-button',   name: 'select-button' },
  { id: 'sec-color-picker',    name: 'color-picker' },
  { id: 'sec-knob',            name: 'knob' },
  { id: 'sec-dataview',        name: 'dataview' },
  { id: 'sec-paginator',       name: 'paginator' },
  { id: 'sec-splitter',        name: 'splitter' },
  { id: 'sec-listbox',         name: 'listbox' },
  { id: 'sec-picklist',        name: 'picklist' },
  { id: 'sec-orderlist',       name: 'orderlist' },
  { id: 'sec-orgchart',        name: 'orgchart' },
  { id: 'sec-card',            name: 'card' },
  { id: 'sec-divider',         name: 'divider' },
  { id: 'sec-fieldset',        name: 'fieldset' },
  { id: 'sec-panel',           name: 'panel' },
  { id: 'sec-scrollarea',      name: 'scrollarea' },
  { id: 'sec-accordion',       name: 'accordion' },
  { id: 'sec-tabs',            name: 'tabs' },
  { id: 'sec-toolbar',         name: 'toolbar' },
  { id: 'sec-timeline',        name: 'timeline' },
  { id: 'sec-menu',            name: 'menu' },
  { id: 'sec-menubar',         name: 'menubar' },
  { id: 'sec-context-menu',    name: 'context-menu' },
  { id: 'sec-tieredmenu',      name: 'tieredmenu' },
  { id: 'sec-breadcrumb',      name: 'breadcrumb' },
  { id: 'sec-sidebar',         name: 'sidebar' },
  { id: 'sec-stepper',         name: 'stepper' },
  { id: 'sec-speed-dial',      name: 'speed-dial' },
  { id: 'sec-scroll-top',      name: 'scroll-top' },
  { id: 'sec-command-palette', name: 'command-palette' },
  { id: 'sec-drawer',          name: 'drawer' },
  { id: 'sec-confirm-dialog',  name: 'confirm-dialog' },
  { id: 'sec-confirm-popup',   name: 'confirm-popup' },
  { id: 'sec-message',         name: 'message' },
  { id: 'sec-toast',           name: 'toast' },
  { id: 'sec-blockui',         name: 'blockui' },
  { id: 'sec-progress-bar',    name: 'progress-bar' },
  { id: 'sec-skeleton',        name: 'skeleton' },
  { id: 'sec-meter-group',     name: 'meter-group' },
  { id: 'sec-avatar-group',    name: 'avatar-group' },
  { id: 'sec-tag',             name: 'tag' },
  { id: 'sec-inplace',         name: 'inplace' },
  { id: 'sec-galleria',        name: 'galleria' },
  { id: 'sec-carousel',        name: 'carousel' },
  { id: 'sec-fileupload',      name: 'fileupload' },
  { id: 'sec-image-compare',   name: 'image-compare' },
  { id: 'sec-button',          name: 'button' },
  { id: 'sec-split-button',    name: 'split-button' },
];

// Several elements sit at a fixed screen position (via CSS `position: fixed` or `sticky` relative
// to the whole-page scroll, not the target section) and can bleed into a section's captured
// screenshot: the theme-studio drawer's own toggle FAB (theme-studio.ts), the dev-only DevTools
// overlay's FAB (devtools/overlay.ts, class `lt-devtools-fab`, gated on
// LaughTaleEnvironment.IsDevelopment - confirmed present in the `dotnet run` environment this
// workflow and local dev both use), and _Layout.cshtml's own `.app-header`
// (`position: sticky; top: 0`, confirmed live: for any section taller than one viewport,
// Playwright's own screenshot mechanism has to scroll/resize to capture the whole element, and the
// sticky header re-renders at each scroll increment it passes through, bleeding a breadcrumb/
// telemetry bar into the middle of an otherwise-unrelated section's screenshot). Hidden up front
// for every variant, including light - the header bleed isn't theme-specific.
const HIDE_APP_CHROME_CSS = '.theme-studio-toggle-btn, .lt-devtools-fab, .app-header { display: none !important; }';

test.describe('Component visual regression (light theme, chromium)', () => {
  for (const { id, name } of [...CORE_SECTIONS, ...REMAINING_SECTIONS]) {
    test(`${name} matches baseline`, async ({ page }) => {
      await installHydrationListeners(page);
      await page.goto(`/components#${id}`);
      await page.addStyleTag({ content: HIDE_APP_CHROME_CSS });

      const section = page.locator(`#${id}`);
      await expect(section).toBeVisible();
      await waitForSectionHydrated(page, section);

      await expect(section).toHaveScreenshot(`${name}.png`, {
        animations: 'disabled',
      });
    });
  }
});

test.describe('Component visual regression (dark theme, chromium)', () => {
  for (const { id, name } of CORE_SECTIONS) {
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
      await page.addStyleTag({ content: HIDE_APP_CHROME_CSS });

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
  for (const { id, name } of CORE_SECTIONS) {
    test(`${name} matches baseline`, async ({ page }) => {
      await installHydrationListeners(page);
      // Hits ASP.NET Core's default QueryStringRequestCultureProvider (Program.cs registers 'ku'
      // as a supported RTL culture) - _Layout.cshtml renders dir="rtl"/lang="ku" server-side, so
      // there's no client-side flash to wait out, unlike the drawer's own RTL button.
      await page.goto(`/components?culture=ku&ui-culture=ku#${id}`);
      await page.addStyleTag({ content: HIDE_APP_CHROME_CSS });

      const section = page.locator(`#${id}`);
      await expect(section).toBeVisible();
      await waitForSectionHydrated(page, section);

      await expect(section).toHaveScreenshot(`${name}-rtl.png`, {
        animations: 'disabled',
      });
    });
  }
});
