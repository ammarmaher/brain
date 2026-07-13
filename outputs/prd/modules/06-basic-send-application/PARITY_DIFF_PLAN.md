*** Basic App — P1 SoT-PARITY DIFF plan (USER RULING 2026-07-12, 4th part) ***
*** "Run both the source of truth and ours, see the difference, implement the difference.
*** Rely on the source of truth. The phone preview model already exists inside the Templates
*** feature — reuse it. The date picker should have a time — not a separate dropdown." ***

# Wave P1 — make every screen identical to the running SoT

## Standing constraints that still bind
Zero native HTML **in the basic app** (native elements live INSIDE library components — that is the
sanctioned home for them) · reuse platform components before building · generic app-agnostic naming
for anything added to the library (the ruling explicitly permits NECESSARY new generic components) ·
apps/basic-app placement + structure contract · FalconConfirmService for confirms.

## Named items (user-called, highest priority)
### P1-A · Real phone preview — REUSE the Templates wizard component
- The platform already has THE phone mockup: `templates-wizard/preview/whatsapp-preview.component.ts`
  (+ `.html`) in BOTH consoles — full phone frame: header/media block, formatted body (`formatWhatsAppHtml`),
  footer, CTA/quick-reply buttons with overflow, auth/security/expiry states.
- PROMOTE it to the shared library as a GENERIC component: `libs/falcon/src/shared-features/whatsapp-preview/`
  (generic name — serves templates + basic-app + anything next), together with the minimal
  `WizardPreviewModel`-shaped input model (renamed generically, e.g. `WhatsappPreviewModel`) and the
  `formatWhatsAppHtml`/`resolveText` helpers it needs. Keep the console templates-wizard copies as-is
  THIS wave (dedup migration = flagged follow-up; zero risk to the live templates feature now).
- Basic-app consumes it: compose right column (live preview of the selected template + resolved
  variables), details preview panel, conversation Sent/Reply bodies where the SoT shows bubble-formatted
  content. Delete `basic-app-phone-preview` (the B1 card) after rewiring.

### P1-B · Time WITH the date picker — generic falcon time picker
- SoT delivery: `Send on` = `window.DatePicker` + divider + `BsaTimePicker` side by side (basic-app.jsx
  L829-838); BsaTimePicker = trigger field ("09:00 AM") → popover: hour/minute inputs + AM/PM toggle +
  240×240 SVG clock dial (numbers clickable, hand+knob), flip-up near viewport bottom (L538-640).
- The falcon library has NO time picker (date-picker/calendar are date-only) → build the NECESSARY
  generic component `libs/falcon/src/shared-features/time-picker/` (generic name `falcon-time-picker`
  Angular shared-feature, token-driven, mirrors the SoT interaction; value contract `hh:mm AM|PM`).
- Compose (WA + voice) delivery becomes: falcon-angular-date-picker + `falcon-time-picker` in one
  `Send on` row (SoT layout). The 48-slot dropdown DIES. Store keeps `scheduleTime` as the literal
  string; edit-hydration parses it exactly (no half-hour snapping).

## Diff protocol (run both, screen by screen)
SoT: `http://localhost:4173/T2 Falcon Admin.html` → Marketplace & Applications .Mng → Basic Application
→ View as Client → role `normal-user`. Ours: `:4200` → sysadmin → Marketplace & Applications .Mng →
Basic App. For EVERY screen pair: screenshot both → structural diff (layout regions, controls, content,
states) → computed-style spot checks on flagship elements → row in the matrix below → fix → re-shoot.

## Known diff matrix (seeded from code knowledge; live pass extends it)
| # | Screen | SoT | Ours today | Action |
|---|---|---|---|---|
| 1 | WA compose layout | 3-column takeover: numbered step cards `1fr/1.85fr/1.15fr`, collapsible preview col, teal #0d3f44 summary strip (Message Summary · Estimated Recipients · Date & Time) | B1 flattened to 3 stacked cards, no numbers, no collapse, no strip | RESTORE SoT 3-col + numbered cards + collapsible preview + summary strip (layout divs + tokens — allowed) |
| 2 | WA compose preview | Real phone mockup, live template render | plain falcon card with text | P1-A |
| 3 | Delivery time | date picker + clock-dial time picker | 48-slot dropdown | P1-B |
| 4 | Details charts | funnel/donut visuals + stat tiles | two small tables (B1) | RESTORE SoT visuals as feature-local presentational SVG (role="img"); keep tables where SoT shows tables |
| 5 | Details preview | phone mockup w/ recipient values | card | P1-A |
| 6 | Conversation (WA) | chat-thread look (bubbles, direction) | card list with tags | RESTYLE to SoT thread look (tokens/layout only; no reactions/composer/countdown — stay cut) |
| 7 | Voice compose | (SoT voice compose layout w/ IVR viz) | 2 cards | match SoT layout; IVR canvas stays CUT (flagged) unless user reverses |
| 8 | Home header chrome | client avatar+name left of VIEWING-AS/Send | not ported (ruled demo-only) | FLAG for user decision (demo chrome vs parity) |
| 9 | Home grid empty-state after `?channel/mode` nav | n/a | BUG observed live: rows vanished after query-param navigation | root-cause + fix in P1 |
| 10 | (live pass) | … | … | extend during side-by-side run |

## Gates
Per fix-batch: both console builds · full admin suite green · `basic-app:lint --skip-nx-cache` 0 ·
zero-native greps (app-side) · SIDE-BY-SIDE screenshots for every touched screen attached to the
tracker row. Library additions (`whatsapp-preview`, `time-picker`): generic naming review + consumer
census (only basic-app consumes the new ones this wave) + both-console builds as the regression net.
