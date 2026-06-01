---
name: frontend-skills-installed
description: External Front-End skills installed under brain-skills/Front-End-skills/ — registry of what's there and how each is wired into the brain banner
type: reference
originSessionId: 98cf4816-3d55-4d97-8437-0aa3f7c9cbe3
---
External skills installed under `C:\falcon\brain-skills\Front-End-skills\` and registered in the brain banner via `C:\falcon\Brain\scripts\show-banner.ps1`.

| Folder | Source | SKILL.md location | Registry key |
|---|---|---|---|
| `polish-skill/` | github.com/pbakaus/impeccable (customized — has personas/cognitive-load extras) | `polish-skill/Skill.md` | `polish` |
| `emil-design-eng-skill/` | Emil Kowalski design-eng | `Skill.md` | `design-eng` |
| `noor-instructions-skill/` | internal (always-on Admin Console rules) | `Skill.md` | `noor-instructions` |
| `ui-ux-pro-max-skill/` | github.com/nextlevelbuilder/ui-ux-pro-max-skill (v2.5.0) | `.claude/skills/ui-ux-pro-max/SKILL.md` | `ui-ux-pro-max` |
| `caveman-skill/` | github.com/juliusbrussee/caveman | `skills/caveman/SKILL.md` | `caveman` |

**ui-ux-pro-max** ships its own bonus skills under `.claude/skills/` (banner-design, brand, design, design-system, slides, ui-styling). Those auto-register with Claude Code because of the `.claude/skills/` convention. They are NOT listed in the brain banner; only `ui-ux-pro-max` is. If they ever pollute, rename the inner `.claude` folder to neutralize auto-discovery.

**caveman** is a token-compression communication style, not a UI skill. Lives in Front-End-skills folder for catalogue convenience only. Triggers: `caveman mode`, `/caveman [lite|full|ultra]`. Disable: `stop caveman` / `normal mode`.

**pbakaus/impeccable was already installed** as `polish-skill/` before 2026-05-07 (from earlier `/polish` skill rename). Do NOT re-clone over it — it has Falcon-specific extras (personas.md, cognitive-load.md, heuristics-scoring.md).

When adding more external skills here:
1. Clone into `brain-skills/Front-End-skills/<name>-skill/`
2. Delete the cloned `.git` folder (avoid nested repo)
3. Add a registry entry to `$skillFiles` and a layout entry to `$R` (FRONT-END section) in `Brain\scripts\show-banner.ps1`
4. Add a bullet under the "Front-End skills available" section in `C:\falcon\CLAUDE.md`
5. Run `& C:\falcon\Brain\scripts\show-banner.ps1` to confirm the count goes up by 1 and the new skill renders green
