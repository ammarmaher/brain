# falcon-shared-utils — DECISION

## Brain SK final recommendation

**STATUS: READY / KEEP (registry + utils) · DEPRECATE-AND-DELETE (legacy shim).** The validations registry is the canonical, xlsx-backed home of all FE form validation — use it everywhere. The pure utils (ip / node-scope / theme / contact-group) are stable helpers. The legacy `falcon-validators.ts` is on a v2.0.0 death-row and must NOT receive new consumers.

## Use this area for

- **All reactive-form validation** → `inject(FALCON_VALIDATIONS)` (DI scope) or the named-validator aliases (non-DI). Generic primitives for any shape-reducible rule.
- **Error rendering** → `messageFor(errors)`/`keyForBackendCode(code)` → `translate(key)` (composes with `@falcon` language).
- **IP/CIDR validation** → `ip-utils` (`isValidIp`/`detectMode`/`sanitize`).
- **Node-scoped HTTP** → `appendNodeId`/`isRealNodeId` (synthetic-root guard).
- **Theme var in TS** → `getCssVariable`.
- **Contact-group list** → `mapContactGroupsResponseToTableRows`.

## Avoid this area for

- New use of the legacy shim (`startWithLetterValidator`, `phoneNumberValidator`, `FALCON_PATTERNS`, `getValidationErrorMessage`) — deprecated v1.2.0; lenient/non-i18n; diverges from the registry.
- Importing a feature's concrete tree type into the registry — keep `FalconHierarchyNode` structural + pass a `treeProvider`.
- Date/number formatting beyond the contact-group mapper's list-specific helpers.
- Expecting `getCssVariable` to read component-scoped (`:where(...)`) tokens (it reads `:root` only — AUDIT F7).

## Preferred path

1. **DI scope** → `inject(FALCON_VALIDATIONS).xxx()` (testable + overridable via `provideFalconValidations({ registry })`).
2. **Outside DI** → the named alias.
3. **Shape-reducible rule** → a generic primitive (`integerInRange`/`enumOf`/`length`/`numberInRange`/`startsWithLetter`/`lettersAndDigitsOnly`) — never a new bespoke `(c)=>{…}`.
4. **Charset BEFORE length** ordering for any new field validator.

## Required upgrades before wider use

None block usage. Prioritized (from AUDIT):
1. **F3 — unify IPv6 validation** (medium): make `allowedIpList()` delegate to `ip-utils.isValidIp` so input-time (directive) and submit-time (validator) agree on a security-adjacent field. *HIGH-RISK-QUEUE — validation behavior change.*
2. **F2 — retire the legacy shim** (medium): confirm `falcon-form-validate.directive.ts` is the sole consumer, migrate it, delete the file (the v2.0.0 plan); meanwhile add `no-restricted-imports` to block new drift. *HIGH-RISK-QUEUE — public-API removal + directive migration.*
3. **F1 — add lib specs** (safe-local): per-validator truth tables from the xlsx samples + the hand-rolled IPv6 parser + the message-key map.
4. **F5/F6/F8 — drop dead `_hardCap`, remove barrel-collision hazard (falls out of F2), document per-primitive input types** (safe-local polish).

## Relationship to other areas

- **Composes with** `@falcon` **language** (`messages.ts` keys → `TranslateService`).
- **Depends on** `@falcon` **shared-types** (`FALCON_ROOT_NODE`, `ContactGroup*` DTOs/VMs).
- **Backs** `@falcon` **shared-ui** `falcon-ip-address.directive.ts` (ip-utils) + legacy `falcon-form-validate.directive.ts` (the shim).
- **Mirrors** `@falcon/sdk` provider/token idiom (`provideFalconValidations`≈`provideFalconFacades`; `FALCON_VALIDATIONS`≈`FALCON_AUTH`).
- **Provider scope:** registered in **admin + mgmt** app.config only (NOT host-shell) — the registry is consumed inside remote feature forms.

## Exact rule for future implementation tasks

1. **New form field?** Find the matching registry method (or a generic primitive); inject `FALCON_VALIDATIONS` (DI) or import the alias (non-DI). Never reinvent.
2. **Field mirrors an `Validations.xlsx` cell?** Annotate the validator against the sheet + note any superseded PRD rule + the dated Wave/BUG (the registry's audit-trail convention).
3. **Errors?** `messageFor`/`keyForBackendCode` → `translate`.
4. **IP field?** `ip-utils` at input-time, `allowedIpList()` at submit-time (and push F3 to unify them).
5. **Node-scoped request?** `appendNodeId` / `isRealNodeId` always.
6. **Never** import the legacy shim symbols; **never** import a concrete tree into the registry.

---

## Dynamic capability assessment (10-axis)

### 1. What is static today?
- `[CODE]` All charset regexes + length bands are module constants (`falcon-validations.ts:24-111`) — changing a rule is a code edit (correct: the rules ARE the contract). The numeric caps (999 user-limit, 15-digit price) + `PRICE_VALUE_MAX_DIGITS`/`USER_LIMIT_MAX_DIGITS` are fixed literals.
- `FALCON_RESERVED_USERNAMES` default Set is static (but overridable per-call).
- The two IPv6 regexes are static + divergent (F3).
- `messages.ts` `KEY = 'hierarchy.validation'` namespace + the backend-code map are static.

### 2. What is dynamic through inputs/API?
- Registry factories are parameterized (`integerInRange(min,max,required)`, `enumOf(set)`, `password(level)`, `whitespace(mode)`, `digitsOnly(min,max,required)`).
- Async validators take a runtime `backendCheck` fn + optional `reservedSet`/`pendingSignal`/`debounceMs`.
- Hierarchy validators take a runtime `treeProvider` callback (full decoupling).
- The ENTIRE registry is swappable via `provideFalconValidations({ registry })`.

### 3. What is dynamic through slots / templates?
- N/A — not a component.

### 4. What is dynamic through token/theme overrides?
- N/A (validation). `getCssVariable` READS tokens but defines none.

### 5. What is dynamic through Tailwind classes?
- N/A.

### 6. What is missing to make it reusable across pages?
- Nothing for reuse — registry is global + DI-injectable + override-friendly + already consumed across both consoles. The gaps are correctness/governance (F2 shim, F3 IPv6 unify), not reusability.

### 7. What capability should be shared (not page-hacked)?
- Already maximally shared (this lib IS the consolidation target — it absorbed feature-local validators 2026-05-16). New rule → add to the registry, never to a feature folder.

### 8. What flags/options would make it better?
- `provideFalconValidations` config for the reserved-username default + the numeric caps (so non-default tenants are wiring, not edits).
- An `allowedIpList()` option to delegate to `ip-utils` (F3 fix as a flag).
- A typed `ValidationErrorKey` union (today error keys are bare strings shared between registry + `messages.ts` — a typo silently misses the catalog).

### 9. What is the safest upgrade path?
1. **Phase A (zero risk):** add lib specs (F1); drop dead `_hardCap` (F5); document per-primitive input types (F8).
2. **Phase B (behavior, gated):** unify IPv6 — `allowedIpList()` → `ip-utils.isValidIp` (F3); add a regression spec proving directive↔validator agreement first.
3. **Phase C (deprecation):** grep-confirm the shim's sole consumer, migrate `falcon-form-validate.directive.ts` to the registry, add `no-restricted-imports`, then delete `falcon-validators.ts` (F2/F6).
4. **Phase D (typing):** introduce `ValidationErrorKey` union shared by registry + `messages.ts`.

### 10. What is risky to change because pages depend on it?
- **The charset/length constants** — 13+ form files key off the exact rules; loosening/tightening one changes what users can submit across both consoles (and must round-trip with the backend `NodeName.Create()` regex, per `[MEMORY]` the leading-digit fix). Pair any change with the xlsx + backend.
- **Error keys** — `messages.ts` keys + the i18n bundle + `LIVE_ERROR_KEYS` are a 3-way contract; renaming a key breaks copy resolution (raw key shown) AND the live-display gate.
- **`appendNodeId`/`isRealNodeId`** — 12 services depend on the synthetic-root drop; changing the guard risks sending `'FALCON_ROOT_NODE'` to Commerce/Identity → 500s.
- **The deprecated shim** — `falcon-form-validate.directive.ts` still compiles against it; delete only after migration.
- **`emailValidator` barrel precedence** — order-dependent; a re-order silently re-shadows the const with the legacy fn.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (L03). Recommendation = KEEP registry/utils + deprecate-delete shim. Static-vs-dynamic seams, the 4 prioritized upgrades, and the cross-contract risks all traced to source in AUDIT.md/SURFACE.md. No source edited.
