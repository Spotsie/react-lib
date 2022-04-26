import geojson from 'geojson';
import React from 'react';
import { Layer, LayerProps, Source } from 'react-map-gl/dist/es5';

const getColorStops = (colors: string[]) => [
  [1, colors[0]],
  [2, colors[1]],
  [3, colors[2]],
  [4, colors[3]],
  [5, colors[4]],
  [6, colors[5]],
  [7, colors[6]],
  [8, colors[7]],
  [9, colors[8]],
  [10, colors[9]],
];

const zoneFillLayerStyle = (colors: string[]): LayerProps => ({
  id: 'zone-fill',
  type: 'fill',
  paint: {
    'fill-color': {
      property: 'id',
      stops: getColorStops(colors),
    },
    'fill-opacity': 0.8,
  },
});

//@ts-ignore
const zoneSymbolLayerStyle: LayerProps = {
  id: 'zone-symbol',
  type: 'symbol',
  source: 'places',
  layout: {
    // These icons are a part of the Mapbox Light style.
    // To view all images available in a Mapbox style, open
    // the style in Mapbox Studio and click the "Images" tab.
    // To add a new image to the style at runtime see
    // https://docs.mapbox.com/mapbox-gl-js/example/add-image/
    'icon-image': `marker-11`,
    'icon-allow-overlap': true,
    'text-field': ['get', 'population'],
    'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
    'text-size': 11,
    'text-transform': 'uppercase',
    'text-letter-spacing': 0.05,
    'text-offset': [0, 1.5],
  },
  paint: {
    'text-color': '#202',
    'text-halo-color': '#fff',
    'text-halo-width': 1,
  },
};

const ZonePopulationLayer: LayerProps = {
  id: 'zone-population',
  type: 'symbol',
  layout: {
    // These icons are a part of the Mapbox Light style.
    // To view all images available in a Mapbox style, open
    // the style in Mapbox Studio and click the "Images" tab.
    // To add a new image to the style at runtime see
    // https://docs.mapbox.com/mapbox-gl-js/example/add-image/
    'icon-image': 'marker-11',
    'icon-allow-overlap': true,
    'text-field': [
      'format',
      'zone-name',
      '\n',
      ' (',
      ['get', 'population'],
      ')',
    ],
    'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
    'text-size': 11,
    'text-transform': 'uppercase',
    'text-letter-spacing': 0.05,
    'text-offset': [0, 1.5],
  },
  paint: {
    'text-color': '#202',
    'text-halo-color': '#fff',
    'text-halo-width': 1,
  },
  filter: ['!=', 'population', 0],
};

type Props = {
  data: geojson.FeatureCollection;
  colors: string[];
};

export function ZoneLayer({ data, colors }: Props) {
  const fillLayerStyle = {
    ...zoneFillLayerStyle(colors),
    paint: { 'fill-color': '#366fe0', 'fill-opacity': 0.2 },
  };

  return (
    <Source cluster={false} id={'zone'} type={'geojson'} data={data}>
      {/*<Marker longitude={14.5370998} latitude={45.2841079}>*/}
      {/*  Something*/}
      {/*</Marker>*/}
      {/*<Layer {...zoneSymbolLayerStyle}/>*/}
      <Layer {...ZonePopulationLayer} />
      <Layer beforeId={'zone-population'} {...fillLayerStyle} />
    </Source>
  );
}
