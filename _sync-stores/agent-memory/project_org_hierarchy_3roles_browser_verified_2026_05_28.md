# Org-Hierarchy mgmt-console — 3-role BROWSER verification (2026-05-28)

🟢 BROWSER-VERIFIED (real Chrome through host-shell :4200 → mgmt remote :4301, live PES :5296 + core-gateway :7038) · NO COMMITS · ammar-qa-web

Closes the "🟢 BROWSER-verify pending" open item in [[project_org_hierarchy_full_seed_3_roles_2026_05_28]]. That seed work was live-API-verified only; THIS run clicked through the real FE for accowner/accadmin/accuser.

Evidence bundle: `C:\falcon\qa\runs\2026-05-28-orghierarchy-3roles\` (intent.md + 3 verdict.md + screenshots).

## RESULT: the org-hierarchy page renders the seeded hierarchy + users + settings + apps + channels with NO product errors, across all 3 roles. Role-lock + route-deny enforced correctly.

| Role | Verdict | Highlights |
|---|---|---|
| accowner | PASS (A1,A3,A4,A5,A6,A7) + A2 by-design divergence | Tree (root img + 5 children + 3 grandchildren), Settings populated (sec level + 3 IPs + quota), Users=3 root users, apps/channels on sub-node (DB 2 apps + 1 chan). acc-owner sub-node Users = empty (own-node lock). |
| accadmin | PASS (B1-B4) | NodeAdmin browses sub-nodes: HR→accadmin-hr, DigitalBank→accadmin-db (Showing 1-1). DB Apps=2 (Basic Send App Active + Survey Engine Disable), CommChannels=1 (WhatsApp). |
| accuser | PASS (C1-C3) | Org-Hierarchy menu item HIDDEN; direct nav → #/401 Unauthorized. ZERO commerce/* calls (guard denies before data). No leak. |

## CONFIRMED by-design behaviors (NOT bugs)
1. User-browsing role-lock: acc-owner + acc-user see only own (root) node users; only acc-admin (NodeAdmin) sees per-node lists. (Matches [[project_org_hierarchy_full_seed_3_roles_2026_05_28]] security model line 27-32.)
2. acc-user fully route-DENIED org-hierarchy (menu hidden + shellAccessGuard → 401). Matches app.routes.ts:16 matrix.
3. Tab set is node-type-driven (users-state.signals.ts:107-114): root→[Hierarchy,Settings]; sub-node→[Hierarchy,CommChannels,Apps]. So apps/channels tabs only show for SUB-nodes, never the root.
4. NO FALCON_ROOT_NODE in any request; all node calls carry real ids (a11001/a11002/a11003) via :7038; apps/channels via path-style GET commerce/Node/{id}/applications + /comm-channels; users via identity/user?NodeId=+PathPrefix+Role=4&5&6.

## ⚠️ TWO FINDINGS TO FLAG (not blockers, FE-team decision)
- **F-1 (Info panel / root data unreachable):** mgmt FE gates the Information panel on `!isRootSelected()` (org-hierarchy-page-menu.component.html:135,272) — so the ROOT (the ONLY node the seed populates with Information: officialData+address+VAT) shows NO Information button/panel. Sub-nodes DO show the Info panel but it's always EMPTY (all "—") because backend GetMainNodeInfoHandler returns null for sub-nodes. NET: the only node with info data has no info UI; the only nodes with info UI have no info data. Brief's A2 ("Info for root shows populated fields") is unsatisfiable in mgmt as built. Owner: @ammar-web-platform-ui (confirm intended) — is this the desired mgmt behavior, or should the root expose its Information?
- **F-2 (dev-server instability — ENV, not product):** `nx serve host-shell` crashed/hung 4× this session. Root causes: (a) admin-console has a BUILD BREAK (NG8001 `falcon-angular-button` not a known element in contact-groups-list.component.html) → as a static MF remote it kills the whole host-shell serve ("continuous but exited code 1"); WORKAROUND = `nx serve host-shell --devRemotes=management-console --skipRemotes=admin-console` (NOT the manifest active flag — that's read at runtime, not by the dev-server executor). (b) On-demand lazy-chunk compile (signalr, falcon-ui-radio-tw, falcon-input-number-tw) returns 503/504 mid-build → transient ChunkLoadError in browser + renderer freeze blocking CDP screenshots; resolves once compiled. (c) Bash-tool `&`-backgrounded serves get reaped; use PowerShell `Start-Process` detached. Owner: @ammar-web-platform-ui (admin-console NG8001) + @ammar-essentials (serve recipe). prod build pre-bundles → these chunk errors are dev-only.

## Repo hygiene
Made + REVERTED one temp workaround (admin-console active:false in module-federation.manifest.dev.json + regenerated .json). Working tree restored — git diff of both manifest files empty. Other M files are pre-existing port work, not mine. NO COMMITS.
