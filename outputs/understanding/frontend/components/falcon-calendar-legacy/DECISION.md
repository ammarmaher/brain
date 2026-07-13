# falcon-calendar (LEGACY FACADE — REMOVED) — DECISION

## Brain SK final recommendation

### Status
- **REMOVED (2026-06-03).** Was a LEGACY FACADE / ORPHAN (Wave 3) with **0 consumers**; deleted (barrel comment `shared-ui/index.ts:313` documents it). No production presence.
- Migration targets: **`<falcon-angular-date-picker>`** (field, `shared-ui/index.ts:330`) + **`<falcon-angular-calendar>`** (inline grid, `index.ts:315`) — both LIVE.
- ⚠ Do NOT confuse with the unrelated modern Stencil `<falcon-calendar>` that reuses the tag name.

### Use this component for
- **Nothing.** It does not exist. Use `<falcon-angular-date-picker>` / `<falcon-angular-calendar>`.

### Avoid this component for
- Everything. The import (`FalconCalendarComponent`) does not resolve.

### Preferred variant / render path
- N/A (removed).

### Required upgrades before wider use
- **NONE.** Deletion complete.

### Relationship to other components
- Replaced BY `<falcon-angular-date-picker>` (primary) + `<falcon-angular-calendar>` (inline grid).
- Paired with `FalconEffectiveDateDirective` — now a standalone Wave-3 no-op orphan (0 consumers).

### Exact rule for future implementation tasks
> "Do NOT reference the legacy `<falcon-calendar>` / `FalconCalendarComponent` — it is REMOVED. For a date field use `<falcon-angular-date-picker>` (CVA, min/max, disabled-dates); for an inline month grid use `<falcon-angular-calendar>`. Express effective-date rules in `validations.ts` or via `disabledDates`, NOT the dead `useEffectiveDateValidation` inputs. If a design needs a Set/Cancel confirm step, raise a date-picker footer-action feature — never re-introduce PrimeNG `<p-datepicker>`."

### Safe-to-deprecate assessment (B22)
**SAFE — already deprecated AND removed.** Zero live consumers at every sweep (Wave 3, Wave 7, B22). No HIGH-RISK-QUEUE item. Only residue is the `FalconEffectiveDateDirective` no-op orphan (0 consumers) — a `safe-local` cleanup candidate, not a blocker.

---

## Dynamic capability assessment

### 1. What is static today?
- N/A — removed. (Historically: 5 effective-date inputs were silent no-ops in the façade; the PrimeNG original had a fixed Set/Cancel overlay.)

### 2. What is/was dynamic through inputs/outputs?
- (Historical) `placeholder`, `disabled`, `styleClass` + `[(ngModel)]` `Date` via CVA + `(dateChange)`. The 5 effective-date inputs were no-ops.

### 3. What is/was dynamic through slots / ng-template?
- _None._

### 4. What is/was dynamic through token / theme overrides?
- (Historical) via PrimeNG theme; no Falcon token contract of its own. The modern replacements are `--falcon-date-picker-*` / `--falcon-calendar-*` driven.

### 5. What is/was dynamic through Tailwind classes?
- `styleClass` input forwarded to PrimeNG.

### 6. What is missing?
- N/A — superseded. (Historically: Set/Cancel UX + effective-date validation — raise on the date-picker / host `validations.ts` if needed.)

### 7. What capability should be added to the shared component (not a page hack)?
- An optional footer action-bar (Set/Cancel / Apply) on `<falcon-angular-date-picker>` — raise there, not here.

### 8. What flags / options / templates / slots would make it better?
- N/A — migrate.

### 9. What is the safest upgrade path?
- **Done.** 0 consumers → folder deleted → barrel export removed (comment documents it). Optionally delete the `FalconEffectiveDateDirective` no-op orphan next.

### 10. What is risky to change because other pages depend on it?
- **Nothing** — 0 live consumers at every sweep. Removal was the lowest-risk possible.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B22). Recommendation: REMOVED / use `<falcon-angular-date-picker>` + `<falcon-angular-calendar>`. Safe-to-deprecate = SAFE (already executed, never had consumers). No HIGH-RISK-QUEUE; one `safe-local` orphan directive noted.
