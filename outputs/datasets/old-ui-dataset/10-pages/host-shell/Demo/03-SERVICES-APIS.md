# Services & APIs — Demo

## Services
| Service / Token | File | Purpose |
|---|---|---|
| `FALCON_AUTH` token → `FalconAuthFacade` | `@falcon/sdk` | Read `accessToken`, `idToken` |
| `FALCON_LANGUAGE` token → `FalconLanguageFacade` | `@falcon/sdk` | Read current language code |
| `FALCON_THEME` token → `FalconThemeFacade` | `@falcon/sdk` | Read current theme |
| `FALCON_NOTIFIER` token → `FalconNotifierFacade` | `@falcon/sdk` | (injected but not read in this dataset's surface) |
| `FALCON_CONTEXT` token → `FalconContextFacade` | `@falcon/sdk` | Read host context (env) |
| `AuthService` (host core) | host | `logout()` action |

## HTTP endpoints called
None. Demo pages only read facade state (no API calls).
