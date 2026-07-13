# falcon-mobile-number (LEGACY FACADE — REMOVED) — TOKENS

> **RECONCILE 2026-06-03 (B22):** The façade is **DELETED** and never had a token file of its own. Token contract now lives entirely in the replacement `<falcon-angular-phone-field>` → see the `falcon-phone-field` dossier `TOKENS.md`.

## Component token file
- **None — never existed.** `[CODE]` `Glob libs/falcon-ui-tokens/src/components/mobile-number.tokens.css` → not present. The façade inherited the embedded `<falcon-angular-phone-field>` tokens (`--falcon-phone-field-*`) and the platform Falcon theme tokens.

## Token categories
- _N/A._ All visual values were driven by the embedded phone-field's `:where(falcon-phone-field, falcon-phone-field-tw, falcon-angular-phone-field, …)` token scope (see `falcon-phone-field/TOKENS.md`).

## Related Falcon theme tokens
- (Historical) inherited via the phone-field: `--color-falcon-neutral-*`, `--color-falcon-teal-*` (focus), `--color-falcon-red-*` (error), `--falcon-density-input-height-*`, `--falcon-radius-md`. None declared by this façade.

## Tailwind utility guidance
- _N/A._ The façade exposed only a `@HostBinding('class.fpf-standard')` driven by `useCustomStyle`; its visual effect depended on consumer SCSS, not a token contract.

## Dark mode / density / RTL
- All inherited from the embedded phone-field + Falcon theme (no per-component handling).

## Static style risks
- `[BRAIN-OUT]` The prior dossier (`GAPS_AND_UPGRADES.md` #2) flagged a **`falcon-mobile-number.component.scss`** file that violated the no-SCSS house rule. That file is now **DELETED with the folder** (`[CODE]` Glob of the folder = empty) — the SCSS rule violation is resolved by removal.

## No CSS / no SCSS guidance
- The replacement `<falcon-angular-phone-field>` is token-driven; per-instance overrides mutate `--falcon-phone-field-*` via a host class. Never hardcode hex/px.

## Token usage by state
- _N/A — no tokens of its own._ See `falcon-phone-field/TOKENS.md` "Token usage by state".

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B22). Confirmed NO `mobile-number.tokens.css` ever existed (Glob) and the SCSS file is gone with the deleted folder. Token contract delegated to `<falcon-angular-phone-field>`.
