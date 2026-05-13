# falcon-avatar — USAGE

## Real usage examples
**Zero matches in `apps/`.** Examples below are recommended patterns.

## Recommended usage for new pages

### Image with initials fallback
```html
<falcon-angular-avatar
  [src]="user.photoUrl"
  [initials]="userInitials(user)"
  size="md"
  shape="circle"
  [altText]="user.fullName" />
```

```ts
userInitials(user: User): string {
  return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
}
```

### Initials-only (no image available)
```html
<falcon-angular-avatar
  initials="JD"
  size="sm" />
```

### Icon fallback for system / generic accounts
```html
<falcon-angular-avatar
  iconName="user"
  size="md"
  shape="square" />
```

### With status indicator
```html
<falcon-angular-avatar
  [src]="user.photoUrl"
  [initials]="userInitials(user)"
  size="lg"
  [status]="user.isOnline ? 'online' : 'offline'" />
```

### Square org-hierarchy node avatar
```html
<falcon-angular-avatar
  [src]="node.logoUrl"
  [initials]="nodeInitials(node)"
  size="md"
  shape="square" />
```

## Reactive forms / ngModel
N/A.

## Tailwind-only usage
- Layout: apply `class="block"` on host if needed.
- Margin: free on host.
- DON'T resize via Tailwind utilities — use the `size` prop.

## Token override
```css
.brand-avatar {
  --falcon-avatar-bg: var(--color-falcon-teal-500);
  --falcon-avatar-fg: white;
  --falcon-avatar-radius: 8px;     /* override circle to rounded square */
  --falcon-avatar-status-online: var(--color-falcon-green-700);   /* deeper status color */
}
```

## Bad usage to avoid
- Don't omit `altText` when using `src` — alt is empty string by default. Screen readers announce nothing.
- Don't use this for arbitrary images — it forces a circle/square geometry.
- Don't pass long initials (3+ chars) — they overflow the container.
- Don't expect auto-fallback on image load error — `<img onerror>` isn't wired.

## Import requirements
```ts
@Component({
  standalone: true,
  imports: [FalconAngularAvatarComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
```

## Do / Don't

| Do | Don't |
|---|---|
| Provide `initials` AND `src` (fallback chain) | Skip initials and rely on broken image rendering |
| Limit initials to 2 chars | Pass full names ("John Doe") |
| Use `shape="square"` for org / account avatars | Use `shape="circle"` for company logos |
| Use `altText` for screen-reader name | Skip altText for user avatars |
| Compute initials from `firstName.charAt(0) + lastName.charAt(0)` | Use raw email or full name as `initials` |
