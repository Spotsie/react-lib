import { PlainMessage } from "@bufbuild/protobuf";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { Zone } from "@spotsie/proto/deployment/v1/organization_pb";
import { ThunkAPI } from "../utils/store";

export const getAllZones = createAsyncThunk<
  PlainMessage<Zone>[],
  void,
  ThunkAPI
>("zone/getAll", async (_, thunkApi) => {
  try {
    const response = await thunkApi.extra.DeploymentClient.getZones({
      organizationId: thunkApi.extra.constants.organizationId,
    });

    return response.zones;
  } catch (err) {
    return thunkApi.rejectWithValue((err as any).msg);
  }
});
