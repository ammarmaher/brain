---
name: project-edit-node-name-ampersand-backend-regex-bug-2026-06-10
description: "Edit node name rejects '&' — REAL BUG in Commerce backend NodeName VO regex (SoT allows & ' -). FIXED 2026-06-10 in working tree (regex+tests+resx), 35/35 VO tests + 429 suite green, NOT committed/pushed."
metadata: 
  node_type: memory
  type: project
  originSessionId: cfe4a4db-616e-4462-b869-fab1478f113d
---

# Edit-node-name `&` rejection — root cause + verdict (2026-06-10, claude, READ-ONLY investigation)

**Verdict: `&` SHOULD be allowed. The bug is REAL and lives in the BACKEND (Commerce), not the FE.**

## SoT chain (node name has no own xlsx row; mirrors Account Name)
- [XLSX] `C:\Falcon\Source_of_truth_theme\Validations.SOT-2026-05-24.xlsx` sheet "Add Client - Step 1" → Account Name: Allowed Special Char = `Space between words | & | Allow apostroph | Allow hyphens`; "Can start with anything allowed. Can end with anything allowed."; valid "Falcon Corp", invalid "Falcon@Corp".
- [BRAIN-OUT] `06-validation-by-feature/MATRIX.md` §4b.2 BUG-08 (2026-05-29): nodeName mirrors accountName 1:1 (charset letters+digits+space+&+'+-, 2–30).
- Backend itself declares the same parity intent: NodeName.cs comment cites "Validations.xlsx SoT 2026-05-24" and PR 42045 "[apply-a-validation-sheet] … (FE/BE parity)" — but the fix was PARTIAL (only leading-digit relaxed).

## Root cause
[CODE] `falcon-core-commerce-svc/src/Falcon.Commerce.Domain/ValueObjects/Node/NodeName.cs:15-16`
`NameRegex = ^[A-Za-z0-9؀-ۿ][A-Za-z0-9؀-ۿ _-]*$` → throws `FalconKeys.Error.InvalidNodeFormat` ("Invalid Node name format", 400). Same regex on commerce **origin/main** (= what QATM runs). Drift vs SoT: (1) `&` missing — THE reported bug; (2) `'` apostrophe missing — latent sibling bug; (3) `_` allowed but NOT in SoT (over-permissive; also Arabic-only `؀-ۿ` vs FE full `\p{L}`); (4) first char must be letter/digit but SoT says "can start with anything allowed" (e.g. `&Co` fails BE); (5) BE allows consecutive spaces, FE rejects (FE stricter, OK).

## Blast radius — NodeName.Create used by 4 handlers (single fix point)
ChangeNodeNameHandler (Edit node — reported), CreateSubNodeHandler (Add Node), CreateMainNodeHandler (**Add Client account name!** "A&B Co" fails BE), UpdateMainNodeInfoHandler (Edit account info), + Node.Operations.cs factories. [CODE] NodeNameTests.cs encodes the wrong charset (asserts `Node_Name` valid; zero `&`/`'` cases).

## FE status (NOT the bug)
- Our branch polishing-v0.4: central `nodeName()` [CODE] `libs/falcon/src/shared-utils/lib/validations/falcon-validations.ts:505` uses `ACCOUNT_NAME_CHARSET=/^[\p{L}\p{N} &'-]+$/u` → `&` valid; both consoles' node-drawer wire `nodeNameValidator`. So FE says VALID → Save → BE 400 = "does not follow the validation" symptom QA saw.
- FE origin/main: NO charset validation at all (plain pInputText + maxlength=32 + required) → same BE 400 is the only gate.

## DRAFT PR CREATED (2026-06-10, user-instructed): **PR 42326** `https://t2development.visualstudio.com/DefaultCollection/Falcon/_git/falcon-core-commerce-svc/pullrequest/42326` — branch `bugfix/node-name-sot-allow-ampersand` (off origin/main 3c1de18), commit `a2b2a71`, draft+active. Built via temp worktree so the dirty hotfix checkout (TranslateHelper work + appsettings) stayed untouched and OUT of the PR; the 5-file fix also remains uncommitted in the hotfix tree for local testing. Full suite on PR branch: 423 pass / 8 fail = the SAME 8 pre-existing on origin/main itself (7×AddressTests + 1×ChangeNodeNameHandlerTests UpdateNotApplied). PR created via REST (`git credential fill`→POST pullrequests api-version=7.1; az CLI not installed; PS5.1 pipe mangles credential stdin → use Python). Still pending: mark ready + review + merge + deploy commerce to QATM.

## FIX APPLIED (2026-06-10, same session, user approved "fix it in all places") — working tree, NOT committed/pushed
Repo `falcon-core-commerce-svc` branch `hotfix/account-hierarchy-id-validation`, 5 files: (1) `NodeName.cs` regex → `^[\p{L}\p{N} &'-]+$` + new `\s{2,}` consecutive-whitespace rejection (full FE parity; & ' allowed, _ rejected, any allowed char may start, Unicode letters); (2) `NodeNameTests.cs` flipped `_`/double-space→invalid, `-Name` start→valid, +`Q&M Node`/`O'Brien`/`&Co`/`Café Münster` → **35/35 green**; (3) `NodeAggregateTests.cs` fixture `Team1_1/Team2_1`→`Team1-1/Team2-1`; (4+5) `ErrorMessages.resx/.ar.resx` InvalidNodeFormat now enumerates allowed set (EN+AR, `&amp;`-escaped). GATES: build 0 errors; full suite Failed 8/Passed 429 — the 8 are PRE-EXISTING on the branch (stash-baseline-proven: 7×AddressTests + 1×ChangeNodeNameHandlerTests UpdateNotApplied), zero new failures. Behavior deltas: `&`/`'` accepted (THE bug), `_` rejected (legacy `_` names re-save under new `_` name now fails — matches FE), 2+ spaces rejected, `-`/`&`/`'` may start. PENDING: commit+push+PR+deploy to reach QATM (user-gated); local docker commerce image still old (rebuild user-gated); pre-existing 8 failures not mine.

Related: [[project_pr41131_edituser_v2_pes_status_seed_review_2026_06_08]] · [[reference_fe_structure_standard_angular21_2026_06_02]]
