# DIFF — comms-hub (management-console vs admin-console)

> Mgmt-console version: `apps/management-console/src/app/features/comms-hub/`
> Admin-console version: `apps/admin-console/src/app/features/comms-hub/`

## Routing diff
| Path | Admin-console | Management-console | Why |
|---|---|---|---|
| Comms hub root | `comm-mgmt` (single route, no children) | `comm-mgmt` parent with **3 redirected children** + parent shows `CommsHubComponent` | Mgmt-console reserves child slugs (`whatsapp-business`, `voice-service`, `ai`) that all redirect to `/not-found` for now — placeholders for future child pages |
| Route loader | `loadComponent: () => import(...)` (lazy) | `component: CommsHubComponent` (synchronous import) | Mgmt-console uses eager component imports across all features |
| Guard PBAC key | **No `data.access`** on admin route (relies only on `shellAccessGuard`) | `data.access = FalconAccess.managementConsole.services.view()` | Mgmt-console gates the parent route on the services-view permission |
| Module Federation | admin-console exposes its own route table | mgmt-console exposes its own | Both are remotes; the host chooses which is mounted at `/admin-console/*` vs `/management-console/*` |

## Component diff
- **Same** primary component: `CommsHubComponent` — both versions have identical card/list view logic, identical insufficient-balance dialog wiring, identical filter options.
- **Mgmt-console adds 3 sub-component files** (`whatsapp-business.component.ts`, `voice-service.component.ts`, `ai.component.ts`) under `components/` — imported by `routes.ts` but the routes redirect away from them. Stubs/placeholders for future child pages.
- Both versions resolve account ID from session: `session.tenantId || session.client_id`.

## Service / API diff

### List endpoint differs
| Method | Admin-console URL | Management-console URL | Why |
|---|---|---|---|
| GET | `commerce/Node/{nodeId}/comm-channels` (`admin-console/features/comms-hub/services/comms-hub.service.ts:31`) | `commerce/Node/{nodeId}/comm-channels/visible/details` (`management-console/features/comms-hub/services/comms-hub.service.ts:22`) | Mgmt-console fetches the **visibility-filtered list with priority/payment details** (matches what Client users should see); admin-console pulls the full unfiltered list for management |

### Different gateway routing
- **Admin-console** → defaults to `Gateway.SystemGateway` (set in `apps/admin-console/src/app/app.config.ts:52`). Service Gateway routes `/commerce/*` to System Gateway.
- **Management-console** → defaults to `Gateway.CoreGateway` (set in `apps/management-console/src/app/app.config.ts:52`). Routes `/commerce/*` to Core Gateway.

Both call `useGateway()` with no argument → inherits the app default.

### Mutation endpoints — SAME (both use `CommerceActionsService`)
Both versions import `CommerceActionsService` from `account-administration/organization-hierarchy/components/tabs-layout/components/service/commerce-actions.service.ts` to call `enableCommChannel`, `disableCommChannel`, `doPaymentCommChannel`. URLs and DTOs are identical.

## DTO diff
- `CommChannelServiceItem` interface — admin-console version is similar (same core fields) but the **mgmt-console version has more optional UI fields**: `subtitle`, `description`, `iconClass`, `iconSvg`, `iconUrl`, `pricePeriod`, `currency`, `showDates`, `showPrice` (`management-console/features/comms-hub/models/models.ts:13-52`). Admin-console keeps it leaner.
- `toFalconItemStatus` enum mapper — identical
- `pricingType` value handling — mgmt-console maps to `'--'` if unknown; admin-console maps to `PricingType.Monthly` default. Subtle UX divergence.

## PES diff
| Aspect | Admin-console | Management-console | Why |
|---|---|---|---|
| Route guard PBAC key | — (none set explicitly) | `FalconAccess.managementConsole.services.view()` | Mgmt requires the services-view permission to access the route |
| Component-level flags | None inside the component (mutations are gated by row's `allowedActions` from backend) | Same — relies on backend `allowedActions` array | Both use the same backend-driven row gating |

**Permission namespace**: admin uses `adminConsole.*`; mgmt uses `managementConsole.*` — that's the universal diff across the platform.

## Other architectural diff
- Both apps are **module-federation remotes**. They are NOT hosts of each other. The host-shell mounts both at different paths.
- Mgmt-console `comms-hub` is part of the **6 routes registered at the top of `app.routes.ts`** with placeholder child routes for `whatsapp-business`/`voice-service`/`ai`. Admin-console comms-hub has no child routes.
- Mgmt-console `comms-hub` references session-derived `accountId` for payment dialog (`session.tenantId || session.client_id` — typical Client user identifier). Admin-console version's account-id resolution path is essentially the same code; the upstream call goes to a different gateway as listed above.
