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

const layerProps: LayerProps = {
  id: "approximation-layer",
  type: "circle",
  paint: {
    "circle-color": "#add8e6",
    "circle-opacity": 0.3,
    "circle-radius": {
      stops: [
        [0, 0],
        [22, 200],
      ],
      base: 2,
    },
    "circle-stroke-width": 2,
    "circle-stroke-color": "#2e7e98",
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
        <Layer {...layerProps} />
      </Source>
    </>
  );
};

export default ApproximationLayer;
