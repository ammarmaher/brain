---
name: reference_static_remote_rebuild_after_app_edit_2026_06_04
description: Editing admin-console/mgmt APP source does NOT hot-reload — they run as static MF remotes served from dist/apps; rebuild the remote to see app-code changes.
metadata: 
  node_type: memory
  type: reference
  originSessionId: fb70c143-f6aa-4eaa-bbd6-3472013aa541
---

In the local dev setup (`nx serve host-shell`, static remotes), **edits to admin-console / management-console application source do NOT live-reload**. Only the shared `@falcon` library hot-updates.

**Why:** the running stack is two servers (verified 2026-06-04 via process list):
- `nx serve host-shell` (module-federation-dev-server, `devRemotes:[]`) — serves host-shell live AND provides the `@falcon` lib as a shared MF **singleton**, so library edits (e.g. `libs/falcon/.../falcon-node-details-section`) reflect after a browser refresh.
- `http-server dist/apps -c-1 ...` — serves **admin-console & mgmt as pre-built STATIC bundles from `dist/apps/<app>`**. App-code edits sit in source but the served bundle is frozen.

**Symptom:** a consumer template edit (e.g. adding `[withPadding]="false"` to `<falcon-node-details-section>` in `apps/admin-console/.../wallet-balance-management.component.html`) appears to "not work" at runtime — a signal `input()` keeps its default because the running bundle never got the new binding. Tell-tale: the shared-lib change IS visible (proves lib reloaded) but the app-level change is NOT.

**Fix — rebuild the static remote** (outputPath `dist/apps/<app>`, served live by the `-c-1` http-server), then **hard-refresh** the browser (Ctrl+Shift+R) so MF re-fetches `remoteEntry.mjs`:
```
node node_modules/nx/dist/bin/nx.js build admin-console --configuration=development
```
(`npx nx` is broken in this shell → use the direct `node node_modules/nx/dist/bin/nx.js` path.) The dev build pulls in 7 dep tasks (falcon-ui-core/tokens/theme/studio + host-shell) ~2–3 min when libs cached; emits `remoteEntry.mjs` + per-feature chunks. ⚠️ Angular builder wipes `dist/apps/<app>` at build start (deleteOutputPath) → the app briefly 404s mid-build; if the build FAILS it leaves the remote down until a clean rebuild ("live serve corrupts static remotes" caution). Rebuilding host-shell to dist does NOT affect the running `nx serve host-shell` (it serves from webpack-dev-server memory, not dist).

Related [[reference_504_admin_console_mf_duplicate_servers_2026_05_31]].
