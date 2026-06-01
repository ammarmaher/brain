---
name: z-index-unified-ladder-2026-05-20-rev3
description: "2026-05-20 rev 3 unified z-index ladder — drawer + popup-dialog = 99999, body-portaled popovers = 100000, right-side notification toast = 100001. Supersedes the morning z=2000/1000 fix that broke the drawer."
metadata: 
  node_type: memory
  type: project
  originSessionId: 3a68266e-8791-48b6-8301-276a13d1e745
---

🟢 BUILD-GREEN 2026-05-20 rev 3 (`nx build falcon-ui-tokens` PASS / `nx build falcon-theme` PASS / `nx build falcon-ui-core` PASS 45.19s / `nx test host-shell --testFile=tests/falcon-notification-stack-position.spec.ts` PASS 7/7).

## What broke and why

This morning's fix ([[double-toast-root-cause-z-index-2000-1000-fix]]) dropped `--z-falcon-drawer-modal` from 99999 → 1000 to keep toasts above the drawer. Mid-day someone hand-patched it to 99995 and bumped the notification stack to `z-[99998]` — the gap was only 3 z-values and the two ladders (Tailwind utility tier in `falcon-tailwind-tokens.css` vs. Stencil-component tier in `libs/falcon-ui-tokens/src/components/*.tokens.css`) had drifted into inconsistent states (drawer-modal=99995 in one, drawer-token=1200 in the other; toast hard-coded 99998 in one, toast-host-token=1300 in the other).

User reported: "drawer is not shown at the top Z index. It shows me just the X". With drawer at 99995 and overlay container at 1400, the Stencil `<falcon-angular-input>` inside the drawer (and every other body-portaled popover the input field opens) rendered behind the drawer's white panel — visible only via the kebab/X button's own stacking layer. Two parallel ladders disagreeing meant any consumer reading the "wrong" SoT got the wrong tier.

## User direction (2026-05-20 rev 3)

> "drawer returns the index for 99999"
> "notification on the right side pop-up have greater than drawers"
> "pop-up notification that has the same level of drawers"

Locked as three rules:
1. **Drawer = 99999** (back to original)
2. **Right-side notification toast > drawer** (strictly greater)
3. **Popup-dialog == drawer** (centered modals/dialogs share the drawer tier)

## Unified ladder (SoT — both Tailwind + Stencil now agree)

| Tier | Surface | z-index | Token |
|---|---|---|---|
| 1 | base UI / sticky / menu / tooltip | <1100 | `--z-falcon-*` (unchanged) |
| 2 | menu panel + tooltip | 1100 | `--falcon-menu-panel-z-index`, `--falcon-tooltip-z-index` (unchanged) |
| 3 | **drawer + popup-dialog** | **99999** | `--z-falcon-drawer-modal`, `--falcon-drawer-z-index`, `--falcon-dialog-z-index`, `--falcon-ib-dialog-backdrop-z` |
| 4 | body-portaled popovers (date picker, dropdown, multi-select) | 100000 | `--falcon-overlay-z-index` |
| 5 | **right-side notification toast** | **100001** | hard-coded `z-[100001]` in `falcon-notification-stack.component.ts` + `--falcon-toast-host-z-index` (token sync) |

Loader overlay stays at 2000 (legacy global blocker, below drawer) — user did not direct otherwise, halt-and-flag noted.

## Files changed (10 files, +47/-22)

| # | File | Change |
|---|---|---|
| 1 | [CODE] `libs/falcon-theme/src/falcon-tailwind-tokens.css:426` | `--z-falcon-drawer-modal: 99995 → 99999` + refreshed comment block |
| 2 | [CODE] `libs/falcon-theme/src/tokens.ts:553` | mirror update `99995 → 99999` |
| 3 | [CODE] `libs/falcon-ui-core/src/angular-wrapper/components/falcon-notification/falcon-notification-stack.component.ts:34-42` | `z-[99998] → z-[100001]` + refreshed ladder comment |
| 4 | [CODE] `apps/host-shell/tests/falcon-notification-stack-position.spec.ts:44,50` | test expectation `z-[2000] → z-[100001]` |
| 5 | [CODE] `libs/falcon-ui-tokens/src/components/overlay.tokens.css:7-22,25,37` | `--falcon-overlay-z-index: 1400 → 100000` + rewritten ladder docstring |
| 6 | [CODE] `libs/falcon-ui-tokens/src/components/drawer.tokens.css:97-99` | `--falcon-drawer-z-index: 1200 → 99999` |
| 7 | [CODE] `libs/falcon-ui-tokens/src/components/dialog.tokens.css:158-159` | `--falcon-dialog-z-index: 1200 → 99999` |
| 8 | [CODE] `libs/falcon-ui-tokens/src/components/toast.tokens.css:104-108` | `--falcon-toast-host-z-index: 1300 → 100001` |
| 9 | [CODE] `libs/falcon-ui-tokens/src/components/insufficient-balance-dialog.tokens.css:25-41` | `--falcon-ib-dialog-backdrop-z: 1200 → 99999` + rewritten ladder docstring |
| 10 | [CODE] `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-node-drawer/falcon-org-node-drawer.component.html:6-10` | refreshed stale comment, no behavior change (already on token) |

## Downstream consumers (auto-correct via tokens)

- `libs/falcon-ui-core/src/components/falcon-dialog/falcon-dialog.css:24,57` reads `--falcon-dialog-z-index` → now 99999.
- `libs/falcon-ui-core/src/components/falcon-drawer/falcon-drawer.css:20,64` reads `--falcon-drawer-z-index` → now 99999.
- `libs/falcon-ui-core/src/angular-wrapper/components/falcon-completion-success-dialog/falcon-completion-success-dialog.component.html:8` reads `--falcon-dialog-z-index` via `z-[var(...)]` → now 99999.
- Stencil `<falcon-insufficient-balance-dialog-tw>` reads `--falcon-ib-dialog-backdrop-z` → now 99999.
- Both org-node-drawer templates (admin + mgmt) read `z-falcon-drawer-modal` → now 99999.

## Verification

- ✅ `nx build falcon-ui-tokens` PASS — registry 3622 tokens (was 3614 from rev 2)
- ✅ `nx build falcon-theme` PASS — tokens.ts written, 10 zIndex entries
- ✅ `nx build falcon-ui-core` PASS — 45.19s, 103 components (only pre-existing reserved-name warnings, none new)
- ✅ `nx test host-shell --testFile=tests/falcon-notification-stack-position.spec.ts` PASS — 7/7 including new `z-[100001]` expectation
- ⏳ Runtime visual verification pending — user to confirm Add Node / Edit Node drawer + InsufficientBalance dialog + completion-success dialog all render at top tier with toasts strictly above.

## Why
User explicitly reverted this morning's z=2000/1000 ladder (drawer was rendering hidden behind page chrome / its own popovers).

## How to apply
Any new modal surface must consume ONE of these tokens — never hard-code a literal:
- Drawer / popup-dialog → `z-falcon-drawer-modal` (Tailwind) or `var(--falcon-drawer-z-index)` / `var(--falcon-dialog-z-index)` (Stencil)
- Body-portaled popover → `var(--falcon-overlay-z-index)`
- Right-side toast → hard-coded `z-[100001]` (only the canonical `<falcon-angular-notification-stack>`) or `var(--falcon-toast-host-z-index)` for the legacy host

If a future surface needs a tier ABOVE notifications (e.g., critical interstitial), introduce a new explicit token; do NOT use literals.

**Trigger to revisit:** `z-index ladder` · `drawer not showing` · `toast covers drawer` · `popover inside drawer hidden` · `notification z-index` · [[falcon ui core layout traps]] · [[double-toast-root-cause-z-index-2000-1000-fix]] (superseded by this entry).
