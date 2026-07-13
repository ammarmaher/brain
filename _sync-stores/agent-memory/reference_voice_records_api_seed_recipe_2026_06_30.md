---
name: reference_voice_records_api_seed_recipe_2026_06_30
description: "Runtime-verified recipe to create Voice Records via the REAL local API (presigned flow) as a client user; 4 records seeded into test-tenant-001 incl. \"seed test\"."
metadata: 
  node_type: memory
  type: reference
  originSessionId: 5976432b-1428-415f-a958-f9c51cccf11d
---

**Voice Records backend IS implemented + running locally** — `falcon-core-templates-svc` (`Falcon/falcon-core-templates-svc/src/Falcon.Templates.Api/Endpoints/VoiceRecords/*`), container **`falcon-templates-1`** on **:7264** (`/api/voice-records`), storage **`falcon-minio-1`** (:9000, S3/MinIO), identity :7777. Endpoints match `voice-records (1).md` exactly.

**Create requires a CLIENT user** — `CreateVoiceRecordUploadSessionHandler.cs:35` throws 403 `ForbiddenToManageVoiceRecord` for Falcon users; tenant+node come from the JWT (`currentUser.TenantId` / `currentUser.NodeId`, else 400 `NodeIdMissing`) — NOT from the request. So you must log in as a client of the target tenant.

**Seed recipe (RUNTIME-VERIFIED 2026-06-30, node script):**
1. Login `POST :7777/api/auth/login {username:"accowner", password:"Admin@1234"}` → `result.tokens.accessToken` (accowner = acc-owner client of **test-tenant-001**, userType 2; stage 4 = Authenticated, no OTP in dev). Other seeded clients: accadmin, accuser. Falcon staff (would 403 on writes): sysadmin/sysops/sysprod. All pwd `Admin@1234`.
2. For each file (hit the svc DIRECTLY at :7264, Bearer token): (a) `POST /api/voice-records/upload-session {source:1, fileName, contentType, sizeBytes}` → `result.{recordId,url,objectKey,expiresInSeconds}`; (b) **PUT the bytes** to the presigned `url` with `Content-Type` == the session contentType — BUT rewrite the host `minio:9000`→`localhost:9000` first (MinIO presign is path-style, host not signed); (c) `POST /api/voice-records/{recordId}/complete {name}` → `result` = VoiceRecordListItemDto (Ready; duration probed server-side). contentType allow-list: audio/mpeg (mp3), audio/wav (wav), audio/x-wav, audio/wave, audio/vnd.wave. Max 20MB.
3. Script: `scratchpad/seed-voice-records.js`.

**SEEDED into test-tenant-001 (2026-06-30):** "seed test" (WAV 1MB, 0:05, id …09c5), "MP3 700KB Sample" (0:42, …09c6), "MP3 5MB Sample" (2:12, …09c7), "WAV 10MB Sample" (0:59, …09c8). Source files: `C:\Users\User\Downloads\lab dirver\file_example_*.{wav,mp3}`. Client list (`GET /api/voice-records`) returns all 4 newest-first; preview-url returns 200 + a 206-playable object.

**GOTCHA — preview-url host:** `GET /{id}/preview-url` returns a `minio:9000` host the browser can't reach → the FE MUST rewrite host→localhost before `audio.src`. Fixed in `voice-records-api.service.ts getPreviewUrl` (applies `toBrowserReachableUrl`, same as the upload PUT). Related: [[project_voice_records_admin_readonly_v1_2026_06_30]].
