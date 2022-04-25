import { Zone } from 'proto-all-js/deployment/organization_pb';
import { EntityMap, entityObjectToArray } from '../utils/arrObjConversion';
import RootState from '../utils/RootState';

export const selectAllZones = (state: RootState): EntityMap<Zone.AsObject> =>
  state.zone.zones;
export const selectAllZonesArray = (state: RootState) =>
  entityObjectToArray(state.zone.zones);

export const selectZonesLoading = (state: RootState): boolean =>
  state.zone.loading;
export const selectZonesLoaded = (state: RootState): boolean =>
  state.zone.loaded;
