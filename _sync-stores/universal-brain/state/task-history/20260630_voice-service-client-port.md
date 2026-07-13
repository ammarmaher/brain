# Voice Service — management-console CLIENT port (Records + Shared tabs)

Date: 2026-06-30 · Agent: claude · Branch: polishing-v0.4 (UNCOMMITTED) · Status: DONE (live E2E user-gated)

## Goal
Port the Falcon Voice Service from admin-console to the **management-console (CLIENT view)**: 3 tabs
(Voice Account, Voice Records, Shared Records). Focus tabs 2+3 (backend implemented). Copy the admin
feature + adapt to the source-of-truth client view.

## What was done (5 waves)
- **W1 Scaffold/data:** copied admin `pages/voice-service/` → `management-console/.../comms-hub/pages/voice-service/`;
  service +`listSharedRecords` (GET `templates/voice-records/shared`); header reworded for CoreGateway.
- **W2 Shell+Records:** rewrote the shell — NO clients tree; node from `SessionProvider` (`toSignal(node$)`,
  nodeId/tenantId/initials-avatar); 3 tabs; create/details swaps. Records tab DROPPED the "Created by" column.
- **W3 Shared tab:** new `shared-records-tab` (read-only, name/preview/createdAt/createdBy/sharedWith; "You +N").
- **W4 Wizard+Details:** copied 1:1, wired into the shell.
- **W5 Verify+seed:** builds + API + seed (below). Route already targeted `CommsHubVoiceServiceComponent`.
- i18n (shared lib en+ar): `voiceRecords.tabs.shared` + `records.sharedEmptyTitle/Description`.

## Adversarial review (workflow, 3 finders + per-finding verify) → 7 confirmed, ALL fixed
- MEDIUM #7: records-tab gated the client list on `nodeId && tenantId` (backend ignores for clients) →
  empty grid if session node unresolved. FIX: fetch unconditionally (removed gate + unused `of`/`EMPTY_PAGE`).
- MEDIUM #5: shared-tab `all.shift()` assumed caller-first → wrong popup names. Kept count-correct
  ("+N" = recipients−1 ALWAYS right since caller is always one recipient); documented popup best-effort
  (names-only DTO + JWT name=sub make an exact fold impossible FE-only; backend userId would fix it).
- LOW #6: shared-tab now shows the "All users" pill (`[allUsers]="row.sharedWithAllUsers"`).
- LOW #1–#4: stale admin doc comments (records-tab header/inputs, service inline, wizard header,
  models "SystemGateway"→CoreGateway, details share line) — corrected.

## Verification (evidence)
- `nx build management-console` + `admin-console` GREEN (regression-free), rebuilt GREEN after fixes.
- API as accowner: `GET /voice-records` no-params → 200/4 own; `GET /shared` → 200 (client not 403'd).
- Write path: accadmin (client) create+share→accowner → upload-session 201 / PUT 200 / complete+share 200.
- Seeded Shared tab: "Shared seed for owner" (You) + "Team briefing (multi)" (You +2).

## Caveats / follow-ups
- Live in-browser E2E user-gated (mgmt is a Module-Federation remote — needs host-shell `npm start` + client login).
- Voice Account tab = placeholder (backend out of scope).
- "You +N" popup name fold is best-effort; exact fold needs the shared list DTO to return the caller's userId.
- Shared agent MEMORY.md index is 388KB (over load limit) — flagged to user for a compaction decision (shared, not unilaterally rewritten).
- Memory: project_voice_service_client_port_2026_06_30.md.
