import { Layer, LayerProps } from 'react-map-gl';
import React from 'react';

export const zoneExtrusionLayer: LayerProps = {
  id: 'add-3d-buildings',
  // 'filter': ['==', 'extrude', 'true'],
  source: 'zone',
  type: 'fill-extrusion',
  minzoom: 15,
  paint: {
    'fill-extrusion-color': '#dedede',
    'fill-extrusion-vertical-gradient': true,

    // Use an 'interpolate' expression to
    // add a smooth transition effect to
    // the buildings as the user zooms in.
    'fill-extrusion-height': [
      'interpolate',
      ['linear'],
      ['zoom'],
      15,
      0,
      15.05,
      ['get', 'population'],
    ],
    // 'fill-extrusion-base': [
    //     'interpolate',
    //     ['linear'],
    //     ['zoom'],
    //     15,
    //     0,
    //     15.05,
    //     ['get', 'min_height']
    // ],
    'fill-extrusion-opacity': 0.7,
  },
};

export function ZoneExtrusionLayer() {
  return (
    // <Source
    //     id={"zones"}
    //     type={"geojson"}
    //     data={props.data}
    // >
    <Layer {...zoneExtrusionLayer} />
    // </Source>
  );
}
