/*** GapSeverityChart - stacked bar of gap counts by severity per module ***/
/*** 5 modules x 5 severity colors via recharts ***/

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import Card from '../../components/ui/Card';
import EmptyState from '../../components/ui/EmptyState';
import { BarChart3 } from 'lucide-react';
import { SEVERITY_COLORS, type SeverityKey } from './useDashboardData';

interface RowDatum {
  module: string;
  critical: number;
  high: number;
  medium: number;
  low: number;
  info: number;
}

const ORDER: SeverityKey[] = ['critical', 'high', 'medium', 'low', 'info'];

interface Props {
  data: RowDatum[];
}

export default function GapSeverityChart({ data }: Props) {
  return (
    <Card title="Gaps by Severity per Module" className="h-full">
      {data.length === 0 ? (
        <EmptyState
          icon={<BarChart3 size={32} />}
          title="No gaps yet"
          message="Once the analyzer runs across modules, severity counts appear here."
        />
      ) : (
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="module"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                interval={0}
                angle={-15}
                textAnchor="end"
                height={50}
              />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} allowDecimals={false} />
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
              {ORDER.map((sev) => (
                <Bar
                  key={sev}
                  dataKey={sev}
                  stackId="severity"
                  fill={SEVERITY_COLORS[sev]}
                  isAnimationActive={false}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
