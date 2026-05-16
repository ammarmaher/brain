---
name: ammar-brain-capability-audit
category: Shared / Analytics / Brain Audit
description: Audit Ammar Brain itself — what the brain knows, what it does not know, and what it needs next. Scans Brain Outputs, registries, reports, component knowledge, backend/API understanding, PRD/business understanding, and scan metadata. Emits 5 deliverables (metrics JSON, audit markdown, gap registry, executive summary, PDF boss report). Never invents scores.
owner: Brain SK v0.1
status: active
---

# ammar-brain-capability-audit

## Purpose

Produce an evidence-only snapshot of Ammar Brain's capability:

- what the brain **knows** (files exist, scans complete, scores already computed by prior agents)
- what the brain **does not know** (empty files, stub registries, missing scan metadata, no spec coverage)
- what the brain **needs next** (top gaps, top risks, recommended next actions)

This skill does **not** rate the brain — it reads pre-existing evidence (e.g. `READINESS_SCORES.md`, scan-run logs, gap files, registry sizes) and reports verbatim. When evidence is missing, the dimension is recorded as a **gap**, not given a guessed score.

## Inputs (read-only scan)

| Source | Path |
|---|---|
| Brain Outputs root | `C:\Falcon\Brain Outputs\` |
| Registries | `C:\Falcon\Brain SK\registries\` |
| Reports | `C:\Falcon\Brain Outputs\reports\` |
| Component knowledge | `C:\Falcon\Brain Outputs\understanding\frontend\components\` |
| Backend / API understanding | `C:\Falcon\Brain Outputs\understanding\backend\` |
| PRD / business understanding | `C:\Falcon\Brain Outputs\prd\modules\` |
| Scan metadata | `C:\Falcon\Brain Outputs\understanding\frontend\_scan-state\` |
| Wiki architect mirror | `C:\Falcon\Brain Outputs\wiki-architect\` |

## Outputs (5 deliverables)

All emitted under:

```
C:\Falcon\Brain Outputs\reports\brain-capability-audit\<YYYY-MM-DD>\
```

1. `BRAIN_CAPABILITY_METRICS.json` — machine-readable evidence
2. `BRAIN_CAPABILITY_AUDIT.md` — full audit with embedded charts
3. `BRAIN_GAP_REGISTRY.md` — every gap with severity + source path
4. `BRAIN_EXECUTIVE_SUMMARY.md` — one-page for leadership
5. `BRAIN_BOSS_REPORT.pdf` — react-pdf build of the executive summary + key charts

## Hard rules

- **Never invent scores.** If a dimension has no evidence file, record it as `gap: missing-source-evidence` with severity HIGH.
- **Cite every number.** Every metric in the JSON must have a `source` field with a file path.
- **Charts via data-visualization skill.** Use `shared/analytics/data-visualization/SKILL.md` for every chart. No inline hex.
- **Outputs go to `Brain Outputs/`.** Never write inside the core skill package.
- **PDF uses react-pdf.** A small Node script under the audit run folder builds the PDF.
- **Severity mirrors source.** If the source registry uses P0/P1/P2, map P0→HIGH, P1→MEDIUM, P2/P3→LOW. If the source uses a numeric %, keep the % verbatim.

## Definition of done

- All 5 files present under the dated run folder.
- Every metric has a `source` citation.
- Every gap has a `path` citation.
- PDF was built with `react-pdf` (renderer command logged in `BUILD_LOG.txt`).
- Charts cite the data-visualization skill in their captions.
