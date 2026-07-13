# falcon-shared-types — DECISION

## Brain SK final recommendation

**STATUS: READY (foundational shared vocabulary). Use as the single home for shared enums, the `ServiceOperationResult<T>` envelope, wire DTOs, and the `FalconAccess` PES query registry. The lowest dependency-tier lib — keep it dependency-light (types + pure constants + pure fns only, never `@Injectable`/HTTP).**

## Use this area for

- **Any enum/type/constant shared by >1 feature or app** — declare it here once.
- **A PES access query** — add a `FalconAccess.*` factory (the registry is the ONLY place FE access queries are minted; `@falcon/core` consumes them).
- **A backend response** — `ServiceOperationResult<YourDto>` + declare `YourDto` here if shared.
- **A status / role / pricing-type label** — reuse the `*I18n` / `*ToString` / `FALCON_STATUS_*` maps.
- **User-type checks** — `USER_TYPE_STRINGS` + `stringToUserType` / `isValidUserTypeString`.
- **Policy-subject build/parse** — `buildAccountUserPolicySubject` / `parsePolicySubject`.
- **Route-scope checks** — `AppRouteScope` + `isPathInScope` + `APP_ROUTES`.

## Avoid this area for

- **Single-app DTOs/enums** → keep them in the feature folder.
- **Runtime services / HTTP** → `shared-data-access` (L04). This lib has no DI.
- **The wallet `NodeType`/`WalletType`** → those are `@falcon/wallet`'s (collision-isolated); this lib's `NodeType` is Root/Main/Sub and `WalletType` is SingleWallet/MultipleWallets.
- **New form-validation rules** → the validations registry in `shared-utils` (L03).

## Preferred idiom

- **`FalconAccess.*` factories** for every PES query — never inline `{action,resource}`.
- **`*I18n`/`*ToString`/`FALCON_STATUS_*` maps** for every enum→label/severity — never re-map in a feature.
- **`ServiceOperationResult<T>`** as the response type; read `errorMessages[0]` for localized errors.
- **`USER_TYPE_STRINGS`** constants over magic `'1'`/`'2'`.

## Required upgrades before wider use

**None block usage.** The two HIGH-RISK-QUEUE items are test/contract coverage, not blockers: F1 (no unit specs on the authz-critical pure fns + PES query strings) and F2 (no enforced link between the `FalconAccess` registry and the PES seed). The lib is foundational and stable.

## Relationship to other areas

- **Foundation for `@falcon` shared-data-access** (L04 sibling) — supplies `ServiceOperationResult`, `Gateway`, all wire DTOs, `Hook`/`LookupValueResponse`, `FalconItemStatus`, `USER_TYPE_STRINGS`.
- **Foundation for `@falcon/core`** (L02) — `AccessControlFacade`/`CurrentSubjectBuilder`/guards consume `AccessQuery`/`FalconAccess`/policy-subject helpers/`AppRouteScope`/`USER_TYPE_STRINGS`.
- **Foundation for `@falcon` shared-utils** (L03) — `FALCON_ROOT_NODE`, `ContactGroup*`, `FalconItemStatus`/`PricingType`/`PasswordSecurityLevel`.
- **Composes with `@falcon` language** (L03) — the `*I18n` keys are resolved by `TranslateService`.
- **Sibling-isolated from `@falcon/wallet`** — that alias owns its own `NodeType`/`WalletType` to avoid a dup-export break.

## Exact rule for future implementation tasks

1. **Shared enum/type/constant?** Declare it here; export through the barrel; consume via `@falcon`.
2. **New PES query?** Add a `FalconAccess.<surface>.<verb>()` factory returning `AccessQuery`; confirm the `{action,resource}` matches the PES seed.
3. **New backend DTO shared by both apps?** Add it here as a camelCase `interface` (match the wire); type the call as `ServiceOperationResult<It>`.
4. **Reuse the projection maps** for any enum label/severity — do not re-map.
5. **Never rename a `FalconAccess` action/resource string** without PES-side confirmation (silent default-deny).
6. **Never add `@Injectable`/`HttpClient`** here — it must stay the lowest, dependency-light tier.
7. **Wallet `NodeType`/`WalletType` come from `@falcon/wallet`**, not here.
8. **Keep the acc-admin/acc-user display override** in `getRoleDisplayNameFromRoleKey`.

---

## Dynamic capability assessment

### 1. What is static today?
- Every enum's numeric value (C# mirror) — compile-time constants.
- The `*I18n`/`*ToString`/`FALCON_STATUS_*` maps (enum→key/label/severity).
- The `FalconAccess` registry's `{action,resource}` strings (the PES contract).
- `BUILT_IN_ROLE_KEYS` + the acc-admin/acc-user display-label override.
- `LOOKUP_IDS`, `FALCON_ROOT_NODE`, `APP_ROUTES`, `OTP_DEFAULTS`, `USER_TYPE_STRINGS`.

### 2. What is already dynamic through inputs/args?
- `FalconAccess` factories that take arguments: `user.edit(field)`, `userRole.other(current,target)`, `userStatus.other(current,target)`, the wallet directional `transfer*({sourcePath,destinationPath})`, `contactGroup.*(scope)`, `microApps.mount(name)` — these compute the action/resource string at call time (with normalizers).
- `Hook<T>`/`GroupHook<T>`/`ServiceOperationResult<T>`/`PagedResult<T>` are generic over the payload type.
- The policy-subject builders take login/roleKey/tenantId.

### 3. What is dynamic through slots/templates?
- N/A (no UI).

### 4. What is dynamic through token/theme overrides?
- N/A (no DI/styling). The constants are not re-providable — they are module-level `as const` literals (intentional: a vocabulary, not a config).

### 5. What is dynamic through (Tailwind) classes?
- N/A.

### 6. What is missing to make this reusable across pages?
- Unit specs + a PES-contract link for the `FalconAccess` strings (F1/F2) so consumers can trust the registry stays in sync.
- A documented "where does `NodeType`/`WalletType` come from" decision matrix so consumers don't import the wrong one (F4).

### 7. What capability should be added to the shared layer (not a page hack)?
- A generated/contract-tested `FalconAccess`↔PES-seed parity check (F2) — pages currently trust the strings blindly.
- Possibly a single `resolveEnumLabel(map, value, translate)` helper so every consumer resolves `*I18n` identically (today some inline the lookup).

### 8. What flags/options would make it better?
- Nothing structural — it is a vocabulary. The improvement surface is test/contract coverage, not new flags.

### 9. What is the safest upgrade path?
1. **Phase A (additive, zero risk):** add unit specs (F1) — policy-subject round-trip, access-query dedupe determinism, user-type fail-closed, a snapshot of all `FalconAccess` strings.
2. **Phase B (contract — queue):** add a `FalconAccess`↔PES-seed parity test (F2); requires the PES seed as a fixture.
3. **Phase C (cosmetic, low risk):** rename `globels.ts`→`globals-enums.ts` (avoid the `models/globals.ts` clash) (C1); normalize comment style (C2).
4. **Phase D (cleanup — confirm-first):** remove the `@deprecated` `isFalconNode` + contact-group aliases after confirming no consumer (F6).

### 10. What is risky to change because other pages depend on it?
- **The `FalconAccess` action/resource strings** — renaming one silently breaks PES gating (default-deny) across the consuming control/route; 94 files reference the family.
- **`ServiceOperationResult<T>` shape / `<T=any>` default** — 67 files unwrap it; changing the envelope ripples monorepo-wide.
- **`FalconItemStatus` numeric values + the `FALCON_STATUS_*` maps** — every status pill depends on them; reordering would mis-color badges.
- **`USER_TYPE_STRINGS` values** — the JWT claim contract + gateway selection + policy-subject namespace key off `'1'`/`'2'`.
- **The dual-`NodeType`/`WalletType` isolation** — folding the wallet enums into `@falcon` causes the documented duplicate-export break; "deduping" them would break the wallet feature.
- **`FALCON_ROOT_NODE.id`** — `shared-utils` `node-scope.util` compares against the literal `'FALCON_ROOT_NODE'` to keep the synthetic id off the wire; changing it would let it leak to the backend.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (L04). Recommendation = READY (foundational vocabulary). The dynamic surface (argument-taking `FalconAccess` factories + generic envelopes) + the static-vocabulary nature verified against source; the 10-axis assessment cross-references AUDIT F1–F10 + the 443/405 consumer counts + the L02/L04 sibling findings. No source edited.
