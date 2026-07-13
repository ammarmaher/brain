# falcon-avatar — DECISION

## Brain SK final recommendation

**STATUS: READY (production-grade primitive), adoption now starting. Use for every user / account / node identity glyph in new Angular code.**

(Upgraded from the prior "READY but UNDER-LEVERAGED / zero consumers" — the wallet-balance-management header is now a live consumer; the recommendation is **promote**, not retire.)

## Use this component for

- Every user / account / team avatar in headers, comment lists, member rows.
- Org-hierarchy node imagery (`shape="square"` by convention).
- Account-logo headers (the live `wallet-balance-management` pattern: `[src]` + `iconName="building"` fallback).
- Wherever a graceful image → initials → icon fallback chain is wanted.
- Presence indicators on a user avatar (`[status]`) — when/if a live-presence source exists.

## Avoid this component for

- Multi-avatar groups with an overflow pill (no built-in support — GAP G2).
- Brand logos in nav bars → dedicated brand asset.
- Purely decorative imagery → raw `<img>`.
- A bare glyph with no surface → `<falcon-angular-icon>`.
- Account lifecycle state (Active/Pending/Disabled) → `<falcon-angular-status-badge>` (avatar status is presence only).

## Preferred variant / render path

**`useTailwind=true` (default)** — Light DOM (`<falcon-avatar-tw>`). Best for:
- Studio token-runtime mutation.
- Cross-framework parity with React + Vue.
- Token overrides via the `:where()` selector chain.

**`useTailwind=false`** (Shadow path) — switch ONLY when you need style isolation from a noisy parent stylesheet OR `::part(image|initials|icon|status)` styling (parts are Shadow-only — GAP G7). Note: the `-tw` default path is itself token-driven, so most theming needs no Shadow.

## Required upgrades before wider use

None block production use today. The documented gaps are improvements:
- **Highest leverage:** G1 (runtime image-error fallback) — broken logo URLs are common; the broken-image graphic is poor UX.
- **Second:** G2 (avatar-group companion) — every member-list consumer would otherwise hand-roll the overlap.
- **A11y:** G3 (`name` → initials `aria-label`).

## Relationship to other components

| Component | Relationship |
|---|---|
| `falcon-angular-icon` | Composed via the `iconName` fallback (renders `<i class="falcon-icon …">` directly, NOT a nested wrapper). |
| `falcon-angular-status-badge` | Sibling, NOT composed. Status badge = workflow-state pill; avatar status = user presence. Different vocabularies. |
| `falcon-angular-badge` | Sibling — a count/label pill, not identity. |
| `falcon-photo-uploader` | The edit-mode counterpart that produces the `src` an avatar then displays read-only. |

## Exact rule for future implementation tasks

1. **Need to show a user/account/node identity?** Use `<falcon-angular-avatar>` with `useTailwind=true` (default). Do NOT hand-roll `<img class="rounded-full">`.
2. **Always pass the fallback chain** — `[src]` (or `undefined`, never `""`) AND `initials` and/or `iconName`. Compute `initials` as 2 uppercase chars.
3. **`shape="square"` for nodes/accounts, `circle` for people.**
4. **Set `[altText]`** for any standalone user/account image (alt defaults to empty → silent).
5. **Restyle via `--falcon-avatar-*` tokens** (host class + CSS file). Never hardcode hex/px or resize via Tailwind utilities — use `size`.
6. **`[status]` is presence only** — don't use it for lifecycle state, and don't wire it to a static value (no live-presence backend yet).
7. **Be aware:** a 404'd `src` shows the broken-image graphic (no runtime fallback) until G1 lands; avatar-groups must wait for G2.

---

## Dynamic capability assessment

### 1. What is static today?

- The 3-step fallback chain is **render-time only** (no runtime image-error swap — G1).
- 2 shapes (circle / square), 4 status states — fixed unions.
- No clickable mode, no avatar-group, no border ring, no per-user hash color.
- Initials are a plain `<span>` with no `aria-label` (no name semantics).
- The `-tw` twin exposes no Shadow `part`s.

### 2. What is already dynamic through inputs/outputs?

- `[CODE]` **8 wrapper `@Input`s** — `src` / `initials` / `iconName` / `size` / `shape` / `status` / `altText` / `useTailwind`.
- **0 `@Output`s** — fully passive (no click, no image-load/error event).

### 3. What is already dynamic through slots / ng-template?

- **None.** No `<slot>`, no `ng-template`. Content is fully prop-driven.

### 4. What is dynamic through token / theme overrides?

- Every visual axis via `--falcon-avatar-*` (5 categories): per-size px, per-size initials font-size, circle/square radius, bg/fg, status-dot size/ring/per-state color.
- Dark mode flips automatically through the `--color-falcon-*` cascade (no per-avatar dark block needed).

### 5. What is dynamic through Tailwind classes?

- Host `class=` for layout / margin / `shrink-0` (lands on `<falcon-angular-avatar>`).
- The `-tw` root itself is built from token-arbitrary utilities (helper-generated) — consumers should override tokens, not classes.

### 6. What is missing to make this component reusable across pages?

- Runtime image-error fallback (G1).
- Avatar-group / stack companion (G2).
- `name` input for aria-label + auto-initials (G3).
- Clickable mode + `falconClick` (G5).
- `rootClass` passthrough (G6).
- Border-ring token / extended status / hash-color (G8).

### 7. What capability should be added to the shared component (not a page hack)?

- All of item 6 — especially G1 + G2, which every consumer would otherwise reinvent per page.

### 8. What flags / options / templates / slots would make it better?

- `@Input() name?: string` (aria-label + auto-initials).
- `@Input() clickable` + `@Output() falconClick`.
- `@Input() colorHash` (per-user disc tint).
- `@Input() rootClass` (passthrough to the `-tw` root).
- Internal `<img onerror>` (no API surface — just behavior).

### 9. What is the safest upgrade path?

1. **Phase A (internal, zero API change):** add the `<img onerror>` runtime fallback (G1).
2. **Phase B (additive inputs):** `name`, `rootClass`, `clickable` + `falconClick`, `colorHash` — all backwards-compatible.
3. **Phase C (new component):** ship `<falcon-angular-avatar-group>` (G2).
4. **Phase D (token):** add border-ring token + extend the status union (G8).

All phases are additive — no consumer break.

### 10. What is risky to change because other pages depend on it?

- **Adoption is still tiny (1 consumer)** — overall change risk is LOW.
- BUT: changing the default `size="md"` or `shape="circle"` would silently shift any snapshot.
- The 3-tier render priority (`src` → `initials` → `iconName`) — flipping it changes rendered output for the live wallet header (`src` + `iconName="building"`).
- The `[attr.src]="src || null"` falsy guard — anything depending on `src=""` producing a fallback relies on this.
- The status-dot's bottom-(inline-)end positioning + the `useTailwind=true` default (flipping to Shadow would change DOM structure).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B11). Recommendation upgraded to READY/promote (1 live consumer corrects the prior zero-adoption framing). Counts: 8 `@Input`s, 0 `@Output`s, 0 slots, 0 methods. G1/G2/G3 remain the leverage upgrades.
