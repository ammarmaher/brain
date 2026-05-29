/*
 * lint-brain.mjs — structure/organization linter for the brain.
 *   - Component dossiers: every component folder should have the 9 canonical files.
 *   - Skills: every SKILL.md should have YAML frontmatter with name + description (zod-validated).
 *   - Markdown: flag dossier files with no heading (remark AST).
 * Run: npm run lint
 */
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { z } from 'zod';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkFrontmatter from 'remark-frontmatter';

const COMPONENTS = 'C:\\Falcon\\Brain Outputs\\understanding\\frontend\\components';
const SKILL_ROOTS = ['C:\\Falcon\\.claude\\skills', 'C:\\Falcon\\Brain SK\\skills', 'C:\\Falcon\\Brain SK\\domains'];
const DOSSIER_FILES = ['OVERVIEW.md', 'API.md', 'USAGE.md', 'TOKENS.md', 'DECISION.md', 'GAPS_AND_UPGRADES.md', 'BUSINESS.md', 'INTEGRATION_VALIDATION.md', 'RECOGNITION.md'];
const SKIP = new Set(['node_modules', '.git', 'dist', 'bin', 'obj', '.cache']);

const mdProc = unified().use(remarkParse).use(remarkFrontmatter, ['yaml']);
const SkillFM = z.object({ name: z.string().min(1), description: z.string().min(1) });

function walk(dir, hits, fname) {
  let ents = [];
  try { ents = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const e of ents) {
    if (e.isDirectory()) { if (!SKIP.has(e.name)) walk(path.join(dir, e.name), hits, fname); }
    else if (e.name === fname) hits.push(path.join(dir, e.name));
  }
}

// 1. Dossier completeness
console.log('\n=== brain-lint ===');
let dossierFolders = 0, incomplete = 0;
const dossierViolations = [];
try {
  for (const d of fs.readdirSync(COMPONENTS, { withFileTypes: true })) {
    if (!d.isDirectory() || d.name.startsWith('_')) continue;
    dossierFolders++;
    const present = new Set(fs.readdirSync(path.join(COMPONENTS, d.name)));
    const missing = DOSSIER_FILES.filter(f => !present.has(f));
    if (missing.length) { incomplete++; dossierViolations.push(`${d.name}: missing ${missing.join(', ')}`); }
  }
} catch (e) { console.error('component scan error:', e.message); }
console.log(`\nComponent dossiers: ${dossierFolders} folders, ${incomplete} INCOMPLETE (expected ${DOSSIER_FILES.length} files each)`);
dossierViolations.slice(0, 12).forEach(v => console.log('  - ' + v));
if (dossierViolations.length > 12) console.log(`  ... +${dossierViolations.length - 12} more`);

// 2. Skill frontmatter validation
const skillFiles = [];
for (const root of SKILL_ROOTS) walk(root, skillFiles, 'SKILL.md');
let badSkills = 0;
const skillViolations = [];
for (const f of skillFiles) {
  let raw = '';
  try { raw = fs.readFileSync(f, 'utf8'); } catch { continue; }
  let fm = {};
  try { fm = matter(raw).data; }
  catch { badSkills++; skillViolations.push(path.relative('C:\\Falcon', f) + '  (INVALID YAML frontmatter)'); continue; }
  const r = SkillFM.safeParse(fm);
  if (!r.success) { badSkills++; skillViolations.push(path.relative('C:\\Falcon', f)); }
}
console.log(`\nSkills: ${skillFiles.length} SKILL.md scanned, ${badSkills} missing valid name+description frontmatter`);
skillViolations.slice(0, 12).forEach(v => console.log('  - ' + v));
if (skillViolations.length > 12) console.log(`  ... +${skillViolations.length - 12} more`);

// 3. Headless markdown (no heading) across component dossiers
let noHeading = 0;
const dossierMd = [];
walk(COMPONENTS, dossierMd, null); // collect nothing via fname=null; do manual below
function collectMd(dir, out) {
  let ents = []; try { ents = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const e of ents) {
    if (e.isDirectory()) { if (!SKIP.has(e.name)) collectMd(path.join(dir, e.name), out); }
    else if (e.name.endsWith('.md')) out.push(path.join(dir, e.name));
  }
}
const allMd = [];
collectMd(COMPONENTS, allMd);
for (const f of allMd) {
  try {
    const tree = mdProc.parse(fs.readFileSync(f, 'utf8'));
    if (!tree.children.some(c => c.type === 'heading')) noHeading++;
  } catch { /* ignore */ }
}
console.log(`\nMarkdown structure: ${allMd.length} dossier .md files, ${noHeading} with NO heading (remark AST check)`);
console.log('');
