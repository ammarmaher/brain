---
title: Old UI Dataset — Master Index
mission: backend-integration-blueprint
source: origin/main @ 803ac1d1 (Merged PR 41615)
worktree: C:\Falcon\Brain Outputs\worktrees\falcon-old-ui-main\
extracted: 2026-05-16
extracted-by: Adnan / Jakco (Night Shift mode)
agents: 8 parallel deep-dives + 1 aggregator + 1 obsidian write-back
features-mined: 20+
endpoints-captured: ~138
dtos-captured: ~277
pes-keys-captured: ~78
status: complete
---

# Old UI Dataset — Master Index

> [!tldr]
> Code-grounded dataset of every page in the Falcon platform's working backend integration on `origin/main`. Use this when wiring the new theme to the existing APIs — every endpoint, DTO, PES key, validator, and cross-page dependency is captured with `file:line` citations. **The new theme must preserve these contracts.**

## Why this dataset exists

The `polishing-v0.4` branch (active development) is a UI rebuild — clean Falcon-library + tokens-only theme work — but the backend integration on it is partial (e.g. host-shell auth is a phantom-tokens regression per Night Shift #1 GAP-NS03). The `origin/main` branch holds the OLD UI's working backend wiring. This dataset captures everything Claude can extract from main so the new theme can be re-wired against the existing, proven, contract.

## What's in this dataset

```
C:\Falcon\Brain Outputs\datasets\old-ui-dataset\
├── 00-INDEX.md                        ← this file
├── BRIEF-TEMPLATE.md                  ← shared brief used by deep-dive agents
├── 10-pages/                          ← per-feature deep-dives (8 files each)
│   ├── admin-console/
│   │   ├── organization-hierarchy/    ← 31 endpoints / 45 DTOs / 13 PES
│   │   ├── wallet-balance-management/ ← 5 endpoints / 30+ DTOs / 5 PES
│   │   ├── comms-hub/                 ← 13 endpoints / 22 DTOs / 6 PES
│   │   ├── contact-groups/            ← 7 endpoints / 18 DTOs / 9 PES
│   │   ├── contracts-cost-management/ ← 9 endpoints / 17 DTOs / 0 PES (GAP)
│   │   ├── marketplace-applications/  ← 15 endpoints / 28 DTOs / 4 PES
│   │   └── testing-charging/          ← 10 endpoints / 14 DTOs / 0 PES
│   ├── host-shell/
│   │   ├── _core/                     ← interceptors, guards, MF config
│   │   ├── auth/                      ← 8 endpoints (Identity Gateway pinned)
│   │   ├── user-profile/              ← 10 endpoints (largest in host-shell)
│   │   ├── dashboard/                 ← mock-data placeholder
│   │   ├── Demo/                      ← dev affordances
│   │   ├── error/, not-found/, unauthorized/ ← trivial fallbacks
│   └── management-console/
│       ├── _core/                     ← Core Gateway default, managementConsole.* namespace
│       ├── account-administration/    ← 35 endpoints / 50+ DTOs / 28 PES (unique to mgmt)
│       └── _diffs/                    ← 5 shared-feature DIFFs vs admin-console
│           ├── comms-hub.diff.md
│           ├── contact-groups.diff.md
│           ├── contracts-cost-management.diff.md
│           ├── marketplace-applications.diff.md
│           └── wallet-balance-management.diff.md
└── 99-registries/                     ← cross-page aggregations
    ├── 01-APP-MAP.md                  ← every route in the platform
    ├── 02-API-REGISTRY.md             ← every HTTP endpoint (~138)
    ├── 03-DTO-REGISTRY.md             ← every TypeScript DTO (~277)
    ├── 04-PES-REGISTRY.md             ← every permission key (~78)
    └── 05-SERVICE-REGISTRY.md         ← every Angular service
```

## How to use this dataset

### When re-wiring a feature in the new theme

1. **Find the feature** in `10-pages/<app>/<feature>/`.
2. **Read `00-README.md`** for the manifest of what's captured.
3. **Read `03-SERVICES-APIS.md`** to see every endpoint the old UI calls — every one of these is a contract the new theme must preserve. Copy the URL patterns, methods, and gateway routing.
4. **Read `04-DTOS.md`** to copy the TypeScript interfaces — these are the request/response shapes the backend expects and returns.
5. **Read `05-PES.md`** to copy the permission keys — these are the access-control gates the new theme must enforce.
6. **Read `06-VALIDATIONS.md`** to copy form rules.
7. **Read `07-CROSS-PAGE.md`** to know which other features depend on this one (and which shared services/components it needs).

### When picking which gateway to call

Cheat sheet:
- **Admin-console feature?** → Default to System Gateway (`Gateway.SystemGateway`).
- **Management-console feature?** → Default to Core Gateway (`Gateway.CoreGateway`).
- **Auth?** → Identity Gateway (`Gateway.IdentityGateway`).
- **Wallet transfer in mgmt?** → Explicit override to Charging Gateway.
- See `_core/00-README.md` in each app folder for `provideAppDefaultGateway()` config.

### When matching a backend service from a URL

Quick map:
- `commerce/*` / `api/commerce/*` → Falcon Core Commerce Service
- `charging/*` → Falcon Core Charging Service
- `identity/*` → Falcon Core Identity Service
- `contactgroup/*` → Falcon Core Contact Group Service
- `pes/*` → Falcon PES (permissions) Service
- `api/testing/charging/*` → testing surface (proxied to charging via system-gateway)

Full mapping with all endpoints: `99-registries/02-API-REGISTRY.md`.

### When checking permissions

Quick map:
- `FalconAccess.adminConsole.*` — admin-console features
- `FalconAccess.managementConsole.*` — management-console features
- `FalconAccess.contactGroup.*` — contact-groups (cross-app exception — same keys in both apps)
- `FalconAccess.userRole.other(source, target)` — dynamic role-edit matrix

Pattern:
```typescript
// Route-level (in route definition's data block)
data: { access: FalconAccess.adminConsole.feature.view() }

// Component-level (batched check)
const flags = await this.access.resolveFlags({
  canCreate: FalconAccess.adminConsole.feature.create(),
  canEdit: FalconAccess.adminConsole.feature.edit(),
});
Object.assign(this, flags);
```

Full registry: `99-registries/04-PES-REGISTRY.md`.

## Headline observations

### Architectural truths
- **Module Federation:** host-shell mounts `admin-console` + `management-console` as eager-shared remotes. `module-federation.manifest.json` declares 4 remotes, 2 active in prod.
- **Default gateways differ by app** — see cheat sheet above. The same logical endpoint may resolve through different gateways depending on which app calls it.
- **Response envelope:** every endpoint returns `ServiceOperationResult<T>`. Generic interceptor handles success/failure shapes uniformly.
- **i18n:** every user-facing text field is `MultiLanguageName = { en: string; ar: string }` — drop in/out of forms accordingly.

### Cross-cutting patterns
- **Aggregator endpoints** (e.g. `api/commerce/accounts/{id}/hierarchy`) join multiple backend services at the gateway level. **Do NOT bypass them by calling the underlying services directly** — Commerce + Charging joins are gateway logic.
- **Server-driven row actions** — table rows ship `row.allowedActions: FalconRowAction[]` and the menu is gated by what the server permits. Don't hardcode row-action visibility on the client.
- **Backend-supplied error envelopes** flow through `ResponseInterceptor` which toasts and routes 401s through a refresh loop with `X-Token-Retried` guard.

### Per-feature highlights
- **organization-hierarchy** is the most integrated feature (21 endpoints, 45 DTOs, 13 PES, 5-step Create-Client wizard, 4 tabs, 17/19-field info panel with Falcon-user vs Client-user editability).
- **testing-charging** is the most isolated (zero Falcon-library components, zero PrimeNG, zero shared facades) — port cleanly.
- **account-administration** (mgmt-only) has the largest PES surface — 28 distinct `managementConsole.*` keys.
- **contact-groups** has different behaviors across apps — mgmt has a full 5-step create wizard; admin is list/detail-only.
- **contracts-cost-management** in mgmt is a thin facade that imports admin-console components via `../../../../../admin-console/...` cross-app relative paths (anti-pattern — see GAP-OLDUI-03).

### Surprises documented as gaps
- `GAP-OLDUI-01` — Inconsistent URL prefixes (`api/commerce/` vs `commerce/` vs lowercase variants)
- `GAP-OLDUI-02` — admin-console/contracts-cost-management has zero PES gating
- `GAP-OLDUI-03` — Cross-app sibling imports in mgmt/contracts
- `GAP-OLDUI-04` — Wallet cell-edit UI is half-built dead code (save persists strategy only, not cell values)

## Coverage caveats

- This is `origin/main @ 803ac1d1` — a moving target. Re-extract after major main-branch merges if dataset becomes stale.
- A few endpoint counts are best-effort (services nested inside cross-imported folders may double-count between features); the API registry deduplicates.
- The DTO registry quotes shapes verbatim — type aliases / generics chase ends at the immediate file (no transitive expansion).
- "Dead code" / "unused endpoint" labels flag candidates discovered during traversal; some may be live via deep-link paths not reached by the static traversal.

## Cross-references

- Obsidian master MOC: `[[00-MOCs/Old-UI-Dataset-Index]]`
- Per-page wiki notes: `[[20-Pages/old-ui-*]]`
- Vault gaps: `[[70-Gaps/GAP-OLDUI-01..04]]`
- Brief template (for re-running): `BRIEF-TEMPLATE.md`
- Worktree location: `C:\Falcon\Brain Outputs\worktrees\falcon-old-ui-main\` (kept for follow-up missions; remove with `git worktree remove` when stale)
- Night Shift #1 context: `C:\Falcon\Brain Outputs\reports\night-shift-2026-05-16\REPORT.md`
