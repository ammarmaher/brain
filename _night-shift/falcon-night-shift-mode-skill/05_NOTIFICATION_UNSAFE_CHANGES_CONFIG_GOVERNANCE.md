# 05 — Notification, Unsafe Changes, and App Configuration Governance

Every app in scope must have a clear configuration folder controlling app-level behavior.

Scope:

- Host Shell
- Admin Console
- shared libraries used by them

Management Console is excluded.

## Application Configuration Folders

Create or normalize when needed:

```txt
apps/host-shell/src/app/configuration/
apps/admin-console/src/app/configuration/
```

Possible files:

```txt
configuration/
  app-notification.config.ts
  app-unsafe-changes.config.ts
  app-loader.config.ts
  app-uploader.config.ts
  app-popup.config.ts
  app-error.config.ts
  app-ui.config.ts
  index.ts
```

Only create files with real content.

## Configuration Priority

For notification, unsafe changes, popup, loader, uploader, and JSON-driven components:

```txt
library default config
< app config
< JSON initial config
< feature/page config
< component input config
< runtime state
```

Component input configuration has the highest priority.

Use immutable merge.
Do not mutate default config.

If deep merge is needed, put helper in:

```txt
libs/falcon/src/shared-utils/helpers/
```

## Notification Rule

HTTP 400 responses must show a configurable top-right business notification.

Behavior:

1. If API returns HTTP 400, show a business notification.
2. Notification appears top-right.
3. Show backend business error message when available.
4. Use safe fallback when no message exists.
5. Default duration is `6000ms`.
6. Duration must be configurable.
7. Library default provides duration.
8. App config can override it.
9. Component config can override only when explicitly needed.
10. Do not duplicate this logic in each component.

Prefer centralized:

- error interceptor
- error handler
- notification facade/service
- business error mapper

## HTTP Error Mapping

Audit current behavior and align where safe:

```txt
HTTP 400 = business notification
HTTP 401 = auth/session handling
HTTP 403 = permission notification or redirect
HTTP 404 = not found notification if user-facing
HTTP 500 = technical/server error notification
```

Do not create duplicate interceptors.

## Unsafe Changes Rule

Every edit/create form flow must support unsafe changes confirmation.

When user tries to:

- exit edit mode
- navigate away
- close popup
- switch tab
- cancel form
- go back
- close drawer
- leave route
- discard modal

If dirty/unsaved changes exist:
show unsafe changes popup.

If no changes exist:
exit directly without popup.

## Unsafe Changes Config

Config should include:

- title
- message
- confirm button text
- cancel button text
- severity/type
- icon
- width
- closeOnBackdrop
- closeOnEscape
- duration if applicable
- behavior after confirm
- behavior after cancel

## Edit Mode Dirty Strategy

For reactive forms:
use form dirty state plus custom state checks.

For signal-based forms:
compare initial snapshot with current signal state.

For complex pages:
create feature-level dirty-state strategy.

Do not rely only on Angular `form.dirty` if the feature uses custom signals/state.

## Notification / Uploader / Loader JSON Rule

For components loading initial values from JSON:

1. Load library default config first.
2. Load app config.
3. Load JSON initial values if configured.
4. Merge feature/component config on top.
5. Component-passed config wins.
6. Do not mutate default object.
7. Validate required config fields.
8. Use safe fallback behavior.
9. Invalid JSON must not crash the app.
10. Do not duplicate config merge logic per component.
