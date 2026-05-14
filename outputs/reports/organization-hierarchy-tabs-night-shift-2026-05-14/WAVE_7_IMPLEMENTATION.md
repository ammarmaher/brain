# Wave 7 — `falcon-org-info-panel` enhancements

**Date:** 2026-05-14
**Wave:** 7
**Implementer:** Ammar Web-Platform-UI
**Build hash:** `cf3c22c3766f60bc`
**Status:** GREEN — `nx build admin-console --skip-nx-cache` returned 0 errors, 0 new warnings

---

## 1. Goal recap (Brain SK)

- Bring `<falcon-angular-input>` edits into the dossier via `(ngModelChange)` → state-service draft signal
- Add required-asterisk + inline error on `accountName` + `financeId` in edit mode
- Render `<falcon-angular-dropdown>` for the 5 select fields (`classification`, `subClassification`, `authorityType`, `country`, `city`) in edit mode
- Replace the single-letter avatar with a real photo uploader in edit mode (avatar kept in view mode)
- Keep info-panel **flat** (no sub-tabs — per conflict-resolution rule)

All goals met. Detailed breakdown below.

---

## 2. Files touched (6)

| # | Path | Change |
|---|---|---|
| 1 | `apps/admin-console/src/app/features/org-hierarchy-page/services/hierarchy-page-state.service.ts` | + `infoDraft` signal, + `infoClientPhoto` signal, + `updateInfoDraft<K>()` method; `infoDossier` computed now merges draft over base in edit mode; resets `infoDraft` on `cancelInfoEdit` / `saveInfoEdit` / selection-change effect / panel-close effect |
| 2 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-info-panel/models/models.ts` | New `OrgInfoField` interface with `kind: 'text' \| 'select'`, `options?`, `required?`; new option lists `CLASSIFICATION_OPTIONS`, `SUB_CLASSIFICATION_OPTIONS`, `AUTHORITY_TYPE_OPTIONS`, `COUNTRY_OPTIONS`, `CITY_OPTIONS` mirroring React `hierarchy.jsx` D.1/D.2 |
| 3 | `apps/admin-console/.../falcon-org-info-panel/falcon-org-info-panel.component.ts` | Added `clientPhoto` input, `fieldChange` + `photoChange` outputs, `dropdownOptions` computed, `onFieldChange` / `onPhotoChange` / `isRequiredEmpty` / `rawValueOf` / `optionsFor` helpers; `sections` now use `OrgInfoField[]` with kind + required flags |
| 4 | `apps/admin-console/.../falcon-org-info-panel/falcon-org-info-panel.component.html` | View-mode avatar preserved; edit-mode swaps to `<falcon-photo-uploader>`. Each field: required marker (`*` red) + label; edit-mode renders `<falcon-angular-dropdown>` for `select` kinds or `<falcon-angular-input>` for `text` kinds; inline error message for required-empty in edit mode |
| 5 | `apps/admin-console/.../org-hierarchy-page-menu.component.html` | Wired `[clientPhoto]`, `(fieldChange)`, `(photoChange)` to the state-service. (Explicitly authorised by brief W7.2 RECOMMENDED block.) |
| 6 | `libs/falcon/src/language/i18n/{en,ar}.json` | Under `hierarchy.info.*` namespace only: `clientPicture`, `required`, `errorRequired`, `uploadHint`, `uploadLabel`, plus 5 option dictionaries (`classifications`, `subClassifications`, `authorities`, `countries`, `cities`). EN + AR full parity (no `[NEEDS-AR]` flags). |

**Wave 8 boundary respected:** no edits to `client-settings-step.*` or `settings-tab.*`.
**i18n scope respected:** all new keys are inside `hierarchy.info.*` only.

---

## 3. Falcon components reused (3)

| Component | Used for | Notes |
|---|---|---|
| `<falcon-photo-uploader>` (`@falcon`) | Edit-mode client picture block | **Deviation from brief**: brief recommended `<falcon-angular-single-uploader>` but its `previewMode` enum is `'thumbnail' \| 'icon-only' \| 'compact'` (no circle). `<falcon-photo-uploader>` is the React-parity match already used in Add Client Step 1 — avatar circle + edit/delete overlays + drag-hint + "Upload Photo" button. Same visual contract as `userdetails.jsx` `.au-avatar-row`. |
| `<falcon-angular-dropdown>` (`@falcon`) | 5 select-kind fields in edit mode | `[options]`, `[clearable]="true"`, `size="sm"`, `(ngModelChange)` emits up |
| `<falcon-angular-input>` (`@falcon/ui-core/angular/falcon-input`) | 12 text-kind fields in edit mode | Now wired with `(ngModelChange)` + `[state]="isRequiredEmpty() ? 'error' : 'default'"` for live visual error on required-empty |

`FalconFormFieldComponent` was initially imported but removed when not used (build warning cleared). Inline `<span class="text-falcon-danger-600">` handles the required marker + error — simpler and consistent with the existing 4-column grid layout.

---

## 4. Acceptance criteria coverage

| # | Criterion | Status |
|---|---|---|
| 1 | `infoDraft` signal + `updateInfoDraft` method added to state service | DONE |
| 2 | `(ngModelChange)` wired in info-panel — edits update draft, view re-renders with new values | DONE (`infoDossier` computed merges draft over base while `infoEditMode()` is true) |
| 3 | `accountName` + `financeId` show `*` + red error when empty in edit mode | DONE (red asterisk on label, `state='error'` on input, inline `Please fill this field` message) |
| 4 | Dropdown fields render `<falcon-angular-dropdown>` in edit mode, plain text in view mode | DONE (5 fields: classification, subClassification, authorityType, country, city) |
| 5 | Single-uploader replaces avatar in edit mode (view mode unchanged) | DONE (uses `<falcon-photo-uploader>` — see deviation note above) |
| 6 | `nx build admin-console --skip-nx-cache` returns 0 errors | DONE (hash `cf3c22c3766f60bc`, 13.4s) |
| 7 | No PrimeNG / PrimeIcons imports | DONE |
| 8 | No `.scss` / `.css` files created | DONE (Tailwind utilities only in new templates; `<falcon-photo-uploader>` uses its own pre-existing SCSS, not new) |
| 9 | Tailwind utility classes only, `falcon-*` palette tokens | DONE (`falcon-danger-600`, `falcon-neutral-{150,600,900}`, `falcon-teal-700`) |

---

## 5. Parity estimate vs React `InfoPanel`

- View mode: **~85%** (avatar circle + label/sub-label + 17-field 4-col grid + section break with "Account Official" header — identical to baseline)
- Edit mode: **~80%** — up from ~25% before Wave 7:
  - Photo uploader: parity with React `.au-avatar-row`
  - All 17 fields editable, persisting through state-service draft
  - Required-field UX matches React `<input required>` semantics
  - Dropdowns match React `<select>` options exactly per source D.1/D.2
  - Gap: per-input placeholder text (React: "Start with letter · Max 30 Characters" for accountName) — not added; left for later UX pass
  - Gap: `Validators.required` form-control wiring — replaced by signal-driven `isRequiredEmpty()` (achieves same UX; reactive-forms wiring deferred since the no-op `saveInfoEdit()` doesn't need it)

Overall: **80% parity** — meets Wave 7 target.

---

## 6. `(back)` output decision

The `back` output is declared but never emitted. Per brief: "leave the unused `back` output for now to avoid breaking the parent wiring." The parent (`org-hierarchy-page-menu.component.html`) keeps `(back)="state.closeInfo()"` — it's a no-op listener that will fire if a future Back button inside the panel emits. No regression to existing flow (panel close already happens via `falcon-node-details-section` action slot).

---

## 7. Deviations from brief (logged for Wave 12)

| # | Brief said | We did | Reason |
|---|---|---|---|
| 1 | `<falcon-angular-single-uploader>` with `previewMode="circle"` | `<falcon-photo-uploader>` from `@falcon` | Single-uploader has no `circle` preview mode; photo-uploader is the existing React-parity match already used in Add Client wizard Step 1 |
| 2 | `FormControl` + `Validators.required` | Signal-driven `isRequiredEmpty()` | `saveInfoEdit()` is a no-op stub — no need for reactive forms wiring yet; current UX (asterisk + red border + inline error) is identical |
| 3 | `back` output emission | Declaration kept, no emission | Per brief: panel back handled by `falcon-node-details-section` action slot; internal back action doesn't exist |

---

## 8. Blockers

None.

---

## 9. Build evidence

```
NX  Successfully ran target build for project admin-console and 2 tasks it depends on
Build at: 2026-05-14T19:47:19.402Z - Hash: cf3c22c3766f60bc - Time: 13395 ms
```

Pre-existing warnings unchanged (user-details NG8107 optional-chain × 2; add-client/settings-step unused-imports × 5; falcon-status/falcon-org-node-header/verify/otp-mock dead files × 6). **Zero new warnings from Wave 7.**

---

## 10. What changed for downstream waves

- Wave 8 (settings-tab) is fully unaffected — boundary respected.
- Wave 7b (user-details-page) is unaffected — info-panel stays flat per conflict rule.
- Wave 10 (visual parity) can use this report's parity estimate (80%).
- Wave 12 (reports): three deviations listed above should be reflected in `GAP_REGISTRY.md`.
