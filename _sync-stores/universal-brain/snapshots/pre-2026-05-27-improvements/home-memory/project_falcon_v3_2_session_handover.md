# Falcon Revamp — v3.2 Q4.2 session handover (2026-05-10)

> **PURPOSE:** when the user opens a new session, this file is the first thing the agent should read. It contains:
> 1. Where things stand right now (post night-shift + autopilot + cross-framework demos recreated)
> 2. The honest gap (what Claude's plan promised vs what landed)
> 3. The exact next steps in priority order
> 4. The user's explicit constraints (skip demos, include libraries)

---

## State as of 2026-05-10 11:45 AM

### Code state
- All three apps (`admin-console`, `host-shell`, `management-console`) prod-build **GREEN** at NEW tightened budgets (admin 8.5/9.5 MB, host 5.5/6 MB, mgmt 11/12 MB)
- Working tree dirty — 17 waves of changes uncommitted
- Restore patch saved at `C:\Falcon\Brain\Brain Generated\step2-restore\` (pre-Angular-21 rollback path)

### Tech stack
- **Angular 21.2.9** + **Nx 22.7.1** + CDK 21.2.9 + module-federation 21.2.2
- **Zoneless change detection on all 3 apps** (zone.js polyfill eliminated everywhere)
- **PrimeNG 21.1.6 still installed** (single consumer: `falcon-data-table`)
- @primeuix/themes 2.0.3, primeicons 7.0.0 (still installed, same root cause)
- Stencil 4.43.4 (unchanged), TypeScript 5.9.3 (locked)
- 35 Falcon Angular wrappers in `@falcon/ui-core/angular` barrel (was 32; added card, input-number, menu, drawer)
- ESLint carve-outs: 1 (only `falcon-data-table.component.ts`; was 5)

### Bundle deltas (vs Wave 0)
| App | Wave 0 raw → Now | Wave 0 gz → Now |
|---|---|---|
| admin-console | 11.86 MB → **8.03 MB (−33%)** | 2.54 MB → **1.47 MB (−42%)** |
| host-shell | 6.30 MB → **2.82 MB (−55%)** ⭐ | 1.34 MB → **0.59 MB (−56%)** ⭐ |
| management-console | 11.66 MB → **7.83 MB (−33%)** | 2.51 MB → **1.45 MB (−42%)** |

### Security posture
- npm audit: **80 → 19 vulnerabilities** (1 critical → 0; 61 high → 5; **−76%**)

### Cross-framework demos (POCs — EXCLUDE from any enhancement calculation)
- `C:\Falcon\falcon-web-platform-ui\demos\angular-playground\` (port 5175) — Angular 20 Vite/Analog
- `C:\Falcon\demos\react-playground\` (port 5173) — React 19 Vite (outside workspace)
- `C:\Falcon\demos\vue-playground\` (port 5174) — Vue 3 Vite (outside workspace)
- All 3 share 28-component registry parity + 29 markdown docs at `falcon-web-platform-ui/demos/component-docs/`
- **User directive (2026-05-10): SKIP DEMOS in any future enhancement / bundle calculation. Don't delete them. They are POCs for future cross-framework verification.**

### Library inventory (INCLUDE in enhancement strategies)
- `libs/falcon-ui-core/` — Stencil + Angular wrappers (~52 components: 26 Shadow + 26 Tailwind variants + a few specialised)
- `libs/falcon-ui-tokens/` — design tokens (CSS custom properties, ~3,000 `--falcon-*` tokens)
- `libs/falcon/` — domain shared-ui + theme + language + types + data-access + utils + core
- `libs/falcon-studio/` — Theme Studio (quiesced from production routes per W2 Option B; preserved on disk)
- `libs/sdk/` — `@falcon/sdk` runtime façades

---

## 🚨 The honest gap — what Claude's plan promised but didn't land

User directive on 2026-05-09: *"I need to totally delete zero use of prime-ng and prime icon..."*

**What's still NOT done:**

| Item | Status | Single Root Cause |
|---|---|---|
| `primeng` package uninstall | Still installed at v21.1.6 | `falcon-data-table.component.ts` still imports `primeng/api`, `primeng/menu`, `primeng/table` |
| `@primeuix/themes` uninstall | Still installed at v2.0.3 | Peer of primeng |
| `primeicons` uninstall | Still installed at v7.0.0 | Tied to primeng theme + the vendored CSS file |
| Delete `libs/falcon/src/theme/styles/primeicons-trimmed.css` | Still present | Tied to primeicons removal |
| Delete `libs/falcon/src/theme/styles/primeng/` folder | Still present | Tied to primeng removal |
| Drop the falcon-data-table ESLint carve-out | Still present | Tied to data-table migration |
| Replace `MenuItem` / `TreeNode` / `MessageService` types with Falcon equivalents | Still using `primeng/api` types | Type-replacement deferred |
| Drop `providePrimeNG()` from app config | Still called | Required by the surviving table component |

**Single blocker: `falcon-data-table.component.ts` migration.** Once that's done, all 8 items above can be closed in a single follow-up wave.

---

## 🎯 Next-steps plan (priority-ordered, ready to execute)

### 🔴 Tier 1 — Closes the user's "zero PrimeNG" goal (1 waveset, ~2-4 days)

#### **Wave PR-1: Audit `falcon-data-table` actual usage**
- Read `falcon-data-table.component.ts` end-to-end. List every PrimeNG `<p-table>` feature it uses.
- Cross-reference with admin-console hierarchy menu (the only consumer). Identify which features are actually exercised by the running app.
- Output: `data-table-feature-inventory.md` — what's needed vs. what PrimeNG's API surface offers.

#### **Wave PR-2: Build minimal Falcon replacement composing existing atoms**
- Approach: compose from `<falcon-angular-input>` (search/filter), `<falcon-angular-button>` (sort/select), `<falcon-angular-paginator>`, `<falcon-angular-tooltip>`, `<falcon-angular-menu>` (row actions), and a thin Falcon table primitive that handles the grid + sticky header + sort indicators.
- Two paths:
  - **A.** Pure-Angular component using existing Falcon atoms (recommended — Gemini's pattern)
  - **B.** Extend the existing `<falcon-table>` Stencil component (cross-framework, more work)
- Pilot on the admin-console hierarchy menu only. Smoke-test before rollout.

#### **Wave PR-3: Migrate `falcon-data-table` consumers**
- Replace `<falcon-data-table>` callsites with the new Falcon composition.
- Drop the legacy `falcon-data-table.component.ts` once zero callsites remain.

#### **Wave PR-4: PrimeNG total purge (the cleanup)**
- `npm uninstall primeng @primeuix/themes primeicons`
- Delete `libs/falcon/src/theme/styles/primeng/`
- Delete `libs/falcon/src/theme/styles/primeicons-trimmed.css`
- Delete `libs/falcon/src/theme/assets/fonts/primeicons/`
- Drop `providePrimeNG()` calls from all 3 app configs
- Replace remaining `MenuItem` / `TreeNode` / `MessageService` type imports with Falcon equivalents at `libs/falcon-ui-core/src/types/`
- Drop the falcon-data-table ESLint carve-out
- Tighten ESLint to a flat `'primeng'` block + remove all `!primeng/api` / `!primeng/config` allow-overrides
- Update budgets to the new floor

**Estimated win:** another **−305 KB on remoteEntry.mjs** (primeng-table) + ~−100 KB main.js residual + complete elimination of PrimeNG code path

### 🟠 Tier 2 — Library-level enhancements (the user explicitly asked these be included)

#### **Wave LIB-1: `@falcon/ui-core/angular` barrel sub-paths**
- Today every `import { ... } from '@falcon/ui-core/angular'` triggers eager evaluation of the entire 35-wrapper barrel.
- Refactor to per-export sub-paths: `@falcon/ui-core/angular/falcon-button`, `/falcon-input`, etc.
- Should fix the management-console main.js +77 KB drift (Tier 2 of the previous plan).
- Estimated win: **~50-100 KB** per app + faster cold-build (smaller analysis surface).

#### **Wave LIB-2: Falcon UI library tree-shaking audit**
- Run a bundle-analyzer pass on each app and identify Falcon-library code that's bundled but never executed.
- Target: every Falcon component should ship as its own lazy chunk (already partly the case via `defineFalconComponent`).
- Look for accidentally-eager re-exports in `libs/falcon-ui-core/src/components.ts`.

#### **Wave LIB-3: Theme token surface trim**
- 2,993 `--falcon-*` tokens currently. Some are likely unused.
- Cross-reference theme tokens against `var(--falcon-*)` usage in compiled `styles.css`. Drop confirmed-unused tokens.
- Coordinate with `feedback_v02_theme_adopted.md` (V0.2 theme is the canonical SSOT) and `project_token_unification_plan.md`.
- Estimated win: ~50-100 KB on `styles.css` per app.

#### **Wave LIB-4: `libs/falcon` structural split (Wave 9 from v3.1)**
- Today `@falcon` workspace lib is `eager:true` shared in module-federation, and pulls 6 MB into `remoteEntry.mjs`.
- Split into separate Nx libs: `falcon-bootstrap`, `falcon-shared-ui`, `falcon-shared-data-access`, `falcon-shared-utils`, `falcon-core`, `falcon-language`, `falcon-theme`.
- Federation share-map: only bootstrap + theme + sdk eager singleton; rest lazy.
- **HIGH risk** — requires a codemod for ~hundreds of consumer imports. Multi-day. Pilot on admin-console first.
- Estimated win: **−1.5 to −3 MB** on `remoteEntry.mjs` per app.

### 🟡 Tier 3 — Code quality (deferred from v3.1 plan)

- **Wave CQ-1: TypeScript strict mode explicit** in `tsconfig.base.json`. May surface latent type errors. Estimated win: B3 score 4 → 8.
- **Wave CQ-2: Playwright E2E baseline** for top-traffic flows on each app. Smoke-test gate for HIGH-risk waves (LIB-4 in particular).
- **Wave CQ-3: Refactor 324 KB component outliers** — `organization-hierarchy-falcon-menu.component.ts` and sibling. Split into smaller subcomponents per tab area. Estimated win: ~−200 KB.

### 🟢 Tier 4 — Investigation / opportunistic
- Investigate the workspace `.npmrc legacy-peer-deps=true` — added by Step 2 to handle vitest@4 vs @angular/build@21 internal peer conflict. Drop when vitest@5-compatible-with-build@21 ships.
- `important: true` Tailwind re-evaluation (~30 KB potential, high specificity risk).
- `Tailwind @source not` deeper exploration (next iteration after W14).

---

## ⛔ Explicit user constraints

1. **SKIP `demos/` folders in any enhancement / bundle calculation.** They are POCs for future cross-framework testing and should NOT be:
   - Counted in bundle size totals
   - Included in any optimization wave
   - Touched by any refactor
   - Their `node_modules/` are isolated; they don't affect production app builds.
2. **DON'T DELETE the demo folders.** The user wants them preserved.
3. **The user's libraries (`libs/falcon-ui-core`, `libs/falcon-ui-tokens`, `libs/falcon`, `libs/sdk`) MUST be in scope** for any enhancement strategy. They are the source of code that ships into the apps.
4. **No commits, no pushes** without explicit "commit" / "push" in the user's CURRENT message. (Standing rule from `feedback_no_commit_no_push_strict_2026_05_02.md`.)

---

## 📁 Where everything lives (for the next session)

| Artefact | Path |
|---|---|
| This handover | `C:\Users\User\.claude\projects\C--Falcon\memory\project_falcon_v3_2_session_handover.md` |
| Night-shift results | `project_falcon_revamp_v3_1_night_shift_results.md` |
| Earlier next-steps plan | `project_falcon_revamp_next_steps_plan.md` (superseded by this handover) |
| Demo locations | `project_falcon_demos_outside_workspace.md` |
| MEMORY index | `MEMORY.md` |
| Final delivery PDF | `C:\Falcon\Falcon before specs v3.2 Q4.2.pdf` |
| Final delivery PDF (renamed) | `C:\Falcon\Finalize Night Shift Mode Specs.pdf` |
| Markdown source | `C:\Falcon\Brain\Brain Generated\falcon-specs-v3.2-Q4.2.md` |
| 17 wave summary files | `C:\Falcon\Brain\Brain Generated\wave-*-summary.md` |
| Restore patch (pre-A21) | `C:\Falcon\Brain\Brain Generated\step2-restore\` |

---

## 🎬 What to do at the start of the next session

1. **Read this file first.** It's the source of truth for state.
2. Cross-reference `MEMORY.md` for full memory index.
3. Confirm with the user: "Do you want to start with Tier 1 (close the PrimeNG zero-use goal — Wave PR-1: data-table audit)?"
4. If yes, dispatch the audit. If user wants to start elsewhere, follow their lead.
5. Standing rules: build green per wave, no commits/pushes without explicit token, skip demos, include libraries in scope.
