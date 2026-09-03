# Tasks: Floating Position and Virtualization Adoption (LT-3901)

**Input**: Design documents from `/specs/043-floating-position-and-virtualization/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md),
[data-model.md](data-model.md), [contracts/](contracts/), [quickstart.md](quickstart.md)

**Tests**: Test tasks are included and are **mandatory**. Under constitution Principle II an agent's
claim that work is complete is not evidence; command output is.

**Organization**: Grouped by phase. Both anti-cheat guards precede any component edit. Work that can
only improve lands before work that can regress.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: may run in parallel (different files, no dependency)
- **[Story]**: US1 = overlays stay attached · US2 = long lists stay responsive · US3 = virtualization
  does not undo 042 · US4 = hand-rolled implementations removed · US5 = the counters resist cheating

## Path Conventions

Paths are relative to the repository root. Client sources live under `LaughTale.Client/`.

> **Gate rule**: no task may be ticked `[X]` without pasting the real, unedited stdout of its gate
> command into the commit message. See [constitution](../../.specify/memory/constitution.md) §II.

> **Task references**: cited elsewhere as `043/T0nn`.

> **STANDING GATE-SCRIPT AUTHORISATION.** This feature authorises **T011, T012 and T013 only** to edit
> `LaughTale.Client/scripts/verify-contracts.mjs`, and only to **add** the six rules R1–R6 enumerated
> in [contracts/lint-rules.md](contracts/lint-rules.md). No existing rule may be modified, relaxed,
> reordered or removed. Precedent: 039/T032–T033, 040/T023–T024, 042/T007–T009. The authorisation
> expires when this feature closes.
>
> **T060 alone** is authorised to re-save `LaughTale.Client/scripts/metrics-baseline.json`, at improved
> values only, under the constitution's standing authorisation.
>
> **`audit-metrics.mjs` is NOT authorised for any task in this feature.** Its `virtualizerAdoption`
> counter was independently reproduced and reports exactly what it claims to — it is weak, not wrong
> ([research.md](research.md) D1). If it blocks you, the code is wrong, not the gate.

> **Expected red CI between T013 and T059.** `npm run lint:contracts` exits non-zero from the moment
> R1–R6 are added until the last batch lands, because the rules describe the finished state and the
> components have not reached it yet. `.github/workflows/ci.yml` runs it as a hard step with no
> `continue-on-error`. This is intended and temporary. **Weakening a rule to make CI green is a
> governance violation**, not a fix — the migration is what turns it green.

---

## Phase 1: Baseline and Enumeration (Blocking Prerequisite)

**Purpose**: establish what is actually in scope. The classification into Classes A/B/C is exactly what
a grep gets wrong — it is how "36 sites across 9 components" became 32 across 8. SC-001 cannot target
`0` until its start is enumerated rather than pattern-matched.

**No source is edited in this phase.**

**Files**: none modified. Findings recorded in this file's Phase 1 table.

- [x] **T001** Reproduce every figure in [research.md](research.md) *Ground truth baseline* by running `node scripts/audit-metrics.mjs`, `node run-tests.mjs` and `dotnet test` from their stated directories. Record: `virtualizerAdoption` 0, `focusTrapAdoption` 7, `ariaZeroComponents` 0, `listenersUnmanaged` 0, `timersUncleared` 0, `inlineStyleAttributes` 704, `hexInVarFallback` 604, client **329 passed / 55 suites**, `dotnet test` **268**. Save the metrics output to `LaughTale.Client/.tmp/043-baseline.txt`. A disagreement beyond ±2 means the tree has moved — **STOP and report** (constitution halt condition).
- [x] **T002** [US1] Enumerate every residual positioning site, line by line, across the eight JS-positioned components in `LaughTale.Client/src/components/`: `popover.ts`, `menu.ts`, `context-menu.ts`, `tieredmenu.ts`, `menubar.ts`, `cascadeselect.ts`, `confirm-popup.ts`, `split-button.ts`. Classify each as **A** (anchor positioning), **B** (submenu edge flip) or **C** (not overlay positioning). Publish the table. It must total **32 in-scope sites**, with Class C being `menubar.ts:503`, `menubar.ts:523` (responsive breakpoints) and `command.ts:461-462` (scroll-into-view). A different total means the tree has moved.
- [x] **T003** [P] [US1] Confirm `command.ts` has **no** overlay positioning by reading `ensureVisible()` at `LaughTale.Client/src/components/command.ts:460-470`. It is excluded from the in-scope set; record the confirmation so a later contributor does not "fix" it back in.
- [x] **T004** [P] [US1] Enumerate the panel-anchoring declaration in each of the six CSS-anchored components — `autocomplete.ts:229`, `datepicker.ts:133`, `select.ts:240` and `:289`, `tree-select.ts:240`, `multiselect.ts:97` (inline), `color-picker.ts:85` (inline) — under `LaughTale.Client/src/components/`. Record for each whether it is a stylesheet rule or an inline `style` attribute, and which ancestor establishes its containing block. This is the Batch C removal list and the R2 allowlist input.
- [x] **T005** [P] [US2] Confirm **uniform item height** for all six virtualization targets in `LaughTale.Client/src/components/`: `listbox.ts`, `orderlist.ts`, `select.ts`, `tree.ts`, `treetable.ts`, `datatable.ts`. Record the measured height and the CSS rule that sets it. Uniform height is the contract limit of virtualized mode ([research.md](research.md) D6); a target that is not uniform needs its plan revised before Phase 4, not during it.
- [x] **T006** Confirm every signature this feature calls exists, per constitution Principle III: `useFloatingPosition` and `useVirtualizer` in `LaughTale.Client/src/composables/`, `useKeyboardNav` in the same directory, `setRovingTabindex` in `LaughTale.Client/src/accessibility/aria.ts`, and `PatternDefinition` in `LaughTale.Client/src/accessibility/patterns.ts`. Anything not found by grep is a **STOP and report**.

**Gate**:
```bash
cd LaughTale.Client
node scripts/audit-metrics.mjs      # matches T001 exactly
node run-tests.mjs                  # 329 passed, 55 suites
# plus: the T002 classification table, the T004 removal list and the T005 heights, all published
```

**Checkpoint**: the true scope is known. **Stop and report before Phase 2.**

---

## Phase 2: Foundational — Extend the Composable, Write the Rules (US5)

**Purpose**: build the capability and the criterion, and prove the criterion resists the cheat,
**before** any component is edited. A rule written alongside the fixes is a rule shaped to the fixes.

**⚠️ CRITICAL**: no component work begins until this phase is complete.

**Files** (3): `LaughTale.Client/src/composables/useFloatingPosition.ts`,
`LaughTale.Client/src/accessibility/patterns.ts`,
`LaughTale.Client/scripts/verify-contracts.mjs` *(authorised: T011–T013, additive only)*

- [x] **T007** [US1] Extend `LaughTale.Client/src/composables/useFloatingPosition.ts` with capabilities 1–3 from [contracts/useFloatingPosition.md](contracts/useFloatingPosition.md): `reposition` (`'follow' | 'dismiss' | 'none'`, default `'none'`) with `signal` and `onDismiss`; the `Anchor` union widening `reference` to accept `{ x, y }`; and `arrow` producing `arrowOffset` on `FloatingCoords`. Scroll is observed `{ capture: true, passive: true }` on `window` so nested scrollers are seen — the technique already at `context-menu.ts:730`. **Every existing two-argument call form must keep its current meaning.**
- [x] **T008** [US1] Extend the same file with capabilities 4–6: `strategy` (`'fixed' | 'absolute'`, default `'fixed'`), `boundary` (default viewport), and `axis` (`'both' | 'x' | 'y'`, default `'both'`). For `axis: 'x' | 'y'` the composable writes **only that axis** — it must not take over submenu layout ([research.md](research.md) D5). Add `destroy()` to the return, idempotent and also run on `signal` abort.
- [x] **T009** [P] [US1] Write unit tests in `LaughTale.Client/tests/composables/floating-position.test.ts` covering: flip when the preferred side does not fit; clamp when neither fits; `arrowOffset` correct after both; point anchoring; `axis: 'x'` writing one axis only; `strategy: 'absolute'` adding scroll offsets; `destroy()` idempotent; and every listener released on abort. Observe them failing first where they describe new behaviour.
- [x] **T010** [P] [US3] Add the optional `virtualizedAttributes?: string[]` field to `PatternDefinition` in `LaughTale.Client/src/accessibility/patterns.ts`, defaulting to `['aria-setsize', 'aria-posinset']` for `listbox`, `combobox`, `tree` and `grid`. **Optional and absent means no additional requirement** — every existing definition must keep its current meaning, and feature 042's conformance count must stay at 76.
- [x] **T011** [US5] Add rules **R1** (positioning adoption) and **R2** (residual positioning) to `LaughTale.Client/scripts/verify-contracts.mjs` per [contracts/lint-rules.md](contracts/lint-rules.md). Detect calls with the existing `splitTopLevel` parser, **not** a substring test. Seed R2's allowlist from T002 and T004. Every message names the component **and** the retained construct with its line (FR-024); a rule reporting only a count is not actionable and is not sufficient.
- [x] **T012** [US1] Add rule **R3** (reposition strategy declared) to the same file: a call omitting `reposition`, or declaring `'follow'`/`'dismiss'` without `signal`, or `'dismiss'` without `onDismiss`, or pairing a point anchor with `'follow'`, fails. This is FR-004 made mechanical — the state `popover.ts:219-223` is in today, where the intent is a comment and the handler is empty.
- [x] **T013** [US5] Add rules **R4** (virtualization adoption), **R5** (virtualized attributes, keyed on the **call** not the declaration) and **R6** (`estimateSize` must be numeric) to the same file. **This is the last task authorised to touch `verify-contracts.mjs`.**
- [x] **T014** [US5] **Anti-cheat guard G1 — SC-009.** Plant an unused `import { useFloatingPosition }` in `LaughTale.Client/src/components/popover.ts`. Confirm R1's adoption count does **not** rise. Then plant an unused `useVirtualizer` import in `listbox.ts` and confirm `virtualizerAdoption` **does** rise while R4 does not — the contrast that demonstrates why that counter is a floor and not the criterion. Revert both; paste all four outputs.
- [x] **T015** [US5] **Anti-cheat guard G2 — SC-009.** Add a real `useFloatingPosition(...)` call to `popover.ts` while leaving `positionPopover`'s arithmetic in place, and confirm R1 **rejects** it, naming `popover` and the retained construct. Repeat once per class: a Batch C shape (call + retained stylesheet anchoring) and a Batch D shape (call + full-collection render). Revert all three; paste each rejection.
- [x] **T016** [US5] Run `node LaughTale.Client/scripts/verify-contracts.mjs` across all 76 files in `LaughTale.Client/src/components/`. It must report **32** residual positioning sites across 8 components, **6** anchoring declarations across 6 more, and **6** components rendering unbounded collections — the true starting state. **A rule reporting zero failures here is broken, not satisfied.**
- [x] **T017** Confirm the additive changes broke nothing: `npx tsc --noEmit` exits 0, `node run-tests.mjs` count is **strictly greater than 329**, and `node scripts/audit-metrics.mjs` is **unchanged from T001** — adding a rule and extending a composable fixes nothing yet, and any counter movement here means something else changed.
- [x] **T018** Confirm feature 042's outcome is intact after the `patterns.ts` edit: pattern conformance still **76**, `ariaZeroComponents` still **0**, `focusTrapAdoption` still **7**.

**Gate**:
```bash
cd LaughTale.Client
npm run lint:contracts               # 32 + 6 + 6 failures, each naming a component and a construct
node scripts/audit-metrics.mjs       # UNCHANGED from T001
npx tsc --noEmit                     # exit 0
node run-tests.mjs                   # > 329, none removed
```

**Checkpoint**: the capability exists and the criterion is proved cheat-resistant. **Stop and report.**

---

## Phase 3: User Story 1 (part 1) — Batches A and B (Priority: P1) 🎯 MVP

**Goal**: the eight JS-positioned overlays resolve placement through the shared composable. Both shipped
defects close here.

**Independent Test**: open each of the eight with its trigger near each viewport edge, then scroll and
resize with it open. `menu` must flip instead of rendering below the fold; `popover` must follow its
anchor instead of detaching. Requires no virtualization work.

**Why this is the MVP**: it delivers US1 for the components that are already broken, using only changes
that either work or fail visibly. US1's remaining six components (Batch C) are deferred to Phase 5
because they behave *correctly* today and can regress — see [plan.md](plan.md) *Risks*.

**Files**: Batch A (5) then Batch B (3), ≤10 per commit, one batch per commit.

### Batch A — Class A anchors

- [x] **T019** [US1] Write the placement tests for Batch A **first**, in `LaughTale.Client/tests/components/overlay-placement.test.ts`, and observe them failing: `menu` flips near the bottom edge; `popover` follows its anchor on scroll; `context-menu` opens up-and-left at the bottom-right corner; `confirm-popup` keeps document coordinates; `split-button` flips above when it does not fit below.
- [x] **T020** [US1] `LaughTale.Client/src/components/menu.ts` — replace the unclamped placement at `:679-683` with `useFloatingPosition`, `strategy: 'fixed'`, `reposition: 'follow'`, `signal: ctx.signal`. **This closes the defect where a menu near the bottom of the viewport is unreachable.** Delete the hand-rolled coordinates; do not leave them alongside.
- [x] **T021** [US1] `LaughTale.Client/src/components/popover.ts` — replace `positionPopover` (`:102-148`) with `useFloatingPosition`, passing the `.p-popover-arrow` element as `arrow` and applying the returned `arrowOffset` via `style.left`, as the component does today. Replace the empty scroll handler at `:219-223` with `reposition: 'follow'`. **This closes the defect where an open popover detaches from its anchor on first scroll.**
- [x] **T022** [P] [US1] `LaughTale.Client/src/components/context-menu.ts` — adopt the **point anchor** (`{ x, y }`) for the root menu at `:568-579`, with `reposition: 'dismiss'` and `onDismiss` wired to the existing `hideMenu`. This preserves the behaviour already correct at `:730-731` and is the only `dismiss` in the feature ([research.md](research.md) D3).
- [x] **T023** [P] [US1] `LaughTale.Client/src/components/confirm-popup.ts` — replace `alignToTarget` (`:324-358`) with `useFloatingPosition`, **`strategy: 'absolute'`** to preserve its document coordinate space, and `arrow` applied through the existing `--p-popup-arrow-left` custom property. Changing its coordinate space in this commit would make a visual regression indistinguishable from an arithmetic one.
- [x] **T024** [P] [US1] `LaughTale.Client/src/components/split-button.ts` — replace the dropdown flip at `:632-634` with `useFloatingPosition`, `reposition: 'follow'`.
- [x] **T025** [US1] Batch A gate over the five files edited in T020–T024 under `LaughTale.Client/src/components/`: R1 counts 5 adopters, R2 reports **0** residual Class A sites for these five, R3 passes, `listenersUnmanaged` and `timersUncleared` still **0**, T019 tests green. Paste all.

### Batch B — Class B submenu overflow

- [x] **T026** [P] [US1] `LaughTale.Client/src/components/tieredmenu.ts` — replace the submenu edge flip at `:439-440` and `:515-516` with `useFloatingPosition`, `strategy: 'absolute'`, `boundary` set to the `offsetParent`, **`axis: 'x'`**. The composable corrects overflow only; the stylesheet keeps owning layout.
- [x] **T027** [P] [US1] `LaughTale.Client/src/components/menubar.ts` — same treatment for `:514-515`. **Do not touch `:503` or `:523`** — those are `window.innerWidth > 960` responsive breakpoints and are Class C, confirmed in T002.
- [x] **T028** [P] [US1] `LaughTale.Client/src/components/cascadeselect.ts` (`:440-441`), and the submenu halves of `context-menu.ts` (`:593-594`) and `split-button.ts` (`:740-742`) — same treatment, `axis: 'x'`.
- [x] **T029** [US1] Batch B gate over `tieredmenu.ts`, `menubar.ts`, `cascadeselect.ts`, `context-menu.ts`, `split-button.ts` in `LaughTale.Client/src/components/`: R2 reports **0** residual sites across all eight JS-positioned components — SC-001 reaches **32 → 0**. R1 counts **8** adopters. Nested submenus verified: a submenu that flips left whose own submenu also overflows flips too.

**Gate**:
```bash
cd LaughTale.Client
npm run lint:contracts               # 0 positioning failures for the 8; Batch C and virtualization still fail
node scripts/audit-metrics.mjs       # listenersUnmanaged 0, timersUncleared 0, focusTrapAdoption 7
npx tsc --noEmit && node run-tests.mjs
```

**Checkpoint**: the two shipped defects are closed and eight overlays share one implementation.
US1 is deliverable for the JS-positioned set. **Stop and report.**

---

## Phase 4: User Stories 2 and 3 — Batches D and E (Priority: P1)

**Goal**: six components bound their rendered output, and do so without undoing feature 042.

**Independent Test**: bind each to 5,000 items — fewer than 100 elements render, `aria-setsize` reports
5,000, arrow keys reach item 5,000, and focus survives the window recycling that holds it. Requires
none of the positioning work.

**Why US2 and US3 are one phase**: they are not separable. A component that renders from the window
without the collection-space navigation of [contracts/virtualized-collection.md](contracts/virtualized-collection.md)
V4–V5 passes every counter and is a net accessibility loss shipped as an improvement. The a11y work is
part of each batch, not a follow-up.

**Files**: Batch D (3) then Batch E (3), ≤10 per commit, one batch per commit.

### Batch D — flat lists

- [x] **T030** [US2] Write the virtualization tests for Batch D **first**, in `LaughTale.Client/tests/components/virtualized-lists.test.ts`, and observe them failing: 5,000 items render <100 elements; total scroll extent equals the full collection; below the 100-item threshold rendering is unchanged.
- [x] **T031** [P] [US3] Write the a11y regression tests **first**, in `LaughTale.Client/tests/accessibility/virtualized-a11y.test.ts`: `aria-setsize` equals the collection length not the window length; `aria-posinset` is the collection index; ArrowDown from the last rendered item advances into unrendered items; focus survives a window recycle. Observe them failing.
- [x] **T032** [P] [US2] `LaughTale.Client/src/components/listbox.ts` — adopt `useVirtualizer` with a numeric `estimateSize` from T005, rendering from `getVirtualItems()` instead of `visible.map(...)` at `:607`. Scroll listener binds `ctx.signal`. Re-render on **window-boundary change only**, never per scroll event — `setHtml` is `innerHTML =` and destroys focus ([research.md](research.md) D7).
- [x] **T033** [P] [US2] `LaughTale.Client/src/components/orderlist.ts` — same, replacing `filteredItems.map(...)` at `:504`. Restore focus by the existing `getItemId(item, idx)` key at `:725`.
- [x] **T034** [US2] `LaughTale.Client/src/components/select.ts` — same, replacing `renderListItems()`'s `visibleOpts.forEach`. Groups are flattened inline into the visible collection so group headers occupy indices. **`select` is the only component in both halves of this feature**; this commit changes virtualization only, and its positioning change is T050.
- [x] **T035** [US3] Wire collection-space navigation in all three: `useKeyboardNav` with `itemCount: () => collection.length`, translating to a window index before `setRovingTabindex` and calling `scrollToIndex` when the target is outside the window ([data-model.md](data-model.md) §7). **Do not modify `setRovingTabindex`** — six components from 042 depend on its contract.
- [x] **T036** [US3] Add `aria-setsize` (collection length) and `aria-posinset` (1-based collection index) to rendered items in `LaughTale.Client/src/components/listbox.ts`, `orderlist.ts` and `select.ts`. R5 requires this of any component calling the virtualizer, regardless of its declaration.
- [x] **T037** [US2] Batch D gate over `LaughTale.Client/src/components/listbox.ts`, `orderlist.ts`, `select.ts`: R4 counts 3 adopters, R5 and R6 pass for them, T030 and T031 tests green, `listenersUnmanaged` and `timersUncleared` still **0**.

### Batch E — hierarchical and grid

- [x] **T038** [US2] `LaughTale.Client/src/components/tree.ts` — build a `flattenVisible` equivalent producing an ordered array of visible nodes with depth, replacing the recursive render at `:621` and `:755`. **Rebuild it on every expand, collapse and filter; do not cache it across interactions** — a cached flat index renders the wrong nodes. This is the substantive work in this component ([research.md](research.md) D10).
- [x] **T039** [US2] `LaughTale.Client/src/components/tree.ts` — adopt `useVirtualizer` over that flat index, with collection-space navigation and set-size attributes as T035–T036.
- [x] **T040** [P] [US2] `LaughTale.Client/src/components/treetable.ts` — adopt `useVirtualizer` over the **existing** `flattenVisible(processedNodes)` at `:843`. Engage only when `isPaginator` is false; the paged path at `:849-851` must be byte-identical to today.
- [x] **T041** [P] [US2] `LaughTale.Client/src/components/datatable.ts` — adopt `useVirtualizer` over `filtered` in the non-paginator branch at `:902`. The `paginator` and `isLazy` branches must be unchanged — they already bound their output, so virtualization does not engage and this is automatic, not a special case.
- [x] **T042** [US3] Set-size and collection-space navigation for Batch E. `datatable`, `treetable` and `orderlist` declare `{ kind: 'native' }`, so feature 042's rule requires nothing of them — R5 is the only thing standing between them and a silently wrong announced count ([research.md](research.md) D9).
- [x] **T043** [US3] In `LaughTale.Client/src/components/datatable.ts` and `treetable.ts`, verify sticky headers and horizontal scrolling do not participate in the virtual window, and that selection, sort and filter still operate on the full collection rather than the rendered window.
- [x] **T044** [US2] Batch E gate over `LaughTale.Client/src/components/tree.ts`, `treetable.ts`, `datatable.ts`: R4 counts **6** adopters — SC-006 reaches **6 → 0** and `virtualizerAdoption` reaches **0 → 6**. Note in the commit that the counter is a **floor, not the criterion**; SC-006 and SC-008 are.

**Gate**:
```bash
cd LaughTale.Client
npm run lint:contracts               # 0 virtualization failures; Batch C still fails
node scripts/audit-metrics.mjs       # virtualizerAdoption 6, ariaZeroComponents 0, listenersUnmanaged 0
npx tsc --noEmit && node run-tests.mjs
```

**Checkpoint**: long lists are bounded and still accessible. **Stop and report.**

---

## Phase 5: User Story 1 (part 2) — Batch C, the CSS-Anchored Panels (Priority: P1)

**Goal**: the six stylesheet-anchored panels resolve placement, gaining flip and clip-escape.

**Independent Test**: each panel opens fully visible from a trigger inside an `overflow: hidden`
ancestor and near each viewport edge — **and still tracks its anchor on scroll, resize and zoom, which
it does today for free**.

**⚠️ This is the only batch that can regress behaviour that is currently correct.** The browser tracks
these anchors through scroll, resize, zoom and ancestor reflow at no cost; resolved placement must
reproduce all of it, and a listener only covers the cases someone thought of. It runs last, alone,
after everything reversible has landed. **If it cannot hold T052, it reverts without touching Batches
A, B, D or E.**

**Files**: 6, one commit.

- [x] **T045** [US1] Write the Batch C tests **first**, in `LaughTale.Client/tests/components/anchored-panels.test.ts`, and observe them failing: each panel escapes an `overflow: hidden` ancestor; each flips above when it does not fit below; **and each still tracks its anchor across a scroll** — the regression guard, which passes today and must keep passing.
- [x] **T046** [P] [US1] `LaughTale.Client/src/components/autocomplete.ts` — replace the stylesheet anchoring at `:229` with `useFloatingPosition`, `reposition: 'follow'`, `signal: ctx.signal`. Remove the superseded `position: absolute` anchoring rule; do not leave it alongside (FR-012).
- [x] **T047** [P] [US1] `LaughTale.Client/src/components/datepicker.ts` — same, replacing `:133`.
- [x] **T048** [P] [US1] `LaughTale.Client/src/components/tree-select.ts` — same, replacing `:240`.
- [x] **T049** [P] [US1] `LaughTale.Client/src/components/multiselect.ts` — same, replacing the **inline** `top: calc(100% + 4px)` at `:97`. Its panel is `left: 0; right: 0`, so its width is coupled to the trigger's — resolved placement must preserve that coupling rather than sizing the panel to its content.
- [x] **T050** [P] [US1] `LaughTale.Client/src/components/color-picker.ts` — same, replacing the inline `top: calc(100% + 8px)` at `:85`. Then `LaughTale.Client/src/components/select.ts` — replace `:240` and `:289`. This is `select`'s **second** commit; it changes positioning only, virtualization having landed in T034.
- [x] **T051** [US1] Verify stacking across the six files edited in T046–T050 under `LaughTale.Client/src/components/`: a panel promoted out of a clipping ancestor no longer shares a stacking context with its trigger. Confirm each still stacks above sibling content and still closes on outside click.
- [x] **T052** [US1] **The regression gate**, over the same six files and `node LaughTale.Client/scripts/audit-metrics.mjs`. SC-005: overlays remaining in a stale position after scroll or resize is **0**, and these six — which are at 0 today — are still **0**. SC-002: anchoring declarations **6 → 0**. SC-004: off-screen or clipped overlays **0**. `inlineStyleAttributes` has **fallen** from 704 and has not risen.

**Gate**:
```bash
cd LaughTale.Client
npm run lint:contracts               # ZERO failures — first fully green run since T013
node scripts/audit-metrics.mjs       # inlineStyleAttributes < 704; every other counter per SC-014
npx tsc --noEmit && node run-tests.mjs
```

**Checkpoint**: all 14 overlays share one implementation. **Stop and report.**

---

## Phase 6: Polish, Guards Re-Run, and Close-Out (US4, US5)

**Purpose**: prove the finished state, not just the migration.

- [ ] **T053** [US5] **Re-run guard G1** from T014 against the finished tree, planting into `LaughTale.Client/src/components/popover.ts`. Plant an unused import in a component that has now adopted, and confirm the adoption count still does not move. A guard that only worked on unmodified code proves nothing about the finished state.
- [ ] **T054** [US5] **Re-run guard G2** from T015. Re-introduce hand-rolled math alongside a genuine call in `popover.ts` and confirm R1 still rejects it. Revert.
- [ ] **T055** [US4] Confirm removal is complete, not bypassed, by grepping all 19 edited files under `LaughTale.Client/src/components/` directly: **0** residual positioning sites across the eight (SC-001), **0** anchoring declarations across the six (SC-002), **0** components rendering unbounded collections (SC-006). Grep each of the 19 files directly rather than trusting the rule that was written to find them.
- [ ] **T056** [P] Grep `LaughTale.Client/src/components/*.ts` and confirm no component imports a sibling component — the boundary holds at zero violations across 76 and this feature must not be the first to break it.
- [ ] **T057** [P] [US3] Run the full [quickstart.md](quickstart.md) manual matrix: five trigger positions × 14 components, plus the scroll/resize/anchor-removal table, plus the 5,000-item keyboard traversal for all six virtualized components. Record results per component; automated rules cannot verify that an announcement is useful or a placement looks right.
- [ ] **T058** Confirm the negative controls via `node LaughTale.Client/scripts/audit-metrics.mjs` and `dotnet test LaughTale.Tests/LaughTale.Tests.csproj`: `dotnet test` still **268** (this feature touches no server code), `hexInVarFallback` still **604**, `innerHtmlRawAssignments` and `unsafeCalls` still **0**, `focusTrapAdoption` still **7**, non-modal overlays trapping focus still **0**, pattern conformance still **76**.
- [ ] **T059** Run `node LaughTale.Client/run-tests.mjs` and confirm the client test count is **strictly greater than 329** with no test deleted, skipped or `.only`-ed, and that `npm run verify` and `npx tsc --noEmit` both exit 0 — CI green for the first time since T013.
- [ ] **T060** Re-save `LaughTale.Client/scripts/metrics-baseline.json` at improved values. **This is the only task authorised to touch it.** Then update `ROADMAP.v5.md`: record the Weeks 2–6 adoption block closed, `useFloatingPosition` 0 → 14 and `useVirtualizer` 0 → 6 in the §0 adoption table, and note that two more inherited figures failed source reproduction — "36 sites across 9 components" (32 across 8) and the README's 100,000-row justification (§5) — joining `listenersUnmanaged: 374`, `hexHardcoded: 716` and `focusTrapAdoption: 9`.

**Gate**:
```bash
cd LaughTale.Client && npm run verify && npx tsc --noEmit
cd .. && dotnet test LaughTale.Tests/LaughTale.Tests.csproj --nologo    # 268, unchanged
```

---

## Dependencies & Execution Order

### Phase dependencies

- **Phase 1 (Baseline)**: no dependencies. Blocks everything — targets cannot be set before starts are known.
- **Phase 2 (Foundational)**: depends on Phase 1. **Blocks all component work.** The composable cannot be adopted before it can express the call sites, and a guard cannot be trusted before it is seen failing.
- **Phase 3 (US1 pt 1)**: depends on Phase 2. Independent of Phases 4 and 5.
- **Phase 4 (US2 + US3)**: depends on Phase 2. Independent of Phases 3 and 5 — **except** `select.ts`, which takes T034 before T050.
- **Phase 5 (US1 pt 2)**: depends on Phase 2, and is **deliberately sequenced last** among the component phases despite being P1. Risk ordering, not dependency ordering ([plan.md](plan.md) *Risks*).
- **Phase 6**: depends on all component phases.

### User story dependencies

- **US1** spans Phase 3 (8 components) and Phase 5 (6 components). Phase 3 alone is a deliverable increment.
- **US2** and **US3** are one phase and are not separable — see the Phase 4 rationale.
- **US4** is verified continuously by R2 within each batch gate, and swept in T055.
- **US5** is Phase 2 (T014–T016) and re-run in Phase 6 (T053–T054).

### Parallel opportunities

- Phase 1: T003, T004, T005 in parallel after T002.
- Phase 2: T009 and T010 in parallel with T007–T008. T011–T013 are sequential — same file.
- Phase 3 Batch A: T022, T023, T024 in parallel after T020–T021. Batch B: T026, T027, T028 in parallel.
- Phase 4 Batch D: T032, T033 in parallel; T034 after (shares `select.ts` with Phase 5). Batch E: T040, T041 in parallel; T038–T039 sequential (same file).
- Phase 5: T046–T050 all in parallel — six distinct files.
- Phase 6: T056 and T057 in parallel.

### Within each batch

Tests first and observed failing → composable adoption → hand-rolled removal → a11y wiring → batch gate.
One batch per commit, ≤10 component files, one kind of change per commit (Principle IV).

---

## Implementation Strategy

### MVP (Phases 1–3)

1. Phase 1 — baseline and enumeration.
2. Phase 2 — extend the composable, write the rules, prove the guards.
3. Phase 3 — Batches A and B.
4. **STOP and VALIDATE**: eight overlays share one implementation; the `menu` and `popover` defects are closed.

This is a shippable increment on its own: it fixes two live bugs and removes five divergent
implementations without touching anything that currently works.

### Incremental delivery

1. Phases 1–2 → foundation, no user-visible change.
2. Phase 3 → US1 for the JS-positioned eight → **MVP**.
3. Phase 4 → US2 + US3, long lists bounded and still accessible.
4. Phase 5 → US1 for the CSS-anchored six → the riskiest increment, revertable in isolation.
5. Phase 6 → close-out.

### If a gate fails twice

**Stop.** Write `BLOCKED.md` with the task ID, both gate outputs and your diagnosis. Do not try a third
time — the constitution's halt condition exists because the third attempt is reliably worse than the
first.

---

## Definition of Done

- [ ] Residual positioning sites across the eight JS-positioned components: **0** (from 32) — SC-001
- [ ] Anchoring declarations across the six CSS-anchored components: **0** (from 6) — SC-002
- [ ] Components genuinely adopting `useFloatingPosition`: **14** (from 0) — **SC-003, a criterion**
- [ ] Overlays rendering off-screen or clipped near a viewport edge: **0** (from ≥7) — SC-004
- [ ] Overlays stale after scroll or resize: **0** (from ≥4), **and the Batch C six still 0** — SC-005
- [ ] Components rendering unbounded collections: **0** (from 6) — **SC-006, a criterion**
- [ ] `virtualizerAdoption` **6** (from 0) — SC-007, a floor only
- [ ] 5,000 items → **<100** rendered elements, set size **5,000** — SC-008
- [ ] Both guards observed **failing** in Phase 2 and re-run in Phase 6 — SC-009
- [ ] Keyboard traversal reaches item 5,000 of 5,000; focus survives recycling — SC-010
- [ ] Pattern conformance **76**, `ariaZeroComponents` **0** — SC-011, feature 042 preserved
- [ ] `listenersUnmanaged` **0**, `timersUncleared` **0**, `focusTrapAdoption` **7** — SC-012, feature 040 preserved
- [ ] `npm run verify` exits 0, `npx tsc --noEmit` exits 0, client tests **> 329** — SC-013
- [ ] Other counters unchanged; `inlineStyleAttributes` **fell** from 704 and did not rise; `dotnet test` **268** — SC-014

**Not done if**: a component was counted as an adopter on an import; hand-rolled math was left alongside
a composable call; a virtualized list announces the window size instead of the collection size; keyboard
navigation stops at the edge of the rendered window; a CSS-anchored panel stopped tracking its anchor;
`audit-metrics.mjs` was edited; `verify-contracts.mjs` was edited outside T011–T013; a rule was weakened
to turn CI green; a test was deleted or skipped; or `virtualizerAdoption: 6` is being offered as the
criterion instead of SC-006 and SC-008.
