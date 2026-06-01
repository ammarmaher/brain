---
type: pending-question
fork-id: F-021 (Class A — Authority / New PES resource needed without existing rule)
task-id: wallet-balance-mgmt-reskin-2026-05-28
halted-at: 2026-05-28T04:50Z
night-shift-batch: night-shift-feature/wallet-2026-05-28
---

# Fork D-1 · Master Wallet card on Client (management-console) view

## Why halted

The T2 mockup at `http://127.0.0.1:5173/T2 Falcon Admin.html` (`Show as Client` view) shows the Master Wallet card with balance `1,500,000`. The Falcon authority dataset (`04-feature-parity-matrix/wallet-balance-management.compare.md`) and the PES registry (`falcon-access.registry.ts:36-88`) BOTH state that `sys.master-wallet` is **Falcon-only** — there is no `acc.master-wallet` resource and no `managementConsole.masterWallet.*` factory.

Adding Master Wallet for Client users would require either:
- (a) A new `acc.master-wallet` resource + role rule in `BuiltInRoleCatalog.cs` (BE seed change — forbidden by user policy "don't change BE"), OR
- (b) Server-driven exposure of master balance to acc-* users (architectural decision)

This is a **Class A (Authority)** fork that night-shift cannot self-resolve.

## Sources reviewed

- `[BRAIN-OUT] Brain Outputs/datasets/authority-dataset/04-feature-parity-matrix/wallet-balance-management.compare.md:40` — "Master Wallet card: ✅ Shown when canViewMasterWallet (resource sys.master-wallet); ❌ No equivalent — sys.master-wallet is Falcon-only"
- `[CODE] libs/falcon/src/shared-types/lib/constants/falcon-access.registry.ts:36-88` — managementConsole namespace has no wallet-related keys at all
- `[CODE] falcon-core-identity-svc/.../BuiltInRoleCatalog.cs:85-290` — confirmed no acc-* role has `sys.master-wallet.view` allow (none could)
- `[CODE] origin/main apps/admin-console/src/app/features/wallet-balance-management/wallet-balance-management.component.ts:876-884` — `primeAccess()` queries `FalconAccess.adminConsole.masterWallet.view()` — adminConsole namespace only
- T2 mockup scrape at `Brain Outputs/reports/web-scrub/2026-05-28-0443_t2-wallet-client-view/visible-text.txt:29-32` — "Aramco / Master Wallet / Master Wallet / 1.500.000" visible in Client view

## Plausible answers

### Option A — Follow parity matrix (omit Master Wallet from Client view) — **DEFAULT**

- **Consequences**:
  - Client view shows: Wallet Type segmented, Type SAR/Points, Switch perspective, data table, Transfer drawer
  - Client view does NOT show: Master Wallet card, Balance Type segmented, Edit button
  - Backend: zero change
  - PES seed: zero change
  - Effort: as planned (Wave 5)
- **Pros**: matches existing parity contract; no BE policy change; respects security boundary (clients don't see Falcon's master pool); no scope creep
- **Cons**: mockup deviates from final UI

### Option B — Follow mockup (include Master Wallet card on Client view)

- **Consequences**:
  - Requires new PES key: either `managementConsole.masterWallet.view` factory OR re-use `adminConsole.masterWallet.view` (violates namespace contract)
  - Requires BE seed update: add `acc.master-wallet.view` rule (or expose master balance via existing server-driven response) to `BuiltInRoleCatalog.cs` + reseed PES
  - Requires architectural review: does a client user have any business reason to see the master pool?
  - Effort: out of this night-shift's scope (`don't change BE`)
- **Pros**: matches mockup exactly
- **Cons**: violates user's "no BE changes" policy; expands scope to a backend ticket; potential security review needed (master balance visibility)

### Option C — Show a stub "Account Balance" card to clients (NOT the Master Wallet)

- **Consequences**:
  - FE-only — replaces the Master Wallet card with an "Account Balance" card showing the **client's own total balance** (sum of comm-channel + owner wallets from the existing hierarchy response)
  - Visually mirrors the mockup's card; semantically different
  - Backend: zero change (compute on FE from existing response)
  - PES seed: zero change
  - Effort: same as Option A + ~30 min FE compute
- **Pros**: preserves visual parity with mockup AND respects authority boundary; no BE changes
- **Cons**: minor — "Account Balance" is a different concept from "Master Wallet"; needs label coordination with mockup owner

## Recommended question for Ammar

**"For the Client (management-console) view, do you want:**
- **(A) No Master Wallet card** (follow parity matrix — safest, no BE change), **or**
- **(B) Include Master Wallet card** (matches mockup; requires BE seed change as a separate ticket — out of this run's scope), **or**
- **(C) Show an 'Account Balance' card** showing the client's own total (matches mockup visually; FE-only; no BE change)?"

## Blast radius

- **Until resolved**: Wave 5 (mgmt re-skin) is blocked
- **Not blocked**: Waves 2-4 (admin restore + admin re-skin) can proceed in parallel — admin view always shows Master Wallet per parity
- **Recommended default if unanswered for >24h**: Option A (omit per parity) — minimum risk

## DECISION-PROTOCOL classification

| Field | Value |
|---|---|
| Class | A — Authority (new resource needed without existing rule) |
| Fork ID | F-021 |
| Severity | HIGH (security-class — visibility of master pool to clients) |
| Confidence | LOW |
| Halt verdict | HALT-AND-FLAG per matrix `Security-class fork → Halt-and-flag at any confidence` |
