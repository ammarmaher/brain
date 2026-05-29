# Falcon Component Library — Conclusion & Master Index

> The single-page answer to "what components do we have, what can each do, what can't it do."
> Generated 2026-05-18 after the 3-layer knowledge-base build. Every one of the 62 components now has a 9-file dossier: UI (`OVERVIEW`/`API`/`USAGE`/`TOKENS`) + `GAPS_AND_UPGRADES` + `DECISION` + **`BUSINESS`** + **`INTEGRATION_VALIDATION`** + **`RECOGNITION`**.
> For a screenshot/design → component lookup, also see `RECOGNITION.md` per component and `COMPONENT_PAGE_MODULE_MAP.md` for component↔page↔module links.

---

## 1. The library at a glance

**62 documented components** across the Angular-wrapper consumer surface (`libs/falcon-ui-core/src/angular-wrapper`), each backed by a Stencil core (`src/components`). Tailwind v4 + design tokens only — no SCSS, no PrimeNG.

| # | Category | Components |
|---|---|---|
| 1 | **Text & numeric inputs** | input · input-number · textarea · email-field · search-input · grid-input · password · otp · phone-field · ~~mobile-number~~ |
| 2 | **Selection** | dropdown · select · combobox · multi-select · ~~multiselect-legacy~~ · checkbox · checkbox-group · radio · radio-group · switch |
| 3 | **Date** | calendar · date-picker · ~~calendar-legacy~~ |
| 4 | **Buttons** | button |
| 5 | **Display / static** | avatar · badge · card · icon · tag · status-badge · tooltip · empty-state |
| 6 | **Overlays & dialogs** | dialog · drawer · popup · alert-dialog · confirm-dialog · insufficient-balance-dialog · otp-send-dialog · message-host · ~~send-credentials-popup~~ |
| 7 | **Feedback** | toast · notification |
| 8 | **Navigation & structure** | stepper · wizard · tabs · accordion · menu · paginator · ~~stepper-legacy~~ |
| 9 | **Data display** | table · data-table · tree · tree-table · tree-panel · organization-hierarchy-tree-tw · filter-panel |
| 10 | **Form structure** | form-field |
| 11 | **Uploaders** | uploader · single-uploader · photo-uploader |
| 12 | **Directives** | shared-directives |

`~~strikethrough~~` = retired (see §3).

---

## 2. Picking the right component (the quick decision spine)

| You need… | Use |
|---|---|
| one value from a known list | `falcon-dropdown` (searchable) / `falcon-select` (plain) |
| many values from a list | `falcon-multi-select` |
| free typing + suggestions | `falcon-combobox` |
| a true/false toggle | `falcon-switch` (setting) / `falcon-checkbox` (form value) |
| one-of-N inline | `falcon-radio-group` |
| a date | `falcon-date-picker` (input+popover) / `falcon-calendar` (inline grid) |
| a flat data grid | `falcon-data-table` (Angular) — never hand-roll `<table>` |
| nested/indented data | `falcon-tree-table` (with columns) / `falcon-tree` (labels only) |
| the org-hierarchy rail | `falcon-tree-panel` → `<app-organization-hierarchy-tree>` |
| a multi-step flow | `falcon-wizard` (validated steps) / `falcon-stepper` (step rail) |
| a blocking modal | `falcon-dialog` / `falcon-alert-dialog` / `falcon-confirm-dialog` |
| a transient message | `FalconToastService` → `falcon-notification` stack |
| a status pill | `falcon-status-badge` (domain status) / `falcon-tag` (generic palette) |

Full cross-library mapping (MUI / PrimeNG / Ant / Bootstrap / shadcn-Radix / plain HTML → Falcon) lives in each component's `RECOGNITION.md`.

---

## 3. Retired / orphan components — do NOT use in new code

The KB build confirmed five components are dead and one has no production consumer. Their dossiers now redirect to the live successor:

| Component | State | Use instead |
|---|---|---|
| `falcon-mobile-number` | DELETED from new UI | `falcon-phone-field` |
| `falcon-multiselect-legacy` | DELETED | `falcon-multi-select` |
| `falcon-stepper-legacy` | DELETED | `falcon-stepper` / `falcon-wizard` |
| `send-credentials-popup` | ORPHAN (source gone) | `falcon-sending-credentials-dialog` |
| `falcon-calendar-legacy` | ORPHAN (only in deprecated repo) | `falcon-date-picker` |
| `falcon-organization-hierarchy-tree-tw` | no production consumer | `falcon-tree-panel` |
| `falcon-toast` (component) | `@deprecated` | `FalconNotificationService` (new code); `FalconMessageService`+`message-host` still live for legacy path |

---

## 4. Cross-cutting findings (dossier drift the build surfaced)

The 9-layer build cross-checked every dossier against live source and caught stale documentation:
- `falcon-icon` — dossiers said "122 icons"; the live registry (`falcon-icons.css`) carries **~322**.
- `falcon-button` — a 6th `dashed` variant exists in source, absent from the old API dossier.
- `falcon-input-number` — `GAPS_AND_UPGRADES.md` G5 ("no `state` input") is stale; the input exists.
- `falcon-filter-panel` — old gap "no `role`" is closed; `role="search"` shipped in the `-tw` variant.
- `falcon-table` — the FT-01 PrimeIcon P0 gap is already fixed in the canonical `-tw` render path.
- `falcon-combobox` — a 250 ms debounce exists in source despite dossiers saying "not built in".

These corrections are recorded inside the new `INTEGRATION_VALIDATION.md` files (old 6 files left untouched).

---

## 5. Enhancement backlog (what would make the library stronger)

Recurring upgrade opportunities pulled from the dossiers' `GAPS_AND_UPGRADES` + new layers:
- **Wrapper API parity** — several Stencil cores expose `@Method()`s / props the Angular wrapper does not bridge (`calendar` setValue/navigate, `date-picker` open/close, `badge`/`empty-state` `ariaLabel`, `data-table` `density`).
- **A11y** — consistent `ariaLabel` pass across display components; `otp` wrapper should re-emit the `falcon-complete` event.
- **Stale-doc guard** — wire the dossiers into the `brain-audit` scanner so a source change flags the dossier for refresh.
- **Recognition coverage** — extend `RECOGNITION.md` cross-library maps as new design systems appear in incoming designs.

---

## 6. How to use this knowledge base

1. **Design/screenshot → component** — match the design's region against `RECOGNITION.md` fingerprints (or `brain search "<feature>"`); the cross-library map names the Falcon component.
2. **Build it right** — the component's `BUSINESS.md` (rules it must honor) + `INTEGRATION_VALIDATION.md` (backend wiring, V-rules, PES) + the composition recipe in `RECOGNITION.md`.
3. **Find a precedent** — `COMPONENT_PAGE_MODULE_MAP.md` shows a working page that already uses it.
4. **Score parity** — Falcon Eyes compares a screenshot of the built result vs the reference design; the dossier is the "what it should be" spec.

---

*Falcon Component Library Conclusion · 62 components · 9-file dossiers · generated 2026-05-18.*
