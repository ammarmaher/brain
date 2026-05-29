/* warm-model.mjs — one-time download + sanity check of the local embedder. */
import { embed, EMBED_MODEL, EMBED_DIMS } from './embed.mjs';

const t0 = Date.now();
const v = await embed('Falcon dual-render component with Tailwind tokens and shadow DOM');
const ms = Date.now() - t0;

if (!Array.isArray(v) || v.length !== EMBED_DIMS) {
  console.error(`FAIL: expected ${EMBED_DIMS} dims, got ${v && v.length}`);
  process.exit(1);
}
console.log(`OK  model=${EMBED_MODEL}  dims=${v.length}  first-embed=${ms}ms  sample=[${v.slice(0, 4).map(x => x.toFixed(4)).join(', ')}, ...]`);
