# basic-app-wave-orchestration — CLOSED (superseded) — 2026-07-13

Task `basic-app-wave-orchestration` (started 2026-07-07) drove the M0→F9 + B1 basic-app wave program.
Per memory `project_basic_app_sot_parity_token_override_mechanism_2026_07_12` the program reached
CODE-COMPLETE on 2026-07-12 (uncommitted, branch polishing-v0.4).

**2026-07-13 finding:** the working tree at C:\Falcon\Falcon\falcon-web-platform-ui is CLEAN on
polishing-v0.4 and `git ls-files | grep basic-app` returns nothing — the uncommitted program code is
no longer present in the working tree (never committed per standing rule; tree since reset/cleaned).
`apps/basic-app` exists as an EMPTY leftover directory.

**Superseded by** user directive 2026-07-13: rebuild the Basic App fresh against the NEW source of
truth (`C:\Falcon\Source_of_truth_theme\13072026 latest from taha\Falcon-Taha2 4\Falcon-Taha2`) as a
runnable app at `apps/basic-app` with separate admin-console/management-console folders, registered
in both console menus, with Send WhatsApp / Send Voice IVR compose screens and a falcon date-picker
time-mode flag. New task: `basic-app-rebuild-sot-13072026`.
