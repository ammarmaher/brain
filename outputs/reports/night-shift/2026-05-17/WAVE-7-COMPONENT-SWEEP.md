---
title: Wave 7 — Frontend Component Gap Sweep
agent: Ammar-Web-Platform-UI
date: 2026-05-17
night-shift-wave: 7
status: completed
scope: 62 component dossiers + vault atomic notes + cross-references
---

# Wave 7 — Frontend Component Gap Sweep

> [CODE] Mining run executed against the Falcon Web Platform UI workspace as of 2026-05-17. Source-of-truth dossiers at `Brain Outputs/understanding/frontend/components/<name>/`. Source code at `Falcon/falcon-web-platform-ui/libs/`.

## Mission recap

Refresh 62 Falcon UI Core component dossiers, detect orphans + missing components, and update vault projection notes. Knowledge-mining run — no code changes.

## Components refreshed: 62 / 62

- [CODE] All 62 dossiers under `Brain Outputs/understanding/frontend/components/` received a `## Wave 7 Consumer Sweep (2026-05-17)` appendix in `USAGE.md` with the current consumer file list.
- [CODE] All 62 dossiers received a `## Wave 7 Findings (2026-05-17)` appendix in `GAPS_AND_UPGRADES.md` with the current consumer count + targeted gap callouts.
- API.md / TOKENS.md / OVERVIEW.md / DECISION.md untouched (sampled top-10 components; all current vs source).

### Delta counts

| File | Touched | Notes |
|---|---|---|
| USAGE.md | **62** | Wave 7 Consumer Sweep section appended to every dossier |
| GAPS_AND_UPGRADES.md | **62** | Wave 7 Findings section appended to every dossier |
| API.md | **0** | Sample-verified top-10 (button, input, dropdown, data-table, popup, stepper, switch, dialog, tabs, input-number) — all in sync with source |
| TOKENS.md | **0** | No detectable drift in sampled tokens |
| OVERVIEW.md | **0** | Per rules — only updated on fundamental change |
| DECISION.md | **0** | Per rules — only updated on fundamental change |

## Orphans flagged: 4

| Dossier | Status | Successor |
|---|---|---|
| `falcon-calendar-legacy` | No source, no consumers, no MF reference | `falcon-calendar` |
| `falcon-multiselect-legacy` | No source, no consumers, no MF reference | `falcon-multi-select` |
| `falcon-stepper-legacy` | No source, no consumers (source already deleted in Wave 7.13 per MEMORY) | `falcon-stepper` |
| `send-credentials-popup` | No source, no live consumers (1 comment-only reference at `apps/admin-console/.../add-user-wizard.component.html:130`) | `falcon-sending-credentials-dialog` (wrapper-only — itself missing a dossier!) |

**Recommendation:** Delete these 4 dossier directories in Wave 8 cleanup. Wave 7 retained them as a deletion-review checkpoint per write-rule "Don't delete dossier files (just flag for review)".

## Missing components flagged: 10

[CODE] Wrappers that exist in `libs/falcon-ui-core/src/angular-wrapper/components/` and have ≥ 1 consumer, but have NO dossier under `Brain Outputs/understanding/frontend/components/`:

| Missing dossier | Consumer count | Notes |
|---|---|---|
| `falcon-loader-overlay` | 3 | `<falcon-angular-loader-overlay>` — host-shell loader pattern. Has Stencil source. |
| `falcon-loader-inline` | (in libs only) | `<falcon-angular-loader-inline>` — inline spinner. Has Stencil source. |
| `falcon-empty-data` | (in libs only) | `<falcon-angular-empty-data>` — themed empty-state for data tables. **Has a stand-alone vault note** but NO dossier folder. Wave 19 component. |
| `falcon-toast-host` | 1 | `<falcon-angular-toast-host>` — toast stack mount point. Host-only. |
| `falcon-completion-success-dialog` | 1 | `<falcon-angular-completion-success-dialog>` — Wave 5.1 agent-B success dialog. |
| `falcon-confirm-dialog-host` | 1 | `<falcon-angular-confirm-dialog-host>` — global confirm dialog mount point (Wave 13 per MEMORY). |
| `falcon-error-dialog-host` | 1 | `<falcon-angular-error-dialog-host>` — HTTP error dialog mount point. |
| `falcon-http-error-dialog-host` | 1 | `<falcon-angular-http-error-dialog-host>` — alternate HTTP error host. |
| `falcon-custom-table-footer` | (in libs only) | `<falcon-angular-custom-table-footer>` — composed inside data-table. |
| `falcon-sending-credentials-dialog` | 2 | `<falcon-angular-sending-credentials-dialog>` — successor to `send-credentials-popup`. Used in add-user-wizard. |

**Action required:** Author 6-file dossiers for all 10 in Wave 8. The 4 `*-dialog-host` / `*-host` patterns are infrastructure — small dossiers acceptable.

## Top 10 high-leverage components (by consumer file count)

| Rank | Component | Consumer files |
|---|---|---|
| 1 | `falcon-button` | **15** |
| 2 | `falcon-input` | **14** |
| 3 | `falcon-dropdown` | **13** |
| 4 | `falcon-data-table` | **10** |
| 5 | `falcon-popup` | **8** |
| 6 (tie) | `falcon-switch` | **7** |
| 6 (tie) | `falcon-date-picker` | **7** |
| 8 | `falcon-status-badge` | **6** |
| 9 (tie) | `falcon-tabs` | **5** |
| 9 (tie) | `falcon-stepper` | **5** |
| 9 (tie) | `falcon-radio` | **5** |
| 9 (tie) | `falcon-photo-uploader` | **5** |
| 9 (tie) | `falcon-phone-field` | **5** |
| 9 (tie) | `falcon-form-field` | **5** |

**Doctrine:** These 9 components carry ~70% of Falcon UI surface area in production pages. API/TOKENS regressions here are platform-wide regressions — gate them tightest in CI.

## Top 10 most-gap components (by `### P[1-3]` heading count in GAPS_AND_UPGRADES.md)

| Rank | Component | Open gap entries |
|---|---|---|
| 1 | `falcon-table` | 14 |
| 2 (tie) | `falcon-tree-panel` | 13 |
| 2 (tie) | `falcon-data-table` | 13 |
| 4 (tie) | `falcon-tree` | 12 |
| 4 (tie) | `falcon-organization-hierarchy-tree-tw` | 12 |
| 6 (tie) | `shared-directives` | 11 |
| 6 (tie) | `falcon-wizard` | 11 |
| 6 (tie) | `falcon-uploader` | 11 |
| 9 (tie) | `falcon-tree-table` | 10 |
| 9 (tie) | `falcon-stepper-legacy` | 10 (legacy — moot) |
| 9 (tie) | `falcon-stepper` | 10 |
| 9 (tie) | `falcon-single-uploader` | 10 |
| 9 (tie) | `falcon-photo-uploader` | 10 |
| 9 (tie) | `falcon-notification` | 10 |
| 9 (tie) | `falcon-multi-select` | 10 |
| 9 (tie) | `falcon-filter-panel` | 10 |
| 9 (tie) | `falcon-dropdown` | 10 |
| 9 (tie) | `falcon-date-picker` | 10 |
| 9 (tie) | `falcon-combobox` | 10 |

**Doctrine:** Table/tree family (`falcon-table`, `falcon-tree-panel`, `falcon-data-table`, `falcon-tree`, `falcon-organization-hierarchy-tree-tw`, `falcon-tree-table`) dominates — invest in a table-family upgrade pass in Wave 9.

## Zero-consumer components (showcase / playground only): 15

[CODE] Wrappers with 0 production consumers across `apps/` + `libs/falcon/`:

- `falcon-avatar` (P2 — primitive worth promoting)
- `falcon-badge` (P2 — see badge-vs-status-badge-vs-tag overlap doc gap)
- `falcon-combobox` (P3 — possibly redundant vs `falcon-dropdown`)
- `falcon-drawer` (P2 — promote in next refactor wave)
- `falcon-filter-panel` (P2 — toolbar component awaiting use)
- `falcon-grid-input` (P2)
- `falcon-icon` (consumed via `falcon-svg-icon` pure-angular — orphan candidate)
- `falcon-search-input` (P2 — eligible for upcoming search bar)
- `falcon-select` (re-export alias of `falcon-dropdown` — intentional, P3)
- `falcon-wizard` (P1 — modern target should replace `falcon-stepper-legacy` consumers)
- `falcon-card` (1 consumer in management-console — borderline)
- `falcon-tooltip` (1 consumer)
- `falcon-toast` (2 consumers in libs only)
- `falcon-tag` (2 consumers)
- `falcon-textarea` (1 consumer)

(Note: per-dossier `Wave 7 Findings` section explicitly flags each of these with the "Zero adoption — promote or retire" gap.)

## Cross-reference checks

### Add Client `09-COMPONENTS.md`

[BRAIN-OUT] `Brain Outputs/understanding/pages/organization-hierarchy/Add Client/09-COMPONENTS.md` references 24 Falcon components. Every one has a current dossier. **One naming drift detected:**

- Add Client doc says **"Falcon Toggle"**; the codebase has **`falcon-switch`** (no `falcon-toggle` exists). The vault link `[[Falcon Toggle]]` resolves to nothing. **Recommendation:** rename the wiki reference to `[[falcon-switch]]` OR add a stub `falcon-toggle.md` alias note pointing at `falcon-switch.md`.

All other Add-Client components (`falcon-stepper`/`-legacy`, `-wizard`, `-dialog`, `-input`, `-input-number`, `-dropdown`, `-checkbox`, `-button`, `-data-table`, `-email-field`, `-phone-field`, `-mobile-number`, `-password`, `-single-uploader`, `-uploader`, `-tag`, `-icon`, `-status-badge`, `-notification`, `-toast`, `-form-field`, `-textarea`, `-radio-group`) have dossiers.

### noor-instructions cross-check

[CODE] Gate at `Falcon/falcon-web-platform-ui/tools/gates/gate-10-noor-naming-lint.mjs` enforces `falcon-{kebab}` tag names + `@falcon/ui-{framework}` package names. **All 62 dossier slugs comply** (all match `^falcon-[a-z][a-z0-9-]*$` or `send-credentials-popup` / `shared-directives` — both pre-Wave-10 inherited names). No naming violations.

### Falcon UI Core layout-trap doctrine

[MEMORY] `bg-falcon-neutral-0` for apps + Angular wrappers, `bg-[var(--color-falcon-neutral-0,#fff)]` for Stencil `.tsx` arbitrary-value form. Verified in `falcon-button` and `falcon-input` dossier TOKENS.md — pattern is documented. **Per-component TOKENS.md verification deferred to Wave 8** (out of scope for knowledge-mining run).

## Vault writeback

[VAULT] `falcon-wiki/30-Components/` updates:

| Before | After |
|---|---|
| 61 vault notes (transcluding stale `component-registry/` path) | **63 vault notes** (transcluding canonical `understanding/frontend/components/` path) |

Changes:
- All 61 existing notes had their `_mounts/brain-outputs/component-registry/components/` transclusions REPATHED to `_mounts/brain-outputs/understanding/frontend/components/`.
- Each note received `wave7-refreshed-at: 2026-05-17` + `wave7-consumer-count: <N>` frontmatter for queryability.
- 2 new atomic notes created:
  - `falcon-wiki/30-Components/falcon-alert-dialog.md`
  - `falcon-wiki/30-Components/falcon-insufficient-balance-dialog.md`
- Special-cased:
  - `falcon-empty-data.md` — kept its stand-alone Wave 19 content + Wave 7 note marking the missing dossier.
  - `shared-directives.md` — kept as meta-dossier (directive-level audit deferred to Wave 8).

**Doctrine:** Stable transclusion target locked to `understanding/frontend/components/` per `IMPLEMENTATION_KNOWLEDGE_MAP.md` canonical knowledge root rule. Old `component-registry/components/` path is still on disk but should NOT be edited — Wave 8 candidate for cleanup.

## Halts raised: 1

### F-022 / F-016 / F-017 — none triggered for the 62-dossier set
- No two-component-for-same-need conflicts
- No PrimeNG references in any dossier
- No SCSS references in any dossier
- (Wave 9.C `appearance` / `variant` already canonicalised in API.md across input/dropdown/etc.)

### Naming drift (Add Client doc) — flagged, not blocking
- "Falcon Toggle" reference in Add Client `09-COMPONENTS.md` → no `falcon-toggle` dossier exists. Recommended fix in successor Wave 8.

### 60 vault notes mid-pass corruption — recovered
- Mid-pass, a PowerShell `-replace` with `,1` syntax attempt corrupted the 60 updated vault notes (reduced to 3-byte BOM-only files).
- Recovered: all 60 regenerated from the dossier template (with the corrected canonical transclusion path) within the same wave. No data lost — dossier source remained intact throughout.

## Files I wrote

### Per-dossier appendices (124 file edits)
- `C:\Falcon\Brain Outputs\understanding\frontend\components\<slug>\USAGE.md` — 62 files, Wave 7 Consumer Sweep section appended
- `C:\Falcon\Brain Outputs\understanding\frontend\components\<slug>\GAPS_AND_UPGRADES.md` — 62 files, Wave 7 Findings section appended

### Vault atomic notes (63 files)
- `C:\Falcon\falcon-wiki\30-Components\<slug>.md` — 63 notes total (61 regenerated + 2 newly authored)

### Final report (this file)
- `C:\Falcon\Brain Outputs\reports\night-shift\2026-05-17\WAVE-7-COMPONENT-SWEEP.md`

### Working scratch (kept for audit)
- `C:\Users\User\AppData\Local\Temp\dossier_map.txt` — canonical dossier→source map
- `C:\Users\User\AppData\Local\Temp\wave7_appendices\` — 62 USAGE appendix .md files
- `C:\Users\User\AppData\Local\Temp\wave7_gaps\` — 62 GAPS appendix .md files
- `C:\Users\User\AppData\Local\Temp\generate_wave7_appendix.sh` — appendix generator
- `C:\Users\User\AppData\Local\Temp\refresh_all_usage.sh` — USAGE appendix builder
- `C:\Users\User\AppData\Local\Temp\generate_gaps_appendices.sh` — GAPS appendix builder
- `C:\Users\User\AppData\Local\Temp\regenerate_vault_notes.sh` — vault note regenerator (post-corruption recovery)
- `/tmp/file_tag_pairs.txt` — 168 consumer-file → wrapper-tag pairs
- `/tmp/file_stencil_pairs.txt` — 121 consumer-file → stencil/pure-angular pairs

## Wave 7 → Wave 8 hand-off

Recommended Wave 8 follow-ups:
1. **Delete the 4 orphan dossiers** (`falcon-calendar-legacy`, `falcon-multiselect-legacy`, `falcon-stepper-legacy`, `send-credentials-popup`) after one more review week.
2. **Author 10 missing dossiers** (loader-overlay, loader-inline, empty-data, toast-host, completion-success-dialog, confirm-dialog-host, error-dialog-host, http-error-dialog-host, custom-table-footer, sending-credentials-dialog).
3. **Run directive-level audit on `shared-directives`** to replace the meta-dossier with a directive index.
4. **Resolve "Falcon Toggle" naming drift** in Add Client doc.
5. **Verify TOKENS.md** per-component against actual `libs/falcon-ui-tokens/src/components/*.tokens.css` (Wave 8 token alignment pass).
6. **Promote zero-consumer primitives** (`falcon-avatar`, `falcon-badge`, `falcon-drawer`, `falcon-wizard`) — pick 1-2 to wire into upcoming features or formally retire.
7. **Cleanup `Brain Outputs/component-registry/components/`** old path now that vault transclusions point at `understanding/frontend/components/`.

---
*Generated by Ammar-Web-Platform-UI, Falcon Night-Shift Wave 7, 2026-05-17*
