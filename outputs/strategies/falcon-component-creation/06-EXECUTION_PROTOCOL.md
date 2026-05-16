# 06 — Execution Protocol

> **Purpose.** The reusable 8-phase plan for creating a new Falcon component. Every run follows this protocol verbatim. Deviations get logged in the run's `DEVIATIONS.md` and roll up into `09-CHANGELOG.md` when they prove general.
>
> **Status:** v1.0 — calibrated on `runs/2026-05-14_falcon-empty-data/`.

## At-a-glance

| Phase | Name | Duration (est.) | Sub-agents | Build runs | Gate |
|---|---|---|---|---|---|
| 0 | Pre-flight | 5–10 min | 0 (Adnan direct) | 1 baseline build | Baseline green |
| 1 | Parallel authoring | 15–25 min | ~7 (A1–A5, B1, B2) | 0 | All files written |
| 2 | Loader + wrapper integration | 5–10 min | 1 (W1) | 0 | Files compile in isolation |
| 3 | Consumer rewires | 5–15 min | 1–2 (C1, C2) | 0 | Eager-register call landed |
| 4 | Build chain | 10–25 min | 0 (Adnan direct) | 3 builds | All 3 green |
| 5 | Documentation + Obsidian sync | 10–15 min | 1–2 (D1, D2) | 0 | All 5 doc sites updated |
| 6 | Strategy feedback | 5 min | 0 (Adnan direct) | 0 | Changelog + pitfalls patched |
| **Total** | | **~55–105 min** | | **4 builds** | |

> [INFERRED] Estimates assume Stencil compile takes 4–8 min on the dev machine. EMFILE retries can add 5–10 min per occurrence.

## Phase 0 — Pre-flight

**Goal.** Verify the workspace is healthy and the target name is unclaimed **before** writing a single file.

### Steps

1. **Baseline build.** Run `nx build falcon-ui-core` from `C:\Falcon\falcon-web-platform-ui\`. Must be green. If red → STOP, surface the pre-existing failure, do not proceed.
2. **Name clash grep.** Grep the workspace for the target name (kebab tag, class, helper file, token file). Any pre-existing hit → STOP and renegotiate the name with the user.
   - `falcon-<X>` (Stencil tag)
   - `FalconAngular<X>Component` (Angular class)
   - `falcon-<X>-tw` / `falcon-angular-<X>` (sibling tags)
   - `<X>.tokens.css` (token file)
3. **Create empty directories.**
   - `libs/falcon-ui-core/src/components/falcon-<X>/`
   - `libs/falcon-ui-core/src/angular-wrapper/falcon-<X>/`
4. **Verify token file doesn't already exist.** `libs/falcon-ui-tokens/src/components/<X>.tokens.css` must be absent.
5. **Snapshot consumer list.** Grep for any component that would consume the new tag (e.g. `falcon-data-table` for `falcon-empty-data`). Write the list into the run-dir `PLAN.md`.

### Gate

- Baseline build green.
- Name unclaimed.
- Target directories exist + empty.
- Consumer list recorded.

### Risks

| Risk | Mitigation |
|---|---|
| Baseline red from unrelated drift | Don't fix it inside this run — escalate to a separate task. |
| Name partially claimed (Stencil tag exists but Angular wrapper doesn't) | Treat as fully claimed — renegotiate the name. |
| Stencil compile cache stale | Optional `nx reset` before the baseline build (costs 30s). |

## Phase 1 — Parallel authoring (Wave 1)

**Goal.** All atomic artefact files written in parallel by ~7 sub-agents. Zero cross-dependencies between agents — each owns its own files.

### Sub-agents

| ID | Owner | Files | Reads from |
|---|---|---|---|
| A1 | Stencil Shadow author | `falcon-<X>.tsx`, `falcon-<X>.css`, `readme.md` | `04-FILE_TEMPLATES/shadow.tsx.template`, `shadow.css.template` |
| A2 | Stencil Light/TW author | `falcon-<X>-tw.tsx`, `readme.md` | `04-FILE_TEMPLATES/light-tw.tsx.template` |
| A3 | Tailwind helpers author | `<X>.classes.ts` | `04-FILE_TEMPLATES/classes.ts.template` |
| A4 | Shared types author | `<X>.types.ts` | `04-FILE_TEMPLATES/types.ts.template` |
| A5 | Token contract author | `<X>.tokens.css` + edit `index.css` | `04-FILE_TEMPLATES/tokens.css.template` |
| B1 | Doctrine reviewer | Read-only sweep of `01-CANONICAL_PATTERN.md` against the planned artefacts | `01-CANONICAL_PATTERN.md`, `03-NAMING_CONVENTION.md` |
| B2 | Pre-run scorecard author | `runs/<date>_<X>/SCORECARD.md` (pre-run column only) | `05-SCORING_RUBRIC.md` |

### Coordination rules

- Every agent gets the same `PLAN.md` (component description, Prop list, event list, a11y profile).
- A4 (`.types.ts`) is the **only** type source — A1/A2/A3/A9 import from it. If A4 falls behind, A1 stubs the imports and B1 flags the gap.
- Agents write directly to the target paths; no draft folders.
- A5 must **also** patch `libs/falcon-ui-tokens/src/index.css` with the `@import` line — easy to forget if the agent only owns "the token file".

### Gate

- All 6 atomic artefact files present in the workspace.
- `<X>.tokens.css` is imported in `index.css`.
- B1 produced a one-paragraph doctrine-fit verdict.
- B2 produced the pre-run scorecard.

### Risks

| Risk | Mitigation |
|---|---|
| A4 lags → A1/A2 stub types → drift | Adnan blocks A1/A2 dispatch until A4 returns. |
| A5 forgets `index.css` patch → tokens never reach cascade | Phase-4 build will fail visibly; mitigation is the explicit step above. |
| Two agents touch the same file | Each agent owns disjoint files by design — re-read the table if uncertain. |

## Phase 2 — Loader + wrapper integration (Wave 2)

**Goal.** Wire the new component into the loader registry and create the Angular wrapper that downstream apps will actually import.

### Sub-agents

| ID | Owner | Files |
|---|---|---|
| W1 | Loader + wrapper author | `loader/define-falcon-tw-component.ts` (one-line add), `angular-wrapper/falcon-<X>/falcon-angular-<X>.ts`, `falcon-angular-<X>.html`, `angular-wrapper/index.ts` (one-line add for barrel export) |

### Steps

1. Append the loader entry to `define-falcon-tw-component.ts`. The function should be idempotent — multiple calls with the same tag must no-op.
2. Author `falcon-angular-<X>.ts` per `04-FILE_TEMPLATES/angular-wrapper.ts.template`:
   - `@Component({ selector: 'falcon-angular-<X>', standalone: true, imports: [CommonModule] })`
   - Every Prop from `.types.ts` exposed as `@Input`.
   - Every event exposed as `@Output`.
   - `ngOnInit` calls `defineFalconTwComponent('falcon-<X>')`.
3. Author `falcon-angular-<X>.html` per `04-FILE_TEMPLATES/angular-wrapper.html.template`:
   - `@if (useTailwind) { … } @else { … }` switch.
   - Every Prop double-bound; every event double-bound with kebab event name.
4. Export the new wrapper from `angular-wrapper/index.ts`.

### Gate

- Loader has one new line; class name + tag match the Light/TW component.
- Wrapper TS compiles in isolation against the workspace TypeScript config.
- Wrapper HTML's `@if (useTailwind)` branches are symmetric (every binding present in both branches).
- Barrel export added.

### Risks

| Risk | Mitigation |
|---|---|
| Angular template syntax conflict (`[class.X-[var(--Y)]]`) | Compute the class string in TS, bind via `[class]="cls"` — see `08-COMMON_PITFALLS.md` #4. |
| Event name camelCase in template | `(falcon-<verb>-<noun>)` only — kebab-case — see pitfall #7. |
| Wrapper missing from barrel | Apps that import from `@falcon/ui-core/angular` will fail at Phase 4 — verify the barrel before moving on. |

## Phase 3 — Consumer rewires (Wave 3)

**Goal.** Update any higher-level component (e.g. `falcon-data-table`) that needs the new tag to render at first paint.

### Sub-agents

| ID | Owner | Files |
|---|---|---|
| C1 | Internal consumer rewire (within `@falcon/ui-core`) | Any data-table / panel / dialog component that slots the new tag. Apply eager-register pattern from `07-INTEGRATION_POINTS.md`. |
| C2 | External consumer rewire (within apps) | Any page that uses the new tag directly. Usually a no-op — apps consume via `falcon-angular-<X>` wrapper, lazy registration handles itself. |

### Steps

1. From the Phase 0 consumer list, for each internal consumer:
   - Add `defineCustomElements()` call at the consumer's bootstrap site if not already present.
   - Confirm the consumer's HTML template references the new tag with the canonical name.
2. For external consumers (apps): typically no action — verify by Phase 4 build.
3. If `@falcon/shared-ui` re-exports the new wrapper, update that barrel.

### Gate

- Eager-register call present at every internal consumer's bootstrap.
- Shared-UI barrel updated if applicable.
- No app-level edits expected; verify by Phase 4.

### Risks

| Risk | Mitigation |
|---|---|
| Eager-register call placed at the wrong site (e.g. inside ngOnInit of a child) | Place it at the module / app bootstrap — `main.ts` or the consuming standalone-component file's top-level — so the registration completes before any first render. |
| `@falcon/shared-ui` updated but `@falcon/ui-core` barrel forgotten | Always cross-check both barrels — see pitfall #8 for the one-way rule. |

## Phase 4 — Build chain

**Goal.** Compile the library, then both consuming apps. Zero new warnings, three green builds.

### Steps

Run **in this order** — stop at the first failure.

1. `nx build falcon-ui-core` — Stencil compile + Angular wrapper compile.
   - Risk: EMFILE on Windows (mitigated by `maxConcurrentWorkers: 1`).
   - Risk: slow first run (4–8 min on a cold cache).
2. `nx build admin-console` — confirms wrapper imports through `@falcon/ui-core/angular`.
3. `nx build host-shell` — confirms cross-MFE consumption works.

> [INFERRED] If `mgmt-console` consumes the new component, add a 4th build; otherwise its bundle is unaffected.

### Gate

- All 3 builds green.
- Warning count not increased vs. baseline.
- No new `dist-custom-elements` errors.

### Risks

| Risk | Mitigation |
|---|---|
| First Stencil compile EMFILEs out | Retry once. If it repeats, run `nx reset` then retry. Document the retry in `EXECUTION_LOG.md`. |
| `admin-console` build fails on a missing Input | Re-check Phase 2 wrapper — Input/Output parity with `.types.ts`. |
| `host-shell` build green but module-federation runtime errors | Out of Phase-4 scope — log in `DEVIATIONS.md` and address in a separate run. |

### Failure protocol

If any build is red:
1. Capture the full error in `EXECUTION_LOG.md`.
2. STOP — do not chain to the next build.
3. Identify the failing artefact + which agent authored it.
4. Re-dispatch that single agent with the error as context.
5. Re-run from step 1 of Phase 4 (not from Phase 1) — atomic files mean the affected artefact is the only one that needs to change.

## Phase 5 — Documentation + Obsidian sync

**Goal.** Every doc site and registry that lists Falcon components is updated. The run dir contains a complete evidence package.

### Sub-agents

| ID | Owner | Files / sites |
|---|---|---|
| D1 | Registry author | `Brain SK/registries/FALCON_COMPONENT_REGISTRY.md`, `Brain Outputs/understanding/frontend/FALCON_COMPONENT_REGISTRY.md` |
| D2 | Vault author | `C:\Falcon\falcon-wiki\30-Components\falcon-<X>.md` (via Templater `new-component`); optionally `C:\falcon\Brain SK\_obsidian\` if a matching structure exists |
| D3 (Adnan direct) | Run-dir finaliser | `runs/<date>_<X>/SCORECARD.md` (post-run column), `EXECUTION_LOG.md`, `DEVIATIONS.md`, `LESSONS_LEARNED.md` |

### Steps

1. **D1.** Add a row to both registries with: tag, wrapper selector, props summary, events summary, consumer list, run-dir link.
2. **D2.** Create the Obsidian note. Frontmatter must conform to `Conventions.md` schema. Tag with `kind/component`. Link to its tokens, types, classes, wrapper, and any consumers.
3. **D3.** Fill the post-run column of the scorecard. Compute the weighted total. Apply the action band from `05-SCORING_RUBRIC.md`. If `DEVIATIONS.md` is needed (any dim < 95%), write it. Write `LESSONS_LEARNED.md` regardless — even a 100% run produces lessons about timing, agent coordination, or doctrine refinements.

### Gate

- Both registries reference the new component.
- Obsidian note exists, frontmatter validates, links resolve.
- `SCORECARD.md` post-run column filled.
- `LESSONS_LEARNED.md` exists.
- `DEVIATIONS.md` exists if and only if any dimension scored < 95%.

### Risks

| Risk | Mitigation |
|---|---|
| Registry drift between Brain SK and Brain Outputs | D1 must update both in the same pass — don't split across agents. |
| Vault note appended to the wrong cluster (e.g. `20-Pages` instead of `30-Components`) | Use the `new-component` Templater template — it forces the right path. |
| `LESSONS_LEARNED.md` skipped because "nothing went wrong" | Always write it. The lessons feed Phase 6. |

## Phase 6 — Strategy feedback

**Goal.** Roll lessons from the run back into the strategy doctrine so the next run starts smarter.

### Steps

1. Read `runs/<date>_<X>/LESSONS_LEARNED.md`.
2. For each lesson:
   - Is it a new pitfall? → Add an entry to `08-COMMON_PITFALLS.md` (severity, manifest, mitigation). Increment the strategy version's PATCH number.
   - Is it a doctrine refinement? → Edit `01-CANONICAL_PATTERN.md` or the relevant `0X-…md`. Increment MINOR.
   - Is it a structural change (new artefact layer, new build target)? → Increment MAJOR.
3. Update `09-CHANGELOG.md` with the new version and the deltas.
4. If two or more runs surfaced the same lesson, promote the lesson to `01-CANONICAL_PATTERN.md` as a rule (don't keep it only in the pitfalls list).

### Gate

- `09-CHANGELOG.md` has a new entry for the run.
- All pitfalls / refinements landed in the right doc.
- No silent edits — every edit is traceable to a run's `LESSONS_LEARNED.md`.

### Risks

| Risk | Mitigation |
|---|---|
| Lessons too granular and never promoted | The "2+ runs" promotion rule prevents the pitfalls list from drowning out the doctrine. |
| Strategy version bumped without updating run-dir scorecards retroactively | Don't backfill — each run's scorecard is a snapshot against the version active at that time. |

## End-to-end example — `falcon-empty-data` (calibration run)

> Cross-reference for the protocol. Full evidence in `runs/2026-05-14_falcon-empty-data/`.

| Phase | What ran | Wall time | Outcome |
|---|---|---|---|
| 0 | Baseline `nx build falcon-ui-core` + name grep + dir create | 7 min | Green; name clean. |
| 1 | A1–A5 in parallel + B1 doctrine review + B2 pre-run scorecard | 18 min | All artefacts present; pre-run score 96%. |
| 2 | W1 loader + Angular wrapper | 8 min | One-line loader add + 3 wrapper files + barrel update. |
| 3 | C1 `falcon-data-table` eager-register | 6 min | One bootstrap call added. |
| 4 | `nx build falcon-ui-core` → `admin-console` → `host-shell` | 22 min | One EMFILE retry on Stencil; both apps green on first try. |
| 5 | D1 registries + D2 vault note + D3 run-dir finalise | 12 min | Post-run score 98.47%; 1 deviation (a11y English-only `aria-label`) logged. |
| 6 | Doctrine feedback | 4 min | Pitfall list patched (added a11y i18n note); `09-CHANGELOG.md` v1.0 entry. |
| **Total** | | **77 min** | **Ship.** |

_Last updated: 2026-05-14 — Strategy v1.0 — Author: Adnan (auto)_
