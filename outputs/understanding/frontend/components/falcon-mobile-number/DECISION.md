# falcon-mobile-number (LEGACY — REMOVED) — DECISION

## Brain SK final recommendation

### Status
- **REMOVED (2026-06-03).** Was a LEGACY FACADE / compile-only shim (Wave 2); **deleted** after the last consumer migrated. No production presence.
- Migration target: **`<falcon-angular-phone-field>`** (`FalconAngularPhoneFieldComponent`, `shared-ui/index.ts:343`) — LIVE.

### Use this component for
- **Nothing.** It does not exist. For intl phone capture use `<falcon-angular-phone-field>`.

### Avoid this component for
- Everything. The import does not resolve.

### Preferred variant / render path
- N/A (removed). The replacement defaults to `useTailwind=true` (Light-DOM `<falcon-phone-field-tw>`).

### Required upgrades before wider use
- **NONE.** Migration + deletion complete.

### Relationship to other components
- Replaced BY `<falcon-angular-phone-field>` (the modern dual-render Stencil-backed phone control).
- Sibling pattern: `<falcon-angular-email-field>` (single-element verify-field).

### Exact rule for future implementation tasks
> "Do NOT reference `<falcon-mobile-number>` / `FalconMobileNumberComponent` — it is REMOVED. Use `<falcon-angular-phone-field>` directly: `[label]` (pre-translated), `[country]='SA'`, CVA via `[(ngModel)]`/`formControlName`, `[state]`/`[errorMessage]` for validation, `(falcon-verify)` for OTP. The E.164 string contract is identical, so a migrated form model rarely changes."

### Safe-to-deprecate assessment (B22)
**SAFE — already deprecated AND removed.** Zero live consumers blocked the removal (the one real consumer migrated first). No HIGH-RISK-QUEUE item: there is nothing left to remove and no contract still depended on it.

---

## Dynamic capability assessment

### 1. What is static today?
- N/A — component removed. (Historically: 3 silent no-op inputs + a fixed 25-country `ISO2_TO_DIAL` map.)

### 2. What is/was dynamic through inputs/outputs?
- (Historical) `labelKey`, `required`, `defaultCountry`, `error`, `errorMessageKey`, `requiredErrorMessageKey`, `useCustomStyle` + CVA + Validator. No `@Output`. The replacement adds `(blur)` + `falcon-verify`/`falcon-country-change`.

### 3. What is/was dynamic through slots / ng-template?
- _None._

### 4. What is/was dynamic through token / theme overrides?
- Via the embedded Falcon phone-field (`--falcon-phone-field-*`). No tokens of its own.

### 5. What is/was dynamic through Tailwind classes?
- Outer wrapper + a `@HostBinding('class.fpf-standard')`.

### 6. What is missing?
- N/A — superseded. (Historically wanted: country-change Output + more countries — both present on the replacement.)

### 7. What capability should be added to the shared component (not a page hack)?
- N/A — the shared replacement `<falcon-angular-phone-field>` already covers the surface.

### 8. What flags / options / templates / slots would make it better?
- N/A — migrate.

### 9. What is the safest upgrade path?
- **Done.** Consumers migrated to `<falcon-angular-phone-field>`; folder deleted; barrel export removed. The E.164 string contract made migration drop-in.

### 10. What is risky to change because other pages depend on it?
- **Nothing** — 0 live consumers at removal. The risk window (a latent consumer relying on the silent no-op inputs) was checked by grep and found empty before deletion.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B22). Recommendation: REMOVED / use `<falcon-angular-phone-field>`. Safe-to-deprecate = SAFE (already executed, 0 blocking consumers). No HIGH-RISK-QUEUE.
