---
type: moc
slug: basic-app-moc
prd-implements: [PRD-06]
status: active
created: 2026-07-12
---
*** MOC — Basic Send Application (PRD-06), the dedicated feature folder Ammar requested 2026-07-12 ***
*** Vault file: 20-Basic-App/00 Basic App MOC.md ***
*** Code: C:\Falcon\Falcon\falcon-web-platform-ui\apps\basic-app\ (uncommitted, polishing-v0.4) ***
*** Brain Outputs SoT: C:\Falcon\Brain Outputs\prd\modules\06-basic-send-application\ ***

# Basic App — Map of Content

> The Basic Send Application: WhatsApp + IVR Voice broadcast transactions under
> **Marketplace & Applications .Mng** in BOTH consoles. Mock-first frontend, SoT-parity UI.

## The architecture ruling (final, 2026-07-12)
See [[Architecture Ruling 2026-07-12]] — code lives at **`apps/basic-app`** (same level as
admin-console / management-console); the shared library (`libs/falcon*`) holds ONLY generic,
app-agnostic components; customization = generic flags/inputs, never app-named library artifacts.

## Features
- [[Feature — Home Transactions]] — landing: channel tabs, Outbox/Scheduled grids, filters, Send (**built + SoT pixel-parity verified**)
- [[Feature — Send WhatsApp Compose]] — 3-column compose takeover (**built, Wave F2, live-verified**)
- [[Feature — Transaction Details]] — channel-aware WA+voice details, breakdown tables + audio preview (**built, F3+F6**)
- [[Feature — Waves Roadmap F4-F9]] — **ALL BUILD WAVES CODE-COMPLETE 2026-07-12** (B1 basic-only ruling applied: falcon components only, zero native HTML; live verify pending watch restart)

## Cross-cutting
- [[Models Seeds and Validation]] — 7-state FSM, seeds, phone-normalization utils
- [[SoT Parity and Token Re-pointing]] — the `:where()` / `::ng-deep` override mechanism + live-extracted SoT values

## Related vault notes (pre-existing taxonomy)
[[06 Basic Send Application]] (PRD) · [[Basic Send App]] (page) · [[Basic Send WhatsApp Details]] · [[Basic Send Voice Details]] · [[Basic Send Message]] (journey) · [[Basic Send Service]] (backend)
