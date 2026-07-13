---
name: project_node_header_label_session_name_sub_fallback_2026_06_22
description: Node-header labels showing a numeric id = session.name falls back to Zitadel sub (access token has no name claim); fix = bind session.node.label first.
metadata: 
  node_type: memory
  type: project
  originSessionId: e487b5bf-73dd-495b-9b2b-826e65184e71
---

**Symptom:** A Falcon node-details header (e.g. mgmt Comm-Channels `/comm-mgmt`, Marketplace `/marketplace`) rendered a long number `373185575819149322` as the node name (avatar initial "3") instead of the account name, for client user `accowner`.

**Root cause (live-verified 2026-06-22, claude):** `SessionProvider.setFromToken` builds the session from the **ACCESS token** (`auth.service.ts` → `setFromToken(tokens.accessToken)`). For client users the access-token JWT carries **no `name` claim** — only `sub`, `client_id`, and `urn:zitadel:iam:user:metadata` (node-id/tenant-id/user-id/user-type). So `session-provider.service.ts:127` `name: decoded.name || decoded.sub || ''` falls back to the Zitadel **`sub`** (a numeric snowflake). The **ID token** DOES have `name:"Acc Owner"` / given_name / family_name, but the FE never decodes it. This sub-fallback is deliberate + spec-tested (`session-provider.service.spec.ts:184` expects `'only-sub'`), so do NOT change it at the root.

**Correct source = the org node label.** `getNode()` → `GET commerce/Node` returns `result[0] = {id:"000000000000000000a11001", label:"Test Tenant 001", ...}`; `SessionProvider.setNode` stores it (also persisted to localStorage, reloaded at bootstrap). Canonical node-header name resolution across the app is `node?.label ?? session.session?.name` (see `contact-groups-list.component.ts:385`, `contracts.service.ts:65`, `template-config-editor.component.ts:177`).

**Fix applied (FE-only, NO commits):** `comms-hub.component.ts` + `marketplace-applications.component.ts` (the two `<app-comm-mkt-view>` wrappers) changed `nodeName` from `signal(session.session?.name ?? null)` to a `computed(() => orgNode()?.label ?? session.session?.name ?? null)` where `orgNode = toSignal(session.node$, {initialValue: session.node})` (reactive for the async post-login getNode fetch). Result: header shows "Test Tenant 001", avatar "T". `nx build management-console` GREEN; both files eslint-clean; no specs reference them.

**Still-open siblings with the SAME root cause (flagged, NOT changed):** `templates-list.component.ts:475` (`name: session?.name || 'My Account'` feeds a node-header via `state.applyTree` — same node.label-first fix applies) and `dashboard.component.ts:29` (`userName` greeting — semantically the USER name, so proper fix is decoding the ID-token name, not node.label).

Related: this header lives in [[project_comm_mkt_view_node_details_section_adoption_2026_06_22]] (the comm-mkt-view now uses `<falcon-node-details-section>`, whose avatar initial derives from `[label]`). Gateway note: `accowner` is a CLIENT → core-gw :7038 works; system-gw :7256 returns 403 (by design). Live-UI user-gated.
