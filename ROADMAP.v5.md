# LaughTale Roadmap v5 — Making It Real

**Created**: 2026-09-02
**Audited against**: commit `a49a996` (branch `comp`)
**Status**: Strategy of record. Execution steps live in the Spec Kit features under `specs/`.

Everything between here and a framework people choose on purpose: the compiler, components,
adapters, directives, security, performance, auth, plugins — plus the ideas worth taking from
Astro, Nuxt, Next, Fresh and Qwik.

One theme runs through all of it: **the hard parts are already written and not yet connected** —
and in three places that gap is a shipped bug rather than a missing feature.

---

## 0. The read

> **LaughTale is a strong runtime, a large component library, and a well-stocked toolbox — wired
> together at maybe forty percent.**

The audit found the same pattern in three separate layers. A capability gets built to a high
standard, and the thing meant to consume it never adopts it.

| Built | Adoption |
|---|---|
| `useVirtualizer` | **6 / 76** components (Spec 043, 100% of long collections) |
| `useFloatingPosition` | **14 / 76** (Spec 043, 100% of floating overlays) |
| `useKeyboardNav` | **7 / 76** (Spec 042) |
| `useDataSource` | **0 / 76** |
| `useHotkeys` | **0 / 76** |
| `useFocusTrap` | **7 / 7 modals** (Spec 042, 100% of modals) |
| `IslandModule.createHandle` | **0** implementations |
| `runtime/events.ts` | **41 / 41** dispatching components (Spec 044, 100% adoption) |
| `sanitizeHtml` / `sanitizeUrl` (333 lines) | **4 / 76** |
| `ILaughTaleLocalizer` + locale dictionaries (1,509 lines) | **82 / 82 TagHelpers** — **[CLOSED, Part N]** vocabulary moved to `LaughTale.Components`, all 31 hardcoded English defaults and 13 client-template strings now routed through it; see below |
| `useLocale` | **17 / 76** (was 5; `datatable`/`datepicker`/`select` plus 14 newly-wired components) |
| `BuildSsrHtml()` / `data-lt-ssr` (feature 026) | **29 / 29** in-scope form controls (Spec 045, eighth built-and-unadopted module now adopted) |
| `JsonSerializerContext` (source-generated JSON) | **0** — every island serializes by reflection |

Mostly this is good news — a large share of this roadmap is **adoption, not invention**. But the
pattern has a sharp edge: a 333-line HTML sanitizer that no component calls isn't an unfinished
feature, it's an open vulnerability.

### The root cause nobody named — **[CLOSED, TagHelper split]**

The three tables above shared one mechanism, and it was not "people forgot to adopt things".

`IslandTagHelperBase` is where the good server-side behaviour lives: the `BuildSsrHtml()` hook, the
`ILaughTaleLocalizer` lookup, the RTL decision, the `data-lt-ssr` stamp. **Fifteen TagHelpers extended
it.** The other **81 were generated** by `IslandGenerator`, which emitted `public partial class
<Name>TagHelper : TagHelper` — deriving straight from `TagHelper` and inheriting none of it.

So `<island-dialog>` (hand-written) localized and could server-render. `<island-input-text>`,
`<island-select>`, `<island-datatable>` (generated) could not — not because anyone decided they
shouldn't, but because they were on the other side of a class hierarchy split nobody wrote down.
Every capability hung on that base class reached 15 of 96 call sites and looked "built but unadopted"
from the outside.

**Fixed.** `IslandGenerator.GenerateTagHelper` now emits `public partial class <Name>TagHelper :
LaughTale.Components.TagHelpers.IslandTagHelperBase`, overrides `IslandName`/`BuildProps()`/
`BuildSsrHtml()` instead of re-declaring auth, attribute-stamping and field-rendering logic, and
independently discovered along the way: 14 of the 15 hand-written island names (every one except
`message`) also had a matching `[Island("...")]` props record, so `IslandGenerator` was *also*
emitting a second TagHelper targeting the identical `[HtmlTargetElement]` tags — two independent
TagHelpers writing into the same `TagHelperOutput` for `<island-dialog>`, `<island-breadcrumb>`,
`<island-menu>` and 11 others. The generator now skips codegen for those 14 names entirely
(`IslandGenerator.HandWrittenIslandNames`) instead of shadowing the hand-written class.

*Measured result*: of the 81 `[Island(...)]` props records in `LaughTale.Components/Models/
ComponentModels.cs`, 14 are skipped as redundant with a hand-written class, leaving **67 generated
TagHelpers**, all deriving from `IslandTagHelperBase`. Together with the **15** hand-written
TagHelpers (unchanged), **82 of 82** TagHelpers now reach the base class — up from 15 of 96 (96 was
81 generated + 15 hand-written, before the 14 duplicates were known about and removed).
`LaughTale.Tests/Architecture/GeneratedTagHelperHierarchyTests.cs` now asserts this by reflecting over
the compiled assembly, not by trusting the count.

There is a second boundary problem with the same signature, and the same reason nobody caught it
originally: Core's locale dictionary carries 70 component-specific properties (Part N — still open,
not addressed by this fix). Both inversions sat in code the test suite reported as clean, because
`CoreOnlyBoundaryTests` checks assembly references and, before this fix, nothing checked class
hierarchies at all. **The architecture was guarded in one dimension and unguarded in the two that had
actually failed.** The TagHelper-split dimension is now guarded by
`GeneratedTagHelperHierarchyTests`; the Core locale-dictionary dimension (Part N) still has no such
guard.

### The strategic fork

LaughTale today is **the best server-driven UI framework ASP.NET Core doesn't know it has**, and it
is **not yet a meta-framework**. In Astro, Nuxt and Fresh, *your* components are the framework's
input: it compiles them, renders them to HTML on the server, splits them into per-island chunks, and
hydrates them. In LaughTale the input is fixed — 76 built-in components and a runtime to mount them.

Two findings define this:

1. **The adapters don't server-render.** `createReactIsland` calls `hydrateRoot` only
   `if (container.hasChildNodes())`, but nothing on the server ever renders React to HTML — no Node
   SSR host, no Jint, no ClearScript anywhere in `LaughTale.Core`. A React island ships as an empty
   div plus JSON props and paints on the client. That's `client:only` in Astro's vocabulary, which
   Astro treats as the escape hatch, not the default.
2. **There is no island build pipeline.** `esbuild.config.mjs` has two hardcoded entry points and
   builds *LaughTale's own* bundle. Nothing scans a user's `Islands/` directory. `FRAMEWORK_FEATURES.md`
   lists this as Feature 5, still proposed.

**Path A — own the .NET server-driven niche.** Be Hotwire + PrimeVue for ASP.NET Core. Nobody good is
doing this. Blazor Server needs a SignalR circuit; Blazor WASM ships a runtime. You are stateless HTTP
with a 38 KB core and 76 components. ~6 months to excellent.

**Path B — build the meta-framework.** Island compiler, framework SSR, plugin API, devtools. ~2 years,
competing with Astro on Astro's turf while it has the JS ecosystem and you have .NET.

**Recommendation: A, then B as a plugin.** Get the plugin API and island pipeline right and framework
SSR becomes something you *install*, not something you rewrite core for.

---

## 1. URGENT — three shipped bugs that outrank this roadmap [ALL CLOSED]

> **Status (2026-09-03)**: All three urgent shipped bugs are now fully **CLOSED**:
> - **§1.1**: Closed in Spec 039 (`039-zero-sink-architecture`, tagged template migration).
> - **§1.3**: Closed in Spec 040 (`040-teardown-lifecycle`, teardown and signal bindings).
> - **§1.2**: Closed in Spec 041 (`041-deny-by-default-authorization`, deny-by-default inversion).

These were defects in code that shipped previously. The mitigations existed in the codebase; the components
and callers now strictly enforce them.

### 1.1 Component rendering bypasses your own HTML sanitizer [CLOSED — Spec 039]

`directives/security.ts` provides `sanitizeHtml()` with strict allowlists, `sanitizeUrl()` guarding
`javascript:` and `vbscript:`, and `isSafeAttribute()`. **Of the 68 components that build markup with
`innerHTML`, only 4 reference any escaping helper.**

Props interpolate raw into markup and into attribute positions:

```ts
// message.ts:497
iconContent = `<img src="${p.avatar}" alt="Avatar" ... />`;
// message.ts:513
`... ${p.style ? `style="${p.style}"` : ''} ...`
// datatable.ts — row values
`value="${rawVal ?? ''}"`   and   `${formattedContent}`
```

A prop carrying a quote escapes its attribute; a URL prop accepts a script-scheme URL. Neither the
reviver nor the hydrator escapes, so props reach components raw. Since props originate server-side
from application data, any user-influenced field — a display name, a comment, a product title —
becomes a stored XSS vector on render.

`escapeHtml` is hand-redefined three separate times locally, in `input-text.ts`, `input-tags.ts` and
`tooltip.ts` — the need was felt repeatedly and never generalized.

**Fix**: the `html\`\`` primitive (§9). **Priority: above everything else in this document.**

### 1.2 The refresh endpoint is fail-open on authorization [CLOSED — Spec 041 / LT-2204]

**Resolved (2026-09-03)**: Deny-by-default authorization and mandatory field allowlists are implemented library-wide across all five execution paths:
- `failOpenAuthorizationSites`: **5 → 0**
- `serviceAbsenceSkips`: **5 → 0**
- `allowlistOptionalSites`: **3 → 0**
- `unguardedDataEndpoints`: **1 → 0**
- All 5 server authorization paths delegate to `IIslandAccessEvaluator`.
- `IslandFieldPolicy` is mandatory; missing allowlists trigger compile-time errors.
- Full test suite passes green (**268 / 268 passed**).
- Automated CI audit enforcement wired via `scripts/audit-server-security.mjs`.

### 1.3 Every refresh and navigation leaks event listeners

| | |
|---|---|
| `addEventListener` calls | **446** |
| ...passing an `AbortSignal` | **53** |
| ...unmanaged | **374** |
| Components returning `IslandTeardown` | **0** |
| Components using `ctx.onCleanup` | **2** |
| Observers created / disconnected | **2 / 0** |

`refresh.ts` calls `rehydrateIsland()`, which re-runs mount — so unmanaged listeners re-register on
top of the old ones every time. On the long-lived server-driven dashboard that is your flagship use
case, listener count and memory grow without bound and handlers fire multiple times per event.

The hydrator already builds an `AbortController` per island and aborts it correctly. Passing
`ctx.signal` through is mechanical and closes the class at once.

---

## 2. Correction: the hex "regression" is mostly a lint bug

`verify-contracts.mjs` reports 716 hex violations. **604 of them sit in the fallback slot of
`var(--token, #hex)`** — e.g. `var(--p-tag-primary-background, var(--p-primary-50, #eff6ff))`. That is
deliberate, correct defensive CSS. There are **4,174** `var(--…)` token uses against **716** hex.

Only **112** are genuinely hardcoded (28 of which are `color: #ffffff`).

The rule's `/#[0-9a-fA-F]{3,8}\b/g` cannot tell a fallback from a mistake. **Fix the rule before
ratcheting it.** Stripping the fallbacks would make components less robust while appearing to improve
the metric.

Related: `injectIslandStyle()` with `adoptedStyleSheets` **is** adopted — 75 of 76 components. Style
delivery is one of the healthier subsystems.

---

## 3. Where you actually are

| Capability | State | Evidence |
|---|---|---|
| Hydration engine | **Strong** | 6 strategies, shared `IntersectionObserver` + `WeakMap`, tri-state lifecycle, retry, error boundaries |
| Server data contract | **Strong** | Expression-tree filters, field allowlists, antiforgery + authz on refresh |
| Core/Components split | **Strong** | Enforced by `CoreOnlyBoundaryTests.cs`, not convention |
| Scoped style injection | **Strong** | `adoptedStyleSheets`, 75/76 adopted |
| Module layering | **Strong** | Zero sibling coupling across 76 components |
| CSP-safe expressions | **Unique** | AST evaluator, no `eval` — Alpine can't do this |
| Directive layer | **Built, undocumented** | 19 directives, 3,302 lines, absent from README |
| Composable primitives | **Built, unused** | 21 written, ~0 adopted |
| Lazy island chunks | **Partial** | ESM splits per component; IIFE bundle inlines all 76 (1.26 MB) |
| Island compiler | **Missing** | No user can author an island |
| Framework SSR | **Missing** | React/Vue/Svelte mount client-side only |
| Plugin API | **Missing** | No extension point anywhere in Core |
| DevTools | **Missing** | — |
| Endpoint rate limiting | **Missing** | Two public `MapPost` routes run user-shaped queries |
| Localization | **Strong — [CLOSED, Part N]** | 10 locales, 1,509 lines; reachable from **82 of 82** TagHelpers (was 15 of 96); all 31 hardcoded English defaults (roadmap previously undercounted this as 25) and 13 client-template strings now routed through `ILaughTaleLocalizer` |
| RTL support | **Substantially improved — [CLOSED, this pass]** | `rtlAdoption` **8/76 → 49/76**; logical-property CSS conversion across 42 components + targeted gap-fixes in 5 of the original 8, plus icon mirroring extended to 7 more; 5 behavioral/JS geometry bugs fixed and unit-tested (`useFloatingPosition` — 14 consumers — plus `slider`, `splitter`, `rating`, `toggle-switch`); `scrollarea`'s drag math and `speed-dial`/`toast`'s explicit corner positioning intentionally left as documented exceptions (see §5) |
| Core/Components boundary | **Fully enforced** | Assembly-reference check passes; class-hierarchy check exists for the TagHelper split (`GeneratedTagHelperHierarchyTests`); the locale-dictionary gap is closed too — `LaughTaleLocaleDictionary`/`LaughTaleBuiltInLocales` moved to `LaughTale.Components`, and `CoreOnlyBoundaryTests` now reflects over Core's assembly and `LaughTaleLocalizationOptions`'s public surface to catch either type quietly coming back |
| Props serialization | **Improved — [CLOSED, this pass]** | `IslandJson` now omits default-valued props (`DefaultIgnoreCondition.WhenWritingDefault`) — correcting the roadmap's stale "198 of 325" figure to the real pre-fix count, **401 of 665** props across 81 `[Island(...)]` records; generator-emitted anonymous props types replaced with named `WireProps` records (unblocks the anonymous-type limit on `[JsonSerializable]`), but a working `JsonSerializerContext` for them proved unreachable — reflection remains the only path (Part J below has the full account) |

---

## 4. Part B — The compiler & build pipeline

The organ that doesn't exist in any form. Everything in Part D and most of Part G depends on it.

| Item | From | Effort |
|---|---|---|
| **Island discovery & compilation** — scan `Islands/**`, compile `.ts/.tsx/.vue/.svelte` to per-island chunks, emit a hashed manifest, have `LaughTale.Generators` read it and emit one typed TagHelper per island (`Islands/UserCard.tsx` → `<island-user-card>`) | Fresh, Nuxt, Astro | **L · 4–6 wks** |
| **Optimizer: split at interaction boundaries** — one chunk per handler group, downloaded on first interaction. Also: stop shipping the 1.26 MB IIFE as documented default | Qwik | L · 4 wks |
| **Speculative prefetch worker** — service worker pre-warming likely chunks | Qwik City | S–M · 2 wks |
| **Asset pipeline** — content hashing, immutable headers, integrity manifest, CSP hash emission | Vite, Nitro | M · 2–3 wks |

**Island discovery is the single highest-value item on this roadmap.** Everything about
"multi-framework" is theatre until it exists.

---

## 5. Part C — Components

Theming is genuinely strong (247 tokens, palette generator, contrast checker). The gaps are in
behaviour, and the fixes are sitting unused in `src/composables/`.

- **Accessibility pass** *(Radix, Ark UI · M · 3–4 wks)* — **[CLOSED — Spec 042]** All **76 of 76**
  components now declare and strictly conform to machine-verified WAI-ARIA APG contracts (`kind: 'pattern'`,
  `kind: 'native'`, or `kind: 'presentational'`) with zero architecture lint violations. `ariaZeroComponents`
  reduced from 21 to **0**. Full keyboard operability restored across all 76 components (Escape unwinding,
  Arrow navigation via roving tabindex, typeahead buffer). Adopted `useKeyboardNav` across hierarchical/menu
  components and `useFocusTrap` across 100% of modal overlay containers (7 total: `dialog`, `drawer`,
  `confirm-dialog`, `sidebar`, `confirm-popup`, `galleria`, `command`).
  *Note on inherited figures*: The original inherited roadmap target of **9** overlay focus traps was
  not reproducible from source code upon audit. Only **7** true modal overlay components exist in LaughTale;
  non-modal overlays (`popover`, `menu`, `context-menu`, `tieredmenu`, `menubar`) explicitly must NOT trap
  focus per WAI-ARIA and Invariant I3. This represents the third inherited roadmap metric in LaughTale to fail
  source code reproduction (joining `listenersUnmanaged: 374` and `hexHardcoded: 716`).
- **Form association** *(web platform · M · 2–3 wks)* — **[CLOSED — Spec 045]** Native form association
  implemented and verified across all **29 of 29** in-scope form controls (`formFieldAdoption: 29`,
  `clientCreatedFields: 0`). Every form control contributes its form field (`data-lt-field`) to the initial
  server response before script runs, guaranteeing 100% no-JS form submission with model values (`0 → 29`).
  Client hydration adopts server fields non-destructively via headless `useFormField`, completely eliminating
  all 18 client `<input>` creation sites (`18 → 0`). Unambiguous wire cardinality contracts (`Single`, `Multiple`
  via repeated fields, `Boolean` via companion pattern) provide byte-for-byte submission parity and native
  `form.reset()` restoration.
  *Note on inherited figures (Findings 1–3)*: Empirical source audit disproved three inherited roadmap metrics:
  1. *"Only 10 sync a hidden input" was a regex artefact*: 2 of the 10 were merely DOM query lookups (`float-label`, `checkbox`); only 8 rendered a hidden field, and 3 of those 8 hardcoded `value=""`. 18 components created fields purely in client script.
  2. *"Implied 10 of 29 post without JS"*: Actually **0 of 29** posted without JavaScript because all 8 hidden fields lived inside client-only templates and no TagHelper overrode `BuildSsrHtml()`.
  3. *"0 components use ElementInternals"*: True as stated, but `ElementInternals` (`attachInternals()`) is architecturally unreachable on plain elements without converting components to autonomous custom elements. LaughTale solved form association via server-rendered fields and headless composable adoption.
- **Unify the event API** *(S · 1 wk)* — **[CLOSED — Spec 044]** Unified component event contract across
  all 41 dispatching components (`laughtale:<comp>:<evt>`).
- **Floating Positioning & Virtualization** *(TanStack Virtual · S–M · 1–2 wks)* — **[CLOSED — Spec 043]** Adopted `useFloatingPosition` across all **14 of 14** floating overlays (8 JS-positioned and 6 CSS-anchored panels: `popover`, `menu`, `context-menu`, `confirm-popup`, `split-button`, `tieredmenu`, `menubar`, `cascadeselect`, `autocomplete`, `datepicker`, `select`, `tree-select`, `multiselect`, `color-picker`), completely eliminating all 32 hand-rolled positioning sites and 6 residual CSS anchoring declarations. Adopted `useVirtualizer` across all **6 of 6** long collection components (`datatable`, `treetable`, `tree`, `select`, `listbox`, `orderlist`) with collection-space keyboard navigation and full WAI-ARIA setsize preservation.
  *Note on inherited figures*: Two more inherited roadmap figures failed source reproduction upon audit:
  1. "36 positioning sites across 9 components" was audited in source code and proven to be **32 sites across 8 components** (Classes A + B).
  2. The README's claim of "100,000-row grids" justification was ungrounded without virtualization; virtualizer adoption bounds DOM footprint to <100 nodes.
  These join `listenersUnmanaged: 374`, `hexHardcoded: 716`, and `focusTrapAdoption: 9` as historical discrepancies clarified by empirical source audit.
- **Headless core + parts anatomy** *(Zag.js, Ark UI, Radix · XL · ongoing)* — split each component
  into a state machine and a renderer; emit `data-part` / `data-state` so consumers style by anatomy.
  Do it opportunistically, one component at a time, never as a big-bang rewrite.
- **RTL & logical properties** *(S–M · 1–2 wks)* — **[CLOSED — this pass, CSS + icons + 5 behavioral fixes]**
  `dir` already flowed correctly end-to-end (server culture → DOM `dir` attribute → `IslandContext.dir` →
  `useLocale(ctx).isRtl`) before this pass; what was missing was components actually reading it.
  `rtlAdoption` (components with at least one direction-aware CSS/JS token) went from **8 of 76** to
  **49 of 76**, and CSS logical-property conversion (`margin-left/right` → `margin-inline-start/end`,
  `padding-left/right` → `padding-inline-start/end`, `border-left/right` → `border-inline-start/end`,
  physical corner radii → `border-start-start-radius` etc., `text-align: left/right` → `start/end`, and
  positional `left/right` → `inset-inline-start/end` for icon/affordance placement) landed across
  **42** previously direction-blind components, plus targeted gap-fixes in 5 of the original partially-RTL
  8 (`sidebar`, `tree`, `treetable`, `split-button`, `picklist`). Icon mirroring (`[dir="rtl"] … { transform:
  scaleX(-1) }`, or a rotation-sign flip for `galleria`'s rotate-based chevrons) was extended to 7 more
  components: `datepicker`, `cascadeselect`, `tieredmenu`, `tree-select`, `datatable`, `galleria`,
  `split-button`.
  **The part that actually mattered**: 5 behavioral/geometry bugs where CSS mirroring alone would have
  been silently wrong at runtime, each fixed with a unit test proving the RTL result is a true mirror of
  LTR, not just "doesn't throw": `useFloatingPosition` (hardcoded `'start'`→left/`'end'`→right and no
  `dir`-driven mirroring at all; now accepts/auto-detects `isRtl` and mirrors `'*-start'/'*-end'` and pure
  `'left'/'right'` placements — the highest-leverage fix here since it's consumed by **14** components:
  `autocomplete`, `cascadeselect`, `color-picker`, `confirm-popup`, `context-menu`, `datepicker`, `menu`,
  `menubar`, `multiselect`, `popover`, `select`, `split-button`, `tieredmenu`, `tree-select`); `slider`'s
  drag-ratio math (didn't flip under RTL, so dragging moved the handle the wrong way); `splitter`'s
  drag-delta sign (didn't account for `flex-direction: row` mirroring panel order under RTL); `rating`'s
  half-star hit-test *and* its visual half-fill overlay (both used a hardcoded physical-left/right split);
  `toggle-switch`'s handle position and slide transform (zero dir-handling — a textbook RTL bug for a
  toggle). Deliberately left unfixed and documented in source: `scrollarea`'s custom-scrollbar drag math
  (browsers disagree on `scrollLeft`'s sign/zero-point under RTL — flagged with a code comment rather than
  guessed at); `speed-dial`'s directional fan-out and `toast`'s corner-position variants (both are explicit,
  developer-chosen physical sides, not text-direction-relative, so intentionally not touched); a handful of
  centering-math (`left: 50%` + equal negative margin) and full-bleed (`left: 0; right: 0`) declarations
  that are direction-neutral by construction.
- **Imperative handles — [CLOSED, this pass]** `createHandle` was defined in the registry (`hydrator.ts`
  already called `module.createHandle(container, props)` and merged the result onto `container.island`)
  and implemented by zero components. Implemented the roadmap's own three named examples:
  `dialog.open()/close()/toggle()`, `toast.show()/clear()`, `datatable.reload()`. Since `createHandle`
  runs BEFORE `mount()` (hydrator.ts builds `container.island` ahead of the actual mount call), `dialog`
  and `datatable`'s handles can't capture the real mask/reload closures directly — they return thin
  forwarders that look up an instance API the mount function stashes on the container once it actually
  runs, resolved lazily at call time (always after mount, since nothing external can call
  `container.island.open()` before the page is interactive). `toast` needed no such indirection: its
  `globalToast` service is already a persistent singleton keyed by group, so `createHandle` forwards to
  it directly. `dialog.open()`/`close()`/`toggle()` also consolidated three previously-duplicated copies
  of the show/hide sequence (the Escape handler, the initial `visible`-prop check, and the close button)
  into one shared implementation. `datatable.reload()` re-fetches from `lazyUrl` when lazy-backed,
  otherwise re-renders the already-loaded data — verified live to trigger a real second network request
  and re-render, not just a no-op. All three verified live in Showcase (`/components`) via direct
  `container.island.<method>()` calls; 5 new tests in `tests/components/imperative-handles.test.ts`.
- **Visual regression tests** *(M · 2 wks)* — Playwright is already a dependency; the suite is
  unit-level, so a 700-line restyle passes CI unseen.

---

## 6. Part D — Adapters

All five adapters *were* one-shot mount functions (324 lines total, confirmed by `wc -l`: 314
across the five adapter files — `react.ts` 71, `vue.ts` 69, `preact.ts` 64, `svelte.ts` 94,
`vanilla.ts` 16 — plus a 10-line barrel). They handled initial render and unmount and nothing in
between, which produced a specific and serious bug.

> **`island.refresh()` corrupted React (and Vue, and Preact) islands — [CLOSED (mechanism) for
> those three adapters, this pass; see below].** `refresh.ts` morphed the container in place with
> `morphElement()` — patching attributes, then blindly replacing `innerHTML` for the whole
> subtree — **before** ever telling the mounted framework instance to unmount. React's (or Vue's,
> or Preact's) reconciler still held references into DOM that had already been ripped out from
> under it by the time its own `unmount()` ran; that call then threw against already-mutated DOM,
> silently, into every adapter's own `catch { /* ignore unmount errors on disposed DOM */ }`. This
> happened on **every single refresh** of a framework-mounted island, not just some hydration
> strategies — your two flagship features were individually good and mutually incompatible, and
> nothing tested the combination until this pass.

| Item | From | Effort |
|---|---|---|
| **Props updates without remount** — add `update(props)` to the adapter contract; refresh prefers it over morphing. *This is the fix for the corruption above, not a separate feature.* — **[CLOSED (mechanism), this pass]** for React/Vue/Preact; Svelte and vanilla deliberately excluded — see below | Astro, Nuxt | M · 2–3 wks |
| **Nested islands — [CLOSED (order-safety + diagnosability), this pass]** the hydrator now detects and warns about a nested island destroyed by its parent, instead of silently vanishing — see below | Astro | M · 2 wks |
| **Context & shared store access — [CLOSED, this pass]** `ctx.sharedState(key, initial)` now reaches the existing (previously "built, unused") `useSharedState`/`IslandStore` primitive — see below | Nuxt `useState` | S · 1 wk |
| **Close adapter gaps — [CLOSED, this pass]** slot/children forwarding shipped for React/Vue/Preact (Svelte deliberately excluded, documented); `vanilla.ts`'s missing hydrate-path signal generalized as `ctx.hydrate` — see below | parity | S · 1 wk |
| **New adapters** — Web Components/Lit first (framework-agnostic, no runtime download), then Solid, Alpine, Angular (unglamorous, but what enterprise .NET shops run) | ecosystem | S each |

**Props updates without remount — [CLOSED (mechanism) for 3 of 5 adapters, this pass].** `registry.ts`
gained an additive `IslandInstance` shape (`{ unmount?, update? }`) alongside the existing
bare-teardown return type, plus a `normalizeMountResult()` that collapses `void` / a bare function /
an `IslandInstance` into one shape — every existing `defineIsland(...)` mount function across
`src/components/` (all of which return `void` or a bare teardown today) keeps working completely
unchanged; this is additive, not a breaking contract change. A new internal
`runtime/island-instances.ts` (a `WeakMap<HTMLElement, updateFn>`, cleared on teardown) lets
`refresh.ts` reach a mounted instance's `update` without putting it on the public `container.island`
handle a page author can call directly and use to bypass server-authoritative refresh. `refresh.ts`
now checks for a registered `update` *before* morphing: when present, it parses the *incoming*
(not-yet-applied) element's `data-props` with the same reviver the hydrator uses for initial mount,
syncs the container's own attributes (the attribute-sync half of `morphElement` was extracted into a
shared `syncContainerAttributes`, used by both paths), and calls `update(props)` — `innerHTML` is
never touched. If `update()` throws, the error is logged (not swallowed) and refresh falls back to
the original morph+`rehydrateIsland` sequence for that one refresh, so a broken adapter degrades
gracefully instead of leaving the island half-updated. An adapter that never registers an `update`
(vanilla, Svelte) sees **zero behavior change** — the exact same morph+remount sequence as before.

- **React** — `root.render(createElement(Component, newProps))` called again on the *same* `root`
  is React's own designed re-render path. `root` was already captured outside the returned closure,
  so no restructuring was needed beyond adding the `update` closure itself.
- **Preact** — `render(h(Component, newProps), container)` into the *same* container lets Preact
  diff against the vnode tree it already associates with that DOM node. Equally direct.
- **Vue** required real restructuring: `props` moved from a plain closure variable into a
  `shallowRef` read inside the wrapper component's `render()`; `update` reassigns the ref's
  `.value` wholesale (not a per-field mutation), so removed/added keys are handled correctly, not
  just changed ones.
- **Svelte — deliberately not implemented this pass (Option B of the two considered).** Svelte 4
  instances expose `$set()` trivially, but Svelte 5's pure-runes components — mounted via
  `svelte.mount()`, not `new Component()` — have no public `$set` unless the *consuming app* opts
  into the compiler flag `compatibility.componentApi: 4`, a real, non-free trade-off that leaks a
  compiler decision into what this adapter otherwise keeps zero-config. This pass could not verify
  that trade-off empirically: there is no `.svelte` compiler wired into this repo anywhere (checked:
  no `esbuild-svelte`, no `svelte/compiler`, no `.svelte` fixture in any `package.json`/build
  script), so `svelte` was deliberately **not** added as a dependency and `svelte.ts` is
  **unchanged** — it still returns a bare teardown, and refresh continues through the existing
  morph+remount path for it, exactly as before the rest of this pass. A smaller, honest scope beats
  a fragile Svelte 5 `update()` this pass could not actually exercise; recorded here as an explicit
  open follow-up, not a silent gap.
- **`vanilla.ts` is correctly excluded — not a gap.** There is no framework instance to hand new
  props to; `createVanillaIsland` forwards the caller's own mount function verbatim. It keeps going
  through morph+remount exactly as before — a fake `update` here would just be a slower way to do
  what remounting already does.
- **Tests.** `react`, `react-dom`, `vue` and `preact` were added as `devDependencies` only (not
  runtime deps — matching how a real consuming app installs them, and how the adapters already
  `import()` them optionally/dynamically); `svelte` was deliberately not added, per above. Before
  this pass, **zero** adapter test ever exercised a real framework mount: no framework package was
  installed, so every adapter test's dynamic `import()` always rejected and every "adapter" test
  only proved the vanilla-fallback catch branch, for all five adapters, unconditionally.
  `tests/adapters.test.ts` now mounts real React/Vue/Preact components and proves `update()` patches
  the *same* DOM node — captured by reference before the call, compared by identity after — rather
  than checking only that new text appeared, which would be equally true of a full remount with new
  props. A new `tests/runtime/refresh-update.test.ts` drives `refreshIsland()` end-to-end against a
  real React-adapter-mounted island (asserting the adapter's `unmount` is never called, spied
  directly; `container.innerHTML` is never assigned, spied directly on the instance; and new props
  render) and separately against a fake adapter whose `update()` throws (asserting the fallback path
  still recovers, remounts, and applies the new props instead of leaving the island stuck).
  `adapterUpdateSupport` — a metrics-baseline counter added for exactly this — went from **0 to 3**
  of 5 adapters (`LaughTale.Client/scripts/metrics-baseline.json`).
- **Line count, corrected.** The five adapter files plus their barrel were 324 lines pre-fix
  (`wc -l`, matching this roadmap's pre-existing figure exactly); post-fix they total 349
  (`react.ts` 71→78, `vue.ts` 69→81, `preact.ts` 64→70; `svelte.ts` and `vanilla.ts` unchanged at
  94/16), plus a new, separate 45-line `runtime/island-instances.ts` that is bookkeeping
  infrastructure, not itself an adapter.
- **Scope.** This closes the *mechanism* only, for the three adapters listed above. It does not
  touch nested islands, `ctx`'s ambient state pool, `preact.ts`'s slot-passing gap, `vanilla.ts`'s
  missing hydrate path, or new adapters — every other row in the table above is exactly as
  unaddressed as it was before this pass.

**Nested islands — [CLOSED (order-safety + diagnosability), this pass].** Not theoretical: a real
example already ships in `LaughTale.Showcase/Pages/Components.cshtml` (`island-float-label` wrapping
`island-input-text`, `island-select`, `island-tree-select`, and six other island types), and it only
ever avoided the underlying hazard by accident (`FloatLabelIsland`'s mount function happens to use
targeted `querySelector`/`appendChild` rather than an `innerHTML` rewrite — not a designed guarantee).
Roughly 60 of the ~76 vanilla components do a full `innerHTML`/`setHtml` rewrite on mount and would
destroy a nested island the same way `float-label` almost does; the framework adapters' replace-mode
mounts (React/Vue/Preact never set `options.hydrate`, confirmed nowhere in this repo — always the
destructive branch) carry the identical risk.

**First design attempt was wrong, caught by live-browser verification, not unit tests.** The initial
fix deferred a nested island's hydration until its parent's own mount settled — logically sound
against the destruction hazard, but it broke `float-label` live: that component synchronously
`querySelector`s for the nested island's *already-rendered* `<input>` during its own mount to wire
ARIA attributes, and deferring starved that read of anything to find (previously "worked" only because
of module-caching timing luck, not design — this fix would have turned that luck into a deterministic
failure). All 474 client tests stayed green through this mistake, because the tests exercised the new
gating logic in isolation rather than the real, more demanding component it was about to ship
alongside — exactly why this session's live-verification rule exists.

**Revised, shipped design: don't change *when* nested islands hydrate — detect *when they're
destroyed*.** Nested islands hydrate concurrently with their parent, exactly as before this pass (zero
timing change, zero risk to `float-label` or anything like it). `hydrator.ts`'s `executeHydration`
snapshots a container's direct nested islands immediately before calling `mount()`, waits one
`requestAnimationFrame` after `mount()` resolves (React's `createRoot().render()`, called outside a
native browser event, schedules its commit via a `MessageChannel` macrotask rather than synchronously —
a bare microtask isn't a long enough wait; `react.ts`'s initial render is also now wrapped in
`flushSync` so this doesn't rely on the buffer alone), then checks each snapshotted nested island's
`isConnected` status — any that were destroyed get a `console.warn` naming both the nested island and
its parent, instead of silently vanishing. Any nested island newly introduced by the parent's own
render (not present before mount) is also picked up and hydrated, a genuinely new capability. Verified
live against the real `float-label` example (all 19 real nested islands across its variants mount
correctly, ARIA wiring intact) and against a constructed destructive-parent case (the warning fires
with the exact expected message).

A related, previously-unrelated leak was found and fixed in the same pass: `teardownIsland` dispatches
a **non-bubbling** `laughtale:unmount`, so tearing down a parent (`retryIsland`, or `rehydrateIsland`
during refresh) never reached a nested island's own cleanup listener (registered on its own container).
`router.ts`'s full-page-navigation teardown already solves exactly this (depth-first, dispatched
individually) — `teardownIsland` now mirrors that precedent rather than adding new bookkeeping.

**Context & shared store access, and close adapter gaps — [CLOSED, this pass].** `runtime/state.ts`
already exported a working `useSharedState`/`IslandStore` pub/sub primitive — one of the roadmap's own
"Composable primitives — built, unused" items — but nothing on `ctx` ever reached it. Wired it up as
`ctx.sharedState(key, initial)`, populated in `hydrator.ts` right next to `ctx.t`/`ctx.dictionary`.
Deliberately named `sharedState`, not `state`: Part F (below) already earmarks `ctx.state` for a
separate, unbuilt server-dehydration mechanism, and this pass doesn't want to squat on that name.
`state.ts`'s backing store was also `globalThis`-anchored (it was a plain module-scope `Map`) — the
same multi-bundle gap already fixed twice this session in `runtime/registry.ts` and
`adapters/registry.ts`, now closed here before `ctx.sharedState` turned it from a latent bug into a
live one.

Slot/children forwarding turned out to have a much better foundation than expected:
`IslandTagHelper.cs` (and Blazor's `Island.razor`) already wrap any child content inside
`<island>...</island>` in `<div class="island-slot">` for every island — 8 vanilla components already
consume it by hand. The four framework adapters never read it at all; their destructive mount
silently wiped it out. `adapters/slot.ts` (new) gives React/Vue/Preact the same extraction convention,
forwarding the *live* DOM nodes (not a re-serialized copy, so a nested island inside survives) as
`props.children`/the default slot via a small ref-callback host element, warning loudly if a component
never renders what it was given. Had to fix a real, easy-to-miss bug found during implementation: the
extracted slot host must be rebuilt on *every* render, not just the initial one — omitting it from
`update()` would make the component's next render produce nothing in that position and the framework
would unmount (destroy) the slotted content on the very first server-driven refresh. No real consumer
of a framework-mounted island with slotted children existed anywhere in the repo, so this carried zero
regression risk. Svelte is deliberately excluded and documented (Svelte 5 children are snippets, not a
raw-DOM-node model, and this repo has no Svelte compiler toolchain to verify a fix against — same
reasoning as `update()`'s existing Svelte exclusion). `vanilla.ts`'s missing hydrate-path signal became
a structural `ctx.hydrate: boolean` (computed once via `container.hasChildNodes()`), which every
adapter — vanilla included — now reads instead of separately re-deriving it.

Both verified live on `LaughTale.Showcase/Pages/Polyglot.cshtml`'s new "Part D" section: two vanilla
islands (writer/reader) sync a counter through `ctx.sharedState` with zero props/events link between
them, and a real `createReactIsland`-backed island renders server-written `<island>...</island>` child
markup via `props.children`.

Explicitly out of scope: Part F's server-dehydration `ctx.state`/`IslandStatePool` (no backend exists
at all — confirmed via repo-wide grep — separate, larger, cross-stack work); `runtime/events.ts`'s
inter-island event bus has the identical non-`globalThis`-anchored bus this pass fixed for the shared
store, left unfixed here since it's unrelated to the actual ask; new adapters; and true DOM
preservation for a nested island inside a framework adapter's destructive mount when the parent
doesn't forward it as a slot (an author-error case, not a framework gap).

| **Framework SSR sidecar** — Node render host over a local socket. The right *first plugin* to prove the Part L API, not core work. Until then, rename the strategy `client-only` and require a fallback | Astro, Nuxt | XL · 8+ wks |

---

## 7. Part E — Rendering & routing

| Item | From | Effort |
|---|---|---|
| **Out-of-order streaming** — flush shell with skeletons, resolve slow data in background tasks, append late fragments as `<template>`. *.NET's real threads and `IAsyncEnumerable` make this cleaner than Node's* | Astro server islands, Next PPR | M · 3 wks |
| **Partials** — named page regions updated by link/form, everything else untouched. *The most natural fit on this list for what LaughTale already is* | Fresh, Turbo Frames | S–M · 2 wks |
| **Route rules / hybrid rendering** — per-path SSR/SSG/ISR/CSR in one config table | Nuxt `routeRules` | M · 2–3 wks |
| **Nested layouts & outlets** — morph only the lowest common layout ancestor; sidebar scroll and media survive navigation by default | Nuxt, Next | M · 3 wks |
| **Delegated event resumability** — one listener on `document.body`, intent in attributes, chunk on first interaction | Qwik | M · 2–3 wks |
| **Middleware & typed head** — per-route chain (auth, tenant, A/B) plus typed metadata API | Next, Nuxt, Astro | S–M · 2 wks |

---

## 8. Part F — Data & state

| Item | From | Effort |
|---|---|---|
| **Server actions** — `<island-form action="OnPostUpdateUser">`: auto antiforgery, submit state, optimistic update, fragment swap, plain POST fallback. **Best effort-to-value ratio here** — Razor Pages handlers are already the right shape | Next, Remix, Astro | S–M · 2–3 wks |
| **Cache tags & live invalidation** — tag fragments, evict on mutation, SSE push. **This is your Blazor Server answer**: multi-user live updates with no stateful circuit | Next `revalidateTag`, Nitro | M · 2–3 wks |
| **Ambient state pool** — one `<script id="__LAUGHTALE_STATE__">`, read via `ctx.state`; reuse `IslandJson` and `[IslandPrivate]` | Nuxt `useState` | S · 1 wk |
| **Typed content collections — [CLOSED, this pass; roadmap was stale]** the roadmap's own claim
  ("`ContentCollection.cs` exists and is untyped") doesn't hold up — `GetCollectionAsync<TMetadata>`/
  `GetEntryAsync<TMetadata>` were already fully generic, and `IslandMarkdownPipeline.Parse<TMetadata>`
  already deserialized YAML frontmatter straight into `TMetadata` (already consumed end-to-end by
  `LaughTale.Docs`). The one real gap was "validated at build": a schema mismatch (wrong type, typo'd
  key) was silently swallowed into a blank `TMetadata()` instead of failing anything. Fixed: the
  swallow now rethrows a descriptive `InvalidOperationException` naming the slug and metadata type,
  so `GetCollectionAsync` (which iterates a whole directory with no try/catch of its own) fails loud
  for the one bad entry instead of silently shipping half-empty metadata — matching Astro's own
  content-collections behavior (a schema violation fails the build, not just that one page). Verified
  the fix doesn't break any of LaughTale.Docs' real `.md` files by checking every real `order:` value
  parses cleanly. 4 new tests | Astro | S–M · 2 wks |
| **Typed config & sessions** — validated env schema separating server-only from client-exposed at compile time | Astro env, Nuxt runtimeConfig | S · 1 wk |
| **Incremental regeneration** | Next ISR | M · 2 wks |

---

## 9. Part M — Architecture, debloat & patterns

**Start with what's right, because it constrains the fix.** Component coupling is excellent: across 76
components there is *not one* import of a sibling. Dependencies flow one way into `runtime` (227),
`icons` (40), `composables` (27), `types` (11). The C# side uses a proper template method —
`IslandTagHelperBase` exposes `BuildProps()`, `BuildSsrHtml()`, `WrapperTagName`.

**Don't refactor the architecture. Refactor the rendering primitive.**

### The keystone — [CLOSED, already fully adopted before this session — stale roadmap section]

This whole section described `src/runtime/html.ts` as a ~40-line proposal to write and a lint rule
still to add. Both already exist, already more capable than the proposed snippet (also ships
`setHtml`, `attr`, `cx`, all documented against a real spec: `LT-902`/`specs/040-safe-html-primitive`),
and are already enforced: `scripts/verify-contracts.mjs` (run by `npm test`) fails the build on any
`.innerHTML =`/`.outerHTML =`/`insertAdjacentHTML` call outside `setHtml()`. Verified directly against
`scripts/audit-metrics.mjs`'s live counters, not just a code read: **`innerHtmlRawAssignments: 0`**
across all 76 components, today. **One primitive did close the XSS class** — it's just already closed,
not a future item. Two of the "three private copies of `escapeHtml`" claim also don't hold up: exactly
**two** remain (`directives/tooltip.ts`, `icons/lucide.ts`), not three, and neither is "subsumed" as
stated — they're real, small, still-open dedup candidates.

### Debloat — things to delete

Re-verified against `audit-metrics.mjs`'s live counters rather than trusting the roadmap's own
possibly-stale figures — all of the below are confirmed still real and still open:

- **212 inline SVG literals — [CLOSED (75%), this pass]**. Retrofitted 33 of the ~37 affected
  components to `getLucideIcon()`, matching each hand-written `<path>`/shape against the real
  `lucide-static` source (not guessed from variable names) before substituting — `rawSvgLiterals`
  dropped from 212 to 53 (re-verified against `audit-metrics.mjs`; baseline updated so a future
  regression back toward raw SVGs fails CI). The duplicated folder icon across `accordion`, `tree`,
  `treetable` is now one shared sprite symbol instead of three copies. The remaining 53 are
  deliberately untouched, not missed: several are genuinely pre-Lucide-redesign shapes with no
  current match (old `eye`/`eye-off`, `star`, `cog`, `file`, `truck`, ...), a few need rendering
  properties `getLucideIcon` can't produce (`rating.ts`'s filled star needs `fill="currentColor"`
  against the module's fixed stroke-only template; `toolbar.ts`'s play/pause are solid shapes, not
  outline), and a few carry a load-bearing extra CSS class or animation hook the module has no way
  to add (`message.ts`'s size-overridden close icon, `treetable`/`tree`'s `animate-spin` spinners —
  solved elsewhere in this pass via a wrapping `<span class="animate-spin">` where the surrounding
  markup allowed it, e.g. `blockui.ts`). Full production build, all three gzip budgets, and all 495
  client tests verified green after the retrofit; the all-in-one bundle also shrank measurably
  (376.93 KB → 372.81 KB gzip) from removing the duplicated inline markup.
- **Two private copies of `escapeHtml`** (corrected from "three, subsumed" above) —
  `directives/tooltip.ts`, `icons/lucide.ts`.
- **39 `LEGACY_ALIASES`** in the registry (confirmed: exactly 39 today), commented "scheduled for
  removal in LaughTale v4". You are building v4.
- **The 1.26 MB all-in-one IIFE** as documented default — keep as escape hatch, stop advertising it
  (its own gzip budget was corrected to a realistic 420 KB this session — see Part J).
- **`CompoundTagHelpers.cs`** — confirmed still 986 lines. Split to match `TagHelpers/Aura/{Data,Form,Misc}`.
- **`public string? Class { get; set; }` declared 33 times** (confirmed exact count) when
  `IslandTagHelperBase` exists to hold it.

### Decouple

Split each component into four pieces as you touch it: **machine** (state, no DOM), **view** (pure,
`html\`\``), **styles** (tokens against parts), **bindings** (listeners, all signal-bound). A DOM-free
machine is unit-testable without a browser; `data-part` gives consumers a styling contract that
survives internal changes — which is what makes `eject` a good idea rather than a fork generator.

### Patterns

- **Keep**: Strategy (hydration), Registry + lazy Factory (loaders), Adapter (frameworks). Used
  correctly.
- **Repair — Template Method (`IslandTagHelperBase`)** — **[CLOSED, TagHelper split, §0]**: the base
  class was well written but unreached — 81 of 96 TagHelpers were generated and never inherited it.
  `IslandGenerator` now emits generated TagHelpers deriving from `IslandTagHelperBase` (67 of the 81,
  after skipping 14 that duplicated a hand-written class), so **82 of 82** TagHelpers now reach the
  template method. Every capability parked on it — SSR, localization, RTL — inherits that reach.
- **Adopt — State machine** *(Zag.js, XState)* for overlays. Ends the
  `isOpen && !isDisabled && hasFocus` boolean soup.
- **Adopt — Observer/signals** so state changes patch rather than rebuild.
- **Adopt — Facade** over `directives/security.ts`: one `safe.*` entry point.
- **Adopt — Middleware pipeline** server-side for the plugin lifecycle; ASP.NET devs already think
  that way.
- **Adopt — Builder** for `IslandDataRequest` so the field allowlist is a required constructor
  argument. *Make the unsafe call impossible to write, instead of documenting that it's unsafe.*
- **Avoid — inheritance for TS components.** Compose from composables; that's what those 21 files
  were built for.

---

## 10. Part I — Directives (your best-kept secret)

19 directives plus a hand-written **1,408-line** lexer, parser, AST and evaluator for sandboxed
expressions. **Not mentioned once in the README.**

> **Your expression evaluator runs without `eval`, which means LaughTale works under a strict CSP.
> Alpine does not.**

`expression/evaluator.ts` walks its own AST, blocks `constructor`, `__proto__` and `prototype` by
identifier, and explicitly refuses the `Function` constructor. There is no `eval` or `new Function`
anywhere in the client source. Alpine.js requires `unsafe-eval` in your CSP; so do most of its peers.

For government, finance and healthcare buyers — exactly the accounts an "enterprise .NET" framework
chases — **"declarative directives under a strict CSP with nonces"** is a procurement-clearing
sentence. You built it and you're not saying it.

**Still needed**: document it and put it on the front page; fuzz the parser with property tests and a
documented grammar; promote `htmx.ts` — the htmx audience *is* your audience.

**Signals, `l-if`/`l-for`, and the teardown leak — [CLOSED (real signals + l-for/l-if + teardown), this
pass].** Two items in this list were already stale: `l-model` already existed and worked
(`directives/reactivity.ts:140-172`, confirmed before touching anything), and public directive
registration already existed and was tested (`directives/registry.ts`'s `registerDirective`, wired
into `initDirectives()`'s scan loop since an earlier "Part G/L" pass) — the roadmap's own "still
needed" line for both was wrong. The genuinely open items are now closed:
- **Real signals**: `runtime/signals.ts` (new) — `signal`/`computed`/`effect`/`batch`, a real
  dependency-tracked primitive (not a toy: re-runs correctly drop stale dependencies across
  conditional branches, `batch()` coalesces multiple writes into one re-run per affected subscriber).
  `directives/reactivity.ts`'s `ReactiveScope` is now signal-backed internally — each property gets
  its own signal, so an `l-bind`/`l-class`/`l-style`/`l-model` binding only re-evaluates when the
  specific property it reads changes, not on every write to the scope (previously: any write fired
  every listener in the whole scope, unconditionally). `ReactiveScope`'s public shape, and every other
  directive file that reads `scope.state`/`scope.listeners` directly, is unchanged — `storage.ts`'s
  `l-persist` still gets the coarse "any key changed" broadcast it actually needs, deliberately not
  converted.
- **`l-if`/`l-for`** (new, `directives/conditional.ts` and `directives/list.ts`) — the two directives
  from this list that were genuinely missing. Both toggle/render by moving the *same* DOM node rather
  than destroying and recreating it, so state and nested directive bindings survive. `l-for` uses a new
  small keyed list-reconciliation helper (`runtime/list-patch.ts`, `patchList()`) shared with a real
  component retrofit (below) — one reconciliation algorithm for both. A real bug surfaced and got fixed
  during this pass, not after: a naive integration would have had `patchList`'s own content-diff
  spuriously "detect a change" the instant an `l-bind` effect wrote into an already-bound item's DOM
  (comparing live, mutated markup against the pristine template), destroying and rebuilding the very
  subtree whose effects it had just bound. Fixed by separating "list structure" (patchList, keyed) from
  "per-item content" (each item's own reactive scope) so they never fight each other.
- **Teardown leak, real fix**: `l-poll` previously only self-cancelled on its *next* tick after leaving
  `document.body` (a delayed leak); `l-intersect` had no disconnect path at all without `.once` (a
  permanent `IntersectionObserver` leak per SPA navigation). Root cause was structural — directive
  binders receive only the bare element, never `ctx`/`onCleanup`. Fixed with a small cleanup registry
  (`directives/lifecycle.ts`, `registerDirectiveCleanup`/`teardownDirectives`) wired into `poll.ts`,
  `intersect.ts`, and the new signal-backed `l-bind`/`l-show`/`l-hide`/`l-if`/`l-for` effects, and called
  from `router.ts` before every SPA navigation's DOM swap (excluding `[data-persist]` subtrees, matching
  the existing island-unmount exclusion rule).
- **Transitions remain explicitly deferred** — needs `l-if`/`l-for` to exist and be validated first,
  not designed speculatively alongside them.
- **Two real component retrofits as proof, not a framework-wide rewrite**: `components/multiselect.ts`
  — the cleanest, smallest match for the innerHTML-rebuild complaint below (full item-list rebuild plus
  a full per-row listener rebind on every filter keystroke, no debounce). `selected`/`filterQuery` are
  now signals; `renderDisplay`/`renderList` are each one `effect()` instead of being called manually
  at every one of 5 mutation sites; item rendering uses `patchList` plus one delegated click listener
  instead of a full rebuild-and-rebind. `datatable.ts` — the largest/most feature-rich retrofit yet
  (~1750 lines: sorting, filtering, pagination, single/multi selection, row expansion, in-place cell
  editing, frozen columns, virtualization, lazy server data) — closed separately below, since it needed
  its own real design work rather than a copy of multiselect's shape. `autocomplete.ts` remains the
  same shape and is left for a follow-on pass.
- Gave `runtime/benchmark.ts`'s `measureThroughput` — fully built, unit-tested, zero real callers
  before this pass — its first real caller (`multiselect-benchmark.test.ts`), producing real
  `opsPerSec`/percentile numbers instead of an unverified performance claim.

**`datatable.ts` retrofit, closed as a follow-on pass.** This component had **zero prior test
coverage** (confirmed: no test file existed for it at all, unusual for a component this size) — a
characterization suite (`tests/components/datatable.test.ts`, 12 tests: sorting, global/column
filtering, pagination, single/multiple/row-click selection, row expansion, cell editing, the
virtualized path, lazy-mode fetch triggering) was written alongside the retrofit rather than after
it, since there was no existing regression net to lean on. State (`globalFilter`, `columnFilters`,
`sortMeta`, `currentPage`, `selectedKeys`, `expandedKeys`, `editingCell`) is now signal-backed behind
one `effect()`, replacing ~15 scattered manual `render()`/`triggerDataUpdate()` call sites; both
filter inputs are debounced 150ms (previously none); the table shell (toolbar/thead/tbody/paginator)
is built once at mount instead of being torn down on every state change, so the global filter's own
`<input>` never loses focus — the old "reacquire input, restore focus, restore caret position"
workaround this component needed is gone entirely, not patched around.

**`patchList` (Part I's own new helper) turned out not to be directly usable here — a real,
non-obvious finding, not a style choice.** Assigning HTML containing bare `<tr>`/`<td>` markup to a
`<div>` (`patchList`'s hardcoded wrapper) is a parse error under the HTML5 fragment-parsing
algorithm: real browsers (and happy-dom) silently drop the `<tr>`/`<td>` tags, keeping only their
text content — a row would render as flattened text, not a table row. Rather than modify the shared
`list-patch.ts` (used by `l-for` too) for one caller's tag-context needs, `datatable.ts` gets its own
local `patchTbodyRows` — the identical keyed-reuse algorithm, generalized to a 1-or-2-`<tr>` group per
row (row + optional expansion row), parsing new markup via a `<template>` element (the spec-correct
way to build orphan `<tr>` nodes from a string, verified empirically). A second bug surfaced during
the SAME implementation pass: comparing a reused row's live `.outerHTML` against the freshly-rendered
string (`patchList`'s own approach) never matches, because a browser's HTML serializer normalizes
away the whitespace in `renderSingleRow`'s multi-line `<tr ...>` opening tag — every row looked
"changed" and got needlessly torn down every update, defeating the point. Fixed by caching the raw
markup string this function itself last wrote per row-key, and comparing against that instead of the
DOM's own serialization. Virtualized large-dataset rendering is unchanged (still a full `tbody`
rebuild — its spacer-row layout doesn't fit a keyed-reuse model without deeper surgery, left for
later); cell-editing/frozen-column/row-expansion logic is untouched, only how their triggering state
reaches a re-render changed. Verified: `tsc --noEmit` clean, 547/547 client tests, production build
with all budgets green, and a live check in the Showcase (sort, row selection, node-identity-preserved
across an unrelated selection change) with no related console errors.

---

## 11. Part J — Performance

- **Stop leaking listeners** (§1.3) — the largest runtime problem in the codebase.
- **Replace `innerHTML` rebuilds with targeted updates — [CLOSED (two components), this pass].** Real
  signals plus a new keyed list-patch helper (Part I) fixed this for `multiselect.ts` and
  `datatable.ts` (the latter needed its own local keyed-row helper, `patchTbodyRows` — see Part I for
  why `patchList` itself doesn't fit a `<tr>`-based container); `autocomplete.ts` is the same shape and
  is the deliberate next target, not done here. Turned out `morphElement()` (`runtime/refresh.ts`) wasn't the right tool for
  this — it's a root-attribute diff plus a blind full-`innerHTML` replace for children, only used by the
  server-refresh fallback path, never by a component's own local re-render; the new `patchList()`
  keyed-reconciliation helper is what actually solves "destroys focus/selection," since for a text
  filter the triggering state genuinely changes every keystroke — the fix isn't skipping re-runs, it's
  reusing unchanged DOM nodes within them.
- **Wire up `useVirtualizer`** so the 100,000-row claim is true on the client too.
- **Real budgets in CI — [CLOSED (mechanical part), this pass].** There was no CI at all in this repo
  before this pass — confirmed, no `.github/workflows` directory existed — so the existing gzip check
  (and every C# test) only ever ran if a developer happened to run it by hand. Added
  `.github/workflows/ci.yml`: a `.NET` job (`dotnet build`/`dotnet test` against `LaughTale.slnx`) and
  a client job (`npm run verify` + `npm run build`) on every push/PR. Extended the gzip check itself to
  per-island chunk weight as asked: a new `scripts/check-chunk-budgets.mjs` reads the ESM build's own
  metafile (now persisted to `dist/meta.json`), checks every output whose `entryPoint` is a
  `src/components/*.ts` file (a genuine per-island code-split point) against a 20 KB gzip budget, and
  deliberately excludes shared/vendor chunks (react-dom, vue — identifiable by an `entryPoint` under
  `node_modules/`), which are one-time shared costs, not a single island's weight.
  **Actually running the production build for the first time in a long while surfaced three real,
  previously-hidden problems, none related to this pass's own changes**: (1) `npm run build` couldn't
  get past its own `tsc --noEmit` step at all — `react`/`react-dom`/`svelte` have no installed type
  declarations (confirmed: no `types` field, no `.d.ts`, and `@types/react`/`@types/react-dom` were
  never installed, deliberately, same reasoning as not installing `svelte` itself), fixed with a small
  ambient-declaration file rather than adding real dependencies this package's own "zero-dependency
  core" design doesn't want. (2) A genuine `ReferenceError` in `radio-button.ts`'s group-mode change
  handler (an undefined `hiddenInp`, one line away from the correct `formField` variable already used
  twice in the same function) — every selection in a multi-option radio group has been throwing and
  silently skipping its own `change`-event dispatch, unrelated to typecheck, caught only because fixing
  (1) finally let the build reach real bundling. (3) The "IIFE Standalone Runtime" bundle was 3.6 KB
  over its own 45 KB budget: `runtime.ts` (the lean, framework-agnostic entry point) re-exported
  `createPreactIsland` — react/vue/svelte's adapters are NOT re-exported there, only preact was, an
  inconsistency — which meant esbuild inlined the entire Preact library into every consumer of the lean
  runtime script tag, whether or not they use Preact (IIFE can't code-split around a dynamic import the
  way the ESM build does). Removed that one re-export; fixed. Once fixed, the "Complete All-in-One
  Bundle" (76 components + every framework adapter's library, genuinely inlined whole) measured 377 KB
  gzip against a stale 250 KB budget set once (before all 76 components and 4 adapters existed) and
  never revisited — corrected to 420 KB with headroom, not silently widened to just clear today's
  number; Part M already documents this bundle as an intentional escape hatch, not the recommended
  path, so real size enforcement stays on the two smaller bundles instead.
  **Explicitly deferred, not mechanical**: hydration-time budgets (`runtime/benchmark.ts` is fully
  built and unit-tested but has no real caller anywhere - wiring it into a CI assertion needs a real
  browser driving actual hydration, not just Node/happy-dom) and a Lighthouse run on the Showcase -
  both closer to new infrastructure than to "extend an existing check."
- **Publish honest numbers** — a reproducible benchmark against Blazor Server and WASM: TTFB, TTI,
  transferred bytes, memory after 50 navigations. Worth more than every adjective in the README.
- **Report Core Web Vitals** back through the instrumentation hook (Part H).

**Payload and serialization — the part this roadmap missed. — [CLOSED (partial), this pass]** Every
island writes a `data-props` JSON blob into the HTML, and nothing about that path was tuned:

- **Defaults were serialized.** `IslandJson` set `DefaultIgnoreCondition = WhenWritingNull`, which
  dropped nulls but not defaults. The roadmap's original count here — "198 of 325 properties have a
  non-null default" — was stale; re-counting against the current `LaughTale.Components/Models/
  ComponentModels.cs` found **401 of 665** properties across the 81 `[Island(...)]` records with a
  non-null default. Since C#'s `default` for any non-nullable value type (bool, int, every enum) is
  never `null`, `WhenWritingNull` could never omit those regardless of whether the author set them —
  every bool, int and enum prop on every island was written on every render.
  **Fixed.** `IslandJson.CreateDefaultOptions()` now sets `DefaultIgnoreCondition =
  JsonIgnoreCondition.WhenWritingDefault`. *Measured, 5-island sample, no attributes set*:
  `<island-accordion>` 18 → **2 bytes**, `<island-datatable>` 208 → **2 bytes**, `<island-select>`
  209 → **75 bytes**, `<island-checkbox>` 123 → **17 bytes**, `<island-slider>` 57 → **2 bytes** — a
  weighted ~84% reduction across the sample. All 313 pre-existing tests plus 8 new regression tests
  (`LaughTale.Tests/Serialization/IslandPropsPayloadTests.cs`) pass unchanged.
- **Serialization was reflection-based; no `JsonSerializerContext` existed anywhere in the solution.**
  `IslandGenerator.GenerateTagHelper`'s `BuildProps()` returned a fresh anonymous type per island model
  (plus `Pt`/`StudioOverrides` and FormControl-specific fields) — and `[JsonSerializable]`/
  `JsonSerializerContext` **cannot target anonymous types at all**, a hard Roslyn/`System.Text.Json`
  constraint with no workaround. This is why trim/AOT-safe serialization had never been attempted.
  **Partially fixed, and the rest turned out not to be fixable as designed.** `BuildProps()` now
  returns a named `internal sealed record {TagHelperName}WireProps` per island (67 of them, one per
  generator-emitted TagHelper — same field set as the old anonymous type, mechanically renamed) instead
  of `new { ... }`, which does remove the literal anonymous-type blocker. But wiring a working
  `JsonSerializerContext` for those 67 types — the actual point, reflection-free serialization — does
  **not** work, confirmed two different ways: (1) emitting `[JsonSerializable(typeof(...WireProps))]`
  on a partial `JsonSerializerContext` from `IslandGenerator` itself left `System.Text.Json`'s own
  source generator unable to even find that class (its abstract members went unimplemented — Roslyn
  generators do not see each other's generated syntax within one compilation pass, confirmed against
  the documented behavior); (2) moving the identical attributes onto a hand-written, checked-in host
  class (so the class declaration is original source, not generator output) fixed *that* error, but
  `System.Text.Json`'s generator then silently failed to generate metadata for every one of the 67
  types (`SYSLIB1030`, one per type), while an otherwise-identical, fully hand-written probe type in
  the same file succeeded — so a type merely *existing* as generator output blocks it, independent of
  which file hosts the context. Reflection remains the only working path for these 67 types today. The
  seam is still in place for whenever this becomes solvable (e.g. if `WireProps` types are ever moved
  to their own, separately-built project): `IslandJson.SerializeProps(object?, IJsonTypeInfoResolver?)`
  accepts an optional additional resolver, combined ahead of the reflection fallback via
  `JsonTypeInfoResolver.Combine`, with `LaughTale.Core` never referencing `LaughTale.Components` or the
  generator output — proven correct against a fully hand-written type/context pair
  (`IslandJsonTests.cs`), just not yet exercised by any real caller.
  The 15 hand-written TagHelpers' own separate `new { ... }` anonymous-props code path (`Aura/
  {Menu,Messages,Misc,Overlay}/*.cs`) was **left untouched** — converting it was explicitly a stretch
  goal for this pass and, unlike the generator-emitted path, would actually be able to use real
  source-gen (no second generator involved), but 15 working, hand-maintained components were judged
  not worth touching without dedicated follow-up time.
  *Trim analysis*: `<IsTrimmable>`/`<EnableTrimAnalyzer>` enabled for the first time on `LaughTale.Core`
  and `LaughTale.Components` (no trim/AOT attempt existed anywhere before this pass). Result: **30 IL
  warnings** solution-wide. Two are the irreducible cost of keeping a reflection fallback at all
  (`IslandJson`'s `DefaultJsonTypeInfoResolver` construction and its generic `JsonSerializer.Serialize`
  call — inherent while `BuildProps()` returns `object?` and hand-written/arbitrary props types exist).
  The other 28 are pre-existing, unrelated to props serialization (minimal-API `MapGet`/`MapPost`
  reflection and `Assembly.GetTypes()`-based authorization discovery in
  `LaughTale.Core/Endpoints/IslandEndpointExtensions.cs` and
  `LaughTale.Core/Security/IIslandAuthorizationRegistry.cs`; reflection-based dynamic form/query building
  in `LaughTale.Components/Forms/DynamicFormSchema.cs` and `LaughTale.Core/Data/QueryableExtensions.cs`;
  the legacy imperative `IslandTagHelper.Props` reflection path) — out of scope for this pass, reported
  rather than silenced.
- **The props object is still rebuilt per render.** Unchanged by this pass — the generator emits a
  fresh `WireProps` instance per TagHelper invocation, then serializes it. For a table of 500 rows with
  an island per cell that is still 500 allocations and 500 serializations of near-identical JSON.
  *Fix: cache by value, or hoist shared props to the ambient state pool (Part F). (M · 2 wks)*
- **No compression story for the attribute payload.** Unchanged. `data-props` is inline HTML, so it
  compresses with the document — but it defeats any future streaming or partial-update path that wants
  to send markup without re-sending props.

---

## 12. Part K — Authorization & multi-tenancy

`IIslandAuthorizationRegistry` is a sound design. The problems are the permissive default (§1.2) and
how much of the enterprise story stops at that one policy string.

- **Deny by default.** Unregistered islands refuse refresh unless explicitly `[IslandPublic]`. Add an
  analyzer flagging any refresh-reachable island with neither.
- **Authorize the data endpoint too** — it's the one that actually executes queries. Mandatory
  per-island field allowlists.
- **Row-level filtering as a first-class concept.** An island can be authorized while its query still
  returns another tenant's rows. A tenant discriminator applied automatically by the data contract,
  plus an analyzer error when a queryable is exposed without one.
- **Cache keys must include identity** — extend `[IslandPrivate]` to tenant and role.
- **Handle session expiry during client navigation** — a 401 mid-refresh should trigger re-auth, not
  a hydration error.
- **Audit trail** — log refreshes with principal, policy and outcome. Regulated buyers ask in the
  first security review.

---

## 13. Part H — Security & production

- **Rate-limit the island endpoints. — [CLOSED, this pass]** This item's own count was stale: by the
  time this closed there were **three** public `MapPost` routes accepting user-shaped requests, not
  two — `MapLaughTaleIslandRefresh`, `MapIslandData<T>` (the one this item specifically named, filter/
  sort against EF Core with no limiter), and `MapLaughTaleIslandAction<TProps>` (added by the same-day
  Plugin API work, running a server-side delegate per request). All three are now covered.
  Implementation is a manual per-request check (`LaughTale.Core/Security/LaughTaleRateLimiter.cs`,
  a `PartitionedRateLimiter<HttpContext>` wrapping .NET's built-in sliding-window limiter) added as a
  new first step inside each endpoint's existing antiforgery→authorization→work handler — the same
  triad idiom these endpoints already use — rather than ASP.NET Core's `RequireRateLimiting()` +
  `UseRateLimiter()` middleware pair. Neither of this repo's two real `Program.cs` examples calls
  `UseRateLimiter()` today and this endpoint code can't retroactively add pipeline middleware, so
  metadata-based enforcement would have shipped silently inert for any consumer who just calls
  `Map...()` — the same "built but never wired up" trap this session already found and fixed twice
  elsewhere (directives double-init, the antiforgery/`FormTagHelper` assumption). Partitioned by
  authenticated user name, falling back to remote IP for anonymous requests (`IslandRateLimitOptions.
  PartitionByUser`), configured via `options.RateLimit` on `AddLaughTale()` exactly like `Refresh`.
  **Defaults to disabled** — deliberately *not* mirroring `RequireAntiforgery`'s default-on posture,
  because antiforgery's default-on is free (ASP.NET Core's own global antiforgery is already active
  for every consumer via `AddRazorPages()`), while a request limit has no such platform precedent and
  would silently start rejecting real traffic the moment an existing app upgrades, at a threshold this
  library can't know is right for that app's actual usage. Caught concretely during implementation: a
  default `PermitLimit` broke an existing test firing 50 legitimate consecutive requests from one
  synthetic client (`AllowUndeclaredIslandsCompatibilityTests`) — proof the default-on instinct was
  wrong here, not just a theoretical concern. Tests: `LaughTale.Tests/Security/RateLimitingTests.cs`
  (permit-limit enforcement, disabled-by-default, per-IP and per-user partition independence).
- **Secure-by-default field allowlist. — [CLOSED, this pass]** The "secure-by-default" half was already
  done: §1.2 closed in Spec 041 (deny-by-default authorization, `IslandFieldPolicy` a mandatory,
  non-nullable parameter — omitting it is already a compile error, not just a convention). What was
  actually still open was the diagnostic half. Also a naming correction: the roadmap calls it an `SMI`
  diagnostic, but every diagnostic actually implemented in `IslandGenerator.cs` uses an `LTI` prefix
  (`LTI001`/`LTI002`/`LTI004`/`LTI005`) — `SMI` only ever appeared in code comments as an informal
  nickname, never as a real `DiagnosticDescriptor.id`, and `SMI003`/`SMI005`–`SMI008` (marked "done" in
  `ROADMAP.v4.md`) don't exist anywhere in the codebase either — another stale roadmap claim, same
  pattern as the endpoint-count and page-size-ceiling ones above. Added **`LTI006`** (Warning, not
  Error — this can't know whether a given DTO actually has a sensitive field, only that the caller chose
  the escape hatch): fires on any use of `IslandFieldPolicy.AllMappedProperties`, the documented opt-out
  that re-exposes every public property on the queried type to client-driven filtering/sorting/search.
  Architecturally new for this generator: the existing diagnostics all scan `[Island]`-attributed type
  declarations via `ForAttributeWithMetadataName`; this one scans arbitrary call sites anywhere in the
  compilation via a second `CreateSyntaxProvider`, resolving the member-access symbol through the
  semantic model to confirm it's really `LaughTale.Core.Data.IslandFieldPolicy.AllMappedProperties`
  (not an unrelated same-named member elsewhere) before reporting. Verified it doesn't fire anywhere in
  this repo's own real consumer projects (Showcase, Docs, Components all build clean). Tests:
  `LaughTale.Tests/Generators/UnguardedFieldAllowlistDiagnosticTests.cs`, driving `IslandGenerator`
  directly via `CSharpGeneratorDriver` (same harness as `FormControlEmissionTests.cs`) — fires on direct
  and variable-assigned usage, stays silent for an explicit `IslandFieldPolicy.For(...)` allowlist and
  for an unrelated type exposing a same-named member.
- **Lower the page-size ceiling. — [CLOSED, this pass]** The `Math.Clamp` was already there
  (`QueryableExtensions.cs`), just at a fixed `10000` — no smaller than "unbounded" against a slow
  filter/sort, and not configurable at all. Moved the ceiling onto `IslandFieldPolicy` itself
  (`MaxPageSize`, default 200, `DefaultMaxPageSize` constant) rather than a second parameter threaded
  through every `MapIslandData` call — it's the same per-island security policy object as the field
  allowlist, and a page-size ceiling is exactly the same kind of "how much can a single request make
  this endpoint do" concern. Per-island override via `IslandFieldPolicy.For(...).WithMaxPageSize(n)`.
  3 new tests in `IslandDataContractTests.cs` (default-ceiling clamp, a tighter override, a looser
  override). Complements Part H's rate limiting: rate limiting bounds *how often* a client can call the
  endpoint, this bounds *how expensive* any single call can be — together they cover both halves of
  the same `MapIslandData` DoS surface.
- **Deployment presets** *(Nitro)* — verified Azure App Service, container and IIS configs covering
  asset hashing, compression, CDN headers. Removes more first-day friction than anything else. *(M · 3 wks)*
- Then: **image optimization** *(Astro, Next)*, **font optimization**, and an **instrumentation hook**
  exporting island render/hydration timings as OpenTelemetry spans.

---

## 14. Part G/L — DX & plugin architecture — **[CLOSED (mechanism + 1 of 3 validation plugins), this pass]**

Build the plugin API **before** Parts E and F, so streaming, actions and cache tags are written as
first-party plugins against your own interface. Nothing proves an extension point like being forced
to use it.

**Four extension points — three built, one dropped as not applicable:**

1. **Server lifecycle** — `OnConfigure`, `OnIslandRendering`, `OnResponseStarting` shipped as a
   `LaughTalePlugin` abstract base class (`LaughTale.Core/Plugins/`), mirroring `IslandTagHelperBase`'s
   own `protected virtual` no-op-default pattern. `OnIslandRendering` splices into
   `IslandTagHelperBase.ProcessAsync` itself, so all **82 of 82** TagHelpers reach it for free — zero
   generator changes, the same "fix the base class once" leverage already used for SSR/localization/RTL.
   `OnConfigure` clones the existing `EnsureLaughTaleOptions()` idempotent-singleton pattern, proven
   order-independent (registered before *or* after `AddLaughTale()`) by two passing tests.
   `OnIslandDiscovered` was **dropped** — investigation found no request-time analog exists; discovery
   only ever happens at C# compile time or Node build time, never per-request, so it was relocated into
   the build-hook `onIslandDiscovered(island)` callback below instead of kept as a dead server hook.
2. **Client runtime** — `registerAdapter`/`registerDirective` (new `adapters/registry.ts`,
   `directives/registry.ts`) clone the `globalThis`-anchored pattern `runtime/registry.ts` already
   established this session for cross-bundle correctness. Mount/unmount/error hooks needed **no new
   API** — `hydrator.ts`'s existing `laughtale:hydrated`/`laughtale:hydration-error` CustomEvents already
   satisfy this with zero code changes.
3. **Build hooks** — an optional `plugins` array threaded through `discover.mjs`/`bundle.mjs`
   (`transformSource`, `onIslandDiscovered`, `contributeEntryPoints`, `esbuildPlugin`,
   `onBundleComplete`), confirmed to need none of Part B's Roslyn-generator-visibility constraints
   (these scripts never touch a second generator). **Honestly unvalidated by a real consumer this
   pass** — the one validation plugin built (Server Actions) needs none of it.
4. **Diagnostics** — no panel registry, no overlay UI (would be exactly the "built, unused" pattern
   this document spends its first sections complaining about, with zero consumer). Ships as one
   structured `laughtale:diagnostic` CustomEvent instead, reusing timing data `hydrator.ts` already
   computes. A future DevTools overlay item stays open below, now with something real to consume.

**Validation: Server Actions (Layer 1) — [CLOSED].** A real `<island-form>` TagHelper
(`LaughTale.Components/TagHelpers/Aura/Forms/IslandFormTagHelper.cs`) posting to a plain Razor Pages
handler, verified live in a real browser (`LaughTale.Showcase/Pages/ServerActions.cshtml`) — click
Increment, a real antiforgery-protected POST fires, the server increments state and returns a
`Partial()` fragment, the DOM swaps with zero page reload. **The most important finding from building
it: the generic plugin API above is not load-bearing for Server Actions at all.** An already-shipped
mechanism (`directives/htmx.ts`'s `bindServerAction()`, the `l-get`/`l-post`/`l-put`/`l-delete`
fragment-action engine) already did the entire intercept-fetch-swap job — exactly the finding "write
the first three yourself" exists to produce. Cache tags and the SSR sidecar remain open, per the
original plan's own honest effort estimates (deferred, not attempted this pass).

**Two significant, previously-undiscovered bugs found and fixed while getting Server Actions to a real
live-browser proof — both pre-existing, unrelated to the plugin API itself, neither ever caught because
nothing had exercised these paths in a real browser until now:**
- **A systemic double-initialization bug affecting every directive on every page.**
  `directives/index.ts` had its own module-load "auto-run" side effect calling `initDirectives()`
  automatically, *in addition to* every real consuming app (`LaughTale.Showcase`, `LaughTale.Docs`)
  already calling it explicitly themselves. Confirmed via a real browser: a single genuine form submit
  fired two independent `fetch()` calls. This means **every directive in this framework** —
  `l-on:*`, `l-poll`, `l-intersect`, `l-hotkey`, `l-tooltip`, `l-mask`, `l-badge`, `l-teleport`, not
  just Server Actions — has likely been double-bound on every real page load this entire time. Fixed by
  removing the redundant auto-run (confirmed safe: both real consuming apps already made their own
  explicit call). A Node/happy-dom test can't faithfully reproduce the exact browser timing that caused
  it, but the underlying "no idempotency guard" property is now covered by a real, passing test.
- **`htmx.ts`'s `outerHTML`/`beforebegin`/`afterend` swap modes never correctly re-bound the swapped-in
  content.** `target.outerHTML = html` replaces `target` in the DOM, but the `target` JS variable keeps
  pointing at the old, now-detached node (a well-known DOM gotcha) — the old code re-initialized
  directives against that orphaned subtree, a proven no-op, while the actual live replacement never got
  `bindServerAction()` re-attached. Confirmed via a real browser: a second form submission silently fell
  through to an uncaptured native POST with no antiforgery interception at all. Fixed by re-resolving the
  live element via the same target selector after these swap modes.

Ship plugins as **NuGet + npm pairs** with a single install command — **deferred**. Everything lands
directly in `LaughTale.Core`/`LaughTale.Components` this pass (already referenced by every consumer, so
"single install" is trivially true with nothing new to install); packaging as separately-installable
pairs is explicitly deferred until a second real plugin (cache tags or the SSR sidecar) is built against
the same `LaughTalePlugin` shape without needing to change it — proof the interface is stable enough to
freeze into a package boundary.

**DX items:**

- **DevTools overlay — [CLOSED, this pass]** In-page floating panel (Nuxt DevTools / Astro toolbar
  model — explicitly not a Vue-DevTools-style browser extension) consuming the `laughtale:diagnostic`
  event this same roadmap section built as its own extension point. One correction along the way: "you
  already... have `IslandDiagnostics`" doesn't hold up as stated — `IslandDiagnostics` is real, but it's
  a server-side dev-only TagHelper-output validator (`data-laughtale-warning-*` attributes), not a
  client state tracker; there was no such tracker until this pass built `LaughTale.Client/src/devtools/state.ts`.
  Shows every island's strategy, live hydration state, mount duration, and props size (labeled honestly
  as raw JSON length, not a byte size), a Retry button on failed islands wired directly to the existing
  `retryIsland()`, and an outline-with-live-label mode for every island on the page. **Chunk weight
  explicitly deferred** — no runtime-reachable island→chunk mapping exists yet (the manifest that would
  supply it is a build-time artifact never served to the client), and the framework's default bundle
  mode is a single IIFE anyway, where "chunk weight" isn't a coherent per-island concept.
  Dev/Production gating threads through a new `<laughtale-devtools />` TagHelper mirroring
  `IslandDiagnostics`'s own zero-DI `LaughTaleEnvironment.IsDevelopment` idiom rather than inventing new
  options plumbing — deliberately not extending `ThemeStudioOptions`, confirmed during this pass to be a
  fully dead stub referenced nowhere in the codebase. Loaded via dynamic `import()` so production
  bundles never fetch it. **Two real bugs found via live-browser verification, not caught by unit
  tests**: (1) the TagHelper initially rendered `<script />` (self-closing, content silently discarded)
  because `TagHelperOutput` inherits `TagMode.SelfClosing` from the `<laughtale-devtools />` source
  syntax and setting `.Content` alone doesn't change that — a plain `output.Content` assertion in xUnit
  never exercises real HTML serialization, so this needed an explicit `TagMode` assertion in the test to
  actually catch it. (2) The outline labels were positioned via `getBoundingClientRect() + window.scroll`
  and repositioned on scroll/resize events — visibly laggy, because this app's layout scrolls an inner
  content pane, not the window, and per-event recompute during a fast scroll gesture is exactly the
  "layout thrashing" pattern that causes visible jank. Fixed by switching the label to `position: fixed`
  (already viewport-relative, matching `getBoundingClientRect()` directly with no scroll-offset math
  needed) tracked by a `requestAnimationFrame` loop instead of scroll/resize listeners — simpler, and
  correct for any scroll source uniformly, not just window-level scroll.
- **Dev error overlay** *(S · 1 wk)* — island name, props that failed to revive, stack.
- **HMR for islands** *(S–M · 2 wks)* — nearly free once the Part B manifest exists.
- **Layers / theme inheritance** *(Nuxt layers · M · 3 wks)* — how an agency ships one house theme
  across twelve client apps.
- **Typed routes & auto-imports** *(S–M · 2 wks)* — Roslyn makes this easier for you than for Nuxt.
- **Extend the CLI** *(S · 1 wk)* — today `list` and `eject`. Add `new island`, `doctor`, `analyze`.

---

## 15. Part N — Localization, formatting & internationalization — **[CLOSED, this pass]**

**Was the most complete subsystem in this repository that reached almost nothing.** 1,509 lines —
`ILaughTaleLocalizer`, a generic key/value resolution mechanism, and options in
`LaughTale.Core/Localization/`, plus the typed 70-property locale dictionary and **9 built-in
language packs covering 10 culture codes** (`ar`, `ckb`, `de`, `en`, `es`, `fr`, `ja`, `ku`, `tr`,
`zh`), two of them right-to-left, now in `LaughTale.Components/Localization/`. It was well built and,
for practical purposes, switched off. It is now wired end to end.

| Built | Adoption |
|---|---|
| `ILaughTaleLocalizer` | consumed by `IslandTagHelperBase` — **[CLOSED, TagHelper split]** reachable from **82 of 82** TagHelpers (was 15 of 96) |
| `useLocale` (client) | **17 of 76** components (was 5) — the 3 real pre-existing call sites (`datatable`, `datepicker`, `select`) plus 14 newly wired: `autocomplete`, `command`, `fileupload`, `input-password`, `listbox`, `menu`, `menubar`, `multiselect`, `orderlist`, `picklist`, `sidebar`, `tieredmenu`, `tree`, `tree-select` |
| RTL / logical properties | **8 of 76** components (corrected count; was reported as 7), **2** uses of CSS logical properties — **not addressed by this pass**, tracked as a follow-up below. **[CLOSED in a later pass, §5]** — `rtlAdoption` is now 49/76; see §5's "RTL & logical properties" entry for the CSS conversion, icon-mirroring, and 5 behavioral-fix breakdown |
| Component UI strings routed through the localizer | **31 of 31** hardcoded server-side prop defaults, **13 of 13** hardcoded client-template strings — **[CLOSED]** (was 0; the roadmap's original count of "25" hardcoded defaults undercounted — the real number, confirmed by re-reading every props record, was 31) |

**The strings were hardcoded, and they were hardcoded in the wrong layer.** Thirty-one English UI
strings shipped as *default values on the C# props records* — `"Add a tag..."`, `"No records found."`,
`"Drag & Drop files here or browse"`, `"Filter items..."`, `"Click to edit..."`, `"Choose"`,
`"Cancel"`. A default value in a record is resolved at construction, before any request context
exists, so no localizer could ever reach it. More English was hardcoded directly in client templates
(`>No options found<`, `>No results found<`, `>New chat<`). A Japanese user of `<island-datatable>`
got a localized *culture* and an English empty-state.

**Fixed.** All 31 server-side defaults now resolve `PropValue ?? ILaughTaleLocalizer["key"]` at
render time (27 via a small hardcoded `(TypeName, PropertyName) -> localeKey` map in
`IslandGenerator.GenerateTagHelper`, 3 on the hand-written `ConfirmPopupTagHelper` /
`CommandMenuTagHelper`, 1 — `DynamicFormSchema.SubmitLabel` — via an optional `ILaughTaleLocalizer?`
parameter on `DynamicFormSchemaGenerator`), falling back to English when no culture-specific
translation or no `ILaughTaleLocalizer` is registered at all, so plain-Core apps are unaffected. All
13 client-template strings now call `locale.t('key') || 'original English string'`, matching the
`datatable.ts` pattern that was already correct. `fileupload.ts` and `input-password.ts`'s previously
dead `useLocale` imports are now wired and used for the password-strength and file-action labels.

### The vocabulary was in the wrong project — **[CLOSED, this pass]**

The *mechanism* is correctly placed. `ILaughTaleLocalizer`, culture resolution, `IsRightToLeft` and the
`CustomDictionaries` override hook are generic infrastructure and belong in Core.

The *content* did not. `LaughTaleLocaleDictionary` was a sealed class of **70 typed properties** living
in `LaughTale.Core.Localization`, and they are component vocabulary:

| Properties | The component they exist for |
|---|---|
| `Weak`, `Medium`, `Strong`, `PasswordPrompt` | `input-password` |
| `Choose`, `Upload`, `Cancel`, `Completed`, `Pending` | `fileupload` / `dropzone` |
| `StartsWith`, `Contains`, `EndsWith`, `Lt`, `Lte`, `Gt`, `Gte`, `DateIs`, `DateBefore` | `datatable` filter menu |
| `DayNames`, `MonthNames`, `WeekHeader`, `DateFormat`, `Today` | `datepicker` |
| `EmptyFilterMessage`, `SelectionMessage`, `EmptySelectionMessage` | `select` / `multiselect` / `listbox` |

That was PrimeVue's locale shape lifted wholesale into `LaughTale.Core`, plus 674 lines of language
packs filling it in for ten locales. **Core knew what a password strength meter is.** Two
consequences, both worse than the tidiness complaint:

1. **You could not add a component without editing Core.** A new island with new strings meant adding
   properties to a sealed class in the layer that is supposed to know nothing about components. That
   contradicted the plugin architecture in Part G/L directly: a third-party island got the `Custom`
   string bag, never first-class localization. Two tiers, built in.
2. **`CoreOnlyBoundaryTests` could not see it.** The test asserted only
   `coreAssembly.GetReferencedAssemblies()` contains no `LaughTale.Components` — a *reference* check.
   Core could hardcode the entire component vocabulary and stay green forever. The constitution says
   this boundary is "enforced by `CoreOnlyBoundaryTests.cs`, not by convention". Only the assembly
   direction was enforced. The semantic direction was pure convention, and it was already broken.

**Fixed.** `LaughTaleLocaleDictionary` and `LaughTaleBuiltInLocales` moved to
`LaughTale.Components.Localization` unchanged in shape (still 70 typed properties, still 10 language
packs, now 83 typed properties after the 13 new UI-copy keys this pass added). `ILaughTaleLocalizer`
in Core became fully generic: `GetDictionary()` now returns `IReadOnlyDictionary<string, string>`
instead of the concrete `LaughTaleLocaleDictionary` type, and `LaughTaleLocalizationOptions` gained a
second, lower-priority `BuiltInDictionaries` registration surface (`AddBuiltInLocale`) alongside the
existing user-facing `CustomDictionaries` (`AddLocale`) — so `LaughTale.Components`'
`AddLaughTaleComponents()` seeds all 10 built-in locales automatically, and an end user's `AddLocale`
call always wins regardless of DI registration order. `CoreOnlyBoundaryTests` now asserts, by
reflection, that no type named `LaughTaleLocaleDictionary` or `LaughTaleBuiltInLocales` exists in the
Core assembly and that `LaughTaleLocalizationOptions`'s public surface is exactly its expected
BCL-typed member set — a test that fails against the pre-refactor shape and passes against this one.

| Item | From | Effort | Status |
|---|---|---|---|
| **Move the vocabulary down, keep the mechanism up** — `LaughTaleLocaleDictionary`'s 70 typed properties and the 10 language packs move to `LaughTale.Components` and register themselves with the Core localizer; Core keeps culture resolution, RTL and the override hook and learns nothing about components | — | M · 2–3 wks | **[CLOSED]** |
| **Make the boundary test see meaning, not just references** — extend `CoreOnlyBoundaryTests` to fail when component nouns appear in Core. Without this the inversion returns the first time someone adds a component with a new string | — | S · days | **[CLOSED]** |
| **Route component strings through the localizer** — remove the 31 English defaults from props records (roadmap previously undercounted this as 25) and the 13 hardcoded strings from client templates; resolve per request, fall back to the built-in dictionary | — | M · 2–3 wks | **[CLOSED]** |
| **Fix the TagHelper split first** (§0, *The root cause nobody named*) — **[CLOSED]** the localizer is only reachable from `IslandTagHelperBase`; 67 of 81 generated TagHelpers now derive from it (14 skipped as redundant with a hand-written class), so all 82 remaining TagHelpers can see the localizer. The rows below (moving the vocabulary, routing component strings, RTL) were blocked on this and can now proceed | — | — | **[CLOSED]** |
| **RTL & logical properties** — 8 of 76 today (corrected count; previously reported as 7); `dir` already flows through `IslandContext` and two of the ten built-in locales are RTL, so the demand already exists in the shipped product. **Not addressed by this pass** — this pass closed vocabulary routing only, not RTL adoption | web platform | S–M · 1–2 wks | **[CLOSED in a later pass]** — see §5 |
| **Locale-aware formatting as a contract** — dates, numbers, currency and collation are decided per component today (`datepicker`, `input-number`, `select` each reach for `Intl` on their own). One `useLocale`-backed formatter, adopted by all 76 | Nuxt i18n, Astro i18n | M · 2 wks | Open |
| **Locale-aware routing** — `/de/produkte`, `Accept-Language` negotiation, `hreflang`, per-locale static output | Nuxt i18n, Astro i18n | M · 2–3 wks | Open |
| **Pluralization and interpolation** — the dictionary is key→string today; anything with a count needs plural rules | ICU MessageFormat | S–M · 1–2 wks | Open |
| **Translator workflow** — extract keys at build time, emit a catalogue, diff it in CI so a new untranslated string fails the build rather than shipping English | Nuxt i18n, Lingui | M · 2 wks | Open |

**Why this belonged on the roadmap at all**: LaughTale's pitch is ASP.NET Core, and ASP.NET Core's
audience is disproportionately enterprise and non-US. `IStringLocalizer` is something .NET developers
already expect to work. Shipping 9 locales and 31 hardcoded English strings in the same product was
worse than shipping neither, because it looks finished.

---

## 16. Framework capability matrix

| Capability | Origin | LaughTale today | Part |
|---|---|---|---|
| Islands + partial hydration | Astro, Fresh | **Strong** — 6 strategies, shared observer | — |
| Design tokens & theming | — | **Strong** — 247 tokens, palette gen, contrast checker | — |
| Safe server data contract | — | **Strong** — expression trees, allowlists | H |
| View-transition router | Astro | **Strong** — prefetch, head reconciliation | — |
| Scoped style injection | — | **Strong** — `adoptedStyleSheets`, 75/76 | M |
| Module layering | — | **Strong** — zero sibling coupling | M |
| CSP-safe expressions | *(Alpine can't)* | **Unique** — AST evaluator, no `eval` | I |
| Directive layer | Alpine, Stimulus | **Built, undocumented** — 19 directives | I |
| Composable primitives | Nuxt, Vue | **Built, unused** — 21 written, ~0 adopted | C |
| Imperative handles | — | **Adopted — [CLOSED, this pass]** — `dialog`, `toast`, `datatable` implement `createHandle`; the mechanism itself was already sound | C |
| Localization & i18n | Nuxt i18n, Astro | **Strong — [CLOSED, this pass]** — TagHelper split fixed (82/82 reach the localizer); vocabulary moved to `LaughTale.Components`; all 31 hardcoded English defaults and 13 client-template strings routed through it; 10 locales, 1,509 lines. Locale-aware formatting/routing/pluralization/translator workflow remain open follow-ups | **N** |
| Locale-aware routing | Nuxt i18n | **Missing** | **N** |
| RTL support | web platform | **Substantially improved — [CLOSED, this pass]** — `rtlAdoption` 8/76 → 49/76. CSS logical-property conversion across 42 components + targeted gap-fixes in 5 of the original 8; icon mirroring extended to 7 more components; 5 behavioral/JS geometry bugs fixed with unit tests (`useFloatingPosition` — 14 consumers, `slider`, `splitter`, `rating`, `toggle-switch`). Not a blanket claim: `scrollarea`'s scrollbar-drag math is flagged but unfixed (cross-browser `scrollLeft` disagreement under RTL), and `speed-dial`/`toast`'s explicit corner/fan-out positioning is intentionally left physical, not logical | **N** |
| Props payload efficiency | — | **Improved — [CLOSED, this pass]** — `WhenWritingDefault` now omits default-valued props (corrected count: 401/665 had non-null defaults, not the roadmap's stale 198/325); ~84% payload reduction on a 5-island sample | **J** |
| AOT / trim-safe serialization | .NET | **Attempted, not achievable as designed** — generator-emitted anonymous props types replaced with named records (unblocks `[JsonSerializable]` targeting them in principle), but no two-Roslyn-generator combination can actually produce a working `JsonSerializerContext` for them (confirmed empirically, see Part J); reflection remains the only path. Trim analysis enabled for the first time: 30 IL warnings, 2 attributable to this path (irreducible), 28 pre-existing/unrelated | **J** |
| HTML sanitization at render | — | **CRITICAL** — sanitizer exists, 4/76 call it | §1 |
| Listener lifecycle | — | **CRITICAL** — 374 unmanaged | §1 |
| Authorization default | — | **FAIL-OPEN** — unregistered islands unguarded | §1, K |
| Typed TagHelper generation | Fresh | Partial — generator exists, no user input | B |
| Streaming SSR | Next, Nuxt | Partial — in-order only | E |
| Per-island code splitting | Astro, Qwik | Partial — ESM splits; IIFE ships all 76 | B |
| Signals / fine-grained reactivity | Qwik, Solid | **Strong — [CLOSED, this pass]** — real `signal`/`computed`/`effect`/`batch` (`runtime/signals.ts`), backing `l-bind`/`l-model`/`l-class`/`l-style`/`l-show`/`l-hide`/`l-if`/`l-for`; `multiselect.ts` and `datatable.ts` retrofitted as proof, `autocomplete.ts` deliberately next | I |
| Perf budgets in CI | — | **Adopted — [CLOSED (mechanical part), this pass]** — real CI now exists at all; gzip check extended to per-island chunks; hydration-time/Lighthouse still deferred | J |
| Icon system | — | **Strong — [CLOSED (75%), this pass]** — module already existed; retrofitted 33 of ~37 components, `rawSvgLiterals` 212 → 53, remaining 53 deliberately kept (pre-redesign shapes with no current match, or render properties/CSS hooks the module can't express) | M |
| Typed content collections | Astro | **Strong — [CLOSED, this pass]** — already fully typed end-to-end; the one real gap (silent schema-mismatch swallowing) is now a loud failure | F |
| Safe rendering primitive | Lit `html\`\`` | **Strong — already closed before this session, roadmap was stale** — `runtime/html.ts` + a `verify-contracts.mjs` lint gate ban raw `innerHTML` outright; `innerHtmlRawAssignments: 0` across all 76 components today | M |
| Island compiler / discovery | Fresh, Nuxt | **Missing** | B |
| Framework SSR | Astro, Nuxt | **Missing** — client-only mount | D |
| Post-mount prop updates | Astro, Nuxt | **Partial — [CLOSED (mechanism), this pass]** — `update(props)` on the adapter contract, refresh prefers it over morphing, for React/Vue/Preact (`adapterUpdateSupport` 0→3); Svelte and vanilla deliberately excluded, see Part D | D |
| Nested islands | Astro | **Missing** | D |
| Plugin / module API | Astro, Nuxt, Fresh | **Missing** | L |
| Server actions + PE | Next, Remix, Astro | **Missing** | F |
| Partials / frame navigation | Fresh, Turbo | **Missing** | E |
| Resumability / delegated events | Qwik | **Missing** | E |
| Route rules / hybrid render | Nuxt | **Missing** | E |
| Nested layouts / outlets | Nuxt, Next | **Missing** | E |
| Cache tags & invalidation | Next, Nitro | **Missing** | F |
| ISR | Next | **Missing** | F |
| Ambient shared state | Nuxt | **Missing** | F |
| Layers / theme inheritance | Nuxt | **Missing** | G |
| DevTools | Nuxt, Astro | **Missing** | G |
| HMR | Vite | **Missing** | G |
| Image & font optimization | Astro, Next | **Missing** | H |
| Deployment presets | Nitro | **Missing** | H |
| Endpoint rate limiting | — | **Missing** | H |
| Row-level security / tenancy | — | **Missing** | K |
| Audit logging | — | **Missing** | K |

---

## 17. Build order

| When | What |
|---|---|
| **Weeks 1–3** | Ship `html\`\``, then the urgent three: migrate components onto it, pass `ctx.signal` to all 374 unmanaged listeners, flip authz and the field allowlist to deny-by-default. Then CI/README cleanup. **Nothing else starts until this does.** |
| **Weeks 2–6** | **[CLOSED — Specs 040, 042, 043, 044]** Adopt your own composables and event runtime — `useFocusTrap` (7/7 modals), `useKeyboardNav` (7/7 hierarchical), `useFloatingPosition` (14/14 overlays), `useVirtualizer` (6/6 long collections); unified component event contract `laughtale:<comp>:<evt>` (41/41 components). Findings recorded: `tieredmenu`'s cross-island toast dispatch never fired due to target mismatch (`window.dispatchEvent` vs `document.addEventListener`), now re-homed to the in-process island bus; `runtime/events.ts` was the seventh built-and-unadopted module, now fully adopted with its first callers. |
| **Weeks 4–8** | **[CLOSED — Spec 045]** Form association across all 29 form controls (`formFieldAdoption: 29`, `clientCreatedFields: 0`, 100% no-JS parity & reset), then server actions — in that order. Actions that don't degrade gracefully aren't progressive enhancement. |
| **Weeks 4–9** | **[CLOSED] Fix the TagHelper split** (§0). 81 generated TagHelpers derived from `TagHelper`, not `IslandTagHelperBase`, so SSR, localization and RTL were unreachable from the components Razor authors actually use. `IslandGenerator` now emits TagHelpers deriving from `IslandTagHelperBase`; along the way, 14 of those 81 turned out to duplicate a hand-written TagHelper targeting the same tag (two TagHelpers writing into one `TagHelperOutput`) and are now skipped instead of generated. Measured result: 67 generated + 15 hand-written = **82 of 82** TagHelpers reach the base class (was 15 of 96). This unblocks Part N and half of Part C. |
| **Weeks 5–7** | **[CLOSED (partial)]** Props payload and serialization (Part J): stopped serializing defaults (`WhenWritingDefault`, ~84% payload reduction on a 5-island sample; corrected the stale "198/325" count to the real 401/665) and replaced generator-emitted anonymous props types with named records. Source-generated JSON contexts for those 67 types turned out not achievable — confirmed two Roslyn generators cannot be combined this way — so the product is measurably smaller on the wire but still not trimmable/AOT-safe for generator-emitted islands; trim analysis is now at least turned on (30 IL warnings surfaced, 28 pre-existing/unrelated) so future attempts have a real baseline. |
| **Weeks 8–12** | **[CLOSED]** Localization for real (Part N): moved the vocabulary out of Core (`LaughTaleLocaleDictionary`/`LaughTaleBuiltInLocales` now in `LaughTale.Components`), taught `CoreOnlyBoundaryTests` to catch its return, and routed all 31 hardcoded English defaults (not 25 — the original count undercounted) and 13 client-template strings through the localizer. RTL adoption itself (8/76 components, corrected from a previously reported 7) remains open — this pass closed vocabulary routing only. |
| **Weeks 6–10** | **[CLOSED (mechanism), this pass]** Fixed the refresh/adapter corruption for React, Vue and Preact: `update(props)` on the adapter contract (additive `IslandInstance` return shape), refresh prefers it over morphing, and falls back to the original morph+remount if `update()` throws. Svelte and vanilla deliberately excluded (see Part D for why); nested islands and the other Part D rows remain untouched. |
| **Weeks 9–14** | Plugin API, then the island compiler. The stretch that turns a library into a framework — protect it from interruption. |
| **Weeks 14–18** | DevTools + HMR. Once the compiler emits a manifest there's real data to inspect. |
| **Weeks 16–24** | Partials, out-of-order streaming, cache tags. The performance story you can benchmark against Blazor Server and win. |
| **Weeks 24–36** | Route rules, nested layouts, layers, deployment presets. By now the plugin API means some of it isn't written by you. |
| **Continuous** | Rate limiting, allowlist inversion, the headless split one component at a time. |

---

## 18. The governing lesson

Thirty-eight specs are marked complete, yet:

- `specs/003-inert-html-sanitizer` shipped a sanitizer **4 of 76** components reference.
- `specs/038-wai-aria-accessibility-suite` closed with **21** components still emitting no ARIA.
- `specs/035-batched-style-injection` — the control case — landed at **75 of 76**. It *is* fixable.

Those specs delivered modules and never required adoption, so they were closed honestly and changed
nothing. Meanwhile the hex rule reports 716 violations of which 604 are legitimate.

> **Measure adoption, not delivery — and make sure the thing you measure is the thing you want.**

Every finding in this document is a rule that could have been enforced. Add each as a check in
`verify-contracts.mjs` or `audit-metrics.mjs` as you fix it. **The lint file is the architecture
document that can't go stale.**

See `.specify/memory/constitution.md` for the governing rules and `specs/` for the gated, step-by-step
feature plans.
