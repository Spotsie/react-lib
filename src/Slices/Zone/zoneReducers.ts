import { createAsyncThunk } from '@reduxjs/toolkit';
import { Zone } from 'proto-all-js/deployment/organization_pb';
import { GetZonesRequest } from 'proto-all-js/deployment/service_pb';
import { DeploymentApi } from 'proto-all-js/deployment/service_pb_service';
import { API_ORGANIZATION_ID, grpcUnaryRequest } from '../utils/grpc';

export const getAllZones = createAsyncThunk<
  Zone.AsObject[],
  void,
  { rejectValue: string }
>('zone/getAll', async (_, thunkAPI) => {
  try {
    const req = new GetZonesRequest();

    req.setOrganizationId(API_ORGANIZATION_ID);

    const response = await grpcUnaryRequest(DeploymentApi.GetZones, req);

    return response.toObject().zonesList;
  } catch (err) {
    return thunkAPI.rejectWithValue((err as any).msg);
  }
});
