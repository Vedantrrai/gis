# GeoVision AI — Self-Supervised Satellite Image Change Detection & GIS Analytics

GeoVision AI is a research-grade geospatial intelligence dashboard and analytics platform designed for bi-temporal satellite image change detection, urban growth monitoring, vegetation depletion tracking, and GIS exploration.

Powered by self-supervised vision models (e.g. Vision-MAE / Contrastive representations on Copernicus Sentinel-2 and USGS Landsat-8 imagery), GeoVision AI eliminates the need for expensive manual pixel-wise change labeling while providing actionable geospatial metrics and vector layers.

---

## 🛰️ Key Features

- **Bi-Temporal Visual Comparison Workspace:**
  - **Swipe Curtain Mode:** Single viewport with a high-precision draggable vertical divider revealing before vs. after registered scenes.
  - **Side-by-Side Split View:** Synchronized viewports for side-by-side epoch inspection.
  - **Dynamic Overlay Masks:** Spectral deviation masks for urban expansion (Electric Lime), vegetation loss (Red-Orange), and intertidal water shift (Cyan).
- **Interactive GIS Map Explorer:**
  - Built with Leaflet & React-Leaflet with WGS84 (EPSG:4326) CRS support.
  - Switchable tile basemaps (CartoDB Dark Matter, Esri World Imagery Satellite, CartoDB Voyager, OpenStreetMap).
  - Area of Interest (AOI) boundary visualization.
  - Interactive GeoJSON polygons and multipolygons with hover effects and rich feature inspector drawers.
  - Live cursor latitude and longitude coordinate readout.
  - Layer visibility toggles and real-time opacity slider.
- **Multi-Temporal Historical Trajectory Analytics:**
  - Interactive multi-pass epoch stepper (2015 → 2017 → 2019 → 2021 → 2023 → 2025).
  - Responsive charts built with Recharts: Urban Impervious Surface Growth, Canopy Dynamics, and Cumulative Land Alteration.
- **Export & Intelligence Dossier Center:**
  - **PDF Dossier:** Professional GIS intelligence report generated on client side with jsPDF.
  - **CSV Metrics Export:** Structured comma-separated numerical breakdown of all features and changes.
  - **GeoJSON Export:** Standard RFC 7946 GeoJSON file containing all vectorized polygons and attributes.
- **Resilient Backend Integration & Explicit Demo Mode:**
  - Direct connection to FastAPI / Flask / Node backend via Axios (`VITE_API_BASE_URL`).
  - Graceful degradation: If backend is offline, the interface displays connection alerts and allows an explicitly labelled **Demo Simulation** mode.
  - Clear distinctions between live inference and demo records to prevent presenting simulated metrics as actual findings.

---

## 🛠️ Tech Stack

- **Framework:** React 18 with Vite 5 and TypeScript
- **Styling:** Tailwind CSS (Dark GIS Theme: `#0B0F14`, `#10161D`, `#151D26`, `#283340`, `#C6F36A`, `#55D6E8`)
- **Mapping:** Leaflet & React-Leaflet
- **Charts:** Recharts
- **Icons:** Lucide React
- **HTTP Client:** Axios
- **Reporting:** jsPDF

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.x or higher (tested on Node v24)
- **npm** or **pnpm** or **yarn**

### 2. Installation
```bash
# Clone or navigate to the repository directory
cd /path/to/geovision-ai

# Install dependencies
npm install
```

### 3. Backend URL Configuration
Create or modify `.env` in the root directory:
```env
VITE_API_BASE_URL=http://localhost:8000
```

### 4. Running the Development Server
```bash
npm run dev
```
Open your browser and navigate to:
```
http://localhost:5173
```

### 5. Building for Production
```bash
npm run build
npm run preview
```

---

## 📡 API Contract Specification

When connecting your team's machine learning backend, GeoVision AI expects the following endpoints:

### Submit Analysis
- **Endpoint:** `POST /analysis`
- **Request Body:**
```json
{
  "location": "Mumbai",
  "before_year": 2015,
  "after_year": 2025,
  "dataset": "sentinel-2",
  "area_of_interest": null,
  "confidence_threshold": 0.85
}
```
- **Response Body:**
```json
{
  "analysis_id": "anl-mumbai-2015-2025-01",
  "status": "completed",
  "location": "Mumbai Metropolitan Region",
  "before_year": 2015,
  "after_year": 2025,
  "dataset": "sentinel-2",
  "changed_area_km2": 24.5,
  "urban_change_percent": 18.7,
  "vegetation_loss_km2": 12.4,
  "confidence": 0.926,
  "processed_at": "2025-05-12T14:32:00Z",
  "geojson": {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "id": "feat-01",
        "properties": {
          "id": "feat-01",
          "name": "Navi Mumbai International Airport Core Zone",
          "type": "urban",
          "changeType": "Urban Expansion & Earthworks",
          "areaHectares": 1160,
          "confidenceScore": 0.962,
          "detectedYear": 2024,
          "priorLandCover": "Agricultural / Coastal Marshland",
          "postLandCover": "Compacted Runway Infrastructure / Built-up",
          "spectralDeviationIndex": 0.884,
          "notes": "High-confidence transition from mudflats to leveled civil construction."
        },
        "geometry": {
          "type": "Polygon",
          "coordinates": [
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
      }
    ]
  }
}
```

### Additional Endpoints Supported
- `GET /health` - Health check ping
- `GET /analysis/:id/status` - Asynchronous job polling
- `GET /analysis/:id` - Fetch completed analysis
- `GET /analyses` - Recent analysis history
- `GET /statistics/historical?location=...` - Multi-year time series

---

## 👥 Authors & Academic Attribution
GeoVision AI Research Platform — Final-Year Engineering Thesis Project.
Developed for self-supervised satellite representation learning and environmental geospatial intelligence.
