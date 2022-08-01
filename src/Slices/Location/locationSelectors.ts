import { createSelector } from '@reduxjs/toolkit';
import { EntityMap } from '../utils/arrObjConversion';
import { LocationHistoryRecord } from 'proto-all-js/location/location_pb';
import RootState from '../utils/RootState';
import { Interval } from '../utils/cache';

export const selectAllLocationRecords = (
  state: RootState
): EntityMap<LocationHistoryRecord.AsObject[]> =>
  state.location.locationRecords;

export const selectLocationRecords = createSelector(
  [
    selectAllLocationRecords,
    (_: any, subjectIds: number[], timeFrame?: Interval) => ({
      subjectIds,
      timeFrame,
    }),
  ],
  (
    records,
    { subjectIds, timeFrame }
  ): EntityMap<LocationHistoryRecord.AsObject[]> =>
    Object.entries(records).reduce(
      (obj, [subjectId, records]: [string, LocationHistoryRecord.AsObject[]]) =>
        subjectIds.includes(+subjectId)
          ? {
              ...obj,
              [+subjectId]: timeFrame
                ? records.filter(
                    (record) =>
                      record.fromTime &&
                      record.toTime &&
                      record.fromTime.seconds >=
                        timeFrame.start.getTime() / 1000 &&
                      record.toTime.seconds <= timeFrame.end.getTime() / 1000
                  )
                : records,
            }
          : obj,
      {}
    )
);

export const selectLocationRecordsLoading = (state: RootState): boolean =>
  state.location.loading;
export const selectLocationRecordsLoaded = (state: RootState): boolean =>
  state.location.loaded;
