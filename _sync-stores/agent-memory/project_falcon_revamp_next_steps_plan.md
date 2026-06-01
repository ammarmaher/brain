# Falcon Revamp — Next Steps Plan (post night-shift v3.1)

**Context:** see `project_falcon_revamp_v3_1_night_shift_results.md` for what landed overnight (17 waves, 35 Falcon wrappers, Angular 21 + zoneless on all 3 apps, PrimeNG ESLint locked down, admin-console −33%/−42%, host-shell −55%/−56%, mgmt −33%/−42%). All three apps prod-build GREEN at new tightened budgets. Working tree dirty — no commits, no pushes.

## Tomorrow's priority list (ranked by importance × time-to-value)

### 🔴 Tier 1 — Today's must-do (before any further code changes)
1. **Smoke-test all 3 apps for zoneless silent-staleness** — the one thing I couldn't verify overnight. Run each app's 10-flow checklist (login, hierarchy tree, users list, wizards, IP allowlist, async forms, toasts, modals/drawers, theme toggle, language toggle). Watch for: "data updates in network tab but UI doesn't refresh until you click something." Fix pattern is local + small (`markForCheck()` after the mutation, OR convert source to a Signal / `BehaviorSubject` + `async` pipe).
2. **Sanity-check the working tree** — `git status`, `git diff` to review every line. ~30+ modified files + new files for falcon-menu, falcon-drawer, RemoteManifestProvider.
3. **Decide on commits** — say `commit` to me if you like the changes; I'll commit cleanly with proper message structure.
4. **Review the `.npmrc` `legacy-peer-deps=true`** added by Angular 21 upgrade. Permanent until vitest catches up to @angular/build@21 peer compat. Either keep (recommended for now) or remove if vitest@5 ships compatible.

### 🟠 Tier 2 — Medium-term unlocks (next 1–3 sessions)
5. **Investigate management-console main.js drift +116 KB** from Angular 21. Likely the new Falcon barrel eagerly evaluates when any `@falcon/ui-core/angular` import is dereferenced. Mitigation: per-export sub-paths (e.g. `@falcon/ui-core/angular/falcon-button` instead of barrel). 1-2 hours, ~50-100 KB potential.
6. **W14.5 — refactor 324 KB component outliers** — `organization-hierarchy-falcon-menu.component.ts` and its sibling. Split into smaller subcomponents per tab area so they tree-shake more aggressively. Estimated ~−200 KB.
7. **W9 — `@falcon` lib structural split into separate Nx libs** (`libs/falcon-bootstrap`, `libs/falcon-shared-ui`, `libs/falcon-shared-data-access`, etc.). Multi-day. **HIGH risk** for federation surface — pilot on admin-console first; mirror to host-shell + management-console only after pilot is fully clean. Estimated −1.5 to −3 MB on `remoteEntry.mjs`.

### 🟡 Tier 3 — Major milestones (each is its own multi-week project)
8. **Build feature-parity `<falcon-angular-table>` + migrate `falcon-data-table` façade** — the LAST blocker to physically uninstalling `primeng @primeuix/themes primeicons`. Multi-week. Feature gap to close: lazy-load mode, projected `<ng-template>` per cell/header/filter, row 3-dot menus, global filter, frozen columns, sticky-scrollable, multi-mode sort, skeleton rows, rowsPerPageOptions. **Two strategy choices:**
   - **A.** Build feature-parity Stencil table (heavy; ~80 hrs)
   - **B.** Build a pure-Angular `<falcon-angular-table>` that COMPOSES atomic Falcon Stencil components (button, input, dropdown, etc.) — Gemini's recommendation, ~50% less work, but diverges from cross-framework SSOT
9. **Implement `ApiRemoteManifestProvider.load()`** — when you're ready to swap the JSON file for an API call. Stub + README + one-line swap recipe in place from W8.
10. **Once #8 ships:** physically `npm uninstall primeng @primeuix/themes primeicons`, drop the last ESLint carve-out for `falcon-data-table`, tighten ESLint to a zero-allow `primeng/*` block.

### 🟢 Tier 4 — Optional / opportunistic
11. **Run `npm audit` again** — Angular 21 + PrimeNG 21 should have cleared most of Wave 0's 62 high-severity production vulns. Re-measure.
12. **Make TypeScript strict mode explicit in `tsconfig.base.json`** — currently inherited but not declared. Adds 0 KB but lifts B3 score from 4 → 8. May surface latent type issues.
13. **Re-test management-console smoke flows** (lighter than admin-console; mostly view-only screens).
14. **Drop the `.npmrc` legacy-peer-deps** when vitest@5 compatible with @angular/build@21 ships.

## Cross-framework demos status (non-revamp, but related)
- `C:\Falcon\falcon-web-platform-ui\demos\angular-playground\` (port 5175) — original, intact, runs via `cd && npm run dev`.
- `C:\Falcon\demos\react-playground\` (port 5173) — recreated post night-shift after W2.5 deletion. **Outside the workspace** (so future cleanups can't sweep it).
- `C:\Falcon\demos\vue-playground\` (port 5174) — same recreation, parallel.
- All 3 share the same 28-component registry shape + the 29 markdown docs at `demos/component-docs/`.

## Estimated end-state if Tier 1+2+3 ships
- admin-console initial: **≤ 4 MB** raw (currently 7.91 MB)
- host-shell initial: already at 2.82 MB (best in class for a federation host)
- management-console: ≤ 4 MB raw
- `remoteEntry.mjs`: **≤ 2 MB** (W9 lazy split is the lever)
- PrimeNG packages: **physically uninstalled**
- ESLint carve-outs: **0**

## Files of record
- Plan: `Brain/Brain Generated/REVAMP-V3.1-PROGRAM-PLAN.md`
- Claude's pragmatic delta plan: `Brain/Brain Generated/claude-opinion-and-dependency-matrix.md`
- Wave 0 baseline scorecard: `Brain/Brain Generated/WAVE-0-SCORECARD.md`
- Final report: `Brain/Brain Generated/NIGHT-SHIFT-MORNING-REPORT.md` + `Falcon AFTER specs - night shift FINAL.pdf`
- Compatibility audit: `Brain/Brain Generated/wave-3.5-compatibility-audit.md`
- Per-wave summaries: `Brain/Brain Generated/wave-{1..14, step1..step8}-*.md`

**Standing rules unchanged:** no commit / no push without explicit "commit" / "push" in the user's CURRENT message. Build green per wave. No theme token edits. Strict task scope.
