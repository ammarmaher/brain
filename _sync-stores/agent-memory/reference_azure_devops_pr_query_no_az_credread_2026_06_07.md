---
name: reference_azure_devops_pr_query_no_az_credread_2026_06_07
description: "How to query/act on Azure DevOps PRs in t2development.visualstudio.com when the `az` CLI is missing — CredRead token + REST, conflict detection, and the worktree+multiset-proof conflict-fix recipe."
metadata: 
  node_type: memory
  type: reference
  originSessionId: 1384bf86-a281-4d69-83d0-3e548dd70728
---

`az` CLI is **NOT installed** on this machine (`C:\Falcon`). Several past tasks stalled on "az missing" (e.g. [[project_contract_consumed_offered_C_and_ratetables_2026_06_06]]). Reliable az-less path to read PR metadata and detect/fix conflicts:

**1. Get the auth token (Windows Credential Manager, NOT `git credential fill`).**
`git credential fill` piped from PowerShell FAILS with `fatal: refusing to work with credential missing protocol field` — PS stdin adds a UTF‑16 BOM that corrupts the first line (tried array-pipe, .NET StreamWriter, BaseStream bytes — all BOM-bitten). The reliable path is Win32 `CredRead` via P/Invoke:
- Target `git:https://t2development.visualstudio.com` (type 1 = GENERIC), blob decoded UTF‑16 → an **84‑char** token (GCM = "manager"; username `AmmarMK`).
- Auth header: `Authorization: Basic ` + `base64(":" + token)` (Azure DevOps Basic = empty user + token-as-password).

**2. Read the PR (REST):**
`GET https://t2development.visualstudio.com/Falcon/_apis/git/repositories/<repo>/pullRequests/<id>?api-version=7.1-preview.1`
→ `title, status, sourceRefName, targetRefName, mergeStatus, lastMergeSourceCommit/lastMergeTargetCommit/lastMergeCommit, createdBy`. `mergeStatus` ∈ `conflicts | succeeded | queued`. After you push a fix, re-GET → flips `conflicts`→`succeeded` (Azure recomputes a fresh `lastMergeCommit`).

**3. Conflict detection without the API:** `git ls-remote origin "refs/pull/<id>/*"` — Azure publishes `refs/pull/<id>/merge` ONLY when the PR is mergeable; a **missing** merge ref ⇒ the PR has conflicts. Also `git merge-tree --write-tree --name-only <sourceRef> <targetRef>` lists conflicted files read-only (and `git show <tree>:<path>` shows the markers) without touching the working tree.

**4. Non-destructive conflict-fix recipe (when the repo working tree is dirty / on another branch — common here, concurrent sessions):**
isolate with `git worktree add --track -b <local> C:\Falcon\_wt\<pr> origin/<sourceBranch>` → `git merge origin/<targetBranch>` → resolve → `dotnet build` + `dotnet test` → `git commit --no-edit` → `git push origin <sourceBranch>` → `git worktree remove` + `git branch -d`. The main checkout and its uncommitted files stay byte-for-byte untouched. **`dotnet test` needs `$env:DOTNET_ROLL_FORWARD="LatestMajor"`** — test host targets AspNetCore 6.0 which isn't installed (only 7/8/9/10 are); build is fine, only the test launcher needs roll-forward.

**5. Prove a union (keep-both) resolution is lossless** with the multiset identity `lines(source) + lines(target) == lines(base) + lines(resolved)` (read each blob as UTF‑8 via a Process with `StandardOutputEncoding=UTF8` to avoid mangling em-dash/Arabic). Holds exactly ⇒ nothing dropped, nothing invented, renames survived.

**Worked example (2026-06-07, claude):** PR **41131** "Add user.status.other PES seed for Edit-User-V2", `feature/user-status-edit-pes-seed` → `main`, falcon-core-access-svc. Sole conflict `src/T2.PES/Authorization/BuiltInRoleCatalog.cs`, 5 regions — both sides purely additive on disjoint resources (feature: `user`/`user.status.other` edit rules; main: `sys.contract`/`*.wallet-balance`/`acc.contact-group view-shared` + acc-admin→"Node Admin"/acc-user→"Normal User" renames). Resolved keep-both (main rules first, feature user-edit block last, matching the auto-merged sys-admin/sys-products). Verified: 0 markers, multiset F558+M429==B380+R607, build 0-err, **100/100** tests. Merge `71b4e1f` pushed → mergeStatus `succeeded`. NOTE the locally-checked-out `Implementing-PES-FOR-Edit-User-V2-enhancements` is a DIFFERENT PR (had unrelated uncommitted work) — branch checked out ≠ the PR you were asked about; always confirm source/target via the API.
