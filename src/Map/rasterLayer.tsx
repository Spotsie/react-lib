import React from 'react';
import { Layer, Source } from 'react-map-gl';

interface Props {
  data: number[][];
  src: string;
  opacity?: number;
}

export const RasterLayer = ({ data, src, opacity }: Props) => {
  return (
    <>
      <Source type="image" url={src} coordinates={data} id="overlay-source">
        <Layer
          beforeId="zone-fill"
          source="overlay-source"
          id="overlay"
          type="raster"
          paint={{ 'raster-opacity': opacity }}
        />
      </Source>
    </>
  );
};
