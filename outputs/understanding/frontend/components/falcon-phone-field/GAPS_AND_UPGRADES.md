# falcon-phone-field — GAPS AND UPGRADES

> REFRESH 2026-06-03 — re-derived against live source. The "~250 country / virtualize the dropdown" perf concern is **stale/wrong**: `DEFAULT_PHONE_COUNTRIES` is **25** (`falcon-phone-field.utils.ts:8-34`); unvirtualized rendering is fine — that gap is downgraded/closed. New divergence + API-honesty gaps added.

## Missing / divergent capabilities (active source verified)

### G1 — `verifyIcon` + `*ExtraClass` + `appendTo` are `-tw`-only (P1) — **render-path parity**

`[CODE]` The Light tag declares `verifyIcon` (`:100`), `wrapperExtraClass`/`inputExtraClass`/`labelExtraClass` (`:110-112`), and `appendTo: 'body'|'inline'` (`:124`). The Shadow tag declares NONE of them (and always renders the panel inline). Default `useTailwind=true` gets them; `useTailwind=false` silently loses them.

**Recommended fix:** add `verifyIcon` + the `*ExtraClass` props to the Shadow tag for parity. (`appendTo` is inherently Light-only — the Shadow panel can't portal out of the shadow root — so document that one as expected.)

### G2 — `[maxlength]` is silently ignored (P1) — **API honesty / data correctness**

`[CODE]` The User-Details consumer binds `[maxlength]="10"` (`user-details-page.component.html:457`) but the wrapper has **no `maxlength` input** — it falls through as an unknown attribute on the `<falcon-angular-phone-field>` host and never reaches the inner native `<input>`. The national number is therefore NOT capped at 10 digits by the field; only a Reactive Forms validator would cap it. A reader of the template would reasonably assume the cap works.

**Recommended fix:** add a real `@Input() maxlength?: number` (+ `@Prop()` on both tags) forwarded to the native input, OR document loudly that length is validator-only and remove the misleading binding from consumers.

### G3 — Verify button has no `aria-label` (P2) — **a11y**

`[CODE]` `falcon-phone-field.tsx:390-400` / `-tw:486-513` — the Verify `<button>` relies on its visible `verifyLabel` only (same as email-field). An explicit `aria-label` would be more robust for icon-heavy locales.

### G4 — No "verified ✓" state (P2)

`[CODE]` Neither tag has a `verified`/`verifying` prop. A verified number looks identical to an unverified one. Add `verified` (success border + check) + `verifying` (spinner in the button).

### G5 — No method proxies on the wrapper (P2)

`[CODE]` Both tags expose `@Method() setFocus()`, `openPanel()`, `closePanel()` — the wrapper proxies **none**. Add `async setFocus()` / `openCountryPicker()` / `closeCountryPicker()` proxies.

### G6 — No `variant` / `appearance` (P2)

Does not follow the input Wave-9.C pattern. Only `size`/`state`.

### G7 — No `componentOnReady` value re-push (P2)

`[CODE]` `falcon-phone-field.component.ts:166-168` — `writeValue` only sets the signal; same data-table-cell-remount race input/password guard against (the value rides `[attr.value]` declaratively).

### G8 — Validation deferred (P2, by design)

`[CODE]` `falcon-phone-field.tsx:4-5` — strips non-digits + composes a string; never validates length/prefix/realness. Consumers MUST add `Validators.required` + a libphonenumber/regex validator. Intentional; document the contract. (Optional future: a pluggable `validator?: (e164) => boolean`.)

### G9 — Default country list is a Stencil-internal const (P3)

`[CODE]` `DEFAULT_PHONE_COUNTRIES` (25 entries) lives in `falcon-phone-field.utils.ts` and is NOT re-exported from the package barrel for app consumers to merge/extend. Consumers override wholesale via `[countries]`. Consider a public export so a consumer can `[...DEFAULT_PHONE_COUNTRIES, extra]`.

### G10 — Country search is fixed (P3)

`[CODE]` `filterCountries` matches ISO + name + dial-code substring (case-insensitive). No locale-aware sort (Arabic) and no pluggable `searchFn`. Acceptable; add `searchFn?` if needed.

### G11 — Flag-emoji only (P3)

`[CODE]` Flags are `flagEmoji` strings — OS-inconsistent rendering. No `flagUrl?` image fallback per country.

### G12 — Wrapper re-declares its detail interfaces (P3) — **DRY**

`[CODE]` `falcon-phone-field.component.ts:39-61` re-declares `Country`/`ChangeDetail`/`CountryChangeDetail`/`VerifyDetail` locally instead of importing from `falcon-phone-field.types.ts`.

## Missing accessibility features

- **A1 (G3):** verify-button `aria-label`.
- **A2 (P3):** the active option isn't `aria-activedescendant`-tracked during keyboard nav within the open panel (Esc/outside-click are handled; arrow-key navigation *within* the list is not — only the chooser button opens via arrows). Consider full listbox keyboard nav.
- **A3 (P2):** a future `verified` state needs `aria-live`.

## Missing tests

- `[CODE]` Grep 2026-06-03 → **no `*phone-field*.spec.ts` / `.e2e.ts`** for either tag or the wrapper. **GAP** — add a Stencil spec (`filterCountries`/`composeFullNumber`/`digitsOnly` units; open/close/Esc/outside-click; Shadow-inline vs `-tw`-portal) + a wrapper spec (CVA E.164/national split; `(blur)`/`(falcon-verify)`/`(falcon-country-change)` re-emit; Top-Layer acquire/release).

## Missing Tailwind / token parity

- Token contract clean + shared via `:where(... , .falcon-overlay-container)` so the portaled panel inherits tokens (gate-12-rescope). The `-tw` helper is the SSOT. Real parity risk = the **prop** divergence (G1) + the panel render-location divergence (inline vs portal), not the tokens.

## Performance risks

- **Country list is 25, unvirtualized — fine.** (Corrects the prior "~250 nodes, virtualize" concern.)
- The `-tw` panel adds `scroll`/`resize` reposition listeners while open (`:221-222`); they're removed on close + `disconnectedCallback` — no leak. Reposition is `requestAnimationFrame`-throttled.

## Visual / interaction risks

- `[CODE]` Flag-emoji rendering varies across OSes — visual variance (G11).
- `[CODE]` Inline (Shadow) vs portaled (`-tw`) panel can position/stack differently — verify both paths when changing the panel.
- `[CODE]` Three 1px dividers are token-tuned — verify pixel alignment at 200% zoom.

## Recommended upgrade priority

| ID | Title | Priority |
|---|---|---|
| G1 | Shadow-path parity for `verifyIcon` + `*ExtraClass` | P1 |
| G2 | Real `maxlength` input (or remove the misleading binding) | P1 |
| G4 | `verified` / `verifying` state | P2 |
| G3 | Verify-button `aria-label` | P2 |
| G5 | `setFocus()` / `openCountryPicker()` proxies | P2 |
| G7 | `componentOnReady` value re-push | P2 |
| G6 | `variant` / `appearance` | P2 |
| G9 | Public `DEFAULT_PHONE_COUNTRIES` export | P3 |
| G11 | `flagUrl` image fallback | P3 |
| G12 | Import shared detail types | P3 |
| ~~Perf~~ | ~~Virtualize country dropdown~~ | **CLOSED — list is 25, not ~250** |

## Concrete upgrade API

```ts
// Both tags + wrapper
@Input()/@Prop() maxlength?: number;        // forward to native input
@Input()/@Prop() verified = false;
@Input()/@Prop() verifying = false;
@Input()/@Prop() variant: 'form' | 'grid' = 'form';
@Input()/@Prop() appearance: 'default' | 'filled' | 'ghost' = 'default';
@Method() async setFocus(): Promise<void>;        // + wrapper proxy
@Method() async openPanel(): Promise<void>;       // + wrapper proxy (openCountryPicker)
// Shadow tag: add verifyIcon + wrapperExtraClass/inputExtraClass/labelExtraClass (parity with -tw)
// Barrel: export DEFAULT_PHONE_COUNTRIES
```

## Shared vs per-page

All shared. The Top-Layer popover lifecycle + the country panel are intentionally in the component — never re-implement them per page.

## Workarounds today

- For G1: stay on `useTailwind=true` (default).
- For G2: cap length via a Reactive Forms validator (the `[maxlength]` binding does nothing).
- For G4: drive `state='success'` post-verify + token override.
- For G5: reach `ViewChild('phoneFieldEl')` → the inner element.
- For G9: pass a merged `[countries]` array.

## Wave / Sweep Findings

**Consumer count: ~10 files** (`[CODE]` grep `falcon-angular-phone-field` across `apps/` + `libs/falcon/`, 2026-06-03 — User-Details, forgot-password, both add-user steps, add-client owner, both templates button-cards, Studio gallery; see `USAGE.md`). Up from the prior sweep's 5.

**Deep-Dive Sweep (2026-06-03):** corrected the popover-no-op claim (now Top-Layer-acquiring); closed the ~250-country virtualization gap (it's 25); added G1 (Shadow↔`-tw` divergence), G2 (dead `maxlength`), G3 (verify aria-label), G7 (no `componentOnReady` push). 2 HIGH-RISK-QUEUE (G1 prop/render-path parity, G2 data-correctness/API-honesty). No code changed.
