import React, { ReactNode } from "react";
import {
  GeoJSONSourceRaw,
  Layer,
  LayerProps,
  Source,
  SourceProps,
} from "react-map-gl";
import Pin from "../Pin";
import { Feature, FeatureCollection, Point } from "../types";

const sourceProps: SourceProps & GeoJSONSourceRaw = {
  id: "approximation-source",
  type: "geojson",
};

const trackerIdLayerProps: LayerProps = {
  id: "tracker-id-layer",
  type: "symbol",
  layout: {
    "icon-image": "marker-11",
    "text-field": ["format", ["get", "trackerId"]],
    "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
    "text-size": 14,
    "text-transform": "uppercase",
    "text-letter-spacing": 0.05,
    "text-offset": [0, 1.6],
  },
  paint: {
    "text-color": "#202",
    "text-halo-color": "#fff",
    "text-halo-width": 1,
  },
  filter: ["!=", "trackerId", 0],
};

const layerProps: LayerProps = {
  id: "approximation-layer",
  beforeId: "tracker-id-layer",
  type: "circle",
  paint: {
    "circle-color": "#ff0000",
    "circle-opacity": 0.4,
    "circle-radius": {
      stops: [
        [0, 0],
        [22, 200],
      ],
      base: 1.8,
    },
    "circle-stroke-width": 3,
    "circle-stroke-color": "lime",
  },
};

type Props = {
  data?: FeatureCollection<Point>;
  popup?: boolean;
  onFeatureClick?(properties: { [key: string]: any }): ReactNode;
};

const ApproximationLayer = ({ data, popup, onFeatureClick }: Props) => {
  const pins = data?.features.map(
    ({ geometry, properties }: Feature<Point>) => (
      <Pin
        latitude={geometry.coordinates[1]}
        longitude={geometry.coordinates[0]}
        properties={properties}
        popup={popup}
        onFeatureClick={onFeatureClick}
      />
    )
  );

  return (
    <>
      {pins}

      <Source data={data} {...sourceProps}>
        <Layer {...trackerIdLayerProps} />
        <Layer {...layerProps} />
      </Source>
    </>
  );
};

export default ApproximationLayer;
