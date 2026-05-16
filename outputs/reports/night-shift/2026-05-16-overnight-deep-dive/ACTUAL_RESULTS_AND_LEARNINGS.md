---
type: actual-results
runId: post-do-all-5
baselineRunId: night-shift-2026-05-16-overnight
generatedAt: 2026-05-16T08:13:00+03:00
---

*** Actual results — "do all 5" morning batch ***
*** Real numbers, real learnings, real next steps ***

# 📊 Actual Results — "do all 5"

> Projected −82 violations (−30%). Actual: **−13 on web-platform-ui + 13 backend false positives suppressed by Item 1 = ~−26 platform-wide (−9%).** Smaller than projected — but the **compounding wins** (audit accuracy, AST signal, blocker registry) more than compensate.

## Headline numbers

| Layer | Baseline | Actual post-morning | Delta |
|---|---:|---:|---:|
| **falcon-web-platform-ui** | 249 | **236** | **−13** |
| Backend repos (R-BE-006 + R-BE-007 false positives, suppressed by Item 1 glob fix) | 26 | **~13** | **−13** |
| Other backend repos (unchanged) | 0 | 0 | 0 |
| **Platform total** | **275** | **~249** | **~−26 (−9%)** |

(Note: the −10 on R-FE-012 in the per-rule table is a counting artifact — that rule emits 1 FYI per target repo, so 1-repo run = 1 hit, 11-repo run = 11 hits. Not a real reduction.)

## Per-rule delta (web-platform-ui)

| Rule | Baseline | Post | Delta | What Item touched it |
|---|---:|---:|---:|---|
| R-NOOR-003 typography | 146 | 146 | **0** ⚠️ | Item 2 — see "Critical learning" below |
| R-FE-002 SCSS / styles array | 44 | 35 | **−9** | Item 4 — 5 SCSS files deleted, plus styles arrays emptied in their components |
| R-NOOR-005 palette | 24 | 24 | 0 | not targeted this round |
| R-FE-009 folder structure | 20 | 17 | **−3** | structural shift from SCSS removals |
| R-NOOR-007 i18n/RTL | 11 | 10 | **−1** | Item 3 — only 2 actual hits, both fixed; rest were already migrated in prior waves |
| R-NOOR-008 global selectors | 2 | 2 | 0 | not targeted |
| R-NOOR-001 layout ownership | 1 | 1 | 0 | not targeted |
| R-FE-012 build green FYI | 11 | 1 | 0 (artifact) | counting only |

## ⚠️ Critical learning — R-NOOR-003 doesn't drop after token migration

Item 2 migrated the killshot file from `text-[15px]` / `text-[13px]` / `text-[12px]` arbitrary-value classes to **token-backed `text-base` / `text-sm` / `text-xs` utilities**. By every reasonable measure that's a real improvement. **But the audit still flags those 5 lines.**

**Root cause:** R-NOOR-003 says "only documented type tokens allowed" and the rule expects `text-noor-*` prefixed utilities. The workspace **does NOT have `text-noor-*` tokens** — only the standard `text-{xs,sm,base,…}` utilities backed by `--text-*` CSS variables in the canonical theme.

So the rule as currently written is **misaligned with workspace reality**. Two options:

| Option | Effort | Outcome |
|---|---|---|
| **A. Update R-NOOR-003** to accept `text-{xs,sm,base,lg,xl,2xl,3xl,4xl,5xl,display}` as token-backed utilities | 5 min | Killshot file goes from 5 violations to 0. R-NOOR-003 platform count likely drops from 146 → ~40 (only arbitrary `text-[Npx]` remains) |
| **B. Create the `text-noor-*` token scale** in the canonical theme | 1-2 h | Workspace gains a new typography vocabulary; existing `text-*` usages also need migration eventually. Bigger architectural change. |

**Recommended:** A. Item 2's migration is correct *engineering* — the rule should be amended to match.

This adds **D-2026-05-16-06** to the Decisions Queue.

## What Ammar actually shipped (confirmed solid)

| File | Action | Build |
|---|---|---|
| `apps/admin-console/.../org-hierarchy-page-menu.component.html` | 5 `text-[Npx]` → token utilities | green |
| `apps/admin-console/.../client-service-row-table.component.html` | `left-[18px]/left-px` → `start-[18px]/start-px` (RTL-correct) | green |
| `apps/host-shell/.../layout/components/topbar/topbar.component.{ts,scss}` | SCSS deleted, styles → template Tailwind | green |
| `apps/host-shell/.../layout/components/sidebar/sidebar.component.{ts,scss}` | SCSS deleted, styles → template Tailwind | green |
| `apps/host-shell/.../features/not-found/not-found.component.{html,ts,scss}` | SCSS deleted, styles → template Tailwind | green |
| `libs/falcon/.../falcon-form-field/falcon-form-field.component.{html,ts,scss}` | SCSS deleted, styles → template Tailwind | green |
| `libs/falcon/.../falcon-mobile-number/falcon-mobile-number.component.{ts,scss}` | SCSS deleted, styles → template Tailwind | green |

**Total: 15 file changes (10 modified + 5 deleted), all 3 apps build green at every step.**

## What Ammar correctly **refused to migrate** (13 blockers documented)

The brief said "If a file can't migrate without breaking design intent, document and skip." Ammar honored this. The 13 documented blockers are at:

```
C:\Falcon\Falcon\falcon-web-platform-ui\scratch\PATTERN-04-blockers.md
```

Blocker categories:

| Category | Files | Why it can't migrate without theme-curator pass |
|---|---|---|
| SCSS `$variables` | 7 (host-shell auth flow, dashboard) | SCSS-only syntax; needs CSS custom property expansion first |
| `::-webkit-scrollbar` pseudo-elements | 2 (layout, falcon-tree-panel) | No Tailwind variant for vendor pseudo-elements |
| `::ng-deep` deep selectors | 2 (falcon-multiselect, falcon-tree-panel) | Tailwind can't pierce component encapsulation |
| `@keyframes` animations | 3 (enter-otp, falcon-tree-node, falcon-stepper) | No utility for keyframe definitions |
| `:host(.modifier)` selectors | 1 (falcon-photo-uploader drag-over) | Host modifiers can't live in templates |
| `--login-*` / `--cp-*` / `--fpf-*` domain CSS vars | 4 (auth flow) | Theme curator must promote first |

These are the next theme-curator pass — a multi-hour architectural task, not a one-morning sweep.

## Compounding wins (NOT in raw count)

Even though raw delta is −26 platform-wide, **the audit's effective power roughly doubled this morning**:

1. **Glob fix permanent** — `**/Tests/**` exemption now works correctly for every rule, forever. Compounds across all 39 rules.
2. **AST runners LIVE** — 4 new rule categories of detection unlocked (R-FE-007 / R-BE-002 / R-BE-004 / R-BE-008). Next audit will surface architectural drift the morning audit was blind to.
3. **PATTERN-04 blocker registry** — 13 files with detailed blocker reasoning. The theme-curator pass has its full backlog ready.
4. **Killshot pattern proven** — arbitrary-value typography → token utilities works mechanically. After the R-NOOR-003 rule amendment (Option A above), the same recipe can sweep 100+ more files.
5. **Test-file noise eliminated** — 13 false positives gone. Backend audits become trustworthy.
6. **Rule-vs-reality misalignment surfaced** — the R-NOOR-003 noor-* token gap was hidden until the engineering work exposed it.

## Updated burndown (factual)

```
Platform baseline:                       275
  Item 1 glob fix (backend):           −13   → 262
  Items 2-3-4 (web-platform-ui):       −13   → 249
  Item 5 AST adds (next run):       +0..15   → ~249 to 264

Actual platform now:               ~249 (-9% net)
Next AST run will resettle:        ~249-264 depending on findings
```

## What this means for tomorrow's plan

The morning's most valuable output is **the corrected target list**. Instead of "do all 5 again", the real next steps are:

### Tier 0 — Free wins (~10 min combined)

1. **Amend R-NOOR-003** to accept standard `text-{xs..5xl}` utilities (decision D-2026-05-16-06) — instantly cleans up 100+ violations that ARE genuine improvements.
2. **Run the AST audit** properly against all 11 repos to surface the new detection categories.

### Tier 1 — Pattern sweep using proven recipe (~3-4 h)

3. **Mega-sweep the remaining R-NOOR-003 arbitrary-value typography** across admin-console using Item 2's recipe — this should clear 30-40 violations.

### Tier 2 — Theme-curator pass (~half-day task)

4. **Theme-curator review** of the 13 PATTERN-04 blockers — promote domain CSS variables (`--login-*`, `--cp-*`, `--fpf-*`) into the canonical theme + add `text-noor-*` token scale + define utility-friendly scrollbar variants.

### Tier 3 — Continued cleanup (~2 days)

5. **R-NOOR-005 palette migration** (24 violations) — mechanical.
6. **R-FE-009 folder structure** (17 violations) — mechanical.
7. **Item-5 AST follow-ups** — architectural reviews for whatever the new detectors surface.

## Open commit decision

Ammar's 15 file changes to `falcon-web-platform-ui` are **uncommitted on branch `polishing-v0.4`**. All builds green. They include:

- 10 modified files
- 5 deleted SCSS files

**Recommended:** commit + push. The migration pattern is sound; refusing it because the rule has a misalignment would be silly. The rule should adapt to the reality, not the other way around.

But this requires your **explicit "commit"** per the no-commit-without-permission rule.

## Decisions Queue updates

Add these rows:

- **D-2026-05-16-06** — Amend R-NOOR-003 to accept standard `text-{xs..5xl}` token utilities (10 min, unlocks 100+ violation cleanup)
- **D-2026-05-16-07** — Commit Ammar's 15-file change set to `polishing-v0.4` branch? (1 min decision)
- **D-2026-05-16-08** — Schedule the theme-curator pass for the 13 PATTERN-04 blockers? (theme-curator engagement)

## Related

- [BURNDOWN_COMPUTATION.md](BURNDOWN_COMPUTATION.md) — the projected math (now revised by this file's actuals)
- [AGENT-WEB-EXECUTION-REPORT.md](AGENT-WEB-EXECUTION-REPORT.md) — Ammar's full step-by-step
- [PATTERN-04 blockers](file:///C:/Falcon/Falcon/falcon-web-platform-ui/scratch/PATTERN-04-blockers.md) — the next-pass backlog
- [Decisions Queue](../../../../Brain%20SK/_obsidian/00-Home/Decisions%20Queue.md)

## Lesson learned

Projection >> execution because:
- Per-file plans counted ALL rule hits, not the targeted rule's hits
- Some rules had already been mostly cleaned up in prior night-shift waves
- Rule definitions and workspace reality drifted (the noor-* token issue)

**Going forward**: always run a focused single-rule audit BEFORE briefing the agent, to confirm the rule actually fires against the file with the expected count. This was the only meaningful gap in the morning workflow.
