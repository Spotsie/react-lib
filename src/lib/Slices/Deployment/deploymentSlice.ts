
import { createSlice, Reducer } from "@reduxjs/toolkit";
import { entityArrayToObject, EntityMap } from "../utils/arrObjConversion";
import { Deployment } from "@spotsie/proto/deployment/v1/organization_pb";
import { getAllDeployments } from "./deploymentReducers";
import { PlainMessage } from "@bufbuild/protobuf";

export interface DeploymentState {
  deployment:EntityMap<PlainMessage<Deployment>>;

  loading: boolean;
  loaded: boolean;
}

const initialState: DeploymentState = {
  deployment: {},

  loading: true,
  loaded: false,
};

const deploymentSlice = createSlice({
  name: "deployment",
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(getAllDeployments.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllDeployments.fulfilled, (state, { payload }) => {
        state.deployment = entityArrayToObject(payload);
        state.loading = false;
        state.loaded = true;
      })
      .addCase(getAllDeployments.rejected, (state) => {
        state.loading = false;
      }),
});

export const deploymentReducer = deploymentSlice.reducer as Reducer<typeof initialState>;
