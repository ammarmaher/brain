---
name: project_mgmt_wallet_node_avatar_image_2026_06_22
description: Mgmt wallet header showed no node image because it used the legacy hardcoded-brand avatar; fix = canonical app-org-node-avatar fed by accountInfo.accountImage.
metadata: 
  node_type: memory
  type: project
  originSessionId: e487b5bf-73dd-495b-9b2b-826e65184e71
---

**Symptom:** mgmt-console Wallet & Balance Management header ("Test Tenant 001") rendered with NO logo image for client `accowner`.

**Is falcon-node-details-section used? YES** — `wbm-client-view.component.html` uses `<falcon-node-details-section [label]="selectedNode()?.name">`. The avatar was projected via `<app-wbm-brand-logo [brand]="selectedNode()?.brand">`.

**Why no image (root cause):** Two compounding reasons. (1) `app-wbm-brand-logo` (in `wbm-icons.component.ts`) only renders a FIXED set of hardcoded brand keys (`WB_BRAND_LOGOS`: aramco/snb/bupa/alrajhi/falcon + bmw); anything else → a transparent generic placeholder. (2) The mgmt wallet adapter (`wallet.adapter.ts mapHierarchyToWb`) never sets `WbTreeNode.brand` and never reads the account image — so `selectedNode().brand` is ALWAYS undefined → empty placeholder. The real image WAS available all along: live `GET api/commerce/accounts/{nodeId}/hierarchy` (core-gw :7038) returns `accountInfo = { accountName:"Test Tenant 001", accountImage:"data:image/jpeg;base64,…" (~140KB) }` — the adapter just dropped it.

**Best-practice fix (FE-only, NO commits) = mirror the admin wallet twin:** admin uses `<app-org-node-avatar [identity]="store.selectedNodeIdentity()">` built from `WbAccountInfo.image` (`admin .../data/node-identity.ts`). Applied the same to mgmt: NEW `management-console/.../wallet-balance-management/data/node-identity.ts` (`buildWbNodeIdentity(name, image)` → image→'image' / else 'initials', via `NodeIdentity` from `@falcon/org-node-avatar`); orchestrator reads `response.accountInfo.accountImage` into an `accountImage` signal in `applyHierarchy` + exposes `selectedNodeIdentity` computed + passes `[selectedNodeIdentity]`; `wbm-client-view` swapped `<app-wbm-brand-logo>` → `<app-org-node-avatar [identity]="identity" size="md">` (input added, `OrgNodeAvatarComponent` imported, `WbmBrandLogoComponent` import removed); updated 2 assertions in `standards-client-view.spec.ts`. GATES: `nx build management-console` GREEN; standards-client-view spec 41/41 GREEN; 3 files eslint-clean. Live-API confirmed accountImage present.

**Canonical rule:** the platform node-header avatar is `<app-org-node-avatar [identity]="NodeIdentity">` projected into `<falcon-node-details-section>`'s `falconNodeDetailsAvatar` slot (admin wallet, comm-channels, marketplace, org-hierarchy-page-menu all do this). It renders Falcon-brand SVG / real image / initials uniformly. Don't hand-roll a brand-keyed logo. Node image sources: wallet `accountInfo.accountImage` or `commerce/Node` `result[].url` (both `data:image/...;base64,…`).

**Follow-ups (flagged, NOT changed):** `WbmBrandLogoComponent` + `WB_BRAND_LOGOS` are now unused in production (only their own RUN-4/RUN-5 unit tests reference them) — candidate dead-code cleanup. The comm-mkt header ([[project_node_header_label_session_name_sub_fallback_2026_06_22]]) still shows only initials (no image) — could likewise adopt the real node image for consistency. Related: [[project_comm_mkt_view_node_details_section_adoption_2026_06_22]].
