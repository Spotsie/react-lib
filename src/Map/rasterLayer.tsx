import React from 'react';
import { Layer, Source } from 'react-map-gl';

interface Props {
  data: number[][];
  src: string;
}

export const RasterLayer = ({ data, src }: Props) => {
  return (
    <>
      <Source type="image" url={src} coordinates={data} id="overlay-source" />
      <Layer source="overlay-source" id="overlay" type="raster" />
    </>
  );
};
