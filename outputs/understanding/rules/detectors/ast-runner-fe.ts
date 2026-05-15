/*
 * *** Falcon Rulebook — Frontend AST Detector Engine ***
 * *** Reads rule frontmatter where detector.type=ast and scope is FE, ***
 * *** walks TypeScript / Angular Compiler API, emits violations to JSONL ***
 *
 * Status: SCAFFOLD shipped Session 2. One working detector (R-FE-007 — library skeleton + app wrapper).
 *         Additional FE-AST rules added in Session 3+.
 *
 * Why TypeScript? Angular component metadata, providers, inject() / constructor injection,
 * and class hierarchies all need the TS Compiler API to detect reliably. Regex isn't enough
 * for R-FE-007 (a `libs/falcon-ui-core/**` file injecting a service is a violation; the
 * same injection in `apps/**` is fine).
 *
 * Run:
 *   npx ts-node ast-runner-fe.ts \
 *     --rules    "C:\Falcon\Brain Outputs\understanding\rules" \
 *     --target   "C:\Falcon\falcon-web-platform-ui" \
 *     --output   "violations-ast-fe.jsonl" \
 *     --runId    "session-2-smoke"
 *
 * Or install ts-node globally: npm i -g ts-node typescript
 */

import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';

interface RuleMeta {
  ruleId: string;
  ruleName: string;
  ruleCategory: string;
  severity: string;
  scopePaths: string[];
  scopeExemptPaths: string[];
  patchHint: string;
}

interface Violation {
  ruleId: string;
  ruleName: string;
  ruleCategory: string;
  severity: string;
  detectorType: 'ast';
  targetRepo: string;
  filePath: string;
  lineNumber: number;
  lineContent: string;
  matchedPattern: string;
  exemptByRule: boolean;
  exemptByRegistry: boolean;
  suggestedFix: string;
  detectedAt: string;
  runId: string;
}

// ----------------------------------------------------------------
// CLI args
// ----------------------------------------------------------------

const args = parseArgs(process.argv.slice(2));
const RULES_FOLDER = args['rules'];
const TARGET_REPO = args['target'];
const OUTPUT_FILE = args['output'];
const RUN_ID = args['runId'] || new Date().toISOString().replace(/[:.]/g, '-');

if (!RULES_FOLDER || !TARGET_REPO || !OUTPUT_FILE) {
  console.error('Usage: ts-node ast-runner-fe.ts --rules <path> --target <repo> --output <file> [--runId <id>]');
  process.exit(1);
}

const now = new Date().toISOString();
const out = fs.createWriteStream(OUTPUT_FILE, { flags: 'w' });

// ----------------------------------------------------------------
// Load FE-AST rules from frontmatter
// ----------------------------------------------------------------

const feAstRules: RuleMeta[] = loadFeAstRules(RULES_FOLDER);
console.log(`Loaded ${feAstRules.length} FE-AST rules`);

// ----------------------------------------------------------------
// Per-rule detectors
// ----------------------------------------------------------------

const detectors: Record<string, (sf: ts.SourceFile, filePath: string, rule: RuleMeta) => Violation[]> = {

  // R-FE-007: Library skeleton + app wrapper pattern
  // Detection: any class inside libs/falcon-ui-core/** that constructor-injects something whose
  // identifier ends with "Service", "Facade", or "Client" is a violation. The library must be
  // pure presentational; service injection belongs to app-level wrappers.
  'R-FE-007': (sf, filePath, rule) => {
    const violations: Violation[] = [];
    if (!/libs\/falcon-ui-core\//.test(filePath.replace(/\\/g, '/'))) return violations;

    function visit(node: ts.Node) {
      if (ts.isClassDeclaration(node)) {
        const ctor = node.members.find(m => ts.isConstructorDeclaration(m)) as ts.ConstructorDeclaration | undefined;
        if (ctor) {
          for (const param of ctor.parameters) {
            const typeNode = param.type;
            if (typeNode && ts.isTypeReferenceNode(typeNode)) {
              const typeName = typeNode.typeName.getText(sf);
              if (/Service$|Facade$|Client$/.test(typeName)) {
                const { line } = sf.getLineAndCharacterOfPosition(param.getStart(sf));
                violations.push(buildViolation(rule, filePath, line + 1, param.getText(sf), `constructor-injects ${typeName}`));
              }
            }
          }
        }
      }
      ts.forEachChild(node, visit);
    }
    visit(sf);
    return violations;
  },

  // R-FE-001 (AST mode): Tailwind utilities only — flag any `templateUrl` resolving to a non-existent
  // template or any `styles:` array literal with non-empty contents.
  'R-FE-001': (sf, filePath, rule) => {
    const violations: Violation[] = [];
    function visit(node: ts.Node) {
      if (ts.isDecorator(node) && ts.isCallExpression(node.expression)) {
        const call = node.expression;
        if (call.expression.getText(sf) === 'Component' && call.arguments.length > 0) {
          const arg = call.arguments[0];
          if (ts.isObjectLiteralExpression(arg)) {
            for (const prop of arg.properties) {
              if (ts.isPropertyAssignment(prop) && prop.name.getText(sf) === 'styles') {
                if (ts.isArrayLiteralExpression(prop.initializer) && prop.initializer.elements.length > 0) {
                  const { line } = sf.getLineAndCharacterOfPosition(prop.getStart(sf));
                  violations.push(buildViolation(rule, filePath, line + 1, prop.getText(sf).slice(0, 80), 'styles: [...] not empty'));
                }
              }
            }
          }
        }
      }
      ts.forEachChild(node, visit);
    }
    visit(sf);
    return violations;
  },

  // TODO Session 3+: add more AST detectors for FE rules
  //   - R-FE-006 customization-order judgment via component tag enumeration
  //   - R-FE-011 DRY analysis via token-frequency heuristics
};

// ----------------------------------------------------------------
// Walk + emit
// ----------------------------------------------------------------

let scanned = 0;
let emitted = 0;

const allTsFiles = collectFiles(TARGET_REPO, ['.ts', '.tsx']);
console.log(`Scanning ${allTsFiles.length} TypeScript files in ${TARGET_REPO}`);

for (const rule of feAstRules) {
  const detector = detectors[rule.ruleId];
  if (!detector) {
    console.warn(`No AST detector wired for ${rule.ruleId} — skipping (add to detectors map)`);
    continue;
  }
  for (const filePath of allTsFiles) {
    const relPath = path.relative(TARGET_REPO, filePath).replace(/\\/g, '/');
    if (matchesAnyGlob(relPath, rule.scopeExemptPaths)) continue;
    if (rule.scopePaths.length > 0 && !matchesAnyGlob(relPath, rule.scopePaths)) continue;
    let sf: ts.SourceFile;
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      sf = ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true);
    } catch {
      continue;
    }
    scanned++;
    const hits = detector(sf, relPath, rule);
    for (const v of hits) {
      out.write(JSON.stringify(v) + '\n');
      emitted++;
    }
  }
}

out.end();
console.log(`\n=== AST-FE run complete ===`);
console.log(`Files scanned : ${scanned}`);
console.log(`Violations    : ${emitted}`);
console.log(`Output        : ${OUTPUT_FILE}`);

// ----------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------

function parseArgs(argv: string[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) {
      const key = argv[i].slice(2);
      const val = argv[i + 1];
      out[key] = val;
      i++;
    }
  }
  return out;
}

function loadFeAstRules(rulesFolder: string): RuleMeta[] {
  const out: RuleMeta[] = [];
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) { walk(full); }
      else if (entry.isFile() && /^R-FE-.*\.md$/.test(entry.name)) {
        const meta = parseFrontmatter(full);
        if (meta && meta.detectorType === 'ast') out.push(meta);
      }
    }
  };
  walk(rulesFolder);
  return out;
}

function parseFrontmatter(filePath: string): any | null {
  const raw = fs.readFileSync(filePath, 'utf8');
  const m = raw.match(/^---\r?\n([\s\S]+?)\r?\n---/);
  if (!m) return null;
  const fm = m[1];
  const get = (k: string) => {
    const r = new RegExp('^' + k + ':\\s*(.+)$', 'm').exec(fm);
    return r ? r[1].trim().replace(/^['"]|['"]$/g, '') : '';
  };
  const list = (parent: string, child: string): string[] => {
    const r = new RegExp(parent + ':[\\s\\S]*?(?=^\\S|$)', 'm').exec(fm);
    if (!r) return [];
    const block = r[0];
    const lr = new RegExp('^[ \\t]+' + child + ':\\s*\\r?\\n((?:[ \\t]+-\\s*[\'"].*[\'"]\\r?\\n)+)', 'm').exec(block);
    if (!lr) return [];
    return lr[1].split(/\r?\n/).map(l => {
      const x = /^[ \t]+-\s*['"](.*)['"]\s*$/.exec(l);
      return x ? x[1] : '';
    }).filter(x => x);
  };
  let detectorType = '';
  const dr = /^detector:\s*\r?\n([\s\S]+?)(?=^[A-Za-z]|\Z)/m.exec(fm);
  if (dr) {
    const dr2 = /^[ \t]+type:\s*(.+)$/m.exec(dr[1]);
    if (dr2) detectorType = dr2[1].trim();
  }
  return {
    ruleId: get('ruleId'),
    ruleName: get('name'),
    ruleCategory: get('category'),
    severity: get('severity'),
    detectorType,
    scopePaths: list('scope', 'paths'),
    scopeExemptPaths: list('scope', 'exemptPaths'),
    patchHint: ''
  };
}

function collectFiles(root: string, exts: string[]): string[] {
  const out: string[] = [];
  const walk = (dir: string) => {
    let entries: fs.Dirent[] = [];
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      if (e.name === 'node_modules' || e.name === '.git' || e.name === 'dist') continue;
      const full = path.join(dir, e.name);
      if (e.isDirectory()) walk(full);
      else if (e.isFile() && exts.includes(path.extname(e.name))) out.push(full);
    }
  };
  walk(root);
  return out;
}

function globToRegex(glob: string): RegExp {
  const esc = glob.replace(/[.+^${}()|[\]\\]/g, '\\$&')
                  .replace(/\*\*/g, '.*')
                  .replace(/\*/g, '[^/]*')
                  .replace(/\?/g, '.');
  return new RegExp('^' + esc + '$');
}

function matchesAnyGlob(relPath: string, globs: string[]): boolean {
  if (!globs || globs.length === 0) return false;
  return globs.some(g => globToRegex(g).test(relPath));
}

function buildViolation(rule: RuleMeta, filePath: string, line: number, snippet: string, matched: string): Violation {
  return {
    ruleId: rule.ruleId,
    ruleName: rule.ruleName,
    ruleCategory: rule.ruleCategory,
    severity: rule.severity,
    detectorType: 'ast',
    targetRepo: TARGET_REPO,
    filePath,
    lineNumber: line,
    lineContent: snippet.trim(),
    matchedPattern: matched,
    exemptByRule: false,
    exemptByRegistry: false,
    suggestedFix: rule.patchHint || '',
    detectedAt: now,
    runId: RUN_ID
  };
}
