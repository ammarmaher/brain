---
name: Brain SK vault semantic-search CLI
description: Standalone semantic search over the Brain SK Obsidian vault — reuses Smart Connections' bge-micro-v2 embeddings, no Obsidian required
type: reference
originSessionId: 25d14204-7942-45ad-92f7-576f71036414
---
## What it is

A Node CLI at `C:\Falcon\Brain SK\scripts\vault-search\vault-search.mjs` that does semantic search over the Brain SK Obsidian vault by reading Smart Connections' on-disk embedding store. Designed as "Pattern C" — any Claude session can run it to surface relevant notes without launching Obsidian.

## Vault + plugin context

- Vault root: `C:\Falcon\Brain SK\_obsidian` (12 root MD files, mostly INDEX/hub notes)
- Embeddings store: `C:\Falcon\Brain SK\_obsidian\.smart-env\multi\*.ajson` (append-only, one file per note)
- Source model recorded in embeddings: `TaylorAI/bge-micro-v2` (384-dim)
- Runtime model used by this script for query embedding: `Xenova/bge-micro-v2` (ONNX twin of the same weights via `@xenova/transformers`)

## Usage

```powershell
# one-time setup
cd "C:\Falcon\Brain SK\scripts\vault-search"
npm install

# first run downloads the ~33MB ONNX model into ./model-cache/ (cached forever after)
node "C:\Falcon\Brain SK\scripts\vault-search\vault-search.mjs" "where do component dossiers live"

# more results
$env:TOP_N=20; node "C:\Falcon\Brain SK\scripts\vault-search\vault-search.mjs" "OCS validation rules"

# different vault
$env:VAULT="C:\Falcon\falcon-wiki"; node "C:\Falcon\Brain SK\scripts\vault-search\vault-search.mjs" "permissions module"

# pre-downloaded model (offline mode)
$env:MODEL_PATH="D:\models"; node "C:\Falcon\Brain SK\scripts\vault-search\vault-search.mjs" "..."
```

## Network requirement (one-time)

The first run needs to reach `huggingface.co/Xenova/bge-micro-v2`. **As of 2026-05-14 the user's office network blocks HF** — corporate proxy injects `401 Invalid username or password` on every HF request. Workarounds:

1. Run the script once on a network that doesn't block HF (home wifi, mobile hotspot). The 4 model files land in `scripts/vault-search/model-cache/Xenova/bge-micro-v2/` and stay there.
2. Or hand-download these 4 files from `huggingface.co/Xenova/bge-micro-v2` on any unblocked machine, then drop them in the same path:
   - `onnx/model_quantized.onnx` (~17MB)
   - `tokenizer.json`
   - `tokenizer_config.json`
   - `config.json`
3. Or fall back to Obsidian's Smart Lookup view — same embeddings, same model, runs whenever Obsidian is open.

After the model is cached, the script runs fully offline.

Output: top-N matches with cosine score, file path, and block heading (when the hit is at block level vs whole-note level).

## When to invoke

- User says "search Brain SK for X", "find notes about Y in the Brain", "what does the vault say about Z"
- Keyword grep would miss paraphrased / abstract phrasing (the INDEX files have abstract names)
- You need to triangulate which notes are relevant before reading them in full

## When NOT to invoke

- User wants a literal string match → use Grep instead
- User edited notes today but hasn't reopened Obsidian since → embeddings are stale, fall back to Grep or ask the user to refresh
- User wants chat-style answer → use the script to find top-3 notes, then Read them directly

## How it parses the store

Each `.ajson` file is an append-only sequence of `"<key>": <json_value>,` lines. The script wraps the file in `{...}` (stripping trailing comma), parses as one JSON object — duplicate keys collapse to the last write (which is the latest-wins semantics Smart Connections uses). Both source-level (`smart_sources:<path>`) and block-level (`smart_blocks:<path>#<heading>`) vectors are scored.

## Limits

- Embeddings only refresh when the user opens Obsidian (Smart Connections is the only thing that writes to `.smart-env/multi/`). Stale notes ⇒ stale hits.
- Block-level hits include heading path but not the block text — Read the file at that heading to see content.
- Cosine similarity over the full vector — no reranking, no MMR.
- 384-dim bge-micro-v2 is the lightest model in the Smart Connections lineup; good enough for a 12-note focused vault. If quality drops as the vault grows, upgrading the embedding model in Smart Connections (and re-indexing) requires no script change — the script reads whatever model is recorded in each `.ajson`.

## Files

- `C:\Falcon\Brain SK\scripts\vault-search\vault-search.mjs` — the CLI
- `C:\Falcon\Brain SK\scripts\vault-search\package.json` — single dep: `@xenova/transformers ^2.17.2`
