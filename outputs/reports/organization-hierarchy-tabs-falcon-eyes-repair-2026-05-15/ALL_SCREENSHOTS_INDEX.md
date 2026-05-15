*** All Screenshots Index — Org Hierarchy Falcon Eyes (RESUMED 2026-05-15) ***

## Top-level evidence (copied into this report folder)

| Side | File | Status |
|---|---|---|
| Source (React SoT) | `evidence/source/source_full-page.png` | OK — full Organization Hierarchy page |
| Destination (Falcon Angular) | `evidence/destination/destination_full-page.png` | OK — full Organization Hierarchy page renders |
| Diff (Round 1)               | `evidence/diff/tabs-header-diff.png` | OK — 3.5 % pixel mismatch (data-only) |

## Per-section evidence (canonical Falcon Eyes run output)

All 12 sections share the same full-page source / destination / diff because the section-capture config used full-page fallback (no per-section selectors filled).

Falcon Eyes canonical output folder:
`C:\Falcon\Brain Outputs\reports\falcon-eyes\2026-05-15-0532\`

Per-section folder contents (same for every section):

```
sections/<section>/
├── SOURCE.png                          (full-page source — same image, 12 copies)
├── DESTINATION.png                     (full-page destination)
├── DIFF.png                            (pixelmatch overlay, magenta diff)
├── SCREENSHOT_REPORT.md                (per-section pixel + status notes)
├── SCREENSHOT_DATA.json                (pixel mismatch %, severity, status)
├── SEMANTIC_MISMATCHES.md              (filled by Falcon Eyes skill — none for this run)
└── FALCON_COMPONENT_REPAIR_MAP.md      (filled — no repairs needed)
```

## Per-section list

| # | Section | Path |
|---:|---|---|
| 1  | tabs-header                    | `sections/tabs-header/` |
| 2  | comm-channels-tab              | `sections/comm-channels-tab/` |
| 3  | apps-services-tab              | `sections/apps-services-tab/` |
| 4  | org-info-panel                 | `sections/org-info-panel/` |
| 5  | org-info-audit-mode            | `sections/org-info-audit-mode/` |
| 6  | org-info-rule-status           | `sections/org-info-rule-status/` |
| 7  | org-info-permission-privilege  | `sections/org-info-permission-privilege/` |
| 8  | settings-tab-view-mode         | `sections/settings-tab-view-mode/` |
| 9  | settings-tab-edit-mode         | `sections/settings-tab-edit-mode/` |
| 10 | settings-ip-management         | `sections/settings-ip-management/` |
| 11 | settings-account-limitation    | `sections/settings-account-limitation/` |
| 12 | otp-popup                      | `sections/otp-popup/` |

## Cross-links

- Falcon Eyes run summary: `C:\Falcon\Brain Outputs\reports\falcon-eyes\2026-05-15-0532\FALCON_EYES_REPORT.md`
- Semantic backlog (run-level): `C:\Falcon\Brain Outputs\reports\falcon-eyes\2026-05-15-0532\SEMANTIC_MISMATCH_BACKLOG.md`
- Section scorecard (run-level): `C:\Falcon\Brain Outputs\reports\falcon-eyes\2026-05-15-0532\SECTION_SCORECARD.md`
- Repair map (run-level): `C:\Falcon\Brain Outputs\reports\falcon-eyes\2026-05-15-0532\FALCON_COMPONENT_REPAIR_MAP.md`
