---
name: reference_pricetype_enum_canonical_mapping_2026_05_31
description: "Canonical ePricingType→backend-int mapping (Monthly=1/Yearly=2/OneTime=3); add-client wire-builder is CORRECT, the spec was the drifted side — fixed 2026-05-31"
metadata: 
  node_type: memory
  type: reference
  originSessionId: a9625217-a125-498f-b3b3-28ccd1e72465
---

# ClientPriceType → backend ePricingType int — canonical mapping (RESOLVES the wire-builders.spec.ts drift spin-off)

🔵 CODE-VERIFIED 2026-05-31. branch polishing-v0.4. NO COMMITS (test-only edit).

## The canonical contract (4 sources, all agree)
`ePricingType { None=0, Monthly=1, Yearly=2, OneTimePayment=3 }`
- `[CODE]` `falcon-core-commerce-svc/src/Falcon.Commerce.Domain/Constants/Enums .cs:63-69` ← OWNS CreateAccountRequest / CreateMainNodeCommand
- `[CODE]` `falcon-int-system-gateway-svc/src/Falcon.System.Gateway/Constants/Enums.cs:35-41`
- `[CODE]` `falcon-int-core-gateway-svc/src/Falcon.Core.Gateway/Constants/Enums.cs:26-32`
- `[CODE]` FE shared-types `libs/falcon/src/shared-types/lib/enums/globels.ts:57-61` → `PricingType { Monthly=1, Yearly=2, OneTimePayment=3 }`

## Who was right
- **Wire-builder `PRICE_TYPE_TO_NUM` is CORRECT** — `wire-builders.ts:163-168` (add-client-wizard/models): `'':null, 'Monthly':1, 'Yearly':2, 'OneTime':3`. Matches backend verbatim. **DO NOT "fix" the builder.**
- **The spec was WRONG (stale)** — `apps/admin-console/tests/wire-builders.spec.ts` had asserted `Monthly:2 / OneTime:1 / Yearly:4`. `Yearly:4` is not even a valid `ePricingType` value (range 0..3) and would fail the create-account POST's `[ThrowIfNotEnumValue<ePricingType>]` model check → HTTP 422. The wire-builder comment already flagged `Yearly:4` as "the old" bad value.

## Fix applied
Corrected the 3 assertions + their `it()` titles in `wire-builders.spec.ts` ("service rows (commChannels + applications)" describe block) to the canonical ints, plus a sourcing comment. `npx vitest run --config apps/admin-console/vite.config.mts tests/wire-builders.spec.ts` → **31/31 pass**. Builder untouched.

## Trap for future agents
The 3 failures were PRE-EXISTING test drift, NOT a data bug. Making the tests pass by editing the builder would have shipped invalid ints to the backend. Rule: when a test asserts an enum int, verify against the C# `ePricingType` (and FE `globels.ts`) before assuming the builder is wrong.

Closes the "wire-builders.spec.ts priceType enum drift (spin-off raised)" item flagged in [[project_org_hierarchy_subnode_hide_comm_app_tabs_2026_05_31]].
