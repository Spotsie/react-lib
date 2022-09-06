import React, { ReactNode, useMemo } from 'react';
import Pin, { Props as PinProps } from './Pin';
import { Feature, FeatureCollection } from './types';

import ReactMapGL, {
  ScaleControl,
  MapProps as MapboxProps,
} from 'react-map-gl';
import mapboxgl, { MapLayerMouseEvent } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import RasterLayer from './Layers/RasterLayer';
import EvacuationPointLayer from './Layers/EvacuationPointLayer';
import HeatmapLayer from './Layers/HeatmapLayer';
import ZoneExtrusionLayer from './Layers/ZoneExtrusionLayer';
import ZoneLayer from './Layers/ZoneLayer';

// The following is required to stop "npm build" from transpiling mapbox code
// @ts-ignore
mapboxgl.workerClass =
  require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

export const mapThemes = {
  light: 'mapbox://styles/mapbox/light-v10',
  dark: 'mapbox://styles/mapbox/dark-v10',
  satellite: 'mapbox://styles/mapbox/satellite-v9',
  satelliteStreets: 'mapbox://styles/mapbox/satellite-streets-v11',
  streets: 'mapbox://styles/mapbox/streets-v11',
  outdoors: 'mapbox://styles/mapbox/outdoors-v11',
  navigationDay: 'mapbox://styles/mapbox/navigation-day-v1',
  navigationNight: 'mapbox://styles/mapbox/navigation-night-v1',
};

export type MapTheme = keyof typeof mapThemes;

export type MapDisplayType = '3d' | 'color';

export type MapMode = 'normal' | 'heatmap';

export type MapProps = {
  children?: ReactNode;
  mapTheme?: keyof typeof mapThemes;
  onFeatureClick?: (e: Feature[]) => void;
  zoneFeatureCollection: FeatureCollection;
  subjectFeatureCollection: FeatureCollection;
  iconFeatureCollection?: FeatureCollection;
  heatmap?: MapDisplayType;
  pins?: PinProps[];
  overlay?: {
    coordinates: number[][];
    src: string;
    opacity?: number;
  };
  mode?: MapMode;
} & Omit<MapboxProps, 'fog' | 'terrain' | 'mapStyle'>;

const scaleControlStyle = {
  left: 5,
  bottom: 30,
};

export function Map({
  children,
  mapTheme = 'light',
  pins,
  zoneFeatureCollection,
  subjectFeatureCollection,
  iconFeatureCollection,
  overlay,
  heatmap,
  onFeatureClick,
  cursor = 'crosshair',
  mode = 'normal',
  ...props
}: MapProps) {
  const handleOnClick = (e: MapLayerMouseEvent) => {
    if (e.features && e.features.length > 0) {
      onFeatureClick?.(e.features);
    }
  };

  const pinMarkers = useMemo(
    () =>
      pins?.map((coords, index) => <Pin key={`pin-${index}`} {...coords} />),
    [pins]
  );

  return (
    <ReactMapGL
      mapStyle={mapThemes[mapTheme]}
      style={{
        width: '100%',
        height: '100%',
      }}
      cursor={cursor}
      onClick={handleOnClick}
      preserveDrawingBuffer={true}
      {...props}
    >
      {overlay && (
        <RasterLayer
          data={overlay.coordinates}
          src={overlay.src}
          opacity={overlay.opacity}
        />
      )}
      <ZoneLayer data={zoneFeatureCollection} />

      {mode === 'normal' && (
        <>
          {heatmap === 'color' && (
            <HeatmapLayer data={subjectFeatureCollection} mode={mode} />
          )}
          {heatmap === '3d' && <ZoneExtrusionLayer />}
        </>
      )}
      {mode === 'heatmap' && (
        <HeatmapLayer data={subjectFeatureCollection} mode={mode} />
      )}

      {iconFeatureCollection && (
        <EvacuationPointLayer data={iconFeatureCollection} />
      )}

      {pinMarkers}
      {children}
      <ScaleControl maxWidth={100} unit="metric" style={scaleControlStyle} />
    </ReactMapGL>
  );
}
