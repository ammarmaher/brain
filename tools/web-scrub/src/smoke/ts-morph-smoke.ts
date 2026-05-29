import { Project, SyntaxKind } from 'ts-morph';
import { writeFileSync, mkdirSync, existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

async function main() {
  const dir = join(tmpdir(), 'web-scrub-tsmorph-smoke');
  if (existsSync(dir)) rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  const file = join(dir, 'sample.tsx');
  const sample = `
import React, { useState } from 'react';

export interface HelloProps {
  name: string;
  showSuffix?: boolean;
}

export function Hello({ name, showSuffix = true }: HelloProps) {
  const [count, setCount] = useState(0);
  return (
    <div className="hello-root">
      <span>Hello {name}{showSuffix ? '!' : ''}</span>
      <button onClick={() => setCount((c) => c + 1)}>+{count}</button>
    </div>
  );
}
`;
  writeFileSync(file, sample, 'utf8');

  const project = new Project({
    compilerOptions: { jsx: 4 /* ReactJSX */, target: 99 /* ESNext */, allowJs: false, noEmit: true },
    useInMemoryFileSystem: false,
  });
  const src = project.addSourceFileAtPath(file);

  const components = src
    .getFunctions()
    .map((f) => f.getName())
    .filter((n): n is string => Boolean(n));
  const interfaces = src.getInterfaces().map((i) => ({
    name: i.getName(),
    props: i.getProperties().map((p) => ({ name: p.getName(), type: p.getType().getText() })),
  }));
  const imports = src
    .getImportDeclarations()
    .map((d) => ({ from: d.getModuleSpecifierValue(), named: d.getNamedImports().map((n) => n.getName()) }));
  const hookCalls = src
    .getDescendantsOfKind(SyntaxKind.CallExpression)
    .map((c) => c.getExpression().getText())
    .filter((n) => /^use[A-Z]/.test(n));

  const report = { components, interfaces, imports, hookCalls };
  const expected = { components: ['Hello'], interfaceName: 'HelloProps', expectsHook: 'useState' };
  const pass =
    components.includes(expected.components[0]) &&
    interfaces.some((i) => i.name === expected.interfaceName) &&
    hookCalls.includes(expected.expectsHook);

  console.log('[ts-morph-smoke] parsed sample.tsx →', JSON.stringify(report, null, 2));
  if (!pass) {
    console.error('[ts-morph-smoke] FAIL — missing expected symbol');
    process.exit(2);
  }
  console.log('[ts-morph-smoke] PASS');
  rmSync(dir, { recursive: true, force: true });
}

main().catch((err) => {
  console.error('[ts-morph-smoke] CRASH', err);
  process.exit(1);
});
