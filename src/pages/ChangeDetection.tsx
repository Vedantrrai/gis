import React, { useState } from 'react';
import { 
  Layers, 
  MapPin, 
  Calendar, 
  Database, 
  Play, 
  Info, 
  Sliders
} from 'lucide-react';
import { BeforeAfterSlider } from '../components/maps/BeforeAfterSlider';
import { AnalysisResponse, AnalysisRequest, SatelliteDataset } from '../types/analysis';
import { LOCATION_PRESETS } from '../data/demoData';

interface ChangeDetectionProps {
  currentAnalysis: AnalysisResponse;
  onRunAnalysis: (req: AnalysisRequest) => void;
  isLoading: boolean;
  demoMode: boolean;
}

export const ChangeDetection: React.FC<ChangeDetectionProps> = ({
  currentAnalysis,
  onRunAnalysis,
  isLoading,
  demoMode,
}) => {
  const [selectedLocId, setSelectedLocId] = useState('mumbai');
  const [beforeYear, setBeforeYear] = useState<number>(currentAnalysis.before_year || 2015);
  const [afterYear, setAfterYear] = useState<number>(currentAnalysis.after_year || 2025);
  const [dataset, setDataset] = useState<SatelliteDataset>(currentAnalysis.dataset || 'sentinel-2');
  const [mode, setMode] = useState<'swipe' | 'split'>('swipe');
  const [opacity, setOpacity] = useState<number>(0.8);
  const [overlayVisible, setOverlayVisible] = useState<boolean>(true);

  const selectedLoc = LOCATION_PRESETS.find(p => p.id === selectedLocId) || LOCATION_PRESETS[0];

  const handleRun = (e: React.FormEvent) => {
    e.preventDefault();
    onRunAnalysis({
      location: selectedLoc.name,
      before_year: beforeYear,
      after_year: afterYear,
      dataset,
      area_of_interest: null,
    });
  };

  return (
    <div className="space-y-4 pb-10 max-w-7xl mx-auto">
      {/* Top Controls */}
      <div className="bg-white border border-[#E9EBEF] rounded-xl p-3.5 shadow-geo">
        <form onSubmit={handleRun} className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Region */}
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

            {/* Before Year */}
            <div className="flex items-center gap-1.5 bg-[#F7F8FA] border border-[#E9EBEF] rounded-lg px-2.5 py-1.5 text-xs text-[#17191D]">
              <Calendar className="w-3.5 h-3.5 text-[#5B9DE8]" />
              <span className="text-[#777D87]">Before:</span>
              <select
                value={beforeYear}
                onChange={(e) => setBeforeYear(Number(e.target.value))}
                className="bg-transparent text-[#17191D] focus:outline-none cursor-pointer"
              >
                {[2015, 2016, 2017, 2018, 2019, 2020].map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>

            {/* After Year */}
            <div className="flex items-center gap-1.5 bg-[#F7F8FA] border border-[#E9EBEF] rounded-lg px-2.5 py-1.5 text-xs text-[#17191D]">
              <Calendar className="w-3.5 h-3.5 text-[#16A765]" />
              <span className="text-[#777D87]">After:</span>
              <select
                value={afterYear}
                onChange={(e) => setAfterYear(Number(e.target.value))}
                className="bg-transparent text-[#17191D] focus:outline-none cursor-pointer"
              >
                {[2021, 2022, 2023, 2024, 2025, 2026].map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>

            {/* Dataset */}
            <div className="flex items-center gap-1.5 bg-[#F7F8FA] border border-[#E9EBEF] rounded-lg px-2.5 py-1.5 text-xs text-[#17191D]">
              <Database className="w-3.5 h-3.5 text-[#777D87]" />
              <select
                value={dataset}
                onChange={(e) => setDataset(e.target.value as SatelliteDataset)}
                className="bg-transparent text-[#17191D] focus:outline-none cursor-pointer"
              >
                <option value="sentinel-2">Sentinel-2 (10m)</option>
                <option value="landsat-8">Landsat-8 (30m)</option>
                <option value="planetscope">PlanetScope (3m)</option>
              </select>
            </div>
          </div>

          {/* Update Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="px-3.5 py-1.5 rounded-lg bg-[#16A765] hover:bg-[#087D4A] text-white font-medium text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            id="run-analysis-workspace-btn"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Update Comparison</span>
          </button>
        </form>
      </div>

      {/* Main Grid: Comparison Viewer (Left) + Analytics Side Panel (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Main Comparison Canvas (8 Columns) */}
        <div className="lg:col-span-8 flex flex-col gap-3">
          <BeforeAfterSlider
            beforeYear={beforeYear}
            afterYear={afterYear}
            locationName={selectedLoc.name}
            analysis={currentAnalysis}
            opacity={opacity}
            mode={mode}
            setMode={setMode}
            overlayVisible={overlayVisible}
            setOverlayVisible={setOverlayVisible}
          />

          {/* Opacity Bar */}
          <div className="bg-white border border-[#E9EBEF] rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs shadow-geo">
            <div className="flex items-center gap-3">
              <span className="text-[#777D87] flex items-center gap-1.5 font-medium">
                <Sliders className="w-3.5 h-3.5 text-[#16A765]" />
                Overlay Opacity:
              </span>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={opacity}
                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                className="w-32 h-1 bg-[#E9EBEF] rounded-lg appearance-none cursor-pointer accent-[#16A765]"
              />
              <span className="font-mono text-[#17191D] font-medium">{Math.round(opacity * 100)}%</span>
            </div>

            {/* Quick Legend */}
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1.5 text-[#17191D]">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#16A765]"></span> Urban
              </span>
              <span className="flex items-center gap-1.5 text-[#17191D]">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#E45B5B]"></span> Veg Loss
              </span>
              <span className="flex items-center gap-1.5 text-[#17191D]">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#5B9DE8]"></span> Water
              </span>
            </div>
          </div>
        </div>

        {/* Intelligence Side Panel (4 Columns) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white border border-[#E9EBEF] rounded-xl p-4 shadow-geo space-y-3.5">
            <div className="flex items-center justify-between border-b border-[#E9EBEF] pb-2.5">
              <h3 className="text-sm font-semibold text-[#17191D] tracking-tight flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#16A765]" />
                Change Statistics
              </h3>
              {currentAnalysis.is_demo && (
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#F3F4F6] text-[#777D87] font-mono">
                  Sample Data
                </span>
              )}
            </div>

            {/* Metrics summary list */}
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-lg bg-[#F7F8FA] border border-[#E9EBEF] flex items-center justify-between">
                <div>
                  <span className="text-[#777D87] text-[11px] block">Total Area Changed</span>
                  <span className="text-lg font-bold text-[#17191D]">{currentAnalysis.changed_area_km2} km²</span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded bg-[#EAF8F0] text-[#087D4A] font-medium">
                  {((currentAnalysis.changed_area_km2 / 120) * 100).toFixed(1)}% of AOI
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-lg bg-[#F7F8FA] border border-[#E9EBEF]">
                  <span className="text-[#777D87] text-[10px] block">Urban Expansion</span>
                  <span className="text-sm font-semibold text-[#087D4A]">+{currentAnalysis.urban_change_percent}%</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#F7F8FA] border border-[#E9EBEF]">
                  <span className="text-[#777D87] text-[10px] block">Vegetation Loss</span>
                  <span className="text-sm font-semibold text-[#E45B5B]">{currentAnalysis.vegetation_loss_km2} km²</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#F7F8FA] border border-[#E9EBEF] flex items-center justify-between">
                <div>
                  <span className="text-[#777D87] text-[10px] block">Model Confidence</span>
                  <span className="text-sm font-semibold text-[#17191D]">
                    {(currentAnalysis.confidence * 100).toFixed(1)}%
                  </span>
                </div>
                <span className="text-[10px] text-[#A0A5AE]">
                  Latent Margin
                </span>
              </div>
            </div>

            {/* Breakdown by Category */}
            <div className="pt-2 border-t border-[#E9EBEF]">
              <h4 className="text-xs font-semibold text-[#17191D] mb-2">
                Spectral Classification
              </h4>
              <div className="space-y-2">
                {(currentAnalysis.categories || []).map((cat, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#17191D] flex items-center gap-1.5 font-medium">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }}></span>
                        {cat.label}
                      </span>
                      <span className="text-[#777D87] text-[11px] font-mono">{cat.areaKm2} km² ({cat.percentage}%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full" 
                        style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Methodology Note */}
            <div className="p-2.5 rounded-lg bg-[#F7F8FA] border border-[#E9EBEF] text-[11px] text-[#777D87] space-y-0.5">
              <div className="font-semibold text-[#17191D] flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-[#16A765]" />
                Inference Methodology
              </div>
              <p className="leading-relaxed">
                Bi-temporal registration performed with sub-pixel spatial warping. Self-supervised latents evaluated for feature distance anomaly score.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
