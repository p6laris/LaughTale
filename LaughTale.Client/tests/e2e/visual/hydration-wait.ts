import type { Page, Locator } from '@playwright/test';

// Kept in sync manually with runtime/hydrator.ts's own ISLAND_SELECTOR - the client bundle isn't
// imported into the Playwright test runtime, so this is a deliberate, small duplication.
const ISLAND_SELECTOR = '[data-island], island, [hydrate], [data-hydrate]';

/** Must be called BEFORE page.goto() - installs the tracking sets before hydrator.ts's own dispatch
 * (on DOMContentLoaded) can race them.
 *
 * Tracks the actual *elements* that hydrated, not just a count: `Components.cshtml`'s ~76 sections
 * are all present in the DOM simultaneously (hidden via `display:none`, toggled by its own
 * `showTabSection()` script - see ROADMAP.v5.md Part C), and `IslandTagHelper.cs`'s `Hydrate`
 * defaults to `HydrateStrategy.Load` (confirmed: only 2 of the ~76 sections override it) - which
 * hydrates immediately regardless of visibility. So *every* section's islands fire
 * `laughtale:hydrated` at roughly the same time after page load, not just the one section under
 * test. A bare "how many events have fired anywhere" counter could satisfy a small per-section
 * threshold purely from *unrelated* sections' islands, resolving before the target section's own
 * islands are actually done - identity tracking (which specific container fired) is what makes this
 * correct regardless of firing order across the page. */
export async function installHydrationListeners(page: Page): Promise<void> {
  await page.addInitScript(() => {
    (window as any).__ltHydratedContainers = new Set<Element>();
    (window as any).__ltErroredContainers = new Set<Element>();
    document.addEventListener('laughtale:hydrated', (e) => {
      (window as any).__ltHydratedContainers.add(e.target as Element);
    }, true);
    document.addEventListener('laughtale:hydration-error', (e) => {
      (window as any).__ltErroredContainers.add(e.target as Element);
    }, true);
  });
}

/** Waits until every island inside `section` whose hydrate strategy isn't 'never' has itself fired
 * laughtale:hydrated or laughtale:hydration-error (runtime/hydrator.ts's own real signal) - checked
 * by element identity, not a page-wide count (see installHydrationListeners' doc comment for why). */
export async function waitForSectionHydrated(page: Page, section: Locator): Promise<void> {
  const sectionId = await section.getAttribute('id');
  await page.waitForFunction(
    ({ selector, id }) => {
      const root = document.getElementById(id!);
      if (!root) return false;
      const islands = Array.from(root.querySelectorAll<HTMLElement>(selector)).filter((el) => {
        const strategy = (el.getAttribute('data-hydrate') || el.getAttribute('hydrate') || 'load').toLowerCase();
        return strategy !== 'never';
      });
      const hydrated: Set<Element> = (window as any).__ltHydratedContainers;
      const errored: Set<Element> = (window as any).__ltErroredContainers;
      return islands.every((el) => hydrated.has(el) || errored.has(el));
    },
    { selector: ISLAND_SELECTOR, id: sectionId },
    { timeout: 10_000 },
  );
}
