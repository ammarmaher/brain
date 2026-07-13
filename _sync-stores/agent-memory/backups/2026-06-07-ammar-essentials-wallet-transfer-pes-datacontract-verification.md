---
name: Session Backup - Wallet balance-transfer PES + data-contract night-shift verification
description: READ-ONLY comprehensive per-wallet-type (NM/NS/UM/US x owner/admin/user) verification of the wallet balance-transfer authorization + hierarchy data contract; substitutes for the live UI test. All green. One reversible E2E transfer (HTTP 200, net-restored).
type: project
agent: ammar-essentials
date: 2026-06-07
status: completed
---
## What Was Done
READ-ONLY QA of the wallet balance-transfer feature across the 4 wallet-type modes x 3 roles (12 subjects), substituting for the live UI test (no browser password entry). Proved the PES authorization decisions + the hierarchy data contract that gate/feed the FE.

Targets (per task brief): NM d10003 (pilot-nm-3-*), NS d10008 (pilot-ns-8-*), UM d10014 (pilot-um-14-*), US d10020 (pilot-us-20-*). All users pwd Admin@1234.

### Ground truth locked (code + Mongo, authoritative)
- PES subject kind = `u:{JWT.sub}@{tenantId}`; JWT.sub == Identity `identityUserId`. All 12 users login stage 4, jwt.sub matches expected zid (PASS).
- PES PolicyRules (Mongo `PES.PolicyRules`): Type 103 = g-link `Sub:r:acc-{role}@{tid}, Obj:u:{zid}@{tid}` (role binding ONLY, carries NO path). Type 112 = p-rules. 27 wallet-balance p-rules/tenant (9 actions x 3 roles). g-link present 1-each for every subject.
- **`r.sub.path`, `r.obj.sourcePath`, `r.obj.destinationPath` come from the REQUEST**, not the g-link (Matcher.cs `_isMatchedExpression` -> `ExpressionInput.CreateFromRequest`; ExpressionInput.cs binds `r.sub.{k}` from `sub.Attr`, `r.obj.{k}` from `obj.Attr`). Caller/FE supplies them.
- **CRITICAL REQUEST SHAPE: attrs MUST nest under `attr{}`** — `sub:{kind, attr:{path}}`, obj:`{kind, attr:{sourcePath,destinationPath}}`. Top-level `path`/`sourcePath` are SILENTLY IGNORED (Subject/Object have no such props) -> AttrAsString="" -> every owner empty-rule matches -> false TRUE. My first smoke test made this mistake; corrected.
- Admin acc-admin transfer-owner-owner expression (pes-account-role-rules.json:116) uses **DOT** separator: `("r.obj.sourcePath"=="r.sub.path" || .StartsWith("r.sub.path.")) && (dest same)`.
- Commerce Nodes path + hierarchy-GW path are **COMMA-joined** (`tid,childId`); PES expression needs **DOT-joined** (`tid.childId`). FE/gateway MUST convert comma->dot for PES attrs. (Confirmed both: Mongo Nodes.path comma; hierarchy response node.path comma; admin rule .StartsWith needs dot.)
- Effect.cs:37 (`/resources`): `x.Action==action && x.Obj==obj.Kind && obj.AttrAsString==x.ObjAttrAsString`. Owner empty-expr rule yielded unchanged (ObjAttr null, ""), so with attrs (non-"") the equality FAILS -> owner FALSE-NEGATIVE. Admin matched-expr rule has `clonedPolicyRule.ObjAttr=resource.Obj.Attr` set (Matcher.cs:126) -> equality lines up -> admin TRUE with attrs. Effect.cs:16-31 (`/pes/authorize`, no attr compare) -> owner TRUE with attrs. CONFIRMED LIVE.

### Results (ALL PASS)
1. Token mint + self-validate (12/12 PASS). 429 rate-limit on rapid logins is a HARNESS pacing artifact (Identity login is rate-limited; "Too Many Requests"); PES checks need no token.
2. Coarse acc.wallet-balance view+transfer (24 checks): owner allow/allow, admin allow/allow, user deny/deny — all 4 modes PASS. => FE hides Transfer button + blocks drawer for acc-user.
3. NM/NS NODE owner->owner per-pair (North<->South, real dot paths): owner=true(/authorize); owner=false(/resources, quirk reproduced); admin in-subtree(sub=Main)=true, out-of-subtree(sub=North,dst=South)=false, self(N->N)=true; user=false. ALL PASS.
4. UM/US USER->USER owner->owner: owner=true, admin in-scope=true, user=false, admin out-of-scope(synthetic deeper sub.path)=false. ALL PASS. NOTE: all UM/US users physically sit at Main (nodeId=tid, path=tid) so a real cross-subtree USER pair is impossible in this seed -> admin subtree-scoping for users collapses to "all at Main allowed"; tested the deny edge with a synthetic deeper sub.path.
5. Multiple (NM/UM) directionals: owner transfer-channel-owner + transfer-owner-channel = true; admin both = false (coarse). PASS. (Owner rules transfer-master-channel / transfer-channel-master = DENY in json; owner master-owner/owner-master = allow.)
6. Hierarchy data contract (owner token, mgmt Core GW :7038, all HTTP 200):
   - NM d10003: walletType=2(Mult), balanceType=1(Node), channels=3(Voice/WhatsApp/AI), NODE rows nodeType=1 + per-channel channelBalances, path present. CORRECT.
   - NS d10008: walletType=1(Single), balanceType=1(Node), channels=0(EMPTY), NODE rows w/ real balances (North 6000/South 2500). CORRECT.
   - UM d10014: walletType=2(Mult), balanceType=2(User), channels=3, USER rows nodeType=3 w/ real per-channel channelBalances (USER:{mongoId}:{CHANID}:SAR). CORRECT.
   - US d10020: walletType=1(Single), balanceType=2(User), channels=0, 8 USER rows nodeType=3 w/ real balances + DISABLED row (Disabled1 disabled:true balance:0). CORRECT. disabled-1 has 0 charging wallets (mechanism confirmed).
7. OPTIONAL E2E: NS North->South 500 -> HTTP 200 success+txid; reverse South->North 500 -> HTTP 200; gateway view RESTORED (North 6000/South 2500/total 100000). Charging `/health`=200 (the docker "unhealthy" flag is a false alarm).

## Findings to flag (no FAIL; surprises documented)
- **F1 (confirmed, expected)** Effect.cs `/resources` owner false-negative WITH source/dest attrs; TRUE on `/pes/authorize` or attr-less `/resources`. For per-pair OWNER checks the FE/QA MUST use `/pes/authorize` (or omit attrs). Admin path-scoped rule works correctly on `/resources` WITH attrs. Asymmetry reproduced live.
- **F2 (data-shape inconsistency, LOW)** UM (UserBased+Multiple) hierarchy returns the 2 underlying NODE rows (North/South) as `disabled:true balance:0 walletId:null` ALONGSIDE the 7 USER rows. US (UserBased+Single) returns ONLY user rows (clean). So UserBased+Multiple leaks disabled tree nodes; FE adapter must filter/render-disabled. NOT a security issue (disabled, 0, null walletId => not a valid transfer endpoint).
- **F3 (charging transfer mechanism, by design)** Transfer moves funds PER-BUCKET carrying source bucket identity into destination. A North->South then South->North round-trip conserves NET totals exactly (restored) but leaves each node with a small cross-origin bucket (North: CTR-0801 5500 + CTR-0802 500; South: CTR-0802 2000 + CTR-0801 500). Spendable totals identical to baseline; pristine bucket shape would need a re-seed. FE/gateway balance is the per-node TOTAL (restored correctly).
- **F4 (path separator mismatch)** comma-joined everywhere in Commerce/hierarchy vs dot-joined required by the admin PES expression — the FE/gateway is responsible for the conversion. Verified both ends.

## Files Changed
- NEW harness (read-only): `C:\Falcon\qa\wallet-transfer-nightshift\probe.sh` (token mint + self-validate + coarse + per-pair PES matrix). NO backend .cs, NO seeds, NO repo edits, NO commits. One reversible transfer pair via curl (net-restored).

## Context for Next Agent
- jq: `C:/Users/User/AppData/Local/Microsoft/WinGet/Packages/jqlang.jq_*/jq.exe`. Mongo auth: `mongodb://root:example@localhost:27017/<db>?authSource=admin`.
- PES PDP: POST :5296/pes/authorize (attr-agnostic, owner per-pair) and :5296/pes/authorize/resources (attrs enforce admin scope). Subject `u:{zid}@{tid}`. attrs under `attr{}`.
- jq `// "ERR"` is a TRAP on booleans (false // x == x); use `has()` to extract PES false results.
- Identity login :7777/api/auth/login is RATE-LIMITED (429 on rapid fire) -> pace logins; PES needs no token.
- Subject zids (mode owner/admin/user): NM 376289401128353801/...407369478153/...413677711369; NS ...516538822665/...522628952073/...528937185289; UM ...685988704265/...692263383049/...698806497289; US ...011080818697/...017556824073/...024150269961.
- Node dot-paths: NM North 690000000000000000d10003.690000000000000000000301 / South ...000302; NS North ...d10008.690000000000000000000801 / South ...000802. UM/US users all at Main path = tid.
