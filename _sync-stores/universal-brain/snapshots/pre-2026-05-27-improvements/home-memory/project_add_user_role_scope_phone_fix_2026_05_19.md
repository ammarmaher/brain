---
name: Add User role-scope + phone fix
description: admin-console Add User wizard offered system roles for tenant nodes (invisible users); phone field emitted spaced value
type: project
originSessionId: 13a4adc5-4aa2-499e-b505-3ecbbad93684
---
🟢 BUILD-GREEN 2026-05-19. Two confirmed Add User defects fixed in falcon-web-platform-ui.

**Defect 1 — invisible users.** admin-console Add User wizard `ROLE_OPTIONS` was hard-coded to the 3 SYSTEM roles (sys-admin/sys-products/sys-ops) regardless of selected node. Users-list query (`org-hierarchy-page/services/services.ts:180`) filters by role: Falcon root → SYSTEM_USER_ROLES [1,2,3], tenant node → ACCOUNT_USER_ROLES [4,5,6]. So a sys-admin user created under a tenant node is silently excluded from that node's list. Old UI sent `acc-owner` → visible.
Fix: `roleOptionsForNode(nodeId)` — system roles at FALCON_ROOT_NODE.id, account roles (acc-owner/acc-admin/acc-user) otherwise; wired through wizard `targetRoles`/`grantableRoles`. Added `hierarchy.addUser.role.account*` i18n (en+ar). management-console wizard was already account-only.

**Defect 2 — phone format.** `falcon-phone-field.utils.ts composeFullNumber()` joined dial+national with a space → `+966 795604021`. Changed to unspaced E.164 `+966795604021`. No consumer splits the emitted value on space (verified 4 consumers).

**Why:** root-cause request — same QA API, users added from new UI not appearing in users list.
**How to apply:** any users-list visibility bug → check role-scope match between create payload roleKey and the node-type the list filters by. sys-admin users already created under tenant nodes pre-fix stay invisible until role-corrected.
