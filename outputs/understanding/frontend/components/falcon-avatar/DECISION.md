# falcon-avatar — DECISION

## Brain SK final recommendation

### Use this component for
- Every user / account avatar in headers, comment lists, member rows.
- Org-hierarchy node imagery (`shape="square"` typically).
- Activity feeds with author avatars.
- Wherever a graceful image → initials → icon fallback chain is wanted.

### Avoid this component for
- Multi-avatar groups with overflow (no built-in support yet).
- Brand logos in nav bars.
- Purely decorative imagery.
- Standalone icon placement (use `<falcon-angular-icon>`).

### Preferred render path
`useTailwind=true` (default).

### Required upgrades before wider use
**Tier 1:**
1. Image-load-error runtime fallback (`<img onerror>` → swap to initials/icon).
2. Avatar group / stack companion component.
3. `name` input for aria-label + auto-initials.

**Tier 2:**
4. Hash-based bg color for initials (consistent per-user color).
5. Clickable mode.
6. Extended status types.

### Relationship to other components

| Component | Relationship |
|---|---|
| `falcon-angular-icon` | Composed via `iconName` fallback. |
| `falcon-angular-status-badge` | Separate concept — status badge is a workflow-state pill; avatar status is a user-presence dot. |

### Exact rule for future implementation tasks
> Use `<falcon-angular-avatar>` for every user / account avatar. Provide BOTH `src` AND `initials` (3-step fallback chain). Compute initials from first + last name (max 2 chars). Use `shape="square"` for org / account contexts; `circle` for individuals. Use `[status]` for presence indicators (online/offline/busy/away). Be aware: today there is NO image-load-error fallback — if the URL 404s, the broken-image graphic shows until the Tier-1 upgrade lands. For avatar groups with overflow pills, defer until the avatar-group companion ships.

### Status
**READY but UNDER-LEVERAGED.** Production-grade primitive, zero production consumers. Tier-1 upgrades would unlock common patterns.

---

## Dynamic capability assessment

### 1. What is static today?
- The 3-step fallback chain is render-time only (no runtime image-error swap).
- 2 shapes (circle / square).
- 4 status states.
- No clickable mode.
- No avatar group support.
- Initials don't auto-color by user.

### 2. What is already dynamic through inputs/outputs?
- `src`, `initials`, `iconName`, `size`, `shape`, `status`, `altText`.
- No outputs.

### 3. What is already dynamic through slots / ng-template?
None.

### 4. What is dynamic through token / theme overrides?
- Per-size pixel values (5 sizes).
- Per-size font-size for initials.
- Circle / square radius.
- Background / foreground.
- Status dot size, ring width/color, per-state color.

### 5. What is dynamic through Tailwind classes?
- Margin / layout on host.

### 6. What is missing to make this component reusable across pages?
- Runtime image-error fallback.
- Avatar group / stack.
- `name` for aria-label.
- Auto-initials calculation.
- Hash-color bg.
- Clickable mode.
- Border ring.

### 7. What capability should be added to the shared component instead of a one-off page hack?
All items 6.

### 8. What flags / options / templates / slots would make it better?
- Runtime fallback on `<img>` error.
- `[name]` input.
- `[colorHash]="true"` for hash-based bg.
- `[clickable]="true"` for button rendering.
- Companion `<falcon-angular-avatar-group [max]="5">`.

### 9. What is the safest upgrade path?
1. Add runtime image-error fallback (internal — no API change).
2. Add `name` input (additive — backwards compatible).
3. Add `colorHash` flag (additive).
4. Add `clickable` mode (additive).
5. Ship avatar-group companion (new component).

### 10. What would be risky to change because other pages depend on it?
- **No production consumers** — risk is low.
- BUT: changing the default `size="md"` or `shape="circle"` would silently shift any test snapshots.
- The 3-step fallback render priority (src → initials → iconName) — flipping would change rendered output.
- The status dot's bottom-right physical positioning.
