import { createSelector } from '@reduxjs/toolkit';
import { EntityMap } from '../utils/arrObjConversion';
import { LocationHistoryRecord } from 'proto-all-js/location/location_pb';
import { State as LocationState } from './locationSlice';

export const selectAllLocationRecords = <
  State extends { location: LocationState }
>(
  state: State
): EntityMap<LocationHistoryRecord.AsObject[]> =>
  state.location.locationRecords;

export const selectLocationRecords = createSelector(
  [selectAllLocationRecords, (_: any, subjectIds: number[]) => subjectIds],
  (records, subjectIds): EntityMap<LocationHistoryRecord.AsObject[]> =>
    Object.entries(records).reduce(
      (obj, [subjectId, records]) =>
        subjectIds.includes(+subjectId)
          ? { ...obj, [+subjectId]: records }
          : obj,
      {}
    )
);
export const selectLocationRecordsLoading = <
  State extends { location: LocationState }
>(
  state: State
): boolean => state.location.loading;
export const selectLocationRecordsLoaded = <
  State extends { location: LocationState }
>(
  state: State
): boolean => state.location.loaded;
