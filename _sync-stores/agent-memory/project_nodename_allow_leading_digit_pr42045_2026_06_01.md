---
name: project-nodename-allow-leading-digit-pr42045-2026-06-01
description: "Backend \"account/node name cannot start with a number\" rule removed for FE parity — centralized in NodeName value object; shipped as Azure DevOps PR"
metadata: 
  node_type: memory
  type: project
  originSessionId: e5f84f9b-7104-466b-9255-32dd38480537
---

The backend rule that blocked account/node names starting with a digit was removed to match the frontend (which already allows it per [[reference_account_name_vs_node_name_validation_parity_2026_05_30]] + Validations.xlsx SoT 2026-05-24 "Can start with anything allowed").

**Single chokepoint:** `[CODE] falcon-core-commerce-svc/src/Falcon.Commerce.Domain/ValueObjects/Node/NodeName.cs` — one `NameRegex` const. Changed first char class `[A-Za-z؀-ۿ]` → `[A-Za-z0-9؀-ۿ]` (added `0-9`). Throws `FalconException(InvalidNodeFormat)` on mismatch. **Brain E-account/V-rule docs WRONGLY said backend had "no regex for the letter-prefix" — it does, in NodeName.cs; FE-focused brain had not catalogued this domain value object.**

**`NodeName.Create()` is the ONLY format enforcer** (grep for AbstractValidator/RuleFor/.Matches() in commerce src = ZERO; DTO attrs are only `[ThrowIfNotPassed][ThrowIfMaxLengthExceed(30)]`). It feeds every name write path, so one line fixed all:
- `POST /api/Node/create-account` (Add Client) → CreateMainNodeHandler.cs:49 + Node.Operations.cs:21
- `POST /api/Node/create-SubNode` (Add Node) → CreateSubNodeHandler.cs:37 + Node.Operations.cs:62
- `PUT /api/Node/ChangeNodeName` (Edit Node rename) → ChangeNodeNameHandler.cs:24
- `PUT /api/Information` (Edit Account info rename, Falcon users) → UpdateMainNodeInfoHandler.cs:74
- `GET /api/Node/ValidateAccountName` = uniqueness only (IsAlreadyInUse), NOT a format check → untouched.

Test flipped: `NodeNameTests.cs` `Create_WithNameStartingWithNumber_*` now asserts SUCCESS. `dotnet build src/src.sln` = 0 errors; `dotnet test` = 419 passed. **8 failing tests are PRE-EXISTING on origin/main (identical failure set with my edits stashed): 7×AddressTests + 1×ChangeNodeNameHandlerTests (handler dropped the `NewNodeNameNotApplyed` stale-name guard the test still expects) — unrelated, NOT mine.**

**Scope deliberately narrow (user choice):** only leading-digit. Two FE/BE charset drifts STILL OPEN: FE allows `&` and apostrophe (A&B Co, O'Brien) → backend `NodeName` regex rejects; backend allows `_` → FE rejects. Follow-up if full parity wanted. The dead `FalconValues.ValidationPatterns.StartsWithLetter`/`LettersOnly` consts are UNUSED (grep-confirmed).

**Delivery:** branch `apply-a-validation-sheet` from origin/main → PR **#42045** (active, non-draft) https://t2development.visualstudio.com/DefaultCollection/Falcon/_git/falcon-core-commerce-svc/pullrequest/42045 . Committed ONLY the 2 NodeName files (working tree had unrelated dirty `TranslateHelper.cs` — stashed during work, restored to hotfix after).

**Env traps:** repo = Azure DevOps (NOT GitHub). `dev.azure.com` host is RESET/blocked from this machine's curl (`curl (35) Recv failure`) → use `t2development.visualstudio.com` host instead (git + curl both reach it). PR REST = `POST https://t2development.visualstudio.com/DefaultCollection/Falcon/_apis/git/repositories/<repo>/pullrequests?api-version=7.0`, Basic auth `:$PAT` b64, PAT at `~/.azure-devops-pat` (per `.claude/agents/task_manager.md`). Commerce repo id `9ccbeb0c-3bb9-4a41-98a3-8a883607b0d9`.
