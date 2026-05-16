# Falcon Component Creation — Strategy v1.0

> **Strategy alignment:** ~96% with canonical pattern (current best estimate, drifts upward as runs land).
> **Last updated:** 2026-05-14
> **Author:** Adnan (auto)
> **Status:** ACTIVE — first reference run is `runs/2026-05-14_falcon-empty-data/`

## What this is

[INFERRED] This folder is the canonical playbook for creating a new Falcon UI component. Every Falcon component follows a strict **dual-render pattern**: Stencil Shadow + Stencil Light/TW + Angular wrapper, backed by tokens-only CSS and a `falconXClasses()` Tailwind helper module. This strategy folder captures the **rules**, **templates**, **scoring rubric**, **execution protocol**, and **per-run reports** that make new-component delivery deterministic across agents and sessions.

[BRAIN-OUT] The strategy is the executable companion to `Brain Outputs/frontend-understanding/FALCON_WRAPPER_AND_RENDER_PATH_REPORT.md` — the report describes WHAT the pattern is; this folder describes HOW to reproduce it with ≥95% fidelity on a brand-new component.

## Quick start

To create a new Falcon component named `falcon-X`:

```
/falcon-component <X>
```

[SKILL] Trigger from `C:\falcon\brain-skills\code-skills\falcon-component-creation-skill\Skill.md` (Brain Skill — auto-routes to `06-EXECUTION_PROTOCOL.md`). If the skill is not loaded, follow `06-EXECUTION_PROTOCOL.md` step-by-step manually.

## Strategy goals

| # | Goal | Measure |
|---|---|---|
| 1 | **Replicate the canonical pattern with ≥95% fidelity** | Score against `05-SCORING_RUBRIC.md` after every run; any item < 95% blocks merge |
| 2 | **Self-enhance via per-run lessons** | Every run writes a `lessons.md` to `runs/<date>_<component>/`; rubric + protocol updated when ≥2 runs surface the same gap |
| 3 | **Zero-config integration** | All 5 integration points (`03-NAMING_CONVENTION.md` + `07-INTEGRATION_POINTS.md`) registered automatically by the execution protocol; manual touches forbidden |
| 4 | **Cross-framework consistency** | Stencil `dist-custom-elements` + `reactOutputTarget` mean React + Vue bindings emit automatically; no manual wrapper edits |
| 5 | **Tokens-only paint** | Zero hardcoded colors/sizes/radii — every visual flows through `--falcon-<kebab>-*` tokens in `libs/falcon-ui-tokens/src/components/X.tokens.css` |

## Table of contents

| Doc | Purpose |
|---|---|
| [`README.md`](./README.md) | This file — index + quick-start |
| [`01-CANONICAL_PATTERN.md`](./01-CANONICAL_PATTERN.md) | The three-artefact doctrine (Shadow / Light-TW / Angular wrapper) + critical contracts + decision tree |
| [`02-FOLDER_STRUCTURE.md`](./02-FOLDER_STRUCTURE.md) | Where every artefact lives — tree diagram + per-path owner + create-when |
| [`03-NAMING_CONVENTION.md`](./03-NAMING_CONVENTION.md) | Tag / class / token / event / selector / file naming — single table reference |
| `04-FILE_TEMPLATES/` | Per-layer file skeletons (Stencil Shadow `.tsx`/`.css`/`.types.ts`, Stencil Light `.tsx`, Tailwind helper, Angular wrapper `.ts`/`.html`/`index.ts`, token contract, integration patches) — authored by B2 |
| `05-SCORING_RUBRIC.md` | Per-rule fidelity scoring — authored by B3 |
| `06-EXECUTION_PROTOCOL.md` | Step-by-step new-component flow — authored by B4 |
| [`07-INTEGRATION_POINTS.md`](./07-INTEGRATION_POINTS.md) | Every registration site + purpose + risk-if-missed |
| `08-COMMON_PITFALLS.md` | Anti-patterns + known traps — authored by B4 |
| `09-PER_RUN_LOG.md` | Append-only journal of each run + score + lessons — authored by B4 |
| [`LINKS.md`](./LINKS.md) | Crosslinks into vault / Brain SK / source / per-component dossiers |
| `runs/<date>_<component>/` | Per-run execution evidence (plan, diff, score, lessons) |

## Update cadence

[INFERRED] Strategy version bumps when:
- A NAMING or PATTERN rule is added / changed → minor bump (v1.x).
- A new artefact layer is added (e.g. a Vue-specific wrapper) → major bump (v2.0).
- Per-run lessons only update `09-PER_RUN_LOG.md` and the rubric — no version bump.

All edits must include a dated entry in `09-PER_RUN_LOG.md` referencing the run that surfaced the change.

_Last updated: 2026-05-14 — Strategy v1.0 — Author: Adnan (auto)_
