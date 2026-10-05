import React, { useState } from 'react';
import { 
  History, 
  Calendar, 
  MapPin
} from 'lucide-react';
import { UrbanGrowthChart } from '../components/charts/UrbanGrowthChart';
import { VegetationChart } from '../components/charts/VegetationChart';
import { HistoricalTimelineChart } from '../components/charts/HistoricalTimelineChart';
import { HISTORICAL_CHRONO_DATA, LOCATION_PRESETS } from '../data/demoData';

export const HistoricalAnalysis: React.FC = () => {
  const [selectedLocId, setSelectedLocId] = useState('mumbai');
  const [activeTimelineYear, setActiveTimelineYear] = useState<number>(2025);

  const selectedLoc = LOCATION_PRESETS.find(p => p.id === selectedLocId) || LOCATION_PRESETS[0];

  const years = [2015, 2017, 2019, 2021, 2023, 2025];
  const activeDataPoint = HISTORICAL_CHRONO_DATA.find(d => d.year === activeTimelineYear) || HISTORICAL_CHRONO_DATA[HISTORICAL_CHRONO_DATA.length - 1];

  return (
    <div className="space-y-4 pb-10 max-w-7xl mx-auto">
      {/* Top Filter & Header */}
      <div className="bg-white border border-[#E9EBEF] rounded-xl p-4 shadow-geo flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#EAF8F0] border border-[#16A765]/20 flex items-center justify-center text-[#16A765]">
              <History className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-semibold text-[#17191D] tracking-tight">
              Historical Change Trajectory
            </h2>
          </div>
          <p className="text-xs text-[#777D87] mt-0.5">
            Examine multi-temporal satellite passes and cumulative land alteration.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-[#F7F8FA] border border-[#E9EBEF] rounded-lg px-2.5 py-1.5 text-xs text-[#17191D]">
            <MapPin className="w-3.5 h-3.5 text-[#16A765]" />
            <select
              value={selectedLocId}
              onChange={(e) => setSelectedLocId(e.target.value)}
              className="bg-transparent text-[#17191D] focus:outline-none cursor-pointer"
            >
              {LOCATION_PRESETS.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>

          <span className="text-[10px] px-2 py-1 rounded bg-[#F3F4F6] text-[#777D87] font-mono">
            Demo Chronology
          </span>
        </div>
      </div>

      {/* Interactive Timeline Stepper */}
      <div className="bg-white border border-[#E9EBEF] rounded-xl p-5 shadow-geo space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#17191D] flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#16A765]" />
            Multi-Pass Epoch Stepper
          </span>
          <span className="text-xs text-[#087D4A] font-medium">
            Baseline: 2015 → Selected: {activeTimelineYear}
          </span>
        </div>

        {/* Timeline Bar */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {years.map((year, idx) => {
            const isSelected = activeTimelineYear === year;
            return (
              <button
                key={year}
                onClick={() => setActiveTimelineYear(year)}
                className={`flex flex-col items-center p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#EAF8F0] border-[#16A765] text-[#17191D] shadow-xs'
                    : 'bg-[#F7F8FA] border-[#E9EBEF] text-[#777D87] hover:bg-white hover:border-[#D8DCE3]'
                }`}
              >
                <span className={`text-[10px] font-medium ${isSelected ? 'text-[#087D4A]' : 'text-[#A0A5AE]'}`}>
                  Epoch #{idx + 1}
                </span>
                <span className="text-sm font-bold text-[#17191D] mt-0.5">{year}</span>
                <span className={`text-[10px] ${isSelected ? 'text-[#087D4A] font-medium' : 'text-[#A0A5AE]'}`}>
                  {idx === 0 ? 'Baseline' : `+${(year - 2015)} yrs`}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Period Summary Card */}
        <div className="p-3.5 rounded-lg bg-[#F7F8FA] border border-[#E9EBEF] grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-[#777D87] text-[10px] block">Cumulative Area Altered</span>
            <span className="text-base font-bold text-[#17191D]">{activeDataPoint.totalChangedAreaKm2} km²</span>
          </div>
          <div>
            <span className="text-[#777D87] text-[10px] block">Built-up Footprint</span>
            <span className="text-base font-bold text-[#087D4A]">{activeDataPoint.urbanExpansionKm2} km²</span>
          </div>
          <div>
            <span className="text-[#777D87] text-[10px] block">Vegetation Canopy</span>
            <span className="text-base font-bold text-[#E45B5B]">{activeDataPoint.vegetationCoverKm2} km²</span>
          </div>
          <div>
            <span className="text-[#777D87] text-[10px] block">Confidence Margin</span>
            <span className="text-base font-bold text-[#17191D]">{(activeDataPoint.confidence * 100).toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <UrbanGrowthChart data={HISTORICAL_CHRONO_DATA} isDemo={true} />
        <VegetationChart data={HISTORICAL_CHRONO_DATA} isDemo={true} />
      </div>

      <div className="w-full">
        <HistoricalTimelineChart data={HISTORICAL_CHRONO_DATA} isDemo={true} />
      </div>
    </div>
  );
};
