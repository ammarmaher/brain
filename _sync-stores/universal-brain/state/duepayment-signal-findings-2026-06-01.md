# Due-Payment + SignalR "Signal" — Night-Shift Findings (2026-06-01)

Orchestrator: Claude (Opus). 4 parallel investigators (charging, commerce, realtime+gateway, frontend), READ-ONLY phase complete. All facts [CODE] file:line verified by the sub-agents.

## End-to-end flow (the chain)

1. FE `DoPaymentPriorityPopupComponent` (host-shell, hosted ONLY by `service-pricing.component.ts`) → `CommChannelPaymentService.doPayment` / `ApplicationPaymentService.doPayment` (POST `commerce/node/{comm-channel|application}/do-payment`, body `{accountId, commChannelId|applicationId, commChannelPriorityIds}`).
2. Commerce `CreateFalconServiceOrderHandler` → creates **Pending** Order (`Order.AccountId` = BSON `mainNodeId`), returns `orderId`, publishes `commerce.order-created.v1`.
3. Charging consumes `order-created.v1` → `DeductFalconServiceCostHandler` → `ResolveWalletFundingDecisionPolicy` (master / both / commchannel / fail) → publishes `charging.order-payment-processed.v1` {OrderId, OrderStatus, OrderFailureReason} — **NO tenantId/accountId on wire**.
4. Commerce consumes `order-payment-processed.v1` → `CompleteFalconServicePaymentProcess` → `MarkAsPaid`/`MarkAsFailed` (idempotent terminal) → if Paid, activate → publishes `commerce.order-finalized.v1` (Avro) {OrderId, AccountId, Status:int, FailureReason:int?, Context{TenantId...}}.
5. Realtime `OrderFinalizedConsumer` (GroupId `comm-realtime-service`, distinct) → pushes "OrderFinalized" to SignalR groups via `IHubContext`.
6. FE `OrderStatusRealtimeService` (`/hubs/order-status`, JWT via `access_token` query) had `JoinOrder(orderId)` → server puts client in a group; on push → translate eOrderStatus(2=Paid,3=Failed)→ProcessState(3=Completed,4=Failed) → `handleTerminal`.

FE terminal routing: Completed→success toast; `CommChannelPriorityOrderRequired(2)`→drag-drop multi-wallet priority dialog→resubmit; `InsufficientFunds(1)`/`WalletNotConfigForTheNode(3)`→centred OK-only popup.
Enums: ProcessState Pending1/Running2/Completed3/Failed4. OrderFailureReason None0/Insufficient1/PriorityRequired2/WalletNotConfig3. WalletType Single1/Multiple2. eOrderStatus Pending1/Paid2/Failed3.

## CONFIRMED BUGS (orchestrator-judged)

| ID | Sev | Service | One-line | Evidence | Status |
|---|---|---|---|---|---|
| **SIGNAL-P0** | P0 | realtime | Client never gets OrderFinalized push: push group `order:{AccountId=mainNodeId ObjectId}:{orderId}` vs join group `order:{tenant-id slug}:{orderId}` — never match. Masked by 60s GET fallback. Falcon path OK. | `OrderFinalizedConsumer.cs:153-156` (push, AccountId) vs `OrderStatusHub.cs:104-108` (join, tenant-id claim); `Order.cs:28-29` AccountId=mainNodeId; `User.cs:14-19` nodeId=ObjectId vs tenantId=slug | FIX |
| SIGNAL-P1-test | P1 | realtime | Regression invisible: every dual-push test sets accountId==tenantId, so SIGNAL-P0 shipped green. | `OrderFinalizedConsumerTests.cs` | FIX (test) |
| CM-P1-A | P1 | commerce | Edit **price value** accepts 0 / negative — no validator, no domain guard. (In "change price value" scope.) | `FalconServiceConfigurationBase.Operations.cs:102-120` SetPriceValue | FIX (confirm xlsx V-rule) |
| CM-P1-C | P1 | commerce | Unchecked `(eOrderStatus)message.OrderStatus` cast — out-of-range int leaves order Pending but still publishes OrderFinalized (signal for a non-terminal order). | `FalconServiceOrderPaymentProcessedEventConsumer.cs:44-47` + `UpdatePendingFalconServiceOrderHandler.cs:51-59` | FIX (Enum.IsDefined) |
| CM-P2-B | P1(↑) | commerce | `getOrderStatus` 500s when account has no WalletSettings — exactly the WalletNotConfigForTheNode case → FE fallback GET 500s. | `GetOrderStatusHandler.cs:35-40` | FIX |
| CM-P2-A | P2 | commerce | `GetOrderStatusResponse.WalletType` non-nullable → null source maps to 0 (undefined enum). | `GetOrderStatusResult.cs` vs `GetOrderStatusResponse.cs` | FIX |
| CHG-01 | P1 | charging | Multi-wallet: funding decision computed over ALL comm wallets but debit only over **prioritized** channels → if priority list omits the funded channel, throws InsufficientFunds → FE shows wrong popup instead of re-prompting reorder. | `DirectDebitHandler.cs:282` (sum all) vs `:417,:434` (debit prioritized) | FIX |
| CHG-03 | P1 | charging | Consumer `catch(Exception){return false}` → infinite redelivery on poison msg; DLQ is log-only. | `FalconServiceOrderCreatedEventConsumer.cs:56-59`, `KafkaAvroConsumerBase.cs:58-99` | FIX (classify poison + commit) |
| CHG-04 | P1 | charging | Money precision: `PurchaseAmount` is Avro **double** → decimal→double→decimal round-trip can produce 19.989999…. | `FalconServiceOrderCreatedEvent.cs:58,78` | REPORT (schema change — risky) |
| FE-P1a | P1 | frontend | Failed-push reconcile: if enriching GET returns Pending/Running (read-model lag), flow neither settles nor re-arms → global loader stuck until destroy. | popup `:340-345`,`:358-401` | FIX |
| FE-P1b | P1 | frontend | reconcile in-flight dedup can swallow the Failed-push enrichment (catch-up GET pending → push reconcile returns early → GET resolves Pending → walletType never fetched). | popup `:362` | FIX |
| P0-1/CHG-02 | P2 | charging+commerce | Shared Kafka group `commerce-service` across Charging+Commerce — disjoint topics today (no live drop) but latent landmine. Realtime uses distinct group (REFUTED for signal path). | charging `appsettings.json:84`, commerce `:83` | REPORT |
| BUG-KAFKA-AVRO | — | — | order-finalized producer/reader schemas BYTE-IDENTICAL (REFUTED as signal break). order-payment-processed schema parity still to confirm charging-side. | realtime `AvroEvents/OrderFinalizedEvent.cs` == commerce producer | REPORT/verify |
| SEC-P2 | P2 | realtime | No intra-tenant order-ownership gate (`DefaultOrderAccessPolicy` returns true). Spec-accepted (payload non-sensitive). | `DefaultOrderAccessPolicy.cs:26-27` | REPORT |
| FE-P2* | P2 | frontend | fallback-timer single attempt; (succeeded)/(failed) payload ignored; Completed push hardcodes walletType; dialog a11y (focus/trap/aria-label). | popup `:326-329`,`:348-352`; service-pricing.html`:20-21`; dialog tsx | FIX easy ones |

## SIGNAL-P0 fix design (orchestrator decision pending specialist proposal)
Push uses `Order.AccountId` (=mainNodeId ObjectId). Join uses `tenant-id` claim (slug). Must reconcile on a value present in the Client JWT AND derivable from the order. Candidate claims: `node-id` (ObjectId, matches AccountId for account-main users) / `account-id`. Options: (a) producer resolves real tenantId from Node + push `order:{tenantId}` (cleanest, needs commerce); (b) join ALSO joins `order:{node/account-id}` ObjectId group (contained in realtime); (c) push to BOTH during transition. MUST add a test using DIFFERENT accountId vs tenantId values.

## Test coverage
- FE: **ZERO** specs for the whole flow. Pure helpers to extract+test: `toProcessState`, `normalizeFailureReason`, `handleTerminal` key-selection, `resolveGatewayBaseUrl`, realtime dispatch/dedup. Vitest: `npx nx test host-shell`; specs in `apps/host-shell/tests/*.spec.ts`. Stencil cannot instantiate under vitest → mirror truth-table.
- Charging: `TransferAndDirectDebitTests.cs` (23 facts) strong on funding matrix; gaps: CHG-01 scenario, direct-debit concurrency, duplicate-key race, poison/DLQ, money precision, currency mismatch.
- Commerce: `CreateFalconServiceOrderHandlerTests`, `AllowedFalconServiceActionsGeneratorTests` solid; gaps: `UpdatePendingFalconServiceOrderHandler` (0 tests), `CompleteFalconServicePaymentProcess` (0), OrderFinalized context, enum-cast, SetPriceValue zero/neg, getOrderStatus missing-wallet.
- Realtime: `OrderStatusHubTests`, `OrderFinalizedConsumerTests`; gap: cross-side join==push for a Client (would expose SIGNAL-P0), Avro round-trip.

## Run commands
- FE: `npx nx test host-shell` (vitest, jsdom). Build: `npx nx build host-shell`.
- Charging: `dotnet test C:/Falcon/Falcon/falcon-core-charging-svc/tests/Falcon.Charging.Tests/...csproj`. Build `dotnet build .../Falcon.Charging.slnx`.
- Commerce: `dotnet test .../tests/Falcon.Commerce.Tests/...csproj`. Build `dotnet build .../src/src.sln`.
- Realtime: `dotnet test .../tests/Falcon.Comm.Realtime.Tests/...csproj` (no .sln, target csprojs). Port 5210→8080.

## Seed-data (live)
Multi-wallet account (master ALL:SAR + comm AI:SAR + VOICE:SAR), single-wallet account, unconfigured-wallet account; node with Visible+InActive/Expired comm-channel + application both with PricingType+PriceValue set; Settings.WalletSettings present (else getOrderStatus 500). Charging seeders have no wallet fixtures — drive via `commerce.comm-channel-shown.v1` + contract-lifecycle, or insert OCS wallets directly. Realtime + Kafka + schema-registry + topic `commerce.order-finalized.v1` must be up. Client seed: `mtx-owner-*` tenant `test-tenant-001` node `…a11001`.

## Commit/PR
FE branch off `polishing-v0.4` (working tree has MANY unrelated dirty files — cherry-pick only my files, NEVER git add -A). Backend: matching branch per service repo + PR each. Commerce working tree already has BUG-TRANSLATEHELPER uncommitted — don't clobber. Push/PR = final outward step, confirm before pushing.

## FIX STATUS (2026-06-01, applied in working trees, GREEN, NOT yet committed)
- Backend branches in play: realtime `feature/falcon-on-behalf-routing` (clean), charging `feature/realtime-failure-reason-alignment` (9 dirty team files — DirectDebitHandler etc.), commerce `hotfix/scope-pending-order-check-by-tenant` (1 dirty TranslateHelper), gateway `feature/signalr-realtime-only`. FE `polishing-v0.4` (5 unrelated dirty). Docker stack UP 7h (realtime was UNHEALTHY = false alarm, see SIGNAL-P1-HEALTH).
- **COMMERCE done+green** (16/16 new tests, build green, 8 pre-existing fails unchanged): Context.TenantId populated from Node (CONFIRMED Node.TenantId=='test-tenant-001'==Zitadel slug); SetPriceValue<=0 guard (InvalidPriceValue); Enum.IsDefined on payment-processed casts (undefined=poison commit, no bogus finalize); getOrderStatus no-500 on missing wallet + WalletType nullable. Files: CompleteFalconServicePaymentProcess.cs, OrderFinalizedEvent.cs(app), OrderFinalizedEventPublisher.cs, FalconServiceConfigurationBase.Operations.cs, FalconServiceOrderPaymentProcessedEventConsumer.cs, GetOrderStatusHandler.cs, GetOrderStatusResponse.cs + 4 new test files.
- **FE done+green** (55 new tests pass, host-shell suite 239 pass + only known baseline fail, nx build green): pure helpers do-payment-status.util.ts + order-status-gateway.util.ts; specs do-payment-status.spec.ts(31)/order-status-gateway.spec.ts(13)/do-payment-failed-push-reconcile.spec.ts(11); FE-P1a/b stuck-loader fix in do-payment-priority-popup.component.ts (retry budget + cancel-in-flight reconcile + settle-with-default-walletType); service-pricing onIbSucceeded/onIbFailed accept $event + skip reload on cancel.
- **CHARGING done+green** (93 pass/1 skip): CHG-01 fixed at BuildDebitPlans throw (non-prioritized eligible comm balance covers shortfall => CommChannelPriorityOrderRequired not InsufficientFunds), additive to 9 dirty files; tests CHG-01 core + negative-guard + currency-mismatch; CHG-04 money-precision [Skip] report-only.
- **REALTIME = in progress (orchestrator-delegated):** push Client group on evt.Context.TenantId (lowercased) else AccountId fallback; hub joins Client to BOTH order:{tenantId} AND order:{nodeId} (node-id claim, defense-in-depth); fix SIGNAL-P1-HEALTH: Consume(stoppingToken) blocks forever on idle => LastPollUtc never advances => false-unhealthy; change to bounded Consume(TimeSpan ~1s) so LastPollUtc advances every poll. + cross-side regression test (accountId != tenantId).
- **NEXT:** realtime build+test green -> LIVE verify (rebuild commerce+realtime containers, login mtx-owner, do a payment, observe push reaches client) -> seed data -> report -> branch/commit/PR (confirm push).
