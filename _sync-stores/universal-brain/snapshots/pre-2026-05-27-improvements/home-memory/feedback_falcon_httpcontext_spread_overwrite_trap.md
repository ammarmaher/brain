---
name: HttpContext spread-overwrite trap
description: Never spread `useGateway()` and `withSuccess()/withError()/withMessages()` in the same options object — both return `{ context: new HttpContext()... }` so the second silently overwrites the first, breaking gateway routing and forcing requests to localhost
type: feedback
date: 2026-05-17
originSessionId: 8f62252f-2f04-4b46-9b7f-104a7db6b788
---
# HttpContext spread-overwrite trap

## The trap

Two helpers in Falcon return options blobs of shape `{ context: HttpContext }`:

| Helper | What it sets |
|---|---|
| `useGateway()` / `useGateway(Gateway.X)` | `USE_GATEWAY_CONTEXT = true` + optionally `SPECIFIC_GATEWAY_CONTEXT` |
| `withSuccess()` / `withError()` / `withMessages()` | `FALCON_HTTP_MESSAGES = {...}` |

Both implementations create a **NEW** `HttpContext()` from scratch (see `libs/falcon-ui-core/src/angular-wrapper/components/falcon-notification/falcon-http-messages.ts:122-124` — `new HttpContext().set(FALCON_HTTP_MESSAGES, messages)`).

If you spread both into one options object:
```ts
this.http.post(url, body, {
  headers: { ... },
  ...useGateway(),                  // { context: HttpContext with USE_GATEWAY=true }
  ...withSuccess('Created'),         // { context: HttpContext with FALCON_HTTP_MESSAGES, NO USE_GATEWAY }
});
```

JavaScript object-spread semantics make the **second `context` property overwrite the first**. The request lands at the HTTP interceptor with `USE_GATEWAY_CONTEXT = false` (default), gateway routing is skipped, the legacy `defaultBaseUrl = ''` (empty) branch runs, the interceptor returns null, the request goes out with a relative URL, and the browser resolves it against the current page origin (`localhost:4200` in dev).

**Symptom**: every Add User submit hits `localhost:4200/<path>` instead of the gateway. The hard-fail throw in `RuntimeBaseUrlInterceptor` doesn't fire because it gates on `useGateway === true` — but `useGateway` is `false` after the overwrite.

## Why it's hard to catch

- TSC is happy — both are valid `{ context: HttpContext }` shapes.
- Lint is happy — spread-overwrite is legal syntax.
- The success toast still fires (the second helper "won") so the screen looks right.
- Only the network tab reveals the wrong URL.
- The bug is invisible until someone inspects DevTools Network.

## How to apply (fixes + future patterns)

### Option A (preferred for now) — keep helpers exclusive

Pick ONE helper per call. If the state slice already manually fires the success toast (e.g. `FalconMessageService.add(...)`), drop `withSuccess()` from the service and rely on `useGateway()`. Pattern landed 2026-05-17 in `apps/admin-console/.../add-user-wizard/services/user.service.ts:createUser`.

### Option B (future — refactor) — make helpers compose

Change `withMessages()` and `useGateway()` to **accept an existing context** and merge into it, instead of always creating a new one. Sketch:

```ts
export function withMessagesOn(base: HttpContext, msgs: FalconHttpMessages): { context: HttpContext } {
  return { context: base.set(FALCON_HTTP_MESSAGES, msgs) };
}
```

`withMessagesOn` already exists at `libs/falcon-ui-core/src/angular-wrapper/components/falcon-notification/falcon-http-messages.ts:128-133` — but `useGateway` doesn't have the equivalent. A future wave should unify by making both helpers accept an optional base context.

### Option C (defensive — most foolproof) — build the context manually when combining

```ts
const ctx = new HttpContext()
  .set(USE_GATEWAY_CONTEXT, true)
  .set(FALCON_HTTP_MESSAGES, { success: FalconToastMessage.success('Created') });

this.http.post(url, body, { headers: {...}, context: ctx });
```

Verbose but explicitly safe.

## How to detect

Grep for the trap pattern in any service:
```bash
grep -rn "useGateway()\\s*," apps libs --include="*.ts" | grep -E "withSuccess|withError|withMessages"
```

Each hit is a candidate that silently breaks gateway routing.

## Reference fix landed in user.service.ts

Wave 11 (2026-05-17) `apps/admin-console/.../add-user-wizard/services/user.service.ts:createUser`:

```diff
- ...useGateway(),
- ...withSuccess('User created successfully'),
+ ...useGateway(),
```

The success toast is fired by the state slice in `add-user-state.signals.ts:64-72` via `messageService.add`. The `withSuccess(...)` was a duplicate that silently killed gateway routing.

## Hardening idea (potential future hook)

Add an ESLint rule that flags `...useGateway*` and `...with{Success,Error,Messages}` in the same object expression. Or add a runtime check in `withMessages` that warns when called with an external context but doesn't merge it.
