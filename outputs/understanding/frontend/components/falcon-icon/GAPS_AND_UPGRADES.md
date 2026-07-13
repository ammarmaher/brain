# falcon-icon — GAPS AND UPGRADES

## Missing capabilities (active source verified)

### G1 — Widespread raw-`<i>` adoption gap (P0 — design-system enforcement)

Most consumers still write the raw `<i class="falcon-icon falcon-icon-X">` directly (settings-tab buttons, drawer footers, etc.), bypassing the wrapper's size + a11y standardisation. The wrapper now HAS real consumers (comm-mkt-view, wallet/new-wallet) but the bare-class pattern dominates.

**Risk:** inconsistent sizes (each consumer picks pixels), missing `aria-hidden`/`role="img"` posture, harder to audit. **NOT lint-gated** today (no ESLint ban on raw `<i class="falcon-icon">` — `[MEMORY]` enforcement is night-shift-audit + review, not lint).

**Recommended fix (P0):** an ESLint rule + codemod migrating raw `<i class="falcon-icon falcon-icon-X">` → `<falcon-angular-icon name="X">`, gradual.

### G2 — No `spin` / `pulse` animation (P1)

`[CODE]` falcon-icon.tsx — no animation props. For inline loading indicators consumers add Tailwind `animate-spin` on the host (the font also ships a `.falcon-icon-spin` keyframe class, but the wrapper does not expose it).

**Recommended fix (P1):** `@Input() spin = false` / `@Input() pulse = false` → toggle the font's `.falcon-icon-spin` class (respects `prefers-reduced-motion`, already handled in the font CSS).

### G3 — No `<iconify-icon>` fallback / unified interface (P1)

The platform has TWO icon sources: the Falcon font (314 glyphs, preferred) and Iconify (`iconify-icon` package, side-effect import). A unified `<falcon-angular-icon>` could route by name prefix: `name="pencil"` → Falcon font; `name="solar:pencil-bold"` (contains `:`) → Iconify.

**Recommended fix (P1):** auto-detect a `:` in `name` and delegate to `<iconify-icon>`. Consolidates the icon strategy. (Note: a platform-owned exact SVG still goes through `<falcon-svg-icon>` — see RECOGNITION.)

### G4 — No TypeScript icon-name union (P2)

`[CODE]` `name` is a free `string` — there is no `FalconIconName` union, so a typo compiles and renders an empty `<i>` silently.

**Recommended fix (P2):** auto-generate `export type FalconIconName = 'pencil' | 'trash' | … (all 314)` from `falcon-icons.css` at build time; type `name: FalconIconName`. Compile-time validation for free.

### G5 — No `color` shorthand (P2)

Color is via the `--falcon-icon-color` token / parent `currentColor`. A shorthand `@Input() color?: string` (→ `--falcon-icon-color: var(--color-{value})`) would be ergonomic.

### G6 — No `flip` / `rotate` (P2)

For arrow/chevron glyphs that should mirror per direction/context. `@Input() flip?: 'horizontal'|'vertical'|'both'` + `@Input() rotate?: 90|180|270`. (Also helps RTL — see TOKENS RTL note: arrows are NOT auto-mirrored today.)

### G7 — Unknown name renders silently (P2 — DX)

`[CODE]` falcon-icon.tsx:34-35 — an unknown/typo `name` yields an empty `<i>` with no console warning. A dev-mode warning ("`falcon-icon-foo` not in registry") would catch typos.

### G8 — `rootExtraClass` not surfaced on the wrapper (P3)

`[CODE]` falcon-icon-tw.tsx:20 — the `-tw` twin accepts `rootExtraClass` (appended to the inner `<i>`), but the Angular wrapper does not forward it. Minor — host `class=` covers most needs (lands on the host, not the `<i>`).

## Missing accessibility features

- **A1 (P3):** no `title` attribute on the `<i>` for a browser-native hover tooltip (distinct from `<falcon-angular-tooltip>`). Could add `[title]="label"` when `decorative=false`.
- **A2:** a11y posture is otherwise correct and **parity-matched across Shadow + `-tw`** (both compute `aria-hidden`/`role`/`aria-label` identically) — no gap.

## Missing tests

- `[CODE]` **NO `.spec.ts` / `.e2e.ts` for any layer** (verified 2026-06-03). GAPs: (a) a render spec confirming `name` → `falcon-icon-{name}` class on both paths; (b) the a11y truth-table (`decorative=true` → `aria-hidden`; `decorative=false`+`label` → `role="img"`+`aria-label`; `decorative=false` no `label` → silent); (c) a registry-resolution sanity check.

## Missing Tailwind / token parity

- `[CODE]` Shadow and `-tw` both emit `<i class="falcon-icon falcon-icon-{name}">` and consume the SAME `--falcon-icon-*` tokens (size + color). The `-tw` path adds Tailwind size utilities via `falconIconClasses()` that read the same tokens. **No divergence.** Studio runtime mutation hits both. Parity GOOD.

## Performance risks

- `[CODE]` Per-icon render is ~constant (one `<i>` + a class). For hot paths with **>200 icons** (table rows × icons) the bare `<i class="falcon-icon …">` is cheaper than 200 component instances — a documented trade-off (use raw `<i>` only on proven hot paths; default to the wrapper).

## Visual / interaction risks

- `currentColor` inheritance breaks under a gradient-text parent (gradients don't apply to glyphs) — acceptable, documented.
- A missing/typo glyph is invisible (empty `<i>`) — G7.

## Recommended upgrade priority

| ID | Title | Priority |
|---|---|---|
| G1 | ESLint rule + codemod: raw `<i>` → `<falcon-angular-icon>` | P0 |
| G2 | `spin` / `pulse` animation props | P1 |
| G3 | Iconify fallback via `:` prefix detection | P1 |
| G4 | TypeScript `FalconIconName` union (314, build-gen) | P2 |
| G5 | `color` shorthand | P2 |
| G6 | `flip` / `rotate` (also RTL) | P2 |
| G7 | Dev-mode unknown-name warning | P2 |

## Recommended upgrade API (concrete)

```ts
@Input() name!: FalconIconName | string;     // typed once G4 lands; ':' → Iconify (G3)
@Input() color?: string;                      // 'falcon-teal-500' → --falcon-icon-color (G5)
@Input() spin = false;                        // G2
@Input() pulse = false;                       // G2
@Input() flip?: 'horizontal' | 'vertical' | 'both';  // G6
@Input() rotate?: 90 | 180 | 270;             // G6
```

```ts
// build-generated from falcon-icons.css
export type FalconIconName = 'pencil' | 'trash' | 'cog' | 'check' | 'times'
  | 'user' | 'wallet' | 'credit-card' | 'building' | 'calendar' | /* … 314 total */;
```

## Fix-shared-vs-per-page

All gaps belong in the **shared component** + the font registry. G1 additionally needs lint enforcement. Per-page hacks (e.g. one consumer adding `animate-spin`) are workarounds, not the fix.

## Workarounds (if upgrade blocked)

- For G2 today: `class="animate-spin"` on the host, or `<falcon-angular-icon name="spinner" class="falcon-icon-spin">`-style font class.
- For G5 today: parent `text-falcon-*` or inline `style="--falcon-icon-color: …"`.
- For G6 today: host `class="rotate-90"` / `class="-scale-x-100"` (RTL mirror).

## Wave 7 Findings (2026-05-17)

**Consumer count: 0** ([CODE] grep `<falcon-angular-icon>`). Flag: "Zero adoption — showcase/playground-only; promote or retire."

## Deep-Dive Sweep Findings (2026-06-03 — B11)

**Consumer count: 12 wrapper occurrences / 5 app files + comm-mkt-view in `libs/falcon`** ([CODE] grep `falcon-angular-icon`).

Drift corrected vs prior dossier (component stays ACTIVE; NO deletion/promotion flag):
- **Icon-name count corrected to 314** (was "122" throughout) — the live `falcon-icons.css` declares 314 glyph `::before` rules; "122" was the original PrimeIcons-migration subset. (The BUSINESS/INTEGRATION files' prior "~322 declarations" estimate is now pinned to the exact **314**.)
- **Adoption corrected** — prior "0 consumers / showcase-only / candidate for retirement" is **stale**; the wrapper is adopted (comm-mkt-view + wallet/new-wallet). The "promote or retire" flag resolves toward **promote**. The raw-`<i>` adoption gap (G1) is the genuine remaining adoption issue.
- **Dual-render parity confirmed** — Shadow + `-tw` are prop-identical with identical a11y logic; tokens shared. No parity gap.
- **All findings `safe-local`** (count-correction + adoption doc + additive enhancement proposals) — no HIGH-RISK. See FINDINGS/B11.md.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B11) against all source layers + `falcon-icons.css` (314 glyph rules). Adoption-gap (G1, raw `<i>` dominant), no animation (G2), no Iconify router (G3), no name union (G4), no tests confirmed. Count + adoption drift corrected. No deletion/promotion flag — component stays ACTIVE (promote).
