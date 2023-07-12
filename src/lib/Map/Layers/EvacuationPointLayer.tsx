import React from "react";
import { Layer, LayerProps, Source, SourceProps } from "react-map-gl";
import { FeatureCollection } from "../types";

const sourceProps: SourceProps & any = {
  id: "evacuation-point-source",
  type: "geojson",
  cluster: false,
};

const layerProps: LayerProps = {
  id: "evacuation-point-layer",
  type: "symbol",
  paint: {
    "icon-color": "#c43333",
  },
  layout: {
    "text-field": ["concat", "gateway ", ["get", "id"]],
    "text-variable-anchor": ["top", "bottom", "left", "right"],
    "icon-image": ["get", "icon"],
    "text-radial-offset": 1,
    "text-size": ["interpolate", ["linear"], ["zoom"], 10, 0.5, 18, 1],
    "icon-size": ["interpolate", ["linear"], ["zoom"], 10, 0.8, 18, 1],
    "text-allow-overlap": true,
    "icon-allow-overlap": true,
  },
};

type Props = {
  data: FeatureCollection;
};

const EvacuationPointLayer = ({ data }: Props) => (
  <Source data={data} {...sourceProps}>
    <Layer {...layerProps} />
  </Source>
);

export default EvacuationPointLayer;
