import { Project, SyntaxKind, type SourceFile } from 'ts-morph';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

type CliArgs = { component: string; project?: string; out?: string };

function parseArgs(): CliArgs {
  const argv = process.argv.slice(2);
  const args: CliArgs = { component: '' };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--component') args.component = argv[++i];
    else if (a === '--project') args.project = argv[++i];
    else if (a === '--out') args.out = argv[++i];
  }
  if (!args.component) {
    console.error('usage: tsx src/react-map.ts --component <ReactComponentName> [--project <react-project-root>] [--out <dir>]');
    process.exit(64);
  }
  return args;
}

function loadConfig(): any {
  const p = resolve(import.meta.dirname, '..', 'web-scrub.config.json');
  if (!existsSync(p)) return {};
  return JSON.parse(readFileSync(p, 'utf8'));
}

function isoStamp(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}`;
}

function findSourceFiles(project: Project, componentName: string): SourceFile[] {
  return project.getSourceFiles().filter((sf) => {
    if (sf.getFilePath().includes('node_modules')) return false;
    const ext = sf.getExtension();
    if (!['.tsx', '.jsx', '.ts', '.js'].includes(ext)) return false;
    const txt = sf.getFullText();
    const re = new RegExp(`\\b${componentName}\\b`);
    return re.test(txt);
  });
}

function analyzeComponent(sf: SourceFile, componentName: string) {
  const result: any = {
    file: sf.getFilePath(),
    declarations: [],
    props: null,
    imports: [] as Array<{ from: string; named: string[] }>,
    hooks: [] as string[],
    eventHandlers: [] as string[],
    jsxChildren: [] as string[],
    classNames: [] as string[],
  };

  const fns = sf.getFunctions().filter((f) => f.getName() === componentName);
  for (const f of fns) {
    result.declarations.push({ kind: 'function', name: f.getName(), pos: f.getStartLineNumber() });
  }
  const vars = sf.getVariableDeclarations().filter((v) => v.getName() === componentName);
  for (const v of vars) {
    result.declarations.push({ kind: 'variable', name: v.getName(), pos: v.getStartLineNumber() });
  }

  const propsInterface = sf.getInterfaces().find((i) => i.getName() === `${componentName}Props`);
  if (propsInterface) {
    result.props = propsInterface.getProperties().map((p) => ({
      name: p.getName(),
      type: p.getType().getText(),
      optional: p.hasQuestionToken(),
    }));
  }
  const propsType = sf.getTypeAlias(`${componentName}Props`);
  if (!result.props && propsType) {
    result.props = [{ name: '<type-alias>', type: propsType.getType().getText(), optional: false }];
  }

  for (const d of sf.getImportDeclarations()) {
    result.imports.push({
      from: d.getModuleSpecifierValue(),
      named: d.getNamedImports().map((n) => n.getName()),
    });
  }

  const calls = sf.getDescendantsOfKind(SyntaxKind.CallExpression);
  for (const c of calls) {
    const name = c.getExpression().getText();
    if (/^use[A-Z]/.test(name)) result.hooks.push(name);
  }
  result.hooks = Array.from(new Set(result.hooks));

  const jsxAttrs = sf.getDescendantsOfKind(SyntaxKind.JsxAttribute);
  for (const a of jsxAttrs) {
    const name = a.getNameNode().getText();
    if (/^on[A-Z]/.test(name)) result.eventHandlers.push(name);
    if (name === 'className' || name === 'class') {
      const init = a.getInitializer();
      if (init) result.classNames.push(init.getText());
    }
  }
  result.eventHandlers = Array.from(new Set(result.eventHandlers));

  const jsxOpenings = sf.getDescendantsOfKind(SyntaxKind.JsxOpeningElement);
  const jsxSelfClosing = sf.getDescendantsOfKind(SyntaxKind.JsxSelfClosingElement);
  const tags = new Set<string>();
  for (const j of [...jsxOpenings, ...jsxSelfClosing]) {
    const tn = j.getTagNameNode().getText();
    if (tn !== componentName) tags.add(tn);
  }
  result.jsxChildren = Array.from(tags).sort();

  return result;
}

async function main() {
  const args = parseArgs();
  const cfg = loadConfig();
  const projectRoot = args.project || cfg.reactProjectDefault || 'C:\\Falcon\\Source_of_truth_theme';
  const stamp = isoStamp();
  const baseOut = args.out || cfg.outputsRoot || 'C:\\Falcon\\Brain Outputs\\reports\\web-scrub';
  const outDir = join(baseOut, `${stamp}_react-map_${args.component}`);
  mkdirSync(outDir, { recursive: true });

  console.log('[react-map] component:', args.component);
  console.log('[react-map] project root:', projectRoot);
  console.log('[react-map] output:', outDir);

  if (!existsSync(projectRoot)) {
    console.error('[react-map] FAIL — project root not found:', projectRoot);
    process.exit(2);
  }

  const project = new Project({
    compilerOptions: { jsx: 4, target: 99, allowJs: true, noEmit: true, skipLibCheck: true },
    useInMemoryFileSystem: false,
  });

  const patterns = ['**/*.tsx', '**/*.jsx', '**/*.ts', '**/*.js'];
  for (const p of patterns) project.addSourceFilesAtPaths(join(projectRoot, p).replace(/\\/g, '/'));

  const total = project.getSourceFiles().length;
  console.log('[react-map] scanned', total, 'source files');

  const hits = findSourceFiles(project, args.component);
  if (hits.length === 0) {
    console.error('[react-map] FAIL — no source files reference', args.component);
    process.exit(2);
  }

  const analyses = hits.map((sf) => analyzeComponent(sf, args.component));
  writeFileSync(join(outDir, 'react-analysis.json'), JSON.stringify(analyses, null, 2), 'utf8');

  const md = [
    `# React-Map Report — ${args.component}`,
    ``,
    `- Project root: ${projectRoot}`,
    `- Source files scanned: ${total}`,
    `- Files referencing \`${args.component}\`: ${hits.length}`,
    ``,
    `## Source files`,
    ...hits.map((h) => `- ${h.getFilePath()}`),
    ``,
    `## Declarations + props + imports + hooks`,
    `\`\`\`json`,
    JSON.stringify(analyses, null, 2),
    `\`\`\``,
    ``,
    `## Next step`,
    `Map this component to a Falcon Angular component. Cross-check against:`,
    `- \`C:\\Falcon\\Brain Outputs\\understanding\\frontend\\components\\\` (62 dossiers)`,
    `- Falcon UI Core source at \`C:\\Falcon\\Falcon\\falcon-web-platform-ui\\libs\\falcon-ui-core\\src\\components\\\``,
    ``,
  ].join('\n');
  writeFileSync(join(outDir, 'REPORT.md'), md, 'utf8');
  console.log('[react-map] DONE →', outDir);
}

main().catch((err) => {
  console.error('[react-map] CRASH', err);
  process.exit(1);
});
