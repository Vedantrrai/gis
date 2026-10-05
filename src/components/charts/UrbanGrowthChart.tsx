import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { HistoricalDataPoint } from '../../types/analysis';

interface UrbanGrowthChartProps {
  data: HistoricalDataPoint[];
  isDemo?: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#E9EBEF] p-2.5 rounded-lg shadow-geo text-xs">
        <div className="text-[#17191D] font-semibold mb-0.5">Year {label}</div>
        <div className="text-[#087D4A] flex items-center justify-between gap-3 font-medium">
          <span>Built-up Area:</span>
          <strong>{payload[0].value} km²</strong>
        </div>
      </div>
    );
  }
  return null;
};

export const UrbanGrowthChart: React.FC<UrbanGrowthChartProps> = ({ data, isDemo = true }) => {
  return (
    <div className="bg-white border border-[#E9EBEF] rounded-xl p-5 shadow-geo">
      <div className="flex items-center justify-between pb-3 border-b border-[#E9EBEF] mb-4">
        <div>
          <h3 className="text-sm font-semibold text-[#17191D] tracking-tight">
            Urban Impervious Surface Growth
          </h3>
          <p className="text-xs text-[#777D87] mt-0.5">
            Built-up footprint expansion across monitoring epochs.
          </p>
        </div>
        {isDemo && (
          <span className="text-[10px] px-2 py-0.5 rounded bg-[#F3F4F6] text-[#777D87] font-mono">
            Demo Data
          </span>
        )}
      </div>

      <div className="h-60 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="urbanGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16A765" stopOpacity={0.18} />
                <stop offset="95%" stopColor="#16A765" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
            <XAxis 
              dataKey="year" 
              stroke="#A0A5AE" 
              fontSize={11} 
              tickLine={false}
              axisLine={{ stroke: '#E9EBEF' }}
            />
            <YAxis 
              stroke="#A0A5AE" 
              fontSize={11} 
              tickLine={false}
              axisLine={false}
              unit=" km²"
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="urbanExpansionKm2" 
              stroke="#16A765" 
              strokeWidth={2} 
              fillOpacity={1} 
              fill="url(#urbanGrad)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
