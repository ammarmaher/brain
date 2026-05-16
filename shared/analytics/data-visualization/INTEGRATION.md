# Integration — Wiring the PDF/Reporting System

How report generators and the PDF Skills Suite call this skill.

## 1. From `skills/task-report-generator/SKILL.md`

Every task report build must:

1. Assemble the report's metric JSON.
2. For each chart needed, build a request envelope (see `SCHEMA.md`).
3. Invoke `shared/analytics/data-visualization` with the envelope.
4. Embed the returned `markdown` / `mermaid` fragment into the report body.
5. Reference the returned `svg` path from the PDF render step.

The report writer is responsible for `reportId` and the per-chart `chartId`.

## 2. From the PDF Skills Suite

`brain-skills/pdf-skills/*` (especially `market-report-pdf` and `pdf-creator`) consume the **SVG outputs** for high-res chart embedding. Flow:

```
report-writer
  → data-visualization (markdown + mermaid + svg)
    → Brain Outputs/reports/<id>/charts/*.svg
  → pdf-skills (embed svg)
    → Brain Outputs/reports/<id>/<report>.pdf
```

Rules:

- PDF skills MUST request `outputs: ["markdown", "svg"]` (Mermaid is screen-only).
- PDF skills MUST NOT re-render charts themselves. Always delegate to this skill.

## 3. From frontend / backend understanding scans

`domains/frontend/component-knowledge/incremental-scan/SKILL.md` and `skills/backend-api-understanding/SKILL.md` send:

- **readiness** chart for module % complete
- **gap-severity** chart for outstanding gaps
- **module-comparison** table for cross-module health
- **scorecard** for headline coverage %

## 4. From bootstrap and capability skills

- `skills/initial-bootstrap-discovery/` sends a **metric-grid** for startup readiness.
- `skills/component-capability-upgrade/` sends a **confidence-matrix** for the capability dashboard.

## 5. Output path resolution

The skill resolves the output directory from `config/brain.config.json`:

```
<outputs.reports>/<reportId>/charts/<chartId>.{md,mmd,svg}
```

Cross-report shared dashboards land at:

```
<outputs.reports>/dashboards/<dashboard-name>/...
```

## 6. Obsidian + Git sync

After writing chart files the skill:

1. Calls `shared/obsidian-auto-link/` to index new charts under the matching report note (skipped if vault is missing).
2. Stages chart files via `shared/git-sync/` — **additive only**, no `/MIR`, no `/PURGE`.
3. Honors the global `.gitignore` exclusion list (secrets, `node_modules`, `bin`, `obj`, `dist`).

## 7. Caller checklist

Before invoking this skill, callers must:

- [ ] Assemble a complete JSON envelope (see `SCHEMA.md`).
- [ ] Provide a non-empty `source` string.
- [ ] Choose a registered palette from `PALETTES.md`.
- [ ] Decide which `outputs[]` you actually need (don't request SVG if you'll never embed it).
- [ ] Pass a deterministic `chartId` so re-runs overwrite cleanly.

If any item is missing, the skill responds with `{ "error": "..." }` — callers must not paper over this.
