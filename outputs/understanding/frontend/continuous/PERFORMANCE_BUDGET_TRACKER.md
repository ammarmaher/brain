---
type: performance-budget
purpose: per-app-bundle-size-budget-and-tracking
created: 2026-05-16
status: living
tier: 4
baseline-date: 2026-05-16
budget-cadence: weekly snapshot via night-shift
---

*** Falcon Frontend — Performance Budget Tracker ***
*** What we have today · what we accept · how we track ***

# 📊 Performance Budget Tracker

> The single ledger for **what each Falcon app weighs**, **what we accept as a budget**, and **how regressions get caught**. Updated on every release tag + weekly via the night-shift orchestrator.

## Why this exists

Bundle size silently bloats as features land. By the time someone notices the admin-console main.js crossed 2 MB, the cleanup is a multi-week project. The performance budget makes regressions visible the day they land.

This tracker also celebrates wins — the night of 2026-05-09→10 cut admin-console raw size by **−42% gzipped**. Without a tracker, that work would be invisible to anyone who didn't run the diff.

---

## Current baselines (2026-05-16)

### admin-console (port 4204)

| Asset | Raw | Gzipped | Source |
|---|---:|---:|---|
| main.js | **1,210 KB** | **335 KB** | post-PrimeNG removal (Wave 8, 2026-05-10) |
| polyfills.js | _measure_ | _measure_ | — |
| styles.css | _measure_ | _measure_ | — |
| First Contentful Paint goal | < 1.5 s on 3G | — | aspirational |
| Time to Interactive goal | < 3 s on 3G | — | aspirational |

**Baseline citation:** `memory/project_falcon_primeng_total_removal_complete.md` — "admin-console main.js cut from 2,253 KB → 1,210 KB (raw) / 568 KB → 335 KB (gzipped)"

**Pre-Wave-8 baseline (for context):**
- main.js: 2,253 KB raw / 568 KB gz (with PrimeNG)
- After Wave 8: 1,210 KB raw / 335 KB gz (without PrimeNG)
- **Net win:** −1,043 KB raw / −233 KB gz · **−46% raw / −41% gz**

### host-shell (port 4200)

| Asset | Raw | Gzipped | Source |
|---|---:|---:|---|
| main.js | _measure_ | _measure_ | — |
| First load (incl. lazy chunks) | _measure_ | _measure_ | — |

**Historical wins** per `memory/project_falcon_revamp_v3_1_night_shift_results.md` (Wave 17, 2026-05-09→10):
- host-shell raw: **−55%** vs pre-revamp baseline
- host-shell gz: **−56%** vs pre-revamp baseline

### management-console (port 4301)

| Asset | Raw | Gzipped | Source |
|---|---:|---:|---|
| main.js | _measure_ | _measure_ | — |

**Historical wins** per same memory: management-console **−33% raw / −42% gz** vs pre-revamp.

**⚠ Note:** Per Agent D's Folder Structure Deep-Dive, management-console's `src/app/features/` is currently empty. The bundle size is essentially the federation shell with no business features. As features land, the budget should scale accordingly.

---

## Proposed budgets (need agreement to lock in)

| App | Asset | Hard limit | Soft target | Action if exceeded |
|---|---|---:|---:|---|
| admin-console | main.js raw | 1,500 KB | 1,250 KB | break the build at hard, slack on soft |
| admin-console | main.js gz | 400 KB | 350 KB | break the build at hard, slack on soft |
| host-shell | main.js raw | _to set after measure_ | _to set_ | — |
| host-shell | main.js gz | _to set after measure_ | _to set_ | — |
| management-console | main.js raw | grows with features | — | reset baseline when features land |
| All | First Contentful Paint | 2.0 s on 3G | 1.5 s on 3G | log + flag |
| All | Time to Interactive | 4.0 s on 3G | 3.0 s on 3G | log + flag |

**Open decision (D-2026-05-16-NEW):** lock in the hard limits.

---

## How to measure

### One-off (today)

```powershell
cd C:\Falcon\Falcon\falcon-web-platform-ui
nx build admin-console --configuration=production
# Output: dist/apps/admin-console/main.<hash>.js — check the file size

# Or with stats
nx build admin-console --configuration=production --stats-json
# Open dist/apps/admin-console/stats.json in a bundle analyzer
```

### Automated (proposed for night-shift orchestrator)

Add to `tools/night-shift/night-shift.ps1`:

```powershell
# After git fetch + audit, run a production build of each app
foreach ($app in @('admin-console', 'host-shell', 'management-console')) {
  $buildOut = "$OutputFolder\build-$app"
  & npm exec nx -- build $app --configuration=production --output-path=$buildOut 2>&1
  $mainJs = Get-ChildItem "$buildOut\main.*.js" | Select-Object -First 1
  $rawKB = [math]::Round($mainJs.Length / 1KB, 0)
  # Gzip size — use a Compress-Archive trick or external gzip
  Write-Host "$app main.js: $rawKB KB raw"
}
```

**This is a Tier 4 enhancement** — not wired today. The script above is the suggested addition for whoever owns the night-shift orchestrator.

---

## Tracking ledger

Updated whenever a measurement happens. Append-only — never delete history.

| Date | Run ID | App | Raw KB | Gz KB | Δ vs prev | Notes |
|---|---|---|---:|---:|---|---|
| 2026-04-25 (est) | (pre-revamp) | admin-console | ~2,800 | ~700 | — | with PrimeNG |
| 2026-05-09 | revamp-v3.1 | admin-console | 2,253 | 568 | −547 raw | pre-Wave-8 |
| 2026-05-10 | wave-pr-8 | admin-console | **1,210** | **335** | **−1,043 raw / −233 gz** | post-PrimeNG removal |
| 2026-05-09 | revamp-v3.1 | host-shell | _logged but not exact_ | _logged_ | −55% / −56% | per memory |
| 2026-05-09 | revamp-v3.1 | management-console | _logged but not exact_ | _logged_ | −33% / −42% | per memory |
| 2026-05-16 | (today, post-do-all-5) | — | — | — | _to measure_ | First Tier 4 baseline |

---

## Bundle composition (admin-console, current)

Per memory: `~11 MB raw / ~3 MB gz removed across all 3` during the v3.1 night shift. The biggest contributors that ARE still in the bundle:

| Library | Estimated weight | Justification |
|---|---:|---|
| @angular/core + @angular/common + @angular/router | ~200 KB raw | unavoidable, shared singleton |
| RxJS (^7.8.1) | ~30 KB raw | shared singleton |
| @falcon (workspace ui-core + theme + i18n + sdk) | ~150-200 KB raw | the Falcon library itself |
| jwt-decode (^3.1.2) | ~5 KB raw | tiny, but essential for token parsing |
| business logic + features | rest | varies per app |

**Not present (deliberately removed):**
- PrimeNG (was ~500-700 KB) — gone since Wave 8
- @primeuix/themes — gone
- primeicons — gone (replaced with vendored Falcon icon font)
- oidc-client-ts / angular-auth-oidc-client — never installed (Identity Service fronts auth)
- NgRx — never installed (signals + services + facades)

---

## Regressions to watch for

### Likely causes of regression

1. **A new lib added without lazy boundary** — features should be `loadComponent` not eager imports
2. **A heavy dep added without tree-shaking** — moment.js, lodash full, full Material packs
3. **Image assets in `assets/` not optimized** — SVGs > 50 KB, PNGs without compression
4. **Translation files bundled instead of lazy-loaded** — i18n catalogs in `assets/i18n/*.json`
5. **PrimeNG attempted reintroduction** — ESLint flat-block should catch this immediately

### How the night-shift catches it

When the night-shift script gains the bundle-size step (proposed above), violations could be:

- 🔴 hard limit exceeded → log to morning briefing as HIGH severity
- 🟠 soft target exceeded → log as MEDIUM
- 🟢 within both → just record in ledger

---

## Related historical wins to celebrate

Per memory `project_falcon_revamp_v3_1_night_shift_results`:

- **17 waves landed** across 3 phases in one night shift
- Angular **20.3.12 → 21.2.9** + zoneless on all 3 apps
- PrimeNG ESLint locked down
- 2 new Falcon components (menu, drawer)
- RemoteManifestProvider abstraction
- **~11 MB raw / ~3 MB gz removed across all 3** apps
- ESLint carve-outs cut from 5 → 1
- 35 Falcon Angular wrappers in barrel

That's the kind of win the budget tracker should make visible going forward.

---

## How to extend this tracker

When a new app is added:

1. Append to "Current baselines" with placeholder rows
2. Run a one-off build and fill in the numbers
3. Set proposed budgets (hard + soft)
4. Update the night-shift script to include the new app
5. Append to the tracking ledger on every run

When a build optimization lands:

1. Run a one-off build to capture the new baseline
2. Append to the tracking ledger with the Δ
3. Tag the commit that produced the win in the "Run ID" column

---

## Open decisions

- **D-2026-05-16-NEW-21** — Should we lock in the proposed hard limits (1,500 KB raw / 400 KB gz for admin-console)?
- **D-2026-05-16-NEW-22** — Should the night-shift orchestrator gain a build step? Adds ~5-10 min per app per run.
- **D-2026-05-16-NEW-23** — Should we add a bundle-analyzer step (visualize sourcemap) to the audit?

---

## Related

- [FRONTEND_KNOWLEDGE_PATH](../FRONTEND_KNOWLEDGE_PATH.md)
- [ADR-001](../decisions/ADR-001-falcon-library-over-primeng.md) — the PrimeNG-removal win
- [ADR-003](../decisions/ADR-003-module-federation-three-apps.md) — Module Federation enables per-app budgets
- Memory: `project_falcon_revamp_v3_1_night_shift_results.md`
- Memory: `project_falcon_primeng_total_removal_complete.md`
- [[Decisions Queue]]

## Tags

#type/perf-budget #frontend #budget-tracking #tier-4 #continuous
