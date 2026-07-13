---
name: session-backup-wb-balance-transfer-drawer-conversion-challenge-p2-w3
description: Independent refute-pass on the mgmt new-wallet-balance drawer SCSS→Tailwind + native→Falcon conversion
metadata: 
  node_type: memory
  type: project
  agent: ammar-web-platform-ui
  date: 2026-06-02
  status: completed
  originSessionId: 7b4acaa0-9ab7-4eb5-9e91-7cb26c10ee95
---

## What Was Done
CHALLENGED (verify/refute) the mgmt `new-wallet-balance/components/wb-balance-transfer-drawer` conversion. Repo = `C:\Falcon\Falcon\falcon-web-platform-ui` (TWO Falcon segs). Verdict = PASS (100%, contingent on the 3 NEEDS_APPROVAL tokens being authored upstream — they are correctly used with existing-token fallbacks so nothing breaks meanwhile).

## Key Findings (evidence-based)
- FIELDS = all falcon-angular-* : dropdown ×4 (Source/Dest/SourceWallet/DestWallet), input-number (amount, ﷼ via app-wb-riyal-mark in slot=icon-left), textarea (desc), button ×3 (close/cancel/save), icon (search/times). ZERO native <button>/<input>/<select>/<textarea> (spec-asserted + my grep). ✅
- SHELL = structural-div-only : outer <div> (z container) + scrim <div> + <aside> panel + head/body/foot <div>s. NOT <falcon-angular-drawer> (GAP-FALCON-UI-CORE-DRAWER-DEFAULT-SLOT-001, documented + spec-checked). ✅
- transfer-rules.ts = behavior-equivalent to old computeds, function-by-function: masterOption/commchOptions/entityOptions/allOptions/destinationOptions/lockChannel/sourceMax/canSave/overBalance/buildPayload all identical branch-for-branch to admin (unconverted) drawer TS. CRUCIAL: `allocForRow` RESTORES the `userAllocs[k] || seedUserAlloc(...)` fallback (run-3 fix — a prior extraction dropped it and broke UserBased Save). Pure (no @angular import) → node-vitest testable. ✅
- standards-drawer.spec.ts = 16 tests PASS; full mgmt suite 272/272 green via `nx test management-console`. ✅
- NO static design values: every grep hit for px/rem/#hex/rgba/arbitrary-util is INSIDE HTML comments (header doc + section notes documenting the SoT seed values they avoided). Class attrs + bindings are 100% token-backed. The two inline lock/search <svg> width=13/stroke-width=1.6 = vector geometry (excluded, identical to golden ref). `[size]="14"/"11"` = SVG dim INPUT to app-wb-riyal-mark, not CSS. ✅
- Seed 12.5px label → `text-[length:var(--text-xs-half)]` (token=0.78125rem=12.5px, REAL in falcon-tailwind-tokens.css:166). Seed 11.5px hint → `--text-2xs-half` (0.71875rem, REAL :164). 13/14px paddings did NOT survive (→ p-3/px-5/pt-4 etc.). ✅

## proposedTokens (NEEDS_APPROVAL — used via var(proposed, existing-fallback), NOT invented/hardcoded)
- `--falcon-wb-drawer-width` (seed 380px) → fallback `--falcon-drawer-side-width-sm` (=320px, REAL). ⚠ Until authored, drawer renders 320px not 380px = 60px parity drift in unapproved state (documented).
- `--color-falcon-scrim` (seed rgba(0,0,0,.18)) → using `bg-falcon-neutral-950/20` (20% ≈ 18%, minor tone drift).
- `--shadow-falcon-drawer-edge` (seed -10px 0 30px rgba(0,0,0,.08)) → using existing `shadow-falcon-drawer` (different geometry).
All three confirmed ABSENT in libs/falcon-theme + libs/falcon-ui-tokens via grep. Fallbacks confirmed present. Did NOT edit theme/tokens libs.

## Minor parity note (value-identical, display delegated)
Old amount input showed thousands-sep WHILE typing (`amountDisplay()` toLocaleString on native input). Converted uses falcon-angular-input-number [ngModel]=amountNum() → in-progress display formatting now owned by the Falcon component. Parsed value + validation + payload byte-identical (parseAmount/amountNum). Acceptable native→Falcon delegation; flagged for the user's live check.

## Files (all absolute)
- HTML: apps/management-console/src/app/features/new-wallet-balance/components/wb-balance-transfer-drawer/wb-balance-transfer-drawer.component.html
- TS:   .../wb-balance-transfer-drawer.component.ts (NO styleUrl, SCSS deleted)
- RULES:.../transfer-rules.ts (pure)
- SPEC: apps/management-console/src/app/features/new-wallet-balance/__tests__/standards-drawer.spec.ts
- Baseline (unconverted): apps/admin-console/.../wb-balance-transfer-drawer/{*.html,*.ts,*.scss}
- Golden ref: apps/management-console/.../wallet-balance-management/components/balance-transfer/balance-transfer.component.html

## Context for Next Agent
PASS but the 3 token promotions are GATED upstream work (author in libs/falcon-theme / a wb component-token file) — until then the fallbacks slightly under-spec width(320 vs 380)/scrim(20% vs 18%)/shadow. NO COMMITS. branch polishing-v0.4. Live visual parity (single+multiple, node/user) = USER's test.
