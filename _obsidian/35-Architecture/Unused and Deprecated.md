*** Architecture Rule Set — Unused and Deprecated ***
*** SoT: Brain Outputs/understanding/frontend/architecture/UNUSED_AND_DEPRECATED_COMPONENTS.md ***
*** Indexed 2026-05-15 by Brain SK Phase 3F ***

# Unused and Deprecated

> Three buckets from the usage matrix: (1) Truly unused — built, exported, zero consumers (13); (2) Lab-only — playground/showcase only (24); (3) Deprecated — explicit `@deprecated` annotation (2: dialog + toast). Legacy bespoke also flagged: 2 delete-safe (calendar façade, multiselect), 3 needs-migration (stepper, mobile-number, photo-uploader).

## Source-of-truth file
- [UNUSED_AND_DEPRECATED_COMPONENTS](../../outputs/understanding/frontend/architecture/UNUSED_AND_DEPRECATED_COMPONENTS.md)

## Key rules extracted

| Rule id | Rule (one-line) | Severity | Cited file/line |
|---|---|---|---|
| AR-deprecated-01 | `<falcon-angular-dialog>` is `@deprecated` — prefer `<falcon-angular-popup>` for action-required flows. Kept for custom-slotted use cases (send-credentials-popup) until slot-friendly popup variant lands. | high | `libs/falcon/src/shared-ui/index.ts` |
| AR-deprecated-02 | `<falcon-angular-toast>` + `<falcon-angular-toast-host>` are `@deprecated` — prefer `<falcon-angular-notification>` for new code. Kept for the `FalconMessageService` queue until refactored. | high | `libs/falcon/src/shared-ui/index.ts` |
| AR-deprecated-03 | `<falcon-calendar>` façade is DELETE-SAFE (0 consumers) — active code uses `<falcon-angular-calendar>` Stencil or `<falcon-angular-date-picker>`. | medium | grep |
| AR-deprecated-04 | `<falcon-multiselect>` legacy is DELETE-SAFE (0 consumers) — fully replaced by `<falcon-angular-multi-select>`. | medium | grep |
| AR-deprecated-05 | `<falcon-stepper>` legacy (PrimeNG-shaped, with `FalconStepDirective` + `FalconStepperFooterDirective`) is the highest-impact migration target — 4 wizard hosts to convert simultaneously to `<falcon-angular-stepper>`. | high | wizard host grep |
| AR-deprecated-06 | `<falcon-mobile-number>` legacy is the second migration target — 5 files (forgot-password + 4 wizards) → `<falcon-angular-phone-field>`. | high | grep |
| AR-deprecated-07 | `<falcon-photo-uploader>` legacy is the third migration target — 6 wizard step files → `<falcon-angular-single-uploader>` (previewMode='thumbnail'). | high | grep |

## Readiness scoring (suggested)

| Tier | Count | Examples |
|---|---|---|
| READY (real-feature consumer + stable API) | 13 | button, confirm-dialog, data-table, drawer, dropdown, input, multi-select, otp, password, radio-group, search-input, tabs, popup |
| READY-LAB (showcase + stable API + no consumer) | 22 | accordion, calendar, checkbox, date-picker, email-field, notification, phone-field, single-uploader, stepper, switch, textarea, tooltip, tree, tree-table, uploader, paginator, etc. |
| DEPRECATED (`@deprecated` flag + migration target) | 2 | dialog → popup, toast → notification |
| NEEDS-CONSUMER-MIGRATION (legacy bespoke → Stencil wrapper) | 3 | stepper, mobile-number, photo-uploader |
| DELETE-SAFE (0 consumers + legacy) | 2 | calendar façade, multiselect legacy |
| PROMOTION-CANDIDATE (Light-only or bespoke → paired Shadow+Light) | 2 | tree-panel, organization-hierarchy-tree-tw |

## Forbidden patterns (in new code)
- Importing `<falcon-angular-dialog>` for new flows (deprecated).
- Importing `<falcon-angular-toast>` for new flows (deprecated).
- Importing `<falcon-calendar>` façade (delete-safe — use `<falcon-angular-date-picker>`).
- Importing `<falcon-multiselect>` legacy (delete-safe — use `<falcon-angular-multi-select>`).
- Wiring new wizards with `<falcon-stepper>` legacy (use `<falcon-angular-stepper>`).
- Wiring new mobile-number fields with `<falcon-mobile-number>` legacy (use `<falcon-angular-phone-field>`).
- Wiring new photo uploaders with `<falcon-photo-uploader>` (use `<falcon-angular-single-uploader>`).

## Action checklist (next migration wave)
1. Migrate `<falcon-stepper>` (legacy) → `<falcon-angular-stepper>` in 4 wizard hosts (highest-impact win).
2. Migrate `<falcon-mobile-number>` → `<falcon-angular-phone-field>` in 5 files.
3. Migrate `<falcon-photo-uploader>` → `<falcon-angular-single-uploader>` in 6 wizard step files.
4. Replace topbar/sidebar inline SVG icons with `<falcon-angular-icon>` (vendored Falcon icon font).
5. Adopt `<falcon-angular-popup>` for at least one delete-confirmation flow.
6. Delete `<falcon-calendar>` façade + `<falcon-multiselect>` legacy.
7. Decide on `<falcon-angular-select>` redundancy vs dropdown.
8. Migrate `FalconMessageService.add()` callsites → `<falcon-angular-notification>`; deprecate toast queue.

## Related component notes
- [[Falcon Dialog]] · [[Falcon Toast]] — deprecated.
- [[Falcon Popup]] · [[Falcon Notification]] — preferred replacements.
- [[Falcon Stepper Legacy]] · [[Falcon Stepper]] — migration pair.
- [[Falcon Mobile Number]] · [[Falcon Phone Field]] — migration pair.
- [[Falcon Calendar Legacy]] · [[Falcon Multiselect Legacy]] — delete-safe.

## Hubs
- [[FRONTEND_INDEX]] · [[COMPONENT_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]]
