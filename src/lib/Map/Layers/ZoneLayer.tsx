import React, { useEffect, useRef } from "react";
import { Layer, LayerProps, Source, SourceProps, useMap } from "react-map-gl";
import { FeatureCollection, GeoJsonProperties, Geometry } from "../types";

const getSourceProps = (
  data: FeatureCollection<Geometry, GeoJsonProperties>
): SourceProps => ({
  id: "zone-source",
  type: "geojson",
  generateId: true,
  data: {
    type: "FeatureCollection",
    features: data.features.map((f, index) => ({
      ...f,
      properties: {
        ...f.properties,
        index,
        geometry: (f as any).geometry,
      },
    })),
  },
});

const getZoneFillLayerProps = (colors: Array<string>): LayerProps => ({
  id: "zone-fill-layer",
  beforeId: "zone-population-layer",
  type: "fill",
  paint: {
    "fill-color": {
      property: "index",
      stops: colors.map((color, index) => [index, color]),
    } as any,
    "fill-opacity": [
      "case",
      ["boolean", ["feature-state", "hover"], false],
      0.8,
      ["boolean", ["get", "highlighted"], false],
      0.7,
      0.2,
    ],
  },
});

const zonePopulationLayerProps: LayerProps = {
  id: "zone-population-layer",
  type: "symbol",
  layout: {
    "icon-image": "marker-11",
    "text-field": [
      "format",
      ["get", "zoneName"],
      "\n",
      " (",
      ["get", "population"],
      ")",
    ],
    "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
    "text-size": 13,
    "text-transform": "uppercase",
    "text-letter-spacing": 0.05,
    "text-offset": [0, 2.4],
  },
  paint: {
    "text-color": "#202",
    "text-halo-color": "#fff",
    "text-halo-width": 1,
  },
  filter: ["!=", "population", 0],
};

type Props = {
  data: FeatureCollection;
  colors: Array<string>;
  approximationMode: boolean;
};

const ZoneLayer = ({ data, colors, approximationMode }: Props) => {
  const map = useMap();
  const hoveredPolygonId = useRef<string | number | undefined | null>(null);
  useEffect(() => {
    map.current?.on("mousemove", "zone-fill-layer", (e) => {
      if (!map.current) {
        return;
      }

      if (e.features && e.features.length > 0) {
        if (hoveredPolygonId.current !== null) {
          map.current.setFeatureState(
            { source: "zone-source", id: hoveredPolygonId.current },
            { hover: false }
          );
        }
        hoveredPolygonId.current = e.features[0].id;

        map.current.setFeatureState(
          { source: "zone-source", id: hoveredPolygonId.current },
          { hover: true }
        );
      }
    });
    map.current?.on("mouseleave", "zone-fill-layer", () => {
      if (!map.current) {
        return;
      }

      if (hoveredPolygonId.current !== null) {
        map.current.setFeatureState(
          { source: "zone-source", id: hoveredPolygonId.current },
          { hover: false }
        );
      }
      hoveredPolygonId.current = null;
    });
  }, []);

  return (
    <Source {...getSourceProps(data)}>
      <Layer {...zonePopulationLayerProps} />
      {approximationMode ? (
        <Layer {...getZoneFillLayerProps(colors)} beforeId="tracker-id-layer" />
      ) : (
        <Layer {...getZoneFillLayerProps(colors)} />
      )}
    </Source>
  );
};

export default ZoneLayer;
