# falcon-calendar (LEGACY FACADE — REMOVED) — TOKENS

> **RECONCILE 2026-06-03 (B22):** The legacy `<falcon-calendar>` is **DELETED** and never had a token file of its own. Token contract lives in the modern replacements `<falcon-angular-date-picker>` / `<falcon-angular-calendar>`.

## Component token file
- **None for the legacy component — never existed.** `[CODE]` The PrimeNG-era `<falcon-calendar>` styled via PrimeNG + a small wrapper; it declared no `--falcon-calendar-*` token file.
- ⚠ `libs/falcon-ui-tokens/src/components/calendar.tokens.css` **does exist** but belongs to the UNRELATED modern Stencil `<falcon-calendar>` / `<falcon-angular-calendar>` — not this deleted Angular component. Do not attribute it here.

## Token categories
- _N/A for the legacy component._ See the modern `falcon-calendar`/`falcon-date-picker` dossier `TOKENS.md` for `--falcon-calendar-*` / `--falcon-date-picker-*`.

## Related Falcon theme tokens
- (Historical) the PrimeNG-era component relied on PrimeNG theme + inherited Falcon theme; no Falcon token contract of its own.

## Tailwind utility guidance
- _N/A._ The legacy component forwarded a `styleClass` input (`'w-full'` default) to PrimeNG.

## Dark mode / density / RTL
- (Historical) inherited from PrimeNG theme. The modern replacements are token-driven (dark mode flips `--color-falcon-*`; RTL via the rtl token layer).

## Static style risks
- `[BRAIN-OUT]` The prior dossier recorded **no SCSS file** for the façade form ("OK — no SCSS to delete"). The PrimeNG original's styling lived in PrimeNG, not a local `.scss`. Removal leaves no residue.

## No CSS / no SCSS guidance
- The modern `<falcon-angular-date-picker>`/`<falcon-angular-calendar>` are token-driven; per-instance overrides mutate `--falcon-date-picker-*` / `--falcon-calendar-*` via a host class. Never hardcode hex/px.

## Token usage by state
- _N/A — no tokens of its own._ See the modern `falcon-date-picker`/`falcon-calendar` dossier.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B22). Confirmed the legacy component had no token file; `calendar.tokens.css` belongs to the unrelated modern Stencil calendar. Token contract delegated to `<falcon-angular-date-picker>`/`<falcon-angular-calendar>`.
