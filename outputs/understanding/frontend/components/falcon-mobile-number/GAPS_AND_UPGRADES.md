# falcon-mobile-number (LEGACY — REMOVED) — GAPS & UPGRADES

## RECONCILE 2026-06-03 (B22) — DELETION FLAG

`[CODE]` **The component is DELETED from the production tree.** All historical "upgrade" gaps below are now **moot** — the recommendation everywhere was "migrate to `<falcon-angular-phone-field>` and delete the folder," and that has happened:
- `Glob libs/falcon/src/shared-ui/lib/components/falcon-mobile-number/**` → No files found.
- `Grep "<falcon-mobile-number"` (non-`dist`) → 0 live consumers (only historical `docs/_plans/` + `docs/archive/` references).
- `shared-ui/index.ts` → no `FalconMobileNumberComponent` re-export (only `FalconAngularPhoneFieldComponent`, line 343).
- The Wave-7 sole consumer `forgot-password-flow.component.html` migrated to `<falcon-angular-phone-field>` (lines 60-71).

**Wave flag: DELETION CONFIRMED (already executed). No promotion. No HIGH-RISK-QUEUE item — removal carried no blocking consumer.**

The historical SCSS-rule violation (#2 below) and banned-dependency risk are **resolved by the deletion**.

---

## Historical gaps (resolved by removal)

### 1. (was P0) Silent no-op inputs
- `preferredCountries`, `showDialCode`, `maxLength` accepted values but did nothing. **Resolved** — inputs gone with the component; the replacement renders one searchable country list.

### 2. (was P0) SCSS file violated the no-SCSS house rule
- `falcon-mobile-number.component.scss` existed. **Resolved** — `[CODE]` deleted with the folder (Glob = empty).

### 3. (was P1) Limited country list (25 countries)
- `ISO2_TO_DIAL` covered 25 countries. **Resolved** — `<falcon-angular-phone-field>` has the complete list.

### 4. (was P1) `requiredErrorMessageKey` not surfaced if `error=true`
- Message-precedence quirk. **Resolved** — moot; the migrated consumer drives `[errorMessage]` via its own validator.

### 5. (was P2) No country-change Output
- The façade did not re-emit `falcon-country-change`. **Resolved** — `<falcon-angular-phone-field>` exposes the country-change event directly.

## Rubric audit (§5) at removal
- **A — Angular 21:** legacy `@Input`/`@Output` + `FormControl`/RxJS, NO signals, NO Stencil (single-render). Was already off-pattern → a reason for deprecation. (Component gone; informational only.)
- **B — Stencil dual-render:** N/A (no Shadow/`-tw` twin). The lack of a Stencil twin meant no cross-framework parity — a core reason it lost to `<falcon-angular-phone-field>`.
- **C — Falcon house rules:** violated no-SCSS (had a `.scss`); (old-UI) used banned `pi pi-info-circle` icon + `ngx-intl-tel-input`/`google-libphonenumber`. All resolved by removal.
- **D — Accessibility:** delegated to the intl widget / phone-field; no a11y of its own.
- **E — Cross-framework parity:** none (no React/Vue twin). N/A.
- **F — Completeness/drift:** the dossier carried a 🔴 internal contradiction (façade vs raw `ngx-intl-tel-input`); RECONCILED this pass — both snapshots resolve to REMOVED.

## Missing tests
- None relevant — component removed.

## Recommended action
- **None.** Migration + deletion are complete. Keep this dossier as a historical migration map; the canonical phone control is `<falcon-angular-phone-field>` (`falcon-phone-field` dossier).

## Wave 7 Findings (2026-05-17)
**Consumer count: 2** ([CODE] grep `<falcon-mobile-number>` across `apps/` + `libs/falcon/`) — `forgot-password-flow.component.html` + the component's own template. Gap noted: pure-Angular, no Stencil twin → no cross-framework parity (P2).

## Deep-Dive Sweep Findings (2026-06-03 — B22)
**Consumer count: 0** ([CODE] grep `<falcon-mobile-number>` non-`dist`). **DELETION CONFIRMED** — folder gone, barrel export gone, sole consumer migrated to `<falcon-angular-phone-field>`. Prior 🔴 façade-vs-raw contradiction resolved (two snapshots, one outcome). All findings `safe-local` (doc/dead-orphan). See `FINDINGS/B22.md`.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B22) — DELETION confirmed (Glob + grep + barrel). Historical gaps preserved as resolved-by-removal. No HIGH-RISK-QUEUE.
