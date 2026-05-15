*** Brain SK Obsidian — Falcon Eyes Hub ***
*** Path: _obsidian/FALCON_EYES_INDEX.md ***
*** Created: 2026-05-15 ***

# Falcon Eyes — Semantic Visual Difference QA

> Falcon Eyes is the **semantic** analysis layer over source-vs-destination screenshots. It does not just say "pixels are different." It explains **what** is different, **why**, **which Falcon component owns the mismatch**, and what dynamic Falcon input / template / slot / token / upgrade is needed.

## Skill

- [Falcon Eyes — canonical SKILL.md](../domains/frontend/falcon-eyes/SKILL.md)
- [Alias — visual-difference-qa](../domains/frontend/visual-difference-qa/SKILL.md)
- [Alias — visual-parity](../domains/frontend/visual-parity/SKILL.md)

## Routing (mode 4 of Learning-First Task Routing)

Canonical: [LEARNING_FIRST_TASK_ROUTING](../protocols/LEARNING_FIRST_TASK_ROUTING.md).

| Trigger | Command | Behaviour |
|---|---|---|
| "Run Falcon Eyes, no repair" / screenshot comparison request | [`/falcon-eyes-norepair`](../.claude/commands/falcon-eyes-norepair.md) | Full report (source/destination/diff + semantic mismatch backlog + component repair map). **No UI repair.** |
| "Run Falcon Eyes and repair only the table" (or any named section) | [`/falcon-eyes-repair-scoped`](../.claude/commands/falcon-eyes-repair-scoped.md) | Run the no-repair report first, then repair limited strictly to `<section>` using the customization order. Re-run Falcon Eyes on the section to confirm. |

**Permanent rule:** Falcon Eyes never repairs UI unless the prompt explicitly says repair AND names the scope. Out-of-scope edits are forbidden — every observed mismatch outside the named scope stays as a `pending` learning event.

## Tool

- [Tool README](../tools/falcon-eyes/README.md)
- [Tool package.json](../tools/falcon-eyes/package.json)
- [Tool config — falcon-eyes.config.json](../tools/falcon-eyes/falcon-eyes.config.json)
- [Tool config — section-capture.config.json](../tools/falcon-eyes/section-capture.config.json)
- [Tool — capture-and-compare.ts](../tools/falcon-eyes/capture-and-compare.ts)
- [Tool — compare-images.ts](../tools/falcon-eyes/compare-images.ts)
- [Single-mismatch template](../tools/falcon-eyes/semantic-mismatch-template.md)
- [Installation-validation example](../tools/falcon-eyes/example-run.md)

## Slash command

- [/falcon-eyes](../.claude/commands/falcon-eyes.md)

## Reports root

```text
C:\Falcon\Brain Outputs\reports\falcon-eyes\<YYYY-MM-DD-HHmm>\
```

Required per-run artifacts:

- `source/<section>.png` — flat source screenshots
- `destination/<section>.png` — flat destination screenshots
- `diff/<section>-diff.png` — flat diff screenshots
- `sections/<section-name>/` — one folder per section, each with `SOURCE.png`, `DESTINATION.png`, `DIFF.png`, `SCREENSHOT_REPORT.md`, `SCREENSHOT_DATA.json`, `SEMANTIC_MISMATCHES.md`, `FALCON_COMPONENT_REPAIR_MAP.md`
- `metadata/run.json`, `metadata/pixelmatch.json`
- `FALCON_EYES_REPORT.md`
- `FALCON_EYES_DATA.json`
- `SEMANTIC_MISMATCH_BACKLOG.md`
- `SECTION_SCORECARD.md`
- `FALCON_COMPONENT_REPAIR_MAP.md`
- `ALL_SCREENSHOTS_INDEX.md` — every screenshot file with links
- `ALL_SCREENSHOTS_SUMMARY_REPORT.md` — combined report across every section

### Reporting contract — every run

1. One report per screenshot section under `sections/<section-name>/`.
2. One combined run summary — `ALL_SCREENSHOTS_SUMMARY_REPORT.md`.
3. One screenshot index — `ALL_SCREENSHOTS_INDEX.md`.
4. One semantic mismatch backlog — `SEMANTIC_MISMATCH_BACKLOG.md`.
5. One Falcon component repair map — `FALCON_COMPONENT_REPAIR_MAP.md`.

## Default future targets

| Side | URL |
|---|---|
| Source | `http://localhost:3000/T2%20Falcon%20Admin` |
| Destination | `http://localhost:4200/#/admin-console/org-hierarchy-page` |

## Linked knowledge

- [[FRONTEND_INDEX]] — frontend knowledge entry point
- [[VISUAL_QA_INDEX]] — visual QA sibling index
- [[PAGE_KNOWLEDGE_INDEX]] — page-level registries
- [[Frontend Components Index]] — 60-component master index
- [[FALCON_COMPONENT_INDEX]] — Falcon component dossiers
- [Organization Hierarchy page knowledge](../../Brain%20Outputs/understanding/pages/organization-hierarchy/)

## Standing rule

When visual parity is below **90 %**, or when Ammar asks why source and destination screenshots differ, Brain SK MUST run Falcon Eyes before suggesting any UI fix.

## Customization order (Falcon component-first)

1. Existing Falcon component inputs / config
2. Existing Falcon `ng-template` support
3. Existing Falcon slots / content projection
4. Existing Falcon Tailwind / token variants
5. Shared Falcon component upgrade
6. New reusable Falcon component in the library
7. Feature-local wrapper (page-specific only)
8. Raw implementation (last resort — document as GAP)

## Tailwind / token rule

Tailwind utilities + Falcon tokens only. No SCSS. No inline styles. No PrimeNG. No PrimeIcons. No hardcoded colors / spacing / radii / shadows.

## Latest run — Organization Hierarchy tabs (2026-05-15)

- Falcon Eyes pixel + semantic capture: `C:\Falcon\Brain Outputs\reports\falcon-eyes\2026-05-15-0532\`
- Repair bundle (final + PDF): `C:\Falcon\Brain Outputs\reports\organization-hierarchy-tabs-falcon-eyes-repair-2026-05-15\`
  - `TASK_REPORT_FINAL.md` — merged final report
  - `TASK_REPORT.pdf` — PDF (338 KB, 1.0 spec version)
  - `TASK_B_BLOCKED.md` — real-auth interactive blocker doc
- Falcon Specs PDF: `C:\Falcon\Falcon Specs v1.0 - Organization Hierarchy Visual Repair.pdf`
- Round 1 pixel parity: **96.5 %** (both 90 % and 95 % targets reached)
- P3 polish landed: i18n keys + paginator default + status-badge re-verify; build green (hash `439d98a8dd333f51`)
- Task B status: **BLOCKED** — needs seeded Zitadel test user OR signed-in browser session
