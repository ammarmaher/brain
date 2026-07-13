---
name: project_price_value_type_validation_sot_2026_06_20
description: "Service-pricing Price Type + Price Value now follow the SoT (integer 0..999,999,999, numbers-only via input-number) in the Shadow Row + Add Client Steps 3&4; 15-digit \"per Ammar\" cap reverted to 9."
metadata: 
  node_type: memory
  type: project
  originSessionId: c90e8e02-6cf7-45f7-a9e8-c90b21ec7807
---

Service-pricing **Price Type + Price Value** validation aligned to the SoT screenshot (Visibility / Price Type / Price Value "Shadow Row"). 2026-06-20 (claude), FE-only, NO commits. 3 app builds GREEN; admin-console 841 unit tests PASS.

**SoT (xlsx + a.sukkariyeh screenshot 2026-06-20):** Price Value = digits only, integer, ≥ 0, ≤ **999,999,999** (no minus, no decimals; invalid sample 1,250,000,000). Price Type = DDL {Monthly, Yearly, One Time Payment}, "Please select a price type." Both mandatory only when Visibility = ON.

**CONFLICT resolved by user (AskUserQuestion):** code had a documented "Ammar 2026-05-24" bump to **15 digits** (999,999,999,999,999) in the shared validator; user chose **999,999,999 (follow screenshot)** → reverted to 9-digit ceiling everywhere.

**Root cause of the violation:** Shadow Row Price Value used `<falcon-angular-input type="number">` + a save check of only `value ≥ 0` → decimals, no max, and `e`/`+`/`-` slipped through. Wizard steps used `type="text" inputMode="numeric" maxlength` (inputMode = mobile hint only; never blocks desktop letters). Fix = the numbers-only Falcon component `<falcon-angular-input-number [integer]="true" [min]="0" [max]="999999999">` (DOM-level keystroke+paste+beforeinput filter at `[CODE] falcon-input-number-tw.tsx:283-518`; `wouldExceedMax` blocks the 10th digit). Same component pattern as [[project_account_limitation_max_allowed_numbers_only_2026_06_20]].

**Changed (3 "places that have price type/value" + shared layer, 8 files):**
- Shadow Row (shared lib, BOTH consoles' org-hierarchy Apps&Services + Comm-Channels tabs): `[CODE] libs/falcon/src/shared-features/service-pricing-table/service-pricing-table.component.{html,ts}` — input→input-number; `onShadowRowSave` price-value now integer/≥0/≤999,999,999 with SoT messages; price-type required guard; dropped unused FalconAngularInputComponent.
- Add Client **Step 4 Applications** + **Step 3 Comm-Channels** (admin): `client-{applications,comm-channels}-step.component.{html,ts}` — input→input-number (number `[ngModel]`, `setPriceValue(number|null)`); price-type error → "Please select a price type."
- Shared validator: `falcon-validations.ts` `PRICE_VALUE_MAX` 999_999_999_999_999 → **999_999_999**; `named-validators.ts` `PRICE_VALUE_MAX_DIGITS` 15 → **9**.
- i18n `libs/falcon/src/language/i18n/{en,ar}.json` `errors.*`: added `priceValueInteger`, `priceValueMin`, `priceValueMax`, `priceTypeRequired`.

**Out of scope (different domain):** Contracts rate-card/addons priceValue = DECIMAL currency (0..999,999,999.9999, own validators in contracts-cost-management) — NOT the service "price type/value" field; left unchanged.

VERIFY: `nx run-many build admin-console,host-shell,management-console` GREEN (pre-existing NG8102/bundle-budget warnings only). admin `nx test` 841 PASS; 1 test FILE fails to LOAD on pre-existing `@host-shell/*` alias resolve in `contracts-cost-management.component.ts:92` (unrelated). Live-UI user-gated.
