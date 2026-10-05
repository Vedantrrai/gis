import React, { useState } from 'react';
import { 
  Map as MapIcon, 
  MapPin, 
  X,
  Download
} from 'lucide-react';
import { ChangeDetectionMap } from '../components/maps/ChangeDetectionMap';
import { AnalysisResponse } from '../types/analysis';
import { GISFeatureProperties } from '../types/gis';
import { LOCATION_PRESETS } from '../data/demoData';
import { exportGeoJSONFile } from '../utils/exportUtils';

interface InteractiveMapProps {
  currentAnalysis: AnalysisResponse;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({ currentAnalysis }) => {
  const [selectedLocId, setSelectedLocId] = useState('mumbai');
  const [selectedFeature, setSelectedFeature] = useState<GISFeatureProperties | null>(null);

  const selectedLoc = LOCATION_PRESETS.find(p => p.id === selectedLocId) || LOCATION_PRESETS[0];

  const handleSelectFeature = (feat: GISFeatureProperties) => {
    setSelectedFeature(feat);
  };

  const handleDownloadGeoJSON = () => {
    exportGeoJSONFile(currentAnalysis.geojson, `geovision-${selectedLoc.id}-vectors.geojson`);
  };

  return (
    <div className="space-y-4 pb-10 max-w-7xl mx-auto">
      {/* Top Filter Bar */}
      <div className="bg-white border border-[#E9EBEF] rounded-xl p-3.5 shadow-geo flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#EAF8F0] border border-[#16A765]/20 flex items-center justify-center text-[#16A765]">
              <MapIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[#17191D] tracking-tight leading-none">
                Interactive GIS Explorer
              </h2>
              <span className="text-[11px] text-[#777D87]">
                Vector Polygon Overlay • EPSG:4326
              </span>
            </div>
          </div>

          {/* Region Switcher */}
          <div className="flex items-center gap-1.5 bg-[#F7F8FA] border border-[#E9EBEF] rounded-lg px-2.5 py-1.5 text-xs text-[#17191D]">
            <MapPin className="w-3.5 h-3.5 text-[#16A765]" />
            <select
              value={selectedLocId}
              onChange={(e) => {
                setSelectedLocId(e.target.value);
                setSelectedFeature(null);
              }}
              className="bg-transparent text-[#17191D] focus:outline-none cursor-pointer"
            >
              {LOCATION_PRESETS.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadGeoJSON}
            className="px-3 py-1.5 rounded-lg bg-[#F7F8FA] hover:bg-[#F3F4F6] border border-[#E9EBEF] text-[#17191D] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Download GeoJSON Layer"
            id="download-geojson-btn"
          >
            <Download className="w-3.5 h-3.5 text-[#16A765]" />
            <span>Export GeoJSON</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Leaflet Map */}
        <div className={selectedFeature ? 'lg:col-span-8' : 'lg:col-span-12'}>
          <ChangeDetectionMap
            center={selectedLoc.coordinates}
            zoom={selectedLoc.defaultZoom}
            geojson={currentAnalysis.geojson}
            bbox={selectedLoc.bbox}
            locationName={selectedLoc.name}
            onSelectFeature={handleSelectFeature}
            height="620px"
            isDemo={currentAnalysis.is_demo}
          />
        </div>

        {/* Feature Inspection Side Drawer */}
        {selectedFeature && (
          <div className="lg:col-span-4 bg-white border border-[#E9EBEF] rounded-xl p-4 shadow-geo space-y-3.5 animate-in fade-in">
            <div className="flex items-center justify-between pb-2.5 border-b border-[#E9EBEF]">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  selectedFeature.type === 'urban' ? 'bg-[#16A765]' :
                  selectedFeature.type === 'vegetation_loss' ? 'bg-[#E45B5B]' : 'bg-[#5B9DE8]'
                }`} />
                <h3 className="text-sm font-semibold text-[#17191D] tracking-tight">
                  Feature Inspector
                </h3>
              </div>
              <button
                onClick={() => setSelectedFeature(null)}
                className="p-1 rounded-md text-[#777D87] hover:text-[#17191D] hover:bg-[#F3F4F6] transition-colors"
                id="close-feature-inspector"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-[#17191D]">
                {selectedFeature.name}
              </h4>
              <p className="text-xs text-[#777D87] mt-0.5">
                {selectedFeature.changeType} • ID: {selectedFeature.id}
              </p>
            </div>

            {/* Feature Attributes Grid */}
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-[#F7F8FA] border border-[#E9EBEF] flex items-center justify-between">
                <span className="text-[#777D87]">Delineated Extent:</span>
                <span className="text-[#17191D] font-semibold">{selectedFeature.areaHectares} Hectares</span>
              </div>

              <div className="p-2.5 rounded-lg bg-[#F7F8FA] border border-[#E9EBEF] flex items-center justify-between">
                <span className="text-[#777D87]">Confidence Score:</span>
                <span className="text-[#087D4A] font-semibold">
                  {(selectedFeature.confidenceScore * 100).toFixed(1)}%
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-[#F7F8FA] border border-[#E9EBEF] flex items-center justify-between">
                <span className="text-[#777D87]">Spectral Deviation:</span>
                <span className="text-[#17191D] font-semibold font-mono">{selectedFeature.spectralDeviationIndex}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-[#F7F8FA] border border-[#E9EBEF] space-y-1.5">
                <span className="text-[10px] text-[#777D87] uppercase tracking-wider block font-medium">Land Cover Transition</span>
                <div className="text-xs">
                  <div className="text-[#777D87]">Prior: <span className="text-[#17191D] font-medium">{selectedFeature.priorLandCover}</span></div>
                  <div className="text-[#777D87] mt-0.5">Post: <span className="text-[#087D4A] font-medium">{selectedFeature.postLandCover}</span></div>
                </div>
              </div>

              {selectedFeature.notes && (
                <div className="p-2.5 rounded-lg bg-[#F7F8FA] border border-[#E9EBEF] text-xs text-[#777D87]">
                  <span className="text-[10px] text-[#17191D] uppercase tracking-wider block font-semibold mb-1">
                    Analysis Notes
                  </span>
                  <p className="leading-relaxed text-[#17191D]/90">
                    {selectedFeature.notes}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-[#E9EBEF] flex items-center justify-between text-[11px] text-[#777D87]">
              <span>CRS: EPSG:4326</span>
              <span className="text-[#087D4A] font-medium">Verified Geometry</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
