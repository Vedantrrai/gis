import React, { useState, useEffect, useRef } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  ScaleControl, 
  useMap, 
  useMapEvents,
  Rectangle,
  Popup
} from 'react-leaflet';
import L, { LatLngBoundsExpression } from 'leaflet';
import { 
  Maximize2, 
  Minimize2, 
  Compass, 
  LocateFixed, 
  MapPin
} from 'lucide-react';
import { TILE_PROVIDERS } from '../../data/demoData';
import { MapLayerVisibility, GISFeatureProperties } from '../../types/gis';
import { GeoJSONLayer } from './GeoJSONLayer';
import { LayerControl } from './LayerControl';
import { MapLegend } from './MapLegend';

// Leaflet default icon fix
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface ChangeDetectionMapProps {
  center: [number, number];
  zoom: number;
  geojson?: GeoJSON.FeatureCollection;
  bbox?: [number, number, number, number]; // [minLat, minLng, maxLat, maxLng]
  locationName: string;
  onSelectFeature?: (props: GISFeatureProperties) => void;
  className?: string;
  height?: string;
  isDemo?: boolean;
}

// Controller to fly map to coordinates when center or bbox changes
const MapController: React.FC<{
  center: [number, number];
  zoom: number;
  bbox?: [number, number, number, number];
}> = ({ center, zoom, bbox }) => {
  const map = useMap();

  useEffect(() => {
    if (bbox) {
      const bounds: LatLngBoundsExpression = [
        [bbox[0], bbox[1]],
        [bbox[2], bbox[3]]
      ];
      map.fitBounds(bounds, { padding: [30, 30], maxZoom: 14 });
    } else {
      map.flyTo(center, zoom, { duration: 1.2 });
    }
  }, [center, zoom, bbox, map]);

  return null;
};

// Coordinate tracker
const CoordinateTracker: React.FC<{
  onUpdateCoords: (coords: { lat: number; lng: number }) => void;
}> = ({ onUpdateCoords }) => {
  useMapEvents({
    mousemove(e) {
      onUpdateCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
    click(e) {
      onUpdateCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
    }
  });

  return null;
};

export const ChangeDetectionMap: React.FC<ChangeDetectionMapProps> = ({
  center,
  zoom,
  geojson,
  bbox,
  locationName,
  onSelectFeature,
  className = '',
  height = '500px',
  isDemo = true,
}) => {
  const [selectedBasemapId, setSelectedBasemapId] = useState('carto-light');
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({ lat: center[0], lng: center[1] });
  const [opacity, setOpacity] = useState<number>(0.75);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [layerVisibility, setLayerVisibility] = useState<MapLayerVisibility>({
    basemap: true,
    aoiBoundary: true,
    detectedChanges: true,
    urbanExpansion: true,
    vegetationLoss: true,
    waterBodies: true,
    labels: true,
  });

  const mapWrapperRef = useRef<HTMLDivElement>(null);
  const selectedBasemap = TILE_PROVIDERS.find(b => b.id === selectedBasemapId) || TILE_PROVIDERS[0];

  const handleToggleLayer = (key: keyof MapLayerVisibility) => {
    setLayerVisibility(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleToggleFullscreen = () => {
    if (!mapWrapperRef.current) return;
    if (!document.fullscreenElement) {
      mapWrapperRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const aoiBounds: LatLngBoundsExpression | null = bbox ? [
    [bbox[0], bbox[1]],
    [bbox[2], bbox[3]]
  ] : null;

  return (
    <div 
      ref={mapWrapperRef}
      className={`relative w-full rounded-xl overflow-hidden border border-[#E9EBEF] bg-[#F7F8FA] shadow-geo transition-all ${className} ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen' : ''
      }`}
      style={{ height: isFullscreen ? '100vh' : height }}
    >
      {/* Top Map Toolbar */}
      <div className="absolute top-3 left-3 right-3 z-[1000] flex flex-wrap items-center justify-between pointer-events-none gap-2">
        {/* Left: Region Tag */}
        <div className="pointer-events-auto flex items-center gap-2 bg-white/95 backdrop-blur-sm border border-[#E9EBEF] px-3 py-1.5 rounded-lg shadow-geo text-xs">
          <span className="w-2 h-2 rounded-full bg-[#16A765]" />
          <span className="font-semibold text-[#17191D]">{locationName}</span>
          <span className="text-[#A0A5AE]">|</span>
          <span className="text-[#777D87] font-mono text-[11px]">WGS84 EPSG:4326</span>
          {isDemo && (
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#F3F4F6] text-[#777D87] font-mono">
              Demo
            </span>
          )}
        </div>

        {/* Right: Quick Action Controls */}
        <div className="pointer-events-auto flex items-center gap-1.5">
          <button
            onClick={handleToggleFullscreen}
            className="p-1.5 rounded-lg bg-white/95 backdrop-blur-sm border border-[#E9EBEF] text-[#777D87] hover:text-[#17191D] hover:bg-[#F3F4F6] shadow-geo transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'View Fullscreen'}
            id="fullscreen-toggle-button"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Map Instance */}
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        zoomControl={false}
        className="w-full h-full"
      >
        <MapController center={center} zoom={zoom} bbox={bbox} />
        <CoordinateTracker onUpdateCoords={setCoords} />
        <ScaleControl position="bottomleft" imperial={false} />

        {/* Selected Basemap Tile Provider */}
        {layerVisibility.basemap && (
          <TileLayer
            key={selectedBasemap.id}
            url={selectedBasemap.url}
            attribution={selectedBasemap.attribution}
            maxZoom={selectedBasemap.maxZoom}
            subdomains={selectedBasemap.subdomains || ['a', 'b', 'c']}
          />
        )}

        {/* AOI Boundary Rectangle */}
        {layerVisibility.aoiBoundary && aoiBounds && (
          <Rectangle
            bounds={aoiBounds}
            pathOptions={{
              color: '#16A765',
              weight: 2,
              dashArray: '5, 5',
              fillColor: '#16A765',
              fillOpacity: 0.03,
            }}
          >
            <Popup className="geo-leaflet-popup">
              <div className="p-1 text-xs">
                <div className="font-semibold text-[#16A765]">Area of Interest (AOI)</div>
                <div className="text-[#777D87] text-[11px] mt-0.5">{locationName} Core Monitoring Zone</div>
              </div>
            </Popup>
          </Rectangle>
        )}

        {/* Vector GeoJSON Change Polygons */}
        {geojson && (
          <GeoJSONLayer
            data={geojson}
            opacity={opacity}
            visibility={layerVisibility}
            onSelectFeature={onSelectFeature}
          />
        )}
      </MapContainer>

      {/* Floating GIS Layer Control (Top Right) */}
      <div className="absolute top-12 right-3 z-[1000] w-60">
        <LayerControl
          visibility={layerVisibility}
          onToggleLayer={handleToggleLayer}
          selectedBasemapId={selectedBasemapId}
          onSelectBasemap={setSelectedBasemapId}
          opacity={opacity}
          onChangeOpacity={setOpacity}
        />
      </div>

      {/* Floating Map Legend (Bottom Right) */}
      <div className="absolute bottom-5 right-3 z-[1000] hidden sm:block">
        <MapLegend isDemo={isDemo} />
      </div>

      {/* Bottom Floating Coordinate Indicator */}
      <div className="absolute bottom-3 left-18 z-[1000] pointer-events-none">
        <div className="bg-white/95 backdrop-blur-sm border border-[#E9EBEF] px-2.5 py-1 rounded-md shadow-geo text-[11px] font-mono text-[#777D87] flex items-center gap-2">
          <Compass className="w-3.5 h-3.5 text-[#16A765]" />
          <span>LAT: <strong className="text-[#17191D]">{coords.lat.toFixed(4)}°</strong></span>
          <span>LNG: <strong className="text-[#17191D]">{coords.lng.toFixed(4)}°</strong></span>
        </div>
      </div>
    </div>
  );
};
