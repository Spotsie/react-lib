import { PlainMessage } from "@bufbuild/protobuf";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { Zone } from "proto/deployment/v1/organization_pb";
import { API_ORGANIZATION_ID } from "../../utils/constants";
import { DeploymentClient, headers } from "../utils/grpc";

export const getAllZones = createAsyncThunk<
  PlainMessage<Zone>[],
  void,
  { rejectValue: string }
>("zone/getAll", async (_, thunkAPI) => {
  try {
    // @ts-ignore
    const response = await DeploymentClient.getZones(
      {
        organizationId: API_ORGANIZATION_ID,
      },
      {
        headers,
      }
    );

    return response.zones;
  } catch (err) {
    return thunkAPI.rejectWithValue((err as any).msg);
  }
});
