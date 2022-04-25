/* eslint import/no-webpack-loader-syntax: off */
import React, { ReactNode } from 'react';
import ReactMapGL, { ScaleControl, MapEvent } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import geojson from 'geojson';
import { Feature } from 'geojson';

// Fix for webpack loading
import { EvacuationPointLayer } from './evacuationPointLayer';
import { HeatmapLayer } from './heatmapLayer';
import { ZoneExtrusionLayer } from './ZoneExtrusionLayer';

import { ZoneLayer } from './ZoneLayer';
// @ts-ignore
import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker';
import Pin, { PinProps } from './Pin';

export const mapStyles = {
  light: 'mapbox://styles/mapbox/light-v10',
  satellite: 'mapbox://styles/mapbox/satellite-v9',
};

export type MapStyle = keyof typeof mapStyles;

const scaleControlStyle = {
  left: 5,
  bottom: 30,
};

export const mapSettings = {
  maxZoom: 16,
  minZoom: 12,
};

export type MapDisplayType = '3d' | 'color';

export type MapProps = {
  children?: ReactNode;
  style?: keyof typeof mapStyles;
  onFeatureClick?: (e: Feature[]) => void;
  featureCollection: geojson.FeatureCollection;
  mapboxAccessToken: string;
  subjectLocationsData: geojson.FeatureCollection;
  iconLayer: geojson.FeatureCollection;
  heatmap?: MapDisplayType;
  colors: string[];
  pins: PinProps[];
};

export function Map({
  children,
  style = 'light',
  pins,
  colors,
  featureCollection,
  ...props
}: MapProps) {
  const [viewport, setViewport] = React.useState({
    latitude: 45.28361487544451,
    longitude: 14.53738009371364,
    zoom: 16,
  });

  const handleOnClick = (e: MapEvent) => {
    if (e.features !== undefined && e.features.length > 0) {
      props.onFeatureClick && props.onFeatureClick(e.features);
    }
  };

  const pinMarkers = pins.map((coords, index) => (
    <Pin key={`pin-${index}`} {...coords} />
  ));

  return (
    <>
      <ReactMapGL
        {...viewport}
        mapStyle={mapStyles[style]}
        mapboxApiAccessToken={props.mapboxAccessToken}
        width="100%"
        getCursor={() => 'crosshair'}
        height="100%"
        maxZoom={mapSettings.maxZoom}
        minZoom={mapSettings.minZoom}
        onClick={handleOnClick}
        onViewportChange={(
          viewport: React.SetStateAction<{
            latitude: number;
            longitude: number;
            zoom: number;
          }>
        ) => setViewport(viewport)}
      >
        <ZoneLayer data={featureCollection} colors={colors} />
        {props?.heatmap === 'color' && (
          <HeatmapLayer data={props.subjectLocationsData} />
        )}
        {props?.heatmap === '3d' && <ZoneExtrusionLayer />}

        {/*<ZoneExtrusionLayer data={props.subjectLocationsData} />*/}
        {/*<LocationClusterLayer data={props.subjectLocationsData}/>*/}

        <EvacuationPointLayer data={props.iconLayer} />
        {pinMarkers}
        {children}
        <ScaleControl maxWidth={100} unit="metric" style={scaleControlStyle} />
      </ReactMapGL>
    </>
  );
}
