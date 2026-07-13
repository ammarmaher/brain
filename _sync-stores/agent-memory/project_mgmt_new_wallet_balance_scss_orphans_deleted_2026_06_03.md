---
name: project_mgmt_new_wallet_balance_scss_orphans_deleted_2026_06_03
description: "mgmt new-wallet-balance W4 SCSS removal — the 2 component .scss were already commented-out orphans; completion = DELETE them, NOT rewrite to wallet.tokens.css (which would break the feature's own specs)"
metadata: 
  node_type: memory
  type: project
  originSessionId: 00cc6404-2bdc-4143-a324-4404289dcee9
---

Completing the "remove .scss" migration for management-console `new-wallet-balance` (drawer + client-view) on branch polishing-v0.4 = **just DELETE the two `.component.scss` files**. Do NOT rewrite the templates to admin's `var(--falcon-wallet-*)` / wallet.tokens.css arbitrary-utility approach.

**Why (the trap):** The task brief assumed the 2 `.scss` were active style sources behind `styleUrls`, to be migrated onto `wallet.tokens.css` arbitrary utilities "mirroring admin". Reality on disk:
- Both `.scss` were **fully `//`-commented-out orphans** (literal hexes inside), and **`styleUrls` was already removed** from both `@Component` decorators → they contributed ZERO CSS to the running app. Deleting them is a guaranteed no-op for the rendered view.
- The templates were **already migrated** to the management feature's OWN standard: pure Tailwind + the SHARED `falcon-theme` semantic tokens (`bg-falcon-*`, `rounded-{pane,md,sm,full}`, `bg-falcon-rail-*`, `w-rail`, `var(--text-xs-half)`, `animate-scrim-in`/`animate-drawer-in`, `[z-index:var(--z-falcon-drawer-modal)]`), with `[style.gridTemplateColumns]` as the lone runtime-geometry escape. It does NOT use `wallet.tokens.css` `--falcon-wallet-*` at all.

**The management feature is a DIFFERENT, equally-valid migration than admin** — and it's enforced by its OWN executable contract (3 vitest specs in `apps/management-console/.../new-wallet-balance/__tests__/`):
- `standards.spec.ts` — `the feature tree contains ZERO .scss files` (`expect(scss).toEqual([])`) + `no component declares styleUrl/styleUrls/styles` (forbids inline `styles:` too) + RULE-1 no-static-design-values / RULE-4 falcon-angular-only / RULE-5 ng21 idioms.
- `standards-drawer.spec.ts` — `wb-balance-transfer-drawer.component.scss no longer exists` + `NO inline [style...]`.
- `standards-client-view.spec.ts` — same `.scss`-non-existence + no-styleUrl.

→ Mirroring **admin** (inline `@keyframes` in a `styles:[]` block, `ViewEncapsulation.None`, `var(--falcon-wallet-*)` arbitrary utilities) would **BREAK these specs** (they forbid `styles:`). So admin's approach is incompatible with mgmt's contract; the shared OUTCOME both want (zero `.scss`, fully token-bound Tailwind, view/behavior unchanged) is achieved by **deletion only**.

**Done 2026-06-03 (claude):** deleted both `.scss`; NO token changes, NO template edits. VERIFY GATE green: `npx nx build management-console --skip-nx-cache` EXIT 0 ("Successfully ran target build … and 6 tasks it depends on"); `npx nx lint management-console` exit 1 but **0 `new-wallet-balance` findings** (the exit 1 is pre-existing non-wallet debt — contact-groups label-has-associated-control etc. — left untouched); standards+behavior specs **455/455 pass** (standards-drawer 16 / standards 32 / standards-client-view 38 all green). NO COMMITS, working tree left dirty. Scratch logs at `C:\Falcon\_wb-verify\` (outside repo).

Related [[project_new_wallet_balance_scss_token_only_2026_06_02]] (the admin/shared W2 token-only SCSS, a DIFFERENT artifact) · [[project_new_wallet_balance_port_both_apps_2026_06_02]] · [[reference_fe_structure_standard_angular21_2026_06_02]].
