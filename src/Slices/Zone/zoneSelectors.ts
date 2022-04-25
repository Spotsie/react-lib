import { createSelector } from '@reduxjs/toolkit';
import { Zone } from 'proto-all-js/deployment/organization_pb';
import { EntityMap, entityObjectToArray } from '../utils/arrObjConversion';
import RootState from '../utils/RootState';

export const selectAllZones = (state: RootState): EntityMap<Zone.AsObject> =>
  state.zone.zones;
export const selectAllZonesArray = createSelector(
  selectAllZones,
  (zones): Zone.AsObject[] => entityObjectToArray(zones)
);

export const selectZonesLoading = (state: RootState): boolean =>
  state.zone.loading;
export const selectZonesLoaded = (state: RootState): boolean =>
  state.zone.loaded;
