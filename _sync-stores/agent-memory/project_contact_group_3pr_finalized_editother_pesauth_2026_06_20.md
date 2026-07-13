---
name: project_contact_group_3pr_finalized_editother_pesauth_2026_06_20
description: Contact-group 3 draft PRs finalized — edit-other dead-path removed, PES decision endpoints restored to main (no RequireAuthorization), clean PR descriptions written
metadata:
  node_type: memory
  type: project
  originSessionId: 647e5b35-c065-4611-93b3-c21d05bfe1d5
---

Contact-group feature **shipped as 3 draft PRs → main** (review-fixes committed+pushed, descriptions rewritten). All draft, all targeting `main`.

**The 3 PRs (repo : PR# : branch):**
- **infra** `Falcon` : **42640** : `fix/contact-group-pes-base-url` — adds `ServicesClients__Access__BaseUrl: http://pes:5296` to docker-compose contact-group svc. ROOT CAUSE of the share-403 (svc fell back to compiled default `http://localhost:5296` = own container loopback → conn refused → PEP fail-closed → 403).
- **PES** `falcon-core-access-svc` : **42601** : `feat/pes-contact-group-act-on-other` — seeds matrix in `BuiltInRoleCatalog.cs` + removes `.RequireAuthorization()` from `pes/authorize` & `pes/authorize/resources`.
- **BE PEP** `falcon-core-contact-group-svc` : **42603** : `feat/contact-group-validation-permissions-svc` — `PolicyEnforcer` adapter (`POST pes/authorize/resources`), fail-closed; distinct `NotAuthorizedTo{Share,Edit,Delete}` keys.

**KEY FIX 1 — `edit-other` is a DEAD PATH (removed).** PES `BuiltInRoleCatalog.cs` grants `edit-other` to NO role — every account role (AO/NA/NU) gets a createdby-gated `edit` (`"r.obj.createdby" == "r.sub.userid"`) and `delete`, AO/NA also get role-level `share-other`, NU's `share` is creator-gated (no share-other). So BE `PolicyEnforcer.ResolveActions` `Edit => ("edit", null)` (was `("edit","edit-other")`) → Edit now sends ONE creator-gated resource exactly like Delete; only **Share** sends two resources (own + `share-other`, permit-if-either). Removed stale `edit-other` doc comments in IPolicyEnforcer.cs / UpdateContactGroupHandler.cs / PolicyEnforcer.cs remarks + the FE `editOther` registry helper (commit `1abf540`). BE dotnet build 0/0.

**KEY FIX 2 — PES decision endpoints must NOT have `RequireAuthorization` (main parity).** `origin/main` `Program.cs` has NO `.RequireAuthorization()` on `pes/authorize` / `pes/authorize/resources` BY DESIGN: the PDP decision is computed from the **subject in the request body**, not the caller token; caller is a trusted internal PEP forwarding an arbitrary subject; internal docker-network trust. A prior branch commit (`b8fbbc8`) added it → forwarded **client JWT** (audience=Falcon platform, not PES) rejected → 401 → contact-group PEP fail-closed → 403 on share. Reverted (commit `38abb1a`). Data endpoints (`pes/roles`, `pes/user/roles`, `bootstrap`) KEEP auth.

**Permit-if-either rationale:** PES engine `Effect.Eval` EXCLUDES a pure role-level rule (`share-other`, no expr) when the obj carries a non-empty `createdby` attr → must query own (createdby, ignoreExpression=false) and `*-other` (empty attr, ignoreExpression=true) as SEPARATE resources, permit if either allowed.

**Falcon users** (`sys.contact-group` SA/Product/Operation) = **view + download only**; create/edit/delete/share = deny.

**FE** editOther cleanup lives on `polishing-v0.4` (UNCOMMITTED, user-managed, NO dedicated PR — frontend PR discarded per user). Comment "PES never grants edit-other" in `models.ts` is the intentional new-rule doc.

PR descriptions rewritten via Azure DevOps REST PATCH (HTTP 200 ×3) in the user's requested shape: what / why / old-impl / error / fix / example + the SoT matrix table. Related [[project_contact_group_share_403_pes_baseurl_fix_2026_06_20]] · [[project_contact_group_edit_feature_fe_2026_06_20]] · [[project_pes_role_catalog_pr42325_docker_runtime_verify_2026_06_10]].
