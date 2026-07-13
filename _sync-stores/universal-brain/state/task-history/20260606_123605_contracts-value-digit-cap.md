# Task: Contracts value digit-cap enforcement (2026-06-06)

STATUS: completed (build + test verified; NO COMMITS; branch polishing-v0.4)
REPO: C:/Falcon/Falcon/falcon-web-platform-ui

## Request
User: in Contracts & Cost Mng (admin + mgmt), Add/Edit contract value fields (Step-1 Value, Contract Details matrix, Addons) must cap the digits BEFORE the decimal. After-dot (4 decimals) already works.

## Clarification (AskUserQuestion)
The literal "max 4 digits before the dot" conflicted with the documented xlsx SoT (matrix 6 / addons 9 / Value 9). User chose:
- Q1 = "Keep 6/9, just enforce" (do NOT reduce to 4; enforce the existing caps so they block typing).
- Q2 = "Both apps incl. mgmt" (update mgmt inactive editable branches too).

## Root cause
Before-the-dot cap is enforced by the Stencil falcon-input-number-tw `wouldExceedMax` guard, which only fires when a numeric [max] is bound. Admin Step-1 Value input had NO [max] -> unlimited integer digits typeable (only a soft reactive validator flagged it after). Admin matrix/addons/rate-card already bind [max] (enforce 6/9). Mgmt is view-only; editable branches were stale (addons/rate-card had no [max]; matrix used string grid-input).

## Changes (5 M + 1 new)
1. admin contract-information-step.component.html: [max]="999999999" on Step-1 Value (THE live fix).
2. mgmt contracts-addons-section.component.html: [max]="999999999.9999" on both addon inputs.
3. mgmt contracts-rate-card-section.component.html: [max]="999999.9999" on price-value input.
4. mgmt contracts-contract-details-section.component.{ts,html}: migrated matrix editable grid-input -> input-number (min 0, [max]=999999.9999, maxFractionDigits=6, [ngModel]=cell.ratePerUnit, (valueChange)=onCellValueChange; replaced onCellCommit/cellDisplayValue/parseRate with onCellValueChange/normalizeRate, mirrors admin). Read-only formatAmount(v,6) preserved (no after-dot change).
5. NEW mgmt tests/contracts/contract-matrix-number-input.spec.ts (8 tests).

## Verification
BUILD EXIT 0 (strictTemplates clean, falcon-ui-core rebuilt). TESTS EXIT 0 (admin 686, mgmt 467 incl new spec). 

## Pending
- Live pixel verify needs sys-admin login (assistant cannot type pw).
- User must restart `npm start` (live serve stopped to build).
