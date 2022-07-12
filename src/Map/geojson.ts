import * as pb from 'proto-all-js/deployment/organization_pb';
import { Feature, MapFeature, setZoneFeatureProperties } from './metadata';

const emptyFeatureCollection: Feature[] = [];

export function newFeatureCollectionFromZones(
  zones: pb.Zone.AsObject[]
): MapFeature[] {
  return zones.map !== undefined
    ? zones
        .map((zone) => {
          const fc: MapFeature[] =
            (zone.config?.geoJson && JSON.parse(zone.config.geoJson)) ||
            emptyFeatureCollection;

          return setZoneFeatureProperties(zone.id, fc);
        })
        .flat(1)
    : [];
}
