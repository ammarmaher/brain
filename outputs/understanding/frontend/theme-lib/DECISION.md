# falcon-theme — DECISION

> Batch **L07**. Brain SK recommendation + the exact rule for future tasks touching the design-token SSOT.

## Brain SK final recommendation

**STATUS: CANONICAL / LOAD-BEARING — keep as the single design-token SSOT. No restructure. Treat as forward-only.** `[CODE] README.md:44`.

`@falcon/theme` is the correct, well-built foundation of the FE styling stack: one Tailwind v4 `@theme` block + the vendored icon font + font assets, consumed once per app via CSS `@import`, mirrored to a typed `tokens.ts`. Audit is **🟡 GOOD with 🟠 medium (F)** — the medium is hygiene/drift (a stale in-file `@config` comment, a stale prior brain audit now superseded by this dossier, split text-font `@font-face` ownership), **never design**. **Zero HIGH-RISK-QUEUE items.**

## Use this library for

- Adding/editing a **global theme primitive**: a color stop, a `--text-*` size, a `--spacing-*` step, a `--radius-*`, a `--shadow-*`, a breakpoint, a z-index tier, a motion duration/easing/keyframe, a `--tracking-*`, a border-width, a control/icon/tile sizing token. `[CODE] README.md:44-48`.
- Adding a **new Falcon icon glyph** (extend `falcon-icons.css` + the woff2; then regenerate the `FalconIconName` union if/when B11 G4 lands).
- Tuning **dark-mode** surface/text/border/shadow values (the override block). `[CODE] :553-640`.
- Reading token names/values programmatically in build-config / the Studio registry via `@falcon/theme/tokens`. `[CODE] package.json:11`.

## Avoid this library for

- **Component-level visual knobs** (`--falcon-input-*`, `--falcon-drawer-*`, `--falcon-wallet-*`, …) — those belong in `libs/falcon-ui-tokens/src/components/*.tokens.css` (L06), scoped under `:where(falcon-X,…)` per gate-12. `[CODE] README.md:45-47`.
- **One-off single-component values** — if exactly one component needs it, it is a component token, not a theme primitive.
- **Angular/TS runtime consumption of tokens** — tokens flow via CSS at build time; do NOT `import` them into components. `[CODE] README.md:40-42`.
- **Hand-editing `tokens.ts`** — AUTO-GENERATED; edit the CSS and regenerate. `[CODE] tokens.ts:1`.
- **Reintroducing PrimeNG anything** (`pi pi-*`, `tailwindcss-primeui`, `@plugin`, `.p-*`) — uninstalled platform-wide 2026-05-10. `[CODE] README.md:52-53`.

## Preferred consumption path

- **Templates:** generated Tailwind utilities (`bg-falcon-*`, `text-falcon-*`, `rounded-pane`, `shadow-falcon-md`, `z-falcon-modal`, `dark:*`).
- **Component CSS / Stencil:** `var(--token)` references.
- **Apps:** `@import` the SSOT first, then `falcon-ui-tokens`, in `tailwind.css` (load order is load-bearing). `[CODE] apps/*/src/tailwind.css:4-8`.
- **Icons:** `<falcon-angular-icon name="…">` (preferred over the raw `<i class="falcon-icon …">` adoption gap, B11 G1).

## Required upgrades before wider use

**None are blockers.** The SSOT is production-quality and already platform-wide. The AUDIT findings are improvements:
1. **F1 (do soon):** correct the stale `@config` comment and consider dropping the vestigial `@config` directive (build-sanity check first).
2. **F2 (housekeeping):** mark `understanding/frontend/theme/THEME_SSOT_AUDIT.md` superseded by this L07 dossier (it is 2026-05-13 / 486-line / 216-token — the live file is 699-line / 289-token).
3. **F3 (additive):** consolidate the text-font `@font-face` declarations into this lib, or document the split ownership.
4. **F8 / D1 (additive):** add a CSS↔`tokens.ts` sync spec + a glyph-count freeze + a dark-remap-completeness check; add a `prefers-reduced-motion` story for the global motion tokens.
5. **F4/F5/F6/F7 (cosmetic):** delete the stray zips, fix the truncated `NeueHaasDisplayMediu.ttf` name, comment the spacing-collision aliases + the non-monotonic type scale.

## Relationship to other libraries

- **`falcon-ui-tokens` (L06)** — the layer DIRECTLY ABOVE. Component-token files reference these theme primitives via `var(--…)` and add per-component knobs. The split (theme = global primitives, ui-tokens = component knobs) is the load-bearing boundary; gate-12 polices L06, not this lib. `[CODE] README.md:45-47`.
- **`falcon-ui-core` (B-batches)** — Stencil components + Angular wrappers + `tailwind-classes.ts` helpers consume both layers. The `-tw` Light-DOM twins render Tailwind utilities generated from THIS file's `@theme`.
- **`falcon-icon` component (B11)** — the Angular/Stencil wrapper over the `.falcon-icon` font defined here (314 glyphs).
- **Falcon Studio** — its token registry reads these tokens (and the Stepper Wave-10D knobs + animation keyframes are written by the Studio left-rail). `[CODE] :241-272, :671-698`.
- **Host theme facade** — `apps/host-shell/falcon-facades/host-theme.facade.ts` toggles `app-dark`+`data-theme` to activate this file's dark override block. `[CODE] host-theme.facade.ts:17,63`.

## Exact rule for future implementation tasks

1. **Need a NEW global value used by ≥2 components?** Add it to `falcon-tailwind-tokens.css` in the right family divider, with a `*** ***` rationale comment, then run `nx run falcon-theme:generate-tokens-ts` so `tokens.ts` stays in sync.
2. **Need a single-component value?** Put it in that component's `*.tokens.css` (L06), NOT here.
3. **Reference tokens** via Tailwind utility or `var(--…)`. **Never** hardcode hex/px/rgb downstream.
4. **Dark mode:** if you add a surface/text/border/shadow color, add its dark counterpart in the override block (`:553-640`). Do NOT add geometry to the dark block.
5. **New icon:** extend `falcon-icons.css` + the woff2; keep the `<i class="falcon-icon falcon-icon-{name}">` contract; prefer routing consumers through `<falcon-angular-icon>`.
6. **Never** hand-edit `tokens.ts`, never reintroduce PrimeNG, never move component knobs into this file.
7. **Editing the `@layer`/`@import`/`@config`/`@custom-variant` header?** Read the 13-line banner at `:5-17` first — the order is load-bearing (corner-toast regression).

---

## Dynamic capability assessment (10 axes — adapted for a token SSOT)

### 1. What is static today?
- The literal token VALUES (hex/rem/px/cubic-bezier) — this is the one file that *holds* literals by design. `[CODE] :31-528`.
- The 314 icon glyph codepoints (`\e900`–`\ea39`) + the woff2 binary. `[CODE] falcon-icons.css:73-386`.
- The `@layer` order, the dark selector (`.app-dark`/`.dark`), the breakpoint values.

### 2. What is already dynamic through "inputs" (token references)?
- **Everything downstream.** Any consumer changes its appearance by *referencing a different token* — the SSOT exposes ~289 named knobs (`tokens.ts:4`) as Tailwind utilities + `var()` handles. Swapping `rounded-sm`→`rounded-pane` or `--shadow-falcon-md`→`--shadow-falcon-lg` is the "input."
- The Stepper Wave-10D family + the Studio animation keyframes are *runtime-writable* knobs (Studio sets them via inline `style.setProperty`). `[CODE] :241-272, :671-698`.

### 3. What is dynamic through slots / templates?
- N/A (no component). The icon font's "slot" analog is the glyph name in the class (`falcon-icon-{name}`).

### 4. What is dynamic through token/theme overrides?
- **Dark mode** — the entire surface/text/border/shadow palette flips by re-declaring the SAME token names under `:where(.app-dark,…)`. A consumer reading `--color-falcon-neutral-900` inverts for free. `[CODE] :553-640`.
- **Per-instance override** — any consumer can scope-override a token on a host element (the documented visual-tweak pattern).

### 5. What is dynamic through Tailwind classes?
- Every `@theme` token name auto-generates utilities (`bg-/text-/border-/p-/m-/gap-/rounded-/shadow-/z-/leading-/tracking-/animate-/bg-falcon-chart-grid`, responsive variants from the breakpoints, `dark:` from the custom-variant). This is the PRIMARY consumption surface.

### 6. What is missing to make this reusable across pages?
- It already IS the platform-wide reuse layer. The missing pieces are *guards*, not capabilities: a CSS↔`tokens.ts` sync test (F8), a glyph-count freeze (F8), reduced-motion handling for the global motion tokens (D1), and self-owned text-font `@font-face` (F3).

### 7. What capability should be added (not a page hack)?
- A `prefers-reduced-motion` override block so the `--animate-*`/`--duration-falcon-*` tokens self-neutralize (today only the icon spinner is guarded). `[CODE] falcon-icons.css:48-61` (the precedent) vs `:663-698` (unguarded).
- A generated `FalconIconName` union (B11 G4) sourced from this file so icon names are type-checked.

### 8. What flags / options would make it better?
- A documented "alias" convention for the spacing value-collisions (F6) and a stronger inline note for the non-monotonic `text-xl`/`2xl` (F7) — so editors don't "fix" intentional values.
- Optional: a density-aware token tier (today density lives in L06's `density.css`).

### 9. What is the safest upgrade path?
1. **Phase A (zero-risk doc):** correct the `@config` comment (F1); mark the old `THEME_SSOT_AUDIT.md` superseded (F2); comment the collision aliases + non-monotonic scale (F6/F7); delete the stray zips + fix the truncated filename (F4/F5).
2. **Phase B (additive CSS):** add a `@media (prefers-reduced-motion: reduce)` override for the motion tokens (D1); consolidate text-font `@font-face` into this lib (F3).
3. **Phase C (additive tests):** CSS↔`tokens.ts` sync spec + glyph-count freeze + dark-remap-completeness spec (F8).
4. **Phase D (build cleanup):** after a build-sanity check, drop the vestigial `@config` directive (F1).
All additive — no consumer break.

### 10. What is risky to change because everything depends on it?
- **Any token VALUE change** ripples to every component in every framework simultaneously (`[CODE] README.md:49-51`) — a brand-teal or radius edit is a platform-wide visual change. Review accordingly.
- **The `@layer` order** (`:18`) — reordering re-breaks corner-anchored toasts (the documented Wave-9 regression). `[CODE] :5-17`.
- **Renaming a token** without regenerating `tokens.ts` silently desyncs the TS mirror AND breaks every `var()`/utility consumer.
- **The dark selector** (`.app-dark`/`.dark`) — anything keying off the class name (the host theme facade, e2e tests) breaks if changed.
- **Spacing/radius "collision" aliases** (F6) — "fixing" `--spacing-14` to a distinct value silently shifts every consumer that used the 14-alias.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (L07). Recommendation (CANONICAL / forward-only / 0 HIGH-RISK) grounded in the full read of the 4 src files + README + project.json + package.json + the 3 app Tailwind entries; L06 boundary, Studio knob ownership, and dark-toggle facade all source-prefixed; upgrade path maps 1:1 to the AUDIT findings. No source edited.
