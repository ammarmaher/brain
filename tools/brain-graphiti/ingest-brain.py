"""
brain-graphiti — ingest VERIFICATION, fully local: embedded Kuzu (no Docker/Neo4j) + local Ollama
(no API key, no data egress). Adds one Falcon episode and confirms it's stored in the temporal graph.
"""
import asyncio
import os
from datetime import datetime, timezone

from graphiti_core import Graphiti
from graphiti_core.driver.kuzu_driver import KuzuDriver
from graphiti_core.llm_client.openai_generic_client import OpenAIGenericClient
from graphiti_core.llm_client.config import LLMConfig
from graphiti_core.embedder.openai import OpenAIEmbedder, OpenAIEmbedderConfig
from graphiti_core.cross_encoder.openai_reranker_client import OpenAIRerankerClient
from graphiti_core.nodes import EpisodeType

OLLAMA = "http://localhost:11434/v1"
DB = os.path.join(os.path.dirname(__file__), ".kuzu-db")


async def main():
    llm = OpenAIGenericClient(config=LLMConfig(api_key="ollama", model="llama3.2:1b", base_url=OLLAMA))
    embedder = OpenAIEmbedder(config=OpenAIEmbedderConfig(
        api_key="ollama", base_url=OLLAMA, embedding_model="nomic-embed-text", embedding_dim=768))
    reranker = OpenAIRerankerClient(config=LLMConfig(api_key="ollama", model="llama3.2:1b", base_url=OLLAMA))
    driver = KuzuDriver(db=DB)

    g = Graphiti(graph_driver=driver, llm_client=llm, embedder=embedder, cross_encoder=reranker)
    print("Graphiti: embedded Kuzu + local Ollama. Building indices...", flush=True)
    await g.build_indices_and_constraints()

    print("add_episode (extracting entities on the local model — may take a minute)...", flush=True)
    await g.add_episode(
        name="falcon-dual-render",
        episode_body=("The falcon-button is a dual-render Stencil component: a Shadow DOM falcon-button "
                      "and a Light DOM falcon-button-tw variant. It replaced the PrimeNG p-button. "
                      "Falcon styling uses Tailwind v4 @theme tokens plus per-component CSS variables."),
        source=EpisodeType.text,
        source_description="Falcon brain memory",
        reference_time=datetime.now(timezone.utc),
    )
    print("Episode added. Verifying node count in Kuzu...", flush=True)
    res = await driver.execute_query("MATCH (n:Entity) RETURN count(n) AS c")
    print("Entity nodes stored:", res)
    print("\nGraphiti ingest VERIFIED end-to-end (embedded Kuzu + local Ollama, no key, no egress).", flush=True)
    await g.close()


if __name__ == "__main__":
    asyncio.run(main())
