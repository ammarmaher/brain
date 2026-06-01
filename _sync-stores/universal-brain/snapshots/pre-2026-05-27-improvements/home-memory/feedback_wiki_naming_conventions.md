---
name: Follow Falcon Wiki naming conventions for frontend structure
description: All new Falcon frontend code must match the Wiki's kebab-case, scope-based naming rules — not invented alternatives
type: feedback
originSessionId: 02a11723-953d-4f03-ab41-1be58f7e474b
---
**Rule:** Every Nx app/lib name, folder name, and import path alias in the Falcon frontend (v1 and v2) must follow the conventions defined in `falcon-wiki/Home/Software-Architecture-Design/Design-Patterns-&-Guidelines.md` and `falcon-wiki/Home/Software-Architecture-Design/Front-End-Architecture.md` section 5.14.

**Why:** The wiki is the architectural source of truth. Inventing parallel naming (e.g., `libs/platform/*`, `libs/design-system/*`, camelCase app names like `portalAdmin`) creates drift between docs and code, confuses agents that consult the wiki, and guarantees the next rewrite. The user explicitly confirmed on 2026-04-18 that the wiki must be followed.

**How to apply:**
- **Apps & libs use kebab-case.** `admin-console`, `management-console`, `host-shell`, `shell`. Never camelCase. If Nx's generator regex complains, fix the config (`--name=admin-console` + `--projectNameAndRootFormat=as-provided` in Nx 22), do not rename to camelCase.
- **Top-level lib structure** (mandatory):
  - `libs/core/{auth,http,config,state,notifications,error-handling}` — internal services, NOT visible to external SDK consumers
  - `libs/theme` — design tokens, Tailwind + PrimeNG theme, ThemeService
  - `libs/i18n` — LanguageService, translations
  - `libs/ui` — reusable UI components (primitives wrap PrimeNG), directives, pipes
  - `libs/utils` (singular, top-level) — non-Angular helpers
  - `libs/layout` — layout engine (default-layout, casual-layout, layout.service)
  - `libs/shared/{models,constants}` — typed models, DTO contracts, constants
  - `libs/host-bridge` — host↔micro-app messaging, HostContextService
  - `libs/federation` — module federation configs + microapp registry
  - `libs/sdk` — public contract published as `@falcon/sdk`
  - `libs/shared-assets` — logos, SVGs, JSON configs
- **TypeScript path aliases** follow `@falcon/<lib-name>`:
  - `@falcon/core/auth`, `@falcon/core/http`, `@falcon/theme`, `@falcon/i18n`, `@falcon/ui`, `@falcon/utils`, `@falcon/layout`, `@falcon/shared`, `@falcon/host-bridge`, `@falcon/federation`, `@falcon/sdk`
  - Apps: `@falcon/shell`, `@falcon/admin-console`, `@falcon/management-console`
- **Repo naming:** frontend workspace is `falcon-web-platform-ui` (v1) or `falcon-web-platform-v2` (current rebuild). Backend repos follow `falcon-{layer}-{service}-svc` (wiki §Repository Naming): `core` for business-critical, `int` for integration/gateway, `comm` for communication, `util` for utility.
- **Banned names for v2:** `libs/platform/*`, `libs/design-system/*`, `libs/shared/util` (singular, wrong level), `portalAdmin`, `portal-admin` (wiki uses `admin-console`). If any agent sees these, rename them.
