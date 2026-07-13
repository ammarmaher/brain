# falcon-avatar — GAPS AND UPGRADES

## Missing capabilities (active source verified)

### G1 — No runtime image-load-error fallback (P1)

`[CODE]` falcon-avatar.tsx:40-42 — the 3-tier fallback (`showImage`/`showInitials`/`showIcon`) is decided by **render-time truthiness**, not by an `<img onerror>` handler. If `src` is set but the image 404s, the browser broken-image graphic shows; the component does NOT downgrade to `initials` → `iconName`.

**Impact:** a node whose stored logo URL has rotted shows a broken image, not its initials — identity continuity silently breaks. High-leverage UX fix.

**Recommended fix (P1):** in BOTH Stencil tags, track an internal `imageErrored` state, wire `<img onError={() => (this.imageErrored = true)}>`, and recompute `showImage = !!this.src && !this.imageErrored`. Internal-only — no API change.

### G2 — No multi-avatar group / stack (P1)

Common UX: "Members: [a][b][c] +5". Today a consumer hand-rolls multiple `<falcon-angular-avatar>` with `-ml-2` overlap. PrimeNG's `<p-avatarGroup>` (replaced in PR-8) was never re-built.

**Recommended fix (P1):** a companion `<falcon-angular-avatar-group [avatars]=… [max]=5 [size]=…>` that renders the overlap + a "+N" pill.

### G3 — Initials mode has no `aria-label` (P2 — a11y)

`[CODE]` falcon-avatar.tsx:55-59 — initials render as a plain `<span>{initials}</span>` with no `aria-label`. A screen reader announces "J D", not the user's name.

**Recommended fix (P2):** add `@Input() name?: string` on the wrapper → `aria-label={name}` on the root + (optionally) auto-derive initials from `name` when `initials` is absent.

### G4 — `src=""` (empty string) edge (P3)

`[CODE]` `!!this.src` is `false` for `""`, so it correctly falls to initials — **but** a raw-tag consumer binding `src=""` directly (bypassing the wrapper's `|| null` guard) would still render `<img src="">`. The wrapper guards it; document the raw-tag trap.

### G5 — No clickable / `role="button"` mode (P3)

For avatar-as-button patterns ("click to expand profile"), the root is a plain `<div>` with no click event and no `role`.

**Recommended fix (P3):** `@Input() clickable = false` → render the root as a `<button>` with `role="button"` + `@Output() falconClick`.

### G6 — `rootExtraClass` not surfaced on the Angular wrapper (P3)

`[CODE]` falcon-avatar-tw.tsx:29 — the `-tw` twin accepts `rootExtraClass`, but the Angular wrapper does not forward a caller-supplied extra-class onto the inner root `<div>`. The host `class=` lands on `<falcon-angular-avatar>`, not the disc.

**Recommended fix (P3):** add `@Input() rootClass = ''` → `[attr.root-extra-class]` (mirrors the `falcon-card-status` `rootClass` pattern).

### G7 — Shadow path exposes `part`s; `-tw` does not (P2 — parity)

`[CODE]` falcon-avatar.tsx exposes `part="root|image|initials|icon|status"` (5 parts). The `-tw` twin (Light DOM) exposes **no parts**. A consumer styling via `::part(image)` only works on the Shadow path. Parity break.

**Recommended fix (P2):** document that `::part()` is Shadow-only; or add matching `data-*` hooks on the `-tw` root for parity.

### G8 — No border-ring token / extended status types (P3)

- No `--falcon-avatar-border-*` token for a "verified" ring around the disc.
- Status is `online|offline|busy|away` only — no `verified`/`pending`/`vip`.
- No hash-based initials background (every avatar is the same teal — no per-user color).

**Recommended fix (P3):** add a `border-ring` token, extend the `FalconAvatarStatus` union, add `@Input() colorHash` for per-user tinting.

## Missing accessibility features

- **A1 (P2):** initials mode has no `aria-label` linking to the user's name (= G3).
- **A2 (P3):** clickable avatars (when G5 lands) should be `role="button"` / `<button>`, not a bare `<div>`.
- **A3 (P3):** the `<img>` `alt` defaults to `''` — silent unless `altText` is set. Acceptable for a decorative avatar paired with adjacent text, but document the requirement for standalone user avatars.

## Missing tests

- `[CODE]` **NO `.spec.ts` and NO `.e2e.ts` for any layer** (Shadow, `-tw`, wrapper) — verified 2026-06-03. GAPs: (a) a Stencil render spec locking the 3-tier fallback truth-table (`src` only → img; `src=""`+initials → span; iconName-only → `<i>`); (b) status-dot positioning across sizes/shapes (e2e); (c) a wrapper spec confirming the `[attr.*]` `|| null` falsy-guard wiring.

## Missing Tailwind / token parity

- `-tw` default path IS token-driven (`bg-[color:var(--falcon-avatar-bg)]` etc. — parity OK at the color/size token level). **Both paths share `--falcon-avatar-*` via the `:where()` selector** → Studio runtime mutation hits both identically.
- The only parity break is the Shadow `part`s vs `-tw` no-parts (G7).

## Performance risks

- Pure pass-through render, `OnPush`, no signals, no subscriptions. **No real risk.** For a long member list (>100 avatars) each `<falcon-angular-avatar>` is a small component instance — acceptable; consider a virtualized list rather than dropping the component.

## Visual / interaction risks

- `[CODE]` The status dot has fixed bottom-(inline-)end positioning. For a **square** avatar (radius 8px) the dot may visually clip the rounded corner. Flag in docs.
- Initials don't auto-color by user — every avatar shows the same teal disc (G8).
- The render-time fallback means a transient `src` that later 404s never recovers to initials (G1).

## Recommended upgrade priority

| ID | Title | Priority |
|---|---|---|
| G1 | Runtime image-error fallback (`<img onerror>`) | P1 |
| G2 | Avatar-group / stack companion | P1 |
| G3 | `name` input → initials `aria-label` (+ auto-initials) | P2 |
| G7 | `-tw` parity for Shadow `part`s | P2 |
| G5 | Clickable / `role="button"` mode + `falconClick` | P3 |
| G6 | Surface `rootClass` on wrapper | P3 |
| G8 | Border-ring token / extended status / hash-color | P3 |

## Recommended upgrade API (concrete)

```ts
// Angular wrapper additions
@Input() name?: string;        // aria-label + auto-initials fallback
@Input() rootClass = '';       // → [attr.root-extra-class] on the -tw root
@Input() clickable = false;    // render <button> + role="button"
@Input() colorHash = false;    // hash name → per-user disc tint
@Output() falconClick = new EventEmitter<MouseEvent>();
```

```tsx
// Stencil (both tags)
private imageErrored = false;
// showImage = !!this.src && !this.imageErrored;
<img onError={() => (this.imageErrored = true)} ... />
```

## Fix-shared-vs-per-page

All gaps belong in the **shared Falcon component**, not per-page. The 3-tier fallback + token contract is the single chokepoint; per-page `<img onerror>` hacks would fragment the identity-render story.

## Workarounds (if upgrade blocked)

- For G1 today: pre-validate the URL in the host (HEAD request / known-good) before binding `src`, or accept the broken graphic.
- For G2 today: hand-roll the overlap with `-ml-2` + a manual "+N" pill (raise G2 to centralize).
- For G3 today: wrap the avatar in an element carrying the `aria-label` (`<span [attr.aria-label]="user.fullName">…`).

## Wave 7 Findings (2026-05-17)

**Consumer count: 0** ([CODE] grep `<falcon-angular-avatar>`). Flag was "Zero adoption — showcase/playground-only; promote or retire."

## Deep-Dive Sweep Findings (2026-06-03 — B11)

**Consumer count: 1 app file (wallet-balance-management), 0 lib files** ([CODE] grep `falcon-angular-avatar`).

Drift corrected vs prior dossier (component stays ACTIVE; NO deletion/promotion flag):
- **Adoption corrected** — the prior "0 consumers / showcase-only / candidate for retirement" is **stale**; the wallet-balance-management header is a live consumer. (Same correction class as B10 status-badge/tag/card.) The "promote or retire" flag is effectively resolved toward **promote**.
- **RTL corrected** — status dot uses logical `inset-inline-end`/`end-0` (NOT physical right).
- **New gaps surfaced** — G6 (`rootExtraClass` not on wrapper), G7 (Shadow `part`s vs `-tw` no-parts).
- **All findings `safe-local`** (doc-correction + additive a11y/parity proposals) — no HIGH-RISK. See FINDINGS/B11.md.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B11) against all source layers. Render-time fallback (G1), no aria-label on initials (G3), no clickable mode (G5), no tests confirmed. Adoption + RTL drift corrected. No deletion/promotion flag — component stays ACTIVE (promote).
