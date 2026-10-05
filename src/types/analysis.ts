// Type definitions for Satellite Change Detection & GIS Analytics

export type SatelliteDataset = 'sentinel-2' | 'landsat-8' | 'planetscope' | 'modis';

export interface LocationPreset {
  id: string;
  name: string;
  region: string;
  country: string;
  coordinates: [number, number]; // [lat, lng]
  defaultZoom: number;
  availableYears: number[];
  bbox: [number, number, number, number]; // [minLat, minLng, maxLat, maxLng]
  description: string;
  historicalChangeSummary: {
    totalAreaKm2: number;
    urbanGrowthPct: number;
    vegetationLossKm2: number;
    waterBodyChangeKm2: number;
  };
}

export interface AnalysisRequest {
  location: string;
  before_year: number;
  after_year: number;
  dataset: SatelliteDataset;
  area_of_interest?: GeoJSON.Polygon | GeoJSON.MultiPolygon | null;
  confidence_threshold?: number;
}

export interface ChangeCategoryStats {
  category: 'urban_expansion' | 'vegetation_loss' | 'water_transition' | 'barren_soil' | 'unchanged';
  label: string;
  areaKm2: number;
  percentage: number;
  color: string;
}

export interface AnalysisResponse {
  analysis_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  location: string;
  before_year: number;
  after_year: number;
  dataset: SatelliteDataset;
  changed_area_km2: number;
  urban_change_percent: number;
  vegetation_loss_km2: number;
  confidence: number;
  processed_at: string;
  geojson: GeoJSON.FeatureCollection;
  categories?: ChangeCategoryStats[];
  is_demo?: boolean;
}

export interface HistoricalDataPoint {
  year: number;
  totalChangedAreaKm2: number;
  urbanExpansionKm2: number;
  vegetationCoverKm2: number;
  waterCoverKm2: number;
  bareSoilKm2: number;
  confidence: number;
  dataset: string;
}

export interface RecentAnalysisRecord {
  id: string;
  location: string;
  comparisonPeriod: string;
  areaChanged: string;
  urbanExpansion: string;
  vegetationLoss: string;
  analysisDate: string;
  status: 'Completed' | 'Processing' | 'Failed' | 'Queued';
  dataset: string;
  isDemo: boolean;
}
