---
name: project_voice_service_client_port_2026_06_30
description: "Voice Service ported to management-console (CLIENT view) — Records + read-only Shared tabs, no tree, full CRUD; built + reviewed + seeded"
metadata: 
  node_type: memory
  type: project
  originSessionId: 5976432b-1428-415f-a958-f9c51cccf11d
---

**Voice Service ported admin→management-console (CLIENT view).** Copied the admin Falcon feature `apps/admin-console/.../comm-channels-services/pages/voice-service/` → `apps/management-console/src/app/features/comms-hub/pages/voice-service/` and adapted for the client. The mgmt route + placeholder already existed (`comms-hub.routes.ts` path `voice-service` → `CommsHubVoiceServiceComponent`, guard `services.view()`).

**3 tabs** (records is default): Voice Account (placeholder, like admin — backend out of scope) | Voice Records | **Shared Records** (NEW, read-only).

**Backend — NO change (all client-ready, runtime-verified):** base `templates/voice-records` via **CoreGateway** (mgmt `provideAppDefaultGateway(Gateway.CoreGateway)`; no-arg `useGateway()` auto-resolves). `GET /` JWT-scoped (tenant/node params optional/ignored for clients; NormalUser=own, NodeAdmin/AccountOwner=subtree). `GET /shared` client-only (Falcon 403) returns records shared TO caller (`SharePolicy.SharedWithAllUsers` OR `SharedUsers` contains me, `CreatedBy != me`); same `VoiceRecordListItemDto` (CreatedByName + SharedWith names, NO ids). upload-session/complete/share/delete all SUCCEED for clients (the `if(IsFalconUser)throw 403` is Falcon-only; delete 409 if used by an IVR).

**FE changes vs admin:** (1) shell rewritten — NO clients tree; node derived from **SessionProvider** (`toSignal(session.node$)`; nodeId=`node()?.id ?? session.session?.nodeId`, tenantId=`node()?.tenantId ?? session.session?.tenantId`, initials avatar) — mirrors mgmt contact-groups [[project_hierarchy_self_user_opens_profile_2026_06_23]]. (2) records tab DROPS the "Created by" column. (3) records-tab list now fetches **unconditionally** (client scopes by JWT; removed the admin `nodeId && tenantId` gate that left an empty grid if the session node hadn't resolved). (4) service `+listSharedRecords(page,pageSize)` → `GET .../shared`. (5) NEW `shared-records-tab` (read-only, cols name/preview/createdAt/createdBy/sharedWith; "You +N" via `sharedDisplay`). (6) i18n shared lib `libs/falcon/.../i18n/{en,ar}.json`: `voiceRecords.tabs.shared` + `voiceRecords.records.sharedEmptyTitle/Description`. Wizard/details/preview/shared-with-chip/models/validations copied 1:1; shared audio libs reused.

**"You +N" gotcha:** the shared list DTO carries recipient NAMES only (no ids) and the JWT has NO `name` claim — `session.name = decoded.name || decoded.sub` so for client users it's the numeric SUBJECT id, never the display name (host-shell topbar fetches the real name via API; not available in the mgmt remote). So `sharedDisplay` is count-correct (caller is always exactly one recipient → "+N" = recipients−1, ALWAYS right) but the expand-popup name fold is best-effort (`findIndex(myNames)` else drop first). Known limit: multi-recipient + caller-unidentifiable + caller-not-backend-first → popup may show own name for one other (count stays right). Clean exact fix would need a backend tweak returning the caller's userId on the shared list.

**Verified:** `nx build management-console` + `admin-console` GREEN (regression-free). API as accowner (`6a085917c20b3a5a7a9df8a3`): `GET /voice-records` no-params → 200/4 own; `GET /shared` → 200 (client not 403'd). Write path proven via accadmin (client, role 5) create+share→accowner: upload-session 201 / PUT 200 / complete+share 200. **Seeded the Shared tab** (accadmin→accowner): "Shared seed for owner" (You) + "Team briefing (multi)" (You +2). Adversarial review (workflow, 3 finders + per-finding verify) found 7 confirmed (5 stale doc comments + 2 medium = the empty-grid gate #7 and the shift() popup #5) — ALL fixed, rebuilt GREEN.

**UNCOMMITTED on polishing-v0.4** (per [[feedback_fe_no_commit_no_branch_without_instruction_2026_06_22]]). Live in-browser E2E user-gated (mgmt is a Module-Federation remote — needs host-shell `npm start` + login as a client). Continues [[project_voice_records_admin_readonly_v1_2026_06_30]] (the Falcon side) and [[project_commchannels_submenu_meta_voice_ai_2026_06_30]] (the menu scaffold).
