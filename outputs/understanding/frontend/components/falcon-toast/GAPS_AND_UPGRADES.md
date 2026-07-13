# falcon-toast — GAPS AND UPGRADES

> This is where the B16 AUDIT findings for `falcon-toast` live in prose. We fix NOTHING this pass — items are documented + queued. See `FINDINGS/B16.md` for the row-level record.

## Headline finding — superseded, not deprecated; effectively orphaned at runtime

`[CODE]` `<falcon-toast>` has ZERO `apps/**` consumers (Consumer Sweep, USAGE.md). Its one composition `<falcon-angular-message-host>` is dead-mounted (`app.ts` mounts `<falcon-toast-adapter>` instead — `[CODE]` app.ts:47-48). The live transient-messaging surface is the orchestrator → `<falcon-angular-notification>`. The component is fully functional and NOT API-deprecated, but in practice it is a parked PrimeNG-parity substrate. **Wave flag: SUPERSEDED-CANDIDATE** (do not delete — it backs `FalconMessageService` if that path is ever revived; but new investment should NOT grow it). `risk-class = safe-local` (doc/decision only).

## Missing capabilities (active source verified)

### G1 — Angular wrapper does not proxy `dismiss()` (P2)

`[CODE]` `<falcon-toast>`/`-tw` expose `@Method() dismiss()` (`[CODE]` falcon-toast.tsx:65-69) but `FalconAngularToastComponent` has no `dismiss()` proxy. To dismiss programmatically, reach into the inner Stencil element via `ViewChild`. Same class of gap as falcon-input G2. `risk-class = safe-local`.

### G2 — `maxToasts` declared but unimplemented on the host (P2)

`[CODE]` `FalconAngularToastHostComponent.maxToasts` + both Stencil host tags carry `@Prop() maxToasts` (`[CODE]` falcon-toast-host.tsx:18 / falcon-toast-host-tw.tsx:18) but **neither host `.tsx` reads it** — there is no stack clamp. A consumer setting `maxToasts=3` gets no limit. Either implement the clamp (slice the slotted children) or drop the prop. `risk-class = safe-local` (dead prop; removing it is a minor public-API change → would be HIGH-RISK-QUEUE if removed, safe-local if implemented/documented).

### G3 — `-tw` host lacks the region landmark + reduced-motion (a11y parity gap) (P2)

`[CODE]` The Shadow host stack carries `role="region" aria-label="Notifications" aria-live="polite" aria-atomic="false"` (`[CODE]` falcon-toast-host.tsx:33-40); the `-tw` host renders a bare `<div>` with NONE of these (`[CODE]` falcon-toast-host-tw.tsx:35). Likewise, the Shadow toast has a `prefers-reduced-motion` rule (`[CODE]` falcon-toast.css:159-166); the `-tw` twin has no equivalent. Since `useTailwind=true` is the wrapper default, the LIGHT-DOM (twin) path — the one actually rendered when used — is the one MISSING the landmark. `risk-class = HIGH-RISK-QUEUE` (a11y semantics).

### G4 — info-severity colors hardcoded hex (P3)

`[CODE]` `--falcon-toast-icon-info-bg: #e0f2fe` + `--falcon-toast-icon-info-color: #0284c7` (`[CODE]` toast.tokens.css:50-51) — the only raw hex severity values; the file self-flags "no SSOT token — accepted gap." A future `--color-falcon-sky-*` should replace them. `risk-class = safe-local`.

### G5 — severity icons are hardcoded inline SVG paths (P3)

`[CODE]` `renderSeverityIcon()` hardcodes 4 SVG `d=` path strings (`[CODE]` falcon-toast.tsx:109-129, duplicated in falcon-toast-tw.tsx:114-138). Not composed with `<falcon-angular-icon>`. Low priority (toast is parked). `risk-class = safe-local`.

### G6 — `dismiss` × button `aria-label` not i18n-bridged (P3)

`[CODE]` `aria-label="Dismiss"` is hardcoded English on both paths (`[CODE]` falcon-toast.tsx:190 / falcon-toast-tw.tsx:193). No input to localize it. `risk-class = safe-local`.

## Missing tests

`[CODE]` **NO `*toast*.spec.ts` / e2e exists in `falcon-ui-core`** (verified 2026-06-03). The toast's hover-pause / focus-pause auto-dismiss logic, the action-href-vs-button branch, the dismiss-reason values, and the role/aria-live mapping are ALL untested. (The orchestrator + dispatcher ARE tested in `apps/host-shell/tests/falcon-message-orchestrator.spec.ts` + `falcon-http-ui-dispatcher.spec.ts`, but those exercise the notification path, not `<falcon-toast>`.) GAP. `risk-class = safe-local`.

## Missing Tailwind / token parity

- `[CODE]` `-tw` host missing the region landmark + reduced-motion (G3) — the only true Shadow↔tw parity break. Prop/event/slot parity is otherwise CLEAN (severity/title/message/duration/dismissible/icon/actionLabel/actionHref all mirrored; both emit `falcon-dismiss` + `falcon-action-click`; both project default + `action` slots).
- Both paths share `--falcon-toast-*` tokens via the `:where()` selector — token-level parity OK.

## Missing cross-framework parity

`[CODE]` **No React (`libs/falcon-ui-react`) or Vue (`libs/falcon-ui-vue`) toast wrapper exists** (verified 2026-06-03 — zero `*toast*` files in either lib). The Stencil core is cross-framework-capable but only the Angular wrapper ships. `risk-class = safe-local`.

## Performance risks

- Hover/focus timer pause is per-toast — fine. The orchestrator shows one toast at a time, so the legacy "many simultaneous toasts" concern is moot for the live path.

## Visual / interaction risks

- `[CODE]` The auto-dismiss timer is invisible — `<falcon-toast>` has NO countdown bar (the `<falcon-angular-notification>` card the platform actually renders DOES). Another reason the notification card is the better surface.

## Recommended upgrade priority

| ID | Title | Priority | risk-class |
|---|---|---|---|
| (headline) | Confirm SUPERSEDED-CANDIDATE status; do not grow API | — | safe-local |
| G3 | `-tw` host region landmark + reduced-motion parity | P2 | HIGH-RISK-QUEUE (a11y) |
| G1 | Proxy `dismiss()` on Angular wrapper | P2 | safe-local |
| G2 | Implement or remove `maxToasts` | P2 | safe-local (impl) / HIGH-RISK (remove) |
| G4 | Replace info-severity hex with palette token | P3 | safe-local |
| G5 | Compose severity icons via `<falcon-angular-icon>` | P3 | safe-local |
| G6 | i18n `aria-label` for dismiss | P3 | safe-local |

## Fix-shared-vs-per-page

All gaps belong in the **shared Falcon component** (the toast is library plumbing). No per-page work applies.

## Future-proof recommendation

**Do NOT add new features to `<falcon-toast>`.** It is superseded by the orchestrator + notification card. Investment belongs in `<falcon-angular-notification>` + the orchestrator. If `FalconMessageService` is permanently retired, this whole quad (toast + host × Shadow + tw) plus `<falcon-angular-message-host>` becomes deletable in lockstep with `--falcon-toast-host-z-index` (see `Brain Outputs/understanding/frontend/overlay-architecture/DEAD-TOKENS.md`).

## Deep-Dive Sweep Findings (2026-06-03 — B16)

**Consumer count: 1** (`<falcon-angular-message-host>`, dead-mounted) — ZERO `apps/**` consumers (`[CODE]` grep).

Corrected vs prior dossier:
- Status changed from "@deprecated per registry" to **SUPERSEDED / no API-level deprecation / runtime-orphaned**. The prior "FalconMessageService is the live production substrate" claim is STALE — the live surface is the orchestrator → notification card (`[CODE]` app.ts:47-48).
- Removed the fabricated "P0 deprecation guard rail" framing; added the real headline (runtime-orphaned).
- Added G3 (`-tw` host a11y parity gap) — the only genuine Shadow↔tw divergence, and it hits the DEFAULT (twin) render path.
- All findings `safe-local` EXCEPT G3 (a11y → HIGH-RISK-QUEUE).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B16) against all source layers. Gaps re-derived from live source; consumer sweep + dead-mount confirmed. One HIGH-RISK-QUEUE item (G3, a11y); everything else safe-local. No deletion executed — SUPERSEDED-CANDIDATE flagged for human triage.
