import React, { useState } from 'react';
import { 
  Play, 
  MapPin, 
  Calendar, 
  AlertCircle, 
  Loader2, 
  Crosshair, 
  Database,
  ArrowRight
} from 'lucide-react';
import { AnalysisRequest, SatelliteDataset } from '../../types/analysis';
import { LOCATION_PRESETS } from '../../data/demoData';

interface AnalysisFormProps {
  onSubmit: (request: AnalysisRequest) => void;
  isLoading: boolean;
  progressStep?: string;
  isBackendOnline: boolean;
  demoMode: boolean;
  setDemoMode: (val: boolean) => void;
  errorMessage?: string | null;
  onRetry?: () => void;
}

export const AnalysisForm: React.FC<AnalysisFormProps> = ({
  onSubmit,
  isLoading,
  progressStep,
  isBackendOnline,
  demoMode,
  setDemoMode,
  errorMessage,
  onRetry,
}) => {
  const [selectedLocationId, setSelectedLocationId] = useState('mumbai');
  const [beforeYear, setBeforeYear] = useState<number>(2015);
  const [afterYear, setAfterYear] = useState<number>(2025);
  const [dataset, setDataset] = useState<SatelliteDataset>('sentinel-2');
  const [customCoordinates, setCustomCoordinates] = useState('');
  const [showCoordinateInput, setShowCoordinateInput] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const selectedLocation = LOCATION_PRESETS.find(p => p.id === selectedLocationId) || LOCATION_PRESETS[0];

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const locId = e.target.value;
    setSelectedLocationId(locId);
    const loc = LOCATION_PRESETS.find(p => p.id === locId);
    if (loc && loc.availableYears.length >= 2) {
      setBeforeYear(loc.availableYears[0]);
      setAfterYear(loc.availableYears[loc.availableYears.length - 1]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (afterYear <= beforeYear) {
      setValidationError('Target year must be strictly later than the baseline reference year.');
      return;
    }
    setValidationError(null);

    onSubmit({
      location: selectedLocation.name,
      before_year: beforeYear,
      after_year: afterYear,
      dataset,
      area_of_interest: null,
      confidence_threshold: 0.85,
    });
  };

  return (
    <div className="bg-white border border-[#E9EBEF] rounded-xl p-5 shadow-geo">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-[#E9EBEF] gap-2">
        <div>
          <h2 className="text-sm font-semibold text-[#17191D] tracking-tight">
            Analysis Configuration
          </h2>
          <p className="text-xs text-[#777D87] mt-0.5">
            Select monitoring area, baseline and target epochs, and sensor data.
          </p>
        </div>

        {/* Backend & Demo Mode Pills */}
        <div className="flex items-center gap-2">
          {!isBackendOnline && (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#FFF8E6] text-[#B76E00] border border-[#F2994A]/30 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3 h-3" />
              API Offline
            </span>
          )}
          <label className="text-xs text-[#777D87] flex items-center gap-1.5 cursor-pointer bg-[#F7F8FA] px-2.5 py-1 rounded-lg border border-[#E9EBEF]">
            <input 
              type="checkbox" 
              checked={demoMode} 
              onChange={(e) => setDemoMode(e.target.checked)} 
              className="accent-[#16A765] rounded cursor-pointer"
            />
            <span className="text-[11px] font-medium text-[#17191D]">Demo Simulation</span>
          </label>
        </div>
      </div>

      {/* Backend error notification banner */}
      {errorMessage && (
        <div className="mt-3.5 p-3 rounded-lg bg-[#FDEDED] border border-[#E45B5B]/30 text-xs text-[#9E2A2B] flex items-start justify-between gap-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-[#E45B5B] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-[#17191D]">Backend Connection Notice</p>
              <p className="text-[#777D87] mt-0.5">{errorMessage}</p>
            </div>
          </div>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-2.5 py-1 rounded bg-white hover:bg-[#F3F4F6] text-[#17191D] text-[11px] border border-[#E9EBEF] whitespace-nowrap transition-colors"
            >
              Retry
            </button>
          )}
        </div>
      )}

      {/* Form Grid */}
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Location Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-[#17191D] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#16A765]" />
                Region
              </label>
              <button
                type="button"
                onClick={() => setShowCoordinateInput(!showCoordinateInput)}
                className="text-[11px] text-[#16A765] hover:underline"
              >
                {showCoordinateInput ? 'Presets' : 'Custom AOI'}
              </button>
            </div>

            {!showCoordinateInput ? (
              <select
                value={selectedLocationId}
                onChange={handleLocationChange}
                disabled={isLoading}
                className="w-full bg-white border border-[#E9EBEF] rounded-lg px-2.5 py-1.5 text-xs text-[#17191D] focus:outline-none focus:border-[#16A765] transition-colors"
                id="location-selector"
              >
                {LOCATION_PRESETS.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={customCoordinates}
                onChange={(e) => setCustomCoordinates(e.target.value)}
                placeholder="19.07, 72.87 (Lat, Lng)"
                disabled={isLoading}
                className="w-full bg-white border border-[#E9EBEF] rounded-lg px-2.5 py-1.5 text-xs text-[#17191D] focus:outline-none focus:border-[#16A765] font-mono transition-colors"
                id="custom-aoi-input"
              />
            )}
            <p className="text-[11px] text-[#777D87] mt-1 truncate">
              {selectedLocation.country} • {selectedLocation.region}
            </p>
          </div>

          {/* Baseline Reference Year (Before) */}
          <div>
            <label className="block text-xs font-medium text-[#17191D] mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#777D87]" />
              Baseline Year (Before)
            </label>
            <select
              value={beforeYear}
              onChange={(e) => setBeforeYear(Number(e.target.value))}
              disabled={isLoading}
              className="w-full bg-white border border-[#E9EBEF] rounded-lg px-2.5 py-1.5 text-xs text-[#17191D] focus:outline-none focus:border-[#16A765] transition-colors"
              id="before-year-selector"
            >
              {[2015, 2016, 2017, 2018, 2019, 2020].map((yr) => (
                <option key={yr} value={yr}>
                  {yr} Reference Pass
                </option>
              ))}
            </select>
            <p className="text-[11px] text-[#777D87] mt-1">
              Historical reference scene
            </p>
          </div>

          {/* Target Comparison Year (After) */}
          <div>
            <label className="block text-xs font-medium text-[#17191D] mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#16A765]" />
              Target Year (After)
            </label>
            <select
              value={afterYear}
              onChange={(e) => setAfterYear(Number(e.target.value))}
              disabled={isLoading}
              className="w-full bg-white border border-[#E9EBEF] rounded-lg px-2.5 py-1.5 text-xs text-[#17191D] focus:outline-none focus:border-[#16A765] transition-colors"
              id="after-year-selector"
            >
              {[2021, 2022, 2023, 2024, 2025, 2026].map((yr) => (
                <option key={yr} value={yr}>
                  {yr} Comparison Pass
                </option>
              ))}
            </select>
            <p className="text-[11px] text-[#777D87] mt-1">
              Recent monitoring scene
            </p>
          </div>

          {/* Satellite Sensor Dataset */}
          <div>
            <label className="block text-xs font-medium text-[#17191D] mb-1.5 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-[#5B9DE8]" />
              Sensor Dataset
            </label>
            <select
              value={dataset}
              onChange={(e) => setDataset(e.target.value as SatelliteDataset)}
              disabled={isLoading}
              className="w-full bg-white border border-[#E9EBEF] rounded-lg px-2.5 py-1.5 text-xs text-[#17191D] focus:outline-none focus:border-[#16A765] transition-colors"
              id="dataset-selector"
            >
              <option value="sentinel-2">Sentinel-2 (10m MSI)</option>
              <option value="landsat-8">Landsat-8 (30m OLI)</option>
              <option value="planetscope">PlanetScope (3m Ortho)</option>
              <option value="modis">MODIS (250m Regional)</option>
            </select>
            <p className="text-[11px] text-[#777D87] mt-1">
              Calibrated multi-band reflectance
            </p>
          </div>
        </div>

        {/* Validation Error */}
        {validationError && (
          <div className="text-xs text-[#B76E00] bg-[#FFF8E6] border border-[#F2994A]/30 rounded-lg p-2 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-[#F2994A]" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Footer / Submit Row */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[#E9EBEF]">
          <div className="flex items-center gap-1.5 text-xs text-[#777D87]">
            <Crosshair className="w-3.5 h-3.5 text-[#A0A5AE]" />
            <span className="font-mono text-[11px]">
              {selectedLocation.coordinates[0].toFixed(4)}°N, {selectedLocation.coordinates[1].toFixed(4)}°E (EPSG:4326)
            </span>
          </div>

          <div className="flex items-center gap-3">
            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-[#087D4A] font-medium">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#16A765]" />
                <span>{progressStep || 'Processing change detection...'}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg font-medium text-xs transition-all flex items-center justify-center gap-1.5 shadow-xs ${
                isLoading
                  ? 'bg-[#F3F4F6] text-[#A0A5AE] cursor-not-allowed'
                  : 'bg-[#16A765] hover:bg-[#087D4A] text-white cursor-pointer'
              }`}
              id="analyze-changes-button"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Computing...</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 fill-current" />
                  <span>Analyze Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
