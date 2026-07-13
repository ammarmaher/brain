# falcon-error-dialog-host — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.

## Business purpose

`[CODE]` The host is how Falcon tells an operator: **"the server rejected what you tried to do, and here is the full list of reasons — acknowledge it before you continue."** In business terms it is the **hard-stop error surface** for save/create operations: when the backend returns a validation list or a business-rule rejection, this dialog renders every reason as a bullet, status-aware, and blocks the surface behind a modal until the operator clicks OK. `[CODE]` falcon-error-dialog-host.component.ts:1-8 + html:18-24.

The companion `ErrorDialogService.openError(...)` returns a Promise that resolves on dismiss, so a flow CAN gate "you may not proceed until you've read this" — though no current flow awaits it. `[CODE]` error-dialog.service.ts:32-44.

## PRD / business rules touched

| Rule | Source | How this component enforces / surfaces it |
|---|---|---|
| A `422` is a **business-rule rejection** (not a generic error) and is shown distinctly | `[CODE]` ts:71-78 + en.json:1575 (`"422": "Business rule rejected (HTTP 422)"`) | The host paints `422` in **warning** severity (amber) and titles it "Business rule rejected"; all other 4xx/5xx are **danger** (red). This is the visible business signal that the request was well-formed but violated a rule. |
| Settings save / Information save failures must be acknowledged | `[CODE]` settings-tab.signals.ts:220/276/296 + info-panel-state.signals.ts:247/353/377 + `[MEMORY]` info-panel/settings save pipeline | Both consoles' settings tab + info panel route save/load failures through `openError(...)` so the operator sees the rejection list, not a fleeting toast. |
| The settings tab / info panel **own their error UX** (no global toaster) | `[CODE]` settings.service.ts:62 / information.service.ts:55 (`notShowToaster: 'true'`) | The dialog is the deliberate, single error channel for these surfaces — a business decision that a save failure deserves a modal, not a toast. |
| Re-authentication is NOT an error to acknowledge | `[CODE]` error-dialog.service.ts:32-33 (`401` suppressed) | A `401` silently routes to the response interceptor's refresh/re-auth — the operator never sees a "you were logged out" dialog from this surface. |

## Business constraints baked in

- `[CODE]` **422 ⇒ warning, everything else ⇒ danger** — a deliberate two-tier business semantics: a business-rule rejection (recoverable, "fix your input") is amber; a hard failure (`400`/`403`/`404`/`409`/`500`) is red. ts:74-78. A builder must NOT recolor a `422` to danger "for consistency" — the amber IS the message.
- `[CODE]` **The message list is rendered verbatim (best-effort i18n)** — whatever `errorMessages` the caller passes is what the operator reads. Callers are responsible for passing business-correct, translated copy (or a real key). The host will NOT invent or summarize. ts:80-89.
- `[CODE]` **Error count is surfaced as a subtitle** — "1 error" vs "{n} errors" (en.json:1579-1580). The operator immediately sees how many rules they broke. ts:63-69.
- `[CODE]` **Single-instance, last-wins** — only one acknowledgement dialog at a time; a new failure replaces the old (resolving the old caller's Promise). A burst of failures does not stack modals. service:36-40.

## Business flows using this component

| Flow | Page | Role of the component in the flow |
|---|---|---|
| Settings save / load failure | org-hierarchy Settings tab (admin + mgmt) | Renders the backend rejection list; operator acknowledges before retrying. |
| Information panel save failure | org-hierarchy Hierarchy tab → Info panel (admin + mgmt) | Same — incl. `422` business-rule rejections shown in warning severity. |
| Add User create failure | org-hierarchy Add-User wizard (admin + mgmt) | Parallel to field-level mapping — shows the full message set. |
| Studio loader editor load error | falcon-studio loader editor | Surfaces config/load errors to the editor operator. `[CODE]` loader-studio-state.service.ts:32/160. |

## Business gotchas

- A **`422` rendered in amber is a "your input broke a rule"** statement, not a system fault — do not treat it as a bug or recolor it. `[CODE]` ts:74-78.
- The dialog shows **exactly what the caller passed**. If the operator sees a raw backend slug instead of friendly copy, the bug is in the CALLER (it passed an untranslated string), not in this host. `[CODE]` ts:84-88.
- This dialog and the **toast** surface are mutually exclusive per failure by convention (`notShowToaster: 'true'`). If an operator gets BOTH a toast and this dialog for one save, a feature forgot to suppress the toaster. `[CODE]` settings.service.ts:62.
- A `401` will **never** open this dialog (suppressed) — "I expected an error popup on logout" is by-design absence, not a defect. `[CODE]` service:32-33.
- Because it is single-instance last-wins, a rapid second failure **replaces** the first dialog — the operator may not see the first message set. Acceptable for acknowledge-and-retry flows.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B27, NEW). 422→warning / else→danger (ts:74-78) + title/count keys (en.json:1570-1580) + `401`-suppression (service:32-33) + `notShowToaster` convention (settings.service.ts:62) all re-confirmed in live source. Flow list 🟡 CODE-DERIVED from the cited `openError` call sites + `[MEMORY]` settings/info-panel save pipelines (user-confirmed working features).
