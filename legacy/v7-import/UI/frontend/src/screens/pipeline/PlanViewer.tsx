/*** PlanViewer - tabbed L1/L2/L3 markdown viewer; uses marked when available ***/

import { useEffect, useMemo, useState } from 'react';
import { marked } from 'marked';
import { useQueries } from '@tanstack/react-query';
import api from '../../api/client';
import Card from '../../components/ui/Card';
import Tabs from '../../components/ui/Tabs';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import { FileText } from 'lucide-react';

interface Props {
  taskId: string;
}

interface PlanLayer {
  taskId: string;
  layer: string;
  path: string;
  content: string;
}

const LAYERS = ['L1', 'L2', 'L3'] as const;

async function fetchPlan(taskId: string, layer: string): Promise<PlanLayer | null> {
  try {
    const r = await api.get<PlanLayer>(`/api/tasks/${taskId}/plan/${layer}`);
    return r.data;
  } catch (err: unknown) {
    const status = (err as { response?: { status?: number } }).response?.status;
    if (status === 404) return null;
    throw err;
  }
}

export default function PlanViewer({ taskId }: Props) {
  const [active, setActive] = useState<(typeof LAYERS)[number]>('L1');

  const queries = useQueries({
    queries: LAYERS.map((l) => ({
      queryKey: ['task', taskId, 'plan', l],
      queryFn: () => fetchPlan(taskId, l),
      enabled: !!taskId,
    })),
  });

  const items = LAYERS.map((l, i) => ({
    value: l,
    label: `${l} plan`,
    badge: queries[i].data ? null : queries[i].isLoading ? '...' : 'empty',
  }));

  const idx = LAYERS.indexOf(active);
  const layer = queries[idx];

  /*** marked is sync; configure once via useEffect ***/
  useEffect(() => {
    marked.setOptions({ breaks: true, gfm: true });
  }, []);

  const html = useMemo(() => {
    const text = layer?.data?.content;
    if (!text) return '';
    try {
      return marked.parse(text) as string;
    } catch {
      return '';
    }
  }, [layer?.data?.content]);

  return (
    <Card title="Plan Layers">
      <Tabs items={items} value={active} onChange={(v) => setActive(v as 'L1' | 'L2' | 'L3')} />
      <div className="pt-3">
        {layer.isLoading ? (
          <div className="grid place-items-center p-6">
            <Spinner />
          </div>
        ) : !layer.data ? (
          <EmptyState
            icon={<FileText size={32} />}
            title={`${active} plan not yet drafted`}
            message={`No plan-l${active.toLowerCase().slice(1)}.md found for this task.`}
          />
        ) : html ? (
          <article
            className="prose prose-invert prose-sm max-w-none text-slate-200 [&_h1]:text-slate-100 [&_h2]:text-slate-100 [&_h3]:text-slate-100 [&_a]:text-falcon-blue [&_code]:bg-brain-bg-panel [&_code]:px-1 [&_code]:rounded [&_pre]:bg-brain-bg-panel [&_pre]:p-3 [&_pre]:rounded [&_pre]:overflow-auto [&_table]:text-xs"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <pre className="text-xs whitespace-pre-wrap text-slate-300 max-h-[420px] overflow-auto bg-brain-bg-panel p-3 rounded">
            {layer.data.content}
          </pre>
        )}
      </div>
    </Card>
  );
}
