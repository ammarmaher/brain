---
name: Commerce service security gaps found in Wave 5a
description: Three security gaps in falcon-core-commerce-svc discovered 2026-05-18 during controller deep-dive. Two have security task chips pending user action.
type: project
originSessionId: f6ecc776-1773-4495-92d7-3bd75ebceecd
---
Three security gaps in `falcon-core-commerce-svc` found during Wave 5a night-shift mining:

1. **SettingController + InformationController missing class-level `[Authorize]`** — every other Commerce controller has it; these two do not. Backend relies solely on frontend PES gate. Pending-Q: `wave-5a-SettingController-class-authorize.md`.

2. **InformationController PUT has commented-out NodeAdmin/NormalUser role gate** — previously blocked these roles from editing account info; now commented-out, backend permissive. Pending-Q: `wave-5a-InformationController-commented-role-check.md`.

3. **AccountHierarchyController missing tenant-isolation check** — `GET commerce/accounts/{id}/hierarchy` does not validate Client user's tenantId matches hierarchy ownerId (SettingController does). Cross-tenant metadata leak possible. Pending-Q: `wave-5a-AccountHierarchyController-tenant-isolation.md`.

**Why:** Defense-in-depth requirement. UI PES gate alone is insufficient; backend must enforce auth independently.

**How to apply:** Before merging any PR that touches these controllers, verify [Authorize] is restored and the role gate decision is explicit. Security task chips shown to user 2026-05-18.
