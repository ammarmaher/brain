# falcon-dialog — GAPS AND UPGRADES

## Missing capabilities

### P0 — `@deprecated` is documented in project memory but NOT in the source
The registry + memory say "use `falcon-angular-popup` instead". The Stencil source has no `@deprecated` JSDoc, no `console.warn`, no compile-time signal. Easy to use accidentally for a flow that `popup` handles.

**Proposed:** Add JSDoc `@deprecated Use <falcon-angular-popup> for action-required flows or <falcon-angular-confirm-dialog> for OK/Cancel prompts. This component is the underlying primitive only.` to both wrapper and Stencil source. Optionally add a one-time `console.warn` when rendered outside the known composition contexts.

**Priority: P0** for guard rails.

### P1 — `position="side-right"` overlaps with drawer concept
The dialog has a `side-right` position that visually resembles a right-anchored drawer. Two components, one job — confusing. Remove `side-right` from the dialog's `FalconDialogPosition` union, point consumers to `falcon-angular-drawer`.

**Priority: P1** — design system cleanup.

### P1 — `falconConfirm` / `falconCancel` events without UI
These events exist on the Stencil source but no built-in button emits them. They're dead-weight in the API surface. Either:
- Remove them (breaking change — gate behind major version).
- Document explicitly that consumers project their own buttons + call `this.falconConfirm.emit()` manually (no API helper).

**Priority: P1** — clarity.

### P1 — No `closeAriaLabel` wrapper passthrough
Same gap as drawer.

### P2 — `dismissible` overrides both `closeOnBackdrop` and `closeOnEsc`
The 3 props are confusing in combination. `dismissible=false` overrides the other two; `dismissible=true` lets them act independently. Simplify to a single `[dismissOptions]` object or pick one master flag.

**Priority: P2**

### P2 — No `headerActions` slot
Same as drawer — no place for action buttons in the header strip beyond the close ×.

### P2 — No `tone` / accent color strip
Severity is present but only emitted as `data-severity` — the token consumption for severity-tinted headers is patchy.

### P3 — `full` size renders panel at full viewport, but no `[fullScreenAt]` breakpoint
For responsive: dialog at md on desktop, full on mobile. Today consumers wrap with their own breakpoint logic + dynamic `[size]`.

## Missing ng-template / template slots
- No directive-based slots — same situation as drawer.
- No "footer slot fallback" — dialog footer only renders when projected.

## Missing flags / options / states
- No `tone` color strip (header bg tinted per severity).
- No `[lazy]` content mode (body is rendered when open, destroyed when closed — same as drawer).
- No `[fullScreenAt]="'sm' | 'md' | 'lg' | 'xl'"` responsive breakpoint.

## Missing accessibility features
- Same as drawer — no `<dialog>` element, focus trap is hand-rolled.
- `aria-describedby` is set when `description` prop is used but NOT when only a default-slot description is projected.

## Missing tests
- No `.spec.ts` for the wrapper.
- No e2e for the focus-trap correctness.

## Missing Tailwind / token parity
- Light and Shadow renderers consume the same token contract. No divergence observed.

## Performance risks
- Same as drawer — global `keydown` listener while open.
- Body content rendered/destroyed on each open/close — fine, but consumers should hoist state.

## Visual / interaction risks
- The `side-right` position uses the same code path as `center` — but renders right-anchored. This is essentially a "drawer-shaped dialog" — looks identical to a real `<falcon-angular-drawer>` but doesn't have drawer's edge-radius defaults. Visually inconsistent.
- The dialog is the only overlay with `errorMessage` prop — but the prop has no rendering anchor in the Stencil source (it's accepted but not used in the visible markup). Dead prop.
- `position="top"` doesn't fully animate — it scale-fades like center, doesn't slide down.

## Reusable upgrades needed
1. **Add `@deprecated` JSDoc** to wrapper + Stencil source.
2. **Remove or fully document `falconConfirm` / `falconCancel`** events.
3. **Drop `side-right` position** (use drawer).
4. **Expose `closeAriaLabel`** in wrapper.
5. **Remove dead `errorMessage` prop** OR wire it to render in the body.

## Priority: page-level vs shared
All belong in the shared component — this is a substrate component used by others.

## Recommended upgrade API (proposed)

```ts
/**
 * @deprecated Use <falcon-angular-popup> for action-required confirm flows,
 * or <falcon-angular-confirm-dialog> for OK/Cancel prompts. This component
 * is the underlying primitive — direct use is discouraged.
 */
@Component({ selector: 'falcon-angular-dialog', ... })
export class FalconAngularDialogComponent {
  // Remove side-right from FalconDialogPosition
  @Input() position: 'center' | 'top' = 'center';

  // Remove or wire errorMessage
  // (delete the input entirely until wiring exists)
  
  // Add closeAriaLabel pass-through
  @Input() closeAriaLabel = 'Close';
}
```

## Future-proof recommendation
**Reduce surface area.** This component should fade into substrate status: composed by popup + confirm-dialog, never used directly in net-new code. The deprecation message should bake in a 2-release migration window then physically remove the wrapper. Stencil tag can stay (it's still the substrate). 

For the meantime: the component remains FUNCTIONAL — there's no urgent removal need. Just guard rails.
