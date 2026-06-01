---
type: visual-target
feature: comms-hub
purpose: "Answers 'what does comms-hub (mgmt-side) look like + which Falcon UI Core components compose it + which design tokens + what state visuals'. Open BEFORE writing UI code for comms-hub."
visual-source: old-UI-dataset + comms-hub.compare.md + ported code from this session
verified-at: 2026-05-16
---

# Visual Target — comms-hub (mgmt-console)

> [!tldr]
> Service-card list view. Each row = one communication channel (WhatsApp Business, Voice, AI, SMS, Email). Mgmt-side enriches admin's flat list with icon, subtitle, period, currency, and price display. Pay/Disable actions are per-row from `row.allowedActions`.

## Page layout structure

```
┌─────────────────────────────────────────────────────────┐
│  Header: Communication Management                       │ ← <falcon-page-header>
│  Breadcrumb: Home > Communication Management            │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Icon │ Name + Subtitle    │ Price/Period │ Actions │ │ ← rows in <falcon-angular-data-table>
│  ├──────┼────────────────────┼──────────────┼─────────┤ │   OR card grid (visual judgment per density)
│  │ 📱   │ WhatsApp Business  │ 50 SAR/mo    │ [⋮]     │ │
│  │      │ Send + receive...  │              │         │ │
│  │ 🎙️   │ Voice Service      │ 0.10 SAR/min │ [⋮]     │ │
│  │ 🤖   │ AI Assistant       │ Coming soon  │ -       │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  Empty state: "No communication channels available"     │
└─────────────────────────────────────────────────────────┘
```

## Primary component composition

| Slot | Falcon UI Core component | Notes |
|---|---|---|
| Page header | `<falcon-page-header>` (if exists) or Tailwind-styled `<header>` | Title + breadcrumb |
| List shape | `<falcon-angular-data-table>` — confirmed exists per ported `comms-hub.component.html` | Columns: icon · name+subtitle · price+period · actions |
| Status badge | `<falcon-angular-status-badge>` | Maps `eFalconServiceStatus` to color |
| Row card alternative | `<falcon-angular-card>` | If density preference is card grid |
| Action menu | Server-driven from `row.allowedActions` | No hardcoded action list |
| Confirmation dialog | `<falcon-angular-alert-dialog>` (per pitfalls cheatsheet) | For "Disable service?" confirmation |
| Empty state | `<falcon-empty-state>` if exists, else Tailwind-styled div | Show, don't hide (DECISION F-019) |
| Loading state | Skeleton rows | NOT spinner (DECISION F-020) |
| Error state | Inline + toast | Per FE-CONTRACT |

## Falcon design tokens (consumed)

| Token | Where used |
|---|---|
| `--falcon-spacing-md` | Row padding |
| `--falcon-spacing-lg` | Page header bottom margin |
| `--falcon-color-text-primary` | Service name |
| `--falcon-color-text-secondary` | Subtitle text |
| `--falcon-color-status-active` | Active service indicator |
| `--falcon-color-status-disabled` | Disabled service indicator |
| `--falcon-font-heading-2` | Page header |
| `--falcon-font-body` | Row content |
| `--falcon-radius-md` | Card corners |

(Exact token names from `libs/falcon-ui-core/src/tokens/` — verify by reading the lib's token CSS file before using.)

## Per-state visual spec

### Loaded state with data
- Rows visible
- Status badge color matches `eFalconServiceStatus`
- Pay button visible when `allowedActions.includes('payment')`
- Disable button visible when `allowedActions.includes('disable')`
- Price formatted as `{value} {currency.symbol}/{period}` (e.g. "50 SAR/mo")

### Loaded state empty
- `<falcon-empty-state>` or fallback div centered
- Message: `commsHubMgmt.emptyState` i18n key
- Icon: relevant communication icon (or generic empty inbox)
- NO call-to-action (Client cannot create channels — only Falcon staff can per `04-feature-parity-matrix/comms-hub.compare.md`)

### Loading state
- Skeleton rows (3–5 rows)
- Match the loaded layout shape
- Animated shimmer if Falcon UI Core supports it
- No spinner (DECISION F-020)

### Error state
- HTTP 401 → redirect to `/login` (FE-CONTRACT)
- HTTP 403 → toast "You don't have access to this page"
- HTTP 422 → inline error message above the table
- HTTP 500 → toast + retry button
- Display localized `errorMessages[0]` from `ServiceOperationResult<T>` (NEVER parse error codes)

### RTL Arabic layout
- Mirror horizontal axes
- Icon position: right side (was left)
- Action menu: left side (was right)
- Text alignment: right
- All Tailwind logical properties (`ps-*` / `pe-*` / `ms-*` / `me-*`) — NOT `pl-*` / `pr-*`

## Row action menu shape

- Trigger: `[⋮]` 3-dot button per row (Falcon convention)
- Menu items populated from `row.allowedActions: FalconRowAction[]`
- Per `acc-owner` capability: `['view', 'payment', 'disable']` allowed
- Per `acc-admin` / `acc-user`: empty (route guard denies before row gating)
- Confirmation dialog before `disable` action

## i18n key inventory

Required keys (en + ar):

| Key | en | ar |
|---|---|---|
| `commsHubMgmt.pageTitle` | "Communication Management" | "إدارة الاتصالات" |
| `commsHubMgmt.breadcrumb` | "Communication Management" | "إدارة الاتصالات" |
| `commsHubMgmt.col.name` | "Service" | "الخدمة" |
| `commsHubMgmt.col.price` | "Price" | "السعر" |
| `commsHubMgmt.col.actions` | "Actions" | "الإجراءات" |
| `commsHubMgmt.action.pay` | "Pay" | "ادفع" |
| `commsHubMgmt.action.disable` | "Disable" | "تعطيل" |
| `commsHubMgmt.emptyState.title` | "No services available" | "لا توجد خدمات متاحة" |
| `commsHubMgmt.emptyState.message` | "Contact your administrator to enable services" | "اتصل بمسؤول النظام لتفعيل الخدمات" |
| `commsHubMgmt.confirm.disable.title` | "Disable {serviceName}?" | "تعطيل {serviceName}؟" |
| `commsHubMgmt.confirm.disable.message` | "This will stop active service for all users." | "سيؤدي هذا إلى إيقاف الخدمة لجميع المستخدمين." |
| `commsHubMgmt.error.loadFailed` | "Could not load services" | "تعذر تحميل الخدمات" |

(See `libs/falcon/src/language/i18n/{en,ar}.json` for the actual ported keys.)

## Density / spacing

- Per noor-instructions-skill: comfortable density (not compact)
- Row height: ~64–72px including padding
- Icon size: 40×40px (medium)
- Vertical gap between rows: 1px border separator
- Page padding: `var(--falcon-spacing-lg)` (~24px)

## Things that look right vs wrong

✅ **Right:**
- Icon on the leading edge (left in LTR, right in RTL)
- Subtitle below name in smaller, secondary color
- Price + period grouped on the trailing edge with a thin separator
- 3-dot menu only visible on hover (or always on mobile)
- Empty state centered with icon + 2-line message

❌ **Wrong:**
- Tight `py-1` rows (looks cramped)
- Hardcoded `bg-green-500` for status (use token)
- PrimeNG components (ANTI-PATTERN #2)
- `<i class="pi pi-cog">` icons (ANTI-PATTERN #3)
- Spinner during initial load (use skeleton — DECISION F-020)

## Reference materials

- **Old-UI dataset**: `Brain Outputs/datasets/old-ui-dataset/10-pages/admin-console/comms-hub/02-COMPONENTS.md` — describes the admin-side
- **Mgmt-side diff**: `Brain Outputs/datasets/old-ui-dataset/10-pages/management-console/_diffs/comms-hub.diff.md` — the enrichment
- **Authority compare**: `Brain Outputs/datasets/authority-dataset/04-feature-parity-matrix/comms-hub.compare.md`
- **Screenshots to capture** (humans): `<this-folder>/comms-hub.screenshot.{old-ui-admin,old-ui-mgmt,new-mgmt}.png` — not yet captured

## Cross-references

- [[../SPEC-PROTOCOL]]
- [[../DECISION-PROTOCOL]] — F-019 (empty-state), F-020 (loading-state), F-016/17/18 (anti-patterns)
- [[../../04-feature-parity-matrix/comms-hub.compare]]
- [[../../05-capability-maps/acc-owner.capability]] — who can pay/disable
