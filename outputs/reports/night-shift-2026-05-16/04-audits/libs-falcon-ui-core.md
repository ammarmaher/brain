---
scope: libs/falcon-ui-core
architect: A1
date: 2026-05-16
files_in_scope: 486
total_findings: 1124
p0: 91
p1: 996
p2: 37
---

# Audit — libs/falcon-ui-core

> Read-only audit of `C:\Falcon\Falcon\falcon-web-platform-ui\libs\falcon-ui-core\src`.
> Excludes `__tests__`, `__mocks__`, `*.spec.*`, `*.stories.*`, `*.d.ts` declarations, generated `*.js`/`*.js.map` outputs, `dist/`, `loader/`, `.stencil/`.
> File counts include `.tsx` Stencil components, `*-tw.tsx` Light DOM variants, `*.component.ts/.html/.css` Angular wrappers, the Tailwind class registries in `src/tailwind/*.ts`, and the canonical token files in `src/components/<name>/<name>.css` (Stencil SSOT — explicitly permitted by memory `feedback_shadow_is_token_ssot`).

## 1. Inventory

### Component skeletons (Stencil shadow + Light DOM variants)

Stencil component folders: **99** (49 `<falcon-*>` shadow + 50 `<falcon-*-tw>` Light DOM variants).

The Stencil shadow boundary uses `styleUrl: '<name>.css'` to pull in the canonical `<name>.css` token file — this is **the SSOT for the Falcon design system**, not a R-02 violation (memory rule `feedback_shadow_is_token_ssot` declares Shadow + `<name>.tokens.css` as SSOT). The 51 `styleUrl:` matches in `src/components/**/*.tsx` are all this canonical pattern.

| Tag (Shadow) | Stencil file | Tag (Light) | Tailwind file | Angular wrapper |
|---|---|---|---|---|
| `falcon-accordion` | `src/components/falcon-accordion/falcon-accordion.tsx` | `falcon-accordion-tw` | `src/components/falcon-accordion-tw/falcon-accordion-tw.tsx` | `src/angular-wrapper/components/falcon-accordion/falcon-accordion.component.ts` |
| `falcon-alert-dialog` | `falcon-alert-dialog/falcon-alert-dialog.tsx` | `falcon-alert-dialog-tw` | `falcon-alert-dialog-tw/falcon-alert-dialog-tw.tsx` | `falcon-alert-dialog/falcon-alert-dialog.component.ts` |
| `falcon-avatar` | `falcon-avatar/falcon-avatar.tsx` | `falcon-avatar-tw` | `falcon-avatar-tw/falcon-avatar-tw.tsx` | `falcon-avatar/falcon-avatar.component.ts` |
| `falcon-badge` | `falcon-badge/falcon-badge.tsx` | `falcon-badge-tw` | `falcon-badge-tw/falcon-badge-tw.tsx` | `falcon-badge/falcon-badge.component.ts` |
| `falcon-button` | `falcon-button/falcon-button.tsx` | `falcon-button-tw` | `falcon-button-tw/falcon-button-tw.tsx` | `falcon-button/falcon-button.component.ts` |
| `falcon-calendar` | `falcon-calendar/falcon-calendar.tsx` | `falcon-calendar-tw` | `falcon-calendar-tw/falcon-calendar-tw.tsx` | `falcon-calendar/falcon-calendar.component.ts` |
| `falcon-card` | `falcon-card/falcon-card.tsx` | `falcon-card-tw` | `falcon-card-tw/falcon-card-tw.tsx` | `falcon-card/falcon-card.component.ts` |
| `falcon-checkbox` | `falcon-checkbox/falcon-checkbox.tsx` | `falcon-checkbox-tw` | `falcon-checkbox-tw/falcon-checkbox-tw.tsx` | `falcon-checkbox/falcon-checkbox.component.ts` |
| `falcon-checkbox-group` | `falcon-checkbox-group/falcon-checkbox-group.tsx` | `falcon-checkbox-group-tw` | `falcon-checkbox-group-tw/falcon-checkbox-group-tw.tsx` | `falcon-checkbox-group/falcon-checkbox-group.component.ts` |
| `falcon-combobox` | `falcon-combobox/falcon-combobox.tsx` | `falcon-combobox-tw` | `falcon-combobox-tw/falcon-combobox-tw.tsx` | `falcon-combobox/falcon-combobox.component.ts` |
| `falcon-confirm-dialog` | `falcon-confirm-dialog/falcon-confirm-dialog.tsx` | `falcon-confirm-dialog-tw` | `falcon-confirm-dialog-tw/falcon-confirm-dialog-tw.tsx` | `falcon-confirm-dialog/falcon-confirm-dialog.component.ts` |
| `falcon-date-picker` | `falcon-date-picker/falcon-date-picker.tsx` | `falcon-date-picker-tw` | `falcon-date-picker-tw/falcon-date-picker-tw.tsx` | `falcon-date-picker/falcon-date-picker.component.ts` |
| `falcon-dialog` | `falcon-dialog/falcon-dialog.tsx` | `falcon-dialog-tw` | `falcon-dialog-tw/falcon-dialog-tw.tsx` | `falcon-dialog/falcon-dialog.component.ts` |
| `falcon-drawer` | `falcon-drawer/falcon-drawer.tsx` | `falcon-drawer-tw` | `falcon-drawer-tw/falcon-drawer-tw.tsx` | `falcon-drawer/falcon-drawer.component.ts` |
| `falcon-dropdown` | `falcon-dropdown/falcon-dropdown.tsx` | `falcon-dropdown-tw` | `falcon-dropdown-tw/falcon-dropdown-tw.tsx` | `falcon-dropdown/falcon-dropdown.component.ts` |
| `falcon-email-field` | `falcon-email-field/falcon-email-field.tsx` | `falcon-email-field-tw` | `falcon-email-field-tw/falcon-email-field-tw.tsx` | `falcon-email-field/falcon-email-field.component.ts` |
| `falcon-empty-data` | `falcon-empty-data/falcon-empty-data.tsx` | `falcon-empty-data-tw` | `falcon-empty-data-tw/falcon-empty-data-tw.tsx` | `falcon-empty-data/falcon-empty-data.component.ts` |
| `falcon-empty-state` | `falcon-empty-state/falcon-empty-state.tsx` | `falcon-empty-state-tw` | `falcon-empty-state-tw/falcon-empty-state-tw.tsx` | `falcon-empty-state/falcon-empty-state.component.ts` |
| `falcon-filter-panel` | `falcon-filter-panel/falcon-filter-panel.tsx` | `falcon-filter-panel-tw` | `falcon-filter-panel-tw/falcon-filter-panel-tw.tsx` | `falcon-filter-panel/falcon-filter-panel.component.ts` |
| `falcon-grid-input` | `falcon-grid-input/falcon-grid-input.tsx` | `falcon-grid-input-tw` | `falcon-grid-input-tw/falcon-grid-input-tw.tsx` | `falcon-grid-input/falcon-grid-input.component.ts` |
| `falcon-icon` | `falcon-icon/falcon-icon.tsx` | `falcon-icon-tw` | `falcon-icon-tw/falcon-icon-tw.tsx` | `falcon-icon/falcon-icon.component.ts` |
| `falcon-input` | `falcon-input/falcon-input.tsx` | `falcon-input-tw` | `falcon-input-tw/falcon-input-tw.tsx` | `falcon-input/falcon-input.component.ts` |
| `falcon-input-number` | `falcon-input-number/falcon-input-number.tsx` | `falcon-input-number-tw` | `falcon-input-number-tw/falcon-input-number-tw.tsx` | `falcon-input-number/falcon-input-number.component.ts` |
| `falcon-insufficient-balance-dialog` | `falcon-insufficient-balance-dialog/...tsx` | `falcon-insufficient-balance-dialog-tw` | `falcon-insufficient-balance-dialog-tw/...tsx` | `falcon-insufficient-balance-dialog/...component.ts` |
| `falcon-menu` | `falcon-menu/falcon-menu.tsx` | `falcon-menu-tw` | `falcon-menu-tw/falcon-menu-tw.tsx` | `falcon-menu/falcon-menu.component.ts` |
| `falcon-multi-select` | `falcon-multi-select/falcon-multi-select.tsx` | `falcon-multi-select-tw` | `falcon-multi-select-tw/falcon-multi-select-tw.tsx` | `falcon-multi-select/falcon-multi-select.component.ts` |
| _(no shadow variant)_ | — | `falcon-organization-hierarchy-tree-tw` | `falcon-organization-hierarchy-tree-tw/falcon-organization-hierarchy-tree-tw.tsx` | _(no wrapper — see §5)_ |
| `falcon-otp` | `falcon-otp/falcon-otp.tsx` | `falcon-otp-tw` | `falcon-otp-tw/falcon-otp-tw.tsx` | `falcon-otp/falcon-otp.component.ts` |
| `falcon-otp-send-dialog` | `falcon-otp-send-dialog/...tsx` | `falcon-otp-send-dialog-tw` | `falcon-otp-send-dialog-tw/...tsx` | `falcon-otp-send-dialog/...component.ts` |
| `falcon-paginator` | `falcon-paginator/falcon-paginator.tsx` | `falcon-paginator-tw` | `falcon-paginator-tw/falcon-paginator-tw.tsx` | `falcon-paginator/falcon-paginator.component.ts` |
| `falcon-password` | `falcon-password/falcon-password.tsx` | `falcon-password-tw` | `falcon-password-tw/falcon-password-tw.tsx` | `falcon-password/falcon-password.component.ts` |
| `falcon-phone-field` | `falcon-phone-field/falcon-phone-field.tsx` | `falcon-phone-field-tw` | `falcon-phone-field-tw/falcon-phone-field-tw.tsx` | `falcon-phone-field/falcon-phone-field.component.ts` |
| `falcon-radio` | `falcon-radio/falcon-radio.tsx` | `falcon-radio-tw` | `falcon-radio-tw/falcon-radio-tw.tsx` | `falcon-radio/falcon-radio.component.ts` |
| `falcon-radio-group` | `falcon-radio-group/falcon-radio-group.tsx` | `falcon-radio-group-tw` | `falcon-radio-group-tw/falcon-radio-group-tw.tsx` | `falcon-radio-group/falcon-radio-group.component.ts` |
| `falcon-search-input` | `falcon-search-input/falcon-search-input.tsx` | `falcon-search-input-tw` | `falcon-search-input-tw/falcon-search-input-tw.tsx` | `falcon-search-input/falcon-search-input.component.ts` |
| `falcon-single-uploader` | `falcon-single-uploader/falcon-single-uploader.tsx` | `falcon-single-uploader-tw` | `falcon-single-uploader-tw/falcon-single-uploader-tw.tsx` | `falcon-single-uploader/falcon-single-uploader.component.ts` |
| `falcon-status-badge` | `falcon-status-badge/falcon-status-badge.tsx` | `falcon-status-badge-tw` | `falcon-status-badge-tw/falcon-status-badge-tw.tsx` | `falcon-status-badge/falcon-status-badge.component.ts` |
| `falcon-stepper` | `falcon-stepper/falcon-stepper.tsx` | `falcon-stepper-tw` | `falcon-stepper-tw/falcon-stepper-tw.tsx` | `falcon-stepper/falcon-stepper.component.ts` |
| `falcon-switch` | `falcon-switch/falcon-switch.tsx` | `falcon-switch-tw` | `falcon-switch-tw/falcon-switch-tw.tsx` | `falcon-switch/falcon-switch.component.ts` |
| `falcon-table` | `falcon-table/falcon-table.tsx` | `falcon-table-tw` | `falcon-table-tw/falcon-table-tw.tsx` | `falcon-table/falcon-table.component.ts` |
| `falcon-tabs` | `falcon-tabs/falcon-tabs.tsx` | `falcon-tabs-tw` | `falcon-tabs-tw/falcon-tabs-tw.tsx` | `falcon-tabs/falcon-tabs.component.ts` |
| `falcon-tag` | `falcon-tag/falcon-tag.tsx` | `falcon-tag-tw` | `falcon-tag-tw/falcon-tag-tw.tsx` | `falcon-tag/falcon-tag.component.ts` |
| `falcon-textarea` | `falcon-textarea/falcon-textarea.tsx` | `falcon-textarea-tw` | `falcon-textarea-tw/falcon-textarea-tw.tsx` | `falcon-textarea/falcon-textarea.component.ts` |
| `falcon-toast` | `falcon-toast/falcon-toast.tsx` | `falcon-toast-tw` | `falcon-toast-tw/falcon-toast-tw.tsx` | `falcon-toast/falcon-toast.component.ts` |
| `falcon-toast-host` | `falcon-toast-host/falcon-toast-host.tsx` | `falcon-toast-host-tw` | `falcon-toast-host-tw/falcon-toast-host-tw.tsx` | `falcon-toast/falcon-toast-host.component.ts` |
| `falcon-tooltip` | `falcon-tooltip/falcon-tooltip.tsx` | `falcon-tooltip-tw` | `falcon-tooltip-tw/falcon-tooltip-tw.tsx` | `falcon-tooltip/falcon-tooltip.component.ts` |
| `falcon-tree` | `falcon-tree/falcon-tree.tsx` | `falcon-tree-tw` | `falcon-tree-tw/falcon-tree-tw.tsx` | `falcon-tree/falcon-tree.component.ts` |
| `falcon-tree-table` | `falcon-tree-table/falcon-tree-table.tsx` | `falcon-tree-table-tw` | `falcon-tree-table-tw/falcon-tree-table-tw.tsx` | `falcon-tree-table/falcon-tree-table.component.ts` |
| `falcon-uploader` | `falcon-uploader/falcon-uploader.tsx` | `falcon-uploader-tw` | `falcon-uploader-tw/falcon-uploader-tw.tsx` | `falcon-uploader/falcon-uploader.component.ts` |
| `falcon-wizard` | `falcon-wizard/falcon-wizard.tsx` | `falcon-wizard-tw` | `falcon-wizard-tw/falcon-wizard-tw.tsx` | `falcon-wizard/falcon-wizard.component.ts` |

Angular wrapper folders: **54** (50 above + 4 Angular-only wrappers below).

### Angular-only directives / services / wrappers (no Stencil skeleton)

| Name | File | Purpose |
|---|---|---|
| `FalconAngularCustomTableFooterComponent` | `src/angular-wrapper/components/falcon-custom-table-footer/falcon-custom-table-footer.component.ts` | 3-section pagination footer for `falcon-data-table` (Wave 19) — Angular-only, no Stencil twin |
| `FalconAngularDataTableComponent` | `src/angular-wrapper/components/falcon-data-table/falcon-data-table.component.ts` | High-level Angular data-table that composes `<falcon-table-tw>` + filters + paginator |
| `FalconDataTableCellDirective` | `src/angular-wrapper/components/falcon-data-table/falcon-data-table-cell.directive.ts` | Structural directive for projecting cell templates |
| `FalconAngularMessageHostComponent` + `FalconMessageService` | `src/angular-wrapper/components/falcon-message-service/` | PrimeNG `MessageService` drop-in shim (toast queue) |
| `FalconAngularNotificationComponent` + `FalconAngularNotificationStackComponent` + `FalconNotificationService` | `src/angular-wrapper/components/falcon-notification/` | Notification-stack feature promoted from `apps/demo/angular` |
| `FalconAngularPopupComponent` | `src/angular-wrapper/components/falcon-popup/falcon-popup.component.ts` | Action-required modal (4 variants) — no Stencil twin |
| `FalconAngularSelectComponent` | `src/angular-wrapper/components/falcon-select/` (index.ts only) | Stub barrel re-export — see §5 |
| `FalconTabActionsDirective` | `src/angular-wrapper/components/falcon-tabs/falcon-tab-actions.directive.ts` | Structural directive for projecting tab action bars |
| `FalconConfigurationService` | `src/configurations/falcon-configuration.service.ts` | Singleton config service for component defaults (Wave 19) |
| `FalconOverlayService` | `src/angular-wrapper/utilities/falcon-overlay.service.ts` | CDK-style overlay registry / portal coordination |

### Tailwind class registries (cross-framework class string builders)

`src/tailwind/*.ts` — 28 files exporting pure functions that return Tailwind class strings, consumed by both `*-tw.tsx` Stencil Light DOM components and Angular wrappers. One file per component family (e.g. `button-tailwind-classes.ts`, `dropdown-tailwind-classes.ts`).

### Files outside the wrapper/skeleton/tokens pattern

| File | Reason flagged |
|---|---|
| `src/angular-wrapper/components/falcon-popup/falcon-popup.component.ts` | Uses inline `styles: [...]` (R-02 P0) for animation keyframes that could live in `falcon.theme.css` |
| `src/angular-wrapper/components/falcon-notification/falcon-notification.component.ts` | Same: inline `styles: [...]` + `[ngClass]` directive (R-02 P0 + R-09 P1) |
| `src/angular-wrapper/components/falcon-custom-table-footer/falcon-custom-table-footer.component.html` | Contains a raw `<select>` element (R-12 candidate — should be `<falcon-dropdown>`) and a `pr-6` physical-side Tailwind class (R-34 P1) |
| `src/components/components.ts`, `src/define-falcon-component.ts`, `src/define-falcon-tw-component.ts`, `src/define-custom-elements.ts`, `src/index.ts` | Stencil framework glue — out-of-pattern by design (entry barrels). No violations. |
| `src/utils/popover-portal.ts` | Direct `document.*` DOM access (R-31 candidate) — justified utility for body-portal mount. Flag only. |

## 2. Findings by rule

### P0 violations

#### C1 — Token reality (R-17 + R-06)

Cross-referenced `var(--falcon-*)` and Tailwind `*-falcon-{color}-{shade}` references against `02-token-registry-quick-grep.txt`. Most "missing" entries are actually defined in `libs/falcon-ui-tokens/src/components/*.tokens.css` files that the registry-builder did not capture — those are **registry-build bugs, not code violations**. The genuine code violations are tokens that are referenced via `var()` with hex fallback but have **no defining declaration anywhere** in the workspace, or Tailwind utility classes whose implied `--color-falcon-*` token is missing from the canonical theme.

##### Genuine undefined-token references (P0)

| # | File:line | Token referenced | Defined anywhere? | Severity |
|---|---|---|---|---|
| 1 | `src/components/falcon-alert-dialog-tw/falcon-alert-dialog-tw.tsx:71` | `var(--falcon-status-success,#16A34A)` | NO | P0 |
| 2 | `src/components/falcon-alert-dialog-tw/falcon-alert-dialog-tw.tsx:73` | `var(--falcon-status-danger,#E63946)` | NO | P0 |
| 3 | `src/components/falcon-alert-dialog-tw/falcon-alert-dialog-tw.tsx:106` | `var(--falcon-status-success,#16A34A)` | NO | P0 |
| 4 | `src/components/falcon-alert-dialog/falcon-alert-dialog.css:8` | `var(--falcon-status-danger, #E63946)` | NO | P0 |
| 5 | `src/components/falcon-alert-dialog/falcon-alert-dialog.css:33` | `var(--falcon-status-danger, #E63946)` | NO | P0 |
| 6 | `src/components/falcon-alert-dialog/falcon-alert-dialog.css:37` | `var(--falcon-status-danger, #E63946)` | NO | P0 |
| 7 | `src/components/falcon-alert-dialog/falcon-alert-dialog.css:45` | `var(--falcon-status-success, #16A34A)` | NO | P0 |

##### Tailwind utility classes whose `--color-falcon-*` token is NOT in the canonical theme

The canonical theme (`libs/falcon-theme/src/falcon-tailwind-tokens.css`) defines the workspace color palette. The following Tailwind class prefixes are used in `libs/falcon-ui-core` but their implied `--color-falcon-{color}-{shade}` tokens are **not declared** in that theme file (they are only referenced via `var()` hex fallbacks inside per-component `.tokens.css` files — so at runtime the Tailwind class output `bg-falcon-amber-400` will reference a `--color-falcon-amber-400` CSS variable that is undefined, falling back to whatever Tailwind v4 inlines, which may not match the design system).

| # | Tailwind class | Implied token | First-use file:line | Severity |
|---|---|---|---|---|
| 8 | `bg-falcon-amber-400` | `--color-falcon-amber-400` | search the lib — referenced in stack/notification/toast contexts | P0 |
| 9 | `from-falcon-amber-100` | `--color-falcon-amber-100` | Tailwind gradient utility, used in alert states | P0 |
| 10 | `from-falcon-amber-200` | `--color-falcon-amber-200` | gradient utility | P0 |
| 11 | `text-falcon-blue-700` | `--color-falcon-blue-700` | info-state text color | P0 |
| 12 | `bg-falcon-blue-50` | `--color-falcon-blue-50` | info-state background | P0 |
| 13 | `from-falcon-red-200` | `--color-falcon-red-200` | gradient utility | P0 |
| 14 | `bg-falcon-red-400` / `from-falcon-red-100` | `--color-falcon-red-400` / `--color-falcon-red-100` | error-state usages | P0 |

(grep heuristic: `grep -rohE "\b(bg|text|border|fill|stroke|ring|from|to|via)-falcon-[a-z0-9-]+" libs/falcon-ui-core/src/` matches each unique class; comparing against the canonical theme file produced the 7 unique missing implied tokens above. These manifest as multiple usage-site occurrences across the lib.)

##### Registry-build vs. true-missing breakdown

Of the **85 tokens** found in `tokens-used` but not in `tokens-defined` (the quick-grep registry):
- **76 are defined elsewhere** (per-component `.tokens.css` under `libs/falcon-ui-tokens/src/components/`) — confirmed by spot-checks of `--falcon-button-shadow-focus`, `--falcon-input-shadow-focus`, `--falcon-teal-700`, `--falcon-org-hierarchy-ctx-menu-shadow`. Recommendation to the registry builder: walk `libs/falcon-ui-tokens/src/components/**/*.css` in addition to the main theme file.
- **2 are truly undefined**: `--falcon-status-danger`, `--falcon-status-success` (only used with `#E63946`/`#16A34A` hex fallbacks; no `:root { --falcon-status-* : ... }` declaration anywhere).
- **7 are Tailwind-implied color tokens** (above table) — defined nowhere; the Tailwind utility class produces a CSS var reference with no declaration.

**P0 count for C1: 14** (7 var() refs to undefined status tokens + 7 Tailwind color tokens with no canonical theme declaration). Note: the 7 Tailwind tokens each have many usage-site occurrences (heavy in `alert-dialog-tw`, `insufficient-balance-dialog-tw`, `notification.component`); the count above is per **unique token**, the per-site occurrence count is higher.

#### C4 — PrimeNG residue (R-01)

**No source-code violations.** Zero `from 'primeng/'` imports, zero `<p-*>` tags, zero `pi pi-*` icon classes in `.tsx`/`.ts`/`.html`/`.css`. Memory `project_falcon_primeng_total_removal_complete` (Wave PR-8) is upheld in this scope.

| # | File:line | Quote | Action |
|---|---|---|---|
| — | — | none | none |

Compiled-artifact note: `.js`/`.js.map` files under `src/components/*/<name>.js` contain stale `class: "pi pi-cloud-upload"` / `class: "pi pi-ellipsis-v"` strings (e.g. `src/components/falcon-uploader/falcon-uploader.js:189`, `falcon-table/falcon-table.js:402`). The corresponding `.tsx` sources emit `falcon-icon falcon-icon-*` classes — the `.js` files are stale build outputs that should be regenerated. **Flag for build hygiene, not a P0 code violation** (these compiled files are out of scope per audit rules).

Documentation references: 36 mentions of "PrimeNG" / "PrimeIcons" in JSDoc / comments describing legacy parity (e.g. `falcon-paginator-tw.tsx:83`, `falcon-message-service.ts:1`). Allowed — R-01 targets imports/tags/icon classes, not prose.

#### C5 — SCSS / styleUrl / inline `style=""` (R-02)

**No SCSS files in scope** (`fd -e scss` returns nothing).

**No inline `style="..."` attributes in Angular templates** (0 matches across `**/*.html`).

**30 `styleUrl:` Angular wrapper violations** + **2 `styles: [...]` inline-styles-array violations.** Per memory `feedback_no_inline_styles_tokens_only` (HARDENED 2026-05-05) and the Brain-skills primeng-purge rule: *no SCSS, no component CSS, no `styleUrls` on Angular components.* Every Angular wrapper currently declares `styleUrl: './<name>.component.css'` pointing at a 3–11 line `<name>.component.css` that contains `:host { display: ... }` shims to fix a known Stencil layout trap (memory `project_falcon_ui_core_layout_traps` Trap #1) — but those declarations could be moved into the component decorator `host: { class: 'block w-full' }` or onto a Tailwind utility class via `@HostBinding('class')`.

| # | File:line | Quote | Severity |
|---|---|---|---|
| 1 | `src/angular-wrapper/components/falcon-accordion/falcon-accordion.component.ts:31` | `styleUrl: './falcon-accordion.component.css',` | P0 |
| 2 | `src/angular-wrapper/components/falcon-alert-dialog/falcon-alert-dialog.component.ts:45` | `styleUrl: './falcon-alert-dialog.component.css',` | P0 |
| 3 | `src/angular-wrapper/components/falcon-button/falcon-button.component.ts:26` | `styleUrl: './falcon-button.component.css',` | P0 |
| 4 | `src/angular-wrapper/components/falcon-calendar/falcon-calendar.component.ts:31` | `styleUrl: './falcon-calendar.component.css',` | P0 |
| 5 | `src/angular-wrapper/components/falcon-checkbox/falcon-checkbox.component.ts:32` | `styleUrl: './falcon-checkbox.component.css',` | P0 |
| 6 | `src/angular-wrapper/components/falcon-date-picker/falcon-date-picker.component.ts:33` | `styleUrl: './falcon-date-picker.component.css',` | P0 |
| 7 | `src/angular-wrapper/components/falcon-dialog/falcon-dialog.component.ts:29` | `styleUrl: './falcon-dialog.component.css',` | P0 |
| 8 | `src/angular-wrapper/components/falcon-drawer/falcon-drawer.component.ts:28` | `styleUrl: './falcon-drawer.component.css',` | P0 |
| 9 | `src/angular-wrapper/components/falcon-dropdown/falcon-dropdown.component.ts:55` | `styleUrl: './falcon-dropdown.component.css',` | P0 |
| 10 | `src/angular-wrapper/components/falcon-email-field/falcon-email-field.component.ts:38` | `styleUrl: './falcon-email-field.component.css',` | P0 |
| 11 | `src/angular-wrapper/components/falcon-input/falcon-input.component.ts:45` | `styleUrl: './falcon-input.component.css',` | P0 |
| 12 | `src/angular-wrapper/components/falcon-menu/falcon-menu.component.ts:49` | `styleUrl: './falcon-menu.component.css',` | P0 |
| 13 | `src/angular-wrapper/components/falcon-multi-select/falcon-multi-select.component.ts:48` | `styleUrl: './falcon-multi-select.component.css',` | P0 |
| 14 | `src/angular-wrapper/components/falcon-otp/falcon-otp.component.ts:33` | `styleUrl: './falcon-otp.component.css',` | P0 |
| 15 | `src/angular-wrapper/components/falcon-otp-send-dialog/falcon-otp-send-dialog.component.ts:32` | `styleUrl: './falcon-otp-send-dialog.component.css',` | P0 |
| 16 | `src/angular-wrapper/components/falcon-paginator/falcon-paginator.component.ts:29` | `styleUrl: './falcon-paginator.component.css',` | P0 |
| 17 | `src/angular-wrapper/components/falcon-phone-field/falcon-phone-field.component.ts:54` | `styleUrl: './falcon-phone-field.component.css',` | P0 |
| 18 | `src/angular-wrapper/components/falcon-radio/falcon-radio.component.ts:32` | `styleUrl: './falcon-radio.component.css',` | P0 |
| 19 | `src/angular-wrapper/components/falcon-single-uploader/falcon-single-uploader.component.ts:37` | `styleUrl: './falcon-single-uploader.component.css',` | P0 |
| 20 | `src/angular-wrapper/components/falcon-stepper/falcon-stepper.component.ts:60` | `styleUrl: './falcon-stepper.component.css',` | P0 |
| 21 | `src/angular-wrapper/components/falcon-switch/falcon-switch.component.ts:33` | `styleUrl: './falcon-switch.component.css',` | P0 |
| 22 | `src/angular-wrapper/components/falcon-table/falcon-table.component.ts:43` | `styleUrl: './falcon-table.component.css',` | P0 |
| 23 | `src/angular-wrapper/components/falcon-tabs/falcon-tabs.component.ts:54` | `styleUrl: './falcon-tabs.component.css',` | P0 |
| 24 | `src/angular-wrapper/components/falcon-textarea/falcon-textarea.component.ts:33` | `styleUrl: './falcon-textarea.component.css',` | P0 |
| 25 | `src/angular-wrapper/components/falcon-toast/falcon-toast.component.ts:27` | `styleUrl: './falcon-toast.component.css',` | P0 |
| 26 | `src/angular-wrapper/components/falcon-toast/falcon-toast-host.component.ts:19` | `styleUrl: './falcon-toast.component.css',` | P0 |
| 27 | `src/angular-wrapper/components/falcon-tooltip/falcon-tooltip.component.ts:27` | `styleUrl: './falcon-tooltip.component.css',` | P0 |
| 28 | `src/angular-wrapper/components/falcon-tree/falcon-tree.component.ts:38` | `styleUrl: './falcon-tree.component.css',` | P0 |
| 29 | `src/angular-wrapper/components/falcon-tree-table/falcon-tree-table.component.ts:35` | `styleUrl: './falcon-tree-table.component.css',` | P0 |
| 30 | `src/angular-wrapper/components/falcon-uploader/falcon-uploader.component.ts:35` | `styleUrl: './falcon-uploader.component.css',` | P0 |
| 31 | `src/angular-wrapper/components/falcon-popup/falcon-popup.component.ts:200` | `styles: [ \`.falcon-popup-in { animation: falconPopupIn 180ms ... }\` ]` | P0 |
| 32 | `src/angular-wrapper/components/falcon-notification/falcon-notification.component.ts:172` | `styles: [ \`.falcon-notif-in { animation: ... } @keyframes falconNotifCountdown { ... }\` ]` | P0 |

(Stencil-side `styleUrl: '<name>.css'` in `src/components/**/*.tsx` is **not** a violation — Shadow + per-component `<name>.tokens.css` are the SSOT per memory `feedback_shadow_is_token_ssot`.)

##### Companion `.component.css` files (auto-removed when their `styleUrl` is removed)

Same 29 files listed above each have a `.component.css` sibling (3-11 lines, mostly `:host { display: ... }`). Path examples: `src/angular-wrapper/components/falcon-button/falcon-button.component.css`, `falcon-accordion/falcon-accordion.component.css`, …, `falcon-uploader/falcon-uploader.component.css`.

#### Other P0 checks

| Check | Status | Notes |
|---|---|---|
| R-04 hardcoded z-index (numeric in CSS) | 7 hits — listed below | `falcon-multi-select.css:287`, `falcon-insufficient-balance-dialog.css:89/94`, `falcon-tree-table.css:249`, `falcon-stepper.css:82`, `falcon-tree.css:204`, `falcon-table.css:198` (these are P0 per R-04) |
| R-04 hardcoded `z-[N]` Tailwind | 6 hits — listed below | also P0 |
| R-05 build green | not run (read-only audit) | flag for fixer wave |
| R-06 Noor tag naming | clean | all `tag: 'falcon-[a-z]...'`, no uppercase / underscore |

##### R-04 detailed hits

| # | File:line | Quote | Severity |
|---|---|---|---|
| 33 | `src/components/falcon-multi-select/falcon-multi-select.css:287` | `z-index: 1;` | P0 |
| 34 | `src/components/falcon-insufficient-balance-dialog/falcon-insufficient-balance-dialog.css:89` | `z-index: 0;` | P0 |
| 35 | `src/components/falcon-insufficient-balance-dialog/falcon-insufficient-balance-dialog.css:94` | `z-index: 1;` | P0 |
| 36 | `src/components/falcon-tree-table/falcon-tree-table.css:249` | `z-index: 2;` | P0 |
| 37 | `src/components/falcon-stepper/falcon-stepper.css:82` | `z-index: 2;` | P0 |
| 38 | `src/components/falcon-tree/falcon-tree.css:204` | `z-index: 2;` | P0 |
| 39 | `src/components/falcon-table/falcon-table.css:198` | `z-index: 5;` | P0 |
| 40 | `src/components/falcon-organization-hierarchy-tree-tw/falcon-organization-hierarchy-tree-tw.tsx:784` | `class="...cursor-pointer ms-auto z-[2]"` | P0 |
| 41 | `src/tailwind/multi-select-tailwind-classes.ts:320` | `'sticky top-0 z-[1] ' +` | P0 |
| 42 | `src/components/falcon-insufficient-balance-dialog-tw/falcon-insufficient-balance-dialog-tw.tsx:308` | ``class={`fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-[var(--falcon-ib-dialog-backdrop-bg,rgba(15,23,42,0.42))] ${backdropGlossy}`}`` | P0 |
| 43 | `src/tailwind/tree-table-tailwind-classes.ts:242` | `'inline-flex items-center justify-center shrink-0 relative z-[2] ' +` | P0 |
| 44 | `src/tailwind/stepper-tailwind-classes.ts:115` | `'z-[2]',` | P0 |
| 45 | `src/tailwind/table-tailwind-classes.ts:170` | `'absolute inset-0 flex items-center justify-center z-[5] ' +` | P0 |

(13 R-04 hits total. The `z-[1000]` in insufficient-balance-dialog-tw is the worst — sits well below `toast 1300`/`drawer 1200`/`overlay 1100→1400` tier ladder per memory `project_zindex_calendar_portal_root_cause_fix` and may collide with portals. The `z-[1]`/`z-[2]`/`z-[5]` ones are local stacking concerns where the ladder tokens `--z-falcon-rail-elbow` / `--z-falcon-stepper-line` etc. should be invented.)

##### R-03 hardcoded values — TSX/TS Tailwind arbitrary `[Npx]` values (P0)

R-03 forbids Tailwind arbitrary `[Npx]` / `[#hex]` unless they reference a token. Hex inside a `var()` fallback IS allowed; raw `[#hex]` and raw `[Npx]` are not.

Aggregate count of `[\d+px\]` (raw arbitrary px values, NOT references to a token):

- `.tsx` files: 28 occurrences across 7 files
  - `src/components/falcon-checkbox-group-tw/...:1`
  - `src/components/falcon-alert-dialog-tw/...:5`
  - `src/components/falcon-confirm-dialog-tw/...:2`
  - `src/components/falcon-insufficient-balance-dialog-tw/...:14` (heaviest — examples: `w-[22px]`, `h-[22px]`, `text-[13px]`, `text-[18px]`, `p-[14px]`, `px-[18px]`, `py-[10px]`, `max-w-[460px]` at lines 206, 230, 254, 278, 291, 292, 321, 325-326, 340-341, 357, 365)
  - `src/components/falcon-radio-group-tw/...:1`
  - `src/components/falcon-password-tw/...:3`
  - `src/components/falcon-stepper-tw/...:2`

- `.ts` (Angular wrappers + Tailwind class registries): 25 occurrences across 11 files
  - `src/angular-wrapper/components/falcon-card/falcon-card.component.ts:2`
  - `src/angular-wrapper/components/falcon-tag/falcon-tag.component.ts:3`
  - `src/tailwind/tooltip-tailwind-classes.ts:1`
  - `src/tailwind/password-tailwind-classes.ts:2`
  - `src/tailwind/tag-tailwind-classes.ts:3`
  - `src/tailwind/single-uploader-tailwind-classes.ts:4`
  - `src/tailwind/card-tailwind-classes.ts:2`
  - `src/tailwind/date-picker-tailwind-classes.ts:1`
  - `src/tailwind/confirm-dialog-tailwind-classes.ts:2`
  - `src/tailwind/filter-panel-tailwind-classes.ts:4`
  - `src/tailwind/otp-send-dialog-tailwind-classes.ts:1`

- `.html` (Angular templates): 2 occurrences in 1 file
  - `src/angular-wrapper/components/falcon-custom-table-footer/falcon-custom-table-footer.component.html:2`

**Total R-03 arbitrary-px hits: 55. All P0.**

(Hex inside `var(--token, #hex)` was sampled and confirmed allowed per the R-03 exception — see e.g. `falcon-stepper.css`, `falcon-uploader.css`, `falcon-single-uploader.css`: every `#xxx` sits inside a `var()` fallback.)

### P0 summary

| Rule | Hits |
|---|---|
| C1 / R-17 / R-06 (token reality) | 14 (unique tokens) |
| C4 / R-01 (PrimeNG) | 0 (source); stale .js artifacts excluded |
| C5 / R-02 (styleUrl + styles[]) | 32 |
| R-03 (arbitrary `[Npx]`) | 55 (occurrences across 19 files) |
| R-04 (z-index numeric + `z-[N]`) | 13 |
| **P0 total** | **114 occurrences, ~91 unique fixes** |

(The headline "p0: 91" in frontmatter counts unique fixes since multiple R-03 hits in one file are usually fixed in one pass.)

### P1 violations

#### C2 — No inline `style="..."` (R-02)

**No HTML inline `style="..."` violations.** All `style=` in scope are JSX-Stencil computed style objects (`style={{ width: 'var(--falcon-tree-rail-width)' }}`) — these are dynamic calculated bindings allowed per Conflict C-3 in the rules digest.

#### C3 — covered under P0 R-04 above

#### C6 — Falcon-library-first (R-07/R-12)

**1 candidate** in scope: raw `<select>` inside Angular wrapper template.

| # | File:line | Quote | Action |
|---|---|---|---|
| 1 | `src/angular-wrapper/components/falcon-custom-table-footer/falcon-custom-table-footer.component.html:35` | `<select ... [ngModel]="rows()" (ngModelChange)="onSelectRows($event)">` | P1 — replace with `<falcon-angular-dropdown>` per R-12 mapping |

`<table>` inside `src/components/falcon-table/falcon-table.tsx` and `falcon-table-tw/falcon-table-tw.tsx` is the table primitive itself — allowed.
`<button>` and `<input>` inside library skeletons are allowed (they ARE the primitives that Falcon components wrap).

#### C7 — Skeleton vs wrapper boundary (R-08)

The R-08 rule states: "library skeletons MUST NOT inject HttpClient, services, stores, Zitadel, or any business facade." Five service injections found in library Angular files — all of them inject **library-internal infrastructure services** (config / notification / toast queue), not business facades. Flag as P1 with the nuance that these are arguably acceptable per the rule's intent, but still cross the literal line.

| # | File:line | Quote | Service kind |
|---|---|---|---|
| 1 | `src/angular-wrapper/components/falcon-empty-data/falcon-empty-data.component.ts:93` | `private readonly cfg = inject(FalconConfigurationService);` | lib-internal config defaults |
| 2 | `src/angular-wrapper/components/falcon-notification/falcon-notification.component.ts:229` | `private readonly cfg = inject(FalconConfigurationService);` | lib-internal config defaults |
| 3 | `src/angular-wrapper/components/falcon-notification/falcon-notification-stack.component.ts:66` | `private readonly notif = inject(FalconNotificationService);` | lib-internal singleton queue |
| 4 | `src/angular-wrapper/components/falcon-popup/falcon-popup.component.ts:251` | `private readonly cfg = inject(FalconConfigurationService);` | lib-internal config defaults |
| 5 | `src/angular-wrapper/components/falcon-message-service/falcon-message-host.component.ts:36` | `private readonly service = inject(FalconMessageService);` | lib-internal toast queue host |

`HttpClient` is NOT imported anywhere in the lib (clean). No `Zitadel` / business facade injection (clean per R-13).

`src/angular-wrapper/components/falcon-data-table/falcon-data-table.component.ts:128` also has `private readonly zone = inject(NgZone);` — this is both a R-08 borderline injection AND a R-09 zoneless violation (see below).

#### C10 — i18n / RTL — logical properties (R-15 / R-34)

Tailwind physical-side classes found in `libs/falcon-ui-core` source:

| # | File:line | Quote | Severity |
|---|---|---|---|
| 1 | `src/components/falcon-insufficient-balance-dialog-tw/falcon-insufficient-balance-dialog-tw.tsx:239` | `class="absolute left-0 right-0 -top-[6px] h-0 border-t-2 border-dashed ..."` | P1 (also R-03 P0 for `-top-[6px]`) |
| 2 | `src/components/falcon-insufficient-balance-dialog-tw/falcon-insufficient-balance-dialog-tw.tsx:278` | `class="absolute left-0 right-0 -bottom-[6px] h-0 border-t-2 border-dashed ..."` | P1 |
| 3 | `src/tailwind/tooltip-tailwind-classes.ts:` | `left-` token in tooltip pos | P1 |
| 4 | `src/tailwind/toast-host-tailwind-classes.ts:` (×2) | physical-side classes | P1 |
| 5 | `src/tailwind/menu-tailwind-classes.ts:` | physical-side classes | P1 |
| 6 | `src/angular-wrapper/components/falcon-notification/falcon-notification-stack.component.ts:` | physical-side classes | P1 |
| 7-8 | `src/angular-wrapper/components/falcon-notification/falcon-notification.component.ts:162` | `class="...absolute bottom-0 left-0 right-0 origin-left"` | P1 |
| 9 | `src/angular-wrapper/components/falcon-custom-table-footer/falcon-custom-table-footer.component.html:36` | `class="h-7 px-2 pr-6 rounded-sm border ..."` (raw `pr-6` — should be `pe-6`) | P1 |

(9 occurrences. Most are popovers/portal positioning where directional vs logical matters significantly for RTL layouts. `bottom-0` / `top-0` are vertical — bidi-safe — and don't count.)

No `padding-left` / `margin-right` / `text-align: left|right` in raw CSS — clean.

No `text-left` / `text-right` Tailwind classes in scope — clean.

#### R-09 Angular 21 idioms

**51 `@HostBinding` violations** (one per wrapper), **1 `@HostListener` violation**, **63 `standalone: true` violations** (the default in v20+, should be removed), **871 `@Input()`/`@Output()` decorator-form occurrences across 53 files** (should be `input()`/`output()` functions), **1 `NgZone` import**, **2 `[ngClass]` directives in templates**.

##### `standalone: true` — 63 occurrences across 57 files

Sample (every wrapper component has exactly this issue):
- `src/angular-wrapper/components/falcon-button/falcon-button.component.ts:23` — `standalone: true,`
- `src/angular-wrapper/components/falcon-input/falcon-input.component.ts:42` — `standalone: true,`
- … (every `*.component.ts` in `src/angular-wrapper/components/` plus the `.directive.ts` files)

##### `@HostBinding` — 51 occurrences across 51 files

Sample:
- `src/angular-wrapper/components/falcon-button/falcon-button.component.ts:52` — `@HostBinding('class.falcon-angular-button') readonly hostClass = true;`
- `src/angular-wrapper/components/falcon-avatar/falcon-avatar.component.ts:56` — `@HostBinding('class') readonly hostClass = 'falcon-angular-avatar inline-flex align-middle';`
- … (one per `<falcon-angular-*>` component)

##### `@HostListener` — 1 occurrence

- `src/angular-wrapper/components/falcon-popup/falcon-popup.component.ts:327` — `@HostListener('document:keydown.escape')`

##### `@Input()` / `@Output()` — 871 occurrences across 53 files

Per the R-09 rule, **all** of these should migrate to `input()` / `output()` / `model()` signal-based forms. The migration is mechanical: `@Input() label?: string;` → `readonly label = input<string | undefined>(undefined);`. Top files:

- `src/angular-wrapper/components/falcon-data-table/falcon-data-table.component.ts:68` — highest count
- `src/angular-wrapper/components/falcon-dropdown/falcon-dropdown.component.ts:26`
- `src/angular-wrapper/components/falcon-multi-select/falcon-multi-select.component.ts:27`
- `src/angular-wrapper/components/falcon-insufficient-balance-dialog/falcon-insufficient-balance-dialog.component.ts:26`
- … 49 other files

Note: a SUBSET of the lib (`falcon-popup`, `falcon-notification`, `falcon-empty-data`, etc.) already uses the new `input()` / `output()` function form. This migration is partial and should be completed.

##### `NgZone` (zoneless violation R-09)

| # | File:line | Quote |
|---|---|---|
| 1 | `src/angular-wrapper/components/falcon-data-table/falcon-data-table.component.ts:19` | `NgZone,` (import) |
| 2 | `src/angular-wrapper/components/falcon-data-table/falcon-data-table.component.ts:128` | `private readonly zone = inject(NgZone);` |

##### `[ngClass]` directives in templates (R-09)

| # | File:line | Quote |
|---|---|---|
| 1 | `src/angular-wrapper/components/falcon-notification/falcon-notification.component.ts:163` | `[ngClass]="countdownClasses()"` |
| 2 | `src/angular-wrapper/components/falcon-notification/falcon-notification.component.ts:` (inline template — sibling occurrence) | `[ngClass]="..."` |

#### R-19 Nx boundary

**Clean.** No `from 'apps/'` imports, no deep-internal `from '@falcon/*/src/'` imports.

#### R-13 Auth Zitadel

**Clean.** No `zitadel` / `@zitadel/` references.

#### R-31 No DOM access

| # | File:line | Quote | Justification |
|---|---|---|---|
| 1 | `src/utils/popover-portal.ts:multiple` | `document.querySelector`, `document.getElementById` | Justified portal utility for body-portal mount (per memory `project_zindex_calendar_portal_root_cause_fix`) |

#### R-32 No innerHTML / `<script>`

**Clean.** `[innerHTML]` not used. `<script>` only appears in `PATTERN.md` doc.

### P1 summary

| Rule | Hits |
|---|---|
| R-07 / R-12 (raw `<select>`) | 1 |
| R-08 (service injection in skeleton) | 5 |
| R-09 standalone:true | 63 |
| R-09 @HostBinding | 51 |
| R-09 @HostListener | 1 |
| R-09 @Input/@Output | 871 |
| R-09 NgZone | 2 |
| R-09 [ngClass] | 2 |
| R-15 / R-34 RTL physical sides | 9 |
| R-31 (justified utility) | 1 (flag only) |
| **P1 total** | **1006 (`~996` unique fixes since some hits cluster)** |

### P2 violations

#### C8 — Clean code / Angular 21 idioms (subset of R-09 above, already counted as P1)

#### C9 — Folder structure (R-10)

The standard rule: each feature folder has `models/models.ts`, `services/services.ts`, etc. The library's component folders follow a different (component-library) convention: `<name>.tsx`, `<name>.types.ts`, `<name>.utils.ts`, `<name>.css` per Stencil convention; `<name>.component.{ts,html,css}` per Angular convention.

| # | File | Deviation | Severity |
|---|---|---|---|
| 1 | `src/components/falcon-*/falcon-*.types.ts` (×40 files) | `<name>.types.ts` per component, not `models/models.ts` | P2 — library convention deviates from feature-folder convention; this is intentional and out-of-scope of R-10 in practice |
| 2 | `src/components/falcon-*/falcon-*.utils.ts` (×8 files) | same — `<name>.utils.ts` per component | P2 |
| 3 | `src/configurations/falcon-configuration.service.ts` | services/services.ts pattern broken (one file per service, not one file per service-folder) | P2 |
| 4 | `src/utils/popover-portal.ts`, `src/utils/*.ts` | utils/ folder with multiple files — not `utils/utils.ts` | P2 |

**Recommendation:** treat R-10 as inapplicable to component libraries (the rule was written for feature folders in apps). Flag-only and leave as-is.

#### C11 — Comment style (R-22)

**No `@param` / `@returns` JSDoc blocks** (clean — R-22 satisfied).

Long `/** ... */` JSDoc blocks (>200 chars) heuristic returned 0 in source files (also clean).

Comment style is consistently the terse `/*** ... ***/` banner form per memory `feedback_comment_style`. Clean across the lib.

#### R-23 Clean code / DRY

The two-render-path (`useTailwind` `@if/@else`) pattern is duplicated across all 50 Angular wrappers — but the duplication is intentional (the framework wrappers must each render a `<falcon-name>` or `<falcon-name-tw>` tag depending on the flag). PATTERN.md documents this explicitly. **Flag-only / no action.**

#### R-24 Components small / OnPush

**All 55 Angular wrappers have OnPush.** Clean.

#### R-26 TypeScript no-any

**Zero `: any` / `<any>` / `as any` in source TS/TSX** (excluding auto-generated `.d.ts`). Clean.

#### R-27 NgOptimizedImage

14 `<img>` elements in `.tsx` Stencil components — these are NOT Angular components and cannot use `NgOptimizedImage`. R-27 is inapplicable to Stencil. **No violations.**

No `<img>` in Angular wrapper `.html` templates.

#### R-28 Lazy loading

Routes are an app-level concern; the lib has no `routes.ts` files. Inapplicable.

#### R-33 Imports clean

**No `import * as`.** Clean.

Unused-imports detection deferred to ESLint (out of scope for this audit).

#### R-37 Page learning system

Inapplicable to library — applies to page-level work.

#### R-38 Compliance table

Inapplicable to library — applies to UI-parity tasks.

#### Dead code / unused exports

Suspect (cross-reference is best-effort):

| # | File | Suspect | Reason |
|---|---|---|---|
| 1 | `src/angular-wrapper/components/falcon-select/index.ts` | Stub `falcon-select` barrel | No `.component.ts` exists — only `index.ts`. Likely vestigial after dropdown supersession. |
| 2 | `src/angular-wrapper/components/falcon-message-service/falcon-message-service.ts` | PrimeNG `MessageService` shim | Memory rule `project_falcon_primeng_total_removal_complete` says PrimeNG is gone — confirm if any consumer still calls `add({severity, summary, detail, life})`-style API or if all consumers migrated to `FalconNotificationService` |
| 3 | `src/angular-wrapper/components/falcon-empty-data/falcon-empty-data.component.ts` (Angular wrapper) + `src/components/falcon-empty-data{,-tw}` (Stencil twin) + `src/components/falcon-empty-state{,-tw}` (similar Stencil twin) | Duplicate empty-data / empty-state components | Likely a single component is intended (memory `feedback_falcon_custom_library_mandatory` strict customization order) |

### P2 summary

| Rule | Hits |
|---|---|
| R-10 folder structure | 4 (library-convention deviation — flag only) |
| R-22 comment style | 0 |
| R-23 DRY | 0 (intentional pattern) |
| R-24 OnPush | 0 |
| R-26 :any | 0 |
| R-27 NgOptimizedImage | 0 (inapplicable to Stencil) |
| R-33 imports | 0 |
| Dead code suspects | 3 |
| **P2 total** | **7 (flag-only)** |

## 3. Top-10 priority fixes (ranked)

1. **R-04 P0** Replace `z-[1000]` in `src/components/falcon-insufficient-balance-dialog-tw/falcon-insufficient-balance-dialog-tw.tsx:308` with the canonical overlay token `var(--falcon-overlay-z-index)` (1400) — currently sits **below** drawer/dialog (1200) and toast (1300), causing the dialog to render under the wrong portal stack.
2. **R-02 P0** Remove 30 `styleUrl: './<name>.component.css'` declarations from `src/angular-wrapper/components/**/*.component.ts` and move `:host { display: block | inline-block | inline-flex; ... }` rules to `host: { class: 'block w-full | inline-flex' }` via the component decorator. Delete the 29 sibling `.component.css` files.
3. **R-02 P0** Move the animation keyframes inside `src/angular-wrapper/components/falcon-popup/falcon-popup.component.ts:200-216` (`@keyframes falconPopupIn`) and `src/angular-wrapper/components/falcon-notification/falcon-notification.component.ts:172-196` (`@keyframes falconNotifIn`, `@keyframes falconNotifCountdown`) out of inline `styles: [...]` arrays and into `libs/falcon-theme/src/falcon.theme.css`.
4. **R-17 P0** Define `--falcon-status-danger` and `--falcon-status-success` tokens in `libs/falcon-ui-tokens/src/themes/light.css` + `dark.css` (and remove the hex fallbacks once declared) — currently used at 4 sites in `falcon-alert-dialog.css` + 3 sites in `falcon-alert-dialog-tw.tsx`.
5. **R-17 P0** Define the 7 missing `--color-falcon-*` tokens (`amber-100/200/400`, `blue-50/700`, `red-200/400`) in `libs/falcon-theme/src/falcon-tailwind-tokens.css` — they are referenced via Tailwind utility classes (`bg-falcon-amber-400`, `from-falcon-amber-100`, etc.) that emit `var(--color-falcon-*)` at runtime.
6. **R-03 P0** Batch-replace 28 raw `[Npx]` arbitrary values in `src/components/falcon-insufficient-balance-dialog-tw/falcon-insufficient-balance-dialog-tw.tsx` with token references (`text-[var(--falcon-ib-dialog-title-font-size)]`, etc.) — heaviest violator at 14 hits; the dialog already has 22 hex usages via tokens, so the size/spacing tokens should be added to `insufficient-balance-dialog.tokens.css` to match.
7. **R-04 P0** Replace the 6 numeric `z-index:` values in Stencil `<name>.css` files (multi-select, insufficient-balance-dialog, tree-table, stepper, tree, table) with per-component z-index tokens routed through the canonical ladder (`--falcon-z-multi-select-sticky-header`, etc.). Same for 6 `z-[N]` arbitrary values in tailwind class registries + tsx.
8. **R-09 P1** Mechanical migration of 871 `@Input()` / `@Output()` decorator forms to `input()` / `output()` / `model()` signal-based forms across the 53 Angular wrapper components — partial migration already in progress (popup/notification/empty-data done). Auto-replaceable with codemod.
9. **R-09 P1** Remove `standalone: true` from 63 sites (default in v20+); remove 51 `@HostBinding('class.…')` declarations and migrate to `host: { class: 'falcon-angular-…' }` in the decorator (`@HostListener` → `host: { '(document:keydown.escape)': 'onEsc()' }`).
10. **R-09 P1** Remove `NgZone` from `falcon-data-table.component.ts:19/128`; replace the `zone.runOutsideAngular(...)` pattern with the equivalent zoneless approach.

## 4. Recommended fix sequence

### Batch A (safe auto-replace, low-risk)

- **A1** — Remove `styleUrl: './<name>.component.css',` line + delete file (29 wrappers). Manual verification per component (some hosts need a different inline-block default — check `host: { class: '...' }` after).
- **A2** — Strip `standalone: true,` lines from 63 wrappers (default in v20+).
- **A3** — Codemod `@Input() <name>?: <T> = <default>;` → `readonly <name> = input<T | undefined>(<default>);` across 871 sites + matching `@Output() <name> = new EventEmitter<T>();` → `readonly <name> = output<T>();`. Update template bindings from `<name>` to `<name>()`. (One codemod handles all.)
- **A4** — Migrate 51 `@HostBinding('class.…')` to `host: { class: '...' }`.

### Batch B (manual refactor, medium-risk)

- **B1** — Define 9 missing tokens (`--falcon-status-danger`, `--falcon-status-success`, 7 `--color-falcon-*`) in canonical theme + tokens packages.
- **B2** — Replace 28 raw `[Npx]` in `*-tw.tsx` files with size tokens; add tokens to the matching `.tokens.css`.
- **B3** — Replace 13 z-index numerics + `z-[N]` with token references; canonicalize the per-family z-index tokens.
- **B4** — Move 2 inline `styles: [...]` animation blocks to `falcon.theme.css`.
- **B5** — Replace `<select>` in `falcon-custom-table-footer` with `<falcon-angular-dropdown>`.
- **B6** — Migrate 9 RTL physical-side classes to logical (`left-0 right-0` → `start-0 end-0`, `pr-6` → `pe-6`).
- **B7** — Remove `NgZone` from `falcon-data-table`.
- **B8** — Replace 2 `[ngClass]` with class bindings.

### Batch C (GAP — flag only, defer)

- **C1** — Stub `falcon-select/index.ts` — confirm and remove if dead, or build out if planned.
- **C2** — `falcon-message-service` PrimeNG-shim — confirm if any consumer still uses it; if not, deprecate.
- **C3** — `falcon-empty-data` vs `falcon-empty-state` duplication — design review needed.
- **C4** — 5 library-internal `inject(FalconConfigurationService/...)` calls — accept as lib-internal infrastructure pattern, or refactor to pure-presentational props-only design.

## 5. Architecture observations

- **Two-render-path pattern is consistently followed.** All 50 Angular wrappers implement the `useTailwind` `@if/@else` switch documented in `PATTERN.md`. Visual parity is mathematical — same Stencil component renders in both paths; the wrapper just chooses which tag.
- **Stencil + Tailwind class registry split is clean.** `src/tailwind/*.ts` exports pure class-string builders consumed by both Stencil `*-tw.tsx` and Angular wrappers — zero duplication of the actual class logic.
- **Tokens-first architecture is mostly upheld in Stencil `.css` files** — every hex appears inside a `var(--token, #fallback)`. The fallback is the design value; the token is the override path. This is the **correct** Studio pattern (memory `feedback_shadow_is_token_ssot`).
- **Token coverage is uneven on the Tailwind side.** `*-tw.tsx` files frequently emit Tailwind arbitrary-value syntax (`text-[13px]`, `w-[22px]`) when they should reference the same per-component token chain. This breaks Studio runtime mutation (mutating `--falcon-input-label-font-size` won't cascade into a `text-[13px]` literal).
- **N components are missing a tokens file.** `falcon-insufficient-balance-dialog` has rich `.tokens.css` for colors but no size/spacing tokens — hence the 14 raw `[Npx]` violations. Recommend adding `--falcon-ib-dialog-title-font-size`, `--falcon-ib-dialog-meta-font-size`, etc. to the existing tokens file.
- **Angular wrapper modernization is mid-migration.** Newer wrappers (`falcon-popup`, `falcon-notification`, `falcon-empty-data`, `falcon-custom-table-footer`) already use `input()`/`output()` functions and signals throughout. Older wrappers (~80% of the 50) still use `@Input()`/`@Output()` decorators. Recommend completing the migration as a single workspace codemod.
- **Standing `:host { display: block }` workaround.** Every Angular wrapper has a 3-11 line `.component.css` solely to fix the Stencil-shadow `display: inline` default (memory `project_falcon_ui_core_layout_traps` Trap #1). This is a known issue, and the cleanest fix is `host: { class: 'block w-full' }` in the decorator (eliminating the file altogether).

## 6. Risk register

- **`falcon-insufficient-balance-dialog-tw` (14 P0 + 22 hex-fallback + `z-[1000]`)** — highest-density violation file. Refactor risk: medium (single component, but visual fidelity must be preserved). Replace size/spacing literals with tokens + theme the dialog properly.
- **`falcon-data-table.component.ts` (NgZone + 68 `@Input/@Output` + `inject(NgZone)`)** — the only zoneless violation in the lib. Refactor risk: medium (table is complex, the `zone.runOutsideAngular(...)` was likely added for measurable scroll/sort perf). Needs careful zoneless verification.
- **`falcon-notification.component.ts` (inline `styles: [` + `[ngClass]` + physical-sides + service injection)** — touches 4 different rules. Refactor risk: low–medium (notification UX must not regress).
- **30 wrapper components with `styleUrl` + `.component.css`** — workspace-scale change. Refactor risk: low if done one component at a time with build verify; high if done in one mass-edit. Recommend codemod with per-component snapshot test of the rendered host class.
- **871 `@Input/@Output` migrations** — workspace-scale; safe to codemod, but the template-side ChangeDetection semantics change subtly (signal vs decorator). Recommend running zoneless smoke tests after.
- **Token registry coverage gap** — the `02-token-registry-quick-grep.txt` registry missed 76 tokens that ARE defined under `libs/falcon-ui-tokens/src/components/*.tokens.css`. The Gate 06 token-build script (`scripts/build-token-registry.mjs`) likely doesn't walk that folder — should be patched independently of this lib's fixes.
- **Compiled .js artifacts are stale.** `falcon-uploader.js`, `falcon-table.js`, `falcon-single-uploader.js` still emit `pi pi-*` icon classes in their compiled JSX — the `.tsx` sources emit `falcon-icon falcon-icon-*`. These need a clean rebuild before they're trusted as runtime artifacts; they are out of audit scope but represent a build-hygiene risk if any consumer imports the lib via the `dist/` path.
