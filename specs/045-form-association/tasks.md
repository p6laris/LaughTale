---

description: "Task list for 045 — Native Form Association & Server-Rendered Form Fields"
---

# Tasks: Native Form Association & Server-Rendered Form Fields

**Input**: Design documents from `/specs/045-form-association/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md),
[data-model.md](./data-model.md), [contracts/form-field-contract.md](./contracts/form-field-contract.md),
[quickstart.md](./quickstart.md)

**Tests**: Test tasks are included and are **not optional here**. FR-017 makes a behavioural gate the
binding acceptance criterion for every migration task; a counter may not close a task on its own.

**Organization**: Grouped by user story. US1 is independently shippable — at its checkpoint the no-JS
path works end to end, which is the whole point of the feature.

---

> ## ⚠️ Two things to read before starting
>
> **1. Q1 is unanswered.** These tasks assume **Option C** (server-rendered fields now, custom-element
> conversion deferred). Option A yields the same tasks. **Option B invalidates this list** — do not
> begin if Q1 resolved to B; the spec and plan go back to Phase 0.
>
> **2. This list is frozen once handed over.** Per the constitution's *Roles* clause, an implementing
> agent executes these tasks and does not author, amend or reinterpret them. If a task is wrong, halt
> under Section II and write `BLOCKED.md` — do not improve it.

---

## Standing gate-script authorisation (constitution 1.1.0)

The constitution forbids editing gate scripts **except** where a feature's `tasks.md` authorises it in
writing, naming the task and enumerating the permitted changes. This is that authorisation. It is
exhaustive and expires when feature 045 closes.

| Script | Authorised task | Permitted changes |
|---|---|---|
| `LaughTale.Client/scripts/audit-metrics.mjs` | **T011 only** | **Exactly three changes, listed below.** |
| `LaughTale.Client/scripts/metrics-baseline.json` | T011 (add keys), T041 (re-save at improved values) | Add the two new keys at their measured values; final re-save only at improved values |

**The three permitted changes to `audit-metrics.mjs`, in full:**

1. Add `formFieldAdoption: 0,` to the `m` object, add
   `if (/useFormField/.test(s)) m.formFieldAdoption++;` to the per-file loop, and add
   `'formFieldAdoption'` to `HIGHER_IS_BETTER`.
2. Add `clientCreatedFields: 0,` to the `m` object, add
   `m.clientCreatedFields += countAll(s, /createElement\((['"])input\1\)/g);` to the per-file loop, and
   add `'clientCreatedFields'` to `LOWER_IS_BETTER`.
3. Add `"formFieldAdoption": 0` and `"clientCreatedFields": 18` to `scripts/metrics-baseline.json`.

**Anything beyond these three invalidates the run.** In particular: `formAssociationAdoption` MUST NOT
be modified, redefined or removed. It stays at 0, reserved for the deferred custom-element feature. If
it moves, someone has written `ElementInternals` into a component that cannot use it.

---

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependency on an incomplete task)
- **[Story]**: US1, US2, US3 — maps to the user stories in `spec.md`
- Every task names its files and its gate. One task per commit (constitution IV).

## Path Conventions

Multi-project repository. Paths are repo-relative:

- Client: `LaughTale.Client/src/`, `LaughTale.Client/tests/`, gates run from `LaughTale.Client/`
- Server: `LaughTale.Components/`, `LaughTale.Core/`, `LaughTale.Generators/`
- Server tests: `LaughTale.Tests/`, gate is `dotnet test LaughTale.Tests/LaughTale.Tests.csproj --nologo`

---

## Phase 1: Setup

**Purpose**: Record the ground truth this feature is measured against, before anything changes.

- [x] T001 Record baseline metrics by running `node scripts/audit-metrics.mjs` from `LaughTale.Client/` and pasting the unedited stdout into `specs/045-form-association/baseline.txt`
- [x] T002 Verify the ground-truth counts in `specs/045-form-association/data-model.md` still reproduce within ±2 (29 `targetInputName` components, 18 `createElement('input')` sites, 5/3/18/3 classification); if they do not, **halt and report** — the tree has moved and the plan needs revision
- [x] T003 [P] Confirm all three gates are green on the untouched tree: `node scripts/audit-metrics.mjs --check` and `npm run verify` from `LaughTale.Client/`, and `dotnet test LaughTale.Tests/LaughTale.Tests.csproj --nologo` from the repo root

**Checkpoint**: baseline captured; any later movement is attributable to this feature.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The plumbing every story depends on. Nothing in Phase 3+ can start until this completes.

**⚠️ CRITICAL**: T004–T012 block all user story work.

- [x] T004 Create the `[FormControl]` marker attribute with `ValueProperty`, `Cardinality` (`Single`/`Multiple`/`Boolean`) and `FieldKind` (`Hidden`/`Native`) members in `LaughTale.Core/Attributes/FormControlAttribute.cs`, per the entity definition in `data-model.md` §1 — it must live in Core so Components may reference it without inverting the module boundary
- [x] T005 [P] Extract the `data-lt-ssr` stamping logic from `LaughTale.Components/TagHelpers/IslandTagHelperBase.cs` into a shared helper both the base class and generated code call, so feature 026's marker has exactly one implementation
- [x] T006 Teach `LaughTale.Generators/IslandGenerator.cs` to detect `[FormControl]` on a props record and emit, for marked records only: an `[HtmlAttributeName("asp-for")] ModelExpression? AspFor` property and an `[HtmlAttributeName("name")] string? Name` property — copy the binding precedent at `LaughTale.Components/TagHelpers/CompoundTagHelpers.cs:221`
- [x] T007 Extend `LaughTale.Generators/IslandGenerator.cs` to emit name resolution (`Name ?? AspFor?.Name`) into the props JSON and to emit a build-time diagnostic when a `[FormControl]` record resolves to no name, per contract C1
- [x] T008 Extend `LaughTale.Generators/IslandGenerator.cs` to emit the server-rendered field into `output.Content` when child content is empty, stamped via the T005 helper, honouring `Cardinality` per contract C2 and `FieldKind` per contract C3, encoded by the framework HTML encoder per contract C4
- [x] T009 [P] Add generator tests in `LaughTale.Tests/Generators/FormControlEmissionTests.cs` covering all three cardinalities, both field kinds, the `disabled` case, the missing-name diagnostic, and that an unmarked record emits nothing new — the generator has no dedicated test file today, so this creates it
- [x] T010 Create the `useFormField(container, ctx, opts)` composable in `LaughTale.Client/src/composables/useFormField.ts` implementing contract C5: find by `data-lt-field` within the container, detach before render, re-append after, return a setter, apply C2 serialization, bind any listener to `ctx.signal`, and log a diagnostic and no-op when no server-rendered field is found
- [x] T011 Add the two counters to `LaughTale.Client/scripts/audit-metrics.mjs` and `LaughTale.Client/scripts/metrics-baseline.json` — **exactly the three changes enumerated in the Standing gate-script authorisation above and nothing else**; verify each new counter rises or falls by exactly one when a single real instance is planted, then revert the plant
- [x] T012 [P] Add unit tests for `useFormField` in `LaughTale.Client/tests/composables/form-field.test.ts` covering adopt, detach/re-attach identity preservation, setter serialization per cardinality, the no-field diagnostic path, and teardown release

**Checkpoint**: the generator can emit a named, server-rendered field and the client can adopt one. No
component uses either yet.

---

## Phase 3: User Story 1 — A form submits correct data with scripting unavailable (Priority: P1) 🎯 MVP

**Goal**: Every in-scope control contributes its field, with its model value, to a POST made with no
script executed. Baseline 0 of 29 → 29 of 29.

**Independent Test**: request the conformance page over HTTP and submit the returned HTML with
`javaScriptEnabled: false`; assert 29 named fields with correct values. No client runtime involved.

**Transitional state to expect**: between this phase and Phase 4 the *hydrated* path reverts to
today's behaviour — `setHtml` wipes the container, destroying the server-rendered field, and the
component re-creates or re-renders its own. That is not a regression and not a duplicate; it is the
current shipped behaviour, and Phase 4 is what makes the field survive. Do not "fix" it here.

### Tests for User Story 1

- [x] T013 [P] [US1] Build the conformance fixture: a Razor page hosting all 29 controls bound to a populated page model, plus its handler asserting the received `FormData`, in `LaughTale.Showcase/Pages/FormConformance.cshtml` and its `.cshtml.cs`
- [x] T014 [P] [US1] Write the no-JS conformance spec in `LaughTale.Client/tests/e2e/form-association.spec.ts` with a `javaScriptEnabled: false` context, asserting the field set and values — **it must fail at this point**, proving it measures something

### Implementation for User Story 1

- [x] T015 [US1] Mark Batch 1 records `[FormControl]` and add a name-bearing property where missing, for the 10 controls in `data-model.md` Batch 1, in `LaughTale.Components/Models/ComponentModels.cs` (`input-text`, `textarea`, `input-password`, `input-number`, `input-mask`, `input-otp`, `input-tags`, `color-picker`, `knob`, `rating`) — `input-password` MUST render its field with an empty value per contract C4
- [x] T016 [US1] Mark Batch 2 records `[FormControl]` and add a name-bearing property where missing, for the 10 controls in `data-model.md` Batch 2, in `LaughTale.Components/Models/ComponentModels.cs` (`checkbox`, `radio-button`, `toggle-switch`, `toggle-button`, `select-button`, `select`, `multiselect`, `listbox`, `cascadeselect`, `tree-select`) — note the record for `cascadeselect` is named for island `cascade-select`
- [x] T017 [US1] Mark Batch 3 records `[FormControl]` and add a name-bearing property where missing, for the 9 controls in `data-model.md` Batch 3, in `LaughTale.Components/Models/ComponentModels.cs` (`autocomplete`, `datepicker`, `slider`, `orderlist`, `picklist`, `orgchart`, `paginator`, `dropzone`, `inplace`) — `dropzone` is `FieldKind: Native` and keeps its existing file input
- [x] T018 [US1] Add a conformance test asserting all 29 in-scope props records carry `[FormControl]`, in `LaughTale.Tests/TagHelpers/FormControlCoverageTests.cs` — this is the server-side adoption gate that replaces a third client counter
- [x] T019 [US1] Remove the shared generic name fallbacks (`select_value`, `slider_value`, `mask_value`, `listbox_value`, `togglebutton_value`, `selectbutton_value`, `tree_value`, `switch_value`) from the 8 components that carry them in `LaughTale.Client/src/components/`, per FR-005 — two instances of one control currently resolve to the same name and silently overwrite each other
- [x] T020 [US1] Record the breaking change from T019 under a `BREAKING` heading in `CHANGELOG.md`, in the same commit as T019 if the gate allows, otherwise immediately after

**Checkpoint**: **US1 is complete and shippable.** `npm run test:e2e -- form-association --grep "no-script"`
passes with 29 of 29 fields. The framework's forms now degrade honestly, which is the prerequisite the
build order places before server actions.

---

## Phase 4: User Story 2 — Hydration enhances the rendered form instead of replacing it (Priority: P1)

**Goal**: The server-rendered field survives hydration, refresh and re-hydration as the same element.
`formFieldAdoption` 0 → 29, `clientCreatedFields` 18 → 0.

**Independent Test**: hydrate a container holding a server-rendered field and assert the element
present before hydration is the identical node afterwards, value unchanged, exactly one field.

### Tests for User Story 2

- [ ] T021 [P] [US2] Extend `LaughTale.Client/tests/e2e/form-association.spec.ts` with the idempotence case: 50 in-place island refreshes leave exactly one field per control (plus companion where `Boolean`) — must fail before T022
- [ ] T022 [P] [US2] Add the teardown case to `LaughTale.Client/tests/e2e/form-association.spec.ts`: after island teardown no field belonging to it remains in the document (FR-011, relies on feature 040)

### Implementation for User Story 2

- [ ] T023 [US2] Adopt `useFormField` in the 10 Batch 1 components in `LaughTale.Client/src/components/`, deleting each `createElement('input')` site and routing every value write through the setter
- [ ] T024 [US2] Adopt `useFormField` in the 10 Batch 2 components in `LaughTale.Client/src/components/`, deleting each `createElement('input')` site and removing the hidden-field literal from any component that renders one in its template
- [ ] T025 [US2] Adopt `useFormField` in the 9 Batch 3 components in `LaughTale.Client/src/components/` — `dropzone`'s file input MUST be adopted and re-attached, never re-created, or the user's file selection is silently discarded
- [ ] T026 [US2] Scope `inplace`'s field lookup to its container in `LaughTale.Client/src/components/inplace.ts` — it uses `document.querySelector` today and can bind to another island's field once every control has one
- [ ] T027 [US2] Verify `float-label`'s `input:not([type="hidden"]), textarea, select` lookup in `LaughTale.Client/src/components/float-label.ts` still resolves to the visible control and not to an adopted field, and constrain it if it does not
- [ ] T028 [US2] Confirm `clientCreatedFields` has reached 0 and `formFieldAdoption` 29 by running `node scripts/audit-metrics.mjs` from `LaughTale.Client/`, and that the T021/T022 e2e cases pass — a counter at target with a failing e2e case is not a pass (FR-017)

**Checkpoint**: US1 and US2 both work. The field is server-rendered, adopted, and survives everything.

---

## Phase 5: User Story 3 — The interactive value and the submitted value never disagree (Priority: P2)

**Goal**: Byte-identical field sets from the no-JS path and the hydrated path, for every control state.

**Independent Test**: submit the conformance page twice with the same control states — once with
scripting disabled, once hydrated — and diff the two `FormData` sets.

### Tests for User Story 3

- [ ] T029 [P] [US3] Add the parity case to `LaughTale.Client/tests/e2e/form-association.spec.ts`: the two `FormData` sets are identical key-for-key and value-for-value — must fail before T030
- [ ] T030 [P] [US3] Add the form-reset case to `LaughTale.Client/tests/e2e/form-association.spec.ts`: reset restores every control to its server-rendered value in both the submitted data and the visible state (FR-015)

### Implementation for User Story 3

- [ ] T031 [US3] Replace comma-joining with repeated fields in the four components that join today — `select`, `select-button`, `slider`, `datepicker` in `LaughTale.Client/src/components/` — per contract C2 `Multiple`; a joined string does not bind to a `List<T>` in ASP.NET Core model binding
- [ ] T032 [US3] Unify the three incompatible boolean representations onto the checked/unchecked companion pattern from contract C2 `Boolean`, in `checkbox`, `radio-button` and `toggle-button` in `LaughTale.Client/src/components/`
- [ ] T033 [US3] Route every remaining direct `field.value` assignment in the 29 components through the `useFormField` setter, so serialization has exactly one implementation (FR-012)
- [ ] T034 [US3] Add the multi-value and boolean serialization cases to `LaughTale.Tests/TagHelpers/FormControlEmissionTests.cs` so the server side is asserted against the same contract as the client

**Checkpoint**: all three in-scope stories are complete and independently verified.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T035 [P] Add the edge cases from `spec.md` to `LaughTale.Client/tests/e2e/form-association.spec.ts`: duplicate resolved names, a value containing the old delimiter, a control outside any form, a control that hydrates late, and a server value the client cannot represent
- [ ] T036 [P] Document form association in `LaughTale.Client/docs/` — the `asp-for` binding, the name precedence, the cardinality shapes, and the no-JS guarantee
- [ ] T037 [P] Record in `CHANGELOG.md` that `<island-*>` form controls now participate in native form submission, referencing the BREAKING entry from T020
- [ ] T038 Update `ROADMAP.v5.md` §5 to close the *Form association* item with the measured outcome, and correct the three figures Findings 1–3 disproved (the "10 sync a hidden input" artefact, the 0-of-29 baseline, and the unreachability of `ElementInternals`)
- [ ] T039 Update `ROADMAP.v5.md` §0 to record that `026-ssr-first-markup` was the eighth built-and-unadopted module and is now adopted at 29 of 29 in-scope controls
- [ ] T040 Run the full `quickstart.md` validation end to end and paste the unedited output of all four scenarios into the closing commit
- [ ] T041 Re-save `LaughTale.Client/scripts/metrics-baseline.json` at the improved values — permitted by the standing authorisation for a completed feature's final verification task, **at improved values only**

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (T001–T003)**: no dependencies; T002 is a halt gate
- **Foundational (T004–T012)**: depends on Setup; **blocks every user story**
  - T004 → T006, T007, T008 (the attribute must exist before the generator reads it)
  - T005 → T008 (shared stamping before emission uses it)
  - T006 → T007 → T008 (properties, then resolution, then emission)
  - T010 → T012
- **US1 (T013–T020)**: depends on Foundational. T013, T014 before T015–T017. T019 → T020
- **US2 (T021–T028)**: depends on US1 (there must be a server-rendered field to adopt) and on T010
- **US3 (T029–T034)**: depends on US2 (both writers must exist before parity is meaningful)
- **Polish (T035–T041)**: depends on all three stories. T041 last

### Parallel Opportunities

- T003 alongside T001/T002 review
- **T005 ∥ T009 ∥ T010 ∥ T012** — different projects entirely: the C# base class, the generator tests, and the client composable have no shared files
- **T013 ∥ T014** — fixture page and e2e spec are different files
- **T021 ∥ T022** and **T029 ∥ T030** — independent test cases
- **T035 ∥ T036 ∥ T037** — tests, docs and changelog
- The three record-marking batches (T015–T017) are *not* parallel: same file, `ComponentModels.cs`
- The three client batches (T023–T025) are *not* parallel with each other by policy — one task per commit, ≤10 component files each

### Within Each Story

- Tests first, and they must **fail** before the implementation that satisfies them
- Server before client: a field must be rendered before it can be adopted
- Contract before component: contract C2/C3 decisions are settled in `contracts/`, never per component

---

## Parallel Example: Phase 2 Foundational

```bash
# These four touch four different projects and share no files:
Task: "T005 Extract data-lt-ssr stamping in LaughTale.Components/TagHelpers/IslandTagHelperBase.cs"
Task: "T009 Generator tests in LaughTale.Tests/Generators/FormControlEmissionTests.cs"
Task: "T010 useFormField composable in LaughTale.Client/src/composables/useFormField.ts"
Task: "T012 useFormField unit tests in LaughTale.Client/tests/composables/form-field.test.ts"
```

---

## Implementation Strategy

### MVP scope — User Story 1 only (T001–T020)

1. Phase 1 Setup — capture the baseline, halt if it does not reproduce
2. Phase 2 Foundational — the attribute, the generator, the composable, the counters
3. Phase 3 US1 — mark 29 records, remove the shared name defaults
4. **STOP and VALIDATE**: `npm run test:e2e -- form-association --grep "no-script"` shows 29 of 29
5. This is shippable on its own. The framework's forms degrade honestly; server actions are unblocked

### Incremental Delivery

1. Setup + Foundational → plumbing exists, nothing adopts it yet
2. + US1 → **no-JS forms work (MVP)** — the framework stops silently posting nothing
3. + US2 → the field survives hydration, refresh and teardown; 18 hand-rolled sites deleted
4. + US3 → the two paths are byte-identical; serialization has one implementation
5. + Polish → docs, roadmap corrections, baseline re-save

### Out of scope for 045

- **User Story 4 (native validation)** — depends on Q1; deferred with the custom-element track
- Server-rendering the *interactive* widget — this feature renders the field only (research D9)
- Framework-adapter islands (React/Vue/Svelte) — they do not server-render at all; Part D work

---

## Notes

- **One task per commit.** Run the gate before and after; record both numbers in the message
  (constitution II and IV).
- **At most 10 component files per commit.** The batches are sized to this; do not merge them.
- **A gate that fails twice is a halt**, not a third attempt. Write `BLOCKED.md` with the task ID, both
  gate outputs and your diagnosis.
- **Never edit a gate to make it pass.** T011 is the only authorised gate-script edit in this feature,
  and only for the three changes enumerated above.
- **Counters do not close tasks.** The e2e case does (FR-017). A counter at target with a failing
  behavioural test means the counter was gamed.
- `formAssociationAdoption` must still read **0** at the end of this feature. If it moved, revert.
