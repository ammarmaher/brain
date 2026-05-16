# LINKS — Falcon Component Creation Strategy

> Crosslinks from this strategy folder into the broader Falcon knowledge graph. Use these prefixes per the source-prefix rule in `C:\Falcon\CLAUDE.md`: `[VAULT]`, `[BRAIN-SK]`, `[BRAIN-OUT]`, `[MEMORY]`, `[CODE]`, `[SKILL]`, `[INFERRED]`.

## Obsidian vaults

| Prefix | Path | Purpose |
|---|---|---|
| `[VAULT]` | `C:\Falcon\falcon-wiki\30-Components\<component>.md` | Obsidian typed note per component — the canonical UI knowledge node. Created via the `new-component` Templater template |
| `[VAULT]` | `C:\Falcon\falcon-wiki\00-MOCs\AI-Agent-Onboarding.md` | Mandatory pre-read for any agent touching Falcon UI |
| `[VAULT]` | `C:\Falcon\falcon-wiki\Conventions.md` | File naming + frontmatter schema for vault notes |
| `[VAULT]` | `C:\Falcon\falcon-wiki\Glossary.md` | Domain vocabulary — resolve ambiguous term names FIRST |
| `[VAULT-BRAIN-SK]` | `C:\falcon\Brain SK\_obsidian\` | Brain SK Obsidian vault — secondary knowledge graph for Brain-specific notes |

## Brain SK registries

| Prefix | Path | Purpose |
|---|---|---|
| `[BRAIN-SK]` | `C:\falcon\Brain SK\registries\FALCON_COMPONENT_REGISTRY.md` | Component registry — append one row per new component (tag, status, render paths, wrapper class) |
| `[BRAIN-SK]` | `C:\falcon\Brain SK\registries\FALCON_UI_BUGS_AND_QUIRKS.md` | Bugs / quirks catalog — append any discovered quirk from a run |

## Brain Outputs

| Prefix | Path | Purpose |
|---|---|---|
| `[BRAIN-OUT]` | `C:\Falcon\Brain Outputs\understanding\frontend\FALCON_COMPONENT_REGISTRY.md` | Frontend understanding registry — keep in sync with Brain SK registry |
| `[BRAIN-OUT]` | `C:\Falcon\Brain Outputs\frontend-understanding\FALCON_WRAPPER_AND_RENDER_PATH_REPORT.md` | Canonical pattern report — the WHAT to this strategy's HOW |
| `[BRAIN-OUT]` | `C:\Falcon\Brain Outputs\component-registry\components\<component>\` | Per-component deep dossier — overview / props / events / slots / tokens / quirks |
| `[BRAIN-OUT]` | `C:\Falcon\Brain Outputs\strategies\falcon-component-creation\runs\<date>_<component>\` | Per-run execution evidence — plan, diff, score, lessons |

## Source code

| Prefix | Path | Purpose |
|---|---|---|
| `[CODE]` | `C:\Falcon\Falcon\falcon-web-platform-ui\libs\falcon-ui-core\` | Source repo — Stencil + Tailwind helpers + Angular wrapper |
| `[CODE]` | `C:\Falcon\Falcon\falcon-web-platform-ui\libs\falcon-ui-core\src\components\` | Stencil Shadow + Light components |
| `[CODE]` | `C:\Falcon\Falcon\falcon-web-platform-ui\libs\falcon-ui-core\src\angular-wrapper\components\` | Angular wrappers |
| `[CODE]` | `C:\Falcon\Falcon\falcon-web-platform-ui\libs\falcon-ui-core\src\tailwind\` | `falconXClasses()` helper modules |
| `[CODE]` | `C:\Falcon\Falcon\falcon-web-platform-ui\libs\falcon-ui-core\src\define-falcon-tw-component.ts` | Light-variant loader registry |
| `[CODE]` | `C:\Falcon\Falcon\falcon-web-platform-ui\libs\falcon-ui-core\stencil.config.ts` | Stencil output targets (Shadow / Light / React) |
| `[CODE]` | `C:\Falcon\Falcon\falcon-web-platform-ui\libs\falcon-ui-tokens\src\index.css` | Token barrel — import every per-component token file |
| `[CODE]` | `C:\Falcon\Falcon\falcon-web-platform-ui\libs\falcon-ui-tokens\src\components\` | Per-component token contracts |
| `[CODE]` | `C:\Falcon\Falcon\falcon-web-platform-ui\libs\falcon-ui-react\src\` | Auto-emitted React wrappers |
| `[CODE]` | `C:\Falcon\Falcon\falcon-web-platform-ui\libs\falcon-ui-vue\src\` | Auto-emitted Vue 3 wrappers |
| `[CODE]` | `C:\Falcon\Falcon\falcon-web-platform-ui\libs\falcon\src\shared-ui\` | Legacy bespoke Angular components (8 remain — migration targets) |

## Brain Skills

| Prefix | Path | Purpose |
|---|---|---|
| `[SKILL]` | `C:\falcon\brain-skills\code-skills\falcon-component-creation-skill\Skill.md` | Brain Skill trigger — `/falcon-component <name>` routes here |
| `[SKILL]` | `C:\falcon\brain-skills\Front-End-skills\angular-tailwind-skill\Skill.md` | Angular + Tailwind v4 stack rules (no SCSS, no PrimeNG) |
| `[SKILL]` | `C:\falcon\brain-skills\Front-End-skills\official-angular-skill\Skill.md` | Angular framework reference (signals, control flow, DI) |
| `[SKILL]` | `C:\falcon\brain-skills\Front-End-skills\noor-instructions-skill\Skill.md` | Admin Console rule book — applies when component is consumed inside Admin Console |
| `[SKILL]` | `C:\falcon\brain-skills\Front-End-skills\polish-skill\Skill.md` | Impeccable (pbakaus) UI polish pass — optional finishing step |
| `[SKILL]` | `C:\falcon\brain-skills\Front-End-skills\emil-design-eng-skill\Skill.md` | Emil Kowalski design-engineering pass — optional motion / craft step |

## Memory references

| Prefix | Path | Purpose |
|---|---|---|
| `[MEMORY]` | `C:\Users\User\.claude\projects\C--Falcon\memory\feedback_no_inline_styles_tokens_only.md` | HARDENED 2026-05-05 — tokens-only rule |
| `[MEMORY]` | `C:\Users\User\.claude\projects\C--Falcon\memory\feedback_shadow_is_token_ssot.md` | Stencil Shadow + token file = SSOT; Tailwind variant mirrors |
| `[MEMORY]` | `C:\Users\User\.claude\projects\C--Falcon\memory\project_falcon_ui_library.md` | Falcon UI library scope + roadmap |
| `[MEMORY]` | `C:\Users\User\.claude\projects\C--Falcon\memory\project_falcon_primeng_total_removal_complete.md` | Zero-PrimeNG status — enforcement context for component authors |
| `[MEMORY]` | `C:\Users\User\.claude\projects\C--Falcon\memory\feedback_angular_only_scope.md` | LOCKED 2026-05-08 — Wave 3+ targets Angular wrapper only |
| `[MEMORY]` | `C:\Users\User\.claude\projects\C--Falcon\memory\project_brain_skills_primeng_purge.md` | Brain-skills tree forbids SCSS / component CSS |

## Strategy sibling docs (this folder)

| Path | Purpose |
|---|---|
| `./README.md` | Index + quick-start |
| `./01-CANONICAL_PATTERN.md` | Three-artefact doctrine |
| `./02-FOLDER_STRUCTURE.md` | Tree diagram + owner / create-when |
| `./03-NAMING_CONVENTION.md` | Tag / class / token / event / file naming |
| `./04-FILE_TEMPLATES/` | Per-layer file skeletons (B2 authored) |
| `./05-SCORING_RUBRIC.md` | Per-rule fidelity scoring (B3 authored) |
| `./06-EXECUTION_PROTOCOL.md` | Step-by-step new-component flow (B4 authored) |
| `./07-INTEGRATION_POINTS.md` | Every registration site |
| `./08-COMMON_PITFALLS.md` | Anti-patterns + traps (B4 authored) |
| `./09-PER_RUN_LOG.md` | Append-only journal (B4 authored) |
| `./runs/<date>_<component>/` | Per-run execution evidence |

_Last updated: 2026-05-14 — Strategy v1.0 — Author: Adnan (auto)_
