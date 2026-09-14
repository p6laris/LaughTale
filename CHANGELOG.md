# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **RTL Adoption: Logical Properties, Icon Mirroring & Behavioral Fixes (Part C / ROADMAP.v5.md §5):**
  - `dir` ('ltr'/'rtl') already flowed correctly end-to-end (server-resolved culture → DOM `dir` attribute
    → `IslandContext.dir` → `useLocale(ctx).isRtl`); this pass is about components actually reading it.
    `rtlAdoption` (components with at least one direction-aware CSS/JS token) went from **8 of 76** to
    **49 of 76** (`LaughTale.Client/scripts/metrics-baseline.json`).
  - Converted physical CSS properties to their logical equivalents (`margin-left/right` →
    `margin-inline-start/end`, `padding-left/right` → `padding-inline-start/end`, `border-left/right` →
    `border-inline-start/end`, physical corner radii → `border-start-start-radius`/`-end-start-`/etc.,
    `text-align: left/right` → `start/end`, and positional `left/right` → `inset-inline-start/end` for
    icon/affordance placement) across **42** components that previously had zero direction-handling, plus
    targeted gap-fixes in 5 of the original partially-RTL 8 (`sidebar`, `tree`, `treetable`, `split-button`,
    `picklist`). Deliberately left as physical/direction-neutral: explicit corner-position variants
    (`toast`'s position variants, `speed-dial`'s fan-out direction, `drawer`/`sidebar`'s explicit
    left/right side props, `datatable`'s frozen-column side), centering math (`left: 50%` + equal negative
    margin), and symmetric full-bleed declarations (`left: 0; right: 0`).
  - Extended icon mirroring (`[dir="rtl"] … svg { transform: scaleX(-1) }`, or a rotation-sign flip for
    `galleria`'s `rotate()`-based chevrons, which don't mirror correctly under `scaleX`) to 7 more
    components: `datepicker` (month nav chevrons), `cascadeselect` (submenu flyout chevron), `tieredmenu`
    (submenu arrow), `tree-select` (node-expand toggler), `datatable` (row-expand toggle), `galleria`
    (prev/next nav), and `split-button` (submenu-indicator chevron, filling a gap in its otherwise-complete
    existing RTL CSS).
  - **`useFloatingPosition.ts` now mirrors placement under RTL** (new optional `isRtl` option, defaulting
    to the floating element's own computed `direction` when omitted): a `'*-start'`/`'*-end'` placement
    now aligns to the reference element's *logical* start/end edge instead of always physically left/right,
    and pure `'left'`/`'right'` compass placements swap sides. Previously the resolver hardcoded
    `'start'` → `refRect.left` and `'end'` → `refRect.right - floatRect.width` with no `dir` input at all.
    **This is the widest-reaching change in this pass** — the composable backs 14 components'
    floating overlays and submenu flyouts (`autocomplete`, `cascadeselect`, `color-picker`, `confirm-popup`,
    `context-menu`, `datepicker`, `menu`, `menubar`, `multiselect`, `popover`, `select`, `split-button`,
    `tieredmenu`, `tree-select`), all now threading `isRtl` from `useLocale(ctx)` at their call sites
    (`confirm-popup`'s global singleton overlay relies on the new auto-detect default instead, since it has
    no natural per-call locale context). Fully behavior-preserving for existing LTR callers — mirroring is
    a no-op when `isRtl` is false, which is the existing default and covers every pre-existing test.
  - Fixed 4 more RTL geometry bugs that CSS alone can't reach, each backed by a new unit test proving the
    RTL result mirrors LTR (not just "doesn't throw"): `slider.ts`'s drag-ratio calculation (extracted into
    an exported pure `computeHorizontalRatio`) now flips under RTL so dragging moves the handle the
    correct direction; `splitter.ts`'s drag-delta sign (`computeSplitterDeltaPct`) now inverts under RTL to
    account for `flex-direction: row` mirroring which panel is visually "prev"; `rating.ts`'s half-star
    hit-test (`isLowerHalfHit`) and its visual half-fill overlay (`.p-rating-half-overlay`, converted to
    `inset-inline-start`) now agree on which physical half represents the lower half-value under RTL, where
    previously only the CSS class list handling was RTL-aware and the hit-test/visual crop were not;
    `toggle-switch.ts`'s handle (previously zero dir-handling at all — a textbook RTL bug for a toggle) now
    rests on the logical start edge and slides toward the logical end (`getToggleHandleTransform`, applied
    as an inline `transform` since `translateX` has no logical-property equivalent).
  - Left unfixed and documented in source rather than guessed at: `scrollarea.ts`'s custom horizontal
    scrollbar drag math, because browsers disagree on `scrollLeft`'s sign/zero-point under `dir="rtl"`
    (Chrome/Safari go negative past 0, Firefox's legacy behavior differs from both) and this couldn't be
    verified cross-browser in this environment; `image-compare.ts`'s divider drag, judged direction-neutral
    by UI convention (a before/after slider, not a value that reads left-to-right).
  - New tests: `LaughTale.Client/tests/composables/floating-position.test.ts` (4 new cases covering
    `mirrorPlacementForRtl`, `'*-start'` mirroring, pure `'left'/'right'` mirroring, and the computed-style
    auto-detect default) and a new `LaughTale.Client/tests/components/rtl-direction.test.ts` (14 cases
    covering the `slider`/`splitter`/`rating`/`toggle-switch` pure functions in both directions).
- **Smaller `data-props` Payloads & Named Island Props Types (Part J / ROADMAP.v5.md §11):**
  - `IslandJson` now omits default-valued properties from `data-props` JSON (`DefaultIgnoreCondition.WhenWritingDefault`, previously `WhenWritingNull`, which only ever dropped `null`s and could never catch a non-nullable value type's default). Corrected the roadmap's stale "198 of 325 props have a non-null default" to the real pre-fix count — **401 of 665** — across the 81 `[Island(...)]` records in `LaughTale.Components/Models/ComponentModels.cs`. Measured on a 5-island sample rendered with no attributes set: `<island-accordion>` 18 → 2 bytes, `<island-datatable>` 208 → 2 bytes, `<island-select>` 209 → 75 bytes, `<island-checkbox>` 123 → 17 bytes, `<island-slider>` 57 → 2 bytes (~84% weighted reduction). This is backward compatible for any client reading props with `??`/`?.`-style fallbacks, which the client component set already does broadly (`propsNullishDefaultAdoption: 24` new metric in `LaughTale.Client/scripts/audit-metrics.mjs`/`metrics-baseline.json`).
  - `IslandGenerator.GenerateTagHelper`'s `BuildProps()` now returns a named `internal sealed record {TagHelperName}WireProps` per generator-emitted island (67 of them) instead of an anonymous `new { ... }` object — same field set, mechanically renamed — removing the literal blocker that made these props types impossible to target with `System.Text.Json`'s `[JsonSerializable]`/`JsonSerializerContext` source generator (which cannot target anonymous types at all).
  - `IslandJson.SerializeProps(object?, IJsonTypeInfoResolver?)` (new overload) lets a caller in another assembly combine in its own resolver (e.g. a source-generated `JsonSerializerContext`) ahead of the default reflection-based resolver, via `JsonTypeInfoResolver.Combine`, with `LaughTale.Core` never referencing that assembly or its generator output. Proven correct with a fully hand-written type/context pair (`LaughTale.Tests/Serialization/IslandJsonTests.cs`); not currently exercised by any real caller — see the BREAKING-adjacent note below on why the natural candidate (the 67 generator-emitted `WireProps` types) doesn't work.
  - `IsTrimmable`/`EnableTrimAnalyzer` enabled for the first time on `LaughTale.Core` and `LaughTale.Components` (no trim/AOT attempt existed anywhere in this repo before now). Surfaces 30 IL trim warnings solution-wide as a real baseline for future work; 2 are attributable to props serialization (irreducible while a reflection fallback exists for arbitrary/hand-written props types) and 28 are pre-existing and unrelated (endpoint-routing reflection, assembly-scanning authorization discovery, dynamic form/query reflection).
  - New regression tests: `LaughTale.Tests/Serialization/IslandPropsPayloadTests.cs` (defaults omitted end-to-end for 3 representative islands, a non-default value still comes through, `pt`'s arbitrary runtime value still round-trips) and 3 new cases in `IslandJsonTests.cs` (the resolver-combining seam works, falls back to reflection for an unknown runtime type, and is stable across repeated calls with the same resolver instance).
  - **Not done, and why:** a working `JsonSerializerContext` covering the 67 generator-emitted `WireProps` types does not exist and, as far as this pass could determine, is not achievable without a bigger restructure (e.g. moving those types to a separately-built project) — confirmed empirically that `System.Text.Json`'s own source generator cannot introspect a type produced by a different Roslyn generator (`IslandGenerator`), even when the `[JsonSerializable]`-decorated context class is itself hand-written, original source (`SYSLIB1030` for every one of the 67 types; an otherwise-identical fully hand-written probe type succeeded). Reflection remains the only working serialization path for generator-emitted islands. Separately, the 15 hand-written TagHelpers' own anonymous props (`LaughTale.Components/TagHelpers/Aura/{Menu,Messages,Misc,Overlay}/*.cs`) were left unconverted — unlike the generator-emitted path, this one could actually reach real source-gen (no second generator involved), but converting 15 working, hand-maintained components was judged out of scope for this pass; both are recorded as open follow-ups in ROADMAP.v5.md Part J.
- **Localization Routed End-to-End (Part N / ROADMAP.v5.md §15):**
  - All 31 previously hardcoded English UI-copy defaults on component props records now resolve through `ILaughTaleLocalizer` at render time (`PropValue ?? localizer["key"]`), falling back to English when no culture-specific translation is registered — 27 via a hardcoded `(TypeName, PropertyName) -> localeKey` map in `IslandGenerator.GenerateTagHelper`, 3 on the hand-written `ConfirmPopupTagHelper` / `CommandMenuTagHelper`, and `DynamicFormSchema.SubmitLabel` via a new optional `submitLabel`/`ILaughTaleLocalizer?` parameter on `DynamicFormSchemaGenerator.FromModel`/`FromType`.
  - All 13 previously hardcoded English strings in client-side component templates (`autocomplete`, `command`, `listbox`, `menu`, `menubar`, `multiselect`, `orderlist`, `picklist`, `select`, `sidebar`, `tieredmenu`, `tree`, `tree-select`) now call `locale.t('key') || 'original English string'`, matching the pre-existing `datatable.ts` pattern.
  - `fileupload.ts` and `input-password.ts`'s previously unused (`useLocale` imported but never called) client localization is now wired up and used for file-action and password-strength-meter labels; `useLocale` client adoption is now 17 of 76 components — up from 3 real call sites pre-fix (`datatable`, `datepicker`, `select`; the roadmap's prior claim of "5" overcounted the two dead imports as adoption).
  - Added 13 new locale-dictionary keys (`selectPlaceholder`, `searchPlaceholder`, `selectCategoryPlaceholder`, `addTagPlaceholder`, `filterItemsPlaceholder`, `selectItemsPlaceholder`, `selectItemPlaceholder`, `filterPlaceholder`, `filterTreeNodesPlaceholder`, `dropzoneMessage`, `inplaceEditPlaceholder`, `commandPlaceholder`, `submitLabel`) translated across all 10 built-in locale packs, plus a client-only `newChat` key added to `LaughTale.Client/src/composables/useLocale.ts`.
  - Fixed a client/server locale-dictionary desync: `useLocale.ts`'s `BUILTIN_LOCALES` was missing Turkish (`tr`), Chinese (`zh`), and Japanese (`ja`) entries present server-side, silently falling back to English for those three; all three are now populated with translations matching the C# `LaughTaleBuiltInLocales.CreateTurkish()`/`CreateChinese()`/`CreateJapanese()` packs. Added a regression test (`LaughTale.Client/tests/composables/useLocale.test.ts`) asserting client/server culture-key parity so this cannot silently regress again.
  - Extended `CoreOnlyBoundaryTests` with reflection-based assertions that `LaughTale.Core`'s assembly contains no type named `LaughTaleLocaleDictionary` or `LaughTaleBuiltInLocales`, and that `LaughTaleLocalizationOptions`'s public surface is exactly its expected BCL-typed member set — guarding against the concrete locale-pack vocabulary quietly reappearing in Core.
- **Native Form Association for Island Controls (Feature 045 / Spec 045):**
  - All 29 interactive form components (`<island-*>`) now natively participate in HTML form submissions across both server-rendered (no-JS) and hydrated client paths.
  - Form fields are server-rendered with model values in the initial HTML before any JavaScript executes (`formFieldAdoption: 29`, zero client-created inputs `clientCreatedFields: 0`).
  - Headless `useFormField` composable provides non-destructive hydration adoption, preserving DOM nodes and native state across renders and 50+ in-place island refreshes.
  - Native form reset (`form.reset()`) restores all 29 controls to their initial server values in both DOM presentation and submitted payloads.
  - Cardinality-driven wire formats: `Single` (standard scalar), `Multiple` (repeated form fields for `List<T>`, replacing comma-delimited strings), and `Boolean` (companion hidden input `false` + primary input `true`).
  - Supports compile-time `asp-for` model expression resolution alongside explicit `name` attributes (see BREAKING entry below regarding removal of literal generic fallback names).

### BREAKING
- **`ILaughTaleLocalizer` Vocabulary Moved from Core to Components (Part N / ROADMAP.v5.md §15):**
  - `ILaughTaleLocalizer.GetDictionary(CultureInfo?)` now returns `IReadOnlyDictionary<string, string>` instead of the concrete `LaughTaleLocaleDictionary` type. Core's localization surface is now fully generic and has no knowledge of any typed locale-pack shape.
  - `LaughTaleLocaleDictionary` and `LaughTaleBuiltInLocales` moved from `LaughTale.Core.Localization` to `LaughTale.Components.Localization`, unchanged in shape (still 70 original typed properties plus 13 new ones, still 10 built-in language packs). Code referencing these types under their old namespace must update the `using` directive.
  - `LaughTaleLocalizationOptions.CustomDictionaries` changed from `IDictionary<string, LaughTaleLocaleDictionary>` to `IDictionary<string, IDictionary<string, string>>`; `AddLocale(string, Action<LaughTaleLocaleDictionary>)` changed to `AddLocale(string, Action<IDictionary<string, string>>)`. Added a parallel, lower-priority `BuiltInDictionaries` / `AddBuiltInLocale(...)` registration surface (same generic shape) that `LaughTale.Components.AddLaughTaleComponents()` now uses to seed all 10 built-in locales automatically; end-user `AddLocale` registrations always take priority over `AddBuiltInLocale` ones regardless of DI registration order.
  - Apps that only reference `LaughTale.Core` are unaffected in behavior (the generic mechanism still resolves keys and falls back to the raw key when nothing is registered); apps that also reference `LaughTale.Components` get the full built-in vocabulary automatically with no code changes required.
- **Form Control Generic Fallback Field Names Removed (Feature 045 / Spec 045):**
  - Removed generic field-name fallbacks (`select_value`, `slider_value`, `mask_value`, `listbox_value`, `togglebutton_value`, `selectbutton_value`, `tree_value`, `switch_value`) from client components per FR-005.
  - Controls with no explicitly provided `Name`, `TargetInputName`, or `AspFor` binding will no longer submit under shared literal fallback names, preventing silent cross-instance collisions and data overwrites when multiple un-named controls share a form.
- **Unified Component Event Contract (Feature 044 / Spec 044):**
  - All component events now follow the predictable contract: `laughtale:<canonical-kebab-component-name>:<event-name>` (e.g. `laughtale:slider:change`, `laughtale:select:change`, `laughtale:input-tags:change`).
  - Cross-island communication re-homed to the in-process island event bus (`emitIslandEvent` / `onIslandEvent`), fixing the cross-island toast dispatch defect (`tieredmenu` export actions now reliably show toasts in `toast` islands without polluting global `window`).
  - Legacy event names (unprefixed or non-canonical namespaces, e.g. bare `change`, `slider:change`, `chips:change`, `radio:change`) are fully supported via backward-compatible aliases with a one-time deprecation console warning per session.
  - **Removal Target:** All legacy aliases will be removed in version `v1.1.0`. Consumers should update their event listeners to use the canonical `laughtale:<component>:<event>` format.
  - **Full Old → New Mapping Table:**
    | Legacy Name | Canonical Event Name |
    | :--- | :--- |
    | `input-mask:change`, `change` | `laughtale:input-mask:change` |
    | `listbox:change`, `change` | `laughtale:listbox:change` |
    | `page`, `page-change` | `laughtale:paginator:page-change` |
    | `rating:change`, `change` | `laughtale:rating:change` |
    | `selectbutton:change`, `change` | `laughtale:select-button:change` |
    | `select:change`, `change` | `laughtale:select:change` |
    | `slider:change`, `change` | `laughtale:slider:change` |
    | `slider:slideend`, `slideend` | `laughtale:slider:slideend` |
    | `togglebutton:change`, `change` | `laughtale:toggle-button:change` |
    | `switch:change`, `toggleswitch:change`, `change` | `laughtale:toggle-switch:change` |
    | `treeselect:change`, `change` | `laughtale:tree-select:change` |
    | `chips:change`, `inputtags:change` | `laughtale:input-tags:change` |
    | `tags:add` | `laughtale:input-tags:add` |
    | `tags:remove` | `laughtale:input-tags:remove` |
    | `radio:change`, `radiogroup:change` | `laughtale:radio-button:change` |
    | `inputtext:change` | `laughtale:input-text:change` |
    | `inputtext:clear` | `laughtale:input-text:clear` |
    | `inputnumber:change` | `laughtale:input-number:change` |
    | `otp:change` | `laughtale:input-otp:change` |
    | `password:change` | `laughtale:input-password:change` |
    | `color:change` | `laughtale:color-picker:change` |
    | `contextmenu:select` | `laughtale:context-menu:select` |
    | `compare:change` | `laughtale:image-compare:change` |
    | `speeddial:action` | `laughtale:speed-dial:action` |
    | `splitbutton:click` | `laughtale:split-button:click` |
    | `splitbutton:action` | `laughtale:split-button:action` |
    | `tieredmenu:select` | `laughtale:tieredmenu:select` |
    | `toast:show` | `laughtale:island:toast:show` (and in-process bus `toast:show`) |
    | `splitter:resizestart` | `laughtale:splitter:resizestart` |
    | `splitter:resize` | `laughtale:splitter:resize` |
    | `splitter:resizeend` | `laughtale:splitter:resizeend` |
    | `accordion:change` | `laughtale:accordion:change` |
    | `autocomplete:change` | `laughtale:autocomplete:change` |
    | `button:click` | `laughtale:button:click` |
    | `cascadeselect:change` | `laughtale:cascadeselect:change` |
    | `checkbox:change` | `laughtale:checkbox:change` |
    | `datatable:cell-edit-complete` | `laughtale:datatable:cell-edit-complete` |
    | `datatable:selection-change` | `laughtale:datatable:selection-change` |
    | `datatable:sort` | `laughtale:datatable:sort` |
    | `dataview:buy-now` | `laughtale:dataview:buy-now` |
    | `dataview:wishlist-toggle` | `laughtale:dataview:wishlist-toggle` |
    | `datepicker:change` | `laughtale:datepicker:change` |
    | `fieldset:toggle` | `laughtale:fieldset:toggle` |
    | `inplace:change` | `laughtale:inplace:change` |
    | `knob:change` | `laughtale:knob:change` |
    | `multiselect:change` | `laughtale:multiselect:change` |
    | `orderlist:change` | `laughtale:orderlist:change` |
    | `orderlist:selection-change` | `laughtale:orderlist:selection-change` |
    | `orgchart:selection-change` | `laughtale:orgchart:selection-change` |
    | `orgchart:toggle` | `laughtale:orgchart:toggle` |
    | `panel:toggle` | `laughtale:panel:toggle` |
    | `picklist:change` | `laughtale:picklist:change` |
    | `picklist:selection-change` | `laughtale:picklist:selection-change` |
    | `stepper:change` | `laughtale:stepper:change` |
    | `tabs:change` | `laughtale:tabs:change` |
    | `textarea:change` | `laughtale:textarea:change` |
    | `textarea:input` | `laughtale:textarea:input` |
- **Deny-by-Default Island Authorization (LT-2204 / Spec 041):**
  - Undeclared islands are now refused by default across all five execution paths (TagHelpers, TagHelperBase, Generated TagHelpers, Island Refresh Endpoint, and `IIslandAuthorizationRegistry`).
  - Refresh endpoints return `HTTP 403 Forbidden` with an empty response body on any unauthorized request (`Denied`, `Undeclared`, or `Undeterminable`), identical byte-for-byte to prevent authorization oracle leaks.
  - TagHelpers suppress markup rendering entirely (`output.SuppressOutput()`) when unauthorized or when running outside an authorized request container.
  - Antiforgery validation fails closed: returns `HTTP 400 Bad Request` if `RequireAntiforgery = true` and `IAntiforgery` service is missing from the container.
- **Mandatory Field Allowlist Policies (LT-2204 / Spec 041):**
  - Removed `= null` default from `allowedFields` on `ToIslandDataResult`, `ToIslandDataResultAsync`, and `ApplyIslandCriteria`; parameter is now a required `IslandFieldPolicy` (omission produces a compile-time error).
  - Added `RefusedFields` init-only property to `IslandDataResult<T>`. All un-allowlisted or non-existent properties requested by clients are recorded into `RefusedFields` as a flat string list with no distinguishing reason codes (anti-oracle guarantee).
  - `MapIslandData` overloads now require `IslandFieldPolicy` and `islandName`, evaluating authorization and antiforgery strictly before invoking application `queryProvider` delegates.
- **Emergency Compatibility Switch:**
  - Added `options.Refresh.AllowUndeclaredIslands` (default `false`) and `options.Refresh.AllowAnonymous(string)` to restore v3 permissive behavior during migration. Emits a deduplicated warning once per island name.
- **Island Lifecycle Teardown on In-Place Refresh (LT-902):**
  - `laughtale:unmount` event now dispatches on an island container when it is refreshed in-place or retried, in addition to client router navigation.
  - Active mounts are now torn down prior to remounting: their `ctx.signal` is aborted, `ctx.onCleanup` callbacks are executed, and returned unmount functions run, preventing unbounded accumulation of event handlers, observers, and timers across refreshes.

### Fixed
- **Adapter Update-in-Place: `refresh()` No Longer Corrupts Framework-Mounted Islands (ROADMAP.v5.md Part D):**
  - **Defect Class:** `refreshIsland()` morphed the container in place (`morphElement()`: attribute sync, then a blunt `existing.innerHTML = incoming.innerHTML`) and only told the mounted framework instance to unmount *afterward*. For React, Vue and Preact islands this ripped out DOM the framework's fiber/vnode/component tree still referenced before `unmount()` ever ran; that call then executed against already-mutated DOM and threw silently, caught by every adapter's own `catch { /* ignore unmount errors on disposed DOM */ }`. This happened on every single refresh of a framework-mounted island, not an edge case — the virtual DOM and the real DOM silently diverged each time.
  - **User-Visible Effect:** A React, Vue, or Preact island refreshed via `island.refresh()` (or any server-driven refresh) now updates in place through the framework's own reconciler — no teardown/remount cycle, no risk of virtual/real DOM divergence, and anything the framework itself preserves across a normal re-render (in-flight CSS transitions, DOM nodes third-party plugins attached to, the input focus/selection `refresh.ts` restores) survives. Vanilla and Svelte islands are completely unaffected — byte-for-byte the same morph+remount sequence as before.
  - **Mechanism:** `IslandFactory`'s return type (`LaughTale.Client/src/runtime/registry.ts`) additively widened to allow an `IslandInstance` shape (`{ unmount?, update? }`) alongside the existing bare-teardown/`void` returns, normalized via a new `normalizeMountResult()` — every existing `defineIsland(...)` mount function across `src/components/` is unaffected. A new internal `runtime/island-instances.ts` tracks each container's `update` function in a `WeakMap` (cleared on teardown), deliberately kept off the public `container.island` handle so a page author can't call it directly and bypass server-authoritative refresh. `refresh.ts` now calls `update(props)` — parsed from the incoming, not-yet-applied server response via the same reviver used at initial mount, with the container's own attributes kept in sync via a newly extracted `syncContainerAttributes()` — instead of morphing, whenever an adapter registered an `update`. If `update()` throws, the error is logged and refresh falls back to the original morph+`rehydrateIsland` path for that one refresh, so a broken adapter degrades gracefully instead of leaving the island half-updated.
  - **Adapters:** `react.ts` and `preact.ts` re-render onto the same root/container (`root.render(...)` / `render(h(...), container)` again — each framework's own designed re-render path). `vue.ts` was restructured to hold props in a `shallowRef`, reassigned wholesale (not per-field) on update. `svelte.ts` and `vanilla.ts` are unchanged and continue through the morph+remount path: Svelte 5's pure-runes components have no public `$set()` without a compiler-level `compatibility.componentApi: 4` opt-in that this pass could not verify against a real `.svelte` compiler (none exists anywhere in this repo's toolchain), and vanilla islands have no framework instance to hand new props to in the first place. See `ROADMAP.v5.md` Part D for the full account, including why nested islands and the rest of Part D's open items remain untouched by this pass.
  - **Tests:** Added `react`, `react-dom`, `vue`, and `preact` as `devDependencies` (not runtime dependencies) so the adapters' real mount/update paths could be exercised for the first time — previously every adapter test only ever reached the vanilla-fallback catch branch, for all five adapters, because no framework package was ever installed. `tests/adapters.test.ts` now proves `update()` patches the *same* DOM node (identity comparison captured before the call, not just matching text afterward) for React, Vue, and Preact. New `tests/runtime/refresh-update.test.ts` proves `refreshIsland()` never calls the adapter's `unmount` or assigns `container.innerHTML` on a successful update()-path refresh (both spied directly), and that an `update()` which throws correctly falls back to a full remount instead of leaving the island stuck. `adapterUpdateSupport` (new `scripts/audit-metrics.mjs` counter): **0 → 3** of 5 adapters.
- **Island Teardown & Lifecycle Leak Prevention (Feature 040 / LT-902):**
  - **Defect Class:** Resolved unbounded resource accumulation where in-place island replacement (`refreshIsland()`) re-ran mounts without tearing down previous mount scopes, causing handlers to fire once per accumulated refresh and leaking memory on long-lived pages.
  - **User-Visible Effect:** Prevented duplicate execution of click, keyboard, and global window/document event listeners upon component refreshes; eliminated memory growth caused by orphaned `ResizeObserver`, `MutationObserver`, and background timers.
  - **Library-Wide Resource Cleanup:**
    - Brought all element and observer disconnects to 100% (`observersDisconnected: 2 / 2`).
    - Captured and bound 100% of timers library-wide under `ctx.onCleanup` or signal abort (`timersUncleared: 0`).
    - Maintained 100% signal binding across all event handlers (`listenersUnmanaged: 0`).
  - **Repaired Verification Mechanisms:**
    - Corrected `audit-metrics.mjs` unmanaged-listener scanner using balanced-parenthesis AST argument parsing, eliminating false-positive lint artifacts (corrected baseline from 374 artificial to 3 truthful, then down to 0).
    - Patched `leak-harness.test.ts` prototype interception and island registry lifecycle, restoring actual leak detection across window, document, and element targets.
    - Updated `verify-contracts.mjs` (`npm run lint:contracts`) to strictly enforce signal-bound listeners, observer disconnection, and interval clearing at commit and CI gate boundaries.

### Security
- **Safe Component Rendering Engine:**
  - Eliminated raw HTML injection defect across client component templates by migrating all 76 components to the safe tagged template primitive (`html`, `setHtml`, `safeUrl`, `attr`).
  - Automatic HTML entity escaping for dynamic expressions in component rendering templates.
  - Enforced zero-sink architecture contract (`npm run lint:contracts`) rejecting `.innerHTML`, `.outerHTML`, `insertAdjacentHTML`, and `document.write` across all components.
  - Integrated contract linting into CI pipeline (`.github/workflows/ci.yml`) and pre-commit adoption ratchet to prevent defect reintroduction.

## [3.0.0] - 2026-08-30

### Added
- **Security & Sandboxing:**
  - Automated CSP nonce generation, injection, and middleware.
  - Client command registry with action sandboxing.
  - Safe expression evaluator protecting against prototype pollution and code injection.
  - 25-vector OWASP URL sanitization filter matrix.
- **Lifecycle & Memory Management:**
  - `IslandScope` teardown management with LIFO disposal.
  - Shared `IntersectionObserver` across all lazy islands.
  - Exponential backoff retry engine for failed island chunk imports.
  - View Transitions router with same-origin validation, scroll restoration, and abortion handling.
- **Architecture & DX:**
  - Source generator for compile-time island registration and tag helper snapshot generation.
  - Universal JSON serialization engine (`IslandJson`) with custom converters.
  - Type-safe component contracts and states.
- **Design System & Aura Components:**
  - Headless `useVirtualizer`, `useScrollLock`, and `useResizeObserver` composables.
  - Progressive enhancement SSR markup for 70+ components.
  - OKLCH 11-shade palette ramp generator and theme persistence engine.
  - Live WCAG contrast ratio compliance calculator.
- **Performance:**
  - Benchmark harness measuring microtask hydration and rendering throughput.
  - Predictive link prefetching engine with in-memory caching.
  - Batched style injection using `document.adoptedStyleSheets`.
  - Icon subset SVG sprite generator with FNV-1a content hashing.
  - Brotli/Gzip response compression, immutable cache headers, and `<laughtale-preload />` tag helper.
- **Accessibility:**
  - Persistent polite and assertive live region screen reader announcer.
  - WAI-ARIA 1.2 roving tabindex navigation across composite widgets.
  - Reduced motion detection and automatic View Transition animation gating.
  - Accessible focus management and route change announcements on navigation.

### Changed
- Refactored library branding to LaughTale.
- Upgraded .NET target to .NET 10.0 and TypeScript target to ES2022.
