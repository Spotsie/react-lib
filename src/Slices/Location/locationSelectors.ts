import { createSelector } from '@reduxjs/toolkit';
import { EntityMap } from '../utils/arrObjConversion';
import { LocationHistoryRecord } from 'proto-all-js/location/location_pb';
import RootState from '../utils/RootState';

export const selectAllLocationRecords = (
  state: RootState
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
export const selectLocationRecordsLoading = (state: RootState): boolean =>
  state.location.loading;
export const selectLocationRecordsLoaded = (state: RootState): boolean =>
  state.location.loaded;
