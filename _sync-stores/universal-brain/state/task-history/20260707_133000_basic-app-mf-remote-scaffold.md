# COMPLETED — basic-app-mf-remote-scaffold (2026-07-07)

User-ruled D-1 (Recipe B standalone remote) executed end-to-end.

## Shipped (branch polishing-v0.4, NOT committed — 6 modified files + new apps/basic-app/)
1. **apps/basic-app** — Angular 21 MF remote cloned from admin-console skeleton: module-federation.config (name basic-app, expose ./basic-app, share map verbatim-synced), webpack dev+prod, project.json (serve :4303), tsconfigs, vite/vitest, eslint, index.html (theme/RTL pre-boot), bootstrap (NO provideAnimationsAsync — NG0201 avoidance, mgmt-console pattern), app.config (CoreGateway default, full falcon provider stack), routes ('' → bsa-home), env re-exports, mocks/fallback facades, public assets.
2. **BSA home screen (Wave F1)** — channel tabs WhatsApp|IVR Voice + Outbox|Scheduled, falcon-angular-data-table grids with exact BR-BSA-53/54 columns (voice drops Language, header swaps to IVR Name), 7-status pills, +N recipient tags, two-line dates, riyal icon costs, search + type filter, page size 10, per-status action gating (details/cancel/edit/delete) with wave-stub toasts; mock seeds mirror React SoT (15/5/4/2 rows).
3. **Federation registration** — basic-app entry in ALL 4 host-shell manifests (dev+base active, remoteEntry http://localhost:4303/remoteEntry.mjs, localDev projectName/port; staging/prod inactive placeholders) + `menu[]` sidebar item (labelKey basicApp.nav, icon marketplace, Main Items) — FIRST use of MenuBuilderService; zero host-shell code edits. start-dynamic-remotes registry lists basic-app.
4. **i18n** — `basicApp` namespace injected into shared en.json + ar.json (byte-surgical; 46 namespaces).
5. **launch.json** — falcon-basic-app entry (:4303). Port note: 4302 occupied by ad-hoc http-server (dist/apps) — left untouched, moved to 4303.

## Verification (runtime, zero console errors)
- Gates: nx build dev GREEN · vitest 7/7 · lint GREEN.
- Standalone :4303 renders (after NG0201 fix).
- Under host-shell :4200 (user's running server, hot-serving my manifest): sidebar "Basic App" appears → click → remoteEntry.mjs loaded from :4303 → grid renders inside host chrome with all data; IVR Voice + Scheduled tab swaps verified via DOM probes. Browser-pane screenshots degraded all session (30s timeouts) — evidence = page-text/DOM/console probes.

## Bugs found (platform value)
- **NG0201 provideAnimationsAsync** on direct bootstrap (known 2026-05-20 diagnosis) — basic-app adopts safe pattern; admin-console still latent.
- **NEW: falcon-angular-data-table first-paint syncProps hole** — synchronously-bound rows/columns land pre-upgrade as own-props, never re-synced → empty grid w/ populated footer. Root-caused live (probe: manual prop set renders). Consumer workaround shipped (whenDefined ready-gate); library fix spawned as task_e08e9a6d.

## Follow-ups flagged
- PES: seed app.basic-app/acc.basic-app + add requiredAccess to manifest entries (item currently visible to all; empty access passes guard).
- Wave F2 next (compose); backend B0 per ARCHITECTURE_BACKEND; dark-mode tokens for BSA screens; E1 status-badge exact SoT palette.
- Docs updated: IMPLEMENTATION_PLAN + ARCHITECTURE_FRONTEND (D-1 ruling recorded), memory + MEMORY.md.
