# SecurityController — Validations

> No FluentValidation validators. No domain-policy invocations. Endpoint relies on route binding +
> repository existence check.

## FluentValidation

**None.** `CheckUserStatusRequest` has no validator class in `Endpoints/Security/Validators/`
(there is no such folder). Empty `IdentityUserId` (which is impossible for a route-bound segment —
FastEndpoints requires `{IdentityUserId}` to match a non-empty path segment) would not be caught
here even if it were possible.

## Domain policies

**None invoked.** The endpoint reads through the cache and projects directly.

## Implicit validation

The route definition `Get("user-status/{IdentityUserId}")` requires:
- Non-empty `{IdentityUserId}` segment (HTTP routing enforces this — `/api/security/user-status/`
  with empty trailing segment doesn't match this route).
- HTTP method GET.

That's it. Any string is accepted as `IdentityUserId`; if it doesn't match a user, 404 is returned.

## Cross-cutting

- **No IP allowlist guard.** The IpAllowlistPreProcessor is only registered on `AuthEndpointGroup`.
- **No JWT auth.** Explicitly `AllowAnonymous()`. The Gateway is expected to be the only network
  path here.
- **No throttle.** Gateway-level rate limits apply.

## Deviations from platform standards

- Most Identity endpoints have a validator. This one doesn't — by design, given route-bound input.
- Most Identity endpoints have a domain-policy check. This one doesn't — read-only cache lookup.
- The pattern "validate via repository existence" is acceptable for a read-only east-west endpoint
  but should be re-evaluated if business rules ever apply (e.g. "only return status to callers
  with a service-account JWT").
