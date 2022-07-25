import {
  GeoJSONSourceRaw,
  Layer,
  LayerProps,
  Source,
  SourceProps,
} from 'react-map-gl';
import React from 'react';
import { FeatureCollection } from '../types';

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

type Props = {
  data: FeatureCollection;
};

const HeatmapLayer = ({ data }: Props) => (
  <Source data={data} {...sourceProps}>
    <Layer {...layerProps} />
  </Source>
);

export default HeatmapLayer;
