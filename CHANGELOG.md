# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
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
