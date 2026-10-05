import React from 'react';
import { Info } from 'lucide-react';

interface MapLegendProps {
  className?: string;
  isDemo?: boolean;
}

export const MapLegend: React.FC<MapLegendProps> = ({ className = '', isDemo = true }) => {
  const legendItems = [
    { label: 'Urban Expansion (Built-up)', color: '#16A765', border: '#087D4A', description: 'Impervious structural expansion' },
    { label: 'Vegetation Loss / Clearing', color: '#E45B5B', border: '#C0392B', description: 'Canopy depletion & land clearance' },
    { label: 'Water / Shoreline Shift', color: '#5B9DE8', border: '#3A82D2', description: 'Intertidal shift & reclamation' },
    { label: 'Area of Interest (AOI)', color: 'transparent', border: '#16A765', isDashed: true, description: 'Evaluation boundary polygon' },
  ];

  return (
    <div className={`bg-white/95 backdrop-blur-sm border border-[#E9EBEF] rounded-lg p-3 shadow-geo text-xs max-w-xs ${className}`}>
      <div className="flex items-center justify-between pb-2 border-b border-[#E9EBEF] mb-2">
        <div className="flex items-center gap-1.5 text-[#17191D] font-semibold text-xs">
          <Info className="w-3.5 h-3.5 text-[#777D87]" />
          <span>Change Legend</span>
        </div>
        {isDemo && (
          <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#F3F4F6] text-[#777D87] font-mono">
            Demo
          </span>
        )}
      </div>

      <div className="space-y-1.5">
        {legendItems.map((item, idx) => (
          <div key={idx} className="flex items-start gap-2">
            <span
              className={`w-3.5 h-3.5 rounded mt-0.5 flex-shrink-0 ${item.isDashed ? 'border-2 border-dashed' : 'border'}`}
              style={{
                backgroundColor: item.color,
                borderColor: item.border,
              }}
            />
            <div className="min-w-0">
              <div className="text-[11px] font-medium text-[#17191D] leading-tight">
                {item.label}
              </div>
              <div className="text-[10px] text-[#777D87] truncate">
                {item.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
