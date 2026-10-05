import { LocationPreset, AnalysisResponse, RecentAnalysisRecord, HistoricalDataPoint } from '../types/analysis';
import { TileLayerOption } from '../types/gis';

// Real world GIS Tile providers
export const TILE_PROVIDERS: TileLayerOption[] = [
  {
    id: 'carto-light',
    name: 'CartoDB Positron (GIS Light)',
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
    maxZoom: 19,
    subdomains: ['a', 'b', 'c', 'd'],
    isSatellite: false,
  },
  {
    id: 'esri-satellite',
    name: 'Esri World Imagery (Satellite)',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    maxZoom: 18,
    isSatellite: true,
  },
  {
    id: 'carto-voyager',
    name: 'CartoDB Voyager (Streets/Topo)',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
    maxZoom: 19,
    subdomains: ['a', 'b', 'c', 'd'],
    isSatellite: false,
  },
  {
    id: 'carto-dark',
    name: 'CartoDB Dark Matter (GIS Dark)',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
    maxZoom: 19,
    subdomains: ['a', 'b', 'c', 'd'],
    isSatellite: false,
  },
  {
    id: 'osm',
    name: 'OpenStreetMap Standard',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
    subdomains: ['a', 'b', 'c'],
    isSatellite: false,
  }
];

export const LOCATION_PRESETS: LocationPreset[] = [
  {
    id: 'mumbai',
    name: 'Mumbai Metropolitan Region',
    region: 'Maharashtra',
    country: 'India',
    coordinates: [19.0760, 72.8777],
    defaultZoom: 11,
    availableYears: [2015, 2017, 2019, 2021, 2023, 2025],
    bbox: [18.8900, 72.7500, 19.3000, 73.1200],
    description: 'Navi Mumbai airport corridor, Thane creek mangrove dynamic, and rapid peri-urban coastal expansion.',
    historicalChangeSummary: {
      totalAreaKm2: 28.4,
      urbanGrowthPct: 21.8,
      vegetationLossKm2: 14.2,
      waterBodyChangeKm2: 4.8,
    }
  },
  {
    id: 'bengaluru',
    name: 'Bengaluru Tech Corridor',
    region: 'Karnataka',
    country: 'India',
    coordinates: [12.9716, 77.5946],
    defaultZoom: 11,
    availableYears: [2015, 2018, 2020, 2022, 2024, 2025],
    bbox: [12.8000, 77.4500, 13.1500, 77.8000],
    description: 'Intense suburban conversion along Sarjapur, Whitefield, and Bellandur wetland encroachment.',
    historicalChangeSummary: {
      totalAreaKm2: 34.6,
      urbanGrowthPct: 29.4,
      vegetationLossKm2: 22.1,
      waterBodyChangeKm2: 3.2,
    }
  },
  {
    id: 'dubai',
    name: 'Dubai Urban & Coastal Frontier',
    region: 'Dubai',
    country: 'UAE',
    coordinates: [25.2048, 55.2708],
    defaultZoom: 11,
    availableYears: [2015, 2018, 2020, 2022, 2025],
    bbox: [24.9500, 55.0500, 25.3500, 55.4500],
    description: 'Offshore land reclamation, desert infrastructure expansion, and South Dubai logistics hub development.',
    historicalChangeSummary: {
      totalAreaKm2: 42.1,
      urbanGrowthPct: 34.7,
      vegetationLossKm2: 2.1,
      waterBodyChangeKm2: 18.5,
    }
  },
  {
    id: 'rondonia',
    name: 'Rondônia Amazon Rainforest Arc',
    region: 'Rondônia',
    country: 'Brazil',
    coordinates: [-10.8300, -62.8200],
    defaultZoom: 10,
    availableYears: [2015, 2017, 2019, 2021, 2023, 2025],
    bbox: [-11.1000, -63.1500, -10.6000, -62.5000],
    description: 'Fishbone deforestation patterns along highway BR-364 and agricultural frontier advancement.',
    historicalChangeSummary: {
      totalAreaKm2: 89.2,
      urbanGrowthPct: 4.1,
      vegetationLossKm2: 78.6,
      waterBodyChangeKm2: 1.4,
    }
  }
];

// Sample Mumbai GeoJSON feature collection showing real-world change detections
export const MUMBAI_SAMPLE_GEOJSON: GeoJSON.FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      id: 'feat-01',
      properties: {
        id: 'feat-01',
        name: 'Navi Mumbai International Airport Core Zone',
        type: 'urban',
        changeType: 'Urban Expansion & Earthworks',
        areaHectares: 1160,
        confidenceScore: 0.962,
        detectedYear: 2024,
        priorLandCover: 'Agricultural / Coastal Marshland',
        postLandCover: 'Compacted Runway Infrastructure / Built-up',
        spectralDeviationIndex: 0.884,
        notes: 'High-confidence transition from mudflats and seasonal agriculture to leveled civil construction.'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [73.050, 18.980],
            [73.090, 18.995],
            [73.110, 18.980],
            [73.085, 18.960],
            [73.055, 18.965],
            [73.050, 18.980]
          ]
        ]
      }
    },
    {
      type: 'Feature',
      id: 'feat-02',
      properties: {
        id: 'feat-02',
        name: 'Kharghar South Hillside Clearing',
        type: 'vegetation_loss',
        changeType: 'Vegetation Loss / Quarrying',
        areaHectares: 340,
        confidenceScore: 0.915,
        detectedYear: 2022,
        priorLandCover: 'Deciduous Scrub & Dense Canopy',
        postLandCover: 'Exposed Bedrock & Construction Staging',
        spectralDeviationIndex: 0.792,
        notes: 'Significant NDVI decline (-0.42) identified across 2018-2022 self-supervised Sentinel-2 feature space.'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [73.060, 19.030],
            [73.085, 19.040],
            [73.080, 19.020],
            [73.055, 19.015],
            [73.060, 19.030]
          ]
        ]
      }
    },
    {
      type: 'Feature',
      id: 'feat-03',
      properties: {
        id: 'feat-03',
        name: 'Thane Creek Shoreline Reclamation Zone',
        type: 'water_change',
        changeType: 'Intertidal Mudflat Alteration',
        areaHectares: 490,
        confidenceScore: 0.887,
        detectedYear: 2023,
        priorLandCover: 'Intertidal Creek Water',
        postLandCover: 'Stabilized Embankment & Bridge Piers',
        spectralDeviationIndex: 0.741,
        notes: 'MTHL (Atal Setu) connector approach corridor detected with high contrast in SWIR-1 band.'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [72.960, 18.970],
            [73.000, 18.975],
            [73.010, 18.955],
            [72.970, 18.950],
            [72.960, 18.970]
          ]
        ]
      }
    },
    {
      type: 'Feature',
      id: 'feat-04',
      properties: {
        id: 'feat-04',
        name: 'Panvel East Urban Peripheral Expansion',
        type: 'urban',
        changeType: 'High-Density Residential Expansion',
        areaHectares: 670,
        confidenceScore: 0.941,
        detectedYear: 2025,
        priorLandCover: 'Fallow Grassland & Open Shrub',
        postLandCover: 'Impervious Concrete & Asphalt',
        spectralDeviationIndex: 0.812,
        notes: 'New residential sector expansion observed with persistent change signatures over successive multi-temporal passes.'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [73.120, 18.970],
            [73.150, 18.985],
            [73.160, 18.955],
            [73.130, 18.945],
            [73.120, 18.970]
          ]
        ]
      }
    }
  ]
};

// Bengaluru GeoJSON
export const BENGALURU_SAMPLE_GEOJSON: GeoJSON.FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      id: 'blr-01',
      properties: {
        id: 'blr-01',
        name: 'Sarjapur-ORR Tech Enclave',
        type: 'urban',
        changeType: 'Urban Expansion',
        areaHectares: 840,
        confidenceScore: 0.95,
        detectedYear: 2023,
        priorLandCover: 'Dry Cropland & Tree Groves',
        postLandCover: 'Commercial High-Rise & Pavement',
        spectralDeviationIndex: 0.87,
        notes: 'Commercial tech campus development.'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [77.67, 12.92],
            [77.72, 12.94],
            [77.73, 12.90],
            [77.68, 12.89],
            [77.67, 12.92]
          ]
        ]
      }
    },
    {
      type: 'Feature',
      id: 'blr-02',
      properties: {
        id: 'blr-02',
        name: 'Bellandur Lake Catchment Buffer Encroachment',
        type: 'vegetation_loss',
        changeType: 'Wetland / Buffer Depletion',
        areaHectares: 420,
        confidenceScore: 0.92,
        detectedYear: 2022,
        priorLandCover: 'Marshy Vegetation',
        postLandCover: 'Debris Fill & Concrete Footings',
        spectralDeviationIndex: 0.81,
        notes: 'Loss of natural stormwater absorption buffer.'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [77.65, 12.93],
            [77.68, 12.95],
            [77.69, 12.93],
            [77.66, 12.91],
            [77.65, 12.93]
          ]
        ]
      }
    }
  ]
};

export const DEFAULT_ANALYSIS_RESULT: AnalysisResponse = {
  analysis_id: "demo-geo-mum-2015-2025",
  status: "completed",
  location: "Mumbai, India",
  before_year: 2015,
  after_year: 2025,
  dataset: "sentinel-2",
  changed_area_km2: 24.5,
  urban_change_percent: 18.7,
  vegetation_loss_km2: 12.4,
  confidence: 0.926,
  processed_at: "2025-05-12T14:32:00Z",
  geojson: MUMBAI_SAMPLE_GEOJSON,
  categories: [
    {
      category: 'urban_expansion',
      label: 'Urban Expansion (Built-up)',
      areaKm2: 13.9,
      percentage: 56.7,
      color: '#16A765' // Primary accent green
    },
    {
      category: 'vegetation_loss',
      label: 'Vegetation Loss / Deforestation',
      areaKm2: 7.2,
      percentage: 29.4,
      color: '#E45B5B' // Change red
    },
    {
      category: 'water_transition',
      label: 'Water Body / Shoreline Shift',
      areaKm2: 3.4,
      percentage: 13.9,
      color: '#5B9DE8' // Information blue
    }
  ],
  is_demo: true,
};

export const RECENT_ANALYSES_DATA: RecentAnalysisRecord[] = [
  {
    id: "ANL-9042",
    location: "Mumbai Metropolitan Region",
    comparisonPeriod: "2015 → 2025",
    areaChanged: "24.5 km²",
    urbanExpansion: "+18.7%",
    vegetationLoss: "12.4 km²",
    analysisDate: "2025-05-12",
    status: "Completed",
    dataset: "Sentinel-2 MSI",
    isDemo: true
  },
  {
    id: "ANL-8821",
    location: "Bengaluru Tech Corridor",
    comparisonPeriod: "2018 → 2024",
    areaChanged: "31.2 km²",
    urbanExpansion: "+24.3%",
    vegetationLoss: "19.8 km²",
    analysisDate: "2025-04-28",
    status: "Completed",
    dataset: "Landsat-8 OLI",
    isDemo: true
  },
  {
    id: "ANL-8714",
    location: "Dubai Urban & Coastal Frontier",
    comparisonPeriod: "2015 → 2025",
    areaChanged: "42.1 km²",
    urbanExpansion: "+34.7%",
    vegetationLoss: "2.1 km²",
    analysisDate: "2025-04-14",
    status: "Completed",
    dataset: "PlanetScope 3m",
    isDemo: true
  },
  {
    id: "ANL-8590",
    location: "Rondônia Amazon Arc",
    comparisonPeriod: "2017 → 2023",
    areaChanged: "78.4 km²",
    urbanExpansion: "+3.2%",
    vegetationLoss: "74.1 km²",
    analysisDate: "2025-03-30",
    status: "Completed",
    dataset: "Sentinel-2 MSI",
    isDemo: true
  },
  {
    id: "ANL-8430",
    location: "Hyderabad Outer Ring Road",
    comparisonPeriod: "2019 → 2024",
    areaChanged: "19.6 km²",
    urbanExpansion: "+22.1%",
    vegetationLoss: "11.5 km²",
    analysisDate: "2025-03-12",
    status: "Completed",
    dataset: "Sentinel-2 MSI",
    isDemo: true
  }
];

export const HISTORICAL_CHRONO_DATA: HistoricalDataPoint[] = [
  {
    year: 2015,
    totalChangedAreaKm2: 0,
    urbanExpansionKm2: 142.0,
    vegetationCoverKm2: 380.5,
    waterCoverKm2: 95.2,
    bareSoilKm2: 44.3,
    confidence: 0.94,
    dataset: "Sentinel-2 Base"
  },
  {
    year: 2017,
    totalChangedAreaKm2: 5.8,
    urbanExpansionKm2: 147.2,
    vegetationCoverKm2: 375.8,
    waterCoverKm2: 94.8,
    bareSoilKm2: 44.2,
    confidence: 0.93,
    dataset: "Sentinel-2 MSI"
  },
  {
    year: 2019,
    totalChangedAreaKm2: 11.4,
    urbanExpansionKm2: 153.1,
    vegetationCoverKm2: 370.4,
    waterCoverKm2: 94.1,
    bareSoilKm2: 44.4,
    confidence: 0.95,
    dataset: "Sentinel-2 MSI"
  },
  {
    year: 2021,
    totalChangedAreaKm2: 16.9,
    urbanExpansionKm2: 159.4,
    vegetationCoverKm2: 364.5,
    waterCoverKm2: 93.6,
    bareSoilKm2: 44.5,
    confidence: 0.91,
    dataset: "Sentinel-2 MSI"
  },
  {
    year: 2023,
    totalChangedAreaKm2: 21.3,
    urbanExpansionKm2: 164.8,
    vegetationCoverKm2: 359.8,
    waterCoverKm2: 93.0,
    bareSoilKm2: 44.4,
    confidence: 0.93,
    dataset: "Sentinel-2 MSI"
  },
  {
    year: 2025,
    totalChangedAreaKm2: 24.5,
    urbanExpansionKm2: 168.6,
    vegetationCoverKm2: 356.1,
    waterCoverKm2: 92.8,
    bareSoilKm2: 44.5,
    confidence: 0.926,
    dataset: "Sentinel-2 MSI"
  }
];
