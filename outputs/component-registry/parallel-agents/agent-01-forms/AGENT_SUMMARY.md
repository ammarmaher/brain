# Agent 1 — Forms / Input Components — Summary

## Scope

Forms / input components from `libs/falcon-ui-core/src/angular-wrapper/components/` (plus one legacy bespoke from `libs/falcon/src/shared-ui/lib/components/`).

## Totals

| Section | Count |
|---|---|
| Components investigated | 22 |
| Component folders created | 22 |
| Total markdown files in `components/` | 132 (= 22 × 6) |
| Agent-root files | 3 (this file + COMPONENT_COVERAGE.md + UPGRADE_CANDIDATES.md) |
| Source files read | 30+ (Angular wrappers + Stencil Shadow `.tsx` + types + utils + token CSS files + select HTML usage in apps) |

## Components covered

`falcon-input` (flagship reference), `falcon-dropdown`, `falcon-multi-select`, `falcon-combobox`, `falcon-checkbox`, `falcon-checkbox-group`, `falcon-radio`, `falcon-radio-group`, `falcon-switch`, `falcon-textarea`, `falcon-password`, `falcon-input-number`, `falcon-email-field`, `falcon-phone-field`, `falcon-calendar` (Stencil), `falcon-date-picker`, `falcon-otp`, `falcon-otp-send-dialog`, `falcon-search-input`, `falcon-grid-input`, `falcon-form-field` (legacy bespoke), `falcon-select` (alias).

## Top dynamic-capability findings (top 5)

1. **`useTailwind` dual-render-path is the universal hinge.** Every dual-rendered wrapper exposes the same toggle, and the Tailwind path uses cross-framework `<falcon-X-tw>` Light DOM web components whose class strings come from shared helpers in `libs/falcon-ui-core/src/tailwind/`. This means a Studio that mutates `--falcon-<component>-*` tokens at runtime updates Shadow + Light identically. Token contract: SSOT.

2. **`<falcon-angular-input>` is the proven reference implementation.** It demonstrates: dual-render path, full CVA, 27 inputs covering size / state / variant / appearance + 4 feature toggles, 5 events, `prefix` / `suffix` slots (Shadow only), per-instance token override (host class + CSS file). All other form-control wrappers follow the same shape with subtle naming inconsistencies.

3. **Form-control inputs have HUGE consistency drift.** Specifically: `<falcon-angular-dropdown>` + `<falcon-angular-multi-select>` + `<falcon-angular-checkbox>` + `<falcon-angular-radio>` use `errorText`, while `<falcon-angular-input>` + `<falcon-angular-textarea>` + `<falcon-angular-input-number>` + `<falcon-angular-email-field>` + `<falcon-angular-phone-field>` + `<falcon-angular-password>` + `<falcon-angular-date-picker>` use `errorMessage`. Plus `<falcon-angular-otp>` uses `errorMessage`. Pattern-break across the family — high-priority alias work.

4. **CVA coverage gaps cluster around calendar + date-picker + search-input.** All three lack `ControlValueAccessor`. Calendar + date-picker also lack range / time / Hijri support. Date-picker is the most painful gap because forms expect `formControlName` binding for ALL form controls.

5. **Per-item / per-option / per-chip / ng-template support is the single biggest cross-component gap.** Dropdown, multi-select, combobox, checkbox-group, radio-group, OTP — none expose `@ContentChild`-style template directives. Only `<falcon-angular-data-table>` follows the `FalconDataTableCellDirective` pattern. A single shared directive pattern would unlock per-option / per-chip / per-row custom rendering across at least 6 components. **This is the largest reusability win in scope.**

## Top reusable-upgrade ideas (top 5)

1. **Universal `FalconOptionTemplateDirective` pattern.** Apply to dropdown, multi-select, combobox, checkbox-group, radio-group, OTP, phone-field's country list. One directive that components recognize via `@ContentChild` projection. Unlocks per-option icon + sub-label + status pill rendering across the whole family without per-component reinvention.

2. **Form-control naming harmonization (errorMessage everywhere).** Add `errorMessage` as alias on every wrapper that currently uses `errorText`. Soft-deprecate `errorText` via JSDoc. Migrate consumers gradually. Zero breakage during transition.

3. **CVA backfill for calendar + date-picker + search-input.** Make all three implement `ControlValueAccessor` (additive — keeps existing `(valueChange)` outputs). Particularly date-picker — it's the most consumed of the three and currently needs awkward two-way + event wiring.

4. **Method-proxy harmonization across all wrappers.** Add `setFocus()` / `clear()` / `openPanel()` / `closePanel()` (where applicable) on the Angular wrappers. Currently consumers reach into `nativeElement` to call Stencil-side methods. A consistent `@Method()`-proxied API on each wrapper would standardize this.

5. **`falcon-form-field` deprecation path.** Migrate legacy SCSS → Tailwind + tokens, add programmatic label-for-control association, run a workspace-wide audit replacing `<falcon-form-field>` wrappers around Falcon inputs with the Falcon inputs' built-in `label` / `errorMessage` inputs. Long-tail cleanup but unlocks Tailwind-only discipline.

## Hotspots / risk areas

- **`pushOptions()` race-guards** in dropdown + multi-select rely on `customElements.whenDefined` + `componentOnReady`. Fragile — any timing change breaks option loading.
- **Validation-deferred pattern** (otp / phone / email / single-uploader) is consistent but inadequately documented. Several wrappers emit `falcon-verify` events with no guidance for handling failure states.
- **Phone-field country dropdown (~250 entries) renders eagerly** — performance concern at scale (5+ phone fields on a page).
- **Form-field SCSS file violates no-SCSS rule** — known legacy carryover.

## Naming inconsistencies catalogued

| Component | Error input | Notes |
|---|---|---|
| input | `errorMessage` | Consistent. |
| textarea | `errorMessage` | Consistent. |
| input-number | `errorMessage` | Consistent. |
| email-field | `errorMessage` | Consistent. |
| phone-field | `errorMessage` | Consistent. |
| password | `errorMessage` | Consistent. |
| date-picker | `errorMessage` | Consistent. |
| OTP | `errorMessage` | Consistent. |
| dropdown | **`errorText`** | DRIFT. |
| multi-select | **`errorText`** | DRIFT. |
| combobox | **none** | DRIFT (worse). |
| checkbox | **`errorText`** | DRIFT. |
| checkbox-group | **`errorText`** | DRIFT. |
| radio | **`errorText`** | DRIFT. |
| radio-group | **`errorText`** | DRIFT. |
| switch | **`errorText`** | DRIFT. |
| form-field | **`errorKey`** | Different by design (legacy, takes i18n key). |
| calendar | n/a | Doesn't have error input. |
| search-input | n/a | Doesn't have error input. |
| grid-input | n/a | Doesn't have error input. |

8 components use `errorText`. 8 use `errorMessage`. Combobox has none. This is the highest-leverage cleanup.

## Cross-link to out-of-scope items

- Legacy `falcon-calendar` facade at `libs/falcon/src/shared-ui/lib/components/falcon-calendar/` — Wave 3 façade delegating to `<falcon-angular-date-picker>`. Out of Agent 1 scope; flagged here for Agent 7 cross-merge.

## Done state

- All 22 assigned components have all 6 files. ✓
- AGENT_SUMMARY.md, COMPONENT_COVERAGE.md, UPGRADE_CANDIDATES.md present. ✓
- Used Write tool (UTF-8). ✓
- Did not write into `component-registry/components/`. ✓
- Did not write into `frontend-understanding/`. ✓
- Did not commit. ✓
