---
name: SignalR realtime + loader/skeleton handoff
description: Design handoff for the centralized SignalR realtime layer with loader/skeleton integration
type: project
originSessionId: 912e2dc2-3336-494c-8285-35d2646a4fce
---
🟠 PLAN-HANDOFF 2026-05-19. Design for a dynamic, centralized realtime layer in
falcon-web-platform-ui: SignalR 3-layer (transport/bus/facade), single `REALTIME_EVENTS`
control registry, loader reuse via `FalconLoaderService` (counter-based, per-signal
opt-in — NOT loader-on-every-signal), scoped loading regions with host-passed skeleton
`TemplateRef`, per-row data-table skeletons, and skeleton config.

**Decision locked:** skeleton config lives in the Loader Studio registry
(`libs/falcon-studio/.../registry/loader-studio/modules/skeleton.module.ts` — enrich it),
NOT in `configurations/falcon-defaults.json`.

**Blockers:** no backend SignalR hub exists; data-table `trackBy`/stable row id
unconfirmed; backend must echo a correlation id for region routing.

**Why:** the design + verified codebase facts must travel intact to the session that
continues this work.
**How to apply:** the full self-contained handoff prompt is at `C:\Falcon\session-swap.md` —
paste its "PROMPT FOR THE NEXT SESSION" section to start that session; it must plan first.
