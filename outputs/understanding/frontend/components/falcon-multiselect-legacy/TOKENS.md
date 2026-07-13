# falcon-multiselect (LEGACY STUB — REMOVED) — TOKENS

> **RECONCILE 2026-06-03 (B22):** The stub is **DELETED** and never had a token file of its own. Token contract lives in the replacement `<falcon-angular-multi-select>` → see the `falcon-multi-select` dossier `TOKENS.md`.

## Component token file
- **None — never existed.** `[CODE]` `Glob libs/falcon-ui-tokens/src/components/multiselect.tokens.css` → not present. The stub inherited the embedded `<falcon-angular-multi-select>` tokens (`--falcon-multi-select-*`) + the platform Falcon theme tokens.

## Token categories
- _N/A._ See `falcon-multi-select/TOKENS.md`.

## Related Falcon theme tokens
- (Historical) inherited via the multi-select: neutrals, brand teal (focus), red (error), density heights, radius. None declared by this stub.

## Tailwind utility guidance
- _N/A._ The stub was a thin façade — visual SSOT was the embedded multi-select.

## Dark mode / density / RTL
- All inherited from the embedded multi-select + Falcon theme.

## Static style risks
- `[BRAIN-OUT]` The prior dossier flagged a `falcon-multiselect.component.scss` (likely empty/minimal) that violated the no-SCSS rule. **Resolved by removal** — `[CODE]` deleted with the folder (Glob = empty).

## No CSS / no SCSS guidance
- The replacement `<falcon-angular-multi-select>` is token-driven; per-instance overrides mutate `--falcon-multi-select-*` via a host class. Never hardcode hex/px.

## Token usage by state
- _N/A — no tokens of its own._ See `falcon-multi-select/TOKENS.md`.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B22). Confirmed NO `multiselect.tokens.css` ever existed (Glob) and the SCSS file is gone with the deleted folder. Token contract delegated to `<falcon-angular-multi-select>`.
