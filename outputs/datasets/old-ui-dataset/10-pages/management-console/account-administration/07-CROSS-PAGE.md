# Cross-page dependencies — account-administration

## Inbound (this feature depends on)

### From `@falcon` (workspace library)
| Symbol | Used by | Role |
|---|---|---|
| `managementConsoleGuard` | `app.routes.ts` | App-level guard wrapping all routes |
| `shellAccessGuard` | `routes.ts` | Route-level PBAC guard |
| `FalconAccess.managementConsole.*` | container + 3 tabs | PBAC key namespace |
| `AccessControlFacade` | container + 3 tabs | Resolves PBAC flags asynchronously |
| `SessionProvider` | container + 3 tabs + InformationComponent | Current user session (`userType`, `tenantId`) |
| `TranslateService` / `TranslatePipe` | every component | i18n |
| `HttpService` | every service | HTTP wrapper with interceptor hooks |
| `useGateway` / `Gateway` | every service | Gateway-routing decorator (resolves to CoreGateway here) |
| `ServiceOperationResult<T>` | every service | API response envelope |
| `OrganizationHierarchyTreeComponent` | container | The org-hierarchy tree (renders `<falcon-organization-hierarchy-tree>`) |
| `FALCON_ROOT_NODE` | container + tree calls + apis | Sentinel for Falcon-user root |
| `USER_TYPE_STRINGS` | container + InformationComponent + tabs | `FALCON_USER` / `CLIENT_USER` constants |
| `DrawerComponent` (app-drawer) | container | Slide-in drawer for add/edit node |
| `FalconTableComponent` + `T2TableColumn` + `T2RowMenuAction` | hierarchy-tab + comm-channels-tab + apps-tab | Falcon data table |
| `FalconRowAction` + `FALCON_ACTION_REGISTRY` + `FALCON_ROW_ACTION_I18N_KEY` | comm-channels-tab + apps-tab | Row action enum/registry/i18n |
| `FalconItemStatus` + `FALCON_STATUS_I18N_KEY` | comm-channels-tab + apps-tab + AppServiceItem | Status enum |
| `FalconCalendarComponent` | comm-channels-tab + apps-tab | Effective-date picker |
| `FalconIconComponent` / `SvgIconComponent` | multiple | Icons |
| `FalconUploaderComponent` | InformationComponent | Profile picture upload |
| `FieldComponent` | InformationComponent | Form field wrapper |
| `FalconDividerComponent` | InformationComponent + NodeSettingsTab | Section divider |
| `FalconFormValidateDirective` | hierarchy-tab + node-settings-tab | Form validation display |
| `FalconStartWithLetterMax30Directive` | InformationComponent | Name field directive |
| `FalconIpAddressDirective` | NodeSettingsTab | IP field directive |
| `isValidIpv4` / `isValidIpv6` | NodeSettingsTab | IP validators |
| `Helper` | tabs + InformationComponent | enum-to-options, deepClone, date formatting, pricingType mapping |
| `Hook<T>` | InformationComponent + hierarchy-tab | Option type for selects |
| `PricingType` / `PricingTypeI18n` | apps-tab + comm-channels-tab + InformationComponent | Pricing enum |
| `PasswordSecurityLevel` / `PasswordSecurityLevelI18n` | NodeSettingsTab | Password level enum |
| `ClassificationCategory` / `ClassificationCategoryI18n` + `ClassificationSubCategory` / `ClassificationSubCategoryI18n` + `AuthorityLetterType` / `AuthorityLetterTypeI18n` | hierarchy-tab + InformationComponent | Account info enums |
| `LookupService` + `LOOKUP_IDS` + `LookupValueResponse` | InformationComponent | Country/City lookups |
| `UserStatus` | hierarchy-tab | Status badge |
| `SYSTEM_USER_ROLES` / `ACCOUNT_USER_ROLES` | org-hierarchy api | List filter roles |
| `OrgNodeAction` | container + tree | Context-menu action type |
| `TabComponentType` / `TabComponentTypeI18n` | tabs-layout | Tab enum + i18n |
| `ProcessState` + `OrderFailureReason` + `GetOrderStatusResponse` + `SimplePollService` + `OrderStatusService` | comm-channels-tab + apps-tab | Order polling after payment |
| `getCssVariable` | comm-channels-tab + apps-tab | CSS variable read for confirm dialog icon color |

### From PrimeNG
- `TreeNode` (`primeng/api`) — tree node type for the tree component
- `MenuItem`, `MessageService`, `ConfirmationService` — context menu, toast notifications, confirm dialogs
- `ContextMenu` + `ContextMenuModule` — right-click menu
- `InputText`, `TagModule`, `Skeleton`, `ButtonModule`, `RadioButtonModule`, `InputTextModule`, `InputNumberModule`, `ChipModule`, `TabsModule`, `ToggleSwitch`, `DialogModule`, `SkeletonModule`, `ToastModule`, `Select`, `AutoComplete`

### From app-shared (`apps/management-console/src/app/shared/`)
| Path | Used by | Role |
|---|---|---|
| `shared/components/insufficient-balance-priority-dialog/...` | comm-channels-tab + apps-tab | Priority drag-drop retry dialog |
| `shared/components/insufficient-balance-warning-dialog/...` | comm-channels-tab + apps-tab | Warning dialog |

## Outbound (other features depend on this)

### Tree picker reuse (CRITICAL — this feature owns the tree-fetch infrastructure)
| File | Imported by | What it gives |
|---|---|---|
| `org-hierarchy.api.service.ts` — `OrgHierarchyApiService` (providedIn: 'root') | contact-groups (`contact-groups.component.ts:19`) | `getRootNodes()`, `getChildren()` for the contact-groups left tree |
| `models/org-hierarchy.models.ts` — `OrgHierarchyNode` type | contact-groups (`contact-groups.component.ts:20`) | Domain node type |
| `utils/org-hierarchy.mapper.ts` — `mapOrgNodeToTreeNode` + `updateTreeNodeChildren` | contact-groups (`contact-groups.component.ts:21`) | OrgNode → PrimeNG TreeNode mapping |

### Commerce mutation surface reuse
| File | Imported by | What it gives |
|---|---|---|
| `tabs-layout/components/service/commerce-actions.service.ts` — `CommerceActionsService` (providedIn: 'root') | comms-hub (`comms-hub.component.ts:40`) + marketplace-applications (`marketplace-applications.component.ts:41`) | All 14 commerce mutation endpoints (visibility, price, payments, disables, deletes) |
| `tabs-layout/components/models/models.ts` — `DoPaymentApplicationRequest`, `DoPaymentCommunicationChannelRequest`, `CommChannelPriority` | comms-hub + marketplace-applications | Request DTOs |

## Shared state
- **Reads** session via `SessionProvider.session`:
  - `userType` (Falcon vs Client decision throughout)
  - `tenantId` / `client_id` / `node.id` (resolveAccountId in commChannels/apps tabs is *implicit* — they use `selectedNodeId` from prop instead, but the parent uses `sessionProvider.session?.userType`)
- **Writes** to global state: **none**.
- Per-component state is class-property + signals (see TabsLayoutComponent's signals for tab redraw).

## Navigation entry points
| From | URL | Triggered by |
|---|---|---|
| Sidebar / management-console menu | `/management-console/organization-hierarchy` | Direct nav |
| `/profile` page return | Browser back → restores via `history.state.selectNodeId` + `expandPath` | Profile breadcrumb / cancel |

## Navigation exit points
| To | Trigger | Source |
|---|---|---|
| `/profile?nodeId={userId}&orgNodeId={nodeId}` | Click user row | `organization-hierarchy.component.ts:417-434` (`onUserSelected`) |
| `/profile?mode=add-wizard&nodeId={nodeId}&orgNodeId={nodeId}` | Click "Add User" (toolbar or context menu) | `organization-hierarchy.component.ts:694-717` (`navigateToAddUser`) |

## Dependency Graph (textual)
```
account-administration (this feature)
    ├── @falcon (large surface — tree component, table, drawer, facade, http, session, i18n, pbac, helpers, enums)
    ├── PrimeNG (table widgets, dialogs, forms)
    ├── apps/management-console/src/app/shared (insufficient-balance dialogs)
    └── exports
        ├── OrgHierarchyApiService          ────► contact-groups (org tree)
        ├── mapOrgNodeToTreeNode/updateTreeNodeChildren  ────► contact-groups (tree mapping)
        ├── OrgHierarchyNode                 ────► contact-groups (type)
        ├── CommerceActionsService           ────► comms-hub + marketplace-applications (commerce mutations)
        └── DoPayment*Request + CommChannelPriority  ────► comms-hub + marketplace-applications (DTOs)
```
