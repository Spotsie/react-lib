import * as pb from 'proto-all-js/deployment/organization_pb';
import { MapFeature, setZoneFeatureProperties } from './metadata';
import { Feature } from '@nebula.gl/edit-modes';

const emptyFeatureCollection: Feature[] = [];

export function newFeatureCollectionFromZones(
  zones: pb.Zone.AsObject[]
): MapFeature[] {
  return zones
    .map((zone) => {
      const fc: MapFeature[] =
        (zone.config?.geoJson && JSON.parse(zone.config.geoJson)) ||
        emptyFeatureCollection;

      return setZoneFeatureProperties(zone.id, fc);
    })
    .flat(1);
}
