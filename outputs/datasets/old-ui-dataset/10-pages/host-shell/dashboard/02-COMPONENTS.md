# Components — dashboard

## Tree
```
DashboardComponent (selector: app-dashboard)
└── (skeleton state when isLoading() === true)
    OR
└── (loaded state)
    ├── Stat cards (4 fixed)
    ├── Revenue bar chart (CSS-driven, 6 months)
    ├── Service status list (5 mock rows)
    └── Recent activity (5 mock rows)
```

## Per-component

### DashboardComponent
- File: `apps/host-shell/src/app/features/dashboard/dashboard.component.ts:34-177`
- Selector: `app-dashboard`
- Standalone: yes
- Imports: `CommonModule`
- Inputs / Outputs: none
- Services injected: `SessionProvider` (`@falcon`), `DestroyRef`
- ChangeDetection: `OnPush`
- State:
  - `isLoading = signal(true)` — switched to false after 1500ms `setTimeout`.
- Lifecycle:
  - `ngOnInit` schedules `setTimeout(() => isLoading.set(false), 1500)` and cleans up via `destroyRef.onDestroy(() => clearTimeout(timer))`.
- Getters:
  - `greeting` — returns `Good Morning` / `Good Afternoon` / `Good Evening` based on `new Date().getHours()`.
  - `userName` — returns `sessionProvider.session?.name || 'User'`.
  - `maxRevenue` — `Math.max(...revenueData.map(d => d.value))`.
- Methods:
  - `getBarHeight(value: number)` → percent for `[style.height.%]`.
  - `formatCurrency(value)` → `"$48K"` style.
  - `getStatusClass(status)` → `status--active` / `status--pending` / `status--inactive`.

### Internal mock data shapes (all defined in this file, lines 7-31)

#### StatCard
```typescript
interface StatCard {
  label: string;
  value: string;
  change: number;
  icon: string;
  color: 'primary' | 'success' | 'warning' | 'danger';
}
```

#### RecentActivity
```typescript
interface RecentActivity {
  action: string;
  target: string;
  time: string;
  icon: string;
  color: 'primary' | 'success' | 'warning' | 'danger';
}
```

#### ServiceStatus
```typescript
interface ServiceStatus {
  name: string;
  status: 'active' | 'pending' | 'inactive';
  usage: number;       // 0-100 percentage
}
```

#### RevenueData
```typescript
interface RevenueData {
  month: string;
  value: number;
}
```

### Template highlights (`dashboard.component.html`)
- Two top-level `<div class="dashboard" *ngIf="isLoading()">` and `<div class="dashboard" *ngIf="!isLoading()">` blocks.
- Skeleton state: arrays of `[1,2,3,4]` / `[1,2,3,4,5,6]` for `*ngFor` shimmer placeholders.
- Loaded state: stat cards with conditional positive/negative `<i class="pi pi-arrow-up/down">`, bar chart with `[style.height.%]` driven by `getBarHeight`, service-status list using `[class]="getStatusClass(svc.status)"` and `[style.width.%]="svc.usage"` for the bar fill.

### Falcon components used
None. Pure CSS + PrimeNG icon font (`pi pi-users`, `pi pi-check-circle`, `pi pi-wallet`, `pi pi-clock`, `pi pi-user-plus`, `pi pi-exclamation-circle`, `pi pi-arrow-up`, `pi pi-arrow-down`).

### Hardcoded mock data
- **statCards**: `[2,847 customers (+12.5%); 1,523 services (+8.2%); $48,295 revenue (-3.1%); 37 pending (-15.4%)]` (`dashboard.component.ts:71-100`).
- **revenueData**: Oct..Mar months with $32K..$48K values (`dashboard.component.ts:102-109`).
- **serviceStatuses**: WhatsApp 87%, Voice 64%, SMS 92%, AI pending, Email inactive (`dashboard.component.ts:123-129`).
- **recentActivities**: 5 hardcoded events with relative-time strings ("5 min ago", "23 min ago", "1 hr ago", "2 hrs ago", "3 hrs ago") (`dashboard.component.ts:131-167`).
