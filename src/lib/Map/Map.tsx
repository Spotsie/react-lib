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
  mapRef?: React.RefObject<MapRef> | null;
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
  mapRef: customMapRef = null,
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
  const newMapRef = useRef<MapRef>(null);
  const mapRef = customMapRef ?? newMapRef;

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

  const [popup, setPopup] = useState<{
    coordinates: [number, number];
    content: ReactNode;
  } | null>(null);

  const onloadmap = () => {
    if (!mapRef.current) {
      return;
    }

    if (onClickRef.current) {
      mapRef.current.off(
        "click",
        ["approximation-layer", "zone-fill-layer"],
        onClickRef.current
      );
    }

    const onClickLayer = (
      e: MapMouseEvent & {
        features?: MapboxGeoJSONFeature[] | undefined;
      } & EventData
    ) => {
      const features = e.features?.[0];
      if (!features) {
        return;
      }

      let coordinates: [number, number] = [0, 0];
      let element: ReactNode = <></>;

      if (features.layer.id === "approximation-layer" && onFeatureClick) {
        coordinates = (features as any).geometry.coordinates.slice();

        element = onFeatureClick(features.properties ?? {});
      } else if (features.layer.id === "zone-fill-layer" && onZoneClick) {
        coordinates = centroid(features.geometry).geometry.coordinates as [
          number,
          number
        ];

        element = onZoneClick(features.properties ?? {});
      }

      if (
        popup &&
        coordinates[0] === popup.coordinates[0] &&
        coordinates[1] === popup.coordinates[1]
      ) {
        setPopup(null);
      } else {
        setPopup({ content: element, coordinates });
      }
    };
    onClickRef.current = onClickLayer;

    mapRef.current.on(
      "click",
      ["approximation-layer", "zone-fill-layer"],
      onClickRef.current
    );
    if (mapRef.current.getLayer("approximation-layer")) {
      mapRef.current.moveLayer("approximation-layer");
    }
    if (mapRef.current.getLayer("tracker-id-layer")) {
      mapRef.current.moveLayer("tracker-id-layer");
    }
  };

  const onClickRef = useRef<
    | ((
        e: MapMouseEvent & {
          features?: MapboxGeoJSONFeature[];
        } & EventData
      ) => void)
    | null
  >(null);
  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    if (onClickRef.current) {
      mapRef.current.off(
        "click",
        ["approximation-layer", "zone-fill-layer"],
        onClickRef.current
      );
    }

    const onClickLayer = (
      e: MapMouseEvent & {
        features?: MapboxGeoJSONFeature[] | undefined;
      } & EventData
    ) => {
      const features = e.features?.[0];
      if (!features) {
        return;
      }

      let coordinates: [number, number] = [0, 0];
      let element: ReactNode = <></>;

      if (features.layer.id === "approximation-layer" && onFeatureClick) {
        coordinates = (features as any).geometry.coordinates.slice();

        element = onFeatureClick(features.properties ?? {});
      } else if (features.layer.id === "zone-fill-layer" && onZoneClick) {
        coordinates = centroid(features.geometry).geometry.coordinates as [
          number,
          number
        ];

        element = onZoneClick(features.properties ?? {});
      }

      if (
        popup &&
        coordinates[0] === popup.coordinates[0] &&
        coordinates[1] === popup.coordinates[1]
      ) {
        setPopup(null);
      } else {
        setPopup({ content: element, coordinates });
      }
    };
    onClickRef.current = onClickLayer;

    mapRef.current.on(
      "click",
      ["approximation-layer", "zone-fill-layer"],
      onClickRef.current
    );
  }, [onZoneClick, popup]);

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
      {mode === "approximation" && (
        <ApproximationLayer data={subjectFeatureCollection} />
      )}
      <ZoneLayer
        data={zoneFeatureCollection}
        colors={colors}
        approximationMode={mode === "approximation"}
      />

      {popup && (
        <Popup
          closeOnClick={false}
          longitude={popup.coordinates[0]}
          latitude={popup.coordinates[1]}
          offset={[0, -20] as [number, number]}
          onClose={() => setPopup(null)}
        >
          {popup.content}
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

      {iconFeatureCollection && (
        <EvacuationPointLayer data={iconFeatureCollection} />
      )}

      {pinMarkers}
      {children}
      <ScaleControl maxWidth={100} unit="metric" style={scaleControlStyle} />
    </ReactMapGL>
  );
}
