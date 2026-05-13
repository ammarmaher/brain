*** Falcon Brain Skills — Business ***
*** Knowledge skills covering PRDs, domain vocabulary, module dossiers, test authoring ***

# Business Skills

Falcon agents load these skills for any business-analysis, PRD, module-knowledge, or test-case task.

## Skills in this category

| Skill | Purpose | Load when |
|---|---|---|
| [prd-knowledge](./prd-knowledge/Skill.md) | Sync + version PRDs from Drive | `take latest from PRD`, any spec question |
| [domain-glossary](./domain-glossary/Skill.md) | Lock Falcon vocabulary (En/Ar) | Any task using domain terms |
| [module-catalog](./module-catalog/Skill.md) | Per-module dossier (scope, surfaces, decisions) | Any module-scoped task |
| [test-case-authoring](./test-case-authoring/Skill.md) | PRD → Gherkin scenarios | `generate test cases for [module]` |

## Cross-skill flow

```
prd-knowledge ──feeds──> module-catalog ──feeds──> test-case-authoring
                              ^
domain-glossary ─constrains──/
```

## Sound signatures

Every business skill ends a successful operation with a unique PowerShell beep pattern. See [SOUNDS.md](../SOUNDS.md) for the full table.

## Reading order

1. `domain-glossary/Skill.md` — vocabulary baseline
2. The skill matching the current task
3. Cross-skill dependencies (per the flow above)

## Hard rules

- Never edit PRD files by hand — only via `prd-knowledge` sync
- Every term used in any artifact must exist in `domain-glossary`
- Every module dossier links back to its PRD + Wiki + code
- Every test case traces to ≥1 PRD requirement
