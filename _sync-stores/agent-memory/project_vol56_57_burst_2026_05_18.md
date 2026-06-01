---
name: Vol 56 + Vol 57 (Frontend Architecture + Lookup/Reference-Data)
description: Two specialist Atlas volumes documenting the Angular 20 NX monorepo + Falcon UI Core stack, and the Lookup/Reference-Data infrastructure (Mongo Lookups + LookupValues + LookupService FE pattern + phone-number 7-step identification)
type: project
originSessionId: f6ecc776-1773-4495-92d7-3bd75ebceecd
---
# Vol 56 + Vol 57 Burst — 2026-05-18

**Status:** 🟢 LANDED 2026-05-18 (Waves 27-28 autopilot).

## What landed

- `Brain Outputs/.../BUSINESS-SCENARIOS-ATLAS-VOL-56-FRONTEND-ARCHITECTURE-SPECIALIST.md` — 17 sections
- `Brain Outputs/.../BUSINESS-SCENARIOS-ATLAS-VOL-57-LOOKUP-REFERENCE-DATA-SPECIALIST.md` — 14 sections
- 2 Obsidian graph nodes
- Atlas Index + MEMORY updated

## Vol 56 — Frontend Architecture Specialist

Headlines:
- **3 apps** in Nx monorepo: host-shell (4200, MF host), admin-console (4204, remote), management-console (4301, remote)
- **Falcon UI Core** = ~60 Stencil components; the ONLY UI kit
- **Tailwind v4 utilities only** — no SCSS, no component CSS, no PrimeNG
- **Token SSOT** at `libs/falcon-theme/src/falcon-tailwind-tokens.css` with auto-revert protection
- **Dark mode dual-selector**: `.app-dark` + `data-theme='dark'`
- **Signals state** (no NgRx) — per-feature state slices
- **Validations convention** — `FALCON_VALIDATIONS` global registry + per-component InjectionToken factories
- **Wizard pattern** — folder-form playbooks at `Brain Outputs/understanding/pages/<page>/<flow>/` (17 files for Add Client)
- **`useGateway()` HttpContext** routes via Core or System Gateway based on user role
- **4 custom Zitadel claims** (user-id, user-type, tenant-id, node-id) populate `CurrentUser` signal

6 open Q-FE-* questions (signals-vs-NgRx canonical, adminConsoleGuard, Module Federation URLs, Falcon UI Core upgrade plan, dark-mode 3-way Settings, RTL testing).

## Vol 57 — Lookup & Reference-Data Specialist

Headlines:
- **Two Mongo collections** in Provisioning: `Lookups` (registry) + `LookupValues` (data)
- **Hierarchical** via `parentValueId` (City → Country)
- **Multi-language** via `MultiLanguageName(En, Ar)`
- **FE `LookupService`** — `getLookup(lookupId, options)` returning `Hook<LookupValueResponse[]>`
- **Per-country city lookup** (NOT all-cities-once) — scales for large catalogs
- **KSA mobile = 2-digit NDC** (50, 51, 53, 54, 55, 56, 57, 58, 59) — 9 operator allocations
- **NANP (CC=1) NOT subdivisible** fixed-vs-mobile by NDC alone
- **Universal length 7-15 digits** (E.164 ceiling)
- **Service phone numbers EXCLUDED** from scope (premium/toll-free/short codes)
- **7-step identification algorithm**: CC → mobile NDC OR fixed NDC → length validation → account-level eligibility

5 open Q-LU-* questions (cache invalidation, admin UI, full inventory, Provider mapping schema, lookup-id namespace).

## Background agents running

| Agent | Wave | Producing |
|---|---|---|
| Web Platform UI | 29 | `WAVE-29-CODE-MINING-WEB-PLATFORM-UI.md` (will produce Vol 56 addendum) |
| Observability + Telemetry | 30 | `WAVE-30-CODE-MINING-OBSERVABILITY.md` (will feed Vol 58 Observability Specialist) |

## Total Atlas state

- **57 volumes** (Vols 1-57)
- **5 Specialist Hubs** (Wallet, Campaigns, User-Lifecycle, PES, Marketplace)
- **5 code-verified volumes** (Vol 45, 47, 50, 51 ×3, 55 cross-ref)
- **9 task chips spawned** (3 Identity bugs, 2 Provisioning gaps, 5 PES drifts bundle + 1 CRITICAL test, 1 IP-allowlist gateway/identity reconciliation, 1 OTP-spam)

## Trigger phrases

- `vol 56 frontend architecture` / `nx monorepo 3 apps`
- `vol 57 lookup reference data` / `Lookups LookupValues Mongo`
- `falcon UI core 60 components`
- `module federation host shell`
- `tailwind tokens auto-revert`
- `signals state slices`
- `LookupService getLookup`
- `KSA mobile NDC operators`
- `E.164 7-step identification`
