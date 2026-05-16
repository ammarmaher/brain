# falcon-insufficient-balance-dialog — DECISION

## Strategic decisions

### D1. Strategy-correct rebuild after user pushback
**Decision:** Rebuilt from scratch following `Brain Outputs/strategies/falcon-component-creation/` (three artefacts + one token contract).
**Why:** Initial implementation (Wave 14) placed an Angular feature component in `libs/falcon/src/shared-ui/lib/components/`. User pushed back — the canonical strategy demands Stencil Shadow + Stencil Light/TW + Angular wrapper + token contract. Wave 15 corrects.

### D2. Self-contained dialog (NOT composing falcon-dialog or falcon-alert-dialog)
**Decision:** Own the backdrop + panel + icon + title + subtitle + body + footer + dismissal logic.
**Why:** User-requested visual toggles (`showGlossy`, `showIconColor`, `showIconBackground`) need direct control over backdrop blur, icon stroke color, and icon chip visibility. Composing `<falcon-dialog>` would require piercing CSS custom properties through Shadow boundaries — fragile.
**Trade-off accepted:** ~80% duplication of dialog chrome vs `<falcon-dialog>`. Justified because the visual contract is the differentiator.

### D3. Generic `{id, label}[]` items — caller owns API
**Decision:** Dialog accepts opaque items. Emits ordered IDs on confirm.
**Why:** User explicitly asked for generic-wise reuse. Reuse path: campaign recipient prioritization, route preferences, any flat-list ranking.

### D4. Three new visual configuration props
**Decision:** Add `showGlossy`, `showIconColor`, `showIconBackground` as reflected props.
**Why:** User-requested for Wave 15. Each maps to a `:host([show-*="false"])` CSS branch — clean separation of variant logic without ternary nightmare in the render fn.
**Token bridge:** Each toggle is implemented by reading/overriding a token (`--falcon-ib-dialog-icon-color` vs `--falcon-ib-dialog-icon-color-neutral`, `--falcon-ib-dialog-glossy-backdrop-filter` applied vs absent, `.falcon-ib-dialog__icon-bg` hidden via display:none).

### D5. Token-driven row dimensions (user-requested)
**Decision:** Row height, min-width, gap, padding, radius all driven by tokens. Defaults in the library; per-instance override via inline style.
**Why:** User explicitly asked for "default configuration inside the library" — token contract is the canonical way. Consumers can resize rows without subclassing.

### D6. New showcase category "Custom Pop-up Notification"
**Decision:** Add `notifications` category id with label "Custom Pop-up Notification", positioned AFTER `feedback` in the categories array.
**Why:** User explicitly asked for it. New section at the bottom of the notification area in the showcase navigator. Existing notification-like components (toast, tooltip, otp-send-dialog) stay in `feedback` — untouched.

### D7. HTML5 native drag-drop (no library)
**Decision:** Use the browser's native DragEvent API. No `@angular/cdk/drag-drop`, no `sortablejs`.
**Why:** Proven pattern in the predecessor app-level modal. Zero new dependencies. Drag is a UX enhancement; the four reorder buttons cover all positions for keyboard users.

### D8. Loader chicken-and-egg solved by bootstrap-build
**Decision:** When registering a new `-tw` tag in `define-falcon-tw-component.ts`, the path `../dist/components/falcon-X-tw` doesn't resolve at TS compile time on the FIRST build (dist artefact doesn't exist yet).
**Workaround applied:** Temporarily remove the loader entry, build once to emit the dist artefact, then re-add the loader entry and rebuild. This bootstrap is a one-time cost for new components.

### D9. Backend integration NOT changed by this run
**Decision:** The `CommChannelPaymentService`, `OrderStatusService`, `SimplePollService`, and applications-table caller orchestration from Wave 14 are KEPT AS-IS.
**Why:** The dialog API surface stayed identical (`items` + `(falconProceed)` emitting ordered IDs + `(falconCancel)`). Only the selector + event names changed (`(proceed)` → `(falconProceed)` event detail shape changed to `{ orderedIds }`). The caller was updated to match (1 line change in template + 1 line in handler).

## Trade-offs explicitly accepted

| Trade-off | Accepted because |
| --- | --- |
| 41s Stencil build vs 2s wrong-path build | One-time cost. Bootstrap chicken-and-egg only on first new-component add. |
| ~80% dialog chrome duplication vs alert-dialog | Self-contained gives clean control over the 3 user-requested visual toggles. |
| No focus trap yet | Native `aria-modal="true"` + alert-dialog role provides baseline. Focus trap is G4 in GAPS. |
| Inline SVG instead of icon font | No `grip-vertical`/`chevrons-*` glyphs in font yet. G1 in GAPS. |
| Wrong-path Wave 14 component deleted | Was app-level Angular feature; replaced by strategy-correct 3-artefact build. |

## Rejected alternatives

| Rejected | Why |
| --- | --- |
| Compose `<falcon-alert-dialog>` | Couldn't expose the 3 user-requested visual toggles cleanly through composition. |
| Keep Wave 14 wrong-path component | Violates canonical pattern. User explicitly rejected. |
| Stencil-only (no Angular wrapper) | Angular wrapper is mandatory per pattern C4. Stencil tag works in Light DOM apps but wrapper is the canonical consumer surface. |
| Slot for caller-provided body | Items are flat — slot would invite mis-use (caller renders own pills, bypasses drag handlers). |
| Multi-select drag | Single-item ordering is the user requirement. Multi-select is a separate UX. |

## Lessons learned (rolled to strategy 09-CHANGELOG.md)

1. **Loader chicken-and-egg is real** — strategy `06-EXECUTION_PROTOCOL.md` Phase 2 implies seamless loader registration. In practice, new `-tw` tags need a bootstrap build before TS check passes. Suggest adding to `08-COMMON_PITFALLS.md`.
2. **Self-contained vs compose** — when adding visual toggles that override the underlying primitive's chrome, self-contained beats composition. Worth noting in `01-CANONICAL_PATTERN.md` as a decision tree branch.
3. **Showcase categories vs tags** — new components can fit existing categories OR justify a new category. The user explicitly named "Custom Pop-up Notification" — useful precedent for future custom-flow components.

_Last updated: 2026-05-15 — Wave 15 (strategy-correct rebuild of insufficient-balance-dialog)_
