# Validations — dashboard

## Form validators (sync)
None. No forms.

## Async validators
None.

## Business rules captured in code

### Greeting time-of-day rule (`dashboard.component.ts:50-55`)
```typescript
get greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
}
```
- Local browser time. No i18n key — hardcoded English strings. Would need `TranslateService` lookups in a real build (`dashboard.greetings.morning/afternoon/evening`).

### Bar height calculation (`dashboard.component.ts:115-117`)
- `getBarHeight(value)` → `(value / maxRevenue) * 100`. Normalizes against the maximum of `revenueData`.

### Usage-bar tier (`dashboard.component.html:142-144`)
- `>= 80%` → `service-item__bar-fill--high`
- `>= 50% && < 80%` → `service-item__bar-fill--mid`
- `< 50%` → `service-item__bar-fill--low`
- Pure CSS tier, no business meaning.

### Currency format (`dashboard.component.ts:119-121`)
- `formatCurrency(value)` → `"$" + (value / 1000).toFixed(0) + "K"`. Hardcoded `$` and `K` suffix; no locale awareness.
