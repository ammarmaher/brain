---
name: sidebar-route-slug-mismatch-2026-05-28
description: "host-shell sidebar nav paths are hardcoded slug constants in layout.component.ts that MUST exactly match each remote's registered route slug; getSafeLink does NOT validate against real routes, so a wrong slug silently dead-ends via the remote wildcard. Wallet (both consoles) + mgmt CommChannels fixed; 5 other sidebar items still point at unregistered routes."
metadata: 
  node_type: memory
  type: project
  originSessionId: 235eb89e-313c-4e88-ba00-9a0f63f2de3d
---

Wallet Management sidebar click "went nowhere" — root cause + a latent gap set found during the audit.

**Architectural pitfall (the reusable lesson):** The host-shell left sidebar builds each nav link from hardcoded slug constants in `apps/host-shell/src/app/layout/layout.component.ts` (e.g. `admin_console_PATH_WALLET_BALANCE = ${admin_console_BASE}/<slug>`). Those slugs MUST exactly equal the path registered in the target remote's `apps/<console>/src/app/app.routes.ts`. `RouteAccessService.getSafeLink()` (`libs/falcon/src/core/lib/services/route-access.service.ts:123`) returns `item.path` UNCHANGED — it only checks authorization, never whether the route exists. So a wrong slug is not caught: the host mounts the remote's `appRoutes` as children, no child matches, the remote's `{ path: '**', redirectTo: '' }` swallows it and bounces back to the landing page → the click appears dead.

**Why:** Two parallel sources of truth (sidebar slug constant vs remote route slug) with no compile-time or runtime cross-check. Renames on one side silently break the other.

**How to apply:** When ANY sidebar item "goes nowhere," first diff the layout.component.ts slug constant against the remote app.routes.ts `path:`. Fix by matching the sidebar constant to the established route slug (do NOT rename the route — slugs like `comm-mgmt` and `wallet-balance-management` are entrenched across feature folders, comments, and child slugs). Mirror of [[project_admin_to_mgmt_contract_reconciliation_2026_05_28]] BE-FE alignment discipline, but for FE route slugs.

**Fixed 2026-05-28 (build-verified, NO COMMITS):**
- Wallet admin: `wallet-balance` → `wallet-balance-management` (layout.component.ts:69)
- Wallet mgmt: `wallet-balance` → `wallet-balance-management` (layout.component.ts:75)
- CommChannels mgmt: `comm-channels` → `comm-mgmt` (layout.component.ts:73) — also repairs its whatsapp-business/voice-service/ai children (built from same constant). Admin CommChannels was already correct (`comm-channels`).
- host-shell dev build green: wallet-only hash `1c594500abf030a0`; +comm hash `2f1adaf6abc294de` (18s, "Successfully ran target build … and 5 tasks it depends on").

**STILL BROKEN — DIFFERENT CLASS (sidebar item → route NOT registered in that remote; needs product decision, NOT a slug typo). Flagged to user, not touched:**
- Permissions — BOTH consoles: no `permissions` route in either remote.
- Contact Groups — admin: no `contact-groups` route in admin remote (mgmt has it).
- Contracts & Cost — admin: no contracts route in admin remote (sidebar slug `contracts-cost`; mgmt route is `contracts-cost-management`).
- Templates — mgmt: no `templates` route in mgmt remote (admin has it).
Decision pending: wire the missing routes, hide the menu items, or leave as-is.

**Verification ceiling:** build-green only. True click-through verification needs the Docker stack + login + all 3 MFEs serving (host :4200, mgmt :4301) — same blocker as wallet GAP-3. Not runtime-verified in browser this session.

**Unrelated note (deferred GAP, not fixed):** admin wallet component `onSwitchPerspective()` (`apps/admin-console/.../wallet-balance-management.component.ts:389`) navigates to `/management/wallet-balance-management` — missing `-console` (should be `/management-console/...`). This is the known GAP-3/F-024 "Switch perspective" cross-MFE affordance, explicitly a best-effort no-op; out of scope for the sidebar bug.
