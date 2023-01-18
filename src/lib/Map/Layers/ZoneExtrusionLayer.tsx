import { Layer, LayerProps } from "react-map-gl";
import React from "react";

const MIN_ZOOM_LEVEL = 15;

const layerProps: LayerProps = {
  id: "zone-extrusion-layer",
  source: "zone-source",
  type: "fill-extrusion",
  minzoom: MIN_ZOOM_LEVEL,
  paint: {
    "fill-extrusion-color": "#dedede",
    "fill-extrusion-vertical-gradient": true,
    "fill-extrusion-height": [
      "interpolate",
      ["linear"],
      ["zoom"],
      MIN_ZOOM_LEVEL,
      0,
      15.05,
      ["*", ["get", "population"], 6],
    ],
    "fill-extrusion-opacity": 0.7,
  },
};

const ZoneExtrusionLayer = () => <Layer {...layerProps} />;

export default ZoneExtrusionLayer;
