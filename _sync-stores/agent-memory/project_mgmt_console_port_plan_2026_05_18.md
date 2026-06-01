---
name: Management-Console Port Plan v1.0 (2026-05-18)
description: 17-wave brain-grounded specification for porting admin-console org-hierarchy + 5 sibling features to management-console with full acc-* role & status awareness. PDF deliverable + markdown source. PLAN-ONLY — no code applied.
type: project
originSessionId: e0ccc32c-1fe6-4de5-bc69-c411b230e7b6
---
# Management-Console Port Plan v1.0

**Date**: 2026-05-18
**Trigger**: User requested comprehensive PDF report + multi-wave night-shift plan to "copy admin to mgmt with validations, handle the 3 client user types, cover all scenarios"
**Status**: 🟡 PLAN DELIVERED · NO CODE APPLIED · awaits user approval before any wave execution

## Deliverables

- **PDF**: `C:\Falcon\Falcon Specs v1.0 - Management Console Port Plan.pdf` (~56 pages, 1.88 MB, PDF-1.4)
- **Source MD**: `C:\Falcon\Brain Outputs\reports\mgmt-console-port-plan-2026-05-18\REPORT.md`
- **Stylesheet**: `Brain Outputs/reports/mgmt-console-port-plan-2026-05-18/styles.css` + `md-to-pdf-config.js`
- **Generator**: `md-to-pdf` via npx (Python not available on this machine; pdf-creator's Chrome backend not used)

## Scope synthesized

5 parallel research agents (Adnan-routed) produced inputs across 4 dimensions:
1. **Mgmt-console current state**: 1 real feature only (`comms-hub`), default gateway `CoreGateway`, `provideFalconValidations()` MISSING from app.config
2. **Admin-console org-hierarchy-page (the donor)**: 6-slice state facade · 4 tabs · Add-Client wizard (Falcon-only) · Add-User wizard · Add/Edit-Node drawers · ~9 PES keys in `adminConsole.*` namespace
3. **3 acc-* role taxonomy**: acc-owner (full), acc-admin (org + users + contact-groups), acc-user (contact-groups only) — with **explicit deny lists** (acc-admin: 12 entries; acc-user: 20+ entries). Role-edit reach matrix asymmetric: acc-owner is terminal actor.
4. **5-status user FSM**: Pending(1) → Active(2) ↔ Suspended(3)/Locked(4)/Deleted(5), with HTTP 401/403/423 routing per FE contract
5. **Per-feature port recipes**: organization-hierarchy (★★★★), comms-hub (★★), marketplace-applications (★★), contact-groups (★★★★★ — direction reverses), wallet (★★★★ — drop Master Wallet + cross-account picker), contracts (★★★★ — view-only acc-owner only)

## What never ports (authority boundary — hard rule)

- **5-step Add Client wizard** (clients don't create clients)
- **Master Wallet card** + cross-account tree picker + wallet-strategy edit (Falcon-only)
- **Contract create/edit wizard** + DoPayment matrix authoring (Falcon-only)
- **testing-charging** feature entirely (mutates real OCS state — security boundary)
- **Synthetic FALCON_ROOT_NODE** virtual root
- **EditPriceType / EditPriceValue / Visibility** row actions on service tables (no acc.services.{edit-*, visibility} PES keys exist)

## 17 waves (dependency graph)

```
Wave 0 (Pre-flight) → 1 (PES + Routes) → 2 (OH Shell)
                                         ├─► 3 Add Node Drawer
                                         ├─► 4 Info Panel
                                         ├─► 5 Settings Tab
                                         ├─► 6 CommChannels Tab
                                         ├─► 7 Apps Tab
                                         ├─► 8 Add User Wizard
                                         ├─► 9 Users Table
                                         └─► 10 Edit Node Drawer
                                         11 Wallet ─┐
                                         12 Contracts ─┤
                                         13 Marketplace ─┤
                                         14 Contact Groups ─┤
                                                            └─► 15 Validation Harness → 16 Polish + Dark → 17 QA Gate
```

Waves 4-10 are parallel after Wave 2. Waves 11-14 are parallel after Wave 1. Critical path: 0→1→2→14→15→16→17.

## Key brain citations folded in

- `[BRAIN-OUT] 0-MASTER-INDEX.md` — routing
- `[BRAIN-OUT] VERIFICATION-STATUS.md` — backend PES gate 21/21 RUNTIME-VERIFIED PASS (2026-05-16); FE rendering still blocked on workspace Stencil/Angular compile errors
- `[BRAIN-OUT] 11-copy-playbook/copy-admin-feature-to-mgmt.md` — canonical 12-step recipe (file copy → selector rename → namespace flip → gateway flip → DTO enrichment → endpoint suffix → session id → drop Falcon-only → route+data.access → validation rewire → reseed PES → verify per-role)
- `[BRAIN-OUT] 04-feature-parity-matrix/MATRIX.md` — 7 features × Falcon-only/Falcon-mostly/Shared-with-config-flip/Shared-with-enrichment/Client-only classification
- `[BRAIN-OUT] 06-validation-by-feature/MATRIX.md` — 25 V-rules × 7 features cross-cut + 16 FE-tighter drift items to preserve
- `[BRAIN-OUT] 10-non-pes-gates-by-feature/MATRIX.md` — 6 gate types (session-type / node-type / mode / tab-visibility / server-driven row / composite); flip semantics on mgmt
- `[CODE] BuiltInRoleCatalog.cs:79-290` — 6 roles + PES rules; lines 220-240 / 258-280 enumerate acc-admin / acc-user EXPLICIT DENIES
- `[CODE] pes-account-role-rules.json` — tenant-scoped p-rules
- `[CODE] falcon-access.registry.ts:1-185` — 47 PES key factories
- 8 memory entries: Wave 17 commchannels, Wave 15 info-panel, Wave 14 settings tab, Wave 14b photo viewMode, Wave 15b city lookups, Phase E dark mode, Phase G toggle UI, Wave 7.15 plain-table wizard

## Gaps surfaced in plan (for Wave 1 ticket creation)

1. **`managementConsole.wallet.{view, transfer}`** PES keys MISSING from registry (Wave 11 either adds them or documents server-`canSave`-only decision)
2. **`managementConsole.organization.edit()`** existence to verify (Wave 10 dependency)
3. **`provideFalconValidations()`** absent from mgmt `app.config.ts` (Wave 15 wires it)
4. **`shellAccessGuard` not wired** on original contracts mgmt route despite `data.access` declared — security gap (Wave 12 closes)
5. **Cross-app relative imports** (`../../../../../admin-console/...`) on contracts — extract to shared lib (Wave 12)
6. **Sub-node name 30-char cap** sister rule referenced but not seeded (Wave 10 surface)
7. **`sharePolicy: null` hardcoded** bug in admin contact-group details onSave (Wave 14 fixes during port)

## Trigger phrases

- `read the mgmt-console port plan` / `falcon specs v1.0`
- `start wave X` (where X = 0..17 per plan §19)
- `what does wave N need from brain?` → §21 quick-reference table
- `who can land on feature F per the port plan?` → §5.2 landing verdict table
- `what's an explicit deny for acc-admin?` → §5.4 list (12 entries)

## Anti-patterns enforced

- No mechanical PES namespace flip without re-deriving composite gates (§16 + §10.4)
- No copying SCSS / PrimeNG / hardcoded English / `*ngIf` / silent error returns (§18.1)
- No exposing Move/Archive node actions (Q-AM-18 — both MISSING)
- No `?includeDeleted=true` on mgmt user-list (Falcon-only per PR #40937)
- No re-implementing FSM client-side — trust `row.allowedActions[]` (§16.1)
- No displaying error codes — display `errorMessages[0]` already localized (§17.2)

## Next step

User must approve PDF + plan before any wave begins. Wave 0 pre-flight runs first. Each wave atomic + reversible + verified against per-role capability tables.
