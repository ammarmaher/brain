*** Brain SK Obsidian — Visual QA Index ***
*** Path: _obsidian/VISUAL_QA_INDEX.md ***
*** Created: 2026-05-15 ***

# Visual QA Index

> Single entry point for everything visual-QA in Brain SK. The canonical skill is [[FALCON_EYES_INDEX|Falcon Eyes]] — every alias routes there.

## Skills

| Skill | Path | Role |
|---|---|---|
| **Falcon Eyes** (canonical) | [`domains/frontend/falcon-eyes/SKILL.md`](../domains/frontend/falcon-eyes/SKILL.md) | Semantic visual difference QA |
| Visual Difference QA (alias) | [`domains/frontend/visual-difference-qa/SKILL.md`](../domains/frontend/visual-difference-qa/SKILL.md) | Routes to Falcon Eyes |
| Visual Parity (alias) | [`domains/frontend/visual-parity/SKILL.md`](../domains/frontend/visual-parity/SKILL.md) | Routes to Falcon Eyes |
| Screenshot → Angular | [`skills/screenshot-to-angular/SKILL.md`](../skills/screenshot-to-angular/SKILL.md) | Screenshots as visual validation truth |

## Tool

- [`tools/falcon-eyes/README.md`](../tools/falcon-eyes/README.md)
- [`tools/falcon-eyes/capture-and-compare.ts`](../tools/falcon-eyes/capture-and-compare.ts)
- [`tools/falcon-eyes/compare-images.ts`](../tools/falcon-eyes/compare-images.ts)

## Reports root

```text
C:\Falcon\Brain Outputs\reports\falcon-eyes\<YYYY-MM-DD-HHmm>\
```

## Trigger phrases (auto-route to Falcon Eyes)

- screenshot comparison
- visual difference analysis
- visual parity diagnosis
- source-vs-destination UI comparison
- screenshot understanding
- *"why this table does not look like that table"*
- visual repair planning
- Night Shift visual repair
- Organization Hierarchy tabs visual repair

## Scoring rule

- Average of completed section scores.
- Any **P0** caps total at **70 %**.
- Any **P1** caps affected section at **75 %**.
- Any **untested required section** stays below **60 %**.
- Targets: **90 %** minimum, **95 %** ideal.

## Linked indexes

- [[FALCON_EYES_INDEX]]
- [[FRONTEND_INDEX]]
- [[PAGE_KNOWLEDGE_INDEX]]
- [[Frontend Components Index]]
- [[FALCON_COMPONENT_INDEX]]
- [[AMMAR_BRAIN_HOME]]
