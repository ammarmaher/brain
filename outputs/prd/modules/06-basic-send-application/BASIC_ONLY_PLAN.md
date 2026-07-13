*** Basic App — BASIC-ONLY simplification plan (USER RULING 2026-07-12, 3rd part) ***
*** "Give me a version that uses just the Falcon component. Don't create something from your end.
*** It should work. The calendar must load time. Make it basic. Zero native HTML." ***

# Wave B1 — falcon-components-only, basic

## Global rules (binding, supersede earlier wave choices)
1. Falcon components ONLY. Zero native interactive HTML **including `<dialog>`** — the earlier
   "native dialog falconOverlay" exception is REVOKED. Confirms go through **FalconConfirmService**
   (`confirm({title, message, confirmLabel, severity})` → Observable<boolean>; contact-groups precedent).
2. NOTHING hand-built: no custom popover panels, no phone-frame art, no SVG charts, no IVR canvas.
   Plain layout divs + Tailwind tokens remain fine (styling, not controls). Thin wrappers that render
   ONLY a falcon component (status pill) may stay.
3. **Time**: falcon date-picker/calendar has no time mode → scheduled delivery = falcon-angular-date-picker
   (date) + ONE falcon-angular-dropdown of 48 half-hour slots ("12:00 AM"…"11:30 PM"). Loads always,
   hydrates by nearest slot. (Optional follow-up for user ruling: generic `showTime` flag on the shared
   date-picker — a lib change under the regression protocol; NOT in this wave.)

## Per-screen mapping (custom → falcon)
### Home (basic-app-home/)
- recipients-cell custom popover → first recipient + `falcon-angular-tag "+N"` inside `falcon-angular-tooltip`
  listing all recipients. Popover panel code deleted.
- `basic-app-confirm-dialog` (native <dialog>) → DELETED; delete/cancel confirms via FalconConfirmService (danger).
- status pill, tabs, search, dropdown, date-pickers, data-table: already falcon — unchanged.

### Compose WhatsApp (basic-app-compose-whatsapp/)
- 3-column takeover + collapsible preview → three `falcon-angular-card` sections, no collapse logic.
- group-picker custom popover → `falcon-angular-multi-select` of contact groups (created/shared labeled);
  per-group variable mapping keeps its falcon dropdown rows.
- phone-preview frame art → `falcon-angular-card` "Preview": resolved message text + falcon tags for footer/CTA.
- send-confirm native dialog → FalconConfirmService (recipients count + estimated cost in the message);
  duplicates toggle becomes an inline `falcon-angular-switch` in the Delivery card.
- Delivery time: hour/minute/AM-PM dropdown trio → single time-slot dropdown (rule 3). **Fixes "calendar loads time".**

### Details (basic-app-details/)
- donut + rate-bars SVG components → DELETED. Delivery breakdown = small `falcon-angular-data-table`
  (Status pill · Count · %); cost breakdown = second small table. KPI band (text+tokens) stays.
- duplicate recipient-status-pill → reuse the one status pill; duplicate deleted.
- preview panel → the simplified falcon-card preview.

### Compose Voice (basic-app-compose-voice/ — completes the stopped F5, BASIC)
- Sender dropdown · voice-record dropdown + `falcon-angular-audio-player` preview · groups multi-select ·
  manual ≤3 via `falcon-angular-phone-field` · delivery (date + time-slot) · FalconConfirmService confirm ·
  submit/edit-replace voice rows. **NO IVR canvas** (deleted if the stopped agent left one).
- Home voice Send + voice scheduled Edit wire to `send/voice` / `send/voice?edit=<id>`.

## Gates
Builds (both consoles) · admin-console suite green (specs updated for confirm-service/time-slot/voice) ·
`basic-app:lint --skip-nx-cache` 0 · greps: zero native interactive HTML AND zero `<dialog`, no *ngIf,
no bsa tokens, no inline style=, no .scss.
