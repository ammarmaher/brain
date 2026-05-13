# falcon-dialog — DECISION

## Brain SK final recommendation

### Use this component for
- **Almost never directly.** This is the underlying Stencil primitive composed by `falcon-angular-confirm-dialog` and historically by `send-credentials-popup`.
- ONLY use directly when:
  - You need a custom modal body that `<falcon-angular-popup>`'s 4 variants don't fit.
  - You need a centered overlay with custom severity styling beyond what popup offers.

### Avoid this component for
- Any of the 4 canonical decision flows (error, delete, unsaved, save) — use `falcon-angular-popup`.
- OK / Cancel confirms — use `falcon-angular-confirm-dialog`.
- Side-anchored sheets — use `falcon-angular-drawer`.
- Tooltips, notifications, popovers — use the dedicated components.

### Preferred render path
`useTailwind=true` (default).

### Required upgrades before wider use
**Tier 1 (guard-rail):**
1. Add `@deprecated` JSDoc to wrapper + Stencil sources.
2. Remove or document `falconConfirm` / `falconCancel` events (no built-in buttons emit them).
3. Drop `side-right` from `FalconDialogPosition` (use drawer).
4. Remove dead `errorMessage` prop OR wire it.
5. Expose `closeAriaLabel` in wrapper.

### Relationship to other components

| Component | Relationship |
|---|---|
| `falcon-angular-popup` | **PREFERRED replacement** for action-required flows. |
| `falcon-angular-confirm-dialog` | Composes this for OK/Cancel layouts. |
| `falcon-angular-drawer` | Sibling overlay — use for edge-anchored sheets instead of dialog `position="side-right"`. |
| `falcon-angular-button` | Common footer content when used directly. |

### Exact rule for future implementation tasks
> Do NOT render `<falcon-angular-dialog>` directly in new code. Compose via `<falcon-angular-popup>` for the 4 canonical action flows. Compose via `<falcon-angular-confirm-dialog>` for OK / Cancel prompts. Use `<falcon-angular-drawer>` for side-anchored sheets. Only fall back to direct `<falcon-angular-dialog>` for genuinely bespoke modal bodies — when this happens, flag it in code review and consider lifting the pattern into a new `popup` variant.

### Status
**DEPRECATED** (per project memory + registry) — not for direct net-new use. Remains active as the substrate for composed components. Tier-1 guard rails should land before more pages reach for it.

---

## Dynamic capability assessment

### 1. What is static today?
- Tag name is `<falcon-dialog>` / `<falcon-angular-dialog>` — no polymorphic render.
- Close × button SVG is hardcoded.
- Body slot is always destroyed when `open=false` (returns `null`).
- `position="side-right"` exists but is conceptually drawer's job.

### 2. What is already dynamic through inputs/outputs?
- `open`, `title`, `description`, `size`, `closable`, `closeOnBackdrop`, `closeOnEsc`, `dismissible`, `severity`, `position`, `disabled`, `errorMessage`, `ariaLabel`.
- Outputs: `falconOpen`, `falconClose`, `falconConfirm`, `falconCancel`, `openChange`.

### 3. What is already dynamic through slots / ng-template?
- (default) — body content.
- `slot="header"` — rich header.
- `slot="footer"` — footer actions.

### 4. What is dynamic through token / theme overrides?
Everything visual — backdrop, panel surface, header, body, footer, severity accent, motion, z-index.

### 5. What is dynamic through Tailwind classes?
- Inside slots — full Tailwind.
- Not on host.

### 6. What is missing to make this component reusable across pages?
**Nothing** — the component already covers more surface than is needed. The fix is to NARROW its surface, not expand it. Reduce the API to substrate-only.

### 7. What capability should be added to the shared component instead of a one-off page hack?
Remove dead props (`errorMessage`, `falconConfirm`/`falconCancel`). Add deprecation warnings.

### 8. What flags / options / templates / slots would make it better?
- Less.
- A simpler `dismissOptions` object replacing the 3 separate dismissal props.

### 9. What is the safest upgrade path?
1. Add `@deprecated` JSDoc + a one-time runtime warning when rendered outside `confirm-dialog` composition.
2. Drop `side-right` position over 1 release (with console warning during the transition).
3. Eventually physically remove the wrapper (Stencil tag stays as substrate).

### 10. What would be risky to change because other pages depend on it?
- The wrapper itself is composed by `confirm-dialog`. Removing it without migrating `confirm-dialog` would break.
- The `(falconClose)` event is referenced by `confirm-dialog` (via its template `(falconClose)="onDialogClose()"`). Removing the event would break composition.
- `send-credentials-popup` legacy component uses the wrapper. Migration needed before retirement.
- The Stencil tag itself is the substrate — Stencil dialog cannot be removed without rewriting `confirm-dialog`'s composition.
