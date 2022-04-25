import { createAsyncThunk } from '@reduxjs/toolkit';
import { Zone } from 'proto-all-js/deployment/organization_pb';
import { GetZonesRequest } from 'proto-all-js/deployment/service_pb';
import { DeploymentApi } from 'proto-all-js/deployment/service_pb_service';
import { grpcUnaryRequest } from '../utils/grpc';

interface GetAllZonesRequest {
  organizationId: number;
}

export const getAllZones = createAsyncThunk<
  Zone.AsObject[],
  GetAllZonesRequest,
  { rejectValue: string }
>('zone/getAll', async ({ organizationId }, thunkAPI) => {
  try {
    const req = new GetZonesRequest();

    req.setOrganizationId(organizationId);

    const response = await grpcUnaryRequest(DeploymentApi.GetZones, req);

    return response.toObject().zonesList;
  } catch (err) {
    return thunkAPI.rejectWithValue((err as any).msg);
  }
});
