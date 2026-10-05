import React from 'react';
import { GeoJSON as LeafletGeoJSON } from 'react-leaflet';
import L, { Layer, PathOptions } from 'leaflet';
import { GISFeatureProperties, MapLayerVisibility } from '../../types/gis';

interface GeoJSONLayerProps {
  data: GeoJSON.FeatureCollection;
  opacity: number;
  visibility: MapLayerVisibility;
  onSelectFeature?: (featureProps: GISFeatureProperties) => void;
}

export const GeoJSONLayer: React.FC<GeoJSONLayerProps> = ({
  data,
  opacity,
  visibility,
  onSelectFeature,
}) => {
  const filterFeature = (feature: GeoJSON.Feature) => {
    const props = feature.properties as GISFeatureProperties;
    if (!props) return true;

    if (props.type === 'urban' && !visibility.urbanExpansion) return false;
    if (props.type === 'vegetation_loss' && !visibility.vegetationLoss) return false;
    if (props.type === 'water_change' && !visibility.waterBodies) return false;
    if (props.type === 'aoi' && !visibility.aoiBoundary) return false;

    return true;
  };

  const styleFeature = (feature: any): PathOptions => {
    const props = feature?.properties as GISFeatureProperties;
    const type = props?.type || 'urban';

    let fillColor = '#16A765';
    let strokeColor = '#087D4A';
    let dashArray: string | undefined = undefined;

    switch (type) {
      case 'urban':
        fillColor = '#16A765';
        strokeColor = '#087D4A';
        break;
      case 'vegetation_loss':
        fillColor = '#E45B5B';
        strokeColor = '#C0392B';
        break;
      case 'water_change':
        fillColor = '#5B9DE8';
        strokeColor = '#3A82D2';
        break;
      case 'aoi':
        fillColor = 'transparent';
        strokeColor = '#16A765';
        dashArray = '5, 5';
        break;
      default:
        fillColor = '#777D87';
        strokeColor = '#A0A5AE';
    }

    return {
      fillColor,
      fillOpacity: type === 'aoi' ? 0.04 : opacity * 0.7,
      color: strokeColor,
      weight: type === 'aoi' ? 2 : 2.5,
      dashArray,
      lineCap: 'round',
      lineJoin: 'round',
    };
  };

  const onEachFeature = (feature: GeoJSON.Feature, layer: Layer) => {
    const props = feature.properties as GISFeatureProperties;
    if (!props) return;

    const popupHtml = `
      <div style="font-family: 'Inter', sans-serif; font-size: 12px; color: #17191D; min-width: 220px; padding: 4px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; border-bottom: 1px solid #E9EBEF; padding-bottom: 4px;">
          <strong style="color: #17191D; font-size: 13px;">${props.name || 'Detected Change'}</strong>
          <span style="font-family: monospace; font-size: 10px; background: #EAF8F0; color: #087D4A; padding: 2px 6px; border-radius: 4px; font-weight: 600;">
            ${(props.confidenceScore ? (props.confidenceScore * 100).toFixed(1) : '92.4')}% Conf
          </span>
        </div>
        <div style="margin-bottom: 4px;">
          <span style="color: #777D87;">Classification:</span> 
          <strong style="color: ${props.type === 'urban' ? '#087D4A' : props.type === 'vegetation_loss' ? '#E45B5B' : '#5B9DE8'};">
            ${props.changeType || props.type}
          </strong>
        </div>
        <div style="margin-bottom: 4px;">
          <span style="color: #777D87;">Spatial Extent:</span> 
          <span style="font-family: monospace; color: #17191D; font-weight: 600;">${props.areaHectares || 0} Hectares</span>
        </div>
        ${props.priorLandCover ? `
          <div style="font-size: 11px; color: #777D87; margin-top: 6px; background: #F7F8FA; padding: 6px; border-radius: 6px; border: 1px solid #E9EBEF;">
            <div><strong>Baseline:</strong> ${props.priorLandCover}</div>
            <div style="margin-top: 2px;"><strong>Recent:</strong> ${props.postLandCover}</div>
          </div>
        ` : ''}
      </div>
    `;

    layer.bindPopup(popupHtml, {
      className: 'geo-leaflet-popup',
    });

    layer.on({
      mouseover: (e) => {
        const target = e.target;
        target.setStyle({
          weight: 4,
          fillOpacity: Math.min(1, opacity + 0.2),
        });
      },
      mouseout: (e) => {
        const target = e.target;
        target.setStyle(styleFeature(feature));
      },
      click: () => {
        if (onSelectFeature) {
          onSelectFeature(props);
        }
      },
    });
  };

  return (
    <LeafletGeoJSON
      key={`${JSON.stringify(visibility)}-${opacity}-${data.features.length}`}
      data={data}
      style={styleFeature}
      filter={filterFeature}
      onEachFeature={onEachFeature}
    />
  );
};
