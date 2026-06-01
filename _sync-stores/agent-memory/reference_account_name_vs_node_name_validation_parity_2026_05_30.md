---
name: reference-account-name-vs-node-name-validation-parity-2026-05-30
description: "Is Add/Edit Node name validation the same as Add Client step-1 Account Name? Format rule = YES (identical, BUG-08 aligned); uniqueness + maxlength attr = differ."
metadata: 
  node_type: memory
  type: reference
  originSessionId: 2b993fed-eca3-45cd-b89d-2d1224029e3d
---

Question recurring from Ammar: "Validation on Add Node & Edit Node should be the same as Add Client step-1 Account Name field — is it the same or not?"

**ANSWER: The field-FORMAT rule is IDENTICAL by design; two things differ (one by design, one is a UX inconsistency worth flagging).**

## Where the rules live
- Add Client step-1 `accountName` → `accountNameValidator` (= registry `accountName()`), bound in [CODE] `apps/admin-console/.../add-client-wizard/client-information-step/validations/validations.ts:68`. PLUS async uniqueness inline in the component.
- Add/Edit Node `name` → `nodeNameValidator` (= registry `nodeName()`), bound in [CODE] `apps/{admin,management}-console/.../falcon-org-node-drawer/validations/validations.ts:23` (the TWO files are byte-identical; `nodeNameValidator` is consumed ONLY here). The drawer is literally the "single-input drawer for Add Node / Edit Node" (mode add|edit), [CODE] `falcon-org-node-drawer.component.ts:1`.
- Central defs: [CODE] `libs/falcon/src/shared-utils/lib/validations/falcon-validations.ts` — `accountName()` @:434, `nodeName()` @:472.

## IDENTICAL (sync format rule) — aligned 2026-05-29 by BUG-08
Both `accountName()` and `nodeName()` run the SAME body in the SAME priority order:
1. required (trim-based) → `required`
2. charset `ACCOUNT_NAME_CHARSET = /^[\p{L}\p{N} &'\-]+$/u` (letters+digits+space+&+apostrophe+hyphen) → `accountNameCharset` (SAME error key; nodeName reuses ACCOUNT_NAME_CHARSET)
3. min 2 → `minLength`  (ACCOUNT_NAME_MIN == NODE_NAME_MIN == 2)
4. max 30 → `maxLength` (ACCOUNT_NAME_MAX == NODE_NAME_MAX == 30)
Same `fieldErrorMessage()` render pipeline + `hierarchy.validation.*` i18n + LIVE_ERROR_KEYS gate (charset/min/max show immediately; `required` waits for touched) in BOTH. No starts-with-letter, no edge-whitespace rule on either (so "  Falcon" passes both). **Before BUG-08 they were DIFFERENT** (node name was required-only / starts-with-letter / letters-only) — aligned 2026-05-29.

## DIFFERENT #1 — uniqueness (by design, NOT a bug)
- Account name = async BACKEND check, unique system-wide: `AccountValidationService.checkAccountNameExists()` → `commerce/Node/ValidateAccountName`, debounce 300ms, error `duplicateAccountName` ([CODE] client-information-step.component.ts:117-149).
- Node name = in-memory check against cached SIBLINGS (unique among siblings of same parent only), error `duplicateNodeName` ([CODE] falcon-org-node-drawer.component.ts:166). No backend sub-node-uniqueness endpoint exists (GAP-COMMERCE-VALIDATE-SUBNODE-NAME-001); backend `DuplicateNodeName` 409 catches POST races. Edit mode allows renaming to self.

## DIFFERENT #2 — template maxlength attr (UX inconsistency, effective rule still max-30)
- Add Client account-name input: `[maxlength]="100"` ([CODE] client-information-step.component.html:34) → user can type >30 and SEE the "max 30" validator error.
- Add/Edit Node name input: `[maxlength]="30"` ([CODE] falcon-org-node-drawer.component.html:63, same in mgmt) → browser hard-stops at 30, the maxLength error is unreachable via typing.
Both enforce 30 at validation layer, so accept/reject outcome is identical; only keystroke behavior + whether the "max 30" message ever shows differs. To make pixel-identical, set drawer maxlength=100 (LIVE_ERROR_KEYS design favors show-the-error) OR set account-name to 30. NOT YET CHANGED — investigation only, user asked "is it the same?", no fix requested.

Note: the Edit-Account **info panel** accountName also uses `accountNameValidator` ([CODE] falcon-org-info-panel/validations/validations.ts:41) — same sync rule as Add Client.
