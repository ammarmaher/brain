---
name: ib-dialog-portal-to-body-2026-05-20
description: IB priority popup now portals to <body> + aligns z to canonical 1200 dialog tier
metadata: 
  node_type: memory
  type: project
  originSessionId: 2a1608f4-2265-431d-9277-5953725795b5
---

🟢 BUILD-PENDING 2026-05-20. `<falcon-angular-insufficient-balance-dialog>` (do-payment priority popup) was rendering inline → trapped in page stacking contexts; the table sticky header (z=2) painted over the backdrop. Fix in 3 files inside the Falcon library:

1. `libs/falcon-ui-core/src/angular-wrapper/components/falcon-insufficient-balance-dialog/falcon-insufficient-balance-dialog.component.ts` — added `[appendTo]: 'body' | 'host' = 'body'` + portal-to-body in `ngOnInit` + cleanup in `ngOnDestroy`. Same idiom as `<falcon-angular-menu [appendTo]="'body'">`.

2. `libs/falcon-ui-core/src/components/falcon-insufficient-balance-dialog-tw/falcon-insufficient-balance-dialog-tw.tsx` — swapped `z-falcon-modal` (legacy 1050) → `z-[var(--falcon-ib-dialog-backdrop-z)]` so the TW path reads the same token as the Shadow path.

3. `libs/falcon-ui-tokens/src/components/insufficient-balance-dialog.tokens.css` — bumped `--falcon-ib-dialog-backdrop-z: 1000 → 1200` to match the canonical dialog tier in `overlay.tokens.css`.

**Why:** `position: fixed` is escaped to the nearest `transform/filter/contain/will-change/opacity<1` ancestor. Inline-rendered dialogs get trapped; the sticky header (z=2 in its own context) wins. Portal-to-body removes the trap permanently.

**How to apply:** any future Falcon dialog should mirror this pattern — `[appendTo]` input defaulting to `'body'` + `portalToBody()` in `ngOnInit` + cleanup in `ngOnDestroy`. Do NOT bump z-index without portaling — the legacy `--z-falcon-drawer-modal: 99999` is the arms-race antipattern to avoid.

Related: [[zindex-calendar-portal-root-cause-fix]] [[falcon-ui-core-layout-traps]] [[falcon-revamp-v3-1-night-shift-results]]. Follow-up: same pattern should be applied to `<falcon-angular-dialog>`, `<falcon-angular-drawer>`, `<falcon-angular-confirm-dialog>`. The legacy `falcon-tailwind-tokens.css` z-* tokens (1000/1050/99999) should be retired in favour of the canonical ladder in `overlay.tokens.css`.
