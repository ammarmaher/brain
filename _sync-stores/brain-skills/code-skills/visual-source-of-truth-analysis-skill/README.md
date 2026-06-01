# Visual Source-of-Truth Analysis Skill

Re-score a page's implementation plan against actual screenshots + HTML + React reference. Produces a HONEST delta (usually a drop) because real sources surface scope the plan missed.

## Quickstart

```
analyze screenshots for Add Client
deep visual analysis of <page>
re-analyze with source of truth
```

## What it does

1. Gathers 3 sources of truth: screenshots, HTML, React reference
2. Visual-extracts every field/control from every screenshot
3. Reads React/HTML source line-by-line to confirm types + behaviors
4. Cross-references against the prior plan, logs corrections
5. Re-scores HONESTLY (numbers drop if reality is bigger)

## Output

- Obsidian deep-analysis note (`<page>-Deep-Analysis-v2.md`)
- Boss-facing PDF v3+ with embedded screenshots
- Brain SK commit + push
- Updated plan reference comments

## Hard rules

- No code, analysis only
- Numbers MUST drop if reality is bigger than the plan
- Every correction has a severity (HIGH/MED/LOW)
- Source citations are mandatory
- PDF goes to Brain SK, never just on disk

## Worked example

First applied to Add Client (2026-05-16): 94% → 78% with 11 corrections, 6 new components discovered.

See `Skill.md` for full methodology.
