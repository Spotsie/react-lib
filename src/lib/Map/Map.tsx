import React, { ReactNode, useMemo } from "react";
import Pin, { Props as PinProps } from "./Pin";
import { FeatureCollection, Point } from "./types";

import ReactMapGL, {
  ScaleControl,
  MapProps as MapboxProps,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import RasterLayer from "./Layers/RasterLayer";
import EvacuationPointLayer from "./Layers/EvacuationPointLayer";
import HeatmapLayer from "./Layers/HeatmapLayer";
import ZoneExtrusionLayer from "./Layers/ZoneExtrusionLayer";
import ZoneLayer from "./Layers/ZoneLayer";
import ApproximationLayer from "./Layers/ApproximationLayer";

export const mapThemes = {
  light: "mapbox://styles/mapbox/light-v10",
  dark: "mapbox://styles/mapbox/dark-v10",
  satellite: "mapbox://styles/mapbox/satellite-v9",
  satelliteStreets: "mapbox://styles/mapbox/satellite-streets-v11",
  streets: "mapbox://styles/mapbox/streets-v11",
  outdoors: "mapbox://styles/mapbox/outdoors-v11",
  navigationDay: "mapbox://styles/mapbox/navigation-day-v1",
  navigationNight: "mapbox://styles/mapbox/navigation-night-v1",
};

export type MapTheme = keyof typeof mapThemes;

export type MapDisplayType = "3d" | "color";

export type MapMode = "normal" | "heatmap" | "approximation";

export type MapProps = {
  children?: ReactNode;
  mapTheme?: keyof typeof mapThemes;
  onFeatureClick?(properties: { [key: string]: any }): ReactNode;
  zoneFeatureCollection: FeatureCollection;
  subjectFeatureCollection: FeatureCollection<Point>;
  iconFeatureCollection?: FeatureCollection;
  heatmap?: MapDisplayType;
  pins?: PinProps[];
  overlay?: {
    coordinates: number[][];
    src: string;
    opacity?: number;
  };
  mode?: MapMode;
} & Omit<MapboxProps, "fog" | "terrain" | "mapStyle">;

const scaleControlStyle = {
  left: 5,
  bottom: 30,
};

export function Map({
  children,
  mapTheme = "light",
  pins,
  zoneFeatureCollection,
  subjectFeatureCollection,
  iconFeatureCollection,
  overlay,
  heatmap,
  onFeatureClick,
  cursor = "crosshair",
  mode = "normal",
  ...props
}: MapProps) {
  const pinMarkers = useMemo(
    () =>
      pins?.map((coords, index) => (
        <Pin
          popup={onFeatureClick !== undefined}
          onFeatureClick={onFeatureClick}
          key={`pin-${index}`}
          {...coords}
        />
      )),
    [pins]
  );

  return (
    <ReactMapGL
      mapStyle={mapThemes[mapTheme]}
      style={{
        width: "100%",
        height: "100%",
      }}
      cursor={cursor}
      preserveDrawingBuffer={true}
      {...props}
    >
      {overlay && (
        <RasterLayer
          data={overlay.coordinates}
          src={overlay.src}
          opacity={overlay.opacity}
        />
      )}
      <ZoneLayer data={zoneFeatureCollection} />

      {mode === "normal" && (
        <>
          {heatmap === "color" && (
            <HeatmapLayer data={subjectFeatureCollection} mode={mode} />
          )}
          {heatmap === "3d" && <ZoneExtrusionLayer />}
        </>
      )}
      {mode === "heatmap" && (
        <HeatmapLayer data={subjectFeatureCollection} mode={mode} />
      )}
      {mode === "approximation" && (
        <ApproximationLayer
          data={subjectFeatureCollection}
          popup={onFeatureClick !== undefined}
          onFeatureClick={onFeatureClick}
        />
      )}

      {iconFeatureCollection && (
        <EvacuationPointLayer data={iconFeatureCollection} />
      )}

      {pinMarkers}
      {children}
      <ScaleControl maxWidth={100} unit="metric" style={scaleControlStyle} />
    </ReactMapGL>
  );
}