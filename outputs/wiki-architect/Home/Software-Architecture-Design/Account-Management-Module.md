# Account Management Module

**Canonical source:** `C:\Falcon\falcon-wiki\Home\Software-Architecture-Design\Account-Management-Module.md`
**Length:** 46 lines · **Headings:** 8
**Last wiki HEAD seen:** `0d0cb311…`

## Purpose

Defines the **Node / Sub-Node** hierarchy that underpins Falcon multi-tenancy and the six endpoints that mutate it. Lives under the **Commerce** service (`falcon-core-commerce-svc`) — it is the canonical document for what Commerce *should* own about accounts, and what it must NOT own about users.

## Key rules / decisions

### Endpoint inventory (`Account-Management-Module.md:8-48`)

| Flow | Endpoint | Method |
|---|---|---|
| Create Account (Main Node) | `/api/node/create-account` | POST |
| Create Sub-Node | `/api/node/create-SubNode` | POST |
| Update Node Name | `/api/node/ChangeNodeName` | PUT |
| Update Main-Node Profile | `/api/information` | PUT |
| Update Account Settings (Security/Quota) | `/api/setting` | PUT |
| Read Account Hierarchy (Nodes + Users) | `/api/AccountHierarchy` | GET |

### Data & invariants (`Account-Management-Module.md:51-76`)

**Main node:** `NodeType = Main`, `TenantId = Id`, `Path = Id`, `Level = 1`.

**Sub-node:** `NodeType = Sub`, `TenantId = parent.TenantId`, `ParentId = parent.Id`, `Path = parent.Path + "." + newNodeId`, `Level = parent.Level + 1`.

**Settings:**
- Commerce settings stored by `OwnerId = mainNodeId`.
- Security/quota updates are propagated to Identity **asynchronously via Kafka**.

**Users:**
- **Commerce does not persist user records in this target model.**
- Account-owner / user creation is **delegated to `falcon-core-identity-svc`**.

## Diagrams / images referenced

- `Account%20Management-8d837f6f-…jpg` — top-level Account Management diagram.
- `diagram-1773314624748-…png` — Create Account (Main Node) flow.
- `diagram-1773314657176-…png` — Create Sub-Node flow.
- `diagram-1773314688520-…png` — Update Node Name flow.
- `diagram-1773314714024-…png` — Update Main-Node Profile flow.
- `diagram-1773314750347-…png` — Update Account Settings flow.
- `diagram-1773314777123-…png` — Read Account Hierarchy flow.

## Cross-references

- Implicit ownership boundary with `Security-Architecture.md` §4.2.8 (Commerce → Identity via `commerce.identity-settings-sync.v1` Kafka topic).
- Pairs with `Permissions-&-Authorization-Module-…md` — subject identity (`u:<name>@<tenant>`) presumes the tenant/node structure defined here.

## Implications for code

**Codebase location (Commerce):** `C:\Falcon\Falcon\falcon-core-commerce-svc\src\Falcon.Commerce.Api\Controllers\NodeController.cs`, `AccountHierarchyController.cs`, `InformationController.cs`, `SettingController.cs`.

**Boundary rules:**
- Commerce **must NOT create/own users** — that responsibility lives in Identity. (The fallback noted "Commerce.Tenant entity" — that's the Node/Tenant settings store, not user records. Tenant-ownership question raised in fallback §8 is partially resolved: Commerce owns the **business tenant/account** entity, Identity owns the **user identity**.)
- Security/quota → Identity must be **asynchronous via Kafka**, not synchronous gRPC/HTTP. This is the dedicated topic `commerce.identity-settings-sync.v1` per Security Architecture §4.2.8.

**Open spec gap:** Wiki does not name the Commerce-side topic publisher class or its message schema. Look in `Falcon.Commerce.Infrastructure\Messaging\Kafka\` for the producer; if it does not exist yet, that's the next implementation gap.
