# falcon-avatar — GAPS AND UPGRADES

## Missing capabilities

### P1 — No image-load-error fallback
If `src` is set but the image 404s, the broken-image graphic shows. The component does NOT automatically fall back to `initials` → `iconName`. The render fallback chain is COMPILE-TIME (only ONE of src/initials/iconName renders), not RUNTIME.

**Proposed:**
- Listen for `<img onerror>` → swap to initials/icon.

**Priority: P1** — UX expectation.

### P1 — No multi-avatar group / stack
Common UX: "Members: [avatar1] [avatar2] [avatar3] +5 more". Today the consumer wraps multiple `<falcon-angular-avatar>` manually with `-ml-2` overlap.

**Proposed:** companion `<falcon-angular-avatar-group>` component, or a `[stackMode]` flag with `[users]` array.

**Priority: P1**

### P1 — No `alt` on initials
Initials-mode renders `<span>{initials}</span>` — screen readers read it as "JD" not "John Doe". Should also support a `[name]` prop that drives `aria-label` for the host.

**Proposed:**
```ts
@Input() name?: string;  // when set, used as aria-label on the root
```

**Priority: P1**

### P2 — No verified / pending status
Status is `online | offline | busy | away`. Other useful states: `verified`, `pending`, `vip`, etc.

**Priority: P2**

### P2 — No automatic initials calculation
Consumers must compute initials manually. A `[name]="user.fullName"` input that auto-extracts could simplify.

**Proposed:** `[name]` input that auto-computes initials when `initials` not provided.

**Priority: P2**

### P3 — No `onClick` / `[clickable]` mode
For avatar-as-button patterns ("Click to expand"), no native click events.

**Priority: P3**

### P3 — No `borderColor` token
Avatars next to other UI elements often need a border ring (e.g. "verified" rings). Not currently exposed.

**Priority: P3**

## Missing flags / options / states
- Image-error fallback.
- Avatar group / stack mode.
- `name` for aria-label + auto-initials.
- Extended status types.
- Clickable mode.
- Border ring.

## Missing accessibility features
- Initials mode has no `aria-label` linking to the user's name (P1 above).
- The avatar's `role` is not set — it's a `<div>`. For decorative avatars this is fine, but for clickable avatars it should be `role="button"` or `<button>`.

## Missing tests
- No `.spec.ts`.
- No e2e for status dot positioning across sizes.

## Missing Tailwind / token parity
- Light + Shadow renderers should match.

## Performance risks
- None.

## Visual / interaction risks
- The fallback chain is strict — `src=null` shows the next fallback, but `src=""` (empty string) still renders an `<img src="">` element which may break layouts.
- Initials don't auto-color based on name (e.g. consistent hash-color) — every avatar shows the same teal bg.
- Status dot has fixed bottom-right positioning — for square avatars with rounded corners (radius 8px), the dot may overlap the rounded corner.

## Reusable upgrades needed
1. **Image-error fallback** (P1).
2. **Avatar group / stack** (P1).
3. **`name` input for aria-label + auto-initials** (P1).
4. **Hash-based initial bg color** (consistent per-user color) (P2).
5. **Clickable mode** (P3).
6. **Border ring token** (P3).

## Priority: page-level vs shared
All shared.

## Recommended upgrade API (proposed)

```ts
@Component({ selector: 'falcon-angular-avatar', ... })
export class FalconAngularAvatarComponent {
  @Input() src?: string;
  @Input() initials?: string;     // overrides auto-calculated from name
  @Input() iconName?: string;
  @Input() name?: string;          // new — used as aria-label + auto-initials fallback
  @Input() size: FalconAvatarSize = 'md';
  @Input() shape: FalconAvatarShape = 'circle';
  @Input() status?: FalconAvatarStatus;
  @Input() altText?: string;       // for image alt
  @Input() colorHash = false;      // new — auto-color initials bg by hashing name
  @Input() clickable = false;      // new — render as <button>
  @Output() falconClick = new EventEmitter<MouseEvent>();   // new
  @Input() useTailwind = true;
}

// Companion component (Tier 1)
@Component({ selector: 'falcon-angular-avatar-group', ... })
export class FalconAngularAvatarGroupComponent {
  @Input() avatars: FalconAvatarData[] = [];
  @Input() max: number = 5;       // shows +N pill if exceeded
  @Input() size: FalconAvatarSize = 'md';
  @Input() spacing: 'tight' | 'normal' = 'normal';
}
```

## Future-proof recommendation
The **image-error fallback** (P1) is the highest-leverage fix — broken images are common in production and the broken-image graphic is a poor UX. Wiring `<img onerror>` to swap render mode is a small Stencil source change with big UX payoff.

The **avatar group** companion is the second priority — currently every consumer that needs an avatar list hand-rolls the overlap. Centralising prevents drift.
