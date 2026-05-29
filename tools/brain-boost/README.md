# brain-boost — Falcon brain enhancement tool (Tier 1 + Tier 2)

Isolated Node tool that makes the Falcon brain **understand meaning** (not just keywords),
**audit its own graph health**, and **lint its own organization**. Own `node_modules` —
never touches the Angular workspace at `C:\Falcon\Falcon\falcon-web-platform-ui`.

## Install
```powershell
powershell -ExecutionPolicy Bypass -File install.ps1
```
Installs deps + downloads the local embedding model (one-time, ~90 MB).
> Note: this host resets IPv6 TLS to huggingface.co — the npm scripts pass
> `--dns-result-order=ipv4first` (see brain memory `infra_ado_ipv6_blocked_use_ipv4`).

## Commands
| Command | What it does | Library |
|---|---|---|
| `npm run index` | Embed all 533 graph nodes → `.cache/brain-index.json` | transformers.js (all-MiniLM-L6-v2, 384d) |
| `npm run query -- "<text>"` | LEXICAL vs SEMANTIC vs HYBRID side-by-side | Orama (BM25) + cosine |
| `npm run build-sqlite` | Persist embeddings to on-disk KNN store | better-sqlite3 + sqlite-vec |
| `npm run query-sqlite -- "<text>"` | KNN over the persisted store | sqlite-vec |
| `npm run health` | Orphans + most-connected + Louvain communities | graphology (+ communities-louvain) |
| `npm run lint` | Dossier completeness + skill frontmatter + headings | gray-matter + remark + zod |

## Verified results (2026-05-28)
- **Semantic search** — query `"how do components and tailwind and shadow dom relate"`:
  LEXICAL = **0 hits**; SEMANTIC = **6 hits** incl. `adr:005 — Dual-render path (Shadow + Tailwind variants)`.
- **Persistence** — 533 vectors → `brain.db` (1.6 MB); KNN returns `adr:005` as top hit from disk.
- **graph-health** — 533 nodes, **253 usable edges, 238 dangling** (endpoint missing), **290 orphans (54%)**;
  most-connected = `page:organization-hierarchy` (deg 42); 320 Louvain communities.
- **lint** — 62/62 component dossiers complete (9 files each); **30 of 64 SKILL.md missing valid name+description frontmatter** (1 invalid YAML).

## Two real findings worth acting on
1. **238 dangling edges** point to node IDs that don't exist → graph wiring bug to reconcile.
2. **30 skills** lack valid frontmatter → run `npm run lint` and fix to make the brain self-organizing.
