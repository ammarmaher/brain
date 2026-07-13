---
name: project-account-name-fe-be-validation-mismatch-2026-06-10
description: "Edit-Info PUT commerce/information — backend NodeName regex did NOT match FE accountName validator — FIXED in draft PR 42318 (branch fix/account-name-validation-fe-parity @db53933)"
metadata: 
  node_type: memory
  type: project
  originSessionId: 33226cc1-0421-40a0-ad04-2fc212f191d8
---

**FIXED (same day):** draft **PR 42318** https://t2development.visualstudio.com/DefaultCollection/Falcon/_git/falcon-core-commerce-svc/pullrequest/42318, branch `fix/account-name-validation-fe-parity` @ `db53933` off origin/main (3c1de18). `NodeName.cs` now: charset `^[\p{L}\p{N} &'-]+$`, reject `\s{2,}` runs, NO first-char restriction, NO underscore, charset-before-length (FE error precedence), keep required+trim+2–30. Tests: NodeNameTests rewritten to new rules (& / ' / Café / leading-hyphen / leading-& valid; _ / tab / double-space invalid; format-beats-MaxLength), 2 handler regression tests in UpdateMainNodeInfoHandlerTests (NodeName.Create runs INSIDE the FindOneAndUpdateAsync update-builder action — tests must invoke the captured action via Moq Callback), NodeAggregateTests `Team1_1`→`Team1-1`. Suite 427 pass / 8 fail = the documented PRE-EXISTING AddressTests + ChangeNodeName-WhenUpdateNotApplied failures (same set as main); targeted suites 95/95. Repo restored to `hotfix/account-hierarchy-id-validation` after push. PR created via ADO REST (`git credential fill` works ONLY from the Bash tool — PowerShell/cmd pipes CRLF-mangle the blank terminator line; no az CLI on machine). Reviewer flag in PR: `_`-tightening can orphan existing underscore names on next edit — needs prod data check.

**Original finding (2026-06-10, read-only audit):** the Org-Hierarchy Edit-Info account-name validation diverges FE vs BE.

**API chain:** FE info-panel (both consoles) → `InformationService.updateInformation` → `PUT commerce/information` (System Gateway) → [CODE] falcon-core-commerce-svc `InformationController.cs:38-44` → `UpdateMainNodeInfoHandler.cs:74` → `NodeName.Create()`.

**FE rule** [CODE] falcon-web-platform-ui `libs/falcon/src/shared-utils/lib/validations/falcon-validations.ts:48,455-494`: required → no edge/repeated whitespace → charset `^[\p{L}\p{N} &'-]+$` (any Unicode letter/digit + space + & + ' + hyphen, per Validations.xlsx SoT 2026-05-24) → raw length 2–30 → async uniqueness.

**BE rule** [CODE] falcon-core-commerce-svc `Domain/ValueObjects/Node/NodeName.cs:15-39`: required → trim → trimmed length 2–30 → regex `^[A-Za-z0-9؀-ۿ][A-Za-z0-9؀-ۿ _-]*$`.

**Mismatches (BE violates xlsx SoT):**
- `&` and `'` — FE/SoT allow, BE rejects → "Falcon & Co" / "O'Brien" pass FE then die on Save with `InvalidNodeFormat`. **User-visible bug.**
- `_` — BE allows, FE/SoT reject (direct API can store names FE can't re-save).
- Letters — FE `\p{L}` any-Unicode; BE ASCII Latin + Arabic block only ("Café" FE-pass/BE-fail). SoT says AR&EN, so FE is looser than SoT AND BE disagrees with FE.
- First char — BE must be letter/digit; FE/SoT "can start with anything allowed" (BE comment cites the xlsx but only removed the leading-digit restriction).
- Repeated internal spaces — FE rejects, BE allows.
- Match: required ✅, 2–30 ✅ (FE raw vs BE trimmed — equivalent given FE edge-ws rejection), uniqueness ✅ (BE ignore-case among `eNodeType.Main` excl. self, Falcon-UserType-gated; FE async check + sends name only when canEditFalconOnly).

**Blast radius:** `NodeName.Create` is shared by CreateMainNodeHandler (add client), CreateSubNodeHandler, ChangeNodeNameHandler, UpdateMainNodeInfoHandler — FE nodeName ≡ accountName by design (BUG-08), so ONE regex fix aligns all four. Tightening `_` could orphan existing stored names (re-save fails) — needs data check before fix.

**Also:** commerce `UpdateMainNodeInfoRequest` DTO has zero annotations and the whole src has ZERO `AbstractValidator` classes — `AddValidatorsFromAssembly` ([CODE] Application/DependencyInjection.cs:93) registers nothing; the ONLY field validation on this PUT is NodeName + profile-picture byte check. FinanceId/EntityName/address fields are FE-validated only.

**Why:** SoT = Validations.xlsx; FE was rewritten to it Wave F 2026-05-24, backend NodeName was only partially updated (leading-digit removal).
**How to apply:** if asked to fix, change `NodeName.NameRegex` to SoT charset (add `&'`, drop `_`, free first char, decide on Unicode-letter scope + repeated-space rule) and add regression tests; check existing DB names for `_` first. Related [[project_org_hierarchy_pes_button_locks_main_parity_2026_06_08]].
