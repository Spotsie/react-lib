import React from "react";
import { Layer, LayerProps, Source, SourceProps } from "react-map-gl";
import { FeatureCollection, Point } from "../types";

const getMetersPerPixel = (latitude: number, zoomLevel: number) => {
  const earthCircumference = 40_075_017;
  const latitudeRadians = latitude * (Math.PI / 180);

  return (
    (earthCircumference * Math.cos(latitudeRadians)) /
    Math.pow(2, zoomLevel + 8)
  );
};

const getScaledPixels = (latitude: number, zoomLevel: number, meters: number) =>
  meters / getMetersPerPixel(latitude, zoomLevel);
console.log(
  new Array(23)
    .fill(0)
    .map((_, zoomLevel) => [
      zoomLevel,
      getScaledPixels(46.225422090923665, zoomLevel, 10) / 167,
    ])
);

const sourceProps: SourceProps & any = {
  id: "approximation-source",
  type: "geojson",
};

const trackerIdLayerProps: LayerProps = {
  id: "tracker-id-layer",
  type: "symbol",

  layout: {
    "text-field": ["format", ["get", "trackerId"]],
    "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
    "text-size": 14,
    "text-transform": "uppercase",
    "text-letter-spacing": 0.05,
  },
  paint: {
    "text-color": "#fff",
  },
  filter: ["!=", "trackerId", 0],
};

const layerProps: LayerProps = {
  id: "approximation-layer",
  beforeId: "tracker-id-layer",
  type: "symbol",
  source: "approximation-source",
  layout: {
    "icon-image": "circle",
    "icon-size": [
      "interpolate",
      ["linear"],
      ["zoom"],
      ...new Array(23)
        .fill(0)
        .map((_, zoomLevel) => [
          zoomLevel,
          (getScaledPixels(46.225422090923665, zoomLevel, 10) / 167) * 2,
        ])
        .flat(),
    ],
    visibility: "visible",
    "icon-allow-overlap": true,
  },
};
type Props = {
  data?: FeatureCollection<Point>;
};

const ApproximationLayer = ({ data }: Props) => (
  <Source data={data} {...sourceProps}>
    <Layer {...trackerIdLayerProps} />
    <Layer {...layerProps} />
  </Source>
);

export default ApproximationLayer;
