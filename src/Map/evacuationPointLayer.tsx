import { Layer, LayerProps, Source } from 'react-map-gl/dist/es5';
import React, { useState } from 'react';
import geojson from 'geojson';

const initialLayerStyle: LayerProps = {
  id: 'data',
  type: 'symbol',
  source: 'evacuationPoint',
  paint: {
    'icon-color': '#c43333',
  },
  layout: {
    'text-field': ['concat', 'gateway ', ['get', 'id']],
    'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
    'icon-image': ['get', 'icon'],
    'text-radial-offset': 1,
    'text-size': ['interpolate', ['linear'], ['zoom'], 10, 0.5, 18, 1],
    'icon-size': ['interpolate', ['linear'], ['zoom'], 10, 0.8, 18, 1],
    'text-allow-overlap': true,
    'icon-allow-overlap': true,
  },
};

type Props = {
  data: geojson.FeatureCollection;
};
export function EvacuationPointLayer(props: Props) {
  const [layerStyle] = useState(initialLayerStyle);

  return (
    <Source
      cluster={false}
      id={'evacuationPoint'}
      type={'geojson'}
      data={props.data}
    >
      <Layer {...layerStyle} />
    </Source>
  );
}
