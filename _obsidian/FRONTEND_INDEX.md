# Frontend Index

This index is auto-updated by Brain SK TouchBase and report generation.

## Latest

### 2026-05-13 · Frontend / Falcon component discovery (first-pass)

- [FRONTEND_WORKSPACE_MAP](../outputs/understanding/frontend/FRONTEND_WORKSPACE_MAP.md) — apps + libs tables, Module Federation share rules
- [FALCON_COMPONENT_REGISTRY](../outputs/understanding/frontend/FALCON_COMPONENT_REGISTRY.md) — **58-row registry** (47 Stencil pairs + 49 Angular wrappers + 7 legacy bespoke)
- [TAILWIND_TOKEN_MAP](../outputs/understanding/frontend/TAILWIND_TOKEN_MAP.md) — ~264 `@theme` tokens across 14 categories
- [FRONTEND_STRUCTURE_REPORT](../outputs/understanding/frontend/FRONTEND_STRUCTURE_REPORT.md) — Angular conventions, signals/zoneless/control-flow status
- [ANGULAR_AND_TAILWIND_RULES](../outputs/understanding/frontend/ANGULAR_AND_TAILWIND_RULES.md) — Tailwind-only rules + hard prohibitions

### Deep component dossiers

| Component | Folder |
|---|---|
| `falcon-input` | [folder](../outputs/understanding/frontend/components/falcon-input/) |
| `falcon-dropdown` | [folder](../outputs/understanding/frontend/components/falcon-dropdown/) |
| `falcon-table` | [folder](../outputs/understanding/frontend/components/falcon-table/) |

### Snapshot
- 3 apps: `host-shell` (4200, host) · `admin-console` (4204, remote) · `management-console` (4301, remote)
- 9 libs: `falcon`, `falcon-ui-core`, `falcon-ui-tokens`, `falcon-theme`, `falcon-studio`, `falcon-ui-react`, `falcon-ui-vue`, `falcon-ui-showcase-data`, `sdk`
- Angular 21.2.9 · zoneless · Tailwind v4 · standalone components · CVA on every form control · zero PrimeNG
- HIGH deviation: `adminConsoleGuard` commented out in `apps/admin-console/src/app/app.routes.ts:7`
