# Shared directives — OVERVIEW

> [!note] LIVE — refreshed 2026-06-03 (B23 reconcile cluster)
> This is the one dossier in the B23 cluster that is **still live**. All 12 directives exist on disk and are exported from the barrel ([CODE] `libs/falcon/src/shared-ui/lib/directives/index.ts:1-12`, verified by Glob 2026-06-03 — 12 `*.directive.ts` files + `index.ts`). The directive table, categorization, and per-directive status below are accurate.
> **Two corrections applied this refresh:** (1) the **live consumer footprint is far narrower than the prior "heavy use" claim** — only ONE app component imports/uses any of these directives today (`apps/admin-console/.../add-client-wizard/client-settings-step`, which uses `falconIpAddress` on a native `<input>` in the IP-allowlist editor — [CODE] `client-settings-step.component.ts:3-5`); the remaining 11 directives have **0 live app consumers** (Grep 2026-06-03 across `apps/` + `libs/falcon/`). The collapse is because the wizards migrated to Falcon UI core inputs + Reactive-Forms validators in `libs/falcon/src/shared-utils/lib/validators/falcon-validators.ts`. (2) The Obsidian projection's stale frontmatter (which named a phantom `falcon-ui-core/.../shared-directives/` folder with `falconDataTableCell` / `falconTabActions`) is wrong — those directives live co-located in their own component folders (`falcon-data-table/falcon-data-table-cell.directive.ts`, `falcon-tabs/falcon-tab-actions.directive.ts`), NOT in this bundle. This dossier covers the `libs/falcon/src/shared-ui/lib/directives/` bundle only.

This folder documents the directives under `libs/falcon/src/shared-ui/lib/directives/` — small, single-purpose Angular standalone directives that consumers compose on form inputs and other DOM elements. Each is independently exported from the `directives/index.ts` barrel.

**The "8 Falcon validation directives"** (the validation-relevant subset, per the categorization below): 5 sync validators (`FalconStartWithLetter`, `FalconStartWithLetterMax30`, `FalconLettersDigitsMax`, `FalconUsernameFormat`, `FalconPhoneNumber`) + 1 async validator (`FalconCheckExists`) + 2 validator+CVA (`FalconPhoneMask`, `FalconIpAddress`) = 8 that participate in `NG_VALIDATORS` / `NG_ASYNC_VALIDATORS`. The other 4 are non-validation utilities (`FalconFormValidate` form-wide UX overlay, `FalconColumnName` mutation, `FalconTruncate` text+title, `FalconEffectiveDate` no-op stub).

## Purpose
Provide reusable input behavior (validators, masks, async checks, runtime mutations) that the Falcon UI core inputs don't carry built-in.

## Business / UI use case
- Form fields across Add Client / Add User wizards.
- Org-hierarchy validation (account name uniqueness).
- IP allowlist editor.
- Phone number masking.
- Username / column-name normalization.

## Status
- **ACTIVE / SHARED.** All directives are standalone Angular directives, OnPush-friendly, used across multiple feature folders.

## Source paths
| Directive | Selector | Path |
|---|---|---|
| `FalconFormValidateDirective` | `form[falconFormValidate]` | `libs/falcon/src/shared-ui/lib/directives/falcon-form-validate.directive.ts` |
| `FalconStartWithLetterDirective` | `[falconStartWithLetter]` | `libs/falcon/src/shared-ui/lib/directives/falcon-start-with-letter.directive.ts` |
| `FalconStartWithLetterMax30Directive` | `[falconStartWithLetterMax30]` | `libs/falcon/src/shared-ui/lib/directives/falcon-start-with-letter-max30.directive.ts` |
| `FalconLettersDigitsMaxDirective` | `[falconLettersDigitsMax]` | `libs/falcon/src/shared-ui/lib/directives/falcon-letters-digits-max.directive.ts` |
| `FalconUsernameFormatDirective` | `[falconUsernameFormat]` | `libs/falcon/src/shared-ui/lib/directives/falcon-username-format.directive.ts` |
| `FalconPhoneNumberDirective` | `[falconPhoneNumber]` | `libs/falcon/src/shared-ui/lib/directives/falcon-phone-number.directive.ts` |
| `FalconPhoneMaskDirective` | `[falconPhoneMask]` | `libs/falcon/src/shared-ui/lib/directives/falcon-phone-mask.directive.ts` |
| `FalconCheckExistsDirective` | `[falconCheckExists]` | `libs/falcon/src/shared-ui/lib/directives/falcon-check-exists.directive.ts` |
| `FalconIpAddressDirective` | `[falconIpAddress]` | `libs/falcon/src/shared-ui/lib/directives/falcon-ip-address.directive.ts` |
| `FalconEffectiveDateDirective` | `[falconEffectiveDate]` | `libs/falcon/src/shared-ui/lib/directives/falcon-effective-date.directive.ts` |
| `FalconColumnNameDirective` | `input[falconColumnName]` | `libs/falcon/src/shared-ui/lib/directives/falcon-column-name.directive.ts` |
| `FalconTruncateDirective` | `[falconTruncate]` | `libs/falcon/src/shared-ui/lib/directives/falcon-truncate.directive.ts` |

Barrel: `libs/falcon/src/shared-ui/lib/directives/index.ts`.

## Categorization
- **Sync validators (return `ValidationErrors | null`):**
  - `FalconStartWithLetterDirective`
  - `FalconStartWithLetterMax30Directive`
  - `FalconLettersDigitsMaxDirective`
  - `FalconUsernameFormatDirective`
  - `FalconPhoneNumberDirective`
- **Async validator (debounced API call):**
  - `FalconCheckExistsDirective` — `NG_ASYNC_VALIDATORS`. 500 ms debounce, distinctUntilChanged, per-value cache, distinct from `NG_VALIDATORS`.
- **Validator + CVA (input mutation + validation):**
  - `FalconPhoneMaskDirective` — applies "XXX XXXXXXXX" mask, min/max digits validation.
  - `FalconIpAddressDirective` — detects IPv4 vs IPv6 mode and locks input, debounced validation.
- **Form-wide UX enhancement:**
  - `FalconFormValidateDirective` — bound on `<form>` element, observes mutations + focus events to display error messages, set `.falcon-control-invalid` borders, add required asterisks.
- **Input mutation only:**
  - `FalconColumnNameDirective` — real-time normalization (whitespace → underscore) + finalize on blur.
  - `FalconTruncateDirective` — truncate text content to N chars + add native `title` tooltip.
- **No-op stub:**
  - `FalconEffectiveDateDirective` — Wave 3 no-op (originally drove PrimeNG `<p-datepicker>` disabled-date rules; now returns `null`).

## Known consumers (Consumer Sweep 2026-06-03)
- **Verified LIVE consumer count = 1.** Only `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.{ts,html}` references any directive in this bundle — it uses `FalconIpAddressDirective` (native `<input falconIpAddress>` in the IP-allowlist editor, [CODE] `client-settings-step.component.ts:3-5`).
- **management-console: 0 consumers** (Grep 2026-06-03 — no occurrences of any of the 12 selectors/class names).
- The other 11 directives (`FalconFormValidate`, `FalconStartWithLetter`, `FalconStartWithLetterMax30`, `FalconLettersDigitsMax`, `FalconUsernameFormat`, `FalconPhoneNumber`, `FalconPhoneMask`, `FalconCheckExists`, `FalconColumnName`, `FalconTruncate`, `FalconEffectiveDate`) have **0 live app consumers today**.
- _Drift note: the prior dossier claimed "heavy use across admin + management wizard steps" and that `FalconCheckExists` is "used for account-name / username uniqueness." Neither is true in the current tree — those checks moved to `falcon-validators.ts` Reactive-Forms validators + Falcon UI core inputs' built-in error display. The directives remain exported and supported but are largely dormant. This is a candidate for a dead-code review (see GAPS / DECISION)._

## Related components
- Per-directive: Falcon UI inputs that the directives attach to (`<falcon-angular-input>`, `<input type="text">`, etc.).
- `getValidationErrorMessage()` from `shared-utils` — provides the error message lookup.

## Ownership / Responsibility
- Shared across `libs/falcon/src/shared-ui/`.
- Each directive is single-purpose and well-encapsulated.

## Verification
🟢 code-verified (B23 refresh 2026-06-03) — 12 directives + barrel confirmed via Glob of `libs/falcon/src/shared-ui/lib/directives/` and [CODE] `index.ts:1-12`. Consumer count (1 live: `client-settings-step` → `falconIpAddress`) confirmed via Grep of all 12 selectors + class names across `apps/` + `libs/falcon/`. Sibling note re: `falconDataTableCell` / `falconTabActions` living in their own component folders confirmed via Grep (`falcon-data-table-cell.directive.ts`, `falcon-tab-actions.directive.ts`). The `FalconFormValidate` PrimeNG-selector / inline-style audit findings are carried from the prior dossier (not re-read line-by-line this pass) → 🟡 for those specific code-quality claims.
