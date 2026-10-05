import React, { useState, useRef, useCallback } from 'react';
import { 
  Split, 
  SlidersHorizontal, 
  Eye, 
  Sparkles
} from 'lucide-react';
import { AnalysisResponse } from '../../types/analysis';

interface BeforeAfterSliderProps {
  beforeYear: number;
  afterYear: number;
  locationName: string;
  analysis: AnalysisResponse;
  opacity: number;
  mode: 'swipe' | 'split';
  setMode: (mode: 'swipe' | 'split') => void;
  overlayVisible: boolean;
  setOverlayVisible: (visible: boolean) => void;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeYear,
  afterYear,
  locationName,
  analysis,
  opacity,
  mode,
  setMode,
  overlayVisible,
  setOverlayVisible,
}) => {
  const [sliderPosition, setSliderPosition] = useState<number>(50); // percentage 0 - 100
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef<boolean>(false);

  const handlePointerDown = () => {
    isDragging.current = true;
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percent = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPosition(percent);
  }, []);

  return (
    <div className="flex flex-col h-full bg-white border border-[#E9EBEF] rounded-xl overflow-hidden shadow-geo">
      {/* Top Toolbar */}
      <div className="p-3 bg-white border-b border-[#E9EBEF] flex flex-wrap items-center justify-between gap-2 z-10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#16A765]" />
          <span className="text-xs font-semibold text-[#17191D]">
            Visual Inspection: {locationName}
          </span>
          <span className="text-[11px] text-[#777D87] bg-[#F7F8FA] px-2 py-0.5 rounded border border-[#E9EBEF]">
            Sentinel-2 MSI
          </span>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex bg-[#F7F8FA] rounded-lg p-0.5 border border-[#E9EBEF] text-xs">
            <button
              onClick={() => setMode('swipe')}
              className={`px-2.5 py-1 rounded-md font-medium text-xs flex items-center gap-1.5 transition-all ${
                mode === 'swipe'
                  ? 'bg-white text-[#17191D] shadow-xs font-semibold'
                  : 'text-[#777D87] hover:text-[#17191D]'
              }`}
              id="mode-swipe-button"
            >
              <SlidersHorizontal className="w-3 h-3 text-[#16A765]" />
              Swipe Curtain
            </button>
            <button
              onClick={() => setMode('split')}
              className={`px-2.5 py-1 rounded-md font-medium text-xs flex items-center gap-1.5 transition-all ${
                mode === 'split'
                  ? 'bg-white text-[#17191D] shadow-xs font-semibold'
                  : 'text-[#777D87] hover:text-[#17191D]'
              }`}
              id="mode-split-button"
            >
              <Split className="w-3 h-3 text-[#5B9DE8]" />
              Side-by-Side
            </button>
          </div>

          {/* Toggle Change Overlay */}
          <button
            onClick={() => setOverlayVisible(!overlayVisible)}
            className={`px-2.5 py-1 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-all ${
              overlayVisible 
                ? 'bg-[#EAF8F0] border-[#16A765]/30 text-[#087D4A]' 
                : 'bg-white border-[#E9EBEF] text-[#777D87] hover:text-[#17191D]'
            }`}
            title="Toggle Change Mask Overlays"
            id="toggle-overlay-mask"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>AI Mask: {overlayVisible ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* Main Comparison Canvas */}
      <div 
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onPointerMove={handlePointerMove}
        className="relative flex-1 min-h-[460px] w-full overflow-hidden select-none bg-[#F3F4F6]"
      >
        {mode === 'swipe' ? (
          /* Mode B: Swipe comparison curtain */
          <div className="relative w-full h-full">
            {/* After Image Layer (Full Background) */}
            <div className="absolute inset-0 w-full h-full bg-[#E5E7EB]">
              <div 
                className="w-full h-full bg-cover bg-center transition-all"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=80')`,
                }}
              />

              {/* After Year Badge */}
              <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm border border-[#E9EBEF] px-2.5 py-1 rounded-lg shadow-geo flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#16A765]" />
                <span className="text-xs font-semibold text-[#17191D]">
                  {afterYear} Target
                </span>
              </div>
            </div>

            {/* Before Image Layer (Clipped to sliderPosition) */}
            <div 
              className="absolute inset-y-0 left-0 overflow-hidden border-r-2 border-[#16A765] z-10 shadow-md"
              style={{ width: `${sliderPosition}%` }}
            >
              <div 
                className="w-full h-full bg-cover bg-center relative"
                style={{
                  width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100vw',
                  backgroundImage: `url('https://images.unsplash.com/photo-1508873696983-2df5293cb395?auto=format&fit=crop&w=1600&q=80')`,
                  filter: 'contrast(1.02) saturate(1.1)',
                }}
              >
                {/* Before Year Badge */}
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm border border-[#E9EBEF] px-2.5 py-1 rounded-lg shadow-geo flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#5B9DE8]" />
                  <span className="text-xs font-semibold text-[#17191D]">
                    {beforeYear} Baseline
                  </span>
                </div>
              </div>
            </div>

            {/* AI Change Mask Overlays */}
            {overlayVisible && (
              <div 
                className="absolute inset-0 pointer-events-none z-20 transition-opacity duration-200"
                style={{ opacity }}
              >
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <polygon 
                    points="520,180 620,195 640,290 560,310 500,260" 
                    fill="rgba(22, 167, 101, 0.4)" 
                    stroke="#16A765" 
                    strokeWidth="2" 
                    strokeDasharray="4 2" 
                  />
                  <polygon 
                    points="260,220 340,240 370,330 280,350 230,290" 
                    fill="rgba(228, 91, 91, 0.4)" 
                    stroke="#E45B5B" 
                    strokeWidth="2" 
                  />
                  <circle cx="700" cy="380" r="45" fill="rgba(91, 157, 232, 0.35)" stroke="#5B9DE8" strokeWidth="2" />
                </svg>
              </div>
            )}

            {/* Draggable Divider Handle */}
            <div 
              className="absolute top-0 bottom-0 z-30 flex items-center justify-center -ml-3.5 w-7 cursor-ew-resize group"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="w-0.5 h-full bg-[#16A765]"></div>
              <div className="w-7 h-7 rounded-full bg-white border border-[#16A765] text-[#16A765] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <SlidersHorizontal className="w-3.5 h-3.5 rotate-90" />
              </div>
            </div>

            {/* Instruction tooltip badge */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full border border-[#E9EBEF] text-[11px] text-[#777D87] pointer-events-none flex items-center gap-1.5 shadow-xs">
              <SlidersHorizontal className="w-3 h-3 text-[#16A765]" />
              Drag divider to compare bi-temporal scenes
            </div>
          </div>
        ) : (
          /* Mode A: Split View side-by-side */
          <div className="grid grid-cols-1 md:grid-cols-2 w-full h-full divide-y md:divide-y-0 md:divide-x divide-[#E9EBEF]">
            {/* Left: Before Year */}
            <div className="relative h-full min-h-[300px] overflow-hidden bg-white">
              <div 
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1508873696983-2df5293cb395?auto=format&fit=crop&w=1200&q=80')`,
                }}
              />
              <div className="absolute top-3 left-3 bg-white/95 border border-[#E9EBEF] px-2.5 py-1 rounded-lg text-xs font-semibold text-[#17191D] flex items-center gap-1.5 shadow-geo">
                <span className="w-2 h-2 rounded-full bg-[#5B9DE8]"></span>
                {beforeYear} Baseline Reference
              </div>
            </div>

            {/* Right: After Year */}
            <div className="relative h-full min-h-[300px] overflow-hidden bg-white">
              <div 
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80')`,
                }}
              />
              {overlayVisible && (
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{ opacity }}
                >
                  <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <polygon 
                      points="280,140 380,150 390,240 310,250 270,210" 
                      fill="rgba(22, 167, 101, 0.4)" 
                      stroke="#16A765" 
                      strokeWidth="2" 
                    />
                    <polygon 
                      points="120,180 190,195 210,280 140,290 100,240" 
                      fill="rgba(228, 91, 91, 0.4)" 
                      stroke="#E45B5B" 
                      strokeWidth="2" 
                    />
                  </svg>
                </div>
              )}
              <div className="absolute top-3 right-3 bg-white/95 border border-[#E9EBEF] px-2.5 py-1 rounded-lg text-xs font-semibold text-[#17191D] flex items-center gap-1.5 shadow-geo">
                <span className="w-2 h-2 rounded-full bg-[#16A765]"></span>
                {afterYear} Target Comparison
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Status */}
      <div className="px-3.5 py-2 bg-white border-t border-[#E9EBEF] flex items-center justify-between text-xs text-[#777D87]">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#16A765]" />
          Vision-MAE Latent Alignment
        </span>
        <span className="text-[11px] text-[#777D87] bg-[#F7F8FA] px-2 py-0.5 rounded border border-[#E9EBEF]">
          Sample Verification Scene
        </span>
      </div>
    </div>
  );
};
