# Task history — FIX: Commerce NodeName validation aligned to SoT (2026-06-10)

**Type:** bugfix · **Status:** completed (working tree only — NOT committed, NOT pushed) · Repo: `falcon-core-commerce-svc`, branch `hotfix/account-hierarchy-id-validation`.

## Change set (5 files)
1. `src/Falcon.Commerce.Domain/ValueObjects/Node/NodeName.cs` — `NameRegex` → `^[\p{L}\p{N} &'-]+$` (adds `&` + `'`, drops `_`, drops first-char letter/digit restriction, Unicode `\p{L}\p{N}` = FE parity) + new `ConsecutiveWhitespaceRegex \s{2,}` check (SoT "Space between words" = single; FE parity with hasEdgeOrRepeatedWhitespace). Single VO fix covers ChangeNodeName (Edit node), CreateSubNode (Add Node), CreateMainNode (Add Client account name), UpdateMainNodeInfo (Edit account).
2. `tests/.../Domain/ValueObjects/NodeNameTests.cs` — flipped `_`/double-space cases to invalid, `-Name` start to valid; added `Q&M Node`, `O'Brien`, `&Co`, `Café Münster` valid cases. **35/35 green.**
3. `tests/.../Domain/Entities/NodeAggregateTests.cs` — fixture `Team1_1/Team2_1` → `Team1-1/Team2-1` (test is about tenant consistency, not underscores).
4. + 5. `ErrorMessages.resx` / `.ar.resx` — `InvalidNodeFormat` now enumerates the allowed set (EN+AR, `&amp;` XML-escaped).

## Gates
- `dotnet build` 0 errors.
- Full suite: **Failed 8 / Passed 429** — the 8 failures are PRE-EXISTING on this branch (proven by stash-baseline run: same 8 fail without my changes = 7 × AddressTests + 1 × ChangeNodeNameHandlerTests.ChangeNodeNameAsync_WhenUpdateNotApplied). Zero new failures from this fix.

## Behavior changes (intentional, per SoT)
- `&` and `'` now ACCEPTED (the QATM bug). `-`/`&`/`'` may now START a name. Any Unicode letter accepted (was Latin+Arabic only).
- `_` now REJECTED (was wrongly accepted; FE always rejected it). Legacy `_` names in DB stay readable; re-saving one under a new `_` name fails (matches FE).
- 2+ consecutive spaces now REJECTED (was accepted; FE always rejected).

## Pending
- NOT committed/pushed (hard rule). To reach QATM: commit + push + PR + deploy commerce svc.
- Pre-existing 8 test failures on the hotfix branch are NOT mine — flagged to user.
- Local docker stack still runs the old image; rebuild needed for live local E2E (user-gated).
