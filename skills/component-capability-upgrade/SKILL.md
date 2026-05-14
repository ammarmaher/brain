---
name: component-capability-upgrade
description: Scan Falcon UI components, document them with verified deltas + auto-incrementing understanding scores driven by user page-level approval, and prevent recurrence of known library bugs via a consulted bugs catalog. Upgrade shared components instead of page-specific hacks.
---

# component-capability-upgrade

## Purpose

Maintain a single source of truth for Falcon UI library understanding so:
1. Every change to a Falcon component is captured with a `before → after` delta.
2. The brain never repeats a previously-discovered bug (the bugs catalog is consulted before any edit).
3. Confidence in the component is tracked numerically (0-100) and **auto-promoted to 100% when the user approves the page** that uses the component — no per-component asks needed.

## Two canonical files (registries — single source of truth)

| File | Role | Path |
|---|---|---|
| Components registry | Per-component contract + change history + understanding score + Used-in-pages map | `C:\falcon\Brain SK\registries\FALCON_COMPONENT_REGISTRY.md` |
| Bugs & quirks catalog ("tautology") | Known library failures + verified workarounds, consulted BEFORE every edit | `C:\falcon\Brain SK\registries\FALCON_UI_BUGS_AND_QUIRKS.md` |

Per-session evidence (screenshots, diffs, build hashes) lives in `C:\falcon\Brain Outputs\reports\falcon-ui-library-learnings\<YYYY-MM-DD>-<task>\` and mirrors to `C:\falcon\Brain SK\outputs\` before any git push (per `protocols\GIT_AUTO_SYNC_GOVERNANCE.md`).

## Understanding score — auto-promote rule (Ammar's directive, 2026-05-14)

```
Score floor   = 0%  (component never touched)
Score after   = 60% (initial human-assigned baseline after first edit lands and verified live)
Score ceiling = 100% (auto-set when ALL three conditions met)

AUTO-PROMOTE TO 100% RULE
─────────────────────────
IF   user approves the page (via any trigger phrase below)
AND  component is listed under that page in "Used in pages"
AND  no open comments on that component
THEN component.score := 100%
     log approval event with timestamp in component's history
```

### Trigger phrases that count as "page approved"
- "approve the page" / "page approved" / "page is approved"
- "approve all on <page-name>"
- "looks good, no comments" / "no comments, ship it"
- "done, perfect" / "perfect, move on"
- "approve `<component-name>`" (single-component approval — bumps only that one)

### What blocks auto-promotion
- Any open comment on the component (logged under `Open comments` field)
- Component is not actually used in the approved page
- User says "approve except for X" — X stays at current score

### Score never auto-decreases
- If a regression is later discovered, the score drops only on explicit user instruction OR when verified-live regression check fails

## Workflow — every component change

```
1. READ bugs catalog (FALCON_UI_BUGS_AND_QUIRKS.md) for the component
   ↓ avoid repeating known failures
2. READ component entry (FALCON_COMPONENT_REGISTRY.md) for prior state + Used-in-pages
   ↓
3. Make the code edit
   ↓
4. nx build (must be GREEN)
   ↓
5. Live reload in browser
   ↓
6. Visual + measurement verification (compare to user's screenshot intent)
   ↓
7. Side-effects check (related components still work)
   ↓
8. Update component entry:
   - Append change to history
   - Add page to "Used in pages" if new
   - Score stays at current value (NO ASKING)
   ↓
9. Write per-session evidence to Brain Outputs\reports\...\
   ↓
10. REPORT to user the change result. Do NOT ask for a score.
   ↓
11. WAIT for page-level approval trigger phrase.
   ↓
12. On trigger phrase → for each component on the approved page:
      - If no open comments → score := 100%
      - Else → score unchanged, comments stay open
   ↓
13. PER APPROVAL LEARNING GATE — registry entry moves PENDING → APPROVED
14. On approval → mirror to Brain SK\outputs\ → git auto-sync
```

## Hard rules

- **DO NOT ask for a score per change.** Scores auto-promote on page-level approval signals.
- **Bugs catalog consultation is mandatory.** Before touching any component listed in the registry, the assistant must grep the bugs catalog for that component's selector.
- **Verify live before reporting.** Never write a report claiming a fix works without browser confirmation.
- **No regression silently introduced.** Side-effects check must include related components.
- **Approval Learning Gate** — registry promotion only after explicit user approval. Until then, entries are PENDING.
- **Source of Truth Priority** still applies (Wiki → Backend → PRD → Code → Falcon registries → HTML/React → assumptions).
- **Used-in-pages map is authoritative** — auto-promotion only fires for components actually mapped to the approved page.

## Required outputs per task

- Updated `FALCON_COMPONENT_REGISTRY.md` entry for each touched component (delta history + Used-in-pages).
- Updated `FALCON_UI_BUGS_AND_QUIRKS.md` if any new bug/quirk was discovered.
- Per-session report under `Brain Outputs\reports\falcon-ui-library-learnings\<YYYY-MM-DD>-<task>\`.
- Updated scan metadata.
- Auto-sync after approval (per `protocols\GIT_AUTO_SYNC_GOVERNANCE.md`).
- **Page-level scorecard update** (if the touched component is mapped to a page registry — see "Page-level layer" below).

---

# Page-level layer (Ammar's directive, 2026-05-14)

In addition to component knowledge, this skill maintains a **page-level understanding registry** that scores each page across 4 dimensions.

## Page registry location

```
C:\Falcon\Brain Outputs\understanding\pages\<page-name>\
├── PAGE_OVERVIEW.md
├── SOURCE_OF_TRUTH.md
├── PAGE_RULE_REGISTRY.md
├── UI_UX_RULES.md
├── BUSINESS_RULES.md
├── VALIDATION_RULES.md
├── GAP_REGISTRY.md
├── SOURCE_DESTINATION_COMPARISON.md
├── COMPONENT_MAPPING.md
├── VISUAL_PARITY_SCORECARD.md
├── IMPLEMENTATION_SCORECARD.md
├── PAGE_SCORECARD.md
├── CHANGE_HISTORY.md
├── NEXT_ACTIONS.md
└── _scan-state\
    └── page-scan-metadata.json
```

First page registered: `organization-hierarchy` (2026-05-14, initial baseline 16%).

## Four dimensions + weights

| Dimension | Weight | Granularity | File |
|---|---|---|---|
| UI / UX | 0.35 | element/section level | `UI_UX_RULES.md` |
| Business | 0.25 | feature/flow level | `BUSINESS_RULES.md` |
| Validation | 0.20 | field/flow level | `VALIDATION_RULES.md` |
| Gaps Resolved | 0.20 | decision level | `GAP_REGISTRY.md` |

**Formula:** `Page % = (UIUX × 0.35) + (Business × 0.25) + (Validation × 0.20) + (GapsResolved × 0.20)`

**NEEDS-ATTENTION flag:** any dimension below 60% triggers the flag regardless of total. Do not hide a weak dimension inside a high average.

## Rule status taxonomy (canonical, 7 states)

`applied | not_applied | applicable | not_applicable | partially_applied | unknown | blocked`

**Per-dimension formula:**
```
applied_count       = count(applied) + 0.5 × count(partially_applied)
not_applied_count   = count(not_applied) + 0.5 × count(partially_applied)
applicable_count    = count(applicable)
denominator         = applied_count + not_applied_count + applicable_count
                      (excludes not_applicable, unknown, blocked)

D_score = (applied_count / denominator) × 100 if denominator > 0 else 0
```

## Auxiliary scores (informational, do not roll into headline)

Track separately:
- `sourceUnderstandingPct`
- `destinationImplementationPct`
- `visualParityPct`
- `businessRuleCoveragePct`
- `validationCoveragePct`
- `gapResolutionPct`
- `componentReusePct`
- `testCoveragePct`

## Page-change workflow

```
1. READ existing PAGE_SCORECARD.md, GAP_REGISTRY.md, NEXT_ACTIONS.md for the affected page
   ↓
2. Read source-of-truth (HTML + React) for the section being changed
   ↓
3. Read destination Angular implementation
   ↓
4. Identify which rules in UI_UX/BUSINESS/VALIDATION/GAP_REGISTRY are impacted
   ↓
5. Make the code change
   ↓
6. Live verify (per component-level workflow)
   ↓
7. Update impacted rule statuses
   ↓
8. Recompute dimension scores → update PAGE_SCORECARD.md
   ↓
9. Update scan metadata _scan-state/page-scan-metadata.json
   ↓
10. Append to CHANGE_HISTORY.md
   ↓
11. WAIT for page-level approval trigger phrase
   ↓
12. On approval — promote PENDING → APPROVED + mirror + git auto-sync
```

## Incremental scan behavior (per Ammar 2026-05-14 spec)

On EVERY future page-related task:
1. Load page registry first.
2. Check if source truth changed (compare file mtime/hash against `_scan-state/page-scan-metadata.json`).
3. Check if Angular destination changed (git diff or mtime).
4. Check if related Falcon components changed (registry timestamps).
5. Re-evaluate ONLY impacted rules.
6. Update scores.
7. Update reports.
8. Update Obsidian links.
9. Mirror outputs to Brain SK outputs.
10. Commit and push safe changes (only after Ammar approves).

Do NOT re-analyze everything if nothing changed.

## Page-level approval rule

When Ammar approves a page (with any of the trigger phrases above):
- For each component listed in that page's `COMPONENT_MAPPING.md`:
  - If no open comments on that component → bump score to 100% in `FALCON_COMPONENT_REGISTRY.md`
- BUT: page % stays at the computed weighted average — page does NOT auto-go to 100% just from approval. It must EARN 100% via all 4 dimensions reaching 100%.
- Log the approval event in `PAGE_SCORECARD.md` history table + `_scan-state/page-scan-metadata.json` `approvalHistory[]`.
