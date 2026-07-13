# falcon-form-field — GAPS AND UPGRADES

> **REFRESHED 2026-06-03 (B24).** Biggest correction: **G1 (SCSS-violates-no-SCSS) is RESOLVED / MOOT** — there is no `.scss`/`.css` file; the component is already Tailwind-only. The genuine remaining gaps are the label-association (G2), the double-label trap (G3), the a11y sync (G4/G5), and zero tests. Findings rows are in `plans/library-deep-dive/FINDINGS/B24.md`. We FIX NOTHING this pass.

## Missing capabilities (active source verified)

### G1 — SCSS file ~~exists (violates no-SCSS rule)~~ → **RESOLVED / MOOT** (was P1)

`[CODE]` **CORRECTION 2026-06-03:** there is **no `falcon-form-field.component.scss`** (and no `.css`) on disk (Glob clean). The component is `templateUrl` HTML + inline Tailwind utilities + two `var(--text-*, fallback)` reads (`TOKENS.md`). The prior dossier's central "migrate SCSS → Tailwind" P1 blocker no longer applies — that migration is **done** (or the SCSS never shipped). **No action needed.** (The only residual token note is the two `var(..., #hex)` fallbacks — verify `--text-2`/`--text-muted` exist platform-wide; minor, see TOKENS G-TOKEN-FALLBACK.)

### G2 — Label not programmatically associated with inner control (P1)

`[CODE]` `html:7` — the rendered `<label>` has **no `for=`** pointing to the slotted control's `id`. Screen readers may not announce the label when the slotted input is focused.

**Recommended fix:** add an optional `@Input() controlId?: string`; render `[for]="controlId()"` on the label and require the consumer to pass the inner control's `inputId`. OR auto-generate an id + bridge. Genuinely still open.

### G3 — Component duplicates label rendering when wrapping Falcon inputs (P1)

`<falcon-form-field label="X">` + `<falcon-angular-input label="X">` renders TWO labels (the wrapper's `<label>` + the input's built-in label). Consumers must set the label on exactly one.

**Recommended fix:** document the migration path (done — `USAGE`/`OVERVIEW`/`DECISION`). Once all wizard templates set the label on the input, deprecate `<falcon-form-field>` for Falcon-input usage. (This is the strategic direction; not a code change to the wrapper itself.)

### G4 — Required asterisk + `aria-required` not synced (P2)

`[CODE]` `html:9-11` — the wrapper renders the visual asterisk from `required`, but `aria-required` lives on the **slotted control**. Consumer must set both.

**Recommended fix:** during migration to built-in input labels this becomes moot (the Falcon input handles both). For non-Falcon controls, document the requirement.

### G5 — No cross-bind of error visual to the slotted control's actual state (P2)

`[CODE]` ts:29-32 — `hasError` is derived from `errorKey`/`invalid` only; it does NOT read the slotted control's `state="error"`. The consumer must drive both (`[errorKey]` on the wrapper AND `[state]="…'error':'default'"` on the inner input — the real usages do exactly this).

### G6 — `hint` vs `helperText` naming inconsistency (P3)

`[CODE]` ts:19 — the wrapper input is `hint`; Falcon inputs use `helperText`. Minor friction when migrating.

**Recommended fix:** add a `helperText` alias input (forwards to `hint`) IF the wrapper survives; otherwise moot on deprecation.

### G7 — `var(--token, #hex)` fallback dependency (P3, new 2026-06-03)

`[CODE]` `html:7,25` — label/hint colors are `var(--text-2,#3d3d3d)` / `var(--text-muted,#6b7280)`. If those theme tokens are undefined in some theme, the baked hex fallback is used silently. Low risk, but worth verifying the `--text-*` tokens exist platform-wide (and ideally migrating the literal fallbacks to a defined token).

## Missing accessibility

- See G2 (no `for=`), G4 (asterisk vs `aria-required`).
- `[CODE]` No `aria-describedby` joining the error/hint line to the slotted control — the message is visual-only; AT association is the consumer's job (A1, P2).

## Missing tests

- `[CODE]` **No `*.spec.ts`** (Glob 2026-06-03). The logic is pure + trivially testable: `hasError` precedence (`invalid` wins over `errorKey`), error-xor-hint branch, label-row suppression on empty `label`, disabled dimming, content projection. **GAP-TEST:** add `falcon-form-field.component.spec.ts`. No Stencil constraint (pure Angular).

## Missing Tailwind / token parity

- **N/A** — Angular-only single-render component; no Shadow/`-tw` pair and no token file. Cross-framework parity is not achievable without a Stencil port (which is NOT recommended for a deprecation-track component).

## Performance risks

- **None.** Signals + `OnPush` + one `computed`. Trivial.

## Visual / interaction risks

- **Double-label** (G3) is the main visible risk when wrapping Falcon inputs.
- (Prior "style drift between SCSS wrapper and Tailwind children" risk is GONE — the wrapper is itself Tailwind now.)

## Recommended upgrade priority

| ID | Title | Priority | Risk-class |
|---|---|---|---|
| G2 | Programmatic label association (`controlId`/`for=`) | P1 | safe-local |
| G3 | Deprecation plan (migrate Falcon-input usages off the wrapper) | P1 | safe-local (per-template edits) |
| G4 | A11y sync with slotted control | P2 | safe-local |
| G5 | Error-state cross-bind | P2 | safe-local |
| A1 | `aria-describedby` for the message | P2 | safe-local |
| G6 | `helperText` alias | P3 | safe-local |
| G7 | Verify `--text-*` token fallbacks | P3 | safe-local |
| G-TEST | Add component spec | P2 | safe-local |
| ~~G1~~ | ~~Migrate SCSS → Tailwind~~ | **RESOLVED** | — |

## Concrete upgrade API (for the deprecation path)

```ts
@Input() controlId?: string;   // G2 — render [for]="controlId" on the label
@Input() helperText?: string;  // G6 — alias for hint
// JSDoc @deprecated once Falcon-input usages migrate (G3)
```

Migration audit: replace `<falcon-form-field label="X">…<falcon-angular-input>…</falcon-form-field>` patterns with a single `<falcon-angular-input label="X">`; drop `<falcon-form-field>` from `imports`; track via grep/gate.

## Shared vs per-page

Shared — but the strategic direction is to RETIRE this wrapper for Falcon-input usages (keep only for non-Falcon controls). Do not add new usages.

## Workarounds today

- Continue using as-is in the existing wizards; do not add new `<falcon-form-field>` around Falcon inputs.
- For label-for-control: set a shared `inputId` on the inner input explicitly until G2 lands.

## Deep-Dive Sweep Findings (2026-06-03 — B24, REFRESH)

**Consumer count: 54 occurrences / 12 files** (10 live templates across BOTH consoles + templates-page; 2 docs) ([CODE] grep `<falcon-form-field[\s>]`).

- **G1 RESOLVED** — the "SCSS violation" was DRIFT; no stylesheet exists, the component is already Tailwind-only. This is the headline correction of the refresh.
- **Consumer-count drift fixed** — prior "5 admin-only" → now 10 live templates spanning admin + management + templates-page.
- **Best-practice posture:** PASS on Angular-21 surface (standalone, `input()`/`computed`, `OnPush`, zoneless-safe, no NgModule, `@if` control flow, no SCSS, no hex outside `var()` fallbacks). Genuine gaps: label association (G2), double-label trap (G3), a11y sync (G4/G5/A1), zero tests, naming alias (G6).
- **No deletion flag** — still ACTIVE in production wizards; **deprecation-track** (retire for Falcon-input usages over time), not a removal candidate today.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B24) against `falcon-form-field.component.ts` (33 ln) + `.html` (29 ln). G1 confirmed RESOLVED (Glob: no `.scss`/`.css`). G2 (no `for=`), G3 (double-label), G4/G5 (a11y/error-bind), G7 (`var()` fallback), zero specs all source-confirmed. Consumer sweep re-run (54 occ / 12 files). No deletion/promotion flags.
