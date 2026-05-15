---
name: visual-difference-qa
description: Alias entry point — routes every "visual difference QA" request to the Falcon Eyes skill, which is the semantic analysis layer over source-vs-destination screenshots.
---

*** Brain SK Frontend — Visual Difference QA (alias) ***
*** Path: domains/frontend/visual-difference-qa/SKILL.md ***
*** Created: 2026-05-15 ***

# Visual Difference QA — alias to Falcon Eyes

> This skill is an **alias**. Every request for visual difference QA is routed to **Falcon Eyes**, the semantic visual difference QA skill.

## Why an alias exists

Ammar often says things like:

- "do a visual diff between source and destination"
- "check visual difference QA on this page"
- "run a visual diff before fixing"
- "diff these two screenshots"

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

1. Capture source.
2. Capture destination.
3. Pixelmatch + diff PNG per section.
4. Semantic mismatch backlog.
5. Falcon component mapping.
6. Tailwind / token / template / slot / upgrade repair plan.
7. Section scorecard + overall visual parity %.
8. STOP — repair is a separate task.

## Hard rules

- Do not duplicate the Falcon Eyes contract here. Read `domains/frontend/falcon-eyes/SKILL.md` for the full specification.
- Reports always land at `C:\Falcon\Brain Outputs\reports\falcon-eyes\<YYYY-MM-DD-HHmm>\`.
- Falcon component-first, dynamic-customization order, Tailwind + tokens only — see Falcon Eyes.

## See also

- [`falcon-eyes/SKILL.md`](../falcon-eyes/SKILL.md) — canonical skill
- [`visual-parity/SKILL.md`](../visual-parity/SKILL.md) — sibling alias
- `_obsidian/VISUAL_QA_INDEX.md` — Obsidian visual QA index
