---
name: Falcon — Organization Hierarchy Migration (PrimeNG → Falcon Tailwind)
description: ACTIVE 2026-05-09 NIGHT TASK — autopilot 9-wave migration. Old PrimeNG impl PRESERVED in parallel behind feature switch. Wave 1 audit dispatched first; Wave 2-9 follow. Add Client / Add User flows integrated with new tree.
type: project
originSessionId: 98cf4816-3d55-4d97-8437-0aa3f7c9cbe3
---
**Status 2026-05-09:** ACTIVE NIGHT TASK · AUTOPILOT — Wave 1 audit dispatched first. Wave 2-9 chain queued.

## Goal

Rebuild Organization Hierarchy tree/menu and its consumers (Add Client, Add User) using Falcon Tailwind components only. PrimeNG/PrimeIcons forbidden in new path. Old implementation preserved untouched, runs in parallel behind a feature switch.

## Plan file

`C:\falcon\falcon-web-platform-ui\WAVE-ORG-HIERARCHY-PLAN.md` — full 9-wave decomposition + acceptance criteria + report requirements.

## 9-wave chain

- **Wave 1** — Full audit + component mapping (READ-ONLY). Produces `WAVE-ORG-HIERARCHY-AUDIT.md`.
- **Wave 2** — API + data mapping. Reuse existing services; thin adapter only if necessary.
- **Wave 3** — Core custom Falcon Tailwind tree/menu. Reuse `falcon-tree-tw` if it fits; otherwise build custom from primitives.
- **Wave 4** — Node actions + right-click context menu + Iconify Solar Linear (replacing PrimeIcons).
- **Wave 5** — Right-side modal/panel + forms + validations. (User clarified: NO drawer component — reuse modal/panel from right side.)
- **Wave 6** — Add Client / Add User integration. Feature-flag-gated parallel paths.
- **Wave 7** — State preservation, refresh, UX parity.
- **Wave 8** — Visual polish + Tailwind token parity + light/dark.
- **Wave 9** — A11y (role=tree/treeitem, aria-*, keyboard nav), perf (trackBy, no rerender churn), testing (deep hierarchies, long labels, all states, both consumer flows). Final report.

## Hard rules (locked)

1. DO NOT delete the old PrimeNG implementation — preserve untouched behind a feature switch.
2. Tailwind variants only (`[useTailwind]="true"` or `-tw` Stencil). Document why if a fallback is genuinely needed.
3. No PrimeNG, no PrimeIcons, no third-party UI deps in new path.
4. Real APIs only (reuse existing services).
5. Token SSOT (`falcon-tailwind-tokens.css`).
6. Iconify Solar Linear set throughout.
7. No new SCSS files.
8. No dev-serve.
9. Build green-gated, 2-retry max per agent.
10. Self-verify before reporting GREEN.

## Brain mindsets

- Claude — architecture + implementation planning + code review
- Codex/ChatGPT — deep code search via ammar-web-platform-ui specialist
- Gemini — deferred (user runs nx serve)

## Skills as standing context

`noor-instructions` (CRITICAL — Admin Console scope) · `angular-tailwind-primeng` · `nx-workspace` · `nx-module-federation` · `official-angular` · `design-eng` · `polish` · `ui-ux-pro-max`

## Cross-session resume

1. `WAVE-ORG-HIERARCHY-PLAN.md` (project root)
2. `WAVE-ORG-HIERARCHY-AUDIT.md` (after Wave 1)
3. Memory: this file
