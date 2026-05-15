# Brain SK v0.1 Frontend Domain

Use this domain for Angular, Tailwind, Falcon components, HTML/React/screenshot conversion, UI implementation, visual parity, frontend structure, bundle/performance, and UI report tasks.

## Always-on frontend chain

When a task touches Angular/frontend implementation, always apply:

1. Angular best-practice skill and current Angular project conventions.
2. Tailwind-only rule: no CSS/SCSS unless impossible and documented.
3. Falcon component-first rule: reuse or upgrade Falcon components before page-specific code.
4. Frontend folder structure governance: local models/services by feature; promote only when reused.
5. Component registry lookup/update.
6. Visual parity repair loop when HTML/React/screenshot is source of truth.
7. Task report and Git sync.

## Specialist skill sources

- `domains/frontend/falcon-eyes/SKILL.md` — **Falcon Eyes** semantic visual difference QA (canonical). Aliases: `domains/frontend/visual-difference-qa/SKILL.md`, `domains/frontend/visual-parity/SKILL.md`. Pre-requisite for any UI fix when visual parity < 90 % or when Ammar asks about source-vs-destination screenshot differences.
- `skills/frontend-master-router/SKILL.md`
- `skills/html-to-angular/SKILL.md`
- `skills/react-to-angular/SKILL.md`
- `skills/screenshot-to-angular/SKILL.md`
- `skills/component-capability-upgrade/SKILL.md`
- `skills/legacy-v7/61-falcon-react-to-angular-rage-mode/SKILL.md`
- `skills/legacy-v7/62-rage-html-to-falcon-angular/SKILL.md`
- `skills/legacy-v7/66-retest-restructure-redraw-enforcement/SKILL.md`
- `skills/legacy-v7/67-falcon-bundle-performance-architect/SKILL.md`
- `protocols/legacy-v7/TAILWIND_FIRST_UI_RULES.md`

## Natural commands

Ammar can say:

```text
Convert this standalone HTML to Falcon Angular.
```

```text
Take this Claude Design React project and convert it to Falcon Angular.
```

```text
Run visual parity and fix what does not match.
```

The router must infer this domain automatically unless Ammar overrides it.

## Canonical Frontend Knowledge Path

**Canonical frontend component knowledge path** (read + write):

```text
C:\Falcon\Brain Outputs\understanding\frontend
```

**Component folders** (read + write):

```text
C:\Falcon\Brain Outputs\understanding\frontend\components\<component-name>
```

Every step of the always-on frontend chain — component registry lookup/update, capability matrix queries, upgrade backlog reads, theme/Tailwind audits, architecture audits — MUST read from and write to this canonical tree.

**Legacy / import / mirror — do NOT use as active source:**

- `C:\Falcon\Brain Outputs\component-registry`
- `C:\Falcon\Brain Outputs\frontend-understanding`
- `C:\Falcon\Brain SK\outputs\component-registry`
- `C:\Falcon\Brain SK\outputs\frontend-understanding`

These legacy locations remain for archival provenance only. The config keys backing this rule are `outputs.frontendUnderstanding` and `outputs.frontendComponents` in `config/brain.config.json`. Skills and protocols MUST resolve paths through those config keys (or this canonical block) rather than hardcoding the legacy paths.

## Component-knowledge sub-domain

The frontend component-knowledge sub-domain owns Brain SK's understanding of every Falcon Angular component (Stencil-paired wrappers + legacy bespoke + shared-directives + Stencil-direct):

- `domains/frontend/component-knowledge/SKILL.md` — sub-domain router (deep-build vs incremental-scan).
- `domains/frontend/component-knowledge/incremental-scan/SKILL.md` — the lightweight incremental scanner that decides which components changed since the last scan and only re-scans those. Wraps the deep-build pipeline. Runs via slash command `/scan-components` or the engine script `scripts/incremental-scan/run-scan.mjs`.

**Rule:** before any deep frontend component knowledge build, run the incremental scan first. It refreshes edit-tracking (last editor / last edit date / last commit) for every component, even when the deep build is skipped, so the metadata at `outputs/understanding/frontend/_scan-state/component-scan-metadata.json` always reflects today's source state. Every scan run produces a dated report folder at `outputs/reports/component-scans/<YYYY-MM-DD-HHmm>/` with Markdown + JSON + CSV + edit-history table + PDF (when the PDF toolchain is available).
