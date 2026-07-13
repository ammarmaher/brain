# Shared directives — DECISION

> [!note] LIVE — refreshed 2026-06-03 (B23). Per-directive statuses below stand.
> One material update: the bundle's **live consumer footprint is 1 app component** (`client-settings-step` → `falconIpAddress`); the other 11 directives have 0 live app consumers (Grep 2026-06-03). They remain exported + supported, but most are **dormant** — a candidate for a dead-code / consolidation review (NOT a deletion this pass; it would be a HIGH-RISK-QUEUE call because consumers MAY exist outside the FE app, e.g. falcon-studio or future features). Validation moved to `libs/falcon/src/shared-utils/lib/validators/falcon-validators.ts` (Reactive-Forms validators) + Falcon UI core inputs' built-in error display.

## Brain SK final recommendation

### Status (per directive)
| Directive | Status |
|---|---|
| `FalconFormValidateDirective` | **NEEDS-MAJOR-UPGRADE** — inline styles + PrimeNG selectors + debug console.log. |
| `FalconStartWithLetterDirective` | **READY** |
| `FalconStartWithLetterMax30Directive` | **READY** |
| `FalconLettersDigitsMaxDirective` | **READY** |
| `FalconUsernameFormatDirective` | **READY** |
| `FalconPhoneNumberDirective` | **READY** |
| `FalconPhoneMaskDirective` | **READY** (consider format Input for richer i18n) |
| `FalconCheckExistsDirective` | **READY** (consider service-level cache) |
| `FalconIpAddressDirective` | **READY** |
| `FalconEffectiveDateDirective` | **REFERENCE-ONLY** (Wave 3 stub, no-op) |
| `FalconColumnNameDirective` | **READY** |
| `FalconTruncateDirective` | **READY** |

### Use these directives for
- Common form-input validation + formatting concerns.
- Async name-uniqueness checks (`FalconCheckExists`).
- Phone / IP / column-name normalization.
- Long text truncation.

### Avoid these directives for
- New code: prefer per-input Inputs (`<falcon-angular-input>` has `errorMessage` + `state` — no need for `FalconFormValidate`).
- `FalconEffectiveDate` (no-op).

### Required upgrades before wider use
1. **Refactor `FalconFormValidateDirective`** to drop PrimeNG selectors + inline styles + console.log. (P0)
2. **Either re-implement or delete `FalconEffectiveDateDirective`.** (P0)
3. **Define `.falcon-error`, `.falcon-required`, `.falcon-control-invalid`, `.falcon-label-invalid` in theme CSS** so the directives can drop inline styles. (P0)
4. **Add `errorKey?: string` Input to each validator** for custom error key naming. (P3)

### Relationship to other components
- Validators run on any Falcon UI input via the `[ngModel]` or `formControlName` binding.
- `FalconFormValidate` is a form-wide overlay; Falcon UI inputs already carry per-input error display.

### Exact rule for future implementation tasks
> "For new forms, prefer Falcon UI input components' built-in `errorMessage` + `state='error'` Inputs together with Reactive-Forms validators from `falcon-validators.ts` (that is where the live tree validates today — these template directives are largely dormant, only `falconIpAddress` has a live consumer). Reach for a directive-level validator (`falconStartWithLetter`, `falconPhoneNumber`, `falconCheckExists`, `falconIpAddress`, etc.) on an inner `<input>` ONLY when a template-driven form genuinely needs it. AVOID `[falconFormValidate]` on new forms — its inline styles + PrimeNG-era selectors are out of date. Do NOT add new consumers of `FalconEffectiveDate` (no-op stub)."

---

## Dynamic capability assessment

### 1. What is static today?
- Validators all emit fixed error keys.
- `FalconFormValidate` uses inline styles + hardcoded English error key fallback.
- `FalconPhoneMask` is locked to a single format ("XXX XXXXXXXX").

### 2. What is already dynamic through inputs/outputs?
- Each validator directive accepts the relevant `max`/`min` Inputs.
- `FalconCheckExists` accepts the API function + min chars + custom error message + debounce time.
- `FalconColumnName` accepts the `normalizeOnBlurOnly` flag + emits `(normalized)`.
- `FalconTruncate` accepts the text + limit.

### 3. What is already dynamic through slots / ng-template?
- _None._ Directives are DOM mutators.

### 4. What is dynamic through token / theme overrides?
- The injected class names can be styled in theme CSS.
- BUT inline styles in `FalconFormValidate` bypass this.

### 5. What is dynamic through Tailwind classes?
- The consumer's input can carry Tailwind utilities; directives don't interfere.

### 6. What is missing?
- Token-driven error message styling.
- Custom error keys per validator.
- Phone mask format Input.
- Service-level cache for async validation.

### 7. What capability should be added to the shared component vs a one-off page hack?
- Token-driven error styling — SHARED.
- Custom error keys — SHARED.
- Phone format — SHARED.

### 8. What flags / options / templates / slots would make it better?
- `errorKey?: string` on each validator.
- `format?: string` on `FalconPhoneMask`.
- Removal of PrimeNG selectors from `FalconFormValidate`.
- `aria-invalid` + `aria-describedby` wiring in `FalconFormValidate`.

### 9. What is the safest upgrade path?
1. Add token-driven CSS classes (`.falcon-error`, etc.) to theme.
2. Strip inline styles from `FalconFormValidate`.
3. Drop PrimeNG selectors from `FalconFormValidate`.
4. Decide on `FalconEffectiveDate` (re-implement or delete).
5. Add `errorKey` Input to all validators — purely additive.
6. Add `format` Input to `FalconPhoneMask` — purely additive.

### 10. What would be risky to change because other pages depend on it?
- The one verified live consumer: `client-settings-step` depends on `falconIpAddress` (IPv4/IPv6 mode lock + masking + debounced validation). Changing its selector, error keys, or masking behavior is the highest-confidence regression risk in this bundle.
- Any change to error key names (e.g., `falconCheckExists` → `falconExists`) — low live risk now (0 consumers) but would break re-adoption.
- Removing PrimeNG selectors from `FalconFormValidate` — only matters if a latent consumer still has PrimeNG remnants (none found in `apps/` + `libs/falcon/` 2026-06-03).
- Changing inline-style values (e.g., the `9px` left-padding) — moot with 0 `falconFormValidate` consumers.
- **Before deleting any dormant directive**, sweep `libs/falcon-studio*` + future feature folders (out of this pass's grep scope) — treat a delete as HIGH-RISK-QUEUE.

## Verification
🟢 code-verified (B23 refresh 2026-06-03) — LIVE status + 1-consumer footprint confirmed via Glob of the directives folder + Grep of all 12 selectors/class names across `apps/` + `libs/falcon/`. Per-directive READY/stub statuses carried from the prior dossier (the `FalconFormValidate` inline-style/PrimeNG-selector claims not re-read line-by-line this pass → 🟡 for those specific code-quality assertions).
