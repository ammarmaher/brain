*** Skill: visual-source-of-truth-analysis ***
*** Re-score a page plan against actual screenshots + HTML + React reference ***

# Visual Source-of-Truth Analysis Skill

| Meta | Value |
|---|---|
| **Skill name** | `visual-source-of-truth-analysis` |
| **Version** | v1.0 |
| **Last updated** | 2026-05-16 |
| **Category** | `code-skills` |
| **Owner** | Adnan (Orchestrator) |
| **Status** | 🟢 Active |
| **Strategy root** | `C:\Falcon\Source_of_truth_theme\` (when source is provided) |

## Quick reference

| Aspect | Value |
|---|---|
| **Triggers** | `analyze screenshots for <page>`, `deep visual analysis of <page>`, `re-analyze with source of truth`, `screenshot-ground <page> plan`, `re-score <page> against source` |
| **Scope** | Any page where (a) screenshots, (b) HTML reference, and (c) React/source reference exist |
| **Required inputs** | At least 1 of: screenshots folder, HTML file, React/source code. Optimal: all three. |
| **Output contract** | Obsidian deep-analysis note + boss-facing PDF v3+ + Brain SK commit + before/after delta table |
| **Confidence gate** | The skill MUST produce ≥10 specific corrections OR explicitly confirm zero drift |
| **Build gates** | None (analysis only, no code) |
| **Sound** | descending 5-step learning arpeggio `[1400,180; 1200,180; 1000,180; 800,180; 600,300]` (= "the Brain learned") |

## Purpose

When the user has a prior plan (e.g., `15-IMPLEMENTATION_PLAN.md`) built on Brain knowledge alone, this skill validates that plan against the visual + code source of truth. It produces a HONEST delta — usually a drop in confidence — because real sources surface scope the plan missed.

The skill exists because the v1 Brain Coverage Report for Add Client claimed 94% readiness; after analyzing 7 screenshots + 1,767 lines of React/CSS, it dropped to 78%. The drop is the right answer.

## When to invoke

| Situation | Invoke this skill? |
|---|---|
| User just gave you screenshots of a page | ✅ Yes |
| User pointed you at a React/HTML reference | ✅ Yes |
| User asked "re-analyze" or "are you sure?" | ✅ Yes |
| User asked "what would change if we had the design?" | ✅ Yes |
| You only have the plan, no visual/source evidence | ❌ No — request evidence first |

## 5-Phase Methodology

### Phase 1 — Gather (5-10 min)

1. Confirm sources exist on disk: screenshots folder, HTML, React source
2. List every file
3. Note which screenshots map to which page step
4. Verify the React `addclient.jsx`-style component file exists for the target page
5. If any source is missing, request it before continuing

**Output:** source manifest with file paths and sizes

### Phase 2 — Visual Extract (15-30 min per screenshot)

For each screenshot:

1. Use the Read tool with the PNG path (`mcp__computer-use` for desktop apps, or Read for files)
2. Enumerate every visible element:
   - Field name
   - Field type (text input · dropdown · radio · switch · etc.)
   - Required indicator (* asterisk)
   - Default value visible
   - Placeholder text
   - Disabled/read-only state
3. Note layout: grid columns, sidebar width, section dividers
4. Note interaction states visible: hover, error, disabled

**Output:** per-screenshot element table

### Phase 3 — Source Ground (20-40 min)

Read the React source line-by-line:

1. For each step component: `useState` initial values → confirms default values
2. For each `<input>`, `<select>`, `<textarea>`: confirms field type
3. For `disabled={...}` / `readOnly={...}`: confirms read-only fields
4. CSS `grid-template-columns` lines: confirms layout grid
5. Conditional rendering (`{visible && ...}`): confirms conditional behaviors
6. Modal/Dialog components: confirms separate flows

**Output:** ground-truth corrections — each as a `correction-card` with severity

### Phase 4 — Cross-Reference (10-20 min)

For each prior-plan assumption:

1. Search the plan markdown for the field name
2. Check the plan's stated component / behavior
3. If different from React reality → log a correction with severity:
   - 🔴 HIGH: field type differs (e.g., text vs dropdown), or major flow placement differs
   - 🟠 MED: cascade vs hardcoded, multi-select vs chip-input
   - 🟢 LOW: cosmetic differences (textarea vs input)

**Output:** correction log (4-15 typical, depending on page complexity)

### Phase 5 — Re-Score Honestly (10 min)

For each dimension (Backend, Frontend Infra, Validation Arch, Component Mapping, Wave Plan, Open Qs):

1. Reassess based on new evidence
2. Adjust the score (usually DOWN — that's healthy)
3. Compute weighted overall
4. Produce delta table: BEFORE vs AFTER vs Δ

**Output:** delta table + revised overall readiness %

## Deliverables

Every run of this skill produces:

| Artifact | Path | Purpose |
|---|---|---|
| **Obsidian note v2** | `falcon-wiki/00-MOCs/<page>-Deep-Analysis-v2.md` | Engineering reference |
| **Boss PDF v3+** | `C:/Falcon/Falcon Specs v3.<n> - <page> Deep Analysis.pdf` | Executive summary |
| **Brain SK mirror** | `Brain SK/outputs/reports/<page>-Deep-Analysis-v2.md` + `.pdf` | Version control |
| **Updated plan note** | Comment in original plan file saying v2 supersedes Section X | Plan freshness |
| **Brain SK commit** | "docs(deep-analysis): <page> v2 — N corrections, X→Y% readiness" | Audit trail |

## PDF Template Structure

The v3+ PDF MUST include:

1. **Cover** with BEFORE/AFTER delta banner (3-column: 94% → 78% = −16 pp)
2. **Executive summary** with KPI cards (Δ score, corrections, new components, new waves, validators, new risks)
3. **Methodology** (5 phases)
4. **Component confidence BEFORE vs AFTER** table
5. **N corrections** with severity-color cards
6. **Per-step deep dive** (1 page each): screenshot + field table + SMART validations
7. **Per-dialog deep dive** (1 page each)
8. **Revised wave plan** with delta column
9. **Risk register** (highlighting NEW risks)
10. **Brain skill** description
11. **Bottom line for boss** + endmark

## SMART Validation Format

Every validator MUST be specced in SMART form:

```
S - Specific: what condition
M - Measurable: regex, range, enum
A - Achievable: which existing validator covers it
R - Relevant: which backend rule it mirrors
T - Timely: live/on-blur/on-submit + debounce ms if async
```

## Confidence Scoring Rubric

Per component:

| Range | Meaning | Action |
|---|---|---|
| **95-100%** | Falcon library has it, confirmed by source | Use as-is |
| **80-94%** | Falcon library probably has it; verify prefix slot or variant | Verify before code |
| **60-79%** | Need to extend an existing Falcon component | Plan + estimate effort |
| **40-59%** | Build new — wrapper around existing primitives | Spec + build (4-8 h) |
| **<40%** | Build new — fresh component | Strategy doc + build (1-2 days) |

## Mandatory hard rules

1. **No code is written by this skill** — analysis only
2. **Numbers must DROP if reality is bigger than the plan** — never inflate
3. **Every correction has a severity** — no unrated corrections
4. **Source citations are mandatory** — `addclient.jsx:541` format for line refs
5. **PDF gets committed to Brain SK** — never just left on disk
6. **The user is the QA gate** — present findings, wait for confirmation before re-planning

## Skill Activation

When you see the trigger phrases:

```
1. Confirm sources exist (Phase 1)
2. Inspect every screenshot via Read tool (Phase 2)
3. Read React/HTML source line-by-line (Phase 3)
4. Cross-reference against prior plan (Phase 4)
5. Build delta table + revised score (Phase 5)
6. Generate Obsidian note v2
7. Generate boss PDF v3+
8. Commit to Brain SK
9. Report deltas to user with all citations
```

## Worked example

This skill was first applied to Add Client (2026-05-16):

- **Input:** 7 screenshots + 1,767 LoC React/CSS reference
- **Output:** 11 corrections (4 HIGH, 5 MED, 2 LOW), 6 new components discovered, 94% → 78% honest drop
- **Artifacts:** `Falcon Specs v3.0 - Add Client Deep Analysis.pdf` (2.94 MB) + `Add-Client-Deep-Analysis-v2.md` (Obsidian)
- **Brain SK commit:** `docs(deep-analysis): Add Client v2 ...`

## Related

- `Falcon Component Creation Skill` — if a NEW component needs building after analysis
- `15-IMPLEMENTATION_PLAN.md` (Add Client) — example prior plan
- `Add-Client-Brain-Coverage-Report.md` — example v1 (pre-analysis)
- `Add-Client-Deep-Analysis-v2.md` — example v2 (post-analysis)

## Tags

#skill #code-skills #visual-analysis #source-of-truth #honest-rescoring #before-after #pdf-output
