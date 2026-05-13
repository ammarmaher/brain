/*** StateGraph - Tailwind grid + SVG overlay for pipeline state machine ***/
/*** Past = green, current = blue/red(blocked), future = slate ***/

import { useMemo } from 'react';
import cx from '../../lib/classnames';
import {
  NODES,
  EDGES,
  classifyState,
  type PipelineState,
  type NodeStatus,
} from './stateMachine';

interface Props {
  currentState: string;
  blockers: unknown[];
}

const STATUS_CLASS: Record<NodeStatus, string> = {
  past: 'bg-falcon-green/15 border-falcon-green/60 text-falcon-green',
  current: 'bg-falcon-blue/20 border-falcon-blue text-falcon-blue ring-2 ring-falcon-blue/40',
  future: 'bg-slate-800/40 border-slate-700 text-slate-400',
  blocked: 'bg-falcon-red/20 border-falcon-red text-falcon-red ring-2 ring-falcon-red/40',
};

const COLS = 4;
const ROWS = 4;

export default function StateGraph({ currentState, blockers }: Props) {
  const grid = useMemo(() => {
    const cells: (typeof NODES)[number][][] = Array.from({ length: ROWS }, () =>
      Array.from({ length: COLS }, () => null as unknown as (typeof NODES)[number])
    );
    for (const n of NODES) cells[n.row][n.col] = n;
    return cells;
  }, []);

  return (
    <div className="grid gap-2">
      <div
        className="grid gap-3"
        style={{
          gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${ROWS}, auto)`,
        }}
      >
        {grid.flatMap((row, ri) =>
          row.map((n, ci) => {
            if (!n) return <div key={`empty-${ri}-${ci}`} />;
            const status = classifyState(currentState, blockers, n.id as PipelineState);
            return (
              <div
                key={n.id}
                className={cx(
                  'grid place-items-center min-h-[64px] px-3 py-2 rounded-lg border text-center text-xs font-medium',
                  STATUS_CLASS[status]
                )}
                aria-current={status === 'current' ? 'step' : undefined}
              >
                <span>{n.label}</span>
              </div>
            );
          })
        )}
      </div>
      {/*** Edge legend (text-only since SVG over a grid is fragile w/ resize) ***/}
      <div className="grid grid-flow-col auto-cols-max gap-3 text-[10px] text-slate-400 pt-1 border-t border-brain-bg-border/50 mt-2">
        <span>
          flow: {EDGES.filter((e) => !e.branch).length} forward edges,{' '}
          {EDGES.filter((e) => e.branch).length} branch edges (qa_failed = coding)
        </span>
      </div>
    </div>
  );
}
