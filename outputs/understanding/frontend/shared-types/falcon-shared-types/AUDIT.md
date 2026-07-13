# falcon-shared-types — AUDIT (best-practice rubric §5)

> Rubric dims: **A** Angular-21 (mostly N/A — types/constants/pure-fns, no DI) · **B** Stencil (N/A) · **C** Falcon house rules · **D** Accessibility (N/A) · **E** Cross-framework (N/A) · **F** Completeness/consistency/drift. Score PASS / 🟡 / 🟠 / 🔴, evidence source-prefixed. **No fixes applied** (READ-ONLY, SPEC §0).

## A — Angular 21

**Grade: PASS (N/A by nature).** This area has **no `@Injectable`, no DI, no components** — it is pure types + `as const` constants + pure helper functions. Nothing to assess against the standalone/OnPush/signals/inject rubric. The pure functions (`accessKey`, `dedupeAccessQueries`, `parsePolicySubject`, `normalizeContactGroupStatus`, the user-type converters) are zoneless-safe by construction (no side effects beyond the documented `throw`s). ✅

## B — Stencil dual-render
**N/A** (no UI).

## C — Falcon house rules

**Grade: 🟡 GOOD (justified `any`, exemplary PES source-prefixing; filename + comment-style nits).**

- ✅ **No SCSS/Tailwind/UI** — pure type layer.
- ✅ **`any` is justified, not lazy** — `ServiceOperationResult<T=any>` + `errorCodes: any[]` (`service-operation-result.model.ts:1,5`), `Hook<T=any>`/`GroupHook<T=any>` (`models.ts:22,28`) all carry the eslint-disable rationale ("consumed in 60+ files without a type arg; `any` default preserves inference"). No free `any` elsewhere.
- ✅ **PES registry source-prefixing is exemplary** — `falcon-access.registry.ts:105-141` ties every wallet-balance directional query to its restoration date (2026-05-29), the PES `BuiltInRoleProvisioner` behavior, and an explicit "Verified live this session" — a model audit trail. Same for the acc-admin/acc-user override (`role-key.constants.ts:57-77`).
- 🟡 **C1 — filename typo `globels.ts`** (should be `globals.ts`; there is ALSO a real `models/globals.ts`, so the two are easy to confuse). `[CODE]` `lib/enums/globels.ts`. Renaming touches the barrel + ~every consumer's deep-import (most go through `@falcon`, so low blast radius), but it is a long-standing typo. **safe-local.**
- 🟡 **C2 — mixed comment styles** — the type files use JSDoc `/** */` (or none); only `globels.ts`/`globals.ts` SA-FIX-FE notes use a near-banner `*** ***`. No consistent Falcon `*** ***` banner across the area. Cosmetic. **safe-local.**
- 🟡 **C3 — `models.ts` mixes `class` and `interface` for plain DTOs** — `Hook`/`GroupHook`/`LookupValueResponse`/`AttachmentRequestModel`/`FileUploaderResponse` are `class`es (instantiable, e.g. `new Hook<number>()` in `Helper.enumToOptions`) while `NavItem`/`User`/`Breadcrumb` are `interface`s. The class form is load-bearing for `Helper` (`shared-data-access` `helper.ts:31`), so this is intentional, but the split is undocumented. Note only. **safe-local.**

## F — Completeness / consistency / drift

**Grade: 🟠 MEDIUM (zero tests on security-critical pure logic + naming collisions + a PES-contract surface to watch).**

- 🟠 **F1 — No `*.spec.ts` anywhere in `shared-types/`.** The pure functions here encode **security-critical** logic: `parsePolicySubject`/`validatePolicySubject` (the canonical-subject round-trip that PES authorization keys off), `accessKey`/`dedupeAccessQueries`/`stableAccessValue` (the dedupe that prevents duplicate PES calls + must be deterministic), `getAuthorizationUserTypeName` (only '1'/'2' map; else `null`), `normalizeContactGroupStatus`, and every `FalconAccess.*` factory's exact `{action,resource}` string (the PES contract). All untested at unit level — only exercised indirectly by feature specs. **HIGH-RISK-QUEUE** (test ADDITION is safe, but it covers authorization-contract behavior — a silent drift in a `FalconAccess` action string or a `parsePolicySubject` edge case is an authz bug).
- 🟠 **F2 — `FalconAccess` action/resource strings are a runtime contract with PES, enforced ONLY by hand + comments.** `[CODE]` e.g. `user.editStatus()` → `{action:'edit-status', resource:'user'}` (`:47`), `managementConsole.wallet.transferOwnerOwner` → `transfer-owner-owner` @ `acc.wallet-balance` (`:127,220-226`). If the PES `PolicyRules` seed renames an action/resource, the FE silently asks for a non-existent rule → default-deny → control wrongly hidden (or, worse, a typo that matches a broader rule). There is no compile-time or test link between this registry and the PES seed. **HIGH-RISK-QUEUE** (FE↔PES contract integrity — recommend a contract test or shared schema; do NOT edit strings without PES-side confirmation).
- 🟠 **F3 — `Gateway` enum is duplicated-by-purpose across libs.** This lib owns `Gateway` (CoreGateway=1…IdentityGateway=4, `globels.ts:130-135`); `shared-data-access` `GATEWAY_PATH_MAP` maps it to config keys but the `IdentityGateway` member's only caller was migrated away (L04 AUDIT F4). The enum itself is fine; flagged here so a cleanup touches BOTH libs in lock-step. **safe-local** (cross-reference to L04 F4).
- 🟡 **F4 — Two distinct `NodeType` and two distinct `WalletType` enums exist platform-wide.** `[CODE]` THIS lib: `NodeType` = Root/Main/Sub (`globels.ts:6-10`), `WalletType` = SingleWallet/MultipleWallets (`order-status.enums.ts:15-18`). `@falcon/wallet`: `NodeType` = Organization/Service/User, `WalletType` = SingleWallet/MultipleWallets. The wallet ones are deliberately isolated behind the `@falcon/wallet` deep alias to avoid a duplicate-export break (documented `wallet/wallet-balance.models.ts:11-18`). Correct + intentional, but a real footgun: a consumer that imports `NodeType` from `@falcon` gets Root/Main/Sub, not Organization/Service/User. Well-documented; note only. **safe-local.**
- 🟡 **F5 — `OrgHierarchyNode` + `FALCON_ROOT_NODE` live in `models/globals.ts`, not `models/org-hierarchy.models.ts`** where the other org-hierarchy types are. `[CODE]` `org-hierarchy.models.ts:1-5` explicitly notes this is "to avoid duplicate exports", but it splits the org-hierarchy vocabulary across two files. Intentional; note only. **safe-local.**
- 🟡 **F6 — `OrgHierarchyNode.isFalconNode` is `@deprecated`** ("Use isRootNode instead") yet still on the interface + set on `FALCON_ROOT_NODE` (`globels`/`globals.ts:196,208`). Plus two `@deprecated` contact-group aliases (`ContactGroupItemDto`/`ContactGroupListResponseDto`, `contact-group.models.ts:69,72`). Dead-ish surface kept for back-compat. **safe-local** (removal = public-API change; confirm no consumer first).
- 🟡 **F7 — `USER_TYPE_STRINGS` carries 4 keys for 2 values** (`SYSTEM_USER='1'==FALCON_USER`, `ACCOUNT_USER='2'==CLIENT_USER`, `:12-17`). Deliberate (System/Account primary terminology + Falcon/Client legacy-claim aliases, per the file header), but it means two names resolve to the same string and `isValidUserTypeString` only validates '1'/'2'. Documented; note. **safe-local.**
- 🟡 **F8 — `getAuthorizationUserTypeName` returns `null` for any userType ≠ '1'/'2'** (`policy-subject.models.ts:116-127`). The `@falcon/core` `CurrentSubjectBuilder` then throws (L02 G13). The constants comment asserts only '1'/'2' are valid, so this is likely unreachable, but it is a fail-closed path worth a test (covered by F1). Cross-reference L02 G13. **safe-local.**
- ✅ **F9 — Barrel completeness PASS.** `[CODE]` `index.ts:2-18` re-exports all 14 source files; `@falcon` re-exports the area. No omissions. (The dual-`NodeType` collision is avoided at the `@falcon/wallet` alias level, not by omission here.)
- ✅ **F10 — Wire DTOs are correctly camelCase + documented against the wire.** `[CODE]` `communication-channel.models.ts:1-5` records the G2 fix (PascalCase keys returned `undefined` → empty channel labels; now camelCase to match System.Text.Json default). `do-payment.models.ts:1-2` cites the backend `RequestsDtos`/`ResponseDtos`. `contact-group.models.ts` documents which VM fields are NOT on the list API. Exemplary wire-contract discipline.

## E — Cross-framework parity
**N/A.**

## Tally

- **A = PASS (N/A — no DI/components).**
- **C = 🟡 GOOD** (C1 `globels` typo, C2 comment style, C3 class/interface mix; all safe-local; PES source-prefixing + `any` rationale exemplary).
- **F = 🟠 MEDIUM** (F1 zero tests on authz-critical pure fns, F2 FE↔PES string contract unenforced — both HRQ; F3–F8 documented-intentional naming/dual-enum/deprecation seams = safe-local; F9/F10 PASS).
- **B / D / E = N/A.**
- **Area overall: 🟡 GOOD with 🟠 medium drift.** Zero 🔴. Foundational, well-documented, exemplary wire + PES source-prefixing. The two 🟠 HRQ items are about authz-contract test coverage, not code defects.

## HIGH-RISK-QUEUE (2)
- **F1** — Add unit specs for `parsePolicySubject`/`validatePolicySubject` round-trip, `accessKey`/`dedupeAccessQueries`/`stableAccessValue` determinism, `getAuthorizationUserTypeName` fail-closed, and a snapshot of every `FalconAccess.*` `{action,resource}` string. Covers authorization-contract behavior.
- **F2** — Establish a contract link (test or shared schema) between the `FalconAccess` registry strings and the PES `PolicyRules`/`BuiltInRoleProvisioner` seed; never rename an action/resource without PES-side confirmation (silent default-deny risk).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (L04). Every finding cites a source line; the dual-enum + display-override + deprecation seams traced to their documenting comments; no `*.spec.ts` in the lib confirmed by directory enumeration; F2's silent-deny risk reasoned from the registry's "verified live vs PES" comments + the L02 default-deny facade behavior. No source edited.
