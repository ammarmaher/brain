---
name: reference_settings_tab_edit_authority_and_failopen_bug_2026_05_30
description: "WHO can edit the org-hierarchy Settings tab (password-security / allowed-IPs / account-quota) per console + role, with PES seed + PRD evidence; plus the FE fail-open bug that wrongly shows the Edit button to denied acc-admin/acc-user."
metadata: 
  node_type: memory
  type: reference
  originSessionId: ba2d9553-28f9-4a09-975f-fdb01137906b
---

🟢 FIX LANDED (both consoles) + build-green + **live-PES-verified** 2026-05-30, NO COMMITS. (Was 🔵 investigation.) Settings tab = 3 independently-gated sections: **Password Security Level**, **Allowed IPs**, **Account Limits/quota**. Each has its own PES resource.

**FIX (user-approved):** the fail-open guard in `settings-tab.signals.ts` (mgmt + admin) replaced with strict **fail-closed** — `canEditX = !!f['editX']` (no more `failOpen ? true : …`). Mirrors approved add-user-wizard gate ([CODE] add-user-wizard.component.ts:329 "never fails open"). acc-owner/sys-admin unaffected (real allow flags); acc-admin/acc-user (mgmt) + sys-ops/sys-products-on-root (admin) now get the Edit button correctly HIDDEN. **Live PES proof** (`POST :5296/pes/authorize/resources`, subj `u:<jwt.sub>@test-tenant-001`, login `:7777/api/auth/login` Admin@1234): **accadmin** password-security/allowed-ips/quota edit = false/false/false → button hidden; **accowner** = true/true/true → shown. Build `nx run-many mgmt+admin --configuration=development --skip-nx-cache` EXIT 0. NOTE running Docker :4301 still serves the PRE-fix bundle (rebuild/redeploy for a visual click-through). PES batch request shape lives in [CODE] access-control.client.ts (`/pes/authorize/resources`) + access-control.types.ts (`{sub:{kind,attr},resources:[{seqNo,obj:{kind,attr,ignoreExpression},actions}]}`); subject built by current-subject.builder.ts → `u:<zitadelSub>@<tenant>`.

**FE access keys [CODE] `libs/falcon/src/shared-types/lib/constants/falcon-access.registry.ts:90-101` (mgmt) + :155-169 (admin):** mgmt → `acc.account-password-security-level` / `acc.account-allowed-ips` / `acc.account-quota` (view+edit). admin → `sys.account-*` (edit) + `sys.root-password-security-level` / `sys.root-allowed-ips`.

**WHO CAN EDIT — ground truth [CODE] PES seed `C:\Falcon\Falcon\Falcon\falcon-essentials\zitadel\pes-account-role-rules.json` (3× Falcon path) + [BRAIN-OUT] `03-pes-keys/REGISTRY-RAW.md:41-44,79-84`:**
- **Management Console (Client editing own account):** **acc-owner = ALLOW all 3** (seed :19-24); **acc-admin = DENY all 3** view+edit (seed :100-105); **acc-user = DENY all 3** + denied `acc.org-hierarchy`/`acc.account-settings` view so can't even reach it (seed :168,176,181-186). REGISTRY-RAW:79-84 = "**only acc-owner**".
- **Admin Console (Falcon staff editing a client/root):** Password Security Level = **sys-admin only**; Allowed IPs = **sys-admin + sys-ops**; Account Quota/Limits = **sys-admin + sys-products**; Root password-security + Root allowed-IPs = **sys-admin only** (REGISTRY-RAW:41-44).

**PRD [BRAIN-OUT] `prd/modules/01-account-management/WORKFLOWS.md:13,84-87` + `latest-prd.md:33-45`:** Settings = Step-2 block (Password Security Level Normal/Advanced, Allowed IPs, Account Limits). Edit workflow gated; Permission sheet "Permission list - Jawad" flags Edit Password Security Level / Edit Account Limitations as Falcon-side role-specific (**Operation/sys-ops = Not Allow**), client-side acc-owner-only via seed. Empty values not allowed; 0 = no limit.

**Edit button IS meant to hide for non-editors [CODE] `org-hierarchy-page-menu.component.html:176-188`:** `@if (canEditSecurity || canEditAllowedIps || canEditQuota)` wraps the Settings Edit button — comment: "PES-gated: hidden if ALL three section-edit flags are false". Per-section controls also gated `!readonly() && pesFlags().canEditX` (`settings-tab.component.html:48,81,140,186…`; `readonly()`=`mode()!=='edit'`).

**⚠️ BUG (root cause of the 403 being reachable): fail-open guard [CODE] `settings-tab.signals.ts:171-176` (mgmt) + admin mirror :170-176.** `const failOpen = !editSecurity && !editAllowedIps && !editQuota; canEditSecurity = failOpen ? true : …` — when ALL 3 PES edit flags resolve false it flips ALL to TRUE (assumes "unknown-resource catalog gap", copied from add-user-wizard Risk-2). But acc-admin/acc-user are **legitimately** all-false → fail-open shows them the Edit button → they edit → Save → backend 403 `UnauthorizedUserToPerformThisAction`. acc-owner UNAFFECTED (real allow flags → failOpen=false). The assumption "all-false ⇒ catalog gap" is wrong for Settings because acc-admin reaches the tab with zero edit rights. **Recommended fix (HALT-FLAGGED, PES/security): make the Settings edit gate fail-CLOSED** (drop/scope the fail-open) — acc-owner unchanged, denied roles get the button correctly hidden. Admin side barely affected (sys-ops has IPs=true, sys-products has quota=true → failOpen rarely triggers there).

Relates to the same screen as [[project_settings_edit_error_status_inference_fix_2026_05_30]] (the popup status/title fix). Authority asymmetry pattern mirrors contracts ([[project_contracts_sidebar_both_consoles_2026_05_30]]).
