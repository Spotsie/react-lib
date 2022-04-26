import { Layer, Source } from 'react-map-gl/dist/es5';
import React from 'react';
import geojson from 'geojson';
import {
  clusterLayer,
  clusterCountLayer,
  unclusteredPointLayer,
} from './layers';

type Props = {
  data: geojson.FeatureCollection;
  // style: LayerProps,
};

export function LocationClusterLayer(props: Props) {
  return (
    <Source
      cluster={true}
      clusterMaxZoom={14}
      clusterRadius={50}
      id={'subjects'}
      type={'geojson'}
      data={props.data}
    >
      <Layer {...clusterLayer} />
      <Layer {...clusterCountLayer} />
      <Layer {...unclusteredPointLayer} />
    </Source>
  );
}
