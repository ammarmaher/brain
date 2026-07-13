# Root-cause: GET /commerce/Node/{id}/comm-channels → 500 (2026-06-10, read-only investigation, COMPLETED)

Note: `current-task.json` was owned by a parallel session (node-name regex fix, in_progress) at finish time, so this task archives directly to history without touching it.

**Question:** Why does `http://localhost:7256/commerce/Node/690000000000000000c10001/comm-channels` always return 500 (admin console "Communication & Services" tab)?

**Verdict — NullReferenceException in Commerce, code × data:**
- [CODE] `TranslateHelper.cs:19` (`falcon-core-commerce-svc/.../Services/Helpers/`) — `GetTranslation` dereferences `translate.En` with no null check.
- [CODE] `GetAccountCommunicationChannelsHandler.cs:55-58` passes `channel.SubTitle` / `channel.Description` unconditionally; entity declares both optional (`[BsonIgnoreIfNull]`).
- [DATA] Mongo `FalconCommerceDB.CommunicationChannels`: all 9 docs missing `description`, 5 also missing `subTitle` — `$unset` by `falcon-essentials/seed/seed-service-scenarios.js:176-184` on the assumption FE i18n supplies the text.
- Falcon users process the ENTIRE catalog (`isFalconUser` bypasses the node-channel skip) → first doc (WhatsApp) throws on `Description = GetTranslation(null)` → 500 for every node id.
- `/applications` works because `Applications` docs (8/8) still have subTitle+description.
- Latent same-pattern NRE in ~10 other handlers (e.g. `GetVisibleCommunicationChannelDetailsHandler.cs:73-76`).

**Runtime evidence:** each system-gateway comm-channels proxy log line pairs with a commerce ERR stack (`TranslateHelper.cs:19 ← GetAccountCommunicationChannelsHandler.cs:52 ← NodeController.cs:145`) at identical timestamps on 2026-06-10.

**FIX APPLIED (same day, user-approved, backend-only, NOT committed):**
- `TranslateHelper.GetTranslation` → `ITranslate?` param, returns null for null (guard before culture switch); `ITranslateHelper` signature widened. Single choke point heals all ~10 latent call sites. NO FE change (FE models already `string | null`). NO data repair (absent fields are the seed's intended design; entity marks them `[BsonIgnoreIfNull]`).
- Tests: NEW `TranslateHelperTests` (6) + real-TranslateHelper regression in `GetAccountCommunicationChannelsHandlerTests` (the old mock was null-safe, masking the bug). Targeted 15/15 GREEN; full suite 436/444 (8 fails = 7 pre-existing AddressTests + 1 ChangeNodeNameHandlerTests owned by the parallel NodeName session).
- Deploy: `docker compose restart commerce` (bind-mounted source, `dotnet run` recompiles).
- LIVE-VERIFIED as `FalconAdmin`: `GET :7256/commerce/Node/690000000000000000c10001/comm-channels` = **200, 9 channels**; `/comm-channels/visible/details` = **200, 9 items**.

**DRAFT PR 42324** (user-requested): https://t2development.visualstudio.com/DefaultCollection/Falcon/_git/falcon-core-commerce-svc/pullrequest/42324 — `fix/comm-channels-null-safe-translation` (33a012f) → `main`, only the 4 fix files, built in a temp worktree off origin/main; 15/15 targeted tests green on the main base before push.

Full detail: memory `project_comm_channels_500_translatehelper_nre_2026_06_10.md`.
