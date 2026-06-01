---
name: add-client-pricetype-enum-drift-fix-2026-05-30
description: Add Client wizard create-account 422 root cause + fix — FE PRICE_TYPE_TO_NUM was scrambled vs BE ePricingType
metadata: 
  node_type: memory
  type: project
  originSessionId: b6e83442-1b0a-4ceb-ac5a-03a7c46b6a07
---

**Add Client (commerce/Node/create-account) returned HTTP 422 because the admin-console wizard's `PRICE_TYPE_TO_NUM` map was scrambled vs the backend `ePricingType` enum.** Fixed 2026-05-30 (FE only, build-green, NO COMMITS).

**Root cause:** [CODE] `wire-builders.ts` `PRICE_TYPE_TO_NUM` mapped `OneTime:1, Monthly:2, Quarterly:3, Yearly:4`. BE [CODE] `Enums.cs:63` `ePricingType` = `None=0, Monthly=1, Yearly=2, OneTimePayment=3` (NO 4, NO Quarterly). Picking **Yearly** → sent `4` → BE DTO `[ThrowIfNotEnumValue<ePricingType>]` on `Service.PriceType` (CreateAccountRequest.cs:98) → `Enum.IsDefined`=false → `FalconException(InvalidValue)` → `[ErrorHttpStatus(422)]` → **422**. Worse: Monthly→2 silently stored as Yearly, OneTime→1 as Monthly (data-integrity bug, not just the 422).

**Validation path:** ASP.NET model validation recurses into `CommChannels.Services[]`/`Applications.Services[]`; the custom DataAnnotations attrs in `ValidationAttribute.cs` THROW FalconException (not return), caught by `FalconExceptionHandler` → `ErrorStatusCodeRegistry.ResolveStatusCode` reads `[ErrorHttpStatus]`. InvalidValue=422, RequiredFieldMissing/MaxLengthExceeded=400.

**Fix (3 files, add-client-wizard):** `wire-builders.ts` map → `Monthly:1, Yearly:2, OneTime:3` (''→null); removed dead `Quarterly` from `ClientPriceType` union in `models.ts:129` (unreachable — not in `PRICE_TYPE_OPTIONS`, BE can't accept it); corrected stale comment in comm-channels `validations.ts:32` that falsely claimed "Backend enum includes Quarterly". Wizard is CREATE-ONLY → no inverse decode map to fix. `nx build admin-console --skip-nx-cache` GREEN (hash 26f59314e732eefa). Build-verified, NOT browser-E2E (needs Docker stack :7256 + Falcon login).

**Gotchas / follow-ups:** (1) If product wants a **Quarterly** pricing type it's a BE gap — add to `ePricingType` + `PRICE_TYPE_OPTIONS` + canonical xlsx, don't fake on FE. (2) NOT audited: mgmt-console (:4301) + change-price-type/marketplace/do-payment pricing flows may have the same drift pattern — separate from this 422. (3) BE `CreateMainNodeProcess.CreateAccountServicesRequest` computes `accountServicesRequest` but never uses it (line 66) — comm-channel/app pricing isn't forwarded on account creation; dead computation, candidate cleanup. NO COMMITS · 2026-05-30
