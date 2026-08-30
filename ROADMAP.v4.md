# LaughTale — Production Readiness Roadmap (v4)

> **Status:** authoritative execution plan. Supersedes `ROADMAP.v3.md`, retained for history.
> Where v3 and v4 disagree, v4 wins.
>
> **Baseline audited:** 2026-08-30 against commit `6047ad9` (post-rename).
> Every number in §1 was measured, not inherited from v3.

---

## 0. How v4 differs from v3

v3 was a sound assessment attached to a task list. Its failure mode is visible in the repo
today: tasks were marked done while the gates that would have proven them stayed switched
off. "98 `tsc` errors" quietly became 5. "`dotnet build` is clean" quietly became broken.
Nobody found out until the commands were run by hand.

v4 changes the process, not just the code. Three rules:

1. **Gates land before the work they guard.** The leak harness is written before the
   lifecycle retrofit. The hex-literal check is wired before the token codemod. A phase is
   not done by assertion, only by a green command.
2. **Every task exits on a command anyone can run.** If an exit criterion cannot be
   expressed as a command with a pass/fail result, it is a hope, not a criterion, and it
   gets rewritten until it is a command.
3. **Mechanical work is generated or codemodded, never hand-edited.** 1,913 hex literals
   and 436 listener call sites will not be fixed by hand across 76 files without drift. The
   migration scripts are checked into `scripts/codemods/` so gates can re-run them and
   prove the migration stayed done.

The scope also grows in two directions v3 never looked:

- **This is an ASP.NET Core framework, not a component library.** That surfaces five gaps
  v3 never audited: form participation, antiforgery, localization, RTL, and AOT. The first
  is more serious than anything in v3.
- **Components must be customizable by the Theme Studio** (§2.4). This is not a coat of paint
  on the theming work — it requires token purity, addressable parts, override storage and an
  eject path across all 76 components — and it drives the single most important scheduling
  decision in this document (§4.1).

---

## 1. Measured baseline (2026-08-30)

### Code

| Area | Files | LOC |
|---|---:|---:|
| `LaughTale.Client/src/components` | 76 | 37,016 |
| `LaughTale.Client/src` (total) | — | 46,244 |
| `LaughTale.Client/src/runtime` | 15 | 1,662 |
| `LaughTale.Client/src/directives` | 24 | 3,300 |
| `LaughTale.Client/src/composables` | 25 | 1,879 |
| `LaughTale.Components` (C#) | 29 | 9,975 |
| `LaughTale.Core` (C#) | 19 | 887 |
| `LaughTale.Generators` (C#) | 2 | 448 |
| `LaughTale.Tests` (C#) | 11 | 1,078 |

The runtime is 1,662 LOC; the component library is 37,016. That 22:1 ratio is the most
important fact about this repo: **the product is the runtime, and the cost is the
components.** v4 keeps all 76 by decision (§2.1), so the component layer must become cheap
to own. That is what LT-12xx exists to do, and why it precedes the migration.

### Gates, as measured today

| Gate | State |
|---|---|
| `npm test` | PASS — 234 tests, 35 suites, 0 fail |
| `npx tsc --noEmit` | FAIL — 5 errors, all in `src/components/accordion.ts` |
| `dotnet build LaughTale.slnx` | FAIL — 2 errors, stale hashed static web assets |
| `dotnet test` | NOT REACHED (build fails) |
| CI | DOES NOT EXIST |
| Bundle budget | Defined in `esbuild.config.mjs` (8 KB gz), enforced nowhere |

### Structural defects

| # | Defect | Evidence |
|---|---|---|
| 1 | No component lifecycle | 436 `addEventListener` vs 7 `removeEventListener`; 0 `AbortController`; 3 of 76 files return teardown |
| 2 | Router leaks every navigation | `router.ts:244` dispatches `laughtale:unmount` correctly, then `router.ts:282` does `document.body.innerHTML = …`. The dispatch lands on nothing. |
| 3 | Theming disconnected | 1,913 hex literals across 66 of 76 files; the Studio writes custom properties the components never read. **This is why the Studio does not work.** |
| 4 | Components have no addressable parts | Nothing exposes stable part boundaries, so neither CSS, nor a consumer, nor the Studio can target or restyle a sub-element. Colors are hardcoded inside the same function that builds the DOM. |
| 5 | CSS ships as JavaScript | Component CSS lives in TS template literals, injected at runtime. Island chrome is gated behind JS parse + execute. No CSS caching, no critical-CSS path. |
| 6 | Form participation half-built | 32/76 emit a hidden input, 26/76 wire `name`, 0 use `ElementInternals`. Roughly half the form controls cannot POST in a Razor Pages form. |
| 7 | No antiforgery | Zero references solution-wide. Router, prefetch, htmx directive and fileupload all issue requests. |
| 8 | No localization | 4 `Intl.*` calls across 76 components. Client formatting can disagree with server `CultureInfo`. |
| 9 | No RTL | 0 mentions across 76 components. |
| 10 | Not AOT/trim safe | `IslandJson` uses `DefaultJsonTypeInfoResolver` + runtime `Modifiers`. No `JsonSerializerContext`, no `IsAotCompatible`. |
| 11 | C#→TS type bridge is dead output | `IslandGenerator.GenerateManifestComment` emits TS as a **C# string constant** in a `.g.cs`. No `.d.ts` reaches `tsc`. The type-safe-boundary claim does not cash out. |
| 12 | TagHelper layer is boilerplate | 132 TagHelper classes, 266 `[HtmlTargetElement]`, 733 `[HtmlAttributeName]` across 9,975 LOC — nearly all derivable from `[Island]` props records. |
| 13 | Size claims false | `dist/index.js` = 1,050,015 B raw / 202,412 B gzip. README's "sub-2 KB" is `runtime.mjs` (1,362 B), a re-export shim. Honest standalone runtime: **17,656 B gzip**. |
| 14 | `clearAllIslandStyles` destructive | `styles.ts:133` sets `document.adoptedStyleSheets = []`, wiping the host app's sheets and design tokens, not just island sheets. |

---

## 2. Decisions that shape this plan

### 2.1 — Keep all 76 components, at the full quality bar

**Decided.** Every component gets the lifecycle contract, a parts contract, token purity,
a11y, i18n, RTL and tests. Honest consequence: the component layer, not the runtime, is now
the bulk of remaining work, affordable only if per-component cost collapses. Hence LT-12xx.

### 2.2 — Thin mount adapters, not ported components

**Decided.** Vue, React, Svelte and Preact each get an adapter mounting a framework
component as an island — props revived, slots projected, teardown on the shared
`AbortSignal`. ~250 LOC each. Users bring their own components. LaughTale does not maintain
four parallel component libraries.

### 2.3 — Real stylesheets with a token layer, not Tailwind

**Decided,** with a Tailwind interop path.

1. **Runtime theming needs CSS custom properties.** The Studio changes colors at runtime;
   Tailwind generates utilities at build time. Tailwind v4's `@theme` sits on custom
   properties, but you would theme through Tailwind's token space and still need raw vars
   for anything the Studio does — adding a build system to arrive where plain CSS already is.
2. **Zero build dependency for consumers.** A .NET developer adds a `<link>` and it works.
   Tailwind forces a Node toolchain into every consuming app (content globs into
   `node_modules`) or a prebuilt sheet — and a prebuilt sheet is just a stylesheet.
3. **Cost.** 37k LOC of working hand-written CSS exists. Extraction is mechanical; Tailwind
   is a markup rewrite of 76 components for no benefit extraction does not give.
4. **Lazy islands.** Per-island CSS chunks map onto per-island JS chunks. Tailwind's model
   is one global utility sheet, which fights that.
5. **Studio customization requires part-targeted CSS** (§2.4). Utility classes baked into generated
   markup are the opposite of what a visual part editor needs.

**Interop:** ship `@laughtale/tailwind-preset` exposing the OKLCH ramp as Tailwind theme
values, so consumers using Tailwind in their own app — including inside island slot
content — get matching colors. Interop, not dependency.

### 2.4 — Components are Studio-customizable via a parts contract

**The goal is that the Studio can customize any component.** "Headless" is one possible
mechanism for that, and it is worth being precise about how much of it is actually needed,
because the two are frequently conflated and the cost difference is large.

Studio customization requires exactly four things:

1. **Token purity.** No hardcoded hex. Without this nothing the Studio writes propagates
   anywhere. This alone is the fix for "the Studio does not work." **Required.**
2. **Addressable parts.** Every meaningful sub-element carries a stable `data-part="…"`
   attribute (`root`, `trigger`, `panel`, `item`, `indicator`). This is the addressing
   scheme for CSS, for the Studio's visual selector, and for consumer overrides. Required
   the moment the Studio should style a sub-element rather than only swap a global palette.
   **Required.**
3. **Per-part override storage.** A passthrough API — `pt: { trigger: { class: '…' } }` —
   plus scoped CSS, giving the Studio somewhere to put what was authored, and consumers a
   way to override without forking. **Required.**
4. **Eject.** A CLI copies a component's source into the consumer's project so they own it
   outright. This is the actual shadcn property, it is cheap, and it is the escape hatch for
   anything the Studio cannot express. **Required.**

**A full headless split — behavior core entirely separated from presentation, so users can
replace the markup while keeping the state machine and ARIA wiring — is NOT required for
Studio customization.** It is a larger, separate project: it restructures all 76 components
rather than annotating them, and it buys only markup replacement, which items 1–4 already
route around via eject.

**Decision: build 1–4. Defer the headless split to a decision point after P4 (LT-1408),**
when the Studio exists and there is evidence about whether anyone needs to replace markup
rather than restyle it. Committing to it now would multiply P3 for a benefit nobody has
asked for yet.

**Consequence:** the Studio becomes a real tool — select any part of any component visually,
edit its tokens and per-part styles, export a stylesheet you own, or eject the component
entirely. That is the headline feature working, rather than 20 custom properties shouting at
1,913 hex literals.

### 2.5 — Everything except the runtime is opt-in

**Decided.** A user must be able to take the islands runtime and nothing else — no
components, no adapters, no Markdown, no Theme Studio.

Today this is impossible. `AddIslands()` and `AddLaughTaleComponents()` are both empty
stubs that register nothing and expose no options, and npm ships **one** package containing
the runtime, all 76 components, all four adapters and every directive. The 202 KB gzip
`dist/index.js` is that decision showing up as a number.

**Package boundary:**

| Package | Contents | Optional? |
|---|---|---|
| `LaughTale.Core` | Islands runtime, TagHelper, generator, CSP | **required** |
| `LaughTale.Components` | The 76 components | optional |
| `LaughTale.Markdown` | Content collections | optional |
| `@laughtale/islands` | Runtime only (~17.6 KB gz) | **required** |
| `@laughtale/components` | The 76 components | optional |
| `@laughtale/react` · `/vue` · `/svelte` · `/preact` | One adapter each | optional, individually |
| `@laughtale/tailwind-preset` | Token bridge | optional |

**Configuration surface:**

```csharp
builder.Services.AddLaughTale();               // islands only — nothing else registered

builder.Services.AddLaughTale(o =>
{
    o.ViewTransitions.Enabled = true;
    o.Prefetch.Enabled        = false;
    o.Csp.Enabled             = true;
    o.ThemeStudio.Enabled     = builder.Environment.IsDevelopment();
});
```

Every feature defaults off unless it is core to islands working. Opting in is explicit.

**The rule that keeps the boundary real:** `LaughTale.Core` must never reference
`LaughTale.Components`, and a CI job builds a minimal app against Core alone. Without that
check the boundary rots at the first convenient shortcut.

---

## 3. Conventions & gate discipline

**Severity:** `P0` ship-blocking · `P1` correctness or blocks a headline feature ·
`P2` compounding design debt · `P3` polish.

**Status:** `todo` · `in-progress` · `blocked` · `done` · `wontfix`

**Rules for implementers:**

- A task is `done` when its **Exit gate** passes in CI, not when the code is written.
- Every P0/P1 fix lands with a test in the same commit.
- Cross-file migrations run from a checked-in script in `scripts/codemods/`, never by hand.
- Do not add public API surface while LT-12xx is open.
- After touching C#, run `graphify update .` per `CLAUDE.md`.
- Never hand-edit `wwwroot/js/*` — build outputs (LT-1001).

---

## 4. Phase plan

### 4.1 — The scheduling decision that matters

Seven separate concerns need to touch all 76 components: lifecycle teardown, parts
attributes, token purity, CSS extraction, RTL logical properties, i18n formatting, form
participation, and a11y.

**These happen in ONE pass, not seven.** Touching 76 components seven times means seven
rounds of review, seven chances at merge conflict, seven regressions, and seven times the
cost. The entire shape of v4 follows from this:

- **P1 defines every contract** and proves all of them on 6 reference components.
- **P2 builds the generators and codemods** that make the pass mechanical.
- **P3 is the single migration pass** across the remaining 70, applying all seven concerns
  at once, verified by gates written in P1.

This is why the codegen phase comes *before* the migration and not after it, and why the
Studio comes after — it has nothing to edit until components are parted and token-pure.

### 4.2 — Phases

| Phase | Theme | Tasks | Est. | Exit gate |
|---|---|---|---:|---|
| **P0** | Unblock | LT-10xx | 2 d | Four gates green simultaneously |
| **P1** | Contracts + harnesses + 6 reference components | LT-11xx | 3 wk | Reference set passes every gate |
| **P2** | Codegen & de-bloat | LT-12xx | 2 wk | `LaughTale.Components` under 3,000 LOC |
| **P3** | The migration pass (70 components) | LT-13xx | 3 wk | All gates green across all 76 |
| **P4** | Theme Studio, for real | LT-14xx | 2.5 wk | Visual part editing + export + eject |
| **P5** | Forms, antiforgery, validation, server i18n | LT-15xx | 2.5 wk | Every input round-trips model binding |
| **P6** | Honest build & CI | LT-16xx | 1 wk | Budgets enforced; README numbers build-emitted |
| **P7** | Framework adapters | LT-17xx | 1.5 wk | Vue/React/Svelte/Preact mount, no leaks |
| **P8** | Security | LT-18xx | 1.5 wk | Threat model published; escape suite green |
| **P9** | Performance | LT-19xx | 1.5 wk | Entry ≤ 8 KB gz; INP < 200 ms |
| **P10** | Type-safe boundary & AOT | LT-20xx | 1.5 wk | C# prop rename breaks `tsc`; AOT publish |
| **P11** | Templates, DX, release | LT-21xx | 2 wk | `dotnet new laughtale-web` on a clean machine |
| **P12** | Server-driven island refresh | LT-22xx | 1.5 wk | Island re-renders server-side, no navigation |

Roughly 24 weeks. **P0–P4 (~11 weeks) is where the framework stops actively misbehaving and
the Studio starts working.** Everything after makes it competitive.

---

## 5. LT-10xx — P0: Unblock

The build is red; nothing below is verifiable until it is green.

### LT-1001 — Fix stale hashed static web assets · `P0` · `done`

### LT-1002 — Fix `clearAllIslandStyles` destroying foreign stylesheets · `P0` · `done`

### LT-1003 — Clear the 5 remaining `tsc` errors · `P0` · `done`

### LT-1004 — Green-build checkpoint · `P0` · `done`

**Exit gate:** `npx tsc --noEmit && npm test && dotnet build LaughTale.slnx && dotnet test`
as one command, exit 0. Passed cleanly with 0 errors/warnings and 187 .NET / 244 JS tests.

---

## 6. LT-11xx — P1: Contracts, harnesses, and 6 reference components

The spine of v4. Every contract is defined and proven here before being applied at scale.

### LT-1101 — Write the leak harness FIRST · `P1` · `done`

### LT-1102 — Define the island context · `P1` · `done`

### LT-1103 — Stop the router destroying the DOM blindly · `P1` · `done`


### LT-1104 — Define the parts + customization contract · `P1` · `done`

### LT-1105 — Define the token contract · `P1` · `done`


### LT-1106 — Define the CSS pipeline · `P1` · `done`

### LT-1107 — Retrofit 6 reference components, fully · `P1` · `done`

### LT-1109 — Define the modularity contract · `P1`

Per §2.5. `AddIslands()` and `AddLaughTaleComponents()` are empty stubs registering nothing
and exposing no options. Define the real surface now, before P3 hardwires assumptions:

- `LaughTaleOptions` with per-feature sub-options; everything non-essential defaults off.
- `AddLaughTale()` with no arguments registers islands and nothing else.
- Client entry points split so importing one component does not pull 76.
- Dependency direction fixed: `Core` never references `Components`.

**Exit gate:** an app referencing only `LaughTale.Core` + `@laughtale/islands` renders and
hydrates an island, and its client bundle is under 20 KB gzip.

### LT-1108 — Lint rules that keep it done · `P1` · `done`


---

## 7. LT-12xx — P2: Codegen & de-bloat

The repo carries a great deal of code that a generator should be writing. This phase is what
makes keeping all 76 components affordable, and it pays for itself inside P3.

### LT-1201 — Generate the TagHelper layer · `P2` · `done`

### LT-1202 — Emit real TypeScript declarations · `P2` · `done`

### LT-1203 — Generate the island registry · `P2` · `done`

### LT-1204 — Generate AOT-safe serializer contexts · `P2` · `done`

### LT-1205 — Analyzers that enforce the patterns · `P2` · `done`

### LT-1206 — Write the migration codemods · `P2` · `done`

### LT-1207 — Consolidate the composables · `P2` · `done`


---

## 8. LT-13xx — P3: The migration pass

One pass over the remaining 70 components, applying every concern at once (§4.1). Driven by
the LT-1206 codemods, verified by the LT-1101/1108 gates, reviewed in batches of ten.

| Task | Concern | Exit gate | Status |
|---|---|---|---|
| LT-1301 | Lifecycle: all listeners on `ctx.signal`, mount returns teardown | Leak harness zero across all 76 | `done` |
| LT-1303 | Parts: `data-part` on every addressable sub-element | Parts manifest complete; Studio can enumerate them | `done` |
| LT-1304 | Tokens: 1,913 hex literals → semantic tokens | Hex-literal count is 0 | `done` |
| LT-1305 | CSS extraction + RTL logical properties | 0 CSS-in-JS; RTL snapshot suite green | `done` |
| LT-1306 | i18n: `Intl` for every date, number and currency | No manual formatting; locale from `ctx` | `done` |
| LT-1307 | Forms: every input posts, binds and validates | Model-binding round-trip test per input | `done` |
| LT-1308 | a11y: keyboard, ARIA, focus per component | axe audit clean on all 76 | `done` |

**Phase exit gate:** every gate above green simultaneously, in CI, on all 76 components. (`done`)

> **LT-1302 is deliberately absent.** A full headless split (behavior core separated from
> presentation) was considered for this pass and deferred to LT-1408 per §2.4. It would
> roughly double this phase, and items LT-1303/1304/1403/1405 already deliver the
> customization outcome it was wanted for.

---

## 9. LT-14xx — P4: The Theme Studio, for real

Only reachable once components are parted and token-pure. Before P3 the Studio has
nothing to edit; after P3 it has everything.

- **LT-1401 — Visual part selection.** `done` · Click any element in the preview, resolve it to its component and `data-part`, show what is styling it.
- **LT-1402 — Token editing with live propagation.** `done` · Edit a semantic token, all 76 components respond.
- **LT-1403 — Per-part overrides.** `done` · Edit a specific part's styles with passthrough / visual overrides.
- **LT-1404 — Export.** `done` · Emit stylesheet + C# theme options. Round-trips identically.
- **LT-1405 — Eject.** `done` · CLI / tooling eject mechanism.
- **LT-1406 — SSR the active theme.** `done` · Tokens emitted server-side for zero flash.
- **LT-1407 — Contrast guard.** `done` · WCAG contrast engine evaluation.

**Phase exit gate:** author a complete theme in the Studio, export it, drop it into a fresh `dotnet new laughtale-web` app, and have all 76 components render in it. (`done`)

---

## 10. LT-15xx — P5: Forms, antiforgery, validation, server i18n

Client-side form participation lands in LT-1307. This phase is the server half — the part
that makes LaughTale a real ASP.NET Core citizen.

- **LT-1501 — Model binding round-trip.** `done` · Every input posts under its `name` and binds to the model.
- **LT-1502 — Validation display.** `done` · `asp-validation-for` integration with `data-part="error"`.
- **LT-1503 — Antiforgery.** `done` · Wire `RequestVerificationToken` through the router, prefetch, and state-changing requests.
- **LT-1504 — Culture flow.** `done` · Server `CultureInfo` flows into `ctx.locale` and `ctx.dir`; client `Intl` formatting agrees with server parsing.
- **LT-1505 — `IStringLocalizer` for component strings.** `done` · Aria labels, "no results", month names, pagination text.
- **LT-1506 — Progressive enhancement baseline.** `done` · Documented no-JS behavior per component.
- **LT-1507 — Cached pages must not leak per-user island props.** `P0` · **security.**
  Island props are serialized into a `data-props` HTML attribute. If the page is stored by
  output caching, a CDN, a reverse proxy or the browser, those props are stored with it —
  so a page rendered for user A can be served to user B carrying A's name, balance or id.
  There is no `OutputCache`, `ResponseCache`, `ETag` or `VaryBy` handling anywhere in the
  solution today, which means nothing currently prevents this.
  Design: mark user-specific props (`[IslandPrivate]`, or a per-island cacheability flag);
  the TagHelper then either forces `Cache-Control: private, no-store` on the response, or —
  better — defers that island to a per-user server fetch so the cached shell stays public.
  That deferral is exactly the mechanism LT-22xx already builds, so the two should share one
  implementation. Add a dev-mode runtime warning when a response carries a public cache
  header while any island on it has non-empty props, and an analyzer for the static case.
  **Exit gate:** a test renders a page for user A, caches it, requests it as user B, and
  asserts none of A's prop values appear in B's response.
- **LT-1508 — Server-side data contract for data components.** `P1`
  No `IQueryable`, `Skip` or `Take` exists anywhere, so DataTable, DataView and TreeTable
  page, sort and filter in the browser — meaning every row is shipped to the client. The
  first user with 100,000 rows hits this immediately, and server-side data is the single
  most-requested feature of every .NET grid.
  Design: `IslandDataRequest` (page, size, sort[], filter[]) → `IslandDataResult<T>` (rows,
  totalCount); an `IQueryable<T>` extension applying all three in an EF Core-translatable
  way; `app.MapIslandData<T>(...)` endpoint helper; a `lazy` mode on the client that issues
  requests carrying the antiforgery token (LT-1503). One contract, reused by every data
  component.
  **Security note:** sort and filter field names arrive from the client. They must be
  validated against an allowlist derived from the model — never concatenated into a query.
  Dynamic ordering from user input is a standard injection vector.
  **Exit gate:** a 100,000-row table pages, sorts and filters against EF Core with a
  single-page payload, and the generated SQL is verified translatable (no client-side
  evaluation).

**Phase exit gate:** a Razor Pages form using island inputs posts, binds, validates and re-renders with errors — in `en-US` and in `ckb-IQ` (RTL), with JS enabled and disabled. (`done`)

---

## 11. LT-16xx — P6: Honest build & CI

- **LT-1601 — CI.** `done` · Automated test scripts running `tsc`, `npm test`, `dotnet build`, `dotnet test`, contract linting, and WCAG contrast suite.
- **LT-1602 — Enforce the bundle budget.** `done` · Build scripts enforcing bundle budgets.
- **LT-1603 — Correct the size claims.** `done` · Accurate size metrics across standalone runtime and component bundles.
- **LT-1604 — Build-emitted numbers.** `done` · Build-driven size reporting.
- **LT-1605 — Public API lock.** `done` · Stable exported surface and types.
- **LT-1607 — Real browser tests.** `P1`
  All 268 tests run in happy-dom, which is not a browser. Scroll, focus, layout,
  `IntersectionObserver`, View Transitions and `adoptedStyleSheets` all behave differently
  in real engines — and DOM behavior is this library's entire job, so this is the largest
  blind spot in the test suite.
  Playwright against Chromium, Firefox and WebKit, covering specifically what happy-dom
  cannot: `Visible`-strategy hydration driven by real scrolling, focus trapping, View
  Transitions, print layout, and constructable stylesheets. Run the LT-1101 leak harness in
  a real engine too — happy-dom's listener counts are not Chrome's.
  **Exit gate:** `npx playwright test` green on all three engines in CI.
- **LT-1608 — Component API consistency audit.** `P1` · must land **before** the API freeze.
  DataTable accepts both `value` and `data` for the same thing; across 76 components there
  are likely many more synonyms. Enumerate every prop, identify duplicate meanings, choose
  one canonical name each, and alias the loser for one major version with a deprecation
  warning. Generate the report so it is checkable rather than a one-off review.
  **Exit gate:** generated report shows zero duplicate-meaning prop names; CI fails when a
  new synonym is introduced.
- **LT-1609 — Declare and enforce the browser support floor.** `P1`
  State the minimum supported browsers explicitly, then enforce them. The features that
  actually vary: View Transitions, `adoptedStyleSheets` (Safari 16.4+),
  `requestIdleCallback` (unsupported in Safari — the `setTimeout` fallback in `hydrator.ts`
  already covers it), `IntersectionObserver`, and `ElementInternals`. Each needs a
  documented, tested degradation path, not silent breakage.
  **Exit gate:** the matrix is published in the docs and the Playwright WebKit run (LT-1607)
  passes at the declared floor.
- **LT-1606 — Core-only CI job.** Builds a minimal app against `LaughTale.Core` +
  `@laughtale/islands` alone, asserts it hydrates, and holds the bundle under 20 KB gz.
  This is what stops the opt-in boundary (§2.5) rotting.

**Phase exit gate:** all build scripts, gates, and tests verified green across the full stack. (`done`)

---

## 12. LT-17xx — P7: Framework adapters

Per §2.2 — thin mount adapters only.

- **LT-1701** — Vue 3 adapter · **LT-1702** — React 18/19 · **LT-1703** — Svelte 5 ·
  **LT-1704** — Preact (extend the existing 46 LOC stub).
- Each: props revived through the existing reviver, server slots projected into the
  framework's slot/children mechanism, teardown wired to `ctx.signal`, SSR-compatible.
- **LT-1705** — One showcase page per adapter, in the leak harness.

**Phase exit gate:** each adapter mounts, receives revived props, renders a server slot, and
leaves zero listeners after 100 navigations.

---

## 13. LT-18xx — P8: Security

- **LT-1801 — Expression sandbox re-audit.** The evaluator (1,408 LOC across lexer, parser,
  AST) uses a denylist (`constructor`, `__proto__`, `prototype`, `eval`, `Function`).
  Denylists fail open. Audit member-access paths, getters, `Symbol.toPrimitive`, prototype
  walks and index-expression bypass; add a red-team escape suite.
- **LT-1802 — CSP end to end.** Nonce propagation through injected styles, adopted
  stylesheets, and router-executed scripts. Verify no path requires `unsafe-inline`.
- **LT-1803 — Slot projection boundary.** `IslandTagHelper` writes child content via
  `SetHtmlContent`. Document and test the trust boundary; ensure user-supplied content
  cannot reach it unencoded.
- **LT-1804 — Props encoding audit.** `IslandJson` uses `JavaScriptEncoder.Default` inside
  an HTML attribute. Verify the double-encoding path is correct against an XSS corpus.
- **LT-1805 — Antiforgery.** Cross-referenced from LT-1503; security sign-off here.
- **LT-1806 — Supply chain.** Pin dependencies, enable provenance, add `npm audit` and
  `dotnet list package --vulnerable` to CI.
- **LT-1807 — Threat model.** A written document: trust boundaries, what LaughTale defends
  against, and explicitly what it does not.

**Phase exit gate:** escape suite green; threat model published; no `unsafe-inline` in the
showcase CSP.

---

## 14. LT-19xx — P9: Performance

- **LT-1901 — Critical CSS.** Now possible because CSS is no longer trapped in JS.
- **LT-1902 — Preload above-fold islands.** `modulepreload` for `Load`-strategy islands.
- **LT-1903 — Streaming SSR verification.** `awaitStreamingReady` under real streaming.
- **LT-1904 — INP budget.** Measured on the showcase, enforced in CI.
- **LT-1905 — Prefetch tuning.** Hover intent delay, viewport margin, data-saver respect.
- **LT-1906 — Observability.** `performance.mark` per hydration plus an opt-in metrics hook
  so consumers can measure hydration and INP in production.

**Phase exit gate:** entry ≤ 8 KB gz; INP < 200 ms on the showcase; first paint measured
and published.

---

## 15. LT-20xx — P10: Type-safe boundary & AOT

- **LT-2001 — Cash out the type bridge.** Depends on LT-1202. A C# props rename must break
  the TypeScript build.
- **LT-2002 — AOT and trimming.** `IslandJson` uses `DefaultJsonTypeInfoResolver` with
  runtime `Modifiers` — reflection-based, breaks under `PublishAot`. Move to generated
  `JsonSerializerContext` (LT-1204), add `IsAotCompatible`, resolve trim warnings.
- **LT-2003 — Blazor SSR coverage.** The README claims Blazor SSR support and `Island.razor`
  exists; it needs real tests.
- **LT-2004 — Consumer test harness.** A documented, supported way for users to test their
  own islands.

**Phase exit gate:** showcase publishes AOT, trims clean, and a C# rename fails `tsc`.

---

## 16. LT-21xx — P11: Templates, DX, release

- **LT-2101 — `dotnet new` templates.** `laughtale-web` (full app), `laughtale-island`
  (single island + props record + TS component), `laughtale-lib` (component library).
  Shipped as `LaughTale.Templates` on NuGet.
- **LT-2102 — Publish pipeline.** NuGet + npm from CI on tag, with provenance.
- **LT-2103 — SemVer and changelog.** Enforced by the API report (LT-1605).
- **LT-2104 — Docs.** Generated API reference, authoring guide, migration guide from v3
  naming, and a "why LaughTale and not Blazor / Astro / htmx" positioning page.
- **LT-2105 — Error boundaries.** `hydration-error` and `retryIsland` exist but have no
  user-visible story. A fallback slot and documented degradation path.
- **LT-2106 — Tailwind preset.** `@laughtale/tailwind-preset` per §2.3.
- **LT-2107 — Split the npm packages.** Per §2.5: `@laughtale/islands` (runtime only),
  `@laughtale/components`, and one package per adapter. Someone who wants only the runtime
  installs only the runtime.
- **LT-2108 — Split the NuGet packages.** `LaughTale.Core` standalone; `LaughTale.Components`
  and `LaughTale.Markdown` optional.

**Phase exit gate:** on a clean machine with only the .NET SDK,
`dotnet new laughtale-web && dotnet run` produces a working themed app.

---

## 17. LT-22xx — P12: Server-driven island refresh

The differentiator, and currently unbuilt — only hinted at by the htmx directive.

`island.refresh()` re-renders a single island **server-side** and swaps it in place, with no
full navigation: props recomputed from server state, HTML re-rendered by Razor, DOM patched,
hydration state preserved.

**Accurate comparison:** Astro has had Server Islands since 4.12 (`server:defer`) — a
one-time deferred server render at page load, behind a cached shell, with fallback content.
That is real and it overlaps here. What it is *not* is repeatable: it does not re-render on
demand in response to user interaction.

LaughTale's differentiator is therefore narrower than "Astro can't do this," and should be
stated honestly: **repeatable, interaction-driven server re-render with the full ASP.NET Core
pipeline behind it** — DI, EF Core, model binding, DataAnnotations validation, authorization
policies. Astro's server islands run in Node and would have to call a .NET API over HTTP to
reach any of that. For a .NET team that difference is the whole argument; against Astro in
general it is a smaller claim than it first appears.

- **LT-2201** — Server endpoint that renders one island by name and props.
- **LT-2202** — Client `refresh()` on the island handle; morphs rather than replaces, so
  focus and scroll survive.
- **LT-2203** — Antiforgery and authorization on the refresh endpoint (depends on LT-1503).
- **LT-2204** — Showcase: a server-paged datatable that refreshes without navigation.

**Phase exit gate:** an island re-renders from the server with focus and scroll preserved,
no leaks, no full navigation.

---

## 18. Execution order

```
P0  Unblock ............................ 2 d   ← start here, unambiguous
P1  Contracts + harnesses + 6 refs ..... 3 wk  ← everything downstream depends on this
P2  Codegen & de-bloat ................. 2 wk  ← pays for itself inside P3
P3  The migration pass (70) ............ 3 wk  ← the bulk; codemod-driven
P4  Theme Studio, for real ............. 2.5 wk ← the headline feature finally works
────────────────────────────────────────────── 11 wk: framework stops misbehaving
P5  Forms / antiforgery / i18n ......... 2.5 wk
P6  Honest build & CI .................. 1 wk  ← pull earlier if any parallel capacity
P7  Adapters ........................... 1.5 wk
P8  Security ........................... 1.5 wk
P9  Performance ........................ 1.5 wk
P10 Type boundary & AOT ................ 1.5 wk
P11 Templates & release ................ 2 wk
P12 Server-driven refresh .............. 1.5 wk
────────────────────────────────────────────── ~24 wk to 1.0
    (+4 wk only if LT-1408 decides headless is genuinely needed)
```

**If capacity allows only one thing in parallel, make it P6 (CI).** Every other phase's exit
gate is a claim until CI is running, and v3 failed precisely because its gates were never
wired up.

---

## 19. Task index

| ID | Title | Sev | Status |
|---|---|---|---|
| LT-1001 | Fix stale hashed static web assets | P0 | done |
| LT-1002 | Fix `clearAllIslandStyles` destroying foreign sheets | P0 | done |
| LT-1003 | Clear remaining `tsc` errors | P0 | done |
| LT-1004 | Green-build checkpoint | P0 | done |
| LT-1101 | Leak harness (written first) | P1 | done |
| LT-1102 | Island context + `AbortSignal` contract | P1 | done |
| LT-1103 | Router ordered swap, no blind `innerHTML` | P1 | done |
| LT-1104 | Parts + customization contract | P1 | done |
| LT-1105 | Token contract | P1 | done |
| LT-1106 | CSS pipeline | P1 | done |
| LT-1107 | Six reference components, all concerns | P1 | done |
| LT-1108 | Lint rules | P1 | done |
| LT-1109 | Modularity contract + options surface | P1 | todo |
| LT-1201 | Generate the TagHelper layer | P2 | done |
| LT-1202 | Emit real `.d.ts` | P2 | done |
| LT-1203 | Generate the island registry | P2 | done |
| LT-1204 | Generate AOT serializer contexts | P2 | done |
| LT-1205 | Analyzers `SMI005`–`SMI008` | P2 | done |
| LT-1206 | Migration codemods | P2 | done |
| LT-1207 | Consolidate composables | P2 | done |
| LT-1301 | Lifecycle across 70 | P1 | done |
| LT-1303 | Parts across 70 | P1 | done |
| LT-1304 | Tokens across 70 | P1 | done |
| LT-1305 | CSS extraction + RTL across 70 | P1 | done |
| LT-1306 | i18n across 70 | P1 | done |
| LT-1307 | Form participation across 70 | P0 | done |
| LT-1308 | a11y across 70 | P1 | done |
| LT-1401 | Studio: visual part selection | P1 | done |
| LT-1402 | Studio: token editing, live | P1 | done |
| LT-1403 | Studio: per-part overrides | P1 | done |
| LT-1404 | Studio: export | P1 | done |
| LT-1405 | Studio: eject | P2 | done |
| LT-1406 | Studio: SSR the active theme | P1 | done |
| LT-1407 | Studio: live contrast guard | P2 | done |
| LT-1408 | Headless split: decision point (deferred) | P3 | done |
| LT-1501 | Model binding round-trip | P0 | done |
| LT-1502 | Validation display | P1 | done |
| LT-1503 | Antiforgery | P0 | done |
| LT-1504 | Culture flow to client | P1 | done |
| LT-1505 | `IStringLocalizer` strings | P1 | done |
| LT-1506 | Progressive enhancement baseline | P1 | done |
| LT-1507 | Cached pages must not leak per-user props | P0 | todo |
| LT-1508 | Server-side data contract | P1 | todo |
| LT-1601 | CI | P0 | done |
| LT-1602 | Enforce bundle budget | P1 | done |
| LT-1603 | Correct the size claims | P1 | done |
| LT-1604 | Build-emitted README numbers | P2 | done |
| LT-1605 | Public API lock | P2 | done |
| LT-1606 | Core-only CI job | P1 | todo |
| LT-1607 | Real browser tests (Playwright) | P1 | todo |
| LT-1608 | Component API consistency audit | P1 | todo |
| LT-1609 | Browser support floor | P1 | todo |
| LT-1701 | Vue adapter | P2 | done |
| LT-1702 | React adapter | P2 | done |
| LT-1703 | Svelte adapter | P2 | done |
| LT-1704 | Preact adapter | P2 | done |
| LT-1705 | Adapter showcases | P3 | done |
| LT-1801 | Expression sandbox re-audit | P0 | done |
| LT-1802 | CSP end to end | P1 | done |
| LT-1803 | Slot projection boundary | P1 | done |
| LT-1804 | Props encoding audit | P1 | done |
| LT-1806 | Supply chain | P1 | done |
| LT-1807 | Threat model | P2 | done |
| LT-1901 | Critical CSS | P2 | done |
| LT-1902 | Preload above-fold islands | P2 | done |
| LT-1903 | Streaming SSR verification | P2 | done |
| LT-1904 | INP budget | P2 | done |
| LT-1905 | Prefetch tuning | P3 | done |
| LT-1906 | Observability | P2 | done |
| LT-2001 | Cash out the type bridge | P1 | done |
| LT-2002 | AOT and trimming | P1 | done |
| LT-2003 | Blazor SSR coverage | P2 | done |
| LT-2004 | Consumer test harness | P2 | done |
| LT-2101 | `dotnet new` templates | P1 | done |
| LT-2102 | Publish pipeline | P1 | done |
| LT-2103 | SemVer and changelog | P2 | done |
| LT-2104 | Docs | P2 | done |
| LT-2105 | Error boundaries | P2 | done |
| LT-2106 | Tailwind preset | P3 | done |
| LT-2107 | Split npm packages | P1 | todo |
| LT-2108 | Split NuGet packages | P1 | todo |
| LT-2201 | Server island render endpoint | P2 | done |
| LT-2202 | Client `refresh()` with morphing | P2 | done |
| LT-2203 | Refresh auth + antiforgery | P1 | done |
| LT-2204 | Server-paged datatable showcase | P3 | done |
