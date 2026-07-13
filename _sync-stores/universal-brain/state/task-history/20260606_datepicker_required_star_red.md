# Task — Contract Start/Expiration Date required star not red → RED

**Date:** 2026-06-06 · **Status:** ✅ COMPLETED (no commits) · **Branch:** polishing-v0.4
**Repo:** C:/Falcon/Falcon/falcon-web-platform-ui

## Ask
In Add & Edit Contract, the **Start Date** and **Expiration Date** required asterisks were gray; the required `*` must be **red**. Follow Falcon theming + structuring conventions; lean on the brain.

## Diagnosis (code-grounded)
Both fields are `<falcon-angular-date-picker [required]="true">` (admin Add `contract-information-step.component.html:37,48`; admin Edit `contracts-edit-contract.component.html:147,159`) — the `*` is rendered by the **component**, so this is a **library bug** affecting every required date-picker, not a contracts-only issue.

Root cause = token scope: `falcon-date-picker-tw.tsx:326` rendered the marker via the shared `falconInputRequiredMarkerClasses()` → `text-[color:var(--falcon-input-required-color)]`. `--falcon-input-required-color` is declared only inside `:where(falcon-input,…,[data-falcon-input],falcon-password,…)` (`input.tokens.css:33-57`). The date-picker host is outside that scope → the var resolved to nothing → the `*` inherited the gray label color. No `--falcon-date-picker-required-color` token existed; the Shadow path rendered ` *` with no color class at all. The date-picker was the only form control borrowing another component's required token (dropdown/combobox/multi-select/checkbox/radio/switch/textarea/email/phone all have their own).

## Fix (mirrors the dropdown convention — token + helper + Shadow rule; 5 lib files, zero app change)
1. `calendar.tokens.css` — add `--falcon-date-picker-required-color: var(--color-falcon-red-500,#dc2626)` (date-picker scope, §12.b).
2. `date-picker-tailwind-classes.ts` — add `falconDatePickerRequiredMarkerClasses()` + header selector-map line.
3. `falcon-date-picker-tw.tsx` — use the new helper (line 326); drop the cross-component `falconInputRequiredMarkerClasses` import.
4. `falcon-date-picker.tsx` (Shadow) — `<span class="falcon-date-picker-required">`.
5. `falcon-date-picker.css` (Shadow) — `.falcon-date-picker-required { margin-inline-start: var(--falcon-spacing-1); color: var(--falcon-date-picker-required-color); }`.

Shared input helper + input.tokens.css scope untouched → zero input/password regression. Library fix auto-covers admin+mgmt, Add+Edit+View.

## Verification
- `nx build falcon-ui-core` EXIT 0 (44.2s) · `nx run-many build admin-console,management-console --configuration=development` EXIT 0.
- CSS-verified: token + compiled `color: var(--falcon-date-picker-required-color)` utility present in `dist/apps/{admin,management,host-shell}-console/styles.css`. (Note: Tailwind v4 emits `color: var(…)` with a space.)
- Tests: admin **745/745** (35 files, incl. contracts add-wizard + edit-contract) · mgmt **581/581** (25 files).
- ⚠️ Live pixel-verify pending login (credential policy — assistant can't authenticate).

## Follow-ups (optional, user-gated)
- Live browser pixel check after rebuilding/refreshing the remote.
- `nx build falcon-ui-tokens` to regenerate the falcon-studio token registry (off the app critical path).
- Commit only on explicit user instruction.

Memory: `project_datepicker_required_star_red_2026_06_06.md`.
