import React, { useState } from 'react';
import { Layers, Sliders, ChevronDown, ChevronUp } from 'lucide-react';
import { MapLayerVisibility } from '../../types/gis';
import { TILE_PROVIDERS } from '../../data/demoData';

interface LayerControlProps {
  visibility: MapLayerVisibility;
  onToggleLayer: (layerKey: keyof MapLayerVisibility) => void;
  selectedBasemapId: string;
  onSelectBasemap: (basemapId: string) => void;
  opacity: number;
  onChangeOpacity: (val: number) => void;
  className?: string;
}

export const LayerControl: React.FC<LayerControlProps> = ({
  visibility,
  onToggleLayer,
  selectedBasemapId,
  onSelectBasemap,
  opacity,
  onChangeOpacity,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className={`bg-white/95 backdrop-blur-sm border border-[#E9EBEF] rounded-lg shadow-geo text-xs overflow-hidden transition-all ${className}`}>
      {/* Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-2.5 border-b border-[#E9EBEF] hover:bg-[#F7F8FA] transition-colors text-left"
        id="toggle-layer-panel"
      >
        <div className="flex items-center gap-1.5 text-[#17191D] font-semibold text-xs">
          <Layers className="w-3.5 h-3.5 text-[#16A765]" />
          <span>Layer Control</span>
        </div>
        {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-[#777D87]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#777D87]" />}
      </button>

      {isExpanded && (
        <div className="p-3 space-y-3">
          {/* Basemap Selection */}
          <div>
            <span className="text-[10px] font-medium uppercase text-[#777D87] tracking-wider block mb-1">
              Basemap Tile Provider
            </span>
            <select
              value={selectedBasemapId}
              onChange={(e) => onSelectBasemap(e.target.value)}
              className="w-full bg-white border border-[#E9EBEF] rounded-md px-2 py-1 text-xs text-[#17191D] focus:outline-none focus:border-[#16A765]"
            >
              {TILE_PROVIDERS.map((bp) => (
                <option key={bp.id} value={bp.id}>
                  {bp.name}
                </option>
              ))}
            </select>
          </div>

          {/* Layer Visibility Toggles */}
          <div>
            <span className="text-[10px] font-medium uppercase text-[#777D87] tracking-wider block mb-1">
              Feature Overlays
            </span>
            <div className="space-y-1">
              <label className="flex items-center justify-between p-1 rounded hover:bg-[#F7F8FA] cursor-pointer">
                <span className="text-[#17191D] text-[11px] flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-[#16A765]"></span>
                  Urban Expansion
                </span>
                <input
                  type="checkbox"
                  checked={visibility.urbanExpansion}
                  onChange={() => onToggleLayer('urbanExpansion')}
                  className="accent-[#16A765] rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-1 rounded hover:bg-[#F7F8FA] cursor-pointer">
                <span className="text-[#17191D] text-[11px] flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-[#E45B5B]"></span>
                  Vegetation Loss
                </span>
                <input
                  type="checkbox"
                  checked={visibility.vegetationLoss}
                  onChange={() => onToggleLayer('vegetationLoss')}
                  className="accent-[#E45B5B] rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-1 rounded hover:bg-[#F7F8FA] cursor-pointer">
                <span className="text-[#17191D] text-[11px] flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-[#5B9DE8]"></span>
                  Water / Shoreline
                </span>
                <input
                  type="checkbox"
                  checked={visibility.waterBodies}
                  onChange={() => onToggleLayer('waterBodies')}
                  className="accent-[#5B9DE8] rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-1 rounded hover:bg-[#F7F8FA] cursor-pointer">
                <span className="text-[#17191D] text-[11px] flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs border border-dashed border-[#16A765]"></span>
                  Area of Interest (AOI)
                </span>
                <input
                  type="checkbox"
                  checked={visibility.aoiBoundary}
                  onChange={() => onToggleLayer('aoiBoundary')}
                  className="accent-[#16A765] rounded cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Opacity Slider */}
          <div className="pt-2 border-t border-[#E9EBEF]">
            <div className="flex items-center justify-between text-[11px] text-[#777D87] mb-1">
              <span className="flex items-center gap-1">
                <Sliders className="w-3 h-3 text-[#777D87]" />
                Overlay Opacity
              </span>
              <span className="font-mono text-[#17191D] font-medium">{Math.round(opacity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={opacity}
              onChange={(e) => onChangeOpacity(parseFloat(e.target.value))}
              className="w-full h-1 bg-[#E9EBEF] rounded-lg appearance-none cursor-pointer accent-[#16A765]"
            />
          </div>
        </div>
      )}
    </div>
  );
};
