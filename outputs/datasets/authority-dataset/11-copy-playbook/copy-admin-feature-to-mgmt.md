---
type: playbook
cluster: 11-copy-playbook
title: Copy a Feature from admin-console → management-console
purpose: "Answers 'what are the 12 steps to port a Shared-with-config-flip feature from admin to mgmt + how to handle each class (Falcon-only, Falcon-mostly, Client-only)'. Open before starting any cross-console port."
based-on: 04-feature-parity-matrix MATRIX (11-step recipe extended to 12)
extracted: 2026-05-16
---

# Playbook · Copy a Feature from admin-console → management-console

> [!tldr]
> 12-step recipe for porting a Falcon feature across consoles. Each step has a "what changes" line + a citation to the feature compare note where the pattern was observed. Read [`_INDEX.md`](_INDEX.md) first to confirm your feature is in the "Shared with config-flip" class — if not, follow the cherry-pick guidance there.

## When does this recipe apply?

Run the full 12-step recipe **only** for features classified `Shared with config-flip` in [`../04-feature-parity-matrix/MATRIX.md`](../04-feature-parity-matrix/MATRIX.md).

| Class | What to do |
|---|---|
| **Shared with config-flip** (`marketplace-applications`) | Run all 12 steps. |
| **Shared with Client enrichment** (`comms-hub`) | Run all 12 + extra DTO work (Step 5) + child-route stubs. |
| **Falcon-mostly** (`wallet-balance-management`, `contracts-cost-management`) | Run Steps 1-7 + 9-12; **drop** Falcon-only sub-features in Step 8 (Master Wallet card, wallet-strategy edit, Contract wizard, etc.). Document the dropped surfaces as intentional. |
| **Falcon-only** (`testing-charging`, Add Client wizard) | STOP. Feature is not portable. See the security/authority discussion in [`../04-feature-parity-matrix/MATRIX.md`](../04-feature-parity-matrix/MATRIX.md). |
| **Client-only authoring** (`contact-groups` create/edit/share) | Direction reverses — admin-side is the subset. Treat mgmt as the source. The 12-step recipe still applies in reverse (mgmt → admin = strip, admin → mgmt = ADD wizard). |

## The 12-step recipe

### Step 1 — Copy the file tree

Copy from `apps/admin-console/src/app/features/<feature>/` to `apps/management-console/src/app/features/<feature>/` (paths vary by feature placement — some live under `app/features/account-administration/<feature>/` on the mgmt side; verify with the compare note).

What carries over verbatim:
- The primary component class (e.g. `CommsHubComponent` / `MarketplaceApplicationsComponent` keep their class names — `[CODE] marketplace-applications.compare.md:106` confirms "Swap admin-console route to management-console route slug (same)").
- All `<ng-template>` cell/editor renderers + insufficient-balance dialogs.
- Tree-panel imports (the shared `<falcon-organization-hierarchy-tree>` — still used, but mounted differently per Step 7).

What does NOT carry over (drop or rewrite in later steps):
- SCSS files — Falcon UI runs Tailwind utilities only (memory `feedback_no_inline_styles_tokens_only.md` + `project_falcon_primeng_total_removal_complete`).
- PrimeNG components / PrimeIcons strings — removed platform-wide.
- Any `@Input` decorator wiring that depends on admin-only parent components.

### Step 2 — Rename Angular selectors

If the admin-side component uses an `admin-` or `app-admin-` selector prefix, flip to mgmt prefix (or drop the prefix if the component is now host-shell-shared).

Observed in: `[CODE] marketplace-applications.compare.md:160` — "If they use `admin-` / `app-admin-` prefix" — search for `selector: 'admin-` and `selector: 'app-admin-` in the copied tree, replace with `selector: 'app-` or scope as needed.

### Step 3 — Namespace flip

See [`namespace-flip.checklist.md`](namespace-flip.checklist.md) for the full search/replace + the keys with NO mgmt counterpart.

Headline: `FalconAccess.adminConsole.X` → `FalconAccess.managementConsole.X`. Some keys (`wallet.transfer`, `walletStrategy.*`, `masterWallet.view`, `account.add`, `rootPasswordSecurityLevel.*`, `rootAllowedIps.*`, `accountPasswordSecurityLevel.edit`) have NO mgmt counterpart — drop the call or replace with row-level checks.

`[CODE] wallet-balance-management.compare.md:152` — "Replace all `canViewWalletStrategy / canEditWalletStrategy / canTransferWallet` references with constant `true`" (or row-level / server-driven hints).

### Step 4 — Gateway flip

See [`gateway-flip.checklist.md`](gateway-flip.checklist.md) for the full pattern.

Headline: the mgmt-console `app.config.ts` already provides `Gateway.CoreGateway` as the default via `provideAppDefaultGateway(Gateway.CoreGateway)`. Most explicit `useGateway(Gateway.SystemGateway)` calls in copied services just need to **drop the override** — the default takes over.

Exceptions (preserve as explicit overrides):
- `useGateway(Gateway.ChargingGateway)` on wallet-transfer in mgmt — `[CODE] wallet-balance-management.compare.md:154` quotes the override location.
- `useGateway(Gateway.IdentityGateway)` calls — Identity is gateway-agnostic, these stay.

### Step 5 — DTO enrichment

See [`dto-divergence.catalog.md`](dto-divergence.catalog.md) for per-feature additions.

Mgmt-side DTOs typically enrich with **UI hint fields** for card-view rendering:
- `comms-hub` — `CommChannelServiceItem` gains `subtitle`, `description`, `iconClass`, `iconSvg`, `iconUrl`, `pricePeriod`, `currency`, `showDates`, `showPrice`. `[CODE] comms-hub.compare.md:41`.
- `marketplace-applications` — `MarketplaceApplicationItem` gains the same UI-hint suite. `[CODE] marketplace-applications.compare.md:95`.
- `contact-groups` — mgmt-only DTOs include `ContactGroupDetailDto`, `ContactGroupContactItem`, plus the entire upload-pipeline DTO family. `[CODE] contact-groups.compare.md:140`.

`[INFERRED]` The split is intentional: admin-side gets raw data tables; mgmt-side renders cards / list-view toggles with rich visuals. Don't reverse-merge the UI hints back to admin DTOs.

### Step 6 — Endpoint suffix

See [`endpoint-suffix.catalog.md`](endpoint-suffix.catalog.md) for the catalogue.

Mgmt-side list endpoints often append `/visible` or `/visible/details`:
- `comms-hub` admin: `GET commerce/Node/{nodeId}/comm-channels` → mgmt: `GET commerce/Node/{nodeId}/comm-channels/visible/details`. `[CODE] comms-hub.compare.md:114`.
- `marketplace-applications` list endpoint URL stays identical — only the gateway differs. `[CODE] marketplace-applications.compare.md:89`.

The semantics:
- `/visible` filters by visibility status = Show (hides services the admin marked Hidden).
- `/details` adds payment / priority / pending-change metadata.

When in doubt: mirror admin first, then check `[BRAIN-OUT] old-ui-dataset/10-pages/management-console/_diffs/<feature>.diff.md` for the actual suffix used; don't speculatively add suffixes.

### Step 7 — Session-based account id

See [`session-binding.checklist.md`](session-binding.checklist.md) for the pattern.

Mgmt-side account id comes from session, NOT from a tree-picker:

```typescript
const accountId = session.tenantId || session.client_id;
```

`[CODE] comms-hub.compare.md:108` — "Both components resolve `accountId` from session as `session.tenantId || session.client_id`."

`[CODE] marketplace-applications.compare.md:39` — "Mgmt-console: tenant root from session (`session.tenantId ‖ session.client_id`)".

`[CODE] wallet-balance-management.compare.md:38` — "Hardcoded to `session.tenantId || session.client_id` — Client user can only configure own account".

Admin pattern (for contrast): tree-selection drives the id. `[CODE] wallet-balance-management.compare.md:43` — "Selected tree node ID".

### Step 8 — Remove Falcon-only sub-features

Catalog of sub-features that exist on admin but have no acc-* equivalent — drop them entirely on the mgmt port:

| Sub-feature | Owning admin feature | Why dropped on mgmt | Citation |
|---|---|---|---|
| Master Wallet card + transfer click | `wallet-balance-management` | `sys.master-wallet` resource has no `acc.master-wallet` counterpart | `[CODE] wallet-balance-management.compare.md:151` |
| Cross-account tree picker | `wallet-balance-management`, `marketplace-applications`, `comms-hub` | Client user has one tenant; nothing to pick | `[CODE] wallet-balance-management.compare.md:150` + `marketplace-applications.compare.md:109` |
| `FALCON_ROOT_NODE` synthetic root | All tree-using features | No synthetic Falcon root on mgmt tree | `[CODE] marketplace-applications.compare.md:39` |
| 5-step Add Client wizard | `organization-hierarchy` | Clients don't create clients (authority asymmetry) | `[BRAIN-OUT] ../04-feature-parity-matrix/MATRIX.md:67-71` |
| Contract Add wizard + Edit flow | `contracts-cost-management` | Mgmt is view-only — `canEdit: false` hardcoded | `[CODE] contracts-cost-management.compare.md:38, 64` |
| `EditPriceType` / `EditPriceValue` / `Visibility` row actions | `comms-hub`, `marketplace-applications` | No `acc.services.{edit-price-type, edit-price-value, visibility}` PES keys exist | `[CODE] comms-hub.compare.md:159` |
| `testing-charging` entire feature | n/a | Security boundary — mutates real OCS state | `[BRAIN-OUT] ../04-feature-parity-matrix/MATRIX.md:24` |

Drop the corresponding `*ngIf` blocks, handler methods, and any imports they pull in.

### Step 9 — Add route to `app.routes.ts` with `data.access`

Mgmt routes set the per-route PES gate via `data.access`:

```typescript
{
  path: 'comm-mgmt',
  component: CommsHubComponent,
  canActivate: [shellAccessGuard],
  data: { access: FalconAccess.managementConsole.services.view() },
}
```

`[CODE] comms-hub.compare.md:149` — "Add `data.access: FalconAccess.managementConsole.services.view()` to the route definition."

`[CODE] marketplace-applications.compare.md:36` — "PES gate at route: `FalconAccess.managementConsole.services.view()`".

Conventions to honour:
- **Mgmt uses synchronous `component:` ref**, NOT `loadComponent` lazy import. `[CODE] marketplace-applications.compare.md:76`.
- For features with child stub routes (`comms-hub` has 3: `whatsapp-business`, `voice-service`, `ai`), declare the parent + 3 children that redirect to `/not-found`. `[CODE] comms-hub.compare.md:101`.

⚠️ **Watch out for**: declaring `data.access` without wiring `canActivate: [shellAccessGuard]`. `[CODE] contracts-cost-management.compare.md:80` shows the gap — `data.access` declared but no `shellAccessGuard` consumer = the guard is informational only, NOT enforced.

### Step 10 — Rewire validation (NEW STEP — covers Phase 2 V-rule learnings)

Most form-level validators carry over verbatim (max-length, required, regex, enum). But:

1. **Cross-field rules tied to admin-only state must be reviewed.** Examples:
   - Visibility ↔ Pricing conditional validators (V-service-visibility-pricing-required) — mgmt-side typically can't edit visibility, so the conditional collapses to "read-only" not "validators on/off".
   - `walletStrategy === null` soft-gate on Contract create — drop if the mgmt-side has no Contract create flow.
   - `MaxNormalUserLimit` quota pre-flight badge — keep, but verify the count endpoint is available via Core Gateway.

2. **Non-PES gates need re-derivation** (per [`../10-non-pes-gates-by-feature/MATRIX.md`](../10-non-pes-gates-by-feature/MATRIX.md) §6):
   - **Session-type gates flip semantics.** `if (!isFalconUser) return;` is a no-op on admin and a blanket-deny on mgmt. Drop or flip the literal.
   - **Node-type gates may not exist.** `isFalconNode === true` is never true on mgmt — `if (isFalconNode) return early` becomes dead code.
   - **Tab-visibility composites need new conditions.** `enabled: !isFalcon && isMain` collapses to `enabled: isMain` (no synthetic root to exclude).
   - **Composite gates (`PES × node-type`) must be re-derived from the BR rule**, not literally copied.
   - **Server-driven row gates (`row.allowedActions`)** generally work as-is — the backend computes per-session. Verify gateway forwards JWT downstream correctly.

3. **Validation drift items to flag** (per [`../06-validation-by-feature/MATRIX.md`](../06-validation-by-feature/MATRIX.md) §4):
   - FE enforces `Username maxLength(30)` even though backend allows 100 — preserve on port.
   - `PasswordSecurityLevel` vocabulary drift — display PRD labels, submit backend codes.
   - `AccountName` letter-prefix regex is FE-only — preserve.
   - `HiddenProductMustNotHavePricing` defensive clear — preserve.
   - Contact-group share-mode mutex — preserve the FE-side mutex that prevents silent drop.

`[INFERRED]` The biggest porting risk is silently breaking a cross-field validator because the admin-side variable (`isFalconUser`, `isFalconNode`, `selectedNode().data.someFlag`) no longer exists on mgmt. Re-read the validator factories in `validations/validations.ts` for each form section.

### Step 11 — Reseed PES (if new `acc.*` resources introduced)

If the port introduces a new `acc.<resource>.<action>` PES key (rare — most are already seeded), update three files:

1. `falcon-core-identity-svc/.../BuiltInRoleCatalog.cs` — add the `BuiltInPolicyRuleDefinition` for each role's verdict (allow / deny / expression).
2. `falcon-essentials/zitadel/pes-account-role-rules.json` — add the tenant-scoped `p`-rule seed.
3. `falcon-essentials/zitadel/seed-test-users.sh` — verify the test-user PES link still works for the new resource.

After editing, restart Identity to pick up the catalog changes. `[BRAIN-OUT] ../04-feature-parity-matrix/MATRIX.md:113` flags this as the "Reseed PES" step.

Then verify with the per-role capability tables at `../05-capability-maps/<role>.capability.md`.

### Step 12 — Verify against the per-role capability table

Final validation step. Open `../05-capability-maps/<role>.capability.md` for each `acc-*` role and confirm:

1. **Landing**: role can / cannot hit the route per the table.
2. **Visible actions**: row-menu / buttons / tabs match the per-role grid.
3. **Backend rejections**: where PES says allow but `row.allowedActions` says no, action is hidden — verify with a real user click.

Use the master per-role table at `[BRAIN-OUT] ../04-feature-parity-matrix/MATRIX.md:88-96`:

| Feature | acc-owner | acc-admin | acc-user |
|---|---|---|---|
| organization-hierarchy | ✅ | ✅ | ❌ |
| comms-hub | ✅ | ❌ | ❌ |
| marketplace-applications | ✅ | ❌ | ❌ |
| contact-groups | ✅ | ✅ | ✅ |
| wallet-balance-management | ✅ | ❌ | ❌ |
| contracts-cost-management | ✅ | ❌ | ❌ |

Confirm each cell by logging in as the corresponding `acc-*` test user (per memory `project_local_backend_test_users_2026_05_16.md` — all 6 test users, password `Admin@1234`).

## Worked example 1: porting `comms-hub`

Full 12-step walkthrough citing `[CODE] comms-hub.compare.md`.

| Step | What changes | Citation |
|---|---|---|
| 1. Copy file tree | `apps/admin-console/.../features/comms-hub/` → `apps/management-console/.../comm-mgmt/` (folder name internal; path slug = `comm-mgmt`) | `[CODE] comms-hub.compare.md:103` |
| 2. Selector rename | `CommsHubComponent` keeps its name — no `admin-` prefix in this feature | `[CODE] comms-hub.compare.md:106` |
| 3. Namespace flip | Drop the `primeAccess()` block entirely (4 `resolveFlags` calls on `sys.services.{payment, edit-price-type, edit-price-value, visibility}`) — mgmt-side relies on route gate + backend `row.allowedActions` only | `[CODE] comms-hub.compare.md:150` |
| 4. Gateway flip | Default gateway picked up from `provideAppDefaultGateway(Gateway.CoreGateway)` in mgmt `app.config.ts` — no per-call override needed for this feature | `[CODE] comms-hub.compare.md:151` |
| 5. DTO enrichment | Extend `CommChannelServiceItem` with `subtitle`, `description`, `iconClass`, `iconSvg`, `iconUrl`, `pricePeriod`, `currency`, `showDates`, `showPrice`. Change unknown `pricingType` default from `PricingType.Monthly` → `'--'` placeholder. | `[CODE] comms-hub.compare.md:153-154` |
| 6. Endpoint suffix | Flip list URL `commerce/Node/{nodeId}/comm-channels` → `commerce/Node/{nodeId}/comm-channels/visible/details` | `[CODE] comms-hub.compare.md:152` |
| 7. Session id | Both sides already use `session.tenantId \|\| session.client_id` for account id — no change | `[CODE] comms-hub.compare.md:108` |
| 8. Drop Falcon-only | Drop `EditPriceType` / `EditPriceValue` / `Visibility` row actions (no `acc.services.edit-*` or `acc.services.visibility` exist) | `[CODE] comms-hub.compare.md:159` |
| 9. Route + data.access | Declare parent `comm-mgmt` with `component: CommsHubComponent`, `canActivate: [shellAccessGuard]`, `data.access: FalconAccess.managementConsole.services.view()` + 3 stub children (`whatsapp-business`, `voice-service`, `ai` → redirect `/not-found`) | `[CODE] comms-hub.compare.md:147-149, 155` |
| 10. Validation rewire | No cross-field state changes — feature is read-only on mgmt | `[INFERRED]` |
| 11. Reseed PES | No new `acc.*` resources — `acc.services.{view, payment, disable}` already seeded | `[CODE] comms-hub.compare.md:92-93` |
| 12. Verify per-role | acc-owner = ✅ payment + disable; acc-admin = explicit deny on `acc.services.{view, payment, disable}` so page returns empty; acc-user = silent deny (no rule) | `[CODE] comms-hub.compare.md:53` |

## Worked example 2: porting `marketplace-applications`

Same shape as comms-hub, lighter walkthrough.

| Step | What changes |
|---|---|
| 1. Copy file tree | `apps/admin-console/.../marketplace-applications/` → `apps/management-console/.../marketplace-applications/`. `[CODE] marketplace-applications.compare.md:106`. |
| 2-3. Selector + namespace | Drop the 4-key `resolveFlags({...})` on `sys.services.*`. Route-level `data.access` only. `[CODE] marketplace-applications.compare.md:107`. |
| 4. Gateway flip | `Gateway.SystemGateway` → `Gateway.CoreGateway` (default). `[CODE] marketplace-applications.compare.md:108`. |
| 5. DTO enrichment | Replace lean `AppServiceItem` with `MarketplaceApplicationItem` — adds `subtitle`, `description`, `iconClass`, `iconSvg`, `iconUrl`, `pricePeriod`, `currency`, `showDates`, `showPrice`. `[CODE] marketplace-applications.compare.md:110`. |
| 6. Endpoint suffix | List endpoint URL is identical (`commerce/Node/{nodeId}/applications`); only the gateway differs. `[CODE] marketplace-applications.compare.md:89`. |
| 7. Session id | Drop `OrgHierarchyApiService.getRootNodes()` + `FALCON_ROOT_NODE` virtual root; substitute `session.tenantId ‖ session.client_id`. `[CODE] marketplace-applications.compare.md:109`. |
| 8. Drop Falcon-only | Drop `EditPriceType` / `EditPriceValue` / `Visibility` row actions + tree picker. Add card / list view-mode toggle persisted in `localStorage` (`marketplaceAppsViewMode`). `[CODE] marketplace-applications.compare.md:111`. |
| 9. Route + data.access | `component: MarketplaceApplicationsComponent` (sync), `data.access: FalconAccess.managementConsole.services.view()`. `[CODE] marketplace-applications.compare.md:36`. |
| 10. Validation rewire | None — read-only / payment-only. |
| 11. Reseed PES | No new resources. `acc.services.{view, payment, disable}` already cover. |
| 12. Verify per-role | Same matrix as comms-hub (mirror feature). `[CODE] marketplace-applications.compare.md:46-52`. |

## Edge cases

### Feature has Falcon-only sub-feature (cherry-pick)

Example: `wallet-balance-management` — keep view + transfer; drop Master Wallet card + cross-account picker + wallet-strategy edit.

`[CODE] wallet-balance-management.compare.md:150-158` enumerates the 8 concrete edits. Notable additions to the standard recipe:
- Drop tree picker → use `initializeAccountContext()` reading session.
- Drop Master Wallet card → `sys.master-wallet` has no `acc.master-wallet` counterpart, the entire `*ngIf="canViewMasterWallet"` block goes.
- Add explicit `useGateway(Gateway.ChargingGateway)` override on transfer (one of the only places mgmt overrides default).
- Fix account-id resolution for save — main account id, never a child node — copy `resolveSelectedAccountId()` helper.

Document the dropped surfaces as **intentional gaps** so future maintainers know to leave them out (or to add `acc.*` keys if the asymmetry should close).

### Feature uses backend-stamped `row.allowedActions` (pattern preserves automatically)

Examples: `comms-hub`, `marketplace-applications`, `organization-hierarchy` apps-services / comm-channels tabs.

Per `[BRAIN-OUT] ../10-non-pes-gates-by-feature/MATRIX.md` §6.4:

> Server-driven row gates SHOULD work as-is — the backend computes `row.allowedActions` based on PES + FSM + eligibility, all session-aware. So the same endpoint called from mgmt-console returns mgmt-appropriate actions. **No frontend change needed** if the endpoint correctly propagates session context.

Step 4 (gateway flip) is a no-op for this part of the feature. Verify by checking the JWT is forwarded downstream from Core Gateway.

### Feature has nested children (`comms-hub`)

`comms-hub` on mgmt-side adds 3 placeholder child slugs (`whatsapp-business`, `voice-service`, `ai`) that all redirect to `/not-found`. Plus 3 stub component files under `components/` even though the routes redirect away (`[CODE] comms-hub.compare.md:155`).

When porting comms-hub-like features:
- Expand the flat route to parent + N children.
- Create the stub component files (single-file with just a class signature + `template: '<router-outlet />'` if needed).
- Wire children routes to redirect `/not-found` until full implementations land.

## Anti-patterns

Things NOT to copy when porting:

| Anti-pattern | Why | Citation |
|---|---|---|
| SCSS files / `*.component.scss` | Tailwind utilities only — no SCSS, no component CSS | memory `project_falcon_primeng_total_removal_complete.md` |
| PrimeNG components / PrimeIcons strings | Platform-wide removal complete | memory `project_falcon_primeng_total_removal_complete.md` |
| `@Input()` decorators relying on admin-only parent context | Mgmt has no equivalent parent for many surfaces | `[INFERRED]` from `wallet-balance-management.compare.md:150` (drop tree-picker inputs) |
| `*ngIf` | Use Angular 17+ control-flow `@if` per zoneless + Angular 21 doctrine | memory `project_falcon_revamp_v3_1_night_shift_results.md` |
| Hard-coded English strings | Multi-language `MultiLanguageName(En, Ar)` per platform standards | `C:\Falcon\CLAUDE.md` Platform Standards |
| `alert()` calls | Replace with toast / dialog per Falcon UX | `[INFERRED]` |
| Silent `return of([])` on error | Surfaces empty state without context; replace with backend-error toast + ops breadcrumb | `[BRAIN-OUT] ../06-validation-by-feature/MATRIX.md:215` ("Show user-friendly 'Service not configured' message + ops-facing breadcrumb") |
| Cross-app relative imports (`../../../../../admin-console/...`) | Architecturally fragile; lift to a shared library | `[CODE] contracts-cost-management.compare.md:42` |
| In-component `AccessControlFacade.resolveFlags(...)` blocks copied from admin-side | Mgmt usually relies on route-level `data.access` + backend `row.allowedActions` | `[CODE] comms-hub.compare.md:38, 95` |
| `provideAppDefaultGateway(Gateway.SystemGateway)` | Mgmt app already provides `Gateway.CoreGateway` — copying this breaks all calls | `[CODE] marketplace-applications.compare.md:108` |
| Reading admin-only PES keys (`adminConsole.masterWallet.view`, `adminConsole.wallet.transfer`) | Keys don't exist in mgmt namespace; build fails | `[CODE] wallet-balance-management.compare.md:151-152` |

## Cross-references

- [`_INDEX.md`](_INDEX.md) — cluster entry
- [`namespace-flip.checklist.md`](namespace-flip.checklist.md) — Step 3 detail
- [`gateway-flip.checklist.md`](gateway-flip.checklist.md) — Step 4 detail
- [`dto-divergence.catalog.md`](dto-divergence.catalog.md) — Step 5 detail
- [`endpoint-suffix.catalog.md`](endpoint-suffix.catalog.md) — Step 6 detail
- [`session-binding.checklist.md`](session-binding.checklist.md) — Step 7 detail
- [`../04-feature-parity-matrix/MATRIX.md`](../04-feature-parity-matrix/MATRIX.md) — class determination
- [`../05-capability-maps/`](../05-capability-maps/) — per-role verification tables (Step 12)
- [`../06-validation-by-feature/MATRIX.md`](../06-validation-by-feature/MATRIX.md) — Step 10 validation drift items
- [`../08-entity-drift-by-feature/MATRIX.md`](../08-entity-drift-by-feature/MATRIX.md) — Step 5 DTO context
- [`../10-non-pes-gates-by-feature/MATRIX.md`](../10-non-pes-gates-by-feature/MATRIX.md) — Step 10 non-PES gate re-derivation
- [`../00-VERIFICATION-GATE.md`](../00-VERIFICATION-GATE.md) — 10 verification questions for the completed port
