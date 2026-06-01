---
type: moc
role: cluster-index
cluster: validation-rules
updated: 2026-05-14
---

> [!tldr]
> Projection cluster for per-page validation rules. Each page projection in `20-Pages/` transcludes its `VALIDATION_RULES.md` from Brain Outputs. This MOC indexes them all in one place.

# Validation Rules

## All pages with validation rules (projected from Brain Outputs)

```dataview
TABLE WITHOUT ID
  file.link as "Page",
  projection-source as "Canonical source"
FROM "20-Pages"
WHERE type = "page"
SORT file.name ASC
```

## How this works
Each page's `Brain Outputs/understanding/pages/<page>/VALIDATION_RULES.md` is transcluded inside the page projection note. Open the page note (e.g. `20-Pages/Organization-Hierarchy.md`) and scroll to the `### VALIDATION_RULES` section to read the canonical content live.

## Refresh
Validation rules change when Brain SK's `validation-rules` skill runs. Re-run the scanner to refresh the projection:
```powershell
powershell -ExecutionPolicy Bypass -File .\scan-brain-outputs.ps1
```

## Source of truth
- Skill: `_mounts/brain-sk/skills/validation-rules/SKILL.md`
- Output: `_mounts/brain-outputs/understanding/pages/<page>/VALIDATION_RULES.md`
