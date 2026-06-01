---
name: Add User Dropdown + Payload Fix
description: Root-cause fix for two coupled bugs on the Add User wizard. (1) <falcon-dropdown> disabled collapsed to chip-width because the Light-DOM Tailwind variant defaults to display:inline (Stencil shadow:false trap); fixed in libs/falcon-ui-tokens dropdown.tokens.css with a host-element rule. Also added @Input('disabled') to the Angular wrapper for template binding. (2) Local payload sent FALCON_ROOT_NODE sentinel + null image + admin permGroup + wrong gateway (auth.falconhub.space). Rebuilt wire-builder to strip sentinel, split FalconPhotoUploader data URL, hardcode '' permGroup, and route through System Gateway (identity/user). LANDED 2026-05-17. admin-console build GREEN b049fd270865f94d/22.39s.
type: project
agent: ammar-web-platform-ui
date: 2026-05-17
status: completed
originSessionId: 8f62252f-2f04-4b46-9b7f-104a7db6b788
---
# Add User Wizard — Dropdown Disabled Width + Payload Fix

**Status:** 🟢 LANDED (2026-05-17). admin-console build GREEN `b049fd270865f94d` / 22.39s. host-shell fails on pre-existing falcon-loader-inline.component.html errors (unrelated workspace state issue per `[BRAIN-OUT] VERIFICATION-STATUS.md`).

## What the user saw

1. **Step 2 User Status** displayed as a narrow `Pending` chip, NOT a full-width disabled dropdown that matches the User Role dropdown next to it.
2. **Submit payload was wrong** vs QA:
   - `nodeId: "FALCON_ROOT_NODE"` (should be `null` for Falcon root)
   - `profilePictureInfo: { extension: null, fileBase64String: null }` even when an image was uploaded
   - `permissionGroupId: "admin"` (should be `""` per OLD UI proven behavior)
   - URL hit `https://auth.falconhub.space/api/user` instead of `https://system-api.falconhub.space/identity/user`

## Root causes (4 distinct)

### RC-A — Stencil `shadow: false` defaults host to `display: inline`

`[CODE] libs/falcon-ui-core/src/components/falcon-dropdown-tw/falcon-dropdown-tw.tsx:72-75` declares `shadow: false`. Stencil Light-DOM components render their wrapper inside the consumer document with no browser-default `display: block`, so the host falls back to `display: inline`. With an inline host, the inner `<div class="flex flex-col w-full min-w-0">` computes `w-full` as 100% of the host's intrinsic-content width, not the parent layout width. When the dropdown is `disabled` (no hover/focus padding), the visible box collapses to roughly placeholder-text width — exactly the reported chip-width regression. Same trap-pattern as `[MEMORY] feedback_falcon_ui_core_layout_traps` rule 1.

### RC-B — `<falcon-angular-dropdown>` had no `@Input() disabled`

`[CODE] libs/falcon-ui-core/src/angular-wrapper/components/falcon-dropdown/falcon-dropdown.component.ts:118` declared `protected readonly disabled = signal<boolean>(false)` writable ONLY via `setDisabledState` (the CVA path, called by `FormControl.disable()`). A consumer writing `<falcon-angular-dropdown [disabled]="true">` had no effect.

### RC-C — `FALCON_ROOT_NODE` sentinel propagated to wire

`[CODE] libs/falcon/src/shared-types/lib/models/globals.ts:193-203` defines the UI-only synthetic root with `id: 'FALCON_ROOT_NODE'`. The Add User flow propagated this verbatim through: tree builder → menu builder → `addUserNodeId` signal → wizard `nodeId()` input → `buildPayload().nodeId` → `buildCreateUserWireRequest({ nodeId: p.nodeId })`. No stripping anywhere. OLD UI doctrine (`old-ui-dataset/host-shell/user-profile/01-ROUTING.md:21`) was "Equal to `FALCON_ROOT_NODE.id` → ignored, treat as own-profile (`this.nodeId = null`)" — never implemented in the new wizard.

### RC-D — Wire builder hardcoded null image + wrong gateway

`[CODE] add-user-wizard/models/models.ts:155-172` had `profilePictureInfo: { extension: null, fileBase64String: null }` hardcoded. The `FalconPhotoUploaderComponent` (`falcon-photo-uploader.component.ts:83-91`) produced a full data URL (`data:image/png;base64,...`), stored on `step1Value().photo`, but `NewUserPayload` had no photo field and `buildPayload` never copied it through. Three-layer break.

`[CODE] services/user.service.ts:91, 97` had `'user'` (bare path) + `useGateway(Gateway.IdentityGateway)` (specific Auth host). The proven OLD UI pattern uses `'identity/user'` + `useGateway()` (falls back to APP_DEFAULT_GATEWAY = System for Falcon admins).

## Fixes landed (9 changes across 6 files)

### Library (Wave 2A + 2C)

| File | Change |
|---|---|
| `[CODE] libs/falcon-ui-tokens/src/components/dropdown.tokens.css:36-56` | NEW root rule `falcon-dropdown-tw { display: block; width/min-width/max-width: var(--falcon-dropdown-*) }` — fixes RC-A globally (every framework consumer benefits). |
| `[CODE] libs/falcon-ui-core/src/components/falcon-dropdown/falcon-dropdown.css:15-25` | `:host([disabled])` now re-asserts `width / min-width / max-width` tokens (defense-in-depth for the Shadow variant). |
| `[CODE] libs/falcon-ui-core/src/components/falcon-dropdown/falcon-dropdown.css:155-167` | `.falcon-dropdown-trigger.disabled` now explicitly carries `width: 100%; min-width: 0` (prevents future state-class refactor from dropping the contract). |
| `[CODE] libs/falcon-ui-core/src/angular-wrapper/components/falcon-dropdown/falcon-dropdown.component.ts:118-131` | NEW `@Input('disabled') set disabledFromInput(value)` — writes to the existing `disabled` signal; CVA path unchanged. Accepts boolean OR string-truthy (Stencil idiom). Fixes RC-B. |

### App (Wave 2B)

| File | Change |
|---|---|
| `[CODE] apps/admin-console/.../org-hierarchy-page/models/models.ts` (NewUserPayload) | + `readonly photo?: string` — carries FalconPhotoUploader data URL through to the wire builder. |
| `[CODE] apps/admin-console/.../add-user-wizard.component.ts:409-425` (buildPayload) | + `photo: s1.photo \|\| undefined` — copies from step1 form value. |
| `[CODE] apps/admin-console/.../add-user-wizard/models/models.ts:155-195` (buildCreateUserWireRequest + new splitDataUrl helper) | (a) splits `data:image/<ext>;base64,<payload>` into `{ extension, fileBase64String }`; (b) `permissionGroupId: ''` hardcoded; (c) `nodeId: p.nodeId === FALCON_ROOT_NODE.id ? null : p.nodeId`. Fixes RC-C + part of RC-D. |
| `[CODE] apps/admin-console/.../add-user-wizard/services/user.service.ts:91-104, 122-132, 141-144, 160-163, 188-191` | All 5 Identity calls: `'<verb>'` → `'identity/<verb>'`; `useGateway(Gateway.IdentityGateway)` → `useGateway()` (System Gateway by app-default for admin-console). Fixes rest of RC-D. |
| `[CODE] apps/admin-console/.../user-role-status-step/user-role-status-step.component.html:6-14` + `.ts:60-62` | Replaced the static `<div class="inline-flex">` chip with `<falcon-angular-dropdown class="w-full" [options]="statusOptions()" [ngModel]="'pending'" [disabled]="true">`. Combined with RC-A+RC-B fixes, renders as a full-width disabled dropdown matching User Role chrome 1:1. |

## YARP chain confirmed (System Gateway)

`[CODE] falcon-int-system-gateway-svc/src/Falcon.System.Gateway/appsettings.json:76-86`:
```
POST <gateway>/identity/user
  → YARP match /identity/{**remainder} (FalconOnly policy)
  → PathRemovePrefix /identity + PathPrefix /api
  → POST http://localhost:7777/api/user (Identity dev)
  → CreateUserEndpoint (Post("/") in UserEndpointGroup("user") under RoutePrefix "api")
```

Identity DTO `[CODE] CreateUserRequest.cs:8-16` + `CreateUserRequestValidator.cs` accepts `nodeId: string?`, `path: string?`, `tenantId: string?`, `roleKey: string?`, `role: int?`, `profilePictureInfo` wrapper required with inner fields optional. Empty `permissionGroupId` passes (no `NotEmpty` rule).

## Before/After payload

**Before (broken):**
```json
POST https://auth.falconhub.space/api/user
{
  "nodeId": "FALCON_ROOT_NODE",
  "permissionGroupId": "admin",
  "profilePictureInfo": { "extension": null, "fileBase64String": null },
  "role": null, "roleKey": "sys-admin", "tenantId": "", "path": null,
  "personalInfo": { "firstName": "asdasd", ... }
}
```

**After (matches QA):**
```json
POST https://system-api.falconhub.space/identity/user
{
  "nodeId": null,
  "permissionGroupId": "",
  "profilePictureInfo": { "extension": "png", "fileBase64String": "iVBORw0KGgo..." },
  "role": null, "roleKey": "sys-admin", "tenantId": "", "path": null,
  "personalInfo": { "firstName": "Jane", ... }
}
```

## Build evidence

| Project | Status | Hash | Time |
|---|---|---|---|
| `admin-console` | 🟢 GREEN | `b049fd270865f94d` | 22.39s |
| `host-shell` | ❌ pre-existing | — | — (4 errors in `falcon-loader-inline.component.html` — known workspace blocker, NOT touched by this work) |

admin-console depends on the falcon-ui-core lib (where the dropdown library fix lives) and the falcon-ui-tokens lib (where the new `falcon-dropdown-tw {}` rule lives) — both compile clean as part of the admin-console build (`6 tasks it depends on`).

## Files touched (absolute)

```
libs/falcon-ui-tokens/src/components/dropdown.tokens.css
libs/falcon-ui-core/src/components/falcon-dropdown/falcon-dropdown.css
libs/falcon-ui-core/src/angular-wrapper/components/falcon-dropdown/falcon-dropdown.component.ts
apps/admin-console/src/app/features/org-hierarchy-page/models/models.ts
apps/admin-console/.../add-user-wizard/add-user-wizard.component.ts
apps/admin-console/.../add-user-wizard/models/models.ts
apps/admin-console/.../add-user-wizard/services/user.service.ts
apps/admin-console/.../add-user-wizard/user-role-status-step/user-role-status-step.component.html
apps/admin-console/.../add-user-wizard/user-role-status-step/user-role-status-step.component.ts
```

## Re-test scenarios

1. Open Add User wizard → Step 2 → confirm "User Status" renders as full-width disabled dropdown with "Pending" selected, same chrome as User Role next to it.
2. Disabled dropdown does not collapse to a chip when no value is selected (RC-A fix).
3. Upload a PNG image in Step 1 → submit → DevTools Network → confirm `profilePictureInfo.extension === "png"` and `fileBase64String` is non-null.
4. Submit Add User on Falcon root → DevTools Network → confirm `nodeId: null`, NOT `"FALCON_ROOT_NODE"`.
5. Submit → confirm URL is `https://system-api.falconhub.space/identity/user`, NOT `auth.falconhub.space/api/user`.
6. Submit → confirm `permissionGroupId: ""` on the wire (matches QA).
7. Backend 422 NormalUserLimitReached → popup + auto-jump to Step 2 with role flagged (existing FIELD_LEVEL_ERROR_MAP behavior preserved).

## Flagged gaps (not fixed — out of scope)

- `[CODE] services/user.service.ts:104` — `withSuccess('User created successfully')` is hardcoded English. Should be i18n-keyed once `hierarchy.addUser.success.created` lands in en.json + ar.json.
- `path` parameter still always `null` from caller; for sub-node Add User cases the wizard should derive it from the live tree. Optional per the canonical playbook.
- `[CODE] services/user.service.ts:127, 144, 191` — `notShowToaster` header missing from non-create Identity calls (likely intentional; revisit when Edit User lands).
- Pre-existing workspace blocker: `falcon-loader-inline.component.html` lines 20/21/28/29 — `Property 'detail' does not exist on type 'Event'` — needs a senior FE fix (Stencil type regeneration). Tracked separately in `[BRAIN-OUT] VERIFICATION-STATUS.md`.

## Cross-references

- Plan source: `[BRAIN-OUT] Brain Outputs/understanding/pages/organization-hierarchy/flows/Add User.md`
- Companion landing: `[MEMORY] project_add_user_backend_pes_integration` (2026-05-16) — FIELD_LEVEL_ERROR_MAP + ErrorDialogService + PES gating
- Disabled-state CSS doctrine: `[MEMORY] feedback_falcon_ui_core_layout_traps` — rule 1 (Stencil shadow:false defaults to display:inline)
- Gateway architecture: System Gateway for Falcon admin · `[CODE] falcon-int-system-gateway-svc/.../appsettings.json:76-86`
- Identity backend route: `[CODE] CreateUserEndpoint.cs:13-17` — `POST /api/user`

## Trigger to resume / extend

`continue Add User wizard dropdown + payload fix` — context restorable from this memory entry plus the 9 cited file paths.
