import React from "react";
import { Layer, LayerProps, Source, SourceProps } from "react-map-gl";

const sourceProps: SourceProps = {
  id: "overlay-source",
  type: "image",
};
const layerProps: LayerProps = {
  id: "overlay-layer",
  beforeId: "zone-fill-layer",
  type: "raster",
};

export type Props = {
  data: number[][];
  src: string;
  opacity?: number;
};

const RasterLayer = ({ data, src, opacity = 1 }: Props) => (
  <Source url={src} coordinates={data} {...sourceProps}>
    <Layer paint={{ "raster-opacity": opacity }} {...layerProps} />
  </Source>
);

export default RasterLayer;
