# Task History — Wallet polish (buttons/hover/circle) + PRD/per-user-type permission deep-dive

- taskId: wallet-polish-and-prd-permissions-2026-05-30
- date: 2026-05-30
- status: COMPLETED (build-green all 3 apps; NOT runtime-verified [Docker down]; NO commits)
- branch: polishing-v0.4 (assumed)
- mode: autonomous / auto-pilot (no clarifying questions after the first 3 decisions)

## Requests handled (3 user messages)
1. Transfer + drawer-X buttons: cursor-pointer + hover bg=primary-700 + white text/icon; X = black X at rest; investigate + fix related (both consoles).
2. Node/User-Based toggle should differ per mode (screenshots); buttons too large -> medium + transfer & X same size.
3. Buttons = circle; extend hover to every button/dropdown; PRD/permissions deep-dive per user type -> table + plan -> APPLY; best practice; brain SK rules; autonomous.

## Applied (build-green)
- Transfer (master+row) + drawer X: circular (rounded-full), 24px (w-6 h-6) + 14px glyphs, cursor-pointer, hover bg-falcon-primary-700 + text-white; X resting text-falcon-neutral-900 (black). Both consoles.
- Expand chevron: hover bg-falcon-primary-700 + text-white + transition-all + cursor-pointer. Both consoles.
- mgmt wallet sidebar nav: added access: FalconAccess.managementConsole.wallet.view() (host-shell layout.component.ts) — hides from acc-user, matches mgmt-nav convention. Admin nav left userType-only (admin convention).
- Repaired interrupted-build corruption: regenerated falcon-ui-core Stencil dist; full rebuild host-shell+admin+mgmt = GREEN.

## Best-practice decisions (autonomous)
- Did NOT force teal hover on Falcon <falcon-angular-button>/<falcon-angular-dropdown> (respect design system; primary buttons already use primary; teal secondary/dropdown = anti-pattern). Only native icon buttons + chevron got it.
- Did NOT change correct code: the node/User toggle childrenOf is ALREADY mode-aware (matches screenshots) — 'always toggles' is likely a stale Docker bundle OR backend not nesting users; did not fabricate a fix.
- Did NOT apply unverifiable security/route changes blind (Docker down): admin route feature-guard + PER_PAIR_PES_ENABLED flip = flagged for runtime verification.

## PRD / per-user-type permission deep-dive (3 agents)
Full matrix + verdict persisted to memory: reference_wallet_balance_prd_permissions_per_user_type_2026_05_30.
VERDICT: wallet FE gating is ALREADY correct + FAIL-CLOSED in both consoles (no fail-open bug). Per-user-type enforced by PES (runtime-verified 21/21). SoT = BuiltInRoleCatalog.cs + seed + FE registry.
- ADMIN(sys.*): sys-admin+sys-products = all 4 (view-master/view+edit-strategy/transfer) ALLOW; sys-ops = DENY all; acc-* can't enter.
- MGMT(acc.wallet-balance): acc-owner=view+transfer(all owner dirs); acc-admin=view+transfer(owner->owner node-scoped ONLY); acc-user=DENY.
- Transfer dirs = BR-AM-30..34. Config Balance/Wallet Type = Falcon-only (BR-AM-25).

## Flagged for runtime (Docker up) follow-up
- admin wallet route: add shellAccessGuard + data.access=walletStrategy.view() (sys-ops -> redirect vs empty page).
- mgmt balance-transfer.component.ts:138 PER_PAIR_PES_ENABLED=false: flip after confirming PES g-link subjects carry path attr.
- node/User toggle + all hover/size/circle visuals: browser smoke-test on a fresh build.
- PRD gaps Q-AM-01 (reconfig), Q-AM-07 (transfer-limit baseline), Q-AM-10 (per-cell flows) -> product.

## Builds this session (all exit 0): bx5yriy3k, btgzpwwxf (admin+mgmt) ; bunv8pjx0 FAILED exit 130 (interrupted mid Stencil-dist regen) ; bdm7yct2o GREEN (falcon-ui-core regen + host-shell+admin+mgmt).
## NO commits. Files: admin+mgmt wallet html (buttons/icons/hover/size/circle), host-shell layout.component.ts (nav gate). Memory: reference_wallet_balance_prd_permissions_per_user_type_2026_05_30 + project_wallet_balance_mgmt_tailwind_falcon_revamp_2026_05_30.
