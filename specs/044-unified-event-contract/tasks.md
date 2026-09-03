# Tasks: Unified Event Contract (LT-4001)

**Input**: Design documents from `/specs/044-unified-event-contract/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md),
[data-model.md](data-model.md), [contracts/](contracts/), [quickstart.md](quickstart.md)

**Tests**: Test tasks are included and are **mandatory**. Under constitution Principle II an agent's
claim that work is complete is not evidence; command output is.

**Organization**: Grouped by phase. The guard precedes any component edit. The two live defects are
reproduced failing before they are fixed, and the observable one is fixed first.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: may run in parallel (different files, no dependency)
- **[Story]**: US1 = one action, one event · US2 = names are predictable · US3 = consumers keep
  working · US4 = the convention cannot drift · US5 = the counters resist cheating

## Path Conventions

Paths are relative to the repository root. Client sources live under `LaughTale.Client/`.

> **Gate rule**: no task may be ticked `[X]` without pasting the real, unedited stdout of its gate
> command into the commit message. See [constitution](../../.specify/memory/constitution.md) §II.

> **Task references**: cited elsewhere as `044/T0nn`.

> **STANDING GATE-SCRIPT AUTHORISATION.** This feature authorises **T013, T014 and T015 only** to edit
> `LaughTale.Client/scripts/verify-contracts.mjs`, and only to **add** the six rules R1–R6 enumerated
> in [contracts/lint-rules.md](contracts/lint-rules.md). No existing rule may be modified, relaxed,
> reordered or removed. Precedent: 039/T032–T033, 040/T023–T024, 042/T007–T009, 043/T011–T013. The
> authorisation expires when this feature closes.
>
> **T058 alone** is authorised to re-save `LaughTale.Client/scripts/metrics-baseline.json`, at improved
> values only, under the constitution's standing authorisation.
>
> **`audit-metrics.mjs` is NOT authorised for any task in this feature.** Its event counter is
> incomplete by one site in seventy-two — weak, not wrong — and no repair to it could make it the
> criterion, because `eventsBare: 0` is reachable without deleting a single duplicate
> ([research.md](research.md) D1). If it blocks you, the code is wrong, not the gate.

> **Expected red CI between T015 and T057.** `npm run lint:contracts` exits non-zero from the moment
> R1–R6 are added until the last batch lands. `.github/workflows/ci.yml` runs it as a hard step with no
> `continue-on-error`. This is intended and temporary. **Weakening a rule to make CI green is a
> governance violation**, not a fix.

---

## Phase 1: Baseline and Enumeration (Blocking Prerequisite)

**Purpose**: pair the 72 dispatch sites into logical occurrences. Pairing is the step a grep gets
wrong — it is what distinguishes `slider`'s two occurrences from `toggle-switch`'s one — and SC-001's
"11 → 0" cannot be trusted until it is enumerated rather than inferred.

**No source is edited in this phase.**

- [x] **T001** Reproduce every figure in [research.md](research.md) *Ground truth baseline* by running `node scripts/audit-metrics.mjs`, `node scripts/verify-contracts.mjs`, `node run-tests.mjs` and `dotnet test` from their stated directories. Record: `eventsNamespaced` 59, `eventsBare` 12, `virtualizerAdoption` 6, positioning adoption 14, `focusTrapAdoption` 7, `ariaZeroComponents` 0, `listenersUnmanaged` 0, `timersUncleared` 0, `hexInVarFallback` 604, contract lint all 76 pass, client **358 passed / 66 suites**, `dotnet test` **268**. Save to `LaughTale.Client/.tmp/044-baseline.txt`. A disagreement beyond ±2 means the tree has moved — **STOP and report**.
- [x] **T002** [US1] Enumerate all **72** dispatch sites across `LaughTale.Client/src/components/*.ts` with file, line, event name, dispatch target and `bubbles` value. Publish the table. It must total 72 sites, 41 components, 61 distinct names, and 71 with `bubbles: true`. A different total means the tree has moved.
- [x] **T003** [US1] Pair the T002 sites from `LaughTale.Client/src/components/*.ts` into **logical occurrences** and publish the pairing table. It must show **11** occurrences dispatching more than one name and **12** redundant sites. This table is read by lint rule R3 — "the same occurrence" is a semantic judgement made once, in review, and then enforced.
- [x] **T004** [P] [US1] For each of the 11 paired occurrences, record **both `detail` payload shapes** side by side in `LaughTale.Client/src/components/`. Where they differ, name the fields that exist on only one. Phase 3 collapses these pairs and a consumer reading a discarded field breaks with no error (FR-003).
- [x] **T005** [P] [US2] Classify all 41 dispatching components in `LaughTale.Client/src/components/` as conforming or non-conforming by comparing each namespace against its source filename. Publish the list. It must show **22** non-conforming, **20** distinct foreign namespaces, and **19** already namespace-correct — the Batch E set.
- [x] **T006** [US1] **Reproduce defect 1 failing** against `LaughTale.Client/src/components/slider.ts` and `toggle-switch.ts`. With a page open, bind counting handlers to `change` and `slider:change`, drag the slider once, and record the count as **2**. Repeat for `toggle-switch` across `change`, `switch:change`, `toggleswitch:change` and record **3**. Paste both.
- [x] **T007** [US2] **Reproduce defect 2 failing.** Trigger `tieredmenu`'s export action and record that **no toast appears**. Confirm the cause by reading both ends: `LaughTale.Client/src/components/tieredmenu.ts:752` dispatches on `window` without bubbling; `LaughTale.Client/src/components/toast.ts:687` listens on `document`. Also record that `toast.ts:692` listens for `toast:clear`, for which grep finds no dispatcher anywhere.

**Gate**:
```bash
cd LaughTale.Client
node scripts/audit-metrics.mjs      # matches T001 exactly
node run-tests.mjs                  # 358 passed, 66 suites
# plus: the T002 site table, the T003 pairing table, the T004 payloads and the T005 classification
```

**Checkpoint**: the true scope is known and both defects are reproduced. **Stop and report.**

---

## Phase 2: Foundational — The Helper, the Table, and the Rules (US4, US5)

**Purpose**: build the single construction point and the criterion, and prove the criterion resists the
cheat, **before** any component is edited.

**⚠️ CRITICAL**: no component work begins until this phase is complete.

**Files** (2): `LaughTale.Client/src/runtime/events.ts`,
`LaughTale.Client/scripts/verify-contracts.mjs` *(authorised: T013–T015, additive only)*

- [ ] **T008** [US4] Add `EVENT_PREFIX` and `emitComponentEvent(target, component, event, detail?, options?)` to `LaughTale.Client/src/runtime/events.ts` per [contracts/events-module.md](contracts/events-module.md). It builds `laughtale:<component>:<event>`, dispatches on `target` with `bubbles: true` by default, and is the **only** dispatch route a component may use. The `component` parameter is documented as requiring a static string literal — that is what makes the contract statically verifiable, including for `splitter`'s computed event segment.
- [ ] **T009** [US3] Add `EVENT_ALIASES` to `LaughTale.Client/src/runtime/events.ts`: one entry per pre-feature name with `from`, `to` and `removeIn`. Seed it from the T002 inventory — **all 61 names**. A name absent from the table is a silent break for whoever was using it, and external consumers are the population no gate here can observe.
- [ ] **T010** [US3] In `LaughTale.Client/src/runtime/events.ts`, make `emitComponentEvent` dispatch declared aliases after the canonical event, each carrying a marker in `detail`, and emit **one deprecation warning per alias name per session** naming the old name, the new name and the removal version (FR-012). A handler bound to the **new** name must run exactly once (FR-011).
- [ ] **T011** [P] [US2] Change the bus prefix in `LaughTale.Client/src/runtime/events.ts:27` from `` `island:${event}` `` to `` `${EVENT_PREFIX}:island:${event}` ``. One word. It removes the third naming convention from the tree. The bus has zero callers so nothing internal breaks, but it is a public rename and gets an alias entry like any other.
- [ ] **T012** [P] [US4] Write unit tests in `LaughTale.Client/tests/events/emit-component-event.test.ts` covering: name construction; `bubbles: true` by default; the target is the passed element; aliases dispatch after the canonical event; a handler on the canonical name fires once; the deprecation warning fires once per name per session. Observe them failing first.
- [ ] **T013** [US4] Add rules **R1** (name conformance) and **R2** (no residual literal dispatch) to `LaughTale.Client/scripts/verify-contracts.mjs` per [contracts/lint-rules.md](contracts/lint-rules.md). Detect calls with the existing `splitTopLevel` parser, **not** a substring test. R1 checks the `component` argument against the source filename; R2 fails on any remaining `new CustomEvent(` in `src/components/`. Every message names the component and the offending construct with its line.
- [ ] **T014** [US1] Add rule **R3** (one dispatch per occurrence) to `LaughTale.Client/scripts/verify-contracts.mjs`, reading the T003 pairing table. **This rule produces SC-001, the criterion for User Story 1** — the structural check no counter can make.
- [ ] **T015** [US2] Add rules **R4** (one namespace, and it is the component's own), **R5** (alias table completeness against the 61 names) and **R6** (dispatch target is never `window` or `document`) to the same file. **This is the last task authorised to touch `verify-contracts.mjs`.**
- [ ] **T016** [US5] **The anti-cheat guard — SC-010.** In `LaughTale.Client/src/components/slider.ts`, add an `emitComponentEvent` call while leaving both existing `new CustomEvent` dispatches in place. Confirm R2 **rejects** it naming `slider` and the retained literal, that SC-001 and SC-003 do **not** improve, and — for contrast — that `eventsBare` **does** fall. Revert; paste all three outputs. **This contrast is the whole argument for why `eventsBare` is a floor and not the criterion.**
- [ ] **T017** [US5] Plant one violation per rule into a component under `LaughTale.Client/src/components/` and confirm `node scripts/verify-contracts.mjs` rejects each by name: a bare name (R1), a foreign namespace (R4), a second namespace in one component (R4), a duplicate occurrence (R3), a `window` target (R6). Revert each; paste each rejection.
- [ ] **T018** [US4] Run the full rule set across all 76 components. It must report **72** non-conforming names across **41** components and **11** duplicated occurrences — the true starting state. **A rule reporting zero failures here is broken, not satisfied.** Confirm `npx tsc --noEmit` exits 0, client tests are **> 358**, and `node scripts/audit-metrics.mjs` is otherwise **unchanged from T001**.

**Gate**:
```bash
cd LaughTale.Client
npm run lint:contracts               # 72 name failures + 11 duplicate-occurrence failures
node scripts/audit-metrics.mjs       # UNCHANGED from T001
npx tsc --noEmit && node run-tests.mjs   # > 358
```

**Checkpoint**: the helper exists and the criterion is proved cheat-resistant. **Stop and report.**

---

## Phase 3: User Story 1 — Batches A and B (Priority: P1) 🎯 MVP

**Goal**: one user action produces one event.

**Independent Test**: bind a counting handler to every pre-feature name for an occurrence, perform the
interaction once, and assert the total is one. This is T006 run again, expecting different numbers.

**Why this is the MVP**: it closes the live defect a user can observe, and it is the only work in this
feature where a mistake is user-visible. It delivers value whether or not any renaming follows.

**Files**: Batch A (5) then Batch B (5), one batch per commit.

### Batch A

- [ ] **T019** [US1] Write the de-duplication tests **first**, in `LaughTale.Client/tests/events/single-dispatch.test.ts`, one per Batch A occurrence, and observe them failing at counts of 2.
- [ ] **T020** [P] [US1] `LaughTale.Client/src/components/input-mask.ts` — migrate to `emitComponentEvent` and **delete** the redundant bare dispatch at `:304`. Reconcile payloads per T004.
- [ ] **T021** [P] [US1] `LaughTale.Client/src/components/listbox.ts` — same, deleting `:932`.
- [ ] **T022** [P] [US1] `LaughTale.Client/src/components/paginator.ts` — collapse `page` (`:616`) and `page-change` (`:626`) into one. **The survivor is `laughtale:paginator:page-change`** ([research.md](research.md) D7): it is the only pair where both names are bare, so neither has precedence, and `page-change` names the occurrence rather than a noun.
- [ ] **T023** [P] [US1] `LaughTale.Client/src/components/rating.ts` — same, deleting `:485`.
- [ ] **T024** [P] [US1] `LaughTale.Client/src/components/select-button.ts` — same, deleting `:381`. Its namespace also changes from `selectbutton:` to `select-button:`.
- [ ] **T025** [US1] Batch A gate over the five files edited in T020–T024 under `LaughTale.Client/src/components/`: R3 reports **0** duplicated occurrences for these five; R2 reports **0** residual literals; the T019 tests are green at counts of 1; `listenersUnmanaged` and `timersUncleared` still **0**.

### Batch B

- [ ] **T026** [P] [US1] `LaughTale.Client/src/components/select.ts` — migrate and delete the redundant bare dispatch at `:1049`.
- [ ] **T027** [US1] `LaughTale.Client/src/components/slider.ts` — **two** occurrences, four sites (`:386-400`). Delete the bare `change` (`:390`) and the bare `slideend` (`:400`). This is the component the T016 guard was planted in; confirm the guard's planted code is gone.
- [ ] **T028** [US1] `LaughTale.Client/src/components/toggle-switch.ts` — **three** names for one occurrence (`:271-279`). Delete `switch:change` and the bare `change`; the survivor is `laughtale:toggle-switch:change`. Two of its three namespaces disappear.
- [ ] **T029** [P] [US1] `LaughTale.Client/src/components/toggle-button.ts` (delete `:255`) and `LaughTale.Client/src/components/tree-select.ts` (delete `:950`). Both namespaces also change.
- [ ] **T030** [US1] Batch B gate over the five files edited in T026–T029 under `LaughTale.Client/src/components/`: **SC-001 reaches 11 → 0** — the criterion for User Story 1. Re-run T006's reproduction and record counts of **1** where they were 2 and 3. `eventsBare` reaches **0**; note in the commit that this is a **floor, not the criterion**.

**Gate**:
```bash
cd LaughTale.Client
npm run lint:contracts               # 0 duplicate-occurrence failures; name failures remain for C/D/E
node scripts/audit-metrics.mjs       # eventsBare 0; 042/043 counters unchanged
npx tsc --noEmit && node run-tests.mjs
```

**Checkpoint**: one action, one event. The observable defect is closed. **Stop and report.**

---

## Phase 4: User Story 2 — Batches C and D (Priority: P1)

**Goal**: every event name is derivable from the component's filename, and the cross-component reach is
re-homed.

**Independent Test**: for each component, derive the expected names from the filename alone and confirm
they match. For `tieredmenu`, the test is that a toast **appears**.

**Files**: Batch C (10) then Batch D (4), one batch per commit.

### Batch C — mechanical renames

- [ ] **T031** [P] [US2] `LaughTale.Client/src/components/input-tags.ts` — migrate to `emitComponentEvent`. **Three namespaces collapse to one**: `chips:` (a PrimeVue legacy name the component carries nowhere else), `inputtags:` and `tags:` all become `laughtale:input-tags:`.
- [ ] **T032** [P] [US2] `LaughTale.Client/src/components/radio-button.ts` — `radio:` and `radiogroup:` collapse to `laughtale:radio-button:`.
- [ ] **T033** [P] [US2] `LaughTale.Client/src/components/input-text.ts`, `input-number.ts`, `input-otp.ts`, `input-password.ts` — `inputtext:`, `inputnumber:`, `otp:`, `password:` become their canonical kebab-case names.
- [ ] **T034** [P] [US2] `LaughTale.Client/src/components/color-picker.ts`, `context-menu.ts`, `image-compare.ts`, `speed-dial.ts` — `color:`, `contextmenu:`, `compare:`, `speeddial:` likewise.
- [ ] **T035** [US2] Batch C gate over the ten files edited in T031–T034 under `LaughTale.Client/src/components/`: R1 and R4 report **0** failures for these ten; R2 reports **0** residual literals; **SC-005 reaches 3 → 0** (no component uses two namespaces).

### Batch D — the two special cases

- [ ] **T036** [P] [US2] `LaughTale.Client/src/components/split-button.ts` — `splitbutton:action` and `splitbutton:click` become `laughtale:split-button:`.
- [ ] **T037** [US2] `LaughTale.Client/src/components/splitter.ts:311` — replace the template literal with `emitComponentEvent(container, 'splitter', eventType, { sizes: [...sizes] })`. The `component` argument is a **static literal**; the `event` argument stays the `'resizestart' | 'resize' | 'resizeend'` union declared at `:277` and is type-checked by it. **SC-011**: the site invisible to `audit-metrics.mjs:146` is now covered, so counted sites equal actual sites.
- [ ] **T038** [US2] Write the toast test **first**, in `LaughTale.Client/tests/events/cross-island.test.ts`, asserting a toast becomes **visible** after `tieredmenu`'s export action, and observe it failing — this is T007's defect.
- [ ] **T039** [US2] `LaughTale.Client/src/components/tieredmenu.ts:752` — replace the `window.dispatchEvent(new CustomEvent('toast:show', ...))` with `emitIslandEvent('toast:show', {...})`. **This is a defect fix, not a rename** ([research.md](research.md) D5): the current dispatch reaches nothing, so renaming it would ship a correctly-named dead path.
- [ ] **T040** [US2] `LaughTale.Client/src/components/toast.ts:687` — subscribe with `onIslandEvent('toast:show', ...)` and release the subscription via `ctx.onCleanup`. The in-process bus delivers regardless of DOM topology, so the window/document mismatch cannot recur. Leave the `toast:clear` listener at `:692` alone — it is dead code with no dispatcher, recorded in T007 and not this feature's kind of change.
- [ ] **T041** [US2] **The toast appears** — `LaughTale.Client/tests/events/cross-island.test.ts` from T038 is green. Confirm by observation, not by an event firing — an event firing with no toast means the path was renamed rather than fixed. **SC-006 reaches 1 → 0.**
- [ ] **T042** [US2] Batch D gate over `LaughTale.Client/src/components/split-button.ts`, `splitter.ts`, `tieredmenu.ts`, `toast.ts`: R6 reports **0** global dispatch targets; `listenersUnmanaged` and `timersUncleared` still **0** — the bus subscription releases on teardown.

**Gate**:
```bash
cd LaughTale.Client
npm run lint:contracts               # only Batch E name failures remain
npx tsc --noEmit && node run-tests.mjs
```

**Checkpoint**: names are predictable and the toast works. **Stop and report.**

---

## Phase 5: User Story 2 (continued) — Batch E, the Prefix Sweep (Priority: P1)

**Goal**: the 19 already namespace-correct components gain the `laughtale:` prefix.

**Why last**: nearly mechanical and the largest batch. Putting it first would spend the review budget
on the safest work.

**Files**: 19, in two commits of ≤10 per Principle IV.

- [ ] **T043** [P] [US2] Migrate the first ten of the T005 conforming set to `emitComponentEvent` in `LaughTale.Client/src/components/`: `accordion.ts`, `autocomplete.ts`, `button.ts`, `cascadeselect.ts`, `checkbox.ts`, `datatable.ts`, `dataview.ts`, `datepicker.ts`, `fieldset.ts`, `inplace.ts`. Namespaces are already correct; only the prefix and the dispatch route change.
- [ ] **T044** [P] [US2] Migrate the remaining nine: `knob.ts`, `multiselect.ts`, `orderlist.ts`, `orgchart.ts`, `panel.ts`, `picklist.ts`, `stepper.ts`, `tabs.ts`, `textarea.ts`.
- [ ] **T045** [US2] **SC-003 reaches 72 → 0** across all of `LaughTale.Client/src/components/`. No dispatched name fails R1. Paste `npm run lint:contracts`.
- [ ] **T046** [US2] **R2 reaches 0.** Confirm no `new CustomEvent(` remains anywhere in `LaughTale.Client/src/components/` by grepping all 76 files directly, rather than trusting the rule written to find them.
- [ ] **T047** [US2] Over all of `LaughTale.Client/src/components/` — **SC-004**: components emitting a foreign namespace **22 → 0**; distinct namespaces **20 → 41**, one per dispatching component by construction. **SC-002**: dispatch sites **72 → 60**. Record the actual figure against the T003 prediction and justify any deviation in writing.

**Gate**:
```bash
cd LaughTale.Client
npm run lint:contracts               # ZERO failures — first fully green run since T015
npx tsc --noEmit && node run-tests.mjs
```

**Checkpoint**: the contract holds across all 41 dispatching components. **Stop and report.**

---

## Phase 6: User Story 3 — Compatibility, Documentation and Close-Out

**Purpose**: prove the finished state, and prove that consumers outside this repository still work —
the part no gate here can fully verify.

- [ ] **T048** [US3] **SC-008 — the criterion for User Story 3**, against `LaughTale.Client/src/runtime/events.ts`'s alias table. For each of the **61** pre-feature names from T002, bind a handler to that name, perform the occurrence, and confirm the handler runs. Publish the 61-row result. A name that does not reach its handler is a silent break for whoever was using it.
- [ ] **T049** [US3] **SC-009**, over the ten components edited in T020–T029 under `LaughTale.Client/src/components/`. For each of the 11 previously-duplicated occurrences, bind a handler to the **new** name only and confirm it runs exactly **once** per action while aliases are active.
- [ ] **T050** [P] [US3] Confirm each alias produces one deprecation warning per name per session, naming the old name, the new name and the removal version, in `LaughTale.Client/src/runtime/events.ts`. R5 passes: every one of the 61 names has an entry with a `removeIn`.
- [ ] **T051** [P] [US3] Update the two references in `docs/walkthroughs/01-islands-architecture-for-beginners.md` to the new names, showing the old names as deprecated.
- [ ] **T052** [US3] Record the rename in `CHANGELOG.md` under a `BREAKING` heading, **in the same commit** that introduces the aliases, per the constitution. Include the removal version and the full old→new mapping. Note that the aliases are **not** removed by this feature.
- [ ] **T053** [US5] **Re-run the T016 guard** against the finished tree. Re-introduce a literal dispatch beside a genuine helper call in `LaughTale.Client/src/components/slider.ts` and confirm R2 still rejects it. Revert. A guard that only worked on unmodified code proves nothing about the finished state.
- [ ] **T054** [P] [US4] Confirm no component imports a sibling component by grepping `LaughTale.Client/src/components/*.ts` — the boundary holds at zero violations across 76, and `tieredmenu`'s change moved toward it rather than away.
- [ ] **T055** [P] [US1] Run the full [quickstart.md](quickstart.md) manual matrix: the 11 de-duplication checks, the 41 name derivations, the toast observation, and the 61 alias bindings.
- [ ] **T056** Confirm the negative controls via `node scripts/audit-metrics.mjs` and `dotnet test LaughTale.Tests/LaughTale.Tests.csproj`: **SC-013** — `listenersUnmanaged` 0, `timersUncleared` 0, `ariaZeroComponents` 0, pattern conformance 76, `focusTrapAdoption` 7, `virtualizerAdoption` 6, positioning adoption 14, `innerHtmlRawAssignments` 0, `unsafeCalls` 0, `hexInVarFallback` 604. **SC-014** — `dotnet test` **268**, sibling imports **0**.
- [ ] **T057** Run `node run-tests.mjs` and confirm the client test count is **strictly greater than 358** with no test deleted, skipped or `.only`-ed, and that `npm run verify` and `npx tsc --noEmit` both exit 0 — CI green for the first time since T015.
- [ ] **T058** Re-save `LaughTale.Client/scripts/metrics-baseline.json` at improved values. **This is the only task authorised to touch it.** Record `eventsNamespaced`'s final value rather than predicting it — bare names gaining namespaces raises it, deleted duplicates lower it. Then update `ROADMAP.v5.md`: mark the **Weeks 2–6 row complete** (all four composables adopted by 042/043, the event API unified here), and record two findings — that `tieredmenu`'s toast never fired, and that `runtime/events.ts` was the seventh built-and-unadopted module, now with its first caller.

**Gate**:
```bash
cd LaughTale.Client && npm run verify && npx tsc --noEmit
cd .. && dotnet test LaughTale.Tests/LaughTale.Tests.csproj --nologo    # 268, unchanged
```

---

## Dependencies & Execution Order

### Phase dependencies

- **Phase 1 (Baseline)**: no dependencies. Blocks everything — R3 reads the T003 pairing table, and the alias table is seeded from the T002 inventory.
- **Phase 2 (Foundational)**: depends on Phase 1. **Blocks all component work** — nothing can adopt a helper that does not exist, and no guard can be trusted before it is seen failing.
- **Phase 3 (US1)**: depends on Phase 2. Independent of Phases 4 and 5.
- **Phase 4 (US2, Batches C+D)**: depends on Phase 2. Independent of Phase 3 — **except** `select-button`, `toggle-button` and `tree-select`, whose namespace changes land with their de-duplication in Phase 3.
- **Phase 5 (Batch E)**: depends on Phase 2. Deliberately sequenced last among component phases — risk ordering by triviality, not dependency ordering.
- **Phase 6**: depends on all component phases.

### User story dependencies

- **US1** is Phase 3 alone and is a complete deliverable increment.
- **US2** spans Phases 4 and 5.
- **US3**'s infrastructure is built in Phase 2 (T009, T010) and verified in Phase 6 (T048–T052).
- **US4** is Phase 2's rules, checked continuously at every batch gate.
- **US5** is Phase 2 (T016–T017), re-run in Phase 6 (T053).

### Parallel opportunities

- Phase 1: T004 and T005 in parallel after T003.
- Phase 2: T011 and T012 in parallel with T008–T010. T013–T015 are sequential — same file.
- Phase 3 Batch A: T020–T024 all in parallel. Batch B: T026 and T029 in parallel; T027 and T028 alone (the hardest two).
- Phase 4 Batch C: T031–T034 all in parallel. Batch D: T036 parallel with T037; T038–T041 sequential.
- Phase 5: T043 and T044 in parallel.
- Phase 6: T050, T051, T054, T055 in parallel.

### Within each batch

Tests first and observed failing → helper adoption → literal deletion → payload reconciliation → batch
gate. One batch per commit, ≤10 component files, one kind of change per commit (Principle IV).

---

## Implementation Strategy

### MVP (Phases 1–3)

1. Phase 1 — baseline, pairing, both defects reproduced.
2. Phase 2 — helper, alias table, rules, guard.
3. Phase 3 — Batches A and B.
4. **STOP and VALIDATE**: one user action produces one event.

Shippable on its own: it closes a live defect that double-counts every slider drag and triple-counts
every toggle, and the aliases mean nothing outside the repository breaks.

### Incremental delivery

1. Phases 1–2 → foundation, no user-visible change.
2. Phase 3 → US1 → **MVP**.
3. Phase 4 → US2 for the non-conforming set, plus the toast fix.
4. Phase 5 → US2 for the prefix sweep.
5. Phase 6 → compatibility proof and close-out.

### If a gate fails twice

**Stop.** Write `BLOCKED.md` with the task ID, both gate outputs and your diagnosis. Do not try a third
time — the constitution's halt condition exists because the third attempt is reliably worse than the
first.

---

## Definition of Done

- [ ] Logical occurrences dispatching more than once: **0** (from 11) — **SC-001, a criterion**
- [ ] Dispatch sites: **60** (from 72), the 12 redundant ones deleted — SC-002
- [ ] Names not matching `laughtale:<canonical>:<kebab>`: **0** (from 72) — **SC-003, a criterion**
- [ ] Components with a foreign namespace: **0** (from 22); namespaces **41** (from 20) — SC-004
- [ ] Components using two namespaces for themselves: **0** (from 3) — SC-005
- [ ] Components emitting another's namespace: **0** (from 1), **and the toast appears** — SC-006
- [ ] `eventsBare` **0** (from 12) — SC-007, a floor only
- [ ] Pre-feature names still reaching a bound handler: **61 / 61** — **SC-008, a criterion**
- [ ] A handler on a new name fires exactly **once** per occurrence — SC-009
- [ ] The guard observed **failing** in Phase 2 and re-run in Phase 6 — SC-010
- [ ] Counted sites equal actual sites: **72 = 72** — SC-011
- [ ] `npm run verify` exits 0, `npx tsc --noEmit` exits 0, client tests **> 358** — SC-012
- [ ] Specs 039–043 preserved; `dotnet test` **268**; sibling imports **0** — SC-013, SC-014

**Not done if**: a redundant dispatch was renamed instead of deleted; a component was counted as
migrated while retaining a `new CustomEvent` literal; `eventsBare: 0` is being offered as the criterion
instead of SC-001 and SC-003; a pre-feature name has no alias; the `tieredmenu` toast still does not
appear; the aliases were removed in this feature rather than the next release; `audit-metrics.mjs` was
edited; `verify-contracts.mjs` was edited outside T013–T015; a rule was weakened to turn CI green; or a
test was deleted or skipped.
