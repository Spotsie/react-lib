type Geometry = {
  type:
    | 'Point'
    | 'LineString'
    | 'Polygon'
    | 'MultiPoint'
    | 'MultiLineString'
    | 'MultiPolygon';
  coordinates: number[];
};

export type Feature = {
  type: 'Feature';
  geometry: Geometry;
  properties?: {
    [key: string]: any;
  };
  id?: string | number;
  bbox?: [number, number, number, number];
};

enum FeatureType {
  unknown = 'unknown',
  zone = 'zone',
  gateway = 'gateway',
}
type ZoneFeatureProperties = {
  id: number;
  type: FeatureType.zone;
  zoneID: number;
};

type GatewayFeatureProperties = {
  id: number;
  type: FeatureType.gateway;
  zoneID: number;
};
export type ZoneFeature = {
  type: 'Feature';
  geometry: Geometry;
  properties: ZoneFeatureProperties;
};

export type GatewayFeature = {
  type: 'Feature';
  geometry: Geometry;
  properties: GatewayFeatureProperties;
};

export type MapFeature = ZoneFeature | GatewayFeature;

export const isPropertyID = (id: number) => (feature: Feature) =>
  feature.properties?.id === id;
export function isZoneID(zoneID: number) {
  return function (feature: MapFeature): feature is ZoneFeature {
    return isPropertyID(zoneID) && isZoneFeatureType(feature);
  };
}

export function belongsToZone(zoneID: number) {
  return function (feature: MapFeature): feature is ZoneFeature {
    return feature.properties.zoneID === zoneID;
  };
}
export function isGatewayFeatureType(
  feature: Feature
): feature is GatewayFeature {
  return feature.properties?.type === FeatureType.gateway;
}
export function isZoneFeatureType(feature: Feature): feature is ZoneFeature {
  return feature.properties?.type === FeatureType.zone;
}

export function setGatewayFeatureProperties(
  gatewayID: number,
  zoneID: number,
  fc: Feature[]
): GatewayFeature[] {
  return fc.map((feat) => {
    return {
      ...feat,
      properties: {
        ...feat.properties,
        type: FeatureType.gateway,
        id: gatewayID,
        zoneID,
      },
    };
  });
}

export function setZoneFeatureProperties(
  zoneID: number,
  fc: Feature[]
): ZoneFeature[] {
  return fc.map((feat) => {
    return {
      ...feat,
      properties: {
        ...feat.properties,
        type: FeatureType.zone,
        id: zoneID,
        zoneID: zoneID,
      },
    };
  });
}

export function stripProperties(f: Feature) {
  return {
    ...f,
    properties: {},
  };
}
