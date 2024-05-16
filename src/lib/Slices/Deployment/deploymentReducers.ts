
import { PlainMessage } from "@bufbuild/protobuf";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { Deployment } from "@spotsie/proto/deployment/v1/organization_pb";
import { ThunkAPI } from "../utils/store";

export const getAllDeployments= createAsyncThunk<
  PlainMessage<Deployment>[],
  void,
  ThunkAPI
>("deployment/getAll", async (_, thunkApi) => {
  try {
    const response = await thunkApi.extra.DeploymentClient.getDeployments({
      organizationId: thunkApi.extra.organizationId,
    });

    return response.deployments;
  } catch (err) {
    return thunkApi.rejectWithValue((err as any).msg);
  }
});
