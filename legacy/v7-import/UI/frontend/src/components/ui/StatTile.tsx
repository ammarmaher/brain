/*** StatTile - large number + label + delta + tiny sparkline ***/
import { ResponsiveContainer, LineChart, Line } from 'recharts';
import { ArrowDown, ArrowUp, Minus } from 'lucide-react';
import cx from '../../lib/classnames';

interface StatTileProps {
  label: string;
  value: string | number;
  delta?: number;
  trend?: number[];
  className?: string;
}

export default function StatTile({
  label,
  value,
  delta,
  trend,
  className,
}: StatTileProps) {
  const data = (trend ?? []).map((v, i) => ({ i, v }));
  const direction =
    delta == null ? 'flat' : delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat';

  return (
    <div
      className={cx(
        'panel grid grid-rows-[auto_1fr_auto] gap-2 p-4',
        className
      )}
    >
      <div className="text-xs uppercase tracking-wide text-slate-400">
        {label}
      </div>
      <div className="grid grid-cols-[1fr_auto] items-end gap-2">
        <div className="text-3xl font-semibold text-slate-50">{value}</div>
        {delta != null && (
          <div
            className={cx(
              'text-xs grid grid-cols-[16px_1fr] items-center gap-1',
              direction === 'up' && 'text-falcon-green',
              direction === 'down' && 'text-falcon-red',
              direction === 'flat' && 'text-slate-400'
            )}
          >
            {direction === 'up' && <ArrowUp size={14} />}
            {direction === 'down' && <ArrowDown size={14} />}
            {direction === 'flat' && <Minus size={14} />}
            <span>
              {delta > 0 ? '+' : ''}
              {delta}
            </span>
          </div>
        )}
      </div>
      <div className="h-10">
        {data.length > 1 && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <Line
                type="monotone"
                dataKey="v"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
