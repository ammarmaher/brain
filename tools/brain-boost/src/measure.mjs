/*
 * measure.mjs — objective brain-UNDERSTANDING (depth) metric.
 * Probes are DETAIL questions whose answer lives in dossier prose, not in any node id/name.
 * A probe HITs if any top-K result's TEXT contains an expected answer keyword.
 * Node-only index has thin text (id+name+purpose) → misses depth; dossiers carry the answer.
 * Run: npm run measure
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { embed, cosine } from './embed.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const INDEX = path.join(__dirname, '..', '.cache', 'brain-index.json');
const K = 5;

// [question, answer-keywords that appear in dossier prose, lowercased match on result TEXT]
const PROBES = [
  ['what visual trick renders the radio dot', ['border-width']],
  ['what library did the phone field replace', ['libphonenumber', 'intl-tel']],
  ['what primeng button did the falcon button replace', ['p-button']],
  ['what distinctive dashed variant does the button have', ['dashed']],
  ['how is the data-table different from falcon-table', ['projection', 'strategy e']],
  ['default number of otp input boxes', ['default 6', '6)']],
  ['what aria role does the switch use', ['role="switch"', 'aria-checked']],
  ['what primeng password component was replaced', ['p-password']],
  ['what primeng tag did the falcon tag replace', ['p-tag']],
  ['what primeng confirm dialog was replaced', ['p-confirmdialog', 'confirm-dialog']],
  ['can the calendar do range selection', ['range selection']],
  ['what keyboard navigation does the accordion support', ['arrow', 'home/end']],
  ['what size are the stepper dots', ['18px']],
  ['what happens to the button label when loading', ['opacity', 'fades']],
  ['which component is the flagship dual-render reference', ['flagship']],
];

const { docs, kinds, count } = JSON.parse(fs.readFileSync(INDEX, 'utf8'));

let hits = 0;
const lines = [];
for (const [q, kws] of PROBES) {
  const qv = await embed(q);
  const top = docs.map(d => ({ d, s: cosine(qv, d.vector) })).sort((a, b) => b.s - a.s).slice(0, K);
  const hit = top.some(({ d }) => { const t = (d.text || '').toLowerCase(); return kws.some(k => t.includes(k)); });
  if (hit) hits++;
  lines.push(`  ${hit ? 'HIT ' : 'MISS'}  "${q}"  →  ${top[0].d.id}`);
}
const pct = (hits / PROBES.length) * 100;
console.log(`\nUNDERSTANDING-depth probe — corpus=${count} docs (node=${kinds?.node ?? '?'}, dossier=${kinds?.dossier ?? 0}), K=${K}`);
console.log(lines.join('\n'));
console.log(`\nHit-rate: ${hits}/${PROBES.length} = ${pct.toFixed(1)}%\n`);
