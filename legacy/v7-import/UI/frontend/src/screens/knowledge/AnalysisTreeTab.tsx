/*** Analysis Tree tab — file tree + preview pane ***/
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown, ChevronRight, Download, FileText } from 'lucide-react';
import api from '../../api/client';
import { fetchKnowledgeFiles } from '../shared/mutations';
import MarkdownView from '../shared/MarkdownView';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import cx from '../../lib/classnames';

interface FileEntry {
  layer: string;
  path: string;
  name: string;
  rel: string;
}

interface TreeNode {
  name: string;
  fullRel: string;
  isDir: boolean;
  children: Map<string, TreeNode>;
  file?: FileEntry;
}

function buildTree(files: FileEntry[]): TreeNode {
  const root: TreeNode = {
    name: 'analysis',
    fullRel: '',
    isDir: true,
    children: new Map(),
  };
  for (const f of files) {
    const parts = f.rel.split('/');
    let node = root;
    for (let i = 0; i < parts.length; i++) {
      const seg = parts[i];
      const isLeaf = i === parts.length - 1;
      let child = node.children.get(seg);
      if (!child) {
        child = {
          name: seg,
          fullRel: parts.slice(0, i + 1).join('/'),
          isDir: !isLeaf,
          children: new Map(),
        };
        if (isLeaf) child.file = f;
        node.children.set(seg, child);
      }
      node = child;
    }
  }
  return root;
}

export default function AnalysisTreeTab() {
  const filesQ = useQuery({
    queryKey: ['knowledge-files'],
    queryFn: () => fetchKnowledgeFiles(),
  });

  const tree = useMemo(() => (filesQ.data ? buildTree(filesQ.data) : null), [filesQ.data]);
  const [openPaths, setOpenPaths] = useState<Set<string>>(
    () => new Set(['L0-summary', 'L1-abstraction', 'L2-business', 'L3-technical'])
  );
  const [selected, setSelected] = useState<FileEntry | null>(null);

  function toggle(path: string) {
    setOpenPaths((s) => {
      const n = new Set(s);
      if (n.has(path)) n.delete(path);
      else n.add(path);
      return n;
    });
  }

  if (filesQ.isLoading) {
    return (
      <div className="grid place-items-center p-8">
        <Spinner />
      </div>
    );
  }
  if (filesQ.isError || !tree) {
    return (
      <EmptyState
        title="Failed to load file tree"
        message="Could not reach /api/knowledge/files"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4 h-full min-h-0">
      <aside className="panel p-2 overflow-auto text-sm">
        <TreeBranch
          node={tree}
          depth={0}
          openPaths={openPaths}
          onToggle={toggle}
          onSelect={setSelected}
          selectedPath={selected?.path}
        />
      </aside>
      <section className="panel p-3 overflow-auto min-h-0">
        {selected ? (
          <FilePreview file={selected} />
        ) : (
          <EmptyState
            icon={<FileText size={32} />}
            title="Pick a file"
            message="Click any leaf in the tree to preview it here."
          />
        )}
      </section>
    </div>
  );
}

interface BranchProps {
  node: TreeNode;
  depth: number;
  openPaths: Set<string>;
  onToggle: (p: string) => void;
  onSelect: (f: FileEntry) => void;
  selectedPath?: string;
}

function TreeBranch({
  node,
  depth,
  openPaths,
  onToggle,
  onSelect,
  selectedPath,
}: BranchProps) {
  const children = Array.from(node.children.values()).sort((a, b) => {
    if (a.isDir !== b.isDir) return a.isDir ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
  return (
    <ul className="grid">
      {children.map((c) => {
        const isOpen = openPaths.has(c.fullRel);
        const isLeaf = !c.isDir;
        const isSelected = isLeaf && c.file?.path === selectedPath;
        return (
          <li key={c.fullRel}>
            <button
              type="button"
              onClick={() => (isLeaf ? c.file && onSelect(c.file) : onToggle(c.fullRel))}
              className={cx(
                'w-full grid grid-cols-[16px_1fr] gap-1 items-center px-1 py-0.5 rounded text-left',
                isSelected
                  ? 'bg-falcon-blue/15 text-falcon-blue'
                  : 'hover:bg-brain-bg-panel text-slate-300'
              )}
              style={{ paddingLeft: `${depth * 12}px` }}
            >
              <span>
                {c.isDir ? (
                  isOpen ? (
                    <ChevronDown size={14} />
                  ) : (
                    <ChevronRight size={14} />
                  )
                ) : (
                  <FileText size={12} className="text-slate-500" />
                )}
              </span>
              <span className="truncate text-xs">{c.name}</span>
            </button>
            {c.isDir && isOpen && (
              <TreeBranch
                node={c}
                depth={depth + 1}
                openPaths={openPaths}
                onToggle={onToggle}
                onSelect={onSelect}
                selectedPath={selectedPath}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
}

function FilePreview({ file }: { file: FileEntry }) {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  const isMd = ext === 'md';
  const isJson = ext === 'json';
  const isCsv = ext === 'csv';

  const previewQ = useQuery({
    queryKey: ['knowledge-preview', file.path],
    queryFn: async () => {
      /*** Use admin/knowledge for content; falls back to a path-based read of the rel ***/
      const parts = file.rel.split('/');
      if (parts.length >= 3) {
        const layer = parts[0];
        const module = parts[1];
        const filename = parts.slice(2).join('/');
        if (filename.includes('/')) {
          /*** nested files don't fit admin route; refuse and show metadata ***/
          return { content: null as string | null };
        }
        try {
          const r = await api.get<{ content: string }>(
            `/api/admin/knowledge/${encodeURIComponent(module)}/${encodeURIComponent(layer)}/${encodeURIComponent(filename)}`
          );
          return { content: r.data.content };
        } catch {
          return { content: null };
        }
      }
      return { content: null };
    },
  });

  const downloadHref = `/api/reports/${encodeURIComponent(file.rel)}`;

  return (
    <div className="grid gap-3">
      <header className="grid grid-cols-[1fr_auto] items-center gap-3 border-b border-brain-bg-border pb-2">
        <div className="grid">
          <h4 className="text-sm font-semibold truncate">{file.name}</h4>
          <span className="text-xs font-mono text-slate-500 truncate">{file.rel}</span>
        </div>
        <a
          href={downloadHref}
          download={file.name}
          className="inline-grid grid-flow-col auto-cols-max items-center gap-1 px-2 py-1 text-xs rounded border border-brain-bg-border text-slate-300 hover:bg-brain-bg-panel"
        >
          <Download size={12} /> Download
        </a>
      </header>

      {previewQ.isLoading && <Spinner size={20} />}
      {previewQ.data?.content == null && !previewQ.isLoading && (
        <EmptyState
          icon={<FileText size={28} />}
          title="Preview not available"
          message="This file lives outside the editable tree; use Download instead."
        />
      )}
      {previewQ.data?.content != null && isMd && (
        <MarkdownView source={previewQ.data.content} />
      )}
      {previewQ.data?.content != null && isJson && (
        <pre className="panel p-3 text-xs font-mono overflow-auto whitespace-pre-wrap">
          {tryFormatJson(previewQ.data.content)}
        </pre>
      )}
      {previewQ.data?.content != null && isCsv && (
        <CsvTable raw={previewQ.data.content} />
      )}
      {previewQ.data?.content != null && !isMd && !isJson && !isCsv && (
        <pre className="panel p-3 text-xs font-mono overflow-auto whitespace-pre-wrap">
          {previewQ.data.content}
        </pre>
      )}
    </div>
  );
}

function tryFormatJson(raw: string): string {
  try {
    return JSON.stringify(JSON.parse(raw), null, 2);
  } catch {
    return raw;
  }
}

function CsvTable({ raw }: { raw: string }) {
  const rows = raw
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => parseCsvLine(line));
  if (rows.length === 0) return <span className="text-slate-500 text-sm">empty</span>;
  const [head, ...body] = rows;
  return (
    <div className="panel overflow-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-brain-bg-panel">
            {head.map((h, i) => (
              <th
                key={i}
                className="px-2 py-1 text-left font-semibold border-b border-brain-bg-border"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((r, i) => (
            <tr key={i} className="hover:bg-brain-bg-panel/50">
              {r.map((c, j) => (
                <td key={j} className="px-2 py-1 border-b border-brain-bg-border/40 truncate max-w-xs">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = '';
  let q = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (q) {
      if (ch === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (ch === '"') {
        q = false;
      } else cur += ch;
    } else {
      if (ch === ',') {
        out.push(cur);
        cur = '';
      } else if (ch === '"') q = true;
      else cur += ch;
    }
  }
  out.push(cur);
  return out;
}
