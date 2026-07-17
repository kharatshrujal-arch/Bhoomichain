import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export interface AggregationDonutProps {
  percentage: number;
}

export function AggregationDonut({ percentage }: AggregationDonutProps): React.JSX.Element {
  // Cap percentage to 100
  const normalizedPct = Math.min(Math.max(percentage, 0), 100);
  
  const data = [
    { name: 'Acquired', value: normalizedPct },
    { name: 'Remaining', value: 100 - normalizedPct },
  ];

  return (
    <div className="relative w-44 h-44 mx-auto">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            isAnimationActive={false}
          >
            <Cell fill="#1b4332" /> {/* primary-container */}
            <Cell fill="#edeeef" /> {/* surface-container */}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="font-sans font-bold text-headline text-on-surface">
          {normalizedPct}%
        </span>
        <span className="font-label text-label-sm uppercase tracking-wider text-outline">
          Acquired
        </span>
      </div>
    </div>
  );
}
