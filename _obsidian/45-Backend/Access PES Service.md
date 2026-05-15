*** Backend Service — Access (PES — Policy Enforcement System) ***
*** SoT: Brain Outputs/understanding/backend/access/ ***
*** Repository: C:\Falcon\Falcon\falcon-core-access-svc ***

# Access — Policy Enforcement System (PES)

> The platform's **authorization decision point**. Owns: policy rules (CRUD over fine-grained access rules), roles (system + per-account, with subject/scope/role linkage), authorization decisions (`Evaluate(AuthRequest) → AuthResponse`), authorization advice (`Advise(AuthRequest)` — like Evaluate but returns matching rules + obligations), built-in role provisioning at startup, manual GC endpoint.
>
> **Legacy odd-one-out:** Falcon legacy component (`T2.PES.*` namespace, `t2.PES.sln` solution) being kept alive while a replacement is built. Wiki calls it *"Permissions & Authorization Module (Policy-Based Access Control)"*.

## Source-of-truth files

- [SERVICE_OVERVIEW](../../../Brain%20Outputs/understanding/backend/access/SERVICE_OVERVIEW.md)
- [ENDPOINT_REGISTRY](../../../Brain%20Outputs/understanding/backend/access/ENDPOINT_REGISTRY.md)
- [DTO_DICTIONARY](../../../Brain%20Outputs/understanding/backend/access/DTO_DICTIONARY.md)
- [VALIDATIONS](../../../Brain%20Outputs/understanding/backend/access/VALIDATIONS.md)
- [ERRORS](../../../Brain%20Outputs/understanding/backend/access/ERRORS.md)
- [FRONTEND_CONTRACT](../../../Brain%20Outputs/understanding/backend/access/FRONTEND_CONTRACT.md)

## PRDs this service implements (cross-cutting)

- [[02 User Management]] — PermissionGroup · Permission rows · per-role action gating
- [[01 Account Management]] — Falcon role permissions on Org Hierarchy + CommChannels + Apps + Settings (Permission list - Jawad sheet)
- [[04 Contact Group Management]] — Contact Group permission matrix (CRUD + Share + Download per role)
- [[03 Contract Packaging Charging Billing]] — view-only client-side gates
- [[05 Templates]] — Maker / Checker role assignments

## Pages gated by this service

- Every permission-gated page across the platform — [[Organization Hierarchy]] tabs · Contracts list · Contact Groups list · Templates list · Wallets & Balance Mgmt · Users list · Settings
- Permission decisions surface as UI affordance toggles (button visible/hidden, edit/view-only, etc.)

## Excel permission sources (upstream)

- `Permission list - Jawad` sheet — authoritative per-action permission matrix for Falcon roles (180 rows · Tab 1 captured · Tab 2 export failed). Source: PRD-02. → these decisions are enforced here. Vault note: [[Falcon Roles Permission Matrix]].
- `Contact Group Permissions` sheet — explicit CRUD+Share+Download permission matrix. Source: PRD-04. → enforced here. Vault note: [[Contact Group Permission Matrix]].
- `Users statuses & others` sheet — 5 user statuses (Pending / Active / Suspended / Locked / Deleted) that gate login **before** PES is consulted. Source: PRD-02. Vault note: [[User Statuses]].
- Folder hub: [[12-Permissions/README|12-Permissions]].

## Validation contract

Per [VALIDATIONS.md](../../../Brain%20Outputs/understanding/backend/access/VALIDATIONS.md) — policy rule shape · role assignment integrity · scope bounds.

## Gateway exposure

PES is called internally by every service that gates access. Not directly exposed via gateway routes for end-user traffic — it's an internal decision point.

## Validation rules consulted here (cross-cutting)

PES does NOT validate field shape — that's per-service `[ThrowIf*]` work. PES validates **authorization decisions** when a service asks "can this subject do this action on this resource?". The triangulated validation rules that include a role-conditional gate consult PES at runtime:

- [[V-account-ip-allowlist-enforcement]] — IP allowlist is owned by [[Commerce Service]] but enforced jointly by [[Identity Service]] preprocessor + [[Core Gateway Service]] (Redis cache). PES doesn't see the IP check; it's pre-authentication.
- [[V-account-limits-zero-means-no-limit]] — limit enforcement is Commerce-side; PES gates WHO can edit Account Limitations (Falcon usertype only per Permission list - Jawad)
- [[V-username-format-uniqueness-immutable]] — username immutability is Identity-side; PES gates WHO can edit a user record
- Any rule whose owner DTO is reachable only through a permission-gated page → PES is consulted at the page level (button visible/hidden, edit/view-only)

The role × action matrix that PES enforces is [[Falcon Roles Permission Matrix]] (PRD-02 source) + [[Contact Group Permission Matrix]] (PRD-04 source).

Full validation index: [[VALIDATION_INDEX]] → "Triangulated validation rules" section.

## Hubs

- [[BACKEND_INDEX]] · [[API_INDEX]] · [[PRD_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[VALIDATION_INDEX]] · [[BUSINESS_INDEX]] · [[GAPS_INDEX]]
