import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowUpRight, 
  Layers, 
  TrendingUp, 
  TreePine, 
  ShieldCheck, 
  MapPin, 
  Plus
} from 'lucide-react';
import { MetricCard } from '../components/dashboard/MetricCard';
import { AnalysisForm } from '../components/dashboard/AnalysisForm';
import { RecentAnalyses } from '../components/dashboard/RecentAnalyses';
import { ChangeDetectionMap } from '../components/maps/ChangeDetectionMap';
import { AnalysisRequest, AnalysisResponse, RecentAnalysisRecord } from '../types/analysis';
import { LOCATION_PRESETS, RECENT_ANALYSES_DATA } from '../data/demoData';

interface OverviewProps {
  currentAnalysis: AnalysisResponse;
  onRunAnalysis: (req: AnalysisRequest) => void;
  isLoading: boolean;
  progressStep: string;
  isBackendOnline: boolean;
  demoMode: boolean;
  setDemoMode: (val: boolean) => void;
  errorMessage: string | null;
  onRetry: () => void;
}

export const Overview: React.FC<OverviewProps> = ({
  currentAnalysis,
  onRunAnalysis,
  isLoading,
  progressStep,
  isBackendOnline,
  demoMode,
  setDemoMode,
  errorMessage,
  onRetry,
}) => {
  const navigate = useNavigate();
  const formRef = useRef<HTMLDivElement>(null);

  const matchedLocation = LOCATION_PRESETS.find(p => 
    p.name.toLowerCase().includes(currentAnalysis.location.toLowerCase())
  ) || LOCATION_PRESETS[0];

  const handleStartNewAnalysis = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectRecent = (record: RecentAnalysisRecord) => {
    navigate('/change-detection');
  };

  return (
    <div className="space-y-5 pb-10 max-w-7xl mx-auto">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-[#17191D] tracking-tight">
            Satellite Change Overview
          </h1>
          <p className="text-xs sm:text-[13px] text-[#777D87] mt-0.5">
            Analyze geographical changes, urban growth, and vegetation patterns across time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleStartNewAnalysis}
            className="px-3.5 py-2 rounded-lg bg-[#16A765] hover:bg-[#087D4A] text-white font-medium text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            id="start-new-analysis-hero-btn"
          >
            <Plus className="w-4 h-4" />
            <span>New Analysis</span>
          </button>
        </div>
      </div>

      {/* 2. KPI Cards (4 in one row on desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <MetricCard
          title="Total Area Changed"
          value={currentAnalysis.changed_area_km2}
          unit="km²"
          change={`+${(currentAnalysis.changed_area_km2 * 0.12).toFixed(1)} km² vs prev`}
          isPositiveChange={true}
          icon={Layers}
          colorVariant="blue"
          isDemo={currentAnalysis.is_demo}
          subtitle={`${currentAnalysis.before_year}–${currentAnalysis.after_year}`}
        />

        <MetricCard
          title="Urban Expansion"
          value={`+${currentAnalysis.urban_change_percent}`}
          unit="%"
          change="+3.4% annual rate"
          isPositiveChange={true}
          icon={TrendingUp}
          colorVariant="green"
          isDemo={currentAnalysis.is_demo}
          subtitle="Built-up surface"
        />

        <MetricCard
          title="Vegetation Loss"
          value={currentAnalysis.vegetation_loss_km2}
          unit="km²"
          change="-8.1% canopy drop"
          isPositiveChange={false}
          icon={TreePine}
          colorVariant="red"
          isDemo={currentAnalysis.is_demo}
          subtitle="Canopy depletion"
        />

        <MetricCard
          title="Change Confidence"
          value={`${(currentAnalysis.confidence * 100).toFixed(1)}`}
          unit="%"
          change="High feature margin"
          isPositiveChange={true}
          icon={ShieldCheck}
          colorVariant="green"
          isDemo={currentAnalysis.is_demo}
          subtitle="Vision-MAE latency"
        />
      </div>

      {/* 3. Analysis Configuration Panel */}
      <div ref={formRef}>
        <AnalysisForm
          onSubmit={onRunAnalysis}
          isLoading={isLoading}
          progressStep={progressStep}
          isBackendOnline={isBackendOnline}
          demoMode={demoMode}
          setDemoMode={setDemoMode}
          errorMessage={errorMessage}
          onRetry={onRetry}
        />
      </div>

      {/* 4. Main GIS Map Card */}
      <div className="bg-white border border-[#E9EBEF] rounded-xl p-5 shadow-geo space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E9EBEF] gap-2">
          <div>
            <h2 className="text-sm font-semibold text-[#17191D] tracking-tight flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#16A765]" />
              Geospatial Change Analysis
            </h2>
            <p className="text-xs text-[#777D87] mt-0.5">
              {currentAnalysis.location} • Comparison period {currentAnalysis.before_year} → {currentAnalysis.after_year}
            </p>
          </div>
          <button
            onClick={() => navigate('/interactive-map')}
            className="text-xs font-medium text-[#16A765] hover:text-[#087D4A] hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Full Map View</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <ChangeDetectionMap
          center={matchedLocation.coordinates}
          zoom={matchedLocation.defaultZoom}
          geojson={currentAnalysis.geojson}
          bbox={matchedLocation.bbox}
          locationName={currentAnalysis.location}
          height="500px"
          isDemo={currentAnalysis.is_demo}
        />
      </div>

      {/* 5. Recent Analyses Table */}
      <RecentAnalyses
        records={RECENT_ANALYSES_DATA}
        onSelectRecord={handleSelectRecent}
      />
    </div>
  );
};
