import { createSlice } from "@reduxjs/toolkit";
import { EntityMap } from "../utils/arrObjConversion";
import { getLocationRecords } from "./locationReducers";
import { LocationHistoryRecord } from "proto/location/v1/location_pb";
import {
  mergeOverlappingDateRanges,
  sortLocationHistoryRecords,
} from "../utils/cache";
import { Interval } from "../utils/cache";
import { PlainMessage } from "@bufbuild/protobuf";

export interface LocationState {
  locationRecords: EntityMap<PlainMessage<LocationHistoryRecord>[]>;
  cache: EntityMap<Interval[]>;

  loading: boolean;
  loaded: boolean;
}

const initialState: LocationState = {
  locationRecords: {},
  cache: {},

  loading: false,
  loaded: false,
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(getLocationRecords.pending, (state) => {
        state.loading = true;
      })
      .addCase(getLocationRecords.fulfilled, (state, { payload }) => {
        payload.forEach(({ map, range }) => {
          Object.entries(map).forEach(([id, { records }]) => {
            const subjectId = +id;

            if (
              !state.locationRecords[subjectId] ||
              state.locationRecords[subjectId].length === 0
            ) {
              state.locationRecords[subjectId] = records;
            } else {
              const combined = [
                ...state.locationRecords[subjectId],
                ...records,
              ];

              const sorted = sortLocationHistoryRecords(combined);

              state.locationRecords[subjectId] = sorted;
            }

            if (!state.cache[subjectId]) {
              state.cache[subjectId] = [range];
            } else {
              const newCachedDates = mergeOverlappingDateRanges([
                ...state.cache[subjectId],
                range,
              ]);

              state.cache[subjectId] = newCachedDates;
            }
          });
        });

        state.loading = false;
        state.loaded = true;
      })
      .addCase(getLocationRecords.rejected, (state) => {
        state.loading = false;
      }),
});

export const locationReducer = locationSlice.reducer;
