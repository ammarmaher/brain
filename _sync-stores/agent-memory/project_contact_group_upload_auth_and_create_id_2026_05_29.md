---
name: project-contact-group-upload-auth-and-create-id-2026-05-29
description: "Create Contact Group wizard — presigned-PUT multiple-auth bug + create-response id/groupId drift; both fixed in working tree, API-boundary runtime-verified PASS"
metadata: 
  node_type: memory
  type: project
  originSessionId: 5c6611ff-9d08-42c3-99d2-6fbc6e4a554f
---

# Contact Group create flow — two fixes, runtime-verified (2026-05-29)

🟢 API-BOUNDARY RUNTIME-VERIFIED (live Docker, MF-independent replay). Both fixes already in the
working tree (uncommitted) when verified; a parallel autopilot was editing the same files mid-session.

**Bug 1 (reported): presigned MinIO PUT carried TWO auth types → 400.** The Step-1 upload PUT goes
through Angular HttpClient (`putToPresignedUrl` → `this.raw.request`). Setting `headers: undefined`
at HttpRequest construction does NOT help — the interceptor runs after. Fix = `[CODE]
apps/host-shell/src/app/core/interceptors/request-interceptor.ts:43-56`: skip any request whose
lowercased URL has `awsaccesskeyid=` (SigV2) / `x-amz-signature=` / `x-amz-credential=` (SigV4) →
`next.handle(req)` with no Bearer. Local MinIO uses **SigV2** (`AWSAccessKeyId/Expires/Signature`),
caught by `awsaccesskeyid=`.

**Bug 2 (exposed once Step 1 unblocked): create-response field drift.** Backend `[CODE]
CreateContactGroupResponse.cs:8` = `(string Id, int Status)` → JSON `{id,status}`. FE wire/mapper
read `groupId` → `sor.result` undefined → wizard success-guard `if (isSuccessful && result)`
(`create-contact-group.component.ts:512`) showed a FALSE "Failed to create contact group" on a real
201. Fixed: wire `id: string` + `create()` reads `res.result.id`.

**Why:** the upload bug blocked the whole wizard; the create-id bug would have blocked the final
Submit even after the upload fix — so "the entire flow" needed BOTH.

**How to apply:**
- [[feedback_falcon_ui_core_layout_traps]] sibling: **the mgmt/admin remote shares the host-shell
  ROOT injector at runtime** — remote `HttpClient` uses host-shell's interceptor chain (mgmt/admin
  app.config.ts register only `RuntimeBaseUrlInterceptor`, NOT a token interceptor). So a Bearer
  being added (400 multiple-auth, not 403 no-auth) PROVES host-shell's `RequestInterceptor` ran. One
  host-shell fix covers presigned uploads platform-wide. Presigned DOWNLOADS use browser navigation
  (not HttpClient) → never intercepted.
- When a presigned-storage request misbehaves, look at the host-shell interceptor, not the remote.
- MF-independent verification recipe (when dev servers are down/fragile): login :7777 → init
  :7038/contactgroup/.../uploads/init → PUT presigned **with no Authorization** (expect 2xx) +
  negative-control PUT **with** Bearer (expect 400) → complete → create → GET-by-id (NOT list — list
  projection lags / node-scoped, flaky). Script + evidence: `C:/falcon/qa/runs/cg-fullcycle/`
  (`verify-fix.mjs` exit 0 = PASS, `verdict-fix.md`). SigV2 signature is host-independent → safe to
  swap localhost→127.0.0.1 in the PUT URL to dodge IPv6.

**Still open:** full in-browser wizard E2E (dev servers :4200/:4301 were down). NO COMMITS by this
session — verification artifacts only; product fixes were already in the tree.
