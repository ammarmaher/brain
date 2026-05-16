---
type: verification-status
title: What's verified vs what's not — honest accounting
audience: future Claude / Ammar / Adnan sessions
created: 2026-05-16
status: living-document
purpose: "Answers 'which dataset claims are code-verified vs runtime-verified vs unverified + which still need exercise'. Open BEFORE trusting any dataset claim as runtime truth."
---

# Verification Status — Honest Accounting

> [!warning]
> **This document is more important than it looks.** Future sessions reading this dataset will see 118 artifacts and a 28-page polished PDF and assume everything is verified end-to-end. **It isn't.** This file distinguishes what was actually tested from what was only structurally checked. Read this BEFORE trusting any "the dataset says X" claim as runtime truth.

## TL;DR

The dataset is **structurally complete + PES backend gate runtime-verified (21/21 PASS, 2026-05-16) + FE-level rendering still blocked on dev-server poisoning**. The dataset's central authority claim — `acc-owner allow / acc-admin explicit-deny / acc-user deny` — has been runtime-confirmed at the PES API level for all 3 acc-* users against 7 PES queries each. **Still NOT verified**: the FE route guard's runtime enforcement (independent FE infrastructure issues — broken dev server + env wired to cloud, not docker). Build-green proves the code compiles. Runtime-verified now proves the authority layer works end-to-end at the API boundary.

## Verification levels glossary

| Level | What it means |
|---|---|
| 🟢 **Code-verified** | Read directly from source code with file:line citations. Cannot drift unless the source code drifts. |
| 🟢 **Build-verified** | The code compiles cleanly via `nx build`. Compiler accepts the types. No runtime claim. |
| 🟡 **Structurally checked** | The shape matches expectations (file count, frontmatter, links resolve). Did not exercise behavior. |
| 🟡 **Spot-checked** | A sample of cells/claims verified. Not every cell. |
| 🔴 **Unverified** | Asserted from agent output or pattern inference. May or may not match reality. |
| ✋ **Runtime-verified** | Actually ran in a browser/curl/CLI against a live stack. Behavior observed end-to-end. |

## What IS verified

### 🟢 Code-verified facts

| Claim | Source |
|---|---|
| 6 canonical roles + their PES rules | `BuiltInRoleCatalog.cs:79-290` |
| 47 PES key factories | `falcon-access.registry.ts:1-185` |
| Role-edit matrix structure | `BuiltInRoleCatalog.cs:18-75` |
| Tenant-scoped `p`-rules template | `pes-account-role-rules.json:1-97` |
| Seed-test-users credentials | `seed-test-users.sh:265-274` |
| 9 status enums | `Enums.cs` files in Identity / Commerce / Provisioning |
| JWT subject contract | `current-subject.builder.ts:27` + `PolicySubjectContract.cs` |
| Gateway routing per console | `app.config.ts` files |

### 🟢 Build-verified

| Artifact | Verification |
|---|---|
| `nx build management-console` after comms-hub port | GREEN (hash `e5a896fdae1d8f80`, 22.5s, lazy chunk 13.96 KB / 3.33 KB gzipped) |
| Scanner end-to-end | 3 passes (CheckOnly → drift → MarkChecked → clean) — all expected exit codes |
| Drift detection on real change | Caught the `app.routes.ts` mod immediately |

### ✋ Runtime-verified (2026-05-16) — backend PES gate

**21 of 21 PES decisions match the dataset's predictions exactly.** Direct API calls to live Identity (port 7777) + live PES (port 5296) with JWTs issued for the 3 acc-* test users. Full evidence: `_runtime-verification/comms-hub-2026-05-16.md` + `pes-gate-results-2026-05-16.json`.

| Layer | Verification | Result |
|---|---|---|
| Identity issues valid JWT for `accowner` / `accadmin` / `accuser` | POST `/api/auth/login` → 200 with `result.tokens.accessToken` | ✋ |
| JWT.sub = Zitadel user-id (not Mongo `_id`) | Decoded JWT payload — `sub` is the long Zitadel ID | ✋ |
| PES accepts subject format `u:<JWT.sub>@<tenant-id>` | Structured AuthRequest with `sub.kind = "u:<id>@<tenant>"` returned valid result | ✋ |
| `acc-owner` allow on 5 resources (mgmt-console / services / contract / org-hierarchy / contact-group) | All returned `true` | ✋ |
| `acc-owner` deny on `app.admin-console` + `sys.account.add` | Both returned `false` | ✋ |
| `acc-admin` allow on mgmt-console / org-hierarchy / account view | All returned `true` | ✋ |
| `acc-admin` **explicit deny** on services / contract / allowed-ips (per `BuiltInRoleCatalog.cs:227,240,237`) | All returned `false` | ✋ |
| `acc-user` only allow on contact-group + view-shared (unique) | Both returned `true` | ✋ |
| `acc-user` deny on services / contract / org-hierarchy | All returned `false` | ✋ |
| `app.admin-console.view` deny for all 3 acc-* users | All returned `false` | ✋ |

### 🟡 Structurally checked

| Item | Method |
|---|---|
| 118 dataset artifacts exist on disk | `find` + count verification |
| Vault wikilinks resolve | Regex extraction + filename-match audit (zero broken) |
| All 19 verification-gate questions answer from cited files | Self-tested by Read on the cited files |
| 25 V-rule files exist (not 26) | Glob count |
| 15 E-* entity files exist | Glob count |
| 180 BR-* rule count (BR-AM 42 + BR-UM 50 + BR-CC 50 + BR-CGM 38) | Spot-checked BR-CGM = 38 via Grep |

### 🟡 Spot-checked

| Spot-check | Outcome |
|---|---|
| Q11 (Add Client wizard V-rules) cold-answer | ✅ Matched dataset citations |
| Q14 (wallet-balance non-PES gates) cold-answer | ✅ Matched dataset citations |
| Q15 (acc-admin full inventory) cold-answer | ✅ Matched dataset citations |
| 3 of the 130 error codes traced to V-rule notes | ✅ All 3 matched |
| Capability-acc-admin contains both `BuiltInRoleCatalog.cs:line` AND `pes-account-role-rules.json:line` dual citations | ✅ Inspected, agent did not bluff |

### 🟢 Partial close-out (2026-05-16)

| Issue | Action taken | Status |
|---|---|---|
| `environment.ts` URLs wired to cloud (`https://*.falconhub.space`) | Briefly swapped to localhost during this session, then **reverted by user** to keep cloud URLs (intentional — staging cert workaround). Localhost URLs preserved as commented alternates inside the file. | 🟡 Reverted by design |
| Phase 5 scanner caught real drift on `mgmt-console/app.routes.ts` | Verified intentional (comms-hub route added) → MarkChecked sealed baseline → 67/67 clean | 🟢 Closed |

### 🔴 Remaining FE-runtime blocker (workspace-scope, NOT dataset-scope)

The mgmt-console `nx serve` produced **40+ pre-existing Stencil/Angular compile errors** across:
- `libs/falcon-studio/src/lib/components/*` (10+ files)
- `libs/falcon-ui-core/src/angular-wrapper/components/*` (35+ files — every angular wrapper of a Falcon UI Core component)
- `libs/falcon/src/shared-ui/lib/components/*` (5+ files)

Sample error: `tag missing in component decorator` — appears at every `@Component({ selector: 'falcon-angular-...' ... })` site. Symptoms: cascading errors throughout the workspace; Angular tooling cannot find tags it expects.

**This is NOT caused by the authority dataset or the comms-hub port.** It is a systemic workspace state issue requiring deep FE expertise — likely a Stencil/Angular metadata regeneration or a tsconfig drift. Closing it would require a senior FE engineer to:
1. Investigate the metadata generator that emits `@Component` decorators for Falcon UI Core wrappers
2. Trace why the `tag` field is being stripped
3. Reseed the generated files OR fix the upstream Stencil component metadata

**Implication for the dataset's verification status:**
- 🟢 Backend PES gate: **runtime-verified, 21/21 PASS** (closed end of session)
- 🔴 FE route guard + Falcon UI Core rendering + i18n + RTL: **cannot be runtime-tested until the workspace compile errors are resolved**. This is a workspace-level blocker, independent of dataset correctness.

**Tracked separately**: this is not a `Q-*` for the dataset; it's a workspace-state issue that needs a developer ticket.

## What is NOT verified

### 🔴 Runtime claims for comms-hub mgmt-console port

| Claim | Status | What would prove it |
|---|---|---|
| Route is reachable from host-shell at `/management-console/comm-mgmt` | 🔴 Unverified | Serve host-shell + mgmt-console, navigate, see the page |
| PES gate denies acc-admin at the route | 🔴 Unverified | Login as accadmin, attempt to navigate, expect redirect |
| PES gate denies acc-user at the route | 🔴 Unverified | Login as accuser, attempt to navigate, expect redirect |
| acc-owner lands on the page + sees rows | 🔴 Unverified | Login as accowner, see rendered table with channel rows |
| Endpoint `commerce/Node/{nodeId}/comm-channels/visible/details` exists in local backend | 🔴 Unverified | Run `docker compose up -d` + curl the endpoint with JWT |
| `<falcon-angular-data-table>` renders rows with the data shape supplied | 🔴 Unverified | Visual inspection of rendered page |
| `<falcon-angular-status-badge>` accepts the status values used | 🔴 Unverified | Visual inspection |
| `<falcon-angular-card>` lays out correctly | 🔴 Unverified | Visual inspection |
| Row-action menus gate on `row.allowedActions` correctly | 🔴 Unverified | Hover/click row menu as different users, verify actions match `allowedActions` array |
| i18n keys resolve in both en + ar locales | 🔴 Unverified | Switch locale at runtime, verify no missing-key fallbacks |
| RTL layout for Arabic doesn't break | 🔴 Unverified | Switch to ar locale, verify mirror layout |

### 🔴 Unverified agent-produced claims

| Cluster | Agent-claimed fact | Why I trust it but didn't verify |
|---|---|---|
| 13 — Error Catalog | "~130 error codes catalogued" | I spot-checked 3; not all 130 |
| 13 — Error Catalog | Per-feature code surfacing tables | Trusted agent; didn't trace every code to its surfacing feature |
| 14 — Flow Playbook Integration | "Add Client Step 5 partial-failure trap" | Inferred from Add Client playbook; not runtime-confirmed |
| 14 — Flow Playbook Integration | "Add User Tab 2 dropdown populated from POST /pes/authorize/resources" | Trusted agent; didn't inspect FE source |
| 15 — Implementation Pitfalls | 25 pitfalls × concrete file:line examples | Trusted agent; didn't open each old-ui-dataset file |
| 15 — Implementation Pitfalls | "13-command pre-port grep checklist" | Pattern looks correct but never executed |

### 🔴 Unverified workspace claims

| Claim | What I'd need |
|---|---|
| Host-shell properly mounts management-console at `/management-console/*` | Open `apps/host-shell/src/app/host-shell.routes.ts` (or wherever federation manifest is) |
| Authentication flow brings user to mgmt-console post-login | Test the full OIDC login round-trip |
| Local backend stack runs cleanly per `docker compose up -d` | Actually run it (per memory entry — was last verified 2026-05-16) |
| The current scaffolded mgmt-console has the required `app.config.ts` providers | Inspect the file post-port |

## What I'd verify if asked to runtime-test

The fastest path to runtime verification (≈45 min wall time):

```powershell
# 1. Bring up local backend
cd C:\Falcon\Falcon\falcon-essentials
docker compose up -d

# 2. Reseed test users (idempotent)
cd zitadel
./seed-test-users.sh

# 3. Serve host-shell + mgmt-console (separate terminals)
cd C:\Falcon\Falcon\falcon-web-platform-ui
nx serve host-shell
# (in another terminal)
nx serve management-console

# 4. Open http://localhost:4200 — login as accowner
#    Navigate to /management-console/comm-mgmt
#    Verify: page renders, table shows channel rows, row actions reflect allowedActions

# 5. Logout, login as accadmin
#    Navigate to /management-console/comm-mgmt
#    Verify: redirected to unauthorized (route guard denies)

# 6. Logout, login as accuser
#    Same: expect denied at route guard

# 7. Inspect Network tab — verify endpoint URL is `commerce/Node/{tenantId}/comm-channels/visible/details`
```

The Ammar QA-Web agent automates steps 4-6 with `mcp__Claude_in_Chrome__*` tools.

## How to consume the dataset given this verification state

| If you're going to… | Do this first |
|---|---|
| Make architectural decisions based on the dataset | Trust 🟢 code-verified facts. Verify 🔴 unverified claims before acting. |
| Port another feature using the 12-step recipe | Trust the recipe shape. Don't trust agent-produced compare-note cells without spot-checking. |
| Cite the dataset in a PR or doc | Cite with the verification level. "Per `01-roles/sys-admin.md` [code-verified]" is honest. "Per `15-implementation-pitfalls/PITFALLS.md` [agent-produced]" is also honest. |
| Build a feature whose authority gates matter for security | DO NOT trust the dataset alone. Verify the PES gate at runtime with real test users. Code-only verification is necessary but not sufficient for security-sensitive features. |
| Use the dataset to onboard a teammate | Show them this file FIRST. Don't let them assume "verified" without context. |

## Open items by trust level

### 🟢 Trust at face value
- 6 canonical roles + their seeded `p`-rules
- 47 PES key factories + namespace taxonomy
- 9 status enums + duplication/drift trap
- JWT subject contract
- Gateway routing per console
- 12-step copy recipe structure
- Scanner pipeline (verified working end-to-end)

### 🟡 Trust the structure, spot-check the cells
- Per-role capability maps (60 rows each — agent-produced, structure verified)
- V-rule × feature matrix (25 rules — list verified, cell applicability partly inferred)
- E-* × feature matrix (15 entities — counts verified, cells partly inferred)
- BR-* × feature matrix (180 rules — totals spot-checked, per-feature mapping partly inferred)
- Non-PES gates × feature matrix (6 gate types — definitions code-verified, per-feature presence inferred)
- Error catalog (130 codes — partial trace)

### 🔴 Verify before relying on
- Any runtime claim about comms-hub mgmt-console
- Agent-produced "X happens when Y" claims that haven't been runtime-tested
- The PRD Permission Sheet's contents (Tab 2 still uncaptured — Q-UM-07)
- PES catalog ↔ PRD sheet drift (Q-AM-16 still blocked)

## The honest one-paragraph self-assessment

I spent this session building a comprehensive dataset that answers 12 axes of questions about Falcon authority + validation + view-hide + porting. The structural work is solid: 118 artifacts, all source-prefixed, all cited, all internally consistent. The scanner enforces freshness on changes to 67 source files. I successfully ported `comms-hub` to mgmt-console and the build is green. **What I have NOT done is actually run any of it in a browser, logged in as any test user, or confirmed that the PES gates fire correctly at runtime.** The dataset is a high-confidence map; the runtime is unverified territory the map describes. Use the map; don't claim you've walked the path.

## See also

- `00-INDEX.md` — phase status
- `00-VERIFICATION-GATE.md` — 19 falsifiable questions (cold-answerable from dataset)
- `_pdf-build/build-pdf.js` — the regeneration command (use after any KNOWLEDGE-DUMP change)
- `falcon-wiki/scripts/INSTALL.md` — how to install the pre-push hook (gives the scanner teeth)
- Trigger phrase for revisit: **`runtime verify <feature>`** — would invoke the Ammar QA-Web agent to do steps 4-6 above

> If you read this and decide to skip runtime verification because the build is green, that's a real engineering tradeoff — make it intentionally, not by accident.
