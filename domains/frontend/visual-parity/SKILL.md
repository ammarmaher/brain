---
name: visual-parity
description: Alias entry point — routes every "visual parity" request to the Falcon Eyes skill, which is the semantic analysis layer over source-vs-destination screenshots.
---

*** Brain SK Frontend — Visual Parity (alias) ***
*** Path: domains/frontend/visual-parity/SKILL.md ***
*** Created: 2026-05-15 ***

# Visual Parity — alias to Falcon Eyes

> This skill is an **alias**. Every request for visual parity diagnosis is routed to **Falcon Eyes**, the semantic visual difference QA skill.

## Why an alias exists

Ammar often says things like:

- "run visual parity on org-hierarchy-page"
- "what's the visual parity right now"
- "compare these two views for visual parity"
- "Night Shift visual repair — start with parity"

These all map to the same skill. The alias keeps the natural phrasing while keeping a single source of truth.

## Canonical skill

```text
C:\Falcon\Brain SK\domains\frontend\falcon-eyes\SKILL.md
```

## Tool

```text
C:\Falcon\Brain SK\tools\falcon-eyes\
```

## Process

Use the **exact** process documented in `domains/frontend/falcon-eyes/SKILL.md`:

1. Capture source + destination per named section.
2. Pixelmatch + diff PNG.
3. Semantic mismatch backlog (with Falcon component mapping).
4. Tailwind / token / template / slot / upgrade repair plan.
5. Section scorecard + overall visual parity %.
6. STOP — repair is a separate task.

## Scoring rule

- Average of completed section scores.
- Any **P0** caps total at **70 %**.
- Any **P1** caps affected section at **75 %**.
- Any **untested required section** stays below **60 %**.
- Minimum acceptable parity: **90 %**. Ideal: **95 %**.

When parity is below 90 %, Brain SK MUST run Falcon Eyes before suggesting any UI fix.

## Hard rules

- Do not duplicate the Falcon Eyes contract here. Read `domains/frontend/falcon-eyes/SKILL.md` for the full specification.
- Reports always land at `C:\Falcon\Brain Outputs\reports\falcon-eyes\<YYYY-MM-DD-HHmm>\`.
- Falcon component-first, dynamic-customization order, Tailwind + tokens only — see Falcon Eyes.

## See also

- [`falcon-eyes/SKILL.md`](../falcon-eyes/SKILL.md) — canonical skill
- [`visual-difference-qa/SKILL.md`](../visual-difference-qa/SKILL.md) — sibling alias
- `_obsidian/VISUAL_QA_INDEX.md` — Obsidian visual QA index
- `_obsidian/FALCON_EYES_INDEX.md` — Falcon Eyes Obsidian hub
