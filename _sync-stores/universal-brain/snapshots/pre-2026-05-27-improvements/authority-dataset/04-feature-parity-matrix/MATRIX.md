---
type: matrix
cluster: 04-feature-parity-matrix
title: Falcon vs Client — Feature Parity Master Matrix
purpose: "Answers 'which features are Falcon-only / Client-only / shared / shared-with-enrichment'. Open before deciding whether to port a feature admin → mgmt or planning new-UI feature scope."
features-covered: 7
extracted: 2026-05-16
---

# Feature Parity Master Matrix

> [!tldr]
> 7 features compared across both consoles. Categorised into **Falcon-only**, **Falcon-mostly**, **Shared with config-flip**, and **Shared with Client-side enrichment**. Use this matrix to decide port direction + scope when copying features admin → mgmt (or planning the new UI rebuild).

## Master classification

| Feature | Class | Admin route | Mgmt route | Notes |
|---|---|---|---|---|
| `organization-hierarchy` | **Shared with Falcon enrichment** | `/organization-hierarchy` | `/organization-hierarchy` | Same shared tree component; admin adds the 5-step **Add Client wizard** + synthetic Falcon root |
| `comms-hub` | **Shared with Client enrichment** | `/comm-mgmt` (flat) | `/comm-mgmt` + 3 stub children (`whatsapp-business`, `voice-service`, `ai`) | Mgmt list endpoint is `/visible/details` (filters by visibility + payment status) |
| `marketplace-applications` | **Shared with config-flip** | `/marketplace-applications` | `/marketplace-applications` | Admin enforces 4 in-component PES flags; mgmt uses single route-level guard + backend row-action gating |
| `contact-groups` | **Shared, asymmetric power** | `/contact-groups` (read-only) | `/contact-groups` (full 5-step create wizard + share + delete + details) | Admin has NO create UI by authority design — every `sys-*` role is **deny** on `create/edit/delete/share` |
| `wallet-balance-management` | **Falcon-mostly** | `/wallet-balance-management` | `/wallet-balance-management` (view + transfer only) | Master Wallet card + cross-account tree picker + wallet-strategy are Falcon-only |
| `contracts-cost-management` | **Falcon-mostly** | `/contracts-cost-management` (full lifecycle) | `/contracts-cost-management` (view-only, **only acc-owner** can land) | Strongest authority asymmetry — acc-admin + acc-user explicitly **deny** |
| `testing-charging` | **Falcon-only** | `/testing-charging` | — (not present, not portable) | Mutates real OCS state — security boundary forbids exposing to Client |

## The asymmetry chart (at a glance)

```
                 admin-console (Falcon)              management-console (Client)
                 ─────────────────────               ─────────────────────────
organization-    ✅ tree + tabs                       ✅ tree + tabs (no Add Client wizard)
hierarchy        ✅ Add Client wizard                 ✅ Add Node + Add User
                 ✅ Add Node + Add User               ❌ no synthetic Falcon root

comms-hub        ✅ flat list                          ✅ nested list + 3 stub children
                                                       ✅ enriched DTO (icon/period/etc)

marketplace-     ✅ in-component PES flags             ✅ route-guard PES + backend rows
applications

contact-groups   👁️  view-only                          ✅ full CRUD + 5-step wizard
                 ✅ download                            ✅ share with own-only on acc-user
                 ❌ create/edit/delete/share

wallet-balance-  ✅ Master Wallet                       👁️  no Master Wallet
management       ✅ wallet-strategy edit                👁️  view-only
                 ✅ cross-account transfer              ✅ transfer (Charging gateway)

contracts-cost-  ✅ full lifecycle                       👁️  view-only (acc-owner only)
management       ✅ create / edit / pay                  ❌ acc-admin denied
                                                        ❌ acc-user denied

testing-charging ✅ full feature                         ❌ not present (security)
```

## Per-feature drill-down

- [[organization-hierarchy.compare]] — biggest, most flows
- [[comms-hub.compare]] — shared with mgmt-side child-route enrichment
- [[marketplace-applications.compare]] — service-card pattern, payment dialog
- [[contact-groups.compare]] — unique `contactGroup.*(scope)` namespace
- [[wallet-balance-management.compare]] — Falcon-mostly
- [[contracts-cost-management.compare]] — strongest authority asymmetry
- [[testing-charging.compare]] — admin-only by design

## Falcon-only features (zero acc-* equivalent)

1. `testing-charging` — entire feature.
2. `wallet-balance-management` — Master Wallet card + wallet-strategy view/edit (admin keeps cross-account tree picker; mgmt loses it).
3. The 5-step **Add Client wizard** inside `organization-hierarchy` (mgmt has Add Node + Add User but no Add Client — clients don't create clients).

## Client-only features (zero sys-* equivalent)

1. `contact-groups` — create / edit / delete / share full UI. (Admin can view + download but explicitly cannot author.)
2. The `acc.contact-group / view-shared` permission — only `acc-user` has it.

## Shared features (config-flip is enough)

1. `organization-hierarchy` view/tabs/settings (the wizard is admin-only; everything else flips).
2. `comms-hub` list view + payment dialog.
3. `marketplace-applications` card list + payment dialog.
4. `wallet-balance-management` per-node view + transfer (mgmt drops Master Wallet card).

## Roles allowed to land on each page (route guard verdict)

Cross-cuts the 6 roles × 7 features grid. ✅ = `app.<console>.view` allow AND the page's primary guard PES key allow. ❌ = either explicit deny or no rule.

| Feature | sys-admin | sys-ops | sys-products | acc-owner | acc-admin | acc-user |
|---|---|---|---|---|---|---|
| organization-hierarchy | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| comms-hub | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| marketplace-applications | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| contact-groups | ✅ (view-only) | ✅ (view-only) | ✅ (view-only) | ✅ | ✅ | ✅ |
| wallet-balance-management | ✅ | ✅ (partial) | ✅ | ✅ | ❌ | ❌ |
| contracts-cost-management | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| testing-charging | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |

> `acc-user` only sees `contact-groups`. Every other mgmt feature route checks `acc.<resource>.view` which is `deny` (or no rule) for `acc-user`.

## Universal "copy admin → mgmt" recipe

For features classified `Shared with config-flip`:

1. **Copy the file tree** from `apps/admin-console/.../<feature>/` to `apps/management-console/.../<feature>/`.
2. **Rename Angular selectors** if they use `admin-` / `app-admin-` prefix.
3. **Namespace flip** — search/replace `FalconAccess.adminConsole.X` → `FalconAccess.managementConsole.X` (some keys have no mgmt counterpart — drop them).
4. **Gateway flip** — the mgmt-console `app.config.ts` already provides `Gateway.CoreGateway` as default; any explicit `useGateway(Gateway.SystemGateway)` calls in the copied service must drop the override (or flip to `CoreGateway`).
5. **DTO enrichment** — mgmt-side DTOs commonly add UI hint fields (`icon`, `subtitle`, `pricePeriod`, etc.) — port from existing mgmt-side feature precedents.
6. **Endpoint suffix** — some mgmt endpoints append `/visible` or `/visible/details` to apply tenant-visibility filtering. Check the admin-side `*-api.service.ts` against the mgmt `_diffs/<feature>.diff.md`.
7. **Session-based account id** — mgmt-side reads `session.tenantId || session.client_id`; admin-side commonly accepts a node-id from a tree selection.
8. **Remove Falcon-only sub-features** — Master Wallet card, cross-account tree picker, Add Client wizard.
9. **Add the route to `app.routes.ts` with `data.access`** — set the per-route PES gate (e.g. `FalconAccess.managementConsole.services.view()`).
10. **Reseed PES** if new acc.* resources/actions are introduced (`BuiltInRoleCatalog.cs` → reseed).
11. **Verify** — log in as the relevant `acc-*` test user; confirm landing + visible actions match the per-role table above.

For features classified `Falcon-only` or `Falcon-mostly`:
- Verify the missing acc.* PES keys are intentional. If a feature is missing from mgmt purely by accident, add the rule to BuiltInRoleCatalog.cs + reseed.

## Drift watch (re-run the dataset when any of these change)

- `BuiltInRoleCatalog.cs` — any new `BuiltInPolicyRuleDefinition`.
- `falcon-access.registry.ts` — any new factory method.
- `pes-account-role-rules.json` — any new tenant-scoped `p`-rule.
- Either app's `app.routes.ts` — any new route with `data.access`.
- Either app's `app.config.ts` — any new `provideAppDefaultGateway` change.

## See also

- [[../01-roles/_INDEX]] — the 6 roles
- [[../02-statuses/_INDEX]] — every status enum
- [[../03-pes-keys/_INDEX]] — the 47 PES key factories
- [[../00-VERIFICATION-GATE]] — 10 questions the dataset must answer
