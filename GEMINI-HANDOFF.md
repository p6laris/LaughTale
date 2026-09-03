# Gemini Handoff

How to hand an implementation agent a fully-specified feature without it inventing progress.

**Division of labour**: features are specified, planned and broken into tasks **by us**, with the
complete Spec Kit artifact set, and then frozen. The agent implements. It never authors, amends or
reinterprets a spec.

A hallucinated spec is the worst outcome available, because it produces work that passes its own
wrong gates and looks finished — which is exactly how `specs/003` shipped a sanitizer that 4 of 76
components call, and `specs/038` closed a WAI-ARIA suite leaving 21 components silent.

**Feature 040 adds a second failure mode to guard against**: a *correct* spec written against a
*wrong measurement*. The roadmap said 374 event handlers leaked. Three do. An agent handed that
number would have produced 62 files of churn, moved the counter to zero, and left the actual leak —
which is one level up and unaffected by handler migration — completely untouched.

> **Check the ground truth yourself before you hand over a feature. The counter is not the territory.**

---

## Current feature

**`specs/040-island-teardown-lifecycle`** — make island teardown actually run when an island is
replaced in place, release the observers and timers no cancellation token covers, and repair the
three verification mechanisms that were incapable of detecting any of it.

Complete artifact set:

| File | Purpose |
|---|---|
| `spec.md` | 5 prioritised user stories, 18 functional requirements, 11 measurable success criteria, edge cases, assumptions |
| `plan.md` | Technical context, measured ground truth, constitution check with one justified deviation, phasing, batch composition, risk table |
| `research.md` | 15 Phase-0 decisions, each with the command output it rests on and its rejected alternatives |
| `data-model.md` | The lifecycle contract and all 9 migration patterns |
| `quickstart.md` | Worked guide and the 4 mistakes to expect |
| `tasks.md` | 29 tasks across 10 phases, each with a gate |
| `checklists/requirements.md` | Spec quality + constitutional compliance sign-off |

**Constitution amendment 1.1.0** accompanies this feature: the blanket ban on editing
`audit-metrics.mjs` becomes "forbidden except where a feature's `tasks.md` authorises it in writing",
with an exhaustive standing-authorisation table. Feature 040/T008 is the first and only current use.

---

## What makes this feature different to run

Feature 039 was a migration: 68 files, one mechanical change, a counter that went down. You could
judge it from the counter.

Feature 040 is four repairs, and **three of its gates are numbers the agent could fake and one is a
test that must fail**. Read §2 and §3 carefully before you hand it over.

---

## 1. Kickoff prompt

Paste verbatim. Nothing to edit.

```
You are the implementation agent for the LaughTale framework.

READ THESE FILES COMPLETELY BEFORE DOING ANYTHING:
  .specify/memory/constitution.md                          <- governing rules, overrides everything
  ROADMAP.v5.md                                            <- strategy, ground truth and the two
                                                              counter-warnings
  specs/040-island-teardown-lifecycle/spec.md              <- what "done" means
  specs/040-island-teardown-lifecycle/plan.md              <- approach, measured ground truth, phasing
  specs/040-island-teardown-lifecycle/research.md          <- why each decision was made, with evidence
  specs/040-island-teardown-lifecycle/data-model.md        <- the contract you code against
  specs/040-island-teardown-lifecycle/quickstart.md        <- worked patterns and expected mistakes
  specs/040-island-teardown-lifecycle/tasks.md             <- the ordered task list

YOUR JOB
Execute specs/040-island-teardown-lifecycle/tasks.md in order, starting at T001.
Tick a task [X] in tasks.md ONLY after pasting its real gate output into the commit message.
One task per commit. Stop at the end of each PHASE and report before continuing.

THE SINGLE MOST IMPORTANT THING TO UNDERSTAND BEFORE YOU START
The metric `listenersUnmanaged` reports 374. The true figure is 3.
443 of the 446 addEventListener calls in src/components/ ALREADY pass { signal: ctx?.signal }.
The counter cannot see them because its regex window cannot cross a ';' inside a handler body.

  DO NOT MIGRATE EVENT HANDLERS TO REDUCE THAT NUMBER.

The real defect is that rehydrateIsland() re-runs mount without ever dispatching
'laughtale:unmount', so the previous mount's AbortController is never aborted. Every correctly
bound handler leaks anyway. You fix the teardown (Phase 1) and correct the counter (Phase 2).
Only 3 component files get a handler change in this entire feature, and they are named in Phase 5.

PHASE 0 IS A TEST THAT MUST FAIL.
Its gate is `npx tsx --test tests/runtime/refresh-teardown.test.ts` reporting a FAILURE, with
aborts == 0 and 4 live handlers. If you report Phase 0 green, you have written a test that does not
exercise the defect. Do not "fix" it to pass — Phase 1 makes it pass.

HARD RULES (violating any one invalidates the run):
1. One task per commit. Never batch multiple tasks into one commit.
2. Never edit a file outside the FILES list of the phase you are currently in.
3. Before using ANY function, type or import, confirm it exists:
       grep -n "^export" src/runtime/registry.ts src/runtime/scope.ts src/runtime/hydrator.ts
   If a symbol is absent, STOP and report. Do not invent it.
4. scripts/audit-metrics.mjs may be edited ONLY in T008, and ONLY the three changes T008
   enumerates. scripts/verify-contracts.mjs ONLY in T023-T024. metrics-baseline.json ONLY in
   T008 and T027. A fourth change to any of them invalidates the run.
   If a check blocks you and you are not the authorised task, the code is wrong, not the check.
5. Never delete, skip, weaken or .only a test. Total test count must never drop below 281.
   The vacuous leak test is REPAIRED in T013, never removed.
6. Max 10 component files per commit.
7. If a gate fails TWICE on the same task, STOP. Write BLOCKED.md with the task ID, both gate
   outputs and your diagnosis. Never a third attempt.
8. Never commit with --no-verify. A rejected commit means fix the code, not bypass the hook.
9. Do not restyle, rename, reorder, reformat or refactor anything not named in the task.
10. Do not touch src/runtime/scope.ts. It is correct, tested, and deliberately not adopted here.
11. Do not run /speckit-specify, /speckit-plan or /speckit-tasks. The spec is fixed.

THE FOUR MISTAKES YOU WILL PROBABLY MAKE (all four are in quickstart.md):
  a) Migrating the 443 handlers that are already correct, because the counter says 374 are not.
  b) Rewriting the hydrator's teardown instead of just invoking it. It already aborts the
     controller, calls the returned unmount, and drains cleanups in reverse. You dispatch ONE
     event so it runs. If your hydrator.ts diff exceeds ~15 lines, you are rewriting it.
  c) Collecting timer ids into an array and clearing them in one cleanup. It defeats both gates.
     Register each timer separately.
  d) Treating a green leak test as evidence. Until T013 it mounts ZERO components and cannot fail.

AFTER EVERY TASK, report in this exact format:

  TASK: <id>   PHASE: <n>
  FILES CHANGED: <list, and nothing else>
  GATE OUTPUT:
    $ npx tsc --noEmit
    <raw output>
    $ npm test 2>&1 | grep -c "✖"
    <raw output>
    $ npm test 2>&1 | grep "ℹ tests"
    <raw output>
    $ node scripts/audit-metrics.mjs --check
    <raw output>
  COUNTERS: listenersUnmanaged    <before> -> <after>
            observersDisconnected <before> -> <after>
            timersUncleared       <before> -> <after>
  COULD NOT DO: <anything you skipped, or "nothing">

Paste all command output RAW. Never paraphrase or reconstruct it. If you did not run a command,
write "I did not run this" — that is an acceptable answer. Claiming output you did not produce
is the one unrecoverable failure.

STOP AND ASK ME when:
  - a gate fails twice
  - you believe a component needs a handler change outside Phase 5
  - you believe you need a fourth change to audit-metrics.mjs
  - npm test failures increase, or the test count drops below 281
  - a task needs a file outside its phase's list
  - the ground truth in plan.md does not reproduce within ±2
  - you reach the end of any phase

Begin with Phase 0, task T001.
```

---

## 2. Phase 0 is your calibration, and it is inverted

Phase 0 asks the agent to write a test and then **watch it fail**. Three tasks, one file, one
unambiguous outcome: `aborts == 0` and 4 live handlers on unmodified code.

**You are testing the agent, not the code.** An inverted gate is a sharper instrument than 039's was,
because "make the failing thing pass" is the reflex you are probing for.

| What it does | Read it as |
|---|---|
| Writes the test, reports it failing with aborts 0, stops at the phase boundary | Proceed to Phase 1 |
| Reports Phase 0 **green** | It did not run it, or the test does not exercise the defect. Re-prompt once |
| "Fixes" hydrator.ts in Phase 0 to make its own test pass | Rule 2 and the phase FILES list broken. Revert; retest before batch work |
| Claims output that doesn't match your own run | **It fabricates.** Do not give it the remaining nine phases |
| Deletes or weakens the assertion | Stop. Not trustworthy for this feature |

---

## 3. Verify every hand-back yourself

Never accept the summary. Run these:

```bash
cd LaughTale.Client
node scripts/audit-metrics.mjs --check          # must exit 0
node scripts/audit-metrics.mjs --json | grep -E "listenersUnmanaged|observersDisconnected|timersUncleared"
npm test 2>&1 | grep -c "✖"                     # must be 0
npm test 2>&1 | grep "ℹ tests"                  # must be >= 281
npx tsc --noEmit                                # must exit 0
cd .. && git diff --stat                        # must match the claimed files, and only those
```

Then read `git diff` itself. **The diff is the deliverable; the agent's prose is the least reliable
thing it produces.**

### Three checks specific to this feature

**(i) Diff `audit-metrics.mjs` line by line after Phase 2.** T008 authorises exactly three changes.
Anything else — a "tidy-up", a renamed variable, a second regex adjusted "while I was in there" — is
a governance violation, and it is the one place in this feature where a small edit could quietly make
every subsequent gate meaningless.

```bash
git diff <phase-1-sha>..<phase-2-sha> -- LaughTale.Client/scripts/audit-metrics.mjs
```

**(ii) Re-derive `listenersUnmanaged` independently.** Do not accept the corrected counter's own
word. The parse is in `data-model.md` §4; run it separately and confirm both agree on `3` after
Phase 2 and `0` after Phase 5.

**(iii) Confirm the leak test actually mounts something.** After Phase 3:

```bash
npx tsx --test tests/runtime/leak-harness.test.ts 2>&1 | grep -i "not registered"
```

Any output means the test is still vacuous, whatever it reports. It must also print the number of
components it exercised.

For each migrated batch, look at the rendered components. Counters prove the shape of the code, not
that it behaves. Watch for a toast that never dismisses, a dialog that loses focus sequencing, and a
float-label that stops floating.

---

## 4. Red flags — stop immediately

- Phase 0 reported green
- Output "pasted" that doesn't match your own run of the same command
- Any edit to `audit-metrics.mjs` outside T008, or more than three changes inside it
- Any edit to `verify-contracts.mjs` outside T023–T024
- Any edit to `metrics-baseline.json` outside T008 and T027
- A commit made with `--no-verify`
- Handler changes in any component other than `galleria.ts`, `message.ts`, `toast.ts`
- A diff to `hydrator.ts` substantially larger than ~15 lines
- Timer ids collected into an array and cleared in one cleanup
- `src/runtime/scope.ts` modified
- Test count below 281, or a test deleted, skipped or `.only`-ed
- "All remaining phases are complete" — it was told to stop at each phase boundary
- A re-saved baseline outside T008 and T027

The pre-commit hook catches regressions in tracked metrics. It does **not** catch a plausible-looking
wrong answer, and after Phase 2 it does not catch a counter that was edited to be wrong in a
flattering direction. That is what checks (i) and (ii) above are for.

---

## 5. When 040 completes

Do not let the agent pick what comes next. The remaining scope lives in
[ROADMAP.v5.md](ROADMAP.v5.md) as strategy, not instruction. We author the next feature together —
full artifact set, reviewed, **and with its ground truth re-measured rather than read off the
roadmap** — and only then hand it over.

Candidates in dependency order:

| Next | Why | Verify first |
|---|---|---|
| Deny-by-default authorization | `IslandEndpointExtensions.cs` skips the authorization block entirely when no policy matches; `QueryableExtensions.cs` applies the field allowlist only when supplied. C# only. | Confirm both fall-through paths still exist and are reachable |
| Endpoint rate limiting | Two public `MapPost` routes accept user-shaped filter/sort against EF Core with no limiter | Confirm no limiter has been added since the roadmap was written |
| Adapter update contract | `refresh.ts` morphs live nodes under React's reconciler; `adapterUpdateSupport` is 0 of 4 | Confirm the morph path still runs now that 040 tears islands down first — **040 may have changed this defect's shape** |

That last row is the lesson of this feature, applied forward: 040 changes when adapters are torn
down, so the adapter corruption bug must be **re-measured after 040 lands**, not inherited from the
roadmap's description of it.
