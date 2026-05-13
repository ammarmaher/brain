# falcon-badge — GAPS & UPGRADES

## Missing capabilities

### No usage in production

- Zero direct consumer in `apps/`. Production pages currently use raw Tailwind utility classes for count badges / feature flags (status-chip pattern). **P1 — refactor opportunity, but also probably means consumers are uncertain about the three-component split (`badge` vs `status-badge` vs `tag`).**

### Documentation contrast

- The three sibling badges (`falcon-badge`, `falcon-status-badge`, `falcon-tag`) have overlapping visual identities. A docs comparison table would help. **P2 — Agent 7 territory; mention in COMPONENT_COVERAGE.**

### A11y

- `ariaLabel` exists on Stencil but not on Angular wrapper. **P2.**

### `iconName` icon resolution

- The icon class is `falcon-icon falcon-icon-{name}` — relies on the Falcon icon font being loaded. If consumer passes a non-existent name, the `<i>` renders empty. **P3 — fallback or dev warning.**

### Tests

- No specs. **P3** — pure presentational.

## Reusable upgrades needed

| ID | Title | Priority |
|---|---|---|
| FB-01 | Expose `[ariaLabel]` on Angular wrapper | **P2** |
| FB-02 | Visual-comparison docs (sibling badges) | **P2** |
| FB-03 | Specs | **P3** |

## Workarounds available

- `<ng-content>` already works on the wrapper — no workaround needed for content projection.

## Future-proof recommendation

Promote `<falcon-angular-badge>` as the canonical count / feature-flag indicator across the system via consumer refactor. Add `[ariaLabel]` to the wrapper for parity with the Stencil core.
