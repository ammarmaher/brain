# falcon-email-field — GAPS AND UPGRADES

> REFRESH 2026-06-03 — re-derived against live source. Corrected G2 (no `verified` prop exists anywhere — the prior doc said "registry mentions verified on the Stencil version"; both `.tsx` files were read and neither declares it). Added the Shadow↔`-tw` prop divergence, the missing `componentOnReady` re-push, and the missing verify-button `aria-label`.

## Missing / divergent capabilities (active source verified)

### G1 — `verifyIcon` + `*ExtraClass` props are `-tw`-only (P1) — **render-path parity**

`[CODE]` The Light tag (`falcon-email-field-tw.tsx:64-73`) declares `verifyIcon`, `wrapperExtraClass`, `inputExtraClass`, `labelExtraClass`. The Shadow tag (`falcon-email-field.tsx`) declares **none** of them. The Angular wrapper forwards them on BOTH branches, but the Shadow branch drops them on the floor. Since `useTailwind=true` is the default, most consumers get them — but `useTailwind=false` silently loses the verify icon + per-instance classes.

**Recommended fix:** add `verifyIcon` + the three `*ExtraClass` props (and the SVG render) to the Shadow tag for parity.

### G2 — No "verified ✓" state (P1)

`[CODE]` Neither `<falcon-email-field>` nor `<falcon-email-field-tw>` has a `verified` (or `verifying`) prop. Once the consumer confirms verification, there is no built-in success visual — a verified address looks identical to an unverified one. (Corrects the prior doc, which speculated the Stencil version had a `verified` prop — it does not.)

**Recommended fix:** add `@Input()/@Prop() verified = false` (token-driven check icon + success border) + `@Input()/@Prop() verifying = false` (spinner in the button). Surface both on the wrapper.

### G3 — Verify button has no `aria-label` (P2) — **a11y**

`[CODE]` `falcon-email-field.tsx:205-215` / `-tw:224-251` — the `<button>` relies on its visible `verifyLabel` text only. With `verifyIcon` on, the SVG is `aria-hidden` and the text still labels it — acceptable. But an explicit `aria-label` (e.g. "Verify email") would be more robust for icon-heavy locales / future icon-only modes. The prior API doc CLAIMED an aria-label exists — it does not.

### G4 — No `componentOnReady` value re-push (P2)

`[CODE]` `falcon-email-field.component.ts:104-106` — `writeValue` only sets the signal; there is no defensive `componentOnReady().then(push)` like `falcon-input`/`falcon-password` have. An email-field rendered inside a remounting `<falcon-angular-data-table>` cell could render empty until the first keystroke (the documented cell-remount race). Not yet observed for email-field, but the guard is absent.

### G5 — `setFocus()` not proxied on the wrapper (P2)

`[CODE]` Both tags expose `@Method() async setFocus()` but the Angular wrapper does not proxy it. Consumers must reach `ViewChild` → the inner Stencil element. Add an `async setFocus()` proxy.

### G6 — No `variant` / `appearance` (P2)

Does not follow the `<falcon-input>` Wave-9.C pattern (`form`/`search`/`grid` × `default`/`filled`/`ghost`). Only `size`/`state`.

### G7 — Validation deferred — no built-in email regex (P2, by design)

`[CODE]` `falcon-email-field.tsx:4-5` banner: "Validation explicitly deferred — emits falcon-verify only." Consumers MUST add `Validators.email`. Document clearly (this is intentional, not a bug) — and consider an opt-in `validateOnBlur` for convenience.

### G8 — No "verification result" event (P3)

The component emits `falcon-verify` on click but never tracks success/failure. The consumer manages result state externally. Tied to G2 (`verifying`/`verified`).

### G9 — Wrapper re-declares change/verify detail interfaces (P3) — **DRY**

`[CODE]` `falcon-email-field.component.ts:23-29` re-declares `FalconEmailFieldChangeDetail` / `…VerifyDetail` locally instead of importing from `falcon-email-field.types.ts`.

## Missing accessibility features

- **A1 (G3 above):** verify button `aria-label`.
- **A2 (P3):** a future "verified" state needs an `aria-live` announcement.

## Missing tests

- `[CODE]` Grep 2026-06-03 → **no `*email-field*.spec.ts` / `.e2e.ts`** for either tag or the wrapper. **GAP** — add a Stencil parity spec (Shadow vs `-tw` prop surface — would catch G1) + a wrapper spec (CVA, `(falcon-verify)` re-emit, `(blur)` re-emit, `verifyDisabled` independence).

## Missing Tailwind / token parity

- Token contract is clean + shared via `:where(...)`; the `-tw` helper is the SSOT both paths' visuals derive from. The real parity risk is the **prop** divergence (G1), not the tokens.

## Performance risks

- None. `isFieldInError` is a trivial getter; no eager lists.

## Visual / interaction risks

- `[CODE]` Single-element border is token-tuned — height/radius token edits can desync input vs button. Verify both heights after token changes.
- Verify-button position is RTL-sensitive — uses logical properties, so it flips correctly, but confirm on Arabic.

## Recommended upgrade priority

| ID | Title | Priority |
|---|---|---|
| G1 | Shadow-path parity for `verifyIcon` + `*ExtraClass` | P1 |
| G2 | `verified` / `verifying` state + visual | P1 |
| G3 | Verify-button `aria-label` | P2 |
| G4 | `componentOnReady` value re-push | P2 |
| G5 | `setFocus()` wrapper proxy | P2 |
| G6 | `variant` / `appearance` | P2 |
| G9 | Import shared detail types | P3 |

## Concrete upgrade API

```ts
// Both tags + wrapper
@Input()/@Prop() verified = false;
@Input()/@Prop() verifying = false;
@Input()/@Prop() variant: 'form' | 'grid' = 'form';
@Input()/@Prop() appearance: 'default' | 'filled' | 'ghost' = 'default';
@Method() async setFocus(): Promise<void>;   // + wrapper proxy
// Shadow tag: add verifyIcon + wrapperExtraClass/inputExtraClass/labelExtraClass (parity with -tw)
```

## Shared vs per-page

All shared. `verified`/`verifying` (G2) belong in the component so every verify-flow renders the same success visual.

## Workarounds today

- For G1: stay on `useTailwind=true` (default) — `verifyIcon` + `*ExtraClass` work there.
- For G2: drive `state='success'` after the server confirms + override a token; render any "✓" sibling externally.
- For G5: reach into `ViewChild` → the inner Stencil element to focus.

## Wave / Sweep Findings

**Consumer count: 2** (`[CODE]` grep `falcon-angular-email-field` across `apps/` + `libs/falcon/`, 2026-06-03 — User-Details page + Studio gallery default; see `USAGE.md`). The prior sweep's count of 1 (`playground.page.html`) was stale.

**Deep-Dive Sweep (2026-06-03):** corrected the false `verified`-prop claim (G2) and the false verify-button-aria-label claim (G3); documented the Shadow↔`-tw` `verifyIcon`/`*ExtraClass` divergence (G1) and the missing `componentOnReady` push (G4). 2 HIGH-RISK-QUEUE (G1 prop-parity/contract, G3 a11y). No code changed.
