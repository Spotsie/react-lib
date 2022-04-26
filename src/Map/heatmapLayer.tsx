import geojson from 'geojson';
import { Layer, LayerProps, Source } from 'react-map-gl/dist/es5';
import React from 'react';

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

* */

export const heatmapLayer: LayerProps = {
  id: 'heatmap-layer',
  maxzoom: MAX_ZOOM_LEVEL,
  type: 'heatmap',
  paint: {
    // Increase the heatmap weight based on frequency and property magnitude
    // 'heatmap-weight': ['interpolate', ['linear'], ['get', 'location'], 0, 0, 6, 1],
    // Increase the heatmap color weight weight by zoom level
    // heatmap-intensity is a multiplier on top of heatmap-weight
    'heatmap-intensity': [
      'interpolate',
      ['linear'],
      ['zoom'],
      0,
      1,
      MAX_ZOOM_LEVEL,
      3,
    ],
    // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
    // Begin color ramp at 0-stop with a 0-transparancy color
    // to create a blur-like effect.
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
    // Adjust the heatmap radius by zoom level
    'heatmap-radius': [
      'interpolate',
      ['linear'],
      ['zoom'],
      0,
      20,
      MAX_ZOOM_LEVEL,
      25,
    ],
    // Transition from heatmap to circle layer by zoom level
    // 'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 7, 1, 9, 0]
  },
};

type Props = {
  data: geojson.FeatureCollection;
  // style: LayerProps,
};
export function HeatmapLayer(props: Props) {
  return (
    <Source id={'subjects'} type={'geojson'} data={props.data}>
      <Layer beforeId={'zone-population'} {...heatmapLayer} />
    </Source>
  );
}
