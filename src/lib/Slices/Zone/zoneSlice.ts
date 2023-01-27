import { createSlice } from "@reduxjs/toolkit";
import { entityArrayToObject, EntityMap } from "../utils/arrObjConversion";
import { Zone } from "@spotsie/proto/deployment/v1/organization_pb";
import { getAllZones } from "./zoneReducers";
import { PlainMessage } from "@bufbuild/protobuf";

export interface ZoneState {
  zones: EntityMap<PlainMessage<Zone>>;

  loading: boolean;
  loaded: boolean;
}

const initialState: ZoneState = {
  zones: {},

  loading: true,
  loaded: false,
};

const zoneSlice = createSlice({
  name: "zone",
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(getAllZones.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllZones.fulfilled, (state, { payload }) => {
        state.zones = entityArrayToObject(payload);
        state.loading = false;
        state.loaded = true;
      })
      .addCase(getAllZones.rejected, (state) => {
        state.loading = false;
      }),
});

export const zoneReducer = zoneSlice.reducer;
