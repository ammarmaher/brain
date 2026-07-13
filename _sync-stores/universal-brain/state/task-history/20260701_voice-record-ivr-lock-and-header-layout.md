# Voice Records: per-row IVR lock + node-details-section moved under the tabs

Date: 2026-07-01 · Agent: claude · Status: DONE (reviewed, 0 defects) · FE polishing-v0.4 + templates-svc (both UNCOMMITTED)

## Asks (from screenshots)
1. Records that cannot be deleted (used in an approved IVR) must show a lock (name-cell lock tag +
   disabled Delete + tooltip). 2. Move falcon-node-details-section UNDER the tabs (SoT layout).

## (1) IVR lock — end-to-end (the flag existed nowhere; only the delete guard used a single-record check)
- Backend (templates-svc): +UsedInIvr on VoiceRecordListItemDto; +batch GetIdsUsedByAnyIvrAsync on
  IVoiceRecordUsageReader + IvrVoiceRecordUsageReader (nested ids.Contains over
  flow.nodes[].content[].voiceRecordId, non-deleted templates, in-memory extract); ListVoiceRecordsHandler
  injects the reader + maps `with { UsedInIvr = usedIds.Contains(r.Id) }`.
- FE (both apps): model +usedInIvr (wire optional / domain / mapper default false); records-tab custom
  name cell = name + inline lucide padlock svg + [title] voiceRecords.lockedHint when usedInIvr; Delete
  action disabled:(row)=>!!row.usedInIvr. i18n +lockedHint (en+ar).
- Gotchas: no closed-lock font icon (only lock-open) → inline lucide svg. Build gates: S125 (code-looking
  comment), MA0002 (HashSet needs StringComparer.Ordinal).

## (2) Layout — node-details-section under the tabs
Both shells reordered: tabs -> node header (avatar + name + Create action) -> content. Pure FE.

## Verification
- nx build mgmt+admin GREEN; dotnet build templates-svc 0 warn / 0 err.
- templates-svc redeployed (falcon-templates-1 restart -> recompiled); GET /api/voice-records -> 200 with
  usedInIvr on every row (200 proves the nested batch query translates). All rows false (no IVR refs yet).
- Adversarial review (backend query correctness + FE render/layout) -> 0 confirmed defects.

## Open / caveats
- Not visually proven for a LOCKED row — needs a real IVR referencing a record (voice comm channel to
  author, or Mongo auth to seed). The delete guard 409s regardless.
- Details-page lock (SoT shows it in the Record-name field) = optional follow-up (needs details DTO field).
- Shared MEMORY.md ~391KB (over load limit) — flagged for a compaction decision.
- Memory: project_voice_record_ivr_lock_and_header_layout_2026_07_01.md.
