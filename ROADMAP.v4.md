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
- **Components must be headless and Studio-editable** (§2.4). This is not a coat of paint
  on the theming work; it is a restructuring of all 76 components, and it dictates the
  single most important scheduling decision in this document (§4.1).

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

**Decided.** Every component gets the lifecycle contract, headless structure, token purity,
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
5. **Headless requires part-targeted CSS** (§2.4). Utility classes baked into generated
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
- **P3 is the single migration pass** across the remaining 70, applying all eight concerns
  at once, verified by gates written in P1.

This is why the codegen phase comes *before* the migration and not after it, and why the
Studio comes after — it has nothing to edit until components are headless.

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

### LT-1001 — Fix stale hashed static web assets · `P0`

`dotnet build` fails: `LaughTale.Showcase` and `LaughTale.Docs` reference
`wwwroot/js/accordion-EMRD2M3I.js`, which no longer exists. The client rebuild produced new
content hashes while the static web asset manifest cached the old ones.

Root cause is not the cache: **content-hashed build outputs are checked into `wwwroot/js`**
(200 files). Hashed filenames and source control are incompatible — every client rebuild
orphans the manifest.

- Remove `wwwroot/js/*` from source control; add to `.gitignore`.
- MSBuild target runs the client build before `DefineStaticWebAssets`, so hashes are
  generated in the same build that consumes them.
- Emit a generated manifest or import map the Razor layer reads, instead of hardcoded
  hashed names in markup.

**Exit gate:** `git clean -xdf && dotnet build LaughTale.slnx` succeeds from scratch.

### LT-1002 — Fix `clearAllIslandStyles` destroying foreign stylesheets · `P0`

`styles.ts:133` sets `document.adoptedStyleSheets = []`, wiping every adopted sheet
including the host app's and the design tokens. Filter against `adoptedSheetMap` as
`removeIslandStyle` already does at `styles.ts:112`.

**Exit gate:** test adopts a foreign sheet, calls `clearAllIslandStyles()`, asserts the
foreign sheet survives and island sheets are gone.

### LT-1003 — Clear the 5 remaining `tsc` errors · `P0`

All in `src/components/accordion.ts`: missing `AccordionProps` export from `../types/models`
plus four implicit-`any` parameters.

**Exit gate:** `npx tsc --noEmit` exits 0.

### LT-1004 — Green-build checkpoint · `P0`

**Exit gate:** `npx tsc --noEmit && npm test && dotnet build LaughTale.slnx && dotnet test`
as one command, exit 0. Tag the commit; it is the baseline every later phase measures from.

---

## 6. LT-11xx — P1: Contracts, harnesses, and 6 reference components

The spine of v4. Every contract is defined and proven here before being applied at scale.

### LT-1101 — Write the leak harness FIRST · `P1`

Before any lifecycle code changes. A happy-dom harness that instruments
`addEventListener`/`removeEventListener`, `IntersectionObserver`, `MutationObserver`,
`ResizeObserver`, timers and `requestAnimationFrame`; mounts a page of islands; navigates
100 times through the router; unmounts; and asserts every counter returns to baseline.

It will fail loudly against today's code. That is the point — it turns "we think we leak"
into a number that must reach zero.

**Exit gate:** harness runs in CI, reports a per-component leak count.

### LT-1102 — Define the island context · `P1`

```ts
export interface IslandContext {
  signal: AbortSignal;          // aborted on unmount — bind every listener to it
  onCleanup(fn: () => void): void;
  container: HTMLElement;
  name: string;
  locale: string;               // LT-1504
  dir: 'ltr' | 'rtl';           // LT-1305
}

export type IslandMount<P> = (
  container: HTMLElement, props: P, ctx: IslandContext
) => void | (() => void) | Promise<void | (() => void)>;
```

The hydrator owns the `AbortController`; `laughtale:unmount` aborts it. Cleanup becomes
**structural** — a component binding listeners to `ctx.signal` cannot leak them even if its
author never thinks about teardown. That is the difference between a convention and a
guarantee, and it is what makes migrating 70 components affordable.

The third parameter is additive, so existing two-arg mounts keep working for one major
version with a dev-build deprecation warning.

**Exit gate:** unit tests for abort-on-unmount, abort-during-async-mount, double-unmount.

### LT-1103 — Stop the router destroying the DOM blindly · `P1`

Replace `document.body.innerHTML = newDoc.body.innerHTML` (`router.ts:282`) with an ordered
swap:

1. Collect mounted islands in the outgoing tree.
2. Dispatch `laughtale:unmount` depth-first (children before parents), awaiting async teardown.
3. Move `[data-persist]` nodes into the incoming tree rather than recreating them.
4. Swap.
5. Hydrate the incoming tree.

Step 2 exists today and does nothing because nothing listens. Persistent islands must
survive by **node identity**, not re-instantiation, or the "audio keeps playing across
navigation" demo is a lie.

**Exit gate:** leak harness at zero for mixed-strategy islands; persist test asserting node
identity survives three navigations.

### LT-1104 — Define the parts + customization contract · `P1`

Per §2.4 items 1–4. Deliverables:

- Part naming convention, plus a per-component manifest of valid part names.
- Passthrough (`pt`) API shape and merge semantics against default classes.
- Override precedence: default skin → theme tokens → Studio per-part overrides → consumer `pt`.
- Authoring guide: one document, one reference implementation, non-negotiable.

Explicitly **not** in scope: separating behavior from presentation into a headless core.
That is deferred to LT-1408.

**Exit gate:** contract documented; `select` implemented against it end to end, with a
Studio-authored per-part override applying correctly.

### LT-1105 — Define the token contract · `P1`

- `--lt-*` semantic layer (`--lt-color-surface-raised`, `--lt-radius-md`) over the existing
  OKLCH ramp.
- `--p-*` retained as aliases for one major version so nothing breaks mid-migration.
- Semantic tokens, not raw palette references, in component CSS — so a Studio theme change
  is coherent rather than 76 independent color decisions.

**Exit gate:** token registry published; contrast gate (existing WCAG engine) runs over the
full token set in CI.

### LT-1106 — Define the CSS pipeline · `P1`

Per-component `.css` files built into: (a) one cached `laughtale.css` covering the critical
path, (b) per-island chunks for lazily-hydrated islands. `injectIslandStyle` demoted to
runtime fallback only. All selectors target `[data-part]`; all values read tokens.

**Exit gate:** `select` ships zero CSS-in-JS; its styles arrive in a cacheable stylesheet.

### LT-1107 — Retrofit 6 reference components, fully · `P1`

`datatable` (virtualization + observers), `datepicker` (locale + overlay), `sidebar` (focus
trap + scroll lock), `toast` (timers + portal), `carousel` (rAF + gestures), `select`
(floating position).

Each gets **all seven concerns at once**: lifecycle, parts, tokens, CSS extraction, RTL
logical properties, i18n, form participation. These are the worked examples the codemods in
P2 are written against.

**Exit gate:** all six pass leak harness, hex gate, RTL snapshot, a11y audit and form
round-trip.

### LT-1108 — Lint rules that keep it done · `P1`

- No `addEventListener` in `src/components/` without `{ signal }`.
- No hex literal in `src/components/`.
- No physical CSS properties (`margin-left`, `padding-right`, `left:`) in component CSS.
- No `mount` without a declared parts manifest.

**Exit gate:** rules run in CI; violations fail the build.

---

## 7. LT-12xx — P2: Codegen & de-bloat

The repo carries a great deal of code that a generator should be writing. This phase is what
makes keeping all 76 components affordable, and it pays for itself inside P3.

### LT-1201 — Generate the TagHelper layer · `P2`

`LaughTale.Components` is 9,975 LOC containing 132 TagHelper classes, 266
`[HtmlTargetElement]` and 733 `[HtmlAttributeName]` properties. Nearly all of it is the same
five mechanical steps: declare properties, set `data-island`, serialize props, handle slot,
emit. `IslandGenerator` already generates per-island TagHelpers — it is simply not used for
the bulk of the library.

Drive every TagHelper from its `[Island]` props record. One record produces the TagHelper,
the TS interface, the registry entry and the serializer context.

Expected: **9,975 LOC → under 3,000**, with the remainder being genuinely custom behavior.

**Exit gate:** `LaughTale.Components` under 3,000 hand-written LOC; showcase renders
identically (snapshot diff clean).

### LT-1202 — Emit real TypeScript declarations · `P2`

`IslandGenerator.GenerateManifestComment` currently emits TS contracts as a **C# string
constant** inside a `.g.cs`. Nothing can consume it; no `.d.ts` ever reaches `tsc`. The
type-safe-boundary claim is unbacked.

Replace with an MSBuild task writing real `.d.ts` into the client project.

**Exit gate:** renaming a C# props property breaks `npx tsc --noEmit`. That failing build
*is* the feature.

### LT-1203 — Generate the island registry · `P2`

Registry entries and lazy loaders are hand-maintained and drift. Generate from the
filesystem plus the `[Island]` attributes.

**Exit gate:** adding a component file requires no hand edit to any registry.

### LT-1204 — Generate AOT-safe serializer contexts · `P2`

Per LT-2002. A `JsonSerializerContext` per island props type, generated alongside the
TagHelper. Solves the AOT gap as a side effect of codegen rather than a separate migration.

**Exit gate:** showcase publishes with `PublishAot=true`.

### LT-1205 — Analyzers that enforce the patterns · `P2`

Generation without enforcement drifts back. New Roslyn diagnostics:

- `SMI005` — hand-written TagHelper where one would be generated.
- `SMI006` — `[Island]` props record with a non-serializable member (extends SMI002).
- `SMI007` — hardcoded color literal in a C# theming path.
- `SMI008` — island props record missing a matching client component.

With code fixes where mechanical.

**Exit gate:** diagnostics ship in the analyzer package with tests; showcase compiles clean.

### LT-1206 — Write the migration codemods · `P2`

Checked into `scripts/codemods/`, each idempotent and re-runnable:

- `hex-to-token.mjs` — 1,913 replacements, semantic-token aware, reports ambiguous cases
  for human review rather than guessing.
- `listeners-to-signal.mjs` — 436 call sites onto `ctx.signal`.
- `css-extract.mjs` — TS template literal → `.css` file plus import.
- `physical-to-logical.mjs` — RTL property conversion.
- `parts-scaffold.mjs` — inserts `data-part` attributes from a per-component manifest.

**Exit gate:** each codemod reproduces the six reference components from LT-1107 byte-for-byte.

### LT-1207 — Consolidate the composables · `P2`

25 composables (1,879 LOC) exist, yet 436 raw listener bindings suggest they are bypassed.
Audit usage, delete duplicates, and make the composables the only sanctioned path for
listeners, observers and timers — all `ctx.signal`-aware.

**Exit gate:** no component binds a listener, observer or timer except through a composable.

---

## 8. LT-13xx — P3: The migration pass

One pass over the remaining 70 components, applying every concern at once (§4.1). Driven by
the LT-1206 codemods, verified by the LT-1101/1108 gates, reviewed in batches of ten.

| Task | Concern | Exit gate |
|---|---|---|
| LT-1301 | Lifecycle: all listeners on `ctx.signal`, mount returns teardown | Leak harness zero across all 76 |
| LT-1303 | Parts: `data-part` on every addressable sub-element | Parts manifest complete; Studio can enumerate them |
| LT-1304 | Tokens: 1,913 hex literals → semantic tokens | Hex-literal count is 0 |
| LT-1305 | CSS extraction + RTL logical properties | 0 CSS-in-JS; RTL snapshot suite green |
| LT-1306 | i18n: `Intl` for every date, number and currency | No manual formatting; locale from `ctx` |
| LT-1307 | Forms: every input posts, binds and validates | Model-binding round-trip test per input |
| LT-1308 | a11y: keyboard, ARIA, focus per component | axe audit clean on all 76 |

**Phase exit gate:** every gate above green simultaneously, in CI, on all 76 components.

> **LT-1302 is deliberately absent.** A full headless split (behavior core separated from
> presentation) was considered for this pass and deferred to LT-1408 per §2.4. It would
> roughly double this phase, and items LT-1303/1304/1403/1405 already deliver the
> customization outcome it was wanted for.

---

## 9. LT-14xx — P4: The Theme Studio, for real

Only reachable once components are headless, parted and token-pure. Before P3 the Studio has
nothing to edit; after P3 it has everything.

- **LT-1401 — Visual part selection.** Click any element in the preview, resolve it to its
  component and `data-part`, show what is styling it.
- **LT-1402 — Token editing with live propagation.** Edit a semantic token, all 76
  components respond. This is the demo that proves the phase.
- **LT-1403 — Per-part overrides.** Edit a specific part's styles; the Studio writes
  passthrough entries or scoped CSS, never hex into a component.
- **LT-1404 — Export.** Emit a real stylesheet plus a C# theme options file the user owns
  and checks in. Round-trips: exported theme re-imports identically.
- **LT-1405 — Eject.** CLI copies a component's source into the consumer's project so they
  own it outright. The shadcn property that makes this a starting point, not a dependency.
- **LT-1406 — SSR the active theme.** Tokens emitted server-side into the document so there
  is no flash of unthemed content; theme survives reload.
- **LT-1407 — Contrast guard.** Existing WCAG engine runs live in the Studio; a theme that
  fails AA is flagged as it is authored.
- **LT-1408 — Headless split: decision point.** `P3` · *deferred by design.* Once the Studio
  ships, gather evidence: are users hitting cases where restyling parts and ejecting are not
  enough, and they genuinely need to replace a component's markup while keeping its state
  machine and ARIA wiring? If yes, scope the behavior/presentation split as its own project
  (a further ~4 weeks across 76 components). If no — the likely outcome — close it as
  `wontfix` and keep the simpler structure. **Do not pre-commit to this.**

**Phase exit gate:** author a complete theme in the Studio, export it, drop it into a fresh
`dotnet new laughtale-web` app, and have all 76 components render in it.

---

## 10. LT-15xx — P5: Forms, antiforgery, validation, server i18n

Client-side form participation lands in LT-1307. This phase is the server half — the part
that makes LaughTale a real ASP.NET Core citizen.

- **LT-1501 — Model binding round-trip.** Every input posts under its `name` and binds to
  the model. Currently 32/76 emit a hidden input and 26/76 wire `name`; the target is 76/76.
- **LT-1502 — Validation display.** `asp-validation-for` integration; server-side
  `ModelState` errors render into the component's `data-part="error"`; client validation
  attributes derive from the same DataAnnotations.
- **LT-1503 — Antiforgery.** Zero references exist today. Wire `RequestVerificationToken`
  through the router, prefetch, htmx directive and fileupload. Any island issuing a
  state-changing request must carry the token.
- **LT-1504 — Culture flow.** Server `CultureInfo` flows into `ctx.locale`; client `Intl`
  formatting agrees with server parsing. Prevents the round-trip class of bug where a date
  or decimal renders one way and parses another.
- **LT-1505 — `IStringLocalizer` for component strings.** Aria labels, "no results",
  month names, pagination text. Ships with English; documented for translators.
- **LT-1506 — Progressive enhancement baseline.** Every component gets a documented no-JS
  behavior, tested with JS disabled. This is the islands promise; today it is undefined.

**Phase exit gate:** a Razor Pages form using 20 different island inputs posts, binds,
validates and re-renders with errors — in `en-US` and in `ckb-IQ` (RTL), with JS enabled
and disabled.

---

## 11. LT-16xx — P6: Honest build & CI

- **LT-1601 — CI.** GitHub Actions running `tsc`, `npm test`, `dotnet build`, `dotnet test`,
  the leak harness, the hex gate, the RTL suite, axe, and the bundle budget. Nothing in this
  document is real without this.
- **LT-1602 — Enforce the bundle budget.** `esbuild.config.mjs` already defines 8 KB gz.
  Wire it to CI so it can fail the build.
- **LT-1603 — Correct the size claims.** `dist/index.js` is 1,050,015 B raw / 202,412 B
  gzip; README claims "sub-2 KB", which refers to a 1,362 B re-export shim. Publish the real
  number for the standalone runtime — **17,656 B gzip** — which is a good number and
  defensible. Either drop the all-components IIFE or rename it `laughtale.full.js` and
  document it as the kitchen sink.
- **LT-1604 — Build-emitted numbers.** The build writes measured sizes into the README so
  they cannot drift from reality again.
- **LT-1605 — Public API lock.** An API surface report checked into the repo so public API
  changes appear in diffs. This is what stops the barrel drifting the way it did.

**Phase exit gate:** every claim in the README is produced by the build, not typed by hand.

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

**Phase exit gate:** on a clean machine with only the .NET SDK,
`dotnet new laughtale-web && dotnet run` produces a working themed app.

---

## 17. LT-22xx — P12: Server-driven island refresh

The differentiator, and currently unbuilt — only hinted at by the htmx directive.

`island.refresh()` re-renders a single island **server-side** and swaps it in place, with no
full navigation: props recomputed from server state, HTML re-rendered by Razor, DOM patched,
hydration state preserved.

Astro structurally cannot do this; it is static-first. ASP.NET Core can, because the whole
pipeline is already there. This is the honest answer to "why not just use Astro," and it is
worth more than any additional component.

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
| LT-1001 | Fix stale hashed static web assets | P0 | todo |
| LT-1002 | Fix `clearAllIslandStyles` destroying foreign sheets | P0 | todo |
| LT-1003 | Clear remaining `tsc` errors | P0 | todo |
| LT-1004 | Green-build checkpoint | P0 | todo |
| LT-1101 | Leak harness (written first) | P1 | todo |
| LT-1102 | Island context + `AbortSignal` contract | P1 | todo |
| LT-1103 | Router ordered swap, no blind `innerHTML` | P1 | todo |
| LT-1104 | Parts + customization contract | P1 | todo |
| LT-1105 | Token contract | P1 | todo |
| LT-1106 | CSS pipeline | P1 | todo |
| LT-1107 | Six reference components, all concerns | P1 | todo |
| LT-1108 | Lint rules | P1 | todo |
| LT-1201 | Generate the TagHelper layer | P2 | todo |
| LT-1202 | Emit real `.d.ts` | P2 | todo |
| LT-1203 | Generate the island registry | P2 | todo |
| LT-1204 | Generate AOT serializer contexts | P2 | todo |
| LT-1205 | Analyzers `SMI005`–`SMI008` | P2 | todo |
| LT-1206 | Migration codemods | P2 | todo |
| LT-1207 | Consolidate composables | P2 | todo |
| LT-1301 | Lifecycle across 70 | P1 | todo |
| LT-1303 | Parts across 70 | P1 | todo |
| LT-1304 | Tokens across 70 | P1 | todo |
| LT-1305 | CSS extraction + RTL across 70 | P1 | todo |
| LT-1306 | i18n across 70 | P1 | todo |
| LT-1307 | Form participation across 70 | P0 | todo |
| LT-1308 | a11y across 70 | P1 | todo |
| LT-1401 | Studio: visual part selection | P1 | todo |
| LT-1402 | Studio: token editing, live | P1 | todo |
| LT-1403 | Studio: per-part overrides | P1 | todo |
| LT-1404 | Studio: export | P1 | todo |
| LT-1405 | Studio: eject | P2 | todo |
| LT-1406 | Studio: SSR the active theme | P1 | todo |
| LT-1407 | Studio: live contrast guard | P2 | todo |
| LT-1408 | Headless split: decision point (deferred) | P3 | todo |
| LT-1501 | Model binding round-trip | P0 | todo |
| LT-1502 | Validation display | P1 | todo |
| LT-1503 | Antiforgery | P0 | todo |
| LT-1504 | Culture flow to client | P1 | todo |
| LT-1505 | `IStringLocalizer` strings | P1 | todo |
| LT-1506 | Progressive enhancement baseline | P1 | todo |
| LT-1601 | CI | P0 | todo |
| LT-1602 | Enforce bundle budget | P1 | todo |
| LT-1603 | Correct the size claims | P1 | todo |
| LT-1604 | Build-emitted README numbers | P2 | todo |
| LT-1605 | Public API lock | P2 | todo |
| LT-1701 | Vue adapter | P2 | todo |
| LT-1702 | React adapter | P2 | todo |
| LT-1703 | Svelte adapter | P2 | todo |
| LT-1704 | Preact adapter | P2 | todo |
| LT-1705 | Adapter showcases | P3 | todo |
| LT-1801 | Expression sandbox re-audit | P0 | todo |
| LT-1802 | CSP end to end | P1 | todo |
| LT-1803 | Slot projection boundary | P1 | todo |
| LT-1804 | Props encoding audit | P1 | todo |
| LT-1806 | Supply chain | P1 | todo |
| LT-1807 | Threat model | P2 | todo |
| LT-1901 | Critical CSS | P2 | todo |
| LT-1902 | Preload above-fold islands | P2 | todo |
| LT-1903 | Streaming SSR verification | P2 | todo |
| LT-1904 | INP budget | P2 | todo |
| LT-1905 | Prefetch tuning | P3 | todo |
| LT-1906 | Observability | P2 | todo |
| LT-2001 | Cash out the type bridge | P1 | todo |
| LT-2002 | AOT and trimming | P1 | todo |
| LT-2003 | Blazor SSR coverage | P2 | todo |
| LT-2004 | Consumer test harness | P2 | todo |
| LT-2101 | `dotnet new` templates | P1 | todo |
| LT-2102 | Publish pipeline | P1 | todo |
| LT-2103 | SemVer and changelog | P2 | todo |
| LT-2104 | Docs | P2 | todo |
| LT-2105 | Error boundaries | P2 | todo |
| LT-2106 | Tailwind preset | P3 | todo |
| LT-2201 | Server island render endpoint | P2 | todo |
| LT-2202 | Client `refresh()` with morphing | P2 | todo |
| LT-2203 | Refresh auth + antiforgery | P1 | todo |
| LT-2204 | Server-paged datatable showcase | P3 | todo |
