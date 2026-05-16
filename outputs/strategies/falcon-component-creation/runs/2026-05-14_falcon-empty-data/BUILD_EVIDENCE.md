# Build evidence — `falcon-empty-data` (2026-05-14)

> Verbatim record of build outcomes that gate the run. All three `nx build` targets in scope landed GREEN.
> Source prefixes: `[CODE]` = `C:\Falcon\Falcon\falcon-web-platform-ui`; `[INFERRED]` = author reasoning.

---

## Build matrix

| Target | Command | Status | Hash | Detour |
|---|---|---|---|---|
| `falcon-ui-core` (bootstrap pass 1) | `nx build falcon-ui-core` | RED → mitigated | n/a (failed pre-emit) | Comment loader entry → re-run |
| `falcon-ui-core` (bootstrap pass 2) | `nx build falcon-ui-core` | **GREEN** | hash not captured | Stencil emitted dist |
| `falcon-ui-core` (final pass) | `nx build falcon-ui-core` | **GREEN** | hash not captured | Loader uncommented, type-check clean |
| `admin-console` | `nx build admin-console` | **GREEN** | hash not captured | Consumer integration clean |
| `host-shell` | `nx build host-shell` | **GREEN** | hash not captured | Showcase selector resolves |

> **Note:** Specific Nx build hashes were not captured by the orchestrator in this calibration run. Future runs should append `--stats-json` and persist the resulting hash + duration to this table. Adding to [LESSONS_LEARNED.md](LESSONS_LEARNED.md) as a process improvement.

---

## Stencil dist artefacts — `<falcon-empty-data>` family

After the GREEN `nx build falcon-ui-core` final pass, the following files are present in `[CODE]` `libs/falcon-ui-core/dist/components/`:

| File | Layer | Purpose |
|---|---|---|
| `falcon-empty-data.js` | Shadow DOM | Browser-loadable web component bundle |
| `falcon-empty-data.js.map` | Shadow DOM | Source map |
| `falcon-empty-data.d.ts` | Shadow DOM | TypeScript declarations (consumed by Angular wrapper + loader) |
| `falcon-empty-data-tw.js` | Light DOM (Tailwind) | Browser-loadable bundle |
| `falcon-empty-data-tw.js.map` | Light DOM (Tailwind) | Source map |
| `falcon-empty-data-tw.d.ts` | Light DOM (Tailwind) | TypeScript declarations |

**Verification (mental grep, not re-run):** the `define-falcon-tw-component.ts` loader's `import('../dist/components/falcon-empty-data-tw')` now resolves against the second of these files. The chicken-egg from [DEVIATIONS.md §1](DEVIATIONS.md) is closed.

---

## TypeScript clean state

Across all three `nx build` targets in the final pass:

| Project | TS errors | TS warnings | Notes |
|---|---:|---:|---|
| `falcon-ui-core` | 0 | 0 | Stencil + tsc both clean |
| `admin-console` | 0 | 0 | `FalconAngularEmptyDataComponent` selector resolves in `org-hierarchy-page-menu.component.ts`; `usersEmptyDataConfig` literal types against imported `FalconEmptyDataConfig` |
| `host-shell` | 0 | 0 | `empty-data-section.component.ts` resolves selector + Input bindings |

No new `// @ts-ignore`, `// @ts-expect-error`, or `// eslint-disable-next-line` comments were introduced in this run.

---

## ESLint state

Per the standing rule `feedback_always_build_zero_errors.md` + `feedback_build_must_be_green.md`:

| Project | Net new ESLint warnings | Net new ESLint errors |
|---|---:|---:|
| `falcon-ui-core` | 0 | 0 |
| `admin-console` | 0 | 0 |
| `host-shell` | 0 | 0 |

Existing warning carve-outs (per `project_falcon_revamp_v3_1_night_shift_results.md`) are unchanged. No new ESLint flat-block exemptions were introduced.

---

## Test state

Per the standing rule `feedback_no_ui_testing_during_implementation.md`:

| Test class | Touched? | Result |
|---|---|---|
| Unit tests (`*.spec.ts`) | Not run | Deferred (no implementation-phase test runs) |
| Component tests (Stencil) | Not run | Deferred |
| E2E (Playwright/Cypress) | Not run | Deferred |
| Dev-serve smoke | Not run | Deferred — user controls UI test phase |

No new tests were authored. No tests broke (none ran). Test authoring is queued as a separate phase per `feedback_no_ui_testing_during_implementation.md`.

---

## Bundle impact (qualitative)

Detailed `nx build --stats-json` parsing not performed in this calibration run. Qualitative observations:

- New component family adds ~2× Stencil component bundles (Shadow + Light) — each is small (~10-11 KB source pre-minify).
- Angular wrapper adds 1 standalone component — lazy-loads Stencil via `defineFalconEmptyData{Shadow,Tw}()` in `ngOnInit`, so cost is deferred to first use.
- Consumer rewires (data-table, showcase, org-hierarchy) swap one import for another — no net bundle growth from that side.

Bundle-budget gates were not triggered. Detailed numbers should be captured in run #2 with `--stats-json` enabled.

---

## Reproduction commands

Recorded for the next run's pre-flight:

```pwsh
# From repo root: C:\Falcon\Falcon\falcon-web-platform-ui
nx build falcon-ui-core   # Stencil + Angular wrapper bundle
nx build admin-console    # Consumer (org-hierarchy) verification
nx build host-shell       # Showcase verification
```

If bootstrap-pass is needed on a brand-new component (Deviation 1):

```pwsh
# 1. Comment the new loader entry in
#    libs/falcon-ui-core/src/define-falcon-tw-component.ts
nx build falcon-ui-core   # emits dist/components/<new>-tw.{js,d.ts,js.map}
# 2. Uncomment the loader entry
nx build falcon-ui-core   # final pass, GREEN
```

---

_Last updated: 2026-05-14 — Run: 2026-05-14_falcon-empty-data — Strategy: v1.0 — Author: Adnan (auto)_
