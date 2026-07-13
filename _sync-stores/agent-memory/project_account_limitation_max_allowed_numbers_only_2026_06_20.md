---
name: project_account_limitation_max_allowed_numbers_only_2026_06_20
description: "Account-limitation \"Max allowed\" inputs (admin Settings tab + Add Client wizard Settings step) made numbers-only via falcon-angular-input-number [integer]; mgmt is view-only."
metadata: 
  node_type: memory
  type: project
  originSessionId: c90e8e02-6cf7-45f7-a9e8-c90b21ec7807
---

Account Limitation "Max allowed" inputs are now **numbers-only** (admin-console only — mgmt is view-only). 2026-06-20 (claude), FE-only, NO commits, `nx build admin-console` GREEN (hash d463403889497fe3).

**The numbers-only attribute = the `<falcon-angular-input-number>` component with `[integer]="true" [min]="0" [max]="999"`.** It owns a built-in DOM-level numeric keystroke + paste + beforeinput filter at `[CODE] libs/falcon-ui-core/src/components/falcon-input-number-tw/falcon-input-number-tw.tsx:283-518` (comment: "Resolves the letters-accepted-by-integer-only-input-number bug class"). `[max]=999` blocks the 4th digit at keydown via `wouldExceedMax` WITHOUT the old auto-snap (snap was replaced 2026-06-04), so it keeps the Wave G+ "no confusing snap" UX while truly rejecting non-digits.

**Why the old code leaked letters:** the editable fields used `<falcon-angular-input type="text" inputMode="numeric" maxlength=3>`. `inputMode="numeric"` is ONLY a mobile keyboard hint — it does NOT block letters on desktop. They stripped non-digits in `onLimitChange()`, but with one-way `[ngModel]` binding, when the stripped value equals the previous model value (type `12`, then `a` → strips back to `12`), Angular sees no model change and never re-pushes to the Stencil input, so `12a` stays visible.

**Changed (6 inputs, 3 files):**
- `[CODE] apps/admin-console/.../add-client-wizard/client-settings-step/client-settings-step.component.html` — 3 editable Max allowed (maxNormal/maxSystem/maxNode) → input-number. (TS already imported FalconAngularInputNumberComponent.)
- `[CODE] apps/admin-console/.../tab-components/settings-tab/settings-tab.component.html` — 3 editable Max allowed → input-number.
- `[CODE] apps/admin-console/.../tab-components/settings-tab/settings-tab.component.ts` — ADDED FalconAngularInputNumberComponent to imports.

Binding: `[ngModel]` now binds the raw `number|null` (was stringified); `(ngModelChange)="onLimitChange(field, $event)"` (onLimitChange already accepts `string|number|null`); blur switched from native `(blur)` to the input-number's `(falconBlur)` Output.

**Management-console:** Account Limitations are VIEW-ONLY (disabled `current / max` display, per Ammar 2026-05-31) — there is NO editable Max allowed input to type into, so it's inherently number-safe. No mgmt files changed.

Live-UI verification user-gated (MF host-shell + auth). Reverses the Wave G+ text-input decision whose ONLY reason (auto-snap-to-999) is now obsolete.
