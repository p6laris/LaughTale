# LaughTale Islands Architecture — The Complete Step‑by‑Step Walkthrough

**SPDX-License-Identifier**: MIT
**Author**: Yunus Surchy (p6laris) & LaughTale Contributors
**Series**: The LaughTale Writing Journey
**Subsystem**: Whole framework — Server TagHelpers, Serialization, Security (CSP / Auth / Sandbox), Caching, Client Hydrator, Registry, Reviver, Event Bus, Shared State, Directives, Framework Adapters, View‑Transitions Router
**Audience**: A developer who has **never written TypeScript and never written C#**. You know HTML/CSS exist and that "JavaScript makes pages do things". Nothing else is assumed.

---

## Table of Contents

- **Part 0 — Orientation**: the two languages, the build pipeline, syntax primers.
- **Part 1 — The Architecture Conceptually**: analogy, the three eras, the subsystem map, vocabulary.
- **Part 2 — The Server Half (C#)**: `AddLaughTale`, options, `IslandTagHelper`, `IslandJson`, attributes, the authorization registry, the CSP middleware, the refresh endpoint, the data/LINQ layer.
- **Part 3 — Build & Bootstrap**: esbuild outputs, `defineIsland`, the app entry file.
- **Part 4 — The Client Runtime (TypeScript)**: registry, hydrator (line by line), reviver, retry, streaming, error boundary, styles, slots/parts, event bus, shared state, scope, commands, refresh.
- **Part 5 — Framework Adapters**: why they exist, then React / Vue / Svelte / Preact / Vanilla line by line.
- **Part 6 — The Directives Layer**: reactivity Proxy, the expression **security sandbox** (lexer → parser → AST → evaluator), events, polling, HTML/URL sanitization, CSP nonce discovery.
- **Part 7 — The View‑Transitions Router**: link interception, `navigateTo`, head reconciliation, prefetch.
- **Part 8 — Cross‑Cutting Concerns**: the full **security** model, the full **caching** model, performance/RUM, memory across navigations.
- **Part 9 — End‑to‑End Traces**: five complete scenarios.
- **Part 10 — Reference Appendices**: file map, event catalogue, attribute catalogue, glossary.

---

# Part 0 — Orientation

## 0.1 The two languages, and where each one runs

LaughTale is one framework built from two halves that meet at a single boundary: **an HTML string**.

```text
        ┌───────────────────────────┐        the boundary        ┌───────────────────────────┐
        │   SERVER  (a computer     │      one string of HTML     │   BROWSER  (the visitor's  │
        │   in a datacentre)        │  ───────────────────────▶   │   laptop / phone)         │
        │                           │      sent over HTTP         │                           │
        │   Language: C#            │                             │   Language: TypeScript    │
        │   Files:   *.cs           │                             │   Files:   *.ts           │
        │   Folders: LaughTale.Core │                             │   Folder:  LaughTale.     │
        │            LaughTale.     │                             │            Client/src     │
        │            Components     │                             │                           │
        │                           │                             │   (compiled to *.js       │
        │   Job: BUILD the HTML     │                             │    that the browser runs) │
        │        text. Decide what  │                             │   Job: make a few chosen  │
        │        is interactive.    │                             │        regions interactive│
        │        Enforce auth +     │                             │        AFTER the page is  │
        │        caching rules.     │                             │        already on screen. │
        └───────────────────────────┘                             └───────────────────────────┘
```

- **C#** is a compiled, statically‑typed language from Microsoft. ASP.NET Core is the web server framework it runs in. The server executes C# to produce the HTML for each page request.
- **TypeScript** is "JavaScript with type labels". A browser cannot run `.ts` directly, so the build tool **esbuild** compiles `LaughTale.Client/src/**/*.ts` into plain `.js` bundles in `LaughTale.Client/dist/`. The browser downloads those `.js` files.

## 0.2 The build pipeline (what turns source into what runs)

```text
LaughTale.Client/src/*.ts
        │
        │  esbuild.config.mjs   (run by:  npm run build)
        ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│  OUTPUT 1: dist/index.mjs  + dist/runtime.mjs   (ESM, "code-split")               │
│     - format: esm, splitting: true  → many small chunk-XXXX.mjs files            │
│     - each island component becomes its own downloadable chunk                    │
│     - this is what `import ... from 'laughtale'` uses in a bundler                │
│                                                                                  │
│  OUTPUT 2: dist/runtime.js   (IIFE, one file, global name `LaughTaleIslands`)     │
│     - the ~38 KB gzip "just the engine" build: hydrator + registry + directives   │
│     - drop-in via  <script src="runtime.js"></script>  — no bundler needed        │
│                                                                                  │
│  OUTPUT 3: dist/index.js     (IIFE, one file)                                     │
│     - the ~224 KB gzip "everything" build: engine + all 76 components pre-wired   │
│                                                                                  │
│  Bundle budgets are checked at build time (fails the build if exceeded):         │
│     runtime.mjs ≤ 8 KB,  runtime.js ≤ RUNTIME_GZIP_BUDGET,  index.js ≤ FULL_BUDGET│
└──────────────────────────────────────────────────────────────────────────────────┘
```

Key idea: **the component modules are separate files with content‑hashed names** (`toast-QRRSOYTL.mjs`). Content‑hashed = the filename changes only when the content changes, so a CDN can cache each one **forever** (`immutable`). The browser downloads a component chunk only when an island of that type actually hydrates.

## 0.3 TypeScript primer — every construct used in this codebase

```ts
// ── Variables ───────────────────────────────────────────────
const name = "toast";          // cannot be reassigned
let count = 0;                  // can be reassigned

// ── Type labels (after a colon). Erased at runtime — pure compiler help. ──
let title: string = "Hello";
let items: string[] = ["a", "b"];              // array of strings
let pair: [number, string] = [3, "x"];         // a "tuple": fixed-length, typed per slot
let maybe: string | null = null;               // "union type": string OR null
type HydrateStrategy = 'load' | 'idle' | 'visible';   // union of exact string values

// ── Functions ───────────────────────────────────────────────
function greet(who: string): string { return "hi " + who; }   // ": string" = return type
const double = (n: number) => n * 2;                          // "arrow function" (shorthand)
function opt(x?: number) {}                                   // "x?" = optional parameter

// ── Objects & their shapes ──────────────────────────────────
interface Point { x: number; y: number; label?: string; }    // just the SHAPE of an object
const p: Point = { x: 1, y: 2 };

// ── async / await: a function that can pause and resume ─────
async function load(): Promise<string> {
    const res = await fetch("/thing");     // pause here until the network answers
    return await res.text();
}
// "Promise<string>" = "a string that will exist later"

// ── Collections ─────────────────────────────────────────────
const reg = new Map<string, Function>();   // dictionary: key → value
reg.set("toast", () => import("./toast"));
const seen = new Set<string>();            // a bag of unique values
const weak = new WeakMap<Element, any>();  // like Map, but keys can be garbage-collected

// ── Classes ─────────────────────────────────────────────────
class Store<T> {                     // "<T>" = generic: works with any type T
    private value: T;                // "private" = only this class can touch it
    constructor(initial: T) { this.value = initial; }
    get(): T { return this.value; }
}
```

Symbols that look strange but are harmless:

| Symbol | Meaning |
|:--|:--|
| `x as any` | "Compiler: stop type‑checking this expression." Used a lot in the runtime for DOM tricks. |
| `(el as any).island = {...}` | Attach a made‑up property `island` onto a real DOM element at runtime. |
| `foo!.bar` | "I promise `foo` is not null here." |
| `foo?.bar` | "If `foo` is null, evaluate to `undefined` instead of crashing." |
| `a ?? b` | "Use `a`, but if `a` is null/undefined use `b`." |
| `` `hi ${x}` `` | Template string — same as `"hi " + x`. |
| `export function f(){}` / `import { f } from './x'` | How files share code. |
| `import('./toast')` (with parens) | **Dynamic import** — downloads a module *at the moment this line runs*, returns a Promise. This is the engine of lazy loading. |

## 0.4 C# primer — every construct used in this codebase

```csharp
// ── A class with properties and methods ─────────────────────
public class IslandTagHelper : TagHelper   // ": TagHelper" = inherits from TagHelper
{
    // A property. "{ get; set; }" = readable + writable from outside. "= ..." is the default.
    public string Name { get; set; } = string.Empty;

    // "string?" = a string allowed to be null.
    public string? Media { get; set; }

    // [Attributes in square brackets] are metadata. Other code reads them via "reflection".
    [HtmlAttributeName("hydrate")]
    public HydrateStrategy Hydrate { get; set; } = HydrateStrategy.Load;

    // "async Task" = can pause/resume, like TS "async". "override" = replaces a base method.
    public override async Task ProcessAsync(TagHelperContext ctx, TagHelperOutput output)
    {
        var json = IslandJson.SerializeProps(Props);      // "var" = infer the type for me
        output.Attributes.SetAttribute("data-props", json);
    }
}

// ── An enum: a fixed named list ─────────────────────────────
public enum HydrateStrategy { Load, Idle, Visible, Interaction, Media, Never }

// ── Dependency injection registration ──────────────────────
services.AddSingleton<IThing, Thing>();   // "whenever someone needs IThing, give them one shared Thing"

// ── null helpers ───────────────────────────────────────────
string result = a ?? b;                   // if a is null, use b
int len = text?.Length ?? 0;              // if text is null, 0
```

| Symbol | Meaning |
|:--|:--|
| `[Island("toast")]` | An attribute tagging a class as island `"toast"`. |
| `record` | A class optimised for holding data (auto equality, concise syntax). |
| `IQueryable<T>` | A query that has **not run yet** — you can keep adding `.Where(...)` and it translates to SQL when finally executed. |
| `Expression<Func<T,bool>>` | A **description** of a lambda as data (a tree), not a compiled function — this is how LINQ becomes SQL. |
| `context.Items[...]` | A per‑request scratch dictionary that lives for one HTTP request. |

## 0.5 How to read the diagrams

- **ASCII boxes** = structure / memory / DOM layout.
- **Mermaid `sequenceDiagram`** = "who calls whom, in what order, over time".
- **Mermaid `flowchart`** = "how data moves / decisions branch".
- **`stateDiagram`‑style ASCII** = a thing that has named states and transitions.

---

# Part 1 — The Architecture, Conceptually

## 1.1 The theme‑park‑map analogy

A LaughTale page is a **printed theme‑park map** handed to you at the gate.

| On the map | In LaughTale | Why it's like that |
|:--|:--|:--|
| The paper is finished the instant you hold it. No "boot". | Server‑rendered HTML. First paint needs **zero** JavaScript. | The server already did all the layout work; the browser just displays text. |
| 95% of the map is just **ink** — paths, labels, the castle drawing. | Static content. Ships no JS, ever. | Most of a page (header, article, footer) never *does* anything. |
| A few spots have **real machines**: a ticket kiosk, a photo booth, a live wait‑times board. Each is small, bolted to one spot, has its own power switch. | **Islands**: `<div data-island="…">` + a lazily‑loaded JS module. | Isolation. One machine breaking doesn't break the map. Different machines can be built by different vendors (React, Svelte…). |
| Machines power on **one at a time, only when needed**. Gate kiosk: now. Far booth: only when you walk over. | **Hydration**, governed by a **strategy** (`load`/`idle`/`visible`/`interaction`/`media`/`never`). | You pay for interactivity per‑widget, on demand — not for the whole page up front. |
| The staffer with a key ring flipping switches in order. | The **hydrator** (`runtime/hydrator.ts`). | One engine that knows *how* and *when* to bring each island to life. |
| Each machine has a printed **settings card** beside it. | **Props** — JSON in the `data-props` attribute. | The server passes data to the island without a second network call. |
| A machine rebuilding a real object from the card (a printed date → a real calendar date). | **Prop revival** (`runtime/reviver.ts`). | JSON only has strings/numbers; the reviver restores `Date`, `Map`, `Set`, `BigInt`, `URL`, bytes. |
| Machines shout to each other over a **park intercom**. | The **event bus** (`runtime/events.ts`). | Loose coupling: islands coordinate without importing each other. |
| A **staff‑room noticeboard** several machines read/write. | The **shared state store** (`runtime/state.ts`). | One value, many subscribers — for *facts* ("capacity: 82%"). |
| Every machine's **shutdown checklist**. | **Teardown** / `ctx.onCleanup` / `createScope().dispose()`. | The router swaps pages without reload; un‑cleaned timers = leaks. |
| Small **stickers** on the paper that do a trick (a flap you lift) with no machine. | **Directives** (`l-on:click`, `l-show`, `l-model`, …). | Tiny interactivity that doesn't deserve a whole island. |
| A power adaptor so a foreign machine fits the local socket. | **Framework adapters** (`adapters/react.ts` …). | Wrap a React/Vue/Svelte component into LaughTale's mount contract. |

The thesis: **the map is fully useful with zero machines running.** Machines are a progressive bonus layer. A classic Single‑Page App is the inverse — it hands you a blank sheet and a generator and you wait in the dark until the generator starts.

## 1.2 Islands vs the two older approaches

| Era | How it works | First readable pixel | JavaScript cost | Pain points |
|:--|:--|:--|:--|:--|
| **Classic MPA** (~2005) | Every click → full server page reload. | Instant. | Almost none. | White flash on every action; rich widgets are hard. |
| **SPA / client render** (~2015) | Server sends empty `<div id=root>`; a big JS bundle builds the whole UI in the browser. | Blank until the bundle downloads + parses + runs. | The whole app, up front. | Slow start; SEO needs extra work; you hydrate 100% of the page even though 5% is interactive. |
| **SPA + full SSR hydration** | Server renders HTML *and* ships the whole app to "hydrate" all of it. | Fast paint, but the page is **frozen** until the whole bundle hydrates. | The whole app, and it all re‑executes on the client. | The most expensive model: pay for SSR *and* full hydration. |
| **Islands (LaughTale)** | Server sends a finished page. Only the marked regions hydrate, each on its own schedule. | Instant, and interactive parts light up progressively. | Only the islands actually present, loaded lazily. | You must design "what is actually interactive?" deliberately. |

```text
                    first readable pixel                JS downloaded + parsed + run
Classic MPA         ▓ now                                ▏ ~0
SPA (CSR)           ▓▓▓▓▓▓▓▓▓▓  blank until bundle        ████████  entire app
SPA + full SSR      ▓▓  paints fast, frozen a while      ████████  entire app (again, on client)
LaughTale           ▓ now                                ▏▏  just the islands, lazily
```

## 1.3 The subsystem map (the whole framework on one screen)

```text
SERVER  (C#, LaughTale.Core)
┌───────────────────────────────────────────────────────────────────────────────┐
│ AddLaughTale(options)        register services + feature flags (all opt-in)    │
│ IslandTagHelper             <island> ─▶ <div data-island data-props data-...>  │
│ IslandJson                  C# object ─▶ compact secure JSON (MaxDepth 32)     │
│ [Island] [IslandAuthorize] [IslandPrivate] [IslandIgnore]   the attribute set │
│ IIslandAuthorizationRegistry   one policy table for BOTH render AND refresh    │
│ LaughTaleCspMiddleware       per-request random nonce + Content-Security-Policy│
│ MapLaughTaleIslandRefresh    POST /_laughtale/island/{name}  (antiforgery+auth)│
│ QueryableExtensions          IslandDataRequest ─▶ safe LINQ ─▶ IslandDataResult│
│ MapLaughTaleIcons            /_lt/icons.svg   immutable 1-year cache           │
└───────────────────────────────────────────────────────────────────────────────┘
                                    │  one HTML string
                                    ▼
BROWSER  (TypeScript, LaughTale.Client/src)
┌───────────────────────────────────────────────────────────────────────────────┐
│ index.ts / main.ts       defineIsland(name, loader) ; initIslands()            │
│ runtime/registry.ts      Map<name, () => import(chunk)>                        │
│ runtime/hydrator.ts  ◀── THE ENGINE: strategy → load → revive → mount → track │
│ runtime/reviver.ts       JSON ─▶ Date/Map/Set/BigInt/URL/Uint8Array           │
│ runtime/retry.ts         resilient dynamic import (backoff + jitter)          │
│ runtime/streaming.ts     wait for <!--island:end--> when response is streamed  │
│ runtime/error-boundary   fallback slot + dev overlay + retry button           │
│ runtime/styles.ts        one stylesheet per component (adoptedStyleSheets)     │
│ runtime/events.ts        event bus: emitIslandEvent / onIslandEvent           │
│ runtime/state.ts         shared store: useSharedState(key)                     │
│ runtime/scope.ts         createScope(): on/observe/timer/cleanup → dispose()   │
│ runtime/commands.ts      named client commands (so server props never eval JS) │
│ runtime/refresh.ts       island.refresh() → server HTML → DOM morph → rehydrate│
│ adapters/*               React / Vue / Svelte / Preact / Vanilla bridges       │
│ directives/index.ts      l-* attributes: reactivity, events, poll, HTMX, ...   │
│ directives/expression/*  lexer→parser→AST→evaluator  (the JS-eval-free sandbox)│
│ directives/security.ts   sanitizeUrl / sanitizeHtml / isSafeAttribute         │
│ runtime/router.ts        View Transitions SPA-feel navigation + prefetch       │
└───────────────────────────────────────────────────────────────────────────────┘
```

## 1.4 Concept Dictionary

| Term | One‑line definition | Lives in |
|:--|:--|:--|
| **SSR** | The server produces the final HTML text for each request; browser shows it with no JS. | ASP.NET + Razor |
| **Island** | `<div data-island="name">` + a lazily‑loaded JS module that "mounts" behaviour into that div. | everywhere |
| **Hydration** | Attaching live JS behaviour to server HTML that is *already on screen*. | `hydrator.ts` |
| **Hydrator** | The engine that finds islands, times them, loads them, mounts them, tracks them, recovers them. | `runtime/hydrator.ts` |
| **Strategy** | *When* an island hydrates: `load`, `idle`, `visible`, `interaction`, `media`, `never`. | `hydrate="…"` → `data-hydrate` |
| **Props** | Server data for an island, serialized to JSON in `data-props`. | `IslandJson.cs`, `reviver.ts` |
| **Reviver** | Rebuilds rich JS values (`Date`, `Map`, …) from the props JSON. | `runtime/reviver.ts` |
| **Registry** | `Map` from island name → a lazy loader `() => import('./components/toast')`. | `runtime/registry.ts` |
| **Loader** | The zero‑arg function that, when called, downloads a component chunk. | `defineIsland(...)` |
| **Mount function** | An island module's `default` export: `(container, props, ctx) => teardown`. | each `components/*.ts` |
| **IslandContext (`ctx`)** | Toolkit passed to every mount: `{ signal, onCleanup, container, name, locale, dir, t, dictionary }`. | `registry.ts` |
| **Teardown** | The function an island returns (+ `ctx.onCleanup` callbacks); runs on `laughtale:unmount`. | `hydrator.ts` |
| **Scope** | `createScope()` — bundles event listeners / observers / timers so `dispose()` frees them all. | `runtime/scope.ts` |
| **Event bus** | In‑memory pub/sub between islands; also mirrors to a `window` `CustomEvent`. | `runtime/events.ts` |
| **Shared state store** | `useSharedState(key)` → one value + subscribers, shared by many islands. | `runtime/state.ts` |
| **Directive** | `l-*` HTML attribute wired by `initDirectives` — interactivity with no island. | `directives/*` |
| **Expression sandbox** | A hand‑written lexer/parser/evaluator that runs `l-*` expressions **without** `eval`/`new Function`. | `directives/expression/*` |
| **Adapter** | Wraps a React/Vue/Svelte/Preact component into the `(container, props, ctx) => teardown` contract. | `adapters/*` |
| **Router** | Intercepts link clicks, fetches the next page, morphs `<body>`, re‑runs `initIslands`, animates. | `runtime/router.ts` |
| **Island refresh** | `island.refresh(props)` — server re‑renders one island; client morphs it in place; focus preserved. | `runtime/refresh.ts` + endpoint |
| **CSP nonce** | Per‑response random token that authorises `<script>`/`<style>` under Content‑Security‑Policy. | `CspMiddleware.cs`, `directives/csp.ts` |
| **`[IslandPrivate]`** | Marks props as user‑specific → server forces `Cache-Control: no-store`, `Vary: Cookie`. | `IslandPrivateAttribute.cs`, `IslandTagHelper.cs` |
| **Lifecycle state** | `'idle' | 'pending' | 'mounted' | 'failed'` — stored on the element, read via `getIslandState`. | `hydrator.ts` |
| **TagHelper** | A C# class ASP.NET runs while building HTML; turns `<island>` into the real `<div>`. | `IslandTagHelper.cs` |

## 1.5 The lifecycle, three ways

**One sentence:** the server sends finished HTML with a few marked spots; the browser paints it instantly; then the hydrator brings each marked spot to life on its own schedule, and everything can later refresh from the server or tear itself down cleanly.

**One paragraph:** ASP.NET renders a Razor page. `IslandTagHelper` converts each `<island>` into a `<div data-island data-props data-hydrate>`, checking authorization and cache‑privacy as it goes. The browser parses and paints — no JS needed yet. Then the app's entry script calls `initIslands()`. The hydrator scans for island elements, and for each one applies the timing strategy from `data-hydrate`. When an island's moment arrives, `executeHydration` looks the name up in the registry, lazily downloads the component chunk (retrying with backoff on failure), revives the `data-props` JSON into real objects, builds an `IslandContext`, and calls the module's mount function. The island writes its own DOM and wires its own listeners. The hydrator records `mounted`, fires `laughtale:hydrated`, and registers a one‑shot `laughtale:unmount` handler that will run the island's teardown. Later, `island.refresh()` can fetch fresh server HTML for that single island and morph it in place, and the View‑Transitions router can swap the whole page while preserving `[data-persist]` islands.

**One diagram:**

```mermaid
sequenceDiagram
    participant U as Browser
    participant S as Server (C#)
    participant H as Hydrator
    participant REG as Registry
    participant ISL as Island module

    U->>S: GET /page
    S->>S: IslandTagHelper: auth check, props→JSON, cache guard
    S-->>U: full HTML (paints instantly, 0 JS)
    U->>H: initIslands()
    H->>U: querySelectorAll('[data-island]')
    loop each island
      H->>H: read data-hydrate → schedule per strategy
    end
    Note over H: strategy fires (idle / visible / interaction / media / now)
    H->>H: executeHydration → state = "pending"
    H->>REG: getIslandDefinition(name)
    REG-->>H: { loader: () => import(chunk) }
    H->>U: importWithRetry(loader) → download chunk
    H->>H: parseAndReviveProps(data-props)
    H->>H: build IslandContext
    H->>ISL: mount(container, props, ctx)
    ISL->>U: write DOM, add listeners
    ISL-->>H: return teardown()
    H->>H: state = "mounted"; performance.measure(...)
    H->>U: dispatch 'laughtale:hydrated'
```

---

# Part 2 — The Server Half (C#)

## 2.1 `AddLaughTale()` — `LaughTale.Core/Extensions/ServiceCollectionExtensions.cs`

This is the one line you add in `Program.cs`: `builder.Services.AddLaughTale(...)`.

```csharp
public static IServiceCollection AddLaughTale(
    this IServiceCollection services,
    Action<LaughTaleOptions>? configure = null)     // (1) optional config callback
{
    var options = new LaughTaleOptions();           // (2) start from all-defaults
    configure?.Invoke(options);                     // (3) let the caller mutate them

    services.AddSingleton(options);                                        // (4)
    services.AddSingleton<IOptions<LaughTaleOptions>>(
        new OptionsWrapper<LaughTaleOptions>(options));                    // (5)

    services.TryAddSingleton<ILaughTaleLocalizer, LaughTaleLocalizer>();   // (6)
    services.TryAddSingleton<IIslandAuthorizationRegistry,
                             IslandAuthorizationRegistry>();               // (7)

    return services;                                                      // (8)
}
```

1. `this IServiceCollection services` — the `this` makes it an **extension method**: you call it as `services.AddLaughTale()`. `Action<LaughTaleOptions>?` is "an optional function that receives a `LaughTaleOptions` and returns nothing".
2. Create the options object with every feature at its default (mostly **off** — see 2.2).
3. `configure?.Invoke(options)` — if the caller passed a callback, run it so they can flip `options.Csp.Enabled = true`, etc. The `?.` means "skip if null".
4. Register that exact instance as a **singleton** (one shared copy for the whole app).
5. Also register it wrapped in `IOptions<T>`, the interface ASP.NET code conventionally asks for.
6. `TryAddSingleton` — register a localizer **only if one isn't already registered** (lets the app override it).
7. Register the **island authorization registry** — the single source of truth for "which policy does island X need?", used by *both* the TagHelper and the refresh endpoint (2.6).
8. Return `services` so calls can chain: `services.AddLaughTale().AddRazorPages()`.

There are sibling methods `AddLaughTaleLocalization(...)` and a back‑compat alias `AddIslands(...)`.

## 2.2 `LaughTaleOptions` — `LaughTale.Core/Configuration/LaughTaleOptions.cs`

Every non‑essential feature **defaults to disabled** — you pay only for what you switch on.

| Option | Default | What it controls |
|:--|:--|:--|
| `ViewTransitions.Enabled` | `false` | Client SPA‑feel navigation (Part 7). `FallbackMode` = `"swap"` or `"none"` for old browsers. |
| `Prefetch.Enabled` | `false` | Hover + viewport link prefetching. `HoverDelayMs` = 65. `RespectDataSaver` = true. |
| `Csp.Enabled` | `false` | CSP nonce generation + `<script>`/`<style>` stamping. `AutoGenerateNonce` = true. |
| `ThemeStudio.Enabled` | `false` | Live theme editor at `/_laughtale/studio`. Usually dev‑only. |
| `Caching.EnforcePrivateOnUserProps` | **`true`** | Auto‑force non‑cacheable responses for islands carrying `[IslandPrivate]` props. This one is **on** because it's a safety net, not a feature. |
| `Localization` | built‑ins | Culture resolution, `IStringLocalizer` bridge. |
| `Icons.SpritePath` | `/_lt/icons.svg` | Self‑hosted Lucide SVG sprite location; `DefaultSize` = 16, `DefaultStrokeWidth` = 2. |
| `Refresh.RequireAntiforgery` | **`true`** | CSRF token required on refresh POSTs. |
| `Refresh.IslandPolicies` | empty map | `islandName → policyName` overrides; `RequirePolicy("cart", "LoggedIn")`. |

Why "off by default": a framework that turns everything on ships code and headers you didn't ask for. LaughTale's `LaughTale.Core` has **zero** dependency on `LaughTale.Components`; you install and enable pieces deliberately.

## 2.3 `IslandTagHelper` — `LaughTale.Core/TagHelpers/IslandTagHelper.cs`

A **TagHelper** is a C# class ASP.NET invokes while rendering a Razor page. When it sees `<island …>` it calls `ProcessAsync`, and whatever that method writes into `output` becomes the HTML.

### 2.3.1 The class declaration and attribute bindings

```csharp
[HtmlTargetElement("island", TagStructure = TagStructure.NormalOrSelfClosing)]
public class IslandTagHelper : TagHelper
{
    [HtmlAttributeName("name")]      public string Name { get; set; } = string.Empty;
    [HtmlAttributeName("props")]     public object? Props { get; set; }
    [HtmlAttributeName("hydrate")]   public HydrateStrategy Hydrate { get; set; } = HydrateStrategy.Load;
    [HtmlAttributeName("framework")] public IslandFramework Framework { get; set; } = IslandFramework.Vanilla;
    [HtmlAttributeName("media")]     public string? Media { get; set; }
    [HtmlAttributeName("persist")]   public string? Persist { get; set; }
    [HtmlAttributeName("fallback")]  public string? Fallback { get; set; }
    [HtmlAttributeName("private")]   public bool? IsPrivate { get; set; }
    [HtmlAttributeName("policy")]    public string? Policy { get; set; }
    // + class / style / id passthrough
```

- `[HtmlTargetElement("island")]` — "run this class for every `<island>` tag". `NormalOrSelfClosing` allows both `<island></island>` and `<island />`.
- Each `[HtmlAttributeName("x")]` binds one Razor attribute to one C# property. Writing `hydrate="idle"` sets `Hydrate`.
- **The enum trick:** `Hydrate` is typed `HydrateStrategy` (an enum: `Load, Idle, Visible, Interaction, Media, Never`). A typo `hydrate="ilde"` is a **compile‑time error in the Razor build**, not a silent runtime bug. `Props` is typed `object?` — it accepts any view‑model.

### 2.3.2 Render‑time authorization

```csharp
public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
{
    var httpContext = ViewContext?.HttpContext;
    var requestServices = httpContext?.RequestServices;
    if (httpContext != null && requestServices != null)
    {
        var authService   = requestServices.GetService<IAuthorizationService>();
        var authRegistry  = requestServices.GetService<IIslandAuthorizationRegistry>();
        var laughTaleOpts = requestServices.GetService<IOptions<LaughTaleOptions>>()?.Value;

        string? requiredPolicy = Policy;                                            // (a)
        if (string.IsNullOrWhiteSpace(requiredPolicy) && Props != null)             // (b)
        {
            var authAttr = Props.GetType().GetCustomAttribute<IslandAuthorizeAttribute>();
            if (authAttr != null) requiredPolicy = authAttr.Policy;
        }
        if (string.IsNullOrWhiteSpace(requiredPolicy) &&
            laughTaleOpts?.Refresh.IslandPolicies.TryGetValue(Name, out var optPol) == true)  // (c)
            requiredPolicy = optPol;
        if (string.IsNullOrWhiteSpace(requiredPolicy) && authRegistry != null)      // (d)
            requiredPolicy = authRegistry.GetPolicy(Name);

        if (!string.IsNullOrWhiteSpace(requiredPolicy) && authService != null)
        {
            var authResult = await authService.AuthorizeAsync(httpContext.User, requiredPolicy);
            if (!authResult.Succeeded)
            {
                output.SuppressOutput();   // emit NOTHING — no empty div, no leaked props
                return;
            }
        }
    }
```

**Policy resolution order** (first match wins):

```text
(a) the  policy="..."  attribute on <island>
        │ none?
(b) an  [IslandAuthorize(Policy="...")]  attribute on the Props class
        │ none?
(c) options.Refresh.IslandPolicies["name"]   (set via RequirePolicy in Program.cs)
        │ none?
(d) IIslandAuthorizationRegistry.GetPolicy("name")   (from assembly scanning)
        │ none?
    → unrestricted, render normally
```

If a policy is found and the current user fails it, `output.SuppressOutput()` makes the island **vanish entirely**. Nothing is emitted — so `data-props` (which might contain sensitive server data) never reaches the wire. This is the *same* policy the refresh endpoint enforces (2.6), so a user can't bypass a render check by calling refresh directly.

### 2.3.3 `EnforceCachePrivacy()` — the caching‑security guard

```csharp
    output.TagName = "div";
    output.TagMode = TagMode.StartTagAndEndTag;     // always <div>…</div>, never <div/>

    EnforceCachePrivacy();
```

```csharp
private void EnforceCachePrivacy()
{
    var httpContext = ViewContext?.HttpContext;
    if (httpContext == null) return;

    bool hasPrivateAttr = IsPrivate == true
        || (Props != null && (
              Props.GetType().GetCustomAttribute<IslandPrivateAttribute>(true) != null
           || Props.GetType().GetProperties(BindingFlags.Public | BindingFlags.Instance)
                             .Any(p => p.GetCustomAttribute<IslandPrivateAttribute>(true) != null)));

    if (hasPrivateAttr)
    {
        var response = httpContext.Response;
        if (response.Headers.CacheControl.ToString().Contains("public", StringComparison.OrdinalIgnoreCase))
            _logger.LogWarning("[LaughTale Security] Island '{Name}' carries private props on a publicly cached response…", Name);

        response.Headers.CacheControl = "no-store, no-cache, private";
        response.Headers.Pragma       = "no-cache";
        response.Headers.Vary         = "Cookie";
    }
}
```

The problem it solves: you enable ASP.NET output caching or put a CDN in front, and a page containing "Welcome back, **Alice**, balance **$4,210**" gets cached and served to **Bob**. If the island's props class (or a property, or the tag's `private="true"`) carries `[IslandPrivate]`, the whole HTTP response is forced to:

- `Cache-Control: no-store, no-cache, private` — no shared or browser cache keeps it,
- `Vary: Cookie` — even permissive intermediaries key by session cookie,
- and a warning is logged if something upstream already tried to mark it `public`.

This runs for the *response*, triggered by a single island — one private island quarantines the whole page.

### 2.3.4 Culture flow

```csharp
    var currentCulture = CultureInfo.CurrentUICulture;
    if (!output.Attributes.ContainsName("lang"))
        output.Attributes.SetAttribute("lang", currentCulture.Name);
    if (!output.Attributes.ContainsName("dir"))
    {
        var isRtl = _localizer?.IsRightToLeft(currentCulture) ?? currentCulture.TextInfo.IsRightToLeft;
        output.Attributes.SetAttribute("dir", isRtl ? "rtl" : "ltr");
    }
```

Stamps `lang="ar"` / `dir="rtl"` onto the island `<div>`. The **client hydrator reads these back** (Part 4.2 step 8) to build `ctx.locale` and `ctx.dir`, so the island renders in the right language/direction with no extra config.

### 2.3.5 Prop serialization + the three runtime attributes

```csharp
    var serializedProps = IslandJson.SerializeProps(Props);       // C# object → JSON string (2.4)
    var propBytes = Encoding.UTF8.GetByteCount(serializedProps);

    output.Attributes.SetAttribute("data-island",  Name);
    output.Attributes.SetAttribute("data-props",   serializedProps);
    output.Attributes.SetAttribute("data-hydrate", Hydrate.ToString().ToLowerInvariant());

    _logger.LogDebug("LaughTale Island rendered: Name={Name}, Strategy={Strategy}, PropsSize={Bytes}B",
                     Name, Hydrate, propBytes);

    if (Framework != IslandFramework.Vanilla)
        output.Attributes.SetAttribute("data-framework", Framework.ToString().ToLowerInvariant());
    if (!string.IsNullOrWhiteSpace(Persist)) output.Attributes.SetAttribute("data-persist", Persist);
    if (!string.IsNullOrWhiteSpace(Media))   output.Attributes.SetAttribute("data-media",   Media);
    if (!string.IsNullOrWhiteSpace(Fallback))output.Attributes.SetAttribute("data-fallback",Fallback);
```

`data-hydrate` is **lowercased** so it matches the TypeScript union type `'load' | 'idle' | …` exactly (C# enum `.ToString()` gives `"Idle"`, the client wants `"idle"`).

### 2.3.6 Slots, fallback template, streaming marker

```csharp
    var childContent = await output.GetChildContentAsync();
    var sb = new StringBuilder();

    if (!childContent.IsEmptyOrWhiteSpace)
        sb.Append($"<div data-slot=\"default\" class=\"island-slot\">{childContent.GetContent()}</div>");

    if (!string.IsNullOrWhiteSpace(Fallback))
        sb.Append($"<template data-slot=\"fallback\" class=\"island-fallback-template\">{WebUtility.HtmlEncode(Fallback)}</template>");

    if (sb.Length > 0)
    {
        sb.Append($"<!--island:end:{Name}-->");
        output.Content.SetHtmlContent(sb.ToString());
    }

    IslandDiagnostics.ValidateIsland(Name, Hydrate, Media, !string.IsNullOrWhiteSpace(Persist), output);
```

- Anything you nested inside `<island>…</island>` is wrapped as `data-slot="default"` — the client can read it with `getSlot(container)` (Part 4.8).
- `fallback="Loading…"` becomes an inert `<template data-slot="fallback">` shown by the error boundary if hydration fails, and usable as a placeholder.
- `<!--island:end:Name-->` is the marker the client's `awaitStreamingReady` waits for when the HTTP response is streamed in chunks (Part 4.5).
- `IslandDiagnostics.ValidateIsland(...)` emits dev‑time warnings (e.g. `media` set but strategy isn't `media`).

### 2.3.7 The exact HTML emitted (annotated)

For `<island name="toast" hydrate="idle" fallback="Loading…"><p>hi</p></island>`:

```html
<div data-island="toast"            <!-- registry key the hydrator looks up          -->
     data-hydrate="idle"            <!-- timing strategy                              -->
     data-props='{"message":"Saved!","severity":"success"}'  <!-- revived client-side -->
     lang="en" dir="ltr">           <!-- culture, read back into ctx.locale/ctx.dir   -->
  <div data-slot="default" class="island-slot"><p>hi</p></div>
  <template data-slot="fallback" class="island-fallback-template">Loading…</template>
  <!--island:end:toast-->           <!-- streaming-SSR completion marker              -->
</div>
```

## 2.4 `IslandJson` — `LaughTale.Core/Serialization/IslandJson.cs`

```csharp
public static readonly JsonSerializerOptions Options = CreateDefaultOptions();

private static JsonSerializerOptions CreateDefaultOptions()
{
    var resolver = new DefaultJsonTypeInfoResolver();
    resolver.Modifiers.Add(static typeInfo =>
    {
        if (typeInfo.Kind != JsonTypeInfoKind.Object) return;
        foreach (var prop in typeInfo.Properties)
            if (prop.AttributeProvider?.IsDefined(typeof(IslandIgnoreAttribute), true) == true)
                prop.ShouldSerialize = static (_, _) => false;      // (1) drop [IslandIgnore] props
    });

    return new JsonSerializerOptions
    {
        PropertyNamingPolicy   = JsonNamingPolicy.CamelCase,        // (2) Message → message
        DictionaryKeyPolicy    = JsonNamingPolicy.CamelCase,
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,// (3) omit null props
        Encoder                = JavaScriptEncoder.Default,          // (4) HTML-safe escaping
        WriteIndented          = false,                             // (5) compact (attribute value)
        MaxDepth               = 32,                                // (6) runaway-graph guard
        ReferenceHandler       = ReferenceHandler.IgnoreCycles,     // (7) A→B→A won't loop forever
        TypeInfoResolver       = resolver,
        Converters = { new JsonStringEnumConverter(JsonNamingPolicy.CamelCase) }  // (8) enums as "success"
    };
}

public static string SerializeProps(object? props)
{
    if (props == null) return "{}";
    try { return JsonSerializer.Serialize(props, Options); }
    catch (JsonException ex)
    {
        throw new IslandSerializationException(
            $"Failed to serialize island props for model '{props.GetType().FullName}'. " +
            $"Ensure depth ≤ {Options.MaxDepth} and no circular references. Detail: {ex.Message}",
            props.GetType(), ex);
    }
}
```

1. **`[IslandIgnore]`** on a property → never serialized (keep server‑only fields, like an internal DB id, off the wire).
2. C# convention is `PascalCase`; JS convention is `camelCase`. The serializer bridges automatically.
3. `null` properties are omitted → smaller attribute.
4. **Security:** `JavaScriptEncoder.Default` escapes `<`, `>`, `&`, quotes so the JSON can sit inside an HTML attribute without breaking out of it.
5. Compact — this string lives inside `data-props="…"`.
6. **MaxDepth 32** — a deeply nested or accidentally recursive view‑model throws a clear `IslandSerializationException` instead of hanging or producing a megabyte attribute.
7. **IgnoreCycles** — `Order → Customer → Orders → …` is handled, not fatal.
8. Enums serialize as camelCase strings (`Severity.Success` → `"success"`), matching TS string unions.

### The discriminated‑tuple wire format

JSON natively carries only string/number/boolean/array/object/null. For richer types the server may emit a **2‑element tuple** `[typeId, rawValue]`, which the client reviver decodes:

| typeId | Type | Example on the wire | Becomes (JS) |
|:--:|:--|:--|:--|
| 0 | Object | `[0, {...}]` | plain object (recursed) |
| 1 | Array | `[1, [...]]` | array (recursed) |
| 2 | RegExp | `[2, "ab+c"]` | `new RegExp("ab+c")` |
| 3 | Date | `[3, "2026-09-02T10:00:00Z"]` | `new Date(...)` |
| 4 | Map | `[4, [["k",1]]]` | `new Map([["k",1]])` |
| 5 | Set | `[5, [1,2,3]]` | `new Set([1,2,3])` |
| 6 | BigInt | `[6, "90071992547409910"]` | `BigInt(...)` |
| 7 | URL | `[7, "/x?y=1"]` | `new URL("/x?y=1", origin)` |
| 8 | Uint8Array | `[8, "<base64>"]` | decoded byte array |

A plain ISO‑date **string** (no tuple) is also auto‑detected and upgraded to `Date` by the client (Part 4.3).

## 2.5 The attribute system — `LaughTale.Core/Attributes/*`

| Attribute | Put it on | Effect |
|:--|:--|:--|
| `[Island("cascade-tree")]` | a props class/record | Marks it as an island contract named `cascade-tree`. Drives the Roslyn source generator (which emits TypeScript interfaces + a strongly‑typed TagHelper). `DefaultStrategy` sets a fallback `HydrateStrategy`. |
| `[GenerateTypeScript]` | class/struct/enum | Emit this type into generated `.ts` type definitions. |
| `[IslandAuthorize(Policy = "Admin")]` | a props class/record | The island requires ASP.NET policy `"Admin"` to **render or refresh**. `Inherited = true` — subclasses inherit it. |
| `[IslandPrivate("PII")]` | class / struct / **property** / field | Response becomes non‑cacheable (2.3.3). Property‑level lets you mark one sensitive field. |
| `[IslandIgnore]` | a property | Excluded from the serialized `data-props` JSON. |
| `[InputMask("(999) 999-9999")]` | an input property | Emits a client keystroke mask for that field. |

## 2.6 `IIslandAuthorizationRegistry` — `LaughTale.Core/Security/IIslandAuthorizationRegistry.cs`

**The invariant it guarantees:** the initial TagHelper render and the server‑driven refresh endpoint enforce the **exact same** policy for a given island. Without this, a `visible`‑gated admin island could be pulled by any logged‑out user via a direct `POST /_laughtale/island/admin-panel`.

```csharp
public class IslandAuthorizationRegistry : IIslandAuthorizationRegistry
{
    private readonly ConcurrentDictionary<string, string> _policies = new(StringComparer.OrdinalIgnoreCase);

    public void RegisterPolicy(string islandName, string policyName) { ... _policies[islandName] = policyName; }

    public void RegisterPoliciesFromAttributes(params Assembly[] assemblies)   // (1) explicit scan
    {
        foreach (var assembly in assemblies)
        {
            if (assembly.IsDynamic) continue;
            foreach (var type in assembly.GetExportedTypes())
            {
                var islandAttr = type.GetCustomAttribute<IslandAttribute>();
                if (islandAttr == null) continue;
                var authAttr = type.GetCustomAttribute<IslandAuthorizeAttribute>();
                if (authAttr != null && !string.IsNullOrWhiteSpace(authAttr.Policy))
                    RegisterPolicy(islandAttr.Name, authAttr.Policy);
            }
        }
    }

    public string? GetPolicy(string islandName)
    {
        if (_policies.TryGetValue(islandName, out var policy)) return policy;    // (2) cached
        var discovered = FindPolicyFromAttributes(islandName);                   // (3) lazy scan
        if (!string.IsNullOrWhiteSpace(discovered)) { _policies[islandName] = discovered; return discovered; }
        return null;
    }

    public async Task<bool> AuthorizeAsync(string islandName, HttpContext context)
    {
        var policy = GetPolicy(islandName);
        if (string.IsNullOrWhiteSpace(policy)) return true;                      // (4) unrestricted
        var authService = context.RequestServices.GetService<IAuthorizationService>();
        if (authService == null) return false;                                  // (5) fail closed
        var result = await authService.AuthorizeAsync(context.User, policy);
        return result.Succeeded;
    }
}
```

1. `RegisterPoliciesFromAttributes(typeof(Program).Assembly)` at startup — one pass over your assemblies, reading `[Island]` + `[IslandAuthorize]` pairs into the map.
2. `GetPolicy` checks the concurrent (thread‑safe) dictionary first.
3. On a miss it lazily scans loaded non‑`System.`/`Microsoft.` assemblies, then **caches the result** so the reflection cost is paid once.
4. No policy registered → `true` (island is public).
5. **Fail closed:** if a policy *is* required but the auth service is missing, return `false` (deny), never `true`.

## 2.7 The CSP subsystem

### 2.7.1 `LaughTaleCspMiddleware` — `LaughTale.Core/Security/LaughTaleCspMiddleware.cs`

Middleware runs on **every** HTTP request, before your page code.

```csharp
public async Task InvokeAsync(HttpContext context)
{
    if (_options.Enabled)
    {
        string nonce;
        if (context.Items.TryGetValue(HttpContextCspNonceProvider.HttpContextItemKey, out var existing)
            && existing is string s && !string.IsNullOrWhiteSpace(s))
        {
            nonce = s;                                            // (1) reuse upstream nonce
        }
        else
        {
            var bytes = new byte[16];
            RandomNumberGenerator.Fill(bytes);                    // (2) 128-bit CSPRNG
            nonce = Convert.ToBase64String(bytes);
            context.Items[HttpContextCspNonceProvider.HttpContextItemKey] = nonce;   // (3) stash for this request
        }

        if (!string.IsNullOrWhiteSpace(_options.HeaderName) && !string.IsNullOrWhiteSpace(_options.PolicyTemplate))
        {
            var policy = string.Format(_options.PolicyTemplate, nonce);   // (4) {0} → nonce
            context.Response.Headers.TryAdd(_options.HeaderName, policy);
        }
    }
    await _next(context);                                          // (5) continue the pipeline
}
```

1. If a reverse proxy already set a nonce, reuse it (don't fight it).
2. `RandomNumberGenerator.Fill` = cryptographically secure randomness (not `Random`). 16 bytes = 128 bits.
3. `context.Items` is a per‑request bag; the nonce lives exactly as long as this request. `HttpContextCspNonceProvider.GetNonce()` reads it back, and your Razor `_Layout` typically emits `<meta name="csp-nonce" content="@nonceProvider.GetNonce()">` plus `nonce="…"` on its own script tags.
4. The default `PolicyTemplate`:

```text
default-src 'self';
script-src 'self' 'nonce-{0}';        ← inline scripts run ONLY if they carry this exact nonce
style-src  'self' 'nonce-{0}';
img-src    'self' data: https:;
font-src   'self' data:;
connect-src 'self';
object-src 'none';                     ← no <object>/<embed> (Flash-era attack surface)
base-uri   'self';                     ← attacker can't repoint relative URLs with <base>
form-action 'self';                    ← forms can't POST to attacker domains
frame-ancestors 'none';               ← the page can't be framed → clickjacking blocked
```

5. Register with `services.AddLaughTaleCsp(...)` + `app.UseLaughTaleCsp()`.

### 2.7.2 How the nonce reaches dynamically injected scripts/styles

The **client** side (`directives/csp.ts`, Part 6.7) discovers the nonce from the DOM (meta tag, `window.__LAUGHTALE_NONCE__`, or an existing `<script nonce>`), caches it, and stamps it onto every `<style>` the runtime injects (`styles.ts`) and every `<script>` the router re‑executes after a navigation (`router.ts`). Result: strict CSP with **no `'unsafe-inline'`**, and the framework's own dynamic injections still run.

## 2.8 The refresh endpoint — `LaughTale.Core/Endpoints/IslandEndpointExtensions.cs`

`app.MapLaughTaleIslandRefresh()` registers `POST /_laughtale/island/{name}`.

```csharp
endpoints.MapPost(pattern, async (string name, HttpContext context) =>
{
    if (string.IsNullOrWhiteSpace(name)) return Results.BadRequest(new { error = "Island name is required." });

    var laughTaleOptions = context.RequestServices.GetService<IOptions<LaughTaleOptions>>()?.Value;

    // 1. Antiforgery (CSRF) validation
    var requireAntiforgery = localOptions.RequireAntiforgery && (laughTaleOptions?.Refresh.RequireAntiforgery ?? true);
    if (requireAntiforgery)
    {
        var antiforgery = context.RequestServices.GetService<IAntiforgery>();
        if (antiforgery != null)
        {
            try { await antiforgery.ValidateRequestAsync(context); }
            catch { return Results.StatusCode(StatusCodes.Status400BadRequest); }   // bad/missing token → 400
        }
    }

    // 2. Authorization — SAME resolution order and SAME registry as the TagHelper
    var authService  = context.RequestServices.GetService<IAuthorizationService>();
    var authRegistry = context.RequestServices.GetService<IIslandAuthorizationRegistry>();
    string? policy = null;
    if (localOptions.IslandPolicies.TryGetValue(name, out var localPol)) policy = localPol;
    else if (laughTaleOptions?.Refresh.IslandPolicies.TryGetValue(name, out var globalPol) == true) policy = globalPol;
    else if (authRegistry != null) policy = authRegistry.GetPolicy(name);

    if (!string.IsNullOrWhiteSpace(policy) && authService != null)
    {
        var authResult = await authService.AuthorizeAsync(context.User, policy);
        if (!authResult.Succeeded) return Results.StatusCode(StatusCodes.Status403Forbidden);  // no body → no leak
    }

    // 3. Read new props from the JSON request body
    string propsJson = "{}";
    if (context.Request.ContentLength > 0)
    {
        using var reader = new StreamReader(context.Request.Body);
        propsJson = await reader.ReadToEndAsync();
    }

    // 4. Emit the fresh island container
    var html = $"<div data-island=\"{WebUtility.HtmlEncode(name)}\" " +
               $"data-props=\"{WebUtility.HtmlEncode(propsJson)}\" data-hydrate=\"load\"></div>";
    context.Response.ContentType = "text/html; charset=utf-8";
    await context.Response.WriteAsync(html);
    return Results.Empty;
})
.WithName("LaughTaleIslandRefresh")
.Produces(StatusCodes.Status200OK, contentType: "text/html")
.Produces(StatusCodes.Status403Forbidden)
.Produces(StatusCodes.Status400BadRequest);
```

Every value written into the response is `WebUtility.HtmlEncode`‑d. The `403`/`400` responses carry **no body**, so a probing attacker learns nothing. The client half of this flow is `refresh.ts` (Part 4.13).

Same file also provides:
- `MapIslandData<T>(pattern, queryProvider, allowedFields)` — data endpoint for grids (2.9).
- `MapLaughTaleIcons()` — serves `/_lt/icons.svg` with `Cache-Control: public, max-age=31536000, immutable`.

## 2.9 The data contract — `IslandDataModels.cs` + `QueryableExtensions.cs`

For 100k‑row grids you don't ship 100k rows; the grid POSTs an `IslandDataRequest` (page, pageSize, sort, filters, globalSearch) and gets back one page as `IslandDataResult<T>`.

```csharp
public static IslandDataResult<T> ToIslandDataResult<T>(
    this IQueryable<T> query, IslandDataRequest request, IReadOnlySet<string>? allowedFields = null)
{
    var (filteredQuery, totalCount) = PrepareQuery(query, request, allowedFields);

    int page = Math.Max(1, request.Page);
    int pageSize = Math.Clamp(request.PageSize, 1, 10000);       // (1) hard cap
    int skip = (page - 1) * pageSize;

    var items = filteredQuery.Skip(skip).Take(pageSize).ToList(); // (2) only NOW does SQL run
    return new IslandDataResult<T>(items, totalCount, page, pageSize);
}
```

`PrepareQuery` builds the query with **Expression Trees**, never string concatenation:

```csharp
// 1. Column filters — every field is validated twice before use
foreach (var filter in request.GetEffectiveFilters())
{
    if (allowedFields != null && !allowedFields.Contains(filter.Field, OrdinalIgnoreCase)) continue;  // (a) allowlist
    if (!properties.TryGetValue(filter.Field, out var prop)) continue;                                 // (b) must be a real property
    query = ApplyFilter(query, prop, filter.Operator, filter.Value);
}

// 2. Global search across string properties only
if (!string.IsNullOrWhiteSpace(request.GlobalSearch))
    query = ApplyGlobalSearch(query, properties, request.GlobalSearch, request.GlobalFilterFields, allowedFields);

// 3. Count AFTER filters, BEFORE paging  → correct "1–10 of 4,732"
int totalCount = query.Count();

// 4. Multi-sort — OrderBy then ThenBy for each descriptor
```

`ApplyFilter` → `BuildComparison` constructs the predicate as data:

```csharp
var parameter    = Expression.Parameter(typeof(T), "x");            // x =>
var propertyAccess = Expression.Property(parameter, prop);          // x.Name
var comparison   = BuildComparison(propertyAccess, prop.PropertyType, op, rawValue);  // x.Name.Contains("foo")
var lambda       = Expression.Lambda<Func<T, bool>>(comparison, parameter);
return source.Where(lambda);                                        // EF Core translates → SQL WHERE
```

Security properties:

- **No SQL string is ever concatenated.** The filter becomes an `Expression` tree that EF Core translates to a parameterised query.
- **Field allowlist**: pass `allowedFields` and only those columns can be filtered/sorted/searched. Even without it, `properties.TryGetValue` means only real model properties are usable — no `"; DROP TABLE"` field names, no navigation‑property traversal.
- **Type‑safe value coercion**: `BuildComparison` parses `rawValue` into the property's actual CLR type (`Guid.Parse`, `Enum.Parse`, `DateTime.Parse` with `InvariantCulture`, else `Convert.ChangeType`) inside a `try/catch` that **returns null** (filter skipped) on failure — a malformed filter value can't crash the endpoint.
- **Paging cap**: `Math.Clamp(pageSize, 1, 10000)` stops `pageSize=99999999` memory blowups.

## 2.10 `MapLaughTaleIcons` — icon caching

```csharp
context.Response.Headers.CacheControl = "public, max-age=31536000, immutable";
context.Response.ContentType = "image/svg+xml; charset=utf-8";
// serves wwwroot/_lt/icons.svg (or a built lucide sprite), else a tiny built-in fallback sprite
```

Registered on `/_lt/icons.svg`, `/_lt/icons-{hash}.svg`, `/icons/lucide-sprites.svg`. `immutable` + 1‑year `max-age` = the browser never revalidates it; a content hash in the filename busts the cache when icons change.

---

# Part 3 — Build & Bootstrap

## 3.1 esbuild outputs (recap from 0.2, with detail)

`esbuild.config.mjs` produces four things from `src/index.ts` and `src/runtime.ts`:

| Output | Format | Contents | Use |
|:--|:--|:--|:--|
| `dist/index.mjs` + `dist/runtime.mjs` + `chunk-*.mjs` | ESM, `splitting: true` | Engine + per‑component chunks, tree‑shakeable. | `import` in a bundler (Vite/webpack). |
| `dist/runtime.js` | IIFE, global `LaughTaleIslands` | **Just the engine** (~38 KB gz): registry + hydrator + directives + router. | `<script src>` drop‑in, register your own islands. |
| `dist/index.js` | IIFE, global `LaughTaleIslands` | Engine **+ all 76 components** pre‑registered (~224 KB gz). | `<script src>` drop‑in, everything available. |

Build fails if a bundle exceeds its byte budget — size is a tested contract.

## 3.2 `src/index.ts` — the built‑in registrations

```ts
import { defineIsland } from './runtime/registry';
export * from './runtime-core';           // re-export the whole engine API

defineIsland('toast',        () => import('./components/toast'));
defineIsland('stepper',      () => import('./components/stepper'));
defineIsland('datatable',    () => import('./components/datatable'));
// … ~120 lines like this, one per component + legacy aliases …
defineIsland('input-text',   () => import('./components/input-text'));
defineIsland('inputtext',    () => import('./components/input-text'));   // alias
```

Every `defineIsland(name, loader)` call is cheap: it just puts `name → loader` in a `Map`. **`import('./components/toast')` does not run** until the hydrator calls that loader for a real `toast` island. That's how "76 components registered" costs almost nothing until used.

## 3.3 The app entry file — `LaughTale.Showcase/Scripts/main.ts`

```ts
import { defineIsland, initIslands, initDirectives, enableViewTransitions }
    from '../../LaughTale.Client/src/index';

// 1. Register YOUR app's islands (in addition to the 76 built-ins)
defineIsland('interactive-counter', () => import('./islands/counter'));
defineIsland('event-broadcaster',   () => import('./islands/broadcaster'));
defineIsland('event-receiver',      () => import('./islands/receiver'));

function initialize() {
    initIslands();            // scan DOM, hydrate islands per strategy
    initDirectives();         // wire all l-* directives
    enableViewTransitions();  // intercept links for SPA-feel nav
}

if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', initialize);
else
    initialize();
```

**What auto‑runs vs. what you call:**

| Thing | Auto? | Notes |
|:--|:--|:--|
| `initDirectives()` | **Yes** on import | `directives/index.ts` self‑runs on `DOMContentLoaded`. Calling it again is safe and needed after DOM swaps. |
| `initIslands()` | **No** | You call it. (Keeps the engine importable in tests/SSR without side effects.) |
| `enableViewTransitions()` | **No** | Opt‑in; also guarded so calling twice is a no‑op. |
| Re‑hydration after SPA nav | Handled | The router calls `initIslands(document.body)` + `initDirectives(document.body)` itself. |

---

# Part 4 — The Client Runtime (TypeScript), line by line

## 4.1 `runtime/registry.ts`

### The types (what every island must look like)

```ts
export interface IslandContext {
    signal: AbortSignal;                 // fires on teardown — pass to fetch()/addEventListener
    onCleanup(fn: () => void): void;     // register a shutdown step
    container: HTMLElement;              // the <div data-island> itself
    name: string;
    locale: string;                     // from the element's lang="" (set by the TagHelper)
    dir: 'ltr' | 'rtl';                 // from the element's dir=""
    t?: (key: string, ...args: any[]) => string;   // translate
    dictionary?: Record<string, any>;
}

export type IslandTeardown = () => void;

export type IslandFactory<TProps = any, THandle = any> = (
    container: HTMLElement,
    props: TProps,
    ctx?: IslandContext
) => void | IslandTeardown | Promise<void | IslandTeardown>;   // may be sync/async, may return cleanup

export interface IslandModule<TProps = any, THandle = any> {
    default: IslandFactory<TProps, THandle>;                    // the mount fn
    readonly displayName?: string;
    readonly propsSchema?: Record<string, any>;
    readonly createHandle?: (container: HTMLElement, props: TProps) => THandle;  // optional imperative API
}

export type IslandLoader<TProps = any, THandle = any> = () => Promise<
    IslandModule<TProps, THandle> | { default: IslandFactory } | IslandFactory
>;

export interface IslandDefinition<TProps = any, THandle = any> {
    name: string;
    loader: IslandLoader<TProps, THandle>;
}
```

`IslandFactory` is **the contract**: `(container, props, ctx) → optional teardown`. Vanilla islands satisfy it directly; React/Vue/Svelte components don't (they have their own mounting API) — that's what adapters bridge (Part 5).

### The registry itself

```ts
export const LEGACY_ALIASES = Object.freeze({
    'confirmdialog': 'confirm-dialog', 'datagrid': 'datatable',
    'tooltip': 'tooltip-component', 'chips': 'input-tags', /* …dozens… */
});

const registry = new Map<string, IslandLoader>();

export function defineIsland<TProps = any, THandle = any>(
    name: string, loader: IslandLoader<TProps, THandle>): void {
    registry.set(name, loader as IslandLoader);
}

export function resolveIslandName(name: string): string {
    if (registry.has(name)) return name;                       // exact match
    if (LEGACY_ALIASES[name]) {
        const canonical = LEGACY_ALIASES[name];
        console.warn(`[LaughTale] Island alias "${name}" is deprecated … use "${canonical}"`);
        return canonical;                                      // old name still works, with a nudge
    }
    return name;
}

export function getIslandDefinition(name: string): IslandDefinition | undefined {
    const resolved = resolveIslandName(name);
    const loader = registry.get(resolved);
    return loader ? { name: resolved, loader } : undefined;    // undefined = you forgot defineIsland
}

export function listIslands(): string[] { return Array.from(registry.keys()); }
export function clearRegistry(): void { registry.clear(); }    // test isolation
```

## 4.2 `runtime/hydrator.ts` — the engine

### State storage

```ts
export type HydrateStrategy = 'load' | 'idle' | 'visible' | 'media' | 'interaction' | 'never';
export type HydrationState  = 'idle' | 'pending' | 'mounted' | 'failed';

const HYDRATION_STATE_KEY = '__laughtale_state__';

export function getIslandState(container: HTMLElement): HydrationState {
    return (container as any)[HYDRATION_STATE_KEY] || 'idle';
}
```

The state lives **on the DOM element**, under a private key. No central registry of live islands to keep in sync — the element *is* the record. `(container as any)` is the "let me attach an arbitrary property" hatch from Part 0.3.

### `initIslands` — the entry point

```ts
export function initIslands(root: ParentNode = document): void {
    initDesignTokens();                                        // (1) inject --lt-* CSS variables
    const islands = root.querySelectorAll<HTMLElement>(
        '[data-island], island, [hydrate], [data-hydrate]');   // (2) find island-ish elements
    islands.forEach(hydrateIsland);                            // (3)
}
```

1. `initDesignTokens()` sets the CSS custom properties (`--lt-primary-500`, …) every component styles against — so a theme change re‑colours all components with no JS.
2. Matches TagHelper output (`[data-island]`), the raw `<island>` tag, and bare `[hydrate]`/`[data-hydrate]`.
3. `root` defaults to the whole document; the router passes `document.body`, the HTMX directive passes just a swapped fragment.

### `hydrateIsland` — choose a strategy

```ts
export function hydrateIsland(container: HTMLElement): void {
    if (getIslandState(container) !== 'idle') return;          // (1) already handled — bail

    const name = container.getAttribute('data-island') || container.getAttribute('name');
    if (!name) return;

    const strategy = (container.getAttribute('data-hydrate')
                   || container.getAttribute('hydrate') || 'load').toLowerCase() as HydrateStrategy;
    const mediaQuery = container.getAttribute('data-media') || container.getAttribute('media');

    switch (strategy) {                                        // (2) dispatch to a scheduler
        case 'load':        executeHydration(container, name); break;
        case 'idle':        hydrateIdle(container, name); break;
        case 'visible':     hydrateVisible(container, name); break;
        case 'interaction': hydrateInteraction(container, name); break;
        case 'media':       hydrateMedia(container, name, mediaQuery); break;
        case 'never':       break;                             // (3) do nothing, forever
        default:            executeHydration(container, name); // unknown string → treat as 'load'
    }
}
```

### The schedulers

**`idle`:**
```ts
function hydrateIdle(container: HTMLElement, name: string): void {
    if ('requestIdleCallback' in window)
        (window as any).requestIdleCallback(() => executeHydration(container, name), { timeout: 2000 });
    else
        setTimeout(() => executeHydration(container, name), 200);   // Safari fallback
}
```
`requestIdleCallback` runs the callback when the main thread is free; `timeout: 2000` forces it after 2 s even if the page stays busy.

**`visible` — one shared observer for the whole page:**
```ts
const visibleElementsMap = new WeakMap<Element, VisibleIslandMeta>();   // node → {container, name}
let sharedVisibleObserver: IntersectionObserver | null = null;

function getSharedVisibleObserver(): IntersectionObserver | null {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return null;
    if (!sharedVisibleObserver) {
        sharedVisibleObserver = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    const meta = visibleElementsMap.get(entry.target);
                    if (meta) {
                        unobserveVisibleIsland(meta.container);         // stop watching first
                        executeHydration(meta.container, meta.name);    // then hydrate
                    }
                }
            }
        }, { rootMargin: '120px' });                                    // fire 120px BEFORE it enters view
    }
    return sharedVisibleObserver;
}

function hydrateVisible(container: HTMLElement, name: string): void {
    const observer = getSharedVisibleObserver();
    if (!observer) { executeHydration(container, name); return; }       // no IO support → just do it

    const meta = { container, name };
    visibleElementsMap.set(container, meta);
    observer.observe(container);
    for (let i = 0; i < container.children.length; i++) {              // also watch children:
        visibleElementsMap.set(container.children[i], meta);           // an island wrapper with
        observer.observe(container.children[i]);                       // display:contents has no box
    }
    container.addEventListener('laughtale:unmount',
        () => unobserveVisibleIsland(container), { once: true });
}
```

```text
    viewport
    ┌──────────────────────────────┐
    │                              │
    │        (visible area)        │
    │                              │
    └──────────────────────────────┘
    · · · · · · · · · · · · · · · · ·   ← rootMargin 120px: the "trip line"
    ┌──────────────────────────────┐
    │  <div data-island="chart">   │   crosses the trip line →
    │       hydrate="visible"       │   observer fires → unobserve → executeHydration
    └──────────────────────────────┘
```

One `IntersectionObserver` for every `visible` island on the page (cheap). `WeakMap` keys don't prevent garbage collection. Children are observed because island wrappers are often `display:contents` (zero‑size, never "intersect").

**`interaction`:**
```ts
function hydrateInteraction(container: HTMLElement, name: string): void {
    const events = ['mouseenter', 'focusin', 'touchstart', 'click'];
    const onInteract = () => {
        events.forEach(e => container.removeEventListener(e, onInteract));  // self-remove
        executeHydration(container, name);
    };
    events.forEach(e => container.addEventListener(e, onInteract, { once: true, passive: true }));
}
```
Cheapest strategy: no work at all until the user hovers/focuses/taps. `passive: true` = the listener won't call `preventDefault`, so the browser doesn't wait on it for scrolling.

**`media`:**
```ts
function hydrateMedia(container: HTMLElement, name: string, query: string | null): void {
    if (!query) { executeHydration(container, name); return; }
    const mql = window.matchMedia(query);
    if (mql.matches) executeHydration(container, name);              // already matches → now
    else {
        const handler = (e: MediaQueryListEvent) => {
            if (e.matches) { mql.removeEventListener('change', handler); executeHydration(container, name); }
        };
        mql.addEventListener('change', handler);                    // hydrate when it starts matching
    }
}
```

### `executeHydration` — the 15 steps

```ts
async function executeHydration(container: HTMLElement, name: string): Promise<void> {
    const currentState = getIslandState(container);
    if (currentState === 'pending' || currentState === 'mounted' || currentState === 'failed') return;  // (1)

    (container as any)[HYDRATION_STATE_KEY] = 'pending';            // (2) SYNC flip before any await

    const definition = getIslandDefinition(name);                  // (3) registry lookup
    if (!definition) {
        (container as any)[HYDRATION_STATE_KEY] = 'failed';
        console.warn(`[LaughTale] Island '${name}' is not registered in the client registry.`);
        return;
    }

    const startMark = `laughtale:hydrate:start:${name}`;
    const endMark   = `laughtale:hydrate:end:${name}`;
    if (typeof performance?.mark === 'function') { try { performance.mark(startMark); } catch {} }

    try {
        await awaitStreamingReady(container);                      // (4) wait for streamed slot HTML

        const rawProps = container.getAttribute('data-props')
                      || container.getAttribute('props-json')
                      || container.getAttribute('props');
        const props = parseAndReviveProps(rawProps);              // (5) JSON → rich objects

        const module: any = await importWithRetry(definition.loader);  // (6) download chunk, w/ retry
        const mount = module?.default || module;
        if (typeof mount !== 'function')
            throw new Error(`Island '${name}' module does not export a mount function.`);

        const customHandle = typeof module?.createHandle === 'function'
            ? module.createHandle(container, props) : {};
        (container as any).island = {                             // (7) imperative handle
            ...customHandle,
            refresh: (newProps?: Record<string, any>) => refreshIsland(container, newProps)
        };

        const abortController = new AbortController();            // (8) build IslandContext
        const cleanups: (() => void)[] = [];
        const localeVal = container.getAttribute('lang') || document.documentElement.lang || 'en';
        const dirVal = (container.getAttribute('dir') || document.documentElement.dir || 'ltr')
                        .toLowerCase() as 'ltr' | 'rtl';
        const ctx: IslandContext = {
            signal: abortController.signal,
            onCleanup: (fn) => cleanups.push(fn),
            container, name, locale: localeVal, dir: dirVal
        };
        const localeHelpers = useLocale(ctx);
        ctx.t = localeHelpers.t;
        ctx.dictionary = localeHelpers.dictionary;

        const unmount = await mount(container, props, ctx);       // (9) RUN THE ISLAND

        const cleanup = () => {                                   // (10) teardown routine
            try { abortController.abort(); } catch {}
            if (typeof unmount === 'function') {
                try { unmount(); } catch (e) { console.error(`… unmounting '${name}':`, e); }
            }
            while (cleanups.length > 0) {
                try { cleanups.pop()!(); } catch (e) { console.error(`… cleanup '${name}':`, e); }
            }
            delete (container as any).island;
        };
        container.addEventListener('laughtale:unmount', cleanup, { once: true });

        (container as any)[HYDRATION_STATE_KEY] = 'mounted';      // (11)

        if (typeof performance?.mark === 'function') {            // (12) RUM metrics
            try { performance.mark(endMark);
                  performance.measure(`laughtale:hydrate:${name}`, startMark, endMark); } catch {}
        }

        container.dispatchEvent(new CustomEvent('laughtale:hydrated', {   // (13)
            bubbles: true, composed: true,
            detail: { name, strategy: container.getAttribute('data-hydrate') }
        }));
    } catch (error: any) {
        (container as any)[HYDRATION_STATE_KEY] = 'failed';       // (14)
        if (globalErrorHandler) {
            try { globalErrorHandler(error, { islandName: name, element: container }); }
            catch (handlerErr) { console.error('… custom hydration error handler:', handlerErr); }
        }
        console.error(`[LaughTale] Error hydrating island '${name}':`, error);
        container.dispatchEvent(new CustomEvent('laughtale:hydration-error', {
            bubbles: true, composed: true, detail: { name, error }
        }));
        try { renderErrorBoundary(container, name, error); }      // (15) fallback UI
        catch (boundaryErr) { console.error('… rendering error boundary:', boundaryErr); }
    }
}
```

| # | Step | Why it matters |
|:--:|:--|:--|
| 1 | **Idempotency guard** | If already `pending`/`mounted`/`failed`, stop. |
| 2 | **Synchronous `'pending'`** | Written *before* the first `await`. JS is single‑threaded up to an `await`, so a second trigger (`visible` + a stray `interaction`) cannot slip between the check and the flip → **no double mount**. |
| 3 | **Registry lookup** | Missing → `'failed'` + a named console warning. The #1 "dead island" cause: forgot `defineIsland`. |
| 4 | **Streaming wait** | If the response is still streaming, wait for `<!--island:end:name-->` so the island doesn't mount against half‑delivered slot HTML. |
| 5 | **Prop revival** | `data-props` (or aliases `props-json`/`props`) → real `Date`/`Map`/… (4.3). Never throws. |
| 6 | **Resilient import** | `importWithRetry` downloads the component chunk; retries with backoff + jitter (4.4). |
| 7 | **Imperative handle** | `element.island.refresh(...)` for app code; merges the module's optional `createHandle` (e.g. a Toast exposing `.show()`). |
| 8 | **Context assembly** | `AbortController.signal` for the island's `fetch`/listeners; `cleanups` array behind `ctx.onCleanup`; `locale`/`dir` read back off the element; `ctx.t` translator. |
| 9 | **Mount** | The island's `default` export runs. May be async; may return a teardown. |
| 10 | **Teardown wiring** | One `laughtale:unmount` listener that: aborts the signal, calls the island's `unmount`, drains `ctx.onCleanup` **LIFO**, deletes `.island`. Every step individually `try/catch`ed. |
| 11 | `'mounted'`. | |
| 12 | **RUM** | `performance.measure("laughtale:hydrate:toast", …)` shows in DevTools ▸ Performance; analytics can scrape per‑island hydration cost. |
| 13 | **`laughtale:hydrated`** bubbles | Pages/tests can wait for "island X is live". |
| 14 | **Failure** | `'failed'`; your `setHydrationErrorHandler` callback (Sentry/App Insights) fires; `laughtale:hydration-error` bubbles. |
| 15 | **Error boundary** | Shows the fallback slot + a dev‑mode overlay with a Retry button (4.6). |

```text
                hydrateIsland()          strategy fires
   ┌────────┐  ────────────────────▶  ┌───────────┐
   │  idle  │                         │  pending  │
   └────────┘                         └─────┬─────┘
       ▲  retryIsland() / rehydrateIsland()  │  mount() settles
       │  (reset the state key)      ┌───────┴────────┐
       │                       ok    │                │  threw
       │                     ┌───────▼────┐    ┌───────▼─────┐
       └─────────────────────┤  mounted   │    │   failed    │
                             └──────┬─────┘    └──────┬──────┘
                'laughtale:unmount' │                 │ error handler cb
                    abort + unmount │                 │ 'laughtale:hydration-error'
                    + LIFO cleanups │                 │ renderErrorBoundary()
```

### Recovery helpers

```ts
export async function retryIsland(container: HTMLElement): Promise<void> {
    const name = container.getAttribute('data-island') || container.getAttribute('name');
    if (!name) return;
    (container as any)[HYDRATION_STATE_KEY] = 'idle';         // reset…
    await executeHydration(container, name);                  // …and go again  (used by the Retry button)
}

export async function rehydrateIsland(container: HTMLElement): Promise<void> {
    const name = container.getAttribute('data-island');
    if (!name) return;
    delete (container as any)[HYDRATION_STATE_KEY];           // full reset
    await executeHydration(container, name);                  // used by refresh.ts after a DOM morph
}
```

## 4.3 `runtime/reviver.ts` — JSON back into rich objects

```ts
export type PropTypeDiscriminator = 0|1|2|3|4|5|6|7|8;   // Object,Array,RegExp,Date,Map,Set,BigInt,URL,Uint8Array

const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})?)?$/;

const propTypes: Record<number, (value: any) => any> = {
    0: (v) => reviveObject(v),
    1: (v) => reviveArray(v),
    2: (v) => new RegExp(v),
    3: (v) => new Date(v),
    4: (v) => new Map(reviveArray(v)),
    5: (v) => new Set(reviveArray(v)),
    6: (v) => BigInt(v),
    7: (v) => new URL(v, window.location.origin),
    8: (v) => { const b = atob(v); const a = new Uint8Array(b.length);
                for (let i = 0; i < b.length; i++) a[i] = b.charCodeAt(i); return a; }
};

export function reviveTuple(raw: any): any {
    if (Array.isArray(raw) && raw.length === 2 && typeof raw[0] === 'number' && raw[0] in propTypes)
        return propTypes[raw[0]](raw[1]);                    // explicit [typeId, value] tuple
    if (typeof raw === 'string' && ISO_DATE_REGEX.test(raw)) {
        const d = new Date(raw);
        if (!isNaN(d.getTime())) return d;                   // loose: any ISO string → Date
    }
    if (Array.isArray(raw))            return reviveArray(raw);
    if (typeof raw === 'object' && raw !== null) return reviveObject(raw);
    return raw;                                              // primitive — untouched
}

export function reviveArray(raw: any[]): any[] { return raw.map(reviveTuple); }
export function reviveObject(raw: Record<string, any>): Record<string, any> {
    if (!raw || typeof raw !== 'object') return raw;
    const out: Record<string, any> = {};
    for (const [k, v] of Object.entries(raw)) out[k] = reviveTuple(v);   // recurse every value
    return out;
}

export function parseAndReviveProps(rawJson: string | null | undefined): Record<string, any> {
    if (!rawJson || rawJson.trim() === '' || rawJson === '{}') return {};
    try { return reviveTuple(JSON.parse(rawJson)); }
    catch (err) {
        console.error('[LaughTale] Failed to parse and revive island props:', err, rawJson);
        return {};                                          // NEVER throws — bad props = no props, not a dead page
    }
}
```

It walks the whole parsed tree recursively, so a `Date` nested three arrays deep still comes back as a real `Date`. The hydrator calls `parseAndReviveProps` at step 5; a malformed `data-props` yields `{}` and the island still mounts.

## 4.4 `runtime/retry.ts` — resilient chunk loading

```ts
export async function importWithRetry<T = any>(
    loader: (() => Promise<T>) | string,
    options: RetryOptions | number = 3, legacyBaseDelayMs = 1000): Promise<T> {

    const opts = typeof options === 'number'
        ? { retries: options, baseDelayMs: legacyBaseDelayMs, maxDelayMs: 10000, jitter: true }
        : { retries: options?.retries ?? 3, baseDelayMs: options?.baseDelayMs ?? 1000,
            maxDelayMs: options?.maxDelayMs ?? 10000, jitter: options?.jitter ?? true };

    if (typeof loader === 'function') {
        for (let attempt = 0; attempt < opts.retries; attempt++) {
            try { return await loader(); }                          // ← () => import('./toast')
            catch (err) {
                if (attempt === opts.retries - 1) throw err;        // out of tries
                const rawDelay = Math.min(opts.maxDelayMs, opts.baseDelayMs * 2 ** attempt);
                const jitterFactor = opts.jitter ? (0.75 + Math.random() * 0.5) : 1;
                const delay = Math.round(rawDelay * jitterFactor);
                console.warn(`[LaughTale] Island dynamic import failed. Retrying in ${delay}ms…`);
                await new Promise(r => setTimeout(r, delay));
            }
        }
    } else {
        // string-URL branch: same loop, plus append ?island-retry=<timestamp>
        // to bypass the browser's cached failed-module entry.
    }
    throw lastError ?? new Error(`Failed to load island after ${opts.retries} attempts.`);
}
```

Backoff table (`baseDelayMs = 1000`, `maxDelayMs = 10000`):

| Attempt | `2**attempt` | `rawDelay` | with jitter ×[0.75, 1.25] |
|:--:|:--:|:--:|:--:|
| 0 → 1 | 1 | 1000 ms | 750–1250 ms |
| 1 → 2 | 2 | 2000 ms | 1500–2500 ms |
| 2 → 3 | 4 | 4000 ms | 3000–5000 ms |
| … | | capped at 10000 ms | |

**Why jitter:** if a CDN blips and 5,000 open tabs all retry after exactly 2 s, they hammer it in lockstep. Multiplying each delay by a random 0.75–1.25 smears the retries out.

Islands are the prime beneficiary: a component chunk is fetched lazily, often minutes after load, exactly when the connection is worst (user walked into a lift).

## 4.5 `runtime/streaming.ts` — the completion marker protocol

```ts
export function awaitStreamingReady(container: HTMLElement): Promise<void> {
    const islandId = container.getAttribute('data-island-id') || container.getAttribute('data-island');
    const markerValue = `island:end:${islandId}`;

    if (document.readyState === 'complete' || !container.hasAttribute('data-streaming'))
        return Promise.resolve();                              // not streaming → proceed now

    for (let node = container.lastChild; node; node = node.previousSibling)   // marker already here?
        if (node.nodeType === Node.COMMENT_NODE &&
            (node.nodeValue?.trim() === markerValue || node.nodeValue?.trim() === 'island:end')) {
            node.remove(); return Promise.resolve();
        }

    return new Promise((resolve) => {                          // else wait for it via MutationObserver
        const observer = new MutationObserver(() => {
            for (let node = container.lastChild; node; node = node.previousSibling)
                if (node.nodeType === Node.COMMENT_NODE && /* same marker check */) {
                    node.remove(); observer.disconnect(); resolve(); break;
                }
        });
        observer.observe(container, { childList: true });
        document.addEventListener('DOMContentLoaded', () => { observer.disconnect(); resolve(); });
    });
}
```

When ASP.NET streams HTML in chunks, an island's `<div>` can be in the DOM before its slot content and its `<!--island:end:name-->` comment have arrived. This makes hydration wait for that comment, then removes it.

## 4.6 `runtime/error-boundary.ts`

```ts
export function isDevMode(): boolean {
    return (window as any).__LAUGHTALE_DEV__ === true
        || window.location?.hostname === 'localhost'
        || window.location?.hostname === '127.0.0.1';
}

export function renderErrorBoundary(container: HTMLElement, name: string, error: Error): void {
    // 1. Activate a fallback, in priority order:
    const fallbackTemplate = container.querySelector('template[data-slot="fallback"]');
    const fallbackSlot     = container.querySelector('[data-slot="fallback"]');
    const fallbackAttr     = container.getAttribute('data-fallback');
    if (fallbackTemplate)                              container.innerHTML = fallbackTemplate.innerHTML;
    else if (fallbackSlot && fallbackSlot.tagName !== 'TEMPLATE') container.innerHTML = fallbackSlot.innerHTML;
    else if (fallbackAttr)                             container.innerHTML = `<div class="island-fallback-content">${fallbackAttr}</div>`;

    // 2. Dev only: a red diagnostic overlay with a "🔄 Retry Hydration" button → retryIsland(container),
    //    the error message, and a collapsible stack trace.
    if (isDevMode()) { /* builds and appends .laughtale-dev-error-overlay */ }
}
```

Production users see the fallback content; developers additionally get an inline error card with one‑click retry.

## 4.7 `runtime/styles.ts` — one stylesheet per component

```ts
const injectedStyles  = new Map<string, string>();       // islandName → css currently active
const pendingStyles   = new Map<string, string>();       // islandName → css waiting to flush
const adoptedSheetMap = new Map<string, CSSStyleSheet>();
let flushScheduled = false;

export function isAdoptedStyleSheetsSupported(): boolean {
    return typeof document !== 'undefined' && 'adoptedStyleSheets' in document
        && typeof CSSStyleSheet !== 'undefined' && 'replaceSync' in CSSStyleSheet.prototype;
}

export function injectIslandStyle(islandName: string, css: string): void {
    if (injectedStyles.get(islandName) === css) return;  // identical → no-op (dedupe)
    injectedStyles.set(islandName, css);
    pendingStyles.set(islandName, css);
    if (isAdoptedStyleSheetsSupported()) {
        if (!flushScheduled) { flushScheduled = true; queueMicrotask(flushPendingStyles); }  // batch
    } else {
        flushPendingStyles();
    }
}

export function flushPendingStyles(): void {
    flushScheduled = false;
    if (pendingStyles.size === 0) return;
    if (isAdoptedStyleSheetsSupported()) {
        const sheetsToAdd: CSSStyleSheet[] = [];
        pendingStyles.forEach((css, islandName) => {
            let sheet = adoptedSheetMap.get(islandName) ?? new CSSStyleSheet();
            adoptedSheetMap.set(islandName, sheet);
            sheet.replaceSync(css);
            if (!document.adoptedStyleSheets.includes(sheet)) sheetsToAdd.push(sheet);
        });
        if (sheetsToAdd.length) document.adoptedStyleSheets = [...document.adoptedStyleSheets, ...sheetsToAdd];
    } else {
        // fallback: <style data-island-style="name"> in <head>, with a CSP nonce via applyNonceToStyle()
    }
    pendingStyles.clear();
}
```

- **Dedupe:** ten `toggle-switch` islands → `injectIslandStyle('laughtale-toggleswitch', CSS)` ten times → stylesheet added **once**.
- **Batching:** many islands hydrating in the same tick → their sheets are collected in a `Map` and attached in one `document.adoptedStyleSheets = [...]` assignment (one style recalculation, not ten).
- **`adoptedStyleSheets`** = constructable stylesheets: no `<style>` DOM node, no parser round‑trip. Fallback path creates a `<style>` with the CSP nonce.
- `removeIslandStyle` / `clearAllIslandStyles` exist for HMR and teardown.

## 4.8 `runtime/slots.ts` + `runtime/parts.ts`

**Slots** — read the server HTML you nested inside `<island>`:
```ts
export function getSlot(container: HTMLElement, name = 'default'): HTMLElement | null {
    return container.querySelector(`[data-slot="${name}"]`);
}
export function hasSlot(container, name = 'default'): boolean { return getSlot(container, name) !== null; }
export function extractSlotContent(container, name = 'default'): string {
    return getSlot(container, name)?.innerHTML ?? '';
}
```

**Parts** — the customization‑precedence merge every component uses for its sub‑elements (`root`, `trigger`, `panel`, `item`, …):
```ts
export function resolvePart(partName, defaultClass = '', pt?, studioOverrides?): ResolvedPart {
    // precedence, lowest → highest:
    // 1. default component classes
    // 2. theme tokens (CSS variables — applied via CSS, not here)
    // 3. Theme Studio per-part overrides (studioOverrides[partName])
    // 4. consumer passthrough (pt[partName]) — class / style / arbitrary aria-*/data-* attrs
    // returns { className, style, attributes: { 'data-part': partName, ... } }
}
export function applyPart(element, partName, defaultClass, pt?, studioOverrides?): HTMLElement { /* writes them onto the element */ }
```
`pt` (passthrough) lets a consumer do `pt={ panel: { class: 'shadow-xl', 'aria-label': 'Menu' } }` without the component exposing a prop for every sub‑element.

## 4.9 `runtime/events.ts` — the event bus (entire file)

```ts
type Handler<T = any> = (detail: T) => void;
const bus = new Map<string, Set<Handler>>();

export function emitIslandEvent<T = any>(event: string, detail?: T): void {
    const handlers = bus.get(event);
    if (handlers) handlers.forEach(fn => {
        try { fn(detail); }
        catch (err) { console.error(`[LaughTale] Error in event listener for "${event}":`, err); }  // one bad handler ≠ break the rest
    });
    window.dispatchEvent(new CustomEvent(`island:${event}`, { detail }));   // DOM mirror for outside listeners
}

export function onIslandEvent<T = any>(event: string, handler: Handler<T>): () => void {
    if (!bus.has(event)) bus.set(event, new Set());
    bus.get(event)!.add(handler);
    return () => {                                    // ← unsubscribe function
        const set = bus.get(event);
        if (set) { set.delete(handler); if (set.size === 0) bus.delete(event); }  // last one out deletes the key
    };
}
```

- `bus`: `Map` from event name → `Set` of handlers (Set = same fn can't register twice).
- `emitIslandEvent` calls each handler in `try/catch`, then **also** dispatches a real `window` `CustomEvent` named `island:<event>` so analytics / directives / non‑island code can listen.
- `onIslandEvent` returns its own unsubscribe. Idiom in an island:
  ```ts
  const off = onIslandEvent('cart:add', d => updateBadge(d.sku));
  ctx?.onCleanup(off);        // auto-unsubscribe on teardown
  ```
- Deliberately minimal: no wildcards, no priorities, no async. Loose coupling by design.

### Component Events (`emitComponentEvent`)

Components dispatch standard DOM events bubbling from their container element using the unified naming contract `laughtale:<component>:<event>` (e.g. `laughtale:slider:change`):

```ts
import { emitComponentEvent } from '../runtime/events';

// Inside a component island:
emitComponentEvent(container, 'slider', 'change', { value: 42 });
```

> **Deprecation Notice**: Legacy pre-unified event names (such as bare `change` or unprefixed `slider:change`) are automatically supported as backward-compatible aliases with a one-time console warning per session, and will be removed in `v1.1.0`. All new code and listeners should subscribe to canonical `laughtale:<component>:<event>`.

## 4.10 `runtime/state.ts` — the shared store (entire file)

```ts
type Listener<T> = (value: T, prev: T) => void;

export class IslandStore<T> {
    private value: T;
    private listeners = new Set<Listener<T>>();
    constructor(initialValue: T) { this.value = initialValue; }

    get(): T { return this.value; }

    set(next: T | ((prev: T) => T)): void {
        const prev = this.value;
        this.value = typeof next === 'function' ? (next as (p: T) => T)(prev) : next;
        if (this.value !== prev) this.listeners.forEach(fn => fn(this.value, prev));  // notify only on real change
    }

    subscribe(listener: Listener<T>): () => void {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);   // unsubscribe
    }
}

const stores = new Map<string, IslandStore<any>>();

export function useSharedState<T>(key: string, initialValue?: T): IslandStore<T> {
    if (!stores.has(key)) stores.set(key, new IslandStore(initialValue as T));  // first caller's initial wins
    return stores.get(key)!;
}
```

Usage:
```ts
const theme = useSharedState<'light'|'dark'>('theme', 'light');
const off = theme.subscribe(v => container.dataset.theme = v);
ctx?.onCleanup(off);
// a theme-toggle island elsewhere:
theme.set(t => t === 'light' ? 'dark' : 'light');
```

**Bus vs. store:** bus = *moments* ("a thing happened", missed if you weren't subscribed). Store = *facts* ("the current value is X", readable immediately by a late‑hydrating island).

## 4.11 `runtime/scope.ts` — bundled teardown

```ts
export function createScope(): IslandScope {
    const cleanups: Array<() => void> = [];
    let isDisposed = false;
    return {
        on(target, event, handler, options) {
            if (isDisposed || !target) return;
            target.addEventListener(event, handler, options);
            cleanups.push(() => target.removeEventListener(event, handler, options));
        },
        observe(observer) {                       // IntersectionObserver / ResizeObserver / MutationObserver
            if (isDisposed || !observer) return;
            cleanups.push(() => { try { observer.disconnect(); } catch {} });
        },
        timer(id) {                               // setInterval / setTimeout id
            if (isDisposed || id == null) return;
            cleanups.push(() => { try { clearInterval(id); clearTimeout(id); } catch {} });
        },
        cleanup(fn) { if (!isDisposed && typeof fn === 'function') cleanups.push(fn); },
        dispose() {
            if (isDisposed) return;
            isDisposed = true;
            while (cleanups.length > 0) {          // LIFO — reverse of registration order
                try { cleanups.pop()?.(); }
                catch (error) { console.error('[LaughTale Scope] cleanup error:', error); }
            }
        }
    };
}
```

```ts
export default function ChartIsland(container, props, ctx) {
    const scope = createScope();
    scope.on(window, 'resize', redraw);
    const ro = new ResizeObserver(redraw); ro.observe(container); scope.observe(ro);
    scope.timer(setInterval(poll, 5000));
    scope.cleanup(() => chart.destroy());
    return () => scope.dispose();     // hydrator calls this on 'laughtale:unmount'
}
```

`dispose()` is **idempotent** (safe to call twice), **LIFO** (tear down in reverse of build‑up), and **fault‑tolerant** (one failure doesn't block the rest).

## 4.12 `runtime/commands.ts` — named commands (an anti‑`eval` measure)

```ts
const commandRegistry = new Map<string, CommandHandler>();

export function registerCommand(name: string, handler: CommandHandler): void {
    if (typeof name !== 'string' || !name.trim()) return;
    if (typeof handler !== 'function') return;
    commandRegistry.set(name.trim(), handler);
}

export function executeCommand(name: string, item?: any): boolean {
    const handler = commandRegistry.get(name?.trim());
    if (!handler) { console.warn(`[LaughTale Commands] Command "${name}" is not registered.`); return false; }
    try { handler(item); return true; }
    catch (err) { console.error(`[LaughTale Commands] Error executing "${name}":`, err); return false; }
}
```

**Why it exists:** a menu/table server prop might want to say "when this row is clicked, do X". The unsafe way is to ship a JS string and `eval` it. Instead the server ships a **name** (`"deleteRow"`), the client registers a real function under that name at startup, and `executeCommand("deleteRow", row)` looks it up. Server data can never become executed code.

## 4.13 `runtime/refresh.ts` — server‑driven single‑island refresh

```ts
export async function refreshIsland(container: HTMLElement, newProps?: Record<string, any>,
                                    options: RefreshOptions = {}): Promise<void> {
    const name = container.getAttribute('data-island');
    if (!name) { console.warn('[LaughTale] Cannot refresh element without data-island.'); return; }

    const endpoint = options.endpoint || `/_laughtale/island/${encodeURIComponent(name)}`;

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'X-Requested-With': 'LaughTale-IslandRefresh'
    };
    const csrfInput = document.querySelector<HTMLInputElement>('input[name="__RequestVerificationToken"]');
    const csrfMeta  = document.querySelector<HTMLMetaElement>('meta[name="request-verification-token"], meta[name="csrf-token"]');
    const token = csrfInput?.value || csrfMeta?.content;
    if (token) { headers['RequestVerificationToken'] = token; headers['X-CSRF-TOKEN'] = token; }

    // Capture focus + caret BEFORE we touch the DOM
    const activeEl = document.activeElement as HTMLElement | null;
    const isFocusInside = activeEl && container.contains(activeEl);
    const focusedSelector = isFocusInside ? getElementSelector(activeEl, container) : null;
    const selectionStart = (activeEl as HTMLInputElement)?.selectionStart;
    const selectionEnd   = (activeEl as HTMLInputElement)?.selectionEnd;

    const response = await fetch(endpoint, {
        method: 'POST', headers, body: JSON.stringify(newProps || {}), signal: options.signal
    });
    if (!response.ok) throw new Error(`Failed to refresh island '${name}': HTTP ${response.status}`);

    const html = await response.text();
    const doc  = new DOMParser().parseFromString(html, 'text/html');
    const incomingRoot = doc.querySelector<HTMLElement>(`[data-island="${name}"]`)
                      || doc.body.firstElementChild as HTMLElement;
    if (!incomingRoot) return;

    const updatedProps = incomingRoot.getAttribute('data-props');
    if (updatedProps) container.setAttribute('data-props', updatedProps);   // adopt new props

    morphElement(container, incomingRoot);                                  // in-place DOM update
    await rehydrateIsland(container);                                       // re-mount with new props

    if (focusedSelector) {                                                  // restore focus + caret
        const restoredEl = container.querySelector<HTMLElement>(focusedSelector);
        if (restoredEl?.focus) {
            restoredEl.focus();
            if (selectionStart != null && (restoredEl as HTMLInputElement).setSelectionRange)
                try { (restoredEl as HTMLInputElement).setSelectionRange(selectionStart, selectionEnd ?? selectionStart); } catch {}
        }
    }
}
```

`morphElement` — a minimal DOM diff so scroll/focus survive:
```ts
function morphElement(existing: HTMLElement, incoming: HTMLElement): void {
    for (const attr of Array.from(incoming.attributes))                    // 1. add/update attrs
        if (existing.getAttribute(attr.name) !== attr.value) existing.setAttribute(attr.name, attr.value);
    for (const attr of Array.from(existing.attributes))                   // 2. remove gone attrs (keep style)
        if (!incoming.hasAttribute(attr.name) && attr.name !== 'style') existing.removeAttribute(attr.name);
    if (incoming.children.length > 0) existing.innerHTML = incoming.innerHTML;   // 3. replace inner HTML
}
```

`getElementSelector(el, root)` builds a stable relative selector to re‑find the focused field after the morph: prefers `#id`, then `[name="…"]`, then `[data-part="…"]`, else a `tag.class > tag.class` path from `root`.

The server half is 2.8. Full trace: Part 9.3.

---

# Part 5 — Framework Adapters

## 5.1 Why adapters exist

The hydrator only knows one shape: `mount(container, props, ctx) => teardown`. A React component is `function Counter(props) { return <button>… }` — it doesn't touch the DOM itself; you need `ReactDOM.createRoot(el).render(<Counter/>)`. Vue, Svelte, Preact each have their own mounting call and their own teardown call.

```text
        LaughTale contract                 React reality
        ─────────────────                  ────────────
        mount(el, props, ctx)              const root = createRoot(el)
          → writes DOM                     root.render(createElement(Counter, props))
          → returns teardown()             root.unmount()   ← teardown

   An ADAPTER is the glue:  createReactIsland(Counter)  produces a function
   with the LaughTale shape that internally does the React calls.
```

`LaughTale.Core` (and the client engine) has **zero** dependency on any framework. Each adapter **dynamically imports** its framework at mount time, so the framework only downloads if you actually use an island that needs it — and two islands using *different* frameworks coexist on one page with no conflict.

## 5.2 `adapters/vanilla.ts` — the identity adapter

```ts
export type VanillaMountFn<TProps = any> = (container: HTMLElement, props: TProps) => (() => void) | void;

export function createVanillaIsland<TProps = any>(mount: VanillaMountFn<TProps>): VanillaMountFn<TProps> {
    return mount;      // a vanilla mount fn ALREADY is the contract — nothing to adapt
}
export const createVanillaAdapter = createVanillaIsland;
```

## 5.3 `adapters/react.ts` — line by line

```ts
export function createReactIsland<TProps = any>(Component: any, options: ReactAdapterOptions = {}) {
    return async (container: HTMLElement, props: TProps, ctx?: IslandContext) => {          // (1) LaughTale shape
        try {
            const React: any          = await import(/* @vite-ignore */ 'react');            // (2) lazy import
            const ReactDOMClient: any = await import(/* @vite-ignore */ 'react-dom/client');

            const createElement = React.createElement || React.default?.createElement;       // (3) interop: ESM vs CJS
            const createRoot    = ReactDOMClient.createRoot || ReactDOMClient.default?.createRoot;
            const hydrateRoot   = ReactDOMClient.hydrateRoot || ReactDOMClient.default?.hydrateRoot;

            if (createRoot && createElement) {
                let root: any;
                if (options.hydrate && hydrateRoot && container.hasChildNodes()) {           // (4) attach to SSR markup
                    root = hydrateRoot(container, createElement(Component, props as any));
                } else {                                                                     // (5) fresh client render
                    root = createRoot(container);
                    root.render(createElement(Component, props as any));
                }

                const unmount = () => { try { root?.unmount(); } catch {} };                 // (6) teardown

                if (ctx?.signal) ctx.signal.addEventListener('abort', unmount, { once: true });  // (7) wire to signal
                if (ctx?.onCleanup) ctx.onCleanup(unmount);                                       //     AND onCleanup
                return unmount;                                                              // (8) also return it
            }
        } catch {
            console.warn('[LaughTale] React / ReactDOM not found. Falling back to direct execution.');
            if (typeof Component === 'function') return Component(container, props, ctx);     // (9) last-ditch fallback
        }
    };
}
```

1. Returns an **async function** matching `IslandFactory`. This is what you pass to `defineIsland`.
2. `import('react')` runs only now. `/* @vite-ignore */` tells bundlers "don't try to resolve this at build time".
3. Depending on how React was published/bundled, the export may be on `.default`. `X || X.default?.Y` covers both.
4. `options.hydrate: true` + existing server markup → `hydrateRoot` **attaches** to it (no re‑paint). This is React attaching to SSR'd HTML *inside* the island.
5. Otherwise `createRoot(...).render(...)` builds fresh.
6. `unmount` calls React's own `root.unmount()`, swallowing errors if the DOM is already gone.
7. **Belt and braces:** the teardown is registered on `ctx.signal`'s `abort` event, on `ctx.onCleanup`, *and* returned. Any of the three teardown paths the hydrator might use will unmount React.
8. Return it (step 10 of `executeHydration` keeps it as `unmount`).
9. If React genuinely isn't present, and `Component` happens to be a plain function, just call it — degrade rather than throw.

## 5.4 `adapters/vue.ts`

```ts
const Vue: any = await import('vue');
const createApp    = Vue.createApp || Vue.default?.createApp;
const createSSRApp = Vue.createSSRApp || Vue.default?.createSSRApp;
const h            = Vue.h || Vue.default?.h;

const appFactory = (options.hydrate && createSSRApp && container.hasChildNodes()) ? createSSRApp : createApp;
const app = appFactory({ render() { return h(Component, props as any); } });
app.mount(container);

const unmount = () => { try { app.unmount(); } catch {} };
if (ctx?.signal)    ctx.signal.addEventListener('abort', unmount, { once: true });
if (ctx?.onCleanup) ctx.onCleanup(unmount);
return unmount;
```

Same pattern: `createSSRApp` (hydrate existing markup) vs `createApp` (fresh), teardown = `app.unmount()` wired three ways.

## 5.5 `adapters/svelte.ts` — handles Svelte 4 **and** 5

```ts
const svelte: any = await import('svelte').catch(() => null);

if (svelte && typeof svelte.mount === 'function') {                       // ── Svelte 5 ──
    const mount = (options.hydrate && typeof svelte.hydrate === 'function' && container.hasChildNodes())
        ? svelte.hydrate : svelte.mount;
    const instance = mount(Component, { target: container, props: props as any });
    unmountFn = () => { try { svelte.unmount?.(instance); } catch {} };
} else if (typeof Component === 'function') {                             // ── Svelte 4 ──
    try {
        const instance = new Component({ target: container, props: props as any, hydrate: options.hydrate });
        unmountFn = () => { try { instance.$destroy?.(); } catch {} };
    } catch {
        const result = Component(container, props, ctx);                  // maybe it's a plain mount fn
        if (typeof result === 'function') unmountFn = result;
    }
}
if (unmountFn) {
    if (ctx?.signal)    ctx.signal.addEventListener('abort', unmountFn, { once: true });
    if (ctx?.onCleanup) ctx.onCleanup(unmountFn);
    return unmountFn;
}
```

Svelte 5 uses module functions `mount` / `hydrate` / `unmount`. Svelte 4 uses `new Component({ target })` and `instance.$destroy()`. The adapter feature‑detects and picks the right pair.

## 5.6 `adapters/preact.ts`

```ts
const preact: any = await import('preact');
const h = preact.h || preact.default?.h;
const render = preact.render || preact.default?.render;
const hydrate = preact.hydrate || preact.default?.hydrate;

if (options.hydrate && hydrate && container.hasChildNodes()) hydrate(h(Component, props as any), container);
else                                                         render(h(Component, props as any), container);

const unmount = () => { try { render(null, container); } catch {} };     // Preact teardown = render null
if (ctx?.signal)    ctx.signal.addEventListener('abort', unmount, { once: true });
if (ctx?.onCleanup) ctx.onCleanup(unmount);
return unmount;
```

Preact unmounts by rendering `null` into the same container.

## 5.7 The common pattern & coexistence

| Adapter | Fresh render | Hydrate SSR | Teardown |
|:--|:--|:--|:--|
| React | `createRoot().render()` | `hydrateRoot()` | `root.unmount()` |
| Vue | `createApp().mount()` | `createSSRApp().mount()` | `app.unmount()` |
| Svelte 5 | `mount()` | `hydrate()` | `unmount(instance)` |
| Svelte 4 | `new Component({target})` | `new Component({target, hydrate:true})` | `instance.$destroy()` |
| Preact | `render(vnode, el)` | `hydrate(vnode, el)` | `render(null, el)` |
| Vanilla | your `mount` fn | — | your returned fn |

All five: **lazy‑import the framework**, wire teardown to `ctx.signal` + `ctx.onCleanup` + the return value, and fall back to direct execution if the framework is missing. Because each island gets its own framework root scoped to its own `container`, a React island and a Svelte island on the same page never touch each other.

## 5.8 Registering a React island end to end

```ts
// counter.tsx  (your component — plain React, knows nothing about LaughTale)
export function Counter({ start = 0 }: { start?: number }) {
    const [n, setN] = React.useState(start);
    return <button onClick={() => setN(n + 1)}>Count: {n}</button>;
}

// islands/counter.ts  (the island module the loader points at)
import { createReactIsland } from 'laughtale/adapters/react';
import { Counter } from './counter';
export default createReactIsland(Counter);           // ← now it matches (container, props, ctx) => teardown

// main.ts
defineIsland('counter', () => import('./islands/counter'));
```

```razor
@* Razor *@
<island name="counter" hydrate="visible" framework="react" props='new { start = 10 }' />
```

The TagHelper emits `data-framework="react"`; the hydrator still just calls `mount` — the adapter inside `islands/counter.ts` does the React‑specific work.

---

# Part 6 — The Directives Layer (zero‑JS interactivity)

Directives are `l-*` HTML attributes for interactivity too small to justify an island (a toggle, a dropdown, a live counter, a fetch‑and‑swap). No JavaScript authoring; you write attributes in Razor.

## 6.1 `initDirectives` — `directives/index.ts`

```ts
export function initDirectives(root: ParentNode = document): void {
    // 1. Every [l-state] element gets a reactive data scope
    root.querySelectorAll<HTMLElement>('[l-state]').forEach((el) => {
        const initialData = JSON.parse(el.getAttribute('l-state') || '{}');
        const scope = createReactiveScope(el, initialData);
        bindStoragePersistence(el, scope);            // [l-persist] → localStorage
    });

    // 2. Walk every element; bind whatever l-* attributes it has
    root.querySelectorAll<HTMLElement>('*').forEach((el) => {
        // A. l-bind / l-bind:attr / l-model / l-class / l-style   → bindElementReactivity
        // B. l-on:* / l-listen:* / l-emit                          → bindElementEvents
        // C. l-get / l-post / l-put / l-delete                     → bindServerAction (HTMX-style)
        // D. l-mask   (on <input>)                                 → bindInputMask
        // E. l-show / l-hide / l-copy / l-toggle                   → bindUtilityDirectives
        // F. l-hotkey / l-shortcut                                 → bindHotkeyDirectives
        // G. l-tooltip                                             → bindTooltipDirectives
        // H. l-outside                                             → bindOutsideClickDirectives
        // I. l-poll                                                → bindPollingDirectives
        // J. l-intersect                                           → bindIntersectionDirectives
        // K. l-scroll-to                                           → bindScrollToDirectives
        // L. l-badge                                               → bindBadgeDirectives
        // M. l-teleport                                            → bindTeleportDirectives
    });
}

// Auto-runs on import (unlike initIslands):
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading')
        document.addEventListener('DOMContentLoaded', () => initDirectives());
    else initDirectives();
}
```

## 6.2 `directives/reactivity.ts` — the reactive scope

```ts
const elementScopeMap = new WeakMap<HTMLElement, ReactiveScope>();

export function createReactiveScope(container: HTMLElement, initialData: Record<string, any>): ReactiveScope {
    const listeners = new Set<() => void>();
    const state = new Proxy(initialData, {                                   // (1) a JS Proxy
        set(target, prop, value) {
            if (!isSafeProperty(prop)) { console.warn(`… Blocked assignment to "${String(prop)}"`); return true; }
            target[prop as string] = value;
            listeners.forEach(fn => fn());                                  // (2) any write re-runs all bindings
            return true;
        },
        get(target, prop) {
            if (!isSafeProperty(prop)) { console.warn(`… Blocked access to "${String(prop)}"`); return undefined; }
            return target[prop as string];
        }
    });
    const scope: ReactiveScope = { state, listeners, container };
    elementScopeMap.set(container, scope);
    return scope;
}

export function getNearestScope(element: HTMLElement): ReactiveScope | undefined {
    let current: HTMLElement | null = element;
    while (current) {                                                       // (3) walk up the DOM
        const scope = elementScopeMap.get(current);
        if (scope) return scope;
        current = current.parentElement;
    }
    return undefined;
}
```

1. A **`Proxy`** wraps the plain data object. Reading/writing `state.open` goes through the `get`/`set` traps.
2. **Reactivity model:** every `set` calls every registered listener. A listener is "re‑evaluate this one binding and update the DOM". Coarse but tiny — no virtual DOM, no dependency tracking.
3. Bindings on child elements find their data with `getNearestScope` — climb parents until an element has a scope. So `l-state` on a `<div>` covers everything inside it.

```ts
export function bindElementReactivity(element: HTMLElement, scope: ReactiveScope): void {
    for (const attr of Array.from(element.attributes)) {
        if (attr.name === 'l-bind') {                                       // text content
            const update = () => { element.textContent = String(evaluateExpression(attr.value, scope.state) ?? ''); };
            scope.listeners.add(update); update();
        } else if (attr.name.startsWith('l-bind:')) {                       // l-bind:href="..."
            const targetAttr = attr.name.slice(7);
            if (!isSafeAttribute(targetAttr)) continue;                     // blocks on*, formaction, ...
            const update = () => {
                let val = evaluateExpression(attr.value, scope.state);
                if (['href','src','action'].includes(targetAttr.toLowerCase())) val = sanitizeUrl(val);  // URL guard
                if (val === false || val == null) element.removeAttribute(targetAttr);
                else if (val === true) element.setAttribute(targetAttr, '');
                else element.setAttribute(targetAttr, String(val));
            };
            scope.listeners.add(update); update();
        } else if (attr.name === 'l-class') {   /* object → classList.toggle per key; string → className */ }
        else if (attr.name === 'l-style') {     /* object → Object.assign(element.style, val) */ }
    }

    if (element.hasAttribute('l-model')) {                                  // two-way binding
        const propName = element.getAttribute('l-model')!;
        if (!isSafeProperty(propName)) return;
        const input = element as HTMLInputElement;
        const update = () => {                                             // model → view
            if (input.type === 'checkbox') input.checked = Boolean(scope.state[propName]);
            else input.value = scope.state[propName] ?? '';
        };
        scope.listeners.add(update); update();
        const evt = (input.type === 'checkbox' || input.tagName === 'SELECT') ? 'change' : 'input';
        input.addEventListener(evt, () => {                                // view → model
            if (input.type === 'checkbox')      scope.state[propName] = input.checked;
            else if (input.type === 'number')   scope.state[propName] = input.value === '' ? null : Number(input.value);
            else                                scope.state[propName] = input.value;
        });
    }
}
```

Note `l-bind` writes with `element.textContent` (never `innerHTML`) — inherently XSS‑proof. URL‑bearing attributes are run through `sanitizeUrl` (6.6).

## 6.3 The Expression Sandbox — `directives/expression/*`

This is the security centrepiece. `l-on:click="count++"` and `l-show="user.isAdmin && open"` contain code‑like strings. Running them with `new Function(expr)` or `eval` would give any string on the page full access to `window`, `document`, `fetch`, cookies — a stored‑XSS jackpot. LaughTale instead **implements a tiny language**: tokenize → parse to an AST → walk the AST with an interpreter that only exposes safe values.

```text
  "count++"           lexer.ts            parser.ts             evaluator.ts
  ──────────▶  [IDENT "count"] [OP "++"]  ──▶  UpdateExpression  ──▶  reads state.count,
                                               { op:"++",             writes state.count+1,
                                                 argument: Identifier  returns old value
                                                 "count", prefix:false}
```

### 6.3.1 `lexer.ts` — tokenizer that rejects danger words up front

```ts
export const FORBIDDEN_KEYWORDS = new Set([
    'new','function','class','import','export','return','with','while','for','do','switch','case',
    'break','continue','debugger','var','let','const','throw','try','catch','finally','yield',
    'async','await','delete','void'
]);

public tokenize(): Token[] {
    const tokens: Token[] = [];
    while (this.pos < this.len) {
        this.skipWhitespace();
        const ch = this.src[this.pos];
        if (ch === '/' && next is '/' or '*') { skip comment; continue; }
        if (isDigit(ch) || (ch==='.' && digit next)) { tokens.push(this.readNumber()); continue; }
        if (ch === '"' || ch === "'")               { tokens.push(this.readString(ch)); continue; }
        if (ch === '`')                             { tokens.push(this.readTemplateLiteral()); continue; }
        if (isIdentStart(ch))                       { tokens.push(this.readIdentifierOrKeyword()); continue; }
        const multi = this.readOperatorOrPunctuation();
        if (multi) { tokens.push(multi); continue; }
        throw new Error(`Unexpected character '${ch}' at position ${this.pos}`);
    }
    tokens.push({ type: 'EOF', value: '', pos: this.pos });
    return tokens;
}

private readIdentifierOrKeyword(): Token {
    const word = /* scan [A-Za-z0-9_$]+ */;
    if (word === 'true')  return { type: 'BOOLEAN', raw: true, ... };
    if (word === 'false') return { type: 'BOOLEAN', raw: false, ... };
    if (word === 'null')  return { type: 'NULL', raw: null, ... };
    if (word === 'undefined') return { type: 'UNDEFINED', raw: undefined, ... };
    if (FORBIDDEN_KEYWORDS.has(word)) return { type: 'FORBIDDEN_KEYWORD', value: word, ... };  // ← poisoned token
    return { type: 'IDENTIFIER', value: word, ... };
}

private readOperatorOrPunctuation(): Token | null {
    // 3-char: === !== >>> **= &&= ||= ??=
    // 2-char: == != <= >= && || ?? ++ -- += -= *= /= %= ?. =>
    //   ── '=>' is returned as a FORBIDDEN_KEYWORD  (no arrow functions allowed)
    //   ── '?.' is PUNCTUATION (optional chaining is fine)
    // 1-char punct: ( ) [ ] { } , ; . : ?
    // 1-char ops:   + - * / % & | ^ ! ~ < > =
}
```

Anything that could declare code, loop, or build a function is a **token type** (`FORBIDDEN_KEYWORD`) that the parser refuses. Arrow `=>` is explicitly poisoned too. Comments are stripped.

### 6.3.2 `ast.ts` — the grammar of what's *allowed*

The full node list: `Literal`, `Identifier`, `UnaryExpression` (`! + - ~ typeof`), `BinaryExpression` (`+ - * / % == === != !== < <= > >= in instanceof`), `LogicalExpression` (`&& || ??`), `ConditionalExpression` (`a ? b : c`), `MemberExpression` (`a.b`), `IndexExpression` (`a[b]`), `CallExpression` (`f(x)`), `ArrayLiteral`, `ObjectLiteral`, `TemplateLiteral`, `AssignmentExpression` (`= += -= *= /=`), `UpdateExpression` (`++ --`), `SequenceExpression` (`a; b`).

**Not in the list, therefore impossible to represent:** function declarations, arrow functions, `new`, `class`, control flow, `import`, spread, destructuring. The grammar itself is the allowlist.

### 6.3.3 `parser.ts` — recursive descent with security checks

```ts
public static parse(source: string): ASTNode {
    const lexer = new Lexer(source.trim());
    const parser = new Parser(lexer.tokenize());
    const node = parser.parseStatementSequence();
    if (!parser.isAtEnd()) throw new ParseError(`Unexpected token '${parser.peek().value}'`, parser.peek().pos);
    return node;
}
```

Precedence ladder (each method calls the next‑tighter one): `parseAssignment → parseTernary → parseNullish → parseLogicalOr → parseLogicalAnd → parseEquality → parseRelational → parseAdditive → parseMultiplicative → parseUnary → parsePostfix → parsePrimary`.

```ts
private parsePrimary(): ASTNode {
    const token = this.peek();
    if (token.type === 'FORBIDDEN_KEYWORD')
        throw new ParseError(`Forbidden keyword '${token.value}' is prohibited`, token.pos);   // ← hard stop
    // NUMBER/STRING/BOOLEAN/NULL/UNDEFINED → Literal
    // IDENTIFIER → validatePropertyName(...) then { type:'Identifier', name }
    // ( expr ) grouping ; [ ... ] array ; { k: v } object
}

private validatePropertyName(name: string, pos: number): void {
    const forbidden = ['constructor','__proto__','prototype','__defineGetter__','__defineSetter__',
                       '__lookupGetter__','__lookupSetter__'];
    if (forbidden.includes(name))
        throw new ParseError(`Access to restricted property '${name}' is blocked for security`, pos);
}

private parseAssignment(): ASTNode {
    const expr = this.parseTernary();
    if (this.check('OPERATOR') && ['=','+=','-=','*=','/='].includes(this.peek().value)) {
        const op = this.advance();
        const right = this.parseAssignment();
        if (expr.type === 'Identifier' || expr.type === 'MemberExpression' || expr.type === 'IndexExpression')
            return { type: 'AssignmentExpression', operator: op.value, left: expr, right };
        throw new ParseError('Invalid left-hand side in assignment', op.pos);   // can't assign to a literal/call
    }
    return expr;
}
```

`validatePropertyName` blocks `constructor`/`__proto__`/`prototype` at **parse** time — the classic `({}).constructor.constructor("alert(1)")()` sandbox‑escape can't even be parsed.

### 6.3.4 `evaluator.ts` — the tree‑walking interpreter

```ts
const FORBIDDEN_PROPERTIES = new Set(['constructor','__proto__','prototype',
    '__defineGetter__','__defineSetter__','__lookupGetter__','__lookupSetter__']);

const FORBIDDEN_IDENTIFIERS = new Set(['window','document','globalThis','top','parent','frames','self',
    'location','localStorage','sessionStorage','indexedDB','cookie','eval','Function','XMLHttpRequest',
    'fetch','setTimeout','setInterval','setImmediate','clearTimeout','clearInterval','clearImmediate',
    'process','require','importScripts']);

const SAFE_BUILTINS: Record<string, any> = {
    Math: Object.freeze(Math), Number: Object.freeze(Number), String: Object.freeze(String),
    Boolean: Object.freeze(Boolean), Date: Object.freeze(Date), Array: Object.freeze(Array),
    Object: Object.freeze(Object), JSON: Object.freeze(JSON),
    parseInt, parseFloat, isNaN, isFinite,
    encodeURI, encodeURIComponent, decodeURI, decodeURIComponent
};

const astCache = new Map<string, ASTNode>();
const MAX_CACHE_SIZE = 500;

export function parseExpressionToAst(expr: string): ASTNode | null {
    const trimmed = expr.trim();
    if (!trimmed) return null;
    let ast = astCache.get(trimmed);
    if (!ast) {
        ast = Parser.parse(trimmed);
        if (astCache.size >= MAX_CACHE_SIZE) astCache.delete(astCache.keys().next().value);  // simple LRU-ish
        astCache.set(trimmed, ast);
    }
    return ast;
}

export function evaluateAst(ast: ASTNode, state: Record<string, any>, extraContext: Record<string, any> = {}): any {
    switch (ast.type) {
        case 'Literal': return ast.value;

        case 'Identifier': {
            const name = ast.name;
            if (FORBIDDEN_PROPERTIES.has(name) || FORBIDDEN_IDENTIFIERS.has(name)) {
                console.warn(`[LaughTale Security] Blocked access to forbidden identifier: "${name}"`);
                return undefined;                                       // window/fetch/eval → undefined
            }
            if (extraContext && Object.prototype.hasOwnProperty.call(extraContext, name)) return extraContext[name];  // $event/$el/$emit
            if (state && Object.prototype.hasOwnProperty.call(state, name)) return state[name];                        // reactive state
            if (Object.prototype.hasOwnProperty.call(SAFE_BUILTINS, name)) return SAFE_BUILTINS[name];                 // Math/JSON/...
            return undefined;
        }

        case 'BinaryExpression': { /* +,-,*,/,%,==,===,...,in,instanceof */ }
        case 'LogicalExpression': { /* &&, ||, ?? with short-circuit */ }
        case 'ConditionalExpression': { /* test ? a : b */ }

        case 'MemberExpression': {
            const obj = evaluateAst(ast.object, state, extraContext);
            if (obj == null) return undefined;
            const prop = ast.property;
            if (FORBIDDEN_PROPERTIES.has(prop) || FORBIDDEN_IDENTIFIERS.has(prop)) {
                console.warn(`[LaughTale Security] Blocked access to restricted property: "${prop}"`);
                return undefined;                                       // a.constructor → undefined
            }
            return obj[prop];
        }

        case 'CallExpression': {
            let fn: any; let thisArg: any = state;
            if (ast.callee.type === 'MemberExpression') {
                const obj = evaluateAst(ast.callee.object, state, extraContext);
                if (obj == null) return undefined;
                const prop = ast.callee.property;
                if (FORBIDDEN_PROPERTIES.has(prop) || FORBIDDEN_IDENTIFIERS.has(prop)) return undefined;
                fn = obj[prop]; thisArg = obj;                          // method call: obj.method(...)
            } else {
                fn = evaluateAst(ast.callee, state, extraContext);
            }
            if (typeof fn !== 'function') return undefined;
            if (fn === Function || (typeof eval !== 'undefined' && fn === eval)) {   // last line of defense
                console.warn('[LaughTale Security] Blocked execution of dynamic Function/eval constructor');
                return undefined;
            }
            const args = ast.args.map(a => evaluateAst(a, state, extraContext));
            return fn.apply(thisArg, args);
        }

        case 'AssignmentExpression': return applyAssignment(ast.left, ast.operator, evaluateAst(ast.right, ...), state, extraContext);
        case 'UpdateExpression':     return applyUpdate(ast.argument, ast.operator, ast.prefix, state, extraContext);
        case 'SequenceExpression':   { let r; for (const e of ast.expressions) r = evaluateAst(e, ...); return r; }
        // ArrayLiteral / ObjectLiteral / TemplateLiteral ...
        default: return undefined;
    }
}
```

Defense layers, in order an attacker would hit them:

| Attempt | Blocked by |
|:--|:--|
| `l-on:click="for(;;){}"` | lexer → `FORBIDDEN_KEYWORD` `for` → parse error |
| `l-on:click="() => fetch('/steal')"` | lexer poisons `=>`; `fetch` also in `FORBIDDEN_IDENTIFIERS` |
| `l-bind="window.location = evil"` | `window` → `FORBIDDEN_IDENTIFIERS` → `undefined` |
| `l-bind="({}).constructor.constructor('...')()"` | parser `validatePropertyName` blocks `constructor` |
| `l-bind="user['__proto__']['x'] = 1"` | evaluator `IndexExpression` checks `FORBIDDEN_PROPERTIES` on the computed key |
| `l-on:click="someFn()"` where `someFn` resolved to `Function`/`eval` | explicit `fn === Function || fn === eval` guard in `CallExpression` |
| deeply nested expression as a DoS | `astCache` (parse once), and there's no loop construct to burn CPU |

What *is* allowed: arithmetic, comparisons, `&&`/`||`/`??`, ternary, member/index access on **your** state, calling **methods that exist on your state objects**, `Math`/`JSON`/`Date`/… (frozen), assignments and `++`/`--` on state, template literals, array/object literals.

### 6.3.5 Worked example: `l-on:click="open = !open"`

1. **Lexer** → `[IDENTIFIER "open"] [OPERATOR "="] [OPERATOR "!"] [IDENTIFIER "open"] [EOF]`
2. **Parser** → `parseAssignment` sees `=`, LHS is an `Identifier` (valid target) →
   `{ type:'AssignmentExpression', operator:'=', left:{Identifier "open"}, right:{ UnaryExpression '!', argument:{Identifier "open"} } }`
3. **Evaluator** → `applyAssignment`: evaluate `right` = `!evaluateAst(Identifier "open")` = `!state.open`. `left` is `Identifier "open"`, not forbidden → `state.open = !state.open`.
4. `state` is the **Proxy** from 6.2 → its `set` trap runs every listener → every `l-show`/`l-bind` in the scope re‑evaluates → the `l-show="open"` element appears/disappears.

## 6.4 `directives/events.ts` — `l-on:*`, `l-listen:*`, `l-emit`

```ts
if (attr.name.startsWith('l-on:')) {
    const rawEvent = attr.name.slice(5);                  // "click.prevent.debounce.300ms"
    const [eventName, ...modifiers] = rawEvent.split('.');// "click", ["prevent","debounce","300ms"]
    let debounceMs = 0, throttleMs = 0;
    for (let i = 0; i < modifiers.length; i++) {
        if (modifiers[i] === 'debounce') debounceMs = parseDurationMs(modifiers[i+1] ?? '') || 250;
        if (modifiers[i] === 'throttle') throttleMs = parseDurationMs(modifiers[i+1] ?? '') || 250;
    }

    const executeHandler = (e: Event) => {
        if (modifiers.includes('prevent')) e.preventDefault();
        if (modifiers.includes('stop'))    e.stopPropagation();
        if (modifiers.includes('enter')  && (e as KeyboardEvent).key !== 'Enter')  return;
        if (modifiers.includes('escape') && (e as KeyboardEvent).key !== 'Escape') return;
        const context = {
            $event: e,
            $el: element,
            $emit: (channel: string, payload: any) =>
                window.dispatchEvent(new CustomEvent(`laughtale:${channel}`, { detail: payload, bubbles: true }))
        };
        executeStatement(attr.value, scope ? scope.state : {}, context);   // ← the sandbox runs the expression
    };

    const handler = (e: Event) => {
        if (debounceMs > 0) { clearTimeout(timer); timer = setTimeout(() => executeHandler(e), debounceMs); }
        else if (throttleMs > 0) { const now = Date.now(); if (now - last >= throttleMs) { last = now; executeHandler(e); } }
        else executeHandler(e);
    };

    const target = modifiers.includes('window') ? window
                 : modifiers.includes('document') ? document : element;
    target.addEventListener(eventName, handler, { once: modifiers.includes('once') });
}
```

Modifiers: `.prevent` `.stop` `.enter` `.escape` `.debounce.<ms>` `.throttle.<ms>` `.once` `.window` `.document`. Inside the expression you get `$event`, `$el`, `$emit`.

```ts
if (attr.name.startsWith('l-listen:')) {                 // l-listen:cartUpdated="badge = $event.count"
    const channel = attr.name.slice(9);
    window.addEventListener(`laughtale:${channel}`, (e: any) =>
        executeStatement(attr.value, scope ? scope.state : {}, { $event: e.detail, $el: element, $emit }));
}
if (attr.name === 'l-emit') {                            // l-emit="cartUpdated"  (fires on click)
    element.addEventListener('click', () =>
        window.dispatchEvent(new CustomEvent(`laughtale:${attr.value}`, { bubbles: true })));
}
```

`l-emit`/`l-listen` and the event bus (`emitIslandEvent`) both funnel through `window` `CustomEvent`s, so directive land and island land can talk.

## 6.5 `directives/poll.ts` — `l-poll`

```ts
if (attr.name.startsWith('l-poll')) {                    // l-poll.5s="tick++"  or  l-poll.3000ms
    let intervalMs = 3000;
    for (const part of attr.name.split('.')) {
        if (part.endsWith('ms')) intervalMs = parseFloat(part) || intervalMs;
        else if (part.endsWith('s')) intervalMs = (parseFloat(part) || 3) * 1000;
    }
    const runPoll = () => {
        if (!document.body.contains(element)) { clearInterval(intervalId); return; }   // self-cancel when detached
        if (attr.value) executeStatement(attr.value, scope?.state ?? {}, { $el: element, $emit });
        else element.dispatchEvent(new CustomEvent('laughtale:poll-trigger', { bubbles: true }));  // trigger l-get/l-post
    };
    const intervalId = setInterval(runPoll, intervalMs);
}
```

This is LaughTale's answer to "live updates" without websockets/SignalR: poll every N seconds, and it stops itself the moment the element leaves the DOM.

## 6.6 `directives/security.ts` — sanitizers

```ts
const SAFE_PROTOCOLS = new Set(['http:', 'https:', 'mailto:', 'tel:', 'blob:']);
const SAFE_IMAGE_DATA_REGEX = /^data:image\/(png|jpeg|jpg|gif|webp|svg\+xml)(?:;[a-z0-9-]+=[a-z0-9-]+)*;base64,[a-z0-9+/=\s]+$/i;

export function sanitizeUrl(url: unknown): string {
    if (typeof url !== 'string') return '';
    const trimmed = url.trim(); if (!trimmed) return '';
    const cleaned = trimmed.replace(/[ -\s]+/g, '');       // 1. strip control chars + whitespace
    const lower = cleaned.toLowerCase();
    if (lower.startsWith('javascript:') || lower.startsWith('vbscript:') || lower.startsWith('data:text/html')
        || lower.startsWith('data:application/') || lower.startsWith('data:text/javascript') || lower.startsWith('file:')) {
        console.warn(`[LaughTale Security] Blocked dangerous URL protocol: "${trimmed}"`);
        return 'about:blank';                                              // 2. explicit dangerous schemes
    }
    if (/^[/#?]|^\.\.?\//.test(trimmed)) return trimmed;                   // 3. relative paths / anchors are fine
    if (lower.startsWith('data:')) return SAFE_IMAGE_DATA_REGEX.test(cleaned) ? trimmed : 'about:blank';  // 4. only raster/svg image data URIs
    try {                                                                 // 5. parse with WHATWG URL
        const parsed = new URL(trimmed, document.baseURI || 'http://localhost');
        return SAFE_PROTOCOLS.has(parsed.protocol) ? trimmed : 'about:blank';
    } catch { return 'about:blank'; }
}

export function isSafeAttribute(attrName: string): boolean {
    const lower = attrName.toLowerCase();
    if (lower.startsWith('on') || DANGEROUS_ATTRIBUTES.has(lower)) {       // onerror, onload, formaction, ...
        console.warn(`[LaughTale Security] Blocked dangerous dynamic attribute binding: "${attrName}"`);
        return false;
    }
    return true;
}
```

`sanitizeHtml(html)` (used where a component must render server‑provided rich text): parse into an **inert** document (`DOMParser`), then `cleanNode` recursively —

- tag not in `ALLOWED_TAGS` (a curated set of typography/table/img/safe‑SVG tags) → drop it;
- strip every `on*` attribute; drop any attribute not in `ALLOWED_ATTRS` and not `data-`/`aria-`;
- run `href`/`src`/`action`/`poster`/`xlink:href` values through `sanitizeUrl`;
- for `<a target="_blank">` force `rel="noopener noreferrer"`;
- remove comment nodes;
- if the browser supports **Trusted Types**, return the result wrapped by a `laughtale-html` policy.

`createSandboxState(state)` wraps a state object in a `Proxy` that blocks get/set/has on `BLOCKED_PROPERTIES` (`__proto__`, `constructor`, `window`, `document`, `fetch`, …) — a second belt around the evaluator's own checks.

## 6.7 `directives/csp.ts` — nonce discovery

```ts
export function getCspNonce(): string | null {
    if (cachedNonce) return cachedNonce;
    // 1. <meta name="csp-nonce" content="...">
    // 2. window.__LAUGHTALE_NONCE__
    // 3. any existing <script nonce="...">
    // 4. document.currentScript.nonce
    // → cache and return, or null
}
export function applyNonceToStyle(style: HTMLStyleElement): void  { const n = getCspNonce(); if (n) style.setAttribute('nonce', n); }
export function applyNonceToScript(script: HTMLScriptElement): void{ const n = getCspNonce(); if (n) script.setAttribute('nonce', n); }
```

Consumed by `styles.ts` (fallback `<style>`) and `router.ts` (re‑executed `<script>`s). The nonce originates from `LaughTaleCspMiddleware` (2.7.1).

## 6.8 Directive catalogue

| Directive | Purpose |
|:--|:--|
| `l-state='{"open":false}'` | Declare a reactive data scope on this element + its subtree. |
| `l-bind="expr"` / `l-bind:attr="expr"` | Bind text content / an attribute to an expression. URL attrs auto‑sanitized. |
| `l-model="prop"` | Two‑way bind an input/select/textarea/checkbox to a state property. |
| `l-class="expr"` / `l-style="expr"` | Bind classList (object of `{name: bool}`) / inline styles (object). |
| `l-on:evt[.mods]="stmt"` | Event handler through the sandbox. Mods: prevent/stop/enter/escape/debounce.Nms/throttle.Nms/once/window/document. |
| `l-listen:channel="stmt"` / `l-emit="channel"` | Receive / fire a `laughtale:<channel>` `CustomEvent`. |
| `l-get`/`l-post`/`l-put`/`l-delete` + `l-target`/`l-swap`/`l-trigger`/`l-indicator` | HTMX‑style: fetch server HTML and swap it into a target; re‑runs `initIslands`/`initDirectives` on the new fragment. |
| `l-mask="(999) 999-9999"` | Keystroke input mask. |
| `l-show`/`l-hide="expr"` | Toggle visibility. |
| `l-copy="text"` / `l-toggle="selector"` | Copy to clipboard / toggle a class or attribute on a target. |
| `l-hotkey="ctrl+k"` / `l-shortcut` | Keyboard shortcut → click/handler. |
| `l-tooltip="text"` | Aura tooltip. |
| `l-outside="stmt"` | Run when a click lands outside this element (dropdowns, popovers). |
| `l-poll[.5s]="stmt"` | Interval polling; auto‑stops when detached. |
| `l-intersect="stmt"` | Run when the element scrolls into view. |
| `l-scroll-to` | Smooth‑scroll to a target. |
| `l-badge="count"` | Status badge overlay. |
| `l-teleport="selector"` | Move this node elsewhere in the DOM (modals, portals). |
| `l-persist` | Persist the nearest `l-state` scope to `localStorage`. |
| `data-persist="id"` (on an `<island>`) | Router keeps this island alive across page navigations. |

## 6.9 `LaughTaleDirectiveTagHelper.cs` — a C# no‑op for IntelliSense

```csharp
[HtmlTargetElement("*", Attributes = "l-state")]
[HtmlTargetElement("*", Attributes = "l-on")]
// … one line per directive …
public class LaughTaleDirectiveTagHelper : TagHelper
{
    [HtmlAttributeName("l-state")] public string? State { get; set; }
    // … one property per directive …
    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        // Directives are parsed client-side. This TagHelper exists ONLY so the Razor
        // compiler and IDEs (VS / Rider) recognize l-* attributes and offer autocomplete
        // instead of flagging them as unknown.
    }
}
```

It emits nothing. Its whole job is to make `l-*` attributes first‑class in the editor.
