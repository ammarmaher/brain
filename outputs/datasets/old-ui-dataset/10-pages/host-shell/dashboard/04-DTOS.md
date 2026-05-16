# DTOs — dashboard

## Internal interfaces (no backend mapping)

### StatCard (`dashboard.component.ts:7-13`)
```typescript
interface StatCard {
  label: string;
  value: string;
  change: number;
  icon: string;
  color: 'primary' | 'success' | 'warning' | 'danger';
}
```

### RecentActivity (`dashboard.component.ts:15-21`)
```typescript
interface RecentActivity {
  action: string;
  target: string;
  time: string;
  icon: string;
  color: 'primary' | 'success' | 'warning' | 'danger';
}
```

### ServiceStatus (`dashboard.component.ts:23-27`)
```typescript
interface ServiceStatus {
  name: string;
  status: 'active' | 'pending' | 'inactive';
  usage: number;       // 0-100 percentage
}
```

### RevenueData (`dashboard.component.ts:29-32`)
```typescript
interface RevenueData {
  month: string;
  value: number;
}
```

All four are file-scoped (not exported). Source comment at line 5 acknowledges:
> "Mock data interfaces (move to models file when backend is ready)"

No request DTOs. No response DTOs. No shared types.
