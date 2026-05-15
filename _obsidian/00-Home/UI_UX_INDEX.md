*** UI/UX Index — graph hub ***
*** Updated 2026-05-15 ***

# UI/UX Index

> Brain Outputs holds the rules. This note holds the graph.

## Per-page UI/UX rule registries

| Page | UI/UX rules file | Approved count |
|---|---|---|
| organization-hierarchy | [UI_UX_RULES.md](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/UI_UX_RULES.md) | 32 rules (baseline) |

## Cross-cutting UI/UX rules

- Tailwind utilities only — no SCSS, no component CSS, no PrimeNG. (from [angular-tailwind skill](../../../brain-skills/Front-End-skills/angular-tailwind-skill/Skill.md))
- Falcon UI Core (`<falcon-*>`) is the only UI kit.
- Customization order: inputs → templates → slots → variants → upgrade → new component → wrapper → raw (GAP). See [[FALCON_COMPONENT_CUSTOMIZATION_PATTERN]] in [`outputs/understanding/frontend/patterns/`](../../outputs/understanding/frontend/patterns/FALCON_COMPONENT_CUSTOMIZATION_PATTERN.md).

## Related hubs

- [[PAGE_LEARNING_INDEX]] · [[COMPONENT_INDEX]] · [[APPROVED_PATTERNS_INDEX]] · [[GAPS_INDEX]] · [[FALCON_EYES_INDEX]]
