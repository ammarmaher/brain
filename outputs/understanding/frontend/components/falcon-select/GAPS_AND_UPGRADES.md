# falcon-select — GAPS AND UPGRADES

> Sweep-refreshed 2026-06-03 (B04). This component is an **alias** of `<falcon-angular-dropdown>`. All functional gaps live in `../falcon-dropdown/GAPS_AND_UPGRADES.md`. The headline here is the DEAD-CANDIDATE deletion flag.

## ⚠️ Wave flag — DEAD CANDIDATE (deletion candidate)

`[CODE]` `libs/falcon-ui-core/src/angular-wrapper/components/falcon-select/index.ts:1`:
```ts
// DEAD CANDIDATE - flagged Night Shift 2026-05-16 - verify before removal
```
- **Verified 2026-06-03:** 0 real consumers of `FalconAngularSelectComponent` / `FalconSelectOption` (grep returned only the index.ts, WAVE-5-GAP-CLOSE.md, and one banner-comment mention in `contracts-rate-card-section.component.ts`).
- **Recommendation (DOCUMENT-ONLY this pass):** the alias is safe to remove — deleting the re-export changes no rendered UI (the rendered tag is `<falcon-angular-dropdown>`); it would only break the (unused) `FalconAngularSelectComponent` import name. **`risk-class safe-local`** (dead-orphan; remove the re-export + drop from the lib barrel if it's exported there + delete WAVE-5-GAP-CLOSE follow-up). We fix NOTHING this pass — flagged for human triage.
- Counter-option: keep it as a spec-name bridge and instead promote it to a REAL `falcon-angular-select` selector (see G1). Pick one; the current half-state (alias + dead flag + 0 use) is the worst of both.

## Alias-specific gaps

### G1 — No HTML selector named `falcon-angular-select` (P3)

`[CODE]` The class alias exists but no `@Component({ selector: 'falcon-angular-select' })` does. Consumers must use `<falcon-angular-dropdown>` in templates regardless of which class name they import. Naming inconsistency vs the spec.

**Recommended fix (optional, mutually exclusive with removal):** add a thin shell component `selector: 'falcon-angular-select'` that renders `<falcon-angular-dropdown ...>` and passes all inputs/outputs through. Trade-off: another class + tag for spec-name purity. `risk-class safe-local`.

### G2 — Documentation / drift risk (P2)

If `<falcon-angular-dropdown>` evolves, the alias must stay in sync. The single `index.ts` re-export handles this automatically (drift-proof today).

### G3 — No Stencil-side `<falcon-select>` tag (P3)

For full alignment a Stencil tag alias could be added. Not worth it. `risk-class safe-local`.

## Recommended upgrade priority

| ID | Title | Priority | risk-class |
|---|---|---|---|
| (flag) | Remove the DEAD-CANDIDATE alias OR promote it to a real selector | decision needed | safe-local |
| G1 | Add `falcon-angular-select` HTML selector (if keeping) | P3 (optional) | safe-local |

## Shared vs per-page

All shared (it lives in `libs/falcon-ui-core`).

## Workarounds today

- Use `<falcon-angular-dropdown>` in HTML regardless of import name.

## Wave findings — B04 (2026-06-03)

- **DEAD CANDIDATE confirmed** — 0 real consumers; the source flag from Night Shift 2026-05-16 still stands. Decision (remove vs promote) is the only real "gap"; everything functional is dropdown's.
- **Spec-vs-code naming drift** — Falcon UI Spec §5.12.1 calls this "Select"; the codebase universally uses "Dropdown". The re-export was meant to close the gap but is unused.

## Verification
🟢 code-verified DEAD-CANDIDATE flag + 0-consumer status (grep 2026-06-03). Functional gaps inherited from `../falcon-dropdown/GAPS_AND_UPGRADES.md`.
