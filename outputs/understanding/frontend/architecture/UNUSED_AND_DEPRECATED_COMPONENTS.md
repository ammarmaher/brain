# Unused & Deprecated Components

Distilled from `COMPONENT_USAGE_MATRIX.md`. Three buckets:

1. **Truly unused** — built, exported, never consumed (anywhere).
2. **Lab-only** — only in playground/showcase, no real feature consumer.
3. **Deprecated** — explicit `@deprecated` annotation or memory note; migration target identified.

---

## 1. Truly unused Stencil-backed Angular wrappers (13)

Built and exported but zero non-playground consumers. Suggested action: keep available (they're library surface), but Brain SK should flag them as "stable but no consumer" so consumers can adopt without surprises.

| Component | Wrapper folder | Stencil folder(s) | Recommended next step |
|---|---|---|---|
| `<falcon-angular-avatar>` | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-avatar/` | `components/falcon-avatar/` + `falcon-avatar-tw/` | Add to topbar user-chip + sidebar (currently inline SVG / `<div>` initials). |
| `<falcon-angular-badge>` | `falcon-badge/` | `falcon-badge/` + `falcon-badge-tw/` | Use in dashboard KPI tiles when dashboard ships. Note distinct from `falcon-tag` (status pill) and `falcon-status-badge` (workflow state). |
| `<falcon-angular-card>` | `falcon-card/` | `falcon-card/` + `falcon-card-tw/` | Wrap repeating `bg-white border border-falcon-neutral-200 rounded-xl shadow-sm` blocks in topbar / playground status board. |
| `<falcon-angular-combobox>` | `falcon-combobox/` | `falcon-combobox/` + `falcon-combobox-tw/` | Use in client-information-step where free-text + selectable values are needed (currently dropdown only). |
| `<falcon-angular-empty-state>` | `falcon-empty-state/` | `falcon-empty-state/` + `falcon-empty-state-tw/` | Wire into data-table empty-state slot, applications-table when 0 results, errors page. |
| `<falcon-angular-filter-panel>` | `falcon-filter-panel/` | `falcon-filter-panel/` + `falcon-filter-panel-tw/` | Use for the org-hierarchy filters strip currently hand-rolled in the menu component. |
| `<falcon-angular-grid-input>` | `falcon-grid-input/` | `falcon-grid-input/` + `falcon-grid-input-tw/` | Plug into `<falcon-angular-data-table>` cell editing slot — `gate-09-a11y-baseline` already exempts it as a host-managed a11y context. |
| `<falcon-angular-icon>` | `falcon-icon/` | `falcon-icon/` + `falcon-icon-tw/` | Replace inline SVG icons in topbar / sidebar / menu chrome. Already vendored icon font available. |
| `<falcon-angular-input-number>` | `falcon-input-number/` | `falcon-input-number/` + `falcon-input-number-tw/` | Use in client-settings-step numeric fields (limits, quotas). |
| `<falcon-angular-menu>` | `falcon-menu/` | `falcon-menu/` + `falcon-menu-tw/` | Replace per-row 3-dot menu currently hand-rolled inside tree-panel. **NEW in Revamp v3.1** — high-value adoption target. |
| `<falcon-angular-select>` | `falcon-select/` | (Stencil `falcon-select` exists — Light DOM only?) | Lightweight `<select>` styled wrapper. Possibly redundant with dropdown — investigate. |
| `<falcon-angular-status-badge>` | `falcon-status-badge/` | `falcon-status-badge/` + `falcon-status-badge-tw/` | Use for workflow-state pills (Active / Suspended / Pending) in applications-table. Currently hand-rolled `<span class="px-2.5 py-1 rounded-full ...">`. |
| `<falcon-angular-tag>` | `falcon-tag/` | `falcon-tag/` + `falcon-tag-tw/` | Severity pills (success/info/warning/warn/danger/secondary/contrast). Replaces hand-rolled status spans. |
| `<falcon-angular-wizard>` | `falcon-wizard/` | `falcon-wizard/` + `falcon-wizard-tw/` | The four active wizards (add-client/add-user × admin/mgmt) DON'T use this — they hand-roll the stepper + step containers. Migrating would centralise wizard chrome. |

---

## 2. Lab-only Stencil-backed wrappers (24)

Built + showcased but no real-feature consumer outside playground/showcase. These represent the "Angular wave-3 deliverables awaiting consumer adoption" backlog.

| Component | Recommended consumer |
|---|---|
| `<falcon-angular-accordion>` | Settings-tab grouped settings, FAQ-style help drawer. |
| `<falcon-angular-calendar>` | Inline calendar — `<falcon-angular-date-picker>` already composes this internally, so direct consumer rare. |
| `<falcon-angular-checkbox>` | Form fields needing single boolean. Today most forms hand-roll via `<input type=checkbox>`. |
| `<falcon-angular-checkbox-group>` | Multi-select with full visibility — alternative to multi-select dropdown for ≤5 options. |
| `<falcon-angular-date-picker>` | Date-fields in wizards (DOB, effective date) currently use legacy `<falcon-calendar>` façade. |
| `<falcon-angular-dialog>` | **DEPRECATED** — use popup instead. |
| `<falcon-angular-email-field>` | Email input with verify button — should replace plain `<falcon-angular-input type=email>` in auth flows + user wizards. |
| `<falcon-angular-notification>` | Async-action results, validation feedback panels. Should gradually replace toast for non-transient messages. |
| `<falcon-angular-otp-send-dialog>` | Two-step OTP modal — should replace the current hand-rolled OTP-send flow in forgot-password / enter-otp pages. |
| `<falcon-angular-paginator>` | Already composed inside `<falcon-angular-data-table>` — direct consumer rare. |
| `<falcon-angular-phone-field>` | Should replace `<falcon-mobile-number>` legacy in 5 files (wizards + forgot-password). |
| `<falcon-angular-radio>` | Single radio button — most flows use radio-group. |
| `<falcon-angular-single-uploader>` | Avatar + signature uploaders — should replace `<falcon-photo-uploader>` legacy in 6 wizard files. |
| `<falcon-angular-stepper>` | Wizards — should replace `<falcon-stepper>` legacy in 4 files. **HIGH PRIORITY** — main migration target. |
| `<falcon-angular-switch>` | Settings toggles — currently hand-rolled with `<input type=checkbox role=switch>`. |
| `<falcon-angular-table>` | Lower-level than `<falcon-angular-data-table>` — direct consumer rare; data-table is the convenience wrapper. |
| `<falcon-angular-textarea>` | Description fields, multi-line inputs. Today none. |
| `<falcon-angular-toast>` | **DEPRECATED** — use notification instead. The `FalconMessageService` queue still emits toasts, but should migrate to notification stack. |
| `<falcon-angular-tooltip>` | Icon-button labels in topbar / sidebar. Currently `[attr.aria-label]` only. |
| `<falcon-angular-tree>` | Should be composed inside `<falcon-tree-panel>` chrome — currently the tree-panel hand-rolls recursion. |
| `<falcon-angular-tree-table>` | Hierarchical wallet/charges tables — no consumer yet. |
| `<falcon-angular-uploader>` | Multi-file uploads (attachments) — no consumer yet. |
| `<falcon-angular-popup>` | The PREFERRED confirm-flow primitive — needs adoption beyond showcase. |
| `<falcon-angular-confirm-dialog>` | Used as a layout-level slot today; should be invoked from feature components for delete confirmations etc. |

---

## 3. Deprecated Stencil-backed wrappers (2)

Both have explicit `@deprecated` annotations in `libs/falcon/src/shared-ui/index.ts`.

| Component | Deprecation | Migration target |
|---|---|---|
| `<falcon-angular-dialog>` | `@deprecated Prefer <falcon-angular-popup> for action-required flows. Kept for custom-slotted use cases (e.g. forms inside a dialog shell — send-credentials-popup) until a slot-friendly Popup variant lands.` | `<falcon-angular-popup>` (variants: error/delete/unsaved/save). Slot-friendly popup variant is queued. |
| `<falcon-angular-toast>` + `<falcon-angular-toast-host>` | `@deprecated Prefer <falcon-angular-notification> for new code. Toast is kept for the existing FalconMessageService queue (drop-in MessageService + p-toast replacement) until the queue is migrated to the notification stack.` | `<falcon-angular-notification>` + `FalconAngularNotificationStackComponent`. Requires `FalconMessageService` queue refactor. |

---

## 4. Legacy bespoke Angular components (under `libs/falcon/src/shared-ui/lib/components/`)

| Component | Status | Real-feature use sites | Migration target |
|---|---|---|---|
| `<falcon-calendar>` (façade) | **Unused** | 0 | Delete the façade. Active code uses `<falcon-angular-calendar>` and `<falcon-angular-date-picker>` directly. |
| `<falcon-form-field>` | **HEAVY use** | 131 occurrences × 11 files (admin + mgmt wizards) | Long-term: bake `label` + `required` + `error` into every Falcon input wrapper (proposed in UPGRADE_CANDIDATES.md). Short-term: keep. |
| `<falcon-mobile-number>` | **Used** | 5 files (forgot-password + 4 wizards) | Migrate to `<falcon-angular-phone-field>`. |
| `<falcon-multiselect>` (legacy) | **Unused** | 0 | Delete. Fully replaced by `<falcon-angular-multi-select>`. |
| `<falcon-photo-uploader>` | **Used** | 6 files (wizards) | Migrate to `<falcon-angular-single-uploader>` (previewMode='thumbnail'). |
| `<falcon-stepper>` (PrimeNG-shaped wrapper with `FalconStepDirective` + `FalconStepperFooterDirective`) | **HEAVY use** | 4 files (4 wizards) | Migrate to `<falcon-angular-stepper>` (Stencil). Big-bang task — 4 wizard hosts simultaneously. |
| `<falcon-tree-panel>` | **Used** | 4 files (org-hierarchy menus) | Promote to a paired Shadow+Light Stencil component once stable. |
| `<send-credentials-popup>` | **Lab-only** | 0 (only playground) | Refactor to compose `<falcon-angular-popup>` once slot-friendly variant lands. Currently uses `<falcon-angular-dialog>`. |

---

## 5. Stencil-direct tag (no Angular wrapper)

| Component | Status | Notes |
|---|---|---|
| `<falcon-organization-hierarchy-tree-tw>` | **Used** (verify with org-hierarchy chart components — high-confidence based on memory) | Light-DOM only. Shadow companion not shipped. Used in both consoles' org-hierarchy chart implementations. Likely candidate for promotion to paired Shadow+Light once stable. |

---

## Brain SK consumer-readiness scoring suggestion

For Agent 7's COMPONENT-readiness work, here is a suggested 3-tier scoring:

- **READY** — has real-feature consumer + no `@deprecated` flag + stable API. **13 wrappers** qualify.
- **READY-LAB** — in showcase + has stable API + just no consumer yet. Adoption-only effort, no source change. **22 wrappers** qualify.
- **DEPRECATED** — flagged `@deprecated`, migration target identified. **2 wrappers** qualify.
- **NEEDS-CONSUMER-MIGRATION** — legacy bespoke that should be migrated to a Stencil wrapper. **3 legacy components** qualify (stepper, mobile-number, photo-uploader).
- **DELETE-SAFE** — zero consumers + legacy. **2 legacy components** qualify (multiselect, calendar façade).
- **PROMOTION-CANDIDATE** — works as Stencil Light-DOM only or as bespoke Angular; should be promoted to paired Shadow+Light. **2 components** qualify (tree-panel, organization-hierarchy-tree-tw).
- **NEW-COMPONENT-PROPOSAL** — capability needed but no component exists. **1+** (see UPGRADE_CANDIDATES.md — e.g. slot-friendly popup variant).

---

## Action checklist for next migration wave

1. **Migrate `<falcon-stepper>` (legacy) → `<falcon-angular-stepper>` (Stencil)** in 4 wizard hosts. Highest-impact win.
2. **Migrate `<falcon-mobile-number>` → `<falcon-angular-phone-field>`** in 5 files.
3. **Migrate `<falcon-photo-uploader>` → `<falcon-angular-single-uploader>`** in 6 wizard step files.
4. **Replace hand-rolled topbar/sidebar inline SVG icons with `<falcon-angular-icon>`** to test icon font integration. Memory: Falcon icon font ships in `libs/falcon-theme/src/styles/falcon-icons.css`.
5. **Adopt `<falcon-angular-popup>`** for at least one delete-confirmation flow in admin-console wizards.
6. **Delete unused legacy:** `<falcon-calendar>` façade + `<falcon-multiselect>` legacy.
7. **Decide on `<falcon-angular-select>` redundancy** — does it duplicate `<falcon-angular-dropdown>`? If yes, deprecate.
8. **Migrate `FalconMessageService.add()` callsites to emit `<falcon-angular-notification>` instead of `<falcon-angular-toast>`.** Then deprecate toast queue.
