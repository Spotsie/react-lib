import {
  GeoJSONSourceRaw,
  Layer,
  LayerProps,
  Source,
  SourceProps,
} from 'react-map-gl';
import React from 'react';
import { FeatureCollection } from '../types';
import { MapMode } from '../Map';

const MAX_ZOOM_LEVEL = 21;

/*
0,
'rgba(172,38,38,0)',
0.1,
'rgba(11,243,123,0.57)',
0.4,
'rgb(69,241,187)',
0.6,
'rgb(17,236,141)',
1,
'rgb(17,116,236)'
*/

const sourceProps: SourceProps & GeoJSONSourceRaw = {
  id: 'heatmap-source',
  type: 'geojson',
};

const layerProps: LayerProps = {
  id: 'heatmap-layer',
  beforeId: 'zone-population-layer',
  maxzoom: MAX_ZOOM_LEVEL,
  type: 'heatmap',
  paint: {
    'heatmap-intensity': [
      'interpolate',
      ['linear'],
      ['zoom'],
      0,
      1,
      MAX_ZOOM_LEVEL,
      3,
    ],
    'heatmap-color': [
      'interpolate',
      ['linear'],
      ['heatmap-density'],
      0,
      'rgba(172,38,38,0)',
      0.01,
      'rgba(11,243,123,0.57)',
      0.4,
      'rgb(69,241,187)',
      0.6,
      'rgb(17,236,141)',
      1,
      'rgb(55,141,239)',
    ],
    'heatmap-radius': [
      'interpolate',
      ['linear'],
      ['zoom'],
      0,
      20,
      MAX_ZOOM_LEVEL,
      25,
    ],
  },
};

const impreciseLayerProps: LayerProps = {
  id: 'heatmap-layer',
  beforeId: 'zone-population-layer',
  type: 'heatmap',
  paint: {
    'heatmap-intensity': 1,
    'heatmap-color': [
      'interpolate',
      ['linear'],
      ['heatmap-density'],
      0,
      'rgba(172,38,38,0)',
      0.01,
      'rgba(11,243,123,0.57)',
      0.4,
      'rgb(69,241,187)',
      0.6,
      'rgb(17,236,141)',
      1,
      'rgb(55,141,239)',
    ],
    'heatmap-radius': 100,
    'heatmap-weight': 1000,
  },
};

type Props = {
  data: FeatureCollection;
  mode: MapMode;
};

const HeatmapLayer = ({ data, mode }: Props) => (
  <Source data={data} {...sourceProps}>
    {mode === 'normal' && <Layer {...layerProps} />}
    {mode === 'heatmap' && <Layer {...impreciseLayerProps} />}
  </Source>
);

export default HeatmapLayer;
