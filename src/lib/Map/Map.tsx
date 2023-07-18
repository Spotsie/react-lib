import React, { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import Pin, { Props as PinProps } from "./Pin";
import { FeatureCollection, Point } from "./types";

import ReactMapGL, {
  MapProps as MapboxProps,
  MapRef,
  ScaleControl,
  Popup,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import ApproximationIcon from "./ApproximationIcon.svg";
import { MapMouseEvent, EventData, MapboxGeoJSONFeature } from "mapbox-gl";
import ApproximationLayer from "./Layers/ApproximationLayer";
import EvacuationPointLayer from "./Layers/EvacuationPointLayer";
import ZoneExtrusionLayer from "./Layers/ZoneExtrusionLayer";
import ZoneLayer from "./Layers/ZoneLayer";
import RasterLayer from "./Layers/RasterLayer";
import HeatmapLayer from "./Layers/HeatmapLayer";
import { centroid } from "./helpers";

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
  onZoneClick?(properties: { [key: string]: any }): ReactNode;
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
  colors?: Array<string>;
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
  onZoneClick,
  cursor = "crosshair",
  mode = "normal",
  colors = ["#366fe0"],
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
  const mapRef = useRef<MapRef>(null);

  const onStyleData = () => {
    const circleImage = new Image(167, 167);

    circleImage.onload = () => {
      if (!mapRef.current) {
        return;
      }

      if (!mapRef.current.hasImage("circle")) {
        mapRef.current.addImage("circle", circleImage);
      }
    };
    circleImage.src = ApproximationIcon;
  };

  const [subjectPopup, setSubjectPopup] = useState<{
    coordinates: [number, number];
    content: ReactNode;
  } | null>(null);

  const onloadmap = () => {
    if (!mapRef.current) {
      return;
    }

    const onClickApproximationLayer = (
      e: MapMouseEvent & {
        features?: MapboxGeoJSONFeature[] | undefined;
      } & EventData
    ) => {
      e.originalEvent.stopPropagation();

      if (onFeatureClick && e.features?.[0].properties) {
        const coordinates = (
          e as any
        ).features![0].geometry.coordinates.slice();

        const element = onFeatureClick(e.features[0].properties);
        setSubjectPopup({ content: element, coordinates });
      }
    };

    mapRef.current.on(
      "click",
      "approximation-layer",
      onClickApproximationLayer
    );

    const onClickZoneLayer = (
      e: MapMouseEvent & {
        features?: MapboxGeoJSONFeature[] | undefined;
      } & EventData
    ) => {
      if (onZoneClick && e.features?.[0].properties) {
        const coordinates = centroid(e.features[0].geometry).geometry
          .coordinates as [number, number];

        const element = onZoneClick(e.features[0].properties);
        setSubjectPopup({ content: element, coordinates });
      }
    };
    mapRef.current.on("click", "zone-fill-layer", onClickZoneLayer);
  };

  const onClickZoneLayerRef = useRef<
    | ((
        e: MapMouseEvent & {
          features?: MapboxGeoJSONFeature[] | undefined;
        } & EventData
      ) => void)
    | null
  >(null);
  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    if (onClickZoneLayerRef.current) {
      mapRef.current.off(
        "click",
        "zone-fill-layer",
        onClickZoneLayerRef.current
      );
    }

    const onClickZoneLayer = (
      e: MapMouseEvent & {
        features?: MapboxGeoJSONFeature[] | undefined;
      } & EventData
    ) => {
      if (onZoneClick && e.features?.[0].properties) {
        const coordinates = centroid(e.features[0].geometry).geometry
          .coordinates as [number, number];

        const element = onZoneClick(e.features[0].properties);
        setSubjectPopup({ content: element, coordinates });
      }
    };
    onClickZoneLayerRef.current = onClickZoneLayer;

    mapRef.current.on("click", "zone-fill-layer", onClickZoneLayerRef.current);
  }, [onZoneClick]);

  return (
    <ReactMapGL
      mapStyle={mapThemes[mapTheme]}
      style={{
        width: "100%",
        height: "100%",
      }}
      cursor={cursor}
      preserveDrawingBuffer={true}
      ref={mapRef}
      onStyleData={onStyleData}
      onLoad={onloadmap}
      {...props}
    >
      {overlay && (
        <RasterLayer
          data={overlay.coordinates}
          src={overlay.src}
          opacity={overlay.opacity}
        />
      )}
      <ZoneLayer data={zoneFeatureCollection} colors={colors} />

      {subjectPopup && (
        <Popup
          closeOnClick={false}
          longitude={subjectPopup.coordinates[0]}
          latitude={subjectPopup.coordinates[1]}
          offset={[0, -20] as [number, number]}
          onClose={() => setSubjectPopup(null)}
        >
          {subjectPopup.content}
        </Popup>
      )}

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
        <ApproximationLayer data={subjectFeatureCollection} />
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
