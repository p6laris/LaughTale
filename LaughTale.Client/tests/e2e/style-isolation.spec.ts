import { test, expect } from '@playwright/test';

// Every component injects its CSS as one page-wide stylesheet when its first island hydrates
// (runtime/styles.ts), so sheets land in hydration order - which varies. If two components both
// define the same UNSCOPED selector (e.g. a bare `.p-paginator-page`) with different values for a
// property, whichever hydrated last wins, and a component's look depends on what else is on the
// page and on timing. That was the cause of the long-running datatable/dataview visual-regression
// flake: DataTable, DataView and Paginator all styled bare `.p-paginator-page`, and DataTable,
// PickList, OrderList and OrgChart all styled bare `.p-checkbox-box`.
//
// Rule: a class may only be styled unscoped by one component. Another component that renders the
// same class must scope its rules under its own root (`.p-datatable .p-paginator-page`).

const THEME_PREFIX = /^(html\.dark|\.dark|\[data-theme="dark"\]|html\[dir="rtl"\]|\[dir="rtl"\])\s+/;

test('no two component stylesheets give an unscoped selector conflicting values', async ({ page }) => {
    await page.goto('/components');

    // The Components page renders every component; wait until their stylesheets stop arriving.
    await page.waitForFunction(() => {
        const w = window as any;
        const count = document.adoptedStyleSheets.length;
        const now = performance.now();
        if (w.__ltSheetCount !== count) { w.__ltSheetCount = count; w.__ltSheetSince = now; return false; }
        return count > 40 && now - w.__ltSheetSince > 1500;
    }, null, { polling: 250, timeout: 30_000 });

    const conflicts = await page.evaluate((themePrefix) => {
        const THEME = new RegExp(themePrefix);
        // Each style rule with its at-rule context (e.g. "@media (max-width: 960px)"), so a component's
        // own responsive overrides aren't mistaken for a clash with its base rules.
        const rulesOf = (sheet: CSSStyleSheet): { rule: CSSStyleRule; context: string }[] => {
            const out: { rule: CSSStyleRule; context: string }[] = [];
            const walk = (rules: CSSRuleList, context: string) => {
                for (const rule of Array.from(rules)) {
                    if ((rule as CSSStyleRule).selectorText !== undefined) out.push({ rule: rule as CSSStyleRule, context });
                    if ((rule as any).cssRules) {
                        const at = rule.cssText.slice(0, rule.cssText.indexOf('{')).trim();
                        walk((rule as any).cssRules, (rule as CSSStyleRule).selectorText !== undefined ? context : `${context}${at} `);
                    }
                }
            };
            walk(sheet.cssRules, '');
            return out;
        };
        const sheets = document.adoptedStyleSheets;
        const label = (index: number) => (rulesOf(sheets[index])[0]?.rule.selectorText ?? '?').split(',')[0].trim();

        // context+selector -> property -> value -> indexes of the sheets that set it
        const seen = new Map<string, Map<string, Map<string, Set<number>>>>();
        sheets.forEach((sheet, index) => {
            for (const { rule, context } of rulesOf(sheet)) {
                for (const part of rule.selectorText.split(',')) {
                    const selector = part.trim();
                    const bare = selector.replace(THEME, '');
                    // Scoped selectors (with a descendant/child/sibling combinator) can't reach other components.
                    if (!bare.startsWith('.') || /[\s>+~]/.test(bare)) continue;
                    const key = `${context}${selector}`;
                    if (!seen.has(key)) seen.set(key, new Map());
                    const props = seen.get(key)!;
                    for (let i = 0; i < rule.style.length; i++) {
                        const prop = rule.style[i];
                        const value = rule.style.getPropertyValue(prop) + rule.style.getPropertyPriority(prop);
                        if (!props.has(prop)) props.set(prop, new Map());
                        const values = props.get(prop)!;
                        if (!values.has(value)) values.set(value, new Set());
                        values.get(value)!.add(index);
                    }
                }
            }
        });

        // Only a clash BETWEEN stylesheets depends on their order; a sheet overriding itself doesn't.
        const found: string[] = [];
        for (const [selector, props] of seen) {
            for (const [prop, values] of props) {
                const involved = new Set([...values.values()].flatMap(set => [...set]));
                if (values.size > 1 && involved.size > 1) {
                    found.push(`${selector} { ${prop} } - ${[...values].map(([v, set]) => `"${v}" from ${[...set].map(label).join(', ')}`).join(' vs ')}`);
                }
            }
        }
        return found;
    }, THEME_PREFIX.source);

    expect(conflicts, 'scope the rule under the component root instead - see the comment at the top of this file').toEqual([]);
});
