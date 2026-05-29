---
title: Aggregated Findings & Fix Plan
date: 2026-05-16
orchestrator: Adnan / Jakco
sources: 5 audit reports (A1 libs/falcon-ui-core, A2 admin-console, A3 host-shell, A4 management-console, A5 cross-cutting)
total_findings: ~1450 across all scopes (P0 + P1 + P2)
---

# Night Shift — Aggregation & Fix Plan

## Top-of-the-stack truths

1. **Token registry is 3,485 vars + 2,251 Tailwind class prefixes.** The audit ran against a complete picture.
2. **PrimeNG purge held.** Only 1 stale comment hit (cross-cutting CC2). Functional zero.
3. **Two large regressions surfaced:**
   - **A. Host-Shell auth flow** — 5 SCSS files (~1,720 lines), 163 phantom `--login-*` tokens, raw `<input>`/`<button>` bypassing Falcon library. **Multi-day rebuild — DEFER to scoped follow-up wave.**
   - **B. Admin-Console `otp-dialog.component.html`** — inline `<style>` block, 9 inline style attributes, 12 hardcoded font-sizes. **Single-file rebuild — DEFER to focused wave (too risky in a parallel batch).**
3. **One MEMORY misalignment surfaced:** `project_org_hierarchy_html_conversion` says 91 files in `apps/management-console/.../organization-hierarchy-page` — **disk reality: management-console has 11 files total; the active org-hierarchy work is in `apps/admin-console`** per `project_react_to_angular_org_hierarchy_page`. → Memory update queued.

## Findings by tier across all scopes

| Tier | libs/falcon-ui-core | admin-console | host-shell | management-console | cross-cutting |
|---|---|---|---|---|---|
| P0 | 91 unique / 114 sites | 19 | ~6 classes / ~30 sites | 1 | 40 SCSS+styleUrls |
| P1 | 996 | 47 | ~23 classes / ~230 sites | 0 | 13 lib-first + 22 inline-style |
| P2 | 7 | 30 | ~26 classes / ~100 sites | 3 | 152 total |

## Fix tiers (this Night Shift)

### Tier 0 — Critical safety (apply tonight)
- T0.1 `libs/falcon-ui-core/src/.../falcon-insufficient-balance-dialog-tw.tsx:308` — `z-[1000]` breaks portal ladder (sits below drawer/toast). Replace with canonical `z-falcon-overlay` (1400) or remove (let portal default win).
- T0.2 `libs/falcon-ui-tokens/src/components/organization-hierarchy.tokens.css` — `--falcon-org-hierarchy-ctx-menu-z-index: 9999` magic number. Replace with `var(--falcon-overlay-z-index)`.
- T0.3 `apps/host-shell/src/app/remote-route.service.ts` + `apps/host-shell/src/app/remote-config.ts` — dead duplicates (canonical copies at `app/core/services/`). Delete.
- T0.4 `apps/admin-console/src/.../components/falcon-status/` — dead code (replaced by `<falcon-angular-status-badge>` per Wave 19). Delete folder.
- T0.5 `apps/management-console/src/bootstrap.ts:28-32` — `console.log('ROUTER EVENT →', ev)` firehose + `: any` violation. Delete the router subscribe.

### Tier 1 — Token reality (apply tonight where safe)
- T1.1 `apps/admin-console/.../falcon-org-chart.component.html` — `var(--falcon-neutral-150|400|teal-700)` → `var(--color-falcon-neutral-150)` etc. (verify each exists in registry first).
- T1.2 `apps/admin-console/.../user-details-page.component.html` + `falcon-org-info-panel.component.html` — `bg-falcon-warning-*`, `text-falcon-success-*`, `text-falcon-danger-*`, `text-falcon-red-600` — DEFER (need either token additions or Noor-palette replacement; needs UX call on which intent maps to which shade).
- T1.3 `libs/falcon-ui-core/src/.../*-tw.tsx` files using `--falcon-status-danger/success` — DEFER (same as T1.2).

### Tier 2 — z-index canonicalization (apply tonight)
- T2.1 `apps/admin-console` 2 hits (`z-[5]`, `z-[2]`) — replace with canonical Tailwind `z-falcon-*` utilities.
- T2.2 `libs/falcon-ui-core` 11 hardcoded z-index hits (excluding T0.1 already covered) — case-by-case: replace with canonical or leave with `/* canonical ladder owner */` comment if load-bearing.
- T2.3 Cross-cutting "removable" 6 hits from A5 — replace each.

### Tier 3 — Safe cleanliness (apply tonight)
- T3.1 Remove redundant `standalone: true,` from all `.component.ts` / `.directive.ts` decorators (Angular v20+ default).
  - libs/falcon-ui-core: 63 sites
  - apps/admin-console: 27 sites
  - apps/management-console: 1 site (`bootstrap.ts`)
  - host-shell: TBD count
- T3.2 `apps/admin-console` 11 physical-direction Tailwind classes → logical (`pl-*`→`ps-*`, `pr-*`→`pe-*`, `ml-*`→`ms-*`, `mr-*`→`me-*`, `text-left`→`text-start`, `text-right`→`text-end`).
- T3.3 Remove A5 console.log residue (5 lib + ~27 app — surgical, skip if inside intentional debug guards).
- T3.4 `apps/management-console/src/bootstrap.ts:11` redundant `standalone: true`.

### Tier 4 — DEFER to scoped follow-up waves (document, don't fix tonight)
- **DEFER-1**: 871 `@Input/@Output` decorator → `input()/output()` codemod across libs/falcon-ui-core. Mechanical but high-volume; needs careful workspace-wide testing.
- **DEFER-2**: 40 SCSS / styleUrls migration to Tailwind utilities + shadow CSS. Includes:
  - `apps/admin-console/src/styles.scss` + `project.json` `inlineStyleLanguage: "scss"` removal.
  - `apps/management-console/src/styles.scss` + same.
  - 5 SCSS files in `apps/host-shell` auth feature.
  - 17 `styleUrls: [` Angular wrappers in libs/falcon-ui-core.
- **DEFER-3**: Host-Shell auth-flow rebuild (5 SCSS + 163 phantom tokens + raw inputs → Falcon library + tokens-only).
- **DEFER-4**: Admin-Console `otp-dialog.component.html` single-file rebuild (inline styles + hardcoded sizes).
- **DEFER-5**: 27 `standalone: true` removal in admin-console (covered in T3.1 — actually NOT deferring, applying).
- **DEFER-6**: Library-first GAP refactors (11 raw `<input>` + 1 raw toggle + hand-rolled topbar menu) — needs UX consultation per Falcon component coverage.

### Tier 5 — Obsidian write-back (apply tonight)
- Per-folder notes in `falcon-wiki/` capturing inventory + rules compliance + open GAPs.
- New gap notes for each DEFER-1..6.
- Memory update for the management-console org-hierarchy location misalignment.

## Fix-batch sequencing (parallel where non-overlapping)

```
BATCH-A (parallel):
  F1 → libs/falcon-ui-core  : T0.1, T0.2, T2.2, T3.1 (lib portion), T3.3 (lib portion)
  F2 → apps/admin-console   : T0.4, T1.1, T2.1, T3.1 (admin portion), T3.2, T3.3 (admin portion)
  F3 → apps/host-shell      : T0.3, T3.1 (host portion), T3.3 (host portion)
  F4 → apps/management-console : T0.5, T3.1 (mgmt portion), T3.4

BATCH-B (sequential, after BATCH-A):
  Build verify per app + lib
  If red → focused repair agent → repeat

BATCH-C (sequential):
  Obsidian write-back per folder
  Memory update
  Final report
```

## Standing rules (enforced)

- No commits / no pushes.
- Build must be green per app at the end.
- If a fix breaks a build, the fix agent must roll back rather than press on.
- Document every DEFER as a new gap note.

## Acceptance criteria for tonight

- All Tier 0 fixes landed and build-green.
- All Tier 1 SAFE fixes landed (T1.1).
- All Tier 2 fixes landed.
- All Tier 3 fixes landed.
- All Tier 4 items documented as gaps in `falcon-wiki/70-Gaps/`.
- Per-folder Obsidian notes written.
- Final master report at `REPORT.md`.
