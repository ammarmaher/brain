/*
 * embed.mjs — local sentence embeddings via transformers.js (no API, no Python).
 * Model: Xenova/all-MiniLM-L6-v2 → 384-dim, mean-pooled + L2-normalized.
 * Model is cached under brain-boost/.cache so it stays isolated to this tool.
 */
import { env, pipeline } from '@xenova/transformers';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
env.cacheDir = path.join(__dirname, '..', '.cache');
env.allowRemoteModels = true; // first run downloads ~90MB, then cached locally

export const EMBED_MODEL = 'Xenova/all-MiniLM-L6-v2';
export const EMBED_DIMS = 384;

let _pipe = null;
export async function getEmbedder() {
  if (_pipe) return _pipe;
  _pipe = await pipeline('feature-extraction', EMBED_MODEL);
  return _pipe;
}

/** Embed one string → plain number[] of length 384. */
export async function embed(text) {
  const pipe = await getEmbedder();
  const out = await pipe(String(text ?? '').slice(0, 4000), { pooling: 'mean', normalize: true });
  return Array.from(out.data);
}

/** Embed many strings sequentially (keeps memory flat). */
export async function embedAll(texts, onProgress) {
  const pipe = await getEmbedder();
  const vectors = [];
  for (let i = 0; i < texts.length; i++) {
    const out = await pipe(String(texts[i] ?? '').slice(0, 4000), { pooling: 'mean', normalize: true });
    vectors.push(Array.from(out.data));
    if (onProgress && (i % 25 === 0 || i === texts.length - 1)) onProgress(i + 1, texts.length);
  }
  return vectors;
}

/** Cosine similarity for two L2-normalized vectors = dot product. */
export function cosine(a, b) {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] * b[i];
  return s;
}
