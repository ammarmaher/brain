# Create test contracts in Test Tenant 001 as sysadmin — 2026-06-25

## Outcome: COMPLETED ✅
Created 3 contracts in **Test Tenant 001** (`000000000000000000a11001`) via the Commerce backend API, authenticated as the **sysadmin** Falcon user.

| contractId | Name | Committed | Rates | Status |
|---|---|---|---|---|
| CTR-6A3D028C | TT001 Voice & SMS Bundle 2026 | 500,000 SAR | 3 | Active (auto by lifecycle worker; window in effect) |
| CTR-6A3D02D7 | TT001 WhatsApp Engagement H2 2026 | 250,000 SAR | 2 | Pending (starts 2026-07-01) |
| CTR-6A3D02D9 | TT001 Email Relay Annual 2026 | 100,000 SAR | 1 | Pending (starts 2026-08-01) |

All currency = 1 (SAR, = account wallet currency). `createdBy` = `6a085915164fb80e0b9df8a3` (sysadmin).

## How
- Token via identity login (`POST :7777/api/auth/login` sysadmin/Admin@1234) — delegated discovery to ammar-auth; verified token accepted by Commerce (200).
- `POST :7045/api/Contracts` ×3. Grounded all payload gates from Commerce source (CreateContractHandler, Contract.Create/Validate, ValidateContractWalletStrategyPolicy) and live Mongo (account node, wallet currency, catalog ids).
- Verified via API GET (3 returned) + Mongo.

## Findings (out of scope — flagged for backend)
1. **contractId same-second collision** — `Contract.Create` builds contractId from the ObjectId timestamp (8 hex = seconds); two creates within one second collide on unique index → 409 DuplicateValue. Worked around with >1s spacing.
2. **createdBy never stamped** — `user-id` not mapped from Zitadel metadata to a flat claim, so `ICurrentUser.UserId` is always null; all 14 contracts had createdBy null. Stamped sysadmin id manually.

Memory: reference_create_contract_api_sysadmin_recipe_2026_06_25.md
