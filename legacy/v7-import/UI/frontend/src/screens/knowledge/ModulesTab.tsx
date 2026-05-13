/*** Modules tab — sidebar list + main pane (Knowledge / Gaps / Tests sub-tabs) ***/
import { useEffect, useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Eye, History, Pencil, Save, X } from 'lucide-react';
import {
  fetchModules,
  fetchModuleSummary,
  fetchKnowledgeFile,
  putKnowledge,
} from '../shared/mutations';
import MarkdownView from '../shared/MarkdownView';
import Tabs from '../../components/ui/Tabs';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import Drawer from '../../components/ui/Drawer';
import { Button, TextArea } from '../shared/Field';
import HistoryDrawer from './HistoryDrawer';
import cx from '../../lib/classnames';

type ModuleSubTab = 'knowledge' | 'gaps' | 'tests';

export default function ModulesTab() {
  const qc = useQueryClient();
  const [selected, setSelected] = useState<string | null>(null);
  const [subTab, setSubTab] = useState<ModuleSubTab>('knowledge');
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const [historyOpen, setHistoryOpen] = useState(false);

  const modulesQ = useQuery({
    queryKey: ['knowledge-modules'],
    queryFn: fetchModules,
  });

  /*** Auto-select first module on load ***/
  useEffect(() => {
    if (selected || !modulesQ.data || modulesQ.data.length === 0) return;
    setSelected(modulesQ.data[0].slug);
  }, [modulesQ.data, selected]);

  /*** Module summary -> derive a knowledge.md path under L1-abstraction ***/
  const moduleQ = useQuery({
    queryKey: ['knowledge-module', selected],
    queryFn: () => fetchModuleSummary(selected as string),
    enabled: !!selected,
  });

  const knowledgeFile = useMemo(() => {
    const files = moduleQ.data?.files ?? [];
    const candidates = files.filter(
      (f) => f.layer === 'L1-abstraction' && f.name.toLowerCase().endsWith('.md')
    );
    const knowledgeMatch = candidates.find((f) =>
      f.name.toLowerCase().includes('knowledge')
    );
    return knowledgeMatch ?? candidates[0] ?? null;
  }, [moduleQ.data]);

  const fileQ = useQuery({
    queryKey: ['knowledge-file', selected, knowledgeFile?.name],
    queryFn: () =>
      fetchKnowledgeFile(
        selected as string,
        'L1-abstraction',
        knowledgeFile?.name as string
      ),
    enabled: !!selected && !!knowledgeFile,
  });

  /*** Sync draft when file content arrives ***/
  useEffect(() => {
    if (fileQ.data?.content != null) setDraft(fileQ.data.content);
  }, [fileQ.data?.content]);

  const saveMut = useMutation({
    mutationFn: () =>
      putKnowledge(selected as string, 'L1-abstraction', knowledgeFile?.name as string, {
        content: draft,
      }),
    onMutate: async () => {
      await qc.cancelQueries({
        queryKey: ['knowledge-file', selected, knowledgeFile?.name],
      });
      const prev = qc.getQueryData<{ content: string; path: string }>([
        'knowledge-file',
        selected,
        knowledgeFile?.name,
      ]);
      qc.setQueryData(
        ['knowledge-file', selected, knowledgeFile?.name],
        (old: { content: string; path: string } | undefined) =>
          old ? { ...old, content: draft } : old
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev)
        qc.setQueryData(['knowledge-file', selected, knowledgeFile?.name], ctx.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({
        queryKey: ['knowledge-file', selected, knowledgeFile?.name],
      });
      setEditing(false);
    },
  });

  if (modulesQ.isLoading) {
    return (
      <div className="grid place-items-center p-8">
        <Spinner />
      </div>
    );
  }
  if (modulesQ.isError) {
    return (
      <EmptyState
        title="Failed to load modules"
        message="Could not reach /api/knowledge/modules"
      />
    );
  }
  if (!modulesQ.data || modulesQ.data.length === 0) {
    return (
      <EmptyState
        title="No modules detected"
        message="Brain/analysis is empty or has no L2-business / L3-technical content."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4 h-full min-h-0">
      {/*** Sidebar list ***/}
      <aside className="panel p-2 grid auto-rows-max gap-1 overflow-auto">
        {modulesQ.data.map((m) => (
          <button
            key={m.slug}
            type="button"
            onClick={() => {
              setSelected(m.slug);
              setEditing(false);
              setSubTab('knowledge');
            }}
            className={cx(
              'text-left px-3 py-2 rounded text-sm grid grid-cols-[1fr_auto] gap-2 items-center',
              selected === m.slug
                ? 'bg-falcon-blue/15 text-falcon-blue'
                : 'text-slate-300 hover:bg-brain-bg-panel'
            )}
          >
            <span className="truncate">{m.slug}</span>
            <span className="text-xs text-slate-500">{m.layer.replace(/^L\d-/, '')}</span>
          </button>
        ))}
      </aside>

      {/*** Main pane ***/}
      <section className="panel grid grid-rows-[auto_1fr] overflow-hidden min-h-0">
        <div className="grid grid-cols-[1fr_auto] items-end gap-3 px-4 pt-3 border-b border-brain-bg-border">
          <Tabs
            items={[
              { value: 'knowledge', label: 'Knowledge' },
              { value: 'gaps', label: 'Gaps' },
              { value: 'tests', label: 'Tests' },
            ]}
            value={subTab}
            onChange={(v) => setSubTab(v as ModuleSubTab)}
            className="border-b-0"
          />
          {subTab === 'knowledge' && knowledgeFile && (
            <div className="grid grid-flow-col auto-cols-max gap-2 pb-2">
              {!editing ? (
                <>
                  <Button size="sm" onClick={() => setHistoryOpen(true)}>
                    <History size={14} /> History
                  </Button>
                  <Button size="sm" variant="primary" onClick={() => setEditing(true)}>
                    <Pencil size={14} /> Edit
                  </Button>
                </>
              ) : (
                <>
                  <Button size="sm" onClick={() => setEditing(false)}>
                    <X size={14} /> Cancel
                  </Button>
                  <Button
                    size="sm"
                    variant="primary"
                    disabled={saveMut.isPending}
                    onClick={() => saveMut.mutate()}
                  >
                    <Save size={14} /> Save
                  </Button>
                </>
              )}
            </div>
          )}
        </div>

        <div className="overflow-auto p-4 min-h-0">
          {subTab === 'knowledge' && (
            <KnowledgePanel
              loading={fileQ.isLoading}
              file={knowledgeFile}
              content={fileQ.data?.content ?? ''}
              editing={editing}
              draft={draft}
              setDraft={setDraft}
            />
          )}
          {subTab === 'gaps' && selected && (
            <CrossLink
              icon={<Eye size={20} />}
              title="View module gaps"
              to={`/gaps?module=${encodeURIComponent(selected)}`}
            />
          )}
          {subTab === 'tests' && selected && (
            <CrossLink
              icon={<Eye size={20} />}
              title="View module tests"
              to={`/tests?module=${encodeURIComponent(selected)}`}
            />
          )}
        </div>
      </section>

      {selected && knowledgeFile && (
        <HistoryDrawer
          open={historyOpen}
          onClose={() => setHistoryOpen(false)}
          module={selected}
          filename={knowledgeFile.name}
          currentContent={fileQ.data?.content ?? ''}
        />
      )}

      {/*** Toast for failed save ***/}
      <Drawer
        open={saveMut.isError}
        onClose={() => saveMut.reset()}
        title="Save failed"
      >
        <p className="text-sm text-falcon-red">
          {(saveMut.error as Error | undefined)?.message ?? 'Unknown error'}
        </p>
      </Drawer>
    </div>
  );
}

interface KnowledgePanelProps {
  loading: boolean;
  file: { name: string; path: string } | null;
  content: string;
  editing: boolean;
  draft: string;
  setDraft: (v: string) => void;
}

function KnowledgePanel({
  loading,
  file,
  content,
  editing,
  draft,
  setDraft,
}: KnowledgePanelProps) {
  if (loading) {
    return (
      <div className="grid place-items-center p-8">
        <Spinner />
      </div>
    );
  }
  if (!file) {
    return (
      <EmptyState
        title="No knowledge.md detected"
        message="This module has no markdown under L1-abstraction."
      />
    );
  }
  if (!editing) {
    return <MarkdownView source={content || '_(empty)_'} />;
  }
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-[480px]">
      <TextArea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        className="min-h-[480px] text-xs"
        aria-label="Markdown source"
      />
      <div className="panel p-3 overflow-auto min-h-[480px]">
        <MarkdownView source={draft || '_(empty)_'} />
      </div>
    </div>
  );
}

function CrossLink({ icon, title, to }: { icon: React.ReactNode; title: string; to: string }) {
  return (
    <Link
      to={to}
      className="panel grid grid-cols-[24px_1fr] items-center gap-3 p-4 hover:bg-brain-bg-panel"
    >
      <span className="text-falcon-blue">{icon}</span>
      <span className="text-sm">{title}</span>
    </Link>
  );
}
