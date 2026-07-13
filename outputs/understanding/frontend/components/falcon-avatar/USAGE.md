# falcon-avatar — USAGE

## Real usage examples (active codebase)

### Example 1 — Account-logo header avatar (the live consumer)

`[CODE]` `apps/admin-console/src/app/features/wallet-balance-management/wallet-balance-management.component.html:63-69`:

```html
<falcon-angular-avatar
  class="shrink-0"
  size="md"
  shape="circle"
  [src]="headerImage() || undefined"
  iconName="building"
  [altText]="headerName() + ' Logo'">
</falcon-angular-avatar>
```

> This is the canonical real-world pattern: `[src]` resolves from a signal, falls back to `undefined` (never `""`), and `iconName="building"` is the generic stand-in when no logo exists. The `shrink-0` host utility keeps it from collapsing in a flex header. (No `initials` here because an account header prefers a generic building glyph over letters.)

### Example 2 — Image with initials fallback (recommended)

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

### Example 3 — Square org-hierarchy node avatar

```html
<falcon-angular-avatar
  [src]="node.logoUrl || undefined"
  [initials]="nodeInitials(node)"
  size="md"
  shape="square" />
```

### Example 4 — Icon fallback for system / generic accounts

```html
<falcon-angular-avatar iconName="user" size="md" shape="square" />
```

### Example 5 — With a presence indicator

```html
<falcon-angular-avatar
  [src]="user.photoUrl"
  [initials]="userInitials(user)"
  size="lg"
  [status]="user.isOnline ? 'online' : 'offline'" />
```

> Note: `[status]` is **user presence** (online/offline/busy/away). For account lifecycle (Active/Pending/Disabled) use `<falcon-angular-status-badge>`. There is no live-presence backend yet — do NOT wire `[status]` to a static value or it shows a permanently-stale dot.

## Recommended usage for NEW Angular pages

```html
<falcon-angular-avatar
  [src]="entity.imageUrl || undefined"
  [initials]="initialsOf(entity)"
  iconName="building"
  size="md"
  [shape]="entity.kind === 'node' ? 'square' : 'circle'"
  [altText]="entity.displayName" />
```

Defaults: `useTailwind=true`, `size='md'`, `shape='circle'`. Always pass the fallback chain (`src` + `initials` and/or `iconName`) so identity is never blank.

## Reactive Forms / ngModel

**N/A** — avatar captures no value (no CVA).

## Tailwind-only usage

- Layout / margin / `shrink-0` on the host `class=` are fine (the host is `inline-flex align-middle`).
- **Do NOT resize via Tailwind `w-`/`h-`/`text-*` utilities** — use the `size` prop so the initials font-size token scales with the disc.

## Token usage (per-instance override pattern)

Add a host class on the consumer, then mutate `--falcon-avatar-*` tokens in a CSS file scoped to that consumer:

```css
.client-avatar {
  --falcon-avatar-bg: var(--color-falcon-teal-500);
  --falcon-avatar-fg: white;
  --falcon-avatar-square-radius: 4px;            /* tighter corner */
  --falcon-avatar-status-online: var(--color-falcon-green-700);
}
```

```html
<falcon-angular-avatar class="client-avatar" shape="square" initials="AR" />
```

> Light DOM (`useTailwind=true`, default) picks the tokens up through the `:where()` selector chain; Shadow path inherits them through the boundary. Never hardcode hex / px inline.

## Bad usage to avoid

- **Do NOT** bind `[src]=""` (empty string) — pass `undefined` to trigger the initials fallback cleanly (avoids a stray `<img src="">`).
- **Do NOT** expect a 404'd image to fall back to initials — it will not; the broken-image graphic shows (GAP G1).
- **Do NOT** pass a full name (`"John Doe"`) as `initials` — compute 2 uppercase chars; 3+ overflow the disc.
- **Do NOT** use `[status]` for account lifecycle state — that is `<falcon-angular-status-badge>`'s job.
- **Do NOT** resize via Tailwind `w-`/`h-` utilities — use `size`.
- **Do NOT** hand-roll a raw `<img class="rounded-full">` for a node logo — adopt this component (org-hierarchy still uses raw `<img>`; this is the migration target).
- **Do NOT** add `CUSTOM_ELEMENTS_SCHEMA` on the host — the wrapper declares it internally.

## Import requirements (standalone component)

```ts
import { FalconAngularAvatarComponent } from '@falcon/ui-core';

@Component({
  standalone: true,
  imports: [FalconAngularAvatarComponent],
  ...
})
```

## Do / Don't

| Do | Don't |
|---|---|
| Provide `src` AND a fallback (`initials` and/or `iconName`). | Rely on broken-image rendering with no fallback. |
| Pass `undefined` (not `""`) for a missing `src`. | Bind `[src]=""`. |
| Limit `initials` to 2 uppercase chars. | Pass a full name. |
| Use `shape="square"` for nodes/accounts, `circle` for people. | Mix conventions arbitrarily. |
| Set `altText` for user/account images. | Skip altText (alt defaults to empty → silent). |
| Restyle via `--falcon-avatar-*` tokens. | Resize with Tailwind utilities / hardcode hex. |

## Consumer Sweep (2026-06-03)

`[CODE]` grep `falcon-angular-avatar` across `apps/` → **1 file** · across `libs/falcon/` → **0 files**:

- `apps/admin-console/src/app/features/wallet-balance-management/wallet-balance-management.component.html` (1 occurrence — header account-logo avatar).

> The Stencil tags `<falcon-avatar>` / `<falcon-avatar-tw>` appear additionally only inside `libs/falcon-ui-core` itself (generated `components.d.ts`, `web-types.json`, the wrapper, the token file) — not in feature code.
> **Drift correction:** the prior Wave-7 sweep (2026-05-17) reported **0** consumers. Adoption has begun (wallet-balance-management). The "showcase-only / zero adoption" framing is now stale — same correction class as B10 (status-badge/tag/card).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B11). Example 1 confirmed verbatim against live source (wallet-balance-management.component.html:63). Consumer Sweep re-run: 1 app file, 0 lib files. Examples 2-5 are recommended patterns (🟡 CODE-DERIVED from the API surface).
