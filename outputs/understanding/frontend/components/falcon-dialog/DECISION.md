# falcon-dialog — DECISION

## Brain SK final recommendation

### Use this component for
- **Almost never directly.** This is the underlying primitive composed by `falcon-angular-confirm-dialog`.
- ONLY use directly when you need a **genuinely bespoke modal body** that `<falcon-angular-popup>`'s 4 variants don't fit. `[CODE]` The contact-groups Share dialog (`share-dialog.component.html:7`) is the canonical legitimate example; the wallet confirm-save modal + templates flow-type modal are others.

### Avoid this component for
- Any of the 4 canonical decision flows (error, delete, unsaved, save) — use `falcon-angular-popup`.
- OK / Cancel confirms — use `falcon-angular-confirm-dialog`.
- Side-anchored sheets — use `falcon-angular-drawer` (NOT `position="side-right"`).
- Tooltips, notifications, popovers — dedicated components.

### Preferred render path
`useTailwind=true` (default) — the `-tw` Light-DOM path also auto-adds footer chrome. Switch to `useTailwind=false` (Shadow) only for style isolation from a noisy parent stylesheet.

### Required upgrades before wider use
**Tier 1 (guard-rail):**
1. Add `@deprecated` JSDoc to wrapper + both Stencil sources (G-DEP).
2. Remove or document `falconConfirm`/`falconCancel` (no built-in buttons emit them — G-CONFIRM).
3. Drop `side-right` from `FalconDialogPosition` (G-SIDE — HIGH-RISK: public-type change).
4. Remove the dead `errorMessage` prop OR wire it to render (G-ERR).
5. Expose `closeAriaLabel` on the wrapper (G-A11Y-LABEL — HIGH-RISK: a11y).

### Relationship to other components

| Component | Relationship |
|---|---|
| `falcon-angular-popup` | **PREFERRED replacement** for action-required flows. Sibling — same native-`<dialog falconOverlay="modal">` Top Layer pattern, but pure-Angular (no Stencil core). |
| `falcon-angular-confirm-dialog` | Composes this for OK/Cancel layouts (per registry; not re-verified 2026-06-03). |
| `falcon-angular-drawer` | Sibling overlay — same `[falconOverlay]` directive (`"drawer"`); use for edge-anchored sheets instead of dialog `position="side-right"`. |
| `falcon-angular-button` | Common footer content when used directly. |
| `[falconOverlay]` directive + `FalconStackingService` | Shared substrate that drives the native `<dialog>` Top Layer + toast-reassert for all three overlays. |

### Exact rule for future implementation tasks
> Do NOT render `<falcon-angular-dialog>` directly in new code unless the modal body is genuinely bespoke. Use `<falcon-angular-popup>` for the 4 canonical action flows; `<falcon-angular-confirm-dialog>` for OK/Cancel; `<falcon-angular-drawer>` for side-anchored sheets. When you DO use it directly: bind `[(open)]`, project `slot="footer"` with `<falcon-angular-button>` (wire `(falconClick)` — NOT `falconConfirm`), gate dismissal on in-flight state (`[closable]`/`[closeOnBackdrop]`/`[closeOnEsc]` bound to `!submitting()` or `[dismissible]="false"`), and render any error in the body slot (NOT `[errorMessage]`). Never add `z-[…]` — the Top Layer handles stacking.

### Status
**@deprecated-for-direct-use but FUNCTIONAL & in production** (per registry + memory). Remains active as the substrate for composed components AND for legitimate bespoke-body modals. Tier-1 guard rails should land before more pages reach for it. **Not a deletion candidate** — genuine direct consumers exist.

---

## Dynamic capability assessment

### 1. What is static today?
- Tag name `<falcon-dialog>` / `<falcon-dialog-tw>` / `<falcon-angular-dialog>` — no polymorphic render.
- Close × button SVG hardcoded.
- Body slot destroyed when `open=false` (`render()` returns `null`).
- `position="side-right"` exists but is conceptually the drawer's job.
- Native `::backdrop` color is a CSS literal (`rgba(13,63,68,0.45)`), not a per-instance token.

### 2. What is already dynamic through inputs/outputs?
- `[CODE]` **16 wrapper `@Input`s** — `open` (signal-mirrored setter) / `title` / `description` / `size` / `closable` / `closeOnBackdrop` / `closeOnEsc` / `dismissible` / `severity` / `position` / `disabled` / `errorMessage` (dead) / `ariaLabel` / `useTailwind` / `rootClass` (+ the `set open` two-way machinery).
- `[CODE]` **5 `@Output`s** — `falconOpen` / `falconClose` / `falconConfirm` (passthrough) / `falconCancel` (passthrough) / `openChange`.
- `show()`/`hide()`/`closeAriaLabel` are Stencil-only (NOT proxied — G-METHOD / G-A11Y-LABEL).

### 3. What is already dynamic through slots / ng-template?
- (default) body content; `slot="header"` rich header; `slot="footer"` actions. No `ng-template` inputs.

### 4. What is dynamic through token / theme overrides?
- Everything visual via `--falcon-dialog-*` (~80 tokens) — backdrop (inner, neutralised), panel surface, header/title/description, close button, body, footer, severity accent, position variants, focus ring, motion. Dark mode auto-flips. **Exception:** the native `::backdrop` dim/blur is a CSS literal, not token-overridable per instance.

### 5. What is dynamic through Tailwind classes?
- Inside slots — full Tailwind. `rootClass` on the Stencil tag. NOT on the panel host (would not penetrate the centring layout).

### 6. What is missing to make this component reusable across pages?
**Narrow, not expand.** It already covers more surface than needed. The fix is to reduce the API to substrate-only (drop dead `errorMessage`, drop `side-right`, document confirm/cancel) + add `closeAriaLabel` for i18n.

### 7. What capability should be added to the shared component (not a page hack)?
- `closeAriaLabel` passthrough (G-A11Y-LABEL). Remove dead props. Add `@deprecated` warnings (G-DEP). Align Shadow footer chrome with `-tw` (DRIFT-FOOTER).

### 8. What flags / options / templates / slots would make it better?
- Fewer, not more. A single `[dismissOptions]` replacing the 3 dismissal props (G-DISMISS-API). A header-actions slot (G-HEADER-ACTIONS). A working `errorMessage` anchor OR its removal.

### 9. What is the safest upgrade path?
1. **Phase A (zero risk):** add `@deprecated` JSDoc + optional one-time runtime warn outside `confirm-dialog` composition; add `closeAriaLabel` `@Input` + `[attr.close-aria-label]`; align the Shadow footer to wrap in chrome like `-tw`.
2. **Phase B (additive):** add a header-actions slot to both cores.
3. **Phase C (API-narrowing — gate behind a release + warn):** remove dead `errorMessage`; drop `side-right` from the type union.
All Phase A/B are additive — no consumer break. Phase C needs a deprecation window.

### 10. What is risky to change because other pages depend on it?
- The `(falconClose)` event + its `reason` payload — `confirm-dialog` (per registry) and the wallet/templates consumers switch on it.
- The default `useTailwind=true` switch — flipping changes DOM structure (Light ↔ Shadow) + the footer-chrome behaviour.
- The body-destroy-on-close behavior — consumers rely on it discarding draft state.
- The native `<dialog>` Top-Layer wrapper — reverting to z-index stacking would regress every overlay (the whole 8-wave migration depends on it).
- Removing the Stencil tag — `confirm-dialog` composition (per registry) would break.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B14). Recommendation unchanged (@deprecated-for-direct-use, FUNCTIONAL, NOT a deletion candidate — genuine bespoke consumers exist). Counts: 16 wrapper `@Input`s, 5 `@Output`s; `show`/`hide`/`closeAriaLabel` Stencil-only. Top-Layer architecture is the load-bearing "risky to change" item added this pass.
