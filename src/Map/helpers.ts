import { Zone } from 'proto-all-js/deployment/organization_pb';
import {
  BBox,
  Feature,
  FeatureCollection,
  FeatureType,
  GeoJSON,
  GeoJsonProperties,
  Geometry,
  GeometryCollection,
  MapFeature,
  Point,
  Position,
} from './types';

const setZoneFeatureProperties = (
  zoneID: number,
  zoneName: string,
  fc: Feature[]
): MapFeature[] =>
  fc.map((feat) => ({
    ...feat,
    properties: {
      ...feat.properties,
      type: FeatureType.ZONE,
      id: zoneID,
      zoneID,
      zoneName,
    },
  }));

const emptyFeatureCollection: Feature[] = [];

export const newFeatureCollectionFromZones = (
  zones: Zone.AsObject[]
): MapFeature[] =>
  zones
    .map((zone) => {
      const fc: MapFeature[] = zone.config?.geoJson
        ? JSON.parse(zone.config.geoJson)
        : emptyFeatureCollection;

      return setZoneFeatureProperties(zone.id, zone.config?.name ?? '', fc);
    })
    .flat(1);

export const centroid = <P>(
  geojson: GeoJSON,
  options: { properties?: P } = {}
): Feature<Point> => {
  let xSum = 0;
  let ySum = 0;
  let len = 0;

  coordEach(
    geojson,
    (coord) => {
      xSum += coord[0];
      ySum += coord[1];
      len++;

      return true;
    },
    true
  );

  return point([xSum / len, ySum / len], options.properties);
};

const coordEach = (
  geojson: GeoJSON,
  callback: (
    currentCoord: number[],
    coordIndex: number,
    featureIndex: number,
    multiFeatureIndex: number,
    geometryIndex: number
  ) => boolean,
  excludeWrapCoord?: boolean
): boolean => {
  if (geojson === null) {
    return false;
  }

  let j,
    k,
    l,
    geometry,
    stopG,
    coords,
    geometryMaybeCollection,
    wrapShrink = 0,
    coordIndex = 0,
    isGeometryCollection,
    type = geojson.type,
    isFeatureCollection = type === 'FeatureCollection',
    isFeature = type === 'Feature',
    stop = isFeatureCollection
      ? (geojson as FeatureCollection).features.length
      : 1;

  for (let featureIndex = 0; featureIndex < stop; featureIndex++) {
    geometryMaybeCollection = isFeatureCollection
      ? (geojson as FeatureCollection).features[featureIndex].geometry
      : isFeature
      ? (geojson as Feature).geometry
      : geojson;
    isGeometryCollection = geometryMaybeCollection
      ? geometryMaybeCollection.type === 'GeometryCollection'
      : false;
    stopG = isGeometryCollection
      ? (geojson as GeometryCollection).geometries.length
      : 1;

    for (let geomIndex = 0; geomIndex < stopG; geomIndex++) {
      let multiFeatureIndex = 0;
      let geometryIndex = 0;
      geometry = isGeometryCollection
        ? (geometryMaybeCollection as GeometryCollection).geometries[geomIndex]
        : geometryMaybeCollection;

      if (geometry === null) {
        continue;
      }
      coords = (geometry as any).coordinates;
      let geomType = geometry.type;

      wrapShrink =
        excludeWrapCoord &&
        (geomType === 'Polygon' || geomType === 'MultiPolygon')
          ? 1
          : 0;

      switch (geomType) {
        case null:
          break;
        case 'Point':
          callback(
            coords,
            coordIndex,
            featureIndex,
            multiFeatureIndex,
            geometryIndex
          );

          coordIndex++;
          multiFeatureIndex++;

          break;
        case 'LineString':
        case 'MultiPoint':
          for (j = 0; j < coords.length; j++) {
            if (
              callback(
                coords[j],
                coordIndex,
                featureIndex,
                multiFeatureIndex,
                geometryIndex
              ) === false
            ) {
              return false;
            }

            coordIndex++;
            if (geomType === 'MultiPoint') {
              multiFeatureIndex++;
            }
          }
          if (geomType === 'LineString') {
            multiFeatureIndex++;
          }
          break;
        case 'Polygon':
        case 'MultiLineString':
          for (j = 0; j < coords.length; j++) {
            for (k = 0; k < coords[j].length - wrapShrink; k++) {
              if (
                callback(
                  coords[j][k],
                  coordIndex,
                  featureIndex,
                  multiFeatureIndex,
                  geometryIndex
                ) === false
              ) {
                return false;
              }

              coordIndex++;
            }

            if (geomType === 'MultiLineString') {
              multiFeatureIndex++;
            }
            if (geomType === 'Polygon') {
              geometryIndex++;
            }
          }
          if (geomType === 'Polygon') {
            multiFeatureIndex++;
          }

          break;
        case 'MultiPolygon':
          for (j = 0; j < coords.length; j++) {
            geometryIndex = 0;
            for (k = 0; k < coords[j].length; k++) {
              for (l = 0; l < coords[j][k].length - wrapShrink; l++) {
                if (
                  callback(
                    coords[j][k][l],
                    coordIndex,
                    featureIndex,
                    multiFeatureIndex,
                    geometryIndex
                  ) === false
                ) {
                  return false;
                }

                coordIndex++;
              }
              geometryIndex++;
            }
            multiFeatureIndex++;
          }
          break;
        case 'GeometryCollection':
          for (
            j = 0;
            j < (geometry as GeometryCollection).geometries.length;
            j++
          )
            if (
              coordEach(
                (geometry as GeometryCollection).geometries[j],
                callback,
                excludeWrapCoord
              ) === false
            ) {
              return false;
            }
          break;
        default:
          throw new Error('Unknown Geometry Type');
      }
    }
  }

  return false;
};

const point = <P = GeoJsonProperties>(
  coordinates: Position,
  properties?: P,
  options: {
    bbox?: BBox;
    id?: string | number;
  } = {}
): Feature<Point, P> => {
  if (!coordinates) {
    throw new Error('coordinates is required');
  }
  if (!Array.isArray(coordinates)) {
    throw new Error('coordinates must be an Array');
  }
  if (coordinates.length < 2) {
    throw new Error('coordinates must be at least 2 numbers long');
  }
  if (isNaN(coordinates[0]) || isNaN(coordinates[1])) {
    throw new Error('coordinates must contain numbers');
  }
  let geom: Point = {
    type: 'Point',
    coordinates: coordinates,
  };
  return feature<Point, P>(geom, properties, options);
};

const feature = <
  G extends Geometry = Geometry,
  P extends GeoJsonProperties = GeoJsonProperties
>(
  geom: G,
  properties: P = {} as P,
  options: {
    bbox?: BBox;
    id?: string | number;
  } = {}
): Feature<G, P> => {
  const feature: Feature<G, P> = {
    type: 'Feature',
    bbox: options.bbox,
    geometry: geom,
    properties,
  };
  if (options.id === 0 || options.id) {
    feature.id = options.id;
  }

  return feature;
};
