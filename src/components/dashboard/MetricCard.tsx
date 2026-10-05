import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: string;
  isPositiveChange?: boolean;
  icon: LucideIcon;
  colorVariant?: 'green' | 'red' | 'blue' | 'default';
  isDemo?: boolean;
  subtitle?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  change,
  isPositiveChange,
  icon: Icon,
  colorVariant = 'default',
  isDemo = true,
  subtitle,
}) => {
  const getIconStyles = () => {
    switch (colorVariant) {
      case 'green':
        return 'text-[#16A765] bg-[#EAF8F0]';
      case 'red':
        return 'text-[#E45B5B] bg-[#FDEDED]';
      case 'blue':
        return 'text-[#5B9DE8] bg-[#EEF5FC]';
      default:
        return 'text-[#16A765] bg-[#EAF8F0]';
    }
  };

  return (
    <div className="bg-white border border-[#E9EBEF] rounded-xl p-4 transition-all duration-200 shadow-geo hover:border-[#D8DCE3]">
      {/* Top row: Title, Demo tag, Icon */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-[#777D87]">
              {title}
            </span>
            {isDemo && (
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#F3F4F6] text-[#777D87] font-mono" title="Simulated sample metric">
                Demo
              </span>
            )}
          </div>
        </div>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${getIconStyles()}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      {/* Main value display */}
      <div className="mt-2.5 flex items-baseline gap-1">
        <span className="text-[26px] font-bold tracking-tight text-[#17191D]">
          {value}
        </span>
        {unit && (
          <span className="text-xs font-medium text-[#777D87]">
            {unit}
          </span>
        )}
      </div>

      {/* Footer / Trend Indicator */}
      <div className="mt-2 flex items-center justify-between text-xs pt-2 border-t border-[#F3F4F6]">
        {change && (
          <span
            className={`flex items-center gap-1 font-medium text-[11px] ${
              isPositiveChange ? 'text-[#087D4A]' : 'text-[#E45B5B]'
            }`}
          >
            <span>{isPositiveChange ? '▲' : '▼'}</span>
            <span>{change}</span>
          </span>
        )}
        {subtitle && (
          <span className="text-[11px] text-[#A0A5AE] truncate ml-auto" title={subtitle}>
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};
