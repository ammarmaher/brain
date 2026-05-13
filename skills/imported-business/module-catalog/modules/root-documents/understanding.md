# Understanding — Root Documents

These are NOT a business module. Treat them as:

1. A living backlog of cross-cutting open questions (`Points to be covered later`).
2. A methodology guide for AI-assisted product work (`Copilot 4DevOps`) — no impact on any module's runtime behavior.

## Cross-cutting backlog propagation

When generating understanding for any module, check the open-topic list in `latest-prd.md` and copy the relevant item into that module's `understanding.md` > `Clarifying questions`. Keep the phrasing lightly normalized (e.g. "codec Opus vs G711 U" stays as a voice commchannel question; refund flow becomes a module-3 question).

This has already been done implicitly by listing module mappings in `latest-prd.md`. Future syncs should cross-link by adding the specific points into their target modules when those modules get a deep sync.

## No actors / workflows / validations

These are meta-documents. No user type, no UI, no data entity, no API.

## Dependencies

- Depends on (in spirit): every business module.
- Is depended on by: the team's planning processes + the AI tooling they use.

## Action items for future syncs

- Every time a point in `Points to be covered later` gets addressed by a PRD revision, remove it from that list (in Drive) AND remove it from this module's `latest-prd.md`.
- Copilot 4DevOps: track revisions ONLY if the team changes their prompt library; otherwise this file is stable.
