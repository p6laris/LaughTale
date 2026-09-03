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
| `useVirtualizer` | **0 / 76** components |
| `useFloatingPosition` | **0 / 76** |
| `useKeyboardNav` | **7 / 76** (Spec 042) |
| `useDataSource` | **0 / 76** |
| `useHotkeys` | **0 / 76** |
| `useFocusTrap` | **7 / 7 modals** (Spec 042, 100% of modals) |
| `IslandModule.createHandle` | **0** implementations |
| `sanitizeHtml` / `sanitizeUrl` (333 lines) | **4 / 76** |

Mostly this is good news — a large share of this roadmap is **adoption, not invention**. But the
pattern has a sharp edge: a 333-line HTML sanitizer that no component calls isn't an unfinished
feature, it's an open vulnerability.

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
- **Form association** *(web platform · M · 2–3 wks)* — **0** components use `ElementInternals`; only
  10 sync a hidden input. In a server-driven framework, forms are the primary interaction, so every
  input must appear in the native `FormData` POST without JS. Prerequisite for server actions
  degrading honestly.
- **Unify the event API** *(S · 1 wk)* — 58 namespaced vs 12 bare events, with inconsistent casing
  inside the namespace: `input-mask:change`, `inputtext:change`, `cascadeselect:change`, and both
  `slider:slideend` and bare `slideend`. Settle on `laughtale:<component>:<event>`, kebab-case, ship a
  codemod, keep aliases for one minor.
- **Virtualization** *(TanStack Virtual · S–M · 1–2 wks)* — `useVirtualizer` is written and used by
  nothing while the README advertises 100,000-row grids. Wire into `datatable`, `treetable`, `tree`,
  `select`, `listbox`, `orderlist`.
- **Headless core + parts anatomy** *(Zag.js, Ark UI, Radix · XL · ongoing)* — split each component
  into a state machine and a renderer; emit `data-part` / `data-state` so consumers style by anatomy.
  Do it opportunistically, one component at a time, never as a big-bang rewrite.
- **RTL & logical properties** *(S–M · 1–2 wks)* — only **7 of 76** components consider direction, with
  **2** uses of CSS logical properties, despite server-side localization being built and `dir` already
  flowing through `IslandContext`.
- **Imperative handles** *(S · 1 wk)* — `createHandle` is defined in the registry and implemented by
  zero components. `dialog.open()`, `toast.show()`, `datatable.reload()`.
- **Visual regression tests** *(M · 2 wks)* — Playwright is already a dependency; the suite is
  unit-level, so a 700-line restyle passes CI unseen.

---

## 6. Part D — Adapters

All five adapters are one-shot mount functions (324 lines total). They handle initial render and
unmount and nothing in between, which produces a specific and serious bug.

> **`island.refresh()` corrupts React islands.** `refresh.ts` morphs the container in place with
> `morphElement()` — patching attributes and text on live nodes. React's reconciler assumes it alone
> mutates that subtree. After a morph, the virtual DOM and the real DOM have silently diverged.
> Your two flagship features are individually good and mutually incompatible, and nothing tests the
> combination.

| Item | From | Effort |
|---|---|---|
| **Props updates without remount** — add `update(props)` to the adapter contract; refresh prefers it over morphing. *This is the fix for the corruption above, not a separate feature.* | Astro, Nuxt | M · 2–3 wks |
| **Nested islands** — the hydrator has no concept of an island inside an island | Astro | M · 2 wks |
| **Context & shared store access** — extend `ctx` with the ambient state pool | Nuxt `useState` | S · 1 wk |
| **Close adapter gaps** — `preact.ts` doesn't pass slots though React/Vue/Svelte do; `vanilla.ts` is 16 lines with no hydrate path. One contract, conformance test per adapter | parity | S · 1 wk |
| **New adapters** — Web Components/Lit first (framework-agnostic, no runtime download), then Solid, Alpine, Angular (unglamorous, but what enterprise .NET shops run) | ecosystem | S each |
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
| **Typed content collections** — C# record as frontmatter schema, validated at build. `ContentCollection.cs` exists and is untyped | Astro | S–M · 2 wks |
| **Typed config & sessions** — validated env schema separating server-only from client-exposed at compile time | Astro env, Nuxt runtimeConfig | S · 1 wk |
| **Incremental regeneration** | Next ISR | M · 2 wks |

---

## 9. Part M — Architecture, debloat & patterns

**Start with what's right, because it constrains the fix.** Component coupling is excellent: across 76
components there is *not one* import of a sibling. Dependencies flow one way into `runtime` (227),
`icons` (40), `composables` (27), `types` (11). The C# side uses a proper template method —
`IslandTagHelperBase` exposes `BuildProps()`, `BuildSsrHtml()`, `WrapperTagName`.

**Don't refactor the architecture. Refactor the rendering primitive.**

### The keystone

Components build markup as raw template literals assigned to `innerHTML`. That one choice produces,
independently: the XSS class (interpolation cannot escape), 221 duplicated inline SVGs, 707 inline
`style="…"` attributes no token can reach, and 2,030-line component files.

```ts
// src/runtime/html.ts — ~40 lines
import { sanitizeUrl } from '../directives/security';

const MAP: Record<string,string> = { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' };
export class Raw { constructor(readonly value: string) {} }

export function escapeHtml(v: unknown): string {
  if (v == null) return '';
  return String(v).replace(/[&<>"']/g, c => MAP[c]);
}

function render(v: unknown): string {
  if (v instanceof Raw) return v.value;
  if (Array.isArray(v)) return v.map(render).join('');
  if (v == null || v === false) return '';
  return escapeHtml(v);
}

export function html(s: TemplateStringsArray, ...v: unknown[]): string {
  let out = s[0];
  for (let i = 0; i < v.length; i++) out += render(v[i]) + s[i + 1];
  return out;
}

export const unsafe = (h: string) => new Raw(h);          // explicit, greppable, reviewable
export const url    = (u: unknown) => new Raw(escapeHtml(sanitizeUrl(u)));
export const cx     = (...p: unknown[]) => new Raw(escapeHtml(p.filter(Boolean).join(' ')));
```

Ship it with a lint rule banning direct `innerHTML` outside `html\`\``, and the vulnerability class
cannot come back. Pair it with `data-severity`-style attributes replacing the 707 inline styles, so
those move into the per-island CSS `injectIslandStyle()` already delivers.

**One primitive closes the XSS class, the inline-style bloat and much of the file size at once.**

### Debloat — things to delete

- **212 inline SVG literals.** The `icons/` module exists and is imported by 40 components; the rest
  paste raw `<svg>`. The same folder icon is duplicated verbatim across `accordion`, `tree`, `treetable`.
- **Three private copies of `escapeHtml`** — subsumed by `html\`\``.
- **39 `LEGACY_ALIASES`** in the registry, commented "scheduled for removal in LaughTale v4". You are
  building v4.
- **The 1.26 MB all-in-one IIFE** as documented default — keep as escape hatch, stop advertising it.
- **`CompoundTagHelpers.cs`** — 27 classes in 986 lines. Split to match `TagHelpers/Aura/{Data,Form,Misc}`.
- **`public string? Class { get; set; }` declared 33 times** when `IslandTagHelperBase` exists to hold it.

### Decouple

Split each component into four pieces as you touch it: **machine** (state, no DOM), **view** (pure,
`html\`\``), **styles** (tokens against parts), **bindings** (listeners, all signal-bound). A DOM-free
machine is unit-testable without a browser; `data-part` gives consumers a styling contract that
survives internal changes — which is what makes `eject` a good idea rather than a fork generator.

### Patterns

- **Keep**: Strategy (hydration), Registry + lazy Factory (loaders), Template Method
  (`IslandTagHelperBase`), Adapter (frameworks). All used correctly.
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

**Still needed**: document it and put it on the front page; fix the same teardown gap so `l-poll` and
`l-intersect` don't survive navigation; grow `reactivity.ts` (173 lines) into real signals; add
`l-model`, `l-for`, `l-if` and transitions; let users register their own directives (Part L); fuzz the
parser with property tests and a documented grammar; promote `htmx.ts` — the htmx audience *is* your
audience.

---

## 11. Part J — Performance

- **Stop leaking listeners** (§1.3) — the largest runtime problem in the codebase.
- **Replace `innerHTML` rebuilds with targeted updates.** Components regenerate whole subtrees on any
  state change, destroying focus, selection and scroll, and forcing layout on every keystroke in a
  filter box. Signals (Part I) plus the existing `morphElement()` give you patching.
- **Wire up `useVirtualizer`** so the 100,000-row claim is true on the client too.
- **Real budgets in CI.** Extend the existing gzip check to per-island chunk weight, hydration time,
  and a Lighthouse run on the showcase. `runtime/benchmark.ts` exists and nothing in CI calls it.
- **Publish honest numbers** — a reproducible benchmark against Blazor Server and WASM: TTFB, TTI,
  transferred bytes, memory after 50 navigations. Worth more than every adjective in the README.
- **Report Core Web Vitals** back through the instrumentation hook (Part H).

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

- **Rate-limit the island endpoints.** Two public `MapPost` routes accept user-shaped filter/sort
  requests and run them against EF Core with no limiter. A crafted filter on an unindexed column is a
  cheap denial of service. *(S · days)*
- **Secure-by-default field allowlist** (§1.2) + an `SMI` diagnostic flagging the unguarded call. *(S · days)*
- **Lower the page-size ceiling** — `Math.Clamp(request.PageSize, 1, 10000)` → default 200,
  configurable per island. *(S · hours)*
- **Deployment presets** *(Nitro)* — verified Azure App Service, container and IIS configs covering
  asset hashing, compression, CDN headers. Removes more first-day friction than anything else. *(M · 3 wks)*
- Then: **image optimization** *(Astro, Next)*, **font optimization**, and an **instrumentation hook**
  exporting island render/hydration timings as OpenTelemetry spans.

---

## 14. Part G/L — DX & plugin architecture

Build the plugin API **before** Parts E and F, so streaming, actions and cache tags are written as
first-party plugins against your own interface. Nothing proves an extension point like being forced
to use it.

**Four extension points:**

1. **Server lifecycle** — `OnConfigure`, `OnIslandDiscovered`, `OnIslandRendering`, `OnResponseStarting`.
2. **Client runtime** — register islands, adapters and *directives*; hook mount, unmount, error.
3. **Build hooks** — transform island source, contribute entry points, emit assets.
4. **Diagnostics** — contribute panels to the DevTools overlay, the way Astro toolbar apps do.

Ship plugins as **NuGet + npm pairs** with a single install command. **Write the first three yourself**
— server actions, cache tags, the SSR sidecar. If those can't be built cleanly against the API,
neither can anyone else's.

**DX items:**

- **DevTools overlay** *(Nuxt DevTools, Astro toolbar · M · 3 wks)* — every island outlined with
  strategy, hydration state, mount timing, props size, chunk weight. You already track
  `'idle' | 'pending' | 'mounted' | 'failed'` and have `IslandDiagnostics`. Largely surfacing state you hold.
- **Dev error overlay** *(S · 1 wk)* — island name, props that failed to revive, stack.
- **HMR for islands** *(S–M · 2 wks)* — nearly free once the Part B manifest exists.
- **Layers / theme inheritance** *(Nuxt layers · M · 3 wks)* — how an agency ships one house theme
  across twelve client apps.
- **Typed routes & auto-imports** *(S–M · 2 wks)* — Roslyn makes this easier for you than for Nuxt.
- **Extend the CLI** *(S · 1 wk)* — today `list` and `eject`. Add `new island`, `doctor`, `analyze`.

---

## 15. Framework capability matrix

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
| Imperative handles | — | **Built, unused** — 0 implementations | C |
| HTML sanitization at render | — | **CRITICAL** — sanitizer exists, 4/76 call it | §1 |
| Listener lifecycle | — | **CRITICAL** — 374 unmanaged | §1 |
| Authorization default | — | **FAIL-OPEN** — unregistered islands unguarded | §1, K |
| Typed TagHelper generation | Fresh | Partial — generator exists, no user input | B |
| Streaming SSR | Next, Nuxt | Partial — in-order only | E |
| Per-island code splitting | Astro, Qwik | Partial — ESM splits; IIFE ships all 76 | B |
| Signals / fine-grained reactivity | Qwik, Solid | Partial — `reactivity.ts` 173 lines | I |
| Perf budgets in CI | — | Partial — gzip only; benchmark unused | J |
| Icon system | — | Partial — module exists; 212 raw SVGs | M |
| Typed content collections | Astro | Partial — untyped frontmatter | F |
| Safe rendering primitive | Lit `html\`\`` | **Missing** — raw `innerHTML` in 68 | M |
| Island compiler / discovery | Fresh, Nuxt | **Missing** | B |
| Framework SSR | Astro, Nuxt | **Missing** — client-only mount | D |
| Post-mount prop updates | Astro, Nuxt | **Missing** — corrupts React on refresh | D |
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

## 16. Build order

| When | What |
|---|---|
| **Weeks 1–3** | Ship `html\`\``, then the urgent three: migrate components onto it, pass `ctx.signal` to all 374 unmanaged listeners, flip authz and the field allowlist to deny-by-default. Then CI/README cleanup. **Nothing else starts until this does.** |
| **Weeks 2–6** | Adopt your own composables — `useFocusTrap`, `useVirtualizer`, `useKeyboardNav`, `useFloatingPosition`; unify the event API; fix the 21 zero-ARIA components. Cheapest quality jump available. |
| **Weeks 4–8** | Form association, then server actions — in that order. Actions that don't degrade gracefully aren't progressive enhancement. |
| **Weeks 6–10** | Fix the refresh/adapter corruption: `update(props)` in the adapter contract, refresh prefers it over morphing. |
| **Weeks 9–14** | Plugin API, then the island compiler. The stretch that turns a library into a framework — protect it from interruption. |
| **Weeks 14–18** | DevTools + HMR. Once the compiler emits a manifest there's real data to inspect. |
| **Weeks 16–24** | Partials, out-of-order streaming, cache tags. The performance story you can benchmark against Blazor Server and win. |
| **Weeks 24–36** | Route rules, nested layouts, layers, deployment presets. By now the plugin API means some of it isn't written by you. |
| **Continuous** | Rate limiting, allowlist inversion, the headless split one component at a time. |

---

## 17. The governing lesson

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
