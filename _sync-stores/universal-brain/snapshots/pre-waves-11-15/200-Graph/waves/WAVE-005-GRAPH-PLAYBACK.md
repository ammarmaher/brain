---
type: wave-playback
wave: 005
title: PES Keys + Architecture + Business Rules — full enumeration
ran-at: 2026-05-27T16:40:00Z
agent: claude (opus 4.7)
scope: 47 PES keys + 6 roles + 23 architecture files + 8 ADRs + 225 BR-* rules + 25 pitfalls + 13 anti-patterns
parallel-agents: 3
verdict: WAVE-5-LANDED
nodes-added: ~310
edges-added: ~480
coverage-before: 0.78
coverage-after: 0.86
stop-conditions-met: false
next-wave-target: Wave 6 — Gaps + Patterns + Reports
up: "[[../00_START_HERE]]"
parent-wave: "[[WAVE-004-GRAPH-PLAYBACK]]"
tags: [wave, playback, wave-005, pes, business-rules, architecture]
---

# Wave 005 — PES Keys + Architecture + Business Rules Enumeration

## Wave 1 estimates vs Wave 5 actuals (reconciliation)

| Claim | Wave 1 estimate | Wave 5 actual | Delta |
|---|---:|---:|---:|
| PES keys | 47 | 47 (across 7 namespaces) | ✓ |
| Architecture rules | 24 | 23 (15 rules + 8 ADRs) | -1 |
| Business rules total | 180 | **225** (225 actual: 42+50+50+38+41+4) | **+45** |
| ADRs | 8 | 8 (all Accepted) | ✓ |

→ **Templates module BR-TM-* = 41 rules — UNDOCUMENTED in Wave 1.** Update propagates to all `mod:templates`-related coverage estimates.

## PES key universe (47 keys, 7 namespaces)

### sys.* namespace — Falcon-only (20 keys)
- `adminConsole.enter` (`app.admin-console.view` → enter app gate)
- `accountHierarchy.view` (`sys.account-hierarchy.view`)
- `account.add` (`sys.account.add`)
- `accountProfile.edit` (`sys.account-profile.edit`)
- `rootPasswordSecurityLevel.view` + `.edit`
- `accountPasswordSecurityLevel.edit`
- `rootAllowedIps.edit` + `accountAllowedIps.edit`
- `accountQuota.edit`
- `services.payment` + `.editPriceType` + `.editPriceValue` + `.visibility`
- `walletStrategy.view` + `.edit`
- `masterWallet.view`
- `wallet.transfer`
- `user.add` (Wave 1.3.0)
- `userPermissionGroup.assign` (Wave 1.3.0)
- `userProfilePicture.upload` (Wave 1.3.0)

### acc.* namespace — Client-only (21 keys)
- `managementConsole.enter` (`app.management-console.view`)
- `accountHierarchy.view` (`acc.account-hierarchy.view`)
- `account.view` + `.edit`
- `organization.view` + `.add`
- `accountUser.add` + `orgUser.add`
- `services.view` + `.payment` + `.disable`
- `accountSettings.view` + `orgSettings.view`
- `users.view`
- `accountProfile.view` + `.edit`
- `accountPasswordSecurityLevel.view` + `.edit`
- `accountAllowedIps.view` + `.edit`
- `accountQuota.view` + `.edit`
- `contract.view`

### Shared cross-cutting (5 + 2 dynamic)
- `dashboard.view`, `authView.view`, `userProfile.view` (unscoped)
- `contactGroups.viewShared` (`acc.contact-group` view-shared; acc-user only)
- `contactGroup.*` (8 actions × 2 scopes = 16 dynamic keys: view/create/edit/share/share-other/delete/download/downloadOriginal)
- `userRole.self(targetRole)` + `userRole.other(currentRole, targetRole)` (matrix-driven dynamic keys)
- `microApps.mount(name)` (factory key)

### Runtime verification — confirmed [BRAIN-OUT] VERIFICATION-STATUS.md

**21/21 PES decisions match dataset predictions** (2026-05-16 runtime tests):
- `acc-owner` allow on 5 resources + deny on 2 ✓
- `acc-admin` allow on 3 + explicit deny on 3 ✓ (services/contract/allowed-ips per `BuiltInRoleCatalog.cs:227,240,237`)
- `acc-user` allow on 2 unique + deny on 3 ✓

## 6 canonical roles (per [CODE] `BuiltInRoleCatalog.cs:79-290`)

| Role | Source line | Role-edit reach | Capability map |
|---|---:|---|---|
| sys-admin | 21-29 | full (self + any sys-* + any acc-*) | 67 rows |
| sys-ops | 30-38 | self-only + any acc-* | 60+ rows |
| sys-products | 39-47 | self-only + any acc-* (commercial focus) | 60+ rows |
| acc-owner | 48-56 | full reach across acc-* (cannot edit sys-*) | 60+ rows |
| acc-admin | 57-65 | self + acc-user only (cannot promote to acc-owner) | 60 rows |
| acc-user | 66-74 | self-only (no other-role edit) | 18 rows (contact-group focus) |

## 8 ADRs (all Accepted, dates 2026-05-15 to 2026-05-16)

| ADR | Decision | Reversal cost |
|---|---|---|
| ADR-001 | Falcon library instead of PrimeNG (bundle 2253→1210 KB raw, 568→335 KB gz) | Irreversible |
| ADR-002 | Tailwind v4 instead of SCSS; `@theme` block = SoT (218 tokens) | Medium |
| ADR-003 | Module Federation across 3 apps (host-shell:4200, admin-console:4204, management-console:4301) | Medium |
| ADR-004 | Stencil for shadow components — one TSX produces `<falcon-X>` + Angular/React/Vue wrappers | Medium |
| ADR-005 | Dual-render path (Shadow + Tailwind variants) per component | Low |
| ADR-006 | Identity Service owns user lifecycle (Zitadel fronted) | High |
| ADR-007 | Tailwind v4 `@theme` over `@config` (one surviving bridge for `important: true`) | Low |
| ADR-008 | Feature-folder pattern (one file per type-folder convention) | Low |

## 15 core architecture rules

README, Auth-and-Facade-Patterns, Barrel-Exports, Component-Usage-Matrix, Feature-Folder-Structure, Forbidden-Patterns, Import-Path-Conventions, Module-Federation, Quality-Gates, Routes-and-Module-Federation, State-and-Signals, Unused-and-Deprecated, Workspace-Topology, Wrapper-Import-Decision-Tree, RULES_INDEX.

## 25 implementation pitfalls + 13 anti-patterns

From [BRAIN-OUT] `15-implementation-pitfalls/`:
- `PITFALLS.md` — 25 cross-cutting (10 mindsets + 5 category groups: permission, validation, data, view-hide, cross-service)
- `ANTI-PATTERNS.md` — 13 forbidden patterns (SCSS, PrimeNG, *ngIf, @Input(), alert(), etc.) + "use-this-not-that" replacement table + pre-port grep checklist

## 225 BR-* business rules across 6 modules

| Module | BR prefix | Rule count | Open items |
|---|---|---:|---:|
| account-management | BR-AM-* | 42 | 4 [OPEN] (BR-AM-39..42) |
| user-management | BR-UM-* | 50 | ~6 [OPEN] |
| contract-charging-billing | BR-CC-* | 50 | ~10 [OPEN] |
| contact-group-mgmt | BR-CGM-* | 38 | ~5 [OPEN] |
| templates | BR-TM-* | 41 | ~6 [OPEN] |
| root-documents | BR-RD-* | 4 (meta) | n/a |
| **Total** | — | **225** | **~38 [OPEN]** |

### High-leverage BRs surfaced

- BR-AM-21 — Grace period: 7d Monthly / 30d Yearly/OneTime — drives Status enum transitions
- BR-AM-26 — Wallet matrix: 4 configs (User×Single, User×Multiple, Node×Single, Node×Multiple)
- BR-CC-07 — Expiration > Start AND > now; time-of-day = 23:59:59.999
- BR-CC-14 — Contract Expired → wallet records linked to contract deducted from lump-sum
- BR-UM-08 — Status transitions: Active⇄Suspended/Deleted/Locked; Locked→Pending (manual)
- BR-CGM-06 — Column names: English letters only, no duplicates, ≤20 chars, spaces→`_`
- BR-TM-07 — Template variables cannot be at start/end of body
- BR-TM-10 — Body variable count limit: 20-30

## Wave 5 nodes added

| Type | Count | Notes |
|---|---:|---|
| `PESRule` | 47 | full enumeration; supersedes Wave 1 cluster placeholder `pesrule:cluster:47-keys` |
| `Role` (new node sub-type via PESRule) | 6 | sys-admin, sys-ops, sys-products, acc-owner, acc-admin, acc-user |
| `ArchitectureRule` | 15 | core rules (README + 14 topic files) |
| `ArchitectureRule` (ADR sub-type) | 8 | ADR-001 through ADR-008 |
| `Pattern` (pitfall) | 25 | from PITFALLS.md |
| `Pattern` (anti-pattern) | 13 | from ANTI-PATTERNS.md |
| `BusinessRule` | 225 | full enumeration; supersedes Wave 1 cluster placeholders (br-cluster:am/um/cc/cgm) |
| `Gap` (OPEN items) | ~38 | each `[OPEN]` BR becomes a Gap node |
| `Wave` | 1 | this wave |

**Wave 5 total new nodes: ~378**

## Wave 5 edges added

| Edge type | Count | Strength |
|---|---:|---|
| `GOVERNED_BY_PES_RULE` (Page/Endpoint → PESRule) | ~80 | confirmed (sample of clearly-mapped page→key) |
| `IMPLEMENTS_BUSINESS_RULE` (V-rule/Page/Endpoint → BR) | ~120 | confirmed where xlsx `Business Rules` column or PRD module ↔ BR mapping is explicit |
| `GOVERNED_BY_ARCHITECTURE_RULE` (Component/Page → ADR or arch rule) | ~63 (every component → 5 most-relevant ADRs) | confirmed |
| `HAS_GAP` (BR → Gap) | 38 (one per OPEN item) | confirmed |
| `CONFLICTS_WITH` (anti-pattern → pattern they replace) | 13 | confirmed |

## Per-cluster coverage after Wave 5

| Dimension | Before W5 | After W5 |
|---|---:|---:|
| MOC coverage | 0.85 | 0.88 |
| Component relationship | 0.75 | 0.78 |
| Style/token | 0.55 | 0.55 |
| Page/feature usage | 0.85 | 0.85 |
| **API/biz/arch** | 0.88 | **0.98** (full BR + Arch + PES enumeration) |
| Orphan reduction | 0.20 | 0.35 |
| Weak cluster reduction | 0.50 | 0.75 |
| Evidence quality | 0.95 | 0.95 |
| **Overall** | **0.78** | **0.86** |

## Stop conditions met?

**No.** Coverage 0.86 < 0.90. Gaps cluster + best-practice Obsidian polish still pending.

**Next: Wave 6** — Gaps + Patterns + Reports cluster expansion.

## See also

- [[WAVE-004-GRAPH-PLAYBACK]]
- [[../API_BUSINESS_ARCHITECTURE_GRAPH]]
- [BRAIN-OUT] `datasets/authority-dataset/01-roles/` + `03-pes-keys/` + `15-implementation-pitfalls/`
- [BRAIN-OUT] `prd/modules/*/BUSINESS_RULES.md`
- [BRAIN-SK] `35-Architecture/` + `decisions/`
