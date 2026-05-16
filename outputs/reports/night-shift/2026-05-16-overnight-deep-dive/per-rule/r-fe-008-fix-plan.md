---
ruleId: R-FE-008
ruleName: Grid first — flexbox only for inline alignment
severity: should
violationCount: 52
estimatedEffort: medium
ammarAgent: ammar-web-platform-ui
runId: 2026-05-16-overnight-deep-dive
---

## 1. Rule restatement (1 sentence)

Tailwind CSS Grid is the default layout primitive for every page shell, section, form, card list, and data panel — flexbox is reserved for small inline alignment (icon+label, label+input, breadcrumb chips), and `flex-wrap` 2D layouts must be rewritten as `grid`.

## 2. What we found (counts + top 5 offender files)

Live grep on `C:\Falcon\Falcon\falcon-web-platform-ui\apps` (templates only):

| Detector pattern | Hits |
|---|---|
| `flex flex-col` (multi-row column stacks — typical 2D candidate) | 52 (17 files) |
| `flex-wrap` (multi-column wrapping — typical 2D candidate) | 13 (4 files) |
| `flex items-center gap-*` (inline alignment — typically allowed) | 39 (18 files) |
| Arbitrary `gap-[Npx]` (token-violation, surfaced under R-FE-004) | included in R-FE-004 audit |

**Net candidate violations: ~65 hits across ~21 files.** Each requires semantic-LLM verdict to classify as `OK_INLINE_ALIGNMENT`, `VIOLATION_TWO_DIMENSIONAL`, or `VIOLATION_ARBITRARY_GAP`.

Top 5 offender files (by `flex flex-col` + `flex-wrap` combined density):

1. `apps/admin-console/.../user-details/user-details-page.component.html` — 13 `flex flex-col` + 2 `flex-wrap` = 15 candidates (the largest 2D layout in the audit; almost certainly a page shell that should be `grid`)
2. `apps/admin-console/.../add-client-wizard/client-settings-step/client-settings-step.component.html` — 11 `flex flex-col` + 1 `flex-wrap` = 12 (wizard step likely needs `grid grid-cols-12`)
3. `apps/host-shell/src/app/playground/playground.page.html` — 8 `flex flex-col` (playground — defer)
4. `apps/admin-console/.../falcon-org-node-header.component.html` — 1 `flex flex-col` + 2 `flex-wrap` (compact card; verdict needed)
5. `apps/admin-console/.../org-hierarchy-page-menu.component.html` — 3 `flex flex-col` + 0 `flex-wrap`

Per app:
- admin-console: ~40 of 65 hits — concentrated in the org-hierarchy-page port
- host-shell: ~20 of 65 — playground + topbar/sidebar + auth flows
- management-console: minimal

## 3. Why this matters (the architectural cost of leaving it)

Per `feedback_tailwind_grid_first`: grid gives predictable 2D layouts, better responsive control via `grid-cols-{breakpoint}`, no `flex-wrap` gymnastics, and is easier to reason about at scale. The pattern matters most in admin-console where multi-thousand-row tables, dense forms, and tabbed dashboards live — flex-wrap card layouts there have been a recurring source of RTL breakage and breakpoint mis-alignment.

Specifically: `flex-wrap` cards in `falcon-org-node-header` are the kind of layout that drift on RTL (Cairo + IBM Plex Sans Arabic per `feedback_noor_instructions`). Grid is intrinsically RTL-symmetric; flex-wrap is not.

This rule is `severity: should`, so violations are not blockers — but they accumulate. Closing them now while we're auditing prevents the cleanup pass next quarter from doubling in size.

## 4. Fix plan — concrete steps the morning agent should follow

- **Step 1 — Build candidate inventory.** Run:
  ```
  rg -n -g '*.html' '\bflex\s+flex-col\b' apps > audit/r-fe-008-flex-col.txt
  rg -n -g '*.html' '\bflex-wrap\b' apps > audit/r-fe-008-flex-wrap.txt
  ```

- **Step 2 — Per-file verdict pass.** For each candidate, classify:
  - `OK_INLINE_ALIGNMENT` — single row, ≤3 children (icon+label, label+input, chip cluster). Skip.
  - `VIOLATION_TWO_DIMENSIONAL` — page shell, section, form, card grid, sidebar+content split. Refactor.
  - `VIOLATION_ARBITRARY_GAP` — `gap-[18px]` etc. Fixed by R-FE-004.

- **Step 3 — Rewrite the heaviest hitter first: `user-details-page.component.html`.** It has 13 `flex flex-col` + 2 `flex-wrap`. Decide the logical layout:
  - Two-column user info panel? → `grid grid-cols-[16rem_1fr] gap-6`
  - Vertical section stack? → `grid grid-cols-1 gap-6` (functionally identical to `flex flex-col gap-6` but conforms to rule)
  - Card grid? → `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`

  This file is the canonical example for the rest of the rewrites.

- **Step 4 — Rewrite `client-settings-step.component.html` next.** Form-shaped layout — almost certainly `grid grid-cols-12 gap-4` with `col-span-*` per field. Replaces 11 `flex flex-col` patterns with a single grid declaration.

- **Step 5 — Rewrite remaining admin-console offenders.** Sweep the org-hierarchy-page family.

- **Step 6 — Rewrite host-shell topbar/sidebar/auth.** Lower priority; many will be `OK_INLINE_ALIGNMENT` once analyzed.

- **Step 7 — Defer playground.page.html.** Mark with `<!-- noor:exempt-grid-first reason="demo-comparison" -->` or add to `EXEMPTIONS.md`.

- **Step 8 — If 3+ files share the same grid pattern, propose a named primitive.** Per the source feedback's recommendation: `FalconPageGrid`, `FalconFormGrid`, `FalconCardGrid`. File via R-FE-006 step 6.

- **Step 9 — Build verification + visual diff against Falcon Eyes baseline** (if available, otherwise manual smoke).

## 5. Estimated effort + complexity rationale

**medium** — 65 candidates, but most reduce to mechanical `flex flex-col` → `grid grid-cols-1` swaps (functionally identical, conforming). The non-trivial cases are the `flex-wrap` card layouts (~13 hits across 4 files) which require choosing the right `grid-cols-{breakpoint}-{n}` ladder. Realistic: 6–8 hours including visual diff.

## 6. Rollback hint (how to undo if the fix is wrong)

`git checkout HEAD -- <file>.html` reverts the grid rewrite per file. Since `flex flex-col` and `grid grid-cols-1` are visually identical when the column has no min-width drama, regressions are most likely in the `flex-wrap` → `grid grid-cols-{n}` cases — revert just those if the card grid stops wrapping correctly at a breakpoint.

## 7. Verification (how to confirm the fix worked)

- run command:
  ```
  cd C:\Falcon\Falcon\falcon-web-platform-ui
  # Expect a sharply reduced count, mostly OK_INLINE_ALIGNMENT survivors
  rg -n -g '*.html' '\bflex\s+flex-col\b' apps | Measure-Object | Select-Object -ExpandProperty Count
  rg -n -g '*.html' '\bflex-wrap\b' apps | Measure-Object | Select-Object -ExpandProperty Count
  UV_THREADPOOL_SIZE=128 npx nx build admin-console --configuration=development
  ```
- expected output:
  - `flex flex-col` count: <15 (only inline-alignment legit cases)
  - `flex-wrap` count: 0 (or only in playground if exempted)
  - Build: exit code 0

## 8. Risk flags (anything that could break)

- **`flex flex-col` → `grid grid-cols-1` is NOT always identical** when children have `flex-1`, `flex-grow`, or `flex-shrink-0` modifiers. Audit modifier usage before mechanical swap.
- **`flex-wrap` card layouts** that depend on intrinsic card width (`w-full md:w-1/2`) need re-expression as `grid-cols-{breakpoint}-{n}` — picking the wrong breakpoint set causes wrap-point regressions.
- **RTL parity** — re-test every refactored admin-console layout under `dir="rtl"`. Grid is intrinsically symmetric but the order of column children may visually flip; use `grid-template-areas` if explicit placement is needed.
- **Severity is `should`, not `must`** — don't rabbit-hole. If a file has 1 `flex flex-col` that's clearly OK_INLINE_ALIGNMENT, leave it.
- **The wizard step rewrite (`client-settings-step`)** is on the Add Client critical-path flow — coordinate with whoever owns that workstream.

## 9. Related rules (other rules that might overlap with this fix)

- **R-FE-004** — `gap-[18px]` arbitrary-value violations are technically R-FE-004's surface; fixing R-FE-008 layouts is a natural place to also fix the gap tokens
- **R-NOOR-001** — admin-console layout ownership: shell vs page vs component. Grid rewrites must respect that ownership split
- **R-NOOR-007** — RTL-safe layouts (logical properties); grid is intrinsically RTL-safe but explicit `ms-*` / `me-*` still matters inside cells
- **R-FE-001** — Tailwind utilities only; these refactors stay inside the Tailwind universe
