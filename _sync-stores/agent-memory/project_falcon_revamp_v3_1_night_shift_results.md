# Falcon Revamp v3.1 — Night-shift results (2026-05-09 → 2026-05-10)

**Status:** ALL CODE WAVES COMPLETE. Working tree dirty (no commits, no pushes per standing rule). User asleep through the night-shift; signed off via "autopilot mode activated" before final 2 waves.

## What got delivered (17 waves total)

### Phase 1 — original 12-wave night shift
- **W2 (Option B):** hide-but-keep `falcon-studio` — `/studio` route + tailwind `@source` removed from host-shell. Lib preserved on disk per memory `project_falcon_studio_*` (multi-wave Studio plans in flight).
- **W2.5:** deleted `demos/{react,vue}-playground` — **162 MB disk freed**. Source NOT in git history (work-in-progress per memory `project_falcon_ui_react_vue_playgrounds.md`); UNRECOVERABLE from history. **Re-scaffolded post-shift at `C:\Falcon\demos\` per user request — see `project_falcon_ui_cross_framework_demos.md` v2.**
- **W3 + W3.1:** wired `falcon-card` + `falcon-input-number` Angular wrappers into `@falcon/ui-core/angular` barrel. Fixed latent `FormsModule` defect in input-number. Made `build.cjs` self-healing via stub seeding before Stencil runs.
- **W3.5:** Angular 21 + Stencil 4 + Tailwind v4 + Nx-MF compatibility audit. **Verdict: GO** with mandatory pre-step `nx@22.7.1 migrate latest`.
- **W3.7:** debug_node investigation. **Hypothesis REFUTED** — `@angular/core/fesm2022/debug_node.mjs` is the actual Ivy runtime in Angular 20.x, not removable. Phantom 1.3 MB win.
- **W4a:** built **`falcon-menu`** Stencil + Tailwind variant + Angular wrapper (11 new files).
- **W4b:** built **`falcon-drawer`** Stencil + Tailwind variant + Angular wrapper (10 new files).
- **W5:** migrated 3 of 4 Wave-8 ESLint carve-outs (client-settings-step, organization-hierarchy-menu, falcon-org-node-drawer). 4th (falcon-tree-panel) blocked on falcon-menu external-anchor mode → moved to overage Step 1.
- **W10 (revised):** wrapped `<p-table>` in `falcon-data-table.component.html` with `@defer (on idle)` — admin-console remoteEntry −111 KB.
- **W14:** Tailwind `@source not` exclusions (modest CSS trim).
- Demo docs sweep: 3 markdown files re-pointed away from deleted react-playground.

### Phase 2 — overage (after user said "or you delete the prime-ng and upgrade angular and make it zoom less")
- **Step 1:** extended `falcon-menu` Stencil with `@Method() showAt(el, event?)` external-anchor mode + `@Method() hide()`. Migrated `falcon-tree-panel` from `<p-menu>` → `<falcon-angular-menu>`. Last Wave-8 ESLint carve-out dropped.
- **Step 2:** Angular **20.3.12 → 21.2.9** upgrade. Pre-step Nx 22.0.4 → 22.7.1. Lockstep PrimeNG 20.4 → 21.1.6, @primeuix/themes → 2.0.3, @angular/cdk → 21.2.9, @angular-architects/module-federation → 21.2.2. ~25 schematics auto-applied. TypeScript stayed at 5.9.3. Stencil 4.43.4 stayed (framework-agnostic). All 4 builds GREEN. Restore patch saved at `C:\Falcon\Brain\Brain Generated\step2-restore\` (just in case).
- **Step 3:** Zoneless pilot on **admin-console**. `polyfills.js` ELIMINATED entirely (−2.37 MB raw / −565 KB gz). Files: `app.config.ts` (provideZonelessChangeDetection), `bootstrap.ts` (provideAnimationsAsync), `project.json` (polyfills:[]), `module-federation.config.ts` (zone.js dropped from eager-shared).
- **Step 4:** PrimeNG ESLint lockdown verified ironclad (live-fire test: 8 errors on disallowed, 0 on allowed). Budgets ratcheted DOWN to actuals + headroom: admin **8.5/9.5 MB** (was 13/14), host **5.5/6 MB** (was 7/7.5), mgmt **11/12 MB** (was 12.5/13.5).

### Phase 3 — autopilot continuation
- **Step 3B:** zoneless rolled to **host-shell + management-console**. Same 4-file pattern. `polyfills.js` ELIMINATED on all 3 apps. Combined Step 3+3B: ~6.99 MB raw / ~1.69 MB gz off cold-load wire across all 3 apps.
- **W8:** **`RemoteManifestProvider`** abstraction shipped at `apps/host-shell/src/app/core/module-federation/`. Default `JsonFileRemoteManifestProvider` — JSON path unchanged, behavior identical. Stub `ApiRemoteManifestProvider` ready for one-line swap when API ships. Bundle delta: +3.2 KB on host-shell main.js.

## Final bundle deltas vs Wave 0 baseline

| App | Wave 0 raw | FINAL raw | Δ raw | Wave 0 gz | FINAL gz | Δ gz |
|---|---:|---:|---:|---:|---:|---:|
| **admin-console** | 11.86 MB | **7.91 MB** | **−33%** | 2.54 MB | **1.47 MB** | **−42%** |
| **host-shell** | 6.30 MB | **2.82 MB** | **−55%** ⭐ | 1.34 MB | **0.59 MB** | **−56%** ⭐ |
| **management-console** | 11.66 MB | **7.83 MB** | **−33%** | 2.51 MB | **1.45 MB** | **−42%** |

Cumulative across all 3 apps: ~11 MB raw / ~3 MB gzipped removed. host-shell cut in half.

## Tech stack now in place

| Layer | Version |
|---|---|
| Angular | **21.2.9** |
| Nx | **22.7.1** |
| PrimeNG | **21.1.6** (still installed; only `falcon-data-table` consumes it) |
| @primeuix/themes | 2.0.3 |
| @angular/cdk | 21.2.9 |
| @angular-architects/module-federation | 21.2.2 |
| @stencil/core | 4.43.4 (unchanged; framework-agnostic) |
| TypeScript | 5.9.3 (locked) |
| Change detection | **Zoneless on all 3 apps** |
| Falcon Angular wrappers | **35** (was 32; added card, input-number, menu, drawer) |
| ESLint carve-outs | **1** (only `falcon-data-table`; was 5) |

## Critical caveats / pending verifications

1. **Zoneless smoke-test NOT performed** — couldn't manually verify subscription edge-cases overnight. Must check for silent UI staleness on every feature flow tomorrow morning. 10-flow checklist in `Brain/Brain Generated/NIGHT-SHIFT-MORNING-REPORT.md`.
2. **`.npmrc` workspace-level `legacy-peer-deps=true`** added by Step 2 to handle vitest@4 vs @angular/build@21 internal peer-dep conflict. Permanent until vitest catches up.
3. **management-console main.js drift +116 KB** from Angular 21 — likely barrel eager-evaluation. Worth investigating with per-export sub-paths.
4. **`primeng` package still installed** — `falcon-data-table` still imports `primeng/{api, menu, table}` for type-checking. Multi-week feature-parity Falcon table milestone is the only blocker to physical uninstall.

## Key files / artefacts in `Brain/Brain Generated/`
- `Falcon AFTER specs - night shift FINAL.pdf` (1.28 MB) — full deliverable
- `NIGHT-SHIFT-MORNING-REPORT.md` — same content in markdown
- `Falcon before specs - v2.pdf` — Wave 0 baseline for comparison
- 17 wave summary files (`wave-1-revamp-summary.md` through `wave-step8-remote-manifest-provider.md`)
- `step2-restore/` — full rollback patch + package.json/lock backups
- `WAVE-0-SCORECARD.md` — 21-metric baseline scorecard
- `REVAMP-V3.1-PROGRAM-PLAN.md` — the source-of-truth plan
- `claude-opinion-and-dependency-matrix.md` — Claude's pragmatic plan + dependency graph
- `demos-recreation-summary.md` — React + Vue playground recreation report
