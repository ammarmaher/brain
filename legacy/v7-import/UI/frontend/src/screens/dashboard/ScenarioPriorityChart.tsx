/*** ScenarioPriorityChart - pie of P0/P1/P2/P3 distribution ***/

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import Card from '../../components/ui/Card';
import EmptyState from '../../components/ui/EmptyState';
import { PieChart as PieIcon } from 'lucide-react';
import { PRIORITY_COLORS } from './useDashboardData';

interface Slice {
  name: string;
  value: number;
}

interface Props {
  data: Slice[];
}

export default function ScenarioPriorityChart({ data }: Props) {
  return (
    <Card title="Scenarios by Priority" className="h-full">
      {data.length === 0 ? (
        <EmptyState
          icon={<PieIcon size={32} />}
          title="No scenarios yet"
          message="Test cases tagged with P0/P1/P2/P3 will populate this chart."
        />
      ) : (
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                outerRadius={90}
                label={(d: { name: string; value: number }) => `${d.name} (${d.value})`}
                isAnimationActive={false}
              >
                {data.map((s) => (
                  <Cell
                    key={s.name}
                    fill={PRIORITY_COLORS[s.name] ?? PRIORITY_COLORS.unknown}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#111827',
                  border: '1px solid #374151',
                  borderRadius: 6,
                  color: '#e2e8f0',
                  fontSize: 12,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
