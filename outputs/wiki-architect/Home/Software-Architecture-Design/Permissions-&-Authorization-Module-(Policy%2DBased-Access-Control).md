# Permissions & Authorization Module (Policy-Based Access Control)

**Canonical source:** `C:\Falcon\falcon-wiki\Home\Software-Architecture-Design\Permissions-&-Authorization-Module-(Policy%2DBased-Access-Control).md` (the `%2D` URL-encodes `-`)
**Length:** 1047 lines · **Headings:** 43
**Last wiki HEAD seen:** `0d0cb311…`

## Purpose

The **canonical authorization rule book**. Defines Falcon's **Policy-Based Access Control (PBAC)** strategy unifying direct user permissions + RBAC + ABAC under a single normalized model. Specifies the PDP / PEP / PIP separation, the six-element policy schema `(subject, object, action, effect, type, expression)`, evaluation precedence (deny > allow > role-derived > default deny), the policy storage schema (single table), the policy management HTTP API (`/pes/policyrule`, `/pes/authorize`, `/pes/authorize/resources`), and the Angular frontend integration pattern.

## Key rules / decisions

### §4.1 Scope (`…md:4-32`)

Enforced across: public REST APIs, Admin & Ops UI, Backend microservices, Internal service-to-service.
Guarantees: strict tenant isolation, fine-grained conditional access, centralized PDP + distributed PEP enforcement, full auditability.

### §4.2 Six-element model (`…md:36-50`)

All authorization rules normalize to:

| Element | Description |
|---|---|
| `subject` | Who is requesting (user or role) |
| `object` | The target resource |
| `action` | Operation being performed |
| `effect` | `allow` or `deny` |
| `type` | `p` (policy rule) or `g` (role-to-user linking) |
| `expression` | Optional conditional logic (ABAC rule) |

### §4.3 Subject model (`…md:56-69`)

Format: **`<type>:<name>@<tenant>`** — globally unique across tenants.

| Prefix | Meaning | Example |
|---|---|---|
| `u:` | User | `u:noor@t2` |
| `r:` | Role | `r:employee@t2` |

### §4.4 Policy types (`…md:75-124`)

- **Type `p` (Policy rules):** what is allowed/denied.
- **Type `g` (Role linking rules):** link users to roles. Note: in role-linking, `subject = the role`, `object = the user`. The convention is unusual but consistent.

### §4.5 ABAC via expressions (`…md:128-184`)

Expressions reference:
- `r.sub.*` — subject attributes.
- `r.obj.*` — object attributes.
- `r.env.*` — request environment.

Example: `"r.sub.deptname" == "HR"`.

**Deny rules always override allow rules.**

### §4.6 PDP / PEP / PIP (`…md:188-243`)

- **PEP (Policy Enforcement Point)** lives in API Gateway, UI BFF, Internal Microservices. Intercepts requests, builds payload, calls Authorization Service, enforces final permit/deny.
- **PDP (Policy Decision Point)** is the central Authorization Service. Evaluates `p` and `g` rules, resolves role hierarchies, evaluates ABAC expressions, applies deny>allow precedence, returns verdict.
- **PIP (Policy Information Point)** — subject attributes from Identity/User Profile; object attributes from domain services; environment from request metadata.

### §4.7 Authorization Request API Contract (`…md:247-305`)

Endpoint: **`POST https://{host}/pes/authorize/resources`**

Request structure: batch with `resources[]` (each carries `actions[]`, `obj.{attr,ignoreExpression,kind}`, `seqNo`), plus `sub.{attr, roles, departments, kind}`.

Field `ignoreExpression` allows bypassing ABAC (RBAC-only check).

### §4.9 Evaluation precedence (`…md:347-365`)

Evaluation order:
1. Deny policies.
2. Allow policies.
3. Role-derived permissions.
4. Default deny.

Final decision: any matching deny → Deny; else any matching allow → Allow; else **Deny (fail-safe)**.

### §4.10 Auditing (`…md:369-395`)

Every authorization decision records: subject, object, action, effect, matching policy ID, ABAC expression result, tenant ID, timestamp.

Logs are immutable + searchable per tenant + exposed via Audit APIs & Console.

### §4.12 Policy storage schema (`…md:415-740`)

Single table `policies` is the source of truth:

| Field | Type | Description |
|---|---|---|
| `id` | UUID / ObjectId | Unique policy identifier |
| `subject` | string | `u:noor@t2`, `r:employee@t2` |
| `object` | string | `user`, `message`, `whatsapp-message` |
| `action` | string | `create`, `send`, `delete`, `view` |
| `effect` | enum | `allow`, `deny` |
| `type` | enum | `p` (policy), `g` (group/role mapping) |
| `expression` | string | ABAC condition |
| `tenant` | string | Extracted from subject |
| `is_active` | boolean | Soft enable/disable |
| `created_at` | datetime | Creation timestamp |
| `created_by` | string | Admin or system |
| `version` | int | Policy versioning |

**Important:** "There is **NO physical roles table** controlling permissions. Roles exist **only as policy subjects**" (`…md:558-562`). PDP resolves roles dynamically at runtime by reading all `type=g` rules, constructing the role graph, expanding applicable `type=p` permissions.

Subject attributes optionally cached in `subject_attributes` (`subject`, `attributes` jsonb, `last_sync`).
Object attributes are **not stored in the policy system** — injected dynamically by PEP per request.

Mandatory indexes (`…md:652-664`):
- `(tenant, subject)` — primary lookup
- `(tenant, object, action)` — fast policy filtering
- `(tenant, type)` — fast role graph resolution
- `(tenant, effect)` — fast deny detection

### §4.13 Frontend (Angular) integration (`…md:740-1069`)

Service contracts:
- `AuthService` — `getLoginName()`, `getRoles()`, `getDepartments()`, `getMainDepartment()`.
- `SubBuilderFromLoggedUser` — builds `Sub` from OIDC claims.
- `DefaultAuthRequestBuilder` (single) / `DefaultAuthorizationsRequestBuilder` (batch).
- `PESService` — `authorizeMultipleObjects(...)` → `POST /authorize/resources`.
- `PermissionManagerService` — local permission cache used by components, directives, route guards.

End-to-end flow:
```
User Login (OIDC)
   ↓
AuthService extracts claims
   ↓
SubBuilderFromLoggedUser builds Sub
   ↓
Frontend builds Objects + Actions
   ↓
PESService → POST /authorize/resources
   ↓
PDP evaluates (RBAC + ABAC)
   ↓
Results returned
   ↓
PermissionManager.set(...)
   ↓
UI components enforce permissions
```

### §4.14 cURL examples — Policy management API (`…md:1071-1312`)

- **Add policy rules (RBAC):** `POST https://{host}/pes/policyrule` with array of `{type:"p", sub, obj, action, effect, expression}`.
- **Link users to roles:** same endpoint, array of `{type:"g", sub: role, obj: user, action: "all", effect: "allow"}`.
- **Simple authorize (single object):** `POST https://{host}/pes/authorize` with `{sub, obj, actions[]}`.

## Diagrams / images referenced

- None (text + code-block heavy).

## Cross-references

- Connects to `Security-Architecture.md` §4.6 (Identity provides `sub`, `tenant_id`, `user_type` claims; this doc provides `roles`, `departments`).
- `Security-Architecture.md` §4.8 #7: "Roles and permissions remain outside Identity Service and belong to the **Access Management** domain" — that is **this** module.
- Pairs with `Clean-Architecture-…md` Authorization vs Control distinction.

## Implications for code

**Identifying the service:**
The Authorization Service is called **PES** (Policy Enforcement Service) in `falcon-core-access-svc`. Code path: `C:\Falcon\Falcon\falcon-core-access-svc\src\T2.PES.API\`. The HTTP API base path is `/pes/...` per wiki §4.14.

**Verified against code:**
- `falcon-core-access-svc` exists ✓.
- Project naming uses `T2.PES.*` not `Falcon.Access.*` — pre-rename leftover (fallback §1.4 conflict).

**Conflicts with code:**

1. **`T2.PES.*` project names violate naming convention** — wiki §"Repository Naming" says `falcon-core-access-svc` (which the repo name matches), but inside, projects should be `Falcon.Access.*` per §".NET Solution & Project Naming". Currently `T2.PES.*`. Pre-rename baggage. (Fallback §1.4.)
2. **`T2.PES.*` targets `net6.0`** — four major versions behind the `net10.0` platform standard (Deployment Document §Project Overview). (Fallback §1.5.)
3. **Access Service does NOT have a `.csproj` `ServiceOperationResult<T>` shape** (fallback §4.1 row "Access (PES) — not found"). Wiki doesn't explicitly require Access to use the same wrapper shape, but cross-service consistency demands it. **Open question.**
4. **Subject format `<type>:<name>@<tenant>`** — wiki shows examples like `u:noor@t2`, `u:n.joudeh@qc`, `r:mjalisadmin`. The latter has no `@tenant` suffix. **Spec ambiguity:** wiki §4.3 says all subjects MUST have `@<tenant>`, but examples in §4.14 omit it on role names. The strict reading is wiki §4.3.
5. **`/pes/authorize` and `/pes/authorize/resources` endpoints** — verify these exist in `T2.PES.API/Controllers/`. No fallback evidence.
6. **PEP in API gateways** — wiki §4.6.1 says PEP exists in API Gateway. Currently both Falcon gateways validate JWT and route, but **do they call PES for each request?** Need to grep for `pes` references in gateways. Likely missing — fallback says no gateway-level PES integration found.
7. **PDP service** — needs `falcon-core-access-svc` to expose `/pes/authorize/resources` and `/pes/policyrule`. The `T2.PES.*` solution should be verified to contain these controllers / endpoints.

**Migration items:**
- Rename `T2.PES.*` → `Falcon.Access.*` and upgrade to `net10.0`.
- Add gateway-level PEP integration (call PES per request, cache decision).
- Verify the single `policies` table exists with the 12 required fields + 4 mandatory indexes.
- Implement Angular `PESService` + `PermissionManagerService` per §4.13 in the host shell.
