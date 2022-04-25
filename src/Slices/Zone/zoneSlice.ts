import { createSlice } from '@reduxjs/toolkit';
import { entityArrayToObject, EntityMap } from '../utils/arrObjConversion';
import { Zone } from 'proto-all-js/deployment/organization_pb';
import { getAllZones } from './zoneReducers';

export interface State {
  zones: EntityMap<Zone.AsObject>;

  loading: boolean;
  loaded: boolean;
}

const initialState: State = {
  zones: {},

  loading: true,
  loaded: false,
};

const zoneSlice = createSlice({
  name: 'zone',
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

export default zoneSlice.reducer;
