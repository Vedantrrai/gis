export interface TileLayerOption {
  id: string;
  name: string;
  url: string;
  attribution: string;
  maxZoom: number;
  subdomains?: string[];
  isSatellite?: boolean;
}

export interface MapLayerVisibility {
  basemap: boolean;
  aoiBoundary: boolean;
  detectedChanges: boolean;
  urbanExpansion: boolean;
  vegetationLoss: boolean;
  waterBodies: boolean;
  labels: boolean;
}

export interface LayerOpacityState {
  detectedChanges: number;
  urbanExpansion: number;
  vegetationLoss: number;
  satelliteOverlay: number;
}

export interface GISFeatureProperties {
  id: string;
  type: 'urban' | 'vegetation_loss' | 'water_change' | 'infrastructure' | 'aoi';
  name: string;
  changeType: string;
  areaHectares: number;
  confidenceScore: number;
  detectedYear: number;
  priorLandCover: string;
  postLandCover: string;
  spectralDeviationIndex: number;
  notes?: string;
}
