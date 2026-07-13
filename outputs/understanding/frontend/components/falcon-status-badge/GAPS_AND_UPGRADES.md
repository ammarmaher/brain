# falcon-status-badge — GAPS & UPGRADES

## Missing capabilities

### Adoption — RESOLVED (was the biggest gap)

- **Prior dossier said the consoles hand-rolled status chips instead of composing the component.** As of the 2026-06-03 sweep the component is **broadly adopted** (16 app files / 21 occurrences + 4 lib files / 5 — see USAGE Consumer Sweep), including the status column cell in contact-groups-list (both consoles), contracts-cost-management, org-hierarchy-page-menu, and the shared comm-mkt-view / service-pricing-table / user-details features. FSB-01 is effectively closed for these surfaces; any remaining hand-rolled chip is a per-page residual, not a structural gap.

### Composition into table cells

- Could ship a typed `col.type='status'` on `FalconTableColumn` that auto-composes `<falcon-status-badge>` per cell when the row supplies a `status` severity. **P2** — cleaner than the per-page `<ng-template falconDataTableCell="status">` repetition seen across contact-groups / contracts pages.

### Severity vocabulary

- 9 severities mapping to 4 visual buckets. Adding a new severity (e.g. `'archived'`) needs a token addition + bucket assignment in `status-badge.tokens.css` + the Shadow CSS + the `-tw` helper. **No gap; well-bounded.**
- `[CODE]` The Angular wrapper **re-declares** `FalconStatusBadgeSeverity` / `FalconStatusBadgeSize` (falcon-status-badge.component.ts:23-34) instead of importing from `falcon-status-badge.types.ts:6-17`. Both currently list the identical 9 values (verified). **P3 (FSB-04) — single source of truth: import from the types file.** Risk: the two unions drifting silently.

### Slot vs `[label]`

- `[CODE]` The Stencil tags render `<slot>{this.label}</slot>` (falcon-status-badge.tsx:44 / falcon-status-badge-tw.tsx:51), so projected content overrides `[label]`. `[CODE]` The Angular wrapper DOES include `<ng-content>` in both render paths (falcon-status-badge.component.html:14/23). Angular consumers CAN project icon+text when they omit `[label]`. **No gap — verified working.**

### Icon support

- Default slot can hold an `<i class="falcon-icon …">` projected through `<ng-content>`. There is no first-class `[iconName]` input like `<falcon-badge>` has. **P3 (FSB-05) — add `[iconName]` for shorthand.**

### A11y — `ariaLabel` not on the wrapper

- `[CODE]` `ariaLabel` is a Shadow-only `@Prop` (falcon-status-badge.tsx:30); it is **NOT** on the `-tw` twin NOR surfaced by the Angular wrapper. A dot-only badge (`label=""`, `dot=true`) rendered via the wrapper is meaningless to a screen reader. **P2 (FSB-03) — expose `[ariaLabel]` on the Angular wrapper** (and add it to the `-tw` twin for parity). Workaround today: drop to `<falcon-status-badge-tw aria-label="…">`.

### Tests

- `[CODE]` **No `.spec.ts` / `.e2e.ts` for ANY layer** (Shadow, `-tw`, or wrapper) — verified by listing the source folders. **P3** — pure presentational, but a render/bucket-map spec would lock the 9→4 contract.

## Reusable upgrades needed

| ID | Title | Priority |
|---|---|---|
| FSB-01 | ~~Refactor consoles to compose the component~~ (RESOLVED — adopted) | ~~P1~~ done |
| FSB-02 | Typed `col.type='status'` in `FalconTableColumn` | **P2** |
| FSB-03 | Expose `[ariaLabel]` on Angular wrapper + `-tw` twin | **P2** |
| FSB-04 | Single source of truth for `FalconStatusBadgeSeverity` (import from types) | **P3** |
| FSB-05 | Add `[iconName]` shorthand on Angular wrapper | **P3** |

## Missing Tailwind / token parity

- `[CODE]` **GOOD parity** — the `-tw` helper (`status-badge-tailwind-classes.ts`) consumes the same `--falcon-status-badge-*` tokens via arbitrary-value utilities; both paths agree on the 9→4 bucket map. (Contrast with `<falcon-tag>`, whose `-tw`/wrapper path hardcodes palette utilities and does NOT consume its token file.)

## Workarounds available

- Today: compose `<falcon-angular-status-badge>` via `<ng-template falconDataTableCell="status">` (the established pattern).
- For icon + text: project via `<ng-content>` (omit `[label]`).
- For dot-only a11y: drop to `<falcon-status-badge-tw aria-label="…">`.

## Visual / interaction risks

- Color buckets are WCAG-AA contrast-tested. Don't override a bucket bg without revalidating.
- `dot=true` reserves 6px + 6px gap of horizontal space — dense table cells must account for it (use `dot=false`).
- `[CODE]` No dark-mode bucket override in the token file — re-verify contrast on dark canvas (P3).

## Fix-shared-vs-per-page

- Severity additions / bucket changes / `[ariaLabel]` / type-SSOT: **shared component**.
- Any residual hand-rolled chip: per-page edit, but the SSOT bucket map is the shared source.

## Wave 7 Findings (2026-05-17)

**Consumer count: 6** ([CODE] grep `<falcon-angular-status-badge>` across `apps/` + `libs/falcon/`).

## Deep-Dive Sweep Findings (2026-06-03 — B10)

**Consumer count: 16 app files / 21 occurrences + 4 lib files / 5 occurrences** ([CODE] grep `falcon-angular-status-badge`).

Drift corrected vs prior dossier (no deletion/promotion flags; component stays ACTIVE):
- **Adoption RESOLVED** — the prior "no consumers found in apps/" (OVERVIEW) and Wave-7 "6" are stale; the component is broadly adopted (contact-groups status cell, contracts, org-hierarchy-page-menu, shared features).
- **FSB-03 confirmed** — `ariaLabel` is Shadow-only; NOT on `-tw` NOR the wrapper.
- **FSB-04 confirmed** — wrapper re-declares the severity union instead of importing the types file.
- **Token parity GOOD** — `-tw` helper consumes tokens (unlike `<falcon-tag>`).
- **No spec/e2e for any layer** — clarified.
- **No new structural gaps.** All findings are `safe-local` (doc) — see FINDINGS/B10.md.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B10) against all source layers. Adoption gap resolved (broadly used now); FSB-03 (ariaLabel) / FSB-04 (type re-declaration) confirmed; token parity GOOD; no spec for any layer. No deletion/promotion flags — component stays ACTIVE.
