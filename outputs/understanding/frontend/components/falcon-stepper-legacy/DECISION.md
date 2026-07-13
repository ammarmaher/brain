# falcon-stepper-legacy — DECISION

## Brain SK final recommendation

### Status
🔴 **DEPRECATED / DELETED / SUPERSEDED.** Removed from the codebase 2026-05-17 (`[CODE]` libs/falcon/src/shared-ui/index.ts:11-13: "Legacy Falcon Stepper … DELETED 2026-05-17 — was dead code (0 consumers)"). It is NOT available to import and renders nowhere.

### Exact rule for future implementation tasks
> "The legacy bespoke `FalconStepperComponent` (`libs/falcon/src/shared-ui/.../falcon-stepper`, a.k.a. `dynamic-stepper`) is GONE. For ANY step-rail / wizard need use **`<falcon-angular-stepper>`** (rail) or **`<falcon-angular-wizard>`** (rail + Next/Back/Finish). Never recreate the deleted component; never import its old symbols."

### Use this component for
- Nothing — it does not exist. ➡️ Use `<falcon-angular-stepper>` (see `falcon-stepper/DECISION.md`).

### Avoid
- Re-introducing a second, app-layer bespoke stepper (it was deleted precisely to avoid the duplicate-stepper + selector-collision + SCSS debt).

### Relationship to other components
- **Superseded by** `falcon-stepper` (`<falcon-angular-stepper>`) — the live dual-render Stencil stepper carrying all wizard traffic.
- The footer concern it once owned (`[falconStepperFooter]`) now lives in `<falcon-angular-wizard>`.

---

## Dynamic capability assessment

N/A — the component is deleted; there is no live surface to assess. The full 10-axis assessment for the replacement lives at **`falcon-stepper/DECISION.md`**. Summary of what the live component does (so this tombstone is self-contained):
1. **Static:** dot inner content set {number/check/pulse/icon}; no dark-mode tokens.
2. **Dynamic via inputs:** `[steps]`, `[activeValue]`, `[completedValues]`, `mode`, `orientation`, `size`, `labelPosition`, `[forwardLockedFrom]`, etc.; 4 `@Output`s incl. `navigationBlocked`.
3. **Slots:** `content-{value}` per step (no dot/label slot yet — G2/G3).
4. **Tokens:** 14 `--falcon-stepper-*` categories.
5. **Tailwind:** `rootClass` + `useTailwind` render switch.
6–8. **Missing/should-be-shared:** dot/label slots, inline per-step error, dark-mode, density.
9. **Safest upgrade path:** additive slots + a11y `aria-orientation` (on the LIVE component).
10. **Risky:** `labelPosition` default asymmetry; `forwardLockedFrom` rejection contract — all on the live component.

## Verification
🔴 RECONCILED-AS-DELETED 2026-06-03 (B21). Status = DELETED/SUPERSEDED; no live surface fabricated. All forward guidance redirects to `falcon-stepper/`.
