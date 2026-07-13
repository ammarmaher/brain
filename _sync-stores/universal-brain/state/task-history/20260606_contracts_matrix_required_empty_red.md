# Task — Contracts Add-wizard step-3 matrix: required-empty RED state

- **Completed:** 2026-06-06 (claude)
- **Status:** DONE + build/test/lint GREEN. Live pixel-verify pending user login. NO COMMITS.
- **Repo/branch:** C:/Falcon/Falcon/falcon-web-platform-ui @ polishing-v0.4 (uncommitted contracts tree).

## Ask
In the Add-Contract wizard step 3 (Contract Details), the Falcon-table matrix of rate inputs is required: if the user visits an input and leaves it EMPTY on blur, it should turn RED to indicate a value is expected.

## Solution (ZERO library change)
- Use `<falcon-angular-input-number>`'s built-in `[state]="'error'"` → red ring/border via `--falcon-input` error tokens (+ `aria-invalid`). No hand-rolled color → theme/dark-mode correct.
- Per-cell "visited" tracked in a signal `touchedCells` (`priority::destination`), set on `(focusout)` (bubbles, unlike native blur). Signal (not NgModel.touched) because the component is zoneless — a template-event→signal is the reliable CD trigger.
- `[state]="cellState(...)"` returns `'error'` only when the key is visited AND the EXISTING live `matrix()` cell `ratePerUnit` is null. Reads LIVE `matrix()` (not the deliberately-stale projected `value`), and short-circuits on `touchedCells()` FIRST so an unvisited/focused cell never reads `matrix()` → the "disappears-as-you-type" reference-stability invariant is preserved.
- `touchedCells` reset on app/channel switch (`changeRateSelection`).
- NO `required` attribute (empty = valid "unset" rate dropped from payload; visual hint only, does not gate Save).

## Scope
EDITABLE matrix is ADMIN-only (Add + Edit reuse admin `contract-details-step`). mgmt `contracts-contract-details-section` is view-only — mirrored for byte-parity (inert).

## Files
- admin `contracts-add-wizard/contract-details-step/contract-details-step.component.{ts,html}`
- mgmt `contracts-contract-details-section/contracts-contract-details-section.component.{ts,html}`
- admin `tests/contracts/contract-matrix-deepdive.spec.ts` (+11 → 29)
- mgmt `tests/contracts/contracts-contract-details-section.component.spec.ts` (+7 → 26)

## Verification
- admin vitest 775/775 (38 files); mgmt vitest 604/604 (27 files).
- admin `nx build --configuration=development` EXIT 0 (hash ab751df561bbe395); mgmt EXIT 0.
- admin + mgmt `nx lint` 0 errors (2 pre-existing non-null-assertion warnings in unrelated addons spec).

## Notes
- Parked the prior wallet-transfer-restore task to `state/parked-tasks/20260606_wallet-main-transfer-restore-PARKED.json` (was blocked on user login for a PES probe).
- A concurrent session holds the shared `current-task.json` (Add-Client row vcenter); this task tracked via the sidecar `current-task.contracts-matrix-required-red.json`.
- Memory: `project_contracts_matrix_required_empty_red_2026_06_06.md`.
