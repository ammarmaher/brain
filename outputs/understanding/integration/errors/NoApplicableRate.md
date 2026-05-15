*** Error code — NoApplicableRate ***
*** Catalogued 2026-05-15 by Brain SK Phase 3D ***

# `FalconKeys.Error.NoApplicableRate`

## Throwing service(s)
- [[Charging Service]] — OCS rate-engine when no contract rate matches `ApplicationId/ChannelId/Priority/Destination/Unit`

## HTTP status
- **422** Unprocessable Entity (inferred)

## Scenario
- Indicates a **contract configuration gap** — there is no rate row that matches the requested usage tuple. The frontend cannot fix this; show a user-friendly "Service not configured" message and surface it to ops.

## UX handling
- **Toast** — "Service not configured for this destination/priority. Please contact your administrator."
- Surface to ops dashboard.

## Related V-rule
- [[V-charging-no-applicable-rate]]

## Related E-* entity
- `E-Contract` · `E-RateCard`

## Related flow playbook
- (Service Charge / Rate Lookup flow — playbook pending)

## Hubs
- [[ERROR_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]]
