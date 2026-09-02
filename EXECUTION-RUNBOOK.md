# LaughTale Execution Runbook

**Created**: 2026-09-02
**Audited against**: commit `a49a996` (branch `comp`)
**Strategy**: [ROADMAP.v5.md](ROADMAP.v5.md)
**Audience**: an AI agent executing tasks via Spec Kit.

An ordered, gated walkthrough written to be executed by an agent that will confidently claim work is
finished when it is not. Every task ends in a command whose numeric output decides the outcome, so
**"done" is a number, not a judgement.**

---

## §0 — RULES FOR THE EXECUTING AGENT

These rules override every instinct you have. They exist because the previous 38 specs in this
repository were all marked complete and several changed nothing measurable. Violating any rule below
invalidates the entire run.

**R1.** You may **not** mark a task `[X]` without pasting the real, unedited stdout of its **GATE**
command into the task log. No output, no completion.

**R2.** You may **not** create, delete or edit any file outside the **FILES** list of the task you are
currently executing.

**R3.** You may **not** modify `scripts/audit-metrics.mjs`, `scripts/verify-contracts.mjs`,
`metrics-baseline.json`, or any test file in order to make a gate pass. **If a gate blocks you, the
code is wrong, not the gate.**

**R4.** You may **not** use any function, type or import you have not first confirmed exists. Run
`grep -rn "export .*<symbol>" src/` before every unfamiliar call. If it returns nothing, **STOP** — do
not invent it.

**R5.** The total test count must **never decrease**. Deleting, skipping or `.only`-ing a test to get
green is a failed run.

**R6.** One task per commit. Run the gate *before* you start and *after* you finish, and record both
numbers.

**R7.** If a gate fails **twice**, stop. Write `BLOCKED.md` stating the task ID, both gate outputs and
your diagnosis. Do not attempt a third fix.

**R8.** Never edit more than **10 component files** in a single commit. Batches exist so a bad change
is findable.

**R9.** If any instruction here conflicts with something you believe about the codebase, **the
codebase wins** — verify with a command and follow what it prints.

**R10.** Do not "improve" anything not named in the task. No renames, no reformatting, no drive-by
refactors, no dependency upgrades.

---

## §1 — WHY THE LAST 38 SPECS PRODUCED ALMOST NOTHING

> **Every past spec measured *delivery*. None measured *adoption*. So modules got built, tasks got
> ticked, and the application never changed.**

Three verified examples from this repository:

- `specs/003-inert-html-sanitizer` — shipped a 333-line HTML sanitizer. **4 of 76 components
  reference any escaping helper.** The XSS exposure it was written to close is still open.
- `specs/038-wai-aria-accessibility-suite` — 5 tasks, all `[X]`. **21 components still emit no
  `aria-*` attribute at all.**
- `specs/035-batched-style-injection` — 4 tasks, all `[X]`, including "verify 100% test pass rate".
  This one *did* land: **75 of 76** components adopted it. It is the control case proving the pattern
  is fixable.

Every task in this runbook therefore gates on a **consumer-side counter** — how many components
actually call the thing — never on whether a file exists.

### ⚠ COUNTER-WARNING: do not "fix" the 604 hex fallbacks

`verify-contracts.mjs` reports 716 hex violations. **604 of those sit in the fallback slot of
`var(--token, #hex)`** — e.g. `var(--p-primary-50, #eff6ff)` — which is deliberate, correct defensive
CSS. Only **112** are genuinely hardcoded.

Stripping the fallbacks would make the components *less* robust while appearing to improve the
metric. Task **T801** fixes the rule; **nothing before it touches those values.**

### ⚠ COUNTER-WARNING: `listenersUnmanaged: 374` is the same kind of lie

**Do not migrate event handlers to reduce this number.** A balanced-paren parse of every
`addEventListener` call in `src/components/` on 2026-09-02 found:

```text
total addEventListener        : 446
options arg carries 'signal'  : 443
genuinely UNMANAGED           :   3   (galleria.ts:413, message.ts:667, toast.ts:630)
```

The counter's pattern (`audit-metrics.mjs:89`) scans a 160-character window that cannot cross a `;`,
so any registration whose handler body contains a statement separator is counted as unmanaged even
when its options argument is `{ signal: ctx?.signal }`. `button.ts` has one registration, it is
correctly managed, and it is reported as one violation.

The real defect is one level up: `rehydrateIsland()` re-runs mount without ever dispatching
`laughtale:unmount`, so the previous mount's `AbortController` is never aborted and every correctly
bound handler survives the refresh. Measured: 3 refreshes produce 4 mounts, **0 aborts**, and window
handlers growing 1 → 2 → 3 → 4.

Feature **040** fixes the teardown and corrects the counter (040/T008, the only task authorised to
edit `audit-metrics.mjs`). **Nothing before it migrates a handler.**

---

## §2 — GROUND TRUTH

Verified 2026-09-02 against `a49a996`. If your first harness run disagrees by more than 2 on any
metric, **STOP and report** — the tree has moved and this runbook needs revision.

| Metric | Start | Target | Achieved | Phase | Meaning |
|---|---:|---:|---:|:--:|---|
| `innerHtmlRawAssignments` | 159 | **0** | **0** | 2 | Markup built by raw string concatenation — the XSS surface |
| `escapeAdoption` | 4 | **68** | **65** | 2 | Components using an escaping helper |
| `listenersUnmanaged` | 374 ⚠ | **0** | **0** | 3 | ⚠ Corrected baseline was 3; Achieved: 0 |
| `observersDisconnected` | 0 | **2** | **2** | 3 | Observers created: 2. Disconnected: 2 (100%) |
| `timersUncleared` | 37 | **0** | **0** | 3 | Timers scheduled and never cleared (Achieved: 0) |
| `ariaZeroComponents` | 21 | **0** | 21 | 5 | Components with no ARIA attribute whatsoever |
| `focusTrapAdoption` | 1 | **9** | 1 | 5 | Overlays using the focus trap that already exists |
| `virtualizerAdoption` | 0 | **6** | 0 | 6 | Large-list components using the virtualizer that already exists |
| `eventsBare` | 12 | **0** | 12 | 7 | Events emitted without a namespace |
| `rawSvgLiterals` | 212 | **0** | 212 | 7 | Inline SVG despite an icon module existing |
| `inlineStyleAttributes` | 707 | **<100** | 704 | 7 | Inline styles no design token can reach |
| `hexHardcoded` | 112 | **0** | 112 | 8 | Genuinely hardcoded colors |
| `hexInVarFallback` | 604 | **604** | **604** | 8 | **LEAVE ALONE.** Legitimate fallbacks |

---

## §3 — WHERE THE TASKS LIVE

**This runbook does not define tasks.** It defines the rules, the ground truth and the halt
conditions. Tasks live in Spec Kit features under `specs/`, authored one feature at a time with the
full artifact set — `spec.md`, `plan.md`, `research.md`, `data-model.md`, `quickstart.md`,
`tasks.md` and `checklists/requirements.md`.

**Current feature**: [`specs/040-island-teardown-lifecycle/`](specs/040-island-teardown-lifecycle/)
— make island teardown actually run when an island is replaced in place, release the observers and
timers no cancellation token covers, and repair the three verification mechanisms that were
incapable of detecting any of it.

**Previous feature**: [`specs/039-component-safe-rendering/`](specs/039-component-safe-rendering/)
— **complete**. All 40 tasks closed; `innerHtmlRawAssignments: 0`, `escapeAdoption: 65`,
`unsafeCalls: 0`.

Read in this order before executing anything:

1. `.specify/memory/constitution.md` — governing rules, overrides everything
2. `EXECUTION-RUNBOOK.md` §0–§2 — these rules, and the ground-truth numbers
3. `specs/<feature>/spec.md` — what "done" means
4. `specs/<feature>/plan.md` — technical approach and phasing
5. `specs/<feature>/data-model.md` — the API contract to code against
6. `specs/<feature>/quickstart.md` — worked patterns and the mistakes to expect
7. `specs/<feature>/tasks.md` — the ordered task list you execute

Later features are authored only when the current one is complete. The remaining scope is recorded
in [ROADMAP.v5.md](ROADMAP.v5.md); it is strategy, not instruction, and no agent should implement
from it directly.

**Already delivered** (do not redo):

| What | Where | Evidence |
|---|---|---|
| Adoption metrics harness + ratchet | `LaughTale.Client/scripts/audit-metrics.mjs` | reproduces §2; `--check` rejects a planted regression |
| Committed baseline | `LaughTale.Client/scripts/metrics-baseline.json` | |
| Pre-commit ratchet hook | `.githooks/pre-commit` (`core.hooksPath` set) | verified rejecting a planted regression |
| Safe rendering primitive | `LaughTale.Client/src/runtime/html.ts` | 12 tests, mutation-verified |
| Its test suite | `LaughTale.Client/tests/runtime/html.test.ts` | disabling `escapeHtml` fails 10/12 |

---


## §4 — BARRIER REFERENCE

| Trigger | Action |
|---|---|
| Gate fails twice | STOP. Write `BLOCKED.md` with task ID, both outputs, diagnosis. No third attempt. |
| Test count decreased | STOP. Revert the commit. Tests are never removed to reach green. |
| A metric moved the wrong way | STOP. `--check` already exits 1. Revert, don't re-baseline. |
| Tempted to edit a gate script | STOP. Only a task that **explicitly authorises it in writing** may touch `verify-contracts.mjs` (in feature 039 that is T032–T033). Never `audit-metrics.mjs`. |
| Symbol not found by grep | STOP. Do not invent it. Report the missing dependency. |
| Batch exceeds 10 files | STOP. Split the commit. |
| §2 numbers don't reproduce | STOP. The tree has moved; this runbook needs revision first. |
| `hexInVarFallback` dropped | STOP. You deleted legitimate CSS fallbacks. Revert. |
| More than 3 new `unsafe()` in one batch | STOP. The migration pattern is wrong, not the ceiling. |
| Tempted to re-save the metrics baseline | STOP. Only the final verification task of a completed feature may re-baseline. |

---

## §5 — SPEC KIT MAPPING

Features are authored one at a time, with the complete artifact set, and reviewed before an
implementation agent is given them. Do **not** run `/speckit-specify`, `/speckit-plan` or
`/speckit-tasks` — the specs are authored deliberately and are fixed. Implementation agents run
`/speckit-implement` against an existing folder only.

| Feature | Status |
|---|---|
| `039-component-safe-rendering` | **Complete** — 40/40 tasks, counters verified |
| `040-island-teardown-lifecycle` | **Complete** — all tasks closed; `listenersUnmanaged: 0`, `observersDisconnected: 2`, `timersUncleared: 0` |
| Remaining scope | Recorded in [ROADMAP.v5.md](ROADMAP.v5.md); authored as features when 040 completes |

Barrier references to task IDs elsewhere in this document refer to tasks defined in the current
feature's `tasks.md`.

---

## §6 — DEFINITION OF DONE

Each feature defines its own completion criteria in its `spec.md` Success Criteria and its
`tasks.md` Definition of Done. There is no global "run complete" state — the roadmap is delivered
feature by feature.

**Feature 040 — `040-island-teardown-lifecycle` — complete:**

```
cd LaughTale.Client && node scripts/audit-metrics.mjs

  listenersUnmanaged             0     <- from 3 (corrected reading; 374 was a lint artefact)
  observersDisconnected          2     <- from 0, and equal to observersCreated
  timersUncleared                0     <- from 37

npm run verify                          # exit 0
npx tsc --noEmit                        # exit 0
```

plus four guards each observed **failing** before it is trusted: the teardown test on unmodified
code, the corrected counter on a planted violation, the leak detector on a planted leak on window,
document and element, and the three contract rules on a planted violation of each kind.

**Previous feature — `039-component-safe-rendering` — complete:**

```
  innerHtmlRawAssignments        0     <- from 159
  escapeAdoption                65     <- from 4
  unsafeCalls                    0     <- capped at 20, came in at 0
```

**Counters owned by later, not-yet-authored features** — do not attempt to move these while working
on 040:

| Counter | Now | Eventual target |
|---|---:|---:|
| `ariaZeroComponents` | 21 | 0 |
| `focusTrapAdoption` | 1 | 9 |
| `virtualizerAdoption` | 0 | 6 |
| `formAssociationAdoption` | 0 | 24 |
| `handleAdoption` | 0 | 20 |
| `rtlAdoption` | 8 | 76 |
| `adapterUpdateSupport` | 0 | 4 |
| `eventsBare` | 12 | 0 |
| `rawSvgLiterals` | 212 | 0 |
| `inlineStyleAttributes` | 707 | <100 |
| `hexHardcoded` | 112 | 0 |
| `hexInVarFallback` | 604 | **604 — leave alone** |

---

**The one thing to carry through every task**: this repository already contains a sanitizer nobody
calls, a focus trap one component uses, a virtualizer zero components use, and an ARIA suite that left
21 components silent. All were delivered by specs marked complete. The difference between that outcome
and this one is entirely whether the acceptance criterion counted the module or counted its callers.

*Every gate in this runbook was executed against the repository at `a49a996` on 2026-09-02, and the
ratchet was verified to reject a deliberately introduced regression. The numbers in §2 are
reproductions, not estimates.*
