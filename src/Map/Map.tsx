/* eslint import/no-webpack-loader-syntax: off */
import React, { ReactNode } from 'react';
import ReactMapGL, { ScaleControl, ViewState } from 'react-map-gl/dist/es5';
import 'mapbox-gl/dist/mapbox-gl.css';
import geojson from 'geojson';
import { Feature } from 'geojson';

// Fix for webpack loading
import { EvacuationPointLayer } from './evacuationPointLayer';
import { HeatmapLayer } from './heatmapLayer';
import { ZoneExtrusionLayer } from './ZoneExtrusionLayer';

import { ZoneLayer } from './ZoneLayer';

import mapboxgl from 'mapbox-gl';

// The following is required to stop "npm build" from transpiling mapbox code.
// notice the exclamation point in the import.
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
mapboxgl.workerClass =
  require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

import Pin, { PinProps } from './Pin';
import { MapLayerMouseEvent } from 'mapbox-gl';

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
  iconLayer?: geojson.FeatureCollection;
  heatmap?: MapDisplayType;
  colors: string[];
  pins?: PinProps[];
  initialViewState?: Partial<ViewState>;
};

export function Map({
  children,
  style = 'light',
  pins,
  colors,
  featureCollection,
  iconLayer,
  mapboxAccessToken,
  initialViewState,
  ...props
}: MapProps) {
  const handleOnClick = (e: MapLayerMouseEvent) => {
    if (e.features !== undefined && e.features.length > 0) {
      props.onFeatureClick && props.onFeatureClick(e.features);
    }
  };

  const pinMarkers = pins?.map((coords, index) => (
    <Pin key={`pin-${index}`} {...coords} />
  ));

  return (
    <>
      <ReactMapGL
        mapStyle={mapStyles[style]}
        mapboxAccessToken={mapboxAccessToken}
        style={{
          width: '100%',
          height: '100%',
        }}
        cursor="crosshair"
        maxZoom={mapSettings.maxZoom}
        minZoom={mapSettings.minZoom}
        onClick={handleOnClick}
        initialViewState={initialViewState}
        preserveDrawingBuffer={true}
      >
        <ZoneLayer data={featureCollection} colors={colors} />
        {props?.heatmap === 'color' && (
          <HeatmapLayer data={props.subjectLocationsData} />
        )}
        {props?.heatmap === '3d' && <ZoneExtrusionLayer />}

        {/*<ZoneExtrusionLayer data={props.subjectLocationsData} />*/}
        {/*<LocationClusterLayer data={props.subjectLocationsData}/>*/}

        {iconLayer && <EvacuationPointLayer data={iconLayer} />}
        {pinMarkers}
        {children}
        <ScaleControl maxWidth={100} unit="metric" style={scaleControlStyle} />
      </ReactMapGL>
    </>
  );
}
