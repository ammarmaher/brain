---
name: project_wallet_drawersource_deadbranch_fix_2026_06_06
description: "Wallet Balance-Transfer drawerSource() dead-branch fixed in both consoles — discriminate on WbRow-only `depth`, not the shared `kind`"
metadata: 
  node_type: memory
  type: project
  originSessionId: 1668d1e9-2980-4704-b8f5-21c9cb81e619
---

Wallet **Balance-Transfer drawer `drawerSource()` coercion** had a DEAD mapping branch in BOTH consoles (FE-only fix, 2026-06-06, claude). It discriminated a clicked `WbRow` from an already-shaped `WbDrawerSource` with `if ('kind' in d) return d as WbDrawerSource;` — but **`WbRow` ALSO declares `kind: 'org'|'user'`**, so a real row satisfied the guard and was returned AS-IS, making the explicit `WbRow→WbDrawerSource` mapping below it (incl. its `parentName ?? undefined` normalization) unreachable for real rows. Functionally harmless (a `WbRow` already exposes id/name/kind and has no isMaster/isCommch, so `resolveInitialSourceId` fell to `row.id`), but the mapping never ran.

**FIX** = discriminate on the **WbRow-only `depth`** key (`WbDrawerSource` has no `depth`): `if (!('depth' in d)) return d as WbDrawerSource;` → rows now flow through the mapping branch (fresh object, row-only fields like depth/isHeader/rail-meta dropped, parentName null→undefined); master/comm-channel cards (no `depth`) still pass through untouched.

Files:
- admin: `apps/admin-console/src/app/features/wallet-balance-management/services/wallet.service.ts` `drawerSource()` (~L408-422)
- mgmt: `apps/management-console/src/app/features/wallet-balance-management/wallet-balance-management.component.ts` `drawerSource()` (~L271-285)

**GOTCHA for future edits to this method:** both `transfer-source-resolution.spec.ts` files **MIRROR** `drawerSource()` AND **source-pin** the real code with `toMatch` regex guards (`expect(...).toMatch(/if \(!\('depth' in d\)\) return d as WbDrawerSource;/)`). Change the source → you MUST update the mirror fn + the regex guard + the assertions (the old specs asserted the buggy `toBe(row)` pass-through and documented the dead branch as a "residual gap"; now they assert `not.toBe(row)` + `toEqual` the mapped object). Tests kept at same count (in-place rewrite, no net-add) so baselines held exactly.

**VERIFIED**: `NX_DAEMON=false node node_modules/nx/dist/bin/nx.js test <proj> --skip-nx-cache` → mgmt **547/547**, admin **709/709** green. NO build, NO backend, NO commits. Branch polishing-v0.4.

Related [[reference_wallet_transfer_source_destination_matrix_2026_06_06]] · [[reference_wallet_client_transfer_gaps_plan_2026_06_06]].
