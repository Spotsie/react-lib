import React from "react";
import { Layer, LayerProps, Source, SourceProps } from "react-map-gl";
import { FeatureCollection } from "../types";

const sourceProps: SourceProps & any = {
  id: "zone-source",
  type: "geojson",
  cluster: false,
};

const zoneFillLayerProps: LayerProps = {
  id: "zone-fill-layer",
  beforeId: "zone-population-layer",
  type: "fill",
  paint: {
    "fill-color": "#366fe0",
    "fill-opacity": 0.2,
  },
};

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
    "text-size": 11,
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
};

const ZoneLayer = ({ data }: Props) => (
  <Source data={data} {...sourceProps}>
    <Layer {...zonePopulationLayerProps} />
    <Layer {...zoneFillLayerProps} />
  </Source>
);

export default ZoneLayer;
