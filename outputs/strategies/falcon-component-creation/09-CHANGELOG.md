# 09 — Changelog

> **Purpose.** Strategy version log. Every change to any file in this folder lands here with a date, a version bump, and a link to the run that surfaced the change.
>
> **Versioning.** Semantic. MAJOR = new artefact layer or breaking pattern change. MINOR = new rule or new template. PATCH = pitfall added, doctrine clarified, run logged.

## v1.0 — 2026-05-14

### Added
- Initial canonical-pattern doctrine (`01-CANONICAL_PATTERN.md`) authored by B1.
- Folder structure reference (`02-FOLDER_STRUCTURE.md`) authored by B1.
- Naming convention table (`03-NAMING_CONVENTION.md`) authored by B1.
- 10 file templates (`04-FILE_TEMPLATES/`) authored by B2:
  - `shadow.tsx.template`
  - `shadow.css.template`
  - `light-tw.tsx.template`
  - `classes.ts.template`
  - `types.ts.template`
  - `tokens.css.template`
  - `angular-wrapper.ts.template`
  - `angular-wrapper.html.template`
  - `angular-wrapper-index.ts.template`
  - `loader-entry.template`
- 17-dimension scoring rubric (`05-SCORING_RUBRIC.md`).
- 8-phase execution protocol (`06-EXECUTION_PROTOCOL.md`).
- Integration points reference (`07-INTEGRATION_POINTS.md`) authored by B1.
- 10 known pitfalls (`08-COMMON_PITFALLS.md`).
- README + LINKS (authored by B1).

### First run
- `falcon-empty-data` — run dir: `runs/2026-05-14_falcon-empty-data/`.
- Calibration result: predicted post-run score **98.47%** (canonical band).
- Lessons rolled back into:
  - `08-COMMON_PITFALLS.md` (pitfalls 1–10 seeded from this run's pre-flight).
  - `05-SCORING_RUBRIC.md` (a11y i18n nit — `aria-label` should accept a Prop for translation).

### Calibration notes
- Strategy alignment with the codebase canonical pattern measured at ~96% in the README; first run pushed predicted alignment to ~98%.
- One transient EMFILE during Stencil compile in Phase 4, resolved by retry. Documented in pitfall #1.

---

<!--
## Template for future entries — DO NOT delete; copy below and fill.

## vX.Y.Z — YYYY-MM-DD

### Added
- ...

### Changed
- ...

### Removed
- ...

### Run
- `<component-name>` — run dir: `runs/YYYY-MM-DD_<component>/`.
- Post-run score: __%.
- Lessons rolled back into: [doc-name](./doc-name.md) (describe each delta).
-->

<!--
## v1.0.1 — YYYY-MM-DD
- PATCH: …

## v1.1.0 — YYYY-MM-DD
- MINOR: …

## v2.0.0 — YYYY-MM-DD
- MAJOR: …
-->

## Reserved future sections

The headers below are placeholders. Replace each with a real entry when the version ships.

- `## v1.0.1 — TBD` — first PATCH (expected: new pitfall from second run).
- `## v1.1.0 — TBD` — first MINOR (expected: new rule once 2+ runs align on a missing convention).
- `## v2.0.0 — TBD` — reserved for the first MAJOR (e.g. adding a Vue-specific wrapper layer or a new build target).

_Last updated: 2026-05-14 — Strategy v1.0 — Author: Adnan (auto)_
