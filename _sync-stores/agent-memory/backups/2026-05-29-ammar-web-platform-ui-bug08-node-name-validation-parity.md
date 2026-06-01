---
name: session-backup-bug-08-node-name-account-name-validation-parity-bug-02-residual-comment
description: nodeName() validator rewritten to mirror accountName() exactly (charset + 2-30); stale drawer comments fixed
metadata: 
  node_type: memory
  type: project
  agent: ammar-web-platform-ui
  date: 2026-05-29
  status: completed
  originSessionId: 38ebd9e8-721a-41ef-bbaf-169bfd310ef9
---

## What Was Done
- BUG-08: Rewrote `nodeName()` in `libs/falcon/src/shared-utils/lib/validations/falcon-validations.ts` to mirror `accountName()` EXACTLY. Old chain (required+STARTS_WITH_LETTER+LETTERS_ONLY+min/max, emitting {startsWithLetter}/{lettersAndDigitsOnly}) → new chain: required(trim) → !ACCOUNT_NAME_CHARSET → {accountNameCharset} → NODE_NAME_MIN(2) → NODE_NAME_MAX(30). Charset reuses ACCOUNT_NAME_CHARSET; lengths use NODE_NAME_* (identical 2/30, kept live to avoid new unused-var lint).
- i18n DECISION: REUSED existing `accountNameCharset` key (en: "Allowed: letters, digits, spaces, &, apostrophe, hyphen"; ar mirror). Wording is generic, no "account" word → applies verbatim to node name. NO i18n change, NO messages.ts change (accountNameCharset already in LIVE_ERROR_KEYS).
- BUG-02 residual: fixed stale "required only, no min/max" header comment in BOTH drawer validation files (admin + management-console) to state 2-30 + charset parity.
- Also corrected 3 stale block-comments in falcon-validations.ts (constants header for LETTERS_ONLY/STARTS_WITH_LETTER, NODE_NAME_* header, nodeName() interface doc) to reflect parity.

## Verification (done)
- accountName() byte-for-byte UNCHANGED (confirmed).
- Typecheck `npx tsc -p libs/falcon/tsconfig.lib.json --noEmit`: 0 errors before AND after = NO new errors. (Repo-wide "4660 typecheck errors" is a tsconfig.base.json moduleResolution artifact, NOT this lib.)
- Lint `npx nx lint falcon`: pre-existing baseline 135 problems (94 err/41 warn), all in OTHER files (named-validators _hardCap, validators/falcon-validators.ts escapes). Final = 135, NO net change. My edited file adds 0 new problems.
- Regex sanity: "Test Corp"/"R&D"/"O'Brien-East"=valid; "A"=minLength; ""=required; 31ch=maxLength. All pass.

## Consumers of nodeName confirmed (only these, no regression)
- named-validators.ts:30 `nodeNameValidator = r.nodeName()`
- admin-console + management-console `org-hierarchy-page/services/services.ts` (create/edit sub-node payload validateValue)
- admin-console + management-console `falcon-org-node-drawer/validations/validations.ts` (drawer rule map: name:[nodeNameValidator])
- All other `nodeName` hits are an unrelated INPUT property on display components (falcon-org-node-header, falcon-org-info-panel, comm-mkt-view) — NOT the validator.

## Files Changed (3)
1. libs/falcon/src/shared-utils/lib/validations/falcon-validations.ts (nodeName body + 3 comments)
2. apps/admin-console/.../falcon-org-node-drawer/validations/validations.ts (comment only)
3. apps/management-console/.../falcon-org-node-drawer/validations/validations.ts (comment only)

## Context for Next Agent
- NO COMMITS made. Files in working tree. FRONTEND ONLY.
- The unrelated in-progress task (commchannels-marketplace seed parity) state in universal-brain was NOT touched.
