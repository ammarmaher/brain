# falcon-card-status — DECISION

## Brain SK final recommendation

**STATUS: READY (production-grade, presentation-only shell). Use for any status-toned entity card with a guaranteed action footer.**

The component is correctly built: behaviour-free shell, fully token-driven, the Angular-direct-chrome architecture deliberately solves the interactive-projection-under-zoneless-CD problem. One live consumer (comm-mkt-card); the pattern is ready for any future entity grid.

## Use this component for

- A card whose **border tone communicates a status bucket** AND that needs a guaranteed bottom-right action area for caller-owned buttons.
- Service / application / communication-channel grid cards (the comm-mkt-view pattern).
- Any uniform-height entity-tile grid where actions must bottom-align across a ragged row.

## Avoid this component for

- A plain content card (no status tone, no action footer) → `<falcon-angular-card>`.
- A status pill / chip → `<falcon-angular-status-badge>`; a removable label → `<falcon-angular-tag>`.
- Anything where you want the component to own action behaviour — it is presentation-only.
- Mapping a domain status enum — pass a 4-bucket presentation value; map in the caller.

## Preferred variant / render path

**Angular path = `<falcon-angular-card-status>`** (the ONLY Angular option — pure-Angular chrome). There is **NO `useTailwind` toggle** and **NO Shadow path** in Angular. The Stencil `<falcon-card-status>` (`scoped:true`) is **React/Vue-only**. Do not attempt to switch render paths in Angular.

`status` (border tone) + `size` (padding/gap) are the variant axes. Theme via `--falcon-card-status-*` tokens or `rootClass`.

## Required upgrades before wider use

None block production use. Improvements:
- **G1 (P2):** import the unions from the types file (drop the wrapper re-declaration) — DRY/drift hygiene.
- **G2 (P2):** optional `[ariaLabel]` → `role="group"` on the root — a11y.
- The token binding is already exemplary; no token work needed.

## Relationship to other components

| Component | Relationship |
|---|---|
| `falcon-card` | Sibling with the IDENTICAL Angular-direct-chrome architecture (B10). card-status = the status-toned + guaranteed-action-footer specialization. |
| `falcon-angular-status-badge` | Composed BY the caller into `slot="status"` (the lifecycle pill). |
| `falcon-angular-button` | Projected into `slot="actions"` (the interactive buttons whose projection drove the Angular-direct-chrome design). |
| `falcon-angular-icon` / `falcon-svg-icon` | Projected into `slot="media"` / used in the price line. |
| `comm-mkt-view` `<app-comm-mkt-card>` | The reference caller — domain→bucket mapping + action catalog + slot composition. |

## Exact rule for future implementation tasks

1. **Need a status-toned entity card with a bottom action footer?** Use `<falcon-angular-card-status>`. Do NOT re-roll the SoT `.cm-card` markup.
2. **Map your domain status → a 4-bucket `[status]`** in the caller (the comm-mkt-card `cardStatus()` pattern). The card paints only the border tone.
3. **Project all content + interactive buttons into the slots** (`media`/`title`/`status`/default/`actions`). The caller owns every button's label/visibility/permission/click.
4. **Add `self-start`** to top-row slots if the status column is taller than the title (the top grid is `items-center`).
5. **Theme via `--falcon-card-status-*` tokens or `rootClass`** — never hardcode hex/px.
6. **Do NOT** mount the Stencil element in Angular, look for `useTailwind`, or move action logic into the card.
7. **Be aware:** the card root has no `role`/`aria-label` (G2) until that lands — provide a landmark on a wrapper if needed.

---

## Dynamic capability assessment

### 1. What is static today?

- The 3-zone layout (top grid `34px 1fr auto` → body → footer) is fixed structure.
- The top grid is `items-center` (callers add `self-start` to override per slot).
- 4 status border tones + 3 size triads — fixed unions.
- No `selected`/`interactive`/`loading` presentation; no auto-rendered status badge.
- The root `<div>` has no `role`/`aria-label`.
- The wrapper re-declares its type unions (drift risk).

### 2. What is already dynamic through inputs/outputs?

- `[CODE]` **3 inputs** — `status` (signal-backed, border tone) / `size` (signal-backed, padding+gap) / `rootClass` (appended utilities).
- **0 outputs** — the card emits nothing; action events come from caller-projected buttons.

### 3. What is already dynamic through slots / ng-template?

- `[CODE]` **5 slots** — `media` / `title` / `status` / default (body) / `actions`. This is the component's primary extensibility surface — everything visible beyond the chrome is projected. No `ng-template`.

### 4. What is dynamic through token / theme overrides?

- Every visual axis via `--falcon-card-status-*` (radius, per-size padding/gap, top-grid cols, actions gap, surface bg, hover shadow, per-status border tones). Dark mode re-points bg + brand/danger borders; neutrals flip via the SSOT.

### 5. What is dynamic through Tailwind classes?

- Host `class=` for grid placement; `rootClass` input appended to the computed root classes.
- Per-slot layout (alignment, gaps, `self-start`) is the caller's Tailwind on the projected elements.

### 6. What is missing to make this component reusable across pages?

- Import unions from the types file (G1).
- Optional root `[ariaLabel]` landmark (G2).
- Optional `[statusLabel]`/`[statusSeverity]` convenience badge (G3).
- A `selected`/`loading` presentation tone (G5).
- A Stencil↔Angular chrome sync test (G4).

### 7. What capability should be added to the shared component (not a page hack)?

- All of item 6 — especially G2 (a11y) + G5 (selected/loading), so every entity-grid doesn't reinvent a selected highlight via `rootClass`.

### 8. What flags / options / templates / slots would make it better?

- `@Input() ariaLabel` (root landmark), `@Input() selected` (selected ring token), `@Input() statusLabel` + `@Input() statusSeverity` (auto badge), a `loading` skeleton tone.

### 9. What is the safest upgrade path?

1. **Phase A (hygiene, zero behavior change):** import the type unions (G1).
2. **Phase B (additive inputs):** `ariaLabel`, `selected`, `statusLabel`/`statusSeverity` — all backwards-compatible.
3. **Phase C (tests):** add the wrapper spec + the interactive-projection regression + the Stencil↔Angular chrome parity test (G4).

All additive — no consumer break.

### 10. What is risky to change because other pages depend on it?

- **The Angular-direct-chrome architecture** — reverting to mounting the Stencil element would re-break the comm-mkt-card action buttons under zoneless CD (the exact defect this design avoids). HARD do-not-touch.
- **The 5-slot names** (`media`/`title`/`status`/default/`actions`) — renaming would break comm-mkt-card's projection.
- **The `status` 4-bucket union** — narrowing/renaming would break the caller's `cardStatus()` mapping.
- **The shared `card-status-tailwind-classes.ts` builder** — both render paths + the React/Vue targets depend on it; a change must keep Stencil + Angular visually identical.
- **The default `status='inactive'`/`size='md'`** — changing would silently shift unmapped/default cards + snapshots.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B11 — NEW). Recommendation READY (presentation-only shell, correctly built). 3 inputs (2 signal-backed), 0 outputs, 5 slots, no methods. Angular-direct-chrome architecture is by-design (Defect-A) — HARD do-not-revert. Token binding exemplary. G1/G2 are the hygiene/a11y upgrades.
