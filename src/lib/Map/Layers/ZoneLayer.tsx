import React from "react";
import { Layer, LayerProps, Source, SourceProps } from "react-map-gl";
import { FeatureCollection } from "../types";

const sourceProps: SourceProps = {
  id: "zone-source",
  type: "geojson",
  cluster: false,
};

const getZoneFillLayerProps = (colors: Array<string>): LayerProps => ({
  id: "zone-fill-layer",
  beforeId: "zone-population-layer",
  type: "fill",
  paint: {
    "fill-color": {
      property: "index",
      stops: colors.map((color, index) => [index, color]),
    } as any,
    "fill-opacity": [
      "case",
      ["boolean", ["get", "highlighted"], false],
      0.8,
      0.2,
    ],
  },
});

const zonePopulationLayerProps: LayerProps = {
  id: "zone-population-layer",
  type: "symbol",
  layout: {
    "icon-image": "marker-11",
    "text-field": [
      "format",
      ["get", "zoneName"],
      "\n",
      " (",
      ["get", "population"],
      ")",
    ],
    "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
    "text-size": 13,
    "text-transform": "uppercase",
    "text-letter-spacing": 0.05,
    "text-offset": [0, 2.4],
  },
  paint: {
    "text-color": "#202",
    "text-halo-color": "#fff",
    "text-halo-width": 1,
  },
  filter: ["!=", "population", 0],
};

type Props = {
  data: FeatureCollection;
  colors: Array<string>;
  approximationMode: boolean;
};

const ZoneLayer = ({ data, colors, approximationMode }: Props) => (
  <Source
    data={{
      type: "FeatureCollection",
      features: data.features.map((f, index) => ({
        ...f,
        properties: {
          ...f.properties,
          index,
          geometry: (f as any).geometry,
        },
      })),
    }}
    {...sourceProps}
  >
    <Layer {...zonePopulationLayerProps} />
    {approximationMode ? (
      <Layer {...getZoneFillLayerProps(colors)} beforeId="tracker-id-layer" />
    ) : (
      <Layer {...getZoneFillLayerProps(colors)} />
    )}
  </Source>
);

export default ZoneLayer;
