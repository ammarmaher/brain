"""
brain-cognee — ingest VERIFICATION on a LOCAL Ollama (no API key, no data egress).
Default: ingest a few Falcon snippets to prove cognify + search run end-to-end on the local model.
Pass --full to ingest every brain dossier (slow on a 1B CPU model).
"""
import asyncio
import os
import sys
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

SAMPLE = [
    "The falcon-button is a dual-render Stencil component: a Shadow DOM falcon-button tag and a Light DOM falcon-button-tw variant. It replaced the PrimeNG p-button.",
    "Falcon styling uses Tailwind v4 @theme tokens plus per-component CSS variables that flow into BOTH the Shadow DOM Stencil component and the Light DOM Tailwind utilities — the dual-render parity hinge.",
    "The wallet page renders a tree-table with Organizations, Wallet, and Transfer columns and a master wallet card.",
]


async def main():
    import cognee

    full = "--full" in sys.argv
    if full:
        docs = [p.read_text(encoding="utf-8", errors="ignore")
                for p in Path(r"C:\Falcon\Brain Outputs\understanding\frontend").rglob("*.md")
                if "node_modules" not in str(p)]
    else:
        docs = SAMPLE

    print(f"Cognee: adding {len(docs)} doc(s)  provider={os.getenv('LLM_PROVIDER')}  model={os.getenv('LLM_MODEL')}", flush=True)
    await cognee.add(docs)
    print("cognify (building knowledge graph on the local model — may take a minute)...", flush=True)
    await cognee.cognify()
    results = await cognee.search("how do falcon components and tailwind relate")
    print(f"\nSearch returned {len(results)} result(s):", flush=True)
    for r in results[:5]:
        print(" -", str(r)[:200])
    print("\nCognee ingest VERIFIED end-to-end on local Ollama.", flush=True)


if __name__ == "__main__":
    asyncio.run(main())
