---
type: atlas-volume-graph-node
volume: 56
cluster: 10-pages
source: "[BRAIN-OUT] Brain Outputs/reports/night-shift/2026-05-17/BUSINESS-SCENARIOS-ATLAS-VOL-56-FRONTEND-ARCHITECTURE-SPECIALIST.md"
created: 2026-05-18
status: canonical-pending-code-verification
tags:
  - atlas/vol56
  - specialist/frontend
  - specialist/angular
  - specialist/nx
---

# Vol 56 — Frontend Architecture Specialist Guide

> Angular 20 NX monorepo · 3 apps · Module Federation · Falcon UI Core (Stencil ~60 components) · Tailwind v4 tokens-only · signals state · validations convention · wizard patterns.

## What's in it

17 sections:
- §1 The 3 apps (host-shell:4200, admin-console:4204, management-console:4301)
- §2 Module Federation topology (host + remotes)
- §3 Nx monorepo + libs structure
- §4 Falcon UI Core (~60 Stencil components catalog)
- §5 Theme system (token registry + dark mode dual-selector)
- §6 Component folder doctrine (canonical pattern)
- §7 Validations convention (FALCON_VALIDATIONS + per-component injection)
- §8 Service + Facade pattern
- §9 HTTP layer (`useGateway()` HttpContext + error pipeline)
- §10 Auth flow (OAuth2/OIDC + 4 Falcon custom claims)
- §11 State management (signals + state slices)
- §12 Wizard pattern (Add Client folder-form playbook)
- §13 i18n (en/ar JSON tree + RTL)
- §14 Routing & guards
- §15 PR review checklist (12 items)
- §16 Cross-references
- §17 6 new Q-FE-* questions

## Headline truths

> **3 apps** in Angular 20 NX monorepo · host-shell is Module Federation **host**, admin-console + management-console are **remotes**. **Falcon UI Core** (Stencil `<falcon-*>`) is the ONLY UI kit (no PrimeNG). **Tailwind v4 utilities only** — no SCSS, no component CSS, no hardcoded colors. **Tokens at SSOT** (`falcon-tailwind-tokens.css`) — codebase auto-reverts drift. **Dark mode** uses dual selector `.app-dark` + `data-theme='dark'`. **Validations** declared per-component, injected via factory tokens, registered in global `FALCON_VALIDATIONS`. **State** is signal-based slices (e.g., `SettingsTabStateSlice`). **Flow playbooks** (`Brain Outputs/understanding/pages/<page>/<flow>/`) are the implementation spec.

## See also

- [[FRONTEND_INDEX]] · [[FALCON_COMPONENT_INDEX]]
- [[WALLET-SPECIALIST-HUB]] · [[CAMPAIGNS-CHANNELS-SPECIALIST-HUB]] · [[USER-LIFECYCLE-SPECIALIST-HUB]] · [[PES-CATALOG-SPECIALIST-HUB]] · [[MARKETPLACE-PRICING-SPECIALIST-HUB]] — backend dependencies
- [[Vol 51 — Cross-BC Saga Map]] §V51-GATEWAYS — gateway-side concerns
- [[Vol 57 — Lookup Reference-Data Specialist]] — LookupService pattern detail
- [[ATLAS_MASTER_INDEX]]
